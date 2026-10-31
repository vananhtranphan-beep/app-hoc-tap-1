import React, { useEffect, useMemo, useState } from "react";
import { Map as MapIcon, Play, RotateCcw, Bot, Trophy, BookOpenCheck, Clock, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { LEVELS, MATH_GRADES, MathChapter, QUESTIONS_PER_RUN, chapterById, gradeData } from "../../data/mathMap";
import { QuestState, QuizQuestion, finishRun, loadQuest, nodeStatus, rememberSeen, runScore, saveQuest } from "../../lib/quest";
import { QuestMap, spotsFor } from "./QuestMap";
import { QuizRunner } from "./QuizRunner";

// ============================================================
// BẢN ĐỒ CHINH PHỤC TRI THỨC – MÔN TOÁN
// Chọn lớp → bản đồ các chương SGK → chọn điểm đến → AI tạo 5 câu trắc nghiệm → làm bài
// → lưu kết quả, cập nhật trạng thái điểm đến. Cần trợ giúp: chuyển sang Gia sư AI kèm ngữ cảnh.
// AI chỉ được gọi khi em bấm bắt đầu / tạo bộ mới / đổi câu (không tự gọi khi mở trang).
// ============================================================

interface Props {
  userId?: string;
  grade?: string;
  onAskTutor: (question: string) => void;
}

interface Result {
  chapterId: string;
  score: number;
  total: number;
  level: number;
  nextLevel: number;
  firstDone: boolean;
  wrongs: string[];
  review?: boolean;
}

const TINTS: Record<string, string> = { "6": "#ffe7a3", "7": "#9fd3ff", "8": "#c7b8ff", "9": "#ffb3a7" };

async function fetchQuestions(body: Record<string, unknown>): Promise<QuizQuestion[]> {
  const r = await fetch("/api/tutor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: "quiz", ...body }) });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || !Array.isArray(data.questions) || !data.questions.length) throw new Error(data.error || "AI chưa tạo được câu hỏi");
  return data.questions;
}

const Chest: React.FC = () => (
  <svg viewBox="0 0 120 90" className="w-28 h-auto mx-auto" aria-hidden>
    <circle cx="60" cy="40" r="34" fill="#fff3b0" className="chest-shine" />
    <rect x="24" y="44" width="72" height="36" rx="6" fill="#b9733a" />
    <rect x="24" y="54" width="72" height="6" fill="#f2b84b" />
    <rect x="54" y="52" width="12" height="14" rx="2" fill="#f2b84b" />
    <g className="chest-lid">
      <path d="M24 44 Q24 24 60 24 Q96 24 96 44 Z" fill="#d18b47" />
      <rect x="24" y="40" width="72" height="5" fill="#f2b84b" />
    </g>
  </svg>
);

export const KnowledgeQuest: React.FC<Props> = ({ userId = "default", grade = "8", onAskTutor }) => {
  const [state, setState] = useState<QuestState>(() => loadQuest(userId));
  const [g, setG] = useState<string>(() => state.grade || grade);
  const data = gradeData(g);
  const [selectedId, setSelectedId] = useState<string | null>(() => state.run?.chapterId || data.chapters[0].id);
  const [level, setLevel] = useState<number>(1);
  const [busy, setBusy] = useState<string | null>(null); // "start" | "swap" | "new"
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [showRun, setShowRun] = useState(Boolean(state.run));

  useEffect(() => saveQuest(userId, state), [state, userId]);

  const selected = (selectedId && data.chapters.find((c) => c.id === selectedId)) || null;
  const spotIdx = selected ? data.chapters.indexOf(selected) : 0;
  const land = spotsFor(data.chapters.length)[spotIdx]?.land;
  const node = selected ? state.nodes[selected.id] : undefined;
  const run = state.run;
  const runChapter = run ? (chapterById(run.chapterId) as MathChapter | undefined) : undefined;

  useEffect(() => {
    setLevel(node?.level || 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const switchGrade = (ng: string) => {
    setG(ng);
    setState((s) => ({ ...s, grade: ng }));
    setSelectedId(gradeData(ng).chapters[0].id);
    setResult(null);
  };

  const scrollToRunner = () => setTimeout(() => document.getElementById("quest-runner")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);

  const start = async (c: MathChapter, lv: number, opts: { review?: boolean } = {}) => {
    setBusy(run ? "new" : "start");
    setError("");
    setResult(null);
    try {
      const qs = await fetchQuestions({
        grade: g,
        chapter: `${c.no}: ${c.title}`,
        lessons: c.lessons,
        level: lv,
        count: QUESTIONS_PER_RUN,
        avoid: state.seen[c.id] || [],
        focus: opts.review ? state.nodes[c.id]?.wrongs || [] : [],
      });
      setState((s) =>
        rememberSeen(
          { ...s, run: { chapterId: c.id, grade: g, level: lv, questions: qs, picks: qs.map(() => null), reported: [], index: 0, startedAt: new Date().toISOString(), review: opts.review } },
          c.id,
          qs
        )
      );
      setShowRun(true);
      scrollToRunner();
    } catch (e: any) {
      setError(`AI tạm chưa tạo được câu hỏi (${e.message}). Bạn thử lại sau ít phút nhé.`);
    } finally {
      setBusy(null);
    }
  };

  const swap = async () => {
    if (!run || !runChapter) return;
    setBusy("swap");
    setError("");
    try {
      const [nq] = await fetchQuestions({
        grade: run.grade,
        chapter: `${runChapter.no}: ${runChapter.title}`,
        lessons: runChapter.lessons,
        level: run.level,
        count: 1,
        avoid: [...(state.seen[run.chapterId] || []), ...run.questions.map((q) => q.q)],
      });
      setState((s) => {
        if (!s.run) return s;
        const questions = s.run.questions.map((q, k) => (k === s.run!.index ? nq : q));
        return rememberSeen({ ...s, run: { ...s.run, questions, picks: s.run.picks.map((p, k) => (k === s.run!.index ? null : p)) } }, s.run.chapterId, [nq]);
      });
    } catch (e: any) {
      setError(`Chưa đổi được câu hỏi (${e.message}). Bạn thử lại nhé.`);
    } finally {
      setBusy(null);
    }
  };

  const finish = () => {
    if (!run) return;
    const { score, total } = runScore(run);
    const before = state.nodes[run.chapterId];
    const next = finishRun(state);
    const after = next.nodes[run.chapterId];
    setState(next);
    setResult({ chapterId: run.chapterId, score, total, level: run.level, nextLevel: after.level, firstDone: after.done && !before?.done, wrongs: after.wrongs, review: run.review });
    setShowRun(false);
    setTimeout(() => document.getElementById("quest-result")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  const askAboutQuestion = () => {
    if (!run || !runChapter) return;
    const q = run.questions[run.index];
    const L = ["A", "B", "C", "D"];
    const pick = run.picks[run.index];
    onAskTutor(
      `Em đang học Toán ${run.grade}, ${runChapter.no}: ${runChapter.title}.\nCâu hỏi: ${q.q}\n${q.options.map((o, k) => `${L[k]}. ${o}`).join("\n")}\n` +
        (pick !== null ? `Em đã chọn ${L[pick]}, đáp án đúng là ${L[q.answer]}. ` : "") +
        "Thầy/cô giải thích lại giúp em từng bước theo cách khác, và cho em một ví dụ tương tự nhé."
    );
  };

  // ---------- Tiến độ học tập (số liệu thật từ các lượt đã làm) ----------
  const summary = useMemo(() => {
    const all = MATH_GRADES.flatMap((gd) => gd.chapters.map((c) => ({ ...c, grade: gd.grade, land: gd.land })));
    const withP = all.filter((c) => state.nodes[c.id]);
    const lands = MATH_GRADES.map((gd) => ({
      gd,
      done: gd.chapters.filter((c) => state.nodes[c.id]?.done).length,
      tried: gd.chapters.filter((c) => state.nodes[c.id]).length,
    })).filter((x) => x.tried > 0);
    const review = withP.filter((c) => {
      const n = state.nodes[c.id];
      return n.lastTotal > 0 && n.lastScore / n.lastTotal < 0.6;
    });
    const recent = [...withP].sort((a, b) => state.nodes[b.id].lastAt.localeCompare(state.nodes[a.id].lastAt)).slice(0, 3);
    return { lands, review, recent };
  }, [state.nodes]);

  const resultChapter = result ? chapterById(result.chapterId) : undefined;
  const ratio = result && result.total ? result.score / result.total : 0;

  return (
    <div className="space-y-5 pb-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-12 h-12 rounded-2xl bg-grape text-white flex items-center justify-center shrink-0">
            <MapIcon className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-2xl font-extrabold text-navy tracking-tight">Bản đồ chinh phục tri thức</h2>
            <p className="text-sm text-muted">Môn Toán · Mỗi điểm đến là một chương SGK Kết nối tri thức. Chọn điểm nào cũng được.</p>
          </div>
        </div>
        <div className="flex gap-1.5 p-1 rounded-2xl bg-sky-soft" role="radiogroup" aria-label="Chọn lớp">
          {MATH_GRADES.map((gd) => (
            <button
              key={gd.grade}
              role="radio"
              aria-checked={g === gd.grade}
              onClick={() => switchGrade(gd.grade)}
              className={`min-h-10 px-3.5 rounded-xl text-sm font-bold cursor-pointer ${g === gd.grade ? "bg-ocean text-white" : "text-ocean hover:bg-white"}`}
            >
              Toán {gd.grade}
            </button>
          ))}
        </div>
      </div>

      {/* Tiến độ */}
      <section className="rounded-2xl bg-white border border-sky-line p-4 sm:p-5">
        <h3 className="font-bold text-navy flex items-center gap-2 mb-3">
          <Trophy className="w-5 h-5 text-grape" /> Tiến độ của bạn
        </h3>
        {summary.lands.length === 0 && !run ? (
          <p className="text-sm text-muted">Chưa có lượt khám phá nào. Chọn một điểm đến trên bản đồ và bấm "Bắt đầu khám phá" nhé.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <div>
              <div className="text-xs font-semibold text-muted mb-1">Vùng đất đã khám phá</div>
              {summary.lands.length ? (
                <ul className="space-y-0.5">
                  {summary.lands.map(({ gd, done }) => (
                    <li key={gd.grade} className="text-ink">
                      Toán {gd.grade}: <b>{done}</b>/{gd.chapters.length} chương hoàn thành
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">Chưa có</p>
              )}
            </div>
            <div>
              <div className="text-xs font-semibold text-muted mb-1">Đang học dở</div>
              {run && runChapter ? (
                <button onClick={() => (setG(run.grade), setSelectedId(run.chapterId), setShowRun(true), scrollToRunner())} className="text-left text-ocean font-semibold hover:underline cursor-pointer">
                  Toán {run.grade}, {runChapter.no}: câu {run.index + 1}/{run.questions.length}
                </button>
              ) : (
                <p className="text-muted">Không có</p>
              )}
            </div>
            <div>
              <div className="text-xs font-semibold text-muted mb-1">Kết quả gần đây</div>
              {summary.recent.length ? (
                <ul className="space-y-0.5">
                  {summary.recent.map((c) => (
                    <li key={c.id} className="text-ink">
                      Toán {c.grade}, {c.no}: {state.nodes[c.id].lastScore}/{state.nodes[c.id].lastTotal}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">Chưa có</p>
              )}
            </div>
            <div>
              <div className="text-xs font-semibold text-muted mb-1">Nên ôn lại</div>
              {summary.review.length ? (
                <ul className="space-y-0.5">
                  {summary.review.map((c) => (
                    <li key={c.id}>
                      <button onClick={() => (switchGrade(c.grade), setSelectedId(c.id))} className="text-left text-ocean hover:underline cursor-pointer">
                        Toán {c.grade}, {c.no}: {c.title}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">Chưa có</p>
              )}
            </div>
          </div>
        )}
      </section>

      <div>
        <div className="flex items-baseline justify-between gap-2 mb-2">
          <h3 className="font-extrabold text-navy">Toán {g}: {data.land}</h3>
          <span className="text-xs text-muted">Kéo để di chuyển · Nút +/− để phóng to</span>
        </div>
        <QuestMap key={g} chapters={data.chapters} statusOf={(id) => nodeStatus(state, id)} selectedId={selectedId} onSelect={(id) => (setSelectedId(id), setResult(null))} tint={TINTS[g]} />
      </div>

      {error && (
        <div role="alert" className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-900 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {error}
        </div>
      )}

      {/* Kết quả lượt vừa làm */}
      {result && resultChapter && (
        <section id="quest-result" className="rounded-2xl bg-white border border-sky-line p-5 sm:p-6 space-y-4 text-center scroll-mt-24 animate-rise">
          {(result.firstDone || ratio >= 0.8) && <Chest />}
          <div>
            <div className="text-xs font-bold text-grape uppercase tracking-wide">
              Toán {resultChapter.grade}, {resultChapter.no}
            </div>
            <h3 className="text-2xl font-extrabold text-navy mt-1">
              Bạn làm đúng {result.score}/{result.total} câu
            </h3>
            <p className="text-sm text-ink mt-2 max-w-xl mx-auto">
              {result.firstDone
                ? "Tuyệt vời! Bạn đã chinh phục điểm đến này, rương kho báu đã mở và con đường phía trước sáng lên."
                : ratio >= 0.8
                ? "Rất tốt! Bạn nắm chắc chương này."
                : ratio >= 0.5
                ? "Khá tốt! Còn vài chỗ chưa chắc, ôn lại một chút là ổn."
                : "Không sao cả, một lượt làm bài chưa nói lên năng lực của bạn. Mình ôn lại phần sai bằng những câu dễ hơn nhé."}
            </p>
            {result.nextLevel !== result.level && (
              <p className="text-sm font-semibold text-ocean mt-1">
                Gợi ý lượt sau: mức {LEVELS.find((l) => l.id === result.nextLevel)?.name} ({LEVELS.find((l) => l.id === result.nextLevel)?.hint.toLowerCase()})
              </p>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <button onClick={() => start(resultChapter, result.nextLevel)} disabled={!!busy} className="min-h-11 px-4 rounded-xl bg-ocean hover:bg-ocean-dark text-white text-sm font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />} Làm lại thử thách (mức {LEVELS.find((l) => l.id === result.nextLevel)?.name})
            </button>
            {result.wrongs.length > 0 && (
              <button onClick={() => start(resultChapter, Math.max(1, result.level - 1), { review: true })} disabled={!!busy} className="min-h-11 px-4 rounded-xl bg-lilac hover:bg-sky-soft text-grape text-sm font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
                <BookOpenCheck className="w-4 h-4" /> Ôn lại phần làm sai
              </button>
            )}
            {result.wrongs.length > 0 && (
              <button
                onClick={() =>
                  onAskTutor(
                    `Em vừa làm bài Toán ${resultChapter.grade}, ${resultChapter.no}: ${resultChapter.title} và làm sai các câu sau:\n${result.wrongs.map((w, k) => `${k + 1}. ${w}`).join("\n")}\nThầy/cô giải thích lại kiến thức cần dùng theo cách dễ hiểu, có ví dụ trực quan giúp em nhé.`
                  )
                }
                className="min-h-11 px-4 rounded-xl bg-white border border-sky-line hover:border-ocean text-navy text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Bot className="w-4 h-4 text-grape" /> Nhờ Gia sư AI giảng lại phần sai
              </button>
            )}
          </div>
        </section>
      )}

      {/* Đang làm bài */}
      {run && runChapter && showRun && (
        <QuizRunner
          run={run}
          chapter={runChapter}
          busy={busy === "swap" || busy === "new" ? busy : null}
          onPick={(opt) => setState((s) => (s.run ? { ...s, run: { ...s.run, picks: s.run.picks.map((p, k) => (k === s.run!.index ? opt : p)) } } : s))}
          onGo={(index) => setState((s) => (s.run ? { ...s, run: { ...s.run, index: Math.max(0, Math.min(index, s.run.questions.length - 1)) } } : s))}
          onSwap={swap}
          onReport={() =>
            setState((s) => {
              if (!s.run) return s;
              const q = s.run.questions[s.run.index];
              return { ...s, run: { ...s.run, reported: [...s.run.reported, q.id] }, reports: [...s.reports, { chapterId: s.run.chapterId, q: q.q, at: new Date().toISOString() }].slice(-100) };
            })
          }
          onNewSet={() => {
            if (run.picks.some((p) => p !== null) && !window.confirm("Tạo bộ câu hỏi mới? Các câu đã làm trong lượt này sẽ không được tính.")) return;
            start(runChapter, run.level, { review: run.review });
          }}
          onPause={() => setShowRun(false)}
          onFinish={finish}
          onAskTutor={askAboutQuestion}
        />
      )}

      {/* Thông tin điểm đến đang chọn */}
      {selected && !(run && showRun && run.chapterId === selected.id) && (
        <section className="rounded-2xl bg-white border border-sky-line p-5 sm:p-6 grid lg:grid-cols-[1.3fr_1fr] gap-5">
          <div className="space-y-3">
            <div>
              <div className="text-xs font-bold text-grape uppercase tracking-wide">
                {land} · {selected.no}
              </div>
              <h3 className="text-xl font-extrabold text-navy mt-1">{selected.title}</h3>
            </div>
            <div className="text-sm text-ink">
              <div className="text-xs font-semibold text-muted mb-1">Các bài trong chương</div>
              <ul className="list-disc pl-5 space-y-0.5">
                {selected.lessons.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-muted">
              <span className="inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-grape" /> {nodeStatus(state, selected.id) === "done" ? "Đã hoàn thành" : nodeStatus(state, selected.id) === "doing" ? "Đang khám phá" : "Chưa khám phá"}
              </span>
              {node && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {node.attempts} lượt · tốt nhất {Math.round(node.best * 100)}%
                </span>
              )}
            </div>
          </div>
          <div className="space-y-3 p-4 rounded-xl bg-sky-bg border border-sky-soft">
            <div>
              <div className="text-sm font-bold text-navy mb-1.5">Mức độ khó</div>
              <div className="grid grid-cols-3 gap-1.5" role="radiogroup" aria-label="Mức độ khó">
                {LEVELS.map((l) => (
                  <button
                    key={l.id}
                    role="radio"
                    aria-checked={level === l.id}
                    onClick={() => setLevel(l.id)}
                    className={`min-h-11 rounded-xl text-sm font-bold border cursor-pointer ${level === l.id ? "bg-grape border-grape text-white" : "bg-white border-sky-line text-navy hover:border-grape"}`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted mt-1.5">{LEVELS.find((l) => l.id === level)?.hint}</p>
            </div>
            <p className="text-sm text-ink">
              Số câu dự kiến: <b>{QUESTIONS_PER_RUN} câu trắc nghiệm</b> do AI tạo mới mỗi lượt.
            </p>
            {run && run.chapterId === selected.id ? (
              <button onClick={() => (setShowRun(true), scrollToRunner())} className="w-full min-h-12 rounded-xl bg-ocean hover:bg-ocean-dark text-white font-bold inline-flex items-center justify-center gap-2 cursor-pointer">
                <Play className="w-4 h-4" /> Tiếp tục lượt đang làm
              </button>
            ) : (
              <button onClick={() => start(selected, level)} disabled={!!busy} className="w-full min-h-12 rounded-xl bg-ocean hover:bg-ocean-dark text-white font-bold inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60">
                {busy === "start" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />} {busy === "start" ? "AI đang soạn và kiểm tra câu hỏi..." : "Bắt đầu khám phá"}
              </button>
            )}
            {run && run.chapterId !== selected.id && <p className="text-xs text-muted">Bắt đầu chương này sẽ thay lượt đang làm dở ở chương khác.</p>}
            {node?.wrongs?.length ? (
              <button onClick={() => start(selected, Math.max(1, (node.level || 1) - 1), { review: true })} disabled={!!busy} className="w-full min-h-11 rounded-xl bg-lilac hover:bg-sky-soft text-grape text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
                <BookOpenCheck className="w-4 h-4" /> Ôn lại phần làm sai (câu tương tự, dễ hơn)
              </button>
            ) : null}
            <button
              onClick={() => onAskTutor(`Em đang học Toán ${g}, ${selected.no}: ${selected.title}. Thầy/cô tóm tắt giúp em kiến thức chính của chương này, kèm ví dụ dễ hiểu nhé.`)}
              className="w-full min-h-11 rounded-xl bg-white border border-sky-line hover:border-ocean text-navy text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Bot className="w-4 h-4 text-grape" /> Hỏi Gia sư AI về chương này
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
