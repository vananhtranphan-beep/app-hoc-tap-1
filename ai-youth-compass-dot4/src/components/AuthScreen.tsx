import React, { useState, useRef } from "react";
import { User, Lock, LogIn, UserPlus, ShieldCheck, Trash2, RefreshCw, ArrowRight } from "lucide-react";
import { StudentProfile } from "../types";
import { CompassLogo } from "./CompassLogo";
import { AVATARS, generateNickname, randomAvatar } from "../lib/profile";

// ============================================================
// ĐĂNG NHẬP / TẠO TÀI KHOẢN / DÙNG THỬ KHÔNG CẦN TÀI KHOẢN
// Tạo tài khoản chỉ cần: tên đăng nhập, mật khẩu, khối lớp.
// Không hỏi họ tên thật, ngày sinh, trường lớp. Web tự tạo biệt danh.
// ============================================================

type Grade = StudentProfile["grade"];

interface AuthScreenProps {
  accounts: StudentProfile[];
  /** Trả về "" nếu đăng nhập thành công, hoặc câu báo lỗi */
  onLogin: (studentId: string, pass: string) => Promise<string>;
  /** Trả về "" nếu tạo tài khoản thành công, hoặc câu báo lỗi */
  onRegister: (newProfile: StudentProfile, password: string) => Promise<string>;
  /** Vào web ở chế độ khách (không cần tài khoản) */
  onGuest: (grade: Grade) => void;
  onDeleteAccount: (studentId: string) => void;
}

const GRADES: Grade[] = ["6", "7", "8", "9"];

const inputCls =
  "w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-line text-ink placeholder-muted/60 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal transition";

const GradePicker: React.FC<{ value: Grade; onChange: (g: Grade) => void }> = ({ value, onChange }) => (
  <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Khối lớp">
    {GRADES.map((g) => (
      <button
        key={g}
        type="button"
        role="radio"
        aria-checked={value === g}
        onClick={() => onChange(g)}
        className={`min-h-11 rounded-xl border text-sm font-bold transition cursor-pointer ${
          value === g ? "bg-navy border-navy text-cream" : "bg-white border-line text-ink hover:border-teal"
        }`}
      >
        Lớp {g}
      </button>
    ))}
  </div>
);

