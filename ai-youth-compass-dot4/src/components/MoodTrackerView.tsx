import React, { useEffect, useMemo, useState } from "react";
import { Sprout, MessageCircleHeart, Leaf, BookHeart, LifeBuoy, Lock, Check, Info } from "lucide-react";
import { CALM_LINES, DECOR, ENCOURAGE, STAGES, THEMES, WANTS, weatherById } from "../data/moodData";
import {
  MoodState,
  addCare,
  addChatCare,
  addEntry,
  addReview,
  dayKey,
  growthPoints,
  loadMood,
  saveMood,
  stageIndex,
  unlockedDecor,
} from "../lib/mood";
import { Tree } from "./mood/Tree";
import { CheckIn, CheckInResult } from "./mood/CheckIn";
import { Companion } from "./mood/Companion";
import { SelfCare } from "./mood/SelfCare";
import { Garden } from "./mood/Garden";
import { SupportPanel } from "./mood/SupportPanel";
import { PinLock } from "./mood/PinLock";
import { hasPin, isUnlocked, lockNow } from "../lib/pin";

// ============================================================
// CÂY CẢM XÚC CỦA TÔI
// Quan sát cảm xúc + chăm sóc bản thân + AI đồng hành. Không chẩn đoán, không chấm điểm.
// Toàn bộ dữ liệu chỉ lưu trên máy này (xem lib/mood.ts).
// ============================================================

interface Props {
  userId?: string;
  grade?: string;
}

type Tab = "care" | "chat" | "garden";

// Cổng mã PIN: có đặt PIN thì phải mở khóa trước khi thấy cây và nhật ký
export const MoodTrackerView: React.FC<Props> = (props) => {
  const userId = props.userId || "default";
  const [open, setOpen] = useState(() => isUnlocked(userId));
  if (!open) return <PinLock userId={userId} onUnlocked={() => setOpen(true)} />;
  return (
    <MoodTrackerInner
      {...props}
      onLock={
        hasPin(userId)
          ? () => {
              lockNow(userId);
              setOpen(false);
            }
          : undefined
      }
    />
  );
};

