import React from "react";
import { ArrowRight } from "lucide-react";
import { NavSection } from "../types";
import { STUDY_ITEMS } from "./Navigation";
import { FunIcon, TONES } from "./FunIcon";

// Khu "Học tập thông minh": lối vào các chức năng học tập có sẵn
export const StudyHubView: React.FC<{ onNavigate: (s: NavSection) => void }> = ({ onNavigate }) => (
  <div className="space-y-4 pb-6">
    <div className="flex items-center gap-3">
      <FunIcon emoji="🎒" tone="lilac" size="md" />
      <div>
        <h2 className="text-2xl font-black text-navy tracking-tight">Học tập thông minh</h2>
        <p className="text-sm text-muted">Sách giáo khoa, bản đồ chinh phục, gia sư AI, kế hoạch học tập và video ở cùng một chỗ.</p>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {STUDY_ITEMS.map((item, i) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`menu-tile rise-${Math.min(i + 1, 4)} group text-left p-3.5 rounded-[24px] bg-white flex items-center gap-4 cursor-pointer`}
          style={{ ["--edge" as string]: TONES[item.tone].edge }}
        >
          <FunIcon emoji={item.emoji} tone={item.tone} size="lg" className="group-hover:-rotate-6 transition" />
          <span className="flex-1 min-w-0">
            <span className="block font-black text-navy">{item.label}</span>
            <span className="block text-sm text-muted">{item.desc}</span>
          </span>
          <ArrowRight className="w-4 h-4 text-ocean opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
        </button>
      ))}
    </div>
  </div>
);
