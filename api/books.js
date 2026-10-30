// ============================================================
// DANH SÁCH SÁCH HỆ THỐNG lưu trên máy chủ
// GET  /api/books                  -> mọi người đọc (học sinh thấy ngay khi admin sửa)
// POST /api/books { overlay }      -> CHỈ tài khoản admin (đã đăng nhập) được lưu
// "overlay" = những cuốn admin đã sửa/thêm + danh sách cuốn đã xóa,
// được gộp với danh sách gốc trong file src/data/systemBooks.ts.
// ============================================================
import { dbReady, redis, userFromRequest, readJson } from "./_db.js";

// ID admin (có thể thêm nhiều ID, cách nhau dấu phẩy, bằng biến môi trường ADMIN_IDS trên Vercel)
const adminIds = () =>
    String(process.env.ADMIN_IDS || "tranphanvananh")
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

const KEY = "system_books_v1";
const MAX_BYTES = 300 * 1024;

const cleanBook = (b) => ({
    id: String(b?.id || "").slice(0, 80),
    name: String(b?.name || "").slice(0, 200),
    url: String(b?.url || "").slice(0, 1000),
    imageUrl: String(b?.imageUrl || "").slice(0, 1000),
});

export default async function handler(req, res) {
    if (!dbReady()) return res.status(503).json({ error: "no_db" });

    try {
        if (req.method === "GET") {
            res.setHeader?.("Cache-Control", "no-store");
            return res.status(200).json({ overlay: await readJson(KEY) });
        }

        if (req.method === "POST") {
            const session = await userFromRequest(req);
            if (!session) return res.status(401).json({ error: "Admin cần đăng nhập lại để lưu sách." });
            if (!adminIds().includes(String(session.id).toLowerCase())) {
                return res.status(403).json({ error: "Chỉ admin mới được sửa danh sách sách." });
            }
            const overlay = req.body?.overlay;
            if (!overlay || typeof overlay !== "object" || typeof overlay.books !== "object") {
                return res.status(400).json({ error: "Dữ liệu không hợp lệ." });
            }
            const books = {};
            for (const [subject, list] of Object.entries(overlay.books || {})) {
                if (Array.isArray(list)) books[String(subject).slice(0, 60)] = list.slice(0, 200).map(cleanBook).filter((b) => b.id);
            }
            const removed = Array.isArray(overlay.removed) ? overlay.removed.map((x) => String(x).slice(0, 80)).slice(0, 500) : [];
            const json = JSON.stringify({ books, removed, updatedAt: new Date().toISOString() });
            if (Buffer.byteLength(json) > MAX_BYTES) return res.status(413).json({ error: "Danh sách quá lớn." });
            await redis("SET", KEY, json);
            return res.status(200).json({ ok: true });
        }

        return res.status(405).json({ error: "Method Not Allowed" });
    } catch (error) {
        console.error("Books error:", error);
        return res.status(500).json({ error: "Lỗi máy chủ: " + error.message });
    }
}
