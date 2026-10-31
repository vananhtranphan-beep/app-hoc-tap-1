// ============================================================
// TIẾN ĐỘ BẢN ĐỒ CHINH PHỤC TRI THỨC (môn Toán)
// Lưu theo tài khoản (đồng bộ lên máy chủ khi đăng nhập), khóa user_<id>_quest_v1.
// Không khóa chương nào: em tự chọn chương, làm lại bao nhiêu lần cũng được.
// Không kết luận em giỏi hay kém từ một lượt làm bài.
// ============================================================

export interface QuizQuestion {
  id: string;
  q: string;
  options: string[];
  answer: number;
  explain: string;
  kind?: string;
}

export interface QuestRun {
  chapterId: string;
  grade: string;
  level: number;
  questions: QuizQuestion[];
  picks: (number | null)[];
  reported: string[]; // id câu em báo sai (không tính điểm)
  index: number;
  startedAt: string;
  review?: boolean; // lượt ôn lại phần sai
}

export interface NodeProgress {
  attempts: number;
  best: number; // tỉ lệ đúng tốt nhất 0..1
  lastScore: number;
  lastTotal: number;
  level: number; // mức gợi ý cho lượt sau
  done: boolean; // đã đạt ≥ 80% một lần
  wrongs: string[]; // các câu làm sai ở lượt gần nhất (để ôn lại)
  lastAt: string;
}

export interface QuestState {
  version: 1;
  grade?: string;
  nodes: Record<string, NodeProgress>;
  run?: QuestRun;
  seen: Record<string, string[]>; // câu đã dùng theo chương (để AI không lặp lại)
  reports: { chapterId: string; q: string; at: string }[];
}

export const questKey = (userId: string) => `user_${userId}_quest_v1`;
export const emptyQuest = (): QuestState => ({ version: 1, nodes: {}, seen: {}, reports: [] });

export function loadQuest(userId: string): QuestState {
  try {
    const raw = JSON.parse(localStorage.getItem(questKey(userId)) || "null");
    if (!raw || typeof raw !== "object") return emptyQuest();
    const run = raw.run;
    const runOk =
      run &&
      typeof run.chapterId === "string" &&
      Array.isArray(run.questions) &&
      run.questions.every((q: any) => q && typeof q.q === "string" && Array.isArray(q.options) && q.options.length === 4) &&
      Array.isArray(run.picks);
    return {
      version: 1,
      grade: typeof raw.grade === "string" ? raw.grade : undefined,
      nodes: raw.nodes && typeof raw.nodes === "object" ? raw.nodes : {},
      run: runOk ? { reported: [], ...run } : undefined,
      seen: raw.seen && typeof raw.seen === "object" ? raw.seen : {},
      reports: Array.isArray(raw.reports) ? raw.reports.slice(-100) : [],
    };
  } catch {
    return emptyQuest();
  }
}

export function saveQuest(userId: string, s: QuestState) {
  try {
    localStorage.setItem(questKey(userId), JSON.stringify(s));
  } catch {}
}

export type NodeStatus = "new" | "doing" | "done";
export const nodeStatus = (s: QuestState, chapterId: string): NodeStatus =>
  s.nodes[chapterId]?.done ? "done" : s.run?.chapterId === chapterId || (s.nodes[chapterId]?.attempts || 0) > 0 ? "doing" : "new";

/** Điểm của một lượt: không tính câu em đã báo sai */
export function runScore(run: QuestRun) {
  let score = 0;
  let total = 0;
  run.questions.forEach((q, i) => {
    if (run.reported.includes(q.id)) return;
    total += 1;
    if (run.picks[i] === q.answer) score += 1;
  });
  return { score, total };
}

/** Kết thúc lượt: lưu kết quả, gợi ý mức độ cho lượt sau */
export function finishRun(s: QuestState): QuestState {
  const run = s.run;
  if (!run) return s;
  const { score, total } = runScore(run);
  const ratio = total ? score / total : 0;
  const prev = s.nodes[run.chapterId];
  const level = !total ? run.level : ratio >= 0.8 ? Math.min(3, run.level + 1) : ratio <= 0.4 ? Math.max(1, run.level - 1) : run.level;
  const wrongs = run.questions.filter((q, i) => !run.reported.includes(q.id) && run.picks[i] !== null && run.picks[i] !== q.answer).map((q) => q.q);
  return {
    ...s,
    run: undefined,
    nodes: {
      ...s.nodes,
      [run.chapterId]: {
        attempts: (prev?.attempts || 0) + 1,
        best: Math.max(prev?.best || 0, ratio),
        lastScore: score,
        lastTotal: total,
        level,
        done: Boolean(prev?.done) || (total >= 3 && ratio >= 0.8),
        wrongs: wrongs.slice(0, 5),
        lastAt: new Date().toISOString(),
      },
    },
  };
}

export const rememberSeen = (s: QuestState, chapterId: string, qs: QuizQuestion[]): QuestState => ({
  ...s,
  seen: { ...s.seen, [chapterId]: [...(s.seen[chapterId] || []), ...qs.map((q) => q.q)].slice(-30) },
});
