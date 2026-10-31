import React, { useEffect, useMemo, useState } from "react";
import { Bot, Compass, ArrowLeft } from "lucide-react";
import { Career, INTEREST_ITEMS, careerById } from "../data/careerData";
import {
  CareerState,
  ChatMsg,
  academicFirst,
  aiContext,
  answeredCount,
  careerDetailForAI,
  computeScores,
  loadCareerState,
  saveCareerState,
  suggestCareers,
} from "../lib/career";
import { CareerHome } from "./career/CareerHome";
import { HollandIntro } from "./career/HollandIntro";
import { QuizStep, Attribution } from "./career/QuizStep";
import { ResultView } from "./career/ResultView";
import { CatalogStep } from "./career/CatalogStep";
import { CareerDetail } from "./career/CareerDetail";
import { PlanStep } from "./career/PlanStep";
import { CareerChat } from "./career/CareerChat";
import { AboutQuestions } from "./career/AboutQuestions";

// ============================================================
// HƯỚNG NGHIỆP
// Trang đầu có 2 lựa chọn: (1) Khảo sát → giới thiệu Holland → câu hỏi → kết quả
//                            (2) Trò chuyện trực tiếp với AI (không cần khảo sát)
// Kết quả: nhận xét AI → chat → nút xem nghề → nhóm nghề gợi ý → chi tiết nghề (có trải nghiệm)
// Tiến độ lưu theo tài khoản (đồng bộ lên máy chủ khi đăng nhập).
// ============================================================

type View = "home" | "intro" | "quiz" | "result" | "catalog" | "detail" | "chat" | "plan";

interface Props {
  userId?: string;
  grade?: string;
}

const TITLES: Record<View, string> = {
  home: "",
  intro: "Giới thiệu khảo sát",
  quiz: "Khảo sát sở thích",
  result: "Kết quả của bạn",
  catalog: "Danh mục nghề",
  detail: "Chi tiết nghề",
  chat: "Trò chuyện với AI",
  plan: "Kế hoạch khám phá",
};

