// ============================================================
// DỮ LIỆU HƯỚNG NGHIỆP (sửa trực tiếp ở file này)
// - 6 nhóm tính cách và 18 câu tự đánh giá: dựa trên Hình 4.2 "Sáu nhóm tính cách trong
//   lí thuyết mật mã Holland", SGK Công nghệ 9 – Định hướng nghề nghiệp (bộ Kết nối tri thức
//   với cuộc sống). Mỗi nhóm 3 câu, diễn đạt lại cho dễ hiểu.
// - Danh sách nghề theo nhóm: Trung tâm Phát triển Năng lực, Trường ĐH Văn Lang (2021),
//   "Hướng nghiệp bằng Mật mã Holland". Giữ nguyên cách xếp nhóm của nguồn.
// - Mã Holland của nghề theo O*NET (nếu đã ghép): xem src/data/onetCodes.ts,
//   file đó được tạo tự động bằng scripts/them-ma-onet.mjs, KHÔNG gõ tay.
// - Hồ sơ nghề (mô tả, hoạt động trải nghiệm): giữ từ bản cũ, gắn vào nghề cùng lĩnh vực.
//   AI KHÔNG tự tạo thông tin nghề.
// ============================================================

import { ONET_CODES } from "./onetCodes";

export type RiasecCode = "R" | "I" | "A" | "S" | "E" | "C";

// Tên nhóm theo SGK Công nghệ 9 (Kết nối tri thức), Hình 4.2
export const RIASEC: Record<RiasecCode, { name: string; en: string; short: string; like: string }> = {
  R: { name: "Kĩ thuật", en: "Realistic", short: "Tự lập, suy nghĩ thực tế, khéo léo khi thao tác", like: "Thích vận động, vận hành và điều khiển máy móc" },
  I: { name: "Nghiên cứu", en: "Investigative", short: "Thích tìm hiểu, khám phá điều mới, tư duy mạch lạc", like: "Thích điều tra, phân loại, khái quát và tổng hợp vấn đề" },
  A: { name: "Nghệ thuật", en: "Artistic", short: "Giàu tưởng tượng, dễ xúc động, thích tự do", like: "Thích chụp hình, vẽ tranh, chơi nhạc cụ, làm việc sáng tạo" },
  S: { name: "Xã hội", en: "Social", short: "Thích giúp đỡ, gặp gỡ và lắng nghe mọi người", like: "Thích hoạt động vì cộng đồng, mong muốn đóng góp cho xã hội" },
  E: { name: "Quản lí", en: "Enterprising", short: "Năng động, quyết đoán, dám mạo hiểm", like: "Thích thuyết phục, cạnh tranh, muốn được người khác nể phục" },
  C: { name: "Nghiệp vụ", en: "Conventional", short: "Biết sắp xếp, tổ chức, cẩn thận, đáng tin cậy", like: "Thích lưu trữ, cập nhật thông tin, làm việc với dữ liệu, con số" },
};

export const RIASEC_ORDER: RiasecCode[] = ["R", "I", "A", "S", "E", "C"];

// ---------- 18 câu tự đánh giá (3 câu mỗi nhóm), xếp xen kẽ, không hiện tên nhóm ----------
export const INTEREST_ITEMS: { id: number; code: RiasecCode; text: string }[] = [
  { id: 1, code: "R", text: "Em thích tự làm lấy mọi việc và suy nghĩ thực tế." },
  { id: 2, code: "I", text: "Em thích tìm hiểu, khám phá những điều mới." },
  { id: 3, code: "A", text: "Em giàu tưởng tượng và dễ xúc động." },
  { id: 4, code: "S", text: "Em thích giúp đỡ người khác." },
  { id: 5, code: "E", text: "Em dám thử thách, quyết đoán và năng động." },
  { id: 6, code: "C", text: "Em ngăn nắp, cẩn thận và đáng tin cậy." },
  { id: 7, code: "R", text: "Em khéo tay, thích các hoạt động vận động." },
  { id: 8, code: "I", text: "Em hay phân tích vấn đề và suy nghĩ mạch lạc." },
  { id: 9, code: "A", text: "Em thích chụp hình, vẽ tranh hoặc chơi nhạc cụ." },
  { id: 10, code: "S", text: "Em thích gặp gỡ, trò chuyện và biết lắng nghe mọi người." },
  { id: 11, code: "E", text: "Em giỏi thuyết phục người khác." },
  { id: 12, code: "C", text: "Em thích làm việc với số liệu, ghi chép, sắp xếp thông tin." },
  { id: 13, code: "R", text: "Em thích vận hành, điều khiển hoặc sửa máy móc, đồ dùng." },
  { id: 14, code: "I", text: "Em thích tìm tòi, phân loại rồi tổng hợp lại thông tin." },
  { id: 15, code: "A", text: "Em thích được tự do sáng tạo, không bị gò bó." },
  { id: 16, code: "S", text: "Em thích tham gia các hoạt động vì cộng đồng." },
  { id: 17, code: "E", text: "Em thích cạnh tranh và muốn được người khác nể phục." },
  { id: 18, code: "C", text: "Em hay đặt mục tiêu cho bản thân." },
];

// Điểm mỗi nhóm = tổng 3 câu, từ 3 đến 15
export const ITEMS_PER_GROUP = 3;
export const MIN_SCORE = 3;
export const MAX_SCORE = 15;
/** Điểm cao nhất và thấp nhất chênh nhau ÍT HƠN số này thì coi là "chưa rõ nét" (nhóm nghiên cứu có thể chỉnh) */
export const FLAT_GAP = 3;

// Thang 5 mức: mức độ giống em (1–5)
export const LIKERT = [
  { value: 1, label: "Không giống em chút nào" },
  { value: 2, label: "Ít giống em" },
  { value: 3, label: "Phân vân" },
  { value: 4, label: "Khá giống em" },
  { value: 5, label: "Rất giống em" },
];

// ---------- Phần em tự chọn, tự viết (không bắt buộc) ----------
export const SUBJECTS = [
  "Toán", "Ngữ văn", "Tiếng Anh", "Khoa học tự nhiên", "Lịch sử và Địa lí", "Giáo dục công dân",
  "Tin học", "Công nghệ", "Giáo dục thể chất", "Nghệ thuật (Âm nhạc, Mĩ thuật)", "Hoạt động trải nghiệm",
];
export const ACTIVITIES = [
  "Chơi thể thao", "Vẽ, làm đồ thủ công", "Đọc sách, viết", "Chơi nhạc, hát", "Lập trình, chơi với máy tính",
  "Nấu ăn", "Chăm cây, nuôi con vật", "Tháo lắp, sửa đồ", "Tham gia câu lạc bộ, hoạt động tập thể",
  "Buôn bán nhỏ, làm hội chợ", "Quay video, chụp ảnh", "Giải đố, chơi cờ",
];
export const AFTER_GRADE9 = [
  "Học tiếp THPT",
  "Học nghề (trung cấp, cao đẳng)",
  "Vừa học văn hóa vừa học nghề",
  "Chưa biết",
];

// ---------- Hồ sơ nghề (mô tả + hoạt động trải nghiệm), giữ từ bản cũ ----------
export interface Experience {
  title: string;
  goal: string;
  steps: string[];
  minutes: number;
  result: string;
  reflect: string[];
}

export interface CareerProfile {
  id: string;
  name: string; // tên nghề tiêu biểu, VD "Thợ điện dân dụng"
  field: string;
  desc: string;
  activities: string[];
  skills: string[];
  subjects: string[];
  experience: Experience;
}

const REFLECT = [
  "Phần nào trong hoạt động làm bạn thấy hứng thú nhất?",
  "Phần nào khó hoặc chưa thích? Vì sao?",
  "Bạn muốn tìm hiểu thêm điều gì về nghề này?",
];

