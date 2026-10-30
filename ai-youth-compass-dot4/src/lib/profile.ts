// ============================================================
// HỒ SƠ ẨN DANH CỦA HỌC SINH
// - Không lưu họ tên thật, ngày sinh, trường lớp, ảnh thật
// - Chỉ có: tên đăng nhập, biệt danh tự tạo, khối lớp, biểu tượng đại diện
// ============================================================
import { StudentProfile } from "../types";

const NOUNS = [
  "Cánh Diều", "Mầm Xanh", "Ngôi Sao", "Cánh Chim", "Hạt Nắng", "Dòng Sông",
  "Ngọn Đồi", "Chiếc Lá", "Đám Mây", "Cầu Vồng", "Hải Đăng", "La Bàn",
  "Hoa Sen", "Cây Tre", "Ánh Trăng", "Giọt Sương", "Cánh Buồm", "Hạt Mầm",
];

const TRAITS = [
  "Kiên Trì", "Sáng Tạo", "Tò Mò", "Dũng Cảm", "Chăm Chỉ", "Vui Tươi",
  "Bền Bỉ", "Nhanh Trí", "Tử Tế", "Tự Tin", "Ham Học", "Điềm Tĩnh",
];

/** Biểu tượng đại diện (không dùng ảnh người thật) */
export const AVATARS = ["🧭", "🌱", "🪁", "⭐", "🌊", "🍀", "🦉", "🌻", "🐬", "🚀", "🎨", "🔭"];

const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];

/** Tạo biệt danh tiếng Việt có nghĩa, không liên quan tới tên thật */
export function generateNickname(avoid?: string): string {
  for (let i = 0; i < 10; i++) {
    const name = `${pick(NOUNS)} ${pick(TRAITS)}`;
    if (name !== avoid) return name;
  }
  return `${pick(NOUNS)} ${pick(TRAITS)}`;
}

export const randomAvatar = () => pick(AVATARS);

export const GUEST_ID = "__khach__";

const GRADES = ["6", "7", "8", "9"] as const;

/** Chuẩn hóa hồ sơ (kể cả hồ sơ cũ): bỏ họ tên, ngày sinh, trường, ảnh thật */
export function sanitizeProfile(raw: any): StudentProfile {
  const grade = GRADES.includes(String(raw?.grade) as any) ? (String(raw.grade) as StudentProfile["grade"]) : "8";
  const nickname = typeof raw?.nickname === "string" && raw.nickname.trim() ? raw.nickname.trim().slice(0, 40) : generateNickname();
  const avatar = AVATARS.includes(raw?.avatar) ? raw.avatar : randomAvatar();
  const out: StudentProfile = {
    studentId: String(raw?.studentId || "").trim(),
    nickname,
    grade,
    avatar,
    isLoggedIn: raw?.isLoggedIn !== false,
  };
  if (raw?.isGuest) out.isGuest = true;
  if (typeof raw?.createdAt === "string") out.createdAt = raw.createdAt;
  // Mật khẩu cũ chỉ còn ở tài khoản tạo khi chưa có máy chủ; sẽ bị xóa sau khi chuyển lên máy chủ
  if (typeof raw?.password === "string" && raw.password) out.password = raw.password;
  return out;
}

/** Hồ sơ cũ còn họ tên, ngày sinh, trường hay chưa có biệt danh? */
export const needsCleanup = (raw: any) =>
  Boolean(raw && (raw.fullName || raw.dob || raw.schoolName || !raw.nickname || !AVATARS.includes(raw.avatar)));

/** Đọc hồ sơ để gửi lên máy chủ: không kèm mật khẩu, không kèm cờ trên máy */
export const publicProfile = (p: StudentProfile) => ({
  studentId: p.studentId,
  nickname: p.nickname,
  grade: p.grade,
  avatar: p.avatar,
  ...(p.createdAt ? { createdAt: p.createdAt } : {}),
});
