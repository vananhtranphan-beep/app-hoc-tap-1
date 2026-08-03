import React, { useState } from "react";
import { Target, Sparkles, Compass, Award, ChevronRight, GraduationCap, CheckCircle2 } from "lucide-react";
import { CareerResult } from "../types";

export const CareerGuidanceView: React.FC = () => {
  const [interests, setInterests] = useState("Thích công nghệ, sáng tạo, giải quyết vấn đề và tư duy logic");
  const [strengths, setStrengths] = useState("Tư duy phân tích, thích tính toán và khả năng giao tiếp Tiếng Anh tốt");
  const [favoriteSubjects, setFavoriteSubjects] = useState<string[]>(["Toán", "Ngoại ngữ 1 (Tiếng Anh)", "Tin học"]);
  const [targetHighSchool, setTargetHighSchool] = useState("Trường THPT Chuyên / Top 1");

  const [isLoading, setIsLoading] = useState(false);
  const [generalAdvice, setGeneralAdvice] = useState<string>("");
  const [careers, setCareers] = useState<CareerResult[]>([
    {
      title: "Kỹ Sư Lập Trình & Trí Tuệ Nhân Tạo (AI Engineer)",
      description: "Xây dựng ứng dụng phần mềm, thuật toán trí tuệ nhân tạo và hệ thống xử lý dữ liệu thông minh.",
      matchPercentage: 95,
      subjectsNeeded: ["Toán Học (Khối A00, A01)", "Tiếng Anh (Khối D01)", "Tin Học"],
      recommendedHighSchoolPaths: ["THPT Chuyên Tin / Chuyên Toán", "THPT Công Lập Chất Lượng Cao"],
      roadmap: [
        "Lớp 6 - Lớp 9 THCS: Ôn chắc kiến thức Toán Đại số & Hình học, tích cực rèn luyện môn Tiếng Anh và học Scratch/Python cơ bản.",
        "Thi Vào Lớp 10: Đặt mục tiêu đỗ vào lớp Chuyên Toán, Chuyên Tin hoặc THPT Top đầu địa phương.",
        "Lớp 10 - Lớp 12 THPT: Ôn tập tổ hợp môn A01 (Toán, Lý, Anh) hoặc A00 (Toán, Lý, Hóa), thi chứng chỉ IELTS 6.5+.",
        "Bậc Đại Học: Ngành Khoa học Máy tính / Công nghệ Thông tin tại các trường Đại học Bách Khoa, KHTN."
      ]
    },
    {
      title: "Chuyên Gia Phân Tích Dữ Liệu & Kinh Tế Số",
      description: "Phân tích xu hướng kinh tế, tối ưu hóa dữ liệu và vận hành hệ thống tài chính công nghệ.",
      matchPercentage: 88,
      subjectsNeeded: ["Toán Học", "Tiếng Anh", "Lịch Sử & Địa Lý"],
      recommendedHighSchoolPaths: ["THPT Khối A01 / D01", "Trường THPT Quốc Tế / Song Ngữ"],
      roadmap: [
        "Lớp 6 - Lớp 9 THCS: Học tốt chương trình Toán Cấp 2 (đặc biệt là Thống kê xác suất) và nâng cao từ vựng Tiếng Anh.",
        "Thi Vào Lớp 10: Tập trung đạt điểm cao bài thi Tuyển sinh Lớp 10 môn Toán & Tiếng Anh.",
        "Lớp 10 - Lớp 12 THPT: Tham gia các cuộc thi KHKT học sinh và ôn tập tổ hợp D01 (Toán, Văn, Anh).",
        "Bậc Đại Học: Ngành Phân Tích Dữ Liệu Kinh Doanh, Tài Chính Doanh Nghiệp."
      ]
    }
  ]);

  const handleConsultCareer = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interests,
          strengths,
          favoriteSubjects,
          targetHighSchool
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Lỗi tư vấn hướng nghiệp");

      setGeneralAdvice(data.generalAdvice || "");
      if (data.recommendedCareers && Array.isArray(data.recommendedCareers)) {
        setCareers(data.recommendedCareers);
      }
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavSubject = (subj: string) => {
    setFavoriteSubjects((prev) =>
      prev.includes(subj) ? prev.filter((s) => s !== subj) : [...prev, subj]
    );
  };

  const ALL_SUBJECTS = [
    "Toán",
    "Ngữ văn",
    "Ngoại ngữ 1 (Tiếng Anh)",
    "Khoa học tự nhiên",
    "Lịch sử và Địa lí",
    "Giáo dục công dân",
    "Tin học",
    "Công nghệ",
    "Giáo dục thể chất",
    "Nghệ thuật",
    "Hoạt động trải nghiệm",
    "Giáo dục địa phương"
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-900 via-orange-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/30 text-amber-200 text-xs font-bold border border-amber-400/30">
            <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
            <span>Định Hướng Học Tập & Chọn Khối Lớp 10 THCS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            🎯 Hướng Nghiệp THCS & Định Hướng Chọn Trường
          </h2>
          <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
            Phân tích AI dựa trên sở thích, điểm mạnh, môn học yêu thích và loại trường THPT ước mơ để đề xuất ngành nghề phù hợp, khối thi và lộ trình từng bước!
          </p>
        </div>

        <button
          onClick={handleConsultCareer}
          disabled={isLoading}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-900/50 transition cursor-pointer flex items-center justify-center gap-2 shrink-0 border border-amber-300/30"
        >
          <Sparkles className="w-5 h-5 text-yellow-200 animate-pulse" />
          <span>{isLoading ? "AI Đang Phân Tích Lộ Trình..." : "🤖 AI Phân Tích Định Hướng"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Survey Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-600" />
              <span>Khảo Sát Đam Mê & Môn Học Yêu Thích</span>
            </h3>

            {/* Target High School Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Mục tiêu Trường THPT ước mơ:</label>
              <select
                value={targetHighSchool}
                onChange={(e) => setTargetHighSchool(e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-200 text-xs bg-slate-50 font-bold text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Trường THPT Chuyên / Top 1">Trường THPT Chuyên / Top 1 Địa Phương</option>
                <option value="Trường THPT Công Lập Chất Lượng">Trường THPT Công Lập Chất Lượng Khá/Giỏi</option>
                <option value="Trường Song Ngữ / Tư Thục">Trường THPT Song Ngữ / Quốc Tế / Tư Thục</option>
                <option value="Trường Nghề / Cao Đẳng Nghề THPT">Trường Nghề / Hệ Cao Đẳng Nghề THPT</option>
              </select>
            </div>

            {/* Interests */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Sở thích & Đam mê cá nhân:</label>
              <textarea
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                rows={2}
                className="w-full p-3 rounded-2xl border border-slate-200 text-xs bg-slate-50 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="VD: Thích lập trình, vẽ tranh, giao tiếp, tìm hiểu tự nhiên..."
              />
            </div>

            {/* Strengths */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Điểm mạnh & Kỹ năng vượt trội:</label>
              <textarea
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                rows={2}
                className="w-full p-3 rounded-2xl border border-slate-200 text-xs bg-slate-50 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="VD: Tư duy logic, giải toán nhanh, làm việc nhóm, học ngoại ngữ..."
              />
            </div>

            {/* Favorite Subjects */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Chọn môn học yêu thích nhất (Cấp 2):</label>
              <div className="flex flex-wrap gap-1.5">
                {ALL_SUBJECTS.map((s) => {
                  const isSelected = favoriteSubjects.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleFavSubject(s)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        isSelected
                          ? "bg-amber-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleConsultCareer}
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-extrabold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-200"
            >
              <Sparkles className="w-4 h-4" />
              <span>Phân Tích AI Định Hướng & Lựa Chọn Ngành</span>
            </button>
          </div>
        </div>

        {/* Results Showcase (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {generalAdvice && (
            <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-3xl text-xs text-amber-950 space-y-2 leading-relaxed shadow-sm">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>AI chỉ có tính chất tham khảo</span>
              </div>
              <div className="font-extrabold text-amber-900 flex items-center gap-2 text-sm pt-1">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Bức Tranh Lộ Trình & Khối Thi Phù Hợp Cho Học Sinh:</span>
              </div>
              <p className="font-medium text-slate-800 whitespace-pre-line">{generalAdvice}</p>
              <div className="text-[11px] text-slate-400 font-medium italic mt-2 text-center pt-2 border-t border-amber-200/60">
                AI chỉ mang tính chất tham khảo.
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h4 className="font-extrabold text-slate-900 text-base flex items-center justify-between">
              <span>🎯 Ngành Nghề & Trường THPT Đề Xuất P.Hợp</span>
              <span className="text-xs text-slate-500 font-normal">Cho học sinh Cấp 2</span>
            </h4>

            {careers.map((c, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <h5 className="font-extrabold text-slate-900 text-base">{c.title}</h5>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs self-start sm:self-auto shrink-0">
                    {c.matchPercentage}% Phù hợp
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-medium leading-relaxed">{c.description}</p>

                {/* Subjects needed */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Tổ hợp môn xét tuyển & môn trọng tâm:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {c.subjectsNeeded.map((sub, sIdx) => (
                      <span key={sIdx} className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommended High Schools */}
                {c.recommendedHighSchoolPaths && (
                  <div className="space-y-1">
                    <div className="text-[11px] font-extrabold text-amber-700 uppercase tracking-wider">Môi trường THPT đề xuất:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {c.recommendedHighSchoolPaths.map((path, pIdx) => (
                        <span key={pIdx} className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                          {path}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step Roadmap */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="text-xs font-extrabold text-indigo-800 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" /> Lộ trình học tập từng bước cho học sinh THCS:
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                    {c.roadmap.map((step, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
