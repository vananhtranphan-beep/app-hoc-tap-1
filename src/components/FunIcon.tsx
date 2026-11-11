import React from "react";

// ============================================================
// BIỂU TƯỢNG KIỂU HOẠT HÌNH: hình emoji nhiều màu đặt trên ô "nhãn dán" màu pastel
// (emoji có sẵn trong máy, không cần tải ảnh, không lo bản quyền hình)
// ============================================================
export type Tone = "peach" | "sun" | "mint" | "sky" | "lilac" | "pink" | "lime";

// Màu tươi đậm hơn để tô kín cả ô (menu trang chủ)
export const BRIGHT: Record<Tone, string> = {
  peach: "#ffbf8f",
  sun: "#ffdf5c",
  mint: "#8fe3bb",
  sky: "#9ccbff",
  lilac: "#cbb5ff",
  pink: "#ffadcb",
  lime: "#bfe97f",
};

export const TONES: Record<Tone, { bg: string; edge: string; ink: string }> = {
  peach: { bg: "#ffe4d4", edge: "#f4bf9f", ink: "#9a4f2c" },
  sun: { bg: "#fff0b3", edge: "#f0cf6a", ink: "#8a6400" },
  mint: { bg: "#d3f4e5", edge: "#93d8b9", ink: "#1f7a5c" },
  sky: { bg: "#dbe9ff", edge: "#a7c3f0", ink: "#335a9a" },
  lilac: { bg: "#ebe3ff", edge: "#c5b4f3", ink: "#5b47a0" },
  pink: { bg: "#ffe0ec", edge: "#f3b0c9", ink: "#a23d66" },
  lime: { bg: "#e8f6cc", edge: "#bfe08c", ink: "#4d7420" },
};

const SIZES = {
  xs: "w-7 h-7 text-base rounded-lg",
  sm: "w-9 h-9 text-xl rounded-xl",
  md: "w-12 h-12 text-[26px] rounded-2xl",
  lg: "w-14 h-14 sm:w-16 sm:h-16 text-[30px] sm:text-[36px] rounded-2xl",
} as const;

// ------------------------------------------------------------
// HÌNH 3D: bộ Fluent Emoji 3D của Microsoft (giấy phép MIT, xem public/3d/LICENSE-fluentui-emoji.txt)
// Hình nằm sẵn trong web (thư mục public/3d), không tải từ trang khác. Emoji nào chưa có hình thì hiện emoji thường.
// ------------------------------------------------------------
const IMG_3D: Record<string, string> = {
  "🧭": "compass",
  "🌱": "seedling",
  "📚": "books",
  "🗺️": "map",
  "🤖": "robot",
  "📅": "calendar",
  "🎬": "clapper",
  "🎒": "backpack",
  "🏠": "house",
  "📝": "memo",
  "🎯": "target",
  "💬": "speech",
  "🔖": "bookmark",
  "🔄": "reset",
  "🛡️": "shield",
  "💡": "bulb",
  "☀️": "sun",
  "🌈": "rainbow",
  "⭐": "star",
};

export const Emoji3D: React.FC<{ emoji: string; className?: string; style?: React.CSSProperties }> = ({ emoji, className = "", style }) => {
  const key = IMG_3D[emoji];
  if (!key) return <span className={`fun-emoji leading-none ${className}`} style={style}>{emoji}</span>;
  return <img src={`/3d/${key}.webp`} alt="" draggable={false} className={`img-3d select-none ${className}`} style={style} />;
};

export const FunIcon: React.FC<{ emoji: string; tone?: Tone; size?: keyof typeof SIZES; className?: string; onColor?: boolean }> = ({
  emoji,
  tone = "sky",
  size = "md",
  className = "",
  onColor = false,
}) => {
  const t = TONES[tone];
  return (
    <span
      aria-hidden
      className={`fun-icon inline-flex items-center justify-center shrink-0 select-none ${SIZES[size]} ${className}`}
      style={{ background: onColor ? "rgba(255,255,255,0.85)" : t.bg, boxShadow: `inset 0 -4px 0 ${t.edge}, 0 2px 0 rgba(255,255,255,0.6) inset` }}
    >
      <Emoji3D emoji={emoji} className="w-[78%] h-[78%] object-contain" />
    </span>
  );
};
