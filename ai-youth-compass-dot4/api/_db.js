// ============================================================
// Kết nối kho dữ liệu Upstash Redis (cài từ trang Vercel → Storage)
// Vercel tự thêm biến môi trường KV_REST_API_URL và KV_REST_API_TOKEN
// (hoặc UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN).
// File bắt đầu bằng dấu _ nên Vercel không coi nó là một trang API riêng.
// ============================================================
import crypto from "node:crypto";

const dbUrl = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const dbToken = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";

export const dbReady = () => Boolean(dbUrl() && dbToken());

// Gửi 1 lệnh Redis, ví dụ: redis("SET", "khoa", "giá trị")
export async function redis(...command) {
    const res = await fetch(dbUrl(), {
        method: "POST",
        headers: { Authorization: `Bearer ${dbToken()}`, "Content-Type": "application/json" },
        body: JSON.stringify(command),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.error) throw new Error(json.error || `Redis lỗi ${res.status}`);
    return json.result;
}

// ID đăng nhập chuẩn hóa: chữ thường, bỏ khoảng trắng 2 đầu
export const normalizeId = (id) => String(id || "").trim().toLowerCase();
export const validId = (id) => /^[a-z0-9_.-]{3,40}$/.test(id);

// Mã hóa mật khẩu (scrypt + muối ngẫu nhiên), không bao giờ lưu mật khẩu gốc
export function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
    const hash = crypto.scryptSync(String(password), salt, 64).toString("hex");
    return { salt, hash };
}

export function checkPassword(password, salt, hash) {
    const test = crypto.scryptSync(String(password), salt, 64);
    const real = Buffer.from(String(hash), "hex");
    return real.length === test.length && crypto.timingSafeEqual(real, test);
}

const SESSION_SECONDS = 60 * 60 * 24 * 90; // phiên đăng nhập giữ 90 ngày

export async function createSession(id) {
    const token = crypto.randomBytes(32).toString("hex");
    await redis("SET", `session:${token}`, id, "EX", SESSION_SECONDS);
    return token;
}

// Lấy ID học sinh từ mã phiên trong header "Authorization: Bearer <mã>"
export async function userFromRequest(req) {
    const auth = String(req.headers?.authorization || "");
    const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
    if (!/^[a-f0-9]{64}$/.test(token)) return null;
    const id = await redis("GET", `session:${token}`);
    return id ? { id, token } : null;
}

// Hồ sơ ẩn danh: CHỈ giữ các trường này. Họ tên, ngày sinh, trường lớp, ảnh, mật khẩu
// (nếu có gửi lên) đều bị bỏ, kể cả trong tài khoản cũ.
const PROFILE_FIELDS = ["studentId", "nickname", "grade", "avatar", "createdAt"];
const GRADES = ["6", "7", "8", "9"];

export function cleanProfile(profile) {
    if (!profile || typeof profile !== "object") return {};
    const out = {};
    for (const k of PROFILE_FIELDS) {
        const v = profile[k];
        if (typeof v !== "string" || !v.trim()) continue;
        out[k] = v.trim().slice(0, k === "avatar" ? 16 : 60);
    }
    if (out.grade && !GRADES.includes(out.grade)) delete out.grade;
    return out;
}

// Hồ sơ cũ còn thông tin cá nhân không cần thiết?
export const profileNeedsCleanup = (profile) =>
    Boolean(profile && Object.keys(profile).some((k) => !PROFILE_FIELDS.includes(k)));

// Dữ liệu cảm xúc chỉ được lưu trên máy học sinh, máy chủ không nhận và không giữ
export const isPrivateKey = (key) => /_(mood_|emotion_|selfcare_|garden_)/.test(String(key));

// Đọc dữ liệu của 1 tài khoản; nếu còn bản cảm xúc cũ từng được đồng bộ thì xóa khỏi máy chủ
export async function loadUserData(id) {
    const data = (await readJson(`data:${id}`)) || {};
    const kept = {};
    let removed = false;
    for (const [k, v] of Object.entries(data)) {
        if (isPrivateKey(k)) removed = true;
        else kept[k] = v;
    }
    if (removed) await redis("SET", `data:${id}`, JSON.stringify(kept));
    return kept;
}

export async function readJson(key) {
    const raw = await redis("GET", key);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}
