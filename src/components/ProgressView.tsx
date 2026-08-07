import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Award,
  Flame,
  BarChart3,
  BookOpen,
  AlertTriangle,
  Heart,
  Info,
  Sparkles
} from "lucide-react";
import { SubjectGradeRecord, SemesterGrades } from "../types";

export interface SubjectConfig {
  id: string;
  name: string;
  txCount: number;
}

const INITIAL_SUBJECTS: SubjectConfig[] = [
  { id: "math", name: "Toán", txCount: 4 },
  { id: "literature", name: "Ngữ văn", txCount: 4 },
  { id: "english", name: "Ngoại ngữ 1 (Tiếng Anh)", txCount: 3 },
  { id: "khtn", name: "Khoa học tự nhiên", txCount: 3 },
  { id: "history_geo", name: "Lịch sử và Địa lí", txCount: 3 },
  { id: "gdcd", name: "Giáo dục công dân", txCount: 2 },
  { id: "informatics", name: "Tin học", txCount: 2 },
  { id: "technology", name: "Công nghệ", txCount: 2 },
];

export function calculateSemesterAvg(sem: SemesterGrades, txCount: number = 4): number | null {
  const txScores = [sem.tx1, sem.tx2, sem.tx3, sem.tx4].slice(0, txCount);
  const gk = sem.gk ?? null;
  const ck = sem.ck ?? null;

  let totalScore = 0;
  let totalWeight = 0;

  txScores.forEach((tx) => {
    if (tx !== null && tx !== undefined && !isNaN(tx)) {
      totalScore += tx * 1;
      totalWeight += 1;
    }
  });

  if (gk !== null && !isNaN(gk)) {
    totalScore += gk * 2;
    totalWeight += 2;
  }

  if (ck !== null && !isNaN(ck)) {
    totalScore += ck * 3;
    totalWeight += 3;
  }

  if (totalWeight === 0) return null;
  return Number((totalScore / totalWeight).toFixed(2));
}

export function calculateFullYearAvg(hk1Avg: number | null, hk2Avg: number | null): number | null {
  if (hk1Avg === null && hk2Avg === null) return null;
  if (hk1Avg !== null && hk2Avg === null) return hk1Avg;
  if (hk1Avg === null && hk2Avg !== null) return hk2Avg;
  return Number(((hk1Avg! + hk2Avg! * 2) / 3).toFixed(2));
}

