// ============================================================
// GẮN MÃ HOLLAND THEO O*NET CHO DANH SÁCH NGHỀ
//
// Cách chạy (cần Node.js, không cần cài thêm gì):
//   node scripts/them-ma-onet.mjs <file Interests của O*NET>
//
// <file Interests>: tải ở https://www.onetcenter.org/dictionary/30.2/excel/interests.html
//   - bản .txt (tab) của O*NET, hoặc
//   - mở Interests.xlsx bằng Excel rồi "Lưu thành" CSV UTF-8 (.csv)
//
// Script đọc:  scripts/nghe-onet.csv  (cặp ghép nghề Việt Nam ↔ mã nghề O*NET, do nhóm kiểm tra)
// Script tạo:  src/data/onetCodes.ts           (web dùng file này, không sửa tay)
//              scripts/bang-kiem-tra-onet.csv   (bảng để học sinh, giáo viên đối chiếu)
//
// Mã Holland của mỗi nghề lấy từ các dòng "Occupational Interest High-Point" (Scale ID = IH)
// của O*NET: 1.B.1.g = nhóm thứ nhất, 1.B.1.h = thứ hai, 1.B.1.i = thứ ba;
// giá trị 1–6 = R, I, A, S, E, C; 0 = không có.
// ============================================================
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const CODE = { 1: "R", 2: "I", 3: "A", 4: "S", 5: "E", 6: "C" };
const NAME = { R: "Kĩ thuật", I: "Nghiên cứu", A: "Nghệ thuật", S: "Xã hội", E: "Quản lí", C: "Nghiệp vụ" };
const SLOT = { "1.B.1.g": 0, "1.B.1.h": 1, "1.B.1.i": 2 };

// Đọc CSV/TSV đơn giản (có hỗ trợ dấu ngoặc kép)
function parseTable(text) {
  text = text.replace(/^﻿/, "");
  const firstLine = text.split(/\r?\n/, 1)[0];
  const sep = firstLine.includes("\t") ? "\t" : firstLine.includes(";") && !firstLine.includes(",") ? ";" : ",";
  const rows = [];
  let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') q = false;
      else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === sep) { row.push(cell); cell = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const header = rows.shift().map((h) => h.trim());
  return rows.filter((r) => r.some((c) => c.trim())).map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? "").trim()])));
}

const csvCell = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));

const input = process.argv[2];
if (!input || !fs.existsSync(input)) {
  console.error("Cần đường dẫn file Interests của O*NET. VD: node scripts/them-ma-onet.mjs Interests.txt");
  process.exit(1);
}

// 1. Đọc mã Holland của từng nghề O*NET
const onet = new Map(); // soc -> { title, codes: [] }
for (const r of parseTable(fs.readFileSync(input, "utf8"))) {
  const soc = r["O*NET-SOC Code"];
  if (!soc) continue;
  const o = onet.get(soc) || { title: r["Title"] || "", codes: [] };
  if (!o.title && r["Title"]) o.title = r["Title"];
  const slot = SLOT[r["Element ID"]];
  if (r["Scale ID"] === "IH" && slot !== undefined) {
    const v = Math.round(Number(String(r["Data Value"]).replace(",", ".")));
    if (CODE[v]) o.codes[slot] = CODE[v];
  }
  onet.set(soc, o);
}
if (!onet.size) {
  console.error('Không đọc được dữ liệu. File cần có các cột "O*NET-SOC Code", "Element ID", "Scale ID", "Data Value".');
  process.exit(1);
}

// 2. Ghép với danh sách nghề
const pairs = parseTable(fs.readFileSync(path.join(here, "nghe-onet.csv"), "utf8"));
const out = {};
const review = [["id", "ten_nghe", "nhom_van_lang", "soc_onet", "ten_nghe_onet", "ma_holland_onet", "nhom_chinh_onet_trung_van_lang", "ghi_chu"]];
let matched = 0, agree = 0, missing = [];
for (const p of pairs) {
  const soc = p.soc_onet;
  const o = soc ? onet.get(soc) : undefined;
  const codes = o ? o.codes.filter(Boolean) : [];
  if (soc && (!o || !codes.length)) missing.push(`${p.id} (${soc})`);
  let same = "";
  if (o && codes.length) {
    matched++;
    out[p.id] = { soc, title: o.title || soc, codes };
    same = p.nhom_van_lang.split(",").map((s) => s.trim()).includes(NAME[codes[0]]) ? "có" : "không";
    if (same === "có") agree++;
  }
  review.push([p.id, p.ten_nghe, p.nhom_van_lang, soc, o?.title || "", codes.map((c) => NAME[c]).join(" – "), same, p.ghi_chu || ""]);
}

// 3. Ghi file cho web
const version = path.basename(input);
const ts = `// ============================================================
// MÃ HOLLAND THEO O*NET CỦA TỪNG NGHỀ
// FILE NÀY ĐƯỢC TẠO TỰ ĐỘNG bằng: node scripts/them-ma-onet.mjs ${version}
// Không sửa tay. Muốn đổi cặp ghép nghề thì sửa scripts/nghe-onet.csv rồi chạy lại script.
// Nguồn: O*NET® Database (Interests), USDOL/ETA, giấy phép CC BY 4.0.
// ============================================================

export const ONET_VERSION = ${JSON.stringify(version)};
export const ONET_CODES: Record<string, { soc: string; title: string; codes: string[] }> = ${JSON.stringify(out, null, 2)};
`;
fs.writeFileSync(path.join(root, "src/data/onetCodes.ts"), ts, "utf8");
fs.writeFileSync(path.join(here, "bang-kiem-tra-onet.csv"), "﻿" + review.map((r) => r.map(csvCell).join(",")).join("\n") + "\n", "utf8");

console.log(`Đã đọc ${onet.size} nghề O*NET.`);
console.log(`Ghép được ${matched}/${pairs.length} nghề. Nhóm chính theo O*NET trùng với nhóm Văn Lang: ${agree}/${matched} (${matched ? Math.round((agree / matched) * 100) : 0}%).`);
if (missing.length) console.log(`Không tìm thấy trong file O*NET (cần sửa mã trong nghe-onet.csv): ${missing.join(", ")}`);
console.log("Đã ghi src/data/onetCodes.ts và scripts/bang-kiem-tra-onet.csv");
