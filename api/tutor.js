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
Ưu tiên LẮNG NGHE và ĐỒNG CẢM trước, lời khuyên đến sau. Mỗi câu trả lời đi theo trình tự:
1. Nhận ra cảm xúc bạn ấy đang chia sẻ (buồn, tủi thân, lo, giận, mệt...) và gọi tên nó nhẹ nhàng.
2. Công nhận cảm xúc đó là dễ hiểu, không phán xét, không chế giễu, không phủ nhận ("không sao đâu", "chuyện nhỏ mà").
3. Phản ánh lại ngắn gọn điều bạn ấy đang trải qua để bạn ấy thấy được lắng nghe; phân biệt điều bạn ấy kể với điều bạn đoán ("có thể", "mình chưa biết chắc").
4. Nếu cần hiểu thêm, hỏi MỘT câu hỏi mở ngắn; cho bạn ấy biết có thể chỉ kể, chưa cần vội tìm cách giải quyết.
5. Chỉ đưa lời khuyên khi bạn ấy muốn hoặc khi thật phù hợp; khi đó gợi ý 1–2 lựa chọn nhỏ, thực tế, hợp tuổi THCS, để bạn ấy tự chọn, không áp đặt.
Ví dụ: Học sinh: "Hôm nay mình bị các bạn trong lớp bỏ rơi, mình thấy buồn lắm." → Trả lời tốt: "Nghe chuyện này chắc bạn đã cảm thấy rất tủi thân. Nhất là khi những người mình muốn được gần gũi lại khiến mình cảm thấy bị đứng ngoài. Bạn có muốn kể thêm chuyện gì đã xảy ra không? Mình có thể lắng nghe trước, chưa cần phải vội tìm cách giải quyết đâu."
Không được: trả lời sáo rỗng; ép suy nghĩ tích cực ("chỉ cần vui lên", "chắc chắn sẽ ổn"); chẩn đoán trầm cảm, rối loạn lo âu hay bất kỳ bệnh nào; chấm điểm sức khỏe tâm thần; tự nhận là chuyên gia, bác sĩ hay thay thế người lớn; ép bạn ấy kể chuyện riêng tư; khiến bạn ấy nghĩ chỉ có AI hiểu mình. Thỉnh thoảng nhắc nhẹ rằng bố mẹ, thầy cô, bạn bè tin cậy cũng có thể lắng nghe. Nếu có dấu hiệu tự làm hại bản thân, bạo lực hoặc bị xâm hại: khuyên bạn ấy tìm ngay người lớn tin cậy và gọi 111.
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
        return `Bạn là trợ lý hướng nghiệp AI cho học sinh ${lop} Việt Nam, trò chuyện tự nhiên nhiều lượt. Xưng "mình", gọi học sinh là "bạn", tiếng Việt thân thiện, dễ hiểu, ngắn gọn.
Cách trò chuyện:
- Trả lời MỌI câu hỏi về nghề nghiệp, ngành học, lĩnh vực công việc, sở thích, thế mạnh, con đường học tập, kể cả nghề KHÔNG có trong danh mục của web. Không ép học sinh quay lại danh sách nghề đã gợi ý. Liên hệ với điều học sinh đã chia sẻ trước đó khi phù hợp.
- Tin nhắn đầu có thể kèm tóm tắt kết quả khảo sát sở thích (mô hình RIASEC của Holland) và danh sách nghề web đã gợi ý. Khi gợi ý nghề cho học sinh, ưu tiên các nghề trong danh sách đó và nêu lý do dựa trên điều học sinh đã chọn; có thể gợi ý nghề khác nếu thật sự liên quan.
- Phân biệt rõ điều học sinh đã nói với điều bạn suy luận; dùng "có thể", "bạn thử xem" khi chưa chắc. Không khẳng định nghề nào là lựa chọn chắc chắn đúng. Không đánh giá nghề nào cao quý hơn nghề nào. Không suy diễn IQ, bệnh lý, tính cách hay giá trị của học sinh.
- Bạn KHÔNG truy cập được internet hay dữ liệu thị trường lao động hiện tại. Khi được hỏi về con số (mức lương, điểm chuẩn, tỉ lệ có việc làm, số người tuyển dụng) hoặc xu hướng ngành nghề năm nay: nói thật rằng bạn không truy cập được nguồn dữ liệu mới bên ngoài nên chưa đưa ra con số chính xác được, KHÔNG bịa hay ước đoán con số; sau đó gợi ý các câu bạn trả lời được (nghề đó làm gì, cần kỹ năng và môn học nào, học ngành gì, chuẩn bị gì từ bây giờ) và gợi ý hỏi thầy cô hoặc xem trang chính thức của trường, cơ quan lao động.
- Nhắc nhẹ khi phù hợp: chưa cần chọn nghề ngay, sở thích có thể thay đổi; nên thử hoạt động trải nghiệm và hỏi thêm thầy cô, bố mẹ.
- Trả lời khoảng 80–200 chữ, có thể kết thúc bằng một câu hỏi mở ngắn.`;
    }
    if (/đánh giá học tập/i.test(s)) {
        return `Bạn là gia sư AI phân tích kết quả học tập cho học sinh ${lop} Việt Nam. Trả lời bằng tiếng Việt, động viên và cụ thể.`;
    }
    return `Bạn là Gia sư AI thân thiện, kiên nhẫn của học sinh ${lop} Việt Nam, đang dạy môn ${s || "Toán Học"}, xưng "thầy/cô" và gọi học sinh là "em". ` +
        "Mục tiêu là giúp em HIỂU cách làm, không chỉ đưa đáp án: giải thích từng bước rõ ràng, ngắn gọn, dễ hiểu bằng tiếng Việt, bám sát chương trình GDPT 2018 và SGK lớp tương ứng. " +
        "Với bài tập: nêu kiến thức cần dùng, hướng dẫn từng bước, nêu đáp số cuối cùng và lỗi hay gặp. Khi em làm sai: chỉ ra chỗ sai một cách nhẹ nhàng, không chê bai. " +
        "Khi em xin câu luyện tập: cho câu tương tự, chưa cho đáp án cho tới khi em trả lời. Khi em cần ví dụ: dùng ví dụ gần gũi, trực quan. Không bịa công thức hay kiến thức; chưa chắc thì nói rõ.";
}

