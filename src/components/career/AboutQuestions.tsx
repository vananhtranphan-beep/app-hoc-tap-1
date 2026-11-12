import React, { useEffect } from "react";
import { X } from "lucide-react";
import {
  CAREERS,
  FLAT_GAP,
  INTEREST_ITEMS,
  MAX_SCORE,
  MIN_SCORE,
  ONET_ATTRIBUTION,
  ONET_LICENSE_URL,
  ONET_MATCHED,
  RIASEC,
  RIASEC_ORDER,
  SOURCES,
  VLU_ROWS,
} from "../../data/careerData";

// Trang "Nguồn và cách tính điểm"
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
        aria-label="Nguồn và cách tính điểm"
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-clay-card rounded-t-3xl sm:rounded-3xl p-5 sm:p-7 space-y-5 animate-rise"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl font-extrabold text-navy">Nguồn và cách tính điểm</h2>
          <button onClick={onClose} className="w-11 h-11 -mt-2 -mr-2 rounded-full flex items-center justify-center text-muted hover:bg-clay-soft cursor-pointer" aria-label="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>

        <section className="space-y-2 text-sm text-ink">
          <h3 className="font-bold text-navy">Câu hỏi dựa trên gì?</h3>
          <p>
            6 nhóm tính cách và đặc điểm của từng nhóm lấy từ Hình 4.2 "Sáu nhóm tính cách trong lí thuyết mật mã Holland", SGK Công nghệ 9 – Định hướng nghề nghiệp
            (bộ Kết nối tri thức với cuộc sống). Nhóm nghiên cứu tách đặc điểm mỗi nhóm thành 3 câu ngắn ({INTEREST_ITEMS.length} câu), chia đều để không nhóm nào
            được cộng nhiều điểm hơn chỉ vì có nhiều câu hơn. Các câu xếp xen kẽ và không ghi tên nhóm.
          </p>
          <ul className="grid sm:grid-cols-2 gap-2 pt-1">
            {RIASEC_ORDER.map((c) => (
              <li key={c} className="p-3 rounded-xl bg-white border border-clay-soft">
                <span className="font-bold text-navy">{RIASEC[c].name}</span>
                <span className="block text-xs text-muted mt-0.5">
                  {RIASEC[c].short}. {RIASEC[c].like}.
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-2 text-sm text-ink">
          <h3 className="font-bold text-navy">Cách tính điểm và mã Holland</h3>
          <p>
            Mỗi câu chấm từ 1 (không giống em chút nào) đến 5 (rất giống em). Điểm mỗi nhóm là tổng 3 câu, từ {MIN_SCORE} đến {MAX_SCORE}. Web xếp 6 nhóm từ cao xuống
            thấp và lấy 3 nhóm cao nhất làm mã Holland của em. Hai nhóm bằng điểm thì xếp cùng hạng.
          </p>
          <p>
            Nếu nhóm cao nhất và thấp nhất chênh nhau dưới {FLAT_GAP} điểm, web báo "chưa rõ nét" và không đưa ra mã, vì lúc đó chưa thấy nhóm nào nổi bật.
          </p>
        </section>

        <section className="space-y-2 text-sm text-ink">
          <h3 className="font-bold text-navy">Cách chọn nghề gợi ý</h3>
          <p>
            Danh mục gồm {CAREERS.length} nghề, ngành ({VLU_ROWS} dòng nhóm – nghề) theo tài liệu hướng nghiệp của Trường ĐH Văn Lang.
            {ONET_MATCHED > 0
              ? ` ${ONET_MATCHED} nghề đã được ghép với nghề tương ứng trong cơ sở dữ liệu O*NET (Bộ Lao động Hoa Kỳ) để lấy mã Holland; các nghề còn lại dùng nhóm theo Văn Lang.`
              : " Chưa ghép mã O*NET, nên web đang dùng nhóm theo Văn Lang."}
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <b>Rất phù hợp</b>: nhóm chính của nghề trùng nhóm cao nhất của em, và nghề còn thuộc thêm ít nhất một nhóm cao khác của em.
            </li>
            <li>
              <b>Phù hợp</b>: nhóm chính của nghề nằm trong 3 nhóm cao của em.
            </li>
          </ul>
          <p>AI chỉ đọc kết quả web đã tính để giải thích, không tính điểm và không thêm nghề ngoài danh sách. Kết quả dùng để khám phá bản thân, không để kết luận.</p>
        </section>

        <section className="space-y-2 text-sm">
          <h3 className="font-bold text-navy">Nguồn tham khảo</h3>
          <ol className="list-decimal pl-5 space-y-1.5 text-ink">
            {SOURCES.map((s) => (
              <li key={s.text}>
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-line hover:text-clay-deep">
                    {s.text}
                  </a>
                ) : (
                  s.text
                )}
              </li>
            ))}
          </ol>
        </section>

        {ONET_MATCHED > 0 && (
          <section className="p-4 rounded-xl bg-white border border-clay-soft text-xs text-muted space-y-1.5">
            <h3 className="font-bold text-navy text-sm">Ghi công dữ liệu O*NET</h3>
            <p>{ONET_ATTRIBUTION}</p>
            <p>
              Giấy phép:{" "}
              <a href={ONET_LICENSE_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-navy">
                CC BY 4.0
              </a>
            </p>
          </section>
        )}
      </div>
    </div>
  );
};
