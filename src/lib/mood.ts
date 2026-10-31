// ============================================================
// CÂY CẢM XÚC: lưu trữ và cách cây phát triển
// - Dữ liệu chỉ lưu TRÊN MÁY (khóa có chữ "_mood_" nên không bao giờ được đồng bộ, xem lib/cloud.ts)
// - Chế độ khách: chỉ giữ tạm trong bộ nhớ (đóng hoặc tải lại trang là mất), không ghi vào máy
// - Cây có 2 lớp:
//   1. DÁNG CÂY đổi ngay theo cảm xúc vừa check-in (xem moodForm):
//      Nắng nhẹ, Cầu vồng → "sáng" (lá vươn, trời sáng, có thể nở hoa)
//      Có mây (hoặc tự gọi tên) → "dịu" (giữ nguyên)
//      Mưa, Gió mạnh, Sấm chớp → "nặng nề" (lá rũ, trời tối hơn)
//   2. ĐỘ HÉO (0–3): mỗi lần check-in nặng nề héo thêm 1 mức (tối đa 2 mức mỗi ngày);
//      mỗi hoạt động chăm sóc bản thân hồi 1 mức; tâm sự với AI hồi tối đa 1 mức mỗi ngày.
//      Cây KHÔNG hồi chỉ vì em chọn cảm xúc vui (để em không phải giả vui cho cây đẹp).
// - Cây lớn lên nhờ check-in (cảm xúc nào cũng như nhau), chăm sóc bản thân, nhìn lại hành trình.
// - Tối đa 5 lần check-in mỗi ngày. Cây không bao giờ chết, không tụt giai đoạn.
// ============================================================
import { SELF_CARE, STAGES, WEATHERS, activityById, weatherById } from "../data/moodData";

export interface MoodEntry {
  id: string;
  at: string; // ISO
  weathers: string[];
  custom?: string;
  causes: string[];
  want?: string;
  note?: string;
}

export interface CareRecord {
  id: string;
  activityId: string;
  at: string;
  fit?: "hop" | "binh-thuong" | "chua-hop";
}

export interface SavedNote {
  id: string;
  at: string;
  title: string;
  text: string;
}

export interface MoodState {
  version: 3;
  entries: MoodEntry[];
  care: CareRecord[];
  notes: SavedNote[];
  chatCare: number; // số lần tâm sự có phản hồi (không lưu nội dung)
  reviews: string[]; // ngày (YYYY-MM-DD) em nhìn lại hành trình
  wilted: boolean; // = wilt > 0 (giữ để tương thích dữ liệu cũ)
  wiltWeather?: string;
  /** Độ héo 0..3 */
  wilt: number;
  /** Ngày và số mức đã héo thêm trong ngày đó (tối đa 2) */
  wiltDay?: string;
  wiltToday: number;
  /** Ngày tâm sự gần nhất đã giúp cây hồi 1 mức */
  chatHealDay?: string;
  recovered: number;
}

export type MoodForm = "sang" | "diu" | "nang-ne";
export const MAX_CHECKINS_PER_DAY = 5;
export const MAX_WILT = 3;

export const moodKey = (userId: string) => `user_${userId}_mood_v3`;

export const emptyMood = (): MoodState => ({
  version: 3,
  entries: [],
  care: [],
  notes: [],
  chatCare: 0,
  reviews: [],
  wilted: false,
  wilt: 0,
  wiltToday: 0,
  recovered: 0,
});

const newId = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
export const dayKey = (d: Date | string) => {
  const x = typeof d === "string" ? new Date(d) : d;
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
};

// Nhật ký cũ (bản trước): đổi cảm xúc sang "thời tiết" gần nhất
const OLD_TO_WEATHER: Record<string, string> = {
  "Vui Vẻ": "nang", "Hào Hứng": "nang", "Bình Thường": "may", "Mệt Mỏi": "may",
  "Buồn Chán": "mua", "Áp Lực Thi Cử": "gio", "Lo Lắng Bài Vở": "gio", "Bực Tức": "sam",
};

function migrateOld(userId: string): MoodEntry[] {
  try {
    const old = JSON.parse(localStorage.getItem(`user_${userId}_mood_logs`) || "[]");
    if (!Array.isArray(old)) return [];
    return old
      .map((l: any): MoodEntry | null => {
        const w = OLD_TO_WEATHER[l?.mood];
        if (!w || typeof l?.date !== "string") return null;
        const [d, m, y] = l.date.split("/").map(Number);
        const [hh = 12, mm = 0] = String(l.time || "").split(":").map(Number);
        const at = new Date(y, (m || 1) - 1, d || 1, hh, mm);
        if (isNaN(at.getTime())) return null;
        const isAuto = typeof l.note === "string" && /^Cảm xúc .*Mức áp lực/.test(l.note);
        return { id: String(l.id || newId("old")), at: at.toISOString(), weathers: [w], causes: [], note: isAuto ? undefined : l.note || undefined };
      })
      .filter(Boolean) as MoodEntry[];
  } catch {
    return [];
  }
}

