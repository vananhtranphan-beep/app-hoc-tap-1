import React, { useState, useEffect, useRef } from "react";
import { X, RefreshCw, LogOut, Check, ShieldCheck } from "lucide-react";
import { StudentProfile } from "../types";
import { AVATARS, generateNickname } from "../lib/profile";

// ============================================================
// HỒ SƠ ẨN DANH: biệt danh, biểu tượng, khối lớp
// Không có họ tên thật, ngày sinh, trường lớp, mật khẩu
// ============================================================
interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSaveProfile: (newProfile: StudentProfile) => void;
  onLogout: () => void;
  onOpenPrivacy?: () => void;
}

const GRADES: StudentProfile["grade"][] = ["6", "7", "8", "9"];

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({ isOpen, onClose, profile, onSaveProfile, onLogout, onOpenPrivacy }) => {
  const [nickname, setNickname] = useState(profile.nickname);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [grade, setGrade] = useState(profile.grade);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Mỗi lần mở hộp: lấy lại hồ sơ hiện tại
  useEffect(() => {
    if (!isOpen) return;
    setNickname(profile.nickname);
    setAvatar(profile.avatar);
    setGrade(profile.grade);
    setSaved(false);
    setError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Bấm Esc để đóng
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  if (!isOpen) return null;

  const changed = nickname.trim() !== profile.nickname || avatar !== profile.avatar || grade !== profile.grade;

  const handleSave = () => {
    const name = nickname.trim();
    if (name.length < 2) return setError("Biệt danh cần ít nhất 2 ký tự.");
    onSaveProfile({ ...profile, nickname: name.slice(0, 40), avatar, grade });
    setError("");
    setSaved(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-navy-deep/50 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Hồ sơ của bạn"
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md max-h-[92vh] overflow-y-auto bg-cream rounded-t-3xl sm:rounded-3xl shadow-2xl animate-rise"
      >
        <div className="flex items-center justify-between px-5 pt-5">
          <h2 className="text-lg font-extrabold text-navy">Hồ sơ của bạn</h2>
          <button onClick={onClose} className="w-11 h-11 rounded-full flex items-center justify-center text-muted hover:bg-mist cursor-pointer" aria-label="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-line">
            <span className="w-16 h-16 rounded-full bg-mist flex items-center justify-center text-3xl shrink-0" aria-hidden>
              {avatar}
            </span>
            <div className="min-w-0">
              <div className="font-extrabold text-navy text-lg truncate">{nickname || profile.nickname}</div>
              <div className="text-sm text-muted">
                Lớp {grade} · {profile.isGuest ? "Chế độ khách" : `Tên đăng nhập: ${profile.studentId}`}
              </div>
            </div>
          </div>

          <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-ink">Biệt danh</span>
            <div className="flex gap-2">
              <input
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setSaved(false);
                }}
                maxLength={40}
                className="flex-1 min-w-0 min-h-11 px-3.5 rounded-xl bg-white border border-line text-sm focus:outline-none focus:ring-2 focus:ring-teal"
              />
              <button
                type="button"
                onClick={() => {
                  setNickname((n) => generateNickname(n));
                  setSaved(false);
                }}
                className="min-h-11 px-3 rounded-xl bg-white border border-line hover:border-teal text-navy text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> Đổi
              </button>
            </div>
            <span className="block text-xs text-muted">Biệt danh chỉ để hiển thị trong web. Bạn đừng dùng tên thật nhé.</span>
          </label>

          <div className="space-y-1.5">
            <span className="text-sm font-semibold text-ink">Biểu tượng</span>
            <div className="flex flex-wrap gap-1.5">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => {
                    setAvatar(a);
                    setSaved(false);
                  }}
                  aria-label={`Biểu tượng ${a}`}
                  className={`w-11 h-11 rounded-full text-xl flex items-center justify-center border transition cursor-pointer ${
                    avatar === a ? "border-teal bg-teal-soft" : "border-line bg-white hover:border-teal"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-sm font-semibold text-ink">Khối lớp</span>
            <div className="grid grid-cols-4 gap-2">
              {GRADES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    setGrade(g);
                    setSaved(false);
                  }}
                  className={`min-h-11 rounded-xl border text-sm font-bold transition cursor-pointer ${
                    grade === g ? "bg-navy border-navy text-cream" : "bg-white border-line text-ink hover:border-teal"
                  }`}
                >
                  Lớp {g}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-rose-700 font-medium">{error}</p>}
          {saved && !changed && (
            <p role="status" className="text-sm text-teal-deep font-semibold flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Đã lưu hồ sơ.
            </p>
          )}

          <button
            onClick={handleSave}
            disabled={!changed}
            className="w-full min-h-12 rounded-xl bg-teal hover:bg-teal-deep disabled:bg-line disabled:text-muted disabled:cursor-not-allowed text-white font-bold text-sm transition cursor-pointer"
          >
            Lưu thay đổi
          </button>

          <p className="flex items-start gap-1.5 text-xs text-muted">
            <ShieldCheck className="w-4 h-4 text-teal shrink-0" />
            {profile.isGuest
              ? "Chế độ khách: mọi dữ liệu chỉ lưu trên máy này. Đổi máy hoặc xóa lịch sử trình duyệt sẽ mất dữ liệu."
              : "Hồ sơ chỉ gồm tên đăng nhập, biệt danh, biểu tượng và khối lớp. Nhật ký cảm xúc không được gửi lên máy chủ."}
          </p>

          {onOpenPrivacy && (
            <button
              onClick={onOpenPrivacy}
              className="w-full min-h-11 rounded-xl border border-line bg-white hover:border-teal text-navy text-sm font-semibold transition cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-teal" /> Quyền riêng tư, mã PIN và xóa dữ liệu
            </button>
          )}

          <button
            onClick={onLogout}
            className="w-full min-h-11 rounded-xl border border-line bg-white hover:border-rose-200 hover:text-rose-700 text-muted text-sm font-semibold transition cursor-pointer flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            {profile.isGuest ? "Thoát chế độ khách" : "Đăng xuất"}
          </button>
        </div>
      </div>
    </div>
  );
};
