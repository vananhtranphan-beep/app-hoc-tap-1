import React, { useState, useEffect } from "react";
import { BookOpen, ExternalLink, FileText, Trash2, Plus, Edit3, Check, Upload, Copy, RotateCcw } from "lucide-react";
import { SYSTEM_BOOKS, SystemBook } from "../data/systemBooks";

const ADMIN_ID = "tranphanvananh";

// Link mở thẳng trang sửa file danh sách sách trên GitHub
const GITHUB_EDIT_URL = "https://github.com/vananhtranphan-beep/app-hoc-tap-1/edit/main/src/data/systemBooks.ts";

// Bản nháp của admin (chỉ lưu trên trình duyệt của admin cho tới khi "Đăng cho học sinh")
const ADMIN_DRAFT_KEY = "system_admin_books_draft_v11";
const OLD_ADMIN_KEY = "system_admin_global_books_v10"; // key cũ, đọc lại để không mất link đã nhập

type BooksBySubject = Record<string, SystemBook[]>;

const loadAdminDraft = (): BooksBySubject | null => {
  try {
    const raw = localStorage.getItem(ADMIN_DRAFT_KEY) ?? localStorage.getItem(OLD_ADMIN_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
};

// Tạo nội dung file src/data/systemBooks.ts từ danh sách sách hiện tại
const buildSystemBooksFile = (books: BooksBySubject): string => {
  const s = (v: string) => JSON.stringify(v ?? "");
  const subjects = Object.entries(books)
    .map(([subject, list]) => {
      const lines = list
        .map((b) => `    { id: ${s(b.id)}, name: ${s(b.name)}, url: ${s(b.url)}, imageUrl: ${s(b.imageUrl)} },`)
        .join("\n");
      return `  ${s(subject)}: [\n${lines}\n  ],`;
    })
    .join("\n");
  return `// ============================================================
// DANH SÁCH SÁCH HỆ THỐNG (tất cả học sinh đều thấy)
// ------------------------------------------------------------
// Cách cập nhật dễ nhất: đăng nhập web bằng tài khoản admin,
// vào "Môn học THCS", sửa link sách, rồi bấm "Đăng cho học sinh"
// và làm theo hướng dẫn (copy code -> dán đè vào file này -> Commit).
//
// Cũng có thể sửa tay: dán link Google Drive vào giữa hai dấu ""
// sau chữ url:  ví dụ  url: "https://drive.google.com/..."
// ============================================================

export type SystemBook = { id: string; name: string; url: string; imageUrl: string };

export const SYSTEM_BOOKS: Record<string, SystemBook[]> = {
${subjects}
};
`;
};

export const SubjectsView: React.FC<{ userId?: string }> = ({ userId }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>("Ngữ văn");

  const cleanId = (userId || "").toLowerCase().trim();
  const isAdmin = cleanId === ADMIN_ID;

  // Học sinh: luôn thấy danh sách đã đăng trong code (file systemBooks.ts)
  // Admin: thấy bản nháp của mình (nếu có), để sửa xong rồi mới đăng
  const [systemBooks, setSystemBooks] = useState<BooksBySubject>(() => {
    if (isAdmin) return loadAdminDraft() || SYSTEM_BOOKS;
    return SYSTEM_BOOKS;
  });

  const hasUnpublished = isAdmin && JSON.stringify(systemBooks) !== JSON.stringify(SYSTEM_BOOKS);
  const [showPublish, setShowPublish] = useState(false);
  const [copied, setCopied] = useState(false);
  const publishCode = buildSystemBooksFile(systemBooks);

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
    if (!isAdmin) return;
    try {
      localStorage.removeItem(OLD_ADMIN_KEY);
      if (hasUnpublished) {
        localStorage.setItem(ADMIN_DRAFT_KEY, JSON.stringify(systemBooks));
      } else {
        localStorage.removeItem(ADMIN_DRAFT_KEY); // đã giống bản đăng -> không cần nháp
      }
    } catch {}
  }, [systemBooks, isAdmin, hasUnpublished]);

  const copyPublishCode = async () => {
    try {
      await navigator.clipboard.writeText(publishCode);
    } catch {
      const ta = document.getElementById("publish-code-box") as HTMLTextAreaElement | null;
      ta?.select();
      document.execCommand("copy");
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const discardDraft = () => {
    if (!window.confirm("Bỏ hết các thay đổi chưa đăng và quay về danh sách học sinh đang thấy?")) return;
    setSystemBooks(SYSTEM_BOOKS);
    setEditingId(null);
    setShowPublish(false);
  };

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
          {Object.keys(SYSTEM_BOOKS).map((subj) => {
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

      {isAdmin && (
        <div className={`p-5 rounded-3xl border shadow-sm space-y-4 ${hasUnpublished ? "bg-amber-50 border-amber-300" : "bg-emerald-50 border-emerald-300"}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className={`font-extrabold text-sm ${hasUnpublished ? "text-amber-800" : "text-emerald-800"}`}>
                {hasUnpublished
                  ? "⚠️ Bạn có thay đổi CHƯA đăng: hiện chỉ trình duyệt này thấy, học sinh chưa thấy."
                  : "✅ Học sinh đang thấy đúng danh sách sách như bạn thấy."}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Sửa link xong ở các cuốn sách bên dưới → bấm "Đăng cho học sinh" để tất cả học sinh đều thấy.
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              {hasUnpublished && (
                <button
                  type="button"
                  onClick={discardDraft}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Bỏ thay đổi</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowPublish(!showPublish)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Upload className="w-4 h-4" />
                <span>{showPublish ? "Đóng hướng dẫn" : "📤 Đăng cho học sinh"}</span>
              </button>
            </div>
          </div>

          {showPublish && (
            <div className="p-4 rounded-2xl bg-white border border-indigo-200 space-y-3">
              <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-700">
                <li>Bấm nút <b>"Sao chép code"</b> bên dưới.</li>
                <li>Bấm <b>"Mở file trên GitHub"</b> (cần đăng nhập GitHub). Trang sửa file sẽ mở ra.</li>
                <li>Trong ô code của GitHub: bấm <b>Ctrl + A</b> rồi <b>Ctrl + V</b> để dán đè toàn bộ.</li>
                <li>Bấm nút xanh <b>"Commit changes..."</b> rồi bấm <b>"Commit changes"</b> lần nữa.</li>
                <li>Đợi 1–2 phút để Vercel cập nhật. Học sinh tải lại trang là thấy link mới.</li>
              </ol>
              <p className="text-[11px] text-amber-700 font-bold">
                💡 Nhớ chia sẻ file trên Google Drive ở chế độ "Bất kỳ ai có đường liên kết" thì học sinh mới mở được.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={copyPublishCode}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "Đã sao chép!" : "Sao chép code"}</span>
                </button>
                <a
                  href={GITHUB_EDIT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Mở file trên GitHub</span>
                </a>
              </div>
              <textarea
                id="publish-code-box"
                readOnly
                value={publishCode}
                className="w-full h-40 p-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[10px] text-slate-600"
              />
            </div>
          )}
        </div>
      )}

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
