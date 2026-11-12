// ============================================================
// LOGIC HƯỚNG NGHIỆP: lưu tiến độ, tính điểm 6 nhóm, xác định mã Holland, gợi ý nghề
// Nguyên tắc: điểm, mã Holland và danh sách nghề đều do WEB TÍNH theo công thức cố định
// (cùng câu trả lời luôn ra cùng kết quả). AI chỉ diễn giải kết quả, không tính điểm,
// không được gợi ý nghề ngoài danh sách.
// ============================================================
import {
  CAREERS,
  type Career,
  FLAT_GAP,
  INTEREST_ITEMS,
  MAX_SCORE,
  RIASEC,
  RIASEC_ORDER,
  type RiasecCode,
} from "../data/careerData";

export interface ChatMsg {
  role: "user" | "model";
  content: string;
  apiContent?: string; // nội dung thật gửi cho AI (khi khác nội dung hiển thị)
}

export interface CareerState {
  version: 4;
  answers: Record<number, number>; // số câu → 1..5
  quizIndex: number;
  profile: { subjects: string[]; activities: string[]; after9: string; dream: string };
  completedAt?: string;
  saved: string[];
  compare: string[];
  experiences: Record<string, { status: "doing" | "done"; reflection: string; fit?: "hop" | "phan-van" | "chua-hop"; doneAt?: string }>;
  plan: { id: string; text: string; done: boolean; createdAt: string }[];
  chat: ChatMsg[];
  /** Nhận xét tổng quan của AI, gắn với lần làm phiếu (basis = completedAt) để không gọi AI lại mỗi lần mở trang */
  aiSummary?: { text: string; basis: string };
  /** Đã bấm "Khám phá những nghề phù hợp với bạn" cho lần làm phiếu này (basis = completedAt) */
  revealed?: string;
}

export const emptyCareerState = (): CareerState => ({
  version: 4,
  answers: {},
  quizIndex: 0,
  profile: { subjects: [], activities: [], after9: "", dream: "" },
  saved: [],
  compare: [],
  experiences: {},
  plan: [],
  chat: [],
});

// v4: bộ câu hỏi mới (18 câu theo SGK). Dữ liệu v3 (30 câu cũ) không dùng lại được, chỉ giữ kế hoạch.
export const careerKey = (userId: string) => `user_${userId}_career_v4`;
const oldCareerKey = (userId: string) => `user_${userId}_career_v3`;

const arr = (v: any) => (Array.isArray(v) ? v.filter((x) => typeof x === "string") : []);
const str = (v: any, max: number) => (typeof v === "string" ? v.slice(0, max) : "");
const planOf = (raw: any): CareerState["plan"] => (Array.isArray(raw?.plan) ? raw.plan.filter((p: any) => p && typeof p.text === "string") : []);

/** Đọc tiến độ đã lưu; dữ liệu hỏng thì bắt đầu lại, không làm sập web */
export function loadCareerState(userId: string): CareerState {
  const base = emptyCareerState();
  try {
    const raw = JSON.parse(localStorage.getItem(careerKey(userId)) || "null");
    if (!raw || typeof raw !== "object") {
      const old = JSON.parse(localStorage.getItem(oldCareerKey(userId)) || "null");
      return old && typeof old === "object" ? { ...base, plan: planOf(old) } : base;
    }
    const answers: CareerState["answers"] = {};
    for (const [k, v] of Object.entries(raw.answers || {})) {
      const n = Number(k);
      if (INTEREST_ITEMS.some((i) => i.id === n) && typeof v === "number" && Number.isInteger(v) && v >= 1 && v <= 5) answers[n] = v;
    }
    const known = new Set(CAREERS.map((c) => c.id));
    return {
      ...base,
      answers,
      quizIndex: Math.min(Math.max(Number(raw.quizIndex) || 0, 0), INTEREST_ITEMS.length),
      profile: {
        subjects: arr(raw.profile?.subjects),
        activities: arr(raw.profile?.activities),
        after9: str(raw.profile?.after9, 80),
        dream: str(raw.profile?.dream, 200),
      },
      completedAt: typeof raw.completedAt === "string" ? raw.completedAt : undefined,
      saved: arr(raw.saved).filter((id) => known.has(id)),
      compare: arr(raw.compare).filter((id) => known.has(id)).slice(0, 3),
      experiences: raw.experiences && typeof raw.experiences === "object" ? raw.experiences : {},
      plan: planOf(raw),
      aiSummary:
        raw.aiSummary && typeof raw.aiSummary.text === "string" && typeof raw.aiSummary.basis === "string"
          ? { text: raw.aiSummary.text.slice(0, 6000), basis: raw.aiSummary.basis }
          : undefined,
      revealed: typeof raw.revealed === "string" ? raw.revealed : undefined,
      chat: Array.isArray(raw.chat) ? raw.chat.filter((m: any) => m && (m.role === "user" || m.role === "model") && typeof m.content === "string").slice(-40) : [],
    };
  } catch {
    return base;
  }
}

