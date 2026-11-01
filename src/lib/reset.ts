// ============================================================
// LÀM LẠI TỪ ĐẦU: xóa dữ liệu của MỘT phần (hoặc tất cả) cho tài khoản đang dùng
// - Tài khoản đăng nhập: xóa cả bản trên máy chủ (đồng bộ ngay) rồi tải lại trang
// - KHÔNG đụng tới cài đặt chung của web (link sách do admin sửa nằm riêng trên máy chủ)
// - Mã PIN Cây cảm xúc được giữ lại (là cài đặt, không phải dữ liệu)
// ============================================================
import { cloud } from "./cloud";

export type ResetPart = "career" | "mood" | "quest" | "planner" | "videos" | "all";

export const RESET_LABELS: Record<ResetPart, string> = {
  career: "Hướng nghiệp",
  mood: "Cây cảm xúc",
  quest: "Bản đồ chinh phục",
  planner: "Kế hoạch học tập",
  videos: "Video bài giảng",
  all: "Toàn bộ dữ liệu",
};

const TEST: Record<Exclude<ResetPart, "all">, (k: string) => boolean> = {
  career: (k) => /_career/.test(k),
  mood: (k) => /_(mood_|emotion_|selfcare_|garden_)/.test(k) && !k.endsWith("_mood_pin"),
  quest: (k) => /_quest_/.test(k),
  planner: (k) => /_planner_/.test(k),
  videos: (k) => /_custom_videos/.test(k),
};

export function keysToReset(userId: string, part: ResetPart): string[] {
  return cloud.keysFor(userId).filter((k) => (part === "all" ? !k.endsWith("_mood_pin") : TEST[part](k)));
}

/** Xóa rồi tải lại trang. Trả về false nếu em bấm Hủy. */
export async function resetPart(userId: string, part: ResetPart, askText?: string): Promise<boolean> {
  const label = RESET_LABELS[part];
  if (!window.confirm(askText || `Làm lại từ đầu phần "${label}"? Mọi dữ liệu của phần này sẽ bị xóa và không khôi phục được.`)) return false;
  keysToReset(userId, part).forEach((k) => {
    try {
      localStorage.removeItem(k);
    } catch {}
  });
  if (cloud.hasSession(userId)) await cloud.flush(); // xóa luôn bản trên máy chủ trước khi tải lại
  window.location.reload();
  return true;
}
