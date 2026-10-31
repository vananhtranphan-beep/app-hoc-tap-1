// ============================================================
// DỮ LIỆU HƯỚNG NGHIỆP (sửa trực tiếp ở file này)
// - 30 câu sở thích: phỏng theo O*NET® Interest Profiler (bản Mini-IP, 30 câu)
//   của Bộ Lao động Hoa Kỳ (USDOL/ETA), dịch và đơn giản hóa cho học sinh lớp 6–9.
// - Danh mục nghề: soạn sẵn, AI KHÔNG tự tạo thông tin nghề.
//   Giáo viên/học sinh có thể đọc duyệt và sửa nội dung bên dưới.
// ============================================================

export type RiasecCode = "R" | "I" | "A" | "S" | "E" | "C";

export const RIASEC: Record<RiasecCode, { name: string; en: string; short: string; like: string }> = {
  R: { name: "Thực tế", en: "Realistic", short: "Làm việc với máy móc, dụng cụ, cây cối, con vật", like: "Thích bắt tay vào làm, lắp ráp, sửa chữa, làm ngoài trời" },
  I: { name: "Nghiên cứu", en: "Investigative", short: "Tìm hiểu, quan sát, phân tích, giải quyết vấn đề", like: "Thích đặt câu hỏi, làm thí nghiệm, tìm ra nguyên nhân" },
  A: { name: "Nghệ thuật", en: "Artistic", short: "Sáng tạo, thể hiện ý tưởng bằng hình ảnh, âm thanh, chữ viết", like: "Thích vẽ, viết, chơi nhạc, thiết kế, làm điều mới lạ" },
  S: { name: "Xã hội", en: "Social", short: "Giúp đỡ, hướng dẫn, chăm sóc người khác", like: "Thích lắng nghe, dạy bạn, làm việc nhóm, giúp người gặp khó khăn" },
  E: { name: "Quản lý", en: "Enterprising", short: "Thuyết phục, lãnh đạo, kinh doanh", like: "Thích dẫn dắt nhóm, đưa ra quyết định, thuyết trình, buôn bán" },
  C: { name: "Nghiệp vụ", en: "Conventional", short: "Làm việc với số liệu, giấy tờ, quy trình rõ ràng", like: "Thích sắp xếp ngăn nắp, tính toán cẩn thận, làm theo quy trình" },
};

export const RIASEC_ORDER: RiasecCode[] = ["R", "I", "A", "S", "E", "C"];

// ---------- 30 câu sở thích (5 câu mỗi nhóm), thứ tự xen kẽ như bản gốc ----------
export const INTEREST_ITEMS: { id: number; code: RiasecCode; text: string }[] = [
  { id: 1, code: "R", text: "Đóng tủ bếp bằng gỗ" },
  { id: 2, code: "I", text: "Nghiên cứu tạo ra một loại thuốc mới" },
  { id: 3, code: "A", text: "Viết truyện hoặc kịch" },
  { id: 4, code: "S", text: "Giúp đỡ người đang gặp chuyện buồn hoặc khó khăn trong cuộc sống" },
  { id: 5, code: "E", text: "Quản lý một bộ phận trong một công ty lớn" },
  { id: 6, code: "C", text: "Cài đặt phần mềm cho nhiều máy tính trong một hệ thống mạng" },
  { id: 7, code: "R", text: "Sửa đồ điện trong nhà như quạt, nồi cơm điện" },
  { id: 8, code: "I", text: "Tìm cách giảm ô nhiễm nguồn nước" },
  { id: 9, code: "A", text: "Sáng tác hoặc phối khí một bản nhạc" },
  { id: 10, code: "S", text: "Tư vấn cho người khác chọn nghề" },
  { id: 11, code: "E", text: "Tự mở một cửa hàng hoặc công ty của riêng mình" },
  { id: 12, code: "C", text: "Dùng máy tính cầm tay để tính toán số liệu" },
  { id: 13, code: "R", text: "Lắp ráp các linh kiện điện tử" },
  { id: 14, code: "I", text: "Làm thí nghiệm hóa học" },
  { id: 15, code: "A", text: "Làm hiệu ứng đặc biệt cho phim" },
  { id: 16, code: "S", text: "Hướng dẫn người bị thương tập luyện để phục hồi sức khỏe" },
  { id: 17, code: "E", text: "Thương lượng để ký hợp đồng làm ăn" },
  { id: 18, code: "C", text: "Ghi chép sổ sách hàng hóa nhập vào và xuất ra" },
  { id: 19, code: "R", text: "Lái xe tải giao hàng đến các cơ quan và nhà dân" },
  { id: 20, code: "I", text: "Quan sát mẫu máu bằng kính hiển vi" },
  { id: 21, code: "A", text: "Vẽ và trang trí sân khấu cho vở kịch" },
  { id: 22, code: "S", text: "Làm tình nguyện cho một tổ chức từ thiện" },
  { id: 23, code: "E", text: "Quảng bá một mẫu quần áo mới ra thị trường" },
  { id: 24, code: "C", text: "Kiểm kê hàng trong kho bằng máy quét cầm tay" },
  { id: 25, code: "R", text: "Kiểm tra chất lượng sản phẩm trước khi gửi đi" },
  { id: 26, code: "I", text: "Tìm cách dự báo thời tiết chính xác hơn" },
  { id: 27, code: "A", text: "Viết kịch bản cho phim hoặc chương trình truyền hình" },
  { id: 28, code: "S", text: "Dạy học cho học sinh" },
  { id: 29, code: "E", text: "Bán hàng ở một trung tâm thương mại" },
  { id: 30, code: "C", text: "Phân loại và chuyển thư từ, giấy tờ trong một cơ quan" },
];

// Thang trả lời 5 mức (0–4) giống bản gốc
export const LIKERT = [
  { value: 0, label: "Rất không thích" },
  { value: 1, label: "Không thích" },
  { value: 2, label: "Chưa chắc" },
  { value: 3, label: "Thích" },
  { value: 4, label: "Rất thích" },
];

// ---------- Câu hỏi thêm (em tự chọn, không bắt buộc) ----------
export const SUBJECTS = [
  "Toán", "Ngữ văn", "Tiếng Anh", "Khoa học tự nhiên", "Lịch sử và Địa lí", "Giáo dục công dân",
  "Tin học", "Công nghệ", "Giáo dục thể chất", "Nghệ thuật (Âm nhạc, Mĩ thuật)", "Hoạt động trải nghiệm",
];
export const STRENGTHS = [
  "Tính toán, tư duy logic", "Giao tiếp, thuyết trình", "Sáng tạo, nhiều ý tưởng", "Khéo tay",
  "Kiên nhẫn, cẩn thận", "Làm việc nhóm", "Lãnh đạo, tổ chức", "Ghi nhớ tốt",
  "Viết, diễn đạt", "Vận động, thể lực", "Ngoại ngữ", "Quan sát tinh ý",
];
export const ACTIVITIES = [
  "Chơi thể thao", "Vẽ, làm đồ thủ công", "Đọc sách, viết", "Chơi nhạc, hát", "Lập trình, chơi với máy tính",
  "Nấu ăn", "Chăm cây, nuôi con vật", "Tháo lắp, sửa đồ", "Tham gia câu lạc bộ, hoạt động tập thể",
  "Buôn bán nhỏ, làm hội chợ", "Quay video, chụp ảnh", "Giải đố, chơi cờ",
];
export const ENVIRONMENTS = [
  "Trong văn phòng", "Ngoài trời", "Phòng thí nghiệm", "Xưởng, công trường", "Bệnh viện, phòng khám",
  "Trường học", "Cửa hàng, nhà hàng", "Làm ở nhà, tự do", "Đi lại nhiều nơi",
];
export const SKILLS_TO_GROW = [
  "Tự tin nói trước đám đông", "Quản lý thời gian", "Tiếng Anh", "Tin học, lập trình", "Làm việc nhóm",
  "Giải quyết vấn đề", "Sáng tạo", "Kỹ năng tay nghề", "Viết và trình bày",
];

