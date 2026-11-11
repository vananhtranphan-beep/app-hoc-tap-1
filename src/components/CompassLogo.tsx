import React from "react";

// ============================================================
// LOGO LA BÀN của AI Youth Compass (vẽ bằng SVG, sắc nét ở mọi cỡ)
// animate = true: kim xoay rồi dừng lại khi vừa mở trang
// ============================================================
export const CompassLogo: React.FC<{ size?: number; animate?: boolean; className?: string }> = ({
  size = 40,
  animate = false,
  className = "",
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={className} role="img" aria-label="Logo AI Youth Compass">
    <circle cx="24" cy="24" r="23" fill="#173b50" />
    <circle cx="24" cy="24" r="18.5" fill="none" stroke="#328f89" strokeWidth="1.6" opacity="0.9" />
    {[0, 90, 180, 270].map((a) => (
      <line key={a} x1="24" y1="7.5" x2="24" y2="10.5" stroke="#e8eef5" strokeWidth="1.6" strokeLinecap="round" transform={`rotate(${a} 24 24)`} />
    ))}
    {[45, 135, 225, 315].map((a) => (
      <circle key={a} cx="24" cy="8.6" r="0.9" fill="#e8eef5" opacity="0.6" transform={`rotate(${a} 24 24)`} />
    ))}
    <g className={animate ? "compass-needle" : ""}>
      <g className={animate ? "compass-idle" : ""}>
        <path d="M24 11.5 L28.2 24 L24 22.4 L19.8 24 Z" fill="#5fc2ba" />
        <path d="M24 36.5 L28.2 24 L24 25.6 L19.8 24 Z" fill="#f7f8f5" />
      </g>
    </g>
    <circle cx="24" cy="24" r="2.2" fill="#173b50" stroke="#f7f8f5" strokeWidth="1.2" />
  </svg>
);

// ============================================================
// LA BÀN LỚN ở trang chủ: 6 nhóm sở thích nghề nghiệp (mô hình RIASEC của Holland)
// ============================================================
const RIASEC = [
  { code: "R", label: "Thực tế" },
  { code: "I", label: "Nghiên cứu" },
  { code: "A", label: "Nghệ thuật" },
  { code: "S", label: "Xã hội" },
  { code: "E", label: "Quản lý" },
  { code: "C", label: "Nghiệp vụ" },
];

// tone "azure": mặt la bàn xanh sáng, viền xanh ngọc (dùng trên khung xanh Royal Blue ở trang chủ)
// tone "night": mặt la bàn xanh đêm (màn hình đăng nhập); tone "royal": xanh đêm + vàng đồng (trang chủ)
const HERO_TONES = {
  night: { face1: "#2a5670", face2: "#0f2a3a", ring: "#328f89", ringW: 2, orbit: "#5fc2ba", node: "#173b50", nodeRing: "#5fc2ba", north: "#5fc2ba", south: "#f7f8f5", pin: "#0f2a3a", label: "#d6ebe9", tick: "#e8eef5" },
  azure: { face1: "#2d8fe8", face2: "#0d5cb4", ring: "#7fe6ff", ringW: 3.5, orbit: "#bff3ff", node: "#1268c6", nodeRing: "#8fe9ff", north: "#5fc2ba", south: "#f7f8f5", pin: "#0f2a3a", label: "#d6ebe9", tick: "#e8eef5" },
  // Sang trọng: mặt xanh đêm sâu, viền kép, kim và nút vàng đồng
  royal: { face1: "#16335c", face2: "#081a33", ring: "#d9b76a", ringW: 4, orbit: "#f0d48f", node: "#0d2445", nodeRing: "#d9b76a", north: "#e9c66f", south: "#eef1f6", pin: "#d9b76a", label: "#f1dfae", tick: "#f0d48f" },
};

export const CompassHero: React.FC<{ className?: string; tone?: keyof typeof HERO_TONES }> = ({ className = "", tone = "night" }) => {
  const c = HERO_TONES[tone];
  const faceId = `hero-face-${tone}`;
  return (
  <svg viewBox="0 0 320 320" className={className} role="img" aria-label="La bàn 6 nhóm sở thích nghề nghiệp">
    <defs>
      <radialGradient id={faceId} cx="50%" cy="45%" r="60%">
        <stop offset="0%" stopColor={c.face1} />
        <stop offset="100%" stopColor={c.face2} />
      </radialGradient>
    </defs>

    {/* Vòng quỹ đạo xoay rất chậm */}
    <g className="compass-orbit" opacity="0.55">
      <circle cx="160" cy="160" r="150" fill="none" stroke={c.orbit} strokeWidth="1" strokeDasharray="2 7" />
    </g>
    <circle cx="160" cy="160" r="128" fill={`url(#${faceId})`} stroke={c.ring} strokeWidth={c.ringW} />
    {tone === "royal" && <circle cx="160" cy="160" r="121" fill="none" stroke={c.ring} strokeOpacity="0.45" strokeWidth="1" />}
    <circle cx="160" cy="160" r="104" fill="none" stroke={c.tick} strokeOpacity="0.18" />
    <circle cx="160" cy="160" r="64" fill="none" stroke={c.tick} strokeOpacity="0.12" />

    {/* Vạch chia */}
    {Array.from({ length: 36 }).map((_, i) => (
      <line
        key={i}
        x1="160"
        y1="36"
        x2="160"
        y2={i % 3 === 0 ? 46 : 41}
        stroke={c.tick}
        strokeOpacity={i % 3 === 0 ? 0.55 : 0.25}
        strokeWidth="1.4"
        transform={`rotate(${i * 10} 160 160)`}
      />
    ))}

    {/* 6 nhóm sở thích quanh mặt la bàn */}
    {RIASEC.map((g, i) => {
      const angle = (i * 60 - 90) * (Math.PI / 180);
      const x = 160 + Math.cos(angle) * 78;
      const y = 160 + Math.sin(angle) * 78;
      // Nửa trên: chữ nằm phía trên vòng tròn; nửa dưới: chữ nằm phía dưới (không đè lên nhau)
      const labelY = Math.sin(angle) < 0 ? y - 24 : y + 31;
      return (
        <g key={g.code}>
          <circle cx={x} cy={y} r="16" fill={c.node} stroke={c.nodeRing} strokeWidth="1.4" />
          <text x={x} y={y + 5} textAnchor="middle" fontSize="15" fontWeight="800" fill="#f7f8f5" fontFamily="Be Vietnam Pro, sans-serif">
            {g.code}
          </text>
          <text x={x} y={labelY} textAnchor="middle" fontSize="10.5" fontWeight="600" fill={c.label} fontFamily="Be Vietnam Pro, sans-serif">
            {g.label}
          </text>
        </g>
      );
    })}

    {/* Kim la bàn */}
    <g className="compass-needle">
      <g className="compass-idle">
        <path d="M160 106 L170 160 L160 155 L150 160 Z" fill={c.north} />
        <path d="M160 214 L170 160 L160 165 L150 160 Z" fill={c.south} opacity="0.92" />
      </g>
    </g>
    <circle cx="160" cy="160" r="7" fill={c.pin} stroke="#f7f8f5" strokeWidth="2.5" />
  </svg>
  );
};
