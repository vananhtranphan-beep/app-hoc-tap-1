// ============================================================
// DỮ LIỆU CÂY CẢM XÚC (sửa trực tiếp ở file này)
// "Thời tiết" chỉ là cách diễn đạt cảm xúc, KHÔNG phải phân loại hay chẩn đoán tâm lý.
// ============================================================

export interface Weather {
  id: string;
  label: string;
  hint: string;
  emoji: string;
  /** Cảm xúc nặng nề: cây rũ lá (không phải lỗi của em) */
  heavy: boolean;
}

export const WEATHERS: Weather[] = [
  { id: "nang", label: "Nắng nhẹ", hint: "vui vẻ, bình yên", emoji: "🌤️", heavy: false },
  { id: "may", label: "Có mây", hint: "bình thường, hơi mệt", emoji: "⛅", heavy: false },
  { id: "mua", label: "Mưa", hint: "buồn, thất vọng", emoji: "🌧️", heavy: true },
  { id: "gio", label: "Gió mạnh", hint: "căng thẳng, bối rối", emoji: "🌬️", heavy: true },
  { id: "sam", label: "Sấm chớp", hint: "tức giận, quá tải", emoji: "⛈️", heavy: true },
  { id: "cauvong", label: "Cầu vồng", hint: "nhẹ nhõm, có hy vọng", emoji: "🌈", heavy: false },
];
export const weatherById = (id: string) => WEATHERS.find((w) => w.id === id);

export const CAUSES = [
  "Học tập và bài kiểm tra",
  "Bạn bè",
  "Gia đình",
  "Sức khỏe và giấc ngủ",
  "Những thay đổi trong cuộc sống",
  "Không rõ nguyên nhân",
  "Điều khác",
];

export const WANTS = [
  { id: "ke", label: "Muốn kể thêm", target: "chat" },
  { id: "hieu", label: "Muốn hiểu cảm xúc của mình", target: "chat" },
  { id: "thugian", label: "Muốn thử một hoạt động thư giãn", target: "activity" },
  { id: "giaiquyet", label: "Muốn tìm cách giải quyết một vấn đề", target: "chat" },
  { id: "ghilai", label: "Chỉ muốn ghi lại, chưa cần lời khuyên", target: "none" },
] as const;

// Lời khích lệ hiện dưới cây khi cây rũ lá (viết sẵn, không do AI tạo)
export const ENCOURAGE: Record<string, string[]> = {
  mua: [
    "Những ngày mưa rồi cũng tạnh. Bạn đã dũng cảm khi gọi tên được cảm xúc của mình.",
    "Buồn không phải là yếu đuối. Chăm sóc bản thân một chút, cây sẽ tươi lại cùng bạn.",
  ],
  gio: [
    "Khi gió mạnh, cây cần bám rễ thật chắc. Thử thở chậm vài nhịp để tìm lại chỗ đứng của mình nhé.",
    "Căng thẳng là dấu hiệu bạn đang cố gắng nhiều. Bạn xứng đáng được nghỉ một chút.",
  ],
  sam: [
    "Tức giận là cảm xúc bình thường. Điều quan trọng là mình chọn làm gì tiếp theo.",
    "Khi thấy quá tải, chia việc nhỏ ra và nhờ người tin cậy giúp một tay cũng là một cách mạnh mẽ.",
  ],
};

export const CALM_LINES = [
  "Mỗi lần bạn quan sát cảm xúc, cây lại có thêm một chiếc lá.",
  "Không có cảm xúc nào là sai. Cây lớn lên nhờ bạn để ý đến chính mình.",
  "Bạn có thể quay lại bất cứ lúc nào, cây vẫn ở đây chờ bạn.",
];

// ---------- Thư viện hoạt động chăm sóc bản thân ----------
export interface SelfCareActivity {
  id: string;
  group: string;
  name: string;
  purpose: string;
  minutes: number;
  steps: string[];
  /** Có ô viết (không bắt buộc lưu) */
  writing?: string;
  /** Có đồng hồ thở 4-4-4 */
  breathing?: boolean;
}

export const SELF_CARE_GROUPS = [
  { id: "thugian", name: "Thư giãn trong vài phút" },
  { id: "khampha", name: "Khám phá cảm xúc" },
  { id: "ketnoi", name: "Kết nối với người khác" },
  { id: "nhinlai", name: "Nhìn lại bản thân" },
];

