import React, { useState } from "react";
import { ArrowRight, Sparkles, ShieldCheck, Info, Bot, Compass, Sprout } from "lucide-react";
import { NavSection, StudentProfile } from "../types";
import { AdminPanel } from "./AdminPanel";
import { CompassHero } from "./CompassLogo";
import { STUDY_ITEMS } from "./Navigation";

interface DashboardProps {
  onNavigate: (section: NavSection) => void;
  /** Mở Gia sư AI và tự gửi câu hỏi */
  onAskAI?: (question: string) => void;
  profile: StudentProfile;
  isAdmin?: boolean;
}

const RIASEC_GROUPS = ["Thực tế", "Nghiên cứu", "Nghệ thuật", "Xã hội", "Quản lý", "Nghiệp vụ"];

// Đọc tiến độ hướng nghiệp THẬT đã lưu của tài khoản (không có thì coi như chưa bắt đầu)
function readCareerProgress(userId: string): { started: boolean; hasResult: boolean; saved: number } {
  try {
    const raw = localStorage.getItem(`user_${userId}_career_v3`);
    if (!raw) return { started: false, hasResult: false, saved: 0 };
    const s = JSON.parse(raw);
    const answered = Object.values(s?.answers || {}).filter((v) => typeof v === "number").length;
    return {
      started: answered > 0,
      hasResult: Boolean(s?.completedAt) && answered >= 10,
      saved: Array.isArray(s?.saved) ? s.saved.length : 0,
    };
  } catch {
    return { started: false, hasResult: false, saved: 0 };
  }
}

const greeting = () => {
  const h = new Date().getHours();
  return h < 11 ? "Chào buổi sáng" : h < 14 ? "Chào buổi trưa" : h < 18 ? "Chào buổi chiều" : "Chào buổi tối";
};

