// ============================================================
// ÂM THANH (tạo bằng Web Audio của trình duyệt, không dùng file nhạc → không lo bản quyền, không tốn tải)
// - playTing: bấm nút   - playCorrect / playWrong: trả lời đúng / sai   - playChest: mở rương kho báu
// - startMusic / stopMusic: nhạc nền vui nhộn ở Bản đồ chinh phục
// Có thể tắt toàn bộ âm thanh (nút loa ở đầu trang) hoặc chỉ tắt nhạc nền. Lựa chọn được nhớ trên máy.
// ============================================================

const SOUND_KEY = "aiyc_sound_off";
const MUSIC_KEY = "aiyc_music_off";

const read = (k: string) => {
  try {
    return localStorage.getItem(k) === "1";
  } catch {
    return false;
  }
};
const write = (k: string, v: boolean) => {
  try {
    localStorage.setItem(k, v ? "1" : "0");
  } catch {}
};

let soundOff = read(SOUND_KEY);
let musicOff = read(MUSIC_KEY);
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((f) => f());

export const isSoundOn = () => !soundOff;
export const isMusicOn = () => !soundOff && !musicOff;
export const subscribeSound = (f: () => void) => {
  listeners.add(f);
  return () => listeners.delete(f);
};
export function setSoundOn(on: boolean) {
  soundOff = !on;
  write(SOUND_KEY, soundOff);
  if (!on) stopMusic();
  emit();
}
export function setMusicOn(on: boolean) {
  musicOff = !on;
  write(MUSIC_KEY, musicOff);
  if (!on) stopMusic();
  emit();
}

let ctx: AudioContext | null = null;
function audio(): AudioContext | null {
  if (soundOff) return null;
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    return ctx;
  } catch {
    return null;
  }
}

function note(ac: AudioContext, freq: number, at: number, dur: number, type: OscillatorType, vol: number, out: AudioNode = ac.destination) {
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, at);
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(vol, at + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  o.connect(g).connect(out);
  o.start(at);
  o.stop(at + dur + 0.02);
}

/** Tiếng "ting" nhẹ khi bấm */
export function playTing() {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime;
  note(ac, 1318.5, t, 0.12, "triangle", 0.045);
  note(ac, 1975.5, t + 0.045, 0.14, "sine", 0.03);
}

/** Trả lời đúng: chuỗi nốt đi lên vui tai */
export function playCorrect() {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime;
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => note(ac, f, t + i * 0.085, 0.22, "triangle", 0.085));
}

/** Trả lời sai: hai nốt đi xuống, nhẹ nhàng (không gây khó chịu) */
export function playWrong() {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime;
  note(ac, 392, t, 0.2, "sine", 0.08);
  note(ac, 311.13, t + 0.17, 0.32, "sine", 0.08);
}

/** Mở rương kho báu: tiếng lấp lánh */
export function playChest() {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime;
  [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98, 2093].forEach((f, i) => note(ac, f, t + i * 0.07, 0.35, i % 2 ? "sine" : "triangle", 0.07));
  note(ac, 261.63, t, 0.6, "sine", 0.06);
}

// ---------- Nhạc nền Bản đồ chinh phục ----------
// 4 ô nhịp vòng lặp (C – G – Am – F), giai điệu ngũ cung tươi vui, 116 nhịp/phút
const NOTE = { C3: 130.81, F2: 87.31, G2: 98, A2: 110, C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880, C6: 1046.5 } as const;
const MELODY: (keyof typeof NOTE | null)[] = [
  "E5", "G5", "A5", "G5", "E5", null, "D5", "E5",
  "D5", "G5", "G5", "E5", "D5", null, "C5", "D5",
  "E5", "A5", "C6", "A5", "G5", null, "E5", "G5",
  "A5", "G5", "E5", "D5", "C5", null, "C5", null,
];
const BASS: (keyof typeof NOTE)[] = ["C3", "G2", "A2", "F2"];
const STEP = 60 / 116 / 2; // nốt móc đơn

let timer: number | null = null;
let master: GainNode | null = null;
let nextTime = 0;
let step = 0;

function schedule() {
  if (!ctx || !master) return;
  while (nextTime < ctx.currentTime + 0.3) {
    const m = MELODY[step % MELODY.length];
    if (m) note(ctx, NOTE[m], nextTime, STEP * 1.6, "triangle", 0.5, master);
    if (step % 8 === 0) note(ctx, NOTE[BASS[Math.floor(step / 8) % 4]], nextTime, STEP * 7, "sine", 0.7, master);
    if (step % 2 === 1) note(ctx, 3500, nextTime, 0.03, "square", 0.04, master); // tiếng gõ nhẹ
    nextTime += STEP;
    step += 1;
  }
}

export function startMusic() {
  if (!isMusicOn() || timer !== null) return;
  const ac = audio();
  if (!ac) return;
  master = ac.createGain();
  master.gain.setValueAtTime(0.0001, ac.currentTime);
  master.gain.exponentialRampToValueAtTime(0.09, ac.currentTime + 1.2);
  master.connect(ac.destination);
  nextTime = ac.currentTime + 0.1;
  step = 0;
  timer = window.setInterval(schedule, 120);
  schedule();
}

export function stopMusic() {
  if (timer !== null) {
    window.clearInterval(timer);
    timer = null;
  }
  if (master && ctx) {
    const m = master;
    try {
      m.gain.cancelScheduledValues(ctx.currentTime);
      m.gain.setValueAtTime(m.gain.value, ctx.currentTime);
      m.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      window.setTimeout(() => m.disconnect(), 500);
    } catch {}
  }
  master = null;
}
