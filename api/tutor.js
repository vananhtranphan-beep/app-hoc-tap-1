import Groq from "groq-sdk";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { subject = "Toán Học", messages = [], days, mood, stressLevel, description, logs, story } = req.body;
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        let systemInstruction = "Bạn là AI Tutor - Gia sư ảo thông minh, thân thiện dành cho học sinh THCS.";
        let promptContent = "";

        // Trường hợp 1: Phân tích kế hoạch tuần
        if (days) {
            systemInstruction = "Bạn là Chuyên gia tư vấn phương pháp học tập thông minh cho học sinh THCS Việt Nam.";
            promptContent = `Hãy phân tích thời khóa biểu tuần sau đây và đưa ra đánh giá, lời khuyên tối ưu hóa: ${JSON.stringify(days)}. 
            Trả về kết quả dưới dạng JSON thuần túy gồm 3 trường: summary (đánh giá chung), recommendations (mảng các lời khuyên), encouragementQuote (câu danh ngôn động viên).`;
        } 
        // Trường hợp 2: Đánh giá tâm lý / Cảm xúc
        else if (mood || logs) {
            systemInstruction = "Bạn là Chuyên gia tâm lý học đường thân thiện, thấu cảm với học sinh cấp 2.";
            promptContent = `Học sinh check-in cảm xúc: ${mood}, mức độ áp lực hiện tại: ${stressLevel}/5. Ghi chú: ${description || "Không có"}. Dữ liệu các ngày qua: ${JSON.stringify(logs || [])}. 
            Hãy trả về JSON thuần túy gồm: psychologicalAssessment (đánh giá tâm lý) và carePlan (kế hoạch chăm sóc tinh thần).`;
        }
        // Trường hợp 3: Chat tư vấn tâm lý (Góc SOS)
        else if (story) {
            systemInstruction = "Bạn là Chuyên gia tư vấn tâm lý học đường ân cần, luôn lắng nghe và an ủi học sinh.";
            promptContent = `Học sinh tâm sự: "${story}". Hãy đưa ra lời khuyên nhẹ nhàng, ấm áp và chân thành nhất bằng tiếng Việt.`;
        }
        // Trường hợp 4: Chat gia sư thông thường (AI Tutor)
        else {
            const chatHistory = messages.map((m) => ({
                role: m.role === "model" ? "assistant" : "user",
                content: m.content,
            }));
            chatHistory.unshift({ role: "system", content: systemInstruction });
            
            const chatCompletion = await groq.chat.completions.create({
                messages: chatHistory,
                model: "llama-3.3-70b-versatile",
                temperature: 0.7,
                max_tokens: 1024,
            });
            return res.status(200).json({ reply: chatCompletion.choices[0].message.content });
        }

        // Xử lý các request phân tích trả về JSON
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemInstruction + " Trả về kết quả hoàn toàn bằng định dạng JSON nếu được yêu cầu." },
                { role: "user", content: promptContent }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
        });

        const textResult = completion.choices[0].message.content;
        
        if (story) {
            return res.status(200).json({ reply: textResult });
        }

        try {
            const jsonStart = textResult.indexOf('{');
            const jsonEnd = textResult.lastIndexOf('}');
            if (jsonStart !== -1 && jsonEnd !== -1) {
                const parsed = JSON.parse(textResult.substring(jsonStart, jsonEnd + 1));
                return res.status(200).json(parsed);
            }
        } catch (e) {}

        return res.status(200).json({
            summary: textResult,
            recommendations: ["Duy trì thời gian nghỉ ngơi hợp lý", "Cân đối giữa học tập và thể thao"],
            encouragementQuote: "Cố gắng lên, mọi thử thách sẽ giúp em trưởng thành hơn!",
            psychologicalAssessment: textResult,
            carePlan: "1. Thư giãn mỗi ngày.\n2. Ăn uống điều độ."
        });

    } catch (error) {
        console.error("Groq AI Error:", error);
        return res.status(500).json({ error: "Lỗi kết nối AI: " + error.message });
    }
}
