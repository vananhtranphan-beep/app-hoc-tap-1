// ============================================================
// LỚP AN TOÀN phía máy chủ cho Góc tâm sự (kiểm tra lại sau trình duyệt).
// Danh sách này phải GIỐNG src/lib/safety.ts. File bắt đầu bằng _ nên Vercel không coi là API riêng.
// ============================================================

const SAFETY_PATTERNS = {
    "tu-hai": [
        "muon chet", "khong muon song", "chan song", "tu sat", "ket thuc cuoc doi", "ket lieu", "tu lam hai", "tu hai ban than",
        "rach tay", "cat tay", "cat co tay", "nhay lau", "nhay cau", "uong thuoc ngu", "khong con ly do de song", "bien mat mai mai", "chet di cho xong", "song lam gi nua",
    ],
    "bao-luc": ["bi danh", "danh em", "danh con", "danh minh", "danh dap", "bao luc", "bi dam", "doa giet", "bi danh hoi dong", "bi danh dap"],
    "xam-hai": ["xam hai", "sam so", "so vao nguoi", "so vao vung kin", "so mo", "ep lam chuyen", "quay roi", "hiep dam", "chup anh khoa than", "gui anh nong", "bat coi do"],
    "bat-nat": ["bat nat", "bi co lap", "bi tay chay", "ca lop chui", "bi chui", "bi che gieu", "bi de doa", "bi tong tien"],
};

const NOT_VIOLENCE = / danh (gia|dau|thuc|truot|roi|cap|may|so|rang|co|dan|bong|vong|mat|lua|chen|bai|van|trong|gian) /g;

const normalizeVi = (text) =>
    ` ${text} `.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, " ");

export function detectSafety(text) {
    const raw = ` ${String(text || "").toLowerCase()} `;
    if (/tự tử|tự vẫn/.test(raw)) return "tu-hai";
    const t = normalizeVi(text).replace(NOT_VIOLENCE, " _ ");
    const typedNoAccent = raw.normalize("NFD").replace(/[̀-ͯ]/g, "") === raw.normalize("NFD") && !/đ/.test(raw);
    if (typedNoAccent && / tu tu /.test(t)) return "tu-hai";
    for (const cat of ["tu-hai", "xam-hai", "bao-luc", "bat-nat"]) {
        if (SAFETY_PATTERNS[cat].some((p) => t.includes(` ${p} `))) return cat;
    }
    return null;
}

export const SAFETY_REPLY = {
    "tu-hai":
        "Cảm ơn bạn đã tin tưởng kể ra điều này. Mình rất lo cho bạn. Bạn không phải một mình trải qua chuyện này. Ngay bây giờ, bạn hãy nói với một người lớn bạn tin (bố mẹ, thầy cô, người thân) hoặc gọi số bên dưới. Nếu bạn đang ở nơi nguy hiểm, hãy rời khỏi đó và tìm người ở gần.",
    "xam-hai":
        "Điều bạn kể là rất nghiêm trọng, và đó KHÔNG phải lỗi của bạn. Bạn có quyền được an toàn. Hãy kể ngay với một người lớn bạn tin, hoặc gọi Tổng đài 111 (miễn phí). Nếu đang gặp nguy hiểm, gọi 113.",
    "bao-luc":
        "Không ai được phép làm đau bạn. Cảm ơn bạn đã nói ra. Hãy kể với một người lớn bạn tin (thầy cô chủ nhiệm, người thân) hoặc gọi Tổng đài 111 để được giúp. Nếu đang gặp nguy hiểm, gọi 113.",
    "bat-nat":
        "Bị bắt nạt là chuyện rất khó chịu và đó không phải lỗi của bạn. Bạn nên kể với giáo viên chủ nhiệm hoặc bố mẹ để được bảo vệ. Bạn cũng có thể gọi Tổng đài 111. Bạn có muốn kể thêm chuyện đã xảy ra không?",
};
