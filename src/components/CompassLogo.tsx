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

export const CompassHero: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg viewBox="0 0 320 320" className={className} role="img" aria-label="La bàn 6 nhóm sở thích nghề nghiệp">
    <defs>
      <radialGradient id="hero-face" cx="50%" cy="45%" r="60%">
        <stop offset="0%" stopColor="#2a5670" />
        <stop offset="100%" stopColor="#0f2a3a" />
      </radialGradient>
    </defs>

    {/* Vòng quỹ đạo xoay rất chậm */}
    <g className="compass-orbit" opacity="0.55">
      <circle cx="160" cy="160" r="150" fill="none" stroke="#5fc2ba" strokeWidth="1" strokeDasharray="2 7" />
    </g>
    <circle cx="160" cy="160" r="128" fill="url(#hero-face)" stroke="#328f89" strokeWidth="2" />
    <circle cx="160" cy="160" r="104" fill="none" stroke="#e8eef5" strokeOpacity="0.18" />
    <circle cx="160" cy="160" r="64" fill="none" stroke="#e8eef5" strokeOpacity="0.12" />

    {/* Vạch chia */}
    {Array.from({ length: 36 }).map((_, i) => (
      <line
        key={i}
        x1="160"
        y1="36"
        x2="160"
        y2={i % 3 === 0 ? 46 : 41}
        stroke="#e8eef5"
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
          <circle cx={x} cy={y} r="16" fill="#173b50" stroke="#5fc2ba" strokeWidth="1.4" />
          <text x={x} y={y + 5} textAnchor="middle" fontSize="15" fontWeight="800" fill="#f7f8f5" fontFamily="Be Vietnam Pro, sans-serif">
            {g.code}
          </text>
          <text x={x} y={labelY} textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#d6ebe9" fontFamily="Be Vietnam Pro, sans-serif">
            {g.label}
          </text>
        </g>
      );
    })}

    {/* Kim la bàn */}
    <g className="compass-needle">
      <g className="compass-idle">
        <path d="M160 106 L170 160 L160 155 L150 160 Z" fill="#5fc2ba" />
        <path d="M160 214 L170 160 L160 165 L150 160 Z" fill="#f7f8f5" opacity="0.92" />
      </g>
    </g>
    <circle cx="160" cy="160" r="7" fill="#0f2a3a" stroke="#f7f8f5" strokeWidth="2.5" />
  </svg>
);
