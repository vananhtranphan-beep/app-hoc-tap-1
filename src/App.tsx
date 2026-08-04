import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import { Dashboard } from "./components/Dashboard";
import { SubjectsView } from "./components/SubjectsView";
import { AITutorView } from "./components/AITutorView";
import { StudyPlanView } from "./components/StudyPlanView";
import { ProgressView } from "./components/ProgressView";
import { MoodTrackerView } from "./components/MoodTrackerView";
import { CareerGuidanceView } from "./components/CareerGuidanceView";
import { VideoHubView } from "./components/VideoHubView";
import { StudentProfileModal } from "./components/StudentProfileModal";
import { AuthScreen } from "./components/AuthScreen";
import { NavSection, StudentProfile } from "./types";
import { ArrowLeft } from "lucide-react";

const INITIAL_DEMO_ACCOUNT: StudentProfile = {
  fullName: "Trần Nguyễn Minh Anh",
  dob: "15/08/2012",
  grade: "8",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  studentId: "minhanh2026",
  password: "123",
  schoolName: "THCS Chu Văn An",
  isLoggedIn: true,
};

export default function App() {
  const [currentSection, setCurrentSection] = useState<NavSection>("home");
  const [streakCount, setStreakCount] = useState(7);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [accounts, setAccounts] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem("ai_study_hub_accounts_list");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { }
    }
    return [INITIAL_DEMO_ACCOUNT];
  });

  const [activeUserId, setActiveUserId] = useState<string | null>(() => {
    const saved = localStorage.getItem("ai_study_hub_active_user_id");
    if (saved !== null) return saved === "" ? null : saved;
    return INITIAL_DEMO_ACCOUNT.studentId;
  });

  useEffect(() => {
    localStorage.setItem("ai_study_hub_accounts_list", JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem("ai_study_hub_active_user_id", activeUserId || "");
  }, [activeUserId]);

  useEffect(() => {
    if (!activeUserId) return;
    const streakKey = `user_${activeUserId}_login_streak`;
    const lastDateKey = `user_${activeUserId}_last_login_date`;
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

    const savedLastDate = localStorage.getItem(lastDateKey);
    const savedStreakStr = localStorage.getItem(streakKey);
    let currentStreak = savedStreakStr ? parseInt(savedStreakStr, 10) : 1;
    if (isNaN(currentStreak) || currentStreak < 1) currentStreak = 1;

    if (!savedLastDate) {
      currentStreak = 1;
      localStorage.setItem(lastDateKey, todayStr);
      localStorage.setItem(streakKey, "1");
    } else if (savedLastDate === todayStr) {
      // Đã đăng nhập hôm nay
    } else if (savedLastDate === yesterdayStr) {
      currentStreak += 1;
      localStorage.setItem(lastDateKey, todayStr);
      localStorage.setItem(streakKey, String(currentStreak));
    } else {
      currentStreak = 1;
      localStorage.setItem(lastDateKey, todayStr);
      localStorage.setItem(streakKey, "1");
    }
    setStreakCount(currentStreak);
  }, [activeUserId]);

  const activeProfile = accounts.find((a) => a.studentId === activeUserId) || null;

  const handleLogin = (studentId: string, pass: string): boolean => {
    const found = accounts.find(
      (a) => a.studentId.toLowerCase() === studentId.toLowerCase() && (a.password === pass || !a.password)
    );
    if (found) {
      setActiveUserId(found.studentId);
      setCurrentSection("home");
      return true;
    }
    return false;
  };

  const handleRegister = (newProfile: StudentProfile) => {
    setAccounts((prev) => [...prev.filter((a) => a.studentId !== newProfile.studentId), newProfile]);
    setActiveUserId(newProfile.studentId);
    setCurrentSection("home");
  };

  const handleQuickSelectAccount = (studentId: string) => {
    const found = accounts.find((a) => a.studentId === studentId);
    if (found) {
      setActiveUserId(found.studentId);
      setCurrentSection("home");
    }
  };

  const handleDeleteAccount = (studentId: string) => {
    setAccounts((prev) => prev.filter((a) => a.studentId !== studentId));
    if (activeUserId === studentId) setActiveUserId(null);
  };

  const handleLogout = () => {
    setActiveUserId(null);
    setIsProfileOpen(false);
  };

  const handleSaveProfile = (updatedProfile: StudentProfile) => {
    setAccounts((prev) =>
      prev.map((a) => (a.studentId === updatedProfile.studentId ? updatedProfile : a))
    );
  };

  if (!activeUserId || !activeProfile) {
    return (
      <AuthScreen
        accounts={accounts}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onDeleteAccount={handleDeleteAccount}
        onQuickSelectAccount={handleQuickSelectAccount}
      />
    );
  }

  const goHome = () => {
    setCurrentSection("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      <Header
        streakCount={streakCount}
        profile={activeProfile}
        onOpenProfile={() => setIsProfileOpen(true)}
        onNavigateToMood={() => {
          setCurrentSection("mood");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto min-w-0">
        <Navigation
          currentSection={currentSection}
          onSelectSection={(sec) => {
            setCurrentSection(sec);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />

        <main className="flex-1 p-4 lg:p-8 min-w-0 overflow-x-hidden space-y-4">
          {/* Nút quay lại trang chủ chung cho mọi trang con */}
          {currentSection !== "home" && (
            <button
              onClick={goHome}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 text-indigo-600" />
              <span>⬅ Quay lại trang chủ</span>
            </button>
          )}

          {currentSection === "home" && (
            <Dashboard
              onNavigate={(sec) => setCurrentSection(sec)}
              streakCount={streakCount}
            />
          )}

          {currentSection === "subjects" && (
            <SubjectsView key={activeUserId} userId={activeUserId} />
          )}

          {currentSection === "mood" && (
            <MoodTrackerView key={activeUserId} userId= {activeUserId} />
          )}

          {currentSection === "ai_tutor" && <AITutorView />}

          {currentSection === "planner" && (
            <StudyPlanView key={activeUserId} userId={activeUserId} />
          )}

          {currentSection === "progress" && (
            <ProgressView key={activeUserId} userId={activeUserId} />
          )}

          {currentSection === "career" && <CareerGuidanceView />}

          {currentSection === "videos" && <VideoHubView />}
        </main>
      </div>

      <StudentProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={activeProfile}
        onSaveProfile={handleSaveProfile}
        onLogout={handleLogout}
        onSwitchAccount={() => {
          setActiveUserId(null);
          setIsProfileOpen(false);
        }}
      />
    </div>
  );
}
