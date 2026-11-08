import React from "react";
import { ArrowLeft } from "lucide-react";
import { NavSection } from "../types";
import { FunIcon, Tone } from "./FunIcon";

// ============================================================
// ĐẦU TRANG DÙNG CHUNG cho mọi trang bên trong
// Dải "hải đồ" xanh đêm (cùng màu cột menu và đầu trang chủ): nút quay lại, biểu tượng, tên trang, một dòng mô tả.
// Nhờ dùng chung một chỗ nên trang nào cũng cùng kiểu, không trang nào lệch.
// ============================================================
type Meta = { emoji: string; tone: Tone; title: string; desc: string };

export const PAGE_META: Partial<Record<NavSection, Meta>> = {
  career: {
    emoji: "🧭",
    tone: "peach",
    title: "Hướng nghiệp",
    desc: "Hiểu sở thích của mình, khám phá nghề, thử trải nghiệm nhỏ. Chưa cần chọn nghề ngay.",
  },
  mood: { emoji: "🌱", tone: "lime", title: "Cây cảm xúc của tôi", desc: "Quan sát cảm xúc, chăm sóc bản thân, cây lớn lên cùng bạn." },
  study: {
    emoji: "🎒",
    tone: "lilac",
    title: "Học tập thông minh",
    desc: "Sách giáo khoa, bản đồ chinh phục, gia sư AI, kế hoạch học tập và video ở cùng một chỗ.",
  },
  subjects: {
    emoji: "📚",
    tone: "sky",
    title: "Thư viện sách giáo khoa",
    desc: "Bộ sách Kết nối tri thức với cuộc sống, lớp 6–9. Bấm “Đọc sách” để mở sách trên trang của NXB Giáo dục.",
  },
  quest: {
    emoji: "🗺️",
    tone: "sun",
    title: "Bản đồ chinh phục tri thức",
    desc: "Môn Toán. Mỗi điểm đến là một chương sách Kết nối tri thức, chọn điểm nào cũng được.",
  },
  ai_tutor: { emoji: "🤖", tone: "mint", title: "Gia sư AI", desc: "Giải thích từng bước, giúp bạn hiểu cách làm chứ không chỉ đưa đáp án." },
  planner: {
    emoji: "📅",
    tone: "pink",
    title: "Kế hoạch học tập",
    desc: "Ghi việc cần làm và số giờ học cho từng ngày trong tuần, rồi nhờ AI xem lịch đã cân bằng chưa.",
  },
  videos: { emoji: "🎬", tone: "peach", title: "Video bài giảng", desc: "Lưu video YouTube hay để xem lại, sắp xếp theo môn học." },
  privacy: { emoji: "🛡️", tone: "mint", title: "Quyền riêng tư", desc: "Web lưu gì, không lưu gì và bạn có thể xóa dữ liệu của mình như thế nào." },
};

export const PageHeader: React.FC<{ section: NavSection; backLabel: string; onBack: () => void }> = ({ section, backLabel, onBack }) => {
  const meta = PAGE_META[section];
  if (!meta) return null;
  return (
    <header className="chart-band relative overflow-hidden rounded-3xl text-cream px-4 py-3.5 sm:px-6 sm:py-5">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 min-h-9 -ml-1 px-2 rounded-lg text-xs sm:text-sm font-bold text-[#c3d0e3] hover:text-white hover:bg-white/8 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        {backLabel}
      </button>
      <div className="mt-1.5 flex items-center gap-3 sm:gap-4">
        <FunIcon emoji={meta.emoji} tone={meta.tone} size="md" />
        <div className="min-w-0">
          <h2 className="text-xl sm:text-[1.7rem] leading-tight font-black tracking-tight text-[#fffaf0]">{meta.title}</h2>
          <p className="mt-0.5 text-[13px] sm:text-sm text-[#c3d0e3] max-w-[70ch]">{meta.desc}</p>
        </div>
      </div>
    </header>
  );
};
