import React, { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { CAUSES, WANTS, WEATHERS } from "../../data/moodData";
import { MAX_CHECKINS_PER_DAY } from "../../lib/mood";

// ============================================================
// CHECK-IN NGAY DƯỚI CÂY
// Chọn thời tiết bên trong (bắt buộc chọn 1 hoặc tự gọi tên) → bấm Check-in → cây đổi ngay.
// Điều góp phần, điều muốn làm, ghi chú: không bắt buộc (mở "Thêm chi tiết").
// Tối đa 5 lần mỗi ngày, báo trước cho em biết.
// ============================================================

export interface CheckInResult {
  weathers: string[];
  custom?: string;
  causes: string[];
  want?: string;
  note?: string;
}

interface Props {
  remaining: number;
  isGuest?: boolean;
  onSave: (r: CheckInResult) => void;
}

const Chip: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; className?: string }> = ({ active, onClick, children, className = "" }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`rounded-xl border text-left transition cursor-pointer ${active ? "bg-navy border-navy text-cream" : "bg-white border-sun-line text-ink hover:border-leaf"} ${className}`}
  >
    {children}
  </button>
);

export const CheckIn: React.FC<Props> = ({ remaining, isGuest, onSave }) => {
  const [weathers, setWeathers] = useState<string[]>([]);
  const [custom, setCustom] = useState("");
  const [more, setMore] = useState(false);
  const [causes, setCauses] = useState<string[]>([]);
  const [want, setWant] = useState<string | undefined>();
  const [note, setNote] = useState("");

  const toggle = (list: string[], set: (l: string[]) => void, v: string) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const canSave = remaining > 0 && (weathers.length > 0 || custom.trim().length > 0);
  const used = MAX_CHECKINS_PER_DAY - remaining;

  const save = () => {
    if (!canSave) return;
    onSave({ weathers, custom: custom.trim() || undefined, causes, want, note: note.trim() || undefined });
    setWeathers([]);
    setCustom("");
    setCauses([]);
    setWant(undefined);
    setNote("");
    setMore(false);
  };

  return (
    <section aria-label="Check-in cảm xúc" className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base sm:text-lg font-extrabold text-navy">Hôm nay bên trong bạn đang có thời tiết như thế nào?</h3>
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${remaining > 0 ? "bg-leaf-soft text-leaf-deep" : "bg-sun-line text-navy"}`} aria-live="polite">
          Hôm nay còn {remaining}/{MAX_CHECKINS_PER_DAY} lần check-in
        </span>
      </div>

      {remaining <= 0 ? (
        <div role="status" className="p-4 rounded-xl bg-white border border-sun-line text-sm text-navy leading-relaxed">
          Hôm nay bạn đã check-in đủ {MAX_CHECKINS_PER_DAY} lần rồi, cây đã ghi nhận hết những gì bạn chia sẻ. Bạn vẫn có thể tâm sự với AI, thử một hoạt động chăm sóc bản thân hoặc
          xem lại Vườn ký ức. Hẹn bạn ngày mai nhé.
        </div>
      ) : (
        <>
          <p className="text-xs text-muted">
            Chọn một hoặc nhiều, cây sẽ đổi ngay. Mỗi ngày check-in tối đa {MAX_CHECKINS_PER_DAY} lần{used > 0 ? ` (bạn đã check-in ${used} lần hôm nay)` : ""}. Đây chỉ là cách diễn đạt, không phải bài kiểm tra.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {WEATHERS.map((w) => {
              const on = weathers.includes(w.id);
              return (
                <Chip key={w.id} active={on} onClick={() => toggle(weathers, setWeathers, w.id)} className="min-h-[4.5rem] p-2.5 flex flex-col items-center justify-center text-center gap-0.5">
                  <span className="text-2xl leading-none" aria-hidden>
                    {w.emoji}
                  </span>
                  <span className="text-[13px] font-bold leading-tight">{w.label}</span>
                  <span className={`text-[11px] leading-tight ${on ? "text-mist/80" : "text-muted"}`}>{w.hint}</span>
                </Chip>
              );
            })}
          </div>
          <label className="block">
            <span className="sr-only">Tự gọi tên cảm xúc</span>
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value.slice(0, 60))}
              placeholder="Hoặc tự gọi tên cảm xúc, VD: vừa lo vừa háo hức"
              className="w-full min-h-11 px-3.5 rounded-xl border border-sun-line bg-white text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-leaf-deep"
            />
          </label>

          <button type="button" onClick={() => setMore(!more)} aria-expanded={more} className="min-h-10 text-sm font-semibold text-leaf-deep hover:text-navy inline-flex items-center gap-1 cursor-pointer">
            <ChevronDown className={`w-4 h-4 transition ${more ? "rotate-180" : ""}`} /> Thêm chi tiết (không bắt buộc)
          </button>
          {more && (
            <div className="space-y-4 p-4 rounded-xl bg-white border border-sun-line animate-rise">
              <div className="space-y-2">
                <div className="text-sm font-bold text-navy">Điều gì có thể đã góp phần tạo nên cảm xúc này?</div>
                <div className="flex flex-wrap gap-2">
                  {CAUSES.map((c) => (
                    <Chip key={c} active={causes.includes(c)} onClick={() => toggle(causes, setCauses, c)} className="min-h-10 px-3 text-sm font-medium">
                      {c}
                    </Chip>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-bold text-navy">Bạn muốn làm gì cho bản thân lúc này?</div>
                <div className="flex flex-wrap gap-2">
                  {WANTS.map((w) => (
                    <Chip key={w.id} active={want === w.id} onClick={() => setWant(want === w.id ? undefined : w.id)} className="min-h-10 px-3 text-sm font-medium">
                      {w.label}
                    </Chip>
                  ))}
                </div>
              </div>
              <label className="block space-y-1.5">
                <span className="text-sm font-bold text-navy">Ghi chú ngắn cho riêng bạn</span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value.slice(0, 500))}
                  rows={2}
                  placeholder={isGuest ? "Chế độ khách: chỉ giữ tạm" : "Chỉ lưu trên máy này"}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sun-line bg-sun-card text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-leaf-deep resize-none"
                />
              </label>
            </div>
          )}

          <button
            onClick={save}
            disabled={!canSave}
            className="w-full min-h-12 rounded-xl bg-leaf-deep hover:bg-leaf-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" /> Check-in
          </button>
          {!canSave && <p className="text-xs text-muted text-center">Chọn ít nhất một thời tiết hoặc tự gọi tên cảm xúc để check-in.</p>}
        </>
      )}
    </section>
  );
};
