import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

// AI hay viết công thức kiểu \[ ... \] và \( ... \).
// Thư viện hiển thị chỉ hiểu $$ ... $$ và $ ... $, nên đổi trước khi hiển thị.
export function normalizeMath(text: string): string {
  if (!text) return "";
  return text
    .replace(/\\\[([\s\S]*?)\\\]/g, (_m, inner: string) => `\n\n$$\n${inner.trim()}\n$$\n\n`)
    .replace(/\\\(([\s\S]*?)\\\)/g, (_m, inner: string) => `$${inner.trim()}$`);
}

interface MathMarkdownProps {
  children: string;
  /** "light": chữ tối trên nền sáng (mặc định) | "dark": chữ trắng trên nền màu đậm (tin nhắn của học sinh) */
  tone?: "light" | "dark";
  className?: string;
}

// Hiển thị chữ có định dạng (in đậm, gạch đầu dòng, bảng...) và công thức toán đẹp
export const MathMarkdown: React.FC<MathMarkdownProps> = ({ children, tone = "light", className = "" }) => (
  <div className={`md-content ${tone === "dark" ? "md-dark" : ""} ${className}`}>
    <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
      {normalizeMath(children)}
    </ReactMarkdown>
  </div>
);
