import React, { useState } from "react";
import {
  User,
  Lock,
  GraduationCap,
  School,
  Sparkles,
  LogIn,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  KeyRound
} from "lucide-react";
import { StudentProfile } from "../types";

interface AuthScreenProps {
  accounts: StudentProfile[];
  onLogin: (studentId: string, pass: string) => boolean;
  onRegister: (newProfile: StudentProfile) => void;
  onDeleteAccount: (studentId: string) => void;
  onQuickSelectAccount: (studentId: string) => void;
}

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80"
];

export const AuthScreen: React.FC<AuthScreenProps> = ({
  accounts,
  onLogin,
  onRegister,
  onDeleteAccount,
  onQuickSelectAccount,
}) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Login Form State
  const [loginId, setLoginId] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");

  // Register Form State
  const [regFullName, setRegFullName] = useState("");
  const [regGrade, setRegGrade] = useState<"6" | "7" | "8" | "9">("8");
  const [regSchool, setRegSchool] = useState("");
  const [regStudentId, setRegStudentId] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regAvatar, setRegAvatar] = useState(PRESET_AVATARS[0]);
  const [regError, setRegError] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!loginId.trim()) {
      setLoginError("Vui lòng nhập ID đăng nhập!");
      return;
    }
    const success = onLogin(loginId.trim(), loginPass);
    if (!success) {
      setLoginError("ID đăng nhập hoặc Mật khẩu không chính xác!");
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (!regFullName.trim()) {
      setRegError("Vui lòng nhập Họ và Tên!");
      return;
    }
    if (!regSchool.trim()) {
      setRegError("Vui lòng nhập tên Trường THCS!");
      return;
    }
    if (!regStudentId.trim()) {
      setRegError("Vui lòng nhập ID đăng nhập!");
      return;
    }
    if (!regPassword.trim() || regPassword.trim().length < 5) {
      setRegError("Mật khẩu phải chứa ít nhất 5 ký tự (chữ, số hoặc cả hai)!");
      return;
    }

    // Check if ID already exists
    if (accounts.some((a) => a.studentId.toLowerCase() === regStudentId.trim().toLowerCase())) {
      setRegError("ID đăng nhập này đã tồn tại trên hệ thống! Vui lòng chọn ID khác.");
      return;
    }

    const newProf: StudentProfile = {
      fullName: regFullName.trim(),
      dob: "01/01/2012",
      grade: regGrade,
      avatar: regAvatar,
      studentId: regStudentId.trim(),
      password: regPassword,
      schoolName: regSchool.trim(),
      isLoggedIn: true,
      createdAt: new Date().toLocaleDateString("vi-VN"),
    };

    onRegister(newProf);
  };

  return (
    <div className="min-h-screen bg-slate-900 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-extrabold border border-indigo-400/30">
            <Sparkles className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>AI Study Hub THCS - Hệ Thống Tài Khoản Học Sinh</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-300 via-rose-300 to-amber-200 bg-clip-text text-transparent">
            Đăng Nhập / Tạo Tài Khoản
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Mỗi tài khoản lưu trữ riêng biệt dữ liệu môn học, bảng điểm, kế hoạch học tập & nhật ký cảm xúc 30 ngày của bạn.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700 shadow-lg">
          <button
            onClick={() => {
              setActiveTab("login");
              setLoginError("");
            }}
            className={`flex-1 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "login"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/50"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Đăng Nhập</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("register");
              setRegError("");
            }}
            className={`flex-1 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "register"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/50"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Tạo Tài Khoản Mới</span>
          </button>
        </div>

        {/* LOGIN FORM */}
        {activeTab === "login" && (
          <form
            onSubmit={handleLoginSubmit}
            className="p-6 sm:p-8 rounded-3xl bg-slate-800/80 border border-slate-700/80 shadow-2xl backdrop-blur-xl space-y-5"
          >
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-700 pb-3">
              <KeyRound className="w-5 h-5 text-indigo-400" />
              <span>Nhập ID & Mật Khẩu Đăng Nhập</span>
            </h2>

            {loginError && (
              <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-bold animate-shake">
                ⚠️ {loginError}
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold block">ID Đăng nhập (Username)</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="Ví dụ: minhanh2026 hoặc hoangnam"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-500 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold block">Mật khẩu</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-500 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-rose-500 to-amber-500 hover:from-indigo-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-xl shadow-indigo-950/80 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              <span>Đăng Nhập Vào Học Hub</span>
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {activeTab === "register" && (
          <form
            onSubmit={handleRegisterSubmit}
            className="p-6 sm:p-8 rounded-3xl bg-slate-800/80 border border-slate-700/80 shadow-2xl backdrop-blur-xl space-y-5"
          >
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-700 pb-3">
              <UserPlus className="w-5 h-5 text-indigo-400" />
              <span>Điền Thông Tin Tạo Tài Khoản Học Sinh</span>
            </h2>

            {regError && (
              <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-bold animate-shake">
                ⚠️ {regError}
              </div>
            )}

            {/* Avatar Picker */}
            <div className="space-y-2">
              <label className="text-slate-300 font-bold text-xs block">Chọn Ảnh Đại Diện Avatar</label>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {PRESET_AVATARS.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setRegAvatar(img)}
                    className={`w-12 h-12 rounded-2xl overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                      regAvatar === img ? "border-rose-400 scale-105 shadow-md shadow-rose-950" : "border-slate-700 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="Avatar" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-slate-300 font-bold block">Họ và Tên Học Sinh</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="Ví dụ: Trần Nguyễn Minh Anh"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-500 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold block">Khối Lớp THCS</label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <select
                    value={regGrade}
                    onChange={(e) => setRegGrade(e.target.value as any)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-700 text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="6">Lớp 6 THCS</option>
                    <option value="7">Lớp 7 THCS</option>
                    <option value="8">Lớp 8 THCS</option>
                    <option value="9">Lớp 9 THCS</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold block">Trường THCS</label>
                <div className="relative">
                  <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={regSchool}
                    onChange={(e) => setRegSchool(e.target.value)}
                    placeholder="Ví dụ: THCS Chu Văn An"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-500 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold block">ID Đăng nhập (Username)</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={regStudentId}
                    onChange={(e) => setRegStudentId(e.target.value)}
                    placeholder="Ví dụ: hoangnam2026"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-500 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold block">Mật khẩu (Ít nhất 5 ký tự)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Tối thiểu 5 số hoặc chữ"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-500 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-emerald-950/80 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Tạo Tài Khoản & Đăng Nhập Ngay</span>
            </button>
          </form>
        )}

        {/* SAVED ACCOUNTS ON THIS DEVICE */}
        {accounts.length > 0 && (
          <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/60 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Tài Khoản Đã Tạo Trên Thiết Bị Này ({accounts.length})</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {accounts.map((acc) => (
                <div
                  key={acc.studentId}
                  className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700 hover:border-indigo-500/80 transition flex items-center justify-between gap-3 group"
                >
                  <button
                    onClick={() => onQuickSelectAccount(acc.studentId)}
                    className="flex items-center gap-3 text-left flex-1 min-w-0 cursor-pointer"
                  >
                    <img
                      src={acc.avatar}
                      alt={acc.fullName}
                      className="w-10 h-10 rounded-xl object-cover border border-indigo-500/50 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold text-slate-200 group-hover:text-indigo-300 transition truncate">
                        {acc.fullName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-semibold truncate">
                        Lớp {acc.grade} • ID: {acc.studentId}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Bạn có chắc muốn xóa tài khoản ID "${acc.studentId}" khỏi thiết bị này?`)) {
                        onDeleteAccount(acc.studentId);
                      }
                    }}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/50 rounded-xl transition cursor-pointer"
                    title="Xóa tài khoản khỏi thiết bị"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