export function saveCareerState(userId: string, s: CareerState) {
  try {
    localStorage.setItem(careerKey(userId), JSON.stringify(s));
  } catch {}
}

// ---------- Điểm 6 nhóm: tổng 3 câu, từ 3 đến 15 ----------
export type Scores = Record<RiasecCode, { score: number; answered: number; unsure: number }>;

export function computeScores(answers: CareerState["answers"]): Scores {
  const s = Object.fromEntries(RIASEC_ORDER.map((c) => [c, { score: 0, answered: 0, unsure: 0 }])) as Scores;
  for (const item of INTEREST_ITEMS) {
    const v = answers[item.id];
    if (typeof v !== "number") continue;
    s[item.code].score += v;
    s[item.code].answered += 1;
    if (v === 3) s[item.code].unsure += 1;
  }
  return s;
}

export const answeredCount = (answers: CareerState["answers"]) => INTEREST_ITEMS.filter((i) => typeof answers[i.id] === "number").length;
/** Phải trả lời đủ 18 câu thì mới tính kết quả (mỗi nhóm chỉ có 3 câu, thiếu 1 câu là lệch) */
export const isComplete = (answers: CareerState["answers"]) => answeredCount(answers) === INTEREST_ITEMS.length;

/** Hạng của mỗi nhóm: 1 + số nhóm có điểm CAO HƠN. Hai nhóm bằng điểm thì cùng hạng. */
export function ranks(scores: Scores): Record<RiasecCode, number> {
  return Object.fromEntries(
    RIASEC_ORDER.map((c) => [c, 1 + RIASEC_ORDER.filter((o) => scores[o].score > scores[c].score).length]),
  ) as Record<RiasecCode, number>;
}

/** 6 nhóm xếp từ cao xuống thấp (bằng điểm thì giữ thứ tự R-I-A-S-E-C) */
export const sortedCodes = (scores: Scores): RiasecCode[] => [...RIASEC_ORDER].sort((a, b) => scores[b].score - scores[a].score);

/** Điểm các nhóm quá gần nhau: chưa rõ nét, web không đưa ra mã Holland */
export function isFlat(scores: Scores) {
  const vals = RIASEC_ORDER.map((c) => scores[c].score);
  return Math.max(...vals) - Math.min(...vals) < FLAT_GAP;
}

/** Mã Holland: các nhóm có hạng 1–3 (nếu đồng hạng ở vị trí thứ 3 thì có thể nhiều hơn 3 nhóm) */
export function topCodes(scores: Scores): RiasecCode[] {
  if (isFlat(scores)) return [];
  const r = ranks(scores);
  return sortedCodes(scores).filter((c) => r[c] <= 3);
}

/** Nhóm đứng đầu (có thể nhiều nhóm nếu bằng điểm) */
export function firstCodes(scores: Scores): RiasecCode[] {
  if (isFlat(scores)) return [];
  const r = ranks(scores);
  return RIASEC_ORDER.filter((c) => r[c] === 1);
}

