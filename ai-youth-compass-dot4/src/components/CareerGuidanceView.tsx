import React, { useEffect, useMemo, useState } from "react";
import { Check, Bot, Compass } from "lucide-react";
import { Career, careerById } from "../data/careerData";
import {
  CareerState,
  ChatMsg,
  aiContext,
  answeredCount,
  careerDetailForAI,
  computeScores,
  loadCareerState,
  saveCareerState,
  suggestCareers,
} from "../lib/career";
import { QuizStep, Attribution } from "./career/QuizStep";
import { SummaryStep } from "./career/SummaryStep";
import { CatalogStep } from "./career/CatalogStep";
import { CareerDetail } from "./career/CareerDetail";
import { ExperienceStep } from "./career/ExperienceStep";
import { PlanStep } from "./career/PlanStep";
import { CareerChat } from "./career/CareerChat";
import { AboutQuestions } from "./career/AboutQuestions";
import { Card, PrimaryBtn } from "./career/ui";

// ============================================================
// HƯỚNG NGHIỆP: 6 BƯỚC + TRÒ CHUYỆN VỚI AI
// 1 Khám phá bản thân → 2 Tổng hợp → 3 Khám phá nghề → 4 Chi tiết nghề
// → 5 Trải nghiệm nghề → 6 Kế hoạch khám phá
// Tiến độ lưu theo tài khoản (đồng bộ lên máy chủ khi đăng nhập).
// ============================================================

type Step = 1 | 2 | 3 | 4 | 5 | 6 | "chat";

interface Props {
  userId?: string;
  grade?: string;
}

const STEPS: { n: Exclude<Step, "chat">; label: string }[] = [
  { n: 1, label: "Khám phá bản thân" },
  { n: 2, label: "Tổng hợp" },
  { n: 3, label: "Khám phá nghề" },
  { n: 4, label: "Chi tiết nghề" },
  { n: 5, label: "Trải nghiệm" },
  { n: 6, label: "Kế hoạch" },
];

