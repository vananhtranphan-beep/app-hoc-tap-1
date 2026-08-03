import React, { useState, useEffect } from "react";
import { Video, Search, ExternalLink, Plus, Trash2, Youtube, Play, Sparkles } from "lucide-react";
import { CustomVideoItem } from "../types";

function extractYoutubeId(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      return parsed.searchParams.get("v") || "";
    } else if (parsed.hostname.includes("youtube.com") && parsed.pathname.startsWith("/embed/")) {
      return parsed.pathname.split("/embed/")[1] || "";
    } else if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1);
    }
  } catch {
    // ignore
  }
  return "";
}

export const VideoHubView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Custom Videos stored in LocalStorage
  const [customVideos, setCustomVideos] = useState<CustomVideoItem[]>(() => {
    try {
      const saved = localStorage.getItem("user_custom_videos");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("user_custom_videos", JSON.stringify(customVideos));
  }, [customVideos]);

  // Form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState("");
  const [grade, setGrade] = useState<number>(6);
  const [subjectName, setSubjectName] = useState("Toán");
  const [url, setUrl] = useState("");
  const [instructor, setInstructor] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    window.open(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(
        searchQuery + " bài giảng THCS"
      )}`,
      "_blank"
    );
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    const ytId = extractYoutubeId(url);

    const newVid: CustomVideoItem = {
      id: "vid_" + Date.now(),
      subjectId: subjectName,
      grade: Number(grade),
      title: title.trim(),
      youtubeUrl: url.trim(),
      youtubeId: ytId,
      instructor: instructor.trim() || "Giáo viên",
      addedAt: new Date().toLocaleDateString("vi-VN")
    };

    setCustomVideos((prev) => [newVid, ...prev]);

    // Reset Form
    setTitle("");
    setUrl("");
    setInstructor("");
    setShowAddModal(false);
  };

  const handleDeleteVideo = (id: string) => {
    if (confirm("Bạn có chắc muốn xóa video này khỏi danh sách cá nhân?")) {
      setCustomVideos((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-900 via-rose-950 to-slate-900 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-400/30 flex items-center justify-center text-red-300">
            <Video className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">🎥 Kho Video Bài Giảng YouTube Học Sinh THCS</h2>
            <p className="text-xs text-red-200 mt-0.5">
              Tìm kiếm và tự thêm các link video YouTube bài giảng môn học để lưu trữ và xem lại trực tiếp
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-md shadow-red-500/30 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Link Video YouTube Mới</span>
        </button>
      </div>

      {/* YouTube Search Bar */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nhập từ khóa tìm bài giảng trên YouTube (VD: Phương trình bậc nhất Lớp 8, Phân tích bài văn Lớp 9...)"
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-slate-50 font-medium"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition flex items-center gap-2 cursor-pointer shadow-md shadow-red-200 shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>Tìm trên YouTube</span>
          </button>
        </form>
      </div>

      {/* Custom Videos List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
            <Youtube className="w-5 h-5 text-red-600" />
            <span>Danh Sách Video Bài Giảng Đã Lưu ({customVideos.length})</span>
          </h3>
        </div>

        {customVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customVideos.map((vid) => (
              <div
                key={vid.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition space-y-3 p-4 flex flex-col justify-between"
              >
                <div>
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
                      <span className="font-semibold">Link Video YouTube</span>
                      <Youtube className="w-5 h-5 text-red-600" />
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold text-[10px]">
                          Lớp {vid.grade}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold text-[10px]">
                          Môn {vid.subjectId}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-1.5 leading-snug">
                        {vid.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Nguồn: {vid.instructor}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteVideo(vid.id)}
                      className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition cursor-pointer"
                      title="Xóa video"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <a
                  href={vid.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-800 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
                >
                  <span>Mở xem trên YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <Youtube className="w-12 h-12 text-red-500 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">
              Chưa có video bài giảng nào trong kho của bạn
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Nhấn nút "Thêm Link Video YouTube Mới" để tự thêm bất kì bài giảng hay nào bạn tìm thấy trên YouTube.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-red-200"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Link Video Đầu Tiên</span>
            </button>
          </div>
        )}
      </div>

      {/* MODAL ADD VIDEO */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Youtube className="w-5 h-5 text-red-600" />
                <span>Thêm Link Video Bài Giảng</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddVideo} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Chọn Môn Học: *
                </label>
                <select
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                >
                  <option value="Toán">Toán</option>
                  <option value="Ngữ văn">Ngữ văn</option>
                  <option value="Tiếng Anh">Ngoại ngữ 1 (Tiếng Anh)</option>
                  <option value="KHTN">Khoa học tự nhiên</option>
                  <option value="Lịch sử & Địa lí">Lịch sử và Địa lí</option>
                  <option value="Tin học">Tin học</option>
                  <option value="Giáo dục công dân">Giáo dục công dân</option>
                  <option value="Khác">Môn Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Chọn Khối Lớp: *
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value))}
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
                  placeholder="VD: Phương trình bậc hai môn Toán Lớp 9"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nguồn / Tên Giáo Viên (Tùy chọn):
                </label>
                <input
                  type="text"
                  placeholder="VD: Kênh Học Tốt Cấp 2"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>

              <div className="pt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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