export const CareerGuidanceView: React.FC<Props> = ({ userId = "default", grade = "8" }) => {
  const [state, setState] = useState<CareerState>(() => loadCareerState(userId));
  const [view, setView] = useState<View>("home");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [detailFrom, setDetailFrom] = useState<View>("result");
  const [catalogFrom, setCatalogFrom] = useState<View>("home");
  const [catalogOpts, setCatalogOpts] = useState<{ compare?: boolean; filter?: "all" | "saved" | "rec" }>({});
  const [aboutOpen, setAboutOpen] = useState(false);
  const [prefill, setPrefill] = useState<{ text: string; extra?: string } | null>(null);

  useEffect(() => saveCareerState(userId, state), [state, userId]);

  const update = (fn: (s: CareerState) => CareerState) => setState(fn);
  const scores = useMemo(() => computeScores(state.answers), [state.answers]);
  const hasQuiz = Boolean(state.completedAt) && answeredCount(state.answers) >= 10;
  const suggestions = useMemo(() => (hasQuiz ? suggestCareers(state, scores, 9) : []), [hasQuiz, state, scores]);
  const recommendedIds = academicFirst(suggestions).map((s) => s.career.id);
  const context = useMemo(() => aiContext(state, scores, grade), [state, scores, grade]);

  const go = (v: View) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const openCareer = (id: string) => {
    setDetailFrom(view === "detail" ? detailFrom : view);
    setDetailId(id);
    go("detail");
  };
  const openCatalog = (opts: { compare?: boolean; filter?: "all" | "saved" | "rec" } = {}) => {
    setCatalogOpts(opts);
    if (view !== "catalog" && view !== "detail") setCatalogFrom(view);
    go("catalog");
  };
  const toggleSave = (id: string) =>
    update((s) => ({ ...s, saved: s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [...s.saved, id] }));
  const toggleCompare = (id: string) =>
    update((s) => ({
      ...s,
      compare: s.compare.includes(id) ? s.compare.filter((x) => x !== id) : s.compare.length >= 3 ? s.compare : [...s.compare, id],
    }));
  const setChat = (m: ChatMsg[]) => update((s) => ({ ...s, chat: m.slice(-40) }));
  const askAboutCareer = (c: Career) => {
    setPrefill({ text: `Mình muốn hỏi thêm về nghề ${c.name}: nghề này có hợp với mình không, và mình nên bắt đầu tìm hiểu từ đâu?`, extra: careerDetailForAI(c) });
    go("chat");
  };
  const startQuiz = () => go(answeredCount(state.answers) > 0 && !hasQuiz ? "quiz" : "intro");
  const editQuiz = () => {
    update((s) => ({ ...s, quizIndex: 0 }));
    go("quiz");
  };

  const detail = detailId ? careerById(detailId) : undefined;
  // Nút quay lại: về đúng màn hình trước đó
  const backTarget: View = view === "detail" ? detailFrom : view === "quiz" ? "intro" : view === "catalog" ? catalogFrom : "home";
  const backLabel = backTarget === "home" ? "Hướng nghiệp" : TITLES[backTarget];

  return (
    <div className="space-y-5 pb-6">
      {/* Đầu trang */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-12 h-12 rounded-2xl bg-clay-deep text-white flex items-center justify-center shrink-0">
            <Compass className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-2xl font-extrabold text-navy tracking-tight">
              Hướng nghiệp
              {TITLES[view] ? <span className="block sm:inline text-base sm:text-2xl text-clay-deep"><span className="hidden sm:inline"> · </span>{TITLES[view]}</span> : null}
            </h2>
            <p className="text-sm text-muted">Hiểu sở thích của mình, khám phá nghề, thử trải nghiệm nhỏ. Chưa cần chọn nghề ngay.</p>
          </div>
        </div>
      </div>

      {view !== "home" && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          {view !== "detail" ? (
            <button
              onClick={() => go(backTarget)}
              className="min-h-10 px-3.5 rounded-xl bg-clay-card border border-clay-soft hover:border-clay text-navy text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-clay-deep" /> {backLabel}
            </button>
          ) : (
            <span />
          )}
          {view !== "chat" && view !== "result" && (
            <button
              onClick={() => go("chat")}
              className="min-h-10 px-3.5 rounded-xl bg-clay-card border border-clay-soft hover:border-clay text-navy text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
            >
              <Bot className="w-4 h-4 text-clay-deep" /> Hỏi AI
            </button>
          )}
        </div>
      )}

      {view === "home" && (
        <CareerHome
          state={state}
          hasQuiz={hasQuiz}
          onStartQuiz={startQuiz}
          onRestartQuiz={editQuiz}
          onOpenResult={() => go("result")}
          onOpenChat={() => go("chat")}
          onOpenCatalog={() => openCatalog({ filter: "all" })}
          onOpenSaved={() => openCatalog({ filter: "saved" })}
          onOpenPlan={() => go("plan")}
        />
      )}

      {view === "intro" && (
        <HollandIntro
          onStart={() => go("quiz")}
          onOpenAbout={() => setAboutOpen(true)}
          resumeAt={answeredCount(state.answers) > 0 && !hasQuiz ? Math.min(state.quizIndex + 1, INTEREST_ITEMS.length) : undefined}
        />
      )}

      {view === "quiz" && (
        <QuizStep
          state={state}
          update={update}
          onOpenAbout={() => setAboutOpen(true)}
          onFinish={() => {
            update((s) => ({ ...s, completedAt: new Date().toISOString() }));
            go("result");
          }}
        />
      )}

      {view === "result" &&
        (hasQuiz ? (
          <ResultView
            state={state}
            scores={scores}
            suggestions={suggestions}
            grade={grade}
            context={context}
            update={update}
            onEditQuiz={editQuiz}
            onOpenCareer={openCareer}
            onToggleSave={toggleSave}
            onToggleCompare={toggleCompare}
            onOpenCompare={() => openCatalog({ compare: true, filter: "rec" })}
            onOpenCatalog={() => openCatalog({ filter: "all" })}
            onChatChange={setChat}
          />
        ) : (
          <section className="rounded-2xl bg-clay-card border border-clay-soft p-5 sm:p-6 space-y-3">
            <h3 className="text-lg font-extrabold text-navy">Chưa có kết quả</h3>
            <p className="text-sm text-muted">Bạn làm khảo sát ngắn (khoảng 5–7 phút) để có kết quả, hoặc trò chuyện trực tiếp với AI.</p>
            <button onClick={startQuiz} className="min-h-11 px-4 rounded-xl bg-clay-deep hover:bg-clay-dark text-white font-bold text-sm cursor-pointer">
              Bắt đầu khảo sát
            </button>
          </section>
        ))}

      {view === "catalog" && (
        <CatalogStep
          key={`${catalogOpts.compare}-${catalogOpts.filter}`}
          state={state}
          recommendedIds={recommendedIds}
          onOpenCareer={openCareer}
          onToggleSave={toggleSave}
          onToggleCompare={toggleCompare}
          onClearCompare={() => update((s) => ({ ...s, compare: [] }))}
          openCompare={catalogOpts.compare}
          initialFilter={catalogOpts.filter}
        />
      )}

      {view === "detail" && detail && (
        <CareerDetail
          career={detail}
          state={state}
          suggestion={suggestions.find((s) => s.career.id === detail.id)}
          hasQuiz={hasQuiz}
          onBack={() => go(detailFrom)}
          backLabel={backLabel}
          onOpenCareer={openCareer}
          onToggleSave={toggleSave}
          onToggleCompare={toggleCompare}
          update={update}
          onAskAI={askAboutCareer}
        />
      )}

      {view === "plan" && <PlanStep state={state} update={update} />}

      {view === "chat" && (
        <section className="rounded-2xl bg-clay-card border border-clay-soft p-5 sm:p-6 space-y-3">
          <h3 className="text-lg font-extrabold text-navy">Trò chuyện với AI hướng nghiệp</h3>
          <CareerChat
            grade={grade}
            messages={state.chat}
            onChange={setChat}
            context={context}
            ready={hasQuiz}
            prefill={prefill}
            key="career-chat"
            onPrefillUsed={() => setPrefill(null)}
          />
        </section>
      )}

      {view !== "quiz" && view !== "intro" && <Attribution onOpenAbout={() => setAboutOpen(true)} />}
      {aboutOpen && <AboutQuestions onClose={() => setAboutOpen(false)} />}
    </div>
  );
};

