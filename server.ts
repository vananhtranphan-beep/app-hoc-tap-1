import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing from environment variables.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", appName: "AI Study Hub" });
});

// 🤖 AI Tutor Endpoint
app.post("/api/ai/tutor", async (req, res) => {
  try {
    const { message, subject = "General", history = [] } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getGeminiClient();
    const systemInstruction = `Bạn là AI Tutor - Gia sư ảo thông minh, thân thiện, kiên nhẫn dành cho học sinh Việt Nam.
Môn học hiện tại: ${subject}.
Nhiệm vụ của bạn:
- Giải thích các khái niệm bài học, giải bài tập từng bước rõ ràng, dễ hiểu.
- Sử dụng ngôn ngữ gần gũi, truyền cảm hứng học tập cho học sinh (xưng "Thầy/Cô AI" hoặc "AI Tutor" và gọi "em").
- Trình bày dạng Markdown đẹp mắt, có công thức hoặc gạch đầu dòng rõ ràng.
- Nếu giải toán/khoa học, hãy chỉ ra các bước suy luận thay vì chỉ cho đáp án.`;

    const contents = [
      ...history.map((item: any) => ({
        role: item.role === "user" ? "user" : "model",
        parts: [{ text: item.content }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("AI Tutor Error:", error);
    res.status(500).json({ error: error.message || "Không thể kết nối tới AI Tutor" });
  }
});

// 📅 AI Study Plan Generator
app.post("/api/ai/plan", async (req, res) => {
  try {
    const { grade = "10", goals = "Đạt điểm giỏi các môn", availableHours = 3, weakSubjects = [] } = req.body;
    const ai = getGeminiClient();

    const prompt = `Lập kế hoạch học tập cá nhân hóa cho học sinh Lớp ${grade}.
Mục tiêu: ${goals}.
Thời gian học mỗi ngày: ${availableHours} giờ.
Môn học còn yếu cần tập trung: ${weakSubjects.join(", ") || "Chưa xác định"}.

Hãy lập một thời khóa biểu & kế hoạch học tập tuần trong định dạng JSON chuẩn.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Tóm tắt chiến lược học tập ngắn gọn" },
            dailySchedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING, description: "Thứ trong tuần (VD: Thứ Hai, Thứ Ba...)" },
                  subjectFocus: { type: Type.STRING, description: "Môn trọng tâm" },
                  tasks: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Các việc cần làm cụ thể",
                  },
                  timeBlock: { type: Type.STRING, description: "Khung thời gian gợi ý" },
                },
                required: ["day", "subjectFocus", "tasks", "timeBlock"],
              },
            },
            studyTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Lời khuyên giúp duy trì động lực",
            },
          },
          required: ["summary", "dailySchedule", "studyTips"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("AI Plan Error:", error);
    res.status(500).json({ error: error.message || "Lỗi tạo kế hoạch học tập" });
  }
});

// 😊 AI Mood & Mental Wellness Adviser for THCS Students
app.post("/api/ai/mood", async (req, res) => {
  try {
    const { mood = "Bình thường", description = "", stressLevel = 5, logs = [] } = req.body;
    const ai = getGeminiClient();

    let logsText = "";
    if (Array.isArray(logs) && logs.length > 0) {
      logsText = logs
        .map(
          (l: any, i: number) =>
            `[Log #${i + 1} - Ngày ${l.date} lúc ${l.time}]: Cảm xúc "${l.mood}" (${l.emoji}), Mức áp lực ${l.stressLevel}/10, Nhật ký: "${l.note || "Không có ghi chú"}"`
        )
        .join("\n");
    }

    const prompt = `Bạn là Chuyên gia Tư vấn Tâm lý Học đường Chuyên biệt cho Học sinh THCS (Trung học cơ sở, Lớp 6-9).
Phân tích nhật ký cảm xúc của học sinh:
- Check-in mới nhất: "${mood}", Căng thẳng: ${stressLevel}/10, Lời chia sẻ: "${description || "Em tự ghi nhận cảm xúc"}"
- Lịch sử các lần bấm cảm xúc trong ngày/tuần:
${logsText || "Chưa có thêm nhật ký trước đó."}

Hãy đóng vai người lắng nghe ấm áp, bao dung, không phán xét. Xuất ra phản hồi dạng JSON với các thông tin:
1. summary: Phân tích diễn biến tâm lý của học sinh qua các thời điểm bấm icon (Ví dụ: Buổi sáng lo lắng, buổi chiều vui vẻ hơn...).
2. advice: Lời khuyên nhẹ nhàng, giải tỏa áp lực thi cử / bài vở và cách ứng phó phù hợp lứa tuổi Cấp 2.
3. dominantMood: Trạng thái cảm xúc chủ đạo tổng hợp.
4. stressTrend: Đánh giá xu hướng căng thẳng (Giảm dần, Ổn định, hay Đang tăng nhẹ).
5. encouragement: Một thông điệp an ủi, ôm ấp tinh thần và tiếp thêm sức mạnh cho học sinh.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Phân tích diễn biến cảm xúc qua các thời điểm" },
            advice: { type: Type.STRING, description: "Lời khuyên tâm lý thấu hiểu" },
            dominantMood: { type: Type.STRING, description: "Cảm xúc chủ đạo" },
            stressTrend: { type: Type.STRING, description: "Xu hướng áp lực" },
            encouragement: { type: Type.STRING, description: "Lời an ủi truyền động lực" },
          },
          required: ["summary", "advice", "dominantMood", "stressTrend", "encouragement"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("AI Mood Error:", error);
    res.status(500).json({ error: error.message || "Lỗi tư vấn tâm lý" });
  }
});

// 💬 AI Counseling Story Chat ("Hãy kể câu chuyện hôm nay để chúng ta cùng chia sẻ nhé")
app.post("/api/ai/mood-chat", async (req, res) => {
  try {
    const { story = "", studentGrade = "8", studentName = "Học sinh THCS" } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = `Bạn là Chuyên gia Tư vấn Tâm lý Học đường cực kỳ ấm áp, tinh tế, bao dung và thấu hiểu dành cho học sinh THCS (Lớp 6 đến Lớp 9).
Học sinh tên là "${studentName}" (Lớp ${studentGrade}).
Nhiệm vụ của bạn: Lắng nghe câu chuyện tâm sự của học sinh, đồng cảm chân thành, đưa ra lời khuyên tâm lý khoa học, tháo gỡ lo âu/áp lực điểm số, thầy cô, bạn bè, gia đình.
Quy tắc:
- Xưng hô "Thầy/Cô AI" và gọi học sinh bằng "em" hoặc tên "${studentName}".
- Luôn giữ thái độ tôn trọng, không bao giờ chỉ trích hay coi nhẹ cảm xúc của lứa tuổi học sinh Cấp 2.
- Câu từ mộc mạc, gần gũi, giàu tình cảm.`;

    const prompt = `Học sinh tâm sự: "${story}"\n\nHãy phản hồi ngắn gọn (150-250 từ), vỗ về và cho em lời khuyên hữu ích nhất.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("AI Mood Chat Error:", error);
    res.status(500).json({ error: error.message || "Lỗi tư vấn tâm sự AI" });
  }
});

// 📅 AI Analyze Custom Weekly Schedule
app.post("/api/ai/plan-analyze", async (req, res) => {
  try {
    const { days = [], studentGrade = "8" } = req.body;
    const ai = getGeminiClient();

    const prompt = `Phân tích thời khóa biểu và kế hoạch học tập 8 ngày của học sinh Lớp ${studentGrade} THCS:
Lịch chi tiết:
${JSON.stringify(days, null, 2)}

Hãy xuất ra nhận xét JSON gồm:
1. summary: Đánh giá sự cân bằng giữa học tập và nghỉ ngơi.
2. recommendations: 3-4 lời khuyên cải thiện thời gian học tập & luyện đề thi Lớp 10.
3. encouragementQuote: Câu châm ngôn tiếp sức mạnh.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            encouragementQuote: { type: Type.STRING }
          },
          required: ["summary", "recommendations", "encouragementQuote"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("AI Plan Analyze Error:", error);
    res.status(500).json({ error: error.message || "Lỗi phân tích thời khóa biểu" });
  }
});

// 📈 AI Evaluate Student Academic Progress & Goal Setting
app.post("/api/ai/progress-evaluate", async (req, res) => {
  try {
    const { grades = [], targetTitle = "Học sinh Giỏi", targetScore = 8.5, streak = 7, studentGrade = "8" } = req.body;
    const ai = getGeminiClient();

    const prompt = `Đánh giá tiến độ học tập và điểm số nhập tay của học sinh Lớp ${studentGrade} THCS:
- Danh sách điểm các môn HK1 & HK2: ${JSON.stringify(grades, null, 2)}
- Danh hiệu mục tiêu đặt ra: ${targetTitle}
- Điểm trung bình mục tiêu: ${targetScore}
- Chuỗi ngày học liên tục: ${streak} ngày

Hãy xuất ra phản hồi JSON:
1. currentAvg: Điểm trung bình các môn hiện tại (tính chính xác).
2. assessment: Đánh giá tổng quan về học lực hiện tại so với mục tiêu.
3. weakSubjectAlerts: Danh sách các môn cần bứt phá gấp kèm cách khắc phục.
4. studyAdvice: Lời khuyên ôn thi & cải thiện điểm HK2/Vào 10.
5. encouragementQuote: Câu nói truyền cảm hứng ngọt ngào.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            currentAvg: { type: Type.NUMBER },
            assessment: { type: Type.STRING },
            weakSubjectAlerts: { type: Type.ARRAY, items: { type: Type.STRING } },
            studyAdvice: { type: Type.STRING },
            encouragementQuote: { type: Type.STRING }
          },
          required: ["currentAvg", "assessment", "weakSubjectAlerts", "studyAdvice", "encouragementQuote"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("AI Progress Evaluate Error:", error);
    res.status(500).json({ error: error.message || "Lỗi đánh giá tiến độ điểm số" });
  }
});

// 🎯 AI Career Guidance Endpoint
app.post("/api/ai/career", async (req, res) => {
  try {
    const { interests = "", strengths = "", favoriteSubjects = [] } = req.body;
    const ai = getGeminiClient();

    const prompt = `Tư vấn hướng nghiệp cho học sinh:
- Sở thích / đam mê: ${interests}
- Điểm mạnh kỹ năng: ${strengths}
- Môn học yêu thích: ${favoriteSubjects.join(", ") || "Toán, Tiếng Anh"}.

Hãy gợi ý các ngành nghề phù hợp, lộ trình rèn luyện kỹ năng và tổ hợp môn xét tuyển học bạ/thi ĐH tương ứng dưới định dạng JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedCareers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Tên ngành nghề" },
                  description: { type: Type.STRING, description: "Mô tả công việc" },
                  matchPercentage: { type: Type.NUMBER, description: "Phần trăm phù hợp (%)" },
                  subjectsNeeded: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Các môn học cần tập trung" },
                  roadmap: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lộ trình học tập & rèn luyện" },
                },
                required: ["title", "description", "matchPercentage", "subjectsNeeded", "roadmap"],
              },
            },
            generalAdvice: { type: Type.STRING, description: "Lời khuyên tổng quan về việc chọn ngành" },
          },
          required: ["recommendedCareers", "generalAdvice"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("AI Career Error:", error);
    res.status(500).json({ error: error.message || "Lỗi tư vấn hướng nghiệp" });
  }
});

// 📝 AI Quiz Generator
app.post("/api/ai/quiz", async (req, res) => {
  try {
    const { subject = "Toán", topic = "Tổng hợp", grade = "10", count = 5 } = req.body;
    const ai = getGeminiClient();

    const prompt = `Tạo bộ câu hỏi trắc nghiệm ${count} câu môn ${subject} (Lớp ${grade}), chủ đề "${topic}" theo chương trình giáo dục phổ thông Việt Nam. Format JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.NUMBER },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctIndex: { type: Type.NUMBER, description: "Index của đáp án đúng (0, 1, 2, 3)" },
                  explanation: { type: Type.STRING, description: "Lời giải chi tiết giải thích đáp án" },
                },
                required: ["id", "question", "options", "correctIndex", "explanation"],
              },
            },
          },
          required: ["title", "questions"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("AI Quiz Error:", error);
    res.status(500).json({ error: error.message || "Lỗi tạo câu hỏi trắc nghiệm" });
  }
});

// 📖 AI Reading Comprehension Practice
app.post("/api/ai/reading", async (req, res) => {
  try {
    const { grade = "10", topic = "Khoa học & Đời sống" } = req.body;
    const ai = getGeminiClient();

    const prompt = `Tạo một đoạn văn đọc hiểu bổ ích môn Ngữ Văn / Tiếng Anh dành cho lớp ${grade} với chủ đề "${topic}".
Bao gồm:
1. Văn bản đọc (đoạn văn 200-300 từ)
2. Từ vựng quan trọng & ngữ pháp
3. 3 câu hỏi kiểm tra đọc hiểu có gợi ý đáp án.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            passage: { type: Type.STRING, description: "Nội dung bài đọc" },
            vocabulary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  meaning: { type: Type.STRING },
                },
                required: ["word", "meaning"],
              },
            },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  q: { type: Type.STRING },
                  a: { type: Type.STRING },
                },
                required: ["q", "a"],
              },
            },
          },
          required: ["title", "passage", "vocabulary", "questions"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("AI Reading Error:", error);
    res.status(500).json({ error: error.message || "Lỗi tạo bài đọc hiểu" });
  }
});

// Start Express Server with Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