const MoodTrackerInner: React.FC<Props & { onLock?: () => void }> = ({ userId = "default", grade = "8", onLock }) => {
  const [state, setState] = useState<MoodState>(() => loadMood(userId));
  const [checkingIn, setCheckingIn] = useState(false);
  const [tab, setTab] = useState<Tab>("care");
  const [toast, setToast] = useState("");
  const [focusActivity, setFocusActivity] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => saveMood(userId, state), [state, userId]);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 6000);
    return () => clearTimeout(id);
  }, [toast]);

  const points = growthPoints(state);
  const stage = stageIndex(state);
  const decor = unlockedDecor(state);
  const next = STAGES[stage + 1];

  const todayEntry = state.entries.find((e) => dayKey(e.at) === dayKey(new Date()));
  const checkinContext = useMemo(() => {
    if (!todayEntry) return undefined;
    const ws = todayEntry.weathers.map((w) => weatherById(w)?.label).filter(Boolean);
    const parts = [
      ws.length ? `thời tiết bên trong: ${ws.join(", ")}` : "",
      todayEntry.custom ? `cảm xúc tự gọi tên: ${todayEntry.custom}` : "",
      todayEntry.causes.length ? `điều góp phần: ${todayEntry.causes.join(", ")}` : "",
    ].filter(Boolean);
    return parts.join("; ") || undefined;
  }, [todayEntry]);

  const encourage = state.wilted
    ? (ENCOURAGE[state.wiltWeather || "mua"] || ENCOURAGE.mua)[(state.entries.length + state.recovered) % 2]
    : CALM_LINES[points % CALM_LINES.length];

  const goTab = (t: Tab) => {
    setTab(t);
    setTimeout(() => document.getElementById("mood-tabs")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const saveCheckIn = (r: CheckInResult) => {
    setState((s) => addEntry(s, r));
    setCheckingIn(false);
    const target = WANTS.find((w) => w.id === r.want)?.target;
    if (target === "chat") setTab("chat");
    if (target === "activity") {
      setTab("care");
      setFocusActivity("tho-cham");
    }
    const heavy = r.weathers.some((w) => weatherById(w)?.heavy);
    setToast(
      heavy
        ? "Đã ghi lại. Cảm ơn bạn đã thành thật với cảm xúc của mình. Cây đang rũ lá cùng bạn, chăm sóc bản thân một chút nhé."
        : "Đã ghi lại. Cảm ơn bạn đã để ý đến cảm xúc của mình. Cây có thêm một chiếc lá."
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Tiêu đề */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-12 h-12 rounded-2xl bg-teal text-white flex items-center justify-center">
            <Sprout className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-2xl font-extrabold text-navy tracking-tight">Cây cảm xúc của tôi</h2>
            <p className="text-sm text-muted">Quan sát cảm xúc, chăm sóc bản thân, cây lớn lên cùng bạn.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {onLock && (
            <button
              onClick={onLock}
              className="min-h-11 px-4 rounded-xl bg-white border border-line hover:border-teal text-navy text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" /> Khóa lại
            </button>
          )}
          <button
            onClick={() => setShowHelp(!showHelp)}
            aria-expanded={showHelp}
            className="min-h-11 px-4 rounded-xl bg-white border border-line hover:border-rose-300 text-rose-700 text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
          >
            <LifeBuoy className="w-4 h-4" /> Cần giúp ngay?
          </button>
        </div>
      </div>

      {showHelp && <SupportPanel message="Nếu bạn đang gặp chuyện khó khăn hoặc không an toàn, hãy nói với người lớn bạn tin hoặc gọi số dưới đây." />}

      <p className="flex items-start gap-1.5 text-xs text-muted">
        <Info className="w-4 h-4 text-teal shrink-0" />
        Phần này giúp bạn quan sát cảm xúc và thử cách tự chăm sóc, không phải công cụ chẩn đoán hay điều trị. Nhật ký chỉ lưu trên máy này.
      </p>

      {toast && (
        <div role="status" className="p-3.5 rounded-xl bg-teal-soft border border-teal-soft text-sm text-navy font-medium animate-rise">
          {toast}
        </div>
      )}

      {checkingIn ? (
        <CheckIn onCancel={() => setCheckingIn(false)} onSave={saveCheckIn} />
      ) : (
        <section className="rounded-3xl bg-white border border-line p-4 sm:p-6 grid md:grid-cols-[1.1fr_1fr] gap-5 items-center">
          <div className="rounded-2xl overflow-hidden">
            <Tree stage={stage} leaves={points} wilted={state.wilted} decor={decor} theme={state.theme} />
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-muted">
                Giai đoạn {stage + 1}/5 · {points} chiếc lá
              </div>
              <h3 className="text-xl font-extrabold text-navy">{STAGES[stage].name}</h3>
              <p className="text-sm text-muted">{STAGES[stage].text}</p>
              {next && (
                <p className="text-xs text-muted mt-1">
                  {stage === 1 && state.care.length === 0 && points >= next.min
                    ? "Thử một hoạt động chăm sóc bản thân để cây lớn lên."
                    : `Còn ${Math.max(0, next.min - points)} lá nữa đến "${next.name}".`}
                </p>
              )}
            </div>

            <div className={`p-3.5 rounded-xl text-sm leading-relaxed ${state.wilted ? "bg-amber-50 border border-amber-200 text-amber-950" : "bg-mist/60 text-navy"}`}>
              {state.wilted && <div className="text-xs font-bold mb-1">Cây đang rũ lá cùng bạn</div>}
              {encourage}
              {state.wilted && <div className="text-xs mt-1.5 text-amber-900">Làm một việc chăm sóc bản thân hoặc tâm sự một chút, cây sẽ tươi lại và lớn hơn.</div>}
            </div>

            <button onClick={() => setCheckingIn(true)} className="w-full min-h-12 rounded-xl bg-teal hover:bg-teal-deep text-white font-bold transition cursor-pointer">
              Check-in hôm nay
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => goTab("chat")}
                className="min-h-11 rounded-xl border border-line bg-white hover:border-teal text-navy text-sm font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircleHeart className="w-4 h-4" /> Tâm sự với AI
              </button>
              <button
                onClick={() => goTab("care")}
                className="min-h-11 rounded-xl border border-line bg-white hover:border-teal text-navy text-sm font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Leaf className="w-4 h-4" /> Chọn hoạt động
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Khu vườn của tôi: vật trang trí + chủ đề */}
      <section className="rounded-2xl bg-white border border-line p-4 sm:p-5 space-y-3">
        <h3 className="font-bold text-navy">Khu vườn của tôi</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {DECOR.map((d) => {
            const on = decor.includes(d.id);
            return (
              <div key={d.id} className={`p-3 rounded-xl border text-sm ${on ? "bg-teal-soft/50 border-teal-soft" : "bg-cream border-dashed border-line"}`}>
                <div className={`font-semibold flex items-center gap-1.5 ${on ? "text-navy" : "text-muted"}`}>
                  {on ? <Check className="w-4 h-4 text-teal-deep" /> : <Lock className="w-3.5 h-3.5" />} {d.name}
                </div>
                <div className="text-xs text-muted mt-0.5">{d.how}</div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-muted">Chủ đề khu vườn:</span>
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setState((s) => ({ ...s, theme: t.id }))}
              aria-pressed={state.theme === t.id}
              className={`min-h-10 px-3.5 rounded-full text-sm border cursor-pointer ${state.theme === t.id ? "bg-navy border-navy text-cream" : "bg-white border-line text-ink hover:border-teal"}`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </section>

      {/* Chăm sóc bản thân / Góc tâm sự / Vườn ký ức */}
      <div id="mood-tabs" className="scroll-mt-24 space-y-4">
        <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-mist" role="tablist">
          {(
            [
              ["care", "Chăm sóc bản thân", Leaf],
              ["chat", "Góc tâm sự", MessageCircleHeart],
              ["garden", "Vườn ký ức", BookHeart],
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`min-h-11 px-2 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer transition ${
                tab === id ? "bg-white text-navy shadow-sm" : "text-muted hover:text-navy"
              }`}
            >
              <Icon className="w-4 h-4 hidden sm:block" /> {label}
            </button>
          ))}
        </div>

        {tab === "care" && (
          <SelfCare
            doneIds={state.care.map((c) => c.activityId)}
            focusId={focusActivity}
            onComplete={(id, note) => {
              const wasWilted = state.wilted;
              setState((s) => {
                let n = addCare(s, id);
                if (note) n = { ...n, notes: [{ id: `n-${Date.now()}`, at: new Date().toISOString(), ...note }, ...n.notes] };
                return n;
              });
              setFocusActivity(null);
              setToast(wasWilted ? "Bạn đã chăm sóc bản thân. Cây tươi lại rồi!" : "Bạn đã chăm sóc bản thân. Cây có thêm lá mới.");
            }}
            onRate={(fit) => setState((s) => (s.care[0] ? { ...s, care: [{ ...s.care[0], fit }, ...s.care.slice(1)] } : s))}
          />
        )}

        {tab === "chat" && (
          <section className="rounded-2xl bg-white border border-line p-4 sm:p-5 space-y-2">
            <h3 className="font-bold text-navy">Người bạn đồng hành AI</h3>
            <p className="text-sm text-muted">Bạn có thể kể, hỏi, hoặc chỉ cần có người nghe. Bạn có thể dừng lại bất cứ lúc nào.</p>
            <Companion grade={grade} checkinContext={checkinContext} onCareTurn={() => setState((s) => addChatCare(s))} />
          </section>
        )}

        {tab === "garden" && (
          <Garden
            state={state}
            onDeleteEntry={(id) => setState((s) => ({ ...s, entries: s.entries.filter((e) => e.id !== id) }))}
            onDeleteNote={(id) => setState((s) => ({ ...s, notes: s.notes.filter((n) => n.id !== id) }))}
            onReviewed={() => {
              setState((s) => addReview(s));
              setToast("Cảm ơn bạn đã dành thời gian nhìn lại hành trình của mình.");
            }}
          />
        )}
      </div>
    </div>
  );
};
