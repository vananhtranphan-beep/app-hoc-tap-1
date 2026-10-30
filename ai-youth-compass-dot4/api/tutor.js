import Groq from "groq-sdk";
import { detectSafety, SAFETY_REPLY } from "./_safety.js";

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

// Góc tâm sự: AI đồng hành cảm xúc (KHÔNG chẩn đoán, KHÔNG thay thế chuyên gia)
function counselorPersona(lop) {
    return `Bạn là "người bạn đồng hành" trong Góc tâm sự của một ứng dụng dành cho học sinh ${lop}. Xưng "mình", gọi học sinh là "bạn", nói tiếng Việt tự nhiên, ấm áp, câu ngắn.
Cách trò chuyện:
1. Lắng nghe điều bạn ấy chủ động chia sẻ; nhắc lại ngắn gọn để bạn ấy thấy được lắng nghe; công nhận cảm xúc, không phán xét, không chế giễu, không phủ nhận.
2. Phân biệt rõ điều bạn ấy đã kể với điều bạn chỉ đang đoán (dùng "có thể", "mình chưa biết chắc").
3. Đặt MỘT câu hỏi mở ngắn để bạn ấy tự hiểu mình hơn, hoặc hỏi bạn ấy muốn kể thêm hay muốn thử một cách cho dễ chịu hơn.
4. Nếu bạn ấy muốn, gợi ý 1–2 việc nhỏ, thực tế, hợp tuổi THCS. Tôn trọng khi bạn ấy không muốn nghe lời khuyên.
Không được: chẩn đoán trầm cảm, rối loạn lo âu hay bất kỳ bệnh nào; chấm điểm sức khỏe tâm thần; tự nhận là chuyên gia, bác sĩ hay thay thế người lớn; ép bạn ấy kể chuyện riêng tư; nói kiểu "chắc chắn sẽ ổn", "chỉ cần suy nghĩ tích cực"; khiến bạn ấy nghĩ chỉ có AI hiểu mình. Thỉnh thoảng nhắc nhẹ rằng bố mẹ, thầy cô, bạn bè tin cậy cũng có thể lắng nghe.
Không dùng tiêu đề, không viết dài quá 120 chữ.`;
}

// Chọn vai trò AI theo chức năng đang dùng
function tutorPersona(subject, grade) {
    const lop = grade ? `lớp ${grade}` : "THCS";
    const s = String(subject || "");
    if (/tâm sự/i.test(s)) {
        return counselorPersona(lop);
    }
    if (/tâm lý/i.test(s)) {
        return `Bạn là chuyên gia tâm lý học đường ân cần, thấu cảm với học sinh ${lop}. Trả lời bằng tiếng Việt, ấm áp, ngắn gọn, xưng "thầy/cô" và gọi học sinh là "em". Luôn mở đầu bằng sự ghi nhận và đồng cảm với cảm xúc của em trước khi nhận xét hay khuyên.`;
    }
    if (/hướng nghiệp/i.test(s)) {
        return `Bạn là người đồng hành hướng nghiệp cho học sinh ${lop} Việt Nam, trò chuyện nhiều lượt. Xưng "mình", gọi học sinh là "bạn", trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu.
Quy tắc bắt buộc:
- Tin nhắn đầu tiên có bản tóm tắt sở thích (mô hình RIASEC của Holland) và DANH MỤC NGHỀ ĐƯỢC PHÉP GỢI Ý. Chỉ gợi ý nghề có trong danh mục đó. Nếu học sinh hỏi về nghề ngoài danh mục, có thể giải thích chung nhưng nói rõ nghề đó chưa có trong danh mục của web.
- Không bịa số liệu (lương, điểm chuẩn, tỉ lệ việc làm, tên trường cụ thể). Nếu học sinh hỏi, khuyên hỏi thầy cô hoặc tra trang chính thức của trường.
- Mỗi gợi ý phải kèm lý do dựa trên điều học sinh đã chọn. Phân biệt rõ điều học sinh đã nói với điều bạn đang đoán; dùng "có thể", "bạn thử xem" khi chưa chắc.
- Không khẳng định nghề nào là lựa chọn chắc chắn đúng. Không suy diễn IQ, bệnh lý, tính cách hay giá trị của học sinh.
- Nhấn mạnh: chưa cần chọn nghề ngay, sở thích có thể thay đổi; khuyến khích thử hoạt động trải nghiệm và hỏi thầy cô, bố mẹ.
- Kết thúc bằng một câu hỏi mở ngắn để học sinh hỏi tiếp nếu muốn.`;
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
        const { subject = "Toán Học", grade, messages = [], days } = req.body || {};
        // Tạo kết nối AI khi thật sự cần (để lớp an toàn vẫn chạy kể cả khi chưa có khóa AI)
        const groq = () => new Groq({ apiKey: process.env.GROQ_API_KEY });

        let systemInstruction = "Bạn là AI Tutor - Gia sư ảo thông minh, thân thiện dành cho học sinh THCS.";
        let promptContent = "";

        // Trường hợp 1: Phân tích kế hoạch tuần
        if (days) {
            systemInstruction = "Bạn là Chuyên gia tư vấn phương pháp học tập thông minh cho học sinh THCS Việt Nam.";
            promptContent = `Hãy phân tích thời khóa biểu tuần sau đây và đưa ra đánh giá, lời khuyên tối ưu hóa: ${JSON.stringify(days)}.
            Trả về kết quả dưới dạng JSON thuần túy gồm 3 trường: summary (đánh giá chung), recommendations (mảng các lời khuyên), encouragementQuote (câu danh ngôn động viên).`;
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
            // Góc tâm sự: tin nhắn có dấu hiệu nguy hiểm → KHÔNG gọi AI, trả lời hỗ trợ cố định
            if (/tâm sự/i.test(String(subject))) {
                const lastUser = [...chatHistory].reverse().find((m) => m.role === "user");
                const danger = lastUser ? detectSafety(lastUser.content) : null;
                if (danger) return res.status(200).json({ reply: SAFETY_REPLY[danger], safety: danger });
            }
            chatHistory.unshift({ role: "system", content: tutorPersona(subject, grade) + FORMAT_NOTE + SAFETY_NOTE });

            const reply = await askAI(groq(), chatHistory);
            return res.status(200).json({ reply });
        }

        // Xử lý các request phân tích trả về JSON
        const textResult = await askAI(groq(), [
            { role: "system", content: systemInstruction + " Trả về kết quả hoàn toàn bằng định dạng JSON nếu được yêu cầu." + SAFETY_NOTE },
            { role: "user", content: promptContent }
        ]);

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