const arr = <T,>(v: any, ok: (x: any) => boolean): T[] => (Array.isArray(v) ? v.filter(ok) : []);

// ---------- Chế độ khách: chỉ giữ tạm trong bộ nhớ ----------
const guestMemory = new Map<string, MoodState>();
export function loadGuestMood(userId: string): MoodState {
  // Xóa dữ liệu cảm xúc khách từng lưu trên máy ở bản cũ
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(`user_${userId}_`) && /_mood_(v3|logs)$/.test(k))
      .forEach((k) => localStorage.removeItem(k));
  } catch {}
  return guestMemory.get(userId) || emptyMood();
}
export function saveGuestMood(userId: string, s: MoodState): void {
  guestMemory.set(userId, s);
}

export function loadMood(userId: string): MoodState {
  const base = emptyMood();
  try {
    const raw = JSON.parse(localStorage.getItem(moodKey(userId)) || "null");
    if (!raw || typeof raw !== "object") {
      const migrated = migrateOld(userId);
      return migrated.length ? { ...base, entries: migrated.sort((a, b) => b.at.localeCompare(a.at)) } : base;
    }
    return {
      ...base,
      entries: arr<MoodEntry>(raw.entries, (e) => e && typeof e.at === "string" && Array.isArray(e.weathers)),
      care: arr<CareRecord>(raw.care, (c) => c && typeof c.at === "string" && activityById(c.activityId)),
      notes: arr<SavedNote>(raw.notes, (n) => n && typeof n.text === "string"),
      chatCare: Number(raw.chatCare) || 0,
      reviews: arr<string>(raw.reviews, (r) => typeof r === "string"),
      wiltWeather: typeof raw.wiltWeather === "string" ? raw.wiltWeather : undefined,
      // Dữ liệu cũ chỉ có wilted (đúng/sai): đổi thành độ héo 1
      ...(() => {
        const w = Number.isFinite(Number(raw.wilt)) ? Math.max(0, Math.min(MAX_WILT, Math.round(Number(raw.wilt)))) : raw.wilted ? 1 : 0;
        return { wilt: w, wilted: w > 0 };
      })(),
      wiltDay: typeof raw.wiltDay === "string" ? raw.wiltDay : undefined,
      wiltToday: Number(raw.wiltToday) || 0,
      chatHealDay: typeof raw.chatHealDay === "string" ? raw.chatHealDay : undefined,
      recovered: Number(raw.recovered) || 0,
    };
  } catch {
    return base;
  }
}

export function saveMood(userId: string, s: MoodState) {
  try {
    localStorage.setItem(moodKey(userId), JSON.stringify(s));
  } catch {}
}

// ---------- Điểm phát triển ----------
export function growthPoints(s: MoodState): number {
  // Check-in: tính tối đa 3 lần mỗi ngày (để cây không lớn nhờ bấm liên tục)
  const perDay: Record<string, number> = {};
  for (const e of s.entries) perDay[dayKey(e.at)] = Math.min(3, (perDay[dayKey(e.at)] || 0) + 1);
  const checkins = Object.values(perDay).reduce((a, b) => a + b, 0);
  return checkins + s.care.length * 2 + s.chatCare + s.reviews.length * 2;
}

export function stageIndex(s: MoodState): number {
  const pts = growthPoints(s);
  let idx = 0;
  STAGES.forEach((st, i) => {
    if (pts >= st.min) idx = i;
  });
  // Từ "Cây non" trở lên cần đã thử ít nhất 1 hoạt động chăm sóc
  if (idx >= 2 && s.care.length === 0) idx = 1;
  return idx;
}

export function unlockedDecor(s: MoodState): string[] {
  const groups = new Set(s.care.map((c) => activityById(c.activityId)?.group).filter(Boolean));
  const out: string[] = [];
  if (s.care.length >= 1) out.push("hoa");
  if (groups.size >= 2) out.push("buom");
  if (s.reviews.length >= 1) out.push("den");
  if (groups.size >= 3) out.push("domdom");
  if (s.care.length >= 5) out.push("chim");
  if (s.recovered >= 1) out.push("cauvong");
  return out;
}

