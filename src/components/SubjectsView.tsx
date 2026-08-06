import React, { useState, useEffect } from "react";
import { BookOpen, Download, ExternalLink, FileText, Trash2, Plus, Sparkles } from "lucide-react";

// Sách do mày (giáo viên/admin) add sẵn - Mọi tài khoản học sinh đều thấy chung
const GLOBAL_DEFAULT_BOOKS: { [key: string]: { id: string; name: string; url: string }[] } = {
  "Ngữ văn": [
    { id: "g-nv-1", name: "Sách Ngữ Văn Chuẩn (Tập 1)", url: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID_1" },
  ],
  "Toán": [
    { id: "g-toan-1", name: "Sách Toán Học Cơ Bản (Tập 1)", url: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID_2" },
  ],
  "Tiếng Anh": [],
  "Khoa Học Tự Nhiên": [],
  "Lịch Sử & Địa Lý": [],
  "Giáo Dục Công Dân": [],
  "Tin Học": [],
  "Công Nghệ": [],
};

export const SubjectsView: React.FC<{ userId?: string }> = ({ userId }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>("Ngữ văn");

  // Key lưu riêng theo từng tài khoản học sinh
  const userBooksKey = `user_${userId || "default"}_custom_books`;
  
  const [customBooks, setCustomBooks] = useState<{ [subject: string]: { id: string; name: string; url: string }[] }>(() => {
    const saved = localStorage.getItem(userBooksKey);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {};
  });

  const [newBookName, setNewBookName] = useState("");
  const [newBookUrl, setNewBookUrl] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    localStorage.setItem(userBooksKey, JSON.stringify(customBooks));
  }, [customBooks, userBooksKey]);

  // Gộp sách hệ thống (chung) và sách học sinh tự add riêng cho môn đang chọn
  const globalList = GLOBAL_DEFAULT_BOOKS[selectedSubject] || [];
  const personalList = customBooks[selectedSubject] || [];
  const currentBooks = [...globalList, ...personalList];

  const handleAddCustomBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookName.trim() || !newBookUrl.trim()) return;

    const newBook = {
      id: "custom-" + Date.now(),
      name: newBookName.trim(),
      url: newBookUrl.trim(),
    };

    const updatedSubjectBooks = [...personalList, newBook];
    const updatedAll = { ...customBooks, [selectedSubject]: updatedSubjectBooks };

    setCustomBooks(updatedAll);
    setNewBookName("");
    setNewBookUrl("");
    setShowAddForm(false);
  };

  const handleDeleteCustomBook = (id: string) => {
    const updatedSubjectBooks = personalList.filter((b) => b.id !== id);
    const updatedAll = { ...customBooks, [selectedSubject]: updatedSubjectBooks };
    setCustomBooks(updatedAll);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-600 shadow-inner">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold">Thư Viện Sách & Tài Liệu Môn Học</h2>
            <p className="text-xs text-indigo-200">Chọn môn học để xem tài liệu. Học sinh có thể tự thêm và quản lý link riêng.</p>
          </div>
        </div>

        {/* Danh sách các nút chọn môn */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 pt-2">
          {Object.keys(GLOBAL_DEFAULT_BOOKS).map((subj) => {
            const isActive = selectedSubject === subj;
            return (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`p-2.5 rounded-2xl border text-center transition cursor-pointer font-bold text-xs ${
                  isActive 
                    ? "bg-indigo-600 text-white border-indigo-500 shadow-md scale-105" 
                    : "bg-white/10 text-indigo-100 border-white/20 hover:bg-white/20"
                }`}
              >
                <span>{subj}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Môn: {selectedSubject}</h3>
            <p className="text-xs text-slate-500">Danh sách tài liệu học tập của môn này</p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? "Đóng form" : "➕ Thêm tài liệu của riêng tôi"}</span>
          </button>
        </div>

        {/* Form học sinh tự add link riêng */}
        {showAddForm && (
          <form onSubmit={handleAddCustomBook} className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-3">
            <h4 className="font-bold text-xs text-indigo-900">Thêm link tài liệu / sách mới cho môn {selectedSubject} (Chỉ tài khoản của bạn nhìn thấy):</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Tên tài liệu (Ví dụ: Sách nâng cao Toán lớp 8)..."
                value={newBookName}
                onChange={(e) => setNewBookName(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs focus:outline-none"
                required
              />
              <input
                type="url"
                placeholder="Dán link Google Drive hoặc link PDF vào đây..."
                value={newBookUrl}
                onChange={(e) => setNewBookUrl(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs focus:outline-none"
                required
              />
            </div>
            <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer">
              Lưu tài liệu cá nhân
            </button>
          </form>
        )}

        {/* Lưới hiển thị danh sách sách */}
        {currentBooks.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            Chưa có tài liệu nào cho môn này. Hãy bấm nút thêm ở trên để bổ sung!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {currentBooks.map((book) => {
              const isCustom = book.id.startsWith("custom-");
              return (
                <div key={book.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${isCustom ? "bg-amber-100 text-amber-800" : "bg-indigo-100 text-indigo-800"}`}>
                        {isCustom ? "Tài liệu cá nhân" : "Tài liệu hệ thống"}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-slate-800 text-sm mt-1">{book.name}</h4>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                    <a
                      href={book.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Mở / Tải file</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    {/* Chỉ cho phép xóa tài liệu do chính học sinh đó tự add */}
                    {isCustom && (
                      <button
                        onClick={() => handleDeleteCustomBook(book.id)}
                        className="p-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 transition cursor-pointer"
                        title="Xóa tài liệu này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
