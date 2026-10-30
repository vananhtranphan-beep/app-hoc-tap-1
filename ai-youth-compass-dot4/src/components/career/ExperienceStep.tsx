import React, { useEffect, useRef } from "react";
import { Clock, Target, ListChecks, Flag, CheckCircle2, Play, LogOut } from "lucide-react";
import { Career, careerById } from "../../data/careerData";
import { CareerState } from "../../lib/career";
import { Card, GhostBtn, PrimaryBtn } from "./ui";

// ============================================================
// BƯỚC 5: TRẢI NGHIỆM NGHỀ
// Hoạt động nhỏ, an toàn. Không kết luận năng khiếu từ một hoạt động.
// ============================================================

interface Props {
  state: CareerState;
  update: (fn: (s: CareerState) => CareerState) => void;
  candidateIds: string[]; // nghề đã lưu + gợi ý
  focusId: string | null;
  onFocus: (id: string | null) => void;
  onOpenCareer: (id: string) => void;
}

const FIT = [
  { id: "hop", label: "Thấy hợp với mình" },
  { id: "phan-van", label: "Còn phân vân" },
  { id: "chua-hop", label: "Chưa thấy hợp" },
] as const;

export const ExperienceStep: React.FC<Props> = ({ state, update, candidateIds, focusId, onFocus, onOpenCareer }) => {
  const focusRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (focusId) setTimeout(() => focusRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }, [focusId]);

  const ids = Array.from(new Set([...(focusId ? [focusId] : []), ...Object.keys(state.experiences), ...candidateIds]));
  const careers = ids.map(careerById).filter(Boolean) as Career[];
  const doneCount = Object.values(state.experiences).filter((e) => e.status === "done").length;

  const setExp = (id: string, patch: Partial<CareerState["experiences"][string]>) =>
    update((s) => {
      const cur = s.experiences[id] || { status: "doing" as const, reflection: "" };
      return { ...s, experiences: { ...s.experiences, [id]: { ...cur, ...patch } } };
    });

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-teal-soft/60 border border-teal-soft text-sm text-navy">
        Mỗi hoạt động chỉ là một lần thử nhỏ. Thích hay chưa thích một hoạt động <b>không</b> có nghĩa bạn có hay không có năng khiếu với nghề đó. Bạn đã hoàn thành{" "}
        <b>{doneCount}</b> hoạt động.
      </div>

      {careers.length === 0 && (
        <Card>
          <p className="text-sm text-muted">Hãy lưu vài nghề ở bước 3, hoặc làm khảo sát ở bước 1, để có hoạt động gợi ý.</p>
        </Card>
      )}

      {careers.map((c) => {
        const e = state.experiences[c.id];
        const open = focusId === c.id;
        return (
          <div key={c.id} ref={open ? focusRef : undefined} className="scroll-mt-24">
            <Card className={`space-y-3 ${open ? "ring-2 ring-teal" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <button onClick={() => onOpenCareer(c.id)} className="text-xs font-semibold text-teal-deep hover:text-navy cursor-pointer">
                    {c.name}
                  </button>
                  <h3 className="font-extrabold text-navy leading-snug">{c.experience.title}</h3>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    e?.status === "done" ? "bg-teal text-white" : e?.status === "doing" ? "bg-amber-100 text-amber-900" : "bg-mist text-muted"
                  }`}
                >
                  {e?.status === "done" ? "Đã hoàn thành" : e?.status === "doing" ? "Đang làm" : "Chưa thử"}
                </span>
              </div>

              {!open ? (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs text-muted inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {c.experience.minutes} phút
                  </span>
                  <GhostBtn onClick={() => onFocus(c.id)}>{e ? "Mở lại" : "Xem hoạt động"}</GhostBtn>
                </div>
              ) : (
                <div className="space-y-4 animate-rise">
                  <div className="grid sm:grid-cols-3 gap-2 text-sm">
                    <div className="p-3 rounded-xl bg-cream border border-line">
                      <div className="text-xs font-bold text-muted flex items-center gap-1"><Target className="w-3.5 h-3.5" /> Mục tiêu</div>
                      <p className="mt-1 text-ink">{c.experience.goal}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-cream border border-line">
                      <div className="text-xs font-bold text-muted flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Thời gian</div>
                      <p className="mt-1 text-ink">Khoảng {c.experience.minutes} phút</p>
                    </div>
                    <div className="p-3 rounded-xl bg-cream border border-line">
                      <div className="text-xs font-bold text-muted flex items-center gap-1"><Flag className="w-3.5 h-3.5" /> Kết quả</div>
                      <p className="mt-1 text-ink">{c.experience.result}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-navy mb-1.5 flex items-center gap-1"><ListChecks className="w-4 h-4" /> Hướng dẫn</h4>
                    <ol className="list-decimal pl-5 space-y-1 text-sm text-ink">
                      {c.experience.steps.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ol>
                  </div>

                  {!e ? (
                    <div className="flex flex-wrap gap-2">
                      <PrimaryBtn onClick={() => setExp(c.id, { status: "doing", reflection: "" })}>
                        <Play className="w-4 h-4" /> Bắt đầu
                      </PrimaryBtn>
                      <GhostBtn onClick={() => onFocus(null)}>
                        <LogOut className="w-4 h-4" /> Thoát
                      </GhostBtn>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-1 border-t border-line">
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
                            onChange={(ev) => setExp(c.id, { reflection: ev.target.value.slice(0, 2000) })}
                            rows={3}
                            placeholder="Ghi lại suy nghĩ của bạn..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-cream text-sm focus:outline-none focus:ring-2 focus:ring-teal"
                          />
                        </label>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-navy mb-1.5">Hoạt động này có phù hợp với bạn không? (không bắt buộc)</div>
                        <div className="flex flex-wrap gap-2">
                          {FIT.map((f) => (
                            <button
                              key={f.id}
                              onClick={() => setExp(c.id, { fit: e.fit === f.id ? undefined : f.id })}
                              aria-pressed={e.fit === f.id}
                              className={`min-h-10 px-3.5 rounded-full text-sm font-medium border cursor-pointer ${
                                e.fit === f.id ? "bg-navy border-navy text-cream" : "bg-white border-line text-ink hover:border-teal"
                              }`}
                            >
                              {f.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {e.status !== "done" ? (
                          <PrimaryBtn onClick={() => setExp(c.id, { status: "done", doneAt: new Date().toISOString() })}>
                            <CheckCircle2 className="w-4 h-4" /> Hoàn thành
                          </PrimaryBtn>
                        ) : (
                          <p className="text-sm font-semibold text-teal-deep inline-flex items-center gap-1.5" role="status">
                            <CheckCircle2 className="w-4 h-4" /> Đã lưu là hoàn thành
                          </p>
                        )}
                        <GhostBtn onClick={() => onFocus(null)}>Thu gọn</GhostBtn>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        );
      })}
    </div>
  );
};
