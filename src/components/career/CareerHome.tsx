import React from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { CAREERS, INTEREST_ITEMS } from "../../data/careerData";
import { CareerState, answeredCount } from "../../lib/career";
import { Emoji3D, FunIcon, TONES, Tone } from "../FunIcon";

// ============================================================
// TRANG ĐẦU HƯỚNG NGHIỆP: 2 lựa chọn lớn, nhìn hình là biết bấm gì
// 1. Làm phiếu khám phá 6 nhóm tính cách (khuyến khích, không bắt buộc)
// 2. Hỏi AI tư vấn nghề (không cần làm phiếu trước)
// ============================================================

interface Props {
  state: CareerState;
  hasQuiz: boolean;
  onStartQuiz: () => void; // mở màn giới thiệu hoặc làm tiếp
  onRestartQuiz: () => void;
  onOpenResult: () => void;
  onOpenChat: () => void;
  onOpenCatalog: () => void;
  onOpenSaved: () => void;
  onOpenPlan: () => void;
  onReset: () => void;
}

const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/70 text-navy text-xs sm:text-sm font-extrabold">{children}</span>
);

// Nút to màu xanh đêm, nổi rõ trên nền thẻ màu
const BigButton: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="btn-3d w-full sm:w-auto min-h-14 px-6 rounded-xl bg-navy text-white text-base font-black inline-flex items-center justify-center gap-2 cursor-pointer"
    style={{ ["--btn-edge" as string]: "#14233a", boxShadow: "0 5px 0 #14233a" }}
  >
    {children}
  </button>
);

export const CareerHome: React.FC<Props> = ({ state, hasQuiz, onStartQuiz, onRestartQuiz, onOpenResult, onOpenChat, onOpenCatalog, onOpenSaved, onOpenPlan, onReset }) => {
  const done = answeredCount(state.answers);
  const inProgress = !hasQuiz && done > 0;

  const shortcuts: { emoji: string; tone: Tone; label: string; onClick: () => void }[] = [
    { emoji: "📚", tone: "sky", label: `Xem tất cả ${CAREERS.length} nghề`, onClick: onOpenCatalog },
    { emoji: "🔖", tone: "pink", label: `Nghề đã lưu (${state.saved.length})`, onClick: onOpenSaved },
    { emoji: "🎯", tone: "lilac", label: `Kế hoạch khám phá (${state.plan.length})`, onClick: onOpenPlan },
  ];

  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
        {/* Lựa chọn 1: trắc nghiệm */}
        <section
          className="relative overflow-hidden rounded-3xl p-5 sm:p-6 flex flex-col gap-4"
          style={{ background: "#ffd84a", boxShadow: "0 6px 0 #e0b21c" }}
        >
          <span className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-[#ff7a3d] text-white text-xs font-black shadow-[0_3px_0_#d65a20]">⭐ Khuyến khích</span>
          <div className="flex items-end gap-1 select-none" aria-hidden>
            <Emoji3D emoji="📝" className="w-20 h-20 sm:w-24 sm:h-24 -rotate-6" />
            <Emoji3D emoji="🎯" className="w-11 h-11 sm:w-12 sm:h-12 mb-1 rotate-12" />
          </div>
          <div>
            <h3 className="text-2xl sm:text-[1.7rem] font-black text-navy leading-tight tracking-tight">Khám phá nhóm tính cách nghề nghiệp</h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Chip>📋 {INTEREST_ITEMS.length} câu</Chip>
              <Chip>⏱️ 3–5 phút</Chip>
              <Chip>📗 Theo SGK Công nghệ 9</Chip>
              <Chip>🔒 Không cần tên thật</Chip>
            </div>
          </div>
          <div className="mt-auto flex flex-wrap gap-2.5 pt-1">
            {hasQuiz ? (
              <>
                <BigButton onClick={onOpenResult}>
                  Xem kết quả của bạn <ArrowRight className="w-5 h-5" />
                </BigButton>
                <button
                  onClick={onRestartQuiz}
                  className="min-h-14 px-5 rounded-xl bg-white/80 hover:bg-white text-navy font-extrabold text-sm inline-flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" /> Sửa câu trả lời
                </button>
              </>
            ) : (
              <BigButton onClick={onStartQuiz}>
                {inProgress ? `Làm tiếp (đã trả lời ${done}/${INTEREST_ITEMS.length} câu)` : "Bắt đầu khám phá"} <ArrowRight className="w-5 h-5" />
              </BigButton>
            )}
          </div>
        </section>

        {/* Lựa chọn 2: hỏi AI */}
        <section
          className="relative overflow-hidden rounded-3xl p-5 sm:p-6 flex flex-col gap-4"
          style={{ background: "#8fd76a", boxShadow: "0 6px 0 #5fae3c" }}
        >
          <div className="flex items-end gap-1 select-none" aria-hidden>
            <Emoji3D emoji="🤖" className="w-20 h-20 sm:w-24 sm:h-24 rotate-3" />
            <Emoji3D emoji="💬" className="w-11 h-11 sm:w-12 sm:h-12 mb-10 -rotate-6" />
          </div>
          <div>
            <h3 className="text-2xl sm:text-[1.7rem] font-black text-navy leading-tight tracking-tight">Hỏi AI tư vấn nghề</h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Chip>💡 Hỏi gì về nghề cũng được</Chip>
              <Chip>⚡ Không cần làm phiếu</Chip>
            </div>
          </div>
          <div className="mt-auto pt-1 space-y-2">
            <BigButton onClick={onOpenChat}>
              Bắt đầu trò chuyện <ArrowRight className="w-5 h-5" />
            </BigButton>
            <p className="text-xs font-semibold text-navy/75">AI có thể sai. Hãy hỏi thêm thầy cô, bố mẹ.</p>
          </div>
        </section>
      </div>

      {/* Lối tắt */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {shortcuts.map((s) => (
          <button
            key={s.emoji}
            onClick={s.onClick}
            className="menu-tile min-h-16 px-3 rounded-2xl bg-white text-left flex items-center gap-3 cursor-pointer"
            style={{ ["--edge" as string]: TONES[s.tone].edge, borderColor: TONES[s.tone].edge }}
          >
            <FunIcon emoji={s.emoji} tone={s.tone} size="sm" />
            <span className="text-sm font-extrabold text-navy leading-tight">{s.label}</span>
          </button>
        ))}
        <button
          onClick={onReset}
          className="menu-tile min-h-16 px-3 rounded-2xl bg-white text-left flex items-center gap-3 cursor-pointer"
          style={{ ["--edge" as string]: "#f3b0c9" }}
        >
          <FunIcon emoji="🔄" tone="pink" size="sm" />
          <span className="text-sm font-extrabold text-navy leading-tight">Làm lại từ đầu</span>
        </button>
      </div>
    </div>
  );
};
