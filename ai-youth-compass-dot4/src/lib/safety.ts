// ============================================================
// LỚP AN TOÀN cho Góc tâm sự (chạy TRƯỚC khi gọi AI)
// Danh sách này phải giống với api/_safety.js (máy chủ kiểm tra lại lần nữa).
// Bộ lọc từ khóa có thể bỏ sót cách nói vòng vo: web luôn hướng em tới người lớn tin cậy.
// ============================================================

export type SafetyCategory = "tu-hai" | "bao-luc" | "xam-hai" | "bat-nat";

// Viết KHÔNG DẤU, chữ thường (tin nhắn được bỏ dấu trước khi so)
export const SAFETY_PATTERNS: Record<SafetyCategory, string[]> = {
  "tu-hai": [
    "muon chet", "khong muon song", "chan song", "tu sat", "ket thuc cuoc doi", "ket lieu", "tu lam hai", "tu hai ban than",
    "rach tay", "cat tay", "cat co tay", "nhay lau", "nhay cau", "uong thuoc ngu", "khong con ly do de song", "bien mat mai mai", "chet di cho xong", "song lam gi nua",
  ],
  "bao-luc": ["bi danh", "danh em", "danh con", "danh minh", "danh dap", "bao luc", "bi dam", "doa giet", "bi danh hoi dong", "bi danh dap"],
  "xam-hai": ["xam hai", "sam so", "so vao nguoi", "so vao vung kin", "so mo", "ep lam chuyen", "quay roi", "hiep dam", "chup anh khoa than", "gui anh nong", "bat coi do"],
  "bat-nat": ["bat nat", "bi co lap", "bi tay chay", "ca lop chui", "bi chui", "bi che gieu", "bi de doa", "bi tong tien"],
};

export function normalizeVi(text: string): string {
  return ` ${text} `
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, " ");
}

// "đánh giá", "đánh thức", "đánh rơi"... không phải bạo lực: bỏ ra trước khi so
const NOT_VIOLENCE = / danh (gia|dau|thuc|truot|roi|cap|may|so|rang|co|dan|bong|vong|mat|lua|chen|bai|van|trong|gian) /g;

export function detectSafety(text: string): SafetyCategory | null {
  const raw = ` ${String(text || "").toLowerCase()} `;
  // "tự tử" có dấu; "tu tu" không dấu chỉ tính khi cả câu gõ không dấu (để không nhầm với "từ từ")
  if (/tự tử|tự vẫn/.test(raw)) return "tu-hai";
  const t = normalizeVi(text).replace(NOT_VIOLENCE, " _ ");
  const typedNoAccent = raw.normalize("NFD").replace(/[̀-ͯ]/g, "") === raw.normalize("NFD") && !/đ/.test(raw);
  if (typedNoAccent && / tu tu /.test(t)) return "tu-hai";
  for (const cat of ["tu-hai", "xam-hai", "bao-luc", "bat-nat"] as SafetyCategory[]) {
    if (SAFETY_PATTERNS[cat].some((p) => t.includes(` ${p} `))) return cat;
  }
  return null;
}

export const SAFETY_MESSAGES: Record<SafetyCategory, string> = {
  "tu-hai":
    "Cảm ơn bạn đã tin tưởng kể ra điều này. Mình rất lo cho bạn. Bạn không phải một mình trải qua chuyện này. Ngay bây giờ, bạn hãy nói với một người lớn bạn tin (bố mẹ, thầy cô, người thân) hoặc gọi số bên dưới. Nếu bạn đang ở nơi nguy hiểm, hãy rời khỏi đó và tìm người ở gần.",
  "xam-hai":
    "Điều bạn kể là rất nghiêm trọng, và đó KHÔNG phải lỗi của bạn. Bạn có quyền được an toàn. Hãy kể ngay với một người lớn bạn tin, hoặc gọi Tổng đài 111 (miễn phí). Nếu đang gặp nguy hiểm, gọi 113.",
  "bao-luc":
    "Không ai được phép làm đau bạn. Cảm ơn bạn đã nói ra. Hãy kể với một người lớn bạn tin (thầy cô chủ nhiệm, người thân) hoặc gọi Tổng đài 111 để được giúp. Nếu đang gặp nguy hiểm, gọi 113.",
  "bat-nat":
    "Bị bắt nạt là chuyện rất khó chịu và đó không phải lỗi của bạn. Bạn nên kể với giáo viên chủ nhiệm hoặc bố mẹ để được bảo vệ. Bạn cũng có thể gọi Tổng đài 111. Bạn có muốn kể thêm chuyện đã xảy ra không?",
};

export const HOTLINES = [
  { number: "111", name: "Tổng đài quốc gia bảo vệ trẻ em", note: "Miễn phí, 24/7" },
  { number: "113", name: "Công an", note: "Khi đang gặp nguy hiểm" },
  { number: "115", name: "Cấp cứu y tế", note: "Khi bị thương hoặc nguy hiểm tính mạng" },
];