// ---------- Hoạt động trải nghiệm nghề ----------
export interface Experience {
  title: string;
  goal: string;
  steps: string[];
  minutes: number;
  result: string;
  reflect: string[];
}

export interface Career {
  id: string;
  name: string;
  codes: RiasecCode[]; // nhóm chính đứng đầu
  field: string;
  desc: string;
  activities: string[];
  skills: string[];
  subjects: string[];
  experience: Experience;
  related: string[];
}

const REFLECT = [
  "Phần nào trong hoạt động làm bạn thấy hứng thú nhất?",
  "Phần nào khó hoặc chưa thích? Vì sao?",
  "Bạn muốn tìm hiểu thêm điều gì về nghề này?",
];

export const CAREERS: Career[] = [
  // ===== THỰC TẾ (R) =====
  {
    id: "ky-su-co-khi", name: "Kỹ sư cơ khí", codes: ["R", "I", "C"], field: "Kỹ thuật, chế tạo",
    desc: "Thiết kế, chế tạo và bảo trì máy móc, từ xe máy, máy bơm đến dây chuyền sản xuất trong nhà máy.",
    activities: ["Vẽ bản thiết kế máy bằng phần mềm", "Tính toán độ bền của chi tiết", "Kiểm tra máy chạy thử trong xưởng"],
    skills: ["Tư duy không gian", "Tính toán", "Giải quyết sự cố", "Làm việc nhóm"],
    subjects: ["Toán", "Khoa học tự nhiên", "Công nghệ", "Tin học"],
    experience: { title: "Tháo lắp một món đồ đơn giản", goal: "Hiểu một thiết bị hoạt động nhờ những bộ phận nào", steps: ["Xin phép người lớn chọn một món đồ cũ, không cắm điện (bút bi bấm, đồ chơi, ổ khóa cũ)", "Tháo từng bộ phận, chụp ảnh hoặc vẽ lại thứ tự", "Ghi tên và chức năng mỗi bộ phận", "Lắp lại như cũ"], minutes: 30, result: "Một sơ đồ các bộ phận và cách chúng phối hợp", reflect: REFLECT },
    related: ["ky-thuat-vien-o-to", "ky-su-xay-dung", "tho-dien"],
  },
  {
    id: "tho-dien", name: "Thợ điện dân dụng", codes: ["R", "C"], field: "Kỹ thuật, xây dựng",
    desc: "Lắp đặt, kiểm tra và sửa chữa hệ thống điện trong nhà ở, trường học, cửa hàng, bảo đảm an toàn điện.",
    activities: ["Đi dây điện, lắp ổ cắm, công tắc, đèn", "Dùng đồng hồ đo kiểm tra mạch", "Tìm và sửa chỗ chập điện"],
    skills: ["Cẩn thận, tuân thủ an toàn", "Khéo tay", "Đọc sơ đồ mạch", "Giải quyết sự cố"],
    subjects: ["Khoa học tự nhiên", "Công nghệ", "Toán"],
    experience: { title: "Vẽ sơ đồ điện một căn phòng", goal: "Làm quen cách nghĩ của thợ điện mà không chạm vào điện", steps: ["Quan sát (không chạm) đèn, quạt, ổ cắm, công tắc trong phòng", "Vẽ sơ đồ vị trí và đoán công tắc nào điều khiển thiết bị nào", "Hỏi người lớn để kiểm tra dự đoán", "Ghi 3 quy tắc an toàn điện bạn biết"], minutes: 25, result: "Sơ đồ điện phòng và 3 quy tắc an toàn", reflect: REFLECT },
    related: ["ky-su-co-khi", "quan-tri-mang"],
  },
  {
    id: "ky-thuat-vien-o-to", name: "Kỹ thuật viên ô tô", codes: ["R", "I"], field: "Kỹ thuật, giao thông",
    desc: "Kiểm tra, bảo dưỡng và sửa chữa ô tô, xe máy; ngày nay làm việc cả với xe điện và thiết bị chẩn đoán điện tử.",
    activities: ["Chẩn đoán lỗi bằng máy đọc lỗi", "Thay dầu, kiểm tra phanh, lốp", "Giải thích cho khách tình trạng xe"],
    skills: ["Khéo tay", "Quan sát", "Giải quyết sự cố", "Giao tiếp với khách"],
    subjects: ["Công nghệ", "Khoa học tự nhiên", "Toán"],
    experience: { title: "Kiểm tra xe đạp như thợ chuyên nghiệp", goal: "Tập quy trình kiểm tra một phương tiện", steps: ["Lập danh sách kiểm tra: lốp, phanh, xích, đèn, chuông", "Kiểm tra từng mục trên xe đạp của bạn", "Ghi tình trạng: tốt / cần chỉnh / cần sửa", "Nhờ người lớn cùng chỉnh một lỗi nhỏ"], minutes: 30, result: "Phiếu kiểm tra xe đạp đã điền", reflect: REFLECT },
    related: ["ky-su-co-khi", "tho-dien"],
  },
  {
    id: "ky-su-xay-dung", name: "Kỹ sư xây dựng", codes: ["R", "I", "C"], field: "Xây dựng",
    desc: "Thiết kế và giám sát xây dựng nhà, cầu, đường, bảo đảm công trình an toàn, bền vững và đúng dự toán.",
    activities: ["Tính toán kết cấu công trình", "Giám sát thi công ở công trường", "Lập kế hoạch vật tư và tiến độ"],
    skills: ["Tính toán", "Đọc bản vẽ", "Quản lý tiến độ", "Làm việc nhóm"],
    subjects: ["Toán", "Khoa học tự nhiên", "Công nghệ"],
    experience: { title: "Xây cây cầu bằng giấy", goal: "Thử thiết kế để một cấu trúc chịu lực", steps: ["Dùng 10 tờ giấy và băng dính làm cầu nối hai chồng sách cách nhau 20 cm", "Đặt dần đồng xu lên giữa cầu", "Đếm số đồng xu trước khi cầu sập", "Sửa thiết kế và thử lại một lần"], minutes: 40, result: "Hai mẫu cầu và số đồng xu mỗi mẫu chịu được", reflect: REFLECT },
    related: ["kien-truc-su", "ky-su-co-khi"],
  },
  {
    id: "ky-su-nong-nghiep", name: "Kỹ sư nông nghiệp", codes: ["R", "I"], field: "Nông nghiệp",
    desc: "Nghiên cứu và hướng dẫn cách trồng trọt, chăn nuôi hiệu quả, áp dụng công nghệ như tưới tự động, nhà màng.",
    activities: ["Theo dõi sinh trưởng của cây trồng", "Kiểm tra đất, nước, sâu bệnh", "Hướng dẫn nông dân kỹ thuật mới"],
    skills: ["Quan sát", "Kiên nhẫn", "Ghi chép số liệu", "Làm việc ngoài trời"],
    subjects: ["Khoa học tự nhiên", "Công nghệ", "Toán"],
    experience: { title: "Gieo hạt và theo dõi 7 ngày", goal: "Tập quan sát và ghi số liệu như kỹ sư nông nghiệp", steps: ["Gieo vài hạt đậu xanh vào hai cốc: một cốc để chỗ sáng, một cốc chỗ tối", "Tưới nước như nhau mỗi ngày", "Đo chiều cao mầm mỗi ngày và ghi vào bảng", "So sánh hai cốc sau 7 ngày"], minutes: 15, result: "Bảng số liệu 7 ngày và nhận xét", reflect: REFLECT },
    related: ["ky-su-moi-truong", "dau-bep"],
  },
  {
    id: "dau-bep", name: "Đầu bếp", codes: ["R", "A", "E"], field: "Nhà hàng, ẩm thực",
    desc: "Chế biến món ăn ở nhà hàng, khách sạn; sáng tạo món mới, giữ vệ sinh an toàn thực phẩm và quản lý bếp.",
    activities: ["Sơ chế và nấu món theo thực đơn", "Trình bày món ăn đẹp mắt", "Kiểm tra nguyên liệu và vệ sinh bếp"],
    skills: ["Khéo tay", "Sáng tạo", "Chịu được áp lực thời gian", "Làm việc nhóm"],
    subjects: ["Công nghệ", "Khoa học tự nhiên", "Nghệ thuật (Âm nhạc, Mĩ thuật)"],
    experience: { title: "Làm một món đơn giản theo công thức", goal: "Trải nghiệm làm việc theo công thức và trình bày món", steps: ["Cùng người lớn chọn món không cần dao sắc hay lửa lớn (salad, bánh mì kẹp)", "Đọc công thức, chuẩn bị đủ nguyên liệu", "Làm và trình bày món", "Mời người nhà nếm và góp ý"], minutes: 40, result: "Một món ăn và lời góp ý của người nếm", reflect: REFLECT },
    related: ["quan-ly-nha-hang", "ky-su-nong-nghiep"],
  },

  // ===== NGHIÊN CỨU (I) =====
  {
    id: "bac-si", name: "Bác sĩ", codes: ["I", "S", "R"], field: "Y tế",
    desc: "Khám bệnh, chẩn đoán và điều trị cho người bệnh; tư vấn cách phòng bệnh và giữ gìn sức khỏe.",
    activities: ["Hỏi bệnh và khám cho bệnh nhân", "Đọc kết quả xét nghiệm, phim chụp", "Lên phác đồ điều trị"],
    skills: ["Ghi nhớ tốt", "Phân tích", "Đồng cảm, giao tiếp", "Chịu áp lực"],
    subjects: ["Khoa học tự nhiên", "Toán", "Tiếng Anh"],
    experience: { title: "Tìm hiểu một ngày của nhân viên y tế", goal: "Biết thực tế công việc trong ngành y", steps: ["Chuẩn bị 5 câu hỏi về công việc hằng ngày", "Phỏng vấn một người làm y tế (người thân, nhân viên y tế trường) hoặc xem một phóng sự đáng tin cậy", "Ghi lại điều bất ngờ nhất", "Viết 5 dòng tóm tắt"], minutes: 30, result: "Bản ghi phỏng vấn ngắn", reflect: REFLECT },
    related: ["dieu-duong", "duoc-si", "ky-thuat-vien-xet-nghiem"],
  },
  {
    id: "duoc-si", name: "Dược sĩ", codes: ["I", "C", "S"], field: "Y tế",
    desc: "Tìm hiểu, kiểm tra và cấp phát thuốc; hướng dẫn người bệnh dùng thuốc đúng cách, an toàn.",
    activities: ["Kiểm tra đơn thuốc", "Hướng dẫn cách dùng thuốc", "Quản lý chất lượng và hạn dùng của thuốc"],
    skills: ["Cẩn thận, chính xác", "Ghi nhớ", "Giao tiếp", "Tuân thủ quy định"],
    subjects: ["Khoa học tự nhiên", "Toán", "Tiếng Anh"],
    experience: { title: "Đọc hiểu tờ hướng dẫn sử dụng", goal: "Tập đọc thông tin quan trọng như dược sĩ", steps: ["Cùng người lớn lấy tờ hướng dẫn của một loại thuốc thông dụng trong nhà (không tự dùng thuốc)", "Tìm: công dụng, liều dùng, chống chỉ định, hạn dùng", "Ghi lại thông tin vào bảng", "Hỏi người lớn vì sao phải đọc kỹ trước khi dùng"], minutes: 20, result: "Bảng tóm tắt thông tin thuốc", reflect: REFLECT },
    related: ["bac-si", "ky-thuat-vien-xet-nghiem"],
  },
  {
    id: "ky-su-moi-truong", name: "Kỹ sư môi trường", codes: ["I", "R", "S"], field: "Môi trường",
    desc: "Nghiên cứu và đưa ra giải pháp xử lý nước thải, rác thải, ô nhiễm không khí để bảo vệ môi trường sống.",
    activities: ["Lấy mẫu nước, đất, không khí", "Phân tích số liệu ô nhiễm", "Thiết kế hệ thống xử lý rác, nước thải"],
    skills: ["Phân tích", "Quan sát", "Làm việc thực địa", "Viết báo cáo"],
    subjects: ["Khoa học tự nhiên", "Toán", "Lịch sử và Địa lí"],
    experience: { title: "Khảo sát rác thải ở nhà trong 3 ngày", goal: "Tập thu thập số liệu và đề xuất giải pháp", steps: ["Chia rác thành: nhựa, giấy, thức ăn, khác", "Đếm hoặc cân mỗi loại trong 3 ngày", "Vẽ biểu đồ cột", "Đề xuất 2 cách giảm loại rác nhiều nhất"], minutes: 20, result: "Biểu đồ rác và 2 đề xuất", reflect: REFLECT },
    related: ["ky-su-nong-nghiep", "phan-tich-du-lieu"],
  },
  {
    id: "lap-trinh-vien", name: "Lập trình viên", codes: ["I", "C", "R"], field: "Công nghệ thông tin",
    desc: "Viết phần mềm, ứng dụng điện thoại, trang web, trò chơi; tìm và sửa lỗi để chương trình chạy đúng.",
    activities: ["Viết code theo yêu cầu", "Kiểm thử và sửa lỗi", "Trao đổi với nhóm thiết kế sản phẩm"],
    skills: ["Tư duy logic", "Kiên nhẫn", "Tự học", "Tiếng Anh"],
    subjects: ["Tin học", "Toán", "Tiếng Anh"],
    experience: { title: "Làm một chương trình nhỏ bằng Scratch", goal: "Thử cảm giác ra lệnh cho máy tính", steps: ["Mở Scratch (trang scratch.mit.edu) hoặc phần mềm đã học ở môn Tin học", "Làm nhân vật di chuyển bằng phím mũi tên", "Thêm điểm số khi chạm vào vật", "Nhờ bạn chơi thử và sửa một lỗi"], minutes: 45, result: "Một trò chơi nhỏ chạy được", reflect: REFLECT },
    related: ["phan-tich-du-lieu", "quan-tri-mang", "thiet-ke-do-hoa"],
  },
  {
    id: "phan-tich-du-lieu", name: "Chuyên viên phân tích dữ liệu", codes: ["I", "C", "E"], field: "Công nghệ, kinh tế",
    desc: "Thu thập và phân tích số liệu để tìm ra xu hướng, giúp công ty, trường học, bệnh viện ra quyết định tốt hơn.",
    activities: ["Làm sạch và sắp xếp dữ liệu", "Vẽ biểu đồ, tính toán thống kê", "Trình bày kết quả cho người quản lý"],
    skills: ["Tính toán", "Tư duy logic", "Trình bày", "Cẩn thận"],
    subjects: ["Toán", "Tin học", "Tiếng Anh"],
    experience: { title: "Khảo sát nhỏ trong lớp", goal: "Thử quy trình thu thập và phân tích dữ liệu", steps: ["Đặt 1 câu hỏi khảo sát (VD: môn học bạn thích nhất)", "Hỏi 15–20 bạn, ghi vào bảng", "Dùng Excel hoặc giấy vẽ biểu đồ", "Viết 3 nhận xét từ biểu đồ"], minutes: 40, result: "Biểu đồ và 3 nhận xét", reflect: REFLECT },
    related: ["lap-trinh-vien", "ke-toan", "marketing"],
  },
  {
    id: "ky-thuat-vien-xet-nghiem", name: "Kỹ thuật viên xét nghiệm y học", codes: ["I", "R", "C"], field: "Y tế",
    desc: "Làm xét nghiệm máu, nước tiểu và các mẫu khác trong phòng thí nghiệm để giúp bác sĩ chẩn đoán bệnh.",
    activities: ["Chuẩn bị và phân tích mẫu", "Vận hành máy xét nghiệm", "Ghi và kiểm tra kết quả chính xác"],
    skills: ["Cẩn thận, chính xác", "Quan sát", "Tuân thủ quy trình", "Làm việc độc lập"],
    subjects: ["Khoa học tự nhiên", "Toán", "Tin học"],
    experience: { title: "Quan sát tế bào hành tây", goal: "Làm quen thao tác phòng thí nghiệm", steps: ["Làm trong giờ thực hành KHTN có giáo viên hướng dẫn", "Bóc lớp vỏ mỏng hành tây, đặt lên lam kính", "Quan sát dưới kính hiển vi", "Vẽ lại hình tế bào và ghi chú"], minutes: 45, result: "Hình vẽ tế bào có chú thích", reflect: REFLECT },
    related: ["bac-si", "duoc-si"],
  },

  // ===== NGHỆ THUẬT (A) =====
  {
    id: "thiet-ke-do-hoa", name: "Nhà thiết kế đồ họa", codes: ["A", "E", "I"], field: "Thiết kế, truyền thông",
    desc: "Thiết kế logo, áp phích, giao diện ứng dụng, bao bì sản phẩm để truyền tải thông điệp bằng hình ảnh.",
    activities: ["Phác thảo ý tưởng", "Thiết kế trên máy tính", "Chỉnh sửa theo góp ý của khách hàng"],
    skills: ["Sáng tạo", "Thẩm mỹ", "Dùng phần mềm thiết kế", "Lắng nghe góp ý"],
    subjects: ["Nghệ thuật (Âm nhạc, Mĩ thuật)", "Tin học", "Ngữ văn"],
    experience: { title: "Thiết kế áp phích cho sự kiện lớp", goal: "Thử truyền tải thông điệp bằng hình ảnh", steps: ["Chọn một sự kiện (ngày hội sách, giải bóng đá lớp)", "Phác 3 ý tưởng bố cục trên giấy", "Hoàn thiện một áp phích bằng tay hoặc Canva", "Hỏi 3 bạn: nhìn 5 giây có hiểu thông điệp không?"], minutes: 45, result: "Một áp phích và góp ý của bạn", reflect: REFLECT },
    related: ["kien-truc-su", "thiet-ke-thoi-trang", "marketing"],
  },
  {
    id: "kien-truc-su", name: "Kiến trúc sư", codes: ["A", "I", "R"], field: "Kiến trúc, xây dựng",
    desc: "Thiết kế nhà ở, trường học, công viên vừa đẹp vừa tiện dụng, an toàn và hợp với môi trường xung quanh.",
    activities: ["Gặp khách hàng tìm hiểu nhu cầu", "Vẽ phương án thiết kế, dựng mô hình 3D", "Phối hợp với kỹ sư xây dựng"],
    skills: ["Sáng tạo", "Tư duy không gian", "Vẽ", "Trình bày ý tưởng"],
    subjects: ["Nghệ thuật (Âm nhạc, Mĩ thuật)", "Toán", "Công nghệ"],
    experience: { title: "Thiết kế lại góc học tập", goal: "Thử thiết kế không gian theo nhu cầu người dùng", steps: ["Đo kích thước góc học tập", "Vẽ mặt bằng theo tỉ lệ trên giấy kẻ ô", "Đề xuất cách sắp xếp lại cho sáng và gọn hơn", "Giải thích lý do cho người nhà"], minutes: 40, result: "Bản vẽ mặt bằng có tỉ lệ", reflect: REFLECT },
    related: ["ky-su-xay-dung", "thiet-ke-do-hoa"],
  },
  {
    id: "nhac-si", name: "Nhạc sĩ, nhạc công", codes: ["A", "S", "E"], field: "Âm nhạc, giải trí",
    desc: "Sáng tác, biểu diễn hoặc phối khí âm nhạc cho ca sĩ, phim, quảng cáo, trò chơi; có thể dạy nhạc.",
    activities: ["Luyện tập nhạc cụ hằng ngày", "Sáng tác, thu âm", "Biểu diễn trước khán giả"],
    skills: ["Cảm thụ âm nhạc", "Kiên trì luyện tập", "Sáng tạo", "Tự tin biểu diễn"],
    subjects: ["Nghệ thuật (Âm nhạc, Mĩ thuật)", "Ngữ văn", "Tiếng Anh"],
    experience: { title: "Viết lời mới cho một giai điệu", goal: "Thử sáng tác ở mức đơn giản", steps: ["Chọn một giai điệu quen thuộc, ngắn", "Viết lời mới về một chủ đề bạn thích", "Hát hoặc đọc theo nhịp, ghi âm bằng điện thoại", "Nghe lại và sửa một câu"], minutes: 30, result: "Bản ghi âm lời bài hát mới", reflect: REFLECT },
    related: ["lam-phim", "giao-vien"],
  },
  {
    id: "nha-bao", name: "Nhà báo, biên tập viên", codes: ["A", "E", "S"], field: "Truyền thông",
    desc: "Tìm hiểu sự kiện, phỏng vấn, viết bài, làm video tin tức; kiểm chứng thông tin trước khi đưa đến người đọc.",
    activities: ["Đi phỏng vấn, ghi chép", "Viết và biên tập bài", "Kiểm tra độ chính xác của thông tin"],
    skills: ["Viết", "Giao tiếp", "Tò mò", "Trung thực, kiểm chứng thông tin"],
    subjects: ["Ngữ văn", "Lịch sử và Địa lí", "Tiếng Anh"],
    experience: { title: "Viết bản tin trường", goal: "Thử quy trình làm tin", steps: ["Chọn một sự kiện ở trường", "Phỏng vấn 2 người có mặt", "Viết bản tin 150 chữ trả lời: Ai, Cái gì, Khi nào, Ở đâu, Vì sao", "Đọc lại, kiểm tra tên và số liệu"], minutes: 40, result: "Bản tin 150 chữ", reflect: REFLECT },
    related: ["lam-phim", "marketing"],
  },
  {
    id: "lam-phim", name: "Người làm phim, dựng phim", codes: ["A", "E", "R"], field: "Điện ảnh, truyền thông",
    desc: "Lên ý tưởng, quay, dựng phim, phim ngắn, video quảng cáo; làm hiệu ứng hình ảnh và âm thanh.",
    activities: ["Viết kịch bản phân cảnh", "Quay hình, ghi âm", "Dựng phim, làm hiệu ứng trên máy tính"],
    skills: ["Sáng tạo", "Kể chuyện", "Dùng phần mềm dựng phim", "Làm việc nhóm"],
    subjects: ["Ngữ văn", "Nghệ thuật (Âm nhạc, Mĩ thuật)", "Tin học"],
    experience: { title: "Làm phim ngắn 1 phút", goal: "Trải nghiệm quy trình kịch bản – quay – dựng", steps: ["Viết kịch bản 5 cảnh về một chủ đề đơn giản", "Quay bằng điện thoại", "Dựng bằng ứng dụng miễn phí, thêm chữ và nhạc", "Chiếu cho người nhà xem"], minutes: 60, result: "Một phim ngắn 1 phút", reflect: REFLECT },
    related: ["nha-bao", "thiet-ke-do-hoa", "nhac-si"],
  },
  {
    id: "thiet-ke-thoi-trang", name: "Nhà thiết kế thời trang", codes: ["A", "E", "R"], field: "Thời trang",
    desc: "Sáng tạo mẫu quần áo, phụ kiện; chọn chất liệu, màu sắc và theo dõi quá trình may mẫu.",
    activities: ["Vẽ phác thảo mẫu", "Chọn vải, phối màu", "Làm việc với thợ may hoàn thiện mẫu"],
    skills: ["Sáng tạo", "Thẩm mỹ", "Khéo tay", "Nắm xu hướng"],
    subjects: ["Nghệ thuật (Âm nhạc, Mĩ thuật)", "Công nghệ"],
    experience: { title: "Thiết kế lại đồng phục lớp", goal: "Thử thiết kế có điều kiện ràng buộc", steps: ["Liệt kê yêu cầu: thoải mái, dễ giặt, hợp thời tiết", "Vẽ 2 phác thảo có màu", "Ghi chất liệu vải đề xuất", "Lấy ý kiến 5 bạn và chọn mẫu"], minutes: 40, result: "2 phác thảo và kết quả bình chọn", reflect: REFLECT },
    related: ["thiet-ke-do-hoa", "marketing"],
  },

  // ===== XÃ HỘI (S) =====
  {
    id: "giao-vien", name: "Giáo viên", codes: ["S", "A", "E"], field: "Giáo dục",
    desc: "Dạy học, giúp học sinh hiểu bài, phát triển kỹ năng và phẩm chất; phối hợp với phụ huynh.",
    activities: ["Soạn bài và chuẩn bị đồ dùng dạy học", "Giảng dạy, tổ chức hoạt động trên lớp", "Chấm bài và nhận xét"],
    skills: ["Giao tiếp, thuyết trình", "Kiên nhẫn", "Sáng tạo", "Thấu hiểu"],
    subjects: ["Ngữ văn", "Toán", "Hoạt động trải nghiệm"],
    experience: { title: "Dạy một bạn hoặc em nhỏ một kiến thức", goal: "Thử giải thích để người khác hiểu", steps: ["Chọn một kiến thức bạn nắm chắc", "Chuẩn bị cách giảng 10 phút, có ví dụ", "Dạy cho một bạn hoặc em nhỏ", "Hỏi lại 2 câu để kiểm tra người học hiểu chưa"], minutes: 30, result: "Bài giảng 10 phút và kết quả 2 câu hỏi", reflect: REFLECT },
    related: ["tam-ly-hoc-duong", "huan-luyen-vien"],
  },
  {
    id: "dieu-duong", name: "Điều dưỡng", codes: ["S", "I", "R"], field: "Y tế",
    desc: "Chăm sóc người bệnh hằng ngày: theo dõi sức khỏe, cho dùng thuốc theo y lệnh, động viên và hướng dẫn người bệnh.",
    activities: ["Đo huyết áp, nhiệt độ, theo dõi bệnh nhân", "Thực hiện chăm sóc theo y lệnh", "Hướng dẫn người nhà chăm sóc"],
    skills: ["Tận tâm", "Cẩn thận", "Giao tiếp", "Bình tĩnh"],
    subjects: ["Khoa học tự nhiên", "Giáo dục công dân", "Tiếng Anh"],
    experience: { title: "Học sơ cứu cơ bản", goal: "Làm quen với việc chăm sóc người khác an toàn", steps: ["Tìm tài liệu sơ cứu của nhà trường hoặc Hội Chữ thập đỏ", "Học cách xử lý vết xước nhỏ và chảy máu cam", "Thực hành băng bó cho bạn (giả định)", "Ghi khi nào cần gọi người lớn hoặc 115"], minutes: 30, result: "Ghi chú các bước sơ cứu", reflect: REFLECT },
    related: ["bac-si", "vat-ly-tri-lieu"],
  },
  {
    id: "tam-ly-hoc-duong", name: "Chuyên viên tâm lý học đường", codes: ["S", "I", "A"], field: "Giáo dục, tâm lý",
    desc: "Lắng nghe và hỗ trợ học sinh về cảm xúc, học tập, quan hệ bạn bè; phối hợp với giáo viên và phụ huynh.",
    activities: ["Trò chuyện, tư vấn cho học sinh", "Tổ chức buổi sinh hoạt kỹ năng", "Phối hợp với gia đình khi cần"],
    skills: ["Lắng nghe", "Thấu hiểu", "Giữ bí mật", "Giao tiếp"],
    subjects: ["Giáo dục công dân", "Ngữ văn", "Hoạt động trải nghiệm"],
    experience: { title: "Luyện lắng nghe tích cực", goal: "Thử kỹ năng cốt lõi của người tư vấn", steps: ["Nhờ một người thân kể về ngày của họ trong 5 phút", "Chỉ lắng nghe, không ngắt lời, không khuyên", "Tóm tắt lại điều bạn nghe và hỏi: mình hiểu đúng chưa?", "Hỏi người kể cảm thấy thế nào khi được nghe"], minutes: 15, result: "Ghi chú cảm nhận của hai người", reflect: REFLECT },
    related: ["giao-vien", "cong-tac-xa-hoi"],
  },
  {
    id: "cong-tac-xa-hoi", name: "Nhân viên công tác xã hội", codes: ["S", "E", "C"], field: "Xã hội",
    desc: "Hỗ trợ người có hoàn cảnh khó khăn, trẻ em, người cao tuổi, người khuyết tật tiếp cận các dịch vụ và quyền lợi.",
    activities: ["Gặp gỡ, tìm hiểu hoàn cảnh", "Kết nối với các chương trình hỗ trợ", "Tổ chức hoạt động cộng đồng"],
    skills: ["Thấu hiểu", "Giao tiếp", "Tổ chức", "Kiên nhẫn"],
    subjects: ["Giáo dục công dân", "Ngữ văn", "Hoạt động trải nghiệm"],
    experience: { title: "Lên kế hoạch một hoạt động thiện nguyện nhỏ", goal: "Thử tổ chức hoạt động giúp cộng đồng", steps: ["Chọn một việc nhỏ (quyên góp sách cũ, dọn vệ sinh khu phố)", "Lập kế hoạch: ai, làm gì, khi nào, cần gì", "Xin ý kiến giáo viên chủ nhiệm", "Thực hiện cùng bạn bè nếu được đồng ý"], minutes: 45, result: "Bản kế hoạch hoạt động", reflect: REFLECT },
    related: ["tam-ly-hoc-duong", "giao-vien"],
  },
  {
    id: "huan-luyen-vien", name: "Huấn luyện viên thể thao", codes: ["S", "R", "E"], field: "Thể thao",
    desc: "Lên giáo án tập luyện, hướng dẫn kỹ thuật và rèn tinh thần cho vận động viên hoặc học sinh.",
    activities: ["Lập kế hoạch buổi tập", "Hướng dẫn và sửa động tác", "Theo dõi tiến bộ của người tập"],
    skills: ["Vận động", "Động viên người khác", "Quan sát", "Lãnh đạo"],
    subjects: ["Giáo dục thể chất", "Khoa học tự nhiên"],
    experience: { title: "Hướng dẫn bài khởi động 10 phút", goal: "Thử dẫn dắt người khác tập luyện", steps: ["Thiết kế bài khởi động 10 phút gồm 5 động tác", "Ghi số lần và chú ý an toàn mỗi động tác", "Hướng dẫn cho 3–4 bạn hoặc người nhà", "Hỏi họ thấy động tác nào khó"], minutes: 25, result: "Giáo án khởi động 10 phút", reflect: REFLECT },
    related: ["vat-ly-tri-lieu", "giao-vien"],
  },
  {
    id: "vat-ly-tri-lieu", name: "Kỹ thuật viên vật lý trị liệu", codes: ["S", "R", "I"], field: "Y tế, phục hồi chức năng",
    desc: "Hướng dẫn người bị chấn thương, người cao tuổi, người bệnh tập luyện để phục hồi khả năng vận động.",
    activities: ["Đánh giá khả năng vận động", "Hướng dẫn bài tập phục hồi", "Theo dõi và động viên người tập"],
    skills: ["Kiên nhẫn", "Thấu hiểu", "Hiểu biết cơ thể người", "Giao tiếp"],
    subjects: ["Khoa học tự nhiên", "Giáo dục thể chất"],
    experience: { title: "Tìm hiểu tư thế ngồi học đúng", goal: "Làm quen với việc chăm sóc cơ thể và vận động", steps: ["Tìm tài liệu về tư thế ngồi học đúng", "Quan sát tư thế của bạn khi học 30 phút (nhờ người chụp ảnh)", "So sánh với tư thế đúng", "Chọn 3 động tác giãn cơ để tập giữa giờ"], minutes: 30, result: "Ghi chú tư thế và 3 động tác giãn cơ", reflect: REFLECT },
    related: ["dieu-duong", "huan-luyen-vien"],
  },

  // ===== QUẢN LÝ (E) =====
  {
    id: "khoi-nghiep", name: "Người khởi nghiệp, chủ doanh nghiệp", codes: ["E", "A", "C"], field: "Kinh doanh",
    desc: "Tìm ra nhu cầu của khách hàng, lập công ty hoặc cửa hàng, quản lý vốn, con người và sản phẩm.",
    activities: ["Tìm ý tưởng và lập kế hoạch kinh doanh", "Gọi vốn, quản lý chi tiêu", "Tuyển người và dẫn dắt nhóm"],
    skills: ["Lãnh đạo", "Dám thử, chịu được thất bại", "Tính toán", "Thuyết phục"],
    subjects: ["Toán", "Giáo dục công dân", "Tiếng Anh"],
    experience: { title: "Lập kế hoạch bán hàng ở hội chợ trường", goal: "Thử nghĩ như người kinh doanh", steps: ["Chọn một sản phẩm nhỏ (đồ thủ công, bánh)", "Ước tính chi phí, giá bán và số lượng", "Tính lãi hoặc lỗ dự kiến", "Trình bày kế hoạch cho người lớn góp ý"], minutes: 40, result: "Bảng kế hoạch chi phí – giá bán", reflect: REFLECT },
    related: ["marketing", "ban-hang", "ke-toan"],
  },
  {
    id: "marketing", name: "Chuyên viên marketing", codes: ["E", "A", "S"], field: "Kinh doanh, truyền thông",
    desc: "Tìm hiểu khách hàng và lên kế hoạch quảng bá sản phẩm qua mạng xã hội, sự kiện, quảng cáo.",
    activities: ["Khảo sát nhu cầu khách hàng", "Lên ý tưởng chiến dịch quảng bá", "Theo dõi hiệu quả bằng số liệu"],
    skills: ["Sáng tạo", "Thuyết phục", "Phân tích số liệu", "Viết nội dung"],
    subjects: ["Ngữ văn", "Toán", "Tiếng Anh", "Tin học"],
    experience: { title: "Viết quảng cáo cho một cuốn sách", goal: "Thử thuyết phục người khác bằng nội dung", steps: ["Chọn một cuốn sách bạn thích", "Xác định ai nên đọc nó", "Viết một khẩu hiệu và 3 dòng giới thiệu", "Hỏi 3 người: đọc xong có muốn mượn sách không?"], minutes: 30, result: "Mẫu quảng cáo và phản hồi", reflect: REFLECT },
    related: ["khoi-nghiep", "thiet-ke-do-hoa", "nha-bao"],
  },
  {
    id: "luat-su", name: "Luật sư", codes: ["E", "I", "S"], field: "Pháp luật",
    desc: "Tư vấn pháp luật, bảo vệ quyền lợi hợp pháp của người dân và doanh nghiệp, tham gia tranh tụng tại tòa.",
    activities: ["Nghiên cứu hồ sơ, văn bản luật", "Gặp và tư vấn cho thân chủ", "Tranh luận tại phiên tòa"],
    skills: ["Lập luận", "Đọc hiểu", "Thuyết trình", "Trung thực"],
    subjects: ["Ngữ văn", "Giáo dục công dân", "Lịch sử và Địa lí"],
    experience: { title: "Tranh biện một chủ đề", goal: "Thử lập luận có bằng chứng", steps: ["Chọn chủ đề (VD: học sinh có nên mang điện thoại đến trường?)", "Tìm 3 lý lẽ ủng hộ và 3 lý lẽ phản đối", "Chọn một phía, trình bày 2 phút", "Nghe bạn phản biện và trả lời"], minutes: 40, result: "Dàn ý tranh biện hai phía", reflect: REFLECT },
    related: ["cong-tac-xa-hoi", "nha-bao"],
  },
  {
    id: "quan-ly-nha-hang", name: "Quản lý nhà hàng, khách sạn", codes: ["E", "S", "C"], field: "Du lịch, dịch vụ",
    desc: "Điều hành hoạt động hằng ngày của nhà hàng, khách sạn: nhân sự, chất lượng phục vụ, chi phí.",
    activities: ["Phân công ca làm việc", "Giải quyết yêu cầu của khách", "Theo dõi doanh thu, chi phí"],
    skills: ["Tổ chức", "Giao tiếp", "Giải quyết vấn đề", "Ngoại ngữ"],
    subjects: ["Tiếng Anh", "Toán", "Công nghệ"],
    experience: { title: "Tổ chức một bữa tiệc nhỏ trong gia đình", goal: "Thử điều phối dịch vụ cho nhiều người", steps: ["Lập danh sách khách và thực đơn", "Lập ngân sách và phân công việc", "Điều phối trong buổi tiệc", "Hỏi khách hài lòng điều gì, chưa hài lòng điều gì"], minutes: 60, result: "Kế hoạch và đánh giá sau buổi tiệc", reflect: REFLECT },
    related: ["dau-bep", "huong-dan-vien"],
  },
  {
    id: "ban-hang", name: "Nhân viên kinh doanh", codes: ["E", "S", "C"], field: "Kinh doanh",
    desc: "Giới thiệu và bán sản phẩm, dịch vụ cho khách hàng; chăm sóc khách hàng sau bán.",
    activities: ["Tìm và gặp khách hàng", "Giới thiệu, tư vấn sản phẩm", "Theo dõi đơn hàng và chăm sóc khách"],
    skills: ["Giao tiếp", "Thuyết phục", "Kiên trì", "Lắng nghe"],
    subjects: ["Ngữ văn", "Toán", "Tiếng Anh"],
    experience: { title: "Tập giới thiệu sản phẩm 1 phút", goal: "Thử thuyết phục khách hàng", steps: ["Chọn một đồ vật trong nhà", "Liệt kê 3 điểm mạnh và người phù hợp dùng nó", "Giới thiệu trong 1 phút cho người nhà", "Hỏi họ có muốn 'mua' không và vì sao"], minutes: 20, result: "Bài giới thiệu 1 phút", reflect: REFLECT },
    related: ["marketing", "khoi-nghiep"],
  },
  {
    id: "huong-dan-vien", name: "Hướng dẫn viên du lịch", codes: ["E", "S", "A"], field: "Du lịch",
    desc: "Dẫn đoàn khách tham quan, giới thiệu lịch sử, văn hóa địa phương và bảo đảm chuyến đi an toàn, vui vẻ.",
    activities: ["Chuẩn bị lịch trình và thuyết minh", "Dẫn đoàn, giới thiệu điểm tham quan", "Xử lý tình huống phát sinh"],
    skills: ["Giao tiếp", "Ngoại ngữ", "Hiểu biết văn hóa, lịch sử", "Linh hoạt"],
    subjects: ["Lịch sử và Địa lí", "Tiếng Anh", "Ngữ văn"],
    experience: { title: "Thuyết minh một địa điểm ở quê bạn", goal: "Thử vai trò người giới thiệu văn hóa", steps: ["Chọn một địa điểm (đình, chợ, di tích)", "Tìm 5 thông tin thú vị về nơi đó", "Viết bài thuyết minh 2 phút", "Thuyết minh cho người nhà nghe, có thể bằng tiếng Anh"], minutes: 40, result: "Bài thuyết minh 2 phút", reflect: REFLECT },
    related: ["quan-ly-nha-hang", "nha-bao"],
  },

  // ===== NGHIỆP VỤ (C) =====
  {
    id: "ke-toan", name: "Kế toán", codes: ["C", "E", "I"], field: "Tài chính",
    desc: "Ghi chép, theo dõi thu chi, lập báo cáo tài chính và tính thuế cho công ty, cơ quan.",
    activities: ["Nhập và kiểm tra chứng từ", "Lập báo cáo thu chi", "Dùng phần mềm kế toán"],
    skills: ["Cẩn thận, chính xác", "Tính toán", "Trung thực", "Sắp xếp"],
    subjects: ["Toán", "Tin học", "Giáo dục công dân"],
    experience: { title: "Sổ thu chi cá nhân 1 tuần", goal: "Thử ghi chép tài chính đều đặn", steps: ["Kẻ bảng: ngày, nội dung, thu, chi, còn lại", "Ghi mọi khoản tiền tiêu vặt trong 7 ngày", "Cộng tổng thu, tổng chi", "Nhận xét khoản nào có thể tiết kiệm"], minutes: 10, result: "Sổ thu chi 7 ngày", reflect: REFLECT },
    related: ["ngan-hang", "phan-tich-du-lieu"],
  },
  {
    id: "ngan-hang", name: "Nhân viên ngân hàng", codes: ["C", "E", "S"], field: "Tài chính, ngân hàng",
    desc: "Phục vụ khách mở tài khoản, gửi tiền, vay vốn; tư vấn sản phẩm tài chính và kiểm tra hồ sơ cẩn thận.",
    activities: ["Giao dịch với khách tại quầy", "Kiểm tra giấy tờ, hồ sơ", "Tư vấn sản phẩm tiết kiệm, thẻ"],
    skills: ["Chính xác", "Giao tiếp lịch sự", "Tuân thủ quy định", "Tính toán"],
    subjects: ["Toán", "Tin học", "Tiếng Anh"],
    experience: { title: "Tính lãi tiết kiệm", goal: "Làm quen với khái niệm tài chính cơ bản", steps: ["Giả sử gửi 1.000.000 đồng với lãi suất 5% mỗi năm", "Tính số tiền sau 1, 2, 3 năm (lãi nhập gốc)", "Vẽ bảng so sánh", "Hỏi người lớn về một lần họ đi giao dịch ngân hàng"], minutes: 25, result: "Bảng tính lãi 3 năm", reflect: REFLECT },
    related: ["ke-toan", "ban-hang"],
  },
  {
    id: "thu-thu", name: "Thủ thư, nhân viên lưu trữ", codes: ["C", "S", "A"], field: "Văn hóa, giáo dục",
    desc: "Sắp xếp, bảo quản sách và tài liệu; giúp người đọc tìm thông tin; số hóa tài liệu.",
    activities: ["Phân loại, sắp xếp sách", "Hướng dẫn bạn đọc tìm tài liệu", "Quản lý mượn trả bằng phần mềm"],
    skills: ["Ngăn nắp", "Cẩn thận", "Yêu sách", "Hỗ trợ người khác"],
    subjects: ["Ngữ văn", "Tin học", "Lịch sử và Địa lí"],
    experience: { title: "Sắp xếp tủ sách gia đình", goal: "Thử hệ thống hóa tài liệu", steps: ["Chọn cách phân loại (theo chủ đề hoặc tác giả)", "Sắp xếp lại một ngăn sách", "Lập danh mục sách trong bảng tính", "Thử tìm 3 cuốn theo danh mục"], minutes: 45, result: "Danh mục sách", reflect: REFLECT },
    related: ["ke-toan", "nha-bao"],
  },
  {
    id: "quan-tri-mang", name: "Quản trị mạng máy tính", codes: ["C", "R", "I"], field: "Công nghệ thông tin",
    desc: "Lắp đặt, cài đặt và bảo vệ hệ thống máy tính, mạng internet của trường học, công ty.",
    activities: ["Cài đặt phần mềm, cấp tài khoản", "Theo dõi mạng, khắc phục sự cố", "Bảo vệ dữ liệu khỏi tấn công"],
    skills: ["Tư duy logic", "Cẩn thận", "Xử lý sự cố", "Tự học"],
    subjects: ["Tin học", "Toán", "Tiếng Anh", "Công nghệ"],
    experience: { title: "Kiểm tra an toàn tài khoản của bạn", goal: "Làm quen tư duy bảo mật", steps: ["Liệt kê các tài khoản bạn đang dùng (không ghi mật khẩu)", "Kiểm tra: mật khẩu có đủ mạnh, có dùng chung không", "Đọc 5 nguyên tắc an toàn khi dùng mạng", "Cùng người lớn bật xác thực 2 bước cho một tài khoản"], minutes: 30, result: "Danh sách việc cần làm để tài khoản an toàn hơn", reflect: REFLECT },
    related: ["lap-trinh-vien", "tho-dien"],
  },
  {
    id: "logistics", name: "Nhân viên kho vận (logistics)", codes: ["C", "E", "R"], field: "Thương mại, vận tải",
    desc: "Quản lý hàng hóa trong kho, sắp xếp vận chuyển để hàng đến tay khách đúng lúc, đúng nơi.",
    activities: ["Kiểm kê hàng hóa", "Lập kế hoạch giao hàng", "Theo dõi đơn hàng trên phần mềm"],
    skills: ["Sắp xếp", "Lập kế hoạch", "Cẩn thận", "Phối hợp"],
    subjects: ["Toán", "Tin học", "Lịch sử và Địa lí"],
    experience: { title: "Lên lộ trình giao hàng", goal: "Thử sắp xếp công việc hiệu quả", steps: ["Chọn 5 địa điểm quen thuộc gần nhà", "Vẽ bản đồ đơn giản", "Tìm thứ tự đi qua cả 5 nơi với đường ngắn nhất", "So sánh với một bạn xem ai tối ưu hơn"], minutes: 30, result: "Bản đồ lộ trình", reflect: REFLECT },
    related: ["ke-toan", "khoi-nghiep"],
  },
  {
    id: "hanh-chinh", name: "Nhân viên hành chính văn phòng", codes: ["C", "S", "E"], field: "Văn phòng",
    desc: "Soạn thảo văn bản, quản lý hồ sơ, sắp xếp lịch họp và hỗ trợ hoạt động hằng ngày của cơ quan.",
    activities: ["Soạn thảo, lưu trữ văn bản", "Sắp xếp lịch làm việc", "Tiếp khách, nghe điện thoại"],
    skills: ["Ngăn nắp", "Tin học văn phòng", "Giao tiếp", "Cẩn thận"],
    subjects: ["Tin học", "Ngữ văn", "Tiếng Anh"],
    experience: { title: "Làm thư ký cho một buổi họp lớp", goal: "Thử ghi chép và tổng hợp thông tin", steps: ["Xin làm thư ký cho buổi sinh hoạt lớp", "Ghi: nội dung, ý kiến chính, quyết định", "Soạn biên bản gọn trên máy tính", "Nhờ giáo viên chủ nhiệm nhận xét"], minutes: 45, result: "Biên bản họp lớp", reflect: REFLECT },
    related: ["thu-thu", "ke-toan"],
  },
  // ===== THÊM (nghề chuyên môn, học thuật) =====
  {
    id: "nha-nghien-cuu", name: "Nhà nghiên cứu khoa học", codes: ["I", "R", "A"], field: "Khoa học, nghiên cứu",
    desc: "Đặt câu hỏi về thế giới tự nhiên hoặc xã hội, làm thí nghiệm hay khảo sát để tìm ra kiến thức mới, rồi viết báo cáo chia sẻ kết quả.",
    activities: ["Đọc tài liệu và đặt câu hỏi nghiên cứu", "Thiết kế và làm thí nghiệm hoặc khảo sát", "Phân tích số liệu, viết báo cáo khoa học"],
    skills: ["Tò mò, ham tìm hiểu", "Tư duy phân tích", "Kiên nhẫn", "Viết và trình bày"],
    subjects: ["Khoa học tự nhiên", "Toán", "Tiếng Anh", "Ngữ văn"],
    experience: { title: "Làm một thí nghiệm nhỏ có ghi chép", goal: "Thử quy trình nghiên cứu: đặt câu hỏi, dự đoán, thí nghiệm, kết luận", steps: ["Chọn một câu hỏi đơn giản, ví dụ: hạt đậu nảy mầm nhanh hơn ở chỗ sáng hay chỗ tối?", "Viết dự đoán của bạn trước khi làm", "Gieo hạt ở 2 chỗ khác nhau, ghi chép mỗi ngày trong 5 ngày", "So sánh kết quả với dự đoán và viết 3 câu kết luận"], minutes: 30, result: "Một trang nhật ký thí nghiệm có dự đoán, số liệu và kết luận", reflect: REFLECT },
    related: ["ky-su-moi-truong", "phan-tich-du-lieu", "ky-thuat-vien-xet-nghiem"],
  },
  {
    id: "doi-ngoai", name: "Chuyên viên đối ngoại, quan hệ quốc tế", codes: ["E", "S", "A"], field: "Ngoại giao, hợp tác quốc tế",
    desc: "Làm cầu nối giữa cơ quan, trường học hay doanh nghiệp Việt Nam với đối tác nước ngoài: tổ chức gặp gỡ, đàm phán hợp tác, chuẩn bị văn bản và sự kiện.",
    activities: ["Liên lạc, viết thư cho đối tác nước ngoài", "Chuẩn bị và tham dự các buổi gặp gỡ, hội nghị", "Tìm hiểu văn hóa, phong tục của nước bạn"],
    skills: ["Giao tiếp tự tin", "Ngoại ngữ", "Thuyết phục", "Hiểu biết văn hóa"],
    subjects: ["Tiếng Anh", "Lịch sử và Địa lý", "Ngữ văn", "Giáo dục công dân"],
    experience: { title: "Giới thiệu quê hương cho bạn nước ngoài", goal: "Thử vai người làm cầu nối văn hóa", steps: ["Chọn 3 điều đặc sắc về quê bạn (món ăn, lễ hội, địa danh)", "Viết một đoạn giới thiệu ngắn bằng tiếng Việt", "Thử dịch đoạn đó sang tiếng Anh (có thể nhờ thầy cô xem lại)", "Đọc to như đang giới thiệu cho khách nước ngoài"], minutes: 30, result: "Một đoạn giới thiệu song ngữ về quê hương", reflect: REFLECT },
    related: ["huong-dan-vien", "nha-bao", "marketing"],
  },
  {
    id: "nghien-cuu-thi-truong", name: "Chuyên viên nghiên cứu thị trường", codes: ["I", "E", "C"], field: "Kinh doanh, nghiên cứu",
    desc: "Tìm hiểu người mua cần gì, thích gì bằng khảo sát, phỏng vấn và số liệu bán hàng, để giúp công ty quyết định nên làm sản phẩm nào và bán thế nào.",
    activities: ["Thiết kế phiếu khảo sát, phỏng vấn khách hàng", "Tổng hợp số liệu, vẽ biểu đồ", "Viết báo cáo đề xuất cho công ty"],
    skills: ["Tư duy phân tích", "Tính toán", "Giao tiếp", "Viết và trình bày"],
    subjects: ["Toán", "Tin học", "Ngữ văn", "Tiếng Anh"],
    experience: { title: "Khảo sát món ăn sáng của lớp", goal: "Thử thu thập và phân tích ý kiến của nhiều người", steps: ["Soạn 3 câu hỏi ngắn, ví dụ: bạn hay ăn sáng món gì, giá bao nhiêu là hợp lý?", "Hỏi khoảng 10 bạn và ghi lại câu trả lời", "Đếm và vẽ một biểu đồ cột đơn giản", "Viết 2 câu: nếu mở quán ăn sáng gần trường, nên bán món gì?"], minutes: 40, result: "Một biểu đồ và một đề xuất ngắn dựa trên số liệu", reflect: REFLECT },
    related: ["marketing", "phan-tich-du-lieu", "khoi-nghiep"],
  },
];

