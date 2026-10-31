import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Pencil, HelpCircle, Bookmark, BookmarkCheck, Columns3, Compass, Bot, RefreshCw, FlaskConical, LayoutGrid } from "lucide-react";
import { RIASEC, RIASEC_ORDER } from "../../data/careerData";
import { CareerState, ChatMsg, Scores, Suggestion, groupSuggestions, isFlat, topCodes, unclearPoints } from "../../lib/career";
import { MathMarkdown } from "../MathMarkdown";
import { CodeBadge, SourceTag } from "./ui";
import { CareerChat } from "./CareerChat";

// ============================================================
// KẾT QUẢ KHẢO SÁT, theo đúng thứ tự:
// 1. Nhận xét tổng quan của AI  2. Trò chuyện với AI
// 3. Nút "Khám phá những nghề phù hợp với bạn"  4. Danh sách nhóm nghề gợi ý
// AI chỉ được gọi 1 lần cho mỗi lần làm khảo sát (lưu lại), không gọi lại khi mở trang.
// ============================================================

interface Props {
  state: CareerState;
  scores: Scores;
  suggestions: Suggestion[];
  grade: string;
  context: string;
  update: (fn: (s: CareerState) => CareerState) => void;
  onEditQuiz: () => void;
  onOpenCareer: (id: string) => void;
  onToggleSave: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onOpenCompare: () => void;
  onOpenCatalog: () => void;
  onChatChange: (m: ChatMsg[]) => void;
}

const SUMMARY_PROMPT = `Hãy viết NHẬN XÉT TỔNG QUAN cho bạn học sinh này (khoảng 150–230 chữ), gồm đúng 3 phần, mỗi phần mở đầu bằng tiêu đề in đậm:
**Điều bạn đã chia sẻ**: nhắc lại ngắn gọn sở thích nổi bật (theo điểm 6 nhóm), môn học yêu thích, điểm mạnh tự nhận, lĩnh vực quan tâm. CHỈ dùng thông tin ở trên, không thêm.
**Nhận xét của AI**: điều bạn suy luận từ các thông tin đó (dùng "có thể"), và những điều còn chưa rõ.
**Nhóm nghề có thể khám phá**: 2–3 nhóm nghề, mỗi nhóm một lý do ngắn và 1–2 nghề ví dụ lấy từ danh sách web gợi ý.
Không kết luận nghề nào chắc chắn hợp. Không hỏi lại ở cuối.`;

const Chips: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <div>
    <div className="text-xs font-semibold text-muted mb-1.5">{title}</div>
    {items.length ? (
      <div className="flex flex-wrap gap-1.5">
        {items.map((s) => (
          <span key={s} className="px-2.5 py-1 rounded-full bg-clay-soft/70 text-navy text-xs font-medium">
            {s}
          </span>
        ))}
      </div>
    ) : (
      <p className="text-sm text-muted italic">Bạn chưa chọn.</p>
    )}
  </div>
);

