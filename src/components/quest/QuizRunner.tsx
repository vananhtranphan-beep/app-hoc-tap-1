import React from "react";
import { ArrowLeft, ArrowRight, Check, X, Flag, Shuffle, Bot, RefreshCw, Pause, Loader2 } from "lucide-react";
import { MathMarkdown } from "../MathMarkdown";
import { LEVELS, MathChapter } from "../../data/mathMap";
import { QuestRun } from "../../lib/quest";

// ============================================================
// LÀM BÀI TRẮC NGHIỆM DO AI TẠO (từng câu một)
// Chọn đáp án → thấy ngay đúng/sai + lời giải. Có thể đổi câu (trước khi trả lời), báo câu sai,
// hỏi Gia sư AI về câu đó, tạo bộ câu hỏi mới, tạm dừng.
// ============================================================

interface Props {
  run: QuestRun;
  chapter: MathChapter;
  busy: string | null; // "swap" | "new" | null
  onPick: (opt: number) => void;
  onGo: (index: number) => void;
  onSwap: () => void;
  onReport: () => void;
  onNewSet: () => void;
  onPause: () => void;
  onFinish: () => void;
  onAskTutor: () => void;
}

const LETTERS = ["A", "B", "C", "D"];

export const QuizRunner: React.FC<Props> = ({ run, chapter, busy, onPick, onGo, onSwap, onReport, onNewSet, onPause, onFinish, onAskTutor }) => {
  const i = run.index;
  const q = run.questions[i];
  const pick = run.picks[i];
  const answered = pick !== null && pick !== undefined;
  const reported = run.reported.includes(q.id);
  const allDone = run.picks.every((p, k) => p !== null || run.reported.includes(run.questions[k].id));
  const level = LEVELS.find((l) => l.id === run.level);

  return (
    <section id="quest-runner" className="rounded-2xl bg-white border border-sky-line p-4 sm:p-6 space-y-5 scroll-mt-24 animate-rise">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-bold text-grape uppercase tracking-wide">
            Toán {run.grade} · {chapter.no} · Mức {level?.name}
            {run.review ? " · Ôn lại phần sai" : ""}
          </div>
          <h3 className="text-lg font-extrabold text-navy leading-snug">{chapter.title}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={onNewSet} disabled={!!busy} className="min-h-10 px-3 rounded-xl bg-sky-soft hover:bg-lilac text-ocean text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
            {busy === "new" ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} Tạo bộ câu hỏi mới
          </button>
          <button onClick={onPause} className="min-h-10 px-3 rounded-xl bg-white border border-sky-line hover:border-ocean text-navy text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer">
            <Pause className="w-4 h-4" /> Tạm dừng
          </button>
        </div>
      </div>

      {/* Tiến độ lượt làm */}
      <div className="flex gap-1.5" aria-label={`Câu ${i + 1} trên ${run.questions.length}`}>
        {run.questions.map((qq, k) => {
          const p = run.picks[k];
          const rep = run.reported.includes(qq.id);
          const cls = rep ? "bg-line" : p === null ? (k === i ? "bg-ocean/40" : "bg-sky-soft") : p === qq.answer ? "bg-emerald-500" : "bg-rose-400";
          return <button key={qq.id} onClick={() => onGo(k)} aria-label={`Đến câu ${k + 1}`} className={`h-2.5 flex-1 rounded-full cursor-pointer ${cls} ${k === i ? "ring-2 ring-ocean ring-offset-1" : ""}`} />;
        })}
      </div>

      <div key={q.id} className="space-y-4 animate-rise">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded-full bg-lilac text-grape font-bold">
            Câu {i + 1}/{run.questions.length}
          </span>
          {q.kind && <span className="px-2 py-0.5 rounded-full bg-sky-soft text-ocean font-semibold">{q.kind}</span>}
        </div>
        <div className="text-base sm:text-lg font-semibold text-navy">
          <MathMarkdown>{q.q}</MathMarkdown>
        </div>
        <div className="grid gap-2" role="radiogroup" aria-label="Các lựa chọn">
          {q.options.map((o, k) => {
            const isPick = pick === k;
            const isRight = k === q.answer;
            const state = !answered ? "idle" : isRight ? "right" : isPick ? "wrong" : "dim";
            return (
              <button
                key={k}
                role="radio"
                aria-checked={isPick}
                disabled={answered || reported}
                onClick={() => onPick(k)}
                className={`min-h-12 px-3 py-2 rounded-xl border text-left text-sm flex items-start gap-3 transition cursor-pointer disabled:cursor-default ${
                  state === "right"
                    ? "bg-emerald-50 border-emerald-400 text-emerald-950"
                    : state === "wrong"
                    ? "bg-rose-50 border-rose-300 text-rose-950"
                    : state === "dim"
                    ? "bg-white border-sky-line text-muted"
                    : "bg-white border-sky-line text-ink hover:border-ocean hover:bg-sky-bg"
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 ${
                    state === "right" ? "bg-emerald-500 text-white" : state === "wrong" ? "bg-rose-500 text-white" : "bg-sky-soft text-ocean"
                  }`}
                >
                  {state === "right" ? <Check className="w-4 h-4" /> : state === "wrong" ? <X className="w-4 h-4" /> : LETTERS[k]}
                </span>
                <span className="min-w-0 pt-0.5">
                  <MathMarkdown>{o}</MathMarkdown>
                </span>
              </button>
            );
          })}
        </div>

        {answered && (
          <div role="status" className={`p-4 rounded-xl border text-sm space-y-1.5 ${pick === q.answer ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
            <div className="font-bold text-navy">{pick === q.answer ? "Chính xác!" : `Chưa đúng. Đáp án đúng là ${LETTERS[q.answer]}.`}</div>
            <div className="text-ink">
              <MathMarkdown>{q.explain}</MathMarkdown>
            </div>
          </div>
        )}
        {reported && <p className="text-sm text-muted">Bạn đã báo câu này có vấn đề. Câu này không tính điểm. Cảm ơn bạn!</p>}

        <div className="flex flex-wrap gap-2">
          {!answered && !reported && (
            <button onClick={onSwap} disabled={!!busy} className="min-h-10 px-3 rounded-xl bg-white border border-sky-line hover:border-ocean text-navy text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
              {busy === "swap" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shuffle className="w-4 h-4" />} Đổi câu hỏi
            </button>
          )}
          {answered && (
            <button onClick={onAskTutor} className="min-h-10 px-3 rounded-xl bg-white border border-sky-line hover:border-ocean text-navy text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer">
              <Bot className="w-4 h-4 text-grape" /> Hỏi Gia sư AI về câu này
            </button>
          )}
          {!reported && (
            <button onClick={onReport} className="min-h-10 px-3 rounded-xl text-muted hover:text-rose-700 text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer">
              <Flag className="w-4 h-4" /> Báo câu hỏi sai
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-2 border-t border-sky-soft">
        <button onClick={() => onGo(i - 1)} disabled={i === 0} className="min-h-11 px-4 rounded-xl bg-white border border-sky-line hover:border-ocean text-navy text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-40">
          <ArrowLeft className="w-4 h-4" /> Câu trước
        </button>
        {i < run.questions.length - 1 ? (
          <button onClick={() => onGo(i + 1)} className="min-h-11 px-5 rounded-xl bg-ocean hover:bg-ocean-dark text-white text-sm font-bold inline-flex items-center gap-1.5 cursor-pointer">
            Câu tiếp <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={onFinish} disabled={!allDone} className="min-h-11 px-5 rounded-xl bg-grape hover:bg-[#54468f] text-white text-sm font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
            Xem kết quả <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
      {!allDone && i === run.questions.length - 1 && <p className="text-xs text-muted text-right">Trả lời hết các câu (hoặc báo câu sai) để xem kết quả.</p>}
      <p className="text-xs text-muted">Câu hỏi do AI tạo và đã được AI giải lại để kiểm tra đáp án, nhưng vẫn có thể sai. Thấy câu nào có vấn đề, bạn bấm "Báo câu hỏi sai".</p>
    </section>
  );
};