/** Chữ hiển thị mã, VD "Kĩ thuật – Nghiên cứu – Nghiệp vụ"; đồng hạng ghi "Kĩ thuật / Nghiên cứu" */
export function codeLabel(scores: Scores): string {
  const tops = topCodes(scores);
  if (!tops.length) return "";
  const r = ranks(scores);
  const byRank = new Map<number, RiasecCode[]>();
  tops.forEach((c) => byRank.set(r[c], [...(byRank.get(r[c]) || []), c]));
  return [...byRank.keys()]
    .sort((a, b) => a - b)
    .map((k) => byRank.get(k)!.map((c) => RIASEC[c].name).join(" / "))
    .join(" – ");
}

// ---------- So mã của học sinh với mã của nghề ----------
// Rất phù hợp: nhóm đầu của nghề trùng nhóm đầu của học sinh VÀ có thêm ít nhất 1 nhóm trùng.
// Phù hợp: nhóm đầu của nghề nằm trong các nhóm hạng 1–3 của học sinh.
// Các nghề khác: không gợi ý (vẫn xem được trong danh mục).
export type MatchLevel = "rat-phu-hop" | "phu-hop";
export const LEVEL_LABEL: Record<MatchLevel, string> = { "rat-phu-hop": "Rất phù hợp", "phu-hop": "Phù hợp" };

export interface Suggestion {
  career: Career;
  level: MatchLevel;
  /** Nhóm chính của nghề dùng để so (O*NET: nhóm đứng đầu; Văn Lang: nhóm trùng có hạng cao nhất) */
  lead: RiasecCode;
  matched: RiasecCode[]; // các nhóm của nghề trùng với nhóm hạng 1–3 của học sinh
  reasons: string[];
}

export function matchCareer(career: Career, scores: Scores): Suggestion | null {
  const tops = topCodes(scores);
  if (!tops.length || !career.codes.length) return null;
  const r = ranks(scores);
  const firsts = firstCodes(scores);
  // O*NET xếp nhóm theo thứ tự mạnh yếu nên nhóm chính là nhóm đứng đầu.
  // Văn Lang không xếp thứ tự (nghề ở 2 nhóm thì 2 nhóm ngang nhau), nên nhóm nào cũng có thể là nhóm chính.
  const leads = career.codeSource === "onet" ? [career.codes[0]] : career.codes;
  const okLeads = leads.filter((c) => tops.includes(c)).sort((a, b) => r[a] - r[b]);
  if (!okLeads.length) return null;
  const lead = okLeads[0];
  const others = career.codes.filter((c) => c !== lead && tops.includes(c));
  const matched = career.codes.filter((c) => tops.includes(c));
  const level: MatchLevel = firsts.includes(lead) && others.length > 0 ? "rat-phu-hop" : "phu-hop";
  const reasons = [
    firsts.includes(lead)
      ? `Nghề thuộc nhóm ${RIASEC[lead].name}, trùng nhóm cao nhất của bạn.`
      : `Nghề thuộc nhóm ${RIASEC[lead].name}, nằm trong 3 nhóm cao của bạn.`,
  ];
  if (others.length) reasons.push(`Nghề còn thuộc nhóm ${others.map((c) => RIASEC[c].name).join(", ")}, cũng là nhóm cao của bạn.`);
  return { career, level, lead, matched, reasons };
}

/** Tất cả nghề phù hợp: Rất phù hợp trước, sau đó theo hạng nhóm chính của nghề, rồi số nhóm trùng */
export function suggestCareers(scores: Scores): Suggestion[] {
  const r = ranks(scores);
  return CAREERS.map((c) => matchCareer(c, scores))
    .filter((s): s is Suggestion => Boolean(s))
    .sort(
      (a, b) =>
        (a.level === b.level ? 0 : a.level === "rat-phu-hop" ? -1 : 1) ||
        r[a.lead] - r[b.lead] ||
        b.matched.length - a.matched.length,
    );
}

/** Gom gợi ý theo nhóm chính của nghề; nhóm có điểm cao của học sinh đứng trước */
export function groupSuggestions(sugs: Suggestion[], scores: Scores): { code: RiasecCode; items: Suggestion[] }[] {
  return sortedCodes(scores)
    .map((code) => ({ code, items: sugs.filter((s) => s.lead === code) }))
    .filter((g) => g.items.length);
}

