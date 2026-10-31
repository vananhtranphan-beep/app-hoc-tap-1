import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Plus, Minus, Maximize2 } from "lucide-react";
import { MathChapter } from "../../data/mathMap";
import { NodeStatus } from "../../lib/quest";

// ============================================================
// BẢN ĐỒ THẾ GIỚI (SVG vẽ bằng code, nhẹ): núi, sông, cầu, hồ, thác, rừng, hang động, đài quan sát, lâu đài.
// Mỗi chương là một điểm đến nối bằng con đường. Kéo để di chuyển, cuộn chuột / 2 ngón tay để phóng to.
// ============================================================

const W = 1200;
const H = 800;

// Vị trí 10 điểm đến dọc con đường (từ làng dưới trái đến lâu đài)
const SPOTS: { x: number; y: number; land: string }[] = [
  { x: 120, y: 700, land: "Làng khởi đầu" },
  { x: 262, y: 648, land: "Cầu qua sông" },
  { x: 430, y: 712, land: "Đồng cỏ cối xay gió" },
  { x: 618, y: 664, land: "Khu rừng" },
  { x: 600, y: 505, land: "Bến hồ" },
  { x: 380, y: 432, land: "Hang động" },
  { x: 520, y: 262, land: "Thác nước" },
  { x: 770, y: 372, land: "Đài quan sát" },
  { x: 915, y: 200, land: "Đèo núi tuyết" },
  { x: 1085, y: 345, land: "Lâu đài tri thức" },
];

/** Chọn vị trí cho n chương: chương cuối luôn là lâu đài */
export const spotsFor = (n: number) => (n >= 10 ? SPOTS : [...SPOTS.slice(0, n - 1), SPOTS[9]]);

// Đường cong mềm đi qua các điểm (Catmull-Rom → Bézier)
function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return "";
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    d += ` C${p1.x + (p2.x - p0.x) / 6},${p1.y + (p2.y - p0.y) / 6} ${p2.x - (p3.x - p1.x) / 6},${p2.y - (p3.y - p1.y) / 6} ${p2.x},${p2.y}`;
  }
  return d;
}

// Một đoạn đường giữa điểm i và i+1 (cùng công thức với đường đầy đủ)
function segmentPath(pts: { x: number; y: number }[], i: number) {
  const p0 = pts[i - 1] || pts[i];
  const p1 = pts[i];
  const p2 = pts[i + 1];
  const p3 = pts[i + 2] || p2;
  return `M${p1.x},${p1.y} C${p1.x + (p2.x - p0.x) / 6},${p1.y + (p2.y - p0.y) / 6} ${p2.x - (p3.x - p1.x) / 6},${p2.y - (p3.y - p1.y) / 6} ${p2.x},${p2.y}`;
}

