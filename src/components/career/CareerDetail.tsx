import React from "react";
import { Bookmark, BookmarkCheck, Columns3, Bot, FlaskConical, ArrowLeft, Lightbulb } from "lucide-react";
import { Career, RIASEC, sameField } from "../../data/careerData";
import { CareerState, LEVEL_LABEL, Suggestion } from "../../lib/career";
import { Card, CodeBadge, GhostBtn, PrimaryBtn, SourceTag } from "./ui";
import { ExperiencePanel } from "./ExperiencePanel";

// ============================================================
// CHI TIẾT NGHỀ: lý do gợi ý, nghề tiêu biểu, hoạt động trải nghiệm (nếu có), nghề cùng lĩnh vực
// ============================================================

interface Props {
  career: Career;
  state: CareerState;
  suggestion?: Suggestion; // có nếu nghề nằm trong danh sách gợi ý
  hasQuiz: boolean;
  onBack: () => void;
  onOpenCareer: (id: string) => void;
  onToggleSave: (id: string) => void;
  onToggleCompare: (id: string) => void;
  update: (fn: (s: CareerState) => CareerState) => void;
  onAskAI: (c: Career) => void;
  onMoreCareers: () => void;
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

export const CareerDetail: React.FC<Props> = ({ career: c, state, suggestion, hasQuiz, onBack, onOpenCareer, onToggleSave, onToggleCompare, update, onAskAI, onMoreCareers, backLabel }) => {
  const saved = state.saved.includes(c.id);
  const comparing = state.compare.includes(c.id);
  const related = sameField(c);
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
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {c.codes.map((x) => (
              <CodeBadge key={x} code={x} full />
            ))}
          </div>
        </div>
        {c.profile ? (
          <p className="text-ink">
            <span className="font-semibold text-navy">Ví dụ nghề {c.profile.name.toLowerCase()}: </span>
            {c.profile.desc}
          </p>
        ) : (
          <p className="text-sm text-muted">Web chưa có mô tả cho ngành nghề này. Bạn có thể hỏi AI để tìm hiểu nghề này làm gì, cần học gì.</p>
        )}
        <div className="flex flex-wrap gap-2">
          <PrimaryBtn onClick={() => onToggleSave(c.id)} aria-pressed={saved}>
            {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            {saved ? "Đã lưu" : "Lưu nghề"}
          </PrimaryBtn>
          <GhostBtn onClick={() => onToggleCompare(c.id)} aria-pressed={comparing} disabled={!comparing && state.compare.length >= 3}>
            <Columns3 className="w-4 h-4" /> {comparing ? "Bỏ so sánh" : "Thêm vào so sánh"}
          </GhostBtn>
          {c.profile && (
            <GhostBtn onClick={toActivity}>
              <FlaskConical className="w-4 h-4" /> Thử hoạt động
            </GhostBtn>
          )}
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
            <Lightbulb className="w-4 h-4 text-clay-deep" /> Nghề này có hợp với bạn không?
          </h3>
          <SourceTag kind="web" />
        </div>
        {!hasQuiz ? (
          <p className="text-sm text-muted">Bạn chưa làm phiếu tự đánh giá, nên web chưa so được nghề này với bạn.</p>
        ) : suggestion ? (
          <>
            <p className="text-sm font-bold text-clay-deep">{LEVEL_LABEL[suggestion.level]}</p>
            <ul className="text-sm text-ink list-disc pl-5 space-y-1">
              {suggestion.reasons.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-sm text-ink">
            Nhóm của nghề này ({c.codes.map((x) => RIASEC[x].name).join(", ")}) chưa nằm trong 3 nhóm cao của bạn, nên web không xếp vào danh sách gợi ý. Bạn vẫn
            hoàn toàn có thể tìm hiểu nếu thấy thích.
          </p>
        )}
      </Card>

      {c.profile && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="space-y-4">
            <p className="text-xs font-semibold text-muted">Nghề tiêu biểu: {c.profile.name}</p>
            <Block title="Hoạt động tiêu biểu" items={c.profile.activities} />
            <Block title="Kỹ năng thường dùng" items={c.profile.skills} />
          </Card>
          <Card className="space-y-4">
            <Block title="Môn học hoặc kiến thức liên quan" items={c.profile.subjects} />
          </Card>
        </div>
      )}

      {c.profile && <ExperiencePanel career={c} state={state} update={update} onMoreCareers={onMoreCareers} />}

      {related.length > 0 && (
        <Card className="space-y-2">
          <h4 className="text-sm font-bold text-navy">Các nghề cùng lĩnh vực {c.field.toLowerCase()}</h4>
          <div className="flex flex-wrap gap-2">
            {related.map((r) => (
              <button key={r.id} onClick={() => onOpenCareer(r.id)} className="min-h-10 px-3.5 rounded-full bg-clay-soft hover:bg-clay-soft text-navy text-sm font-medium cursor-pointer">
                {r.name}
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
