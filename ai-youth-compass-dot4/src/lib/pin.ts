// ============================================================
// MÃ PIN 4 SỐ (TÙY CHỌN) KHÓA CÂY CẢM XÚC KHI DÙNG CHUNG MÁY
// - Chỉ lưu bản băm của mã PIN, trên máy này (khóa có "_mood_" nên KHÔNG BAO GIỜ đồng bộ lên máy chủ)
// - Mở khóa một lần cho tới khi tải lại trang, đăng xuất hoặc bấm "Khóa lại"
// - Đây là khóa nhẹ để người dùng chung máy không vô tình xem, không phải mã hóa dữ liệu
// ============================================================

const pinKey = (userId: string) => `user_${userId}_mood_pin`;
const unlocked = new Set<string>();
const wrong = new Map<string, { count: number; until: number }>();

type Stored = { salt: string; hash: string };

const read = (userId: string): Stored | null => {
  try {
    const v = JSON.parse(localStorage.getItem(pinKey(userId)) || "null");
    return v && typeof v.salt === "string" && typeof v.hash === "string" ? v : null;
  } catch {
    return null;
  }
};

async function digest(text: string): Promise<string> {
  try {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    // Trình duyệt cũ không có crypto.subtle: dùng băm đơn giản
    let h = 5381;
    for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) >>> 0;
    return "f" + h.toString(16);
  }
}

const randomSalt = () => {
  try {
    return Array.from(crypto.getRandomValues(new Uint8Array(12)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return Math.random().toString(16).slice(2);
  }
};

export const isValidPin = (pin: string) => /^\d{4}$/.test(pin);
export const hasPin = (userId: string) => read(userId) !== null;
export const isUnlocked = (userId: string) => !hasPin(userId) || unlocked.has(userId);
export const lockNow = (userId: string) => unlocked.delete(userId);

export async function setPin(userId: string, pin: string): Promise<boolean> {
  if (!isValidPin(pin)) return false;
  const salt = randomSalt();
  const hash = await digest(`${salt}:${pin}`);
  try {
    localStorage.setItem(pinKey(userId), JSON.stringify({ salt, hash }));
  } catch {
    return false;
  }
  unlocked.add(userId);
  return true;
}

export function removePin(userId: string) {
  try {
    localStorage.removeItem(pinKey(userId));
  } catch {}
  unlocked.delete(userId);
  wrong.delete(userId);
}

/** Số giây còn phải chờ sau 5 lần nhập sai liên tiếp (0 = được thử) */
export const waitSeconds = (userId: string) => Math.max(0, Math.ceil(((wrong.get(userId)?.until || 0) - Date.now()) / 1000));

export async function checkPin(userId: string, pin: string): Promise<boolean> {
  const s = read(userId);
  if (!s) return true;
  if (waitSeconds(userId) > 0) return false;
  const ok = (await digest(`${s.salt}:${pin}`)) === s.hash;
  if (ok) {
    unlocked.add(userId);
    wrong.delete(userId);
    return true;
  }
  const w = wrong.get(userId) || { count: 0, until: 0 };
  w.count += 1;
  if (w.count >= 5) {
    w.count = 0;
    w.until = Date.now() + 30_000;
  }
  wrong.set(userId, w);
  return false;
}

/** Khóa dữ liệu cảm xúc trên máy (dùng khi xóa nhóm Cảm xúc). Có tham số để giữ hoặc bỏ mã PIN. */
export const isMoodPinKey = (key: string) => key.endsWith("_mood_pin");
