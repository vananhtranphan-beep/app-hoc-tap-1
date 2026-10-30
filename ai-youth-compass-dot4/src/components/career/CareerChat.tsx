import React, { useEffect, useRef, useState } from "react";
import { Bot, Send, User, Info, RotateCcw } from "lucide-react";
import { MathMarkdown } from "../MathMarkdown";
import { ChatMsg } from "../../lib/career";
import { SourceTag } from "./ui";

// ============================================================
// CHAT HƯỚNG NGHIỆP NHIỀU LƯỢT
// Gửi cho AI: bản tóm tắt sở thích (không tên) + câu hỏi. Lịch sử chat lưu trong tài khoản.
// ============================================================

const QUICK = [
  "Nghề phù hợp nhất với mình cần học giỏi môn nào?",
  "Lên lớp 10 mình nên chọn những môn học nào?",
  "Từ bây giờ mình có thể chuẩn bị những gì?",
  "Hai nghề đầu tiên trong danh sách khác nhau thế nào?",
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
        <div className="p-3 rounded-xl bg-mist/60 border border-line text-sm text-navy">
          Bạn chưa làm khảo sát ở bước 1, nên AI chỉ trả lời chung chung. Làm khảo sát trước để AI gợi ý sát với bạn hơn.
        </div>
      )}
      <p className="flex items-start gap-1.5 text-xs text-muted">
        <Info className="w-4 h-4 text-teal shrink-0" />
        Khi bạn bấm gửi, web gửi cho AI: kết quả tổng hợp sở thích (không có tên), khối lớp và câu bạn hỏi. AI có thể sai; hãy hỏi thêm thầy cô, bố mẹ.
      </p>

      {messages.length > 0 && (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`flex items-start gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-navy text-cream" : "bg-teal-soft text-teal-deep"}`}>
                {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </span>
              <div className={`max-w-[85%] min-w-0 rounded-2xl px-4 py-3 text-sm ${m.role === "user" ? "bg-navy text-cream rounded-tr-sm" : "bg-cream border border-line rounded-tl-sm"}`}>
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
              <span className="w-8 h-8 rounded-full bg-teal-soft text-teal-deep flex items-center justify-center">
                <Bot className="w-4 h-4 animate-pulse" />
              </span>
              <span className="text-sm text-muted">AI đang suy nghĩ...</span>
            </div>
          )}
          <div ref={endRef} />
        </div>
      )}

      {ready && messages.length === 0 && !loading && (
        <PrimaryBtnFull onClick={() => send("Dựa trên kết quả khảo sát, bạn nhận xét giúp mình và gợi ý vài nghề để mình tìm hiểu nhé.")}>
          <Bot className="w-4 h-4" /> Nhờ AI nhận xét và gợi ý
        </PrimaryBtnFull>
      )}

      {error && (
        <div role="alert" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-900">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {QUICK.map((q) => (
          <button
            key={q}
            onClick={() => send(q)}
            disabled={loading}
            className="min-h-9 px-3 rounded-full bg-mist hover:bg-teal-soft text-navy text-xs font-medium transition cursor-pointer disabled:opacity-50"
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
            className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-cream text-sm focus:outline-none focus:ring-2 focus:ring-teal resize-none"
          />
        </label>
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="min-h-12 w-12 rounded-xl bg-teal hover:bg-teal-deep disabled:opacity-50 text-white flex items-center justify-center cursor-pointer"
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

const PrimaryBtnFull: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (p) => (
  <button
    {...p}
    className="w-full min-h-12 rounded-xl bg-teal hover:bg-teal-deep text-white font-bold text-sm transition cursor-pointer inline-flex items-center justify-center gap-2"
  />
);
