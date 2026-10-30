import React, { useState } from "react";
import katex from "katex";
import { MathMarkdown } from "./MathMarkdown";

// ‸ = vị trí con trỏ sau khi chèn (ví dụ phân số: con trỏ nằm ở tử số)
const CURSOR = "‸";

type MathKey = { label: string; insert: string; title: string };

const GROUPS: { name: string; keys: MathKey[] }[] = [
  {
    name: "Cơ bản",
    keys: [
      { label: "\\frac{a}{b}", insert: "\\frac{‸}{}", title: "Phân số" },
      { label: "x^2", insert: "^{2}‸", title: "Bình phương" },
      { label: "x^3", insert: "^{3}‸", title: "Lập phương" },
      { label: "x^n", insert: "^{‸}", title: "Lũy thừa" },
      { label: "x_1", insert: "_{‸}", title: "Chỉ số dưới" },
      { label: "\\sqrt{x}", insert: "\\sqrt{‸}", title: "Căn bậc hai" },
      { label: "\\sqrt[3]{x}", insert: "\\sqrt[3]{‸}", title: "Căn bậc ba" },
      { label: "\\times", insert: "\\times ", title: "Dấu nhân" },
      { label: "\\div", insert: "\\div ", title: "Dấu chia" },
      { label: "\\pm", insert: "\\pm ", title: "Cộng trừ" },
      { label: "|x|", insert: "\\left|‸\\right|", title: "Giá trị tuyệt đối" },
      { label: "(\\,)", insert: "\\left(‸\\right)", title: "Dấu ngoặc" },
    ],
  },
  {
    name: "So sánh",
    keys: [
      { label: "=", insert: "= ", title: "Bằng" },
      { label: "\\neq", insert: "\\neq ", title: "Khác" },
      { label: "<", insert: "< ", title: "Nhỏ hơn" },
      { label: ">", insert: "> ", title: "Lớn hơn" },
      { label: "\\leq", insert: "\\leq ", title: "Nhỏ hơn hoặc bằng" },
      { label: "\\geq", insert: "\\geq ", title: "Lớn hơn hoặc bằng" },
      { label: "\\approx", insert: "\\approx ", title: "Xấp xỉ" },
      { label: "\\Rightarrow", insert: "\\Rightarrow ", title: "Suy ra" },
      { label: "\\Leftrightarrow", insert: "\\Leftrightarrow ", title: "Tương đương" },
    ],
  },
  {
    name: "Đại số",
    keys: [
      { label: "\\begin{cases}a\\\\b\\end{cases}", insert: "\\begin{cases} ‸ \\\\  \\end{cases}", title: "Hệ phương trình" },
      { label: "x_{1,2}", insert: "x_{1,2}", title: "Hai nghiệm" },
      { label: "\\Delta", insert: "\\Delta ", title: "Delta" },
      { label: "a\\%", insert: "\\%", title: "Phần trăm" },
      { label: "\\infty", insert: "\\infty ", title: "Vô cực" },
      { label: "\\overline{ab}", insert: "\\overline{‸}", title: "Số có gạch trên" },
      { label: "a:b", insert: ":", title: "Tỉ số" },
    ],
  },
  {
    name: "Hình học",
    keys: [
      { label: "\\pi", insert: "\\pi ", title: "Số pi" },
      { label: "30^\\circ", insert: "^{\\circ}", title: "Độ" },
      { label: "\\widehat{A}", insert: "\\widehat{‸}", title: "Góc" },
      { label: "\\triangle", insert: "\\triangle ", title: "Tam giác" },
      { label: "\\parallel", insert: "\\parallel ", title: "Song song" },
      { label: "\\perp", insert: "\\perp ", title: "Vuông góc" },
      { label: "\\backsim", insert: "\\backsim ", title: "Đồng dạng" },
      { label: "\\overline{AB}", insert: "\\overline{‸}", title: "Đoạn thẳng" },
    ],
  },
  {
    name: "Tập hợp",
    keys: [
      { label: "\\in", insert: "\\in ", title: "Thuộc" },
      { label: "\\notin", insert: "\\notin ", title: "Không thuộc" },
      { label: "\\subset", insert: "\\subset ", title: "Tập con" },
      { label: "\\cup", insert: "\\cup ", title: "Hợp" },
      { label: "\\cap", insert: "\\cap ", title: "Giao" },
      { label: "\\varnothing", insert: "\\varnothing ", title: "Tập rỗng" },
      { label: "\\{\\,\\}", insert: "\\{‸\\}", title: "Tập hợp" },
      { label: "\\mathbb{N}", insert: "\\mathbb{N}", title: "Số tự nhiên" },
      { label: "\\mathbb{Z}", insert: "\\mathbb{Z}", title: "Số nguyên" },
      { label: "\\mathbb{Q}", insert: "\\mathbb{Q}", title: "Số hữu tỉ" },
      { label: "\\mathbb{R}", insert: "\\mathbb{R}", title: "Số thực" },
    ],
  },
];

