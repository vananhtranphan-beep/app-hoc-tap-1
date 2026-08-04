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

// Reordered emotion options strictly sorted by user-specified stress points (0 to 5):
// 0: Vui Vẻ, Hào Hứng
// 1: Bình Thường
// 3: Buồn Chán
// 4: Áp Lực Thi Cử, Lo Lắng Bài Vở
// 5: Bực Tức, Mệt Mỏi
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

// Past 30 days dates formatted DD/MM/YYYY
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

// REALISTIC EMOTION TREE SVG COMPONENT
const RealisticEmotionTree: React.FC<{ health: number; isWatering: boolean }> = ({ health, isWatering }) => {
  const isLush = health >= 80;
  const isHealthy = health >= 50;
  const isWilted = health < 30;

  return (
    <div className="relative w-full max-w-sm mx-auto h-64 flex items-center justify-center select-none overflow-hidden rounded-2xl bg-gradient-to-b from-sky-900/40 via-teal-950/60 to-slate-950/80 p-2 border border-emerald-500/30">
      {/* Sun / Aura */}
      <div className={`absolute top-2 right-4 transition-all duration-700 ${isLush ? "opacity-100 scale-110" : "opacity-40 scale-90"}`}>
        <Sun className="w-8 h-8 text-amber-300 animate-spin-slow" />
      </div>

      {/* Watering Can & Water Drops Overlay Animation */}
      {isWatering && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center animate-bounce duration-500">
          <div className="flex items-center gap-1 bg-cyan-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-cyan-200">
            <Droplets className="w-4 h-4 animate-pulse" />
            <span>Đang Tưới Cây Nước Mát...</span>
          </div>
          <div className="flex gap-2 mt-2">
            <span className="w-2 h-4 bg-cyan-300 rounded-full animate-ping delay-75"></span>
            <span className="w-2 h-5 bg-cyan-400 rounded-full animate-ping delay-150"></span>
            <span className="w-2 h-4 bg-cyan-200 rounded-full animate-ping delay-200"></span>
          </div>
        </div>
      )}

      {/* Realistic Tree SVG Illustration */}
      <svg viewBox="0 0 300 240" className="w-full h-full drop-shadow-2xl">
        <defs>
          {/* Soil Gradient */}
          <linearGradient id="soilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#451a03" />
            <stop offset="100%" stopColor="#1c0d02" />
          </linearGradient>

          {/* Bark Trunk Gradient */}
          <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#582f0e" />
            <stop offset="50%" stopColor="#7f4f24" />
            <stop offset="100%" stopColor="#3a1e05" />
          </linearGradient>

          {/* Lush Green Foliage Gradient */}
          <linearGradient id="lushFoliage" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>

          {/* Healthy Green Foliage */}
          <linearGradient id="healthyFoliage" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>

          {/* Wilted Autumn Foliage */}
          <linearGradient id="wiltedFoliage" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
        </defs>

        {/* Ground Mound & Grass */}
        <ellipse cx="150" cy="215" rx="110" ry="18" fill="url(#soilGrad)" />
        <path
          d="M 50,215 Q 150,195 250,215 Q 150,230 50,215 Z"
          fill={isWilted ? "#854d0e" : "#15803d"}
        />

        {/* Grass Tufts */}
        {!isWilted && (
          <g fill="#22c55e">
            <path d="M 80,210 Q 82,200 85,210 M 83,210 Q 86,198 89,210" stroke="#22c55e" strokeWidth="2" />
            <path d="M 210,210 Q 212,200 215,210 M 213,210 Q 216,198 219,210" stroke="#22c55e" strokeWidth="2" />
          </g>
        )}

        {/* Realistic Wooden Trunk & Spreading Branches */}
        <g id="treeTrunk">
          {/* Main Trunk */}
          <path
            d="M 135,215 Q 140,160 125,120 Q 120,105 110,90 Q 128,100 142,118 Q 150,130 152,150 Q 155,125 170,95 Q 180,80 190,70 Q 175,85 162,108 Q 158,150 165,215 Z"
            fill="url(#trunkGrad)"
          />
          {/* Bark Lines & Roots */}
          <path d="M 135,215 Q 120,222 105,225" stroke="#3a1e05" strokeWidth="4" strokeLinecap="round" />
          <path d="M 165,215 Q 180,222 195,225" stroke="#3a1e05" strokeWidth="4" strokeLinecap="round" />
          <path d="M 148,180 Q 150,150 142,130" stroke="#3a1e05" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />
        </g>

        {/* Foliage Canopy Clusters */}
        <g id="treeCanopy" className="transition-all duration-700">
          {isLush ? (
            <>
              {/* Layer 1 - Deep Background Canopy */}
              <circle cx="105" cy="85" r="42" fill="#047857" opacity="0.9" />
              <circle cx="195" cy="85" r="42" fill="#047857" opacity="0.9" />
              <circle cx="150" cy="55" r="50" fill="#065f46" opacity="0.9" />

              {/* Layer 2 - Front Lush Foliage */}
              <circle cx="110" cy="80" r="38" fill="url(#lushFoliage)" />
              <circle cx="190" cy="80" r="38" fill="url(#lushFoliage)" />
              <circle cx="150" cy="65" r="45" fill="url(#lushFoliage)" />
              <circle cx="150" cy="95" r="35" fill="url(#lushFoliage)" />

              {/* Flowers & Golden Fruits for High Health */}
              <circle cx="120" cy="65" r="5" fill="#f43f5e" />
              <circle cx="175" cy="70" r="5" fill="#f43f5e" />
              <circle cx="145" cy="45" r="5.5" fill="#fbbf24" />
              <circle cx="190" cy="95" r="5" fill="#fbbf24" />
              <circle cx="100" cy="95" r="4.5" fill="#f43f5e" />

              {/* Sparkles */}
              <circle cx="130" cy="55" r="2" fill="#ffffff" className="animate-ping" />
              <circle cx="170" cy="85" r="2" fill="#ffffff" className="animate-ping delay-100" />
            </>
          ) : isHealthy ? (
            <>
              <circle cx="115" cy="90" r="32" fill="url(#healthyFoliage)" />
              <circle cx="185" cy="90" r="32" fill="url(#healthyFoliage)" />
              <circle cx="150" cy="70" r="40" fill="url(#healthyFoliage)" />
              <circle cx="150" cy="100" r="28" fill="url(#healthyFoliage)" />
            </>
          ) : (
            <>
              {/* Wilted / Sparse Autumn Foliage */}
              <circle cx="120" cy="95" r="22" fill="url(#wiltedFoliage)" opacity="0.8" />
              <circle cx="180" cy="95" r="22" fill="url(#wiltedFoliage)" opacity="0.8" />
              <circle cx="150" cy="80" r="28" fill="url(#wiltedFoliage)" opacity="0.8" />

              {/* Falling Leaves */}
              <path d="M 110,140 Q 105,155 100,170" stroke="#d97706" strokeWidth="2" strokeDasharray="2 2" />
              <circle cx="100" cy="170" r="3" fill="#b45309" />
              <path d="M 190,135 Q 195,150 200,165" stroke="#d97706" strokeWidth="2" strokeDasharray="2 2" />
              <circle cx="200" cy="165" r="3" fill="#b45309" />
            </>
          )}
        </g>
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
  {
    id: "log-2",
    date: new Date().toLocaleDateString("vi-VN"),
    time: "11:45:10",
    mood: "Bình Thường",
    emoji: "😐",
    stressLevel: 1,
    note: "Hoàn thành bài kiểm tra 15 phút nhẹ nhàng.",
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

  const [selectedMoodObj, setSelectedMoodObj] = useState(MOOD_OPTIONS[0]); // Default "Vui Vẻ", score 0
  const [stressLevel, setStressLevel] = useState<number>(MOOD_OPTIONS[0].score);
  const [note, setNote] = useState("");
  const [isWatering, setIsWatering] = useState(false);

  // Emotion Tree State
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
      aiExplanation: "Cây cảm xúc đang phát triển xum xuê nhờ các lần check-in vui vẻ và áp lực nhẹ nhàng!"
    };
  });

  // Daily summary history for 30 days
  const [dailySummaries, setDailySummaries] = useState<{ [dateStr: string]: { avgStress: number; moodCount: number; evaluation: string } }>(() => {
    const saved = localStorage.getItem(summariesKey);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {};
  });

  // AI Counselor Chat
  const [userStory, setUserStory] = useState("");
  const [isCounseling, setIsCounseling] = useState(false);
  const [counselorReply, setCounselorReply] = useState<string | null>(null);

  // SOS Hug Modal
  const [showSosModal, setShowSosModal] = useState(false);
  const [sosMessage, setSosMessage] = useState("");

  // Breathing state
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"Hít vào" | "Giữ hơi" | "Thở ra">("Hít vào");
  const [breathSecondsLeft, setBreathSecondsLeft] = useState(180);

  // AI 30-Day Evaluation
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<{
    psychologicalAssessment?: string;
    carePlan?: string;
    dominantMood?: string;
    stressTrend?: string;
  } | null>(null);

  // Save logs to localStorage & re-compute daily summaries
  useEffect(() => {
    localStorage.setItem(moodLogsKey, JSON.stringify(logs));

    // Group logs by date to maintain 30-day daily summaries automatically
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
      let evalText = "Bình an, tinh thần tốt ✨";
      if (avg > 3.5) evalText = "Căng thẳng cao - Cần tưới cây & nghỉ ngơi 🌧️";
      else if (avg > 2) evalText = "Áp lực bài vở vừa phải ⛅";
      else if (avg > 0.5) evalText = "Tâm trạng thảnh thơi 🌱";

      newSummaries[dateKey] = {
        avgStress: avg,
        moodCount: summaryMap[dateKey].count,
        evaluation: evalText
      };
    });

    setDailySummaries(newSummaries);
    localStorage.setItem(summariesKey, JSON.stringify(newSummaries));
  }, [logs, moodLogsKey, summariesKey]);

  // Save tree state
  useEffect(() => {
    localStorage.setItem(treeStateKey, JSON.stringify(treeState));
  }, [treeState, treeStateKey]);

  // Breathing timer
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

  // Handle emotion selection -> auto update stressLevel
  const handleSelectMood = (m: typeof MOOD_OPTIONS[0]) => {
    setSelectedMoodObj(m);
    setStressLevel(m.score);
  };

  // Add Mood Log & Water Tree
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
      note: note.trim() || `Cảm xúc ${selectedMoodObj.label} (Mức áp lực: ${selectedMoodObj.score}/5)`,
    };

    const updatedLogs = [newEntry, ...logs];
    setLogs(updatedLogs);
    setNote("");

    // Trigger watering visual effect
    setIsWatering(true);
    setTimeout(() => setIsWatering(false), 2500);

    // Tree health delta according to emotion score (0 -> 5)
    let healthDelta = 0;
    if (selectedMoodObj.score === 0) healthDelta = +15; // Vui vẻ, Hào hứng
    else if (selectedMoodObj.score === 1) healthDelta = +10; // Bình thường
    else if (selectedMoodObj.score === 3) healthDelta = +2; // Buồn chán
    else healthDelta = -10; // Áp lực (4), Lo lắng (4), Bực tức (5), Mệt mỏi (5)

    const newHealth = Math.min(100, Math.max(10, treeState.health + healthDelta));
    let newStatus: EmotionTreeState["status"] = "Healthy";
    let explanation = "";

    if (newHealth >= 80) {
      newStatus = "Lush";
      explanation = `🎉 Cây cảm xúc đang xum xuê xanh tươi (${newHealth}%)! Tâm trạng "${selectedMoodObj.label}" (Áp lực ${selectedMoodObj.score}/5) đã tưới nguồn năng lượng tích cực cho cây!`;
    } else if (newHealth >= 50) {
      newStatus = "Healthy";
      explanation = `🌿 Cây cảm xúc phát triển khỏe mạnh (${newHealth}%). Em vừa ghi nhận cảm xúc "${selectedMoodObj.label}".`;
    } else {
      newStatus = "SlightlyWilted";
      explanation = `🍂 Cây cảm xúc đang hơi rũ lá (${newHealth}%) vì mức áp lực (${selectedMoodObj.score}/5). Hãy thư giãn 3 phút bài thở để tưới cây mát lại nhé!`;
    }

    setTreeState({
      health: newHealth,
      status: newStatus,
      treeLevel: Math.floor(newHealth / 25) + 1,
      lastCheckinDate: todayStr,
      aiExplanation: explanation
    });
  };

  // 10 Recent Check-ins Average Stress Calculation
  const recent10Logs = logs.slice(0, 10);
  const avgStress10 = recent10Logs.length > 0
    ? Number((recent10Logs.reduce((acc, curr) => acc + curr.stressLevel, 0) / recent10Logs.length).toFixed(1))
    : 0;

  // Trigger AI 30-Day Evaluation - Đã đổi sang /api/tutor
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
        ...data,
        psychologicalAssessment: data.psychologicalAssessment || `Tình trạng sức khỏe tâm lý 30 ngày qua ổn định. Chỉ số áp lực trung bình 10 lần gần nhất đạt ${avgStress10}/5.`,
        carePlan: data.carePlan || `1. Tiếp tục duy trì bài tập thở 3 phút trước giờ học.\n2. Lên lịch học Pomodoro 25 phút nghỉ 5 phút.\n3. Check-in cảm xúc hằng ngày để tưới Cây Cảm Xúc xanh tươi.`
      });
    } catch (err: any) {
      alert("Không thể phân tích: " + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Trigger AI Counselor Chat - Đã đổi sang /api/tutor
  const handleAskCounselor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userStory.trim()) return;

    setIsCounseling(true);
    setCounselorReply(null);

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          story: userStory,
          studentGrade: "8",
          studentName: "Em",
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Lỗi kết nối AI");

      setCounselorReply(data.reply);
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setIsCounseling(false);
    }
  };

  const handleSosHug = () => {
    const hugs = [
      "Em đã làm rất tốt ngày hôm nay rồi! Đừng quá áp lực bản thân nhé. Hãy nghỉ ngơi 10 phút, uống 1 ly nước ấm! ❤️",
      "Mỗi bài kiểm tra chỉ là một bậc thang nhỏ. Dù kết quả thế nào, em vẫn là một học sinh tuyệt vời! ✨",
      "Hít một hơi thật sâu... Thầy cô AI luôn ở đây đồng hành cùng em vượt qua mọi áp lực! 🫂",
    ];
    setSosMessage(hugs[Math.floor(Math.random() * hugs.length)]);
    setShowSosModal(true);
  };

  const handleDeleteLog = (id: string) => {
    setLogs(logs.filter((l) => l.id !== id));
  };

  const past30Days = getPast30Days();

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
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
              Mỗi lần check-in cảm xúc sẽ tự động tính mức áp lực và tưới Cây Cảm Xúc. Thanh mức độ căng thẳng tự động tính trung bình từ 10 lần đánh giá gần nhất!
            </p>
          </div>

          <button
            onClick={handleSosHug}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-rose-900/50 transition cursor-pointer flex items-center gap-2 shrink-0 animate-pulse"
          >
            <Heart className="w-5 h-5 fill-white" />
            <span>Góc SOS - Cần Lời An Ủi Ngay!</span>
          </button>
        </div>
      </div>

      {/* FEATURE 1: REALISTIC EMOTION TREE CARD */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 text-white border border-emerald-700/50 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Realistic SVG Tree Visual */}
          <div className="w-full md:w-1/2">
            <RealisticEmotionTree health={treeState.health} isWatering={isWatering} />
          </div>

          {/* Tree Health Details & Info */}
          <div className="w-full md:w-1/2 space-y-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold border border-emerald-500/30 mb-2">
                Cấp Độ Cây: Level {treeState.treeLevel}
              </div>
              <h3 className="text-2xl font-black text-white">🌳 Cây Cảm Xúc Học Sinh</h3>
              <p className="text-xs text-slate-300 mt-1">
                Trạng thái: <strong className="text-emerald-400">
                  {treeState.health >= 80 ? "Xanh Tươi Xum Xuê ✨" : treeState.health >= 50 ? "Khỏe Mạnh Khá Tốt 🌿" : "Đang Rũ Lá - Cần Tưới Cây 🍂"}
                </strong>
              </p>
            </div>

            {/* Tree Progress Bar */}
            <div className="space-y-2 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Sức Khỏe Cây Tinh Thần</span>
                <span className="text-emerald-400">{treeState.health}/100%</span>
              </div>
              <div className="w-full bg-slate-800 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="bg-gradient-to-r from-amber-500 via-emerald-400 to-teal-300 h-full rounded-full transition-all duration-700"
                  style={{ width: `${treeState.health}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-400 italic">
                Tưới cây tự động mỗi khi bạn bấm chọn cảm xúc vui vẻ & áp lực thấp!
              </p>
            </div>
          </div>
        </div>

        {/* AI Explanation for Tree */}
        {treeState.aiExplanation && (
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 text-xs text-slate-200 leading-relaxed space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Phân Tích Cây Cảm Xúc:</span>
              <span className="ml-auto text-[10px] font-bold text-amber-300 bg-amber-900/60 px-2 py-0.5 rounded border border-amber-500/30">
                AI chỉ mang tính chất tham khảo
              </span>
            </div>
            <p className="pl-4 border-l-2 border-emerald-400 font-medium text-slate-200">
              {treeState.aiExplanation}
            </p>
          </div>
        )}
      </div>

      {/* FEATURE 2: STRESS LEVEL CALCULATED FROM LAST 10 CHECK-INS */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500" />
              <h3 className="font-extrabold text-slate-900 text-base">
                Thanh Mức Độ Căng Thẳng (Trung Bình 10 Lần Check-in Gần Nhất)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tự động tính từ 10 lần đánh giá gần đây nhất (Thang điểm 0 - 5 điểm)
            </p>
          </div>

          <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 px-4 py-2 rounded-2xl self-start sm:self-auto">
            <span className="text-xs font-bold text-rose-900">Điểm Trung Bình:</span>
            <span className="text-xl font-black text-rose-600">{avgStress10} / 5</span>
          </div>
        </div>

        {/* Stress Bar Visual */}
        <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>0 điểm (Thư thái)</span>
            <span>2.5 điểm (Vừa)</span>
            <span>5 điểm (Bực tức / Mệt mỏi)</span>
          </div>
          <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden p-0.5 border border-slate-300">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                avgStress10 <= 1 ? "bg-emerald-500" : avgStress10 <= 3 ? "bg-amber-500" : "bg-rose-600"
              }`}
              style={{ width: `${(avgStress10 / 5) * 100}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-slate-600 font-medium">
            {avgStress10 <= 1
              ? "✨ Tuyệt vời! Tâm trạng thảnh thơi, áp lực học tập ở mức an toàn."
              : avgStress10 <= 3
              ? "⛅ Áp lực ở mức trung bình. Hãy nghỉ ngơi hợp lý và duy trì thói quen học tập."
              : "🌧️ Áp lực hơi cao! AI khuyên em nên thực hiện bài thở 3 phút hoặc tâm sự ở góc SOS."}
          </p>
        </div>
      </div>

      {/* FEATURE 3: 30-DAY DAILY SUMMARY HISTORY & CALENDAR */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span>Lịch Lưu Kết Quả Trung Bình Ngày (30 Ngày Qua)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Cuối ngày tự động lưu điểm trung bình ngày & đánh giá tổng kết sau 30 ngày
            </p>
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

        {/* 30 Days Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-15 gap-2 pt-1">
          {past30Days.map((day, idx) => {
            const summary = dailySummaries[day.dateStr];
            const hasData = summary && summary.moodCount > 0;
            const avg = hasData ? summary.avgStress : null;

            let cellBg = "bg-slate-100 border-slate-200 text-slate-400";
            if (hasData && avg !== null) {
              if (avg > 3.5) cellBg = "bg-rose-500 text-white border-rose-600 font-bold shadow-xs";
              else if (avg > 1.5) cellBg = "bg-amber-400 text-amber-950 border-amber-500 font-bold shadow-xs";
              else cellBg = "bg-emerald-500 text-white border-emerald-600 font-bold shadow-xs";
            }

            return (
              <div
                key={idx}
                className={`p-2 rounded-xl border text-center flex flex-col items-center justify-between h-16 transition duration-200 ${cellBg}`}
                title={hasData ? `${day.dateStr}: TB ${avg}/5 điểm (${summary.evaluation})` : `${day.dateStr}: Chưa check-in`}
              >
                <span className="text-[10px] font-bold opacity-80">{day.displayDate}</span>
                <span className="text-xs font-black my-auto">{hasData ? `${avg}` : "—"}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* MAIN CHECK-IN & COUNSELOR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Reordered Mood Check-in & AI Counselor */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Emotion Selection (Sắp xếp theo thang điểm 0 -> 5) */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Smile className="w-5 h-5 text-rose-500" />
                <span>Chọn Cảm Xúc (Sắp Xếp Theo Thang Điểm Áp Lực 0 - 5)</span>
              </h3>
              <div className="text-xs font-bold text-slate-500 flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-xl">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>{new Date().toLocaleTimeString("vi-VN")}</span>
              </div>
            </div>

            {/* 8 Reordered Emotion Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {MOOD_OPTIONS.map((m) => {
                const isSelected = selectedMoodObj.id === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => handleSelectMood(m)}
                    className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 relative ${
                      isSelected
                        ? "bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-200 scale-105 font-bold"
                        : `${m.bg} font-semibold`
                    }`}
                  >
                    <span className="text-3xl animate-bounce">{m.emoji}</span>
                    <span className="text-xs line-clamp-1">{m.label}</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isSelected ? "bg-white text-rose-700" : "bg-slate-200 text-slate-700"}`}>
                      {m.score} điểm
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Note & Save Button */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Viết ghi chú ngắn (Tùy chọn):</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="VD: Sáng nay học tốt môn Toán! Hoặc: Chuẩn bị kiểm tra 15 phút..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
                />
              </div>

              <button
                onClick={handleAddLogAndWaterTree}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm transition shadow-md shadow-emerald-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <Droplets className="w-4 h-4 text-cyan-200" />
                <span>Lưu Cảm Xúc & Tưới Cây Nước Mát</span>
              </button>
            </div>
          </div>

          {/* AI Counsel Chat */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 border border-rose-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-rose-900 border-b border-rose-200/80 pb-3">
              <div className="p-2 rounded-xl bg-rose-600 text-white">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-rose-950">🤖 AI Tư Vấn Tâm Lý Học Đường</h3>
                <p className="text-xs text-rose-700 font-semibold mt-0.5">
                  Hãy kể câu chuyện hôm nay để chúng ta cùng chia sẻ nhé
                </p>
              </div>
            </div>

            <form onSubmit={handleAskCounselor} className="space-y-3">
              <textarea
                value={userStory}
                onChange={(e) => setUserStory(e.target.value)}
                rows={3}
                placeholder="Kể chuyện hôm nay để cùng chia sẻ nhé... (VD: Áp lực bài vở, lo lắng thi cử...)"
                className="w-full p-3.5 rounded-2xl border border-rose-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium resize-none shadow-xs"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-rose-600 font-bold">Lắng nghe & bảo mật 24/7</span>
                <button
                  type="submit"
                  disabled={isCounseling || !userStory.trim()}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-sm shadow-rose-200"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isCounseling ? "AI Đang Lắng Nghe..." : "Gửi Tâm Sự Tới AI"}</span>
                </button>
              </div>
            </form>

            {counselorReply && (
              <div className="p-4 rounded-2xl bg-white border border-rose-200 space-y-2 text-xs text-slate-800 shadow-sm">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>AI chỉ mang tính chất tham khảo</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-rose-700">
                  <Bot className="w-4 h-4 text-rose-600" />
                  <span>Lời Chia Sẻ Từ Chuyên Gia Tâm Lý AI:</span>
                </div>
                <p className="leading-relaxed font-medium text-slate-700 whitespace-pre-line pl-4 border-l-2 border-rose-400">
                  {counselorReply}
                </p>
              </div>
            )}
          </div>

          {/* AI 30-Day Psychological Report Box */}
          {aiReport && (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50 via-rose-50 to-amber-50 border border-indigo-200 shadow-sm space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>AI chỉ mang tính chất tham khảo</span>
              </div>
              <h4 className="font-extrabold text-indigo-950 text-base">
                Báo Cáo Đánh Giá AI Sức Khỏe Tâm Lý 30 Ngày
              </h4>

              <div className="space-y-3 text-xs text-slate-800 leading-relaxed">
                {aiReport.psychologicalAssessment && (
                  <div>
                    <span className="font-bold text-indigo-900 block mb-1">🔍 Đánh giá sức khỏe tâm lý:</span>
                    <p className="bg-white/80 p-3 rounded-2xl border border-indigo-100 text-slate-800">
                      {aiReport.psychologicalAssessment}
                    </p>
                  </div>
                )}

                {aiReport.carePlan && (
                  <div>
                    <span className="font-bold text-rose-900 block mb-1">🌱 Kế hoạch chăm sóc tinh thần:</span>
                    <p className="bg-white/80 p-3 rounded-2xl border border-rose-100 text-rose-950 whitespace-pre-line font-medium">
                      {aiReport.carePlan}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (5 cols): History & Relaxation */}
        <div className="lg:col-span-5 space-y-6">
          {/* History Timeline */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <span>Nhật Ký Cảm Xúc Đã Lưu</span>
              </h3>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {logs.length} lần
              </span>
            </div>

            {logs.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">Chưa có nhật ký cảm xúc nào.</p>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 hover:bg-slate-100 transition text-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-2xl p-1 bg-white rounded-xl shadow-xs">{log.emoji}</span>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900">{log.mood}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                            Áp lực {log.stressLevel}/5
                          </span>
                        </div>
                        <p className="text-slate-600 font-medium">{log.note}</p>
                        <div className="text-[10px] text-slate-400 font-bold flex items-center gap-2 pt-0.5">
                          <span>{log.date}</span>
                          <span>{log.time}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteLog(log.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3-Minute Box Breathing Relaxation Widget */}
          <div className="p-6 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-md space-y-5">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Thư Giãn 3 Phút</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">Bài thở 4-4-4</span>
            </div>

            <div className="flex flex-col items-center justify-center py-2 space-y-3">
              <div
                className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-1000 shadow-2xl ${
                  breathPhase === "Hít vào"
                    ? "scale-110 border-rose-400 bg-rose-500/30 shadow-rose-500/50"
                    : breathPhase === "Giữ hơi"
                    ? "scale-105 border-amber-400 bg-amber-500/30 shadow-amber-500/50"
                    : "scale-90 border-cyan-400 bg-cyan-500/30 shadow-cyan-500/50"
                }`}
              >
                <span className="text-base font-extrabold text-white uppercase tracking-wider">
                  {isBreathing ? breathPhase : "THƯ GIÃN"}
                </span>
                <span className="text-xs text-slate-300 font-semibold font-mono mt-1">
                  {Math.floor(breathSecondsLeft / 60)}:
                  {(breathSecondsLeft % 60).toString().padStart(2, "0")}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsBreathing(!isBreathing)}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs transition flex items-center gap-2 cursor-pointer shadow-md"
              >
                {isBreathing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isBreathing ? "Tạm Dừng" : "Bắt Đầu Tâp Thở"}</span>
              </button>
              <button
                onClick={() => {
                  setIsBreathing(false);
                  setBreathSecondsLeft(180);
                  setBreathPhase("Hít vào");
                }}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SOS Hug Modal */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-200 space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
              <Heart className="w-8 h-8 fill-rose-500" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Gửi Tới Em Một Cái Ôm Ấm Áp! 🫂</h3>
            <p className="text-sm text-slate-700 leading-relaxed font-medium bg-rose-50 p-4 rounded-2xl border border-rose-100">
              {sosMessage}
            </p>
            <button
              onClick={() => setShowSosModal(false)}
              className="w-full py-3 rounded-2xl bg-rose-600 text-white font-extrabold text-sm shadow-md shadow-rose-200 cursor-pointer"
            >
              Cảm Ơn AI, Em Đã Thấy Khá Hơn Rồi! ❤️
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
