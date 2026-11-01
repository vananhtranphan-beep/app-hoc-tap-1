// ============================================================
// KIỂM TRA CÀI ĐẶT MÁY CHỦ: mở https://<tên-web>.vercel.app/api/health
// Chỉ cho biết đã cài hay chưa, KHÔNG hiện khóa hay mật khẩu.
// ============================================================
import { dbReady } from "./_db.js";

export default function handler(req, res) {
    res.setHeader?.("Cache-Control", "no-store");
    return res.status(200).json({
        khoDuLieuUpstash: dbReady() ? "đã kết nối" : "CHƯA kết nối (vào Vercel → Storage → Upstash for Redis → Connect, rồi Redeploy)",
        aiGroq: process.env.GROQ_API_KEY ? "đã có khóa" : "CHƯA có GROQ_API_KEY",
        matKhauAdmin: process.env.ADMIN_DEFAULT_PASSWORD ? "đã đặt" : "CHƯA đặt ADMIN_DEFAULT_PASSWORD (chỉ cần khi tạo tài khoản admin lần đầu)",
    });
}