// ---------- Dáng cây theo cảm xúc vừa check-in ----------
export function formOf(weathers: string[]): MoodForm {
  const ws = weathers.map((w) => weatherById(w)).filter(Boolean);
  const heavy = ws.filter((w) => w!.heavy).length;
  const bright = ws.filter((w) => w!.id === "nang" || w!.id === "cauvong").length;
  if (heavy > ws.length - heavy) return "nang-ne";
  if (bright > 0 && heavy === 0) return "sang";
  return "diu";
}
/** Dáng hiện tại = theo lần check-in gần nhất */
export const moodForm = (s: MoodState): MoodForm => (s.entries[0] ? formOf(s.entries[0].weathers) : "diu");

export const checkinsToday = (s: MoodState) => s.entries.filter((e) => dayKey(e.at) === dayKey(new Date())).length;

// ---------- Thao tác ----------
export function addEntry(s: MoodState, e: Omit<MoodEntry, "id" | "at">): MoodState {
  if (checkinsToday(s) >= MAX_CHECKINS_PER_DAY) return s; // đủ 5 lần hôm nay
  const entry: MoodEntry = { ...e, id: newId("ci"), at: new Date().toISOString() };
  const next: MoodState = { ...s, entries: [entry, ...s.entries].slice(0, 400) };
  if (formOf(e.weathers) !== "nang-ne") return next; // cảm xúc nhẹ nhàng KHÔNG tự làm cây hồi
  const today = dayKey(new Date());
  const usedToday = s.wiltDay === today ? s.wiltToday : 0;
  const heavy = e.weathers.map((w) => weatherById(w)).find((w) => w?.heavy);
  if (usedToday >= 2 || s.wilt >= MAX_WILT) return { ...next, wiltWeather: heavy?.id || s.wiltWeather };
  const wilt = s.wilt + 1;
  return { ...next, wilt, wilted: true, wiltWeather: heavy?.id || s.wiltWeather, wiltDay: today, wiltToday: usedToday + 1 };
}

/** Chăm sóc bản thân: cây hồi 1 mức (về 0 thì tính là một lần "tươi lại") */
function heal(s: MoodState): MoodState {
  if (s.wilt <= 0) return s;
  const wilt = s.wilt - 1;
  return { ...s, wilt, wilted: wilt > 0, recovered: wilt === 0 ? s.recovered + 1 : s.recovered };
}

export function addCare(s: MoodState, activityId: string, fit?: CareRecord["fit"]): MoodState {
  return heal({ ...s, care: [{ id: newId("cr"), activityId, at: new Date().toISOString(), fit }, ...s.care].slice(0, 400) });
}

/** Một lượt tâm sự có phản hồi: cây lớn thêm; hồi tối đa 1 mức mỗi ngày nhờ tâm sự */
export function addChatCare(s: MoodState): MoodState {
  const n = { ...s, chatCare: s.chatCare + 1 };
  const today = dayKey(new Date());
  if (s.wilt <= 0 || s.chatHealDay === today) return n;
  return { ...heal(n), chatHealDay: today };
}

export function addReview(s: MoodState): MoodState {
  const today = dayKey(new Date());
  return s.reviews.includes(today) ? s : { ...s, reviews: [...s.reviews, today] };
}

/** Các mốc cá nhân, tính từ dữ liệu thật */
export function milestones(s: MoodState): { text: string; at: string }[] {
  const out: { text: string; at: string }[] = [];
  const oldest = <T extends { at: string }>(l: T[]) => [...l].sort((a, b) => a.at.localeCompare(b.at))[0];
  const e = oldest(s.entries);
  if (e) out.push({ text: "Lần đầu quan sát cảm xúc", at: e.at });
  const c = oldest(s.care);
  if (c) out.push({ text: `Lần đầu thử chăm sóc bản thân: ${activityById(c.activityId)?.name}`, at: c.at });
  const n = oldest(s.notes);
  if (n) out.push({ text: "Lần đầu lưu một ghi chú", at: n.at });
  const seen = new Set<string>();
  [...s.care].sort((a, b) => a.at.localeCompare(b.at)).forEach((r) => {
    const g = activityById(r.activityId)?.group;
    if (g && !seen.has(g) && seen.size > 0) out.push({ text: `Thử một kiểu hoạt động mới: ${activityById(r.activityId)?.name}`, at: r.at });
    if (g) seen.add(g);
  });
  if (s.reviews[0]) out.push({ text: "Lần đầu nhìn lại hành trình", at: new Date(s.reviews[0]).toISOString() });
  return out.sort((a, b) => b.at.localeCompare(a.at));
}

export const allWeatherIds = WEATHERS.map((w) => w.id);
export const allActivityIds = SELF_CARE.map((a) => a.id);