export const SELF_CARE: SelfCareActivity[] = [
  { id: "tho-cham", group: "thugian", name: "Thở chậm theo nhịp", purpose: "Giúp cơ thể dịu lại khi thấy căng thẳng", minutes: 2, breathing: true, steps: ["Ngồi thoải mái, thả lỏng vai", "Hít vào bằng mũi 4 giây", "Giữ hơi 4 giây", "Thở ra từ từ 4 giây", "Lặp lại theo vòng tròn trên màn hình"] },
  { id: "tha-long", group: "thugian", name: "Thả lỏng vai và bàn tay", purpose: "Nhả bớt sự căng cứng trong cơ thể", minutes: 3, steps: ["Nắm chặt hai bàn tay trong 5 giây rồi thả ra", "Nhún vai lên sát tai 5 giây rồi thả xuống", "Xoay cổ chậm sang trái, sang phải", "Lặp lại 3 lần, để ý cảm giác nhẹ hơn sau mỗi lần thả"] },
  { id: "5-4-3-2-1", group: "thugian", name: "Quay về hiện tại 5-4-3-2-1", purpose: "Kéo sự chú ý về lúc này khi đầu óc rối", minutes: 3, steps: ["Kể tên 5 thứ bạn nhìn thấy", "4 thứ bạn chạm vào được", "3 âm thanh bạn nghe thấy", "2 mùi bạn ngửi thấy (hoặc nhớ ra)", "1 điều bạn thấy biết ơn lúc này"] },
  { id: "nghi-mat", group: "thugian", name: "Nghỉ mắt sau giờ học", purpose: "Cho mắt và đầu óc nghỉ ngơi", minutes: 2, steps: ["Nhìn ra xa (cửa sổ, cây xanh) trong 20 giây", "Nhắm mắt, đặt hai lòng bàn tay ấm lên mắt 30 giây", "Chớp mắt chậm 10 lần", "Uống một ngụm nước"] },

  { id: "muon-hieu", group: "khampha", name: "Điều mình muốn người khác hiểu là…", purpose: "Gọi tên nhu cầu ẩn sau cảm xúc", minutes: 5, writing: "Điều mình muốn người khác hiểu là…", steps: ["Nghĩ về một chuyện gần đây làm bạn bận lòng", "Hoàn thành câu bên dưới, viết thật lòng", "Đọc lại và tự hỏi: mình đang cần điều gì?"] },
  { id: "viet-ban-tam", group: "khampha", name: "Viết ra điều đang bận tâm", purpose: "Đưa suy nghĩ ra giấy để đầu óc nhẹ hơn", minutes: 5, writing: "Điều đang làm mình bận tâm là…", steps: ["Viết tự do trong vài phút, không cần hay", "Không ai đọc được nếu bạn không lưu", "Khi xong, hít một hơi sâu"] },
  { id: "biet-chac-lo-lang", group: "khampha", name: "Điều mình biết chắc và điều mình đang lo", purpose: "Tách sự thật khỏi nỗi lo", minutes: 5, writing: "Mình biết chắc: …  /  Mình đang lo: …", steps: ["Chọn một chuyện đang làm bạn lo", "Viết những điều bạn biết chắc là đúng", "Viết những điều bạn chỉ đang lo sẽ xảy ra", "Nhìn lại: phần nào lớn hơn?"] },
  { id: "kiem-soat", group: "khampha", name: "Điều mình kiểm soát được và chưa được", purpose: "Dồn sức vào việc mình làm được", minutes: 5, writing: "Mình kiểm soát được: …  /  Mình chưa kiểm soát được: …", steps: ["Chọn một vấn đề đang gặp", "Liệt kê điều bạn có thể tự làm", "Liệt kê điều phụ thuộc người khác", "Chọn một việc nhỏ trong danh sách đầu để làm hôm nay"] },

  { id: "nho-lang-nghe", group: "ketnoi", name: "Soạn lời nhờ người tin cậy lắng nghe", purpose: "Dễ mở lời hơn khi cần chia sẻ", minutes: 5, writing: "VD: Con/Em có chuyện muốn kể, lúc nào mình nói chuyện được ạ?", steps: ["Nghĩ đến một người bạn tin: bố mẹ, thầy cô, anh chị, bạn thân", "Soạn một tin nhắn ngắn, không cần kể hết", "Bạn có thể gửi ngay hoặc để dành"] },
  { id: "noi-nhu-cau", group: "ketnoi", name: "Tập nói nhu cầu mà không đổ lỗi", purpose: "Giúp người khác hiểu mình, tránh cãi nhau", minutes: 5, writing: "Mình cảm thấy … khi … Mình mong …", steps: ["Dùng mẫu câu: Mình cảm thấy … khi … Mình mong …", "Ví dụ: Mình thấy buồn khi bị ngắt lời. Mình mong được nói hết ý.", "Viết một câu cho chuyện của bạn", "Đọc to để quen miệng"] },
  { id: "xin-giup-truong", group: "ketnoi", name: "Cách xin giúp đỡ ở trường", purpose: "Biết tìm ai khi gặp khó khăn", minutes: 4, steps: ["Liệt kê người có thể giúp: giáo viên chủ nhiệm, thầy cô bộ môn, phòng tư vấn tâm lý, nhân viên y tế", "Nghĩ xem chuyện của bạn hợp với ai nhất", "Chọn thời điểm: giờ ra chơi, cuối buổi, nhắn tin", "Nhớ: nhờ giúp không phải là phiền người khác"] },
  { id: "cam-on", group: "ketnoi", name: "Gửi một lời cảm ơn", purpose: "Nuôi dưỡng kết nối tích cực", minutes: 3, writing: "Mình muốn cảm ơn … vì …", steps: ["Nghĩ đến một người đã giúp bạn gần đây", "Viết một lời cảm ơn ngắn", "Gửi hoặc nói trực tiếp nếu bạn muốn"] },

  { id: "da-co-gang", group: "nhinlai", name: "Ghi nhận một việc mình đã cố gắng", purpose: "Thấy được nỗ lực của chính mình", minutes: 3, writing: "Hôm nay mình đã cố gắng …", steps: ["Nghĩ về hôm nay hoặc tuần này", "Chọn một việc bạn đã cố gắng, dù kết quả thế nào", "Viết một câu ghi nhận"] },
  { id: "thu-ngay-mai", group: "nhinlai", name: "Một điều muốn thử vào ngày mai", purpose: "Tạo một bước nhỏ phía trước", minutes: 3, writing: "Ngày mai mình muốn thử …", steps: ["Chọn một việc nhỏ, làm được trong 10 phút", "Viết ra", "Tối mai nhìn lại xem đã thử chưa"] },
  { id: "vuot-qua", group: "nhinlai", name: "Một lần mình đã vượt qua thử thách", purpose: "Nhớ rằng mình có sức mạnh", minutes: 5, writing: "Lần đó mình đã vượt qua bằng cách …", steps: ["Nhớ lại một chuyện khó bạn từng vượt qua", "Điều gì đã giúp bạn khi đó?", "Điều đó có thể giúp bạn bây giờ không?"] },
  { id: "muon-hoc", group: "nhinlai", name: "Một điều mình muốn học thêm", purpose: "Nuôi dưỡng sự tò mò", minutes: 3, writing: "Mình muốn học thêm về …", steps: ["Nghĩ về điều bạn thấy thú vị gần đây", "Viết ra một điều muốn tìm hiểu", "Ghi một cách bắt đầu: hỏi ai, đọc gì"] },
];
export const activityById = (id: string) => SELF_CARE.find((a) => a.id === id);

