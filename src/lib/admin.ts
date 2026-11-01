// Tài khoản quản trị (phải khớp với api/_db.js). Admin sửa được link sách, đặt lại mật khẩu học sinh,
// và có nút đặt lại dữ liệu thử nghiệm của chính mình.
export const ADMIN_IDS = ["tranphanvananh", "duongphuquy", "nguyenhuukhanh"];
export const isAdminId = (id?: string | null) => ADMIN_IDS.includes(String(id || "").trim().toLowerCase());
