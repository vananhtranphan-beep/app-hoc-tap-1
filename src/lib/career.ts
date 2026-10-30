// ============================================================
// LOGIC HƯỚNG NGHIỆP: lưu tiến độ, tính điểm 6 nhóm, gợi ý nghề từ danh mục
// Gợi ý chính do WEB TÍNH từ câu trả lời (không cần AI). AI chỉ giải thích thêm.
// ============================================================
import { CAREERS, Career, INTEREST_ITEMS, RIASEC, RIASEC_ORDER, RiasecCode } from "../data/careerData";

export interface ChatMsg {
  role: "user" | "model";
  content: string;
  apiContent?: string; // nội dung thật gửi cho AI (khi khác nội dung hiển thị)
}

export interface CareerState {
  version: 3;
  answers: Record<number, number | null>; // số câu → 0..4, null = bỏ qua
  quizIndex: number;
  profile: { subjects: string[]; strengths: string[]; activities: string[]; environments: string[]; skills: string[] };
  completedAt?: string;
  saved: string[];
  compare: string[];
  experiences: Record<string, { status: "doing" | "done"; reflection: string; fit?: "hop" | "phan-van" | "chua-hop"; doneAt?: string }>;
  plan: { id: string; text: string; done: boolean; createdAt: string }[];
  chat: ChatMsg[];
}

export const emptyCareerState = (): CareerState => ({
  version: 3,
  answers: {},
  quizIndex: 0,
  profile: { subjects: [], strengths: [], activities: [], environments: [], skills: [] },
  saved: [],
  compare: [],
  experiences: {},
  plan: [],
  chat: [],
});

export const careerKey = (userId: string) => `user_${userId}_career_v3`;

const arr = (v: any) => (Array.isArray(v) ? v.filter((x) => typeof x === "string") : []);

