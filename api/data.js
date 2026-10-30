// ============================================================
// LƯU / TẢI DỮ LIỆU của từng tài khoản học sinh
// POST /api/data  (header Authorization: Bearer <mã phiên>)
//   { action: "load" }                 -> trả về dữ liệu đã lưu
//   { action: "save", data: {...} }    -> lưu toàn bộ dữ liệu của em
//   { action: "saveProfile", profile } -> cập nhật hồ sơ (tên, lớp, ảnh...)
// ============================================================
import { dbReady, redis, userFromRequest, cleanProfile, readJson, isPrivateKey, loadUserData } from "./_db.js";

const MAX_BYTES = 900 * 1024; // giới hạn ~900KB mỗi tài khoản
const MAX_KEYS = 300;

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });
    if (!dbReady()) return res.status(503).json({ error: "no_db" });

    try {
        const session = await userFromRequest(req);
        if (!session) return res.status(401).json({ error: "Phiên đăng nhập đã hết hạn. Em đăng nhập lại nhé." });
        const { id } = session;
        const body = req.body || {};
        // Tài khoản đã bị xóa (phiên cũ ở máy khác vẫn còn): không cho lưu lại dữ liệu
        if (!(await redis("GET", `user:${id}`))) {
            return res.status(401).json({ error: "Tài khoản không còn trên máy chủ." });
        }

        if (body.action === "load") {
            const data = await loadUserData(id);
            return res.status(200).json({ data });
        }

        if (body.action === "save") {
            const input = body.data;
            if (!input || typeof input !== "object" || Array.isArray(input)) {
                return res.status(400).json({ error: "Dữ liệu không hợp lệ." });
            }
            const clean = {};
            let count = 0;
            for (const [k, v] of Object.entries(input)) {
                if (!k.startsWith("user_") || typeof v !== "string") continue;
                if (isPrivateKey(k)) continue; // không nhận dữ liệu cảm xúc
                if (++count > MAX_KEYS) break;
                clean[k] = v;
            }
            const json = JSON.stringify(clean);
            if (Buffer.byteLength(json) > MAX_BYTES) {
                return res.status(413).json({ error: "Dữ liệu quá lớn, em xóa bớt nhật ký cũ nhé." });
            }
            await redis("SET", `data:${id}`, json);
            return res.status(200).json({ ok: true, savedAt: new Date().toISOString() });
        }

        if (body.action === "saveProfile") {
            const user = await readJson(`user:${id}`);
            if (!user) return res.status(404).json({ error: "Không tìm thấy tài khoản." });
            // Giữ nguyên ID đăng nhập, chỉ cập nhật thông tin hiển thị
            user.profile = { ...cleanProfile({ ...user.profile, ...cleanProfile(body.profile) }), studentId: user.profile.studentId };
            await redis("SET", `user:${id}`, JSON.stringify(user));
            return res.status(200).json({ ok: true, profile: user.profile });
        }

        return res.status(400).json({ error: "Yêu cầu không hợp lệ." });
    } catch (error) {
        console.error("Data error:", error);
        return res.status(500).json({ error: "Lỗi máy chủ: " + error.message });
    }
}
