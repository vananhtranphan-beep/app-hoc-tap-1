import React from "react";
import { THEMES } from "../../data/moodData";

// ============================================================
// CÂY CẢM XÚC (SVG): lớn theo giai đoạn, số lá = số lần chăm sóc,
// rũ lá khi cảm xúc nặng nề, vật trang trí mở khóa theo hoạt động.
// Hiệu ứng tự tắt khi máy bật "giảm chuyển động" (xem index.css).
// ============================================================

interface Props {
  stage: number; // 0..4
  leaves: number;
  wilted: boolean;
  decor: string[];
  theme: string;
  justGrew?: boolean;
}

// Vị trí lá cố định theo số thứ tự (không ngẫu nhiên mỗi lần vẽ)
const leafPos = (i: number, cx: number, cy: number, r: number) => {
  const a = (i * 137.508 * Math.PI) / 180;
  const d = r * Math.sqrt((i + 0.5) / 40);
  return { x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d * 0.8, rot: (i * 47) % 360 };
};

export const Tree: React.FC<Props> = ({ stage, leaves, wilted, decor, theme, justGrew }) => {
  const t = THEMES.find((x) => x.id === theme) || THEMES[0];
  const sky = wilted ? ["#d9dee6", "#c3cbd6"] : t.sky;
  const scale = [0.35, 0.5, 0.72, 0.9, 1][stage] ?? 1;
  const canopyR = 62 * scale;
  const trunkTop = 210 - 120 * scale;
  const leafFill = wilted ? "#c9a24a" : "#3f9a6e";
  const leafFill2 = wilted ? "#b58a3a" : "#5fc2a0";
  const has = (d: string) => decor.includes(d);
  const nLeaves = Math.min(leaves, 40);

  return (
    <svg viewBox="0 0 300 250" className="w-full h-auto" role="img" aria-label={`Cây cảm xúc giai đoạn ${stage + 1}${wilted ? ", đang rũ lá" : ""}`}>
      <defs>
        <linearGradient id="mt-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sky[0]} />
          <stop offset="100%" stopColor={sky[1]} />
        </linearGradient>
      </defs>
      <rect width="300" height="250" rx="18" fill="url(#mt-sky)" />

      {/* Cầu vồng mở khóa (ẩn khi cây đang rũ) */}
      {has("cauvong") && !wilted && (
        <g className="rainbow-glow" fill="none" strokeWidth="4" opacity="0.5">
          {["#f2a5a0", "#f5d48a", "#a8d8a8", "#9cc4e8", "#c3b2e6"].map((c, i) => (
            <path key={c} d={`M ${30 + i * 5},200 A ${120 - i * 5},${120 - i * 5} 0 0 1 ${270 - i * 5},200`} stroke={c} />
          ))}
        </g>
      )}

      {/* Mặt trời hoặc mây xám */}
      {wilted ? (
        <g className="cloud-drift" fill="#a9b4c2">
          <ellipse cx="70" cy="45" rx="30" ry="12" />
          <ellipse cx="92" cy="38" rx="20" ry="11" />
          <ellipse cx="220" cy="55" rx="26" ry="10" />
        </g>
      ) : (
        <circle cx="250" cy="45" r="16" fill="#f6d77a" className="sun-glow" />
      )}

      {/* Mặt đất */}
      <ellipse cx="150" cy="232" rx="150" ry="30" fill={t.ground} opacity="0.85" />
      {stage >= 4 && (
        <g fill={wilted ? "#a8925a" : "#4f8f68"}>
          <ellipse cx="55" cy="215" rx="28" ry="16" />
          <ellipse cx="250" cy="218" rx="30" ry="15" />
        </g>
      )}

      {/* Chậu gốm hoặc ụ đất */}
      {has("chau") ? (
        <path d="M120 200 L180 200 L172 232 L128 232 Z" fill="#c9805e" stroke="#9b5c41" strokeWidth="2" />
      ) : (
        <ellipse cx="150" cy="212" rx="34" ry="8" fill="#7a5a3c" opacity="0.6" />
      )}

      <g className={`tree-sway ${justGrew ? "grow-pop" : ""}`} style={{ transformOrigin: "150px 210px" }}>
        {stage === 0 ? (
          <ellipse cx="150" cy="205" rx="7" ry="5" fill="#8b6b45" />
        ) : stage === 1 ? (
          <g>
            <path d="M150 208 Q150 190 150 176" stroke="#4d7d4f" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d={wilted ? "M150 182 Q136 186 128 196 Q142 194 150 184 Z" : "M150 182 Q134 176 128 162 Q144 164 150 180 Z"} fill={leafFill} />
            <path d={wilted ? "M150 180 Q164 184 172 194 Q158 192 150 182 Z" : "M150 178 Q166 170 172 156 Q156 160 150 176 Z"} fill={leafFill2} />
          </g>
        ) : (
          <g>
            {/* Thân */}
            <path
              d={`M ${144} 210 Q ${146} ${(210 + trunkTop) / 2} ${150 - 2} ${trunkTop} L ${152} ${trunkTop} Q ${155} ${(210 + trunkTop) / 2} ${157} 210 Z`}
              fill="#7b5534"
            />
            {stage >= 3 && (
              <g stroke="#7b5534" strokeWidth="4" strokeLinecap="round" fill="none">
                <path d={`M150 ${trunkTop + 30} Q 132 ${trunkTop + 18} 122 ${trunkTop + 4}`} />
                <path d={`M151 ${trunkTop + 24} Q 168 ${trunkTop + 12} 178 ${trunkTop}`} />
              </g>
            )}
            {/* Tán */}
            <g transform={wilted ? `translate(0 8)` : undefined}>
              <ellipse cx="150" cy={trunkTop} rx={canopyR} ry={canopyR * 0.82} fill={wilted ? "#d7b46a" : "#7cc39b"} opacity="0.55" />
              {Array.from({ length: nLeaves }).map((_, i) => {
                const p = leafPos(i, 150, trunkTop, canopyR * 0.95);
                return (
                  <ellipse
                    key={i}
                    cx={p.x}
                    cy={p.y + (wilted ? 4 : 0)}
                    rx={5.5 * Math.max(scale, 0.7)}
                    ry={3 * Math.max(scale, 0.7)}
                    fill={i % 2 ? leafFill : leafFill2}
                    transform={`rotate(${wilted ? 70 + (i % 3) * 10 : p.rot} ${p.x} ${p.y})`}
                  />
                );
              })}
            </g>
          </g>
        )}
      </g>

      {/* Lá rơi khi rũ (không mất lá thật, chỉ là hình ảnh) */}
      {wilted && stage >= 2 && (
        <g>
          {[0, 1, 2].map((i) => (
            <path key={i} className="leaf-fall" style={{ animationDelay: `${i * 1.6}s` }} d={`M ${130 + i * 18},${trunkTop + 10} q 4,-5 8,0 q -4,5 -8,0 Z`} fill="#c9a24a" opacity="0" />
          ))}
        </g>
      )}

      {/* Hoa (mở khóa) */}
      {has("hoa") &&
        [118, 186, ...(stage >= 4 ? [80, 222] : [])].map((x, i) => (
          <g key={x} transform={`translate(${x} 214)`}>
            <g className="flower-bob" style={{ animationDelay: `${i * 0.5}s` }}>
              <line x1="0" y1="0" x2="0" y2="-12" stroke="#4d7d4f" strokeWidth="1.6" />
              {[0, 72, 144, 216, 288].map((a) => (
                <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 3.2} cy={-14 + Math.sin((a * Math.PI) / 180) * 3.2} r="2.6" fill={wilted ? "#c9a9a0" : ["#f29bb2", "#f6c85f", "#b79be8", "#f6a07a"][i % 4]} />
              ))}
              <circle cx="0" cy="-14" r="1.7" fill="#fff3d6" />
            </g>
          </g>
        ))}

      {/* Bướm */}
      {has("buom") && !wilted && (
        <g transform="translate(60 120)">
          <g className="butterfly">
            <path className="butterfly-wing" d="M0,0 C-8,-10 -14,-2 -6,4 Z M0,0 C8,-10 14,-2 6,4 Z" fill="#f2a5c0" />
          </g>
        </g>
      )}

      {/* Đom đóm */}
      {has("domdom") &&
        [
          [90, 150],
          [210, 140],
          [180, 175],
        ].map(([x, y], i) => <circle key={i} className="firefly" style={{ animationDelay: `${i * 1.3}s` }} cx={x} cy={y} r="2.4" fill="#f6e38a" opacity="0" />)}

      {/* Chim nhỏ */}
      {has("chim") && !wilted && (
        <g transform="translate(0 70)">
          <g className="bird-fly">
            <path className="bird-wing" d="M0,0 q4,-4 8,0 q4,-4 8,0" fill="none" stroke="#33485a" strokeWidth="1.6" strokeLinecap="round" />
          </g>
        </g>
      )}
    </svg>
  );
};
