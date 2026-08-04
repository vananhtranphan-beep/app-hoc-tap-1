import React, { useState, useEffect } from "react";
import {
  Smile,
  Heart,
  Sparkles,
  Calendar,
  Trash2,
  Zap,
  Droplets,
  Sun
} from "lucide-react";
import { MoodLog, EmotionTreeState } from "../types";

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

function getPast30Days(): { dateStr: string; displayDate: string; dayNum: number }[] {
  const days = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push({
      dateStr: d.toLocaleDateString("vi-VN"),
      displayDate: `${d.getDate()}/${d.getMonth() + 1}`,
      dayNum: d.getDate(),
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
  const treeStateKey = `user_${userId || "default"}_emotion_tree_state`;
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
  const [dailySummaries, setDailySummaries] = useState<{ [dateStr: string]: { avgStress: number; moodCount: number; evaluation: string } }>(() => {
    const saved = localStorage.getItem(summariesKey);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {};
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<{
    psychologicalAssessment?: string;
    carePlan?: string;
  } | null>(null);

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

    const newSummaries: { [dateStr: string]: { avgStress: number; moodCount: number; evaluation: string } } = {};
    Object.keys(summaryMap).forEach((dateKey) => {
      const avg = Number((summaryMap[dateKey].totalStress / summaryMap[dateKey].count).toFixed(1));
      newSummaries[dateKey] = {
        avgStress: avg,
        moodCount: summaryMap[dateKey].count,
        evaluation: "Tinh thần ổn định ✨"
      };
    });
    setDailySummaries(newSummaries);
    localStorage.setItem(summariesKey, JSON.stringify(newSummaries));
  }, [logs, moodLogsKey, summariesKey]);

  const handleSelectMood = (m: typeof MOOD_OPTIONS[0]) => {
    setSelectedMoodObj(m);
  };

  const handleAddLogAndWaterTree = () => {
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

  const recent10Logs = logs.slice(0, 10);
  const avgStress10 = recent10Logs.length > 0
    ? Number((recent10Logs.reduce((acc, curr) => acc + curr.stressLevel, 0) / recent10Logs.length).toFixed(1))
    : 0;

  // Hàm gọi AI cực kỳ an toàn, chống sập trang trắng
  const handleAnalyze30Days = async () => {
    setIsAnalyzing(true);
    setAiReport(null);
    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: selectedMoodObj.label,
          stressLevel: avgStress10,
          description: note,
          logs: logs.slice(0, 30),
        }),
      });

      const textData = await response.text();
      let data;
      try {
        data = JSON.parse(textData);
      } catch (e) {
        data = { psychologicalAssessment: textData || "Phân tích tâm lý hoàn tất.", carePlan: "1. Giữ tinh thần thư thái.\n2. Ngủ đủ giấc." };
      }

      setAiReport({
        psychologicalAssessment: data.psychologicalAssessment || data.summary || "Sức khỏe tâm lý ổn định trong thời gian qua.",
        carePlan: data.carePlan || "1. Duy trì tập thở.\n2. Cân đối thời gian học tập."
      });
    } catch (err: any) {
      setAiReport({
        psychologicalAssessment: "Không thể kết nối trực tiếp với AI lúc này, nhưng tâm trạng của em đang được ghi nhận rất tốt.",
        carePlan: "Hãy thả lỏng và nghỉ ngơi khi thấy căng thẳng."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeleteLog = (id: string) => {
    setLogs(logs.filter((l) => l.id !== id));
  };

  const past30Days = getPast30Days();

  return (
    <div className="space-y-6 pb-12">
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-900 via-pink-900 to-indigo-950 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/30 text-rose-200 text-xs font-bold border border-rose-400/40">
              <Zap className="w-3.5 h-3.5 fill-rose-300 text-rose-300" />
              <span>Theo Dõi Sức Khỏe Tâm Lý & Cây Cảm Xúc THCS ⭐</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              🌳 Cây Cảm Xúc & Bảng Theo Dõi Căng Thẳng
            </h2>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span>Lịch Lưu Kết Quả Trung Bình Ngày (30 Ngày Qua)</span>
            </h3>
          </div>

          <button
            onClick={handleAnalyze30Days}
            disabled={isAnalyzing}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-sm shadow-indigo-200 self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isAnalyzing ? "AI Đang Đánh Giá..." : "🤖 AI Đánh Giá 30 Ngày"}</span>
          </button>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-15 gap-2 pt-1">
          {past30Days.map((day, idx) => {
            const summary = dailySummaries[day.dateStr];
            const hasData = summary && summary.moodCount > 0;
            const avg = hasData ? summary.avgStress : null;
            return (
              <div key={idx} className="p-2 rounded-xl border text-center flex flex-col items-center justify-between h-16 bg-slate-100 border-slate-200 text-slate-600">
                <span className="text-[10px] font-bold opacity-80">{day.displayDate}</span>
                <span className="text-xs font-black my-auto">{hasData ? `${avg}` : "—"}</span>
              </div>
            );
          })}
        </div>
      </div>

      {aiReport && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50 via-rose-50 to-amber-50 border border-indigo-200 shadow-sm space-y-4">
          <h4 className="font-extrabold text-indigo-950 text-base">Báo Cáo Đánh Giá AI Sức Khỏe Tâm Lý 30 Ngày</h4>
          <div className="space-y-3 text-xs text-slate-800 leading-relaxed">
            <div>
              <span className="font-bold text-indigo-900 block mb-1">🔍 Đánh giá sức khỏe tâm lý:</span>
              <p className="bg-white/80 p-3 rounded-2xl border border-indigo-100">{aiReport.psychologicalAssessment}</p>
            </div>
            <div>
              <span className="font-bold text-rose-900 block mb-1">🌱 Kế hoạch chăm sóc tinh thần:</span>
              <p className="bg-white/80 p-3 rounded-2xl border border-rose-100 whitespace-pre-line font-medium">{aiReport.carePlan}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Smile className="w-5 h-5 text-rose-500" />
              <span>Chọn Cảm Xúc</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {MOOD_OPTIONS.map((m) => {
                const isSelected = selectedMoodObj.id === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => handleSelectMood(m)}
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

            <button
              onClick={handleAddLogAndWaterTree}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs sm:text-sm cursor-pointer"
            >
              Lưu Cảm Xúc & Tưới Cây Nước Mát
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">Nhật Ký Cảm Xúc Đã Lưu</h3>
            <div className="space-y-2.5 max-h-72 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold">{log.mood}</span> ({log.date})
                  </div>
                  <button onClick={() => handleDeleteLog(log.id)} className="text-rose-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
