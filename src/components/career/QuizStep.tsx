import React from "react";
import { ArrowLeft, ArrowRight, SkipForward } from "lucide-react";
import { ACTIVITIES, ENVIRONMENTS, INTEREST_ITEMS, LIKERT, ONET_LICENSE_URL, SKILLS_TO_GROW, STRENGTHS, SUBJECTS } from "../../data/careerData";
import { CareerState, answeredCount } from "../../lib/career";
import { Card, Chip, GhostBtn, PrimaryBtn } from "./ui";

// ============================================================
// BƯỚC 1: KHÁM PHÁ BẢN THÂN
// 30 câu sở thích (mỗi màn hình 1 câu) + trang câu hỏi thêm (không bắt buộc)
// ============================================================

type ProfileKey = keyof CareerState["profile"];

const EXTRA: { key: ProfileKey; title: string; options: string[] }[] = [
  { key: "subjects", title: "Môn học bạn thích", options: SUBJECTS },
  { key: "strengths", title: "Điểm mạnh bạn tự thấy ở mình", options: STRENGTHS },
  { key: "activities", title: "Hoạt động bạn hay làm lúc rảnh", options: ACTIVITIES },
  { key: "environments", title: "Nơi bạn muốn làm việc sau này", options: ENVIRONMENTS },
  { key: "skills", title: "Kỹ năng bạn muốn rèn thêm", options: SKILLS_TO_GROW },
];

const TOTAL = INTEREST_ITEMS.length;

interface Props {
  state: CareerState;
  update: (fn: (s: CareerState) => CareerState) => void;
  onFinish: () => void;
  onOpenAbout: () => void;
}

export const Attribution: React.FC<{ onOpenAbout: () => void }> = ({ onOpenAbout }) => (
  <p className="text-[11px] text-muted leading-relaxed">
    Phỏng theo O*NET® Interest Profiler (USDOL/ETA) ·{" "}
    <a href={ONET_LICENSE_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-navy">
      Giấy phép
    </a>{" "}
    ·{" "}
    <button onClick={onOpenAbout} className="underline hover:text-navy cursor-pointer">
      Về bộ câu hỏi này
    </button>
  </p>
);

export const QuizStep: React.FC<Props> = ({ state, update, onFinish, onOpenAbout }) => {
  const idx = Math.min(state.quizIndex, TOTAL);
  const onExtra = idx >= TOTAL;
  const item = INTEREST_ITEMS[idx];
  const done = answeredCount(state.answers);
  const progress = onExtra ? 100 : Math.round((idx / (TOTAL + 1)) * 100);

  const go = (i: number) => update((s) => ({ ...s, quizIndex: Math.max(0, Math.min(i, TOTAL)) }));
  const answer = (value: number | null) =>
    update((s) => ({ ...s, answers: { ...s.answers, [item.id]: value }, quizIndex: Math.min(idx + 1, TOTAL) }));
  const toggle = (key: ProfileKey, v: string) =>
    update((s) => {
      const list = s.profile[key];
      return { ...s, profile: { ...s.profile, [key]: list.includes(v) ? list.filter((x) => x !== v) : [...list, v] } };
    });

  return (
    <Card className="space-y-5">
      {/* Thanh tiến độ */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-semibold text-muted">
          <span>{onExtra ? "Câu hỏi thêm (không bắt buộc)" : `Câu ${idx + 1} / ${TOTAL}`}</span>
          <span>Đã trả lời {done}/{TOTAL}</span>
        </div>
        <div className="h-2 rounded-full bg-mist overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full bg-teal rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {!onExtra ? (
        <div key={item.id} className="space-y-5 animate-rise">
          <div>
            <p className="text-sm text-muted">Bạn thấy thích hay không thích làm việc này?</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-navy mt-1 leading-snug">{item.text}</h3>
            <p className="text-xs text-muted mt-2">Đừng nghĩ mình có giỏi việc đó không, chỉ cần thấy có thích hay không.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-1.5 sm:gap-2" role="radiogroup" aria-label={item.text}>
            {LIKERT.map((o) => {
              const selected = state.answers[item.id] === o.value;
              return (
                <button
                  key={o.value}
                  role="radio"
                  aria-checked={selected}
                  onClick={() => answer(o.value)}
                  className={`min-h-12 px-3 rounded-xl border text-sm font-semibold transition cursor-pointer ${
                    selected ? "bg-navy border-navy text-cream" : "bg-white border-line text-ink hover:border-teal hover:bg-teal-soft/40"
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between gap-2">
            <GhostBtn onClick={() => go(idx - 1)} disabled={idx === 0}>
              <ArrowLeft className="w-4 h-4" /> Câu trước
            </GhostBtn>
            <button onClick={() => answer(null)} className="min-h-11 px-3 text-sm font-semibold text-muted hover:text-navy inline-flex items-center gap-1.5 cursor-pointer">
              Bỏ qua <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-rise">
          <div>
            <h3 className="text-xl font-extrabold text-navy">Thêm một chút về bạn</h3>
            <p className="text-sm text-muted mt-1">Chọn bao nhiêu cũng được, hoặc bỏ trống. Thông tin này giúp gợi ý sát hơn.</p>
          </div>
          {EXTRA.map((g) => (
            <div key={g.key} className="space-y-2">
              <h4 className="text-sm font-bold text-ink">{g.title}</h4>
              <div className="flex flex-wrap gap-2">
                {g.options.map((o) => (
                  <Chip key={o} active={state.profile[g.key].includes(o)} onClick={() => toggle(g.key, o)}>
                    {o}
                  </Chip>
                ))}
              </div>
            </div>
          ))}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-line">
            <GhostBtn onClick={() => go(TOTAL - 1)}>
              <ArrowLeft className="w-4 h-4" /> Xem lại câu 30
            </GhostBtn>
            <PrimaryBtn onClick={onFinish} disabled={done < 10}>
              Xem tổng hợp <ArrowRight className="w-4 h-4" />
            </PrimaryBtn>
          </div>
          {done < 10 && <p className="text-xs text-amber-800">Bạn cần trả lời ít nhất 10 câu sở thích để web tổng hợp được. Bấm "Xem lại" để trả lời thêm.</p>}
        </div>
      )}

      <Attribution onOpenAbout={onOpenAbout} />
    </Card>
  );
};
