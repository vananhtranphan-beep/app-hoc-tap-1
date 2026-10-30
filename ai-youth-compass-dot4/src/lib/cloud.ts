// ============================================================
// ĐỒNG BỘ DỮ LIỆU TÀI KHOẢN LÊN MÁY CHỦ
// - Đăng nhập: tải dữ liệu của em từ máy chủ về máy đang dùng
// - Mỗi khi dữ liệu thay đổi (nhật ký cảm xúc, điểm, kế hoạch...): tự lưu lên máy chủ
// - Chưa cài kho dữ liệu trên Vercel thì web vẫn chạy như cũ (chỉ lưu trên máy)
// Các component vẫn đọc/ghi localStorage như bình thường, file này lo phần đồng bộ.
// ============================================================

const SESSIONS_KEY = "ai_study_hub_cloud_sessions"; // { [studentId]: token }
const DIRTY_PREFIX = "cloud_dirty_"; // có thay đổi chưa lưu lên máy chủ

// Dữ liệu RIÊNG TƯ (cảm xúc, nhật ký, cây cảm xúc): chỉ lưu trên máy của em,
// KHÔNG BAO GIỜ đồng bộ lên máy chủ. Máy chủ cũng tự chặn các khóa này (api/_db.js).
export const isPrivateKey = (key: string) => /_(mood_|emotion_|selfcare_|garden_)/.test(key);

export type CloudStatus = "local" | "saving" | "saved" | "error";
export type CloudResult =
  | { ok: true; profile: any; data: Record<string, string> }
  | { ok: false; reason: "no_db" | "network" | "not_found" | "wrong" | "exists" | "invalid" | "rate"; message: string };

// Ghi localStorage gốc (không kích hoạt đồng bộ)
const rawSet = Storage.prototype.setItem;
const rawRemove = Storage.prototype.removeItem;
const store = {
  get: (k: string) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k: string, v: string) => {
    try {
      rawSet.call(localStorage, k, v);
    } catch {}
  },
  remove: (k: string) => {
    try {
      rawRemove.call(localStorage, k);
    } catch {}
  },
};

const readSessions = (): Record<string, string> => {
  try {
    return JSON.parse(store.get(SESSIONS_KEY) || "{}") || {};
  } catch {
    return {};
  }
};
const writeSessions = (s: Record<string, string>) => store.set(SESSIONS_KEY, JSON.stringify(s));

let activeUser: string | null = null;
let saveTimer: ReturnType<typeof setTimeout> | null = null;
let status: CloudStatus = "local";
const listeners = new Set<(s: CloudStatus) => void>();
const justSynced = new Set<string>();

const setStatus = (s: CloudStatus) => {
  status = s;
  listeners.forEach((fn) => fn(s));
};

// Các khóa dữ liệu thuộc về 1 tài khoản: user_<id>_... (và bản chữ thường của id)
const prefixesFor = (id: string) => Array.from(new Set([`user_${id}_`, `user_${id.toLowerCase()}_`]));

const keysOf = (id: string): string[] => {
  const mine = prefixesFor(id);
  // Loại trừ tài khoản khác có ID dài hơn bắt đầu giống (VD "nam" và "nam_2026")
  let others: string[] = [];
  try {
    const list = JSON.parse(store.get("ai_study_hub_accounts_list") || "[]");
    others = list
      .map((a: any) => String(a.studentId || ""))
      .filter((o: string) => o && o.toLowerCase() !== id.toLowerCase())
      .flatMap((o: string) => prefixesFor(o))
      .filter((p: string) => mine.some((m) => p.startsWith(m)));
  } catch {}
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && mine.some((p) => k.startsWith(p)) && !others.some((p) => k.startsWith(p))) keys.push(k);
  }
  return keys;
};

const collect = (id: string) => {
  const data: Record<string, string> = {};
  keysOf(id).forEach((k) => {
    if (isPrivateKey(k)) return; // nhật ký cảm xúc không rời khỏi máy
    const v = store.get(k);
    if (v !== null) data[k] = v;
  });
  return data;
};

const apply = (id: string, data: Record<string, string>) => {
  const allowed = prefixesFor(id);
  Object.entries(data || {}).forEach(([k, v]) => {
    if (isPrivateKey(k)) return; // bỏ qua bản cảm xúc cũ từng lỡ lưu trên máy chủ
    if (typeof v === "string" && allowed.some((p) => k.startsWith(p))) store.set(k, v);
  });
};

