const { GoogleGenAI } = require("@google/genai");

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { subject = "Toán Học", messages = [] } = req.body;
        const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: "Chưa cấu hình GEMINI_API_KEY trong Environment Variables của Vercel!" });
        }

        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `Bạn là AI Tutor - Gia sư ảo thông minh chuyên hỗ trợ học sinh cấp 2 (THCS) môn ${subject}. Hãy giải thích chi tiết, thân thiện, dễ hiểu, từng bước một.`;

        const chatHistory = messages.map((m) => ({
            role: m.role === "model" ? "model" : "user",
            parts: [{ text: m.content }],
        }));

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: chatHistory,
            config: {
                systemInstruction: systemInstruction,
            }
        });

        return res.status(200).json({ reply: response.text });
    } catch (error) {
        console.error("Vercel AI Error:", error);
        return res.status(500).json({ error: error.message || "Lỗi gọi AI" });
    }
};