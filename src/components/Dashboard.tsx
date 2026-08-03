import React, { useState } from "react";
import {
  BookOpen,
  Bot,
  Calendar,
  TrendingUp,
  Smile,
  Target,
  Video,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Zap,
  BookMarked,
  Layers
} from "lucide-react";
import { NavSection } from "../types";

interface DashboardProps {
  onNavigate: (section: NavSection) => void;
  streakCount: number;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  streakCount,
}) => {
  const [quickQuestion, setQuickQuestion] = useState("");

  const menuCards = [
    {
      id: "subjects" as NavSection,
      title: "📚 Môn Học THCS",
      subtitle: "Toán, Ngữ Văn, Tiếng Anh, KHTN (6-9), Sử Địa, Tin Học...",
      badge: "Sách & PDF 6-9",
      gradient: "from-blue-600 to-cyan-600",
      bgSoft: "bg-blue-50 hover:bg-blue-100/80 border-blue-200",
      textColor: "text-blue-900",
      icon: BookOpen,
      iconColor: "text-blue-600",
    },
    {
      id: "mood" as NavSection,
      title: "😊 Theo Dõi Tâm Lý",
      subtitle: "Ghi nhật ký cảm xúc theo mốc thời gian, giảm căng thẳng & tập thở AI",
      badge: "Ưu Tiên #1 ⭐",
      gradient: "from-rose-500 to-red-600",
      bgSoft: "bg-rose-50 hover:bg-rose-100/80 border-rose-300 ring-2 ring-rose-300/50",
      textColor: "text-rose-900",
      icon: Smile,
      iconColor: "text-rose-600",
    },
    {
      id: "ai_tutor" as NavSection,
      title: "🤖 AI Tutor THCS",
      subtitle: "Gia sư AI giải bài tập Cấp 2 từng bước, kiên nhẫn 24/7",
      badge: "AI Powered",
      gradient: "from-indigo-600 to-purple-600",
      bgSoft: "bg-indigo-50 hover:bg-indigo-100/80 border-indigo-200",
      textColor: "text-indigo-900",
      icon: Bot,
      iconColor: "text-indigo-600",
    },
    {
      id: "planner" as NavSection,
      title: "📅 Lập Kế Hoạch",
      subtitle: "Thời khóa biểu cá nhân hóa & mục tiêu ôn thi Lớp 10",
      badge: "Lịch Học AI",
      gradient: "from-violet-600 to-pink-600",
      bgSoft: "bg-violet-50 hover:bg-violet-100/80 border-violet-200",
      textColor: "text-violet-900",
      icon: Calendar,
      iconColor: "text-violet-600",
    },
    {
      id: "progress" as NavSection,
      title: "📈 Theo Dõi Tiến Độ",
      subtitle: "Thống kê ngày vào app liên tục & bảng điểm 8 môn THCS",
      badge: "Thống Kê",
      gradient: "from-cyan-600 to-teal-600",
      bgSoft: "bg-cyan-50 hover:bg-cyan-100/80 border-cyan-200",
      textColor: "text-cyan-900",
      icon: TrendingUp,
      iconColor: "text-cyan-600",
    },
    {
      id: "career" as NavSection,
      title: "🎯 Hướng Nghiệp THCS",
      subtitle: "Tư vấn chọn trường THPT, định hướng khối thi & ngành nghề",
      badge: "Chọn Trường 10",
      gradient: "from-amber-600 to-orange-600",
      bgSoft: "bg-amber-50 hover:bg-amber-100/80 border-amber-200",
      textColor: "text-amber-900",
      icon: Target,
      iconColor: "text-amber-600",
    },
    {
      id: "videos" as NavSection,
      title: "🎥 Video Bài Giảng",
      subtitle: "Kho video thí nghiệm KHTN & Toán Văn THCS trên YouTube",
      badge: "Kho Video",
      gradient: "from-red-600 to-rose-600",
      bgSoft: "bg-red-50 hover:bg-red-100/80 border-red-200",
      textColor: "text-red-900",
      icon: Video,
      iconColor: "text-red-600",
    },
  ];

  const handleQuickAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickQuestion.trim()) {
      onNavigate("ai_tutor");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute top-3 right-4 z-20 text-[10px] font-mono text-slate-400/50 select-none tracking-widest pointer-events-none bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
          VAAH1
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Study Hub - Trợ Lý Học Tập Toàn Diện</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Chào mừng bạn đến với <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">AI Study Hub</span> 🚀
          </h2>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Hệ thống sinh thái học tập kết nối AI dành cho học sinh: Đọc sách PDF giáo khoa, giải bài tập với AI Tutor, lập thời khóa biểu, theo dõi tâm lý và hướng nghiệp tương lai.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate("ai_tutor")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>Hỏi AI Tutor ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Feature Menu Grid ("Những Cục Menu Trực Quan") */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>🏠 Danh Mục Chức Năng Main Menu</span>
            </h3>
            <p className="text-xs text-slate-500">
              Nhấn vào các mục menu bên dưới để truy cập nhanh chức năng
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
            9 Chức Năng Chính
          </span>
        </div>

        {/* Grid of Menu Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {menuCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onNavigate(card.id)}
                className={`group relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${card.bgSoft}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-xl bg-white shadow-sm border border-slate-100 group-hover:scale-110 transition-transform ${card.iconColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/90 border border-slate-200 ${card.textColor}`}>
                    {card.badge}
                  </span>
                </div>

                <h4 className={`text-lg font-bold mb-1 group-hover:text-indigo-600 transition-colors ${card.textColor}`}>
                  {card.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {card.subtitle}
                </p>

                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
                  <span>Mở giao diện</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick AI Search & Learning Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick AI Assistant Chat Widget */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Hỏi AI Tutor Nhanh</h4>
              <p className="text-xs text-slate-500">Nhập bài toán, bài văn hoặc câu hỏi cần gia sư AI hỗ trợ</p>
            </div>
          </div>

          <form onSubmit={handleQuickAsk} className="flex gap-2">
            <input
              type="text"
              value={quickQuestion}
              onChange={(e) => setQuickQuestion(e.target.value)}
              placeholder="VD: Cho em biết công thức tính phương trình bậc 2 hoặc Phân tích tác phẩm Chí Phèo..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Hỏi AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-2 text-xs text-slate-600 pt-1">
            <span className="font-semibold text-slate-400">Gợi ý câu hỏi:</span>
            <button
              onClick={() => {
                setQuickQuestion("Giải thích định luật bảo toàn khối lượng môn Hóa lớp 8");
                onNavigate("ai_tutor");
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer"
            >
              💡 Định luật bảo toàn khối lượng
            </button>
            <button
              onClick={() => {
                setQuickQuestion("Cách phân biệt Thì Present Simple và Present Continuous");
                onNavigate("ai_tutor");
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer"
            >
              🇬🇧 Phân biệt Thì Tiếng Anh
            </button>
          </div>
        </div>

        {/* Daily Progress & Continuous App Entry Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Zap className="w-5 h-5 fill-amber-400 animate-pulse" />
              <span>Thống Kê Ngày Vào App Liên Tục</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center space-y-1">
            <div className="text-3xl font-extrabold text-amber-400">{streakCount} Ngày</div>
            <div className="text-xs font-bold text-slate-200">Đã đăng nhập vào ứng dụng liên tục</div>
            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
              Hệ thống điểm danh tự động hàng ngày. Nếu nghỉ bất kỳ ngày nào không vào app, chuỗi sẽ tự động xóa bỏ tính lại từ 1.
            </p>
          </div>
        </div>
      </div>

      {/* Small watermark sign signature */}
      <div className="text-center pt-6 pb-2 text-[10px] font-mono text-slate-400/40 select-none tracking-widest">
        VAAH1
      </div>
    </div>
  );
};