// Cho phép tạo câu hỏi + kiểm tra lại đáp án chạy tối đa 60 giây (gói miễn phí Vercel cho phép)
export const config = { maxDuration: 60 };

// Gọi AI và lấy câu trả lời dạng chữ
async function askAI(groq, messages, temperature = 0.7) {
    const options = {
        model: MODEL,
        messages,
        temperature,
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

// ============================================================
// BẢN ĐỒ CHINH PHỤC TRI THỨC: AI tạo câu hỏi trắc nghiệm theo chương SGK
// Bước 1: AI soạn câu hỏi (JSON). Bước 2: AI giải lại từng câu độc lập để kiểm tra đáp án.
// Câu nào đáp án không khớp hoặc sai cấu trúc thì bỏ. Không có câu nào đạt thì báo lỗi, KHÔNG tạo câu giả.
// ============================================================
const LEVEL_PLAN = {
    1: "mức DỄ: phần lớn câu nhận biết và thông hiểu, có 1 câu vận dụng đơn giản",
    2: "mức VỪA: có câu nhận biết, thông hiểu, vận dụng và 1 câu tình huống thực tế",
    3: "mức KHÓ: chủ yếu vận dụng, suy luận nhiều bước và tình huống thực tế",
};

// Sửa LaTeX trong JSON: "\frac" viết nhầm thành "\f" + "rac"... (dấu \ đứng trước từ 2 chữ cái trở lên là lệnh LaTeX)
function parseJsonLoose(text) {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start < 0 || end < 0) return null;
    const raw = text.slice(start, end + 1);
    const fixed = raw.replace(/(?<!\\)\\(?=[a-zA-Z]{2,})/g, "\\\\");
    for (const t of [fixed, raw]) {
        try {
            return JSON.parse(t);
        } catch {}
    }
    return null;
}

const clean = (v, max) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);

function validQuestions(list) {
    if (!Array.isArray(list)) return [];
    return list
        .map((q) => ({
            q: clean(q?.q ?? q?.question, 700),
            options: Array.isArray(q?.options) ? q.options.map((o) => clean(o, 250).replace(/^[A-D][.):]\s*/, "")) : [],
            answer: Number(q?.answer),
            explain: clean(q?.explain ?? q?.explanation, 900),
            kind: clean(q?.kind, 40),
        }))
        .filter((q) => q.q && q.options.length === 4 && q.options.every(Boolean) && new Set(q.options).size === 4 && Number.isInteger(q.answer) && q.answer >= 0 && q.answer <= 3 && q.explain);
}