export const AuthScreen: React.FC<AuthScreenProps> = ({ accounts, onLogin, onRegister, onGuest, onDeleteAccount }) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">(accounts.some((a) => !a.isGuest) ? "login" : "register");
  const [isBusy, setIsBusy] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [loginId, setLoginId] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");

  const [regId, setRegId] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regGrade, setRegGrade] = useState<Grade>("8");
  const [regNickname, setRegNickname] = useState(() => generateNickname());
  const [regAvatar, setRegAvatar] = useState(() => randomAvatar());
  const [regError, setRegError] = useState("");

  const [guestOpen, setGuestOpen] = useState(false);
  const [guestGrade, setGuestGrade] = useState<Grade>("8");

  const savedAccounts = accounts.filter((a) => !a.isGuest);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBusy) return;
    setLoginError("");
    if (!loginId.trim()) return setLoginError("Bạn nhập tên đăng nhập nhé.");
    if (!loginPass) return setLoginError("Bạn nhập mật khẩu nhé.");
    setIsBusy(true);
    const error = await onLogin(loginId.trim(), loginPass);
    setIsBusy(false);
    if (error) setLoginError(error);
  };

  const pickAccount = (acc: StudentProfile) => {
    setActiveTab("login");
    setLoginId(acc.studentId);
    setLoginPass("");
    setLoginError("");
    setTimeout(() => passwordRef.current?.focus(), 50);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBusy) return;
    setRegError("");
    const id = regId.trim();
    if (!id) return setRegError("Bạn đặt một tên đăng nhập nhé.");
    if (!/^[a-zA-Z0-9_.-]{3,40}$/.test(id) || id.startsWith("__")) {
      return setRegError("Tên đăng nhập chỉ gồm chữ không dấu, số, dấu _ . - (3–40 ký tự), không có khoảng trắng.");
    }
    if (/\d{8,}/.test(id)) return setRegError("Tên đăng nhập có vẻ giống số điện thoại. Bạn đặt tên khác nhé.");
    if (regPassword.trim().length < 5) return setRegError("Mật khẩu cần ít nhất 5 ký tự.");
    if (accounts.some((a) => a.studentId.toLowerCase() === id.toLowerCase())) {
      return setRegError("Tên đăng nhập này đã có trên máy. Bạn chọn tên khác nhé.");
    }

    const newProf: StudentProfile = {
      studentId: id,
      nickname: regNickname,
      grade: regGrade,
      avatar: regAvatar,
      isLoggedIn: true,
      createdAt: new Date().toLocaleDateString("vi-VN"),
    };
    setIsBusy(true);
    const error = await onRegister(newProf, regPassword);
    setIsBusy(false);
    if (error) setRegError(error);
  };

  return (
    <div className="min-h-screen bg-cream text-ink flex items-start sm:items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Thương hiệu */}
        <div className="text-center space-y-3 rise-1">
          <CompassLogo size={64} animate className="mx-auto drop-shadow-sm" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-navy">AI Youth Compass</h1>
            <p className="text-sm text-muted mt-1">La bàn nhỏ cho hành trình hiểu mình và chọn hướng đi</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-line shadow-[0_12px_40px_-20px_rgba(23,59,80,0.35)] overflow-hidden rise-2">
          {/* Thẻ chọn */}
          <div className="grid grid-cols-2 border-b border-line" role="tablist">
            {(
              [
                ["login", "Đăng nhập", LogIn],
                ["register", "Tạo tài khoản", UserPlus],
              ] as const
            ).map(([key, label, Icon]) => (
              <button
                key={key}
                role="tab"
                aria-selected={activeTab === key}
                onClick={() => {
                  setActiveTab(key);
                  setLoginError("");
                  setRegError("");
                }}
                className={`min-h-12 flex items-center justify-center gap-2 text-sm font-bold transition cursor-pointer border-b-2 ${
                  activeTab === key ? "border-teal text-navy bg-mist/40" : "border-transparent text-muted hover:text-navy"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {activeTab === "login" ? (
            <form onSubmit={handleLoginSubmit} className="p-5 sm:p-6 space-y-4">
              {loginError && (
                <div role="alert" className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium animate-shake">
                  {loginError}
                </div>
              )}
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-ink">Tên đăng nhập</span>
                <div className="relative">
                  <User className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input autoComplete="username" value={loginId} onChange={(e) => setLoginId(e.target.value)} className={inputCls} placeholder="Tên đăng nhập của bạn" />
                </div>
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-ink">Mật khẩu</span>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input ref={passwordRef} type="password" autoComplete="current-password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} className={inputCls} placeholder="••••••" />
                </div>
              </label>
              <button
                type="submit"
                disabled={isBusy}
                className="w-full min-h-12 rounded-xl bg-teal hover:bg-teal-deep disabled:opacity-60 disabled:cursor-wait text-white font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                {isBusy ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
              <p className="text-xs text-muted text-center">Quên mật khẩu? Bạn nhờ thầy/cô quản trị đặt lại giúp.</p>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="p-5 sm:p-6 space-y-4">
              {regError && (
                <div role="alert" className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium animate-shake">
                  {regError}
                </div>
              )}

              {/* Biệt danh tự tạo */}
              <div className="p-3.5 rounded-xl bg-mist/60 border border-line flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white border border-line flex items-center justify-center text-2xl shrink-0" aria-hidden>
                  {regAvatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-semibold text-muted uppercase tracking-wide">Biệt danh của bạn</div>
                  <div className="font-bold text-navy leading-snug">{regNickname}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setRegNickname((n) => generateNickname(n));
                    setRegAvatar(randomAvatar());
                  }}
                  className="min-h-10 px-3 rounded-lg bg-white border border-line hover:border-teal text-navy text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Đổi
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5" aria-label="Chọn biểu tượng">
                {AVATARS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setRegAvatar(a)}
                    aria-label={`Biểu tượng ${a}`}
                    className={`w-10 h-10 rounded-full text-lg flex items-center justify-center border transition cursor-pointer ${
                      regAvatar === a ? "border-teal bg-teal-soft" : "border-line bg-white hover:border-teal"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>

              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-ink">Tên đăng nhập</span>
                <div className="relative">
                  <User className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input autoComplete="username" value={regId} onChange={(e) => setRegId(e.target.value)} className={inputCls} placeholder="VD: dieuxanh27" />
                </div>
                <span className="block text-xs text-muted">Đừng dùng tên thật, ngày sinh hay số điện thoại.</span>
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-ink">Mật khẩu</span>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input type="password" autoComplete="new-password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} className={inputCls} placeholder="Ít nhất 5 ký tự" />
                </div>
              </label>
              <div className="space-y-1.5">
                <span className="text-sm font-semibold text-ink">Khối lớp</span>
                <GradePicker value={regGrade} onChange={setRegGrade} />
              </div>

              <button
                type="submit"
                disabled={isBusy}
                className="w-full min-h-12 rounded-xl bg-teal hover:bg-teal-deep disabled:opacity-60 disabled:cursor-wait text-white font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                {isBusy ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
              </button>
            </form>
          )}
        </div>

        {/* Dùng thử không cần tài khoản */}
        <div className="rounded-2xl border border-dashed border-line bg-white/60 p-4 rise-3">
          {!guestOpen ? (
            <button onClick={() => setGuestOpen(true)} className="w-full min-h-11 flex items-center justify-between gap-3 text-left cursor-pointer group">
              <div>
                <div className="text-sm font-bold text-navy">Dùng thử không cần tài khoản</div>
                <div className="text-xs text-muted">Dữ liệu chỉ lưu trên máy này</div>
              </div>
              <ArrowRight className="w-5 h-5 text-teal group-hover:translate-x-0.5 transition" />
            </button>
          ) : (
            <div className="space-y-3">
              <div className="text-sm font-bold text-navy">Bạn đang học lớp mấy?</div>
              <GradePicker value={guestGrade} onChange={setGuestGrade} />
              <div className="flex gap-2">
                <button onClick={() => setGuestOpen(false)} className="min-h-11 px-4 rounded-xl border border-line text-sm font-semibold text-muted hover:text-navy cursor-pointer">
                  Hủy
                </button>
                <button onClick={() => onGuest(guestGrade)} className="flex-1 min-h-11 rounded-xl bg-navy hover:bg-navy-deep text-cream text-sm font-bold cursor-pointer">
                  Vào dùng thử
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tài khoản đã dùng trên máy này */}
        {savedAccounts.length > 0 && (
          <div className="space-y-2 rise-4">
            <div className="text-xs font-semibold text-muted uppercase tracking-wide px-1">Đã dùng trên máy này</div>
            <div className="space-y-2">
              {savedAccounts.map((acc) => (
                <div key={acc.studentId} className="flex items-center gap-2 p-2 pl-3 rounded-xl bg-white border border-line">
                  <button onClick={() => pickAccount(acc)} className="flex-1 min-w-0 min-h-11 flex items-center gap-3 text-left cursor-pointer">
                    <span className="w-9 h-9 rounded-full bg-mist flex items-center justify-center text-lg shrink-0" aria-hidden>
                      {acc.avatar}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-navy truncate">{acc.nickname}</span>
                      <span className="block text-xs text-muted truncate">
                        Lớp {acc.grade} · {acc.studentId}
                      </span>
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Xóa "${acc.studentId}" khỏi máy này? Dữ liệu cảm xúc lưu trên máy này cũng bị xóa. Tài khoản trên máy chủ vẫn còn.`)) {
                        onDeleteAccount(acc.studentId);
                      }
                    }}
                    className="w-11 h-11 flex items-center justify-center rounded-lg text-muted hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    aria-label={`Xóa ${acc.studentId} khỏi máy này`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="flex items-start justify-center gap-1.5 text-xs text-muted text-center px-2">
          <ShieldCheck className="w-4 h-4 text-teal shrink-0" />
          <span>Không hỏi tên thật, ngày sinh hay trường lớp. Nhật ký cảm xúc chỉ lưu trên máy của bạn.</span>
        </p>
      </div>
    </div>
  );
};