const PROFILES: CareerProfile[] = [
  {
    id: "ky-su-co-khi", name: "Kỹ sư cơ khí", field: "Kỹ thuật, chế tạo",
    desc: "Thiết kế, chế tạo và bảo trì máy móc, từ xe máy, máy bơm đến dây chuyền sản xuất trong nhà máy.",
    activities: ["Vẽ bản thiết kế máy bằng phần mềm", "Tính toán độ bền của chi tiết", "Kiểm tra máy chạy thử trong xưởng"],
    skills: ["Tư duy không gian", "Tính toán", "Giải quyết sự cố", "Làm việc nhóm"],
    subjects: ["Toán", "Khoa học tự nhiên", "Công nghệ", "Tin học"],
    experience: { title: "Tháo lắp một món đồ đơn giản", goal: "Hiểu một thiết bị hoạt động nhờ những bộ phận nào", steps: ["Xin phép người lớn chọn một món đồ cũ, không cắm điện (bút bi bấm, đồ chơi, ổ khóa cũ)", "Tháo từng bộ phận, chụp ảnh hoặc vẽ lại thứ tự", "Ghi tên và chức năng mỗi bộ phận", "Lắp lại như cũ"], minutes: 30, result: "Một sơ đồ các bộ phận và cách chúng phối hợp", reflect: REFLECT },
  },
  {
    id: "tho-dien", name: "Thợ điện dân dụng", field: "Kỹ thuật, xây dựng",
    desc: "Lắp đặt, kiểm tra và sửa chữa hệ thống điện trong nhà ở, trường học, cửa hàng, bảo đảm an toàn điện.",
    activities: ["Đi dây điện, lắp ổ cắm, công tắc, đèn", "Dùng đồng hồ đo kiểm tra mạch", "Tìm và sửa chỗ chập điện"],
    skills: ["Cẩn thận, tuân thủ an toàn", "Khéo tay", "Đọc sơ đồ mạch", "Giải quyết sự cố"],
    subjects: ["Khoa học tự nhiên", "Công nghệ", "Toán"],
    experience: { title: "Vẽ sơ đồ điện một căn phòng", goal: "Làm quen cách nghĩ của thợ điện mà không chạm vào điện", steps: ["Quan sát (không chạm) đèn, quạt, ổ cắm, công tắc trong phòng", "Vẽ sơ đồ vị trí và đoán công tắc nào điều khiển thiết bị nào", "Hỏi người lớn để kiểm tra dự đoán", "Ghi 3 quy tắc an toàn điện bạn biết"], minutes: 25, result: "Sơ đồ điện phòng và 3 quy tắc an toàn", reflect: REFLECT },
  },
  {
    id: "ky-thuat-vien-o-to", name: "Kỹ thuật viên ô tô", field: "Kỹ thuật, giao thông",
    desc: "Kiểm tra, bảo dưỡng và sửa chữa ô tô, xe máy; ngày nay làm việc cả với xe điện và thiết bị chẩn đoán điện tử.",
    activities: ["Chẩn đoán lỗi bằng máy đọc lỗi", "Thay dầu, kiểm tra phanh, lốp", "Giải thích cho khách tình trạng xe"],
    skills: ["Khéo tay", "Quan sát", "Giải quyết sự cố", "Giao tiếp với khách"],
    subjects: ["Công nghệ", "Khoa học tự nhiên", "Toán"],
    experience: { title: "Kiểm tra xe đạp như thợ chuyên nghiệp", goal: "Tập quy trình kiểm tra một phương tiện", steps: ["Lập danh sách kiểm tra: lốp, phanh, xích, đèn, chuông", "Kiểm tra từng mục trên xe đạp của bạn", "Ghi tình trạng: tốt / cần chỉnh / cần sửa", "Nhờ người lớn cùng chỉnh một lỗi nhỏ"], minutes: 30, result: "Phiếu kiểm tra xe đạp đã điền", reflect: REFLECT },
  },
  {
    id: "ky-su-xay-dung", name: "Kỹ sư xây dựng", field: "Xây dựng",
    desc: "Thiết kế và giám sát xây dựng nhà, cầu, đường, bảo đảm công trình an toàn, bền vững và đúng dự toán.",
    activities: ["Tính toán kết cấu công trình", "Giám sát thi công ở công trường", "Lập kế hoạch vật tư và tiến độ"],
    skills: ["Tính toán", "Đọc bản vẽ", "Quản lý tiến độ", "Làm việc nhóm"],
    subjects: ["Toán", "Khoa học tự nhiên", "Công nghệ"],
    experience: { title: "Xây cây cầu bằng giấy", goal: "Thử thiết kế để một cấu trúc chịu lực", steps: ["Dùng 10 tờ giấy và băng dính làm cầu nối hai chồng sách cách nhau 20 cm", "Đặt dần đồng xu lên giữa cầu", "Đếm số đồng xu trước khi cầu sập", "Sửa thiết kế và thử lại một lần"], minutes: 40, result: "Hai mẫu cầu và số đồng xu mỗi mẫu chịu được", reflect: REFLECT },
  },
  {
    id: "ky-su-nong-nghiep", name: "Kỹ sư nông nghiệp", field: "Nông nghiệp",
    desc: "Nghiên cứu và hướng dẫn cách trồng trọt, chăn nuôi hiệu quả, áp dụng công nghệ như tưới tự động, nhà màng.",
    activities: ["Theo dõi sinh trưởng của cây trồng", "Kiểm tra đất, nước, sâu bệnh", "Hướng dẫn nông dân kỹ thuật mới"],
    skills: ["Quan sát", "Kiên nhẫn", "Ghi chép số liệu", "Làm việc ngoài trời"],
    subjects: ["Khoa học tự nhiên", "Công nghệ", "Toán"],
    experience: { title: "Gieo hạt và theo dõi 7 ngày", goal: "Tập quan sát và ghi số liệu như kỹ sư nông nghiệp", steps: ["Gieo vài hạt đậu xanh vào hai cốc: một cốc để chỗ sáng, một cốc chỗ tối", "Tưới nước như nhau mỗi ngày", "Đo chiều cao mầm mỗi ngày và ghi vào bảng", "So sánh hai cốc sau 7 ngày"], minutes: 15, result: "Bảng số liệu 7 ngày và nhận xét", reflect: REFLECT },
  },
  {
    id: "bac-si", name: "Bác sĩ", field: "Y tế",
    desc: "Khám bệnh, chẩn đoán và điều trị cho người bệnh; tư vấn cách phòng bệnh và giữ gìn sức khỏe.",
    activities: ["Hỏi bệnh và khám cho bệnh nhân", "Đọc kết quả xét nghiệm, phim chụp", "Lên phác đồ điều trị"],
    skills: ["Ghi nhớ tốt", "Phân tích", "Đồng cảm, giao tiếp", "Chịu áp lực"],
    subjects: ["Khoa học tự nhiên", "Toán", "Tiếng Anh"],
    experience: { title: "Tìm hiểu một ngày của nhân viên y tế", goal: "Biết thực tế công việc trong ngành y", steps: ["Chuẩn bị 5 câu hỏi về công việc hằng ngày", "Phỏng vấn một người làm y tế (người thân, nhân viên y tế trường) hoặc xem một phóng sự đáng tin cậy", "Ghi lại điều bất ngờ nhất", "Viết 5 dòng tóm tắt"], minutes: 30, result: "Bản ghi phỏng vấn ngắn", reflect: REFLECT },
  },
  {
    id: "duoc-si", name: "Dược sĩ", field: "Y tế",
    desc: "Tìm hiểu, kiểm tra và cấp phát thuốc; hướng dẫn người bệnh dùng thuốc đúng cách, an toàn.",
    activities: ["Kiểm tra đơn thuốc", "Hướng dẫn cách dùng thuốc", "Quản lý chất lượng và hạn dùng của thuốc"],
    skills: ["Cẩn thận, chính xác", "Ghi nhớ", "Giao tiếp", "Tuân thủ quy định"],
    subjects: ["Khoa học tự nhiên", "Toán", "Tiếng Anh"],
    experience: { title: "Đọc hiểu tờ hướng dẫn sử dụng", goal: "Tập đọc thông tin quan trọng như dược sĩ", steps: ["Cùng người lớn lấy tờ hướng dẫn của một loại thuốc thông dụng trong nhà (không tự dùng thuốc)", "Tìm: công dụng, liều dùng, chống chỉ định, hạn dùng", "Ghi lại thông tin vào bảng", "Hỏi người lớn vì sao phải đọc kỹ trước khi dùng"], minutes: 20, result: "Bảng tóm tắt thông tin thuốc", reflect: REFLECT },
  },
  {
    id: "ky-su-moi-truong", name: "Kỹ sư môi trường", field: "Môi trường",
    desc: "Nghiên cứu và đưa ra giải pháp xử lý nước thải, rác thải, ô nhiễm không khí để bảo vệ môi trường sống.",
    activities: ["Lấy mẫu nước, đất, không khí", "Phân tích số liệu ô nhiễm", "Thiết kế hệ thống xử lý rác, nước thải"],
    skills: ["Phân tích", "Quan sát", "Làm việc thực địa", "Viết báo cáo"],
    subjects: ["Khoa học tự nhiên", "Toán", "Lịch sử và Địa lí"],
    experience: { title: "Khảo sát rác thải ở nhà trong 3 ngày", goal: "Tập thu thập số liệu và đề xuất giải pháp", steps: ["Chia rác thành: nhựa, giấy, thức ăn, khác", "Đếm hoặc cân mỗi loại trong 3 ngày", "Vẽ biểu đồ cột", "Đề xuất 2 cách giảm loại rác nhiều nhất"], minutes: 20, result: "Biểu đồ rác và 2 đề xuất", reflect: REFLECT },
  },
  {
    id: "lap-trinh-vien", name: "Lập trình viên", field: "Công nghệ thông tin",
    desc: "Viết phần mềm, ứng dụng điện thoại, trang web, trò chơi; tìm và sửa lỗi để chương trình chạy đúng.",
    activities: ["Viết code theo yêu cầu", "Kiểm thử và sửa lỗi", "Trao đổi với nhóm thiết kế sản phẩm"],
    skills: ["Tư duy logic", "Kiên nhẫn", "Tự học", "Tiếng Anh"],
    subjects: ["Tin học", "Toán", "Tiếng Anh"],
    experience: { title: "Làm một chương trình nhỏ bằng Scratch", goal: "Thử cảm giác ra lệnh cho máy tính", steps: ["Mở Scratch (trang scratch.mit.edu) hoặc phần mềm đã học ở môn Tin học", "Làm nhân vật di chuyển bằng phím mũi tên", "Thêm điểm số khi chạm vào vật", "Nhờ bạn chơi thử và sửa một lỗi"], minutes: 45, result: "Một trò chơi nhỏ chạy được", reflect: REFLECT },
  },
  {
    id: "phan-tich-du-lieu", name: "Chuyên viên phân tích dữ liệu", field: "Công nghệ, kinh tế",
    desc: "Thu thập và phân tích số liệu để tìm ra xu hướng, giúp công ty, trường học, bệnh viện ra quyết định tốt hơn.",
    activities: ["Làm sạch và sắp xếp dữ liệu", "Vẽ biểu đồ, tính toán thống kê", "Trình bày kết quả cho người quản lý"],
    skills: ["Tính toán", "Tư duy logic", "Trình bày", "Cẩn thận"],
    subjects: ["Toán", "Tin học", "Tiếng Anh"],
    experience: { title: "Khảo sát nhỏ trong lớp", goal: "Thử quy trình thu thập và phân tích dữ liệu", steps: ["Đặt 1 câu hỏi khảo sát (VD: môn học bạn thích nhất)", "Hỏi 15–20 bạn, ghi vào bảng", "Dùng Excel hoặc giấy vẽ biểu đồ", "Viết 3 nhận xét từ biểu đồ"], minutes: 40, result: "Biểu đồ và 3 nhận xét", reflect: REFLECT },
  },
  {
    id: "thiet-ke-do-hoa", name: "Nhà thiết kế đồ họa", field: "Thiết kế, truyền thông",
    desc: "Thiết kế logo, áp phích, giao diện ứng dụng, bao bì sản phẩm để truyền tải thông điệp bằng hình ảnh.",
    activities: ["Phác thảo ý tưởng", "Thiết kế trên máy tính", "Chỉnh sửa theo góp ý của khách hàng"],
    skills: ["Sáng tạo", "Thẩm mỹ", "Dùng phần mềm thiết kế", "Lắng nghe góp ý"],
    subjects: ["Nghệ thuật (Âm nhạc, Mĩ thuật)", "Tin học", "Ngữ văn"],
    experience: { title: "Thiết kế áp phích cho sự kiện lớp", goal: "Thử truyền tải thông điệp bằng hình ảnh", steps: ["Chọn một sự kiện (ngày hội sách, giải bóng đá lớp)", "Phác 3 ý tưởng bố cục trên giấy", "Hoàn thiện một áp phích bằng tay hoặc Canva", "Hỏi 3 bạn: nhìn 5 giây có hiểu thông điệp không?"], minutes: 45, result: "Một áp phích và góp ý của bạn", reflect: REFLECT },
  },
  {
    id: "kien-truc-su", name: "Kiến trúc sư", field: "Kiến trúc, xây dựng",
    desc: "Thiết kế nhà ở, trường học, công viên vừa đẹp vừa tiện dụng, an toàn và hợp với môi trường xung quanh.",
    activities: ["Gặp khách hàng tìm hiểu nhu cầu", "Vẽ phương án thiết kế, dựng mô hình 3D", "Phối hợp với kỹ sư xây dựng"],
    skills: ["Sáng tạo", "Tư duy không gian", "Vẽ", "Trình bày ý tưởng"],
    subjects: ["Nghệ thuật (Âm nhạc, Mĩ thuật)", "Toán", "Công nghệ"],
    experience: { title: "Thiết kế lại góc học tập", goal: "Thử thiết kế không gian theo nhu cầu người dùng", steps: ["Đo kích thước góc học tập", "Vẽ mặt bằng theo tỉ lệ trên giấy kẻ ô", "Đề xuất cách sắp xếp lại cho sáng và gọn hơn", "Giải thích lý do cho người nhà"], minutes: 40, result: "Bản vẽ mặt bằng có tỉ lệ", reflect: REFLECT },
  },
  {
    id: "nhac-si", name: "Nhạc sĩ, nhạc công", field: "Âm nhạc, giải trí",
    desc: "Sáng tác, biểu diễn hoặc phối khí âm nhạc cho ca sĩ, phim, quảng cáo, trò chơi; có thể dạy nhạc.",
    activities: ["Luyện tập nhạc cụ hằng ngày", "Sáng tác, thu âm", "Biểu diễn trước khán giả"],
    skills: ["Cảm thụ âm nhạc", "Kiên trì luyện tập", "Sáng tạo", "Tự tin biểu diễn"],
    subjects: ["Nghệ thuật (Âm nhạc, Mĩ thuật)", "Ngữ văn", "Tiếng Anh"],
    experience: { title: "Viết lời mới cho một giai điệu", goal: "Thử sáng tác ở mức đơn giản", steps: ["Chọn một giai điệu quen thuộc, ngắn", "Viết lời mới về một chủ đề bạn thích", "Hát hoặc đọc theo nhịp, ghi âm bằng điện thoại", "Nghe lại và sửa một câu"], minutes: 30, result: "Bản ghi âm lời bài hát mới", reflect: REFLECT },
  },
  {
    id: "nha-bao", name: "Nhà báo, biên tập viên", field: "Truyền thông",
    desc: "Tìm hiểu sự kiện, phỏng vấn, viết bài, làm video tin tức; kiểm chứng thông tin trước khi đưa đến người đọc.",
    activities: ["Đi phỏng vấn, ghi chép", "Viết và biên tập bài", "Kiểm tra độ chính xác của thông tin"],
    skills: ["Viết", "Giao tiếp", "Tò mò", "Trung thực, kiểm chứng thông tin"],
    subjects: ["Ngữ văn", "Lịch sử và Địa lí", "Tiếng Anh"],
    experience: { title: "Viết bản tin trường", goal: "Thử quy trình làm tin", steps: ["Chọn một sự kiện ở trường", "Phỏng vấn 2 người có mặt", "Viết bản tin 150 chữ trả lời: Ai, Cái gì, Khi nào, Ở đâu, Vì sao", "Đọc lại, kiểm tra tên và số liệu"], minutes: 40, result: "Bản tin 150 chữ", reflect: REFLECT },
  },
  {
    id: "lam-phim", name: "Người làm phim, dựng phim", field: "Điện ảnh, truyền thông",
    desc: "Lên ý tưởng, quay, dựng phim, phim ngắn, video quảng cáo; làm hiệu ứng hình ảnh và âm thanh.",
    activities: ["Viết kịch bản phân cảnh", "Quay hình, ghi âm", "Dựng phim, làm hiệu ứng trên máy tính"],
    skills: ["Sáng tạo", "Kể chuyện", "Dùng phần mềm dựng phim", "Làm việc nhóm"],
    subjects: ["Ngữ văn", "Nghệ thuật (Âm nhạc, Mĩ thuật)", "Tin học"],
    experience: { title: "Làm phim ngắn 1 phút", goal: "Trải nghiệm quy trình kịch bản – quay – dựng", steps: ["Viết kịch bản 5 cảnh về một chủ đề đơn giản", "Quay bằng điện thoại", "Dựng bằng ứng dụng miễn phí, thêm chữ và nhạc", "Chiếu cho người nhà xem"], minutes: 60, result: "Một phim ngắn 1 phút", reflect: REFLECT },
  },
  {
    id: "thiet-ke-thoi-trang", name: "Nhà thiết kế thời trang", field: "Thời trang",
    desc: "Sáng tạo mẫu quần áo, phụ kiện; chọn chất liệu, màu sắc và theo dõi quá trình may mẫu.",
    activities: ["Vẽ phác thảo mẫu", "Chọn vải, phối màu", "Làm việc với thợ may hoàn thiện mẫu"],
    skills: ["Sáng tạo", "Thẩm mỹ", "Khéo tay", "Nắm xu hướng"],
    subjects: ["Nghệ thuật (Âm nhạc, Mĩ thuật)", "Công nghệ"],
    experience: { title: "Thiết kế lại đồng phục lớp", goal: "Thử thiết kế có điều kiện ràng buộc", steps: ["Liệt kê yêu cầu: thoải mái, dễ giặt, hợp thời tiết", "Vẽ 2 phác thảo có màu", "Ghi chất liệu vải đề xuất", "Lấy ý kiến 5 bạn và chọn mẫu"], minutes: 40, result: "2 phác thảo và kết quả bình chọn", reflect: REFLECT },
  },
  {
    id: "giao-vien", name: "Giáo viên", field: "Giáo dục",
    desc: "Dạy học, giúp học sinh hiểu bài, phát triển kỹ năng và phẩm chất; phối hợp với phụ huynh.",
    activities: ["Soạn bài và chuẩn bị đồ dùng dạy học", "Giảng dạy, tổ chức hoạt động trên lớp", "Chấm bài và nhận xét"],
    skills: ["Giao tiếp, thuyết trình", "Kiên nhẫn", "Sáng tạo", "Thấu hiểu"],
    subjects: ["Ngữ văn", "Toán", "Hoạt động trải nghiệm"],
    experience: { title: "Dạy một bạn hoặc em nhỏ một kiến thức", goal: "Thử giải thích để người khác hiểu", steps: ["Chọn một kiến thức bạn nắm chắc", "Chuẩn bị cách giảng 10 phút, có ví dụ", "Dạy cho một bạn hoặc em nhỏ", "Hỏi lại 2 câu để kiểm tra người học hiểu chưa"], minutes: 30, result: "Bài giảng 10 phút và kết quả 2 câu hỏi", reflect: REFLECT },
  },
  {
    id: "dieu-duong", name: "Điều dưỡng", field: "Y tế",
    desc: "Chăm sóc người bệnh hằng ngày: theo dõi sức khỏe, cho dùng thuốc theo y lệnh, động viên và hướng dẫn người bệnh.",
    activities: ["Đo huyết áp, nhiệt độ, theo dõi bệnh nhân", "Thực hiện chăm sóc theo y lệnh", "Hướng dẫn người nhà chăm sóc"],
    skills: ["Tận tâm", "Cẩn thận", "Giao tiếp", "Bình tĩnh"],
    subjects: ["Khoa học tự nhiên", "Giáo dục công dân", "Tiếng Anh"],
    experience: { title: "Học sơ cứu cơ bản", goal: "Làm quen với việc chăm sóc người khác an toàn", steps: ["Tìm tài liệu sơ cứu của nhà trường hoặc Hội Chữ thập đỏ", "Học cách xử lý vết xước nhỏ và chảy máu cam", "Thực hành băng bó cho bạn (giả định)", "Ghi khi nào cần gọi người lớn hoặc 115"], minutes: 30, result: "Ghi chú các bước sơ cứu", reflect: REFLECT },
  },
  {
    id: "tam-ly-hoc-duong", name: "Chuyên viên tâm lý học đường", field: "Giáo dục, tâm lý",
    desc: "Lắng nghe và hỗ trợ học sinh về cảm xúc, học tập, quan hệ bạn bè; phối hợp với giáo viên và phụ huynh.",
    activities: ["Trò chuyện, tư vấn cho học sinh", "Tổ chức buổi sinh hoạt kỹ năng", "Phối hợp với gia đình khi cần"],
    skills: ["Lắng nghe", "Thấu hiểu", "Giữ bí mật", "Giao tiếp"],
    subjects: ["Giáo dục công dân", "Ngữ văn", "Hoạt động trải nghiệm"],
    experience: { title: "Luyện lắng nghe tích cực", goal: "Thử kỹ năng cốt lõi của người tư vấn", steps: ["Nhờ một người thân kể về ngày của họ trong 5 phút", "Chỉ lắng nghe, không ngắt lời, không khuyên", "Tóm tắt lại điều bạn nghe và hỏi: mình hiểu đúng chưa?", "Hỏi người kể cảm thấy thế nào khi được nghe"], minutes: 15, result: "Ghi chú cảm nhận của hai người", reflect: REFLECT },
  },
  {
    id: "cong-tac-xa-hoi", name: "Nhân viên công tác xã hội", field: "Xã hội",
    desc: "Hỗ trợ người có hoàn cảnh khó khăn, trẻ em, người cao tuổi, người khuyết tật tiếp cận các dịch vụ và quyền lợi.",
    activities: ["Gặp gỡ, tìm hiểu hoàn cảnh", "Kết nối với các chương trình hỗ trợ", "Tổ chức hoạt động cộng đồng"],
    skills: ["Thấu hiểu", "Giao tiếp", "Tổ chức", "Kiên nhẫn"],
    subjects: ["Giáo dục công dân", "Ngữ văn", "Hoạt động trải nghiệm"],
    experience: { title: "Lên kế hoạch một hoạt động thiện nguyện nhỏ", goal: "Thử tổ chức hoạt động giúp cộng đồng", steps: ["Chọn một việc nhỏ (quyên góp sách cũ, dọn vệ sinh khu phố)", "Lập kế hoạch: ai, làm gì, khi nào, cần gì", "Xin ý kiến giáo viên chủ nhiệm", "Thực hiện cùng bạn bè nếu được đồng ý"], minutes: 45, result: "Bản kế hoạch hoạt động", reflect: REFLECT },
  },
  {
    id: "huan-luyen-vien", name: "Huấn luyện viên thể thao", field: "Thể thao",
    desc: "Lên giáo án tập luyện, hướng dẫn kỹ thuật và rèn tinh thần cho vận động viên hoặc học sinh.",
    activities: ["Lập kế hoạch buổi tập", "Hướng dẫn và sửa động tác", "Theo dõi tiến bộ của người tập"],
    skills: ["Vận động", "Động viên người khác", "Quan sát", "Lãnh đạo"],
    subjects: ["Giáo dục thể chất", "Khoa học tự nhiên"],
    experience: { title: "Hướng dẫn bài khởi động 10 phút", goal: "Thử dẫn dắt người khác tập luyện", steps: ["Thiết kế bài khởi động 10 phút gồm 5 động tác", "Ghi số lần và chú ý an toàn mỗi động tác", "Hướng dẫn cho 3–4 bạn hoặc người nhà", "Hỏi họ thấy động tác nào khó"], minutes: 25, result: "Giáo án khởi động 10 phút", reflect: REFLECT },
  },
  {
    id: "khoi-nghiep", name: "Người khởi nghiệp, chủ doanh nghiệp", field: "Kinh doanh",
    desc: "Tìm ra nhu cầu của khách hàng, lập công ty hoặc cửa hàng, quản lý vốn, con người và sản phẩm.",
    activities: ["Tìm ý tưởng và lập kế hoạch kinh doanh", "Gọi vốn, quản lý chi tiêu", "Tuyển người và dẫn dắt nhóm"],
    skills: ["Lãnh đạo", "Dám thử, chịu được thất bại", "Tính toán", "Thuyết phục"],
    subjects: ["Toán", "Giáo dục công dân", "Tiếng Anh"],
    experience: { title: "Lập kế hoạch bán hàng ở hội chợ trường", goal: "Thử nghĩ như người kinh doanh", steps: ["Chọn một sản phẩm nhỏ (đồ thủ công, bánh)", "Ước tính chi phí, giá bán và số lượng", "Tính lãi hoặc lỗ dự kiến", "Trình bày kế hoạch cho người lớn góp ý"], minutes: 40, result: "Bảng kế hoạch chi phí – giá bán", reflect: REFLECT },
  },
  {
    id: "marketing", name: "Chuyên viên marketing", field: "Kinh doanh, truyền thông",
    desc: "Tìm hiểu khách hàng và lên kế hoạch quảng bá sản phẩm qua mạng xã hội, sự kiện, quảng cáo.",
    activities: ["Khảo sát nhu cầu khách hàng", "Lên ý tưởng chiến dịch quảng bá", "Theo dõi hiệu quả bằng số liệu"],
    skills: ["Sáng tạo", "Thuyết phục", "Phân tích số liệu", "Viết nội dung"],
    subjects: ["Ngữ văn", "Toán", "Tiếng Anh", "Tin học"],
    experience: { title: "Viết quảng cáo cho một cuốn sách", goal: "Thử thuyết phục người khác bằng nội dung", steps: ["Chọn một cuốn sách bạn thích", "Xác định ai nên đọc nó", "Viết một khẩu hiệu và 3 dòng giới thiệu", "Hỏi 3 người: đọc xong có muốn mượn sách không?"], minutes: 30, result: "Mẫu quảng cáo và phản hồi", reflect: REFLECT },
  },
  {
    id: "luat-su", name: "Luật sư", field: "Pháp luật",
    desc: "Tư vấn pháp luật, bảo vệ quyền lợi hợp pháp của người dân và doanh nghiệp, tham gia tranh tụng tại tòa.",
    activities: ["Nghiên cứu hồ sơ, văn bản luật", "Gặp và tư vấn cho thân chủ", "Tranh luận tại phiên tòa"],
    skills: ["Lập luận", "Đọc hiểu", "Thuyết trình", "Trung thực"],
    subjects: ["Ngữ văn", "Giáo dục công dân", "Lịch sử và Địa lí"],
    experience: { title: "Tranh biện một chủ đề", goal: "Thử lập luận có bằng chứng", steps: ["Chọn chủ đề (VD: học sinh có nên mang điện thoại đến trường?)", "Tìm 3 lý lẽ ủng hộ và 3 lý lẽ phản đối", "Chọn một phía, trình bày 2 phút", "Nghe bạn phản biện và trả lời"], minutes: 40, result: "Dàn ý tranh biện hai phía", reflect: REFLECT },
  },
  {
    id: "ban-hang", name: "Nhân viên kinh doanh", field: "Kinh doanh",
    desc: "Giới thiệu và bán sản phẩm, dịch vụ cho khách hàng; chăm sóc khách hàng sau bán.",
    activities: ["Tìm và gặp khách hàng", "Giới thiệu, tư vấn sản phẩm", "Theo dõi đơn hàng và chăm sóc khách"],
    skills: ["Giao tiếp", "Thuyết phục", "Kiên trì", "Lắng nghe"],
    subjects: ["Ngữ văn", "Toán", "Tiếng Anh"],
    experience: { title: "Tập giới thiệu sản phẩm 1 phút", goal: "Thử thuyết phục khách hàng", steps: ["Chọn một đồ vật trong nhà", "Liệt kê 3 điểm mạnh và người phù hợp dùng nó", "Giới thiệu trong 1 phút cho người nhà", "Hỏi họ có muốn 'mua' không và vì sao"], minutes: 20, result: "Bài giới thiệu 1 phút", reflect: REFLECT },
  },
  {
    id: "huong-dan-vien", name: "Hướng dẫn viên du lịch", field: "Du lịch",
    desc: "Dẫn đoàn khách tham quan, giới thiệu lịch sử, văn hóa địa phương và bảo đảm chuyến đi an toàn, vui vẻ.",
    activities: ["Chuẩn bị lịch trình và thuyết minh", "Dẫn đoàn, giới thiệu điểm tham quan", "Xử lý tình huống phát sinh"],
    skills: ["Giao tiếp", "Ngoại ngữ", "Hiểu biết văn hóa, lịch sử", "Linh hoạt"],
    subjects: ["Lịch sử và Địa lí", "Tiếng Anh", "Ngữ văn"],
    experience: { title: "Thuyết minh một địa điểm ở quê bạn", goal: "Thử vai trò người giới thiệu văn hóa", steps: ["Chọn một địa điểm (đình, chợ, di tích)", "Tìm 5 thông tin thú vị về nơi đó", "Viết bài thuyết minh 2 phút", "Thuyết minh cho người nhà nghe, có thể bằng tiếng Anh"], minutes: 40, result: "Bài thuyết minh 2 phút", reflect: REFLECT },
  },
  {
    id: "ke-toan", name: "Kế toán", field: "Tài chính",
    desc: "Ghi chép, theo dõi thu chi, lập báo cáo tài chính và tính thuế cho công ty, cơ quan.",
    activities: ["Nhập và kiểm tra chứng từ", "Lập báo cáo thu chi", "Dùng phần mềm kế toán"],
    skills: ["Cẩn thận, chính xác", "Tính toán", "Trung thực", "Sắp xếp"],
    subjects: ["Toán", "Tin học", "Giáo dục công dân"],
    experience: { title: "Sổ thu chi cá nhân 1 tuần", goal: "Thử ghi chép tài chính đều đặn", steps: ["Kẻ bảng: ngày, nội dung, thu, chi, còn lại", "Ghi mọi khoản tiền tiêu vặt trong 7 ngày", "Cộng tổng thu, tổng chi", "Nhận xét khoản nào có thể tiết kiệm"], minutes: 10, result: "Sổ thu chi 7 ngày", reflect: REFLECT },
  },
  {
    id: "ngan-hang", name: "Nhân viên ngân hàng", field: "Tài chính, ngân hàng",
    desc: "Phục vụ khách mở tài khoản, gửi tiền, vay vốn; tư vấn sản phẩm tài chính và kiểm tra hồ sơ cẩn thận.",
    activities: ["Giao dịch với khách tại quầy", "Kiểm tra giấy tờ, hồ sơ", "Tư vấn sản phẩm tiết kiệm, thẻ"],
    skills: ["Chính xác", "Giao tiếp lịch sự", "Tuân thủ quy định", "Tính toán"],
    subjects: ["Toán", "Tin học", "Tiếng Anh"],
    experience: { title: "Tính lãi tiết kiệm", goal: "Làm quen với khái niệm tài chính cơ bản", steps: ["Giả sử gửi 1.000.000 đồng với lãi suất 5% mỗi năm", "Tính số tiền sau 1, 2, 3 năm (lãi nhập gốc)", "Vẽ bảng so sánh", "Hỏi người lớn về một lần họ đi giao dịch ngân hàng"], minutes: 25, result: "Bảng tính lãi 3 năm", reflect: REFLECT },
  },
  {
    id: "quan-tri-mang", name: "Quản trị mạng máy tính", field: "Công nghệ thông tin",
    desc: "Lắp đặt, cài đặt và bảo vệ hệ thống máy tính, mạng internet của trường học, công ty.",
    activities: ["Cài đặt phần mềm, cấp tài khoản", "Theo dõi mạng, khắc phục sự cố", "Bảo vệ dữ liệu khỏi tấn công"],
    skills: ["Tư duy logic", "Cẩn thận", "Xử lý sự cố", "Tự học"],
    subjects: ["Tin học", "Toán", "Tiếng Anh", "Công nghệ"],
    experience: { title: "Kiểm tra an toàn tài khoản của bạn", goal: "Làm quen tư duy bảo mật", steps: ["Liệt kê các tài khoản bạn đang dùng (không ghi mật khẩu)", "Kiểm tra: mật khẩu có đủ mạnh, có dùng chung không", "Đọc 5 nguyên tắc an toàn khi dùng mạng", "Cùng người lớn bật xác thực 2 bước cho một tài khoản"], minutes: 30, result: "Danh sách việc cần làm để tài khoản an toàn hơn", reflect: REFLECT },
  },
  {
    id: "logistics", name: "Nhân viên kho vận (logistics)", field: "Thương mại, vận tải",
    desc: "Quản lý hàng hóa trong kho, sắp xếp vận chuyển để hàng đến tay khách đúng lúc, đúng nơi.",
    activities: ["Kiểm kê hàng hóa", "Lập kế hoạch giao hàng", "Theo dõi đơn hàng trên phần mềm"],
    skills: ["Sắp xếp", "Lập kế hoạch", "Cẩn thận", "Phối hợp"],
    subjects: ["Toán", "Tin học", "Lịch sử và Địa lí"],
    experience: { title: "Lên lộ trình giao hàng", goal: "Thử sắp xếp công việc hiệu quả", steps: ["Chọn 5 địa điểm quen thuộc gần nhà", "Vẽ bản đồ đơn giản", "Tìm thứ tự đi qua cả 5 nơi với đường ngắn nhất", "So sánh với một bạn xem ai tối ưu hơn"], minutes: 30, result: "Bản đồ lộ trình", reflect: REFLECT },
  },
  {
    id: "hanh-chinh", name: "Nhân viên hành chính văn phòng", field: "Văn phòng",
    desc: "Soạn thảo văn bản, quản lý hồ sơ, sắp xếp lịch họp và hỗ trợ hoạt động hằng ngày của cơ quan.",
    activities: ["Soạn thảo, lưu trữ văn bản", "Sắp xếp lịch làm việc", "Tiếp khách, nghe điện thoại"],
    skills: ["Ngăn nắp", "Tin học văn phòng", "Giao tiếp", "Cẩn thận"],
    subjects: ["Tin học", "Ngữ văn", "Tiếng Anh"],
    experience: { title: "Làm thư ký cho một buổi họp lớp", goal: "Thử ghi chép và tổng hợp thông tin", steps: ["Xin làm thư ký cho buổi sinh hoạt lớp", "Ghi: nội dung, ý kiến chính, quyết định", "Soạn biên bản gọn trên máy tính", "Nhờ giáo viên chủ nhiệm nhận xét"], minutes: 45, result: "Biên bản họp lớp", reflect: REFLECT },
  },
  {
    id: "doi-ngoai", name: "Chuyên viên đối ngoại, quan hệ quốc tế", field: "Ngoại giao, hợp tác quốc tế",
    desc: "Làm cầu nối giữa cơ quan, trường học hay doanh nghiệp Việt Nam với đối tác nước ngoài: tổ chức gặp gỡ, đàm phán hợp tác, chuẩn bị văn bản và sự kiện.",
    activities: ["Liên lạc, viết thư cho đối tác nước ngoài", "Chuẩn bị và tham dự các buổi gặp gỡ, hội nghị", "Tìm hiểu văn hóa, phong tục của nước bạn"],
    skills: ["Giao tiếp tự tin", "Ngoại ngữ", "Thuyết phục", "Hiểu biết văn hóa"],
    subjects: ["Tiếng Anh", "Lịch sử và Địa lý", "Ngữ văn", "Giáo dục công dân"],
    experience: { title: "Giới thiệu quê hương cho bạn nước ngoài", goal: "Thử vai người làm cầu nối văn hóa", steps: ["Chọn 3 điều đặc sắc về quê bạn (món ăn, lễ hội, địa danh)", "Viết một đoạn giới thiệu ngắn bằng tiếng Việt", "Thử dịch đoạn đó sang tiếng Anh (có thể nhờ thầy cô xem lại)", "Đọc to như đang giới thiệu cho khách nước ngoài"], minutes: 30, result: "Một đoạn giới thiệu song ngữ về quê hương", reflect: REFLECT },
  },
];