const labelCache: Record<string, string> = {};
const renderLabel = (tex: string) => {
  if (!labelCache[tex]) {
    labelCache[tex] = katex.renderToString(tex, { throwOnError: false });
  }
  return labelCache[tex];
};

// Đếm số dấu $ phía trước con trỏ: lẻ = con trỏ đang ở trong một công thức
const isInsideMath = (text: string, pos: number) => {
  let count = 0;
  for (let i = 0; i < pos; i++) {
    if (text[i] === "$" && text[i - 1] !== "\\") count++;
  }
  return count % 2 === 1;
};

interface MathKeyboardProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (value: string) => void;
}

export const MathKeyboard: React.FC<MathKeyboardProps> = ({ textareaRef, value, onChange }) => {
  const [groupIdx, setGroupIdx] = useState(0);

  const insertKey = (key: MathKey) => {
    const el = textareaRef.current;
    const start = el ? el.selectionStart : value.length;
    const end = el ? el.selectionEnd : value.length;
    const selected = value.slice(start, end);

    let snippet = key.insert.includes(CURSOR) ? key.insert : key.insert + CURSOR;
    // Đang bôi đen chữ (VD "x+1") rồi bấm căn => \sqrt{x+1}
    if (selected) snippet = snippet.replace(CURSOR, selected + CURSOR);
    // Chưa ở trong công thức thì tự bọc bằng $ ... $
    if (!isInsideMath(value, start)) snippet = `$${snippet}$`;

    const caret = start + snippet.indexOf(CURSOR);
    onChange(value.slice(0, start) + snippet.replace(CURSOR, "") + value.slice(end));

    requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      el.setSelectionRange(caret, caret);
    });
  };

  return (
    <div className="rounded-2xl bg-white border border-teal-soft shadow-sm p-2.5 space-y-2">
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-extrabold text-teal-deep shrink-0 pr-1">∑ Công thức:</span>
        {GROUPS.map((g, i) => (
          <button
            key={g.name}
            type="button"
            onClick={() => setGroupIdx(i)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition cursor-pointer ${
              i === groupIdx ? "bg-teal text-white shadow-sm" : "bg-mist/60 text-teal-deep hover:bg-mist"
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {GROUPS[groupIdx].keys.map((k) => (
          <button
            key={k.title}
            type="button"
            title={k.title}
            aria-label={k.title}
            onPointerDown={(e) => e.preventDefault()} // giữ con trỏ trong ô nhập
            onClick={() => insertKey(k)}
            className="math-key min-w-[2.75rem] h-10 px-2 rounded-xl bg-cream border border-line hover:bg-mist/60 hover:border-teal/50 active:scale-95 text-ink transition cursor-pointer flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: renderLabel(k.label) }}
          />
        ))}
      </div>

      {value.includes("$") ? (
        <div className="rounded-xl bg-mist/60 border border-line px-3 py-2">
          <div className="text-[10px] font-extrabold text-teal-deep mb-0.5">👀 Xem trước:</div>
          <MathMarkdown className="text-sm">{value}</MathMarkdown>
        </div>
      ) : (
        <p className="text-[10px] text-muted px-1">
          Bấm nút để chèn công thức vào chỗ con trỏ. Bôi đen chữ rồi bấm nút (VD: căn) để bọc chữ đó lại.
        </p>
      )}
    </div>
  );
};
