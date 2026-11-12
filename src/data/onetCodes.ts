// ============================================================
// MÃ HOLLAND THEO O*NET CỦA TỪNG NGHỀ
// FILE NÀY ĐƯỢC TẠO TỰ ĐỘNG bằng: node scripts/them-ma-onet.mjs Interests.txt (O*NET 30.2)
// Không sửa tay. Muốn đổi cặp ghép nghề thì sửa scripts/nghe-onet.csv rồi chạy lại script.
// Nguồn: O*NET® Database (Interests), USDOL/ETA, giấy phép CC BY 4.0.
// ============================================================

export const ONET_VERSION = "O*NET 30.2 – Interests";
export const ONET_CODES: Record<string, { soc: string; title: string; codes: string[] }> = {
  "kien-truc": {
    "soc": "17-1011.00",
    "title": "Architects, Except Landscape and Naval",
    "codes": [
      "R",
      "C",
      "A"
    ]
  },
  "xay-dung": {
    "soc": "17-2051.00",
    "title": "Civil Engineers",
    "codes": [
      "R",
      "I",
      "C"
    ]
  },
  "lai-xe": {
    "soc": "53-3032.00",
    "title": "Heavy and Tractor-Trailer Truck Drivers",
    "codes": [
      "R",
      "C"
    ]
  },
  "huan-luyen-vien": {
    "soc": "27-2022.00",
    "title": "Coaches and Scouts",
    "codes": [
      "S",
      "E",
      "R"
    ]
  },
  "nghe-moc": {
    "soc": "47-2031.00",
    "title": "Carpenters",
    "codes": [
      "R",
      "C"
    ]
  },
  "quan-ly-trang-trai": {
    "soc": "11-9013.00",
    "title": "Farmers, Ranchers, and Other Agricultural Managers",
    "codes": [
      "E",
      "R",
      "C"
    ]
  },
  "nhan-giong-ca": {
    "soc": "45-2093.00",
    "title": "Farmworkers, Farm, Ranch, and Aquacultural Animals",
    "codes": [
      "R"
    ]
  },
  "lam-nghiep": {
    "soc": "19-1032.00",
    "title": "Foresters",
    "codes": [
      "R",
      "I",
      "C"
    ]
  },
  "che-tao-may": {
    "soc": "51-4041.00",
    "title": "Machinists",
    "codes": [
      "R",
      "C",
      "I"
    ]
  },
  "luyen-kim": {
    "soc": "17-2131.00",
    "title": "Materials Engineers",
    "codes": [
      "R",
      "I",
      "C"
    ]
  },
  "co-khi-ung-dung": {
    "soc": "17-2141.00",
    "title": "Mechanical Engineers",
    "codes": [
      "R",
      "I",
      "C"
    ]
  },
  "bao-tri-sua-chua": {
    "soc": "49-9041.00",
    "title": "Industrial Machinery Mechanics",
    "codes": [
      "R",
      "C",
      "I"
    ]
  },
  "do-dac": {
    "soc": "17-1022.00",
    "title": "Surveyors",
    "codes": [
      "C",
      "R",
      "I"
    ]
  },
  "ban-do-dia-chinh": {
    "soc": "17-1021.00",
    "title": "Cartographers and Photogrammetrists",
    "codes": [
      "C",
      "I",
      "R"
    ]
  },
  "dau-khi": {
    "soc": "17-2171.00",
    "title": "Petroleum Engineers",
    "codes": [
      "R",
      "I",
      "C"
    ]
  },
  "hai-duong-hoc": {
    "soc": "19-2042.00",
    "title": "Geoscientists, Except Hydrologists and Geographers",
    "codes": [
      "I",
      "R",
      "C"
    ]
  },
  "dien-dien-tu": {
    "soc": "17-2071.00",
    "title": "Electrical Engineers",
    "codes": [
      "R",
      "I",
      "C"
    ]
  },
  "quan-ly-cong-nghiep": {
    "soc": "11-3051.00",
    "title": "Industrial Production Managers",
    "codes": [
      "E",
      "C",
      "R"
    ]
  },
  "cong-nghe-thong-tin": {
    "soc": "15-1252.00",
    "title": "Software Developers",
    "codes": [
      "I",
      "C"
    ]
  },
  "quan-tri-mang": {
    "soc": "15-1244.00",
    "title": "Network and Computer Systems Administrators",
    "codes": [
      "C",
      "R",
      "I"
    ]
  },
  "moi-truong": {
    "soc": "19-2041.00",
    "title": "Environmental Scientists and Specialists, Including Health",
    "codes": [
      "I",
      "R",
      "C"
    ]
  },
  "nong-hoc": {
    "soc": "19-1013.00",
    "title": "Soil and Plant Scientists",
    "codes": [
      "I",
      "R"
    ]
  },
  "thu-y": {
    "soc": "29-1131.00",
    "title": "Veterinarians",
    "codes": [
      "I",
      "R"
    ]
  },
  "nghien-cuu-toan": {
    "soc": "15-2021.00",
    "title": "Mathematicians",
    "codes": [
      "I",
      "C"
    ]
  },
  "nghien-cuu-vat-ly": {
    "soc": "19-2012.00",
    "title": "Physicists",
    "codes": [
      "I",
      "R",
      "C"
    ]
  },
  "nghien-cuu-hoa-hoc": {
    "soc": "19-2031.00",
    "title": "Chemists",
    "codes": [
      "I",
      "R",
      "C"
    ]
  },
  "nghien-cuu-sinh-hoc": {
    "soc": "19-1029.04",
    "title": "Biologists",
    "codes": [
      "I",
      "C",
      "R"
    ]
  },
  "dia-ly": {
    "soc": "19-3092.00",
    "title": "Geographers",
    "codes": [
      "I",
      "R"
    ]
  },
  "thong-ke": {
    "soc": "15-2041.00",
    "title": "Statisticians",
    "codes": [
      "I",
      "C"
    ]
  },
  "nhan-hoc": {
    "soc": "19-3091.00",
    "title": "Anthropologists and Archeologists",
    "codes": [
      "I",
      "A"
    ]
  },
  "tam-ly-hoc": {
    "soc": "19-3033.00",
    "title": "Clinical and Counseling Psychologists",
    "codes": [
      "S",
      "I"
    ]
  },
  "su-hoc": {
    "soc": "19-3093.00",
    "title": "Historians",
    "codes": [
      "I",
      "C"
    ]
  },
  "bac-si": {
    "soc": "29-1215.00",
    "title": "Family Medicine Physicians",
    "codes": [
      "S",
      "I"
    ]
  },
  "y-si": {
    "soc": "29-1071.00",
    "title": "Physician Assistants",
    "codes": [
      "S",
      "I",
      "C"
    ]
  },
  "dieu-duong": {
    "soc": "29-1141.00",
    "title": "Registered Nurses",
    "codes": [
      "S",
      "C",
      "I"
    ]
  },
  "nha-si": {
    "soc": "29-1021.00",
    "title": "Dentists, General",
    "codes": [
      "I",
      "R",
      "S"
    ]
  },
  "duoc-si": {
    "soc": "29-1051.00",
    "title": "Pharmacists",
    "codes": [
      "I",
      "S",
      "C"
    ]
  },
  "ky-thuat-lam-sang": {
    "soc": "29-2011.00",
    "title": "Medical and Clinical Laboratory Technologists",
    "codes": [
      "I",
      "R",
      "C"
    ]
  },
  "van-hoc": {
    "soc": "27-3043.00",
    "title": "Writers and Authors",
    "codes": [
      "A",
      "E"
    ]
  },
  "binh-luan-vien": {
    "soc": "27-3023.00",
    "title": "News Analysts, Reporters, and Journalists",
    "codes": [
      "A",
      "I",
      "E"
    ]
  },
  "dan-chuong-trinh": {
    "soc": "27-3011.00",
    "title": "Broadcast Announcers and Radio Disc Jockeys",
    "codes": [
      "A",
      "E",
      "S"
    ]
  },
  "bien-tap-vien": {
    "soc": "27-3041.00",
    "title": "Editors",
    "codes": [
      "A",
      "C",
      "E"
    ]
  },
  "to-chuc-su-kien": {
    "soc": "13-1121.00",
    "title": "Meeting, Convention, and Event Planners",
    "codes": [
      "E",
      "C",
      "S"
    ]
  },
  "quan-he-cong-chung": {
    "soc": "27-3031.00",
    "title": "Public Relations Specialists",
    "codes": [
      "E",
      "A",
      "S"
    ]
  },
  "quang-cao": {
    "soc": "11-2011.00",
    "title": "Advertising and Promotions Managers",
    "codes": [
      "E",
      "C",
      "A"
    ]
  },
  "dien-vien": {
    "soc": "27-2011.00",
    "title": "Actors",
    "codes": [
      "A",
      "S",
      "E"
    ]
  },
  "dao-dien": {
    "soc": "27-2012.00",
    "title": "Producers and Directors",
    "codes": [
      "A",
      "E"
    ]
  },
  "dung-phim": {
    "soc": "27-4032.00",
    "title": "Film and Video Editors",
    "codes": [
      "A",
      "C"
    ]
  },
  "ca-si": {
    "soc": "27-2042.00",
    "title": "Musicians and Singers",
    "codes": [
      "A",
      "E"
    ]
  },
  "nghe-si-mua": {
    "soc": "27-2031.00",
    "title": "Dancers",
    "codes": [
      "A",
      "R",
      "S"
    ]
  },
  "my-thuat": {
    "soc": "27-1013.00",
    "title": "Fine Artists, Including Painters, Sculptors, and Illustrators",
    "codes": [
      "A",
      "R"
    ]
  },
  "hoi-hoa": {
    "soc": "27-1013.00",
    "title": "Fine Artists, Including Painters, Sculptors, and Illustrators",
    "codes": [
      "A",
      "R"
    ]
  },
  "thiet-ke": {
    "soc": "27-1024.00",
    "title": "Graphic Designers",
    "codes": [
      "A",
      "C"
    ]
  },
  "thoi-trang": {
    "soc": "27-1022.00",
    "title": "Fashion Designers",
    "codes": [
      "A",
      "R",
      "E"
    ]
  },
  "gv-lich-su-anh-van": {
    "soc": "25-2031.00",
    "title": "Secondary School Teachers, Except Special and Career/Technical Education",
    "codes": [
      "S"
    ]
  },
  "giao-vien": {
    "soc": "25-2022.00",
    "title": "Middle School Teachers, Except Special and Career/Technical Education",
    "codes": [
      "S",
      "A"
    ]
  },
  "huong-dan-vien": {
    "soc": "39-7012.00",
    "title": "Travel Guides",
    "codes": [
      "S",
      "E",
      "C"
    ]
  },
  "tu-van-tam-ly": {
    "soc": "21-1014.00",
    "title": "Mental Health Counselors",
    "codes": [
      "S",
      "I"
    ]
  },
  "tri-lieu-tam-ly": {
    "soc": "19-3033.00",
    "title": "Clinical and Counseling Psychologists",
    "codes": [
      "S",
      "I"
    ]
  },
  "tu-van-huong-nghiep": {
    "soc": "21-1012.00",
    "title": "Educational, Guidance, and Career Counselors and Advisors",
    "codes": [
      "S",
      "C",
      "E"
    ]
  },
  "cong-tac-xa-hoi": {
    "soc": "21-1021.00",
    "title": "Child, Family, and School Social Workers",
    "codes": [
      "S"
    ]
  },
  "nv-xa-hoi-hoc": {
    "soc": "19-3041.00",
    "title": "Sociologists",
    "codes": [
      "I",
      "S",
      "A"
    ]
  },
  "suc-khoe-cong-dong": {
    "soc": "21-1094.00",
    "title": "Community Health Workers",
    "codes": [
      "S"
    ]
  },
  "chuyen-gia-dinh-duong": {
    "soc": "29-1031.00",
    "title": "Dietitians and Nutritionists",
    "codes": [
      "S",
      "I"
    ]
  },
  "tham-dinh-gia": {
    "soc": "13-2023.00",
    "title": "Appraisers and Assessors of Real Estate",
    "codes": [
      "C",
      "E"
    ]
  },
  "nhan-su": {
    "soc": "13-1071.00",
    "title": "Human Resources Specialists",
    "codes": [
      "E",
      "C",
      "S"
    ]
  },
  "canh-sat": {
    "soc": "33-3051.00",
    "title": "Police and Sheriff's Patrol Officers",
    "codes": [
      "R",
      "C",
      "E"
    ]
  },
  "quan-tri-kinh-doanh": {
    "soc": "11-1021.00",
    "title": "General and Operations Managers",
    "codes": [
      "E",
      "C"
    ]
  },
  "marketing": {
    "soc": "11-2021.00",
    "title": "Marketing Managers",
    "codes": [
      "E",
      "C"
    ]
  },
  "nhan-vien-sales": {
    "soc": "41-2031.00",
    "title": "Retail Salespersons",
    "codes": [
      "E",
      "C"
    ]
  },
  "ke-toan-tai-chinh": {
    "soc": "11-3031.00",
    "title": "Financial Managers",
    "codes": [
      "E",
      "C"
    ]
  },
  "tai-chinh-ngan-hang": {
    "soc": "13-2072.00",
    "title": "Loan Officers",
    "codes": [
      "C",
      "E",
      "S"
    ]
  },
  "luat-su": {
    "soc": "23-1011.00",
    "title": "Lawyers",
    "codes": [
      "E",
      "C",
      "I"
    ]
  },
  "dich-vu-khach-hang": {
    "soc": "43-4051.00",
    "title": "Customer Service Representatives",
    "codes": [
      "C",
      "E",
      "S"
    ]
  },
  "tiep-vien-hang-khong": {
    "soc": "53-2031.00",
    "title": "Flight Attendants",
    "codes": [
      "C",
      "S",
      "R"
    ]
  },
  "pha-che": {
    "soc": "35-3011.00",
    "title": "Bartenders",
    "codes": [
      "R",
      "C",
      "E"
    ]
  },
  "quy-hoach-do-thi": {
    "soc": "19-3051.00",
    "title": "Urban and Regional Planners",
    "codes": [
      "I",
      "E",
      "C"
    ]
  },
  "chuoi-cung-ung": {
    "soc": "13-1081.00",
    "title": "Logisticians",
    "codes": [
      "C",
      "E",
      "I"
    ]
  },
  "quan-ly-hanh-chinh": {
    "soc": "11-3012.00",
    "title": "Administrative Services Managers",
    "codes": [
      "E",
      "C",
      "S"
    ]
  },
  "thanh-tra-nganh": {
    "soc": "13-1041.00",
    "title": "Compliance Officers",
    "codes": [
      "C",
      "E"
    ]
  },
  "ke-toan": {
    "soc": "13-2011.00",
    "title": "Accountants and Auditors",
    "codes": [
      "C",
      "E",
      "I"
    ]
  },
  "kiem-toan": {
    "soc": "13-2011.00",
    "title": "Accountants and Auditors",
    "codes": [
      "C",
      "E",
      "I"
    ]
  }
};
