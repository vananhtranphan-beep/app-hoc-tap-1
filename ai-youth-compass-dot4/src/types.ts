export type NavSection =
  | "home"
  | "subjects"
  | "mood"
  | "ai_tutor"
  | "planner"
  | "progress"
  | "career"
  | "videos"
  | "study"
  | "privacy";

export interface CustomPdfBook {
  id: string;
  subjectId: string;
  grade: number;
  title: string;
  series?: string;
  coverUrl: string;
  pdfUrl: string;
  notes?: string;
}

export interface CustomVideoItem {
  id: string;
  subjectId: string;
  grade: number;
  title: string;
  youtubeUrl: string;
  youtubeId: string;
  instructor?: string;
  addedAt: string;
}

export interface SubjectItem {
  id: string;
  name: string;
  iconName: string;
  color: string;
  bgLight: string;
  borderHex: string;
  description: string;
  grades: number[];
  pdfBooks: CustomPdfBook[];
  sampleVideos: CustomVideoItem[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
}

export interface StudyTask {
  id: string;
  day: string;
  subjectFocus: string;
  timeBlock: string;
  tasks: string[];
  completed: boolean[];
}

// Hồ sơ ẩn danh: không có họ tên thật, ngày sinh, trường lớp
export interface StudentProfile {
  studentId: string; // Tên đăng nhập
  nickname: string; // Biệt danh do web tự tạo (em có thể đổi)
  grade: "6" | "7" | "8" | "9";
  avatar: string; // Biểu tượng (emoji), không dùng ảnh người thật
  isLoggedIn: boolean;
  isGuest?: boolean; // Chế độ khách: chỉ lưu trên máy này
  createdAt?: string;
  password?: string; // CHỈ còn ở tài khoản cũ tạo khi chưa có máy chủ, sẽ bị xóa khi chuyển lên máy chủ
}

export interface MoodLog {
  id: string;
  date: string; // YYYY-MM-DD
  time: string;
  mood: string; // "Vui vẻ" | "Bình thường" | "Căng thẳng" | "Mệt mỏi" | "Buồn rầu"
  emoji: string;
  stressLevel: number; // 1 to 10
  note: string;
  aiResponse?: string;
}

export interface EmotionTreeState {
  health: number; // 0 to 100
  status: "Lush" | "Healthy" | "SlightlyWilted" | "Wilted";
  treeLevel: number;
  lastCheckinDate: string;
  aiExplanation?: string;
}

export interface SemesterGrades {
  tx1: number | null;
  tx2: number | null;
  tx3: number | null;
  tx4: number | null;
  gk: number | null;
  ck: number | null;
}

export interface SubjectGradeRecord {
  subjectId: string;
  subjectName: string;
  hk1: SemesterGrades;
  hk2: SemesterGrades;
}

export interface CareerInputData {
  interests: string[];
  strengths: string[];
  favoriteSubjects: string[];
  targetHighSchoolType: string;
  notes: string;
}

export interface CareerResult {
  title: string;
  description: string;
  matchPercentage: number;
  subjectsNeeded: string[];
  recommendedHighSchoolPaths: string[];
  roadmap: string[];
}

