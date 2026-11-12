import React, { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { NavSection, StudentProfile } from "../types";
import { AdminPanel } from "./AdminPanel";
import { CompassHero } from "./CompassLogo";
import { BRIGHT, FunIcon, TONES } from "./FunIcon";
import { MAIN_ITEMS, NavItem, STUDY_HUB_ITEM, STUDY_ITEMS } from "./Navigation";

interface DashboardProps {
  onNavigate: (section: NavSection) => void;
  /** Mở Gia sư AI và tự gửi câu hỏi */
  onAskAI?: (question: string) => void;
  profile: StudentProfile;
  isAdmin?: boolean;
}

// 6 nhóm Holland, mỗi nhóm một hình cho dễ nhớ
const RIASEC_GROUPS: [string, string][] = [
  ["🔧", "Thực tế"],
  ["🔬", "Nghiên cứu"],
  ["🎨", "Nghệ thuật"],
  ["🤝", "Xã hội"],
  ["📣", "Quản lý"],
  ["🗂️", "Nghiệp vụ"],
];

// MENU trang chủ: 8 ô, hiện ngay đầu trang (điện thoại không phải lướt mới thấy)
const MENU: NavItem[] = [MAIN_ITEMS[1], MAIN_ITEMS[2], ...STUDY_ITEMS, STUDY_HUB_ITEM];

// Đọc tiến độ hướng nghiệp THẬT đã lưu của tài khoản (không có thì coi như chưa bắt đầu)
function readCareerProgress(userId: string): { started: boolean; hasResult: boolean; saved: number } {
  try {
    const raw = localStorage.getItem(`user_${userId}_career_v4`);
    if (!raw) return { started: false, hasResult: false, saved: 0 };
    const s = JSON.parse(raw);
    const answered = Object.values(s?.answers || {}).filter((v) => typeof v === "number").length;
    return {
      started: answered > 0,
      hasResult: Boolean(s?.completedAt) && answered >= 18,
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
    <div className="relative space-y-4 sm:space-y-5 pb-10">
      {/* ĐẦU TRANG: khung xanh sapphire có lưới mảnh, la bàn vàng đồng là điểm nhấn */}
      <section className="rise-1 chart-hero relative overflow-hidden rounded-3xl text-cream">
        <div className="relative grid grid-cols-[1fr_auto] items-center gap-3 sm:gap-6 p-4 pr-3 sm:px-7 sm:py-5 lg:px-9 lg:py-6">
          <div className="min-w-0 space-y-2 sm:space-y-3">
            <p className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-extrabold text-[#f1dfae]">
              <span>
                {greeting()}, {profile.nickname}!
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/12 text-cream/90 text-[11px] sm:text-xs">Lớp {profile.grade}</span>
            </p>
            <h1 className="text-[1.12rem] leading-[1.25] sm:text-[1.7rem] lg:text-[2.1rem] lg:leading-[1.15] font-black tracking-tight text-white max-w-[22ch]">
              Tương lai của bạn bắt đầu từ việc hiểu chính mình
            </h1>
            <div className="hidden sm:flex flex-wrap gap-2.5 pt-1">
              <button onClick={() => onNavigate("career")} className="btn-3d btn-sun min-h-12 px-5 rounded-2xl font-black text-sm cursor-pointer">
                Khám phá nghề
              </button>
              <button
                onClick={() => onNavigate("mood")}
                className="min-h-12 px-5 rounded-2xl border-2 border-white/50 bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition cursor-pointer"
              >
                Check-in cảm xúc
              </button>
            </div>
          </div>
          <div className="relative">
            <span className="absolute inset-[8%] rounded-full bg-[#5fc2ba]/20 blur-2xl" aria-hidden />
            <CompassHero tone="royal" className="relative w-[124px] sm:w-40 lg:w-48 h-auto drop-shadow-[0_10px_24px_rgba(0,0,0,0.35)]" />
          </div>
        </div>
      </section>

      {/* MENU CHÍNH */}
      <section aria-labelledby="home-menu" className="">
        <h2 id="home-menu" className="px-1 mb-2.5 text-base sm:text-lg font-black text-navy">
          Hôm nay bạn muốn làm gì?
        </h2>
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {MENU.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="menu-tile group flex flex-col items-center justify-start gap-1.5 sm:gap-2 px-1 pt-2.5 pb-2 sm:p-4 rounded-3xl text-center cursor-pointer"
              style={{ background: BRIGHT[item.tone], borderColor: TONES[item.tone].edge, ["--edge" as string]: TONES[item.tone].edge }}
            >
              <FunIcon emoji={item.emoji} tone={item.tone} size="lg" onColor className="group-hover:-rotate-6 group-hover:scale-110 transition" />
              <span className="text-[11.5px] sm:text-sm font-extrabold text-navy leading-tight">{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* HỎI NHANH GIA SƯ AI */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          askAI(quickQuestion);
        }}
        className="cute-card flex items-center gap-2 p-2 pl-2.5 bg-white"
      >
        <FunIcon emoji="🤖" tone="mint" size="sm" />
        <label className="flex-1 min-w-0">
          <span className="sr-only">Hỏi nhanh Gia sư AI</span>
          <input
            value={quickQuestion}
            onChange={(e) => setQuickQuestion(e.target.value)}
            placeholder="Hỏi nhanh Gia sư AI, VD: Giải phương trình 2x − 1 = 3"
            className="w-full min-h-11 px-2 bg-transparent text-base sm:text-sm placeholder:text-muted/80 focus:outline-none"
          />
        </label>
        <button type="submit" className="btn-3d btn-sun min-h-11 px-4 rounded-2xl font-black text-sm flex items-center gap-1.5 shrink-0 cursor-pointer">
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">Hỏi AI</span>
        </button>
      </form>

      {isAdmin && <AdminPanel userId={profile.studentId} />}

      {/* HƯỚNG NGHIỆP + CÂY CẢM XÚC */}
      <div className="grid lg:grid-cols-3 gap-4">
        <section className="lg:col-span-2 cute-card bg-[#fffaf5] p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex items-start gap-3.5">
            <FunIcon emoji="🧭" tone="peach" size="md" />
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-black text-navy tracking-tight">Hướng nghiệp</h2>
              <p className="text-sm text-muted mt-0.5">
                Trả lời vài câu hỏi ngắn về điều bạn thích, xem các nhóm nghề phù hợp, rồi trò chuyện với AI để hỏi thêm.
              </p>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-muted mb-2">6 nhóm sở thích nghề nghiệp theo mô hình Holland (RIASEC)</div>
            <div className="flex flex-wrap gap-1.5">
              {RIASEC_GROUPS.map(([e, g]) => (
                <span key={g} className="px-2.5 py-1 rounded-full bg-white border-2 border-[#f6dcc8] text-navy text-xs font-bold">
                  {e} {g}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-auto flex flex-col sm:flex-row sm:items-center gap-3 pt-4 border-t-2 border-dashed border-[#f3dcc9]">
            <div className="flex-1 text-sm">
              {career.hasResult ? (
                <span className="text-teal-deep font-bold">
                  Bạn đã có kết quả tổng hợp{career.saved ? ` và đã lưu ${career.saved} nghề` : ""}. Bạn có thể hỏi thêm AI bất cứ lúc nào.
                </span>
              ) : career.started ? (
                <span className="text-navy font-bold">Bạn đã bắt đầu làm phiếu nhưng chưa xem kết quả.</span>
              ) : (
                <span className="text-muted">Bạn chưa bắt đầu. Mất khoảng 5 phút.</span>
              )}
            </div>
            <button
              onClick={() => onNavigate("career")}
              className="btn-3d btn-peach min-h-12 px-5 rounded-2xl font-black text-sm cursor-pointer flex items-center justify-center gap-2"
            >
              {careerCta}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        <section className="cute-card bg-[#f6fbe9] p-5 sm:p-6 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <FunIcon emoji="🌱" tone="lime" size="md" />
            <h2 className="text-lg font-black text-navy">Cây cảm xúc của tôi</h2>
          </div>
          <p className="text-sm text-navy/80">Hôm nay bên trong bạn đang có thời tiết như thế nào? Ghi lại một chút, chăm sóc bản thân một chút.</p>
          <div className="flex justify-center gap-2 text-3xl py-1 select-none" aria-hidden>
            <span>☀️</span>
            <span>⛅</span>
            <span>🌧️</span>
            <span>🌈</span>
          </div>
          <button onClick={() => onNavigate("mood")} className="btn-3d btn-lime mt-auto min-h-12 rounded-2xl font-black text-sm cursor-pointer">
            Check-in hôm nay
          </button>
        </section>
      </div>

      {/* GIỚI THIỆU · GIỚI HẠN AI · QUYỀN RIÊNG TƯ */}
      <footer className="grid sm:grid-cols-3 gap-3 pt-1 text-sm">
        {[
          ["🧭", "Về AI Youth Compass", "Ứng dụng hỗ trợ học sinh THCS khám phá sở thích nghề nghiệp, chăm sóc cảm xúc và học tập."],
          ["💡", "Giới hạn của AI", "AI có thể sai và chỉ để tham khảo. AI không thay thế thầy cô, bố mẹ hay chuyên gia tâm lý."],
          ["🛡️", "Quyền riêng tư", "Không hỏi tên thật, ngày sinh hay trường lớp. Nhật ký cảm xúc chỉ lưu trên máy của bạn."],
        ].map(([e, t, d], i) => (
          <div key={t} className="rounded-3xl bg-white/70 border-2 border-line p-4 space-y-1">
            <div className="font-black text-navy">
              {e} {t}
            </div>
            <p className="text-muted">{d}</p>
            {i === 2 && (
              <button onClick={() => onNavigate("privacy")} className="min-h-10 inline-flex items-center gap-1 font-bold text-teal-deep hover:text-navy underline underline-offset-4 cursor-pointer">
                Xem trang quyền riêng tư <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </footer>

      {/* Ký hiệu nhỏ ở góc */}
      <div className="absolute bottom-0 right-0 text-[10px] font-mono tracking-wider text-[#000000] select-none" aria-hidden>
        CaiKhe9B1
      </div>
    </div>
  );
};
