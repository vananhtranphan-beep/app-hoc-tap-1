import React, { useState, useEffect } from "react";
import {
  Calendar,
  Sparkles,
  CheckSquare,
  Square,
  Clock,
  Plus,
  Trash2,
  BookOpen,
  Award,
  Zap,
  BarChart2,
  CheckCircle2,
  HelpCircle
} from "lucide-react";

export interface PlanTaskItem {
  id: string;
  taskName: string;
  hours: number;
  completed: boolean;
}

export interface DayPlan {
  dayName: string;
  tasks: PlanTaskItem[];
}

const INITIAL_7_DAYS_PLAN: DayPlan[] = [
  {
    dayName: "Thứ Hai",
    tasks: [
      { id: "m1", taskName: "Giải 5 bài tập Toán 8 (Hằng đẳng thức)", hours: 1.5, completed: true },
      { id: "m2", taskName: "Học 15 từ vựng Tiếng Anh Unit 1", hours: 1.0, completed: false },
    ],
  },
  {
    dayName: "Thứ Ba",
    tasks: [
      { id: "t1", taskName: "Soạn bài Ngữ Văn 8 (Lão Hạc)", hours: 1.0, completed: true },
      { id: "t2", taskName: "Làm bài tập KHTN (Hóa học)", hours: 1.5, completed: false },
    ],
  },
  {
    dayName: "Thứ Tư",
    tasks: [
      { id: "w1", taskName: "Ôn tập Lý thuyết Lịch Sử 8", hours: 1.0, completed: false },
      { id: "w2", taskName: "Luyện bài tập Tin Học Python", hours: 1.0, completed: false },
    ],
  },
  {
    dayName: "Thứ Năm",
    tasks: [
      { id: "th1", taskName: "Luyện đề Toán THCS tổng hợp", hours: 2.0, completed: false },
      { id: "th2", taskName: "Luyện đọc Ngữ Văn Cấp 2", hours: 1.0, completed: false },
    ],
  },
  {
    dayName: "Thứ Sáu",
    tasks: [
      { id: "f1", taskName: "Ôn tập Ngữ Pháp Tiếng Anh THCS", hours: 1.5, completed: false },
      { id: "f2", taskName: "Làm bài tập KHTN (Sinh học)", hours: 1.0, completed: false },
    ],
  },
  {
    dayName: "Thứ Bảy",
    tasks: [
      { id: "sa1", taskName: "Học nhóm ôn thi vào Lớp 10 môn Toán", hours: 2.5, completed: false },
      { id: "sa2", taskName: "Viết bài văn Nghị luận xã hội", hours: 1.5, completed: false },
    ],
  },
  {
    dayName: "Chủ Nhật",
    tasks: [
      { id: "su1", taskName: "Tổng kết lại kiến thức cả tuần", hours: 1.5, completed: false },
      { id: "su2", taskName: "Tập thể thao & Thư giãn tinh thần", hours: 1.0, completed: true },
    ],
  },
];

interface StudyPlanViewProps {
  userId?: string;
}

