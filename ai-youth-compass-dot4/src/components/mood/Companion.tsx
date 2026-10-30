import React, { useEffect, useRef, useState } from "react";
import { Send, Heart, User, Info } from "lucide-react";
import { MathMarkdown } from "../MathMarkdown";
import { SAFETY_MESSAGES, SafetyCategory, detectSafety } from "../../lib/safety";
import { SupportPanel } from "./SupportPanel";

// ============================================================
// GÓC TÂM SỰ: trò chuyện nhiều lượt với AI đồng hành
// - KHÔNG lưu tin nhắn (đóng trang là mất)
// - Lớp an toàn chạy TRƯỚC khi gọi AI (trình duyệt) và trên máy chủ (api/_safety.js)
// - Chỉ gửi kèm thời tiết, nguyên nhân em vừa chọn nếu em đồng ý
// ============================================================

interface Msg {
  role: "user" | "model";
  content: string;
  safety?: SafetyCategory;
}

interface Props {
  grade: string;
  /** Thời tiết + nguyên nhân của lần check-in gần nhất (chỉ gửi nếu em tích chọn) */
  checkinContext?: string;
  onCareTurn: () => void; // một lượt tâm sự có phản hồi → cây tươi lại
}

const STARTERS = ["Hôm nay mình thấy hơi mệt", "Mình đang lo về bài kiểm tra", "Mình muốn hiểu vì sao mình buồn", "Mình chỉ muốn có người nghe"];

export const Companion: React.FC<Props> = ({ grade, checkinContext, onCareTurn }) => {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shareContext, setShareContext] = useState(false);
  const [danger, setDanger] = useState<SafetyCategory | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (msgs.length) endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [msgs.length, loading]);

  const send = async (text: string) => {
    const q = text.trim().slice(0, 1500);
    if (!q || loading) return;
    setError("");
    const history: Msg[] = [...msgs, { role: "user", content: q }];
    setInput("");

    // Lớp an toàn 1 (trên máy): có dấu hiệu nguy hiểm → không gửi cho AI, hiện hỗ trợ ngay
    const cat = detectSafety(q);
    if (cat) {
      setDanger(cat);
      setMsgs([...history, { role: "model", content: SAFETY_MESSAGES[cat], safety: cat }]);
      return;
    }

    setMsgs(history);
    setLoading(true);
    try {
      const firstUserIdx = history.findIndex((m) => m.role === "user");
      const toSend = history
        .filter((m) => !m.safety)
        .slice(-10)
        .map((m, i, arr) => ({
          role: m.role,
          content:
            shareContext && checkinContext && i === arr.findIndex((x) => x.role === "user") && firstUserIdx >= 0
              ? `(Bối cảnh bạn ấy đồng ý chia sẻ: ${checkinContext})\n\n${m.content}`
              : m.content,
        }));
      const r = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: "Tâm Sự Học Đường", grade, messages: toSend }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data.reply) throw new Error();
      // Lớp an toàn 2 (máy chủ) có thể trả về cờ an toàn
      if (data.safety) setDanger(data.safety);
      setMsgs([...history, { role: "model", content: data.reply, safety: data.safety }]);
      if (!data.safety) onCareTurn();
    } catch {
      setMsgs(msgs);
      setInput(q);
      setError("AI đồng hành tạm chưa dùng được. Bạn vẫn có thể thử các hoạt động chăm sóc bản thân bên dưới, hoặc nói chuyện với một người bạn tin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <p className="flex items-start gap-1.5 text-xs text-muted">
        <Info className="w-4 h-4 text-teal shrink-0" />
        Tin nhắn không được lưu lại. Khi bạn gửi, nội dung được chuyển tới dịch vụ AI để trả lời. AI không phải chuyên gia tâm lý và có thể sai.
      </p>

      {danger && <SupportPanel urgent />}

      {msgs.length > 0 && (
        <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1" aria-live="polite">
          {msgs.map((m, i) => (
            <div key={i} className={`flex items-start gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-navy text-cream" : m.safety ? "bg-rose-100 text-rose-700" : "bg-teal-soft text-teal-deep"}`}>
                {m.role === "user" ? <User className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
              </span>
              <div
                className={`max-w-[85%] min-w-0 rounded-2xl px-4 py-3 text-sm ${
                  m.role === "user" ? "bg-navy text-cream rounded-tr-sm" : m.safety ? "bg-rose-50 border border-rose-200 rounded-tl-sm" : "bg-[#f1f7f5] border border-teal-soft rounded-tl-sm"
                }`}
              >
                <MathMarkdown tone={m.role === "user" ? "dark" : "light"}>{m.content}</MathMarkdown>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2.5" role="status">
              <span className="w-8 h-8 rounded-full bg-teal-soft text-teal-deep flex items-center justify-center">
                <Heart className="w-4 h-4 animate-pulse" />
              </span>
              <span className="text-sm text-muted">Đang lắng nghe...</span>
            </div>
          )}
          <div ref={endRef} />
        </div>
      )}

      {msgs.length === 0 && (
        <div className="flex flex-wrap gap-2">
          {STARTERS.map((s) => (
            <button key={s} onClick={() => send(s)} className="min-h-10 px-3.5 rounded-full bg-mist hover:bg-teal-soft text-navy text-sm cursor-pointer">
              {s}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div role="alert" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-900">
          {error}
        </div>
      )}

      {checkinContext && msgs.length === 0 && (
        <label className="flex items-start gap-2 text-sm text-navy cursor-pointer">
          <input type="checkbox" checked={shareContext} onChange={(e) => setShareContext(e.target.checked)} className="w-5 h-5 mt-0.5 accent-[#328f89]" />
          <span>
            Gửi kèm điều bạn vừa chọn khi check-in (<i>{checkinContext}</i>) để AI hiểu bối cảnh. Ghi chú riêng và nhật ký cũ không được gửi.
          </span>
        </label>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-end gap-2"
      >
        <label className="flex-1 min-w-0">
          <span className="sr-only">Tin nhắn tâm sự</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={2}
            placeholder="Bạn muốn kể gì cũng được..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-cream text-sm focus:outline-none focus:ring-2 focus:ring-teal resize-none"
          />
        </label>
        <button type="submit" disabled={loading || !input.trim()} className="min-h-12 w-12 rounded-xl bg-teal hover:bg-teal-deep disabled:opacity-50 text-white flex items-center justify-center cursor-pointer" aria-label="Gửi">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
