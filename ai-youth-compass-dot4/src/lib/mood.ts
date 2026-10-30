// ============================================================
// CÂY CẢM XÚC: lưu trữ và cách cây phát triển
// - Dữ liệu chỉ lưu TRÊN MÁY (khóa có chữ "_mood_" nên không bao giờ được đồng bộ, xem lib/cloud.ts)
// - Cây lớn lên nhờ check-in, hoạt động chăm sóc, nhìn lại hành trình (không theo chuỗi ngày)
// - Cảm xúc nặng nề làm cây rũ lá; cây tươi lại khi em làm một việc chăm sóc bản thân.
//   Cây KHÔNG tươi lên chỉ vì em chọn cảm xúc vui (để em không phải giả vui).
// - Cây không bao giờ chết, không tụt giai đoạn.
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
  wilted: boolean;
  wiltWeather?: string;
  recovered: number;
  theme: string;
}

export const moodKey = (userId: string) => `user_${userId}_mood_v3`;

export const emptyMood = (): MoodState => ({
  version: 3,
  entries: [],
  care: [],
  notes: [],
  chatCare: 0,
  reviews: [],
  wilted: false,
  recovered: 0,
  theme: "rung",
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
      wilted: Boolean(raw.wilted),
      wiltWeather: typeof raw.wiltWeather === "string" ? raw.wiltWeather : undefined,
      recovered: Number(raw.recovered) || 0,
      theme: typeof raw.theme === "string" ? raw.theme : "rung",
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
  if (s.reviews.length >= 1) out.push("chau");
  if (groups.size >= 3) out.push("domdom");
  if (s.care.length >= 5) out.push("chim");
  if (s.recovered >= 1) out.push("cauvong");
  return out;
}

// ---------- Thao tác ----------
export function addEntry(s: MoodState, e: Omit<MoodEntry, "id" | "at">): MoodState {
  const entry: MoodEntry = { ...e, id: newId("ci"), at: new Date().toISOString() };
  const heavy = e.weathers.map((w) => weatherById(w)).find((w) => w?.heavy);
  return {
    ...s,
    entries: [entry, ...s.entries].slice(0, 400),
    // Cảm xúc nặng nề: cây rũ lá. Cảm xúc nhẹ nhàng KHÔNG tự làm cây tươi lại.
    wilted: heavy ? true : s.wilted,
    wiltWeather: heavy ? heavy.id : s.wiltWeather,
  };
}

/** Làm một việc chăm sóc (hoạt động hoặc một lượt tâm sự): cây tươi lại */
function revive(s: MoodState): MoodState {
  return s.wilted ? { ...s, wilted: false, recovered: s.recovered + 1 } : s;
}

export function addCare(s: MoodState, activityId: string, fit?: CareRecord["fit"]): MoodState {
  return revive({ ...s, care: [{ id: newId("cr"), activityId, at: new Date().toISOString(), fit }, ...s.care].slice(0, 400) });
}

export const addChatCare = (s: MoodState): MoodState => revive({ ...s, chatCare: s.chatCare + 1 });

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