export const CareerGuidanceView: React.FC<Props> = ({ userId = "default", grade = "8" }) => {
  const [state, setState] = useState<CareerState>(() => loadCareerState(userId));
  const [step, setStep] = useState<Step>(() => (loadCareerState(userId).completedAt ? 2 : 1));
  const [detailId, setDetailId] = useState<string | null>(null);
  const [expFocus, setExpFocus] = useState<string | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [prefill, setPrefill] = useState<{ text: string; extra?: string } | null>(null);

  useEffect(() => saveCareerState(userId, state), [state, userId]);

  const update = (fn: (s: CareerState) => CareerState) => setState(fn);
  const scores = useMemo(() => computeScores(state.answers), [state.answers]);
  const hasQuiz = Boolean(state.completedAt) && answeredCount(state.answers) >= 10;
  const suggestions = useMemo(() => (hasQuiz ? suggestCareers(state, scores, 8) : []), [hasQuiz, state, scores]);
  const recommendedIds = suggestions.map((s) => s.career.id);
  const context = useMemo(() => aiContext(state, scores, grade), [state, scores, grade]);

  const go = (s: Step) => {
    setStep(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const openCareer = (id: string) => {
    setDetailId(id);
    go(4);
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

  const doneMark: Record<number, boolean> = {
    1: hasQuiz,
    2: hasQuiz,
    3: state.saved.length > 0,
    4: state.saved.length > 0 || state.compare.length > 0,
    5: Object.values(state.experiences).some((e) => e.status === "done"),
    6: state.plan.length > 0,
  };

  const detail = detailId ? careerById(detailId) : undefined;

  return (
    <div className="space-y-5 pb-6">
      {/* Đầu trang */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-12 h-12 rounded-2xl bg-teal text-white flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-2xl font-extrabold text-navy tracking-tight">Hướng nghiệp</h2>
            <p className="text-sm text-muted">Hiểu sở thích của mình, khám phá nghề, thử trải nghiệm nhỏ.</p>
          </div>
        </div>
        <button
          onClick={() => go("chat")}
          aria-current={step === "chat" ? "page" : undefined}
          className={`min-h-11 px-4 rounded-xl text-sm font-bold inline-flex items-center gap-2 border transition cursor-pointer ${
            step === "chat" ? "bg-navy text-cream border-navy" : "bg-white text-navy border-line hover:border-teal"
          }`}
        >
          <Bot className="w-4 h-4" /> Hỏi AI hướng nghiệp
        </button>
      </div>

      {/* Thanh 6 bước */}
      <nav aria-label="Các bước hướng nghiệp" className="-mx-4 px-4 lg:mx-0 lg:px-0 overflow-x-auto no-scrollbar">
        <ol className="flex gap-2 min-w-max lg:min-w-0 lg:grid lg:grid-cols-6">
          {STEPS.map((s) => {
            const active = step === s.n;
            return (
              <li key={s.n}>
                <button
                  onClick={() => (s.n === 4 && !detail ? go(3) : go(s.n))}
                  aria-current={active ? "step" : undefined}
                  className={`w-full min-h-12 px-3 rounded-xl border text-left flex items-center gap-2.5 transition cursor-pointer ${
                    active ? "bg-navy border-navy text-cream" : "bg-white border-line text-navy hover:border-teal"
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      doneMark[s.n] ? "bg-teal text-white" : active ? "bg-white/15 text-cream" : "bg-mist text-navy"
                    }`}
                  >
                    {doneMark[s.n] ? <Check className="w-4 h-4" /> : s.n}
                  </span>
                  <span className="text-sm lg:text-[13px] font-semibold whitespace-nowrap lg:whitespace-normal lg:leading-tight">{s.label}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {step === 1 && (
        <QuizStep
          state={state}
          update={update}
          onOpenAbout={() => setAboutOpen(true)}
          onFinish={() => {
            update((s) => ({ ...s, completedAt: new Date().toISOString() }));
            go(2);
          }}
        />
      )}

      {step === 2 &&
        (hasQuiz ? (
          <SummaryStep
            state={state}
            scores={scores}
            suggestions={suggestions}
            grade={grade}
            context={context}
            onEditQuiz={() => {
              update((s) => ({ ...s, quizIndex: 0 }));
              go(1);
            }}
            onOpenCareer={openCareer}
            onToggleSave={toggleSave}
            onGoCatalog={() => go(3)}
            onChatChange={setChat}
          />
        ) : (
          <Card className="space-y-3">
            <h3 className="text-lg font-extrabold text-navy">Chưa có kết quả tổng hợp</h3>
            <p className="text-sm text-muted">Bạn làm khảo sát ngắn ở bước 1 (khoảng 5 phút) để web tổng hợp sở thích của bạn.</p>
            <PrimaryBtn onClick={() => go(1)}>Bắt đầu khảo sát</PrimaryBtn>
          </Card>
        ))}

      {step === 3 && (
        <CatalogStep
          state={state}
          recommendedIds={recommendedIds}
          onOpenCareer={openCareer}
          onToggleSave={toggleSave}
          onToggleCompare={toggleCompare}
          onClearCompare={() => update((s) => ({ ...s, compare: [] }))}
        />
      )}

      {step === 4 && detail && (
        <CareerDetail
          career={detail}
          state={state}
          suggestion={suggestions.find((s) => s.career.id === detail.id)}
          hasQuiz={hasQuiz}
          onBack={() => go(3)}
          onOpenCareer={openCareer}
          onToggleSave={toggleSave}
          onToggleCompare={toggleCompare}
          onTryActivity={(id) => {
            setExpFocus(id);
            go(5);
          }}
          onAskAI={askAboutCareer}
        />
      )}

      {step === 5 && (
        <ExperienceStep
          state={state}
          update={update}
          candidateIds={[...state.saved, ...recommendedIds.slice(0, 3)]}
          focusId={expFocus}
          onFocus={setExpFocus}
          onOpenCareer={openCareer}
        />
      )}

      {step === 6 && <PlanStep state={state} update={update} />}

      {step === "chat" && (
        <Card className="space-y-3">
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
        </Card>
      )}

      {step !== 1 && <Attribution onOpenAbout={() => setAboutOpen(true)} />}
      {aboutOpen && <AboutQuestions onClose={() => setAboutOpen(false)} />}
    </div>
  );
};
