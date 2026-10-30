import React from "react";
import { LogOut, Cloud, CloudOff, Loader2, HardDrive } from "lucide-react";
import { StudentProfile } from "../types";
import { CompassLogo } from "./CompassLogo";

interface HeaderProps {
  /** Trạng thái lưu dữ liệu học tập lên máy chủ */
  cloudStatus?: "local" | "saving" | "saved" | "error";
  profile: StudentProfile;
  onOpenProfile: () => void;
  onGoHome: () => void;
  onLogout?: () => void;
}

const CLOUD_BADGE = {
  saved: { Icon: Cloud, text: "Đã lưu", cls: "text-teal-deep bg-teal-soft/70 border-teal-soft", title: "Dữ liệu học tập và hướng nghiệp đã lưu lên máy chủ. Nhật ký cảm xúc chỉ lưu trên máy này." },
  saving: { Icon: Loader2, text: "Đang lưu", cls: "text-navy bg-mist border-line", title: "Đang lưu dữ liệu học tập lên máy chủ" },
  error: { Icon: CloudOff, text: "Chưa lưu được", cls: "text-rose-700 bg-rose-50 border-rose-200", title: "Chưa lưu được lên máy chủ (có thể do mất mạng). Dữ liệu vẫn còn trên máy này." },
  local: { Icon: HardDrive, text: "Lưu trên máy", cls: "text-muted bg-white border-line", title: "Dữ liệu chỉ lưu trên máy đang dùng" },
};

export const Header: React.FC<HeaderProps> = ({ cloudStatus = "local", profile, onOpenProfile, onGoHome, onLogout }) => {
  const badge = CLOUD_BADGE[cloudStatus];
  const BadgeIcon = badge.Icon;
  return (
    <header className="sticky top-0 z-30 bg-cream/90 backdrop-blur-md border-b border-line px-4 lg:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <button onClick={onGoHome} className="flex items-center gap-2.5 min-w-0 cursor-pointer" aria-label="Về trang chủ">
          <CompassLogo size={36} animate />
          <span className="text-base sm:text-lg font-extrabold text-navy whitespace-nowrap tracking-tight">AI Youth Compass</span>
        </button>

        <div className="flex items-center gap-2">
          {profile.isGuest ? (
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full border border-line bg-white text-xs font-semibold text-muted">
              Chế độ khách
            </span>
          ) : (
            <span title={badge.title} className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${badge.cls}`}>
              <BadgeIcon className={`w-3.5 h-3.5 ${cloudStatus === "saving" ? "animate-spin" : ""}`} />
              {badge.text}
            </span>
          )}

          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 min-h-11 p-1 pr-1 sm:pr-3 rounded-full bg-white border border-line hover:border-teal transition cursor-pointer"
            aria-label="Hồ sơ của bạn"
          >
            <span className="w-9 h-9 rounded-full bg-mist flex items-center justify-center text-lg" aria-hidden>
              {profile.avatar}
            </span>
            <span className="hidden sm:block text-left leading-tight">
              <span className="block text-xs font-bold text-navy max-w-36 truncate">{profile.nickname}</span>
              <span className="block text-[11px] text-muted">Lớp {profile.grade}</span>
            </span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-white border border-line text-muted hover:text-rose-600 hover:border-rose-200 transition cursor-pointer"
              aria-label={profile.isGuest ? "Thoát chế độ khách" : "Đăng xuất"}
              title={profile.isGuest ? "Thoát chế độ khách" : "Đăng xuất"}
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
