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
  "🚀 'Tương lai thuộc về những ai tin tưởng vào vẻ đẹp của những giấc mơ của chính mình.'",
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

  // Tự động random câu nói khích lệ mỗi khi load trang
  const [randomQuote, setRandomQuote] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setRandomQuote(MOTIVATIONAL_QUOTES[randomIndex]);
  }, []);

  // State AI tâm sự
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'ai', text: 'Chào em! Hôm nay ở trường thế giới của em có chuyện gì vui hoặc áp lực không? Hãy kể cho AI nghe nhé! 🌸✨' }
  ]);
  const [isChatting, setIsChatting] = useState(false);

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

  // Tính điểm stress hôm nay để đổi trạng thái cây
  const todayStr = new Date().toLocaleDateString("vi-VN");
  const todaySummary = dailySummaries[todayStr];
  const todayAvgStress = todaySummary ? todaySummary.avgStress : 0;

  let treeEmoji = "🌳";
  let treeStatusText = "Cây đang xanh tươi rợp bóng mát vì bạn đang tưới những cảm xúc vui vẻ!";
  let treeAnimation = "animate-bounce";

  if (todaySummary && todaySummary.moodCount > 0) {
    if (todayAvgStress >= 4) {
      treeEmoji = "🥀";
      treeStatusText = "Cây đang hơi héo úa vì hôm nay bạn gặp nhiều căng thẳng. Hãy tưới nước bằng những cảm xúc tích cực nhé!";
      treeAnimation = "animate-pulse";
    } else if (todayAvgStress >= 2) {
      treeEmoji = "🪴";
      treeStatusText = "Cây đang lớn lên ổn định. Hãy chọn thêm cảm xúc tích cực để cây xanh tốt hơn!";
      treeAnimation = "";
    }
  }

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatInput("");
    setIsChatting(true);

    setTimeout(() => {
      let aiReply = "AI luôn ở đây lắng nghe em. Mọi chuyện rồi sẽ ổn thôi, hãy hít thở thật sâu và tự tin lên nhé! 💖";
      const lower = userText.toLowerCase();
      if (lower.includes("buồn") || lower.includes("chán") || lower.includes("áp lực") || lower.includes("thi")) {
        aiReply = "Thương em quá! Áp lực học tập đôi khi rất nặng nề. Em hãy tạm gác sách vở lại 15 phút, nghe một bản nhạc yêu thích hoặc đi dạo để xả stress nha. Em đã làm rất tốt rồi!";
      } else if (lower.includes("vui") || lower.includes("tuyệt") || lower.includes("hào hứng")) {
        aiReply = "Tuyệt vời quá! Năng lượng tích cực của em hôm nay thực sự tỏa sáng. Hãy giữ vững tinh thần này nhé! 🎉";
      }

      setChatMessages((prev) => [...prev, { sender: 'ai', text: aiReply }]);
      setIsChatting(false);
    }, 800);
  };

  const past30Days = getPast30Days();

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto px-4">
      {/* Kho câu nói khích lệ tự động đổi mỗi khi vào */}
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

      {/* CHỌN CẢM XÚC VÀ CÂY TO NẰM NGAY TRÊN ĐÓ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
            
            {/* CÁI CÂY TO SINH ĐỘNG NẰM TRÊN ĐỐNG EMOJI */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 border border-emerald-200 text-center space-y-3 shadow-inner">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-sm">
                <span>🌳 Cây Cảm Xúc Thời Gian Thực</span>
              </div>
              
              {/* Cây chuyển động to */}
              <div className={`text-7xl sm:text-8xl ${treeAnimation} transition-transform duration-500 select-none py-2`}>
                {treeEmoji}
              </div>

              <p className="text-xs font-bold text-emerald-900 px-4">
                {treeStatusText}
              </p>
              <span className="text-[10px] font-extrabold text-slate-500 block">
                Điểm stress trung bình hôm nay: {todayAvgStress}/5
              </span>
            </div>

            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2 pt-2">
              <Smile className="w-5 h-5 text-rose-500" />
              <span>Tưới Nước Cho Cây - Chọn Cảm Xúc Hôm Nay:</span>
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

      {/* Lịch Lưu Điểm Căng Thẳng 30 Ngày */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <span>Lịch Lưu Điểm Căng Thẳng Trung Bình (30 Ngày Qua)</span>
          </h3>
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
      </div>

      {/* GÓC AI TÂM SỰ (MÀU HỒNG NHẠT ẤM ÁP) */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 border border-pink-200 shadow-sm space-y-4">
        <h3 className="font-extrabold text-rose-950 text-base flex items-center gap-2 border-b border-pink-200/60 pb-3">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          <span>Góc AI Tâm Sự & Gỡ Rối Tinh Thần 🌸</span>
        </h3>

        <div className="space-y-3 max-h-64 overflow-y-auto p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-pink-100">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-md p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                msg.sender === 'user' 
                  ? 'bg-rose-600 text-white rounded-br-none' 
                  : 'bg-pink-100 text-rose-950 border border-pink-200 rounded-bl-none shadow-xs'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isChatting && (
            <div className="flex justify-start">
              <div className="p-3 rounded-2xl bg-white border border-pink-200 text-xs text-rose-400 italic">
                AI đang lắng nghe và nhắn nhủ cùng em...
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSendChat} className="flex items-center gap-2 pt-1">
          <input
            type="text"
            placeholder="Tâm sự với AI về ngày hôm nay của em..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="flex-1 px-4 py-3 rounded-2xl bg-white border border-pink-200 text-xs focus:outline-none focus:border-rose-400 text-slate-800 shadow-inner"
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
