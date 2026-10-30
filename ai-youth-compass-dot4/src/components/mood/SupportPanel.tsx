import React, { useState } from "react";
import { Phone, Users, MessageSquare, Copy, Check } from "lucide-react";
import { HOTLINES } from "../../lib/safety";

// Tin nhắn soạn sẵn để nhờ người lớn lắng nghe (em có thể sửa trước khi gửi)
export const ASK_ADULT_MESSAGE =
  "Con/em đang gặp một chuyện khó và thấy không ổn lắm. Bố/mẹ/thầy/cô có thể dành chút thời gian nói chuyện với con/em hôm nay được không ạ?";

// Khung hỗ trợ: tìm người lớn tin cậy và số điện thoại khi cần
export const SupportPanel: React.FC<{ urgent?: boolean; message?: string }> = ({ urgent, message }) => {
  const [showMsg, setShowMsg] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ASK_ADULT_MESSAGE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section role={urgent ? "alert" : "region"} aria-label="Tìm người hỗ trợ" className={`rounded-2xl border p-4 sm:p-5 space-y-3 ${urgent ? "bg-rose-50 border-rose-200" : "bg-white border-line"}`}>
      {message && <p className="text-sm text-ink font-medium leading-relaxed">{message}</p>}
      <div className="flex items-start gap-2 text-sm text-navy">
        <Users className="w-4 h-4 mt-0.5 shrink-0 text-teal" />
        <span>Người có thể giúp bạn: bố mẹ, người thân, giáo viên chủ nhiệm, thầy cô tư vấn tâm lý của trường, nhân viên y tế trường.</span>
      </div>
      <div className="grid sm:grid-cols-3 gap-2">
        {HOTLINES.map((h) => (
          <a
            key={h.number}
            href={`tel:${h.number}`}
            className="min-h-14 px-3 py-2 rounded-xl bg-white border border-line hover:border-teal flex items-center gap-3 transition"
          >
            <span className="w-10 h-10 rounded-full bg-navy text-cream flex items-center justify-center font-extrabold text-sm shrink-0">{h.number}</span>
            <span className="min-w-0 leading-tight">
              <span className="block text-sm font-bold text-navy">{h.name}</span>
              <span className="block text-xs text-muted">{h.note}</span>
            </span>
            <Phone className="w-4 h-4 text-teal ml-auto shrink-0" />
          </a>
        ))}
      </div>

      <div className="space-y-2">
        <button
          onClick={() => setShowMsg(!showMsg)}
          aria-expanded={showMsg}
          className="min-h-11 px-4 rounded-xl bg-white border border-line hover:border-teal text-navy text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-teal" /> Soạn sẵn tin nhắn nhờ người lớn lắng nghe
        </button>
        {showMsg && (
          <div className="p-3 rounded-xl bg-white border border-line space-y-2">
            <p className="text-sm text-ink">{ASK_ADULT_MESSAGE}</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={copy} className="min-h-10 px-3.5 rounded-xl bg-teal hover:bg-teal-deep text-white text-sm font-bold inline-flex items-center gap-1.5 cursor-pointer">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? "Đã sao chép" : "Sao chép"}
              </button>
              <a
                href={`sms:?&body=${encodeURIComponent(ASK_ADULT_MESSAGE)}`}
                className="min-h-10 px-3.5 rounded-xl bg-white border border-line hover:border-teal text-navy text-sm font-semibold inline-flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" /> Mở tin nhắn điện thoại
              </a>
            </div>
            <p className="text-xs text-muted">Bạn có thể sửa lại cho hợp rồi gửi cho người bạn tin. Web không tự gửi gì cả.</p>
          </div>
        )}
      </div>
    </section>
  );
};
