import React, { useEffect, useRef, useState } from "react";
import { Clock, Play, CheckCircle2, LogOut } from "lucide-react";
import { SELF_CARE, SELF_CARE_GROUPS, SelfCareActivity } from "../../data/moodData";
import { CareRecord } from "../../lib/mood";

// ============================================================
// THƯ VIỆN "CHĂM SÓC BẢN THÂN": chọn → bắt đầu → hoàn thành hoặc thoát
// Không phải phương pháp điều trị. Không bắt buộc đánh giá hay chia sẻ.
// ============================================================

interface Props {
  doneIds: string[];
  onComplete: (activityId: string, note?: { title: string; text: string }) => void;
  onRate: (fit: CareRecord["fit"]) => void;
  focusId?: string | null;
}

// Đồng hồ thở 4 giây hít vào, 4 giây giữ, 4 giây thở ra
const Breathing: React.FC = () => {
  const [running, setRunning] = useState(false);
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setT((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  const phase = t % 12 < 4 ? "Hít vào" : t % 12 < 8 ? "Giữ hơi" : "Thở ra";
  const sec = 4 - (t % 4);
  const scale = !running ? 0.75 : phase === "Hít vào" ? 0.75 + ((t % 4) + 1) * 0.0625 : phase === "Giữ hơi" ? 1 : 1 - ((t % 4) + 1) * 0.0625;
  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <div className="relative w-40 h-40 flex items-center justify-center" aria-live="polite">
        <div className="absolute inset-0 rounded-full bg-leaf-soft transition-transform duration-1000 ease-in-out" style={{ transform: `scale(${scale})` }} />
        <div className="relative text-center">
          <div className="text-lg font-extrabold text-navy">{running ? phase : "Sẵn sàng"}</div>
          {running && <div className="text-sm text-muted">{sec} giây</div>}
        </div>
      </div>
      <div className="text-xs text-muted">{running ? `Đã thở ${Math.floor(t / 12)} vòng` : "Bấm bắt đầu và thở theo vòng tròn"}</div>
      <button onClick={() => { setRunning(!running); if (running) setT(0); }} className="min-h-11 px-4 rounded-xl border border-sun-line bg-white hover:border-leaf text-navy text-sm font-semibold cursor-pointer">
        {running ? "Dừng" : "Bắt đầu thở"}
      </button>
    </div>
  );
};

const Runner: React.FC<{ a: SelfCareActivity; onDone: (note?: { title: string; text: string }) => void; onExit: () => void }> = ({ a, onDone, onExit }) => {
  const [text, setText] = useState("");
  const [keep, setKeep] = useState(false);
  return (
    <div className="space-y-4 animate-rise">
      <ol className="list-decimal pl-5 space-y-1 text-sm text-ink">
        {a.steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      {a.breathing && <Breathing />}
      {a.writing && (
        <div className="space-y-2">
          <label className="block">
            <span className="text-sm font-semibold text-ink">{a.writing}</span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 1500))}
              rows={4}
              className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-sun-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-leaf-deep"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-navy cursor-pointer">
            <input type="checkbox" checked={keep} onChange={(e) => setKeep(e.target.checked)} className="w-5 h-5 accent-[#557b4c]" />
            Lưu ghi chú này vào Vườn ký ức (chỉ trên máy này)
          </label>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onDone(keep && text.trim() ? { title: a.name, text: text.trim() } : undefined)}
          className="min-h-11 px-4 rounded-xl bg-leaf-deep hover:bg-leaf-dark text-white text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" /> Hoàn thành
        </button>
        <button onClick={onExit} className="min-h-11 px-4 rounded-xl border border-sun-line bg-white hover:border-leaf text-navy text-sm font-semibold inline-flex items-center gap-2 cursor-pointer">
          <LogOut className="w-4 h-4" /> Thoát
        </button>
      </div>
    </div>
  );
};

export const SelfCare: React.FC<Props> = ({ doneIds, onComplete, onRate, focusId }) => {
  const [group, setGroup] = useState(SELF_CARE_GROUPS[0].id);
  const [running, setRunning] = useState<string | null>(focusId || null);
  const [askFit, setAskFit] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focusId) {
      const a = SELF_CARE.find((x) => x.id === focusId);
      if (a) setGroup(a.group);
      setRunning(focusId);
    }
  }, [focusId]);

  const list = SELF_CARE.filter((a) => a.group === group);

  return (
    <div ref={ref} className="space-y-4">
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1" role="tablist" aria-label="Nhóm hoạt động">
        {SELF_CARE_GROUPS.map((g) => (
          <button
            key={g.id}
            role="tab"
            aria-selected={group === g.id}
            onClick={() => setGroup(g.id)}
            className={`min-h-10 px-3.5 rounded-full text-sm font-medium border whitespace-nowrap cursor-pointer ${group === g.id ? "bg-navy border-navy text-cream" : "bg-white border-sun-line text-ink hover:border-leaf"}`}
          >
            {g.name}
          </button>
        ))}
      </div>

      {askFit && (
        <div role="status" className="p-4 rounded-xl bg-leaf-soft/60 border border-leaf-soft space-y-2">
          <p className="text-sm font-semibold text-navy">Bạn đã hoàn thành! Hoạt động này có phù hợp với bạn không? (không bắt buộc)</p>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["hop", "Hợp với mình"],
                ["binh-thuong", "Bình thường"],
                ["chua-hop", "Chưa hợp lắm"],
              ] as const
            ).map(([id, label]) => (
              <button key={id} onClick={() => { onRate(id); setAskFit(null); }} className="min-h-10 px-3.5 rounded-full bg-white border border-sun-line hover:border-leaf text-sm text-navy cursor-pointer">
                {label}
              </button>
            ))}
            <button onClick={() => setAskFit(null)} className="min-h-10 px-3 text-sm text-muted hover:text-navy cursor-pointer">
              Bỏ qua
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {list.map((a) => {
          const open = running === a.id;
          const done = doneIds.includes(a.id);
          return (
            <article key={a.id} className={`p-4 rounded-2xl bg-sun-card border ${open ? "border-leaf ring-2 ring-leaf-deep/30" : "border-sun-line"} space-y-3`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="font-bold text-navy">{a.name}</h4>
                  <p className="text-sm text-muted">{a.purpose}</p>
                </div>
                <span className="text-xs text-muted inline-flex items-center gap-1 shrink-0 pt-1">
                  <Clock className="w-3.5 h-3.5" /> {a.minutes} phút
                </span>
              </div>
              {done && !open && <div className="text-xs font-semibold text-leaf-deep">Bạn đã từng thử hoạt động này</div>}
              {!open ? (
                <button onClick={() => setRunning(a.id)} className="min-h-11 px-4 rounded-xl border border-sun-line bg-white hover:border-leaf text-navy text-sm font-semibold inline-flex items-center gap-2 cursor-pointer">
                  <Play className="w-4 h-4" /> Bắt đầu
                </button>
              ) : (
                <Runner
                  a={a}
                  onDone={(note) => {
                    onComplete(a.id, note);
                    setRunning(null);
                    setAskFit(a.id);
                    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  onExit={() => setRunning(null)}
                />
              )}
            </article>
          );
        })}
      </div>
      <p className="text-xs text-muted">Các hoạt động giúp bạn thư giãn và hiểu mình hơn, không phải phương pháp điều trị bệnh tâm lý.</p>
    </div>
  );
};