const profileById = (id?: string) => (id ? PROFILES.find((p) => p.id === id) : undefined);

// ---------- Danh sách nghề theo nhóm (nguồn: Trường ĐH Văn Lang, 2021) ----------
// vlu: nhóm mà Văn Lang xếp nghề vào (có nghề được xếp ở 2 nhóm).
// field: lĩnh vực, lấy theo cách Văn Lang gom trong ngoặc; chỗ không có thì nhóm nghiên cứu tự gom để dễ tra.
// profile: hồ sơ nghề tiêu biểu cùng lĩnh vực (nếu có) để xem mô tả và làm hoạt động trải nghiệm.
interface NgheVL {
  id: string;
  name: string;
  vlu: RiasecCode[];
  field: string;
  profile?: string;
}

const NGHE: NgheVL[] = [
  // ===== Nhóm Kĩ thuật =====
  { id: "kien-truc", name: "Kiến trúc", vlu: ["R", "A"], field: "Xây dựng – kiến trúc", profile: "kien-truc-su" },
  { id: "xay-dung", name: "Xây dựng", vlu: ["R"], field: "Xây dựng – kiến trúc", profile: "ky-su-xay-dung" },
  { id: "cong-nghiep-dan-dung", name: "Công nghiệp dân dụng", vlu: ["R"], field: "Xây dựng – kiến trúc" },
  { id: "ky-thuat", name: "Kỹ thuật", vlu: ["R"], field: "Kỹ thuật" },
  { id: "lai-xe", name: "Lái xe", vlu: ["R"], field: "Vận tải" },
  { id: "huan-luyen-vien", name: "Huấn luyện viên", vlu: ["R"], field: "Thể thao", profile: "huan-luyen-vien" },
  { id: "nghe-moc", name: "Nghề mộc", vlu: ["R"], field: "Thủ công" },
  { id: "quan-ly-trang-trai", name: "Quản lý trang trại", vlu: ["R"], field: "Nông – lâm nghiệp" },
  { id: "nhan-giong-ca", name: "Nhân giống cá", vlu: ["R"], field: "Nông – lâm nghiệp" },
  { id: "lam-nghiep", name: "Lâm nghiệp", vlu: ["R"], field: "Nông – lâm nghiệp" },
  { id: "che-tao-may", name: "Chế tạo máy móc", vlu: ["R"], field: "Cơ khí" },
  { id: "luyen-kim", name: "Luyện kim", vlu: ["R"], field: "Cơ khí" },
  { id: "co-khi-ung-dung", name: "Cơ khí ứng dụng", vlu: ["R"], field: "Cơ khí", profile: "ky-su-co-khi" },
  { id: "bao-tri-sua-chua", name: "Bảo trì và sửa chữa thiết bị", vlu: ["R"], field: "Cơ khí", profile: "ky-thuat-vien-o-to" },
  { id: "do-dac", name: "Đo đạc", vlu: ["R"], field: "Địa lý – địa chất" },
  { id: "ban-do-dia-chinh", name: "Vẽ bản đồ địa chính", vlu: ["R"], field: "Địa lý – địa chất" },
  { id: "dau-khi", name: "Dầu khí", vlu: ["R"], field: "Dầu khí" },
  { id: "hai-duong-hoc", name: "Hải dương học", vlu: ["R"], field: "Hải dương học" },
  { id: "dien-dien-tu", name: "Điện – điện tử", vlu: ["R"], field: "Điện – điện tử", profile: "tho-dien" },
  { id: "quan-ly-cong-nghiep", name: "Quản lý công nghiệp", vlu: ["R"], field: "Quản lý công nghiệp" },

  // ===== Nhóm Nghiên cứu =====
  { id: "cong-nghe-thong-tin", name: "Công nghệ thông tin", vlu: ["I"], field: "Khoa học công nghệ", profile: "lap-trinh-vien" },
  { id: "quan-tri-mang", name: "Quản trị mạng máy tính", vlu: ["I"], field: "Khoa học công nghệ", profile: "quan-tri-mang" },
  { id: "moi-truong", name: "Môi trường", vlu: ["I"], field: "Khoa học công nghệ", profile: "ky-su-moi-truong" },
  { id: "vat-ly-ky-thuat", name: "Vật lý kỹ thuật", vlu: ["I"], field: "Khoa học công nghệ" },
  { id: "nong-hoc", name: "Nông học", vlu: ["I"], field: "Nông lâm", profile: "ky-su-nong-nghiep" },
  { id: "thu-y", name: "Thú y", vlu: ["I"], field: "Nông lâm" },
  { id: "nghien-cuu-toan", name: "Nghiên cứu toán học", vlu: ["I"], field: "Khoa học tự nhiên" },
  { id: "nghien-cuu-vat-ly", name: "Nghiên cứu vật lý", vlu: ["I"], field: "Khoa học tự nhiên" },
  { id: "nghien-cuu-hoa-hoc", name: "Nghiên cứu hóa học", vlu: ["I"], field: "Khoa học tự nhiên" },
  { id: "nghien-cuu-sinh-hoc", name: "Nghiên cứu sinh học", vlu: ["I"], field: "Khoa học tự nhiên" },
  { id: "dia-ly", name: "Địa lý", vlu: ["I"], field: "Khoa học tự nhiên, khoa học xã hội" },
  { id: "thong-ke", name: "Thống kê", vlu: ["I", "C"], field: "Khoa học tự nhiên", profile: "phan-tich-du-lieu" },
  { id: "nhan-hoc", name: "Nhân học", vlu: ["I"], field: "Khoa học xã hội" },
  { id: "tam-ly-hoc", name: "Tâm lý học", vlu: ["I"], field: "Khoa học xã hội" },
  { id: "phap-luat", name: "Pháp luật", vlu: ["I"], field: "Khoa học xã hội" },
  { id: "su-hoc", name: "Sử học", vlu: ["I"], field: "Khoa học xã hội" },
  { id: "bac-si", name: "Bác sĩ", vlu: ["I"], field: "Y – dược", profile: "bac-si" },
  { id: "y-si", name: "Y sĩ", vlu: ["I"], field: "Y – dược" },
  { id: "dieu-duong", name: "Điều dưỡng", vlu: ["I", "S"], field: "Y – dược", profile: "dieu-duong" },
  { id: "nha-si", name: "Nha sĩ", vlu: ["I"], field: "Y – dược" },
  { id: "duoc-si", name: "Dược sĩ", vlu: ["I"], field: "Y – dược", profile: "duoc-si" },
  { id: "ky-thuat-lam-sang", name: "Kỹ thuật lâm sàng", vlu: ["I"], field: "Y – dược" },

  // ===== Nhóm Nghệ thuật =====
  { id: "van-hoc", name: "Văn học", vlu: ["A"], field: "Văn học" },
  { id: "binh-luan-vien", name: "Bình luận viên", vlu: ["A"], field: "Báo chí" },
  { id: "dan-chuong-trinh", name: "Dẫn chương trình", vlu: ["A"], field: "Báo chí" },
  { id: "bien-tap-vien", name: "Biên tập viên", vlu: ["A"], field: "Báo chí", profile: "nha-bao" },
  { id: "truyen-thong-xa-hoi", name: "Truyền thông phát triển xã hội", vlu: ["A"], field: "Truyền thông" },
  { id: "to-chuc-su-kien", name: "Tổ chức sự kiện", vlu: ["A"], field: "Truyền thông" },
  { id: "quan-he-cong-chung", name: "Quan hệ công chúng", vlu: ["A"], field: "Truyền thông" },
  { id: "quang-cao", name: "Quảng cáo", vlu: ["A"], field: "Truyền thông" },
  { id: "dien-vien", name: "Diễn viên", vlu: ["A"], field: "Sân khấu – điện ảnh" },
  { id: "dao-dien", name: "Đạo diễn", vlu: ["A"], field: "Sân khấu – điện ảnh" },
  { id: "dung-phim", name: "Dựng phim", vlu: ["A"], field: "Sân khấu – điện ảnh", profile: "lam-phim" },
  { id: "ca-si", name: "Ca sĩ", vlu: ["A"], field: "Sân khấu – điện ảnh", profile: "nhac-si" },
  { id: "nghe-si-mua", name: "Nghệ sĩ múa", vlu: ["A"], field: "Sân khấu – điện ảnh" },
  { id: "my-thuat", name: "Mỹ thuật", vlu: ["A"], field: "Mỹ thuật" },
  { id: "hoi-hoa", name: "Hội họa", vlu: ["A"], field: "Mỹ thuật" },
  { id: "thiet-ke", name: "Thiết kế", vlu: ["A"], field: "Thiết kế", profile: "thiet-ke-do-hoa" },
  { id: "thoi-trang", name: "Thời trang", vlu: ["A"], field: "Thiết kế", profile: "thiet-ke-thoi-trang" },
  { id: "gv-lich-su-anh-van", name: "Giáo viên dạy Lịch sử / Anh văn", vlu: ["A"], field: "Giáo dục" },

  // ===== Nhóm Xã hội =====
  { id: "giao-vien", name: "Giáo viên", vlu: ["S"], field: "Giáo dục", profile: "giao-vien" },
  { id: "huong-dan-vien", name: "Hướng dẫn viên du lịch", vlu: ["S"], field: "Du lịch", profile: "huong-dan-vien" },
  { id: "tu-van-tam-ly", name: "Tư vấn tâm lý", vlu: ["S"], field: "Tâm lý – tư vấn", profile: "tam-ly-hoc-duong" },
  { id: "tri-lieu-tam-ly", name: "Nhà trị liệu tâm lý", vlu: ["S"], field: "Tâm lý – tư vấn" },
  { id: "tu-van-huong-nghiep", name: "Tư vấn – hướng nghiệp", vlu: ["S"], field: "Tâm lý – tư vấn" },
  { id: "cong-tac-xa-hoi", name: "Công tác xã hội", vlu: ["S"], field: "Công tác xã hội", profile: "cong-tac-xa-hoi" },
  { id: "nv-xa-hoi-hoc", name: "Nhân viên xã hội học", vlu: ["S"], field: "Công tác xã hội" },
  { id: "tinh-nguyen-vien", name: "Tình nguyện viên", vlu: ["S"], field: "Công tác xã hội" },
  { id: "suc-khoe-cong-dong", name: "Sức khỏe cộng đồng", vlu: ["S"], field: "Y tế" },
  { id: "bac-si-chuyen-khoa", name: "Bác sĩ chuyên khoa", vlu: ["S"], field: "Y tế" },
  { id: "chuyen-gia-dinh-duong", name: "Chuyên gia dinh dưỡng", vlu: ["S"], field: "Y tế" },
  { id: "tham-dinh-gia", name: "Thẩm định giá", vlu: ["S"], field: "Tài chính" },
  { id: "nhan-su", name: "Nhân sự", vlu: ["S"], field: "Nhân sự" },
  { id: "canh-sat", name: "Cảnh sát", vlu: ["S"], field: "An ninh" },

  // ===== Nhóm Quản lí =====
  { id: "quan-tri-kinh-doanh", name: "Quản trị kinh doanh", vlu: ["E"], field: "Kinh doanh", profile: "khoi-nghiep" },
  { id: "thuong-mai", name: "Thương mại", vlu: ["E"], field: "Kinh doanh" },
  { id: "marketing", name: "Marketing", vlu: ["E"], field: "Kinh doanh", profile: "marketing" },
  { id: "kinh-te-doi-ngoai", name: "Kinh tế đối ngoại", vlu: ["E"], field: "Kinh doanh", profile: "doi-ngoai" },
  { id: "kinh-doanh-quoc-te", name: "Kinh doanh quốc tế", vlu: ["E"], field: "Kinh doanh" },
  { id: "nhan-vien-sales", name: "Nhân viên sales", vlu: ["E"], field: "Kinh doanh", profile: "ban-hang" },
  { id: "ke-toan-tai-chinh", name: "Kế toán – tài chính", vlu: ["E"], field: "Tài chính" },
  { id: "tai-chinh-ngan-hang", name: "Tài chính – ngân hàng", vlu: ["E", "C"], field: "Tài chính", profile: "ngan-hang" },
  { id: "luat-su", name: "Luật sư", vlu: ["E"], field: "Pháp luật", profile: "luat-su" },
  { id: "dich-vu-khach-hang", name: "Dịch vụ khách hàng", vlu: ["E"], field: "Dịch vụ" },
  { id: "tiep-vien-hang-khong", name: "Tiếp viên hàng không", vlu: ["E"], field: "Dịch vụ" },
  { id: "pha-che", name: "Pha chế rượu", vlu: ["E"], field: "Dịch vụ" },
  { id: "quy-hoach-do-thi", name: "Quy hoạch đô thị", vlu: ["E"], field: "Quy hoạch" },

  // ===== Nhóm Nghiệp vụ =====
  { id: "chuoi-cung-ung", name: "Vận hành chuỗi cung ứng", vlu: ["C"], field: "Logistics", profile: "logistics" },
  { id: "quan-ly-hanh-chinh", name: "Quản lý hành chính", vlu: ["C"], field: "Hành chính", profile: "hanh-chinh" },
  { id: "kiem-duyet", name: "Kiểm duyệt", vlu: ["C"], field: "Hành chính" },
  { id: "thanh-tra-nganh", name: "Thanh tra ngành", vlu: ["C"], field: "Quản lý nhà nước" },
  { id: "ke-toan", name: "Kế toán", vlu: ["C"], field: "Tài chính – kế toán", profile: "ke-toan" },
  { id: "kiem-toan", name: "Kiểm toán", vlu: ["C"], field: "Tài chính – kế toán" },
  { id: "y-duoc", name: "Y dược", vlu: ["C"], field: "Y – dược" },
];

