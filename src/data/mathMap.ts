// ============================================================
// BẢN ĐỒ CHINH PHỤC TRI THỨC – MÔN TOÁN (sửa trực tiếp ở file này)
// Mỗi điểm khám phá = 1 chương SGK Toán bộ "Kết nối tri thức với cuộc sống" (NXB Giáo dục Việt Nam).
// Danh sách bài dùng làm kiến thức nền gửi cho AI khi tạo câu hỏi.
// Thầy cô nên đối chiếu lại với sách đang dùng (tên chương, tên bài).
// ============================================================

export interface MathChapter {
  id: string; // VD "t8-c4"
  no: string; // "Chương IV"
  title: string;
  lessons: string[];
}

export interface MathGrade {
  grade: "6" | "7" | "8" | "9";
  land: string; // tên vùng đất trên bản đồ
  chapters: MathChapter[];
}

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
const make = (grade: MathGrade["grade"], land: string, list: [string, string[]][]): MathGrade => ({
  grade,
  land,
  chapters: list.map(([title, lessons], i) => ({ id: `t${grade}-c${i + 1}`, no: `Chương ${ROMAN[i]}`, title, lessons })),
});

export const MATH_GRADES: MathGrade[] = [
  make("6", "Thung lũng Số tự nhiên", [
    ["Tập hợp các số tự nhiên", ["Tập hợp", "Cách ghi số tự nhiên", "Thứ tự trong tập hợp các số tự nhiên", "Phép cộng và phép trừ số tự nhiên", "Phép nhân và phép chia số tự nhiên", "Lũy thừa với số mũ tự nhiên", "Thứ tự thực hiện các phép tính"]],
    ["Tính chia hết trong tập hợp các số tự nhiên", ["Quan hệ chia hết và tính chất", "Dấu hiệu chia hết", "Số nguyên tố", "Ước chung. Ước chung lớn nhất", "Bội chung. Bội chung nhỏ nhất"]],
    ["Số nguyên", ["Tập hợp các số nguyên", "Phép cộng và phép trừ số nguyên", "Quy tắc dấu ngoặc", "Phép nhân số nguyên", "Phép chia hết. Ước và bội của một số nguyên"]],
    ["Một số hình phẳng trong thực tiễn", ["Hình tam giác đều. Hình vuông. Hình lục giác đều", "Hình chữ nhật. Hình thoi. Hình bình hành. Hình thang cân", "Chu vi và diện tích của một số tứ giác đã học"]],
    ["Tính đối xứng của hình phẳng trong tự nhiên", ["Hình có trục đối xứng", "Hình có tâm đối xứng"]],
    ["Phân số", ["Mở rộng phân số. Phân số bằng nhau", "So sánh phân số. Hỗn số dương", "Phép cộng và phép trừ phân số", "Phép nhân và phép chia phân số", "Hai bài toán về phân số"]],
    ["Số thập phân", ["Số thập phân", "Tính toán với số thập phân", "Làm tròn và ước lượng", "Một số bài toán về tỉ số và tỉ số phần trăm"]],
    ["Những hình hình học cơ bản", ["Điểm và đường thẳng", "Điểm nằm giữa hai điểm. Tia", "Đoạn thẳng. Độ dài đoạn thẳng", "Trung điểm của đoạn thẳng", "Góc", "Số đo góc"]],
    ["Dữ liệu và xác suất thực nghiệm", ["Dữ liệu và thu thập dữ liệu", "Bảng thống kê và biểu đồ tranh", "Biểu đồ cột", "Biểu đồ cột kép", "Kết quả có thể và sự kiện trong trò chơi, thí nghiệm", "Xác suất thực nghiệm"]],
  ]),
  make("7", "Cao nguyên Số hữu tỉ", [
    ["Số hữu tỉ", ["Tập hợp các số hữu tỉ", "Cộng, trừ, nhân, chia số hữu tỉ", "Lũy thừa với số mũ tự nhiên của một số hữu tỉ", "Thứ tự thực hiện các phép tính. Quy tắc chuyển vế"]],
    ["Số thực", ["Làm quen với số thập phân vô hạn tuần hoàn", "Số vô tỉ. Căn bậc hai số học", "Tập hợp các số thực"]],
    ["Góc và đường thẳng song song", ["Góc ở vị trí đặc biệt. Tia phân giác của một góc", "Hai đường thẳng song song và dấu hiệu nhận biết", "Tiên đề Euclid. Tính chất của hai đường thẳng song song", "Định lí và chứng minh định lí"]],
    ["Tam giác bằng nhau", ["Tổng các góc trong một tam giác", "Hai tam giác bằng nhau. Trường hợp bằng nhau thứ nhất của tam giác", "Trường hợp bằng nhau thứ hai và thứ ba của tam giác", "Các trường hợp bằng nhau của tam giác vuông", "Tam giác cân. Đường trung trực của đoạn thẳng"]],
    ["Thu thập và biểu diễn dữ liệu", ["Thu thập và phân loại dữ liệu", "Biểu đồ hình quạt tròn", "Biểu đồ đoạn thẳng"]],
    ["Tỉ lệ thức và đại lượng tỉ lệ", ["Tỉ lệ thức", "Tính chất của dãy tỉ số bằng nhau", "Đại lượng tỉ lệ thuận", "Đại lượng tỉ lệ nghịch"]],
    ["Biểu thức đại số và đa thức một biến", ["Biểu thức đại số", "Đa thức một biến", "Phép cộng và phép trừ đa thức một biến", "Phép nhân đa thức một biến", "Phép chia đa thức một biến"]],
    ["Làm quen với biến cố và xác suất của biến cố", ["Làm quen với biến cố", "Làm quen với xác suất của biến cố"]],
    ["Quan hệ giữa các yếu tố trong một tam giác", ["Quan hệ giữa góc và cạnh đối diện trong một tam giác", "Quan hệ giữa đường vuông góc và đường xiên", "Quan hệ giữa ba cạnh của một tam giác", "Sự đồng quy của ba đường trung tuyến, ba đường phân giác trong một tam giác", "Sự đồng quy của ba đường trung trực, ba đường cao trong một tam giác"]],
    ["Một số hình khối trong thực tiễn", ["Hình hộp chữ nhật và hình lập phương", "Hình lăng trụ đứng tam giác và hình lăng trụ đứng tứ giác"]],
  ]),
  make("8", "Rặng núi Đại số", [
    ["Đa thức", ["Đơn thức", "Đa thức", "Phép cộng và phép trừ đa thức", "Phép nhân đa thức", "Phép chia đa thức cho đơn thức"]],
    ["Hằng đẳng thức đáng nhớ và ứng dụng", ["Mở đầu về hằng đẳng thức. Hiệu hai bình phương", "Bình phương của một tổng hay một hiệu", "Lập phương của một tổng hay một hiệu", "Tổng và hiệu hai lập phương", "Phân tích đa thức thành nhân tử"]],
    ["Tứ giác", ["Tứ giác", "Hình thang cân", "Hình bình hành", "Dấu hiệu nhận biết hình bình hành", "Hình chữ nhật", "Hình thoi và hình vuông"]],
    ["Định lí Thalès", ["Định lí Thalès trong tam giác", "Đường trung bình của tam giác", "Tính chất đường phân giác của tam giác"]],
    ["Dữ liệu và biểu đồ", ["Thu thập và phân loại dữ liệu", "Biểu diễn dữ liệu bằng bảng, biểu đồ", "Phân tích số liệu thống kê dựa vào biểu đồ"]],
    ["Phân thức đại số", ["Phân thức đại số", "Tính chất cơ bản của phân thức đại số", "Phép cộng và phép trừ phân thức đại số", "Phép nhân và phép chia phân thức đại số"]],
    ["Phương trình bậc nhất và hàm số bậc nhất", ["Phương trình bậc nhất một ẩn", "Giải bài toán bằng cách lập phương trình", "Khái niệm hàm số và đồ thị của hàm số", "Hàm số bậc nhất và đồ thị của hàm số bậc nhất", "Hệ số góc của đường thẳng"]],
    ["Mở đầu về tính xác suất của biến cố", ["Kết quả có thể và kết quả thuận lợi", "Cách tính xác suất của biến cố bằng tỉ số", "Xác suất thực nghiệm của một biến cố", "Mối liên hệ giữa xác suất thực nghiệm với xác suất và ứng dụng"]],
    ["Tam giác đồng dạng", ["Hai tam giác đồng dạng", "Ba trường hợp đồng dạng của hai tam giác", "Định lí Pythagore và ứng dụng", "Các trường hợp đồng dạng của hai tam giác vuông", "Hình đồng dạng"]],
    ["Một số hình khối trong thực tiễn", ["Hình chóp tam giác đều", "Hình chóp tứ giác đều"]],
  ]),
  make("9", "Vương quốc Hàm số", [
    ["Phương trình và hệ hai phương trình bậc nhất hai ẩn", ["Khái niệm phương trình và hệ hai phương trình bậc nhất hai ẩn", "Giải hệ hai phương trình bậc nhất hai ẩn", "Giải bài toán bằng cách lập hệ phương trình"]],
    ["Phương trình và bất phương trình bậc nhất một ẩn", ["Phương trình quy về phương trình bậc nhất một ẩn", "Bất đẳng thức và tính chất", "Bất phương trình bậc nhất một ẩn"]],
    ["Căn bậc hai và căn bậc ba", ["Căn bậc hai và căn thức bậc hai", "Khai căn bậc hai với phép nhân và phép chia", "Biến đổi đơn giản và rút gọn biểu thức chứa căn thức bậc hai", "Căn bậc ba và căn thức bậc ba"]],
    ["Hệ thức lượng trong tam giác vuông", ["Tỉ số lượng giác của góc nhọn", "Một số hệ thức giữa cạnh, góc trong tam giác vuông và ứng dụng"]],
    ["Đường tròn", ["Mở đầu về đường tròn", "Cung và dây của một đường tròn", "Độ dài của cung tròn. Diện tích hình quạt tròn và hình vành khuyên", "Vị trí tương đối của đường thẳng và đường tròn", "Vị trí tương đối của hai đường tròn"]],
    ["Hàm số y = ax² (a ≠ 0). Phương trình bậc hai một ẩn", ["Hàm số y = ax² (a ≠ 0)", "Phương trình bậc hai một ẩn", "Định lí Viète và ứng dụng", "Giải bài toán bằng cách lập phương trình"]],
    ["Tần số và tần số tương đối", ["Bảng tần số và biểu đồ tần số", "Bảng tần số tương đối và biểu đồ tần số tương đối", "Bảng tần số, tần số tương đối ghép nhóm và biểu đồ"]],
    ["Xác suất của biến cố trong một số mô hình xác suất đơn giản", ["Phép thử ngẫu nhiên và không gian mẫu", "Xác suất của biến cố liên quan tới phép thử"]],
    ["Đường tròn ngoại tiếp và đường tròn nội tiếp", ["Góc nội tiếp", "Đường tròn ngoại tiếp và đường tròn nội tiếp của một tam giác", "Tứ giác nội tiếp", "Đa giác đều"]],
    ["Một số hình khối trong thực tiễn", ["Hình trụ và hình nón", "Hình cầu"]],
  ]),
];

export const gradeData = (g: string) => MATH_GRADES.find((x) => x.grade === g) || MATH_GRADES[2];
export const chapterById = (id: string) => MATH_GRADES.flatMap((g) => g.chapters.map((c) => ({ ...c, grade: g.grade }))).find((c) => c.id === id);

export const LEVELS = [
  { id: 1, name: "Dễ", hint: "Nhận biết, thông hiểu" },
  { id: 2, name: "Vừa", hint: "Thông hiểu, vận dụng" },
  { id: 3, name: "Khó", hint: "Vận dụng, suy luận, tình huống thực tế" },
] as const;

export const QUESTIONS_PER_RUN = 5;