// ---------- Giai đoạn của cây (theo điểm phát triển) ----------
export const STAGES = [
  { name: "Hạt mầm", min: 0, text: "Hành trình tìm hiểu cảm xúc bắt đầu từ đây." },
  { name: "Nảy mầm", min: 1, text: "Bạn đã bắt đầu quan sát cảm xúc của mình." },
  { name: "Cây non", min: 5, text: "Bạn đã thử chăm sóc bản thân." },
  { name: "Cây phát triển", min: 12, text: "Khu vườn có thêm nhiều trải nghiệm của bạn." },
  { name: "Khu vườn cá nhân", min: 25, text: "Một khu vườn nhỏ lớn lên từ những lần bạn để ý đến mình." },
];

// ---------- Vật trang trí mở khóa (theo hoạt động, không theo chuỗi ngày) ----------
export const DECOR = [
  { id: "hoa", name: "Bông hoa đầu tiên", how: "Hoàn thành hoạt động chăm sóc đầu tiên" },
  { id: "buom", name: "Chú bướm", how: "Thử hoạt động ở 2 nhóm khác nhau" },
  { id: "chau", name: "Chậu gốm", how: "Nhìn lại hành trình lần đầu" },
  { id: "domdom", name: "Đom đóm", how: "Thử hoạt động ở 3 nhóm khác nhau" },
  { id: "chim", name: "Chú chim nhỏ", how: "Hoàn thành 5 hoạt động" },
  { id: "cauvong", name: "Cầu vồng", how: "Chăm sóc cây tươi lại sau một ngày nặng nề" },
];

export const THEMES = [
  { id: "rung", name: "Rừng xanh", sky: ["#dbeee9", "#b9ddd5"], ground: "#5d9c7a" },
  { id: "bien", name: "Bờ biển", sky: ["#dceaf5", "#b8d4ea"], ground: "#d9c49a" },
  { id: "doi", name: "Đồi chiều", sky: ["#f6e6d6", "#e9cdb5"], ground: "#9aa86b" },
];
