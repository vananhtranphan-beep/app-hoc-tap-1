import Groq from "groq-sdk";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { subject = "Toán Học", messages = [] } = req.body;
        
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const systemInstruction = `Bạn là AI Tutor - Gia sư ảo thông minh, thân thiện, kiên nhẫn dành cho học sinh Việt Nam.
Môn học hiện tại: ${subject}.
Nhiệm vụ của bạn:
- Giải thích các khái niệm bài học, giải bài tập từng bước rõ ràng, dễ hiểu.
- Sử dụng ngôn ngữ gần gũi, truyền cảm hứng học tập cho học sinh (xưng "Thầy/Cô AI" hoặc "AI Tutor" và gọi "em").
- Trình bày dạng Markdown đẹp mắt, có công thức hoặc gạch đầu dòng rõ ràng.`;

        const chatHistory = messages.map((m) => ({
            role: m.role === "model" ? "assistant" : "user",
            content: m.content,
        }));

        chatHistory.unshift({ role: "system", content: systemInstruction });

        const chatCompletion = await groq.chat.completions.create({
            messages: chatHistory,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
        });

        return res.status(200).json({ reply: chatCompletion.choices[0].message.content });
        
    } catch (error) {
        console.error("Groq AI Error:", error);
        return res.status(500).json({ error: "Lỗi kết nối AI: " + error.message });
    }
}
