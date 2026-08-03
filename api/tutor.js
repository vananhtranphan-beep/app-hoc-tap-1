import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { subject = "Toán Học", messages = [] } = req.body;

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const systemInstruction = `Bạn là AI Tutor - Gia sư ảo thông minh, thân thiện, kiên nhẫn dành cho học sinh Việt Nam.
Môn học hiện tại: ${subject}.
Nhiệm vụ của bạn:
- Giải thích các khái niệm bài học, giải bài tập từng bước rõ ràng, dễ hiểu.
- Sử dụng ngôn ngữ gần gũi, truyền cảm hứng học tập cho học sinh (xưng "Thầy/Cô AI" hoặc "AI Tutor" và gọi "em").
- Trình bày dạng Markdown đẹp mắt, có công thức hoặc gạch đầu dòng rõ ràng.`;

        const chatHistory = messages.map((m) => ({
            role: m.role === "model" ? "model" : "user",
            parts: [{ text: m.content }],
        }));

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: chatHistory,
            config: {
                systemInstruction: systemInstruction,
            },
        });

        return res.status(200).json({ reply: response.text });
    } catch (error) {
        console.error("Vercel AI Error:", error);
        return res.status(500).json({ error: error.message || "Lỗi gọi AI" });
    }
}