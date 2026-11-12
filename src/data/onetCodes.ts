// ============================================================
// MÃ HOLLAND THEO O*NET CỦA TỪNG NGHỀ
// FILE NÀY ĐƯỢC TẠO TỰ ĐỘNG bằng: node scripts/them-ma-onet.mjs
// Không sửa tay. Muốn đổi cặp ghép nghề thì sửa scripts/nghe-onet.csv rồi chạy lại script.
// Đang trống: chưa ghép, nên web tạm dùng nhóm theo Trường ĐH Văn Lang.
// ============================================================

export const ONET_VERSION = "";
export const ONET_CODES: Record<string, { soc: string; title: string; codes: string[] }> = {};
