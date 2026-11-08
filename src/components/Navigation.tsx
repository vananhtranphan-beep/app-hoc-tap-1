import React from "react";
import { NavSection } from "../types";
import { FunIcon, Tone } from "./FunIcon";

interface NavigationProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
}

export type NavItem = { id: NavSection; label: string; emoji: string; tone: Tone };

export const MAIN_ITEMS: NavItem[] = [
  { id: "home", label: "Trang chủ", emoji: "🏠", tone: "sky" },
  { id: "career", label: "Hướng nghiệp", emoji: "🧭", tone: "peach" },
  { id: "mood", label: "Cây cảm xúc", emoji: "🌱", tone: "lime" },
];

export const STUDY_ITEMS: (NavItem & { desc: string })[] = [
  { id: "subjects", label: "Sách giáo khoa", emoji: "📚", tone: "sky", desc: "Đọc SGK lớp 6–9 các môn" },
  { id: "quest", label: "Bản đồ chinh phục", emoji: "🗺️", tone: "sun", desc: "Khám phá từng chương Toán, AI tạo câu hỏi" },
  { id: "ai_tutor", label: "Gia sư AI", emoji: "🤖", tone: "mint", desc: "Hỏi bài, AI giải thích từng bước" },
  { id: "planner", label: "Kế hoạch học tập", emoji: "📅", tone: "pink", desc: "Lên lịch học 7 ngày" },
  { id: "videos", label: "Video bài giảng", emoji: "🎬", tone: "peach", desc: "Lưu video YouTube để xem lại" },
];

export const STUDY_HUB_ITEM: NavItem = { id: "study", label: "Học tập thông minh", emoji: "🎒", tone: "lilac" };

export const STUDY_SECTIONS: NavSection[] = ["study", ...STUDY_ITEMS.map((i) => i.id)];

const SideButton: React.FC<{ item: NavItem; active: boolean; onClick: () => void }> = ({ item, active, onClick }) => (
  <button
    onClick={onClick}
    aria-current={active ? "page" : undefined}
    className={`relative w-full flex items-center gap-3 min-h-12 px-2 rounded-2xl text-sm font-bold transition cursor-pointer ${
      active ? "bg-white/12 text-white" : "text-[#c3d0e3] hover:bg-white/6 hover:text-white"
    }`}
  >
    {active && <span className="absolute -left-3 top-2.5 bottom-2.5 w-1.5 rounded-r-full bg-[#ffd66b]" aria-hidden />}
    <FunIcon emoji={item.emoji} tone={item.tone} size="sm" />
    <span>{item.label}</span>
  </button>
);

export const Navigation: React.FC<NavigationProps> = ({ currentSection, onSelectSection }) => {
  const inStudy = STUDY_SECTIONS.includes(currentSection);

  const mobileItems: (NavItem & { active: boolean })[] = [
    ...MAIN_ITEMS.map((i) => ({ ...i, active: currentSection === i.id })),
    { ...STUDY_HUB_ITEM, label: "Học tập", active: inStudy },
  ];

  return (
    <>
      {/* Máy tính: thanh bên dạng thẻ kem bo tròn */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 p-4 sticky top-[61px] self-start h-[calc(100vh-61px)]">
        <div className="nav-panel flex-1 flex flex-col p-3 overflow-y-auto no-scrollbar">
          <nav className="space-y-1" aria-label="Điều hướng chính">
            {MAIN_ITEMS.map((item) => (
              <SideButton key={item.id} item={item} active={currentSection === item.id} onClick={() => onSelectSection(item.id)} />
            ))}
          </nav>

          <button
            onClick={() => onSelectSection("study")}
            className={`mt-5 mb-1.5 px-2 pt-4 border-t border-white/10 text-left text-xs font-extrabold cursor-pointer ${currentSection === "study" ? "text-[#ffd66b]" : "text-[#8fa3bf] hover:text-white"}`}
          >
            Học tập thông minh
          </button>
          <nav className="space-y-1" aria-label="Học tập thông minh">
            {STUDY_ITEMS.map((item) => (
              <SideButton key={item.id} item={item} active={currentSection === item.id} onClick={() => onSelectSection(item.id)} />
            ))}
          </nav>

          <div className="mt-auto pt-5 flex items-center gap-2.5 px-2 text-xs font-bold text-[#ffd66b]">
            <span className="text-xl" aria-hidden>
              🧭
            </span>
            <span className="whitespace-nowrap">La bàn nhỏ cho hành trình to</span>
          </div>
        </div>
      </aside>

      {/* Điện thoại, máy tính bảng: thanh điều hướng dưới đáy */}
      <nav
        aria-label="Điều hướng chính"
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-[#1d3150] rounded-t-3xl shadow-[0_-8px_24px_-12px_rgba(20,35,58,0.55)] pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-4 max-w-xl mx-auto px-1">
          {mobileItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              aria-current={item.active ? "page" : undefined}
              className={`min-h-[68px] flex flex-col items-center justify-center gap-0.5 text-[11px] font-extrabold transition cursor-pointer ${
                item.active ? "text-[#ffd66b]" : "text-[#a9b9d0]"
              }`}
            >
              <span
                className={`w-12 h-9 rounded-full flex items-center justify-center text-[22px] leading-none transition ${item.active ? "bg-white/14 scale-110" : "opacity-85"}`}
                aria-hidden
              >
                {item.emoji}
              </span>
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};
