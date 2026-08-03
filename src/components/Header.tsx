import React from "react";
import { Sparkles, Zap, User, Heart, ShieldCheck, LogOut } from "lucide-react";
import { StudentProfile } from "../types";

interface HeaderProps {
  streakCount: number;
  profile: StudentProfile;
  onOpenProfile: () => void;
  onNavigateToMood: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  streakCount,
  profile,
  onOpenProfile,
  onNavigateToMood,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold bg-gradient-to-r from-indigo-800 via-rose-600 to-indigo-600 bg-clip-text text-transparent">
                AI Study Hub THCS
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-extrabold text-[10px]">
                Học Sinh Cấp 2
              </span>
            </div>
          </div>
        </div>

        {/* Header Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Direct Mood Tracker Shortcut Button */}
          <button
            onClick={onNavigateToMood}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-extrabold border border-rose-200 transition shadow-sm cursor-pointer animate-bounce"
            title="Góc Theo Dõi Tâm Lý AI #1"
          >
            <Heart className="w-4 h-4 text-rose-600 fill-rose-500" />
            <span className="hidden sm:inline">Theo Dõi Tâm Lý AI</span>
          </button>

          {/* Continuous App Entry Counter */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
            <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>Vào app liên tục: {streakCount} ngày</span>
          </div>

          {/* Student Profile Trigger Button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 transition cursor-pointer text-left"
          >
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.fullName}
                className="w-8 h-8 rounded-xl object-cover border border-indigo-500"
              />
            ) : (
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
            )}
            <div className="hidden sm:block text-left">
              <div className="text-xs font-extrabold text-slate-800 line-clamp-1">{profile.fullName}</div>
              <div className="text-[10px] text-indigo-600 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Lớp {profile.grade} THCS
              </div>
            </div>
          </button>

          {/* Logout button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-600 border border-slate-200 transition cursor-pointer"
              title="Đăng xuất khỏi tài khoản"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
