import React, { useState } from "react";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { careerById } from "../../data/careerData";
import { CareerState } from "../../lib/career";
import { Card, PrimaryBtn } from "./ui";

// ============================================================
// KẾ HOẠCH KHÁM PHÁ (tạo, sửa, đánh dấu xong, xóa)
// ============================================================

interface Props {
  state: CareerState;
  update: (fn: (s: CareerState) => CareerState) => void;
}

const newId = () => `g-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

export const PlanStep: React.FC<Props> = ({ state, update }) => {
  const [text, setText] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const add = (t: string) => {
    const v = t.trim().slice(0, 200);
    if (!v) return;
    update((s) => ({ ...s, plan: [...s.plan, { id: newId(), text: v, done: false, createdAt: new Date().toISOString() }] }));
  };

  const firstSaved = state.saved.map(careerById).filter(Boolean)[0];
  const ideas = [
    firstSaved ? `Hỏi một người đang làm nghề ${firstSaved.name.toLowerCase()} về công việc của họ` : "Hỏi bố mẹ hoặc người thân về nghề họ đang làm",
    firstSaved ? `Thử hoạt động trải nghiệm của nghề ${firstSaved.name.toLowerCase()}` : "Thử một hoạt động trải nghiệm ở bước 5",
    "Xem một video giới thiệu nghề từ nguồn đáng tin cậy",
    "Tìm hiểu các trường THPT, trường nghề có ngành mình quan tâm",
  ].filter((i) => !state.plan.some((p) => p.text === i));

  const doneCount = state.plan.filter((p) => p.done).length;

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-clay-soft/60 border border-clay-soft text-sm text-navy">
        Bạn <b>chưa cần chọn nghề ngay</b>. Kế hoạch này chỉ là những việc nhỏ để tìm hiểu thêm. Sở thích và định hướng có thể thay đổi theo trải nghiệm, điều đó hoàn toàn bình thường.
      </div>

      <Card className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-extrabold text-navy">Mục tiêu tìm hiểu nghề</h3>
          {state.plan.length > 0 && (
            <span className="text-xs font-semibold text-muted">
              Xong {doneCount}/{state.plan.length}
            </span>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            add(text);
            setText("");
          }}
          className="flex gap-2"
        >
          <label className="flex-1 min-w-0">
            <span className="sr-only">Mục tiêu mới</span>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={200}
              placeholder="VD: Tìm hiểu một ngày làm việc của kiến trúc sư"
              className="w-full min-h-11 px-3.5 rounded-xl border border-clay-soft bg-white text-sm focus:outline-none focus:ring-2 focus:ring-clay"
            />
          </label>
          <PrimaryBtn type="submit" disabled={!text.trim()} aria-label="Thêm mục tiêu">
            <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Thêm</span>
          </PrimaryBtn>
        </form>

        {state.plan.length === 0 ? (
          <p className="text-sm text-muted">Bạn chưa có mục tiêu nào. Hãy thêm một mục tiêu nhỏ, hoặc chọn một gợi ý bên dưới.</p>
        ) : (
          <ul className="space-y-2">
            {state.plan.map((p) => (
              <li key={p.id} className="flex items-center gap-2 p-2 pl-3 rounded-xl border border-clay-soft bg-white">
                <input
                  type="checkbox"
                  checked={p.done}
                  onChange={() => update((s) => ({ ...s, plan: s.plan.map((x) => (x.id === p.id ? { ...x, done: !x.done } : x)) }))}
                  className="w-5 h-5 accent-[#a85d3d] shrink-0 cursor-pointer"
                  aria-label={`Đánh dấu xong: ${p.text}`}
                />
                {editing === p.id ? (
                  <form
                    className="flex-1 flex gap-1.5"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const v = editText.trim();
                      if (v) update((s) => ({ ...s, plan: s.plan.map((x) => (x.id === p.id ? { ...x, text: v.slice(0, 200) } : x)) }));
                      setEditing(null);
                    }}
                  >
                    <input autoFocus value={editText} onChange={(e) => setEditText(e.target.value)} className="flex-1 min-w-0 min-h-10 px-2.5 rounded-lg border border-clay-soft bg-white text-sm" aria-label="Sửa mục tiêu" />
                    <button type="submit" className="w-10 h-10 rounded-lg bg-clay-deep text-white flex items-center justify-center cursor-pointer" aria-label="Lưu">
                      <Check className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => setEditing(null)} className="w-10 h-10 rounded-lg border border-clay-soft flex items-center justify-center cursor-pointer" aria-label="Hủy">
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <>
                    <span className={`flex-1 min-w-0 text-sm ${p.done ? "line-through text-muted" : "text-ink"}`}>{p.text}</span>
                    <button
                      onClick={() => {
                        setEditing(p.id);
                        setEditText(p.text);
                      }}
                      className="w-10 h-10 rounded-lg text-muted hover:text-navy hover:bg-white flex items-center justify-center cursor-pointer"
                      aria-label={`Sửa: ${p.text}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Xóa mục tiêu này?")) update((s) => ({ ...s, plan: s.plan.filter((x) => x.id !== p.id) }));
                      }}
                      className="w-10 h-10 rounded-lg text-muted hover:text-rose-600 hover:bg-white flex items-center justify-center cursor-pointer"
                      aria-label={`Xóa: ${p.text}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}

        {ideas.length > 0 && (
          <div className="pt-2 border-t border-clay-soft">
            <div className="text-xs font-semibold text-muted mb-2">Gợi ý mục tiêu (bấm để thêm)</div>
            <div className="flex flex-wrap gap-2">
              {ideas.map((i) => (
                <button key={i} onClick={() => add(i)} className="min-h-10 px-3.5 rounded-full bg-clay-soft hover:bg-clay-soft text-navy text-sm text-left cursor-pointer inline-flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 shrink-0" /> {i}
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
