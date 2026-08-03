import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Video,
  Plus,
  Trash2,
  ExternalLink,
  Book,
  Sparkles,
  FileText,
  Youtube,
  Image as ImageIcon,
  Check,
  FolderOpen
} from "lucide-react";
import { SUBJECTS_DATA } from "../data/subjects";
import { SubjectItem, CustomPdfBook, CustomVideoItem } from "../types";

// Helper to extract YouTube ID
function extractYoutubeId(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      return parsed.searchParams.get("v") || "";
    } else if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1);
    }
  } catch {
    // ignore URL parse errors
  }
  return "";
}

interface SubjectsViewProps {
  userId?: string;
}

export const SubjectsView: React.FC<SubjectsViewProps> = ({ userId }) => {
  const pdfStorageKey = `user_${userId || "default"}_custom_pdfs`;
  const videoStorageKey = `user_${userId || "default"}_custom_videos`;

  const [selectedSubject, setSelectedSubject] = useState<SubjectItem>(SUBJECTS_DATA[0]);
  const [activeTab, setActiveTab] = useState<"pdf" | "video">("pdf");

  // Custom PDFs stored in LocalStorage with initial sample items per subject
  const [customPdfs, setCustomPdfs] = useState<CustomPdfBook[]>(() => {
    try {
      const saved = localStorage.getItem(pdfStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      {
        id: "sample_pdf_literature",
        subjectId: "literature",
        grade: 8,
        title: "Sách giáo khoa Ngữ Văn 8 - Tập 1 (Bộ Kết Nối Tri Thức)",
        coverUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&auto=format&fit=crop&q=80",
        pdfUrl: "https://drive.google.com",
        notes: "Tài liệu đọc chuẩn chương trình GDPT môn Ngữ văn"
      },
      {
        id: "sample_pdf_math",
        subjectId: "math",
        grade: 8,
        title: "Sách giáo khoa Toán 8 - Tập 1 (Đại số & Hình học)",
        coverUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&auto=format&fit=crop&q=80",
        pdfUrl: "https://drive.google.com",
        notes: "Tóm tắt công thức Hằng đẳng thức & Tam giác đồng dạng"
      },
      {
        id: "sample_pdf_english",
        subjectId: "english",
        grade: 8,
        title: "Sách giáo khoa Tiếng Anh 8 Global Success",
        coverUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&auto=format&fit=crop&q=80",
        pdfUrl: "https://drive.google.com",
        notes: "Từ vựng Unit 1-6 & Bài tập Ngữ pháp trọng tâm"
      },
      {
        id: "sample_pdf_khtn",
        subjectId: "khtn",
        grade: 8,
        title: "Sách giáo khoa Khoa học Tự nhiên 8 (Lý - Hóa - Sinh)",
        coverUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&auto=format&fit=crop&q=80",
        pdfUrl: "https://drive.google.com",
        notes: "Kiến thức Phản ứng hóa học & Hệ cơ quan"
      },
      {
        id: "sample_pdf_history_geo",
        subjectId: "history_geo",
        grade: 8,
        title: "Sách giáo khoa Lịch sử & Địa lí 8",
        coverUrl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&auto=format&fit=crop&q=80",
        pdfUrl: "https://drive.google.com",
        notes: "Địa lí tự nhiên Việt Nam & Các cuộc cách mạng"
      },
      {
        id: "sample_pdf_gdcd",
        subjectId: "gdcd",
        grade: 8,
        title: "Sách giáo khoa Giáo dục công dân 8",
        coverUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80",
        pdfUrl: "https://drive.google.com",
        notes: "Kỹ năng sống & Bài học pháp luật tuổi học trò"
      },
      {
        id: "sample_pdf_technology",
        subjectId: "technology",
        grade: 8,
        title: "Sách giáo khoa Công nghệ 8",
        coverUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80",
        pdfUrl: "https://drive.google.com",
        notes: "Vẽ kỹ thuật & Dụng cụ cơ khí cầm tay"
      },
      {
        id: "sample_pdf_informatics",
        subjectId: "informatics",
        grade: 8,
        title: "Sách giáo khoa Tin học 8 (Scratch & Python)",
        coverUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&auto=format&fit=crop&q=80",
        pdfUrl: "https://drive.google.com",
        notes: "Thuật toán & Vòng lặp ngôn ngữ Python"
      }
    ];
  });

  // Custom Videos stored in LocalStorage with initial sample videos per subject
  const [customVideos, setCustomVideos] = useState<CustomVideoItem[]>(() => {
    try {
      const saved = localStorage.getItem(videoStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      {
        id: "sample_vid_literature",
        subjectId: "literature",
        grade: 8,
        title: "Bài giảng Ngữ văn 8: Ôn tập Văn bản Nghị luận & Phân tích tác phẩm",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        youtubeId: "dQw4w9WgXcQ",
        instructor: "Cô Nguyễn Thu Hà - Giáo viên Văn THCS",
        addedAt: "2026-01-15"
      },
      {
        id: "sample_vid_math",
        subjectId: "math",
        grade: 8,
        title: "Hướng dẫn giải 7 Hằng đẳng thức đáng nhớ Toán Lớp 8",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        youtubeId: "dQw4w9WgXcQ",
        instructor: "Thầy Trần Đức Anh - Kênh Toán THCS",
        addedAt: "2026-01-15"
      },
      {
        id: "sample_vid_english",
        subjectId: "english",
        grade: 8,
        title: "Tổng hợp Ngữ pháp Tiếng Anh 8 Trọng tâm Thi Giữa Kỳ",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        youtubeId: "dQw4w9WgXcQ",
        instructor: "Ms. Mai Phương - English THCS",
        addedAt: "2026-01-15"
      },
      {
        id: "sample_vid_khtn",
        subjectId: "khtn",
        grade: 8,
        title: "Khoa học Tự nhiên 8: Luyện giải bài tập Hóa học Phản ứng",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        youtubeId: "dQw4w9WgXcQ",
        instructor: "Thầy Lê Minh - KHTN THCS",
        addedAt: "2026-01-15"
      },
      {
        id: "sample_vid_history_geo",
        subjectId: "history_geo",
        grade: 8,
        title: "Lịch sử & Địa lí 8: Tóm tắt Địa lí Tự nhiên Việt Nam",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        youtubeId: "dQw4w9WgXcQ",
        instructor: "Cô Hoàng Lan - Lịch Sử & Địa Lí",
        addedAt: "2026-01-15"
      },
      {
        id: "sample_vid_gdcd",
        subjectId: "gdcd",
        grade: 8,
        title: "Giáo dục Công dân 8: Kỹ năng quản lý thời gian & Căng thẳng",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        youtubeId: "dQw4w9WgXcQ",
        instructor: "Thầy Vũ Hoàng - Kỹ năng sống",
        addedAt: "2026-01-15"
      },
      {
        id: "sample_vid_technology",
        subjectId: "technology",
        grade: 8,
        title: "Công nghệ 8: Hướng dẫn đọc Bản vẽ kỹ thuật cơ bản",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        youtubeId: "dQw4w9WgXcQ",
        instructor: "Thầy Đỗ Minh - Công nghệ THCS",
        addedAt: "2026-01-15"
      },
      {
        id: "sample_vid_informatics",
        subjectId: "informatics",
        grade: 8,
        title: "Tin học 8: Hướng dẫn viết Chương trình Python đầu tiên",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        youtubeId: "dQw4w9WgXcQ",
        instructor: "Cô Phạm Thanh - Lập trình THCS",
        addedAt: "2026-01-15"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem(pdfStorageKey, JSON.stringify(customPdfs));
  }, [customPdfs, pdfStorageKey]);

  useEffect(() => {
    localStorage.setItem(videoStorageKey, JSON.stringify(customVideos));
  }, [customVideos, videoStorageKey]);

  // Form states for adding PDF
  const [showAddPdfModal, setShowAddPdfModal] = useState(false);
  const [pdfTitle, setPdfTitle] = useState("");
  const [pdfGrade, setPdfGrade] = useState<number>(6);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfCoverUrl, setPdfCoverUrl] = useState("");
  const [pdfNotes, setPdfNotes] = useState("");

  // Form states for adding Video
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoGrade, setVideoGrade] = useState<number>(6);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoInstructor, setVideoInstructor] = useState("");

  // Active filter by grade inside selected subject (All, 6, 7, 8, 9)
  const [gradeFilter, setGradeFilter] = useState<number | "ALL">("ALL");

  const handleAddPdf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfTitle.trim() || !pdfUrl.trim()) return;

    // Default covers based on subject
    const defaultCover =
      pdfCoverUrl.trim() ||
      `https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80`;

    const newPdf: CustomPdfBook = {
      id: "pdf_" + Date.now(),
      subjectId: selectedSubject.id,
      title: pdfTitle.trim(),
      grade: Number(pdfGrade),
      pdfUrl: pdfUrl.trim(),
      coverUrl: defaultCover,
      notes: pdfNotes.trim()
    };

    setCustomPdfs((prev) => [newPdf, ...prev]);

    // Reset Form
    setPdfTitle("");
    setPdfUrl("");
    setPdfCoverUrl("");
    setPdfNotes("");
    setShowAddPdfModal(false);
  };

  const handleDeletePdf = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa file PDF này không?")) {
      setCustomPdfs((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim() || !videoUrl.trim()) return;

    const ytId = extractYoutubeId(videoUrl);

    const newVid: CustomVideoItem = {
      id: "vid_" + Date.now(),
      subjectId: selectedSubject.id,
      grade: Number(videoGrade),
      title: videoTitle.trim(),
      youtubeUrl: videoUrl.trim(),
      youtubeId: ytId,
      instructor: videoInstructor.trim() || "Giáo viên",
      addedAt: new Date().toLocaleDateString("vi-VN")
    };

    setCustomVideos((prev) => [newVid, ...prev]);

    // Reset Form
    setVideoTitle("");
    setVideoUrl("");
    setVideoInstructor("");
    setShowAddVideoModal(false);
  };

  const handleDeleteVideo = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa video này không?")) {
      setCustomVideos((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Filter items for currently selected subject
  const currentSubjectPdfs = customPdfs.filter((pdf) => {
    if (pdf.subjectId && pdf.subjectId !== selectedSubject.id) return false;
    if (gradeFilter !== "ALL" && pdf.grade !== gradeFilter) return false;
    return true;
  });

  const currentSubjectVideos = customVideos.filter((vid) => {
    if (vid.subjectId && vid.subjectId !== selectedSubject.id) return false;
    if (gradeFilter !== "ALL" && vid.grade !== gradeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5" /> Thư viện Tài liệu & Sách PDF THCS
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Môn Học & Sách Giáo Khoa PDF Chuẩn THCS
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Chỉ cần chọn môn học để xem toàn bộ sách PDF và video từ Lớp 6 đến Lớp 9. Bạn có thể tự lưu file PDF và link YouTube trực tiếp!
          </p>
        </div>
      </div>

      {/* 12 SUBJECT BUTTONS GRID - CLICK SUBJECT DIRECTLY */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {SUBJECTS_DATA.map((subject) => {
          const isSelected = selectedSubject.id === subject.id;
          return (
            <button
              key={subject.id}
              onClick={() => {
                setSelectedSubject(subject);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-28 relative overflow-hidden ${
                isSelected
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/30 scale-[1.02]"
                  : "bg-white text-slate-800 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50"
              }`}
            >
              <div className="flex items-center justify-between z-10">
                <span className={`px-2.5 py-1 rounded-xl text-xs font-bold ${isSelected ? "bg-white/20 text-white" : subject.bgLight}`}>
                  {subject.name.substring(0, 2)}
                </span>
                {isSelected && <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />}
              </div>
              <div className="z-10">
                <div className="font-extrabold text-sm leading-snug truncate">{subject.name}</div>
                <div className={`text-[10px] font-medium ${isSelected ? "text-indigo-200" : "text-slate-500"}`}>
                  Lớp 6, 7, 8, 9
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* SELECTED SUBJECT WORKSPACE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Workspace Top Bar */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-2 border border-indigo-500/30">
              <span>Môn: {selectedSubject.name}</span>
              <span>•</span>
              <span>Toàn bộ Lớp 6 - Lớp 9</span>
            </div>
            <h3 className="text-2xl font-extrabold">{selectedSubject.name}</h3>
            <p className="text-xs text-slate-300 mt-1">{selectedSubject.description}</p>
          </div>

          {/* Sub-Tabs: PDF vs Video */}
          <div className="flex bg-slate-800/80 p-1.5 rounded-xl border border-slate-700 self-start lg:self-auto">
            <button
              onClick={() => setActiveTab("pdf")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === "pdf"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>📚 Sách & File PDF ({currentSubjectPdfs.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("video")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === "video"
                  ? "bg-red-600 text-white shadow-md"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Video className="w-4 h-4" />
              <span>🎥 Video Bài Giảng YouTube ({currentSubjectVideos.length})</span>
            </button>
          </div>
        </div>

        {/* Grade Filter Bar & Add Link Action Buttons inside Subject */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Lọc theo Khối Lớp:</span>
            <div className="flex items-center gap-1">
              {(["ALL", 6, 7, 8, 9] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGradeFilter(g)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    gradeFilter === g
                      ? "bg-slate-800 text-white shadow-sm"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {g === "ALL" ? "Tất Cả Khối Lớp" : `Lớp ${g}`}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons for adding PDF or Video link */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab("pdf");
                setShowAddPdfModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-sm shadow-indigo-200"
            >
              <Plus className="w-4 h-4" />
              <span>+ Thêm Link PDF ({selectedSubject.name})</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("video");
                setShowAddVideoModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-sm shadow-red-200"
            >
              <Plus className="w-4 h-4" />
              <span>+ Thêm Link Video ({selectedSubject.name})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: SÁCH & FILE PDF */}
        {activeTab === "pdf" && (
          <div className="p-6 space-y-6">
            {currentSubjectPdfs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentSubjectPdfs.map((pdf) => (
                  <div
                    key={pdf.id}
                    className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition bg-slate-50 flex flex-col justify-between group"
                  >
                    <div className="relative h-48 bg-slate-800 overflow-hidden">
                      <img
                        src={pdf.coverUrl}
                        alt={pdf.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-3">
                        <div className="flex justify-between items-start">
                          <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                            Khối Lớp {pdf.grade}
                          </span>
                          <button
                            onClick={() => handleDeletePdf(pdf.id)}
                            className="px-2 py-1 rounded-lg bg-red-600/90 hover:bg-red-600 text-white text-[11px] font-bold transition cursor-pointer flex items-center gap-1 shadow-md"
                            title="Xóa link PDF này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Xóa Link</span>
                          </button>
                        </div>
                        <span className="text-[11px] text-amber-300 font-bold">
                          {selectedSubject.name}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2">
                          {pdf.title}
                        </h4>
                        {pdf.notes && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 italic">
                            "{pdf.notes}"
                          </p>
                        )}
                      </div>

                      <div className="pt-2 flex items-center gap-2">
                        <a
                          href={pdf.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm shadow-indigo-200"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Mở Link PDF</span>
                        </a>
                        <button
                          onClick={() => handleDeletePdf(pdf.id)}
                          className="py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                          title="Xóa link PDF này"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Xóa</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <FolderOpen className="w-12 h-12 text-indigo-400 mx-auto" />
                <h4 className="text-base font-bold text-slate-800">
                  Chưa có link PDF nào cho môn {selectedSubject.name}
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Bạn có thể bấm nút bên dưới để dán link Google Drive hoặc link PDF sách giáo khoa cho môn {selectedSubject.name}.
                </p>
                <button
                  onClick={() => setShowAddPdfModal(true)}
                  className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-indigo-200"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Thêm Link PDF Đầu Tiên</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: VIDEO BÀI GIẢNG YOUTUBE */}
        {activeTab === "video" && (
          <div className="p-6 space-y-6">
            {currentSubjectVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentSubjectVideos.map((vid) => (
                  <div
                    key={vid.id}
                    className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 shadow-sm space-y-3 p-4 flex flex-col justify-between"
                  >
                    <div>
                      {/* Embed Player if valid Youtube ID */}
                      {vid.youtubeId ? (
                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-black mb-3">
                          <iframe
                            src={`https://www.youtube.com/embed/${vid.youtubeId}`}
                            title={vid.title}
                            className="w-full h-full border-0"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center justify-between mb-3">
                          <span className="font-semibold">Link YouTube tùy chỉnh</span>
                          <Youtube className="w-5 h-5 text-red-600" />
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 font-bold text-[10px]">
                            Khối Lớp {vid.grade}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm mt-1">{vid.title}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Giáo viên / Nguồn: {vid.instructor}
                          </p>
                        </div>

                        <button
                          onClick={() => handleDeleteVideo(vid.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0"
                          title="Xóa link video này"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Xóa Link</span>
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <a
                        href={vid.youtubeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Xem trực tiếp trên YouTube</span>
                      </a>
                      <button
                        onClick={() => handleDeleteVideo(vid.id)}
                        className="py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                        title="Xóa link video này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <Youtube className="w-12 h-12 text-red-500 mx-auto" />
                <h4 className="text-base font-bold text-slate-800">
                  Chưa có link video bài giảng nào cho môn {selectedSubject.name}
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Bạn có thể tìm kiếm video bài giảng hay trên YouTube rồi dán link vào đây để xem lại bất cứ lúc nào!
                </p>
                <button
                  onClick={() => setShowAddVideoModal(true)}
                  className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-red-200"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Dán Link Video YouTube Đầu Tiên</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL: THÊM FILE PDF / LINK SÁCH */}
      {showAddPdfModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span>Thêm Sách / File PDF Học Tập</span>
              </h3>
              <button
                onClick={() => setShowAddPdfModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPdf} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Môn Học Hiện Tại:
                </label>
                <input
                  type="text"
                  disabled
                  value={selectedSubject.name}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Chọn Khối Lớp: *
                </label>
                <select
                  value={pdfGrade}
                  onChange={(e) => setPdfGrade(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                >
                  <option value={6}>Lớp 6</option>
                  <option value={7}>Lớp 7</option>
                  <option value={8}>Lớp 8</option>
                  <option value={9}>Lớp 9</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên Sách / Tên File PDF: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Sách Toán 6 Tập 1 - Kết Nối Tri Thức"
                  value={pdfTitle}
                  onChange={(e) => setPdfTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Link Trực Tiếp File PDF / Google Drive: *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://... file.pdf hoặc link chia sẻ"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Link Ảnh Bìa Sách (Tùy chọn):
                </label>
                <input
                  type="url"
                  placeholder="https://... image.jpg (Để trống sẽ tự dùng ảnh mặc định)"
                  value={pdfCoverUrl}
                  onChange={(e) => setPdfCoverUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ghi Chú Cho Sách (Tùy chọn):
                </label>
                <input
                  type="text"
                  placeholder="VD: Bao gồm đáp án cuối sách, đọc kĩ chương 2"
                  value={pdfNotes}
                  onChange={(e) => setPdfNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>

              <div className="pt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddPdfModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-indigo-200"
                >
                  Lưu Sách PDF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: THÊM LINK VIDEO YOUTUBE */}
      {showAddVideoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Youtube className="w-5 h-5 text-red-600" />
                <span>Thêm Link Video Bài Giảng YouTube</span>
              </h3>
              <button
                onClick={() => setShowAddVideoModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddVideo} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Môn Học Hiện Tại:
                </label>
                <input
                  type="text"
                  disabled
                  value={selectedSubject.name}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Chọn Khối Lớp: *
                </label>
                <select
                  value={videoGrade}
                  onChange={(e) => setVideoGrade(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                >
                  <option value={6}>Lớp 6</option>
                  <option value={7}>Lớp 7</option>
                  <option value={8}>Lớp 8</option>
                  <option value={9}>Lớp 9</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tiêu Đề Video Bài Giảng: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Hướng dẫn giải phương trình Toán lớp 8"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Link YouTube Video: *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên Giáo Viên / Kênh YouTube (Tùy chọn):
                </label>
                <input
                  type="text"
                  placeholder="VD: Thầy Nguyễn Văn A - Gia Sư Toán"
                  value={videoInstructor}
                  onChange={(e) => setVideoInstructor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>

              <div className="pt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddVideoModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-red-200"
                >
                  Lưu Link Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