async function post(path: string, body: any, token?: string): Promise<{ status: number; json: any }> {
  const payload = JSON.stringify(body);
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: payload,
    // keepalive giúp lưu được cả khi em đóng tab, nhưng trình duyệt chỉ cho phép gói nhỏ hơn 64KB
    keepalive: payload.length < 60000,
  });
  const json = await res.json().catch(() => null);
  return { status: res.status, json };
}

// Máy chủ chưa có kho dữ liệu (hoặc chưa có API) => dùng chế độ lưu trên máy
const isNoDb = (r: { status: number; json: any }) =>
  !r.json || r.status === 503 || (r.status === 404 && r.json.error !== "not_found");

// Theo dõi mọi lần ghi localStorage để tự lưu lên máy chủ
let patched = false;
function patchStorage() {
  if (patched) return;
  patched = true;
  Storage.prototype.setItem = function (key: string, value: string) {
    const changed = this === localStorage && activeUser ? this.getItem(key) !== String(value) : false;
    rawSet.call(this, key, value);
    if (changed) onLocalChange(key);
  };
  Storage.prototype.removeItem = function (key: string) {
    const had = this === localStorage && activeUser ? this.getItem(key) !== null : false;
    rawRemove.call(this, key);
    if (had) onLocalChange(key);
  };
  const flushNow = () => {
    if (activeUser && store.get(DIRTY_PREFIX + activeUser)) cloud.flush();
  };
  window.addEventListener("pagehide", flushNow);
  document.addEventListener("visibilitychange", () => document.visibilityState === "hidden" && flushNow());
}

function onLocalChange(key: string) {
  if (!activeUser || !prefixesFor(activeUser).some((p) => key.startsWith(p))) return;
  if (isPrivateKey(key)) return; // thay đổi cảm xúc không cần lưu lên máy chủ
  store.set(DIRTY_PREFIX + activeUser, "1");
  if (saveTimer) clearTimeout(saveTimer);
  setStatus("saving");
  saveTimer = setTimeout(() => cloud.flush(), 1500);
}

