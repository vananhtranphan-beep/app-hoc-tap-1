// ============================================================
// ĐĂNG KÝ / ĐĂNG NHẬP / ĐĂNG XUẤT tài khoản học sinh
// POST /api/auth  { action: "register" | "login" | "logout" | "deleteAccount" | "adminReset", ... }
// ============================================================
import {
    dbReady, redis, normalizeId, validId, hashPassword, checkPassword,
    createSession, userFromRequest, cleanProfile, readJson,
    profileNeedsCleanup, loadUserData,
} from "./_db.js";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });
    // Chưa cài kho dữ liệu: web tự dùng chế độ lưu trên máy như trước
    if (!dbReady()) return res.status(503).json({ error: "no_db" });

    try {
        const body = req.body || {};
        const action = body.action;

        if (action === "register") {
            const profile = body.profile || {};
            const id = normalizeId(profile.studentId);
            const password = String(body.password || "");
            if (!validId(id) || id.startsWith("__")) {
                return res.status(400).json({ error: "ID chỉ gồm chữ không dấu, số, dấu _ . - và dài 3-40 ký tự." });
            }
            if (password.trim().length < 5) {
                return res.status(400).json({ error: "Mật khẩu phải có ít nhất 5 ký tự." });
            }
            const { salt, hash } = hashPassword(password);
            const user = {
                salt,
                hash,
                profile: { ...cleanProfile(profile), studentId: String(profile.studentId).trim() },
                createdAt: new Date().toISOString(),
            };
            // NX = chỉ tạo nếu ID chưa có ai dùng
            const created = await redis("SET", `user:${id}`, JSON.stringify(user), "NX");
            if (created !== "OK") {
                return res.status(409).json({ error: "ID đăng nhập này đã có người dùng. Em chọn ID khác nhé!" });
            }
            const token = await createSession(id);
            return res.status(200).json({ token, profile: user.profile, data: {} });
        }

        if (action === "login") {
            const id = normalizeId(body.studentId);
            const password = String(body.password || "");
            if (!id) return res.status(400).json({ error: "Thiếu ID đăng nhập." });

            // Chống dò mật khẩu: tối đa 10 lần sai trong 15 phút
            const rlKey = `rl:login:${id}`;
            const tries = await redis("INCR", rlKey);
            if (tries === 1) await redis("EXPIRE", rlKey, 900);
            if (tries > 10) {
                return res.status(429).json({ error: "Em nhập sai quá nhiều lần. Đợi 15 phút rồi thử lại nhé." });
            }

            const user = await readJson(`user:${id}`);
            if (!user) return res.status(404).json({ error: "not_found" });
            if (!checkPassword(password, user.salt, user.hash)) {
                return res.status(401).json({ error: "Mật khẩu không đúng." });
            }

            await redis("DEL", rlKey);
            // Tài khoản cũ: xóa họ tên, ngày sinh, trường... khỏi máy chủ, chỉ giữ hồ sơ ẩn danh
            if (profileNeedsCleanup(user.profile)) {
                user.profile = { ...cleanProfile(user.profile), studentId: user.profile?.studentId || id };
                await redis("SET", `user:${id}`, JSON.stringify(user));
            }
            const token = await createSession(id);
            const data = await loadUserData(id);
            return res.status(200).json({ token, profile: user.profile, data });
        }

        // Admin đặt lại mật khẩu cho học sinh quên mật khẩu
        if (action === "adminReset") {
            const session = await userFromRequest(req);
            const admins = String(process.env.ADMIN_IDS || "tranphanvananh").split(",").map((s) => s.trim().toLowerCase());
            if (!session || !admins.includes(String(session.id).toLowerCase())) {
                return res.status(403).json({ error: "Chỉ admin (đã đăng nhập) mới làm được việc này." });
            }
            const id = normalizeId(body.studentId);
            const newPassword = String(body.newPassword || "");
            if (newPassword.trim().length < 5) return res.status(400).json({ error: "Mật khẩu mới phải có ít nhất 5 ký tự." });
            const user = await readJson(`user:${id}`);
            if (!user) return res.status(404).json({ error: "Không có tài khoản ID này trên máy chủ." });
            const { salt, hash } = hashPassword(newPassword);
            user.salt = salt;
            user.hash = hash;
            await redis("SET", `user:${id}`, JSON.stringify(user));
            await redis("DEL", `rl:login:${id}`);
            return res.status(200).json({ ok: true, nickname: user.profile?.nickname || id });
        }

        // Học sinh tự xóa tài khoản của mình trên máy chủ (cần đăng nhập + nhập lại mật khẩu)
        if (action === "deleteAccount") {
            const session = await userFromRequest(req);
            if (!session) return res.status(401).json({ error: "Phiên đăng nhập đã hết hạn. Em đăng nhập lại rồi xóa nhé." });
            const id = normalizeId(session.id);
            const rlKey = `rl:login:${id}`;
            const tries = await redis("INCR", rlKey);
            if (tries === 1) await redis("EXPIRE", rlKey, 900);
            if (tries > 10) return res.status(429).json({ error: "Em nhập sai quá nhiều lần. Đợi 15 phút rồi thử lại nhé." });
            const user = await readJson(`user:${id}`);
            if (!user) {
                await redis("DEL", `session:${session.token}`);
                return res.status(200).json({ ok: true });
            }
            if (!checkPassword(String(body.password || ""), user.salt, user.hash)) {
                return res.status(401).json({ error: "Mật khẩu không đúng." });
            }
            await redis("DEL", `user:${id}`);
            await redis("DEL", `data:${id}`);
            await redis("DEL", `session:${session.token}`);
            await redis("DEL", rlKey);
            return res.status(200).json({ ok: true });
        }

        if (action === "logout") {
            const session = await userFromRequest(req);
            if (session) await redis("DEL", `session:${session.token}`);
            return res.status(200).json({ ok: true });
        }

        return res.status(400).json({ error: "Yêu cầu không hợp lệ." });
    } catch (error) {
        console.error("Auth error:", error);
        return res.status(500).json({ error: "Lỗi máy chủ: " + error.message });
    }
}
