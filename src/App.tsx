import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Navigation, STUDY_SECTIONS } from "./components/Navigation";
import { Dashboard } from "./components/Dashboard";
import { SubjectsView } from "./components/SubjectsView";
import { AITutorView } from "./components/AITutorView";
import { StudyPlanView } from "./components/StudyPlanView";
import { KnowledgeQuest } from "./components/quest/KnowledgeQuest";
import { MoodTrackerView } from "./components/MoodTrackerView";
import { CareerGuidanceView } from "./components/CareerGuidanceView";
import { VideoHubView } from "./components/VideoHubView";
import { StudyHubView } from "./components/StudyHubView";
import { PrivacyView } from "./components/PrivacyView";
import { StudentProfileModal } from "./components/StudentProfileModal";
import { AuthScreen } from "./components/AuthScreen";
import { CompassLogo } from "./components/CompassLogo";
import { NavSection, StudentProfile } from "./types";
import { ArrowLeft } from "lucide-react";
import { cloud, CloudStatus } from "./lib/cloud";
import { GUEST_ID, generateNickname, randomAvatar, needsCleanup, publicProfile, sanitizeProfile } from "./lib/profile";

const ACCOUNTS_KEY = "ai_study_hub_accounts_list";

// Màu nền nhận diện riêng của từng phân hệ (các phân hệ khác sẽ thêm ở đợt sau)
const MODULE_BG: Partial<Record<NavSection, string>> = {
  career: "bg-clay-bg",
  mood: "bg-sun-bg",
  study: "bg-sky-bg",
  subjects: "bg-sky-bg",
  quest: "bg-sky-bg",
  ai_tutor: "bg-sky-bg",
  planner: "bg-sky-bg",
  videos: "bg-sky-bg",
};
const ACTIVE_KEY = "ai_study_hub_active_user_id";

const safeGet = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const safeSet = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v);
  } catch {}
};

