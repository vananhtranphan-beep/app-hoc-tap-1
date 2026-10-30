import React, { useEffect } from "react";
import { X } from "lucide-react";
import { ONET_ATTRIBUTION, ONET_LICENSE_URL, RIASEC, RIASEC_ORDER, SOURCES } from "../../data/careerData";

// Trang "Về bộ câu hỏi này": nguồn, ghi công bản quyền, cách tính điểm
export const AboutQuestions: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-navy-deep/50 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Về bộ câu hỏi này"
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-cream rounded-t-3xl sm:rounded-3xl p-5 sm:p-7 space-y-5 animate-rise"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl font-extrabold text-navy">Về bộ câu hỏi này</h2>
          <button onClick={onClose} className="w-11 h-11 -mt-2 -mr-2 rounded-full flex items-center justify-center text-muted hover:bg-mist cursor-pointer" aria-label="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>

        <section className="space-y-2 text-sm text-ink">
          <h3 className="font-bold text-navy">Bộ câu hỏi dựa trên gì?</h3>
          <p>
            Phần sở thích dùng mô hình 6 nhóm sở thích nghề nghiệp của nhà tâm lý học John Holland (thường gọi là RIASEC). 30 câu hỏi được phỏng theo bản Mini-IP 30 câu
            của O*NET® Interest Profiler do Bộ Lao động Hoa Kỳ phát triển, dịch sang tiếng Việt và viết lại cho dễ hiểu với học sinh lớp 6–9.
          </p>
          <ul className="grid sm:grid-cols-2 gap-2 pt-1">
            {RIASEC_ORDER.map((c) => (
              <li key={c} className="p-3 rounded-xl bg-white border border-line">
                <span className="font-bold text-navy">
                  {c} · {RIASEC[c].name}
                </span>
                <span className="block text-xs text-muted mt-0.5">{RIASEC[c].short}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-2 text-sm text-ink">
          <h3 className="font-bold text-navy">Cách tính điểm</h3>
          <p>
            Mỗi câu có 5 mức từ "Rất không thích" (0 điểm) đến "Rất thích" (4 điểm). Mỗi nhóm có 5 câu, nên điểm mỗi nhóm từ 0 đến 20. Câu bỏ qua không được tính.
            Nghề được gợi ý từ danh mục có sẵn của web, dựa trên nhóm sở thích của nghề, môn học và điểm mạnh bạn chọn.
          </p>
          <p>Kết quả dùng để khám phá bản thân, không dùng để kết luận bạn hợp hay không hợp với nghề nào. Sở thích có thể thay đổi khi bạn lớn lên và trải nghiệm thêm.</p>
        </section>

        <section className="space-y-2 text-sm">
          <h3 className="font-bold text-navy">Nguồn tham khảo</h3>
          <ol className="list-decimal pl-5 space-y-1.5 text-ink">
            {SOURCES.map((s) => (
              <li key={s.text}>
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-line hover:text-teal-deep">
                    {s.text}
                  </a>
                ) : (
                  s.text
                )}
              </li>
            ))}
          </ol>
        </section>

        <section className="p-4 rounded-xl bg-white border border-line text-xs text-muted space-y-1.5">
          <h3 className="font-bold text-navy text-sm">Ghi công bản quyền</h3>
          <p>{ONET_ATTRIBUTION}</p>
          <p>
            Giấy phép:{" "}
            <a href={ONET_LICENSE_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-navy">
              O*NET Tools Developer License
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};
