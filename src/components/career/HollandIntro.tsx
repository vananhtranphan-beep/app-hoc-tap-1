import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { INTEREST_ITEMS, RIASEC, RIASEC_ORDER } from "../../data/careerData";
import { CodeBadge } from "./ui";
import { Attribution } from "./QuizStep";

// ============================================================
// MÀN GIỚI THIỆU TRƯỚC KHI LÀM PHIẾU (lí thuyết mật mã Holland theo SGK Công nghệ 9)
// Không tuyên bố đây là bài trắc nghiệm chuẩn hóa hay đã được kiểm định.
// ============================================================

const NOTES = [
  "Không có câu trả lời đúng hay sai. Em chỉ cần chọn mỗi câu giống mình đến mức nào.",
  "Web tự cộng điểm 6 nhóm theo công thức cố định, rồi so với danh sách nghề để gợi ý. AI chỉ giải thích kết quả.",
  "Kết quả chỉ để tham khảo, giúp em hiểu mình hơn. Sở thích và tính cách có thể thay đổi khi em lớn lên và trải nghiệm thêm.",
  "Không cần cung cấp tên thật, ngày sinh, trường lớp hay bất kỳ thông tin nhận dạng nào.",
];

export const HollandIntro: React.FC<{ onStart: () => void; onOpenAbout: () => void; resumeAt?: number }> = ({ onStart, onOpenAbout, resumeAt }) => (
  <section className="rounded-2xl bg-clay-card border border-clay-soft p-5 sm:p-7 space-y-6 animate-rise">
    <div>
      <h2 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">Trước khi khám phá những nghề nghiệp tương lai...</h2>
      <p className="text-sm sm:text-base text-ink mt-2 leading-relaxed">
        Phiếu này dựa trên <b>lí thuyết mật mã Holland</b> mà em được học trong SGK Công nghệ 9 (Hình 4.2). Theo lí thuyết này có 6 nhóm tính cách nghề nghiệp.
        Mỗi người thường mang đặc điểm của 2–3 nhóm, không ai chỉ thuộc đúng một nhóm.
      </p>
    </div>

    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {RIASEC_ORDER.map((c) => (
        <li key={c} className="p-4 rounded-xl bg-white border border-clay-soft space-y-1.5">
          <div className="flex items-center gap-2">
            <CodeBadge code={c} />
            <span className="font-bold text-navy">{RIASEC[c].name}</span>
          </div>
          <p className="text-sm text-ink">{RIASEC[c].short}.</p>
          <p className="text-xs text-muted">{RIASEC[c].like}.</p>
        </li>
      ))}
    </ul>

    <ul className="space-y-2">
      {NOTES.map((n) => (
        <li key={n} className="flex items-start gap-2 text-sm text-ink">
          <CheckCircle2 className="w-4 h-4 text-clay-deep mt-0.5 shrink-0" /> {n}
        </li>
      ))}
    </ul>

    <p className="text-xs text-muted leading-relaxed">
      {INTEREST_ITEMS.length} câu được tách từ đặc điểm của 6 nhóm trong Hình 4.2, mỗi nhóm 3 câu, viết lại cho dễ hiểu và xếp xen kẽ. Đây là công cụ tự khám phá,
      chưa phải bài trắc nghiệm đã được chuẩn hóa.
    </p>

    <div className="flex flex-wrap items-center gap-3">
      <button onClick={onStart} className="min-h-12 px-6 rounded-xl bg-clay-deep hover:bg-clay-dark text-white font-bold inline-flex items-center gap-2 cursor-pointer">
        {resumeAt ? `Làm tiếp từ câu ${resumeAt}` : "Bắt đầu"} <ArrowRight className="w-4 h-4" />
      </button>
      <span className="text-xs text-muted">Khoảng 3–5 phút · Cần trả lời đủ {INTEREST_ITEMS.length} câu</span>
    </div>
    <Attribution onOpenAbout={onOpenAbout} />
  </section>
);
