import React, { useState } from "react";
import { X, User, Lock, Calendar, BookOpen, Key, CheckCircle, LogOut, ShieldCheck, Sparkles, School } from "lucide-react";
import { StudentProfile } from "../types";

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSaveProfile: (newProfile: StudentProfile) => void;
  onLogout: () => void;
  onSwitchAccount: () => void;
}

export const AVATAR_OPTIONS = [
  { id: "avatar-1", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80", label: "Nữ sinh năng động" },
  { id: "avatar-2", url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80", label: "Nam sinh thông minh" },
  { id: "avatar-3", url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80", label: "Học sinh vui vẻ" },
  { id: "avatar-4", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80", label: "Học sinh chuyên cần" },
];

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  onLogout,
  onSwitchAccount,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile.fullName);
  const [dob, setDob] = useState(profile.dob);
  const [grade, setGrade] = useState<"6" | "7" | "8" | "9">(profile.grade);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [studentId, setStudentId] = useState(profile.studentId);
  const [password, setPassword] = useState(profile.password || "123456");
  const [schoolName, setSchoolName] = useState(profile.schoolName || "THCS Nguyễn Du");

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StudentProfile = {
      fullName,
      dob,
      grade,
      avatar,
      studentId,
      password,
      schoolName,
      isLoggedIn: true,
    };
    onSaveProfile(updated);
    setIsEditing(false);
  };

  const handleLogout = () => {
    const loggedOut: StudentProfile = {
      ...profile,
      isLoggedIn: false,
    };
    onSaveProfile(loggedOut);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Hồ Sơ & Đăng Nhập Học Sinh THCS</h3>
              <p className="text-xs text-indigo-200">Quản lý tài khoản học tập Cấp 2</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {!profile.isLoggedIn ? (
            /* Login / Quick Register Form */
            <form onSubmit={handleSave} className="space-y-4">
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-xs text-indigo-950 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
                <span>Chào mừng em đến với AI Study Hub THCS! Đăng nhập để lưu tiến độ & nhật ký tâm lý.</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Họ và Tên Học Sinh:</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="VD: Trần Nguyễn Minh Anh"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Ngày Tháng Năm Sinh:</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    placeholder="VD: 15/08/2012"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Khối Lớp (THCS):</span>
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 font-bold text-indigo-700"
                  >
                    <option value="6">Lớp 6 (THCS)</option>
                    <option value="7">Lớp 7 (THCS)</option>
                    <option value="8">Lớp 8 (THCS)</option>
                    <option value="9">Lớp 9 (THCS - Ôn thi 10)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Trường Trung Học Cơ Sở:</span>
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="VD: THCS Chu Văn An"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-indigo-600" />
                    <span>ID Học Sinh:</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 font-mono font-bold text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Mật Khẩu:</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50"
                  />
                </div>
              </div>

              {/* Avatar Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Chọn Hình Đại Diện Học Sinh:</label>
                <div className="grid grid-cols-4 gap-2">
                  {AVATAR_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setAvatar(opt.url)}
                      className={`p-1.5 rounded-2xl border transition cursor-pointer flex flex-col items-center gap-1 ${
                        avatar === opt.url
                          ? "border-indigo-600 ring-2 ring-indigo-500 bg-indigo-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <img src={opt.url} alt={opt.label} className="w-12 h-12 rounded-xl object-cover" />
                      <span className="text-[10px] font-semibold text-slate-600 text-center line-clamp-1">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition shadow-md shadow-indigo-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Đăng Nhập / Tạo Hồ Sơ Học Sinh</span>
              </button>
            </form>
          ) : (
            /* Logged In Profile View */
            <div className="space-y-5">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-4">
                <img
                  src={profile.avatar || AVATAR_OPTIONS[0].url}
                  alt={profile.fullName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-600 shadow-sm"
                />
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-extrabold text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    Học sinh THCS - Lớp {profile.grade}
                  </div>
                  <h4 className="text-lg font-extrabold text-slate-900">{profile.fullName}</h4>
                  <p className="text-xs text-slate-500">ID: {profile.studentId} • {profile.schoolName || "THCS Nguyễn Du"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Ngày sinh:</span>
                  <span className="font-bold text-slate-800 text-sm">{profile.dob}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Khối học:</span>
                  <span className="font-bold text-indigo-700 text-sm">THCS Cấp 2 (Lớp {profile.grade})</span>
                </div>
              </div>

              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-3 pt-2 border-t border-slate-100">
                  <h5 className="font-bold text-xs text-slate-800">Cập nhật thông tin học sinh:</h5>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Họ tên"
                    className="w-full px-3 py-2 rounded-xl border text-xs"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      placeholder="Ngày sinh"
                      className="px-3 py-2 rounded-xl border text-xs"
                    />
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value as any)}
                      className="px-3 py-2 rounded-xl border text-xs font-bold text-indigo-700"
                    >
                      <option value="6">Lớp 6</option>
                      <option value="7">Lớp 7</option>
                      <option value="8">Lớp 8</option>
                      <option value="9">Lớp 9</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                    >
                      Lưu Thay Đổi
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition cursor-pointer"
                    >
                      Chỉnh Sửa Hồ Sơ
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onSwitchAccount();
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 transition cursor-pointer"
                    >
                      Đổi Tài Khoản
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onLogout();
                    }}
                    className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng Xuất Khỏi Tài Khoản Hiện Tại</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
