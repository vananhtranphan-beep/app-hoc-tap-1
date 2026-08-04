import React, { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Sparkles, BookOpen, RefreshCw } from "lucide-react";

interface Message {
  role: "user" | "model";
  content: string;
}

interface AITutorViewProps {
  userId?: string;
}

export const AITutorView: React.FC<AITutorViewProps> = ({ userId }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content: "Xin chào em! Thầy/Cô là **AI Tutor** - Gia sư ảo thông minh của AI Study Hub. 🤖\nEm có thể hỏi Thầy/Cô bất kỳ bài tập hay lý thuyết môn **Toán Học** hoặc các môn học khác. Thầy/Cô sẽ giải thích từng bước rõ ràng nhất cho em!",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [subject, setSubject] = useState("Toán Học");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMsg = inputMessage.trim();
    setInputMessage("");
    const newMessages: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          messages: newMessages,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Lỗi kết nối AI");

      setMessages([...newMessages, { role: "model", content: data.reply }]);
    } catch (err: any) {
      setMessages([
        ...newMessages,
        { role: "model", content: "⚠️ Lỗi kết nối AI: " + err.message + ". Em thử lại nhé!" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto p-2 sm:p-4 space-y-4">
      {/* Header Bar */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-violet-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-violet-600 shadow-inner">
            <Bot className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold">🤖 AI Tutor THCS 24/7</h2>
            <p className="text-xs text-violet-200">Gia sư ảo thông minh đồng hành cùng học sinh</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-violet-300">Môn:</span>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-violet-900/80 border border-violet-400/40 text-xs font-bold text-white focus:outline-none"
          >
            <option value="Toán Học">Toán Học</option>
            <option value="Ngữ Văn">Ngữ Văn</option>
            <option value="Tiếng Anh">Tiếng Anh</option>
            <option value="Khoa Học Tự Nhiên">Khoa Học Tự Nhiên</option>
            <option value="Lịch Sử & Địa Lý">Lịch Sử & Địa Lý</option>
            <option value="Tin Học">Tin Học</option>
          </select>
        </div>
      </div>

      {/* Chat Messages Box */}
      <div className="flex-1 overflow-y-auto p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                msg.role === "user" ? "bg-violet-600 text-white" : "bg-slate-900 text-violet-400"
              }`}
            >
              {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>

            <div
              className={`max-w-[80%] p-4 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-violet-600 text-white rounded-tr-none shadow-md"
                  : "bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none shadow-xs space-y-2"
              }`}
            >
              {msg.role === "model" && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>AI chỉ có tính chất tham khảo</span>
                </div>
              )}
              <div className="whitespace-pre-line font-medium">{msg.content}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-slate-900 text-violet-400 flex items-center justify-center">
              <Bot className="w-5 h-5 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 font-bold animate-pulse">
              AI Tutor đang soạn câu trả lời...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={`Hỏi AI Tutor về bài tập môn ${subject}...`}
          className="flex-1 px-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm font-medium text-slate-800"
        />
        <button
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
          className="px-6 py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center gap-2 shrink-0"
        >
          <span>Gửi</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
