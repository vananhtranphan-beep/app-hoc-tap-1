import React, { useMemo, useState } from "react";
import { Bookmark, BookmarkCheck, Columns3, Search, X, ArrowRight, Sparkles } from "lucide-react";
import { CAREERS, Career, RIASEC, RIASEC_ORDER, RiasecCode, careerById } from "../../data/careerData";
import { CareerState } from "../../lib/career";
import { Card, CodeBadge, GhostBtn, PrimaryBtn } from "./ui";

// ============================================================
// BƯỚC 3: KHÁM PHÁ NHÓM NGHỀ (danh mục có sẵn, lọc theo nhóm, lưu, so sánh)
// ============================================================

interface Props {
  state: CareerState;
  recommendedIds: string[];
  onOpenCareer: (id: string) => void;
  onToggleSave: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onClearCompare: () => void;
}

type Filter = "all" | "saved" | "rec" | RiasecCode;

export const CompareTable: React.FC<{ ids: string[]; onClose: () => void; onRemove: (id: string) => void }> = ({ ids, onClose, onRemove }) => {
  const list = ids.map(careerById).filter(Boolean) as Career[];
  const rows: { label: string; get: (c: Career) => React.ReactNode }[] = [
    { label: "Nhóm sở thích", get: (c) => <div className="flex flex-wrap gap-1">{c.codes.map((x) => <CodeBadge key={x} code={x} full />)}</div> },
    { label: "Lĩnh vực", get: (c) => c.field },
    { label: "Công việc", get: (c) => c.desc },
    { label: "Hoạt động tiêu biểu", get: (c) => <ul className="list-disc pl-4 space-y-0.5">{c.activities.map((a) => <li key={a}>{a}</li>)}</ul> },
    { label: "Kỹ năng", get: (c) => c.skills.join(", ") },
    { label: "Môn học liên quan", get: (c) => c.subjects.join(", ") },
  ];
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-extrabold text-navy">So sánh {list.length} nghề</h3>
        <button onClick={onClose} className="w-11 h-11 rounded-full flex items-center justify-center text-muted hover:bg-mist cursor-pointer" aria-label="Đóng so sánh">
          <X className="w-5 h-5" />
        </button>
      </div>
      {list.length < 2 ? (
        <p className="text-sm text-muted">Chọn thêm ít nhất 1 nghề (bấm nút "So sánh" trên thẻ nghề) để so sánh.</p>
      ) : (
        <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
          <table className="w-full min-w-[560px] text-sm border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="w-32" />
                {list.map((c) => (
                  <th key={c.id} className="text-left p-3 bg-navy text-cream first:rounded-tl-xl last:rounded-tr-xl align-top">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold">{c.name}</span>
                      <button onClick={() => onRemove(c.id)} className="text-mist/70 hover:text-white cursor-pointer" aria-label={`Bỏ ${c.name} khỏi so sánh`}>
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label}>
                  <th scope="row" className="text-left p-3 text-xs font-bold text-muted align-top border-b border-line">
                    {r.label}
                  </th>
                  {list.map((c) => (
                    <td key={c.id} className="p-3 align-top border-b border-line text-ink">
                      {r.get(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export const CatalogStep: React.FC<Props> = ({ state, recommendedIds, onOpenCareer, onToggleSave, onToggleCompare, onClearCompare }) => {
  const [filter, setFilter] = useState<Filter>(recommendedIds.length ? "rec" : "all");
  const [q, setQ] = useState("");
  const [showCompare, setShowCompare] = useState(false);

  const list = useMemo(() => {
    const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d");
    const nq = norm(q.trim());
    let l = CAREERS;
    if (filter === "saved") l = l.filter((c) => state.saved.includes(c.id));
    else if (filter === "rec") l = recommendedIds.map((id) => careerById(id)).filter(Boolean) as Career[];
    else if (filter !== "all") l = l.filter((c) => c.codes[0] === filter);
    if (nq) l = l.filter((c) => norm(`${c.name} ${c.field} ${c.desc}`).includes(nq));
    return l;
  }, [filter, q, state.saved, recommendedIds]);

  const filters: { id: Filter; label: string }[] = [
    ...(recommendedIds.length ? [{ id: "rec" as Filter, label: "Gợi ý cho bạn" }] : []),
    { id: "all", label: `Tất cả (${CAREERS.length})` },
    { id: "saved", label: `Đã lưu (${state.saved.length})` },
    ...RIASEC_ORDER.map((c) => ({ id: c as Filter, label: `${c} · ${RIASEC[c].name}` })),
  ];

  return (
    <div className="space-y-4">
      {showCompare && <CompareTable ids={state.compare} onClose={() => setShowCompare(false)} onRemove={onToggleCompare} />}

      <Card className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="relative flex-1">
            <span className="sr-only">Tìm nghề</span>
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm nghề, VD: bác sĩ, thiết kế..."
              className="w-full min-h-11 pl-10 pr-3 rounded-xl border border-line bg-cream text-sm focus:outline-none focus:ring-2 focus:ring-teal"
            />
          </label>
          {state.compare.length > 0 && (
            <PrimaryBtn onClick={() => setShowCompare(true)}>
              <Columns3 className="w-4 h-4" /> So sánh ({state.compare.length}/3)
            </PrimaryBtn>
          )}
          {state.compare.length > 0 && (
            <GhostBtn onClick={onClearCompare} aria-label="Bỏ chọn so sánh">
              Bỏ chọn
            </GhostBtn>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`min-h-10 px-3.5 rounded-full text-sm font-medium border whitespace-nowrap transition cursor-pointer ${
                filter === f.id ? "bg-navy border-navy text-cream" : "bg-white border-line text-ink hover:border-teal"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Card>

      {list.length === 0 ? (
        <Card>
          <p className="text-sm text-muted">{filter === "saved" ? "Bạn chưa lưu nghề nào. Bấm biểu tượng dấu trang trên thẻ nghề để lưu." : "Không tìm thấy nghề phù hợp."}</p>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {list.map((c) => {
            const saved = state.saved.includes(c.id);
            const comparing = state.compare.includes(c.id);
            const rec = recommendedIds.includes(c.id);
            return (
              <article key={c.id} className="lift p-4 rounded-2xl bg-white border border-line flex flex-col gap-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    {rec && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-deep mb-1">
                        <Sparkles className="w-3 h-3" /> Hợp với sở thích của bạn
                      </span>
                    )}
                    <h3 className="font-bold text-navy leading-snug">{c.name}</h3>
                    <div className="text-xs text-muted">{c.field}</div>
                  </div>
                  <button
                    onClick={() => onToggleSave(c.id)}
                    aria-pressed={saved}
                    aria-label={saved ? `Bỏ lưu ${c.name}` : `Lưu ${c.name}`}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 cursor-pointer ${saved ? "bg-teal text-white border-teal" : "bg-white border-line text-muted hover:text-navy"}`}
                  >
                    {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex gap-1">
                  {c.codes.map((x) => (
                    <CodeBadge key={x} code={x} />
                  ))}
                </div>
                <p className="text-sm text-ink line-clamp-3">{c.desc}</p>
                <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() => onToggleCompare(c.id)}
                    disabled={!comparing && state.compare.length >= 3}
                    aria-pressed={comparing}
                    className={`min-h-10 px-3 rounded-lg text-xs font-semibold border transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                      comparing ? "bg-navy text-cream border-navy" : "bg-white border-line text-navy hover:border-teal"
                    }`}
                  >
                    {comparing ? "Đang so sánh" : "So sánh"}
                  </button>
                  <button onClick={() => onOpenCareer(c.id)} className="min-h-10 text-sm font-semibold text-teal-deep hover:text-navy inline-flex items-center gap-1 cursor-pointer">
                    Xem chi tiết <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