export const careerById = (id: string) => CAREERS.find((c) => c.id === id);

// Nghề chuyên môn, học thuật (thường cần học đại học): được xếp lên trước TRONG SỐ các nghề đã hợp với bạn.
// Không có nghĩa nghề nào cao quý hơn nghề nào. Thầy cô có thể sửa danh sách này.
export const ACADEMIC_IDS = new Set([
  "bac-si", "duoc-si", "giao-vien", "ke-toan", "marketing", "doi-ngoai", "nha-nghien-cuu", "lap-trinh-vien", "khoi-nghiep",
  "luat-su", "kien-truc-su", "ky-su-co-khi", "ky-su-xay-dung", "ky-su-nong-nghiep", "ky-su-moi-truong", "phan-tich-du-lieu",
  "nghien-cuu-thi-truong", "tam-ly-hoc-duong", "nha-bao", "ngan-hang",
]);
export const isAcademic = (id: string) => ACADEMIC_IDS.has(id);

// ---------- Nguồn và ghi công bản quyền ----------
export const ONET_LICENSE_URL = "https://www.onetcenter.org/license_tools.html";
export const SOURCES = [
  {
    text: "U.S. Department of Labor, Employment and Training Administration. O*NET® Interest Profiler – Mini-IP (30 câu).",
    url: "https://www.onetcenter.org/IP.html",
  },
  {
    text: "Rounds, J., Su, R., Lewis, P., & Rivkin, D. (2010). O*NET® Interest Profiler Short Form Psychometric Characteristics: Summary. National Center for O*NET Development.",
    url: "https://www.onetcenter.org/reports/IPSF_Psychometric.html",
  },
  { text: "Holland, J. L. (1997). Making Vocational Choices: A Theory of Vocational Personalities and Work Environments (3rd ed.). Psychological Assessment Resources." },
  {
    text: "Trần Thành Nam, Trần Văn Công (2019). Xu hướng nghề nghiệp học sinh theo mô hình Holland. Bản tin Đại học Quốc gia Hà Nội, số 339.",
    url: "https://cdnportal.vnu.edu.vn/data/upload/2021/09/29283/file/339%20IN-pages-38-41.pdf",
  },
  {
    text: "Trần Đình Tuấn (2026). Trắc nghiệm hướng nghiệp Holland và giải pháp giáo dục hướng nghiệp sớm cho học sinh tiểu học trong bối cảnh hiện nay. Tạp chí Giáo chức Việt Nam, 8(81).",
    url: "https://vjol.info.vn/giaochuc/vi/article/view/264302",
  },
];
export const ONET_ATTRIBUTION =
  "Bộ câu hỏi sở thích được phỏng theo O*NET® Interest Profiler của Bộ Lao động Hoa Kỳ, Cục Việc làm và Đào tạo (USDOL/ETA), dùng theo O*NET Tools Developer License. Các câu hỏi đã được dịch và chỉnh sửa; USDOL/ETA chưa duyệt, xác nhận hay kiểm thử những chỉnh sửa này. O*NET® là nhãn hiệu đã đăng ký của USDOL/ETA.";