/** Những điều còn chưa rõ, để em biết cần tìm hiểu thêm */
export function unclearPoints(state: CareerState, scores: Scores): string[] {
  const out: string[] = [];
  RIASEC_ORDER.forEach((c) => {
    if (scores[c].unsure >= 2) out.push(`Bạn chọn "Phân vân" ở nhiều câu của nhóm ${RIASEC[c].name}: có thể bạn chưa có dịp thử những việc này.`);
  });
  if (isFlat(scores)) out.push("Điểm các nhóm khá gần nhau nên chưa thấy nhóm nổi bật rõ. Điều này rất bình thường ở tuổi bạn.");
  if (!state.profile.subjects.length) out.push("Bạn chưa chọn môn học yêu thích.");
  if (!state.profile.activities.length) out.push("Bạn chưa chọn hoạt động hay làm lúc rảnh.");
  return out;
}

const groupLine = (c: Career) =>
  `${c.name} [nhóm ${c.codes.map((x) => RIASEC[x].name).join(" – ")}]`;

/** Tóm tắt gửi cho AI: không có tên, biệt danh hay tên đăng nhập */
export function aiContext(state: CareerState, scores: Scores, grade: string): string {
  const p = state.profile;
  const told = [
    p.subjects.length ? `Môn học thích: ${p.subjects.join(", ")}.` : "",
    p.activities.length ? `Hoạt động hay làm lúc rảnh: ${p.activities.join(", ")}.` : "",
    p.after9 ? `Dự định sau lớp 9: ${p.after9}.` : "",
    p.dream ? `Nghề từng mơ ước (học sinh tự viết): ${p.dream}.` : "",
  ].filter(Boolean);

  if (!state.completedAt || !isComplete(state.answers)) {
    return [
      `Học sinh lớp ${grade}, chưa làm phiếu tự đánh giá (không bắt buộc) nên chưa có kết quả 6 nhóm.`,
      ...told,
      `Danh mục nghề của web: ${CAREERS.map(groupLine).join("; ")}.`,
    ].join("\n");
  }
  const flat = isFlat(scores);
  const sug = suggestCareers(scores);
  return [
    `Học sinh lớp ${grade}. Kết quả phiếu tự đánh giá 18 câu theo 6 nhóm tính cách trong lí thuyết mật mã Holland (SGK Công nghệ 9, Kết nối tri thức). Mỗi nhóm 3 câu, thang 1–5, điểm nhóm từ 3 đến ${MAX_SCORE}:`,
    sortedCodes(scores)
      .map((c) => `${RIASEC[c].name}: ${scores[c].score}/${MAX_SCORE}`)
      .join("; "),
    flat ? "Điểm các nhóm chênh nhau rất ít: web KHÔNG đưa ra mã Holland và KHÔNG gợi ý nghề." : `Mã Holland web tính được: ${codeLabel(scores)}.`,
    ...told,
    flat
      ? ""
      : `Nghề web đã chọn theo quy tắc so mã (CHỈ được nhắc tới các nghề trong danh sách này khi nói nghề phù hợp): ${sug
          .map((s) => `${groupLine(s.career)} – ${s.level === "rat-phu-hop" ? "Rất phù hợp" : "Phù hợp"}`)
          .join("; ")}.`,
  ]
    .filter(Boolean)
    .join("\n");
}

export const careerDetailForAI = (c: Career) =>
  [
    `Thông tin nghề "${c.name}" trong danh mục của web: lĩnh vực ${c.field}; nhóm: ${c.codes.map((x) => RIASEC[x].name).join(" – ")}.`,
    c.profile
      ? `Một nghề tiêu biểu trong lĩnh vực này là ${c.profile.name}: ${c.profile.desc} Hoạt động: ${c.profile.activities.join("; ")}. Kỹ năng: ${c.profile.skills.join(", ")}. Môn học liên quan: ${c.profile.subjects.join(", ")}.`
      : "",
  ]
    .filter(Boolean)
    .join(" ");
