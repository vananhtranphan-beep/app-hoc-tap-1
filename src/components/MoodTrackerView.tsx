import React, { useEffect, useMemo, useRef, useState } from "react";
import { Sprout, MessageCircleHeart, Leaf, BookHeart, LifeBuoy, Lock, Info, Sparkles } from "lucide-react";
import { CALM_LINES, DECOR, ENCOURAGE, STAGES, WANTS, weatherById } from "../data/moodData";
import {
  MAX_CHECKINS_PER_DAY,
  MAX_WILT,
  MoodState,
  addCare,
  addChatCare,
  addEntry,
  addReview,
  checkinsToday,
  dayKey,
  formOf,
  growthPoints,
  loadGuestMood,
  loadMood,
  moodForm,
  saveGuestMood,
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
// Cây và check-in nằm cùng một chỗ: check-in xong, cây đổi ngay tại đó.
// Không chẩn đoán, không chấm điểm. Tài khoản: lưu trên máy này; khách: chỉ giữ tạm.
// ============================================================

interface Props {
  userId?: string;
  grade?: string;
  isGuest?: boolean;
}

type Tab = "care" | "chat" | "garden";

export const GUEST_GARDEN_NOTE = "Vì bạn đang ở chế độ khách nên vườn ký ức chưa thể lưu lại lịch check-in cảm xúc của bạn.";

// Cổng mã PIN: có đặt PIN thì phải mở khóa trước khi thấy cây và nhật ký
export const MoodTrackerView: React.FC<Props> = (props) => {
  const userId = props.userId || "default";
  const [open, setOpen] = useState(() => props.isGuest || isUnlocked(userId));
  if (!open) return <PinLock userId={userId} onUnlocked={() => setOpen(true)} />;
  return (
    <MoodTrackerInner
      {...props}
      onLock={
        !props.isGuest && hasPin(userId)
          ? () => {
              lockNow(userId);
              setOpen(false);
            }
          : undefined
      }
    />
  );
};

const newDecorText = (before: string[], after: string[]) => {
  const added = after.filter((d) => !before.includes(d)).map((d) => DECOR.find((x) => x.id === d)?.name).filter(Boolean);
  return added.length ? ` Cây vừa có thêm: ${added.join(", ")}.` : "";
};

const MoodTrackerInner: React.FC<Props & { onLock?: () => void }> = ({ userId = "default", grade = "8", isGuest, onLock }) => {
  const [state, setState] = useState<MoodState>(() => (isGuest ? loadGuestMood(userId) : loadMood(userId)));
  const [tab, setTab] = useState<Tab>("care");
  const [toast, setToast] = useState("");
  const [pulse, setPulse] = useState(0);
  const [focusActivity, setFocusActivity] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const stateRef = useRef(state);
  stateRef.current = state;
  useEffect(() => {
    if (isGuest) saveGuestMood(userId, state);
    else saveMood(userId, state);
  }, [state, userId, isGuest]);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 9000);
    return () => clearTimeout(id);
  }, [toast]);

  const points = growthPoints(state);
  const stage = stageIndex(state);
  const decor = unlockedDecor(state);
  const form = moodForm(state);
  const next = STAGES[stage + 1];
  const remaining = Math.max(0, MAX_CHECKINS_PER_DAY - checkinsToday(state));

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

  const encourage =
    state.wilt > 0
      ? (ENCOURAGE[state.wiltWeather || "mua"] || ENCOURAGE.mua)[(state.entries.length + state.recovered) % 2]
      : CALM_LINES[points % CALM_LINES.length];

  const goTab = (t: Tab) => {
    setTab(t);
    setTimeout(() => document.getElementById("mood-tabs")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  // Áp dụng thay đổi, báo ngắn gọn điều vừa xảy ra với cây
  const apply = (next: MoodState, message: string) => {
    setState(next);
    setPulse((p) => p + 1);
    setToast(message + newDecorText(unlockedDecor(state), unlockedDecor(next)));
  };

  const saveCheckIn = (r: CheckInResult) => {
    const n = addEntry(state, r);
    if (n === state) return; // đã đủ 5 lần hôm nay
    const f = formOf(r.weathers);
    const grew = stageIndex(n) > stage ? ` Cây đã lớn thành "${STAGES[stageIndex(n)].name}".` : "";
    let msg: string;
    if (f === "nang-ne") {
      msg =
        n.wilt > state.wilt
          ? `Đã ghi nhận. Cây rũ lá cùng bạn (mức héo ${n.wilt}/${MAX_WILT}). Buồn hay căng thẳng là bình thường; mỗi việc nhỏ chăm sóc bản thân sẽ giúp cây hồi lại từng chút.`
          : "Đã ghi nhận. Cây vẫn rũ lá cùng bạn, nhưng không héo thêm nữa hôm nay. Cây luôn có thể hồi lại.";
    } else if (f === "sang") {
      msg = state.wilt > 0 ? "Đã ghi nhận. Trời sáng hơn, cây hướng lá về phía nắng. Lá vàng sẽ xanh lại dần khi bạn chăm sóc bản thân." : "Đã ghi nhận. Trời sáng lên, cây vươn lá đón nắng.";
    } else {
      msg = "Đã ghi nhận. Cây giữ dáng bình yên.";
    }
    apply(n, msg + grew);
    const target = WANTS.find((w) => w.id === r.want)?.target;
    if (target === "chat") setTab("chat");
    if (target === "activity") {
      setTab("care");
      setFocusActivity("tho-cham");
    }
  };

  const tabs = (
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
        tab === id ? "bg-sun-card text-navy shadow-sm" : "text-leaf-dark hover:text-navy"
      }`}
    >
      <Icon className="w-4 h-4 hidden sm:block" /> {label}
    </button>
  ));

  return (
    <div className="space-y-5 pb-6">
      {/* Tiêu đề */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-12 h-12 rounded-2xl bg-leaf-deep text-white flex items-center justify-center">
            <Sprout className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-2xl font-extrabold text-navy tracking-tight">Cây cảm xúc của tôi</h2>
            <p className="text-sm text-muted">Quan sát cảm xúc, chăm sóc bản thân, cây lớn lên cùng bạn.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {onLock && (
            <button onClick={onLock} className="min-h-11 px-4 rounded-xl bg-sun-card border border-sun-line hover:border-leaf text-navy text-sm font-semibold inline-flex items-center gap-2 cursor-pointer">
              <Lock className="w-4 h-4" /> Khóa lại
            </button>
          )}
          <button
            onClick={() => setShowHelp(!showHelp)}
            aria-expanded={showHelp}
            className="min-h-11 px-4 rounded-xl bg-sun-card border border-sun-line hover:border-rose-300 text-rose-700 text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
          >
            <LifeBuoy className="w-4 h-4" /> Cần giúp ngay?
          </button>
        </div>
      </div>

      {showHelp && <SupportPanel message="Nếu bạn đang gặp chuyện khó khăn hoặc không an toàn, hãy nói với người lớn bạn tin hoặc gọi số dưới đây." />}

      <p className="flex items-start gap-1.5 text-xs text-muted">
        <Info className="w-4 h-4 text-leaf-deep shrink-0" />
        Phần này giúp bạn quan sát cảm xúc và thử cách tự chăm sóc, không phải công cụ chẩn đoán hay điều trị.{" "}
        {isGuest ? "Ở chế độ khách, cây và các lần check-in chỉ giữ tạm khi bạn đang mở trang." : "Nhật ký chỉ lưu trên máy này."}
      </p>

      {/* CÂY + CHECK-IN cùng một khu vực */}
      {/* Điện thoại: cây → check-in → giai đoạn; máy tính: cây và giai đoạn bên trái, check-in bên phải */}
      <section className="rounded-3xl bg-sun-card border border-sun-line p-4 sm:p-6 grid lg:grid-cols-[1.15fr_1fr] lg:grid-rows-[auto_1fr] gap-5 lg:gap-x-7 items-start">
        <div className="space-y-3 lg:col-start-1 lg:row-start-1">
          <div className="rounded-2xl overflow-hidden shadow-[0_10px_30px_-18px_rgba(85,123,76,0.6)]">
            <Tree stage={stage} form={form} wilt={state.wilt} decor={decor} pulse={pulse} />
          </div>
          {toast && (
            <div role="status" className="p-3.5 rounded-xl bg-leaf-soft border border-leaf/40 text-sm text-navy font-medium animate-rise flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-leaf-deep shrink-0 mt-0.5" /> {toast}
            </div>
          )}
        </div>

        <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2">
          <CheckIn remaining={remaining} isGuest={isGuest} onSave={saveCheckIn} />
        </div>

        <div className="space-y-3 lg:col-start-1 lg:row-start-2">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <div>
              <span className="text-xs font-semibold text-muted">
                Giai đoạn {stage + 1}/5 · {points} chiếc lá
              </span>
              <h3 className="text-xl font-extrabold text-navy">{STAGES[stage].name}</h3>
            </div>
            {next && (
              <span className="text-xs text-muted">
                {stage === 1 && state.care.length === 0 && points >= next.min ? "Thử một hoạt động chăm sóc bản thân để cây lớn lên." : `Còn ${Math.max(0, next.min - points)} lá nữa đến "${next.name}"`}
              </span>
            )}
          </div>
          <div className={`p-3.5 rounded-xl text-sm leading-relaxed ${state.wilt > 0 ? "bg-amber-50 border border-amber-200 text-amber-950" : "bg-leaf-soft/70 text-navy"}`}>
            {state.wilt > 0 && (
              <div className="text-xs font-bold mb-1">
                Cây đang rũ lá cùng bạn · mức héo {state.wilt}/{MAX_WILT}
              </div>
            )}
            {encourage}
            {state.wilt > 0 && <div className="text-xs mt-1.5 text-amber-900">Mỗi hoạt động chăm sóc bản thân giúp cây hồi lại một mức. Tâm sự với AI cũng giúp cây hồi lại (một mức mỗi ngày).</div>}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => goTab("chat")}
              className="min-h-11 rounded-xl border border-sun-line bg-white hover:border-leaf text-navy text-sm font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageCircleHeart className="w-4 h-4" /> Tâm sự với AI
            </button>
            <button
              onClick={() => goTab("care")}
              className="min-h-11 rounded-xl border border-sun-line bg-white hover:border-leaf text-navy text-sm font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Leaf className="w-4 h-4" /> Chọn hoạt động
            </button>
          </div>
        </div>
      </section>

      {/* Chăm sóc bản thân / Góc tâm sự / Vườn ký ức */}
      <div id="mood-tabs" className="scroll-mt-24 space-y-4">
        <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-leaf-soft" role="tablist">
          {tabs}
        </div>

        {tab === "care" && (
          <SelfCare
            doneIds={state.care.map((c) => c.activityId)}
            focusId={focusActivity}
            onComplete={(id, note) => {
              let n = addCare(state, id);
              if (note) n = { ...n, notes: [{ id: `n-${Date.now()}`, at: new Date().toISOString(), ...note }, ...n.notes] };
              setFocusActivity(null);
              const msg =
                state.wilt > 0
                  ? n.wilt === 0
                    ? "Bạn đã chăm sóc bản thân. Cây đã hồi lại hoàn toàn, lá xanh trở lại!"
                    : `Bạn đã chăm sóc bản thân. Cây hồi lại một chút (mức héo còn ${n.wilt}/${MAX_WILT}).`
                  : "Bạn đã chăm sóc bản thân. Cây có thêm lá mới.";
              apply(n, msg);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onRate={(fit) => setState((s) => (s.care[0] ? { ...s, care: [{ ...s.care[0], fit }, ...s.care.slice(1)] } : s))}
          />
        )}

        {tab === "chat" && (
          <section className="rounded-2xl bg-sun-card border border-sun-line p-4 sm:p-5 space-y-2">
            <h3 className="font-bold text-navy">Người bạn đồng hành AI</h3>
            <p className="text-sm text-muted">Bạn có thể kể, hỏi, hoặc chỉ cần có người nghe. Bạn có thể dừng lại bất cứ lúc nào.</p>
            <Companion
              grade={grade}
              checkinContext={checkinContext}
              onCareTurn={() => {
                const s = stateRef.current; // trạng thái mới nhất (AI trả lời sau vài giây)
                const n = addChatCare(s);
                setState(n);
                if (n.wilt < s.wilt) {
                  setPulse((p) => p + 1);
                  setToast(`Cảm ơn bạn đã chia sẻ. Cây hồi lại một chút (mức héo còn ${n.wilt}/${MAX_WILT}).`);
                }
              }}
            />
          </section>
        )}

        {tab === "garden" &&
          (isGuest ? (
            <section role="status" className="rounded-2xl bg-sun-card border border-sun-line p-5 text-sm text-navy">
              {GUEST_GARDEN_NOTE}
            </section>
          ) : (
            <Garden
              state={state}
              onDeleteEntry={(id) => setState((s) => ({ ...s, entries: s.entries.filter((e) => e.id !== id) }))}
              onDeleteNote={(id) => setState((s) => ({ ...s, notes: s.notes.filter((n) => n.id !== id) }))}
              onReviewed={() => {
                apply(addReview(state), "Cảm ơn bạn đã dành thời gian nhìn lại hành trình của mình.");
              }}
            />
          ))}
      </div>
    </div>
  );
};