// ---------- Nghề dùng trong web ----------
export interface Career {
  id: string;
  name: string;
  field: string;
  /** Nhóm theo Trường ĐH Văn Lang */
  vlu: RiasecCode[];
  /** Mã Holland theo O*NET (1–3 nhóm, nhóm mạnh nhất đứng đầu), có khi đã ghép bằng script */
  onet?: { soc: string; title: string; codes: RiasecCode[] };
  /** Nhóm dùng để so với mã của học sinh: theo O*NET nếu có, không thì theo Văn Lang */
  codes: RiasecCode[];
  codeSource: "onet" | "vlu";
  /** Hồ sơ nghề tiêu biểu (mô tả, hoạt động trải nghiệm), có thể không có */
  profile?: CareerProfile;
}

const isCode = (x: string): x is RiasecCode => (RIASEC_ORDER as string[]).includes(x);

export const CAREERS: Career[] = NGHE.map((n) => {
  const o = ONET_CODES[n.id];
  const onetCodes = o ? o.codes.filter(isCode) : [];
  const onet = o && onetCodes.length ? { soc: o.soc, title: o.title, codes: onetCodes } : undefined;
  return {
    id: n.id,
    name: n.name,
    field: n.field,
    vlu: n.vlu,
    onet,
    codes: onet ? onet.codes : n.vlu,
    codeSource: onet ? "onet" : "vlu",
    profile: profileById(n.profile),
  };
});

