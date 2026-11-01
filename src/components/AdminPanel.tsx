import React, { useState } from "react";
import { KeyRound, ShieldCheck, RotateCcw } from "lucide-react";
import { cloud } from "../lib/cloud";
import { RESET_LABELS, ResetPart, resetPart } from "../lib/reset";

// ============================================================
// KHU QUẢN TRỊ (chỉ hiện với tài khoản admin)
// - Đặt lại mật khẩu cho học sinh quên mật khẩu (cần đã cài kho dữ liệu Upstash)
// - Đặt lại dữ liệu thử nghiệm của chính tài khoản admin (để thử lại nhiều lần)
//   "Toàn bộ" chỉ xóa dữ liệu của tài khoản này, GIỮ cài đặt chung như link sách.
// ============================================================
const PARTS: ResetPart[] = ["career", "mood", "quest", "planner", "videos"];

export const AdminPanel: React.FC<{ userId: string }> = ({ userId }) => {
  const [studentId, setStudentId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setMessage(null);
    const token = cloud.token(userId);
    if (!token) {
      setMessage({ ok: false, text: "Tài khoản admin chưa đăng nhập máy chủ (hoặc chưa cài kho dữ liệu). Đăng xuất rồi đăng nhập lại admin nhé." });
      return;
    }
    setBusy(true);
    try {
      const r = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: "adminReset", studentId: studentId.trim(), newPassword }),
      });
      const json = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(json.error || "Không đặt lại được mật khẩu");
      setMessage({ ok: true, text: `Đã đặt mật khẩu mới cho ${json.nickname} (ID: ${studentId.trim()}). Báo học sinh đăng nhập bằng mật khẩu mới.` });
      setStudentId("");
      setNewPassword("");
    } catch (err: any) {
      setMessage({ ok: false, text: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="p-5 rounded-2xl bg-white border-2 border-dashed border-teal/40 space-y-5">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-navy text-white">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-extrabold text-navy">Khu quản trị (chỉ admin thấy)</h4>
          <p className="text-xs text-muted">Sửa link sách: vào Học tập → Sách giáo khoa, bấm cây bút trên từng cuốn.</p>
        </div>
      </div>

      {/* Đặt lại dữ liệu thử nghiệm */}
      <div className="space-y-2">
        <div className="text-sm font-bold text-navy flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4 text-teal" /> Làm lại từ đầu (dữ liệu của tài khoản admin này)
        </div>
        <div className="flex flex-wrap gap-2">
          {PARTS.map((p) => (
            <button
              key={p}
              onClick={() => resetPart(userId, p)}
              className="min-h-10 px-3.5 rounded-xl bg-white border border-line hover:border-teal text-navy text-sm font-semibold cursor-pointer"
            >
              {RESET_LABELS[p]}
            </button>
          ))}
          <button
            onClick={() =>
              resetPart(
                userId,
                "all",
                "Xóa TOÀN BỘ dữ liệu của tài khoản admin này (hướng nghiệp, cây cảm xúc, bản đồ, kế hoạch, video)? Link sách và cài đặt chung của web vẫn giữ nguyên."
              )
            }
            className="min-h-10 px-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold cursor-pointer"
          >
            Toàn bộ (giữ link sách)
          </button>
        </div>
        <p className="text-xs text-muted">Dùng khi muốn thử lại các chức năng như một học sinh mới. Không ảnh hưởng tài khoản khác.</p>
      </div>

      <form onSubmit={handleReset} className="space-y-2">
        <div className="text-sm font-bold text-navy flex items-center gap-1.5">
          <KeyRound className="w-4 h-4 text-teal" /> Đặt lại mật khẩu cho học sinh
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
            placeholder="Tên đăng nhập của học sinh"
            className="flex-1 min-h-11 px-3 rounded-xl border border-line bg-cream text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal"
          />
          <input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={5}
            placeholder="Mật khẩu mới (ít nhất 5 ký tự)"
            className="flex-1 min-h-11 px-3 rounded-xl border border-line bg-cream text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal"
          />
          <button type="submit" disabled={busy} className="min-h-11 px-4 rounded-xl bg-teal hover:bg-teal-deep disabled:opacity-50 text-white font-bold text-sm cursor-pointer shrink-0">
            {busy ? "Đang đặt..." : "Đặt lại"}
          </button>
        </div>
        {message && (
          <p role="status" className={`text-xs font-bold ${message.ok ? "text-emerald-700" : "text-rose-700"}`}>
            {message.text}
          </p>
        )}
      </form>
    </section>
  );
};
