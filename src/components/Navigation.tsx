import React from "react";
import {
  Home,
  BookOpen,
  Bot,
  Calendar,
  TrendingUp,
  Smile,
  Target,
  Video,
} from "lucide-react";
import { NavSection } from "../types";

interface NavigationProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
}

export const NAV_ITEMS: {
  id: NavSection;
  label: string;
  icon: React.ElementType;
  color: string;
  badge?: string;
}[] = [
  { id: "home", label: "Trang chủ", icon: Home, color: "text-blue-600" },
  { id: "subjects", label: "Môn học THCS", icon: BookOpen, color: "text-emerald-600", badge: "Sách 6-9" },
  { id: "mood", label: "Theo dõi tâm lý", icon: Smile, color: "text-rose-500", badge: "Ưu Tiên #1 ⭐" },
  { id: "ai_tutor", label: "AI Tutor THCS", icon: Bot, color: "text-indigo-600", badge: "AI 24/7" },
  { id: "planner", label: "Lập kế hoạch", icon: Calendar, color: "text-violet-600", badge: "Lịch 8 Ngày" },
  { id: "progress", label: "Theo dõi tiến độ", icon: TrendingUp, color: "text-cyan-600", badge: "Mục Tiêu" },
  { id: "career", label: "Hướng nghiệp THCS", icon: Target, color: "text-amber-600", badge: "Ôn Thi 10" },
  { id: "videos", label: "Video bài giảng", icon: Video, color: "text-red-600" },
];

export const Navigation: React.FC<NavigationProps> = ({
  currentSection,
  onSelectSection,
}) => {
  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-200 border-r border-slate-800 p-4 shrink-0 min-h-[calc(100vh-61px)]">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3">
          Menu Điều Hướng App
        </div>
        <nav className="space-y-1 flex-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/40"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-white" : item.color
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info box */}
        <div className="mt-6 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-400">
          <div className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            AI Hub Connected
          </div>
          <div>Phiên bản AI Study Hub v2.5 sẵn sàng hỗ trợ bạn 24/7.</div>
        </div>
      </aside>

      {/* Mobile Top Grid/Scroll Bar Navigation */}
      <div className="lg:hidden bg-slate-900 border-b border-slate-800 p-2 overflow-x-auto scrollbar-none sticky top-[61px] z-20">
        <div className="flex items-center gap-1.5 min-w-max px-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : item.color}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
