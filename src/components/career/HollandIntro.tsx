import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { INTEREST_ITEMS, RIASEC, RIASEC_ORDER } from "../../data/careerData";
import { CodeBadge } from "./ui";
import { Attribution } from "./QuizStep";

// ============================================================
// MÀN GIỚI THIỆU TRƯỚC KHI LÀM KHẢO SÁT (mô hình Holland – RIASEC)
// Không tuyên bố đây là bài trắc nghiệm chuẩn hóa hay đã được kiểm định.
// ============================================================

const NOTES = [
  "Không có câu trả lời đúng hay sai. Bạn chỉ cần chọn mức độ thích hay không thích.",
  "Câu trả lời giúp AI hiểu thêm sở thích và lĩnh vực bạn quan tâm để gợi ý nghề có cơ sở hơn.",
  "Kết quả chỉ để tham khảo, không quyết định nghề nghiệp tương lai của bạn. Sở thích có thể thay đổi khi bạn lớn lên và trải nghiệm thêm.",
  "Không cần cung cấp tên thật, ngày sinh, trường lớp hay bất kỳ thông tin nhận dạng nào.",
];

export const HollandIntro: React.FC<{ onStart: () => void; onOpenAbout: () => void; resumeAt?: number }> = ({ onStart, onOpenAbout, resumeAt }) => (
  <section className="rounded-2xl bg-clay-card border border-clay-soft p-5 sm:p-7 space-y-6 animate-rise">
    <div>
      <h2 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">Trước khi khám phá những nghề nghiệp tương lai...</h2>
      <p className="text-sm sm:text-base text-ink mt-2 leading-relaxed">
        Khảo sát này vận dụng <b>mô hình sở thích nghề nghiệp của nhà tâm lý học John Holland</b> (gọi tắt là RIASEC). Theo mô hình này, sở thích nghề nghiệp
        của mỗi người thường nghiêng về một vài trong 6 nhóm dưới đây. Ai cũng có một chút của nhiều nhóm.
      </p>
    </div>

    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {RIASEC_ORDER.map((c) => (
        <li key={c} className="p-4 rounded-xl bg-white border border-clay-soft space-y-1.5">
          <div className="flex items-center gap-2">
            <CodeBadge code={c} />
            <span className="font-bold text-navy">{RIASEC[c].name}</span>
            <span className="text-xs text-muted italic">{RIASEC[c].en}</span>
          </div>
          <p className="text-sm text-ink">{RIASEC[c].short}.</p>
          <p className="text-xs text-muted">Ví dụ: {RIASEC[c].like.toLowerCase()}.</p>
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
      {INTEREST_ITEMS.length} câu hỏi được phỏng theo bản 30 câu của O*NET® Interest Profiler (Bộ Lao động Hoa Kỳ), dịch và viết lại cho học sinh lớp 6–9. Đây là
      công cụ khám phá, chưa phải bài trắc nghiệm đã được chuẩn hóa hay kiểm định cho học sinh Việt Nam.
    </p>

    <div className="flex flex-wrap items-center gap-3">
      <button onClick={onStart} className="min-h-12 px-6 rounded-xl bg-clay-deep hover:bg-clay-dark text-white font-bold inline-flex items-center gap-2 cursor-pointer">
        {resumeAt ? `Làm tiếp từ câu ${resumeAt}` : "Bắt đầu khảo sát"} <ArrowRight className="w-4 h-4" />
      </button>
      <span className="text-xs text-muted">Khoảng 5–7 phút · Có thể bỏ qua câu bất kỳ</span>
    </div>
    <Attribution onOpenAbout={onOpenAbout} />
  </section>
);
