import React from "react";
import { Check } from "lucide-react";
import { RIASEC, RiasecCode } from "../../data/careerData";

// Nhãn phân biệt nguồn thông tin: em chọn / web tính / AI gợi ý
export const SourceTag: React.FC<{ kind: "user" | "web" | "ai" }> = ({ kind }) => {
  const map = {
    user: { text: "Bạn đã chọn", cls: "bg-white text-navy border-navy/25" },
    web: { text: "Web tính từ câu trả lời", cls: "bg-teal-soft text-teal-deep border-teal-soft" },
    ai: { text: "AI gợi ý · chỉ để tham khảo", cls: "bg-amber-50 text-amber-800 border-amber-200" },
  }[kind];
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-semibold ${map.cls}`}>{map.text}</span>;
};

export const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = "", children }) => (
  <section className={`rounded-2xl bg-white border border-line p-5 sm:p-6 ${className}`}>{children}</section>
);

export const Chip: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`min-h-10 px-3.5 rounded-full text-sm font-medium border transition cursor-pointer inline-flex items-center gap-1.5 ${
      active ? "bg-navy border-navy text-cream" : "bg-white border-line text-ink hover:border-teal"
    }`}
  >
    {active && <Check className="w-3.5 h-3.5" />}
    {children}
  </button>
);

const CODE_COLORS: Record<RiasecCode, string> = {
  R: "bg-[#e7efe9] text-[#2f6b4f]",
  I: "bg-[#e3edf5] text-[#235a80]",
  A: "bg-[#f3e9f1] text-[#7b3f6e]",
  S: "bg-[#f6ede2] text-[#8a5a1f]",
  E: "bg-[#f7e6e3] text-[#94402f]",
  C: "bg-[#ebeaf4] text-[#4a4688]",
};

export const CodeBadge: React.FC<{ code: RiasecCode; full?: boolean }> = ({ code, full }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold ${CODE_COLORS[code]}`} title={RIASEC[code].name}>
    {code}
    {full && <span className="font-semibold">· {RIASEC[code].name}</span>}
  </span>
);

export const PrimaryBtn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = "", ...p }) => (
  <button
    {...p}
    className={`min-h-11 px-4 rounded-xl bg-teal hover:bg-teal-deep disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition cursor-pointer inline-flex items-center justify-center gap-2 ${className}`}
  />
);

export const GhostBtn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = "", ...p }) => (
  <button
    {...p}
    className={`min-h-11 px-4 rounded-xl bg-white border border-line hover:border-teal disabled:opacity-50 disabled:cursor-not-allowed text-navy font-semibold text-sm transition cursor-pointer inline-flex items-center justify-center gap-2 ${className}`}
  />
);
