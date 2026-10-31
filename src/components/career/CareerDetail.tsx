import React from "react";
import { Bookmark, BookmarkCheck, Columns3, Bot, FlaskConical, ArrowLeft, Lightbulb } from "lucide-react";
import { Career, RIASEC, careerById } from "../../data/careerData";
import { CareerState, Suggestion } from "../../lib/career";
import { Card, CodeBadge, GhostBtn, PrimaryBtn, SourceTag } from "./ui";
import { ExperiencePanel } from "./ExperiencePanel";

// ============================================================
// CHI TIẾT NGHỀ (có hoạt động trải nghiệm ngay trong trang)
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
  update: (fn: (s: CareerState) => CareerState) => void;
  onAskAI: (c: Career) => void;
  backLabel: string;
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

export const CareerDetail: React.FC<Props> = ({ career: c, state, suggestion, hasQuiz, onBack, onOpenCareer, onToggleSave, onToggleCompare, update, onAskAI, backLabel }) => {
  const saved = state.saved.includes(c.id);
  const comparing = state.compare.includes(c.id);
  const toActivity = () => document.getElementById("trai-nghiem")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="space-y-4">
      <GhostBtn onClick={onBack}>
        <ArrowLeft className="w-4 h-4" /> {backLabel}
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
          <GhostBtn onClick={toActivity}>
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
            <Lightbulb className="w-4 h-4 text-clay-deep" /> Vì sao gợi ý nghề này cho bạn
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
                  <button key={r!.id} onClick={() => onOpenCareer(r!.id)} className="min-h-10 px-3.5 rounded-full bg-clay-soft hover:bg-clay-soft text-navy text-sm font-medium cursor-pointer">
                    {r!.name}
                  </button>
                ))}
            </div>
          </div>
        </Card>
      </div>

      <ExperiencePanel career={c} state={state} update={update} />
    </div>
  );
};