export const careerById = (id: string) => CAREERS.find((c) => c.id === id);

/** Nhóm chính của nghề: O*NET (nếu đã ghép) lấy nhóm đứng đầu; Văn Lang thì các nhóm ngang nhau */
export const mainGroups = (c: Career): RiasecCode[] => (c.codeSource === "onet" ? c.codes.slice(0, 1) : c.codes);

/** Các nghề khác cùng lĩnh vực (theo cột lĩnh vực ở trên) */
export const sameField = (c: Career) => CAREERS.filter((x) => x.id !== c.id && x.field === c.field);

/** Số dòng "nhóm – nghề" theo Văn Lang (nghề ở 2 nhóm tính 2 dòng) */
export const VLU_ROWS = NGHE.reduce((n, x) => n + x.vlu.length, 0);
export const ONET_MATCHED = CAREERS.filter((c) => c.onet).length;

// ---------- Nguồn ----------
export const SOURCES: { text: string; url?: string }[] = [
  { text: "Bộ sách Kết nối tri thức với cuộc sống. Công nghệ 9 – Định hướng nghề nghiệp, Bài 4, Hình 4.2: Sáu nhóm tính cách trong lí thuyết mật mã Holland. NXB Giáo dục Việt Nam." },
  { text: "Holland, J. L. (1997). Making Vocational Choices: A Theory of Vocational Personalities and Work Environments (3rd ed.). Psychological Assessment Resources." },
  {
    text: "Trung tâm Phát triển Năng lực, Trường Đại học Văn Lang (2021). Hướng nghiệp bằng Mật mã Holland.",
    url: "https://career.vlu.edu.vn/tai-nguyen-huong-nghiep/huong-nghiep-bang-mat-ma-holland-1209210926",
  },
  {
    text: "National Center for O*NET Development. O*NET 30.2 Database – Interests. U.S. Department of Labor, Employment and Training Administration.",
    url: "https://www.onetcenter.org/dictionary/30.2/excel/interests.html",
  },
];
export const ONET_LICENSE_URL = "https://creativecommons.org/licenses/by/4.0/";
export const ONET_ATTRIBUTION =
  "Mã Holland của nghề (khi có) lấy từ O*NET® 30.2 Database của Bộ Lao động Hoa Kỳ, Cục Việc làm và Đào tạo (USDOL/ETA), dùng theo giấy phép CC BY 4.0. Việc ghép nghề Việt Nam với nghề O*NET do nhóm nghiên cứu thực hiện; USDOL/ETA chưa duyệt hay xác nhận việc ghép này. O*NET® là nhãn hiệu của USDOL/ETA.";