// Mầm cây nhỏ minh họa cho khối Cây cảm xúc (chỉ trang trí, không thể hiện dữ liệu)
const SproutArt = () => (
  <svg viewBox="0 0 120 96" className="w-28 h-auto" aria-hidden>
    <ellipse cx="60" cy="86" rx="40" ry="7" fill="#d6ebe9" />
    <path d="M60 86 C60 70 60 58 60 46" stroke="#287470" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    <path d="M60 58 C46 56 36 46 34 32 C49 32 59 42 60 58 Z" fill="#328f89" />
    <path d="M60 50 C72 46 82 34 84 20 C69 22 60 33 60 50 Z" fill="#5fc2ba" />
    <circle cx="88" cy="18" r="4" fill="#f2c94c" opacity="0.85" />
  </svg>
);

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onAskAI, profile, isAdmin }) => {
  const [quickQuestion, setQuickQuestion] = useState("");
  const career = readCareerProgress(profile.studentId);

  const askAI = (question: string) => {
    if (!question.trim()) return;
    if (onAskAI) onAskAI(question.trim());
    else onNavigate("ai_tutor");
  };

  const careerCta = career.hasResult ? "Xem lại kết quả" : career.started ? "Làm tiếp" : "Bắt đầu khám phá nghề";

  return (
    <div className="relative space-y-5 pb-10">
      {/* HERO */}
      <section className="rise-1 relative overflow-hidden rounded-3xl bg-navy text-cream">
        <div className="relative z-10 grid lg:grid-cols-[1.25fr_1fr] gap-6 items-center p-6 sm:p-8 lg:p-10">
          <div className="space-y-4 order-2 lg:order-1">
            <p className="text-sm font-semibold text-teal-soft">
              {greeting()}, {profile.nickname} · Lớp {profile.grade}
            </p>
            <h1 className="text-[1.7rem] leading-tight sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight">
              Tương lai của bạn bắt đầu từ việc hiểu chính mình
            </h1>
            <p className="text-sm sm:text-base text-mist/80 max-w-xl">
              Khám phá sở thích, thử tìm hiểu các nghề và chăm sóc cảm xúc mỗi ngày. Không cần chọn nghề ngay, chỉ cần bắt đầu tìm hiểu.
            </p>
            <div className="flex flex-wrap gap-2.5 pt-1">
              <button
                onClick={() => onNavigate("career")}
                className="min-h-12 px-5 rounded-xl bg-teal hover:bg-teal-deep text-white font-bold text-sm transition cursor-pointer flex items-center gap-2"
              >
                {careerCta}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate("mood")}
                className="min-h-12 px-5 rounded-xl border border-mist/30 hover:bg-white/10 text-cream font-semibold text-sm transition cursor-pointer"
              >
                Check-in cảm xúc
              </button>
            </div>
          </div>
          <div className="order-1 lg:order-2 flex justify-center">
            <CompassHero className="w-48 sm:w-60 lg:w-full lg:max-w-[320px] h-auto" />
          </div>
        </div>
      </section>

      {isAdmin && <AdminPanel userId={profile.studentId} />}

      {/* HƯỚNG NGHIỆP (khối lớn nhất) + CÂY CẢM XÚC */}
      <div className="grid lg:grid-cols-3 gap-4">
        <section className="rise-2 lg:col-span-2 rounded-3xl bg-white border border-line p-6 sm:p-7 flex flex-col gap-5">
          <div className="flex items-start gap-4">
            <span className="w-12 h-12 rounded-2xl bg-teal text-white flex items-center justify-center shrink-0">
              <Compass className="w-6 h-6" />
            </span>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-extrabold text-navy tracking-tight">Hướng nghiệp</h2>
              <p className="text-sm text-muted mt-1">
                Trả lời vài câu hỏi ngắn về điều bạn thích, xem các nhóm nghề phù hợp, rồi trò chuyện với AI để hỏi thêm.
              </p>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-muted mb-2">6 nhóm sở thích nghề nghiệp theo mô hình Holland (RIASEC)</div>
            <div className="flex flex-wrap gap-2">
              {RIASEC_GROUPS.map((g) => (
                <span key={g} className="px-3 py-1.5 rounded-full bg-mist text-navy text-xs font-semibold">
                  {g}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-auto flex flex-col sm:flex-row sm:items-center gap-3 pt-4 border-t border-line">
            <div className="flex-1 text-sm">
              {career.hasResult ? (
                <span className="text-teal-deep font-semibold">
                  Bạn đã có kết quả tổng hợp{career.saved ? ` và đã lưu ${career.saved} nghề` : ""}. Bạn có thể hỏi thêm AI bất cứ lúc nào.
                </span>
              ) : career.started ? (
                <span className="text-navy font-semibold">Bạn đã bắt đầu khảo sát nhưng chưa xem kết quả.</span>
              ) : (
                <span className="text-muted">Bạn chưa bắt đầu. Mất khoảng 5 phút.</span>
              )}
            </div>
            <button
              onClick={() => onNavigate("career")}
              className="min-h-12 px-5 rounded-xl bg-navy hover:bg-navy-deep text-cream font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2"
            >
              {careerCta}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        <section className="rise-3 rounded-3xl bg-teal-soft/60 border border-teal-soft p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-white text-teal-deep flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-extrabold text-navy">Cây cảm xúc của tôi</h2>
          </div>
          <p className="text-sm text-navy/80">Hôm nay bên trong bạn đang có thời tiết như thế nào? Ghi lại một chút, chăm sóc bản thân một chút.</p>
          <div className="flex justify-center">
            <SproutArt />
          </div>
          <button
            onClick={() => onNavigate("mood")}
            className="mt-auto min-h-12 rounded-xl bg-white hover:bg-cream border border-teal/30 text-teal-deep font-bold text-sm transition cursor-pointer"
          >
            Check-in hôm nay
          </button>
        </section>
      </div>

      {/* HỌC TẬP THÔNG MINH */}
      <section className="rise-4 rounded-3xl bg-white border border-line p-6 sm:p-7 space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-navy">Học tập thông minh</h2>
            <p className="text-sm text-muted">Sách giáo khoa, bản đồ chinh phục, gia sư AI, kế hoạch học tập và video.</p>
          </div>
          <button onClick={() => onNavigate("study")} className="min-h-10 text-sm font-semibold text-teal-deep hover:text-navy flex items-center gap-1 cursor-pointer">
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {STUDY_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="lift group min-h-24 p-3.5 rounded-2xl bg-cream border border-line hover:border-teal text-left flex flex-col gap-2 cursor-pointer"
              >
                <Icon className="w-5 h-5 text-teal" />
                <span className="text-sm font-bold text-navy leading-snug">{item.label}</span>
              </button>
            );
          })}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            askAI(quickQuestion);
          }}
          className="flex gap-2"
        >
          <label className="relative flex-1 min-w-0">
            <span className="sr-only">Hỏi nhanh Gia sư AI</span>
            <Bot className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={quickQuestion}
              onChange={(e) => setQuickQuestion(e.target.value)}
              placeholder="Hỏi nhanh Gia sư AI, VD: Giải phương trình 2x − 1 = 3"
              className="w-full min-h-12 pl-10 pr-3 rounded-xl border border-line bg-cream text-sm focus:outline-none focus:ring-2 focus:ring-teal"
            />
          </label>
          <button type="submit" className="min-h-12 px-4 rounded-xl bg-teal hover:bg-teal-deep text-white font-bold text-sm transition flex items-center gap-1.5 shrink-0 cursor-pointer">
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Hỏi AI</span>
          </button>
        </form>
      </section>

      {/* GIỚI THIỆU · GIỚI HẠN AI · QUYỀN RIÊNG TƯ */}
      <footer className="grid sm:grid-cols-3 gap-4 pt-2 text-sm">
        <div className="space-y-1.5">
          <div className="font-bold text-navy flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-teal" /> Về AI Youth Compass
          </div>
          <p className="text-muted">Ứng dụng hỗ trợ học sinh THCS khám phá sở thích nghề nghiệp, chăm sóc cảm xúc và học tập.</p>
        </div>
        <div className="space-y-1.5">
          <div className="font-bold text-navy flex items-center gap-1.5">
            <Info className="w-4 h-4 text-teal" /> Giới hạn của AI
          </div>
          <p className="text-muted">AI có thể sai và chỉ để tham khảo. AI không thay thế thầy cô, bố mẹ hay chuyên gia tâm lý.</p>
        </div>
        <div className="space-y-1.5">
          <div className="font-bold text-navy flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal" /> Quyền riêng tư
          </div>
          <p className="text-muted">Không hỏi tên thật, ngày sinh hay trường lớp. Nhật ký cảm xúc chỉ lưu trên máy của bạn.</p>
          <button onClick={() => onNavigate("privacy")} className="min-h-10 inline-flex items-center gap-1 font-semibold text-teal-deep hover:text-navy underline underline-offset-4 cursor-pointer">
            Xem trang quyền riêng tư <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>

      {/* Ký hiệu nhỏ ở góc */}
      <div className="absolute bottom-0 right-0 text-[10px] font-mono tracking-wider text-[#000000] select-none" aria-hidden>
        CaiKhe9B1
      </div>
    </div>
  );
};
