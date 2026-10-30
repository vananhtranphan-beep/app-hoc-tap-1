import React, { useState } from "react";
import { ShieldCheck, Server, Smartphone, Bot, Trash2, Lock, AlertTriangle, Check, KeyRound } from "lucide-react";
import { StudentProfile } from "../types";
import { cloud, isPrivateKey } from "../lib/cloud";
import { checkPin, hasPin, isMoodPinKey, isValidPin, removePin, setPin } from "../lib/pin";

// ============================================================
// TRANG QUYỀN RIÊNG TƯ
// - Giải thích dữ liệu nằm ở đâu, gửi gì cho AI, giới hạn của web
// - CHỈ có chức năng xóa (không có tải dữ liệu về) và đặt/bỏ mã PIN Cây cảm xúc
// ============================================================

interface Props {
  profile: StudentProfile;
  /** Gọi sau khi xóa toàn bộ trên máy hoặc xóa tài khoản máy chủ: đưa về màn hình đăng nhập */
  onAccountRemoved: () => void;
}

type Group = "emotion" | "career" | "study";

const isCareerKey = (k: string) => /_career/.test(k);
const GROUP_TEST: Record<Group, (k: string) => boolean> = {
  emotion: (k) => isPrivateKey(k) && !isMoodPinKey(k),
  career: (k) => !isPrivateKey(k) && isCareerKey(k),
  study: (k) => !isPrivateKey(k) && !isCareerKey(k),
};

const ROWS: { what: string; where: string; ai: string; icon: React.ElementType }[] = [
  { what: "Tên đăng nhập, mật khẩu (đã mã hóa một chiều), khối lớp, biệt danh", where: "Máy chủ", ai: "Chỉ khối lớp, để AI nói cho hợp tuổi", icon: Server },
  { what: "Học tập: kế hoạch tuần, điểm tự nhập, video đã lưu", where: "Máy của bạn; có bản trên máy chủ khi đăng nhập", ai: "Chỉ câu bạn hỏi AI Tutor", icon: Smartphone },
  { what: "Hướng nghiệp: câu trả lời, nghề đã lưu, kế hoạch khám phá", where: "Máy của bạn; có bản trên máy chủ khi đăng nhập", ai: "Chỉ khi bạn bấm nhờ AI tư vấn", icon: Smartphone },
  { what: "Cảm xúc: check-in, ghi chú, cây, hoạt động đã làm", where: "Chỉ trên máy của bạn, không bao giờ gửi lên máy chủ", ai: "Không tự gửi", icon: Lock },
  { what: "Tin nhắn Góc tâm sự", where: "Không lưu ở đâu cả, đóng trang là mất", ai: "Chỉ tin đang trò chuyện, khi bạn bấm Gửi", icon: Bot },
];

const Card: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
  <section className="rounded-2xl bg-white border border-line p-4 sm:p-5 space-y-3">
    <h3 className="font-bold text-navy flex items-center gap-2">
      <Icon className="w-5 h-5 text-teal shrink-0" /> {title}
    </h3>
    {children}
  </section>
);

