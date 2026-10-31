import React, { useEffect, useRef, useState } from "react";
import { Bot, Send, User, Info, RotateCcw } from "lucide-react";
import { MathMarkdown } from "../MathMarkdown";
import { ChatMsg } from "../../lib/career";
import { SourceTag } from "./ui";

// ============================================================
// CHAT HƯỚNG NGHIỆP NHIỀU LƯỢT
// Gửi cho AI: bản tóm tắt sở thích (không tên) + câu hỏi. Lịch sử chat lưu trong tài khoản.
// ============================================================

// Câu hỏi gợi ý: khi đã có kết quả khảo sát / khi trò chuyện trực tiếp
const QUICK_RESULT = [
  "Nghề phù hợp nhất với mình cần học giỏi môn nào?",
  "Lên lớp 10 mình nên chọn những môn học nào?",
  "Từ bây giờ mình có thể chuẩn bị những gì?",
  "Hai nghề đầu tiên trong danh sách khác nhau thế nào?",
];
const QUICK_FREE = [
  "Nghiên cứu thị trường là làm gì?",
  "Nếu thích Toán nhưng không thích làm việc với máy tính thì có nghề nào?",
  "Làm sao để trở thành bác sĩ?",
  "Ngành logistics khác quản trị kinh doanh như thế nào?",
  "Những năm tới ngành nghề nào đang phát triển?",
];

interface Props {
  grade: string;
  messages: ChatMsg[];
  onChange: (m: ChatMsg[]) => void;
  /** Tóm tắt sở thích gửi kèm (không có thông tin cá nhân) */
  context: string;
  ready: boolean; // đã làm khảo sát chưa
  prefill?: { text: string; extra?: string } | null;
  onPrefillUsed?: () => void;
}

export const CareerChat: React.FC<Props> = ({ grade, messages, onChange, context, ready, prefill, onPrefillUsed }) => {
  const [input, setInput] = useState("");
  const [extra, setExtra] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!prefill) return;
    setInput(prefill.text);
    setExtra(prefill.extra);
    onPrefillUsed?.();
    setTimeout(() => inputRef.current?.focus(), 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefill]);

  useEffect(() => {
    if (messages.length) endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages.length, loading]);

  const send = async (text: string, apiExtra?: string) => {
    const q = text.trim();
    if (!q || loading) return;
    setError("");
    // Tin đầu tiên luôn kèm bản tóm tắt sở thích để AI biết bối cảnh
    const first = messages.length === 0;
    const userMsg: ChatMsg = {
      role: "user",
      content: q,
      apiContent: [first ? `${context}\n\nCâu hỏi của học sinh:` : "", q, apiExtra ? `\n\n${apiExtra}` : ""].filter(Boolean).join("\n"),
    };
    const history = [...messages, userMsg];
    onChange(history);
    setInput("");
    setExtra(undefined);
    setLoading(true);
    try {
      const toSend = history.length > 11 ? [history[0], ...history.slice(-10)] : history;
      const r = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: "Hướng nghiệp THCS",
          grade,
          messages: toSend.map((m) => ({ role: m.role, content: m.apiContent || m.content })),
        }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data.reply) throw new Error(data.error || "AI chưa trả lời được");
      onChange([...history, { role: "model", content: data.reply }]);
    } catch {
      // Không lưu câu báo lỗi vào lịch sử; giữ câu hỏi để em gửi lại
      onChange(messages);
      setInput(q);
      setExtra(apiExtra);
      setError("AI tạm chưa dùng được (có thể do mạng hoặc máy chủ AI chưa cấu hình). Các bước khám phá khác vẫn dùng bình thường.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {!ready && messages.length === 0 && (
        <div className="p-3 rounded-xl bg-clay-soft/50 border border-clay-soft text-sm text-navy">
          Bạn hỏi gì cũng được: nghề nghiệp, ngành học, sở thích, thế mạnh, con đường sau lớp 9. Nếu muốn AI gợi ý nghề sát với bạn hơn, bạn có thể làm khảo sát (không bắt buộc).
        </div>
      )}
      <p className="flex items-start gap-1.5 text-xs text-muted">
        <Info className="w-4 h-4 text-clay-deep shrink-0" />
        Khi bạn bấm gửi, web gửi cho AI: khối lớp, câu bạn hỏi và kết quả khảo sát nếu có (không có tên). AI không truy cập được số liệu mới trên mạng và có thể sai; hãy hỏi thêm thầy cô, bố mẹ.
      </p>

      {messages.length > 0 && (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`flex items-start gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-navy text-cream" : "bg-clay-soft text-clay-deep"}`}>
                {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </span>
              <div className={`max-w-[85%] min-w-0 rounded-2xl px-4 py-3 text-sm ${m.role === "user" ? "bg-navy text-cream rounded-tr-sm" : "bg-white border border-clay-soft rounded-tl-sm"}`}>
                {m.role === "model" && (
                  <div className="mb-1.5">
                    <SourceTag kind="ai" />
                  </div>
                )}
                <MathMarkdown tone={m.role === "user" ? "dark" : "light"}>{m.content}</MathMarkdown>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2.5" role="status">
              <span className="w-8 h-8 rounded-full bg-clay-soft text-clay-deep flex items-center justify-center">
                <Bot className="w-4 h-4 animate-pulse" />
              </span>
              <span className="text-sm text-muted">AI đang suy nghĩ...</span>
            </div>
          )}
          <div ref={endRef} />
        </div>
      )}


      {error && (
        <div role="alert" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-900">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {(ready ? QUICK_RESULT : QUICK_FREE).map((q) => (
          <button
            key={q}
            onClick={() => send(q)}
            disabled={loading}
            className="min-h-9 px-3 rounded-full bg-clay-soft hover:bg-clay-soft text-navy text-xs font-medium transition cursor-pointer disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input, extra);
        }}
        className="flex items-end gap-2"
      >
        <label className="flex-1 min-w-0">
          <span className="sr-only">Câu hỏi cho AI</span>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                send(input, extra);
              }
            }}
            rows={2}
            placeholder="Hỏi thêm AI, VD: Muốn làm kiến trúc sư thì cần chuẩn bị gì?"
            className="w-full px-3.5 py-2.5 rounded-xl border border-clay-soft bg-white text-sm focus:outline-none focus:ring-2 focus:ring-clay resize-none"
          />
        </label>
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="min-h-12 w-12 rounded-xl bg-clay-deep hover:bg-clay-dark disabled:opacity-50 text-white flex items-center justify-center cursor-pointer"
          aria-label="Gửi"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {messages.length > 0 && (
        <button
          onClick={() => {
            if (window.confirm("Xóa cuộc trò chuyện này?")) onChange([]);
          }}
          className="text-xs text-muted hover:text-navy inline-flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Bắt đầu cuộc trò chuyện mới
        </button>
      )}
    </div>
  );
};

