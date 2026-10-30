// ============================================================
// DANH SÁCH SÁCH HỆ THỐNG (tất cả học sinh đều thấy)
// ------------------------------------------------------------
// Cách cập nhật dễ nhất: đăng nhập web bằng tài khoản admin,
// vào "Môn học THCS", sửa link sách, rồi bấm "Đăng cho học sinh"
// và làm theo hướng dẫn (copy code -> dán đè vào file này -> Commit).
//
// Cũng có thể sửa tay: dán link Google Drive vào giữa hai dấu ""
// sau chữ url:  ví dụ  url: "https://drive.google.com/..."
//
// Link sách: bộ "Kết nối tri thức với cuộc sống" (bộ SGK thống nhất toàn quốc từ
// năm học 2026-2027) trên trang taphuan.nxbgd.vn của NXB Giáo dục Việt Nam.
// ============================================================

export type SystemBook = { id: string; name: string; url: string; imageUrl: string };

export const SYSTEM_BOOKS: Record<string, SystemBook[]> = {
  "Ngữ văn": [
    { id: "nv-6-1", name: "Ngữ Văn lớp 6 - Tập 1", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-ngu-van-6-tap-mot.4699839775", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-6-2", name: "Ngữ Văn lớp 6 - Tập 2", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-ngu-van-6-tap-hai.4699846798", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-7-1", name: "Ngữ Văn lớp 7 - Tập 1", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-ngu-van-7-tap-mot.4699959987", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-7-2", name: "Ngữ Văn lớp 7 - Tập 2", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-ngu-van-7-tap-hai.4700000210", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-8-1", name: "Ngữ Văn lớp 8 - Tập 1", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-ngu-van-8-tap-mot.4700073646", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-8-2", name: "Ngữ Văn lớp 8 - Tập 2", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-ngu-van-8-tap-hai.4700085484", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-9-1", name: "Ngữ Văn lớp 9 - Tập 1", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-ngu-van-9-tap-mot.4700220434", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-9-2", name: "Ngữ Văn lớp 9 - Tập 2", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-ngu-van-9-tap-hai.4714685580", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-nc-1", name: "Tài liệu Nâng cao Ngữ Văn 6", url: "", imageUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-nc-2", name: "Tài liệu Nâng cao Ngữ Văn 7", url: "", imageUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-nc-3", name: "Tài liệu Nâng cao Ngữ Văn 8", url: "", imageUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-nc-4", name: "Tài liệu Nâng cao Ngữ Văn 9", url: "", imageUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=300&q=80" },
  ],
  "Toán": [
    { id: "toan-6-1", name: "Toán lớp 6 - Tập 1", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-toan-6-tap-mot.4699854777", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-6-2", name: "Toán lớp 6 - Tập 2", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-toan-6-tap-hai.4699864675", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-7-1", name: "Toán lớp 7 - Tập 1", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-toan-7-tap-mot.4714106181", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-7-2", name: "Toán lớp 7 - Tập 2", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-toan-7-tap-hai.4700015846", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-8-1", name: "Toán lớp 8 - Tập 1", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-toan-8-tap-mot.4700097446", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-8-2", name: "Toán lớp 8 - Tập 2", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-toan-8-tap-hai.4700102182", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-9-1", name: "Toán lớp 9 - Tập 1", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-toan-9-tap-mot.4714692201", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-9-2", name: "Toán lớp 9 - Tập 2", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-toan-9-tap-hai.4714699696", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-nc-1", name: "Tham khảo Nâng cao Toán 6", url: "", imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-nc-2", name: "Tham khảo Nâng cao Toán 7", url: "", imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-nc-3", name: "Tham khảo Nâng cao Toán 8", url: "", imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-nc-4", name: "Tham khảo Nâng cao Toán 9", url: "", imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=300&q=80" },
  ],
  "Tiếng Anh": [
    { id: "ta-6", name: "Tiếng Anh lớp 6 - Tập 1 (Global Success)", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-tieng-anh-6-tap-1-global-success.4879705889", imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=300&q=80" },
    { id: "ta-6-2", name: "Tiếng Anh lớp 6 - Tập 2 (Global Success)", url: "", imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=300&q=80" },
    { id: "ta-7", name: "Tiếng Anh lớp 7 (Global Success)", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/shs-tieng-anh-7-global-success.4539950416", imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=300&q=80" },
    { id: "ta-8", name: "Tiếng Anh lớp 8 (Global Success)", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-tieng-anh-8-global-success.4879728870", imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=300&q=80" },
    { id: "ta-9", name: "Tiếng Anh lớp 9 (Global Success)", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-tieng-anh-9-global-success.4879734378", imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=300&q=80" },
  ],
  "Khoa Học Tự Nhiên": [
    { id: "khtn-6", name: "KHTN lớp 6", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-khoa-hoc-tu-nhien-6.4699875855", imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=300&q=80" },
    { id: "khtn-7", name: "KHTN lớp 7", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-khoa-hoc-tu-nhien-7.4700027658", imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=300&q=80" },
    { id: "khtn-8", name: "KHTN lớp 8", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-khoa-hoc-tu-nhien-8.4700112690", imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=300&q=80" },
    { id: "khtn-9", name: "KHTN lớp 9", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-khoa-hoc-tu-nhien-9.4700446949", imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=300&q=80" },
  ],
  "Lịch Sử & Địa Lý": [
    { id: "lsdl-6", name: "Lịch Sử & Địa Lý lớp 6", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-lich-su-va-dia-li-6.4830326427", imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=300&q=80" },
    { id: "lsdl-7", name: "Lịch Sử & Địa Lý lớp 7", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-lich-su-va-dia-li-7.4830359644", imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=300&q=80" },
    { id: "lsdl-8", name: "Lịch Sử & Địa Lý lớp 8", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-lich-su-dia-li-8.4830375637", imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=300&q=80" },
    { id: "lsdl-9", name: "Lịch Sử & Địa Lý lớp 9", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-lich-su-va-dia-li-9.4844021301", imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=300&q=80" },
  ],
  "Giáo Dục Công Dân": [
    { id: "gdcd-6", name: "GDCD lớp 6", url: "", imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=300&q=80" },
    { id: "gdcd-7", name: "GDCD lớp 7", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-giao-duc-cong-dan-7.4726822635", imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=300&q=80" },
    { id: "gdcd-8", name: "GDCD lớp 8", url: "https://taphuan.nxbgd.vn/tap-huan/chi-tiet-sach/giao-duc-cong-dan-8-940161565.940161565", imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=300&q=80" },
    { id: "gdcd-9", name: "GDCD lớp 9", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-giao-duc-cong-dan-9.4714947143", imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=300&q=80" },
  ],
  "Tin Học": [
    { id: "tin-6", name: "Tin học lớp 6", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-tin-hoc-6.4699918592", imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80" },
    { id: "tin-7", name: "Tin học lớp 7", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-tin-hoc-7.4700056620", imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80" },
    { id: "tin-8", name: "Tin học lớp 8", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-tin-hoc-8.4700157933", imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80" },
    { id: "tin-9", name: "Tin học lớp 9", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-tin-hoc-9.4700233123", imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80" },
  ],
  "Công Nghệ": [
    { id: "cn-6", name: "Công nghệ lớp 6", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-cong-nghe-6.4699880634", imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80" },
    { id: "cn-7", name: "Công nghệ lớp 7", url: "https://taphuan.nxbgd.vn/tap-huan/chi-tiet-sach/cong-nghe-7-939937878.939937878", imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80" },
    { id: "cn-8", name: "Công nghệ lớp 8", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-cong-nghe-8.4700127878", imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80" },
    { id: "cn-9", name: "Công nghệ lớp 9 - Định hướng nghề nghiệp", url: "https://taphuan.nxbgd.vn/tap-huan/chi-tiet-sach/cong-nghe-9-dinh-huong-nghe-nghiep-940004971.940004971", imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80" },
  ],
};