export const ResultView: React.FC<Props> = (p) => {
  const { state, scores, suggestions, grade, context, update } = p;
  const basis = state.completedAt || "";
  const summary = state.aiSummary?.basis === basis ? state.aiSummary.text : null;
  const revealed = state.revealed === basis;
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const asked = useRef("");
  const tops = topCodes(scores, 3);
  const unclear = unclearPoints(state, scores);
  const groups = groupSuggestions(suggestions, scores);

  const fetchSummary = async () => {
    setStatus("loading");
    try {
      const r = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: "Hướng nghiệp THCS", grade, messages: [{ role: "user", content: `${context}\n\n${SUMMARY_PROMPT}` }] }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data.reply) throw new Error();
      update((s) => ({ ...s, aiSummary: { text: String(data.reply).slice(0, 6000), basis } }));
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  };

  // Chỉ tự gọi AI 1 lần khi có kết quả khảo sát mới
  useEffect(() => {
    if (!summary && basis && asked.current !== basis) {
      asked.current = basis;
      fetchSummary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basis]);

  const chatContext = summary ? `${context}\n\nNhận xét tổng quan AI đã gửi cho bạn ấy trước đó:\n${summary.slice(0, 1500)}` : context;

  return (
    <div className="space-y-4">
      {/* 1. NHẬN XÉT TỔNG QUAN */}
      <section className="rounded-2xl bg-clay-card border border-clay-soft p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-extrabold text-navy flex items-center gap-2">
            <Bot className="w-5 h-5 text-clay-deep" /> Nhận xét tổng quan
          </h3>
          <SourceTag kind="ai" />
        </div>

        {summary ? (
          <div className="text-sm text-ink">
            <MathMarkdown>{summary}</MathMarkdown>
          </div>
        ) : status === "error" ? (
          <div role="alert" className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-3 text-sm text-amber-900">
            <p>AI tạm chưa dùng được nên chưa có nhận xét. Bạn vẫn xem được kết quả web tính sẵn ở mục bên dưới và các nghề phù hợp.</p>
            <button onClick={fetchSummary} className="min-h-10 px-4 rounded-xl bg-white border border-amber-300 text-amber-900 font-semibold inline-flex items-center gap-2 cursor-pointer">
              <RefreshCw className="w-4 h-4" /> Thử lại
            </button>
          </div>
        ) : (
          <div role="status" className="space-y-2" aria-label="AI đang viết nhận xét">
            <p className="text-sm text-muted">AI đang đọc kết quả của bạn...</p>
            <div className="h-3 rounded bg-clay-soft/70 animate-pulse w-11/12" />
            <div className="h-3 rounded bg-clay-soft/70 animate-pulse w-9/12" />
            <div className="h-3 rounded bg-clay-soft/70 animate-pulse w-10/12" />
          </div>
        )}

        <details className="group rounded-xl bg-white border border-clay-soft" open={status === "error"}>
          <summary className="min-h-12 px-4 flex items-center justify-between cursor-pointer text-sm font-bold text-navy list-none">
            Điểm 6 nhóm sở thích và thông tin bạn đã chọn
            <ArrowRight className="w-4 h-4 text-clay-deep transition group-open:rotate-90" />
          </summary>
          <div className="px-4 pb-4 space-y-5">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-bold text-navy">
                  Sở thích nổi bật:{" "}
                  {tops.length && !isFlat(scores) ? tops.map((c) => RIASEC[c].name).join(", ") : "chưa rõ (điểm các nhóm khá gần nhau)"}
                </span>
                <SourceTag kind="web" />
              </div>
              {RIASEC_ORDER.map((c) => (
                <div key={c} className="grid grid-cols-[6.5rem_1fr_3rem] items-center gap-2 text-sm">
                  <span className="font-semibold text-ink truncate">
                    {c} · {RIASEC[c].name}
                  </span>
                  <div className="h-3 rounded-full bg-clay-soft/50 overflow-hidden">
                    <div className={`h-full rounded-full ${tops.includes(c) ? "bg-clay-deep" : "bg-navy-soft/40"}`} style={{ width: `${(scores[c].score / 20) * 100}%` }} />
                  </div>
                  <span className="text-right tabular-nums text-muted">{scores[c].answered ? `${scores[c].score}/20` : "–"}</span>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <SourceTag kind="user" />
              <Chips title="Môn học bạn thích" items={state.profile.subjects} />
              <Chips title="Điểm mạnh bạn tự nhận" items={state.profile.strengths} />
              <Chips title="Nơi muốn làm việc sau này" items={state.profile.environments} />
              <Chips title="Kỹ năng muốn rèn thêm" items={state.profile.skills} />
            </div>
            {unclear.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-muted mb-1.5 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" /> Những điều còn chưa rõ
                </div>
                <ul className="space-y-1 text-sm text-ink list-disc pl-5">
                  {unclear.map((u) => (
                    <li key={u}>{u}</li>
                  ))}
                </ul>
              </div>
            )}
            <button onClick={p.onEditQuiz} className="min-h-11 px-4 rounded-xl bg-white border border-clay-soft hover:border-clay text-navy font-semibold text-sm inline-flex items-center gap-2 cursor-pointer">
              <Pencil className="w-4 h-4" /> Sửa câu trả lời
            </button>
          </div>
        </details>
      </section>

      {/* 2. TRÒ CHUYỆN VỚI AI */}
      <section className="rounded-2xl bg-clay-card border border-clay-soft p-5 sm:p-6 space-y-3">
        <h3 className="text-lg font-extrabold text-navy">Hỏi tiếp AI</h3>
        <CareerChat grade={grade} messages={state.chat} onChange={p.onChatChange} context={chatContext} ready />
      </section>

      {/* 3. NÚT XEM NGHỀ */}
      {!revealed ? (
        <button
          onClick={() => update((s) => ({ ...s, revealed: basis }))}
          className="w-full min-h-14 rounded-2xl bg-clay-deep hover:bg-clay-dark text-white font-extrabold text-base inline-flex items-center justify-center gap-2 cursor-pointer"
        >
          <Compass className="w-5 h-5" /> Khám phá những nghề phù hợp với bạn
        </button>
      ) : (
        /* 4. DANH SÁCH NHÓM NGHỀ GỢI Ý */
        <section className="space-y-4 animate-rise" aria-label="Nghề phù hợp với bạn">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xl font-extrabold text-navy">Những nghề phù hợp với bạn</h3>
            <SourceTag kind="web" />
          </div>
          <p className="text-sm text-muted">
            Web chọn các nghề này từ câu trả lời của bạn và gom theo nhóm sở thích. Đây là gợi ý để khám phá, không phải kết luận. Không nghề nào cao quý hơn nghề nào.
          </p>

          {groups.map((g) => (
            <div key={g.code} className="space-y-3">
              <div className="flex flex-wrap items-baseline gap-2">
                <CodeBadge code={g.code} full />
                <span className="text-sm text-muted">{RIASEC[g.code].short}</span>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {g.items.map(({ career: c, reasons }) => {
                  const saved = state.saved.includes(c.id);
                  const comparing = state.compare.includes(c.id);
                  return (
                    <article key={c.id} className="lift p-4 rounded-2xl bg-clay-card border border-clay-soft flex flex-col gap-3">
                      <div>
                        <h4 className="text-lg font-extrabold text-navy leading-snug">{c.name}</h4>
                        <div className="text-xs text-muted">{c.field}</div>
                      </div>
                      <p className="text-sm text-ink">{c.desc}</p>
                      <dl className="text-sm space-y-1">
                        <div>
                          <dt className="inline font-semibold text-navy">Kỹ năng thường dùng: </dt>
                          <dd className="inline text-ink">{c.skills.join(", ")}</dd>
                        </div>
                        <div>
                          <dt className="inline font-semibold text-navy">Môn học hỗ trợ: </dt>
                          <dd className="inline text-ink">{c.subjects.join(", ")}</dd>
                        </div>
                      </dl>
                      {reasons.length > 0 && (
                        <div className="p-3 rounded-xl bg-white border border-clay-soft">
                          <div className="text-xs font-bold text-clay-deep mb-1">Vì sao gợi ý cho bạn</div>
                          <ul className="text-xs text-ink list-disc pl-4 space-y-0.5">
                            {reasons.map((r) => (
                              <li key={r}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <p className="text-xs text-muted inline-flex items-start gap-1.5">
                        <FlaskConical className="w-3.5 h-3.5 text-clay-deep shrink-0 mt-0.5" /> Thử ngay: {c.experience.title} (khoảng {c.experience.minutes} phút)
                      </p>
                      <div className="mt-auto flex flex-wrap gap-2">
                        <button onClick={() => p.onOpenCareer(c.id)} className="min-h-11 px-4 rounded-xl bg-clay-deep hover:bg-clay-dark text-white font-bold text-sm inline-flex items-center gap-1.5 cursor-pointer">
                          Khám phá nghề này <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => p.onToggleSave(c.id)}
                          aria-pressed={saved}
                          className={`min-h-11 px-3.5 rounded-xl border text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer ${saved ? "bg-navy border-navy text-cream" : "bg-white border-clay-soft text-navy hover:border-clay"}`}
                        >
                          {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />} {saved ? "Đã lưu" : "Lưu"}
                        </button>
                        <button
                          onClick={() => p.onToggleCompare(c.id)}
                          aria-pressed={comparing}
                          disabled={!comparing && state.compare.length >= 3}
                          className={`min-h-11 px-3.5 rounded-xl border text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${comparing ? "bg-navy border-navy text-cream" : "bg-white border-clay-soft text-navy hover:border-clay"}`}
                        >
                          <Columns3 className="w-4 h-4" /> {comparing ? "Đang so sánh" : "So sánh"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}

          {state.compare.length > 0 && (
            <div className="sticky bottom-20 lg:bottom-4 z-10 p-3 rounded-2xl bg-navy text-cream flex flex-wrap items-center justify-between gap-2 shadow-lg">
              <span className="text-sm font-semibold">Đã chọn {state.compare.length}/3 nghề để so sánh</span>
              <button
                onClick={p.onOpenCompare}
                disabled={state.compare.length < 2}
                className="min-h-10 px-4 rounded-xl bg-clay-soft hover:bg-white text-navy disabled:opacity-60 font-bold text-sm cursor-pointer disabled:cursor-not-allowed"
              >
                {state.compare.length < 2 ? "Chọn thêm 1 nghề" : "Xem bảng so sánh"}
              </button>
            </div>
          )}

          <button onClick={p.onOpenCatalog} className="min-h-11 px-4 rounded-xl bg-white border border-clay-soft hover:border-clay text-navy font-semibold text-sm inline-flex items-center gap-2 cursor-pointer">
            <LayoutGrid className="w-4 h-4" /> Xem tất cả nghề trong danh mục
          </button>
        </section>
      )}
    </div>
  );
};
