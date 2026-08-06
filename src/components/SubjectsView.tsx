import React, { useState, useEffect } from "react";
import { BookOpen, ExternalLink, FileText, Trash2, Plus, Edit3, Check, Image as ImageIcon } from "lucide-react";

const INITIAL_SYSTEM_BOOKS: { [key: string]: { id: string; name: string; url: string; imageUrl: string }[] } = {
  "Ngữ văn": [
    { id: "nv-6-1", name: "Ngữ Văn lớp 6 - Tập 1", url: "", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-6-2", name: "Ngữ Văn lớp 6 - Tập 2", url: "", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-7-1", name: "Ngữ Văn lớp 7 - Tập 1", url: "", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-7-2", name: "Ngữ Văn lớp 7 - Tập 2", url: "", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-8-1", name: "Ngữ Văn lớp 8 - Tập 1", url: "", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-8-2", name: "Ngữ Văn lớp 8 - Tập 2", url: "", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-9-1", name: "Ngữ Văn lớp 9 - Tập 1", url: "", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-9-2", name: "Ngữ Văn lớp 9 - Tập 2", url: "", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-nc-1", name: "Tài liệu Nâng cao Ngữ Văn 6", url: "", imageUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-nc-2", name: "Tài liệu Nâng cao Ngữ Văn 7", url: "", imageUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-nc-3", name: "Tài liệu Nâng cao Ngữ Văn 8", url: "", imageUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-nc-4", name: "Tài liệu Nâng cao Ngữ Văn 9", url: "", imageUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=300&q=80" },
  ],
  "Toán": [
    { id: "toan-6-1", name: "Toán lớp 6 - Tập 1", url: "", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-6-2", name: "Toán lớp 6 - Tập 2", url: "", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-7-1", name: "Toán lớp 7 - Tập 1", url: "", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-7-2", name: "Toán lớp 7 - Tập 2", url: "", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-8-1", name: "Toán lớp 8 - Tập 1", url: "", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-8-2", name: "Toán lớp 8 - Tập 2", url: "", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-9-1", name: "Toán lớp 9 - Tập 1", url: "", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-9-2", name: "Toán lớp 9 - Tập 2", url: "", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-nc-1", name: "Tham khảo Nâng cao Toán 6", url: "", imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-nc-2", name: "Tham khảo Nâng cao Toán 7", url: "", imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-nc-3", name: "Tham khảo Nâng cao Toán 8", url: "", imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-nc-4", name: "Tham khảo Nâng cao Toán 9", url: "", imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=300&q=80" },
  ],
  "Tiếng Anh": [
    { id: "ta-6", name: "Tiếng Anh lớp 6", url: "", imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=300&q=80" },
    { id: "ta-7", name: "Tiếng Anh lớp 7", url: "", imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=300&q=80" },
    { id: "ta-8", name: "Tiếng Anh lớp 8", url: "", imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=300&q=80" },
    { id: "ta-9", name: "Tiếng Anh lớp 9", url: "", imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=300&q=80" },
  ],
  "Khoa Học Tự Nhiên": [
    { id: "khtn-6", name: "KHTN lớp 6", url: "", imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=300&q=80" },
    { id: "khtn-7", name: "KHTN lớp 7", url: "", imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=300&q=80" },
    { id: "khtn-8", name: "KHTN lớp 8", url: "", imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=300&q=80" },
    { id: "khtn-9", name: "KHTN lớp 9", url: "", imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=300&q=80" },
  ],
  "Lịch Sử & Địa Lý": [
    { id: "lsdl-6", name: "Lịch Sử & Địa Lý lớp 6", url: "", imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=300&q=80" },
    { id: "lsdl-7", name: "Lịch Sử & Địa Lý lớp 7", url: "", imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=300&q=80" },
    { id: "lsdl-8", name: "Lịch Sử & Địa Lý lớp 8", url: "", imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=300&q=80" },
    { id: "lsdl-9", name: "Lịch Sử & Địa Lý lớp 9", url: "", imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=300&q=80" },
  ],
  "Giáo Dục Công Dân": [
    { id: "gdcd-6", name: "GDCD lớp 6", url: "", imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=300&q=80" },
    { id: "gdcd-7", name: "GDCD lớp 7", url: "", imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=300&q=80" },
    { id: "gdcd-8", name: "GDCD lớp 8", url: "", imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=300&q=80" },
    { id: "gdcd-9", name: "GDCD lớp 9", url: "", imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=300&q=80" },
  ],
  "Tin Học": [
    { id: "tin-6", name: "Tin học lớp 6", url: "", imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80" },
    { id: "tin-7", name: "Tin học lớp 7", url: "", imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80" },
    { id: "tin-8", name: "Tin học lớp 8", url: "", imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80" },
    { id: "tin-9", name: "Tin học lớp 9", url: "", imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80" },
  ],
  "Công Nghệ": [
    { id: "cn-6", name: "Công nghệ lớp 6", url: "", imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80" },
    { id: "cn-7", name: "Công nghệ lớp 7", url: "", imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80" },
    { id: "cn-8", name: "Công nghệ lớp 8", url: "", imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80" },
    { id: "cn-9", name: "Công nghệ lớp 9", url: "", imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80" },
  ],
};

const ADMIN_ID = "tranphanvananh";

export const SubjectsView: React.FC<{ userId?: string }> = ({ userId }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>("Ngữ văn");

  const cleanId = (userId || "").toLowerCase().trim();
  const isAdmin = cleanId === ADMIN_ID;

  const systemStorageKey = "system_admin_global_books_v10";
  const [systemBooks, setSystemBooks] = useState<{ [subject: string]: { id: string; name: string; url: string; imageUrl: string }[] }>(() => {
    const saved = localStorage.getItem(systemStorageKey);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_SYSTEM_BOOKS;
  });

  const personalStorageKey = `user_${cleanId || "default"}_personal_books_v10`;
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

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");

  useEffect(() => {
    localStorage.setItem(systemStorageKey, JSON.stringify(systemBooks));
  }, [systemBooks]);

  useEffect(() => {
    localStorage.setItem(personalStorageKey, JSON.stringify(personalBooks));
  }, [personalBooks, personalStorageKey]);

  const currentSystemList = systemBooks[selectedSubject] || [];
  const currentPersonalList = personalBooks[selectedSubject] || [];

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
      setSystemBooks({ ...systemBooks, [selectedSubject]: [...currentSystemList, newItem] });
    } else {
      setPersonalBooks({ ...personalBooks, [selectedSubject]: [...currentPersonalList, newItem] });
    }

    setNewName("");
    setNewUrl("");
    setNewImageUrl("");
    setShowAddForm(false);
  };

  const handleDeleteSystemBook = (id: string) => {
    if (!isAdmin) {
      alert("Chỉ tài khoản Admin (tranphanvananh) mới có quyền xóa tài liệu hệ thống!");
      return;
    }
    setSystemBooks({ ...systemBooks, [selectedSubject]: currentSystemList.filter((b) => b.id !== id) });
  };

  const handleDeletePersonalBook = (id: string) => {
    setPersonalBooks({ ...personalBooks, [selectedSubject]: currentPersonalList.filter((b) => b.id !== id) });
  };

  const startEditing = (book: { id: string; name: string; url: string; imageUrl: string }) => {
    if (!isAdmin) {
      alert("Chỉ tài khoản Admin (tranphanvananh) mới có quyền chỉnh sửa link hệ thống!");
      return;
    }
    setEditingId(book.id);
    setEditName(book.name);
    setEditUrl(book.url);
    setEditImageUrl(book.imageUrl);
  };

  const saveEditing = (id: string) => {
    const updated = currentSystemList.map((b) => {
      if (b.id === id) {
        return {
          ...b,
          name: editName.trim() || b.name,
          url: editUrl.trim(),
          imageUrl: editImageUrl.trim() || b.imageUrl,
        };
      }
      return b;
    });

    setSystemBooks({ ...systemBooks, [selectedSubject]: updated });
    setEditingId(null);
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
              {isAdmin ? "⭐ Đang đăng nhập Admin (tranphanvananh): Bấm nút Sửa trên từng cuốn sách để add link Google Drive!" : "📚 Tài liệu chung của nhà trường & Tài liệu cá nhân của bạn."}
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
            <p className="text-xs text-slate-500">Tổng cộng {currentSystemList.length + currentPersonalList.length} tài liệu</p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? "Đóng form" : isAdmin ? "➕ Thêm sách hệ thống mới" : "➕ Thêm tài liệu cá nhân"}</span>
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddBook} className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-3">
            <h4 className="font-bold text-xs text-indigo-900">
              {isAdmin ? "Thêm tài liệu vào hệ thống chung (Tất cả học sinh đăng nhập đều thấy):" : "Thêm tài liệu riêng tư (Chỉ tài khoản của bạn thấy):"}
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
                placeholder="Dán link Google Drive hoặc PDF..."
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

        <div className="space-y-3">
          <h4 className="font-extrabold text-sm text-slate-700">📚 Tài liệu hệ thống chung</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentSystemList.map((book) => {
              const isEditing = editingId === book.id;
              return (
                <div key={book.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition flex flex-col justify-between space-y-3">
                  {isEditing ? (
                    <div className="space-y-2 bg-indigo-50 p-3 rounded-xl border border-indigo-200">
                      <span className="text-[10px] font-bold text-indigo-700">Chỉnh sửa sách hệ thống:</span>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Tên sách..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs"
                      />
                      <input
                        type="url"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        placeholder="Dán link Google Drive..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs"
                      />
                      <input
                        type="url"
                        value={editImageUrl}
                        onChange={(e) => setEditImageUrl(e.target.value)}
                        placeholder="Link ảnh minh họa..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => saveEditing(book.id)}
                        className="w-full py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Lưu thay đổi</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 relative group">
                        <img src={book.imageUrl} alt={book.name} className="w-full h-full object-cover" />
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => startEditing(book)}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition cursor-pointer"
                            title="Sửa link và ảnh"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="space-y-1">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-indigo-100 text-indigo-800">
                          📚 Sách hệ thống (Chung)
                        </span>
                        <h4 className="font-extrabold text-slate-800 text-sm mt-1 line-clamp-2">{book.name}</h4>
                        <p className={`text-[10px] font-bold ${book.url ? "text-emerald-600" : "text-amber-600"}`}>
                          {book.url ? "✅ Đã có link" : "⚠️ Chưa gắn link"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                        <a
                          href={book.url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            if (!book.url) {
                              e.preventDefault();
                              alert(isAdmin ? "Cuốn sách này chưa có link! Hãy bấm nút hình cây bút để add link Google Drive vào." : "Sách này Admin chưa cập nhật link!");
                            }
                          }}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm transition ${
                            book.url ? "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer" : "bg-slate-200 text-slate-400 cursor-not-allowed"
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Mở / Tải</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        {isAdmin && (
                          <>
                            <button
                              type="button"
                              onClick={() => startEditing(book)}
                              className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-700 transition cursor-pointer"
                              title="Sửa"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSystemBook(book.id)}
                              className="p-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 transition cursor-pointer"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {currentPersonalList.length > 0 && (
          <div className="space-y-3 pt-6 border-t border-slate-200">
            <h4 className="font-extrabold text-sm text-amber-700">🔒 Tài liệu cá nhân của riêng bạn</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentPersonalList.map((book) => (
                <div key={book.id} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 hover:shadow-md transition flex flex-col justify-between space-y-3">
                  <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-200 border border-slate-300">
                    <img src={book.imageUrl} alt={book.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 text-amber-800">
                      🔒 Cá nhân
                    </span>
                    <h4 className="font-extrabold text-slate-800 text-sm mt-1 line-clamp-2">{book.name}</h4>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                    <a
                      href={book.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Mở / Tải</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDeletePersonalBook(book.id)}
                      className="p-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 transition cursor-pointer"
                      title="Xóa tài liệu này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