/** Đọc tiến độ đã lưu; dữ liệu hỏng thì bắt đầu lại, không làm sập web */
export function loadCareerState(userId: string): CareerState {
  const base = emptyCareerState();
  try {
    const raw = JSON.parse(localStorage.getItem(careerKey(userId)) || "null");
    if (!raw || typeof raw !== "object") return base;
    const answers: CareerState["answers"] = {};
    for (const [k, v] of Object.entries(raw.answers || {})) {
      const n = Number(k);
      if (INTEREST_ITEMS.some((i) => i.id === n) && (v === null || (typeof v === "number" && v >= 0 && v <= 4))) answers[n] = v as number | null;
    }
    const known = new Set(CAREERS.map((c) => c.id));
    return {
      ...base,
      answers,
      quizIndex: Math.min(Math.max(Number(raw.quizIndex) || 0, 0), INTEREST_ITEMS.length + 4),
      profile: {
        subjects: arr(raw.profile?.subjects),
        strengths: arr(raw.profile?.strengths),
        activities: arr(raw.profile?.activities),
        environments: arr(raw.profile?.environments),
        skills: arr(raw.profile?.skills),
      },
      completedAt: typeof raw.completedAt === "string" ? raw.completedAt : undefined,
      saved: arr(raw.saved).filter((id) => known.has(id)),
      compare: arr(raw.compare).filter((id) => known.has(id)).slice(0, 3),
      experiences: raw.experiences && typeof raw.experiences === "object" ? raw.experiences : {},
      plan: Array.isArray(raw.plan) ? raw.plan.filter((p: any) => p && typeof p.text === "string") : [],
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

// ---------- Điểm 6 nhóm (0–20 mỗi nhóm, cộng điểm 5 câu như bản gốc) ----------
export type Scores = Record<RiasecCode, { score: number; answered: number; unsure: number }>;

export function computeScores(answers: CareerState["answers"]): Scores {
  const s = Object.fromEntries(RIASEC_ORDER.map((c) => [c, { score: 0, answered: 0, unsure: 0 }])) as Scores;
  for (const item of INTEREST_ITEMS) {
    const v = answers[item.id];
    if (typeof v !== "number") continue;
    s[item.code].score += v;
    s[item.code].answered += 1;
    if (v === 2) s[item.code].unsure += 1;
  }
  return s;
}

export const answeredCount = (answers: CareerState["answers"]) => INTEREST_ITEMS.filter((i) => typeof answers[i.id] === "number").length;

/** Nhóm nổi bật: xếp theo điểm, chỉ lấy nhóm có điểm ≥ 10/20 */
export function topCodes(scores: Scores, n = 3): RiasecCode[] {
  return [...RIASEC_ORDER]
    .filter((c) => scores[c].answered > 0)
    .sort((a, b) => scores[b].score - scores[a].score)
    .filter((c) => scores[c].score >= 10)
    .slice(0, n);
}

/** Điểm các nhóm có khá đều nhau không (khi đó chưa thấy nhóm nổi bật rõ) */
export function isFlat(scores: Scores) {
  const vals = RIASEC_ORDER.filter((c) => scores[c].answered > 0).map((c) => scores[c].score);
  if (vals.length < 2) return true;
  return Math.max(...vals) - Math.min(...vals) <= 4;
}

// ---------- Gợi ý nghề từ danh mục, kèm lý do ----------
export interface Suggestion {
  career: Career;
  score: number;
  reasons: string[];
}

export function suggestCareers(state: CareerState, scores: Scores, limit = 8): Suggestion[] {
  const tops = topCodes(scores, 3);
  return CAREERS.map((career) => {
    let score = 0;
    const reasons: string[] = [];
    career.codes.forEach((code, i) => {
      const w = i === 0 ? 3 : i === 1 ? 2 : 1;
      score += (scores[code].score / 20) * w;
    });
    const matchedCodes = career.codes.filter((c) => tops.includes(c));
    if (matchedCodes.length) {
      reasons.push(`Thuộc nhóm ${matchedCodes.map((c) => `${RIASEC[c].name} (${c})`).join(", ")}: nhóm bạn có điểm sở thích cao`);
    }
    const subj = career.subjects.filter((s) => state.profile.subjects.includes(s));
    if (subj.length) {
      score += 0.4 * subj.length;
      reasons.push(`Dùng nhiều môn bạn thích: ${subj.join(", ")}`);
    }
    // So khớp theo cụm từ (VD "cẩn thận" khớp "Cẩn thận, chính xác"), không theo từ lẻ
    const phrases = state.profile.strengths.flatMap((s) => s.toLowerCase().split(",")).map((p) => p.trim()).filter((p) => p.includes(" "));
    const sk = career.skills.filter((k) => {
      const kl = k.toLowerCase();
      return phrases.some((p) => kl.includes(p) || p.includes(kl));
    });
    if (sk.length) {
      score += 0.3 * sk.length;
      reasons.push(`Cần điểm mạnh bạn tự nhận: ${sk.join(", ")}`);
    }
    return { career, score, reasons };
  })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/** Những điều còn chưa rõ, để em biết cần tìm hiểu thêm */
export function unclearPoints(state: CareerState, scores: Scores): string[] {
  const out: string[] = [];
  const skipped = INTEREST_ITEMS.filter((i) => state.answers[i.id] === null).length;
  if (skipped > 0) out.push(`Bạn đã bỏ qua ${skipped} câu sở thích.`);
  RIASEC_ORDER.forEach((c) => {
    if (scores[c].unsure >= 3) out.push(`Bạn chọn "Chưa chắc" nhiều ở nhóm ${RIASEC[c].name}: có thể bạn chưa có dịp thử những việc này.`);
  });
  if (isFlat(scores)) out.push("Điểm các nhóm khá gần nhau, nên chưa thấy nhóm nổi bật rõ. Điều này rất bình thường ở tuổi bạn.");
  if (!state.profile.environments.length) out.push("Bạn chưa chọn môi trường làm việc mong muốn.");
  if (!state.profile.subjects.length) out.push("Bạn chưa chọn môn học yêu thích.");
  return out;
}

/** Tóm tắt gửi cho AI: không có tên, biệt danh hay tên đăng nhập */
export function aiContext(state: CareerState, scores: Scores, grade: string): string {
  if (!state.completedAt || answeredCount(state.answers) < 10) {
    return [
      `Học sinh lớp ${grade}, chưa làm khảo sát sở thích nên chưa có thông tin về sở thích.`,
      `DANH MỤC NGHỀ ĐƯỢC PHÉP GỢI Ý: ${CAREERS.map((c) => `${c.name} [${c.codes.join("")}]`).join("; ")}.`,
    ].join("\n");
  }
  const tops = topCodes(scores, 3);
  const sug = suggestCareers(state, scores, 8);
  const p = state.profile;
  return [
    `Học sinh lớp ${grade}. Kết quả khảo sát sở thích (thang 0–20 mỗi nhóm, phỏng theo O*NET Interest Profiler):`,
    RIASEC_ORDER.map((c) => `${RIASEC[c].name} (${c}): ${scores[c].score}/20`).join("; "),
    `Nhóm nổi bật: ${tops.length ? tops.map((c) => RIASEC[c].name).join(", ") : "chưa rõ (điểm các nhóm gần nhau)"}.`,
    p.subjects.length ? `Môn học thích: ${p.subjects.join(", ")}.` : "",
    p.strengths.length ? `Điểm mạnh tự nhận: ${p.strengths.join(", ")}.` : "",
    p.activities.length ? `Hoạt động yêu thích: ${p.activities.join(", ")}.` : "",
    p.environments.length ? `Môi trường làm việc mong muốn: ${p.environments.join(", ")}.` : "",
    p.skills.length ? `Kỹ năng muốn phát triển: ${p.skills.join(", ")}.` : "",
    `DANH MỤC NGHỀ ĐƯỢC PHÉP GỢI Ý (do web tính, xếp theo mức phù hợp): ${sug.map((s) => `${s.career.name} [${s.career.codes.join("")}]`).join("; ")}.`,
  ]
    .filter(Boolean)
    .join("\n");
}

export const careerDetailForAI = (c: Career) =>
  `Thông tin nghề "${c.name}" trong danh mục của web: ${c.desc} Hoạt động: ${c.activities.join("; ")}. Kỹ năng: ${c.skills.join(", ")}. Môn học liên quan: ${c.subjects.join(", ")}.`;
