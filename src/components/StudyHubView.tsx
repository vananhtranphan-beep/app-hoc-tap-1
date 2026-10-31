import React from "react";
import { ArrowRight } from "lucide-react";
import { NavSection } from "../types";
import { STUDY_ITEMS } from "./Navigation";

// Khu "Học tập thông minh": lối vào các chức năng học tập có sẵn
export const StudyHubView: React.FC<{ onNavigate: (s: NavSection) => void }> = ({ onNavigate }) => (
  <div className="space-y-5 pb-6">
    <div>
      <h2 className="text-2xl font-extrabold text-navy tracking-tight">Học tập thông minh</h2>
      <p className="text-sm text-muted mt-1">Sách giáo khoa, bản đồ chinh phục, gia sư AI, kế hoạch học tập và video ở cùng một chỗ.</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {STUDY_ITEMS.map((item, i) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`lift rise-${Math.min(i + 1, 4)} group text-left p-4 rounded-2xl bg-white border border-sky-line hover:border-ocean flex items-center gap-4 cursor-pointer`}
          >
            <span className="w-12 h-12 rounded-xl bg-sky-soft text-navy flex items-center justify-center shrink-0 group-hover:bg-ocean group-hover:text-white transition">
              <Icon className="w-6 h-6" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block font-bold text-navy">{item.label}</span>
              <span className="block text-sm text-muted">{item.desc}</span>
            </span>
            <ArrowRight className="w-4 h-4 text-ocean opacity-0 group-hover:opacity-100 transition" />
          </button>
        );
      })}
    </div>
  </div>
);
