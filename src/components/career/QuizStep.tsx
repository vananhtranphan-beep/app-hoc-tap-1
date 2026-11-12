import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ACTIVITIES, AFTER_GRADE9, INTEREST_ITEMS, LIKERT, SUBJECTS } from "../../data/careerData";
import { CareerState, answeredCount, isComplete } from "../../lib/career";
import { Card, Chip, GhostBtn, PrimaryBtn } from "./ui";

// ============================================================
// PHIẾU TỰ ĐÁNH GIÁ
// 18 câu theo Hình 4.2 SGK Công nghệ 9 (KNTT), mỗi màn hình 1 câu, không hiện tên nhóm.
// Phải trả lời đủ 18 câu (mỗi nhóm chỉ có 3 câu, bỏ 1 câu là điểm nhóm bị lệch).
// Sau đó là trang "Thêm về bạn" (không bắt buộc).
// ============================================================

type ListKey = "subjects" | "activities";

const LISTS: { key: ListKey; title: string; options: string[] }[] = [
  { key: "subjects", title: "Môn học bạn thích nhất", options: SUBJECTS },
  { key: "activities", title: "Lúc rảnh bạn hay làm gì?", options: ACTIVITIES },
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
    Câu hỏi dựa trên Hình 4.2, SGK Công nghệ 9 – Định hướng nghề nghiệp (Kết nối tri thức) · Nghề theo Trường ĐH Văn Lang ·{" "}
    <button onClick={onOpenAbout} className="underline hover:text-navy cursor-pointer">
      Nguồn và cách tính điểm
    </button>
  </p>
);

export const QuizStep: React.FC<Props> = ({ state, update, onFinish, onOpenAbout }) => {
  const idx = Math.min(state.quizIndex, TOTAL);
  const onExtra = idx >= TOTAL;
  const item = INTEREST_ITEMS[idx];
  const done = answeredCount(state.answers);
  const complete = isComplete(state.answers);
  const firstMissing = INTEREST_ITEMS.findIndex((i) => typeof state.answers[i.id] !== "number");
  const progress = onExtra ? 100 : Math.round((idx / (TOTAL + 1)) * 100);

  const go = (i: number) => update((s) => ({ ...s, quizIndex: Math.max(0, Math.min(i, TOTAL)) }));
  const answer = (value: number) =>
    update((s) => ({ ...s, answers: { ...s.answers, [item.id]: value }, quizIndex: Math.min(idx + 1, TOTAL) }));
  const toggle = (key: ListKey, v: string) =>
    update((s) => {
      const list = s.profile[key];
      return { ...s, profile: { ...s.profile, [key]: list.includes(v) ? list.filter((x) => x !== v) : [...list, v] } };
    });
  const setField = (key: "after9" | "dream", v: string) => update((s) => ({ ...s, profile: { ...s.profile, [key]: v } }));

  return (
    <Card className="space-y-5">
      {/* Thanh tiến độ */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-semibold text-muted">
          <span>{onExtra ? "Thêm về bạn (không bắt buộc)" : `Câu ${idx + 1} / ${TOTAL}`}</span>
          <span>
            Đã trả lời {done}/{TOTAL}
          </span>
        </div>
        <div className="h-2 rounded-full bg-clay-soft overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full bg-clay-deep rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {!onExtra ? (
        <div key={item.id} className="space-y-5 animate-rise">
          <div>
            <p className="text-sm text-muted">Câu này giống em đến mức nào?</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-navy mt-1 leading-snug">{item.text}</h3>
            <p className="text-xs text-muted mt-2">Chọn theo con người em hiện nay, không phải theo điều em mong muốn.</p>
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
                    selected ? "bg-navy border-navy text-cream" : "bg-white border-clay-soft text-ink hover:border-clay hover:bg-clay-soft/40"
                  }`}
                >
                  <span className="tabular-nums mr-1">{o.value}.</span> {o.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between gap-2">
            <GhostBtn onClick={() => go(idx - 1)} disabled={idx === 0}>
              <ArrowLeft className="w-4 h-4" /> Câu trước
            </GhostBtn>
            {typeof state.answers[item.id] === "number" && (
              <GhostBtn onClick={() => go(idx + 1)}>
                Câu sau <ArrowRight className="w-4 h-4" />
              </GhostBtn>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-rise">
          <div>
            <h3 className="text-xl font-extrabold text-navy">Thêm một chút về bạn</h3>
            <p className="text-sm text-muted mt-1">
              Không bắt buộc. Phần này không làm thay đổi điểm, chỉ giúp AI giải thích kết quả sát với bạn hơn.
            </p>
          </div>
          {LISTS.map((g) => (
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
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-ink">Sau lớp 9, em dự định</h4>
            <div className="flex flex-wrap gap-2">
              {AFTER_GRADE9.map((o) => (
                <Chip key={o} active={state.profile.after9 === o} onClick={() => setField("after9", state.profile.after9 === o ? "" : o)}>
                  {o}
                </Chip>
              ))}
            </div>
          </div>
          <label className="block space-y-2">
            <span className="text-sm font-bold text-ink">Nghề em từng mơ ước (nếu có)</span>
            <input
              value={state.profile.dream}
              onChange={(e) => setField("dream", e.target.value.slice(0, 200))}
              placeholder="VD: bác sĩ, kiến trúc sư... Không có thì để trống"
              className="w-full min-h-11 px-3 rounded-xl border border-clay-soft bg-white text-sm focus:outline-none focus:ring-2 focus:ring-clay"
            />
          </label>
          <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-clay-soft">
            <GhostBtn onClick={() => go(TOTAL - 1)}>
              <ArrowLeft className="w-4 h-4" /> Xem lại câu {TOTAL}
            </GhostBtn>
            <PrimaryBtn onClick={onFinish} disabled={!complete}>
              Xem kết quả <ArrowRight className="w-4 h-4" />
            </PrimaryBtn>
          </div>
          {!complete && (
            <p className="text-xs text-amber-800">
              Bạn cần trả lời đủ {TOTAL} câu thì web mới tính được điểm 6 nhóm.{" "}
              {firstMissing >= 0 && (
                <button onClick={() => go(firstMissing)} className="underline font-semibold cursor-pointer">
                  Đến câu {firstMissing + 1} còn thiếu
                </button>
              )}
            </p>
          )}
        </div>
      )}

      <Attribution onOpenAbout={onOpenAbout} />
    </Card>
  );
};