// Tài khoản trên máy: đọc lại và làm sạch (bỏ họ tên, ngày sinh, trường của bản cũ; bỏ tài khoản mẫu)
function loadAccounts(): StudentProfile[] {
  try {
    const parsed = JSON.parse(safeGet(ACCOUNTS_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((a: any) => a && typeof a.studentId === "string" && a.studentId.trim())
      .filter((a: any) => !(a.studentId === "minhanh2026" && a.password === "123")) // tài khoản mẫu cũ
      .map(sanitizeProfile);
  } catch {
    return [];
  }
}

export default function App() {
  const [currentSection, setCurrentSection] = useState<NavSection>("home");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState("");

  const [accounts, setAccounts] = useState<StudentProfile[]>(loadAccounts);
  const [activeUserId, setActiveUserId] = useState<string | null>(() => {
    const saved = safeGet(ACTIVE_KEY);
    return saved ? saved : null;
  });

  useEffect(() => safeSet(ACCOUNTS_KEY, JSON.stringify(accounts)), [accounts]);
  useEffect(() => safeSet(ACTIVE_KEY, activeUserId || ""), [activeUserId]);

  // ---------- Đồng bộ dữ liệu học tập lên máy chủ (không gồm dữ liệu cảm xúc) ----------
  const [cloudStatus, setCloudStatus] = useState<CloudStatus>(cloud.status());
  const [isSyncing, setIsSyncing] = useState(false);
  useEffect(() => cloud.subscribe(setCloudStatus), []);

  useEffect(() => {
    let cancelled = false;
    if (!activeUserId) {
      cloud.stopSync();
      return;
    }
    if (!cloud.hasSession(activeUserId)) {
      cloud.startSync(activeUserId); // chế độ khách hoặc tài khoản chỉ lưu trên máy
      return;
    }
    setIsSyncing(true);
    cloud.resume(activeUserId).finally(() => {
      if (cancelled) return;
      cloud.startSync(activeUserId);
      setIsSyncing(false);
    });
    return () => {
      cancelled = true;
    };
  }, [activeUserId]);

  // Bảng điểm đã bỏ: dọn dữ liệu điểm và số ngày vào web của bản cũ (bản thử, chưa có người dùng thật)
  useEffect(() => {
    if (!activeUserId || isSyncing) return;
    ["subject_records", "login_streak", "last_login_date"].forEach((k) => {
      try {
        if (localStorage.getItem(`user_${activeUserId}_${k}`) !== null) localStorage.removeItem(`user_${activeUserId}_${k}`);
      } catch {}
    });
  }, [activeUserId, isSyncing]);

  const activeProfile = accounts.find((a) => a.studentId === activeUserId) || null;

  const upsertAccount = (profile: StudentProfile) => {
    setAccounts((prev) => [...prev.filter((a) => a.studentId.toLowerCase() !== profile.studentId.toLowerCase()), profile]);
  };

  const enterApp = (studentId: string) => {
    setActiveUserId(studentId);
    setCurrentSection("home");
  };

  // Đăng nhập qua máy chủ. Mật khẩu KHÔNG được lưu trên máy.
  const handleLogin = async (studentId: string, pass: string): Promise<string> => {
    const local = accounts.find((a) => a.studentId.toLowerCase() === studentId.toLowerCase());
    const res = await cloud.login(studentId, pass);

    if (res.ok) {
      const merged = sanitizeProfile({ ...(local || {}), ...res.profile, password: undefined, isLoggedIn: true });
      upsertAccount(merged);
      // Tài khoản cũ chưa có biệt danh: lưu biệt danh mới lên máy chủ
      if (needsCleanup(res.profile)) cloud.saveProfile(merged.studentId, publicProfile(merged));
      enterApp(merged.studentId);
      return "";
    }
    if (res.reason === "wrong" || res.reason === "rate") return res.message;

    // Tài khoản cũ chỉ có trên máy này (tạo khi chưa có máy chủ): chuyển lên máy chủ rồi xóa mật khẩu khỏi máy
    if (res.reason === "not_found") {
      if (local?.password && local.password === pass) {
        const moved = await cloud.register(publicProfile(local), pass, true);
        if (moved.ok) upsertAccount({ ...local, password: undefined });
        enterApp(local.studentId);
        return "";
      }
      return 'Tên đăng nhập chưa có trên hệ thống. Bạn bấm "Tạo tài khoản" nhé!';
    }

    // Máy chủ chưa sẵn sàng: chỉ tài khoản cũ còn mật khẩu trên máy mới vào được
    if (local?.password && local.password === pass) {
      enterApp(local.studentId);
      return "";
    }
    return res.reason === "network"
      ? "Không kết nối được máy chủ. Bạn kiểm tra mạng, hoặc bấm “Dùng thử không cần tài khoản”."
      : "Máy chủ tài khoản chưa sẵn sàng. Bạn bấm “Dùng thử không cần tài khoản” nhé.";
  };

  const handleRegister = async (newProfile: StudentProfile, password: string): Promise<string> => {
    const res = await cloud.register(publicProfile(newProfile), password);
    if (!res.ok) {
      if (res.reason === "exists" || res.reason === "invalid") return res.message;
      if (res.reason === "network") return "Không kết nối được máy chủ. Bạn thử lại sau, hoặc dùng thử không cần tài khoản.";
      return "Máy chủ tài khoản chưa sẵn sàng. Bạn bấm “Dùng thử không cần tài khoản” nhé.";
    }
    upsertAccount(sanitizeProfile({ ...newProfile, ...res.profile }));
    enterApp(res.profile.studentId);
    return "";
  };

  const handleGuest = (grade: StudentProfile["grade"]) => {
    const existing = accounts.find((a) => a.studentId === GUEST_ID);
    upsertAccount(
      existing
        ? { ...existing, grade }
        : { studentId: GUEST_ID, nickname: generateNickname(), avatar: randomAvatar(), grade, isLoggedIn: true, isGuest: true }
    );
    enterApp(GUEST_ID);
  };

  // Xóa tài khoản khỏi máy này (kể cả dữ liệu cảm xúc trên máy). Tài khoản trên máy chủ vẫn còn.
  const handleDeleteAccount = (studentId: string) => {
    cloud.forgetOnDevice(studentId);
    setAccounts((prev) => prev.filter((a) => a.studentId !== studentId));
    if (activeUserId === studentId) setActiveUserId(null);
  };

  const handleLogout = async () => {
    setIsProfileOpen(false);
    if (activeUserId && cloud.hasSession(activeUserId)) {
      const done = await cloud.logout(activeUserId);
      if (
        !done &&
        !window.confirm("Chưa lưu được dữ liệu mới nhất lên máy chủ (có thể do mất mạng). Vẫn đăng xuất? Dữ liệu vẫn còn trên máy này.")
      ) {
        return;
      }
    }
    setActiveUserId(null);
  };

  const handleSaveProfile = (updated: StudentProfile) => {
    setAccounts((prev) => prev.map((a) => (a.studentId === updated.studentId ? updated : a)));
    if (!updated.isGuest) cloud.saveProfile(updated.studentId, publicProfile(updated));
  };

  if (!activeUserId || !activeProfile) {
    return (
      <AuthScreen accounts={accounts} onLogin={handleLogin} onRegister={handleRegister} onGuest={handleGuest} onDeleteAccount={handleDeleteAccount} />
    );
  }

  if (isSyncing) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-3 text-navy">
        <CompassLogo size={56} animate />
        <p className="text-sm font-semibold">Đang tải dữ liệu của bạn...</p>
      </div>
    );
  }

  const go = (sec: NavSection) => {
    setCurrentSection(sec);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isStudyPage = STUDY_SECTIONS.includes(currentSection);

  return (
    <div
      className={`min-h-screen font-sans text-ink flex flex-col antialiased selection:bg-teal selection:text-white transition-colors duration-300 ${MODULE_BG[currentSection] || "bg-cream"}`}
    >
      <Header
        cloudStatus={cloudStatus}
        profile={activeProfile}
        onOpenProfile={() => setIsProfileOpen(true)}
        onGoHome={() => go("home")}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto min-w-0">
        <Navigation currentSection={currentSection} onSelectSection={go} />

        <main className="flex-1 px-4 pt-4 lg:p-8 pb-bottom-nav min-w-0 overflow-x-hidden space-y-4">
          {currentSection !== "home" && (
            <button
              onClick={() => go(isStudyPage ? "study" : "home")}
              className="inline-flex items-center gap-2 min-h-10 px-3.5 rounded-xl bg-white border border-line hover:border-teal text-navy font-semibold text-sm transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-teal" />
              {isStudyPage ? "Học tập thông minh" : "Trang chủ"}
            </button>
          )}

          {currentSection === "home" && (
            <Dashboard
              onNavigate={go}
              onAskAI={(question) => {
                setPendingQuestion(question);
                go("ai_tutor");
              }}
              profile={activeProfile}
              isAdmin={!activeProfile.isGuest && activeProfile.studentId.toLowerCase() === "tranphanvananh"}
            />
          )}

          {currentSection === "study" && <StudyHubView onNavigate={go} />}
          {currentSection === "subjects" && <SubjectsView key={activeUserId} userId={activeUserId} />}
          {currentSection === "mood" && <MoodTrackerView key={activeUserId} userId={activeUserId} grade={activeProfile.grade} isGuest={activeProfile.isGuest} />}
          {currentSection === "ai_tutor" && (
            <AITutorView
              key={activeUserId}
              userId={activeUserId}
              grade={activeProfile.grade}
              initialQuestion={pendingQuestion}
              onInitialQuestionUsed={() => setPendingQuestion("")}
            />
          )}
          {currentSection === "planner" && <StudyPlanView key={activeUserId} userId={activeUserId} grade={activeProfile.grade} />}
          {currentSection === "quest" && (
            <KnowledgeQuest
              key={activeUserId}
              userId={activeUserId}
              grade={activeProfile.grade}
              onAskTutor={(q) => {
                setPendingQuestion(q);
                go("ai_tutor");
              }}
            />
          )}
          {currentSection === "career" && <CareerGuidanceView key={activeUserId} userId={activeUserId} grade={activeProfile.grade} />}
          {currentSection === "videos" && <VideoHubView key={activeUserId} userId={activeUserId} />}
          {currentSection === "privacy" && (
            <PrivacyView key={activeUserId} profile={activeProfile} onAccountRemoved={() => handleDeleteAccount(activeProfile.studentId)} />
          )}
        </main>
      </div>

      <StudentProfileModal
        key={activeUserId}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={activeProfile}
        onSaveProfile={handleSaveProfile}
        onLogout={handleLogout}
        onOpenPrivacy={() => {
          setIsProfileOpen(false);
          go("privacy");
        }}
      />
    </div>
  );
}
