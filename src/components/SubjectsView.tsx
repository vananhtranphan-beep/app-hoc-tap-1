import React, { useState, useEffect } from "react";
import { BookOpen, ExternalLink, FileText, Trash2, Plus } from "lucide-react";

// 8 cuốn sách chuẩn cho các môn chính (Admin tranphanvananh add sẵn, mọi người đều thấy)
const GLOBAL_DEFAULT_BOOKS: { [key: string]: { id: string; name: string; url: string }[] } = {
  "Ngữ văn": [
    { id: "nv-6-1", name: "Ngữ Văn lớp 6 - Tập 1", url: "https://drive.google.com/uc?export=download&id=SAMPLE_ID" },
    { id: "nv-6-2", name: "Ngữ Văn lớp 6 - Tập 2", url: "https://drive.google.com/uc?export=download&id=SAMPLE_ID" },
    { id: "nv-7-1", name: "Ngữ Văn lớp 7 - Tập 1", url: "https://drive.google.com/uc?export=download&id=SAMPLE_ID" },
    { id: "nv-7-2", name: "Ngữ Văn lớp 7 - Tập 2", url: "https://drive.google.com/uc?export=download&id=SAMPLE_ID" },
    { id: "nv-8-1", name: "Ngữ Văn lớp 8 - Tập 1", url: "https://drive.google.com/uc?export=download&id=SAMPLE_ID" },
    { id: "nv-8-2", name: "Ngữ Văn lớp 8 - Tập 2", url: "https://drive.google.com/uc?export=download&id=SAMPLE_ID" },
    { id: "nv-9-1", name: "Ngữ Văn lớp 9 - Tập 1", url: "https://drive.google.com/uc?export=download&id=SAMPLE_ID" },
    { id: "nv-9-2", name: "Ngữ Văn lớp 9 - Tập 2", url: "https://drive.google.com/uc?export=download&id=SAMPLE_ID" },
  ],
  "Toán": [
    { id: "toan-6-1", name: "Toán lớp 6 - Tập 1", url: "https://drive.google.com/uc?export=download&id=SAMPLE_ID" },
    { id: "toan-6-2", name: "Toán lớp 6 - Tập 2", url: "https://drive.google.com/uc?export=download&id=SAMPLE_ID" },
    { id: "toan-7-1", name: "Toán lớp 7 - Tập 1", url: "https://drive.google.com/uc?export=download&id=SAMPLE_ID" },
    { id: "toan-7-2", name: "Toán lớp 7 - Tập 2", url: "https://drive.google.com/uc?export=download&id=SAMPLE_ID" },
    { id: "toan-8-1", name: "Toán lớp 8 - Tập 1", url: "https://drive.google.com/uc?export=download&id=SAMPLE_ID" },
    { id: "toan-8-2", name: "Toán lớp 8 - Tập 2", url: "https://drive.google.com/uc?export=download&id=SAMPLE_ID" },
    { id: "toan-9-1", name: "Toán lớp 9 - Tập 1", url: "https://drive.google.com/uc?export=download&id=SAMPLE_ID" },
    { id: "toan-9-2", name: "Toán lớp 9 - Tập 2", url: "https://drive.google.com/uc?export=download&id=SAMPLE_ID" },
  ],
  "Tiếng Anh": [],
  "Khoa Học Tự Nhiên": [],
  "Lịch Sử & Địa Lý": [],
  "Giáo Dục Công Dân": [],
  "Tin Học": [],
  "Công Nghệ": [],
};

const ADMIN_ID = "tranphanvananh";

