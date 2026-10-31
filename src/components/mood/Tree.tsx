import React from "react";
import { MoodForm } from "../../lib/mood";

// ============================================================
// CÂY CẢM XÚC (SVG vẽ bằng code, đổi theo trạng thái)
// - stage 0..4: Hạt mầm → Nảy mầm → Cây non → Cây phát triển → Khu vườn cá nhân
// - form: dáng theo cảm xúc vừa check-in ("sang" | "diu" | "nang-ne") → bầu trời, lá vươn hay rũ
// - wilt 0..3: độ héo → lá vàng dần, cành rũ, mức 2–3 rụng bớt lá (cây không bao giờ chết)
// - decor: vật trang trí tự xuất hiện khi đạt mốc
// Tán cây gồm các khóm lá viền tự nhiên + nhiều chiếc lá nhọn (không dùng hình tròn).
// Hiệu ứng tự tắt khi máy bật "giảm chuyển động" (xem index.css).
// ============================================================

interface Props {
  stage: number;
  form: MoodForm;
  wilt: number;
  decor: string[];
  /** Đổi giá trị này để cây "nảy" nhẹ khi vừa thay đổi */
  pulse?: number;
}

const BASE_X = 160;
const BASE_Y = 228;
const TAU = Math.PI * 2;

// Khóm lá của tán (tọa độ khi cây lớn nhất): [dx, dy, bán kính]
const CLUMPS: [number, number, number][] = [
  [0, 2, 46], [-40, 12, 36], [42, 10, 36], [-22, -30, 36], [24, -32, 36], [0, -52, 28], [-64, 26, 25], [66, 24, 25],
];
const COUNT_BY_STAGE = [0, 0, 4, 6, 8];
const SCALE_BY_STAGE = [0.3, 0.42, 0.62, 0.82, 1];

// Màu lá: [sáng, giữa, tối]
const GREEN = [
  ["#8cc26c", "#4f8a43", "#2c5c2f"],
  ["#9fcd78", "#5d9a4b", "#346b37"],
];
const YELLOW = [
  ["#ecd27a", "#c9a23f", "#8f6a26"],
  ["#e2c56a", "#b8903a", "#7f5e24"],
];
const LEAF_LIGHT = ["#a9d483", "#86bd63", "#6ea957"];
const LEAF_DRY = ["#e3c065", "#cf9f45", "#b07d34"];

const SKY: Record<MoodForm, [string, string]> = {
  sang: ["#fff6d5", "#ffe7a3"],
  diu: ["#f8f2df", "#efe6c8"],
  "nang-ne": ["#e7e6de", "#d3d5cf"],
};

// Hình chiếc lá nhọn (hướng theo trục x, dài 1 đơn vị) và gân lá
const LEAF = "M0,0 C0.25,-0.32 0.7,-0.3 1,0 C0.7,0.3 0.25,0.32 0,0 Z";
const RIB = "M0.05,0 L0.82,0";

// Số giả ngẫu nhiên cố định (cây giống nhau mỗi lần vẽ)
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Viền khóm lá: nhiều mấu lượn nhỏ, không đều như hình tròn */
function clumpPath(cx: number, cy: number, r: number, seed: number) {
  const n = 11;
  const pts = Array.from({ length: n }, (_, k) => {
    const a = (k / n) * TAU + seed;
    const rr = r * (0.82 + 0.2 * rnd(seed * 10 + k));
    return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.86];
  });
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let k = 0; k < n; k++) {
    const p = pts[k];
    const q = pts[(k + 1) % n];
    const mx = (p[0] + q[0]) / 2;
    const my = (p[1] + q[1]) / 2;
    const dx = mx - cx;
    const dy = my - cy;
    const len = Math.hypot(dx, dy) || 1;
    const bump = r * (0.16 + 0.1 * rnd(seed * 7 + k));
    d += ` Q${(mx + (dx / len) * bump).toFixed(1)},${(my + (dy / len) * bump).toFixed(1)} ${q[0].toFixed(1)},${q[1].toFixed(1)}`;
  }
  return d + " Z";
}

