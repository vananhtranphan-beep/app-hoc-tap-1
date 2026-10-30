import React, { useState, useEffect, useMemo } from "react";
import { BookOpen, ExternalLink, Trash2, Plus, Edit3, Check, Upload, Copy, RotateCcw, X } from "lucide-react";
import { SYSTEM_BOOKS, SystemBook } from "../data/systemBooks";
import { cloud } from "../lib/cloud";

// ============================================================
// THƯ VIỆN SÁCH
// Danh sách gốc: file src/data/systemBooks.ts (đã có link SGK Kết nối tri thức).
// Admin sửa/thêm/xóa sách => lưu thành "phần thay đổi" (overlay) và GỘP với danh sách gốc.
//  - Đã cài kho dữ liệu trên Vercel: phần thay đổi lưu lên máy chủ, học sinh thấy NGAY.
//  - Chưa cài: phần thay đổi lưu trên máy admin, bấm "Đăng cho học sinh" để chép lên GitHub.
// Học sinh chỉ xem và mở sách, không thêm/sửa được.
// ============================================================

const ADMIN_ID = "tranphanvananh";
const GITHUB_EDIT_URL = "https://github.com/vananhtranphan-beep/app-hoc-tap-1/edit/main/src/data/systemBooks.ts";

const DRAFT_KEY = "system_admin_books_overlay_v12"; // phần thay đổi của admin (khi chưa có máy chủ)
const LEGACY_KEYS = ["system_admin_books_draft_v11", "system_admin_global_books_v10"]; // bản nháp kiểu cũ

type BooksBySubject = Record<string, SystemBook[]>;
type Overlay = { books: BooksBySubject; removed: string[] };
const EMPTY_OVERLAY: Overlay = { books: {}, removed: [] };

// Gộp danh sách gốc với phần thay đổi của admin.
// - Giữ thứ tự sách gốc; cuốn nào admin đã sửa thì lấy bản của admin (link trống thì dùng link gốc)
// - Cuốn admin đã xóa thì bỏ; cuốn admin tự thêm thì nối vào cuối
export function mergeBooks(base: BooksBySubject, overlay: Overlay): BooksBySubject {
  const removed = new Set(overlay.removed || []);
  const result: BooksBySubject = {};
  const subjects = [...Object.keys(base), ...Object.keys(overlay.books || {}).filter((s) => !(s in base))];
  for (const subject of subjects) {
    const baseList = base[subject] || [];
    const extra = overlay.books?.[subject] || [];
    const extraMap = new Map(extra.map((b) => [b.id, b]));
    const baseIds = new Set(baseList.map((b) => b.id));
    result[subject] = [
      ...baseList
        .filter((b) => !removed.has(b.id))
        .map((b) => {
          const o = extraMap.get(b.id);
          return o ? { ...b, name: o.name || b.name, url: o.url || b.url, imageUrl: o.imageUrl || b.imageUrl } : b;
        }),
      ...extra.filter((b) => !baseIds.has(b.id) && !removed.has(b.id)),
    ];
  }
  return result;
}

const readOverlay = (): Overlay | null => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
      const o = JSON.parse(raw);
      return { books: o.books || {}, removed: o.removed || [] };
    }
    // Bản nháp kiểu cũ (danh sách đầy đủ): coi như phần thay đổi, KHÔNG làm mất sách gốc mới
    for (const k of LEGACY_KEYS) {
      const old = localStorage.getItem(k);
      if (old) return { books: JSON.parse(old), removed: [] };
    }
  } catch {}
  return null;
};

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
// Link sách: bộ "Kết nối tri thức với cuộc sống" trên taphuan.nxbgd.vn.
// Sửa dễ nhất: đăng nhập web bằng tài khoản admin -> Môn học THCS -> bấm cây bút.
// ============================================================

export type SystemBook = { id: string; name: string; url: string; imageUrl: string };

