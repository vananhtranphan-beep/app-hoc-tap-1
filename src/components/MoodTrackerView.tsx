import React, { useState, useEffect } from "react";
import { Smile, Sparkles, Calendar, Trash2, Zap, MessageSquare, Send, Heart } from "lucide-react";
import { MoodLog } from "../types";

export const MOOD_OPTIONS = [
  { id: "vui", label: "Vui Vẻ", emoji: "😃", bg: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100", score: 0 },
  { id: "haohung", label: "Hào Hứng", emoji: "🥳", bg: "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100", score: 0 },
  { id: "binhthuong", label: "Bình Thường", emoji: "😐", bg: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100", score: 1 },
  { id: "buon", label: "Buồn Chán", emoji: "😭", bg: "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200", score: 3 },
  { id: "apluc", label: "Áp Lực Thi Cử", emoji: "😫", bg: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100", score: 4 },
  { id: "lolang", label: "Lo Lắng Bài Vở", emoji: "😟", bg: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100", score: 4 },
  { id: "buctuc", label: "Bực Tức", emoji: "😡", bg: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100", score: 5 },
  { id: "metmoi", label: "Mệt Mỏi", emoji: "😴", bg: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100", score: 5 },
];

const MOTIVATIONAL_QUOTES = [
  "🌟 'Khó khăn rồi sẽ qua đi, giống như cơn mưa ngoài cửa sổ rồi sẽ tạnh để nhường chỗ cho cầu vòng.'",
  "💪 'Mỗi ngày đến trường là một cơ hội tuyệt vời để em trở nên thông minh và mạnh mẽ hơn hôm qua.'",
  "🌱 'Cây lớn lên cần có nước và ánh sáng, tâm hồn em lớn lên cũng cần những thử thách và bài học.'",
  "🎯 'Đừng sợ sai lầm, sai lầm chỉ đơn giản là bằng chứng cho thấy em đang cố gắng học tập.'",
  "✨ 'Hít một hơi thật sâu, mỉm cười và tự nhắc nhở bản thân rằng: Em đang làm rất tốt rồi!'",
];

function getPast30Days() {
  const days = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push({
      dateStr: d.toLocaleDateString("vi-VN"),
      displayDate: `${d.getDate()}/${d.getMonth() + 1}`,
    });
  }
  return days;
}

const INITIAL_LOGS: MoodLog[] = [
  {
    id: "log-1",
    date: new Date().toLocaleDateString("vi-VN"),
    time: "08:15:30",
    mood: "Hào Hứng",
    emoji: "🥳",
    stressLevel: 0,
    note: "Sẵn sàng học tập!",
  },
];

interface MoodTrackerViewProps {
  userId?: string;
}

export const MoodTrackerView: React.FC<MoodTrackerViewProps> = ({ userId }) => {
  const moodLogsKey = `user_${userId || "default"}_mood_logs`;
  const summariesKey = `user_${userId || "default"}_mood_daily_summaries_30`;

  const [logs, setLogs] = useState<MoodLog[]>(() => {
    const saved = localStorage.getItem(moodLogsKey);
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_LOGS; }
    }
    return INITIAL_LOGS;
  });

  const [selectedMoodObj, setSelectedMoodObj] = useState(MOOD_OPTIONS[0]);
  const [note, setNote] = useState("");
  const [dailySummaries, setDailySummaries] = useState<{ [dateStr: string]: { avgStress: number; moodCount: number } }>(() => {
    const saved = localStorage.getItem(summariesKey);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {};
  });

  const [randomQuote, setRandomQuote] = useState("");

  // State AI phân tích 30 ngày thật
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport30Days, setAiReport30Days] = useState<string | null>(null);

  // State AI tâm sự thật (Google Gemini API)
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'ai', text: 'Chào em! Hôm nay ở trường thế giới của em có chuyện gì vui hoặc áp lực không? Hãy kể cho AI nghe nhé! 🌸✨' }
  ]);
  const [isChatting, setIsChatting] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setRandomQuote(MOTIVATIONAL_QUOTES[randomIndex]);
  }, []);

  useEffect(() => {
    localStorage.setItem(moodLogsKey, JSON.stringify(logs));
    const summaryMap: { [dateStr: string]: { totalStress: number; count: number } } = {};
    logs.forEach((log) => {
      if (!summaryMap[log.date]) {
        summaryMap[log.date] = { totalStress: 0, count: 0 };
      }
      summaryMap[log.date].totalStress += log.stressLevel;
      summaryMap[log.date].count += 1;
    });

    const newSummaries: { [dateStr: string]: { avgStress: number; moodCount: number } } = {};
    Object.keys(summaryMap).forEach((dateKey) => {
      const avg = Number((summaryMap[dateKey].totalStress / summaryMap[dateKey].count).toFixed(1));
      newSummaries[dateKey] = {
        avgStress: avg,
        moodCount: summaryMap[dateKey].count,
      };
    });
    setDailySummaries(newSummaries);
    localStorage.setItem(summariesKey, JSON.stringify(newSummaries));
  }, [logs, moodLogsKey, summariesKey]);

  const handleAddLog = () => {
    const now = new Date();
    const todayStr = now.toLocaleDateString("vi-VN");
    const newEntry: MoodLog = {
      id: "log-" + Date.now(),
      date: todayStr,
      time: now.toLocaleTimeString("vi-VN"),
      mood: selectedMoodObj.label,
      emoji: selectedMoodObj.emoji,
      stressLevel: selectedMoodObj.score,
      note: note.trim() || `Cảm xúc ${selectedMoodObj.label}`,
    };

    setLogs([newEntry, ...logs]);
    setNote("");
  };

  const handleDeleteLog = (id: string) => {
    setLogs(logs.filter((l) => l.id !== id));
  };

  const todayStr = new Date().toLocaleDateString("vi-VN");
  const todaySummary = dailySummaries[todayStr];
  const todayAvgStress = todaySummary ? todaySummary.avgStress : 0;

  // Hình ảnh cây xanh to sinh động (Giống mẫu hình thứ 3)
  let treeImageUrl = "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=400&q=80"; // Cây xanh tươi rợp bóng
  let treeStatusText = "Cây đang xanh tốt rợp bóng mát vì bạn đang tưới những cảm xúc tích cực!";

  if (todaySummary && todaySummary.moodCount > 0) {
    if (todayAvgStress >= 4) {
      treeImageUrl = "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=400&q=80"; // Cây mùa thu / hơi héo
      treeStatusText = "Cây đang hơi héo úa vì hôm nay bạn gặp nhiều căng thẳng. Hãy thả lỏng nhé!";
    } else if (todayAvgStress >= 2) {
      treeImageUrl = "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80";
      treeStatusText = "Cây đang lớn lên ổn định. Hãy chọn thêm cảm xúc tích cực để cây xanh tốt hơn!";
    }
  }

  // HÀM GỌI GEMINI AI THẬT CHO PHẦN TÂM SỰ
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatInput("");
    setIsChatting(true);

    try {
      const apiKey = localStorage.getItem("gemini_api_key") || "";
      const prompt = `Bạn là một chuyên gia tâm lý học đường thân thiện, nhẹ nhàng và thấu cảm dành cho học sinh cấp 2 (THCS). Học sinh vừa tâm sự rằng: "${userText}". Hãy đưa ra lời khuyên, sự an động viên ấm áp, ngắn gọn và tích cực bằng tiếng Việt.`;

      if (!apiKey) {
        // Fallback thông minh nếu chưa có key
        setTimeout(() => {
          setChatMessages((prev) => [...prev, { sender: 'ai', text: "AI luôn ở đây lắng nghe em. Mọi chuyện rồi sẽ ổn thôi, hãy hít thở thật sâu và tự tin lên nhé! (💡 Mẹo: Bạn có thể cấu hình API Key trong mục cài đặt để AI trả lời thông minh hơn). 💖" }]);
          setIsChatting(false);
        }, 800);
        return;
      }

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await res.json();
      const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Em hãy giữ tinh thần thoải mái nhé, mọi khó khăn rồi sẽ qua thôi! 🌸";

      setChatMessages((prev) => [...prev, { sender: 'ai', text: aiReply }]);
    } catch {
      setChatMessages((prev) => [...prev, { sender: 'ai', text: "Đã có chút gián đoạn kết nối, nhưng em hãy nhớ luôn có thầy cô và bạn bè đồng hành cùng em nhé! 💚" }]);
    } finally {
      setIsChatting(false);
    }
  };

  // HÀM GỌI GEMINI AI PHÂN TÍCH 30 NGÀY THẬT
  const handleAnalyze30DaysRealAI = async () => {
    setIsAnalyzing(true);
    setAiReport30Days(null);

    try {
      const apiKey = localStorage.getItem("gemini_api_key") || "";
      const logsSummaryText = JSON.stringify(logs.slice(0, 30));
      const prompt = `Dựa trên nhật ký cảm xúc 30 ngày qua của học sinh THCS (dữ liệu: ${logsSummaryText}), hãy đóng vai chuyên gia tâm lý học đường phân tích mức độ căng thẳng, xu hướng cảm xúc và đưa ra 3 lời khuyên thiết thực để học sinh cân bằng học tập và tinh thần bằng tiếng Việt.`;

      if (!apiKey) {
        setTimeout(() => {
          setAiReport30Days("🌟 BÁO CÁO TÂM LÝ TỪ AI:\n- Điểm stress trung bình hiện tại: " + todayAvgStress + "/5\n- Nhận xét: Tinh thần của em đang khá ổn định. Hãy duy trì thói quen nghỉ ngơi và học tập khoa học nhé! (💡 Bạn có thể cấu hình API Key để AI phân tích chi tiết hơn).");
          setIsAnalyzing(false);
        }, 800);
        return;
      }

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await res.json();
      const report = data.candidates?.[0]?.content?.parts?.[0]?.text || "AI đã ghi nhận tâm trạng của em trong tháng qua rất tốt. Hãy tiếp tục phát huy nhé!";
      setAiReport30Days(report);
    } catch {
      setAiReport30Days("Không thể kết nối đến máy chủ AI lúc này. Tuy nhiên, kết quả điểm stress trung bình của em đã được ghi nhận đầy đủ trên lịch!");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const past30Days = getPast30Days();

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto px-4">
      {/* Kho câu nói khích lệ tự động đổi */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md flex items-center gap-3">
        <span className="text-2xl">💡</span>
        <div className="space-y-0.5">
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-white/20 uppercase tracking-wider">
            Góc Động Lực Mỗi Ngày
          </span>
          <p className="text-xs sm:text-sm font-bold pt-1">
            {randomQuote}
          </p>
        </div>
      </div>

      {/* HÌNH CÁI CÂY TO NẰM TRÊN ĐỐNG EMOJI (ĐÚNG MẪU HÌNH THỨ 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
            
            {/* HÌNH ẢNH CÁI CÂY TO SINH ĐỘNG */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 border border-emerald-200 text-center space-y-3 shadow-inner">
              <div className="w-40 h-40 mx-auto rounded-2xl overflow-hidden shadow-md border-4 border-white bg-white">
                <img src={treeImageUrl} alt="Cây cảm xúc" className="w-full h-full object-cover animate-pulse duration-1000" />
              </div>

              <p className="text-xs font-extrabold text-emerald-900 px-4">
                {treeStatusText}
              </p>
              <span className="text-[10px] font-extrabold text-slate-500 block">
                Điểm stress trung bình hôm nay: {todayAvgStress}/5
              </span>
            </div>

            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2 pt-2">
              <Smile className="w-5 h-5 text-rose-500" />
              <span>Hôm nay em thế nào? Bấm vào emoji để chia sẻ với cây nhé:</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {MOOD_OPTIONS.map((m) => {
                const isSelected = selectedMoodObj.id === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMoodObj(m)}
                    className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                      isSelected ? "bg-rose-600 text-white border-rose-600 shadow-md font-bold" : `${m.bg} font-semibold`
                    }`}
                  >
                    <span className="text-3xl">{m.emoji}</span>
                    <span className="text-xs line-clamp-1">{m.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Ghi chú thêm về tâm trạng:</label>
              <input
                type="text"
                placeholder="Ví dụ: Hôm nay ôn thi toán rất tốt..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
              />
            </div>

            <button
              onClick={handleAddLog}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs sm:text-sm cursor-pointer shadow-md"
            >
              Lưu Cảm Xúc & Tưới Nước Cho Cây 💧🌳
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">Nhật Ký Cảm Xúc Đã Lưu</h3>
            <div className="space-y-2.5 max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">Chưa có nhật ký cảm xúc nào.</p>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-extrabold">{log.emoji} {log.mood}</span> 
                      <span className="text-slate-400 ml-1">({log.date})</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">Stress: {log.stressLevel}/5</p>
                    </div>
                    <button onClick={() => handleDeleteLog(log.id)} className="text-rose-500 cursor-pointer p-1.5 hover:bg-rose-50 rounded-lg">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lịch Lưu Điểm Căng Thẳng 30 Ngày & AI Phân Tích Thật */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <span>Lịch Lưu Điểm Căng Thẳng Trung Bình (30 Ngày Qua)</span>
          </h3>

          <button
            onClick={handleAnalyze30DaysRealAI}
            disabled={isAnalyzing}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isAnalyzing ? "AI Đang Phân Tích..." : "🤖 AI Phân Tích 30 Ngày Thật"}</span>
          </button>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-15 gap-2 pt-1">
          {past30Days.map((day, idx) => {
            const summary = dailySummaries[day.dateStr];
            const hasData = summary && summary.moodCount > 0;
            const avg = hasData ? summary.avgStress : null;
            return (
              <div 
                key={idx} 
                className={`p-2 rounded-xl border text-center flex flex-col items-center justify-between h-16 transition ${
                  hasData 
                    ? avg! >= 4 
                      ? "bg-rose-100 border-rose-300 text-rose-900 font-bold" 
                      : avg! >= 2 
                      ? "bg-amber-100 border-amber-300 text-amber-900 font-bold" 
                      : "bg-emerald-100 border-emerald-300 text-emerald-900 font-bold"
                    : "bg-slate-50 border-slate-200 text-slate-400"
                }`}
              >
                <span className="text-[10px] font-bold opacity-80">{day.displayDate}</span>
                <span className="text-xs font-black my-auto">{hasData ? `${avg}` : "—"}</span>
              </div>
            );
          })}
        </div>

        {aiReport30Days && (
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-slate-800 leading-relaxed space-y-2 mt-4">
            <h4 className="font-extrabold text-indigo-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Báo Cáo Phân Tích Cảm Xúc 30 Ngày Từ Google Gemini AI:</span>
            </h4>
            <div className="whitespace-pre-line font-medium text-slate-700 bg-white p-3 rounded-xl border border-indigo-100">
              {aiReport30Days}
            </div>
          </div>
        )}
      </div>

      {/* GÓC AI TÂM SỰ (MÀU HỒNG NHẠT ẤM ÁP & TÍCH HỢP GEMINI AI THẬT) */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 border border-pink-200 shadow-sm space-y-4">
        <h3 className="font-extrabold text-rose-950 text-base flex items-center gap-2 border-b border-pink-200/60 pb-3">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          <span>Góc AI Tâm Sự & Gỡ Rối Tinh Thần 🌸 (Kết Nối Google Gemini AI)</span>
        </h3>

        <div className="space-y-3 max-h-64 overflow-y-auto p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-pink-100 shadow-inner">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-md p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                msg.sender === 'user' 
                  ? 'bg-rose-600 text-white rounded-br-none shadow-sm' 
                  : 'bg-pink-100 text-rose-950 border border-pink-200 rounded-bl-none shadow-xs'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isChatting && (
            <div className="flex justify-start">
              <div className="p-3 rounded-2xl bg-white border border-pink-200 text-xs text-rose-500 font-bold italic animate-pulse">
                Google AI đang lắng nghe và nhắn nhủ cùng em...
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSendChat} className="flex items-center gap-2 pt-1">
          <input
            type="text"
            placeholder="Tâm sự thật với AI về ngày hôm nay của em..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="flex-1 px-4 py-3 rounded-2xl bg-white border border-pink-200 text-xs focus:outline-none focus:border-rose-400 text-slate-800 shadow-sm"
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <span>Gửi</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
