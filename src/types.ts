export type NavSection =
  | "home"
  | "subjects"
  | "mood"
  | "ai_tutor"
  | "planner"
  | "progress"
  | "career"
  | "videos";

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

export interface StudentProfile {
  fullName: string;
  dob: string;
  grade: "6" | "7" | "8" | "9";
  avatar: string;
  studentId: string; // Login ID / Username
  password?: string; // Password
  schoolName?: string; // THCS School Name
  isLoggedIn: boolean;
  createdAt?: string;
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