export const SYSTEM_BOOKS: Record<string, SystemBook[]> = {
${subjects}
};
`;
};

// Bìa sách theo môn: màu dịu trong bảng màu chung, biểu tượng môn học
const COVER: Record<string, { bg: string; icon: string }> = {
  "Ngữ văn": { bg: "#173b50", icon: "📖" },
  "Toán": { bg: "#328f89", icon: "📐" },
  "Tiếng Anh": { bg: "#2a5670", icon: "🌏" },
  "Khoa Học Tự Nhiên": { bg: "#287470", icon: "🔬" },
  "Lịch Sử & Địa Lý": { bg: "#5a6f4e", icon: "🗺️" },
  "Giáo Dục Công Dân": { bg: "#7a5c58", icon: "🤝" },
  "Tin Học": { bg: "#34627d", icon: "💻" },
  "Công Nghệ": { bg: "#4f5f6b", icon: "⚙️" },
};

// Chuẩn hóa link admin dán vào: thêm https:// nếu thiếu, bỏ khoảng trắng, chỉ nhận http/https.
// (Lỗi cũ: ô nhập kiểu "url" của trình duyệt từ chối link không có https:// nên không lưu được.)
export function normalizeUrl(raw: string): { ok: true; url: string } | { ok: false; error: string } {
  const t = raw.replace(/\s+/g, "").trim();
  if (!t) return { ok: true, url: "" };
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(t) ? t : `https://${t.replace(/^\/+/, "")}`;
  try {
    const u = new URL(withScheme);
    if (u.protocol !== "https:" && u.protocol !== "http:") return { ok: false, error: "Link phải bắt đầu bằng http:// hoặc https://" };
    if (!u.hostname.includes(".")) return { ok: false, error: "Link chưa đúng. Ví dụ: https://taphuan.nxbgd.vn/..." };
    return { ok: true, url: u.href };
  } catch {
    return { ok: false, error: "Link chưa đúng. Bạn dán lại link đầy đủ nhé." };
  }
}

const isStockImage = (url: string) => !url || url.includes("images.unsplash.com");
const isOfficial = (b: SystemBook) => b.url.includes("taphuan.nxbgd.vn");

const BookCover: React.FC<{ book: SystemBook; subject: string }> = ({ book, subject }) => {
  if (!isStockImage(book.imageUrl)) {
    return <img src={book.imageUrl} alt={book.name} className="w-full h-full object-cover" />;
  }
  const c = COVER[subject] || { bg: "#173b50", icon: "📚" };
  const tap = book.name.match(/Tập\s*\d/i)?.[0];
  const lop = book.name.match(/lớp\s*\d/i)?.[0] || book.name.match(/\b[6-9]\b/)?.[0];
  return (
    <div className="relative w-full h-full p-3 flex flex-col justify-between text-white overflow-hidden" style={{ background: c.bg }}>
      <div className="absolute -right-6 -bottom-6 text-7xl opacity-25 rotate-12 select-none">{c.icon}</div>
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-black/15" />
      <div className="flex items-start justify-between gap-2 pl-1">
        <span className="text-2xl drop-shadow">{c.icon}</span>
        {lop && <span className="px-2 py-0.5 rounded-full bg-white/25 text-[10px] font-black uppercase tracking-wide">{lop}</span>}
      </div>
      <div className="pl-1 relative">
        <div className="text-[13px] font-black leading-tight drop-shadow line-clamp-2">{book.name.replace(/\s*-\s*Tập\s*\d/i, "")}</div>
        {tap && <div className="text-[11px] font-bold text-white/90 mt-0.5">{tap}</div>}
      </div>
    </div>
  );
};

