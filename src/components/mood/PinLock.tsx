import React, { useEffect, useRef, useState } from "react";
import { Lock, LifeBuoy } from "lucide-react";
import { checkPin, waitSeconds } from "../../lib/pin";
import { cloud, isPrivateKey } from "../../lib/cloud";
import { SupportPanel } from "./SupportPanel";

// ============================================================
// MÀN HÌNH NHẬP MÃ PIN CỦA CÂY CẢM XÚC
// Quên mã PIN: chỉ có thể xóa dữ liệu cảm xúc trên máy này để đặt lại (không ai mở hộ được).
// Nút "Cần giúp ngay?" luôn dùng được, kể cả khi chưa mở khóa.
// ============================================================

export const PinLock: React.FC<{ userId: string; onUnlocked: () => void }> = ({ userId, onUnlocked }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [help, setHelp] = useState(false);
  const [forgot, setForgot] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => inputRef.current?.focus(), []);

  const submit = async (value: string) => {
    if (busy || value.length !== 4) return;
    const wait = waitSeconds(userId);
    if (wait > 0) {
      setError(`Bạn đã nhập sai nhiều lần. Đợi ${wait} giây rồi thử lại.`);
      return;
    }
    setBusy(true);
    const ok = await checkPin(userId, value);
    setBusy(false);
    if (ok) return onUnlocked();
    setPin("");
    const w = waitSeconds(userId);
    setError(w > 0 ? `Sai 5 lần liên tiếp. Đợi ${w} giây rồi thử lại.` : "Mã PIN chưa đúng. Bạn thử lại nhé.");
    inputRef.current?.focus();
  };

  const resetAll = () => {
    cloud
      .keysFor(userId)
      .filter(isPrivateKey)
      .forEach((k) => {
        try {
          localStorage.removeItem(k);
        } catch {}
      });
    onUnlocked();
  };

  return (
    <div className="max-w-md mx-auto space-y-4 pb-6 pt-2">
      <section className="rounded-2xl bg-sun-card border border-sun-line p-6 space-y-4 text-center animate-rise">
        <span className="mx-auto w-14 h-14 rounded-2xl bg-leaf-deep text-white flex items-center justify-center">
          <Lock className="w-7 h-7" />
        </span>
        <div>
          <h2 className="text-xl font-extrabold text-navy">Cây cảm xúc đang được khóa</h2>
          <p className="text-sm text-muted mt-1">Nhập mã PIN 4 số bạn đã đặt để mở.</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(pin);
          }}
          className="space-y-3"
        >
          <label className="block">
            <span className="sr-only">Mã PIN</span>
            <input
              ref={inputRef}
              value={pin}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                setPin(v);
                setError("");
                if (v.length === 4) submit(v);
              }}
              type="password"
              inputMode="numeric"
              autoComplete="off"
              maxLength={4}
              aria-label="Mã PIN 4 số"
              aria-invalid={Boolean(error)}
              className="w-44 mx-auto block text-center tracking-[0.6em] text-2xl font-bold px-4 py-3 rounded-xl border border-sun-line bg-white focus:outline-none focus:ring-2 focus:ring-leaf-deep"
            />
          </label>
          {error && (
            <p role="alert" className="text-sm text-rose-700">
              {error}
            </p>
          )}
          <button type="submit" disabled={busy || pin.length !== 4} className="min-h-11 px-6 rounded-xl bg-leaf-deep hover:bg-leaf-dark disabled:opacity-50 text-white font-bold text-sm cursor-pointer">
            Mở khóa
          </button>
        </form>

        {!forgot ? (
          <button onClick={() => setForgot(true)} className="text-sm text-muted underline hover:text-navy cursor-pointer min-h-10">
            Quên mã PIN?
          </button>
        ) : (
          <div className="text-left p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-3">
            <p className="text-sm text-amber-900">
              Mã PIN không lấy lại được, kể cả giáo viên. Bạn có thể <b>xóa toàn bộ dữ liệu cảm xúc trên máy này</b> (check-in, ghi chú, cây, mã PIN) để bắt đầu lại.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => window.confirm("Xóa hẳn dữ liệu cảm xúc trên máy này? Việc này không hoàn tác được.") && resetAll()}
                className="min-h-10 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold cursor-pointer"
              >
                Xóa và bắt đầu lại
              </button>
              <button onClick={() => setForgot(false)} className="min-h-10 px-4 rounded-xl bg-white border border-sun-line text-navy text-sm font-semibold cursor-pointer">
                Thôi, mình nhớ ra rồi
              </button>
            </div>
          </div>
        )}
      </section>

      <button
        onClick={() => setHelp(!help)}
        aria-expanded={help}
        className="w-full min-h-11 px-4 rounded-xl bg-white border border-sun-line hover:border-rose-300 text-rose-700 text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
      >
        <LifeBuoy className="w-4 h-4" /> Cần giúp ngay?
      </button>
      {help && <SupportPanel message="Nếu bạn đang gặp chuyện khó khăn hoặc không an toàn, hãy nói với người lớn bạn tin hoặc gọi số dưới đây." />}
    </div>
  );
};
