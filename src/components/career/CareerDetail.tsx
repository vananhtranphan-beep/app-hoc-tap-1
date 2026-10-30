import React from "react";
import { Bookmark, BookmarkCheck, Columns3, Bot, FlaskConical, ArrowLeft, Clock, Lightbulb } from "lucide-react";
import { Career, RIASEC, careerById } from "../../data/careerData";
import { CareerState, Suggestion } from "../../lib/career";
import { Card, CodeBadge, GhostBtn, PrimaryBtn, SourceTag } from "./ui";

// ============================================================
// BƯỚC 4: CHI TIẾT NGHỀ
// ============================================================

interface Props {
  career: Career;
  state: CareerState;
  suggestion?: Suggestion; // có nếu nghề nằm trong nhóm gợi ý
  hasQuiz: boolean;
  onBack: () => void;
  onOpenCareer: (id: string) => void;
  onToggleSave: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onTryActivity: (id: string) => void;
  onAskAI: (c: Career) => void;
}

const Block: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <div>
    <h4 className="text-sm font-bold text-navy mb-1.5">{title}</h4>
    <ul className="space-y-1 text-sm text-ink list-disc pl-5">
      {items.map((x) => (
        <li key={x}>{x}</li>
      ))}
    </ul>
  </div>
);

export const CareerDetail: React.FC<Props> = ({ career: c, state, suggestion, hasQuiz, onBack, onOpenCareer, onToggleSave, onToggleCompare, onTryActivity, onAskAI }) => {
  const saved = state.saved.includes(c.id);
  const comparing = state.compare.includes(c.id);
  const exp = state.experiences[c.id];

  return (
    <div className="space-y-4">
      <GhostBtn onClick={onBack}>
        <ArrowLeft className="w-4 h-4" /> Danh sách nghề
      </GhostBtn>

      <Card className="space-y-4">
        <div>
          <div className="text-xs font-semibold text-muted">{c.field}</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight mt-0.5">{c.name}</h2>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {c.codes.map((x) => (
              <CodeBadge key={x} code={x} full />
            ))}
          </div>
        </div>
        <p className="text-ink">{c.desc}</p>
        <div className="flex flex-wrap gap-2">
          <PrimaryBtn onClick={() => onToggleSave(c.id)} aria-pressed={saved}>
            {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            {saved ? "Đã lưu" : "Lưu nghề"}
          </PrimaryBtn>
          <GhostBtn onClick={() => onToggleCompare(c.id)} aria-pressed={comparing} disabled={!comparing && state.compare.length >= 3}>
            <Columns3 className="w-4 h-4" /> {comparing ? "Bỏ so sánh" : "Thêm vào so sánh"}
          </GhostBtn>
          <GhostBtn onClick={() => onTryActivity(c.id)}>
            <FlaskConical className="w-4 h-4" /> Thử hoạt động
          </GhostBtn>
          <GhostBtn onClick={() => onAskAI(c)}>
            <Bot className="w-4 h-4" /> Hỏi AI về nghề này
          </GhostBtn>
        </div>
        {!comparing && state.compare.length >= 3 && <p className="text-xs text-muted">Bạn đã chọn đủ 3 nghề để so sánh.</p>}
      </Card>

      {/* Vì sao gợi ý */}
      <Card className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-extrabold text-navy flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-teal" /> Vì sao web gợi ý nghề này
          </h3>
          <SourceTag kind="web" />
        </div>
        {!hasQuiz ? (
          <p className="text-sm text-muted">Bạn chưa làm khảo sát sở thích, nên web chưa so được nghề này với bạn.</p>
        ) : suggestion && suggestion.reasons.length ? (
          <ul className="text-sm text-ink list-disc pl-5 space-y-1">
            {suggestion.reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ink">
            Nghề này chưa nằm trong nhóm gợi ý hàng đầu theo câu trả lời của bạn. Bạn vẫn hoàn toàn có thể tìm hiểu: nghề thuộc nhóm{" "}
            {c.codes.map((x) => RIASEC[x].name).join(", ")}.
          </p>
        )}
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="space-y-4">
          <Block title="Hoạt động tiêu biểu" items={c.activities} />
          <Block title="Kỹ năng thường dùng" items={c.skills} />
        </Card>
        <Card className="space-y-4">
          <Block title="Môn học hoặc kiến thức liên quan" items={c.subjects} />
          <div>
            <h4 className="text-sm font-bold text-navy mb-1.5">Các nghề gần với lĩnh vực này</h4>
            <div className="flex flex-wrap gap-2">
              {c.related
                .map((id) => careerById(id))
                .filter(Boolean)
                .map((r) => (
                  <button key={r!.id} onClick={() => onOpenCareer(r!.id)} className="min-h-10 px-3.5 rounded-full bg-mist hover:bg-teal-soft text-navy text-sm font-medium cursor-pointer">
                    {r!.name}
                  </button>
                ))}
            </div>
          </div>
        </Card>
      </div>

      <Card className="space-y-2">
        <h3 className="font-extrabold text-navy">Hoạt động trải nghiệm: {c.experience.title}</h3>
        <p className="text-sm text-ink">{c.experience.goal}</p>
        <p className="text-xs text-muted inline-flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" /> Khoảng {c.experience.minutes} phút
          {exp?.status === "done" ? " · Bạn đã hoàn thành" : exp?.status === "doing" ? " · Đang làm" : ""}
        </p>
        <div>
          <PrimaryBtn onClick={() => onTryActivity(c.id)}>
            <FlaskConical className="w-4 h-4" /> {exp ? "Mở hoạt động" : "Thử hoạt động"}
          </PrimaryBtn>
        </div>
      </Card>
    </div>
  );
};
