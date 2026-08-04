import React, { useState, useEffect } from "react";
import {
  Smile,
  Heart,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  ShieldCheck,
  Clock,
  Calendar,
  Trash2,
  Zap,
  MessageCircle,
  Award,
  BarChart3,
  Flame,
  Send,
  Bot,
  Activity,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  Info,
  Droplets,
  Sun
} from "lucide-react";
import { MoodLog, EmotionTreeState } from "../types";

export const MOOD_OPTIONS = [
  { id: "vui", label: "Vui Vẻ", emoji: "😃", bg: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100", accent: "#059669", score: 0 },
  { id: "haohung", label: "Hào Hứng", emoji: "🥳", bg: "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100", accent: "#0d9488", score: 0 },
  { id: "binhthuong", label: "Bình Thường", emoji: "😐", bg: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100", accent: "#2563eb", score: 1 },
  { id: "buon", label: "Buồn Chán", emoji: "😭", bg: "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200", accent: "#475569", score: 3 },
  { id: "apluc", label: "Áp Lực Thi Cử", emoji: "😫", bg: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100", accent: "#d97706", score: 4 },
  { id: "lolang", label: "Lo Lắng Bài Vở", emoji: "😟", bg: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100", accent: "#ea580c", score: 4 },
  { id: "buctuc", label: "Bực Tức", emoji: "😡", bg: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100", accent: "#e11d48", score: 5 },
  { id: "metmoi", label: "Mệt Mỏi", emoji: "😴", bg: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100", accent: "#9333ea", score: 5 },
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

const RealisticEmotionTree: React.FC<{ health: number; isWatering: boolean }> = ({ health, isWatering }) => {
  const isLush = health >= 80;
  const isHealthy = health >= 50;
  const isWilted = health < 30;

  return (
    <div className="relative w-full max-w-sm mx-auto h-64 flex items-center justify-center select-none overflow-hidden rounded-2xl bg-gradient-to-b from-sky-900/40 via-teal-950/60 to-slate-950/80 p-2 border border-emerald-500/30">
      <div className={`absolute top-2 right-4 transition-all duration-700 ${isLush ? "opacity-100 scale-110" : "opacity-40 scale-90"}`}>
        <Sun className="w-8 h-8 text-amber-300 animate-spin-slow" />
      </div>

      {isWatering && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center animate-bounce duration-500">
          <div className="flex items-center gap-1 bg-cyan-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-cyan-200">
            <Droplets className="w-4 h-4 animate-pulse" />
            <span>Đang Tưới Cây Nước Mát...</span>
          </div>
        </div>
      )}

      <svg viewBox="0 0 300 240" className="w-full h-full drop-shadow-2xl">
        <ellipse cx="150" cy="215" rx="110" ry="18" fill="#451a03" />
        <path d="M 50,215 Q 150,195 250,215 Q 150,230 50,215 Z" fill={isWilted ? "#854d0e" : "#15803d"} />
        <path d="M 135,215 Q 140,160 125,120 Q 120,105 110,90 Q 128,100 142,118 Q 150,130 152,150 Q 155,125 170,95 Q 180,80 190,70 Q 175,85 162,108 Q 158,150 165,215 Z" fill="#7f4f24" />
        <circle cx="110" cy="80" r="38" fill="#059669" />
        <circle cx="190" cy="80" r="38" fill="#059669" />
        <circle cx="150" cy="65" r="45" fill="#059669" />
      </svg>
    </div>
  );
};

const INITIAL_LOGS: MoodLog[] = [
  {
    id: "log-1",
    date: new Date().toLocaleDateString("vi-VN"),
    time: "08:15:30",
    mood: "Hào Hứng",
    emoji: "🥳",
    stressLevel: 0,
    note: "Khí thế sẵn sàng học tập môn Toán & Tiếng Anh!",
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
  const [stressLevel, setStressLevel] = useState<number>(MOOD_OPTIONS[0].score);
  const [note, setNote] = useState("");
  const [isWatering, setIsWatering] = useState(false);

  const [treeState, setTreeState] = useState<EmotionTreeState>(() => {
    const saved = localStorage.getItem(treeStateKey);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      health: 85,
      status: "Lush",
      treeLevel: 3,
      lastCheckinDate: new Date().toLocaleDateString("vi-VN"),
      aiExplanation: "Cây cảm xúc đang phát triển xum xuê nhờ các lần check-in vui vẻ!"
    };
  });

  const [dailySummaries, setDailySummaries] = useState<{ [dateStr: string]: { avgStress: number; moodCount: number; evaluation: string } }>(() => {
    const saved = localStorage.getItem(summariesKey);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {};
  });

  const [userStory, setUserStory] = useState("");
  const [isCounseling, setIsCounseling] = useState(false);
  const [counselorReply, setCounselorReply] = useState<string | null>(null);

  const [showSosModal, setShowSosModal] = useState(false);
  const [sosMessage, setSosMessage] = useState("");

  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"Hít vào" | "Giữ hơi" | "Thở ra">("Hít vào");
  const [breathSecondsLeft, setBreathSecondsLeft] = useState(180);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<{
    psychologicalAssessment?: string;
    carePlan?: string;
    dominantMood?: string;
    stressTrend?: string;
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

  useEffect(() => {
    localStorage.setItem(treeStateKey, JSON.stringify(treeState));
  }, [treeState, treeStateKey]);

  useEffect(() => {
    let timer: any;
    if (isBreathing && breathSecondsLeft > 0) {
      timer = setInterval(() => {
        setBreathSecondsLeft((prev) => prev - 1);
        const cycle = (180 - breathSecondsLeft + 1) % 12;
        if (cycle < 4) setBreathPhase("Hít vào");
        else if (cycle < 8) setBreathPhase("Giữ hơi");
        else setBreathPhase("Thở ra");
      }, 1000);
    } else if (breathSecondsLeft === 0) {
      setIsBreathing(false);
    }
    return () => clearInterval(timer);
  }, [isBreathing, breathSecondsLeft]);

  const handleSelectMood = (m: typeof MOOD_OPTIONS[0]) => {
    setSelectedMoodObj(m);
    setStressLevel(m.score);
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
    setIsWatering(true);
    setTimeout(() => setIsWatering(false), 2500);

    const newHealth = Math.min(100, Math.max(10, treeState.health + 10));
    setTreeState({
      health: newHealth,
      status: "Healthy",
      treeLevel: Math.floor(newHealth / 25) + 1,
      lastCheckinDate: todayStr,
      aiExplanation: `Cây cảm xúc vừa được tưới mát nhờ cảm xúc "${selectedMoodObj.label}"!`
    });
  };

  const recent10Logs = logs.slice(0, 10);
  const avgStress10 = recent10Logs.length > 0
    ? Number((recent10Logs.reduce((acc, curr) => acc + curr.stressLevel, 0) / recent10Logs.length).toFixed(1))
    : 0;

  // Xử lý AI 30 ngày an toàn không sập trang trắng
  const handleAnalyze30Days = async () => {
    setIsAnalyzing(true);
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

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Lỗi phân tích cảm xúc");

      setAiReport({
        psychologicalAssessment: data.psychologicalAssessment || data.summary || "Tình trạng sức khỏe tâm lý ổn định, chỉ số áp lực nằm trong tầm kiểm soát.",
        carePlan: data.carePlan || "1. Duy trì tập thở nhẹ nhàng.\n2. Cân bằng học tập và nghỉ ngơi."
      });
    } catch (err: any) {
      alert("Không thể phân tích: " + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAskCounselor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userStory.trim()) return;

    setIsCounseling(true);
    setCounselorReply(null);

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story: userStory }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Lỗi kết nối AI");

      setCounselorReply(data.reply || "Thầy cô luôn ở đây lắng nghe em.");
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setIsCounseling(false);
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
            <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
              Mỗi lần check-in cảm xúc sẽ tự động tính mức áp lực và tưới Cây Cảm Xúc.
            </p>
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
