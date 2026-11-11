import React from "react";
import { ArrowLeft } from "lucide-react";
import { NavSection } from "../types";
import { Emoji3D } from "./FunIcon";

// ============================================================
// ĐẦU TRANG DÙNG CHUNG cho mọi trang bên trong
// Mỗi trang một màu tươi (xanh lá, vàng, cam, hồng...), linh vật emoji to và hình vẽ ngộ nghĩnh.
// Dùng chung một chỗ nên trang nào cũng cùng bố cục, chỉ khác màu.
// ============================================================
type Meta = { emoji: string; title: string; desc: string; bg: string; edge: string; deco: string };

export const PAGE_META: Partial<Record<NavSection, Meta>> = {
  career: {
    emoji: "🧭",
    title: "Hướng nghiệp",
    desc: "Hiểu sở thích của mình, khám phá nghề, thử trải nghiệm nhỏ. Chưa cần chọn nghề ngay.",
    bg: "#ffb35c",
    edge: "#e08a2c",
    deco: "#fff3b0",
  },
  mood: {
    emoji: "🌱",
    title: "Cây cảm xúc của tôi",
    desc: "Quan sát cảm xúc, chăm sóc bản thân, cây lớn lên cùng bạn.",
    bg: "#8fd76a",
    edge: "#5fae3c",
    deco: "#fff6a8",
  },
  study: {
    emoji: "🎒",
    title: "Học tập thông minh",
    desc: "Sách giáo khoa, bản đồ chinh phục, gia sư AI, kế hoạch học tập và video ở cùng một chỗ.",
    bg: "#ffd84a",
    edge: "#e0b21c",
    deco: "#ffffff",
  },
  subjects: {
    emoji: "📚",
    title: "Thư viện sách giáo khoa",
    desc: "Bộ sách Kết nối tri thức với cuộc sống, lớp 6–9. Bấm “Đọc sách” để mở sách trên trang của NXB Giáo dục.",
    bg: "#6fd3a0",
    edge: "#3fae78",
    deco: "#fff6a8",
  },
  quest: {
    emoji: "🗺️",
    title: "Bản đồ chinh phục tri thức",
    desc: "Môn Toán. Mỗi điểm đến là một chương sách Kết nối tri thức, chọn điểm nào cũng được.",
    bg: "#ffd84a",
    edge: "#e0b21c",
    deco: "#ffffff",
  },
  ai_tutor: {
    emoji: "🤖",
    title: "Gia sư AI",
    desc: "Giải thích từng bước, giúp bạn hiểu cách làm chứ không chỉ đưa đáp án.",
    bg: "#86c8ff",
    edge: "#4f9de6",
    deco: "#fff6a8",
  },
  planner: {
    emoji: "📅",
    title: "Kế hoạch học tập",
    desc: "Ghi việc cần làm và số giờ học cho từng ngày trong tuần, rồi nhờ AI xem lịch đã cân bằng chưa.",
    bg: "#ffa3c8",
    edge: "#e5709f",
    deco: "#fff6a8",
  },
  videos: {
    emoji: "🎬",
    title: "Video bài giảng",
    desc: "Lưu video YouTube hay để xem lại, sắp xếp theo môn học.",
    bg: "#c2a8ff",
    edge: "#9474e8",
    deco: "#fff6a8",
  },
  privacy: {
    emoji: "🛡️",
    title: "Quyền riêng tư",
    desc: "Web lưu gì, không lưu gì và bạn có thể xóa dữ liệu của mình như thế nào.",
    bg: "#7fdcc0",
    edge: "#46b796",
    deco: "#ffffff",
  },
};

// Hình vẽ ngộ nghĩnh: ngôi sao, chấm tròn, đường lượn sóng, đám mây
const STAR = "M12 1l3 7.5 8 .6-6.1 5.2 2 7.7L12 17.8 5.1 22l2-7.7L1 9.1l8-.6z";
const Doodle: React.FC<{ style: React.CSSProperties; className?: string; children: React.ReactNode }> = ({ style, className = "", children }) => (
  <span className={`doodle absolute pointer-events-none ${className}`} style={style} aria-hidden>
    {children}
  </span>
);
const Doodles: React.FC<{ color: string }> = ({ color }) => (
  <>
    <Doodle style={{ left: "55%", top: "12%" }}>
      <svg width="24" height="24" viewBox="0 0 24 24"><path d={STAR} fill={color} /></svg>
    </Doodle>
    <Doodle className="hidden sm:block" style={{ left: "71%", bottom: "14%" }}>
      <svg width="15" height="15" viewBox="0 0 24 24"><path d={STAR} fill="#fff" /></svg>
    </Doodle>
    <Doodle className="hidden sm:block" style={{ left: "46%", bottom: "10%", width: 10, height: 10, borderRadius: 99, background: "#fff", opacity: 0.75 }}>{null}</Doodle>
    <Doodle style={{ right: "3%", top: "10%", width: 14, height: 14, borderRadius: 99, background: color }}>{null}</Doodle>
    <Doodle className="hidden sm:block" style={{ left: "36%", top: "8%" }}>
      <svg width="60" height="16" viewBox="0 0 60 16"><path d="M2 8c6-8 12 8 18 0s12 8 18 0 12 8 18 0" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.8" /></svg>
    </Doodle>
    <Doodle className="hidden sm:block" style={{ left: "79%", bottom: "8%" }}>
      <svg width="54" height="30" viewBox="0 0 52 30"><path d="M14 28h26a10 10 0 0 0 0-20 13 13 0 0 0-24-2A11 11 0 0 0 14 28z" fill="#fff" opacity="0.7" /></svg>
    </Doodle>
  </>
);

export const PageHeader: React.FC<{ section: NavSection; backLabel: string; onBack: () => void }> = ({ section, backLabel, onBack }) => {
  const meta = PAGE_META[section];
  if (!meta) return null;
  return (
    <header
      className="fun-band relative overflow-hidden rounded-3xl text-navy px-4 py-3.5 sm:px-6 sm:py-5"
      style={{ background: meta.bg, ["--band-edge" as string]: meta.edge }}
    >
      <Doodles color={meta.deco} />
      <div className="relative flex items-center gap-3 sm:gap-5">
        <div className="min-w-0 flex-1">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 min-h-9 px-2.5 rounded-lg bg-white/55 hover:bg-white/80 text-xs sm:text-sm font-extrabold text-navy cursor-pointer transition"
          >
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </button>
          <h2 className="mt-2 text-[1.35rem] sm:text-[1.9rem] leading-tight font-black tracking-tight text-navy">{meta.title}</h2>
          <p className="mt-0.5 text-[13px] sm:text-[15px] font-semibold text-navy/80 max-w-[62ch]">{meta.desc}</p>
        </div>
        <span
          className="mascot shrink-0 w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-white/70 flex items-center justify-center text-[40px] sm:text-[60px] leading-none select-none"
          style={{ boxShadow: `inset 0 -5px 0 ${meta.edge}55` }}
          aria-hidden
        >
          <Emoji3D emoji={meta.emoji} className="w-[80%] h-[80%] object-contain" />
        </span>
      </div>
    </header>
  );
};