export const SubjectsView: React.FC<{ userId?: string }> = ({ userId }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>("Ngữ văn");
  const isAdmin = userId?.toLowerCase() === ADMIN_ID;

  // Key lưu tài liệu chung của Admin trên toàn hệ thống
  const globalStorageKey = "system_admin_global_books";
  const [globalBooks, setGlobalBooks] = useState<{ [subject: string]: { id: string; name: string; url: string }[] }>(() => {
    const saved = localStorage.getItem(globalStorageKey);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }import React, { useState, useEffect } from "react";
import { BookOpen, ExternalLink, FileText, Trash2, Plus, Image as ImageIcon } from "lucide-react";

// 8 cuốn sách mặc định ban đầu cho hệ thống
const INITIAL_SYSTEM_BOOKS: { [key: string]: { id: string; name: string; url: string; imageUrl: string }[] } = {
  "Ngữ văn": [
    { id: "nv-6-1", name: "Ngữ Văn lớp 6 - Tập 1", url: "#", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-6-2", name: "Ngữ Văn lớp 6 - Tập 2", url: "#", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-7-1", name: "Ngữ Văn lớp 7 - Tập 1", url: "#", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-7-2", name: "Ngữ Văn lớp 7 - Tập 2", url: "#", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-8-1", name: "Ngữ Văn lớp 8 - Tập 1", url: "#", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-8-2", name: "Ngữ Văn lớp 8 - Tập 2", url: "#", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-9-1", name: "Ngữ Văn lớp 9 - Tập 1", url: "#", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-9-2", name: "Ngữ Văn lớp 9 - Tập 2", url: "#", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" },
  ],
  "Toán": [
    { id: "toan-6-1", name: "Toán lớp 6 - Tập 1", url: "#", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-6-2", name: "Toán lớp 6 - Tập 2", url: "#", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-7-1", name: "Toán lớp 7 - Tập 1", url: "#", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-7-2", name: "Toán lớp 7 - Tập 2", url: "#", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-8-1", name: "Toán lớp 8 - Tập 1", url: "#", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-8-2", name: "Toán lớp 8 - Tập 2", url: "#", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-9-1", name: "Toán lớp 9 - Tập 1", url: "#", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-9-2", name: "Toán lớp 9 - Tập 2", url: "#", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80" },
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

  // Nhận diện chuẩn xác tài khoản Admin của mày
  const cleanId = (userId || "").toLowerCase().trim();
  const isAdmin = cleanId === "tranphanvananh";

  // Kho chứa sách toàn hệ thống (Dùng chung cho mọi tài khoản)
  const globalStorageKey = "system_admin_global_books_v3";
  const [globalBooks, setGlobalBooks] = useState<{ [subject: string]: { id: string; name: string; url: string; imageUrl: string }[] }>(() => {
    const saved = localStorage.getItem(globalStorageKey);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_SYSTEM_BOOKS;
  });

  // Kho chứa tài liệu cá nhân (Chỉ riêng tài khoản đang đăng nhập thấy)
  const personalStorageKey = `user_${cleanId || "default"}_personal_books_v3`;
  const [personalBooks, setPersonalBooks] = useState<{ [subject: string]: { id: string; name: string; url: string; imageUrl: string }[] }>(() => {
    const saved = localStorage.getItem(personalStorageKey);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {};
  });

  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    localStorage.setItem(globalStorageKey, JSON.stringify(globalBooks));
  }, [globalBooks]);

  useEffect(() => {
    localStorage.setItem(personalStorageKey, JSON.stringify(personalBooks));
  }, [personalBooks, personalStorageKey]);

  const currentGlobal = globalBooks[selectedSubject] || [];
  const currentPersonal = personalBooks[selectedSubject] || [];
  const displayList = [...currentGlobal, ...currentPersonal];

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUrl.trim()) return;

    const newItem = {
      id: "item-" + Date.now(),
      name: newName.trim(),
      url: newUrl.trim(),
      imageUrl: newImageUrl.trim() || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80",
    };

    if (isAdmin) {
      // Admin add -> Đẩy thẳng vào hệ thống chung, mọi học sinh đều thấy
      const updated = [...currentGlobal, newItem];
      setGlobalBooks({ ...globalBooks, [selectedSubject]: updated });
    } else {
      // Học sinh thường add -> Chỉ lưu vào kho cá nhân của học sinh đó
      const updated = [...currentPersonal, newItem];
      setPersonalBooks({ ...personalBooks, [selectedSubject]: updated });
    }

    setNewName("");
    setNewUrl("");
    setNewImageUrl("");
    setShowAddForm(false);
  };

  const handleDeleteBook = (id: string, isGlobalItem: boolean) => {
    if (isGlobalItem) {
      if (!isAdmin) {
        alert("Chỉ tài khoản Admin (tranphanvananh) mới có quyền xóa tài liệu hệ thống!");
        return;
      }
      const updated = currentGlobal.filter((b) => b.id !== id);
      setGlobalBooks({ ...globalBooks, [selectedSubject]: updated });
    } else {
      const updated = currentPersonal.filter((b) => b.id !== id);
      setPersonalBooks({ ...personalBooks, [selectedSubject]: updated });
    }
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
            <p className="text-xs text-indigo-200">
              {isAdmin ? "⭐ Xin chào Admin tranphanvananh: Mọi tài liệu bạn add sẽ hiển thị cho toàn bộ học sinh!" : "📚 Kho tài liệu chung của nhà trường & Tài liệu cá nhân của bạn."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 pt-2">
          {Object.keys(INITIAL_SYSTEM_BOOKS).map((subj) => {
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
            <p className="text-xs text-slate-500">Tổng cộng {displayList.length} tài liệu hiển thị</p>
          </div>

          {/* Nút mở form thêm sách hiển thị rõ ràng cho cả Admin và Học sinh */}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? "Đóng form" : isAdmin ? "➕ Thêm sách hệ thống (Cho toàn trường)" : "➕ Thêm tài liệu cá nhân"}</span>
          </button>
        </div>

        {/* Form nhập liệu add sách */}
        {showAddForm && (
          <form onSubmit={handleAddBook} className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-3">
            <h4 className="font-bold text-xs text-indigo-900">
              {isAdmin ? "Thêm tài liệu vào hệ thống chung (Tất cả học sinh đăng nhập đều sẽ thấy):" : "Thêm tài liệu riêng tư (Chỉ tài khoản của bạn thấy):"}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Tên tài liệu / Tên sách..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs focus:outline-none"
                required
              />
              <input
                type="url"
                placeholder="Dán link Google Drive hoặc file PDF..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs focus:outline-none"
                required
              />
              <input
                type="url"
                placeholder="Link ảnh minh họa (tùy chọn)..."
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs focus:outline-none"
              />
            </div>
            <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer">
              Xác nhận thêm
            </button>
          </form>
        )}

        {/* Lưới hiển thị danh sách sách */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayList.map((book) => {
            const isGlobal = currentGlobal.some((b) => b.id === book.id);
            return (
              <div key={book.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition flex flex-col justify-between space-y-3">
                <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-200 border border-slate-300">
                  <img src={book.imageUrl} alt={book.name} className="w-full h-full object-cover" />
                </div>

                <div className="space-y-1">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${isGlobal ? "bg-indigo-100 text-indigo-800" : "bg-amber-100 text-amber-800"}`}>
                    {isGlobal ? "📚 Sách hệ thống (Chung)" : "🔒 Tài liệu cá nhân"}
                  </span>
                  <h4 className="font-extrabold text-slate-800 text-sm mt-1 line-clamp-2">{book.name}</h4>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                  <a
                    href={book.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Mở / Tải</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {(isAdmin || !isGlobal) && (
                    <button
                      onClick={() => handleDeleteBook(book.id, isGlobal)}
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
      </div>
    </div>
  );
};
};
