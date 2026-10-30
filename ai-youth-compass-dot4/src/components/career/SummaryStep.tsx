import React from "react";
import { ArrowRight, Pencil, HelpCircle, Bookmark, BookmarkCheck } from "lucide-react";
import { CAREERS, RIASEC, RIASEC_ORDER } from "../../data/careerData";
import { CareerState, ChatMsg, Scores, Suggestion, isFlat, topCodes, unclearPoints } from "../../lib/career";
import { Card, CodeBadge, GhostBtn, PrimaryBtn, SourceTag } from "./ui";
import { CareerChat } from "./CareerChat";

// ============================================================
// BƯỚC 2: TỔNG HỢP SỞ THÍCH
// Tách rõ: điều em đã chọn / điều web tính ra / điều AI gợi ý
// ============================================================

interface Props {
  state: CareerState;
  scores: Scores;
  suggestions: Suggestion[];
  grade: string;
  context: string;
  onEditQuiz: () => void;
  onOpenCareer: (id: string) => void;
  onToggleSave: (id: string) => void;
  onGoCatalog: () => void;
  onChatChange: (m: ChatMsg[]) => void;
}

const List: React.FC<{ title: string; items: string[]; empty: string }> = ({ title, items, empty }) => (
  <div>
    <div className="text-xs font-semibold text-muted mb-1.5">{title}</div>
    {items.length ? (
      <div className="flex flex-wrap gap-1.5">
        {items.map((s) => (
          <span key={s} className="px-2.5 py-1 rounded-full bg-mist text-navy text-xs font-medium">
            {s}
          </span>
        ))}
      </div>
    ) : (
      <p className="text-sm text-muted italic">{empty}</p>
    )}
  </div>
);

export const SummaryStep: React.FC<Props> = ({ state, scores, suggestions, grade, context, onEditQuiz, onOpenCareer, onToggleSave, onGoCatalog, onChatChange }) => {
  const tops = topCodes(scores, 3);
  const unclear = unclearPoints(state, scores);
  const fields = Array.from(new Set(suggestions.slice(0, 6).map((s) => s.career.field)));
  const maxScore = Math.max(1, ...RIASEC_ORDER.map((c) => scores[c].score));

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-teal-soft/60 border border-teal-soft text-sm text-navy">
        Kết quả này giúp bạn <b>khám phá</b>, không phải để kết luận bạn hợp nghề nào. Sở thích có thể thay đổi khi bạn trải nghiệm thêm.
      </div>

      {/* Sở thích nổi bật + biểu đồ 6 nhóm */}
      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-extrabold text-navy">Sở thích nổi bật</h3>
          <SourceTag kind="web" />
        </div>
        {tops.length && !isFlat(scores) ? (
          <div className="grid sm:grid-cols-3 gap-2.5">
            {tops.map((c, i) => (
              <div key={c} className="p-3.5 rounded-xl bg-cream border border-line">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted">#{i + 1}</span>
                  <CodeBadge code={c} full />
                </div>
                <p className="text-sm text-ink mt-2">{RIASEC[c].like}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-navy">Chưa thấy nhóm nào nổi bật rõ: điểm các nhóm khá gần nhau hoặc đều thấp. Điều này rất bình thường; bạn có thể xem nhiều nhóm nghề và thử vài hoạt động.</p>
        )}

        <div className="space-y-2 pt-1" aria-label="Điểm 6 nhóm sở thích">
          {RIASEC_ORDER.map((c) => (
            <div key={c} className="grid grid-cols-[6.5rem_1fr_3rem] items-center gap-2 text-sm">
              <span className="font-semibold text-ink truncate">
                {c} · {RIASEC[c].name}
              </span>
              <div className="h-3 rounded-full bg-mist overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${tops.includes(c) ? "bg-teal" : "bg-navy-soft/50"}`}
                  style={{ width: `${(scores[c].score / Math.max(20, maxScore)) * 100}%` }}
                />
              </div>
              <span className="text-right tabular-nums text-muted">{scores[c].answered ? `${scores[c].score}/20` : "–"}</span>
            </div>
          ))}
        </div>
        <GhostBtn onClick={onEditQuiz}>
          <Pencil className="w-4 h-4" /> Sửa câu trả lời
        </GhostBtn>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-extrabold text-navy">Về bạn</h3>
            <SourceTag kind="user" />
          </div>
          <List title="Điểm mạnh bạn tự nhận" items={state.profile.strengths} empty="Bạn chưa chọn." />
          <List title="Môn học bạn thích" items={state.profile.subjects} empty="Bạn chưa chọn." />
          <List title="Nơi muốn làm việc" items={state.profile.environments} empty="Bạn chưa chọn." />
          <List title="Kỹ năng muốn rèn thêm" items={state.profile.skills} empty="Bạn chưa chọn." />
        </Card>

        <Card className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-extrabold text-navy">Lĩnh vực có thể tìm hiểu</h3>
            <SourceTag kind="web" />
          </div>
          <List title="Từ các nghề hợp với sở thích của bạn" items={fields} empty="Chưa đủ dữ liệu." />
          <div>
            <div className="text-xs font-semibold text-muted mb-1.5 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> Những điều còn chưa rõ
            </div>
            {unclear.length ? (
              <ul className="space-y-1 text-sm text-ink list-disc pl-5">
                {unclear.map((u) => (
                  <li key={u}>{u}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted italic">Không có.</p>
            )}
          </div>
        </Card>
      </div>

      {/* Nghề gợi ý */}
      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-extrabold text-navy">Nghề có thể khám phá</h3>
          <SourceTag kind="web" />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {suggestions.slice(0, 6).map(({ career, reasons }) => {
            const saved = state.saved.includes(career.id);
            return (
              <div key={career.id} className="p-4 rounded-xl border border-line bg-cream flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-bold text-navy">{career.name}</div>
                    <div className="flex gap-1 mt-1">
                      {career.codes.map((c) => (
                        <CodeBadge key={c} code={c} />
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleSave(career.id)}
                    aria-pressed={saved}
                    aria-label={saved ? `Bỏ lưu ${career.name}` : `Lưu ${career.name}`}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 cursor-pointer ${saved ? "bg-teal text-white border-teal" : "bg-white border-line text-muted hover:text-navy"}`}
                  >
                    {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>
                {reasons.length > 0 && (
                  <ul className="text-xs text-muted space-y-0.5 list-disc pl-4">
                    {reasons.slice(0, 2).map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                )}
                <button onClick={() => onOpenCareer(career.id)} className="mt-auto self-start min-h-10 text-sm font-semibold text-teal-deep hover:text-navy inline-flex items-center gap-1 cursor-pointer">
                  Xem chi tiết <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
        <PrimaryBtn onClick={onGoCatalog}>
          Xem toàn bộ {CAREERS.length} nghề <ArrowRight className="w-4 h-4" />
        </PrimaryBtn>
      </Card>

      {/* AI */}
      <Card className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-extrabold text-navy">Trò chuyện với AI hướng nghiệp</h3>
          <SourceTag kind="ai" />
        </div>
        <CareerChat grade={grade} messages={state.chat} onChange={onChatChange} context={context} ready />
      </Card>
    </div>
  );
};
