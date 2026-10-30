import React, { useState } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";
import { cloud } from "../lib/cloud";

// ============================================================
// KHU QUẢN TRỊ (chỉ hiện với tài khoản admin)
// Đặt lại mật khẩu cho học sinh quên mật khẩu (cần đã cài kho dữ liệu Upstash)
// ============================================================
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
    <div className="p-5 rounded-3xl bg-white border-2 border-dashed border-indigo-200 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-indigo-600 text-white">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-extrabold text-slate-900">Khu quản trị (chỉ admin thấy)</h4>
          <p className="text-xs text-slate-500">Sửa sách: vào mục "Môn học THCS" và bấm cây bút trên từng cuốn.</p>
        </div>
      </div>
      <form onSubmit={handleReset} className="space-y-2">
        <div className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
          <KeyRound className="w-4 h-4 text-indigo-600" /> Đặt lại mật khẩu cho học sinh
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
            placeholder="ID đăng nhập của học sinh"
            className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={5}
            placeholder="Mật khẩu mới (ít nhất 5 ký tự)"
            className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            disabled={busy}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm transition cursor-pointer shrink-0"
          >
            {busy ? "Đang đặt..." : "Đặt lại"}
          </button>
        </div>
        {message && (
          <p className={`text-xs font-bold ${message.ok ? "text-emerald-700" : "text-rose-700"}`}>
            {message.ok ? "✅ " : "⚠️ "}
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
};
