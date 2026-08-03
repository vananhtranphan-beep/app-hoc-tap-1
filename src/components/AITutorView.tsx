import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, RefreshCw, User, Copy, Check } from "lucide-react";
import { ChatMessage } from "../types";
import { GoogleGenAI } from "@google/genai";

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export const AITutorView: React.FC = () => {
  const [subject, setSubject] = useState("Toán Học");
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-1",
      role: "model",
      content: `Xin chào em! Thầy/Cô là **AI Tutor** - Gia sư ảo thông minh của AI Study Hub. 🤖\n\nEm có thể hỏi Thầy/Cô bất kỳ bài tập hay lý thuyết môn **${subject}** hoặc các môn học khác. Thầy/Cô sẽ giải thích từng bước rõ ràng nhất cho em!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Chưa cấu hình VITE_GEMINI_API_KEY trong Environment Variables của Vercel!");
      }

      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `Bạn là AI Tutor - Gia sư ảo thông minh chuyên hỗ trợ học sinh cấp 2 (THCS) môn ${subject}. Hãy giải thích chi tiết, thân thiện, dễ hiểu, từng bước một.`;

      const chatHistory = messages.map((m) => ({
        role: m.role === "model" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      chatHistory.push({
        role: "user",
        parts: [{ text: query }],
      });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: chatHistory,
        config: {
          systemInstruction: systemInstruction,
        }
      });

      const replyText = response.text || "Xin lỗi, Thầy/Cô chưa nhận được câu trả lời. Em thử lại nhé!";

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "model",
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "model",
        content: `⚠️ Lỗi kết nối AI: ${err.message}. Em kiểm tra lại API Key nhé!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const samplePrompts = [
    "Giải phương trình: 2x² - 7x + 3 = 0 từng bước",
    "Phân tích ý nghĩa hình tượng bát cháo hành trong tác phẩm Chí Phèo",
    "Giải thích sự khác biệt giữa Thì Hiện Tại Đơn và Hiện Tại Tiếp Diễn",
    "Phát biểu Định luật bảo toàn khối lượng môn Hóa học 8",
  ];

  return (
    <div className="space-y-4 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span>🤖 Gia Sư AI Tutor Thông Minh</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                Gemini 2.5 Flash
              </span>
            </h2>
            <p className="text-xs text-indigo-200 mt-0.5">
              Hỗ trợ học tập 24/7, giải bài tập từng bước, giải thích công thức & ôn thi
            </p>
          </div>
        </div>

        {/* Subject Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white/10 p-1.5 rounded-xl border border-white/10">
          {["Toán Học", "Ngữ Văn", "Tiếng Anh", "KHTN (Lí/Hóa/Sinh)", "Lịch Sử", "Tin Học"].map((s) => (
            <button
              key={s}
              onClick={() => setSubject(s)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${subject === s
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[600px]">
        {/* Chat Messages List */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isAI = msg.role === "model";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isAI ? "mr-auto" : "ml-auto flex-row-reverse"}`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-sm ${isAI
                      ? "bg-gradient-to-tr from-indigo-600 to-blue-600"
                      : "bg-gradient-to-tr from-slate-700 to-slate-900"
                    }`}
                >
                  {isAI ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>

                <div className={`group relative space-y-1.5 ${isAI ? "items-start" : "items-end"} w-full`}>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 px-1">
                    <span className="font-bold text-slate-700">{isAI ? "AI Tutor" : "Học Sinh"}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm overflow-x-auto ${isAI
                        ? "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                        : "bg-indigo-600 text-white rounded-tr-none whitespace-pre-wrap"
                      }`}
                  >
                    {isAI && (
                      <div className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80 mb-2.5 inline-flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>AI chỉ có tính chất tham khảo</span>
                      </div>
                    )}

                    <div className="prose prose-sm max-w-none text-slate-800">
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>

                  {isAI && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="text-xs text-slate-400 hover:text-indigo-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition px-1 cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Đã sao chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center max-w-md">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 animate-spin" />
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-tl-none text-xs text-slate-500 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                <span>AI Tutor đang suy luận và soạn câu trả lời...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Sample Prompts */}
        <div className="p-3 bg-slate-100/80 border-t border-slate-200 overflow-x-auto scrollbar-none flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-slate-500 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Hỏi nhanh:
          </span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className="px-3 py-1 rounded-lg bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 text-xs text-slate-700 whitespace-nowrap transition cursor-pointer shrink-0"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 md:p-4 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Hỏi AI Tutor môn ${subject}... (VD: Giải bài tập, giải thích khái niệm)`}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm transition flex items-center gap-2 cursor-pointer shrink-0 shadow-md shadow-indigo-200"
          >
            <span>Gửi</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="text-[11px] text-slate-500 font-medium italic text-center mt-2">
        AI chỉ mang tính chất tham khảo.
      </div>
    </div>
  );
};