const Leaf: React.FC<{ x: number; y: number; deg: number; len: number; fill: string; rib?: string; className?: string; style?: React.CSSProperties }> = ({ x, y, deg, len, fill, rib, className, style }) => (
  <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${deg.toFixed(0)}) scale(${len.toFixed(2)})`} className={className} style={style}>
    <path d={LEAF} fill={fill} />
    {rib && <path d={RIB} stroke={rib} strokeWidth={0.05} fill="none" strokeLinecap="round" />}
  </g>
);

export const Tree: React.FC<Props> = ({ stage, form, wilt, decor, pulse = 0 }) => {
  const s = SCALE_BY_STAGE[stage] ?? 1;
  const H = 104 * s; // chiều cao thân
  const topY = BASE_Y - H;
  const cy = topY - 18 * s; // tâm tán
  const heavy = form === "nang-ne";
  const droop = wilt * 3 + (heavy ? 3 : 0); // tán và cành rũ xuống
  const lift = form === "sang" ? -3 : 0;
  const has = (d: string) => decor.includes(d);
  const n = COUNT_BY_STAGE[stage] ?? 0;

  // Khóm lá: héo thì chuyển vàng dần; mức 2–3 rụng bớt khóm ngoài (lõi tán luôn còn)
  const hidden = (i: number) => (wilt >= 2 && i === 7) || (wilt >= 3 && (i === 6 || i === 5 || i === 3));
  const clumps = CLUMPS.slice(0, n)
    .map(([dx, dy, r], i) => ({ i, x: BASE_X + dx * s, y: cy + dy * s + droop + lift, r: r * s }))
    .filter(({ i }) => !hidden(i));
  const isDry = (i: number) => (wilt >= 3 ? i !== 0 || rnd(i) > 0.5 : ((i * 5) % 4) < wilt && i !== 0);
  // Tỉ lệ lá còn trên tán: héo nặng thì thưa hơn
  const leafKeep = [1, 0.9, 0.68, 0.42][wilt] ?? 1;
  const fallen = stage >= 2 ? wilt * 4 : 0;
  // Góc lá: vươn lên khi trời nắng, rũ xuống khi buồn hoặc héo
  const tilt = form === "sang" ? -14 : heavy || wilt >= 2 ? 26 : 0;

  const label = `Cây cảm xúc, giai đoạn ${stage + 1} trên 5, ${
    form === "sang" ? "lá đang vươn lên đón nắng" : heavy ? "lá đang rũ xuống" : "đang bình yên"
  }${wilt > 0 ? `, mức héo ${wilt} trên 3` : ""}`;

  return (
    <svg viewBox="0 0 320 280" className="w-full h-auto" role="img" aria-label={label}>
      <defs>
        <linearGradient id="tr-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={SKY[form][0]} />
          <stop offset="100%" stopColor={SKY[form][1]} />
        </linearGradient>
        <linearGradient id="tr-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={heavy ? "#a4b38c" : "#a9c38a"} />
          <stop offset="100%" stopColor={heavy ? "#7f906a" : "#7f9c62"} />
        </linearGradient>
        <linearGradient id="tr-trunk" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5a3b22" />
          <stop offset="45%" stopColor="#8a5e3a" />
          <stop offset="100%" stopColor="#4d321d" />
        </linearGradient>
        {[...GREEN, ...YELLOW].map((c, k) => (
          <radialGradient key={k} id={`tr-clump-${k}`} cx="38%" cy="30%" r="78%">
            <stop offset="0%" stopColor={c[0]} />
            <stop offset="55%" stopColor={c[1]} />
            <stop offset="100%" stopColor={c[2]} />
          </radialGradient>
        ))}
        <radialGradient id="tr-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff3b0" />
          <stop offset="60%" stopColor="#ffd66b" />
          <stop offset="100%" stopColor="#ffd66b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tr-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff8d6" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#fff8d6" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Bầu trời theo cảm xúc vừa chọn */}
      <rect width="320" height="280" rx="20" fill="url(#tr-sky)" />
      {form === "sang" && (
        <g className="sun-glow">
          <circle cx="262" cy="52" r="34" fill="url(#tr-sun)" />
          <circle cx="262" cy="52" r="15" fill="#ffd66b" />
        </g>
      )}
      {form === "diu" && (
        <g fill="#ffffff" opacity="0.9" className="cloud-drift">
          <path d="M44 58 q4 -14 20 -12 q8 -12 24 -6 q16 -2 18 14 q8 6 -2 10 H48 q-10 -2 -4 -6 Z" />
          <path d="M214 70 q4 -10 16 -9 q8 -9 20 -3 q12 0 12 10 q6 5 -2 8 H218 q-8 -1 -4 -6 Z" />
          <circle cx="262" cy="46" r="11" fill="#ffe08a" opacity="0.7" />
        </g>
      )}
      {heavy && (
        <g>
          <g fill="#aeb4b8" className="cloud-drift">
            <path d="M40 56 q4 -16 24 -14 q10 -14 30 -6 q20 -2 22 16 q10 8 -2 12 H46 q-12 -2 -6 -8 Z" />
            <path d="M200 64 q4 -14 22 -12 q9 -12 26 -5 q18 -1 18 14 q8 7 -2 10 H206 q-10 -2 -6 -7 Z" />
          </g>
          <g stroke="#9aa6ad" strokeWidth="1.4" strokeLinecap="round" opacity="0.7">
            {[60, 84, 108, 214, 238, 262].map((x, i) => (
              <line key={x} className="rain-drop" style={{ animationDelay: `${i * 0.25}s` }} x1={x} y1={74 + (i % 2) * 6} x2={x - 3} y2={84 + (i % 2) * 6} />
            ))}
          </g>
        </g>
      )}

      {/* Cầu vồng (mốc: cây hồi lại hoàn toàn) */}
      {has("cauvong") && !heavy && (
        <g className="rainbow-glow" fill="none" strokeWidth="4.5" opacity="0.45">
          {["#f2a5a0", "#f5d48a", "#b9dba0", "#9cc4e8", "#c3b2e6"].map((c, i) => (
            <path key={c} d={`M ${26 + i * 5},215 A ${134 - i * 5},${120 - i * 5} 0 0 1 ${294 - i * 5},215`} stroke={c} />
          ))}
        </g>
      )}

      {/* Đồi xa và mặt đất */}
      <path d="M0 196 Q 70 166 150 188 T 320 180 L 320 280 L 0 280 Z" fill="#e3edcf" opacity="0.9" />
      <path d="M0 214 Q 90 192 170 206 T 320 202 L 320 280 L 0 280 Z" fill="#cfe0b4" />
      <path d="M0 236 Q 160 214 320 236 L 320 280 L 0 280 Z" fill="url(#tr-ground)" />
      {/* Cỏ */}
      <g stroke={heavy ? "#7f906a" : "#6f9a52"} strokeWidth="1.3" strokeLinecap="round" opacity="0.8">
        {Array.from({ length: 16 }).map((_, i) => {
          const x = 12 + i * 19 + rnd(i) * 8;
          const y = 246 + rnd(i + 40) * 22;
          return <path key={i} d={`M${x} ${y} q1 -5 -1 -9 M${x + 3} ${y} q1 -4 3 -7`} fill="none" />;
        })}
      </g>
      {/* Bóng đổ dưới tán */}
      {stage >= 2 && <ellipse cx={BASE_X + 6} cy={BASE_Y + 6} rx={66 * s} ry={8 * s + 2} fill="#3f5b33" opacity="0.2" />}

      {/* Lá đã rụng trên mặt đất (hình chiếc lá) */}
      {Array.from({ length: fallen }).map((_, i) => (
        <Leaf
          key={i}
          x={BASE_X - 74 + rnd(i + 3) * 150}
          y={BASE_Y + 2 + rnd(i + 17) * 14}
          deg={rnd(i + 9) * 360}
          len={9 + rnd(i) * 4}
          fill={LEAF_DRY[i % 3]}
          rib="#8a6a2a"
        />
      ))}

      {/* Bụi cây quanh gốc (giai đoạn Khu vườn) */}
      {stage >= 4 &&
        [
          [44, 236, 26],
          [278, 238, 28],
        ].map(([x, y, r], k) => (
          <g key={k}>
            <path d={clumpPath(x, y, r, 3 + k)} fill={`url(#tr-clump-${wilt >= 2 + k ? 2 + k : k})`} />
            {Array.from({ length: 7 }).map((_, j) => {
              const a = Math.PI + (j / 6) * Math.PI;
              return <Leaf key={j} x={x + Math.cos(a) * r * 0.85} y={y + Math.sin(a) * r * 0.7} deg={(a * 180) / Math.PI} len={9} fill={wilt >= 2 + k ? LEAF_DRY[j % 3] : LEAF_LIGHT[j % 3]} />;
            })}
          </g>
        ))}

      <g key={pulse} className={pulse ? "grow-pop" : undefined} style={{ transformOrigin: `${BASE_X}px ${BASE_Y}px` }}>
        <g className="tree-sway" style={{ transformOrigin: `${BASE_X}px ${BASE_Y}px` }}>
          {stage === 0 && (
            <g transform={`translate(${BASE_X} ${BASE_Y}) scale(1.5) translate(${-BASE_X} ${-BASE_Y})`}>
              <ellipse cx={BASE_X} cy={BASE_Y - 2} rx="22" ry="7" fill="#7a5a3c" opacity="0.55" />
              <ellipse cx={BASE_X} cy={BASE_Y - 6} rx="8" ry="6" fill="#9b6f45" />
              <path d={`M${BASE_X - 2} ${BASE_Y - 11} q 3 -7 8 -8`} stroke="#6aa957" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            </g>
          )}

          {stage === 1 && (
            <g transform={`translate(${BASE_X} ${BASE_Y}) scale(1.8) translate(${-BASE_X} ${-BASE_Y})`}>
              <ellipse cx={BASE_X} cy={BASE_Y - 1} rx="20" ry="6" fill="#7a5a3c" opacity="0.5" />
              <path d={`M${BASE_X} ${BASE_Y - 2} Q ${BASE_X - 2} ${BASE_Y - 22} ${BASE_X} ${BASE_Y - 40 + droop}`} stroke="#4f8a43" strokeWidth="3.4" fill="none" strokeLinecap="round" />
              {[
                [180 + 30 - tilt, 0],
                [-30 + tilt, 1],
                [270, 2],
              ].map(([deg, k]) => (
                <Leaf key={k} x={BASE_X} y={BASE_Y - 36 + droop} deg={deg} len={k === 2 ? 12 : 20} fill={wilt >= 1 && k !== 2 ? LEAF_DRY[k] : LEAF_LIGHT[k]} rib="#3f7b40" />
              ))}
            </g>
          )}

          {stage >= 2 && (
            <g>
              {/* Rễ */}
              <g stroke="#6b4529" strokeLinecap="round" fill="none" strokeWidth={2 + 2 * s}>
                <path d={`M${BASE_X - 4} ${BASE_Y - 2} q -14 6 -${34 * s} 6`} />
                <path d={`M${BASE_X + 4} ${BASE_Y - 2} q 14 6 ${36 * s} 5`} />
                <path d={`M${BASE_X - 2} ${BASE_Y} q -6 8 -${18 * s} 11`} strokeWidth={1.5 + 1.2 * s} />
                <path d={`M${BASE_X + 2} ${BASE_Y} q 8 7 ${20 * s} 10`} strokeWidth={1.5 + 1.2 * s} />
              </g>
              {/* Thân */}
              <path
                d={`M ${BASE_X - 9 * s - 3} ${BASE_Y}
                    C ${BASE_X - 6 * s - 2} ${BASE_Y - H * 0.4}, ${BASE_X - 4 * s - 1} ${BASE_Y - H * 0.7}, ${BASE_X - 3 * s} ${topY}
                    L ${BASE_X + 3 * s} ${topY}
                    C ${BASE_X + 4 * s + 1} ${BASE_Y - H * 0.7}, ${BASE_X + 6 * s + 2} ${BASE_Y - H * 0.4}, ${BASE_X + 9 * s + 3} ${BASE_Y} Z`}
                fill="url(#tr-trunk)"
              />
              {/* Cành */}
              <g stroke="#6b4529" strokeLinecap="round" fill="none" strokeWidth={2.5 + 3 * s}>
                <path d={`M${BASE_X - 1} ${BASE_Y - H * 0.55} Q ${BASE_X - 26 * s} ${BASE_Y - H * 0.75} ${BASE_X - 46 * s} ${cy + 10 * s + droop}`} />
                <path d={`M${BASE_X + 1} ${BASE_Y - H * 0.65} Q ${BASE_X + 28 * s} ${BASE_Y - H * 0.82} ${BASE_X + 48 * s} ${cy + 6 * s + droop}`} />
                {stage >= 3 && <path d={`M${BASE_X} ${BASE_Y - H * 0.8} Q ${BASE_X - 10 * s} ${cy - 6 * s} ${BASE_X - 22 * s} ${cy - 30 * s + droop}`} strokeWidth={2 + 2 * s} />}
                {stage >= 3 && <path d={`M${BASE_X} ${BASE_Y - H * 0.85} Q ${BASE_X + 12 * s} ${cy - 6 * s} ${BASE_X + 24 * s} ${cy - 32 * s + droop}`} strokeWidth={2 + 2 * s} />}
              </g>

              {/* Tán: bóng → khóm lá (viền tự nhiên) → mảng sáng → lá nhọn chìa ra viền */}
              {clumps.map(({ i, x, y, r }) => (
                <path key={`sh${i}`} d={clumpPath(x + 3, y + 5, r, i + 1)} fill="#24401f" opacity="0.18" />
              ))}
              {clumps.map(({ i, x, y, r }) => (
                <path key={`c${i}`} d={clumpPath(x, y, r, i + 1)} fill={`url(#tr-clump-${isDry(i) ? 2 + (i % 2) : i % 2})`} />
              ))}
              {clumps.map(({ i, x, y, r }) => (
                <path
                  key={`h${i}`}
                  d={clumpPath(x - r * 0.22, y - r * 0.26, r * 0.55, i + 5)}
                  fill={isDry(i) ? "#f0d888" : form === "sang" ? "#b8df8c" : "#a6d27e"}
                  opacity={heavy ? 0.25 : form === "sang" ? 0.55 : 0.4}
                />
              ))}
              {clumps.map(({ i, x, y, r }) =>
                Array.from({ length: 12 }).map((_, j) => {
                  if (rnd(i * 31 + j) > leafKeep) return null;
                  const a = (j / 12) * TAU + rnd(i * 13 + j) * 0.4;
                  const onEdge = j % 3 !== 2;
                  const rr = onEdge ? r * (0.86 + rnd(i + j * 7) * 0.12) : r * (0.3 + rnd(i * 3 + j) * 0.35);
                  const lx = x + Math.cos(a) * rr;
                  const ly = y + Math.sin(a) * rr * 0.86;
                  const dry = isDry(i) || (wilt >= 1 && rnd(i * 17 + j) < wilt * 0.18);
                  const deg = (a * 180) / Math.PI + (Math.cos(a) >= 0 ? tilt : -tilt);
                  return (
                    <Leaf
                      key={`l${i}-${j}`}
                      x={lx}
                      y={ly}
                      deg={deg}
                      len={(onEdge ? 13 : 10) * (0.7 + 0.3 * s) * (0.85 + rnd(j + i) * 0.3)}
                      fill={dry ? LEAF_DRY[j % 3] : LEAF_LIGHT[(i + j) % 3]}
                      rib={dry ? "#8a6a2a" : "#3f7b40"}
                    />
                  );
                })
              )}
              {/* Ánh sáng trên tán */}
              <ellipse cx={BASE_X - 22 * s} cy={cy - 30 * s + droop} rx={34 * s} ry={20 * s} fill="url(#tr-glow)" opacity={form === "sang" ? 0.75 : heavy ? 0.15 : 0.4} />

              {/* Hoa nở trên tán khi trời sáng và cây khỏe */}
              {form === "sang" &&
                wilt <= 1 &&
                clumps
                  .filter(({ i }) => i % 2 === 1 || i === 0)
                  .map(({ i, x, y, r }) => (
                    <g key={`b${i}`} transform={`translate(${(x + r * 0.35).toFixed(1)} ${(y - r * 0.3).toFixed(1)})`}>
                      {[0, 72, 144, 216, 288].map((a) => (
                        <ellipse
                          key={a}
                          cx={Math.cos((a * Math.PI) / 180) * 2.8}
                          cy={Math.sin((a * Math.PI) / 180) * 2.8}
                          rx="2.4"
                          ry="1.6"
                          transform={`rotate(${a} ${Math.cos((a * Math.PI) / 180) * 2.8} ${Math.sin((a * Math.PI) / 180) * 2.8})`}
                          fill={i % 2 ? "#fbd2dc" : "#ffffff"}
                        />
                      ))}
                      <circle r="1.4" fill="#f6c85f" />
                    </g>
                  ))}

              {/* Đèn lồng nhỏ trên cành (mốc: nhìn lại hành trình) */}
              {has("den") && (
                <g transform={`translate(${BASE_X + 44 * s} ${cy + 12 * s + droop})`}>
                  <line x1="0" y1="0" x2="0" y2="12" stroke="#5a3b22" strokeWidth="1" />
                  <circle cx="0" cy="20" r="11" fill="url(#tr-glow)" />
                  <rect x="-5" y="12" width="10" height="13" rx="4" fill="#f2a65a" stroke="#c9763a" strokeWidth="1" />
                </g>
              )}
            </g>
          )}
        </g>
      </g>

      {/* Lá đang rơi khi cây héo (hình chiếc lá, xoay nhẹ khi rơi) */}
      {wilt > 0 &&
        stage >= 2 &&
        Array.from({ length: Math.min(wilt + 1, 4) }).map((_, i) => (
          <g key={i} transform={`translate(${BASE_X - 44 + i * 28} ${cy + 16})`}>
            <g className="leaf-fall" style={{ animationDelay: `${i * 1.5}s` }}>
              <Leaf x={0} y={0} deg={30 + i * 50} len={11} fill={LEAF_DRY[i % 3]} rib="#8a6a2a" />
            </g>
          </g>
        ))}

      {/* Hoa dưới đất (mốc: hoạt động chăm sóc đầu tiên) */}
      {has("hoa") &&
        [104, 214, ...(stage >= 4 ? [78, 246] : [])].map((x, i) => (
          <g key={x} transform={`translate(${x} ${BASE_Y + 6})`}>
            <g className="flower-bob" style={{ animationDelay: `${i * 0.5}s` }}>
              <path d="M0 0 Q 1 -6 0 -12" stroke="#557b4c" strokeWidth="1.6" fill="none" />
              <Leaf x={0} y={-5} deg={-30} len={6} fill="#6ea957" />
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse
                  key={a}
                  cx={Math.cos((a * Math.PI) / 180) * 3.2}
                  cy={-14 + Math.sin((a * Math.PI) / 180) * 3.2}
                  rx="2.8"
                  ry="1.9"
                  transform={`rotate(${a} ${Math.cos((a * Math.PI) / 180) * 3.2} ${-14 + Math.sin((a * Math.PI) / 180) * 3.2})`}
                  fill={wilt >= 2 ? "#d8b8a8" : ["#f29bb2", "#f6c85f", "#b79be8", "#f6a07a"][i % 4]}
                />
              ))}
              <circle cx="0" cy="-14" r="1.8" fill="#fff3d6" />
            </g>
          </g>
        ))}

      {/* Bướm */}
      {has("buom") && !heavy && (
        <g transform="translate(70 130)">
          <g className="butterfly">
            <path className="butterfly-wing" d="M0,0 C-8,-10 -14,-2 -6,4 Z M0,0 C8,-10 14,-2 6,4 Z" fill="#f2a5c0" />
          </g>
        </g>
      )}

      {/* Đom đóm */}
      {has("domdom") &&
        [
          [96, 160],
          [222, 150],
          [190, 186],
        ].map(([x, y], i) => <circle key={i} className="firefly" style={{ animationDelay: `${i * 1.3}s` }} cx={x} cy={y} r="2.2" fill="#f6e38a" opacity="0" />)}

      {/* Chim nhỏ */}
      {has("chim") && !heavy && (
        <g transform="translate(0 78)">
          <g className="bird-fly">
            <path className="bird-wing" d="M0,0 q4,-4 8,0 q4,-4 8,0" fill="none" stroke="#33485a" strokeWidth="1.6" strokeLinecap="round" />
          </g>
        </g>
      )}
    </svg>
  );
};
