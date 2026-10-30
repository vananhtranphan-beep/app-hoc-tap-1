import React, { useState } from "react";
import { ArrowLeft, ArrowRight, X, Check } from "lucide-react";
import { CAUSES, WANTS, WEATHERS } from "../../data/moodData";

// ============================================================
// CHECK-IN 3 BƯỚC: thời tiết bên trong → điều góp phần → muốn làm gì
// Bước nào cũng bỏ qua được. Không hỏi tên người, trường, địa chỉ.
// ============================================================

export interface CheckInResult {
  weathers: string[];
  custom?: string;
  causes: string[];
  want?: string;
  note?: string;
}

interface Props {
  onCancel: () => void;
  onSave: (r: CheckInResult) => void;
}

const ChoiceBtn: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; className?: string }> = ({ active, onClick, children, className = "" }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`rounded-xl border text-left transition cursor-pointer ${active ? "bg-navy border-navy text-cream" : "bg-white border-line text-ink hover:border-teal"} ${className}`}
  >
    {children}
  </button>
);

export const CheckIn: React.FC<Props> = ({ onCancel, onSave }) => {
  const [step, setStep] = useState(1);
  const [weathers, setWeathers] = useState<string[]>([]);
  const [custom, setCustom] = useState("");
  const [causes, setCauses] = useState<string[]>([]);
  const [want, setWant] = useState<string | undefined>();
  const [note, setNote] = useState("");

  const toggle = (list: string[], set: (l: string[]) => void, v: string) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const canSave = weathers.length > 0 || custom.trim().length > 0;

  return (
    <section aria-label="Check-in cảm xúc" className="rounded-2xl bg-white border border-line p-5 sm:p-6 space-y-5 animate-rise">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2" aria-label={`Bước ${step} trên 3`}>
          {[1, 2, 3].map((n) => (
            <span key={n} className={`h-2 rounded-full transition-all ${n === step ? "w-8 bg-teal" : n < step ? "w-4 bg-teal/50" : "w-4 bg-mist"}`} />
          ))}
          <span className="text-xs font-semibold text-muted ml-1">Bước {step}/3</span>
        </div>
        <button onClick={onCancel} className="w-11 h-11 rounded-full flex items-center justify-center text-muted hover:bg-mist cursor-pointer" aria-label="Đóng check-in">
          <X className="w-5 h-5" />
        </button>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-navy">Hôm nay bên trong bạn đang có thời tiết như thế nào?</h3>
            <p className="text-sm text-muted mt-1">Chọn một hoặc nhiều. Đây chỉ là cách diễn đạt, không phải bài kiểm tra.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {WEATHERS.map((w) => (
              <ChoiceBtn key={w.id} active={weathers.includes(w.id)} onClick={() => toggle(weathers, setWeathers, w.id)} className="min-h-20 p-3 flex flex-col gap-1">
                <span className="text-2xl" aria-hidden>{w.emoji}</span>
                <span className="text-sm font-bold">{w.label}</span>
                <span className={`text-xs ${weathers.includes(w.id) ? "text-mist/80" : "text-muted"}`}>{w.hint}</span>
              </ChoiceBtn>
            ))}
          </div>
          <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-ink">Hoặc tự gọi tên cảm xúc (không bắt buộc)</span>
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value.slice(0, 60))}
              placeholder="VD: vừa lo vừa háo hức"
              className="w-full min-h-11 px-3.5 rounded-xl border border-line bg-cream text-sm focus:outline-none focus:ring-2 focus:ring-teal"
            />
          </label>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-navy">Điều gì có thể đã góp phần tạo nên cảm xúc này?</h3>
            <p className="text-sm text-muted mt-1">Không bắt buộc. Bạn không cần kể chi tiết riêng tư.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {CAUSES.map((c) => (
              <ChoiceBtn key={c} active={causes.includes(c)} onClick={() => toggle(causes, setCauses, c)} className="min-h-11 px-3.5 text-sm font-medium">
                {c}
              </ChoiceBtn>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-extrabold text-navy">Bạn muốn làm gì cho bản thân lúc này?</h3>
          <div className="grid gap-2">
            {WANTS.map((w) => (
              <ChoiceBtn key={w.id} active={want === w.id} onClick={() => setWant(want === w.id ? undefined : w.id)} className="min-h-12 px-4 text-sm font-semibold flex items-center justify-between">
                {w.label}
                {want === w.id && <Check className="w-4 h-4" />}
              </ChoiceBtn>
            ))}
          </div>
          <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-ink">Ghi chú ngắn cho riêng bạn (không bắt buộc)</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 500))}
              rows={2}
              placeholder="Chỉ lưu trên máy này"
              className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-cream text-sm focus:outline-none focus:ring-2 focus:ring-teal resize-none"
            />
          </label>
        </div>
      )}

      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          onClick={() => (step === 1 ? onCancel() : setStep(step - 1))}
          className="min-h-11 px-4 rounded-xl border border-line bg-white hover:border-teal text-navy text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> {step === 1 ? "Hủy" : "Quay lại"}
        </button>
        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={step === 1 && !canSave}
            className="min-h-11 px-5 rounded-xl bg-teal hover:bg-teal-deep disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            {step === 2 && causes.length === 0 ? "Bỏ qua" : "Tiếp"} <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => onSave({ weathers, custom: custom.trim() || undefined, causes, want, note: note.trim() || undefined })}
            disabled={!canSave}
            className="min-h-11 px-5 rounded-xl bg-teal hover:bg-teal-deep disabled:opacity-50 text-white text-sm font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" /> Lưu check-in
          </button>
        )}
      </div>
      {step === 1 && !canSave && <p className="text-xs text-muted">Chọn ít nhất một thời tiết hoặc tự gọi tên cảm xúc để tiếp tục.</p>}
    </section>
  );
};