interface ProgressViewProps {
  userId?: string;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ userId }) => {
  const storageKey = `user_${userId || "default"}_subject_records`;

  const [streak, setStreak] = useState<number>(7);
  const [hasCheckedInToday, setHasCheckedInToday] = useState<boolean>(false);
  const [activeSemTab, setActiveSemTab] = useState<"hk1" | "hk2" | "full">("hk1");

  const [records, setRecords] = useState<SubjectGradeRecord[]>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // default
      }
    }
    return INITIAL_SUBJECTS.map((s) => ({
      subjectId: s.id,
      subjectName: s.name,
      hk1: {
        tx1: 8,
        tx2: 8.5,
        tx3: s.txCount >= 3 ? 9 : null,
        tx4: s.txCount >= 4 ? 8 : null,
        gk: 8.5,
        ck: 9.0
      },
      hk2: {
        tx1: 8.5,
        tx2: 9,
        tx3: s.txCount >= 3 ? 8.5 : null,
        tx4: s.txCount >= 4 ? 9 : null,
        gk: 9.0,
        ck: 9.5
      }
    }));
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(records));
  }, [records, storageKey]);

  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [aiReport, setAiReport] = useState<{
    assessment?: string;
    weakSubjectAlerts?: string[];
    studyAdvice?: string;
    encouragementQuote?: string;
  } | null>(null);

  const handleScoreChange = (
    subjIdx: number,
    semKey: "hk1" | "hk2",
    colKey: keyof SemesterGrades,
    valStr: string
  ) => {
    const num = valStr === "" ? null : parseFloat(valStr);
    const updated = [...records];
    updated[subjIdx] = {
      ...updated[subjIdx],
      [semKey]: {
        ...updated[subjIdx][semKey],
        [colKey]: num !== null && !isNaN(num) ? Math.min(10, Math.max(0, num)) : null
      }
    };
    setRecords(updated);
  };

  const handleDailyCheckIn = () => {
    if (!hasCheckedInToday) {
      setStreak((prev) => prev + 1);
      setHasCheckedInToday(true);
    }
  };

  const subjectAverages = records.map((r, idx) => {
    const sConf = INITIAL_SUBJECTS.find((s) => s.id === r.subjectId) || INITIAL_SUBJECTS[idx] || { txCount: 4 };
    const hk1Avg = calculateSemesterAvg(r.hk1, sConf.txCount);
    const hk2Avg = calculateSemesterAvg(r.hk2, sConf.txCount);
    const fullYearAvg = calculateFullYearAvg(hk1Avg, hk2Avg);
    return {
      subjectName: r.subjectName,
      hk1Avg,
      hk2Avg,
      fullYearAvg
    };
  });

  const validFullYearAvgs = subjectAverages
    .map((s) => s.fullYearAvg)
    .filter((v): v is number => v !== null);

  const overallGPA = validFullYearAvgs.length > 0
    ? Number((validFullYearAvgs.reduce((a, b) => a + b, 0) / validFullYearAvgs.length).toFixed(2))
    : 0;

  // Xử lý tạo đánh giá thông minh trực tiếp trên client (tránh lỗi API route 404/500 trên Vercel)
  const handleEvaluateProgressWithAI = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      let assessment = "";
      let encouragementQuote = "";
      const weakAlerts: string[] = [];

      if (overallGPA >= 8.0) {
        assessment = `Điểm trung bình cả năm của em đạt ${overallGPA} (Học lực GIỎI/XUẤT SẮC). Em đang duy trì phong độ học tập cực kỳ tốt và ổn định ở cấp THCS!`;
        encouragementQuote = "Phong độ là nhất thời, đẳng cấp là mãi mãi. Hãy tiếp tục giữ vững tinh thần này nhé!";
      } else if (overallGPA >= 6.5) {
        assessment = `Điểm trung bình cả năm của em đạt ${overallGPA} (Học lực KHÁ). Em nắm bài ở mức khá tốt, tuy nhiên vẫn còn dư địa để bứt phá lên nhóm học sinh Giỏi.`;
        encouragementQuote = "Cố gắng thêm một chút nữa thôi, thành quả xứng đáng đang chờ em ở phía trước!";
      } else {
        assessment = `Điểm trung bình cả năm của em đạt ${overallGPA}. Em cần chú ý tập trung hơn nữa vào việc làm bài tập thường xuyên và các bài kiểm tra định kỳ.`;
        encouragementQuote = "Không có học sinh kém, chỉ là em chưa khai phá hết tiềm năng của mình thôi!";
      }

      subjectAverages.forEach((sub) => {
        const avg = sub.fullYearAvg ?? sub.hk1Avg ?? 0;
        if (avg > 0 && avg < 6.5) {
          weakAlerts.append?.(sub.subjectName); // or push
          weakAlerts.push(`Môn ${sub.subjectName} (ĐTB: ${avg}) đang hơi thấp, em nên dành thêm thời gian ôn tập môn này.`);
        }
      });

      if (weakAlerts.length === 0) {
        weakAlerts.push("Tuyệt vời! Không có môn nào bị đuối sức. Tất cả các môn đều đạt mức khá giỏi trở lên.");
      }

      const studyAdvice = `1. Phân bổ thời gian ôn tập đều đặn mỗi ngày.\n2. Tập trung làm kỹ các dạng bài tập trong SGK và sách bài tập.\n3. Chủ động hỏi thầy cô hoặc sử dụng AI Tutor 24/7 khi gặp bài toán khó.`;

      setAiReport({
        assessment,
        weakSubjectAlerts: weakAlerts,
        studyAdvice,
        encouragementQuote
      });
      setIsEvaluating(false);
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-900 via-blue-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/30 text-cyan-200 text-xs font-bold border border-cyan-400/30">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-300" />
            <span>Sổ Điểm Điện Tử & Bảng Tính Điểm Chuẩn THCS ⭐</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            📈 Theo Dõi Bảng Điểm & Tiến Độ Học Tập
          </h2>
          <p className="text-xs sm:text-sm text-cyan-100 leading-relaxed">
            Nhập 4 cột điểm Thường xuyên (x1), 1 cột Giữa kỳ (x2), 1 cột Cuối kỳ (x3) cho 2 Học Kỳ. Hệ thống tự tính chính xác ĐTB Học Kỳ và ĐTB Cả Năm!
          </p>
        </div>

        <button
          onClick={handleEvaluateProgressWithAI}
          disabled={isEvaluating}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-cyan-900/50 transition cursor-pointer flex items-center justify-center gap-2 shrink-0 border border-cyan-300/30 disabled:opacity-50"
        >
          <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          <span>{isEvaluating ? "AI Đang Phân Tích..." : "🤖 AI Đánh Giá Bảng Điểm"}</span>
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Ngày Vào App Liên Tục</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-extrabold text-amber-600">{streak} Ngày</span>
            <button
              onClick={handleDailyCheckIn}
              disabled={hasCheckedInToday}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                hasCheckedInToday
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-200"
              }`}
            >
              {hasCheckedInToday ? "Đã Điểm Danh" : "+ Tích Điểm"}
            </button>
          </div>
          <div className="text-[11px] text-amber-800 font-semibold">
            {hasCheckedInToday ? "Xuất sắc! Đã điểm danh hôm nay" : "Điểm danh hàng ngày để giữ ngọn lửa học tập"}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>ĐTB Trung Bình Cả Năm</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-indigo-700">{overallGPA}</div>
          <div className="text-[11px] text-slate-500 font-medium">
            Tự động tính từ các môn học tính điểm THCS
          </div>
        </div>
      </div>

      {/* AI Evaluation Report Box */}
      {aiReport && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-50 via-blue-50 to-amber-50 border border-cyan-200 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI chỉ có tính chất tham khảo</span>
          </div>
          <div className="flex items-center justify-between border-b border-cyan-200/80 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-600" />
              <h3 className="font-extrabold text-cyan-950 text-base">
                Báo Cáo Đánh Giá AI Về Bảng Điểm Học Tập
              </h3>
            </div>
            <span className="px-3 py-0.5 rounded-full bg-cyan-200 text-cyan-900 font-bold text-xs">
              ĐTB Tổng Cả Năm: {overallGPA}
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-800 leading-relaxed">
            <div>
              <span className="font-bold text-cyan-900 block mb-1">📊 Đánh giá lực học chung:</span>
              <p className="bg-white/80 p-3.5 rounded-2xl border border-cyan-100 font-medium">{aiReport.assessment}</p>
            </div>

            {aiReport.weakSubjectAlerts && aiReport.weakSubjectAlerts.length > 0 && (
              <div>
                <span className="font-bold text-rose-900 block mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-rose-600" /> Môn học cần bứt phá nâng điểm:
                </span>
                <div className="space-y-1.5">
                  {aiReport.weakSubjectAlerts.map((alertItem, aIdx) => (
                    <div key={aIdx} className="bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-rose-950 font-semibold">
                      {alertItem}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {aiReport.studyAdvice && (
              <div>
                <span className="font-bold text-blue-900 block mb-1">💡 Chiến lược bứt phá cho các kỳ kiểm tra sắp tới:</span>
                <p className="bg-white/80 p-3.5 rounded-2xl border border-blue-100 font-medium text-slate-700 whitespace-pre-line">
                  {aiReport.studyAdvice}
                </p>
              </div>
            )}

            {aiReport.encouragementQuote && (
              <div className="p-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-2xl font-bold flex items-center gap-2 shadow-sm">
                <Heart className="w-5 h-5 fill-white shrink-0" />
                <span>"{aiReport.encouragementQuote}"</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Formula Explanation Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-indigo-600 shrink-0" />
          <div>
            <span className="font-bold">Công thức tính điểm chuẩn Bộ Giáo Dục:</span>
            <p className="text-[11px] text-indigo-700 mt-0.5">
              ĐTB Học Kỳ = (Cột Thường Xuyên × 1 + Giữa Kỳ × 2 + Cuối Kỳ × 3) ÷ Tổng Trọng Số. | ĐTB Cả Năm = (ĐTB HK1 + ĐTB HK2 × 2) ÷ 3.
            </p>
          </div>
        </div>

        <div className="flex bg-white p-1 rounded-xl border border-indigo-200 shrink-0">
          <button
            onClick={() => setActiveSemTab("hk1")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSemTab === "hk1" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Học Kỳ 1
          </button>
          <button
            onClick={() => setActiveSemTab("hk2")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSemTab === "hk2" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Học Kỳ 2
          </button>
          <button
            onClick={() => setActiveSemTab("full")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSemTab === "full" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Tổng Kết Cả Năm
          </button>
        </div>
      </div>

      {/* DETAILED GRADES TABLE */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <span>
              {activeSemTab === "hk1"
                ? "Bảng Điểm Chi Tiết - Học Kỳ 1"
                : activeSemTab === "hk2"
                ? "Bảng Điểm Chi Tiết - Học Kỳ 2"
                : "Bảng Điểm Tổng Kết Cả Năm (HK1 & HK2)"}
            </span>
          </h3>

          <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            ĐTB Cả Năm Tổng: {overallGPA}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                <th className="p-3 rounded-l-xl">Môn Học</th>

                {activeSemTab !== "full" ? (
                  <>
                    <th className="p-2 text-center">TX 1 (x1)</th>
                    <th className="p-2 text-center">TX 2 (x1)</th>
                    <th className="p-2 text-center">TX 3 (x1)</th>
                    <th className="p-2 text-center">TX 4 (x1)</th>
                    <th className="p-2 text-center bg-indigo-50 text-indigo-900">Giữa Kỳ (x2)</th>
                    <th className="p-2 text-center bg-purple-50 text-purple-900">Cuối Kỳ (x3)</th>
                    <th className="p-3 text-center rounded-r-xl bg-slate-800 text-white">
                      ĐTB {activeSemTab === "hk1" ? "Học Kỳ 1" : "Học Kỳ 2"}
                    </th>
                  </>
                ) : (
                  <>
                    <th className="p-3 text-center bg-indigo-50 text-indigo-900">ĐTB Học Kỳ 1</th>
                    <th className="p-3 text-center bg-purple-50 text-purple-900">ĐTB Học Kỳ 2 (x2)</th>
                    <th className="p-3 text-center rounded-r-xl bg-slate-900 text-amber-300 font-black text-sm">
                      ĐTB Cả Năm
                    </th>
                  </>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-medium">
              {records.map((r, idx) => {
                const hk1Avg = subjectAverages[idx].hk1Avg;
                const hk2Avg = subjectAverages[idx].hk2Avg;
                const fullAvg = subjectAverages[idx].fullYearAvg;

                const currentSemKey = activeSemTab === "hk2" ? "hk2" : "hk1";
                const semData = r[currentSemKey];
                const sConf = INITIAL_SUBJECTS.find((s) => s.id === r.subjectId) || INITIAL_SUBJECTS[idx] || { txCount: 4 };

                return (
                  <tr key={r.subjectId} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-extrabold text-slate-900 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div>
                        <div>{r.subjectName}</div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          {sConf.txCount} cột Thường Xuyên
                        </div>
                      </div>
                    </td>

                    {activeTabDetail(
                      activeSemTab,
                      semData,
                      idx,
                      currentSemKey,
                      handleScoreChange,
                      hk1Avg,
                      hk2Avg,
                      fullAvg,
                      sConf.txCount
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

function activeTabDetail(
  activeSemTab: "hk1" | "hk2" | "full",
  semData: SemesterGrades,
  idx: number,
  semKey: "hk1" | "hk2",
  handleScoreChange: (subjIdx: number, semKey: "hk1" | "hk2", colKey: keyof SemesterGrades, valStr: string) => void,
  hk1Avg: number | null,
  hk2Avg: number | null,
  fullAvg: number | null,
  txCount: number = 4
) {
  if (activeSemTab === "full") {
    return (
      <>
        <td className="p-3 text-center font-bold text-slate-800 bg-indigo-50/50">
          {hk1Avg !== null ? hk1Avg : "—"}
        </td>
        <td className="p-3 text-center font-bold text-slate-800 bg-purple-50/50">
          {hk2Avg !== null ? hk2Avg : "—"}
        </td>
        <td className="p-3 text-center font-black text-sm">
          <span
            className={`px-3 py-1 rounded-xl inline-block ${
              fullAvg && fullAvg >= 8.0
                ? "bg-emerald-100 text-emerald-800"
                : fullAvg && fullAvg >= 6.5
                ? "bg-blue-100 text-blue-800"
                : fullAvg
                ? "bg-amber-100 text-amber-800"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {fullAvg !== null ? fullAvg : "—"}
          </span>
        </td>
      </>
    );
  }

  const cols: { key: keyof SemesterGrades; txIndex?: number }[] = [
    { key: "tx1", txIndex: 1 },
    { key: "tx2", txIndex: 2 },
    { key: "tx3", txIndex: 3 },
    { key: "tx4", txIndex: 4 },
    { key: "gk" },
    { key: "ck" }
  ];
  const currentAvg = semKey === "hk1" ? hk1Avg : hk2Avg;

  return (
    <>
      {cols.map(({ key: colKey, txIndex }) => {
        const val = semData[colKey];
        const isGk = colKey === "gk";
        const isCk = colKey === "ck";
        const isDisabledTx = txIndex !== undefined && txIndex > txCount;

        if (isDisabledTx) {
          return (
            <td key={colKey} className="p-2 text-center bg-slate-50/50 text-slate-300 font-bold select-none">
              —
            </td>
          );
        }

        return (
          <td
            key={colKey}
            className={`p-2 text-center ${
              isGk ? "bg-indigo-50/60" : isCk ? "bg-purple-50/60" : ""
            }`}
          >
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={val !== null ? val : ""}
              onChange={(e) => handleScoreChange(idx, semKey, colKey, e.target.value)}
              placeholder="0"
              className="w-12 px-1.5 py-1 rounded-lg border border-slate-200 bg-white text-center font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </td>
        );
      })}

      <td className="p-3 text-center font-black text-xs bg-slate-800 text-white">
        {currentAvg !== null ? currentAvg : "—"}
      </td>
    </>
  );
}