export const PrivacyView: React.FC<Props> = ({ profile, onAccountRemoved }) => {
  const id = profile.studentId;
  const onServer = !profile.isGuest && cloud.hasSession(id);
  const [, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);
  const [done, setDone] = useState("");

  const keys = cloud.keysFor(id);
  const count = (g: Group) => keys.filter(GROUP_TEST[g]).length;

  const removeGroup = (g: Group, label: string) => {
    const list = cloud.keysFor(id).filter(GROUP_TEST[g]);
    if (!list.length) return;
    const where = g !== "emotion" && onServer ? " trên máy này và bản lưu trên máy chủ" : " trên máy này";
    if (!window.confirm(`Xóa toàn bộ dữ liệu ${label}${where}? Việc này không hoàn tác được.`)) return;
    list.forEach((k) => {
      try {
        localStorage.removeItem(k); // tài khoản đã đăng nhập: thay đổi tự đồng bộ lên máy chủ
      } catch {}
    });
    setDone(`Đã xóa dữ liệu ${label}.`);
    refresh();
  };

  const removeAllOnDevice = () => {
    const msg = onServer
      ? "Xóa mọi dữ liệu của tài khoản này trên máy này (kể cả cảm xúc và mã PIN) rồi đăng xuất? Tài khoản và bản học tập, hướng nghiệp trên máy chủ vẫn còn."
      : profile.isGuest
      ? "Xóa mọi dữ liệu của chế độ khách trên máy này? Việc này không hoàn tác được."
      : "Xóa tài khoản và mọi dữ liệu của nó trên máy này? Việc này không hoàn tác được.";
    if (!window.confirm(msg)) return;
    removePin(id);
    onAccountRemoved();
  };

  // ---- Xóa tài khoản máy chủ ----
  const [delOpen, setDelOpen] = useState(false);
  const [delPass, setDelPass] = useState("");
  const [delErr, setDelErr] = useState("");
  const [delBusy, setDelBusy] = useState(false);
  const deleteServer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!delPass || delBusy) return;
    if (!window.confirm("Xóa hẳn tài khoản trên máy chủ cùng mọi dữ liệu của nó trên máy chủ và máy này? Việc này không hoàn tác được.")) return;
    setDelBusy(true);
    setDelErr("");
    const r = await cloud.deleteAccount(id, delPass);
    setDelBusy(false);
    if (!r.ok) return setDelErr(r.message);
    removePin(id);
    onAccountRemoved();
  };

  // ---- Mã PIN ----
  const pinOn = hasPin(id);
  const [pinMode, setPinMode] = useState<"" | "set" | "change" | "remove">("");
  const [curPin, setCurPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [newPin2, setNewPin2] = useState("");
  const [pinErr, setPinErr] = useState("");
  const resetPinForm = () => {
    setPinMode("");
    setCurPin("");
    setNewPin("");
    setNewPin2("");
    setPinErr("");
  };
  const submitPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pinMode !== "set" && !(await checkPin(id, curPin))) return setPinErr("Mã PIN hiện tại chưa đúng.");
    if (pinMode === "remove") {
      removePin(id);
      resetPinForm();
      setDone("Đã bỏ mã PIN. Cây cảm xúc mở không cần mã nữa.");
      return;
    }
    if (!isValidPin(newPin)) return setPinErr("Mã PIN gồm đúng 4 chữ số.");
    if (newPin !== newPin2) return setPinErr("Hai lần nhập mã PIN mới chưa giống nhau.");
    if (!(await setPin(id, newPin))) return setPinErr("Chưa lưu được mã PIN trên máy này.");
    resetPinForm();
    setDone("Đã lưu mã PIN. Lần sau mở Cây cảm xúc sẽ cần nhập mã.");
  };
  const pinInput = (value: string, set: (v: string) => void, label: string) => (
    <label className="block text-sm font-semibold text-navy">
      {label}
      <input
        value={value}
        onChange={(e) => {
          set(e.target.value.replace(/\D/g, "").slice(0, 4));
          setPinErr("");
        }}
        type="password"
        inputMode="numeric"
        autoComplete="off"
        maxLength={4}
        className="mt-1 w-32 block px-3 py-2.5 rounded-xl border border-line bg-cream text-lg tracking-[0.4em] text-center focus:outline-none focus:ring-2 focus:ring-teal"
      />
    </label>
  );

  const groups: { g: Group; label: string; desc: string }[] = [
    { g: "emotion", label: "cảm xúc", desc: "Check-in, ghi chú, cây, vật trang trí, hoạt động đã làm. Mã PIN vẫn giữ." },
    { g: "career", label: "hướng nghiệp", desc: "Câu trả lời khảo sát, nghề đã lưu, kế hoạch khám phá." },
    { g: "study", label: "học tập", desc: "Kế hoạch tuần, bảng điểm, video đã lưu, số ngày vào web." },
  ];

  return (
    <div className="space-y-5 pb-6">
      <div className="flex items-center gap-3">
        <span className="w-12 h-12 rounded-2xl bg-navy text-cream flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </span>
        <div>
          <h2 className="text-2xl font-extrabold text-navy tracking-tight">Quyền riêng tư</h2>
          <p className="text-sm text-muted">Không thu thì không lộ: dữ liệu nhạy cảm nhất chỉ nằm trên máy của bạn.</p>
        </div>
      </div>

      {done && (
        <div role="status" className="p-3.5 rounded-xl bg-teal-soft text-sm text-navy font-medium flex items-center gap-2 animate-rise">
          <Check className="w-4 h-4 text-teal-deep shrink-0" /> {done}
        </div>
      )}

      <Card title="Dữ liệu nào nằm ở đâu" icon={Server}>
        <p className="text-sm text-muted">Web không hỏi họ tên, ngày sinh, trường lớp hay ảnh thật. Biệt danh do web tự tạo nên không cho biết bạn là ai.</p>
        <div className="divide-y divide-line border border-line rounded-xl overflow-hidden">
          <div className="hidden md:grid grid-cols-[1.4fr_1.2fr_1fr] gap-3 px-4 py-2.5 bg-mist text-xs font-bold text-navy uppercase tracking-wide">
            <span>Loại dữ liệu</span>
            <span>Lưu ở đâu</span>
            <span>Có gửi tới AI không</span>
          </div>
          {ROWS.map((r) => (
            <div key={r.what} className="grid md:grid-cols-[1.4fr_1.2fr_1fr] gap-1 md:gap-3 px-4 py-3 text-sm">
              <span className="font-semibold text-ink flex items-start gap-2">
                <r.icon className="w-4 h-4 text-teal mt-0.5 shrink-0" /> {r.what}
              </span>
              <span className="text-ink pl-6 md:pl-0">
                <span className="md:hidden text-muted">Lưu ở: </span>
                {r.where}
              </span>
              <span className="text-ink pl-6 md:pl-0">
                <span className="md:hidden text-muted">Gửi AI: </span>
                {r.ai}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Khi nào nội dung được gửi tới AI" icon={Bot}>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-ink">
          <li>
            Câu trả lời của AI do dịch vụ <b>Groq</b> (công ty ở Mỹ, máy chủ đặt ở nước ngoài) tạo ra. Nội dung chỉ được gửi khi bạn bấm Gửi hoặc bấm nhờ AI tư vấn.
          </li>
          <li>AI Tutor: câu hỏi bạn gõ và các tin gần nhất trong cuộc trò chuyện đó.</li>
          <li>Hướng nghiệp: tóm tắt câu trả lời khảo sát và danh mục nghề, khi bạn bấm hỏi AI.</li>
          <li>Góc tâm sự: tin bạn đang gửi; thời tiết và nguyên nhân của lần check-in hôm nay chỉ gửi kèm nếu bạn tích ô đồng ý.</li>
          <li>
            <b>Không bao giờ gửi</b>: tên đăng nhập, biệt danh, mật khẩu, nhật ký và ghi chú cảm xúc.
          </li>
          <li>Web không lưu lại tin nhắn Góc tâm sự. Khóa dùng AI chỉ nằm trên máy chủ, không nằm trong trang web.</li>
        </ul>
      </Card>

      <Card title="Giới hạn bạn nên biết" icon={AlertTriangle}>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-ink">
          <li>
            Bộ lọc an toàn tìm theo từ khóa nên <b>có thể bỏ sót</b> cách nói vòng. Web không thay được người lớn: khi gặp chuyện không an toàn, hãy nói với bố mẹ, thầy cô hoặc gọi 111.
          </li>
          <li>AI có thể trả lời sai. Mọi gợi ý chỉ để tham khảo.</li>
          <li>
            Dữ liệu chỉ lưu trên máy (cảm xúc, chế độ khách) sẽ <b>mất</b> khi bạn đổi trình duyệt, đổi máy hoặc xóa lịch sử duyệt web.
          </li>
          <li>Trên máy dùng chung, người khác có thể mở Cây cảm xúc nếu bạn chưa đặt mã PIN.</li>
        </ul>
      </Card>

      <Card title="Mã PIN cho Cây cảm xúc" icon={KeyRound}>
        <p className="text-sm text-muted">
          {pinOn ? "Đang bật. Mỗi lần mở lại web, Cây cảm xúc cần mã PIN 4 số." : "Đang tắt. Đặt mã PIN 4 số để người dùng chung máy không mở được Cây cảm xúc."} Mã PIN chỉ lưu trên máy này, không ai lấy lại được.
        </p>
        {!pinMode ? (
          <div className="flex flex-wrap gap-2">
            {!pinOn ? (
              <button onClick={() => setPinMode("set")} className="min-h-11 px-4 rounded-xl bg-teal hover:bg-teal-deep text-white text-sm font-bold cursor-pointer">
                Đặt mã PIN
              </button>
            ) : (
              <>
                <button onClick={() => setPinMode("change")} className="min-h-11 px-4 rounded-xl bg-white border border-line hover:border-teal text-navy text-sm font-semibold cursor-pointer">
                  Đổi mã PIN
                </button>
                <button onClick={() => setPinMode("remove")} className="min-h-11 px-4 rounded-xl bg-white border border-line hover:border-rose-300 text-rose-700 text-sm font-semibold cursor-pointer">
                  Bỏ mã PIN
                </button>
              </>
            )}
          </div>
        ) : (
          <form onSubmit={submitPin} className="p-4 rounded-xl bg-cream border border-line space-y-3">
            <div className="flex flex-wrap gap-4">
              {pinMode !== "set" && pinInput(curPin, setCurPin, "Mã PIN hiện tại")}
              {pinMode !== "remove" && pinInput(newPin, setNewPin, "Mã PIN mới")}
              {pinMode !== "remove" && pinInput(newPin2, setNewPin2, "Nhập lại mã mới")}
            </div>
            {pinErr && (
              <p role="alert" className="text-sm text-rose-700">
                {pinErr}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <button type="submit" className="min-h-11 px-4 rounded-xl bg-teal hover:bg-teal-deep text-white text-sm font-bold cursor-pointer">
                {pinMode === "remove" ? "Bỏ mã PIN" : "Lưu mã PIN"}
              </button>
              <button type="button" onClick={resetPinForm} className="min-h-11 px-4 rounded-xl bg-white border border-line text-navy text-sm font-semibold cursor-pointer">
                Hủy
              </button>
            </div>
          </form>
        )}
      </Card>

      <Card title="Xóa dữ liệu" icon={Trash2}>
        <p className="text-sm text-muted">Mỗi lần xóa đều hỏi lại. Dữ liệu đã xóa không khôi phục được.</p>
        <div className="grid gap-2">
          {groups.map(({ g, label, desc }) => {
            const n = count(g);
            return (
              <div key={g} className="p-3.5 rounded-xl border border-line flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-[12rem]">
                  <div className="font-semibold text-navy text-sm first-letter:uppercase">Dữ liệu {label}</div>
                  <div className="text-xs text-muted">{desc}</div>
                  <div className="text-xs text-muted mt-0.5">
                    {n ? (g === "emotion" ? "Có dữ liệu trên máy này" : onServer ? "Có dữ liệu trên máy này và máy chủ" : "Có dữ liệu trên máy này") : "Chưa có dữ liệu"}
                  </div>
                </div>
                <button
                  onClick={() => removeGroup(g, label)}
                  disabled={!n}
                  className="min-h-11 px-4 rounded-xl bg-white border border-line hover:border-rose-300 text-rose-700 disabled:text-muted disabled:hover:border-line text-sm font-semibold inline-flex items-center gap-2 cursor-pointer disabled:cursor-default"
                >
                  <Trash2 className="w-4 h-4" /> Xóa
                </button>
              </div>
            );
          })}

          <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/60 flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[12rem]">
              <div className="font-semibold text-navy text-sm">Xóa toàn bộ trên máy này</div>
              <div className="text-xs text-muted">
                {onServer ? "Xóa mọi dữ liệu của tài khoản trên máy này rồi đăng xuất. Tài khoản trên máy chủ vẫn còn." : "Xóa mọi dữ liệu và rời khỏi tài khoản này trên máy này."}
              </div>
            </div>
            <button onClick={removeAllOnDevice} className="min-h-11 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold inline-flex items-center gap-2 cursor-pointer">
              <Trash2 className="w-4 h-4" /> Xóa toàn bộ trên máy
            </button>
          </div>

          {onServer && (
            <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/60 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-[12rem]">
                  <div className="font-semibold text-navy text-sm">Xóa tài khoản trên máy chủ</div>
                  <div className="text-xs text-muted">Xóa tên đăng nhập, mật khẩu, biệt danh và bản dữ liệu trên máy chủ, sau đó xóa luôn dữ liệu trên máy này.</div>
                </div>
                {!delOpen && (
                  <button onClick={() => setDelOpen(true)} className="min-h-11 px-4 rounded-xl bg-white border border-rose-300 text-rose-700 text-sm font-bold cursor-pointer">
                    Xóa tài khoản
                  </button>
                )}
              </div>
              {delOpen && (
                <form onSubmit={deleteServer} className="flex flex-wrap items-end gap-2">
                  <label className="block text-sm font-semibold text-navy">
                    Nhập mật khẩu để xác nhận
                    <input
                      type="password"
                      autoComplete="current-password"
                      value={delPass}
                      onChange={(e) => {
                        setDelPass(e.target.value);
                        setDelErr("");
                      }}
                      className="mt-1 block w-56 max-w-full px-3 py-2.5 rounded-xl border border-line bg-white text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                    />
                  </label>
                  <button type="submit" disabled={!delPass || delBusy} className="min-h-11 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-sm font-bold cursor-pointer">
                    {delBusy ? "Đang xóa..." : "Xóa vĩnh viễn"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDelOpen(false);
                      setDelPass("");
                      setDelErr("");
                    }}
                    className="min-h-11 px-4 rounded-xl bg-white border border-line text-navy text-sm font-semibold cursor-pointer"
                  >
                    Hủy
                  </button>
                  {delErr && (
                    <p role="alert" className="basis-full text-sm text-rose-700">
                      {delErr}
                    </p>
                  )}
                </form>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
