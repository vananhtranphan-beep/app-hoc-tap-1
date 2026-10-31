import React from "react";
import { ClipboardList, MessagesSquare, ArrowRight, Sparkles, LayoutGrid, Bookmark, Target, RotateCcw } from "lucide-react";
import { CAREERS, INTEREST_ITEMS } from "../../data/careerData";
import { CareerState, answeredCount } from "../../lib/career";

// ============================================================
// TRANG ĐẦU HƯỚNG NGHIỆP: 2 lựa chọn
// 1. Khám phá bản thân qua khảo sát (khuyến khích, không bắt buộc)
// 2. Trò chuyện trực tiếp với AI (không cần làm khảo sát trước)
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
}

export const CareerHome: React.FC<Props> = ({ state, hasQuiz, onStartQuiz, onRestartQuiz, onOpenResult, onOpenChat, onOpenCatalog, onOpenSaved, onOpenPlan }) => {
  const done = answeredCount(state.answers);
  const inProgress = !hasQuiz && done > 0;

  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Lựa chọn 1 */}
        <section className="lift rise-1 relative rounded-2xl bg-clay-card border-2 border-clay p-5 sm:p-6 flex flex-col gap-4">
          <span className="absolute -top-3 left-5 px-2.5 py-0.5 rounded-full bg-clay-deep text-white text-xs font-bold inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Khuyến khích
          </span>
          <span className="w-14 h-14 rounded-2xl bg-clay-soft text-clay-deep flex items-center justify-center">
            <ClipboardList className="w-7 h-7" />
          </span>
          <div>
            <div className="text-xs font-bold text-clay-deep uppercase tracking-wide">Lựa chọn 1</div>
            <h3 className="text-xl font-extrabold text-navy mt-1">Khám phá bản thân qua khảo sát hướng nghiệp</h3>
            <p className="text-sm text-ink mt-2 leading-relaxed">
              Khoảng 5–7 phút với {INTEREST_ITEMS.length} câu về sở thích, kèm vài câu về môn học yêu thích, điểm mạnh bạn tự thấy và lĩnh vực quan tâm. Nhờ vậy AI hiểu bạn hơn và gợi ý nghề có cơ sở hơn.
            </p>
            <p className="text-xs text-muted mt-2">Không bắt buộc. Không cần tên thật hay thông tin cá nhân.</p>
          </div>
          <div className="mt-auto flex flex-wrap gap-2">
            {hasQuiz ? (
              <>
                <button onClick={onOpenResult} className="min-h-12 px-5 rounded-xl bg-clay-deep hover:bg-clay-dark text-white font-bold text-sm inline-flex items-center gap-2 cursor-pointer">
                  Xem kết quả của bạn <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={onRestartQuiz} className="min-h-12 px-4 rounded-xl bg-white border border-clay-soft hover:border-clay text-navy font-semibold text-sm inline-flex items-center gap-2 cursor-pointer">
                  <RotateCcw className="w-4 h-4" /> Sửa câu trả lời
                </button>
              </>
            ) : (
              <button onClick={onStartQuiz} className="min-h-12 px-5 rounded-xl bg-clay-deep hover:bg-clay-dark text-white font-bold text-sm inline-flex items-center gap-2 cursor-pointer">
                {inProgress ? `Làm tiếp (đã trả lời ${done}/${INTEREST_ITEMS.length} câu)` : "Bắt đầu khám phá"} <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </section>

        {/* Lựa chọn 2 */}
        <section className="lift rise-2 rounded-2xl bg-clay-card border border-clay-soft p-5 sm:p-6 flex flex-col gap-4">
          <span className="w-14 h-14 rounded-2xl bg-navy text-cream flex items-center justify-center">
            <MessagesSquare className="w-7 h-7" />
          </span>
          <div>
            <div className="text-xs font-bold text-clay-deep uppercase tracking-wide">Lựa chọn 2</div>
            <h3 className="text-xl font-extrabold text-navy mt-1">Trò chuyện trực tiếp với AI</h3>
            <p className="text-sm text-ink mt-2 leading-relaxed">
              Hỏi AI bất cứ điều gì về nghề nghiệp, ngành học, lĩnh vực công việc, sở thích, thế mạnh hay con đường sau lớp 9. Không cần làm khảo sát trước.
            </p>
            <p className="text-xs text-muted mt-2">AI có thể sai và không có số liệu thị trường mới nhất. Hãy hỏi thêm thầy cô, bố mẹ.</p>
          </div>
          <div className="mt-auto">
            <button onClick={onOpenChat} className="min-h-12 px-5 rounded-xl bg-navy hover:bg-navy-soft text-cream font-bold text-sm inline-flex items-center gap-2 cursor-pointer">
              Bắt đầu trò chuyện <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>

      {/* Lối tắt */}
      <div className="grid sm:grid-cols-3 gap-2">
        <button onClick={onOpenCatalog} className="min-h-14 px-4 rounded-xl bg-clay-card border border-clay-soft hover:border-clay text-left flex items-center gap-3 cursor-pointer">
          <LayoutGrid className="w-5 h-5 text-clay-deep shrink-0" />
          <span className="text-sm font-semibold text-navy">Xem tất cả {CAREERS.length} nghề</span>
        </button>
        <button onClick={onOpenSaved} className="min-h-14 px-4 rounded-xl bg-clay-card border border-clay-soft hover:border-clay text-left flex items-center gap-3 cursor-pointer">
          <Bookmark className="w-5 h-5 text-clay-deep shrink-0" />
          <span className="text-sm font-semibold text-navy">Nghề đã lưu ({state.saved.length})</span>
        </button>
        <button onClick={onOpenPlan} className="min-h-14 px-4 rounded-xl bg-clay-card border border-clay-soft hover:border-clay text-left flex items-center gap-3 cursor-pointer">
          <Target className="w-5 h-5 text-clay-deep shrink-0" />
          <span className="text-sm font-semibold text-navy">Kế hoạch khám phá ({state.plan.length})</span>
        </button>
      </div>
    </div>
  );
};
