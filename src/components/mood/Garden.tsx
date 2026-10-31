import React, { useMemo, useState } from "react";
import { Trash2, ChevronDown, Sparkles, Flag } from "lucide-react";
import { WEATHERS, activityById, weatherById } from "../../data/moodData";
import { MoodState, dayKey, milestones } from "../../lib/mood";

// ============================================================
// VƯỜN KÝ ỨC: em tự nguyện nhìn lại hành trình
// Không coi vui là tốt, buồn là xấu. Không chấm điểm em.
// ============================================================

interface Props {
  state: MoodState;
  onDeleteEntry: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onReviewed: () => void;
}

const fmt = (iso: string) => new Date(iso).toLocaleDateString("vi-VN", { day: "numeric", month: "numeric" });
const fmtTime = (iso: string) => new Date(iso).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "numeric" });

export const Garden: React.FC<Props> = ({ state, onDeleteEntry, onDeleteNote, onReviewed }) => {
  const [range, setRange] = useState<7 | 30 | 90>(30);
  const [showLog, setShowLog] = useState(false);
  const today = dayKey(new Date());
  const reviewedToday = state.reviews.includes(today);

  const since = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (range - 1));
    return d;
  }, [range]);

  const inRange = state.entries.filter((e) => new Date(e.at) >= since);
  const careInRange = state.care.filter((c) => new Date(c.at) >= since);

  const days = useMemo(() => {
    const out: { key: string; label: number; emoji?: string; count: number }[] = [];
    for (let i = 0; i < range; i++) {
      const d = new Date(since);
      d.setDate(since.getDate() + i);
      const k = dayKey(d);
      const es = state.entries.filter((e) => dayKey(e.at) === k);
      const latest = es[0];
      out.push({ key: k, label: d.getDate(), emoji: latest ? weatherById(latest.weathers[0])?.emoji || "💭" : undefined, count: es.length });
    }
    return out;
  }, [range, since, state.entries]);

  const counts = WEATHERS.map((w) => ({ w, n: inRange.filter((e) => e.weathers.includes(w.id)).length }));
  const maxN = Math.max(1, ...counts.map((c) => c.n));
  const ms = milestones(state);
  const notes = [
    ...state.notes.map((n) => ({ id: n.id, at: n.at, title: n.title, text: n.text, kind: "note" as const })),
    ...state.entries.filter((e) => e.note).map((e) => ({ id: e.id, at: e.at, title: "Ghi chú khi check-in", text: e.note!, kind: "entry" as const })),
  ].sort((a, b) => b.at.localeCompare(a.at));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2" role="radiogroup" aria-label="Khoảng thời gian">
          {([7, 30, 90] as const).map((r) => (
            <button
              key={r}
              role="radio"
              aria-checked={range === r}
              onClick={() => setRange(r)}
              className={`min-h-10 px-3.5 rounded-full text-sm font-medium border cursor-pointer ${range === r ? "bg-navy border-navy text-cream" : "bg-white border-sun-line text-ink hover:border-leaf"}`}
            >
              {r} ngày
            </button>
          ))}
        </div>
        <button
          onClick={onReviewed}
          disabled={reviewedToday}
          className="min-h-10 px-4 rounded-xl bg-leaf-deep hover:bg-leaf-dark disabled:bg-leaf-soft disabled:text-leaf-deep text-white text-sm font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:cursor-default"
        >
          <Sparkles className="w-4 h-4" /> {reviewedToday ? "Hôm nay bạn đã nhìn lại" : "Mình đã nhìn lại hành trình"}
        </button>
      </div>

      {/* Lịch cảm xúc */}
      <section className="rounded-2xl bg-sun-card border border-sun-line p-4 sm:p-5 space-y-3">
        <h4 className="font-bold text-navy">Lịch cảm xúc</h4>
        <div className={`grid gap-1.5 ${range === 7 ? "grid-cols-7" : "grid-cols-7 sm:grid-cols-10"}`}>
          {days.map((d) => (
            <div
              key={d.key}
              title={d.count ? `${d.key}: ${d.count} lần check-in` : d.key}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center text-[10px] ${d.emoji ? "bg-leaf-soft" : "bg-white border border-dashed border-sun-line"} ${d.key === today ? "ring-2 ring-leaf-deep" : ""}`}
            >
              <span className="text-muted leading-none">{d.label}</span>
              {d.emoji && <span className="text-base leading-none mt-0.5" aria-hidden>{d.emoji}</span>}
            </div>
          ))}
        </div>
      </section>

      {/* Tần suất */}
      <section className="rounded-2xl bg-sun-card border border-sun-line p-4 sm:p-5 space-y-3">
        <h4 className="font-bold text-navy">Thời tiết xuất hiện trong {range} ngày</h4>
        {inRange.length < 3 ? (
          <p className="text-sm text-muted">Mới có {inRange.length} lần check-in trong khoảng này, chưa đủ để nhận ra xu hướng. Không sao cả, bạn cứ ghi lại khi muốn.</p>
        ) : (
          <div className="space-y-1.5">
            {counts.map(({ w, n }) => (
              <div key={w.id} className="grid grid-cols-[7rem_1fr_2rem] items-center gap-2 text-sm">
                <span className="truncate">
                  {w.emoji} {w.label}
                </span>
                <div className="h-3 rounded-full bg-leaf-soft overflow-hidden">
                  <div className="h-full rounded-full bg-navy-soft/60" style={{ width: `${(n / maxN) * 100}%` }} />
                </div>
                <span className="text-right tabular-nums text-muted">{n}</span>
              </div>
            ))}
            <p className="text-xs text-muted pt-1">Mọi thời tiết đều bình thường. Biểu đồ chỉ giúp bạn để ý, không đánh giá bạn.</p>
          </div>
        )}
      </section>

      <div className="grid md:grid-cols-2 gap-4">
        <section className="rounded-2xl bg-sun-card border border-sun-line p-4 sm:p-5 space-y-2">
          <h4 className="font-bold text-navy">Hoạt động đã thử ({careInRange.length})</h4>
          {careInRange.length === 0 ? (
            <p className="text-sm text-muted">Chưa có trong khoảng này.</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {careInRange.slice(0, 12).map((c) => (
                <li key={c.id} className="flex justify-between gap-2">
                  <span className="text-ink truncate">{activityById(c.activityId)?.name}</span>
                  <span className="text-muted shrink-0">{fmt(c.at)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="rounded-2xl bg-sun-card border border-sun-line p-4 sm:p-5 space-y-2">
          <h4 className="font-bold text-navy flex items-center gap-1.5">
            <Flag className="w-4 h-4 text-leaf-deep" /> Các mốc của bạn
          </h4>
          {ms.length === 0 ? (
            <p className="text-sm text-muted">Các mốc sẽ hiện khi bạn bắt đầu hành trình.</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {ms.map((m) => (
                <li key={m.text + m.at} className="flex justify-between gap-2">
                  <span className="text-ink">{m.text}</span>
                  <span className="text-muted shrink-0">{fmt(m.at)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Ghi chú */}
      <section className="rounded-2xl bg-sun-card border border-sun-line p-4 sm:p-5 space-y-2">
        <h4 className="font-bold text-navy">Ghi chú bạn đã lưu</h4>
        {notes.length === 0 ? (
          <p className="text-sm text-muted">Chưa có ghi chú nào.</p>
        ) : (
          <ul className="space-y-2">
            {notes.map((n) => (
              <li key={n.kind + n.id} className="p-3 rounded-xl bg-white border border-sun-line flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted">
                    {n.title} · {fmtTime(n.at)}
                  </div>
                  <p className="text-sm text-ink whitespace-pre-wrap break-words">{n.text}</p>
                </div>
                {n.kind === "note" && (
                  <button
                    onClick={() => window.confirm("Xóa ghi chú này?") && onDeleteNote(n.id)}
                    className="w-10 h-10 rounded-lg text-muted hover:text-rose-600 hover:bg-white flex items-center justify-center shrink-0 cursor-pointer"
                    aria-label="Xóa ghi chú"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Nhật ký chi tiết (thu gọn) */}
      <section className="rounded-2xl bg-sun-card border border-sun-line">
        <button onClick={() => setShowLog(!showLog)} aria-expanded={showLog} className="w-full min-h-12 px-4 sm:px-5 flex items-center justify-between text-left cursor-pointer">
          <span className="font-bold text-navy">Nhật ký check-in ({inRange.length})</span>
          <ChevronDown className={`w-5 h-5 text-muted transition ${showLog ? "rotate-180" : ""}`} />
        </button>
        {showLog && (
          <ul className="px-4 sm:px-5 pb-4 space-y-2">
            {inRange.length === 0 && <li className="text-sm text-muted">Chưa có check-in trong khoảng này.</li>}
            {inRange.map((e) => (
              <li key={e.id} className="p-3 rounded-xl bg-white border border-sun-line flex items-start gap-2">
                <div className="flex-1 min-w-0 text-sm">
                  <div className="text-xs text-muted">{fmtTime(e.at)}</div>
                  <div className="text-ink">
                    {e.weathers.map((w) => `${weatherById(w)?.emoji} ${weatherById(w)?.label}`).join(", ")}
                    {e.custom ? ` · “${e.custom}”` : ""}
                  </div>
                  {e.causes.length > 0 && <div className="text-xs text-muted">Góp phần: {e.causes.join(", ")}</div>}
                </div>
                <button
                  onClick={() => window.confirm("Xóa lần check-in này?") && onDeleteEntry(e.id)}
                  className="w-10 h-10 rounded-lg text-muted hover:text-rose-600 hover:bg-white flex items-center justify-center shrink-0 cursor-pointer"
                  aria-label="Xóa lần check-in"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