export const SubjectsView: React.FC<{ userId?: string }> = ({ userId }) => {
  const subjects = Object.keys(SYSTEM_BOOKS);
  const [selectedSubject, setSelectedSubject] = useState<string>(subjects[0]);

  const cleanId = (userId || "").toLowerCase().trim();
  const isAdmin = cleanId === ADMIN_ID;

  // "loading" -> đang hỏi máy chủ | "server" -> sách lưu trên máy chủ | "github" -> chưa có máy chủ
  const [mode, setMode] = useState<"loading" | "server" | "github">("loading");
  const [overlay, setOverlay] = useState<Overlay>(EMPTY_OVERLAY);
  const [saveState, setSaveState] = useState<"" | "saving" | "saved" | "error">("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/books")
      .then(async (r) => {
        const json = await r.json().catch(() => null);
        if (cancelled) return;
        if (r.ok && json) {
          const server: Overlay = json.overlay ? { books: json.overlay.books || {}, removed: json.overlay.removed || [] } : EMPTY_OVERLAY;
          // Admin còn bản nháp cũ trên máy: gộp vào để không mất link đã nhập
          const local = isAdmin ? readOverlay() : null;
          setOverlay(local ? { books: { ...local.books, ...server.books }, removed: server.removed } : server);
          setMode("server");
        } else {
          throw new Error("no server");
        }
      })
      .catch(() => {
        if (cancelled) return;
        setOverlay(isAdmin ? readOverlay() || EMPTY_OVERLAY : EMPTY_OVERLAY);
        setMode("github");
      });
    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  const books = useMemo(() => mergeBooks(SYSTEM_BOOKS, overlay), [overlay]);
  const hasUnpublished = mode === "github" && isAdmin && JSON.stringify(books) !== JSON.stringify(SYSTEM_BOOKS);
  const publishCode = useMemo(() => buildSystemBooksFile(books), [books]);

  // Chế độ GitHub: lưu phần thay đổi trên máy admin (hết thay đổi thì xóa nháp)
  useEffect(() => {
    if (mode !== "github" || !isAdmin) return;
    try {
      LEGACY_KEYS.forEach((k) => localStorage.removeItem(k));
      if (hasUnpublished) localStorage.setItem(DRAFT_KEY, JSON.stringify(overlay));
      else localStorage.removeItem(DRAFT_KEY);
    } catch {}
  }, [overlay, mode, isAdmin, hasUnpublished]);

  // Admin thay đổi sách
  const applyChange = async (next: Overlay) => {
    setOverlay(next);
    if (mode !== "server") return;
    setSaveState("saving");
    setSaveError("");
    try {
      const token = cloud.token(userId || "");
      const r = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ overlay: next }),
      });
      const json = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(json.error || "Không lưu được");
      setSaveState("saved");
      try {
        [DRAFT_KEY, ...LEGACY_KEYS].forEach((k) => localStorage.removeItem(k));
      } catch {}
    } catch (e: any) {
      setSaveState("error");
      setSaveError(e.message);
    }
  };

  const upsertBook = (subject: string, book: SystemBook) => {
    const list = overlay.books[subject] || [];
    const exists = list.some((b) => b.id === book.id);
    applyChange({
      ...overlay,
      books: { ...overlay.books, [subject]: exists ? list.map((b) => (b.id === book.id ? book : b)) : [...list, book] },
    });
  };

  const removeBook = (subject: string, id: string) => {
    const inBase = (SYSTEM_BOOKS[subject] || []).some((b) => b.id === id);
    applyChange({
      books: { ...overlay.books, [subject]: (overlay.books[subject] || []).filter((b) => b.id !== id) },
      removed: inBase ? Array.from(new Set([...overlay.removed, id])) : overlay.removed,
    });
  };

  // ---- Form thêm / sửa (chỉ admin) ----
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [showPublish, setShowPublish] = useState(false);
  const [copied, setCopied] = useState(false);

  const [formError, setFormError] = useState("");

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !newName.trim()) return;
    const link = normalizeUrl(newUrl);
    if (!link.ok) return setFormError(link.error);
    setFormError("");
    upsertBook(selectedSubject, { id: "item-" + Date.now(), name: newName.trim(), url: link.url, imageUrl: "" });
    setNewName("");
    setNewUrl("");
    setShowAddForm(false);
  };

  const startEditing = (book: SystemBook) => {
    setFormError("");
    setEditingId(book.id);
    setEditName(book.name);
    setEditUrl(book.url);
    setEditImageUrl(isStockImage(book.imageUrl) ? "" : book.imageUrl);
  };

  const saveEditing = (book: SystemBook) => {
    const link = normalizeUrl(editUrl);
    if (!link.ok) return setFormError(link.error);
    const img = normalizeUrl(editImageUrl);
    if (!img.ok) return setFormError("Link ảnh bìa: " + img.error);
    setFormError("");
    upsertBook(selectedSubject, {
      id: book.id,
      name: editName.trim() || book.name,
      url: link.url,
      imageUrl: img.url,
    });
    setEditingId(null);
  };

  const handleDelete = (book: SystemBook) => {
    if (!window.confirm(`Xóa "${book.name}" khỏi thư viện?`)) return;
    removeBook(selectedSubject, book.id);
  };

  const discardDraft = () => {
    if (!window.confirm("Bỏ hết các thay đổi chưa đăng?")) return;
    setOverlay(EMPTY_OVERLAY);
    setEditingId(null);
    setShowPublish(false);
  };

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

  // Tài liệu cá nhân cũ (trước đây học sinh tự thêm): chỉ còn xem & xóa
  const personalKey = `user_${cleanId || "default"}_personal_books_v10`;
  const [personalBooks, setPersonalBooks] = useState<BooksBySubject>(() => {
    try {
      return JSON.parse(localStorage.getItem(personalKey) || "{}") || {};
    } catch {
      return {};
    }
  });
  const removePersonal = (id: string) => {
    const next = { ...personalBooks, [selectedSubject]: (personalBooks[selectedSubject] || []).filter((b) => b.id !== id) };
    setPersonalBooks(next);
    try {
      localStorage.setItem(personalKey, JSON.stringify(next));
    } catch {}
  };

  const list = books[selectedSubject] || [];
  const personalList = personalBooks[selectedSubject] || [];
  const linkedCount = list.filter((b) => b.url).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Đầu trang + chọn môn */}
      <div className="p-5 sm:p-6 rounded-2xl bg-navy text-white shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white/10 border border-white/15">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold">Thư Viện Sách Giáo Khoa</h2>
            <p className="text-xs sm:text-sm text-mist">
              Bộ sách <b>Kết nối tri thức với cuộc sống</b> lớp 6 – 9. Bấm "Đọc sách" để mở sách trên trang của NXB Giáo dục.
            </p>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pt-1">
          {subjects.map((subj) => (
            <button
              key={subj}
              onClick={() => {
                setSelectedSubject(subj);
                setEditingId(null);
              }}
              className={`px-4 py-2 rounded-2xl border text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                selectedSubject === subj
                  ? "bg-white text-navy border-white shadow-md"
                  : "bg-white/10 text-mist border-white/15 hover:bg-white/20"
              }`}
            >
              {COVER[subj]?.icon} {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Khu quản trị (chỉ admin) */}
      {isAdmin && mode === "server" && (
        <div className={`p-4 rounded-2xl border text-sm flex flex-wrap items-center gap-2 ${saveState === "error" ? "bg-rose-50 border-rose-200 text-rose-800" : "bg-emerald-50 border-emerald-200 text-emerald-800"}`}>
          <span className="font-extrabold">⭐ Admin:</span>
          <span>
            {saveState === "saving"
              ? "Đang lưu..."
              : saveState === "error"
              ? `Chưa lưu được: ${saveError} (đăng xuất rồi đăng nhập lại tài khoản admin rồi thử lại)`
              : saveState === "saved"
              ? "✅ Đã lưu! Học sinh thấy ngay."
              : "Sửa link, thêm hoặc xóa sách là học sinh thấy ngay (lưu tự động lên máy chủ)."}
          </span>
        </div>
      )}

      {isAdmin && mode === "github" && (
        <div className={`p-5 rounded-2xl border shadow-sm space-y-4 ${hasUnpublished ? "bg-amber-50 border-amber-300" : "bg-emerald-50 border-emerald-300"}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className={`font-extrabold text-sm ${hasUnpublished ? "text-amber-800" : "text-emerald-800"}`}>
                {hasUnpublished
                  ? "⚠️ Có thay đổi CHƯA đăng: hiện chỉ máy này thấy."
                  : "✅ Học sinh đang thấy đúng danh sách như bạn thấy."}
              </p>
              <p className="text-xs text-muted mt-1">
                Mẹo: cài kho dữ liệu Upstash trên Vercel thì sửa xong là học sinh thấy ngay, không cần bước đăng này.
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              {hasUnpublished && (
                <button onClick={discardDraft} className="px-3 py-2 rounded-xl bg-white border border-line hover:bg-mist text-ink font-bold text-xs transition cursor-pointer flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Bỏ thay đổi</span>
                </button>
              )}
              {hasUnpublished && (
                <button onClick={() => setShowPublish(!showPublish)} className="px-4 py-2 rounded-xl bg-teal hover:bg-teal-deep text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm">
                  <Upload className="w-4 h-4" />
                  <span>{showPublish ? "Đóng hướng dẫn" : "📤 Đăng cho học sinh"}</span>
                </button>
              )}
            </div>
          </div>
          {showPublish && hasUnpublished && (
            <div className="p-4 rounded-2xl bg-white border border-teal-soft space-y-3">
              <ol className="list-decimal pl-5 space-y-1.5 text-xs text-ink">
                <li>Bấm <b>"Sao chép code"</b>.</li>
                <li>Bấm <b>"Mở file trên GitHub"</b> (cần đăng nhập GitHub).</li>
                <li>Bấm vào ô code trên GitHub, nhấn <b>Ctrl + A</b> rồi <b>Ctrl + V</b>.</li>
                <li>Bấm nút xanh <b>"Commit changes..."</b> rồi <b>"Commit changes"</b>. Đợi 1–2 phút.</li>
              </ol>
              <div className="flex flex-wrap gap-2">
                <button onClick={copyPublishCode} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "Đã sao chép!" : "Sao chép code"}</span>
                </button>
                <a href={GITHUB_EDIT_URL} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-xl bg-navy hover:bg-navy-soft text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5">
                  <ExternalLink className="w-4 h-4" />
                  <span>Mở file trên GitHub</span>
                </a>
              </div>
              <textarea id="publish-code-box" readOnly value={publishCode} className="w-full h-32 p-2 rounded-xl bg-cream border border-line font-mono text-[10px] text-muted" />
            </div>
          )}
        </div>
      )}

      {/* Danh sách sách */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-line shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-navy">
              {COVER[selectedSubject]?.icon} {selectedSubject}
            </h3>
            <p className="text-xs text-muted">
              {list.length} cuốn{isAdmin ? ` • ${linkedCount} cuốn đã có link` : ""}
            </p>
          </div>
          {isAdmin && mode !== "loading" && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 rounded-xl bg-teal hover:bg-teal-deep text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm self-start"
            >
              {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{showAddForm ? "Đóng" : "Thêm sách (admin)"}</span>
            </button>
          )}
        </div>

        {isAdmin && showAddForm && (
          <form onSubmit={handleAddBook} className="p-4 rounded-2xl bg-mist/60 border border-teal-soft space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input type="text" required aria-label="Tên sách" placeholder="Tên sách (VD: Bài tập Toán 6 - Tập 1)" value={newName} onChange={(e) => setNewName(e.target.value)} className="px-3 py-2.5 rounded-xl bg-white border border-line text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal" />
              <input type="text" inputMode="url" autoComplete="off" autoCapitalize="off" spellCheck={false} aria-label="Link sách" placeholder="Link sách (có thể để trống, gắn sau)" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} className="px-3 py-2.5 rounded-xl bg-white border border-line text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal" />
            </div>
            {formError && <p role="alert" className="text-sm text-rose-700">{formError}</p>}
            <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer">
              Thêm vào thư viện
            </button>
          </form>
        )}

        {mode === "loading" ? (
          <div className="py-10 text-center text-sm text-muted animate-pulse">Đang tải thư viện...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {list.map((book) => {
              const isEditing = editingId === book.id;
              return (
                <div key={book.id} className={`rounded-2xl bg-white border overflow-hidden flex flex-col ${isEditing ? "col-span-full border-teal/50" : "lift border-line hover:border-teal/50"}`}>
                  {isEditing ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        saveEditing(book);
                      }}
                      className="p-4 space-y-3 bg-mist/60 flex-1"
                    >
                      <span className="text-sm font-bold text-teal-deep">Sửa sách</span>
                      <div className="grid sm:grid-cols-3 gap-3">
                        <label className="block text-xs font-semibold text-muted">
                          Tên sách
                          <input value={editName} onChange={(e) => setEditName(e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-xl bg-white border border-line text-base sm:text-sm text-ink font-normal" />
                        </label>
                        <label className="block text-xs font-semibold text-muted">
                          Link đọc sách
                          <input
                            value={editUrl}
                            onChange={(e) => setEditUrl(e.target.value)}
                            type="text"
                            inputMode="url"
                            autoComplete="off"
                            autoCapitalize="off"
                            spellCheck={false}
                            placeholder="https://taphuan.nxbgd.vn/..."
                            className="mt-1 w-full px-3 py-2.5 rounded-xl bg-white border border-line text-base sm:text-sm text-ink font-normal"
                          />
                        </label>
                        <label className="block text-xs font-semibold text-muted">
                          Link ảnh bìa (không bắt buộc)
                          <input
                            value={editImageUrl}
                            onChange={(e) => setEditImageUrl(e.target.value)}
                            type="text"
                            inputMode="url"
                            autoComplete="off"
                            autoCapitalize="off"
                            spellCheck={false}
                            placeholder="Để trống = bìa màu"
                            className="mt-1 w-full px-3 py-2.5 rounded-xl bg-white border border-line text-base sm:text-sm text-ink font-normal"
                          />
                        </label>
                      </div>
                      {formError && <p role="alert" className="text-sm text-rose-700">{formError}</p>}
                      <div className="flex gap-2">
                        <button type="submit" className="min-h-11 px-5 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-1.5 cursor-pointer">
                          <Check className="w-4 h-4" /> Lưu
                        </button>
                        <button type="button" onClick={() => setEditingId(null)} className="min-h-11 px-4 rounded-xl bg-white border border-line text-muted font-bold text-sm cursor-pointer">
                          Hủy
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="relative h-36 sm:h-40 overflow-hidden">
                        <BookCover book={book} subject={selectedSubject} />
                        {isOfficial(book) && (
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-white/90 text-[9px] font-extrabold text-ink shadow-sm">
                            NXB Giáo dục
                          </span>
                        )}
                      </div>
                      <div className="p-3 flex-1 flex flex-col gap-2">
                        <h4 className="font-bold text-ink text-sm leading-snug line-clamp-2">{book.name}</h4>
                        {isAdmin && (
                          <p className={`text-[10px] font-bold ${book.url ? "text-emerald-600" : "text-amber-600"}`}>
                            {book.url ? "✅ Đã có link" : "⚠️ Chưa gắn link"}
                          </p>
                        )}
                        <div className="mt-auto flex flex-wrap items-center gap-1.5">
                          {book.url ? (
                            <a href={book.url} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[6.5rem] min-h-10 rounded-xl bg-teal hover:bg-teal-deep text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition">
                              <span>Đọc sách</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="flex-1 min-h-10 flex items-center justify-center rounded-xl bg-mist text-muted text-xs font-bold text-center">Sắp có</span>
                          )}
                          {isAdmin && (
                            <>
                              <button type="button" onClick={() => startEditing(book)} title="Sửa" aria-label={`Sửa ${book.name}`} className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-700 transition cursor-pointer">
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button type="button" onClick={() => handleDelete(book)} title="Xóa" aria-label={`Xóa ${book.name}`} className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 transition cursor-pointer">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {personalList.length > 0 && (
          <div className="space-y-3 pt-5 border-t border-line">
            <h4 className="font-extrabold text-sm text-amber-700">🔒 Tài liệu cá nhân em đã lưu trước đây</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {personalList.map((b) => (
                <div key={b.id} className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2">
                  <a href={b.url} target="_blank" rel="noopener noreferrer" className="flex-1 text-sm font-bold text-amber-900 hover:underline truncate">
                    {b.name}
                  </a>
                  <button onClick={() => removePersonal(b.id)} title="Xóa" className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