export const cloud = {
  status: () => status,
  subscribe(fn: (s: CloudStatus) => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  hasSession: (id: string) => Boolean(readSessions()[id]),
  token: (id: string): string | null => readSessions()[id] || null,

  async login(studentId: string, password: string): Promise<CloudResult> {
    try {
      const r = await post("/api/auth", { action: "login", studentId, password });
      if (isNoDb(r)) return { ok: false, reason: "no_db", message: "" };
      if (r.status === 404) return { ok: false, reason: "not_found", message: "ID này chưa có trên hệ thống." };
      if (r.status === 401) return { ok: false, reason: "wrong", message: r.json.error };
      if (r.status === 429) return { ok: false, reason: "rate", message: r.json.error };
      if (r.status !== 200) return { ok: false, reason: "network", message: r.json?.error || "Lỗi máy chủ" };
      const id = r.json.profile.studentId;
      apply(id, r.json.data);
      writeSessions({ ...readSessions(), [id]: r.json.token });
      store.remove(DIRTY_PREFIX + id);
      justSynced.add(id);
      return { ok: true, profile: r.json.profile, data: r.json.data };
    } catch {
      return { ok: false, reason: "network", message: "Không kết nối được máy chủ." };
    }
  },

  async register(profile: any, password: string, uploadLocalData = false): Promise<CloudResult> {
    try {
      const r = await post("/api/auth", { action: "register", profile, password });
      if (isNoDb(r)) return { ok: false, reason: "no_db", message: "" };
      if (r.status === 409) return { ok: false, reason: "exists", message: r.json.error };
      if (r.status === 400) return { ok: false, reason: "invalid", message: r.json.error };
      if (r.status !== 200) return { ok: false, reason: "network", message: r.json?.error || "Lỗi máy chủ" };
      const id = r.json.profile.studentId;
      writeSessions({ ...readSessions(), [id]: r.json.token });
      justSynced.add(id);
      if (uploadLocalData) {
        // Tài khoản cũ chỉ lưu trên máy: đưa toàn bộ dữ liệu cũ lên máy chủ
        await post("/api/data", { action: "save", data: collect(id) }, r.json.token).catch(() => null);
      }
      return { ok: true, profile: r.json.profile, data: {} };
    } catch {
      return { ok: false, reason: "network", message: "Không kết nối được máy chủ." };
    }
  },

  // Mở lại web khi vẫn còn đăng nhập: có thay đổi chưa lưu thì đẩy lên, không thì tải bản mới nhất về
  async resume(id: string): Promise<void> {
    const token = readSessions()[id];
    if (!token) return;
    if (justSynced.has(id)) {
      justSynced.delete(id);
      return;
    }
    try {
      if (store.get(DIRTY_PREFIX + id)) {
        activeUser = id;
        await cloud.flush();
        return;
      }
      const r = await post("/api/data", { action: "load" }, token);
      if (r.status === 401) {
        const s = readSessions();
        delete s[id];
        writeSessions(s);
        return;
      }
      if (r.status === 200) {
        apply(id, r.json.data);
        setStatus("saved");
      }
    } catch {
      setStatus("error");
    }
  },

  startSync(id: string) {
    patchStorage();
    activeUser = readSessions()[id] ? id : null;
    setStatus(activeUser ? (store.get(DIRTY_PREFIX + id) ? "saving" : "saved") : "local");
  },

  stopSync() {
    activeUser = null;
    setStatus("local");
  },

  async flush(): Promise<boolean> {
    const id = activeUser;
    if (!id) return true;
    const token = readSessions()[id];
    if (!token) return false;
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }
    try {
      setStatus("saving");
      const r = await post("/api/data", { action: "save", data: collect(id) }, token);
      if (r.status === 200) {
        store.remove(DIRTY_PREFIX + id);
        setStatus("saved");
        return true;
      }
      setStatus("error");
      return false;
    } catch {
      setStatus("error");
      return false;
    }
  },

  async saveProfile(id: string, profile: any) {
    const token = readSessions()[id];
    if (!token) return;
    await post("/api/data", { action: "saveProfile", profile }, token).catch(() => null);
  },

  // Đăng xuất: lưu nốt lên máy chủ rồi xóa dữ liệu khỏi máy này (để bạn khác dùng chung máy không xem được)
  async logout(id: string): Promise<boolean> {
    const token = readSessions()[id];
    if (!token) return false;
    activeUser = id;
    const saved = await cloud.flush();
    if (!saved) {
      activeUser = null;
      setStatus("local");
      return false;
    }
    await post("/api/auth", { action: "logout" }, token).catch(() => null);
    // Xóa dữ liệu đã có bản trên máy chủ; giữ lại dữ liệu cảm xúc (chỉ có ở máy này, xóa là mất hẳn)
    keysOf(id).forEach((k) => {
      if (!isPrivateKey(k)) store.remove(k);
    });
    const s = readSessions();
    delete s[id];
    writeSessions(s);
    activeUser = null;
    setStatus("local");
    return true;
  },

  /** Các khóa dữ liệu của một tài khoản trên máy này (dùng cho trang Quyền riêng tư) */
  keysFor: (id: string): string[] => keysOf(id),

  /** Xóa tài khoản trên máy chủ (cần mật khẩu), rồi xóa mọi dữ liệu của tài khoản trên máy này */
  async deleteAccount(id: string, password: string): Promise<{ ok: true } | { ok: false; message: string }> {
    const token = readSessions()[id];
    if (!token) return { ok: false, message: "Tài khoản này chưa đăng nhập máy chủ trên máy này." };
    try {
      if (saveTimer) {
        clearTimeout(saveTimer);
        saveTimer = null;
      }
      const r = await post("/api/auth", { action: "deleteAccount", password }, token);
      if (r.status !== 200) return { ok: false, message: r.json?.error || "Chưa xóa được, bạn thử lại sau nhé." };
    } catch {
      return { ok: false, message: "Không kết nối được máy chủ. Bạn kiểm tra mạng rồi thử lại." };
    }
    if (activeUser === id) activeUser = null;
    cloud.forgetOnDevice(id);
    setStatus("local");
    return { ok: true };
  },

  // Xóa tài khoản khỏi máy này (không xóa trên máy chủ)
  forgetOnDevice(id: string) {
    keysOf(id).forEach((k) => store.remove(k));
    store.remove(DIRTY_PREFIX + id);
    const s = readSessions();
    delete s[id];
    writeSessions(s);
  },
};