export const StudyPlanView: React.FC<StudyPlanViewProps> = ({ userId }) => {
  const storageKey = `user_${userId || "default"}_planner_custom`;

  const [days, setDays] = useState<DayPlan[]>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_7_DAYS_PLAN;
      }
    }
    return INITIAL_7_DAYS_PLAN;
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<{
    summary?: string;
    recommendations?: string[];
    encouragementQuote?: string;
  } | null>(null);

  // Save planner data to localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(days));
  }, [days, storageKey]);

  // Add a task row to a specific day
  const handleAddTask = (dayIdx: number) => {
    const updated = [...days];
    const newTask: PlanTaskItem = {
      id: "task-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
      taskName: "Bài tập / Nhiệm vụ mới",
      hours: 1,
      completed: false,
    };
    updated[dayIdx].tasks.push(newTask);
    setDays(updated);
  };

  // Update task text/hours
  const handleUpdateTask = (dayIdx: number, taskIdx: number, field: "taskName" | "hours" | "completed", val: any) => {
    const updated = [...days];
    updated[dayIdx].tasks[taskIdx] = {
      ...updated[dayIdx].tasks[taskIdx],
      [field]: val,
    };
    setDays(updated);
  };

  // Delete task row
  const handleDeleteTask = (dayIdx: number, taskIdx: number) => {
    const updated = [...days];
    updated[dayIdx].tasks.splice(taskIdx, 1);
    setDays(updated);
  };

  // Trigger AI Analysis
  const handleAnalyzePlannerWithAI = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/ai/plan-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          days,
          studentGrade: "8",
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Lỗi kết nối AI");

      setAiReport(data);
    } catch (err: any) {
      alert("Không thể kết nối AI: " + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Calculate total weekly hours and completed count
  let totalWeeklyHours = 0;
  let totalTasksCount = 0;
  let completedTasksCount = 0;

  days.forEach((d) => {
    d.tasks.forEach((t) => {
      totalWeeklyHours += Number(t.hours) || 0;
      totalTasksCount++;
      if (t.completed) completedTasksCount++;
    });
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/30 text-violet-200 text-xs font-bold border border-violet-400/30">
            <Calendar className="w-3.5 h-3.5" />
            <span>Thời Khóa Biểu Tự Nhập Tay 7 Ngày Trong Tuần</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            📅 Lập Kế Hoạch Học Tập Tuần
          </h2>
          <p className="text-xs sm:text-sm text-violet-100 leading-relaxed">
            Nhập tay tự do danh sách việc cần làm và số giờ học cho từng ngày (Thứ 2 đến Chủ Nhật). Thêm/xóa dòng tùy thích, sau đó liên kết AI để phân tích sự cân bằng và nhận lời khuyên học tập!
          </p>
        </div>

        <button
          onClick={handleAnalyzePlannerWithAI}
          disabled={isAnalyzing}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-violet-900/50 transition cursor-pointer flex items-center justify-center gap-2 shrink-0 border border-violet-300/30"
        >
          <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          <span>{isAnalyzing ? "AI Đang Phân Tích Lịch..." : "🤖 Kết Nối AI Phân Tích Kế Hoạch"}</span>
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-700">
              {completedTasksCount} / {totalTasksCount} Việc
            </div>
            <div className="text-xs text-slate-500 font-medium">Số việc cần làm đã hoàn thành</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-100 text-amber-700">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-amber-600">
              {totalTasksCount ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0}%
            </div>
            <div className="text-xs text-slate-500 font-medium">Tỷ lệ tiến độ tuần này</div>
          </div>
        </div>
      </div>

      {/* AI Analysis Feedback Report */}
      {aiReport && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-violet-50 via-indigo-50 to-amber-50 border border-violet-200 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI chỉ có tính chất tham khảo</span>
          </div>
          <div className="flex items-center justify-between border-b border-violet-200/80 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-600" />
              <h3 className="font-extrabold text-violet-950 text-base">
                Báo Cáo Phân Tích & Lời Khuyên Kế Hoạch Học Tập AI
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-violet-200 text-violet-900 font-bold text-xs">
              Đánh giá AI
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-800 leading-relaxed">
            <div>
              <span className="font-bold text-violet-900 block mb-1">📊 Đánh giá sự cân bằng thời khóa biểu:</span>
              <p className="bg-white/80 p-3.5 rounded-2xl border border-violet-100 font-medium">{aiReport.summary}</p>
            </div>

            {aiReport.recommendations && aiReport.recommendations.length > 0 && (
              <div>
                <span className="font-bold text-indigo-900 block mb-1">💡 Lời khuyên tối ưu hóa hiệu quả:</span>
                <div className="space-y-1.5">
                  {aiReport.recommendations.map((rec, rIdx) => (
                    <div key={rIdx} className="bg-white/80 p-2.5 rounded-xl border border-indigo-100 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-600 mt-1.5 shrink-0"></span>
                      <span className="font-medium text-slate-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {aiReport.encouragementQuote && (
              <div className="p-3.5 bg-violet-600 text-white rounded-2xl font-bold flex items-center gap-2 shadow-sm">
                <Award className="w-5 h-5 text-amber-300 shrink-0" />
                <span>"{aiReport.encouragementQuote}"</span>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-400 font-medium italic mt-2 text-center pt-2 border-t border-slate-200/60">
            AI chỉ mang tính chất tham khảo.
          </div>
        </div>
      )}

      {/* 7 Days Planner Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {days.map((dayItem, dayIdx) => (
          <div
            key={dayIdx}
            className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-violet-300 transition"
          >
            {/* Day Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1 rounded-xl bg-violet-600 text-white font-extrabold text-xs shadow-xs">
                  {dayItem.dayName}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  ({dayItem.tasks.length} nhiệm vụ)
                </span>
              </div>
              <span className="text-xs font-extrabold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-lg">
                Tổng: {dayItem.tasks.reduce((sum, t) => sum + (Number(t.hours) || 0), 0)} Giờ
              </span>
            </div>

            {/* Task Rows List */}
            <div className="space-y-2.5">
              {dayItem.tasks.map((task, taskIdx) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-2xl border transition flex flex-col sm:flex-row items-stretch sm:items-center gap-2 ${
                    task.completed
                      ? "bg-emerald-50/60 border-emerald-200"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100/80"
                  }`}
                >
                  {/* Complete Checkbox */}
                  <button
                    type="button"
                    onClick={() => handleUpdateTask(dayIdx, taskIdx, "completed", !task.completed)}
                    className="p-1 text-slate-400 hover:text-emerald-600 transition cursor-pointer self-start sm:self-auto"
                  >
                    {task.completed ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400" />
                    )}
                  </button>

                  {/* Task Name Input */}
                  <input
                    type="text"
                    value={task.taskName}
                    onChange={(e) => handleUpdateTask(dayIdx, taskIdx, "taskName", e.target.value)}
                    placeholder="Tên việc cần làm / bài tập..."
                    className={`flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium ${
                      task.completed ? "line-through text-slate-400" : "text-slate-800"
                    }`}
                  />

                  {/* Hours Input */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="10"
                      value={task.hours}
                      onChange={(e) => handleUpdateTask(dayIdx, taskIdx, "hours", Number(e.target.value))}
                      className="w-16 px-2 py-1.5 rounded-xl border border-slate-200 text-xs bg-white text-center font-bold text-violet-700 focus:outline-none"
                    />
                    <span className="text-[11px] font-bold text-slate-500">Giờ</span>

                    {/* Delete Row Button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteTask(dayIdx, taskIdx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer ml-1"
                      title="Xóa dòng này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Task Button for Day */}
            <button
              type="button"
              onClick={() => handleAddTask(dayIdx)}
              className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-violet-50 text-slate-700 hover:text-violet-700 text-xs font-bold border border-dashed border-slate-300 hover:border-violet-300 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Việc Cần Làm Cho {dayItem.dayName}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
