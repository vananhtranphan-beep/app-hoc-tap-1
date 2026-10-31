import React from "react";
import { Clock, Target, ListChecks, Flag, CheckCircle2, Play, FlaskConical } from "lucide-react";
import { Career } from "../../data/careerData";
import { CareerState } from "../../lib/career";

// ============================================================
// HOẠT ĐỘNG TRẢI NGHIỆM NGHỀ (nằm ngay trong trang chi tiết nghề)
// Hoạt động nhỏ, an toàn. Không kết luận năng khiếu từ một hoạt động.
// ============================================================

const FIT = [
  { id: "hop", label: "Thấy hợp với mình" },
  { id: "phan-van", label: "Còn phân vân" },
  { id: "chua-hop", label: "Chưa thấy hợp" },
] as const;

export const ExperiencePanel: React.FC<{ career: Career; state: CareerState; update: (fn: (s: CareerState) => CareerState) => void }> = ({ career: c, state, update }) => {
  const e = state.experiences[c.id];
  const setExp = (patch: Partial<CareerState["experiences"][string]>) =>
    update((s) => {
      const cur = s.experiences[c.id] || { status: "doing" as const, reflection: "" };
      return { ...s, experiences: { ...s.experiences, [c.id]: { ...cur, ...patch } } };
    });

  return (
    <section id="trai-nghiem" className="rounded-2xl bg-clay-card border border-clay-soft p-5 sm:p-6 space-y-4 scroll-mt-24">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="text-xs font-bold text-clay-deep uppercase tracking-wide flex items-center gap-1.5">
            <FlaskConical className="w-4 h-4" /> Hoạt động trải nghiệm
          </div>
          <h3 className="text-lg font-extrabold text-navy mt-1">{c.experience.title}</h3>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            e?.status === "done" ? "bg-clay-deep text-white" : e?.status === "doing" ? "bg-amber-100 text-amber-900" : "bg-clay-soft text-navy"
          }`}
        >
          {e?.status === "done" ? "Đã hoàn thành" : e?.status === "doing" ? "Đang làm" : "Chưa thử"}
        </span>
      </div>

      <div className="grid sm:grid-cols-3 gap-2 text-sm">
        <div className="p-3 rounded-xl bg-white border border-clay-soft">
          <div className="text-xs font-bold text-muted flex items-center gap-1">
            <Target className="w-3.5 h-3.5" /> Mục tiêu
          </div>
          <p className="mt-1 text-ink">{c.experience.goal}</p>
        </div>
        <div className="p-3 rounded-xl bg-white border border-clay-soft">
          <div className="text-xs font-bold text-muted flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Thời gian
          </div>
          <p className="mt-1 text-ink">Khoảng {c.experience.minutes} phút</p>
        </div>
        <div className="p-3 rounded-xl bg-white border border-clay-soft">
          <div className="text-xs font-bold text-muted flex items-center gap-1">
            <Flag className="w-3.5 h-3.5" /> Kết quả cần có
          </div>
          <p className="mt-1 text-ink">{c.experience.result}</p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-navy mb-1.5 flex items-center gap-1">
          <ListChecks className="w-4 h-4" /> Hướng dẫn
        </h4>
        <ol className="list-decimal pl-5 space-y-1 text-sm text-ink">
          {c.experience.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </div>

      {!e ? (
        <button onClick={() => setExp({ status: "doing", reflection: "" })} className="min-h-11 px-4 rounded-xl bg-clay-deep hover:bg-clay-dark text-white font-bold text-sm inline-flex items-center gap-2 cursor-pointer">
          <Play className="w-4 h-4" /> Bắt đầu hoạt động
        </button>
      ) : (
        <div className="space-y-3 pt-3 border-t border-clay-soft">
          <div>
            <h4 className="text-sm font-bold text-navy mb-1">Tự suy ngẫm (không bắt buộc)</h4>
            <ul className="text-sm text-muted list-disc pl-5 space-y-0.5 mb-2">
              {c.experience.reflect.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <label className="block">
              <span className="sr-only">Ghi chú suy ngẫm</span>
              <textarea
                value={e.reflection}
                onChange={(ev) => setExp({ reflection: ev.target.value.slice(0, 2000) })}
                rows={3}
                placeholder="Ghi lại suy nghĩ của bạn..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-clay-soft bg-white text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-clay"
              />
            </label>
          </div>
          <div>
            <div className="text-sm font-bold text-navy mb-1.5">Hoạt động này có hợp với bạn không? (không bắt buộc)</div>
            <div className="flex flex-wrap gap-2">
              {FIT.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setExp({ fit: e.fit === f.id ? undefined : f.id })}
                  aria-pressed={e.fit === f.id}
                  className={`min-h-10 px-3.5 rounded-full text-sm font-medium border cursor-pointer ${
                    e.fit === f.id ? "bg-navy border-navy text-cream" : "bg-white border-clay-soft text-ink hover:border-clay"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          {e.status !== "done" ? (
            <button
              onClick={() => setExp({ status: "done", doneAt: new Date().toISOString() })}
              className="min-h-11 px-4 rounded-xl bg-clay-deep hover:bg-clay-dark text-white font-bold text-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" /> Hoàn thành
            </button>
          ) : (
            <p className="text-sm font-semibold text-clay-deep inline-flex items-center gap-1.5" role="status">
              <CheckCircle2 className="w-4 h-4" /> Đã lưu là hoàn thành
            </p>
          )}
        </div>
      )}
      <p className="text-xs text-muted">Thích hay chưa thích một hoạt động không có nghĩa là bạn có hay không có năng khiếu với nghề đó.</p>
    </section>
  );
};
