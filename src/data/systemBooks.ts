// ============================================================
// DANH SÁCH SÁCH HỆ THỐNG (tất cả học sinh đều thấy)
// ------------------------------------------------------------
// Cách cập nhật dễ nhất: đăng nhập web bằng tài khoản admin,
// vào "Môn học THCS", sửa link sách, rồi bấm "Đăng cho học sinh"
// và làm theo hướng dẫn (copy code -> dán đè vào file này -> Commit).
//
// Cũng có thể sửa tay: dán link Google Drive vào giữa hai dấu ""
// sau chữ url:  ví dụ  url: "https://drive.google.com/..."
// ============================================================

export type SystemBook = { id: string; name: string; url: string; imageUrl: string };

export const SYSTEM_BOOKS: Record<string, SystemBook[]> = {
  "Ngữ văn": [
    { id: "nv-6-1", name: "Ngữ Văn lớp 6 - Tập 1", url: "https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-ngu-van-6-tap-mot.4699839775#page=9", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-6-2", name: "Ngữ Văn lớp 6 - Tập 2", url: "https://acrobat.adobe.com/id/urn:aaid:sc:AP:afecdd7f-b487-41a2-9c15-e3e64aa14c26", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-7-1", name: "Ngữ Văn lớp 7 - Tập 1", url: "", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-7-2", name: "Ngữ Văn lớp 7 - Tập 2", url: "", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-8-1", name: "Ngữ Văn lớp 8 - Tập 1", url: "", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-8-2", name: "Ngữ Văn lớp 8 - Tập 2", url: "", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-9-1", name: "Ngữ Văn lớp 9 - Tập 1", url: "", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-9-2", name: "Ngữ Văn lớp 9 - Tập 2", url: "", imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-nc-1", name: "Tài liệu Nâng cao Ngữ Văn 6", url: "", imageUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-nc-2", name: "Tài liệu Nâng cao Ngữ Văn 7", url: "", imageUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-nc-3", name: "Tài liệu Nâng cao Ngữ Văn 8", url: "", imageUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=300&q=80" },
    { id: "nv-nc-4", name: "Tài liệu Nâng cao Ngữ Văn 9", url: "", imageUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=300&q=80" },
  ],
  "Toán": [
    { id: "toan-6-1", name: "Toán lớp 6 - Tập 1", url: "https://drive.google.com/file/d/1ifItRyChuGPOiifAqZPwoh9BL6rbvkw5/view?usp=sharing", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-6-2", name: "Toán lớp 6 - Tập 2", url: "", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-7-1", name: "Toán lớp 7 - Tập 1", url: "", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-7-2", name: "Toán lớp 7 - Tập 2", url: "", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-8-1", name: "Toán lớp 8 - Tập 1", url: "", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-8-2", name: "Toán lớp 8 - Tập 2", url: "", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-9-1", name: "Toán lớp 9 - Tập 1", url: "", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-9-2", name: "Toán lớp 9 - Tập 2", url: "", imageUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-nc-1", name: "Tham khảo Nâng cao Toán 6", url: "", imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-nc-2", name: "Tham khảo Nâng cao Toán 7", url: "", imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-nc-3", name: "Tham khảo Nâng cao Toán 8", url: "", imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=300&q=80" },
    { id: "toan-nc-4", name: "Tham khảo Nâng cao Toán 9", url: "", imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=300&q=80" },
  ],
  "Tiếng Anh": [
    { id: "ta-6", name: "Tiếng Anh lớp 6", url: "", imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=300&q=80" },
    { id: "ta-7", name: "Tiếng Anh lớp 7", url: "", imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=300&q=80" },
    { id: "ta-8", name: "Tiếng Anh lớp 8", url: "", imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=300&q=80" },
    { id: "ta-9", name: "Tiếng Anh lớp 9", url: "", imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=300&q=80" },
  ],
  "Khoa Học Tự Nhiên": [
    { id: "khtn-6", name: "KHTN lớp 6", url: "", imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=300&q=80" },
    { id: "khtn-7", name: "KHTN lớp 7", url: "", imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=300&q=80" },
    { id: "khtn-8", name: "KHTN lớp 8", url: "", imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=300&q=80" },
    { id: "khtn-9", name: "KHTN lớp 9", url: "", imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=300&q=80" },
  ],
  "Lịch Sử & Địa Lý": [
    { id: "lsdl-6", name: "Lịch Sử & Địa Lý lớp 6", url: "", imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=300&q=80" },
    { id: "lsdl-7", name: "Lịch Sử & Địa Lý lớp 7", url: "", imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=300&q=80" },
    { id: "lsdl-8", name: "Lịch Sử & Địa Lý lớp 8", url: "", imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=300&q=80" },
    { id: "lsdl-9", name: "Lịch Sử & Địa Lý lớp 9", url: "", imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=300&q=80" },
  ],
  "Giáo Dục Công Dân": [
    { id: "gdcd-6", name: "GDCD lớp 6", url: "", imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=300&q=80" },
    { id: "gdcd-7", name: "GDCD lớp 7", url: "", imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=300&q=80" },
    { id: "gdcd-8", name: "GDCD lớp 8", url: "", imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=300&q=80" },
    { id: "gdcd-9", name: "GDCD lớp 9", url: "", imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=300&q=80" },
  ],
  "Tin Học": [
    { id: "tin-6", name: "Tin học lớp 6", url: "", imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80" },
    { id: "tin-7", name: "Tin học lớp 7", url: "", imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80" },
    { id: "tin-8", name: "Tin học lớp 8", url: "", imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80" },
    { id: "tin-9", name: "Tin học lớp 9", url: "", imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80" },
  ],
  "Công Nghệ": [
    { id: "cn-6", name: "Công nghệ lớp 6", url: "", imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80" },
    { id: "cn-7", name: "Công nghệ lớp 7", url: "", imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80" },
    { id: "cn-8", name: "Công nghệ lớp 8", url: "", imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80" },
    { id: "cn-9", name: "Công nghệ lớp 9", url: "", imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80" },
  ],
};
