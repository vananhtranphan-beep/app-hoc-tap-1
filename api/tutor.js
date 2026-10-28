import Groq from "groq-sdk";

// ============================================================
// MODEL AI ĐANG DÙNG (của Groq)
// Khi Groq gỡ model này (web báo lỗi "model_not_found"),
// chỉ cần đổi tên model ở dòng dưới rồi Commit là xong.
// Xem model nào còn dùng được: https://console.groq.com/docs/deprecations
// ============================================================
const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

// Nhắc AI cách xử lý khi học sinh gặp nguy hiểm (áp dụng cho mọi chức năng)
const SAFETY_NOTE =
    " Nếu học sinh nhắc tới ý định làm hại bản thân, bị bạo lực, bị xâm hại hoặc đang gặp nguy hiểm: hãy trấn an nhẹ nhàng, khuyên em nói ngay với bố mẹ, giáo viên chủ nhiệm hoặc người lớn em tin tưởng, và gọi Tổng đài quốc gia bảo vệ trẻ em 111 (miễn phí, 24/7).";

// Quy định cách viết để web hiển thị đẹp (công thức toán, in đậm, gạch đầu dòng)
const FORMAT_NOTE =
    " Trình bày bằng Markdown: dùng **in đậm** cho ý chính, gạch đầu dòng hoặc đánh số cho các bước. " +
    "Viết MỌI công thức toán bằng LaTeX: công thức trong dòng đặt giữa $...$ (ví dụ $2x - 1 = 3$), công thức riêng một dòng đặt giữa $$...$$. " +
    "Không dùng \\( \\) hoặc \\[ \\]. Học sinh có thể gửi công thức LaTeX đặt giữa dấu $.";

// Chọn vai trò AI theo chức năng đang dùng
function tutorPersona(subject, grade) {
    const lop = grade ? `lớp ${grade}` : "THCS";
    const s = String(subject || "");
    if (/tâm lý|tâm sự/i.test(s)) {
        return `Bạn là chuyên gia tâm lý học đường ân cần, thấu cảm với học sinh ${lop}. Trả lời bằng tiếng Việt, ấm áp, ngắn gọn, xưng "thầy/cô" và gọi học sinh là "em".`;
    }
    if (/hướng nghiệp/i.test(s)) {
        return `Bạn là chuyên gia tư vấn hướng nghiệp cho học sinh THCS Việt Nam (${lop}). Trả lời bằng tiếng Việt, cụ thể, thực tế.`;
    }
    if (/đánh giá học tập/i.test(s)) {
        return `Bạn là gia sư AI phân tích kết quả học tập cho học sinh ${lop} Việt Nam. Trả lời bằng tiếng Việt, động viên và cụ thể.`;
    }
    return `Bạn là AI Tutor - gia sư ảo thân thiện, kiên nhẫn của học sinh ${lop} Việt Nam, đang dạy môn ${s || "Toán Học"}. ` +
        "Giải thích từng bước rõ ràng, ngắn gọn, dễ hiểu bằng tiếng Việt, bám sát chương trình giáo dục phổ thông 2018. " +
        "Với bài tập, hướng dẫn cách làm từng bước và nêu đáp số cuối cùng.";
}

// Gọi AI và lấy câu trả lời dạng chữ
async function askAI(groq, messages) {
    const options = {
        model: MODEL,
        messages,
        temperature: 0.7,
        max_completion_tokens: 4096,
    };
    // Model gpt-oss có bước "suy nghĩ" trước khi trả lời: để mức thấp cho nhanh
    if (MODEL.startsWith("openai/gpt-oss")) {
        options.reasoning_effort = "low";
    }

    const completion = await groq.chat.completions.create(options);
    let text = completion.choices?.[0]?.message?.content || "";
    text = text.replace(/<think>[\s\S]*?<\/think>/g, "").trim(); // bỏ phần suy nghĩ nếu model trả kèm
    return text || "Xin lỗi, AI chưa trả lời được. Em thử lại sau nhé!";
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { subject = "Toán Học", grade, messages = [], days, mood, stressLevel, description, logs, story } = req.body || {};
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
            // Chỉ lấy 12 tin nhắn gần nhất, mỗi tin tối đa 6000 ký tự
            const chatHistory = (Array.isArray(messages) ? messages : [])
                .slice(-12)
                .filter((m) => m && typeof m.content === "string" && m.content.trim())
                .map((m) => ({
                    role: m.role === "model" ? "assistant" : "user",
                    content: m.content.slice(0, 6000),
                }));
            if (chatHistory.length === 0) {
                return res.status(400).json({ error: "Chưa có câu hỏi nào được gửi." });
            }
            chatHistory.unshift({ role: "system", content: tutorPersona(subject, grade) + FORMAT_NOTE + SAFETY_NOTE });

            const reply = await askAI(groq, chatHistory);
            return res.status(200).json({ reply });
        }

        // Xử lý các request phân tích trả về JSON
        const textResult = await askAI(groq, [
            { role: "system", content: systemInstruction + (story ? FORMAT_NOTE : " Trả về kết quả hoàn toàn bằng định dạng JSON nếu được yêu cầu.") + SAFETY_NOTE },
            { role: "user", content: promptContent }
        ]);

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