const Tree: React.FC<{ x: number; y: number; s?: number; tone?: number }> = ({ x, y, s = 1, tone = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx="4" cy="2" rx="13" ry="4" fill="#2f5a2a" opacity="0.25" />
    <rect x="-2" y="-8" width="4" height="10" fill="#6b4a2f" />
    <path d="M0 -42 L16 -6 L-16 -6 Z" fill={["#3f8a4a", "#4c9a52", "#367a42"][tone % 3]} />
    <path d="M0 -42 L16 -6 L0 -6 Z" fill="#2c6436" opacity="0.55" />
    <path d="M0 -54 L12 -24 L-12 -24 Z" fill={["#58a85e", "#62b066", "#4c9452"][tone % 3]} />
    <path d="M0 -54 L12 -24 L0 -24 Z" fill="#2c6436" opacity="0.45" />
  </g>
);

const Mountain: React.FC<{ x: number; y: number; w: number; h: number; snow?: boolean; c?: [string, string] }> = ({ x, y, w, h, snow, c = ["#9fb3c8", "#7f93ad"] }) => (
  <g>
    <path d={`M${x - w / 2} ${y} L${x} ${y - h} L${x + w / 2} ${y} Z`} fill={c[0]} />
    <path d={`M${x} ${y - h} L${x + w / 2} ${y} L${x + w * 0.08} ${y} Z`} fill={c[1]} />
    {snow && <path d={`M${x} ${y - h} L${x + w * 0.14} ${y - h * 0.72} L${x + w * 0.04} ${y - h * 0.78} L${x - w * 0.04} ${y - h * 0.68} L${x - w * 0.14} ${y - h * 0.74} Z`} fill="#ffffff" />}
  </g>
);

const House: React.FC<{ x: number; y: number; roof?: string }> = ({ x, y, roof = "#c4654f" }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx="4" cy="2" rx="18" ry="5" fill="#2f5a2a" opacity="0.2" />
    <rect x="-14" y="-18" width="22" height="18" fill="#f5e6c8" />
    <path d="M8 -18 L16 -24 L16 -4 L8 0 Z" fill="#d9c6a0" />
    <path d="M-17 -18 L-3 -32 L11 -18 Z" fill={roof} />
    <path d="M-3 -32 L19 -26 L11 -18 Z" fill="#8f4434" />
    <rect x="-7" y="-10" width="6" height="10" fill="#8a5a3c" />
  </g>
);

const Landmark: React.FC<{ i: number; x: number; y: number }> = ({ i, x, y }) => {
  switch (i) {
    case 0:
      return (
        <g>
          <House x={x - 52} y={y - 6} />
          <House x={x + 50} y={y - 14} roof="#5b7fc4" />
          <House x={x - 20} y={y - 42} roof="#d9915a" />
        </g>
      );
    case 2: // cối xay gió
      return (
        <g transform={`translate(${x + 58} ${y - 6})`}>
          <ellipse cx="6" cy="2" rx="16" ry="5" fill="#2f5a2a" opacity="0.2" />
          <path d="M-9 0 L-5 -42 L5 -42 L9 0 Z" fill="#f2e2c2" />
          <path d="M5 -42 L9 0 L2 0 Z" fill="#d6c19c" />
          <g className="quest-mill" style={{ transformOrigin: `0px -42px` }}>
            {[0, 90, 180, 270].map((a) => (
              <rect key={a} x="-3" y="-72" width="6" height="30" fill="#e9eef7" stroke="#9aa9c2" strokeWidth="1" transform={`rotate(${a} 0 -42)`} />
            ))}
          </g>
          <circle cx="0" cy="-42" r="3" fill="#6b4a2f" />
        </g>
      );
    case 4: // bến hồ
      return (
        <g transform={`translate(${x + 30} ${y + 4})`}>
          <rect x="-4" y="-4" width="40" height="7" fill="#9b6b43" />
          <path d="M18 8 q10 6 20 0 l-3 -6 h-14 z" fill="#c4654f" />
        </g>
      );
    case 5: // hang động
      return (
        <g transform={`translate(${x - 58} ${y + 2})`}>
          <path d="M-40 0 Q-36 -46 0 -54 Q38 -46 42 0 Z" fill="#9a8c7a" />
          <path d="M0 -54 Q38 -46 42 0 L10 0 Z" fill="#7d705f" />
          <path d="M-14 0 Q-12 -26 2 -28 Q16 -26 16 0 Z" fill="#2f2a25" />
        </g>
      );
    case 7: // đài quan sát
      return (
        <g transform={`translate(${x + 52} ${y - 4})`}>
          <ellipse cx="6" cy="2" rx="18" ry="5" fill="#2f5a2a" opacity="0.2" />
          <rect x="-12" y="-34" width="24" height="34" fill="#e6ecf7" />
          <rect x="4" y="-34" width="8" height="34" fill="#c3cde0" />
          <path d="M-16 -34 Q0 -58 16 -34 Z" fill="#6555a5" />
          <rect x="-2" y="-52" width="16" height="5" rx="2" fill="#4268a8" transform="rotate(-24 -2 -52)" />
        </g>
      );
    case 9: // lâu đài tri thức
      return (
        <g transform={`translate(${x} ${y - 18})`}>
          <ellipse cx="8" cy="20" rx="70" ry="10" fill="#2f5a2a" opacity="0.2" />
          <rect x="-50" y="-40" width="100" height="58" fill="#e9eef8" />
          <rect x="20" y="-40" width="30" height="58" fill="#c9d3e8" />
          {[-50, -26, -2, 22].map((bx) => (
            <rect key={bx} x={bx} y="-48" width="12" height="9" fill="#e9eef8" />
          ))}
          <rect x="-66" y="-74" width="26" height="92" fill="#dfe6f4" />
          <rect x="40" y="-74" width="26" height="92" fill="#c3cde0" />
          <path d="M-70 -74 L-53 -104 L-36 -74 Z" fill="#6555a5" />
          <path d="M36 -74 L53 -104 L70 -74 Z" fill="#4268a8" />
          <rect x="-12" y="-96" width="24" height="56" fill="#f2f5fb" />
          <path d="M-16 -96 L0 -132 L16 -96 Z" fill="#6555a5" />
          <line x1="0" y1="-132" x2="0" y2="-150" stroke="#4b3f86" strokeWidth="2" />
          <path className="quest-flag" d="M0 -150 L18 -144 L0 -138 Z" fill="#f2b84b" />
          <path d="M-10 18 L-10 -6 Q0 -18 10 -6 L10 18 Z" fill="#6b4a2f" />
          {[-56, 46].map((wx) => (
            <rect key={wx} x={wx} y="-56" width="8" height="12" rx="4" fill="#4268a8" />
          ))}
        </g>
      );
    default:
      return null;
  }
};

interface Props {
  chapters: MathChapter[];
  statusOf: (id: string) => NodeStatus;
  selectedId: string | null;
  onSelect: (id: string) => void;
  tint?: string;
}

export const QuestMap: React.FC<Props> = ({ chapters, statusOf, selectedId, onSelect, tint }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [view, setView] = useState({ x: 0, y: 0, k: 1 });
  const [smooth, setSmooth] = useState(false);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const moved = useRef(0);
  const pinch = useRef<{ d: number; k: number } | null>(null);

  const spots = useMemo(() => spotsFor(chapters.length), [chapters.length]);
  const road = useMemo(() => smoothPath(spots), [spots]);

  // Kích thước: bản đồ luôn phủ kín khung (điện thoại: khung cao hơn nên phóng sẵn)
  const base = box.w ? Math.max(1, box.h / ((box.w * H) / W)) : 1;
  const width = box.w * base * view.k;
  const height = (width * H) / W;

  const clamp = useCallback(
    (v: { x: number; y: number; k: number }) => {
      const k = Math.min(Math.max(v.k, 1), 3);
      const w = box.w * base * k;
      const h = (w * H) / W;
      return { k, x: Math.min(0, Math.max(box.w - w, v.x)), y: Math.min(0, Math.max(box.h - h, v.y)) };
    },
    [box.w, box.h, base]
  );

  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBox({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setBox({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  const centerOn = useCallback(
    (id: string | null, k?: number) => {
      const i = chapters.findIndex((c) => c.id === id);
      const p = spots[i >= 0 ? i : 0];
      setView((v) => {
        const kk = k ?? v.k;
        const u = (box.w * base * kk) / W;
        return clamp({ k: kk, x: box.w / 2 - p.x * u, y: box.h / 2 - p.y * u });
      });
    },
    [chapters, spots, box.w, box.h, base, clamp]
  );

  // Lần đầu: hướng về điểm đang chọn (hoặc điểm đầu)
  const firstCenter = useRef(false);
  useEffect(() => {
    if (!box.w || firstCenter.current) return;
    firstCenter.current = true;
    centerOn(selectedId, 1);
  }, [box.w, selectedId, centerOn]);

  const zoomAt = (f: number, px: number, py: number) =>
    setView((v) => {
      const k = Math.min(Math.max(v.k * f, 1), 3);
      const r = k / v.k;
      return clamp({ k, x: px - (px - v.x) * r, y: py - (py - v.y) * r });
    });

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      setSmooth(false);
      zoomAt(Math.exp(-e.deltaY * 0.0015), e.clientX - r.left, e.clientY - r.top);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clamp]);

  const onPointerDown = (e: React.PointerEvent) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    moved.current = 0;
    setSmooth(false);
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { d: Math.hypot(a.x - b.x, a.y - b.y), k: view.k };
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const cur = { x: e.clientX, y: e.clientY };
    pointers.current.set(e.pointerId, cur);
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const r = boxRef.current!.getBoundingClientRect();
      const target = (pinch.current.k * d) / pinch.current.d;
      moved.current += 10;
      zoomAt(target / view.k, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
      return;
    }
    const dx = cur.x - prev.x;
    const dy = cur.y - prev.y;
    moved.current += Math.abs(dx) + Math.abs(dy);
    // Chỉ "giữ" con trỏ khi đã thật sự kéo, để cú bấm vào điểm đến vẫn hoạt động
    if (moved.current > 8) boxRef.current?.setPointerCapture?.(e.pointerId);
    setView((v) => clamp({ ...v, x: v.x + dx, y: v.y + dy }));
  };
  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
  };

  const pick = (id: string) => {
    if (moved.current > 8) return; // vừa kéo bản đồ, không tính là bấm
    onSelect(id);
    setSmooth(true);
    centerOn(id);
  };

  const btn = "w-11 h-11 rounded-xl bg-white/95 border border-sky-line text-ocean hover:bg-sky-soft flex items-center justify-center shadow-sm cursor-pointer";

  return (
    <div className="relative">
      <div
        ref={boxRef}
        className="relative h-[440px] sm:h-[520px] lg:h-[560px] rounded-2xl overflow-hidden border border-sky-line bg-[#cfe6b0] touch-none select-none cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        aria-label="Bản đồ chinh phục tri thức. Kéo để di chuyển, dùng nút cộng trừ để phóng to thu nhỏ."
        role="application"
      >
        {box.w > 0 && (
          <svg
            viewBox={`0 0 ${W} ${H}`}
            width={width}
            height={height}
            className={`absolute left-0 top-0 ${smooth ? "transition-transform duration-500 ease-out" : ""}`}
            style={{ transform: `translate(${view.x}px, ${view.y}px)` }}
          >
            <defs>
              <linearGradient id="qm-grass" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d7ecb9" />
                <stop offset="100%" stopColor="#a9d18a" />
              </linearGradient>
              <linearGradient id="qm-water" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8fc7ea" />
                <stop offset="100%" stopColor="#5aa3d6" />
              </linearGradient>
              <radialGradient id="qm-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fff6c9" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#fff6c9" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Đồng cỏ, đồi */}
            <rect width={W} height={H} fill="url(#qm-grass)" />
            {tint && <rect width={W} height={H} fill={tint} opacity="0.08" />}
            <path d="M0 300 Q 200 230 420 300 T 820 290 T 1200 280 L1200 0 L0 0 Z" fill="#bcdba0" />
            <path d="M640 800 Q 760 600 900 640 T 1200 560 L1200 800 Z" fill="#b6d796" />
            <path d="M700 520 Q 820 450 940 500 Q 900 540 760 560 Z" fill="#c4e2a6" />

            {/* Dãy núi phía sau */}
            <Mountain x={90} y={250} w={240} h={170} />
            <Mountain x={250} y={240} w={220} h={150} c={["#a9bbcf", "#8a9db5"]} />
            <Mountain x={700} y={250} w={260} h={190} snow />
            <Mountain x={880} y={240} w={300} h={230} snow c={["#9aaec6", "#7a8fab"]} />
            <Mountain x={1080} y={250} w={280} h={200} snow />
            <Mountain x={380} y={232} w={200} h={130} c={["#a7b9a0", "#8a9e86"]} />

            {/* Sông: từ thác chảy vào hồ rồi xuống dưới, qua cầu */}
            <path d="M520 205 C 510 300 560 360 560 430" stroke="url(#qm-water)" strokeWidth="26" fill="none" strokeLinecap="round" />
            <ellipse cx="540" cy="490" rx="110" ry="62" fill="url(#qm-water)" />
            <ellipse cx="520" cy="478" rx="60" ry="20" fill="#bfe1f5" opacity="0.6" />
            <path d="M470 535 C 400 600 300 600 262 660 S 220 760 230 800" stroke="url(#qm-water)" strokeWidth="30" fill="none" strokeLinecap="round" />
            {/* Thác nước */}
            <path d="M500 168 L540 168 L548 214 L492 214 Z" fill="#a7d6f2" />
            <g stroke="#ffffff" strokeWidth="2" opacity="0.8" className="quest-fall">
              <line x1="508" y1="170" x2="506" y2="212" />
              <line x1="522" y1="170" x2="521" y2="212" />
              <line x1="534" y1="170" x2="536" y2="212" />
            </g>
            <path d="M470 150 L570 150 L560 172 L480 172 Z" fill="#8a9e86" />

            {/* Rừng */}
            {[
              [660, 640, 0], [700, 610, 1], [740, 650, 2], [690, 690, 1], [770, 700, 0], [800, 640, 2], [560, 720, 1], [720, 740, 0],
              [80, 440, 1], [130, 470, 0], [60, 520, 2], [190, 520, 1], [960, 470, 0], [1010, 500, 2], [1150, 470, 1], [1120, 620, 0], [1050, 700, 1], [930, 720, 2],
              [300, 310, 0], [250, 340, 1], [820, 300, 2],
            ].map(([x, y, t], i) => (
              <Tree key={i} x={x} y={y} s={0.9 + (i % 3) * 0.12} tone={t} />
            ))}
            {/* Đá, hoa */}
            {[
              [330, 520], [860, 560], [1000, 600], [180, 600],
            ].map(([x, y], i) => (
              <g key={i}>
                <ellipse cx={x} cy={y} rx="16" ry="9" fill="#a9a08f" />
                <ellipse cx={x + 4} cy={y - 2} rx="9" ry="5" fill="#c4bba9" />
              </g>
            ))}

            {/* Mây */}
            <g fill="#ffffff" opacity="0.75" className="cloud-drift">
              <path d="M150 110 q8 -26 36 -22 q14 -22 44 -10 q30 -2 32 26 q14 10 -4 18 H158 q-18 -4 -8 -12 Z" />
              <path d="M960 100 q8 -22 30 -18 q12 -18 36 -8 q24 0 26 20 q12 8 -4 14 H966 q-14 -3 -6 -8 Z" />
            </g>

            {/* Con đường nối các điểm đến */}
            <path d={road} stroke="#8f7a52" strokeWidth="22" fill="none" strokeLinecap="round" opacity="0.25" transform="translate(3 5)" />
            <path d={road} stroke="#efdcab" strokeWidth="18" fill="none" strokeLinecap="round" />
            <path d={road} stroke="#c9ad74" strokeWidth="2.5" strokeDasharray="10 12" fill="none" strokeLinecap="round" />
            {/* Đoạn đường đã mở sáng lên (sau mỗi chương hoàn thành) */}
            {spots.slice(0, -1).map((p, i) =>
              statusOf(chapters[i].id) === "done" ? (
                <path key={i} d={segmentPath(spots, i)} stroke="#f6c453" strokeWidth="7" fill="none" strokeLinecap="round" className="quest-road-glow" />
              ) : null
            )}

            {/* Cầu qua sông */}
            <g transform="translate(246 652) rotate(-28)">
              <rect x="-38" y="-12" width="76" height="24" rx="6" fill="#a8774b" />
              {[-30, -18, -6, 6, 18, 30].map((x) => (
                <rect key={x} x={x - 3} y="-12" width="6" height="24" fill="#8a5f3a" />
              ))}
              <rect x="-40" y="-16" width="80" height="4" rx="2" fill="#6b4a2f" />
              <rect x="-40" y="12" width="80" height="4" rx="2" fill="#6b4a2f" />
            </g>

            {/* Công trình đặc trưng ở từng điểm đến */}
            {spots.map((p, i) => (
              <Landmark key={i} i={SPOTS.indexOf(p)} x={p.x} y={p.y} />
            ))}

            {/* Điểm đến (chương) */}
            {chapters.map((c, i) => {
              const p = spots[i];
              const st = statusOf(c.id);
              const sel = selectedId === c.id;
              const color = st === "done" ? "#f2b84b" : st === "doing" ? "#6555a5" : "#ffffff";
              return (
                <g
                  key={c.id}
                  transform={`translate(${p.x} ${p.y})`}
                  className="cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label={`${c.no}: ${c.title}. ${st === "done" ? "Đã hoàn thành" : st === "doing" ? "Đang khám phá" : "Chưa khám phá"}`}
                  aria-pressed={sel}
                  data-node={c.id}
                  onClick={() => pick(c.id)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onSelect(c.id), setSmooth(true), centerOn(c.id))}
                >
                  {sel && <circle r="46" fill="url(#qm-glow)" className="quest-pulse" />}
                  <ellipse cx="4" cy="16" rx="30" ry="9" fill="#24401f" opacity="0.28" />
                  <circle r="30" fill={sel ? "#4268a8" : "#ffffff"} stroke={st === "done" ? "#d9982a" : "#4268a8"} strokeWidth="5" />
                  {st === "done" ? (
                    // Rương kho báu đã mở
                    <g transform="translate(0 4)">
                      <rect x="-15" y="-6" width="30" height="16" rx="3" fill="#b9733a" />
                      <path d="M-15 -6 L-12 -20 L12 -20 L15 -6 Z" fill="#d18b47" transform="rotate(-18 -15 -6)" />
                      <rect x="-15" y="-2" width="30" height="3" fill="#f2b84b" />
                      <circle cx="0" cy="-8" r="5" fill="#ffe08a" />
                    </g>
                  ) : (
                    <text textAnchor="middle" dy="8" fontSize="22" fontWeight="800" fill={sel ? "#ffffff" : "#4268a8"}>
                      {c.no.replace("Chương ", "")}
                    </text>
                  )}
                  {/* Cờ trạng thái */}
                  <line x1="20" y1="-22" x2="20" y2="-58" stroke="#4b3f86" strokeWidth="3" />
                  <path d="M20 -58 L44 -50 L20 -42 Z" fill={color} stroke="#4b3f86" strokeWidth="1.5" />
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {/* Nút phóng to, thu nhỏ, vừa khung */}
      <div className="absolute right-3 top-3 flex flex-col gap-2">
        <button className={btn} aria-label="Phóng to" onClick={() => (setSmooth(true), zoomAt(1.3, box.w / 2, box.h / 2))}>
          <Plus className="w-5 h-5" />
        </button>
        <button className={btn} aria-label="Thu nhỏ" onClick={() => (setSmooth(true), zoomAt(1 / 1.3, box.w / 2, box.h / 2))}>
          <Minus className="w-5 h-5" />
        </button>
        <button className={btn} aria-label="Về vị trí điểm đang chọn" onClick={() => (setSmooth(true), centerOn(selectedId, 1))}>
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>
      <div className="absolute left-3 bottom-3 flex flex-wrap gap-1.5 text-[11px] font-semibold">
        <span className="px-2 py-1 rounded-full bg-white/90 text-navy inline-flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-white border-2 border-ocean" /> Chưa khám phá
        </span>
        <span className="px-2 py-1 rounded-full bg-white/90 text-navy inline-flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-grape" /> Đang khám phá
        </span>
        <span className="px-2 py-1 rounded-full bg-white/90 text-navy inline-flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f2b84b]" /> Đã hoàn thành
        </span>
      </div>
    </div>
  );
};
