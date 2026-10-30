import React from "react";
import { Home, BookOpen, Bot, Calendar, TrendingUp, Sprout, Compass, Video, GraduationCap } from "lucide-react";
import { NavSection } from "../types";
import { CompassLogo } from "./CompassLogo";

interface NavigationProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
}

type NavItem = { id: NavSection; label: string; icon: React.ElementType };

const MAIN_ITEMS: NavItem[] = [
  { id: "home", label: "Trang chủ", icon: Home },
  { id: "career", label: "Hướng nghiệp", icon: Compass },
  { id: "mood", label: "Cây cảm xúc", icon: Sprout },
];

export const STUDY_ITEMS: (NavItem & { desc: string })[] = [
  { id: "subjects", label: "Sách giáo khoa", icon: BookOpen, desc: "Đọc SGK lớp 6–9 các môn" },
  { id: "videos", label: "Video bài giảng", icon: Video, desc: "Lưu video YouTube để xem lại" },
  { id: "ai_tutor", label: "AI Tutor", icon: Bot, desc: "Hỏi bài, AI giải thích từng bước" },
  { id: "planner", label: "Kế hoạch tuần", icon: Calendar, desc: "Lên lịch học 7 ngày" },
  { id: "progress", label: "Bảng điểm", icon: TrendingUp, desc: "Tính điểm trung bình học kỳ" },
];

export const STUDY_SECTIONS: NavSection[] = ["study", ...STUDY_ITEMS.map((i) => i.id)];

const SideButton: React.FC<{ item: NavItem; active: boolean; onClick: () => void }> = ({ item, active, onClick }) => {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`w-full flex items-center gap-3 min-h-11 px-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
        active ? "bg-teal text-white" : "text-mist/85 hover:bg-white/8 hover:text-white"
      }`}
    >
      <Icon className="w-[18px] h-[18px] shrink-0" />
      <span>{item.label}</span>
    </button>
  );
};

export const Navigation: React.FC<NavigationProps> = ({ currentSection, onSelectSection }) => {
  const inStudy = STUDY_SECTIONS.includes(currentSection);

  const mobileItems: (NavItem & { active: boolean })[] = [
    ...MAIN_ITEMS.map((i) => ({ ...i, active: currentSection === i.id })),
    { id: "study", label: "Học tập", icon: GraduationCap, active: inStudy },
  ];

  return (
    <>
      {/* Máy tính: thanh bên */}
      <aside className="hidden lg:flex flex-col w-60 bg-navy text-mist p-4 shrink-0 min-h-[calc(100vh-61px)] sticky top-[61px] self-start">
        <nav className="space-y-1" aria-label="Điều hướng chính">
          {MAIN_ITEMS.map((item) => (
            <SideButton key={item.id} item={item} active={currentSection === item.id} onClick={() => onSelectSection(item.id)} />
          ))}
        </nav>

        <button
          onClick={() => onSelectSection("study")}
          className={`mt-6 mb-1 px-3 text-left text-[11px] font-bold uppercase tracking-wider cursor-pointer ${currentSection === "study" ? "text-white" : "text-mist/55 hover:text-white"}`}
        >
          Học tập thông minh
        </button>
        <nav className="space-y-1" aria-label="Học tập thông minh">
          {STUDY_ITEMS.map((item) => (
            <SideButton key={item.id} item={item} active={currentSection === item.id} onClick={() => onSelectSection(item.id)} />
          ))}
        </nav>

        <div className="mt-auto pt-6 flex items-center gap-2.5 px-2 text-xs text-mist/70">
          <CompassLogo size={28} />
          <span>La bàn nhỏ cho hành trình lớn</span>
        </div>
      </aside>

      {/* Điện thoại, máy tính bảng: thanh điều hướng dưới đáy */}
      <nav
        aria-label="Điều hướng chính"
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-line pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-4 max-w-xl mx-auto">
          {mobileItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                aria-current={item.active ? "page" : undefined}
                className={`min-h-16 flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition cursor-pointer ${
                  item.active ? "text-teal" : "text-muted hover:text-navy"
                }`}
              >
                <span className={`w-12 h-7 rounded-full flex items-center justify-center transition ${item.active ? "bg-teal-soft" : ""}`}>
                  <Icon className="w-5 h-5" />
                </span>
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