async function makeQuiz(groq, body) {
    const lop = /^[6-9]$/.test(String(body.grade)) ? body.grade : "8";
    const level = [1, 2, 3].includes(Number(body.level)) ? Number(body.level) : 1;
    const count = Math.min(Math.max(Number(body.count) || 5, 1), 6);
    const chapter = clean(body.chapter, 160);
    const lessons = (Array.isArray(body.lessons) ? body.lessons : []).map((l) => clean(l, 140)).slice(0, 12);
    const avoid = (Array.isArray(body.avoid) ? body.avoid : []).map((a) => clean(a, 200)).slice(-25);
    const focus = (Array.isArray(body.focus) ? body.focus : []).map((a) => clean(a, 200)).slice(0, 5);
    if (!chapter) throw Object.assign(new Error("Thiếu tên chương."), { status: 400 });

    const spec = [
        `Soạn ${count} câu hỏi trắc nghiệm MÔN TOÁN LỚP ${lop} cho chương "${chapter}" (SGK Toán ${lop}, bộ Kết nối tri thức với cuộc sống, chương trình GDPT 2018).`,
        lessons.length ? `Chương gồm các bài: ${lessons.join("; ")}. Chỉ hỏi kiến thức trong các bài này, đúng phạm vi lớp ${lop}.` : "",
        `Độ khó: ${LEVEL_PLAN[level]}.`,
        count >= 4 ? "Bộ câu hỏi phải có đủ các loại: nhận biết, thông hiểu, vận dụng, suy luận hoặc tình huống thực tế." : "",
        focus.length ? `Học sinh vừa làm sai các câu sau; hãy tạo câu TƯƠNG TỰ nhưng DỄ HƠN để ôn lại đúng phần kiến thức đó: ${focus.join(" | ")}` : "",
        avoid.length ? `KHÔNG lặp lại hoặc chỉ đổi số liệu của các câu đã dùng: ${avoid.join(" | ")}` : "",
        "Yêu cầu: mỗi câu có đủ dữ kiện, có ĐÚNG 1 đáp án đúng trong 4 lựa chọn, các lựa chọn khác nhau và hợp lý. Tự giải lại từng câu trước khi trả lời. Không bịa kiến thức, công thức.",
        "Viết công thức bằng LaTeX đặt giữa $...$. Không xuống dòng trong chuỗi.",
        'Trả về DUY NHẤT một JSON: {"questions":[{"q":"câu hỏi","options":["lựa chọn A","lựa chọn B","lựa chọn C","lựa chọn D"],"answer":0,"explain":"lời giải ngắn từng bước","kind":"nhận biết|thông hiểu|vận dụng|suy luận"}]} với answer là số thứ tự (0–3) của đáp án đúng. Trong JSON, mọi dấu \\ của LaTeX phải viết thành \\\\ (ví dụ \\\\frac).',
    ].filter(Boolean).join("\n");

    const text = await askAI(groq, [
        { role: "system", content: "Bạn là giáo viên Toán THCS Việt Nam giỏi, soạn câu hỏi trắc nghiệm chính xác, rõ ràng, đúng chương trình. Chỉ trả về JSON." },
        { role: "user", content: spec },
    ], 0.8);
    let questions = validQuestions(parseJsonLoose(text)?.questions);
    if (!questions.length) throw new Error("AI chưa tạo được câu hỏi đúng định dạng.");

    // Bước 2: kiểm tra lại đáp án (AI giải độc lập, không biết đáp án đã chọn)
    let verified = false;
    try {
        const check = questions.map((q, i) => `Câu ${i + 1}: ${q.q}\nA. ${q.options[0]}\nB. ${q.options[1]}\nC. ${q.options[2]}\nD. ${q.options[3]}`).join("\n\n");
        const vText = await askAI(groq, [
            { role: "system", content: "Bạn là giáo viên Toán kiểm tra đề. Giải cẩn thận từng câu. Chỉ trả về JSON." },
            {
                role: "user",
                content: `Giải các câu trắc nghiệm sau. Với mỗi câu, cho biết số thứ tự (0–3) của đáp án đúng; nếu câu thiếu dữ kiện, có nhiều hơn một đáp án đúng hoặc không có đáp án đúng thì ghi -1.\n\n${check}\n\nTrả về JSON: {"answers":[...]} theo đúng thứ tự câu.`,
            },
        ], 0.1);
        const answers = parseJsonLoose(vText)?.answers;
        if (Array.isArray(answers) && answers.length === questions.length) {
            questions = questions.filter((q, i) => Number(answers[i]) === q.answer);
            verified = true;
        }
    } catch {}
    if (!questions.length) throw new Error("Các câu AI vừa tạo chưa qua được bước kiểm tra đáp án.");
    return { questions: questions.slice(0, count).map((q, i) => ({ id: `${Date.now().toString(36)}-${i}`, ...q })), verified };
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { subject = "Toán Học", grade, messages = [], days } = req.body || {};
        // Tạo kết nối AI khi thật sự cần (để lớp an toàn vẫn chạy kể cả khi chưa có khóa AI)
        const groq = () => new Groq({ apiKey: process.env.GROQ_API_KEY });

        // Bản đồ chinh phục: tạo câu hỏi trắc nghiệm
        if (req.body?.mode === "quiz") {
            try {
                return res.status(200).json(await makeQuiz(groq(), req.body));
            } catch (e) {
                return res.status(e.status || 500).json({ error: e.message || "AI chưa tạo được câu hỏi." });
            }
        }

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
