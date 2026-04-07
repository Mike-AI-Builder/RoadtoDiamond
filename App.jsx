import React, { useState, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { 
  Trophy, TrendingUp, BookOpen, 
  Check, Edit3, Sparkles, Zap, Award, 
  Users, MessageCircle,
  Home, Crosshair,
  CalendarClock, Presentation, Phone, RefreshCw, GitBranch, Megaphone,
  Mail, CalendarRange, CalendarOff, Mic2, Headphones, Package, LogOut,
  Gem, BarChart2, Trash2, Settings, Plus
} from 'lucide-react';

// --- Data Constants ---
const DEFAULT_HABITS = [
  "主動搭話", "保養", "寫感恩日記",
  "寫反思日記", "每日睡前看書", "1點前睡",
  "不賴床", "不抽煙", "不喝五十嵐"
];

// 每日指引句子庫（隨機抽取）
const DAILY_GUIDANCE_QUOTES = [
  "當你對自己說到做到時，你散發出的氣場會讓所有人都信任你。",
  "當你站得像個贏家，你的大腦就會開始相信你是。",
  "你不需要活得像誰，『真實的你』才是這世界上最稀缺的資源。",
  "當別人讚美你時，那是宇宙借他的口送你的禮物，請優雅地說聲『謝謝』並收下它。",
  "懂你的人不需要解釋，不懂的人不值得解釋；把說明的力氣省下來，拿去發光。",
  "相信那個還沒看見結果，卻依然選擇出發的自己。",
  "卓越不是緊繃出來的，而是在深度放鬆後，讓才華自然流淌的狀態。",
  "你的進度表是獨一無二的，專注腳下的節奏，不必追趕別人的風景。",
  "成為別人的星探，去挖掘每個人身上連他自己都沒發現的光芒。",
  "停止向宇宙投射負能量，你的嘴就是你的風水。",
  "名字是世界上最動聽的聲音，記住它，你就握住了通往對方心門的鑰匙。",
  "做一個好的聆聽者，好的溝通不是看你說了多少，而是看你聽進去了多少。",
  "與其努力讓自己變得有趣，不如真心對他人感到好奇。",
  "先幫別人達成他的願望，宇宙自然會把你的願望排進實現清單。",
  "讓對方成為對話中的主角，你會收穫更多寶貴的資訊與好感。",
  "你為別人點燃的燈，最終會照亮你回家的路。",
  "主動選擇學習對象、來源，不要讓演算法餵食你。",
  "承認自己還有進步空間，是通往卓越最快的一條捷徑。",
  "即使台下只有一個人，也要拿出面對一千人的狀態去練習你的感染力。",
  "定時與老師對焦，檢查你的羅盤，確保你的努力正精準地消耗在最有產值的地方。",
  "養成通往成功的習慣，讓成功自然而然。",
  "當你公開肯定另一半，你得到的尊重也會跟著成倍增加。",
  "分享你的心情而不只是資訊，讓家人真正參與你的生命旅程。",
  "家庭、家族的氛圍也是能夠主動創造的，成為那個源頭。",
  "時時感謝另一半，做你最堅強的後盾。",
  "滿足需求只是合格，超越預期才能讓人心動；多做那『多出一哩路』的服務。",
  "隨時隨地銷售領導人、銷售環境，讓這成為習慣。",
  "你的形象走在你的能力前面；讓你的外在，配得上你內在的靈魂。",
  "你不是在賣產品，你是在分享你愛上它的理由；沒感動過自己，就感動不了別人。",
  "早到五分鐘，能讓你在正式對話前，先贏得對方的信任與從容的節奏。",
  "誠實能讓你擁有最輕盈的靈魂。",
  "越結實的稻穗頭垂得越低；偉大始於謙卑，終於傲慢。",
  "感恩是幸福的通緝令，當你開始感謝，好運就無處遁形。",
  "父母是你生命力量的根源；根深才能葉茂，善待雙親，福報自來。",
  "己所不欲，勿施於人，你投射出去的一切，最終都會回到你身上。",
  "成功是眾人之功，失敗是個人之責；把光芒分給夥伴，你會贏得整片星空。",
  "哪怕沒人看見，善良依然有它的重量；宇宙會在你看不見的地方，為你寫下報酬。",
  "真誠的力量是很大的，試著在對話中分享你的真實故事。",
  "別管業績了，今天去真心讚美一個陌生人，看看會發生什麼驚喜。",
  "如果你感到停滯，就先從整理你的房間或桌子開始吧！",
  "傾聽。在下一次對話中，嘗試讓對方多說 5 分鐘。",
  "別擔心結果，宇宙正在計算的是你的勇氣，而不是你的成功率。",
  "每一個『No』都是在幫你自動過濾掉不合適的人，別讓它停留在你心裡。",
  "種子在土裡時看起來毫無動靜，但它正在紮根。你的努力也是。",
  "你的價值不取決於別人的認可，而取決於你對目標的堅持。",
  "專注於你能控制的事，其他的，就交給宇宙去安排。",
  "未來的你會感謝現在那麼努力的你！",
];

const GUIDANCE_DRAWS_PER_DAY = 1;

// EXP 由少到多；圖示採中性意象
const FAILURE_TYPES = [
  { label: '訊息被不回', exp: 1, icon: Mail },
  { label: '邀約被拒', exp: 3, icon: CalendarRange },
  { label: '被潑冷水', exp: 3, icon: RefreshCw },
  { label: '被爽約', exp: 5, icon: CalendarClock },
  { label: '產品示範後對方無感', exp: 5, icon: Presentation },
  { label: '破題後對方態度冷淡', exp: 5, icon: MessageCircle },
  { label: '交換聯絡方式被拒', exp: 5, icon: Phone },
  { label: '大會約不到人自己', exp: 5, icon: Megaphone },
  { label: '被放鳥', exp: 10, icon: CalendarOff },
  { label: '講課搞砸', exp: 10, icon: Mic2 },
  { label: '朋友聽課無感', exp: 15, icon: Headphones },
  { label: '產品退貨', exp: 20, icon: Package },
  { label: '下線退出(不續約）', exp: 30, icon: LogOut },
  { label: '跟進對象加入別的團隊', exp: 30, icon: Users },
  { label: '發展型下線不做了', exp: 100, icon: GitBranch },
];

const FAILURE_ICON_KEYS = [
  'Mail', 'CalendarRange', 'RefreshCw', 'CalendarClock', 'Presentation', 'MessageCircle',
  'Phone', 'Megaphone', 'CalendarOff', 'Mic2', 'Headphones', 'Package', 'LogOut', 'Users', 'GitBranch',
];

const ICON_MAP = {
  Mail, CalendarRange, RefreshCw, CalendarClock, Presentation, MessageCircle,
  Phone, Megaphone, CalendarOff, Mic2, Headphones, Package, LogOut, Users, GitBranch,
};

function buildDefaultFailureTypesData() {
  return FAILURE_TYPES.map((t, i) => ({
    id: `ft-def-${i}`,
    label: t.label,
    exp: t.exp,
    iconKey: FAILURE_ICON_KEYS[i] || 'Mail',
  }));
}

const FAILURE_QUOTES = [
  "每一段過程都是升級的資料點。",
  "寫下來，下一步會更有方向。",
  "經驗累積，就是實力。",
  "誠實面對狀況的人，成長最快。",
  "今天的紀錄，是明天更好的起點。",
  "持續往前走，就是在變強。",
  "清楚看見場景，就能優化策略。",
  "願意紀錄的人，已經在進步。",
  "沒有白走的路，每一步都算數。",
  "保持行動，時間與經驗會幫你加值。",
  "調整節奏，再出發就好。",
  "紀錄讓你更了解自己與對方。",
  "專注在可改變的下一步。",
  "穩穩累積，遠比一次完美更重要。",
  "你正在把經歷變成資產。",
  "每一次回顧，都是微調的機會。",
  "帶著覺察前進，路會越來越寬。",
  "給自己一點肯定，然後繼續前進。",
  "成長來自於真實的觀察與紀錄。",
  "下一場對話，你會比上一場更從容。"
];

const MILESTONES = {
  7: 20, 14: 50, 21: 100, 30: 200, 45: 300, 60: 500, 100: 1000
};

const TRIPLE_MILESTONES = { 3: 15, 7: 30, 14: 50, 21: 100 };

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // 橫線
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // 直線
  [0, 4, 8], [2, 4, 6]             // 對角線
];

const getTitleByLevel = (lv) => {
  if (lv <= 3) return "0%";
  if (lv <= 6) return "3%";
  if (lv <= 9) return "6%";
  if (lv <= 12) return "9%";
  if (lv <= 15) return "12%";
  if (lv <= 18) return "12%初階";
  if (lv <= 21) return "15%初階";
  if (lv <= 24) return "15%銅章";
  if (lv <= 30) return "18%銅章";
  if (lv <= 37) return "銀章";
  if (lv <= 43) return "金章";
  if (lv <= 49) return "白金";
  if (lv <= 59) return "創辦人白金";
  if (lv <= 69) return "紅寶石";
  if (lv <= 79) return "藍寶石";
  if (lv <= 89) return "創辦人藍寶石";
  if (lv <= 99) return "翡翠";
  if (lv <= 119) return "創辦人翡翠";
  if (lv <= 139) return "鑽石";
  if (lv <= 159) return "創辦人鑽石";
  if (lv <= 179) return "執行專才鑽石";
  if (lv <= 199) return "雙鑽石";
  if (lv <= 219) return "創辦人雙鑽石";
  return "三鑽石";
};

// 根據獎銜動態取得卡片漸層與文字色彩
const getStyleByTitle = (title) => {
  if (title.includes("三鑽石") || title.includes("雙鑽石")) return { bg: "from-fuchsia-600 via-purple-700 to-indigo-800", text: "from-pink-200 to-fuchsia-100", icon: "text-fuchsia-200" };
  if (title.includes("鑽石")) return { bg: "from-cyan-500 via-blue-600 to-indigo-700", text: "from-cyan-100 to-white", icon: "text-cyan-200" };
  if (title.includes("翡翠")) return { bg: "from-emerald-500 via-teal-600 to-green-800", text: "from-emerald-100 to-green-50", icon: "text-emerald-200" };
  if (title.includes("藍寶石")) return { bg: "from-blue-500 via-indigo-600 to-blue-900", text: "from-blue-100 to-indigo-50", icon: "text-blue-200" };
  if (title.includes("紅寶石")) return { bg: "from-rose-500 via-red-600 to-rose-900", text: "from-rose-100 to-red-50", icon: "text-rose-200" };
  if (title.includes("白金")) return { bg: "from-slate-400 via-slate-500 to-slate-700", text: "from-slate-100 to-white", icon: "text-slate-200" };
  if (title.includes("金章")) return { bg: "from-yellow-400 via-amber-500 to-yellow-700", text: "from-yellow-100 to-amber-50", icon: "text-yellow-200" };
  if (title.includes("銀章")) return { bg: "from-gray-400 via-zinc-400 to-zinc-600", text: "from-gray-100 to-white", icon: "text-gray-100" };
  if (title.includes("銅章") || title.includes("初階")) return { bg: "from-orange-400 via-amber-600 to-orange-800", text: "from-orange-100 to-yellow-50", icon: "text-orange-200" };
  return { bg: "from-slate-700 via-slate-800 to-slate-900", text: "from-slate-200 to-slate-400", icon: "text-slate-400" };
};

// --- 本機儲存（每個瀏覽器各自一份，重新整理／關閉後再開仍保留）---
const STORAGE_KEY = 'road-to-diamond-game-v1';
const SAVE_VERSION = 3;

const DEFAULT_SETTLEMENT_TIME = { hour: 4, minute: 0 };

const DEFAULT_STAT_TARGETS = {
  contacts: { label: '聯絡人數', target: 10 },
  gatherings: { label: '聚會場次', target: 3 },
  strangers: { label: '認識人數', target: 1 },
};

function formatLocalYMD(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** 以本地時間「每日結算時刻」為遊戲日切換點 */
function getGameDayKey(d = new Date(), settlement = DEFAULT_SETTLEMENT_TIME) {
  const h = Math.max(0, Math.min(23, Number(settlement.hour) || 0));
  const min = Math.max(0, Math.min(59, Number(settlement.minute) || 0));
  const boundaryMin = h * 60 + min;
  const x = new Date(d);
  const nowMin = x.getHours() * 60 + x.getMinutes();
  if (nowMin < boundaryMin) {
    x.setDate(x.getDate() - 1);
  }
  return formatLocalYMD(x);
}

function normalizeSettlementTime(t) {
  if (!t || typeof t !== 'object') return { ...DEFAULT_SETTLEMENT_TIME };
  return {
    hour: Math.max(0, Math.min(23, Number(t.hour) ?? DEFAULT_SETTLEMENT_TIME.hour)),
    minute: Math.max(0, Math.min(59, Number(t.minute) ?? DEFAULT_SETTLEMENT_TIME.minute)),
  };
}

function normalizeStatTargets(s) {
  if (!s || typeof s !== 'object') return { ...DEFAULT_STAT_TARGETS };
  const pick = (key, def) => ({
    label: typeof s[key]?.label === 'string' && s[key].label.trim() ? s[key].label.trim().slice(0, 32) : def.label,
    target: Math.max(1, Math.min(99999, Number(s[key]?.target) ?? def.target)),
  });
  return {
    contacts: pick('contacts', DEFAULT_STAT_TARGETS.contacts),
    gatherings: pick('gatherings', DEFAULT_STAT_TARGETS.gatherings),
    strangers: pick('strangers', DEFAULT_STAT_TARGETS.strangers),
  };
}

function getNextGameDayKey(dayStr) {
  const [y, m, d] = dayStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + 1);
  return formatLocalYMD(dt);
}

function compareDayKeys(a, b) {
  if (!a || !b) return 0;
  return a < b ? -1 : a > b ? 1 : 0;
}

function upsertBusinessRecord(records, date, stats) {
  const contacts = Number(stats.contacts) || 0;
  const gatherings = Number(stats.gatherings) || 0;
  const strangers = Number(stats.strangers) || 0;
  const idx = records.findIndex((r) => r.date === date);
  if (idx >= 0) {
    const copy = [...records];
    copy[idx] = { ...copy[idx], contacts, gatherings, strangers };
    return copy;
  }
  return [...records, { date, contacts, gatherings, strangers }];
}

function normalizeFailureTypesData(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return buildDefaultFailureTypesData();
  return arr.map((f, i) => ({
    id: typeof f.id === 'string' && f.id ? f.id : `ft-${i}`,
    label: String(f.label || '').trim().slice(0, 120) || '未命名',
    exp: Math.max(0, Math.min(99999, Number(f.exp) || 1)),
    iconKey: typeof f.iconKey === 'string' && ICON_MAP[f.iconKey] ? f.iconKey : 'Mail',
  }));
}

const DEFAULT_STAT_REWARDS = {
  contacts: false,
  gatherings: false,
  strangers: false,
  doubleDouble: false,
  all: false,
};

function settleGameDaysBetween(saved, targetGameDay) {
  let lp = saved.lastPlayDate || targetGameDay;
  let gridState = Array.isArray(saved.gridState) && saved.gridState.length === 9
    ? [...saved.gridState.map(Boolean)]
    : Array(9).fill(false);
  let todayStats = {
    contacts: Number(saved.todayStats?.contacts) || 0,
    gatherings: Number(saved.todayStats?.gatherings) || 0,
    strangers: Number(saved.todayStats?.strangers) || 0,
  };
  let businessRecords = Array.isArray(saved.businessRecords) ? [...saved.businessRecords] : [];
  let seasonRecord = {
    wins: Number(saved.seasonRecord?.wins) || 0,
    losses: Number(saved.seasonRecord?.losses) || 0,
  };
  let streak = typeof saved.streak === 'number' && saved.streak >= 0 ? saved.streak : 0;
  let tripleDoubleStreak =
    typeof saved.tripleDoubleStreak === 'number' && saved.tripleDoubleStreak >= 0
      ? saved.tripleDoubleStreak
      : 0;
  let guidanceDaily = saved.guidanceDaily;

  if (compareDayKeys(lp, targetGameDay) > 0) {
    return {
      ...saved,
      lastPlayDate: targetGameDay,
      gridState,
      todayStats,
      businessRecords,
      seasonRecord,
      streak,
      statRewards: { ...DEFAULT_STAT_REWARDS, ...saved.statRewards },
      guidanceDaily:
        guidanceDaily?.dayKey === targetGameDay && Array.isArray(guidanceDaily?.draws)
          ? guidanceDaily
          : { dayKey: targetGameDay, draws: [] },
    };
  }

  let crossed = false;
  while (compareDayKeys(lp, targetGameDay) < 0) {
    crossed = true;
    const win = gridState.length === 9 && gridState.every(Boolean);
    businessRecords = upsertBusinessRecord(businessRecords, lp, todayStats);
    seasonRecord = {
      wins: seasonRecord.wins + (win ? 1 : 0),
      losses: seasonRecord.losses + (win ? 0 : 1),
    };
    if (!win) streak = 0;
    lp = getNextGameDayKey(lp);
    gridState = Array(9).fill(false);
    todayStats = { contacts: 0, gatherings: 0, strangers: 0 };
    tripleDoubleStreak = 0;
  }

  if (crossed) {
    guidanceDaily = { dayKey: targetGameDay, draws: [] };
  } else {
    if (!guidanceDaily || typeof guidanceDaily !== 'object' || !Array.isArray(guidanceDaily.draws)) {
      guidanceDaily = { dayKey: targetGameDay, draws: [] };
    } else if (guidanceDaily.dayKey !== targetGameDay) {
      guidanceDaily = { dayKey: targetGameDay, draws: [] };
    }
  }

  return {
    ...saved,
    lastPlayDate: targetGameDay,
    gridState,
    todayStats,
    businessRecords,
    seasonRecord,
    streak,
    hasWonToday: crossed ? false : !!saved.hasWonToday,
    hasPerfectDayToday: crossed ? false : !!saved.hasPerfectDayToday,
    statRewards: crossed ? { ...DEFAULT_STAT_REWARDS } : { ...DEFAULT_STAT_REWARDS, ...saved.statRewards },
    tripleDoubleStreak: crossed ? 0 : tripleDoubleStreak,
    guidanceDaily,
  };
}

function normalizeFailures(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map((f, i) => {
    const exp = Number(f.exp) || 0;
    const date = typeof f.date === 'string' ? f.date : '';
    const recordedAt =
      typeof f.recordedAt === 'string'
        ? f.recordedAt
        : date
          ? `${date}T12:00:00.000Z`
          : new Date(0).toISOString();
    return {
      id: f.id != null ? f.id : `legacy-${i}-${recordedAt}`,
      label: typeof f.label === 'string' ? f.label : '自訂',
      text: typeof f.text === 'string' ? f.text : '',
      exp,
      date: date || recordedAt.split('T')[0],
      recordedAt,
    };
  });
}

function formatFailureRecordedAt(iso) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch {
    return '—';
  }
}

function updateIsoDateKeepTime(iso, ymd) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    const [y, m, day] = String(ymd || '').split('-').map((x) => Number(x));
    if (!y || !m || !day) return iso;
    d.setFullYear(y, m - 1, day);
    return d.toISOString();
  } catch {
    return iso;
  }
}

function isoToLocalMinuteInputValue(iso) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return '';
  }
}

function localMinuteInputValueToIso(v) {
  try {
    if (!v) return '';
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString();
  } catch {
    return '';
  }
}

function initialCompletedLineCount(grid) {
  let completedLines = 0;
  WIN_LINES.forEach((line) => {
    if (grid[line[0]] && grid[line[1]] && grid[line[2]]) completedLines++;
  });
  return completedLines;
}

function createFreshGameState() {
  const st = { ...DEFAULT_SETTLEMENT_TIME };
  const today = getGameDayKey(new Date(), st);
  return {
    baseExp: 0,
    seasonRecord: { wins: 0, losses: 0 },
    habits: [...DEFAULT_HABITS],
    gridState: Array(9).fill(false),
    streak: 0,
    hasWonToday: false,
    hasPerfectDayToday: false,
    failures: [],
    businessRecords: [],
    todayStats: { contacts: 0, gatherings: 0, strangers: 0 },
    statRewards: { ...DEFAULT_STAT_REWARDS },
    tripleDoubleStreak: 0,
    guidanceDaily: { dayKey: today, draws: [] },
    lastPlayDate: today,
    guidanceQuotes: [...DAILY_GUIDANCE_QUOTES],
    failureTypes: buildDefaultFailureTypesData(),
    statTargets: normalizeStatTargets(null),
    settlementTime: { ...DEFAULT_SETTLEMENT_TIME },
  };
}

function loadPersistedGameState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    const fileVersion = d.v ?? 1;
    if (fileVersion > SAVE_VERSION) return null;

    const settlementTime = normalizeSettlementTime(d.settlementTime);
    const statTargets = normalizeStatTargets(d.statTargets);
    const targetGameDay = getGameDayKey(new Date(), settlementTime);
    const guidanceQuotes =
      Array.isArray(d.guidanceQuotes) && d.guidanceQuotes.length > 0
        ? d.guidanceQuotes.map((q) => String(q))
        : [...DAILY_GUIDANCE_QUOTES];
    const failureTypes = normalizeFailureTypesData(d.failureTypes);

    const habits =
      Array.isArray(d.habits) && d.habits.length === 9 ? [...d.habits] : [...DEFAULT_HABITS];

    const lastPlayDateLegacy =
      typeof d.lastPlayDate === 'string' && d.lastPlayDate ? d.lastPlayDate : targetGameDay;

    const rawSaved = {
      lastPlayDate: lastPlayDateLegacy,
      gridState:
        Array.isArray(d.gridState) && d.gridState.length === 9
          ? d.gridState.map(Boolean)
          : Array(9).fill(false),
      todayStats: {
        contacts: Number(d.todayStats?.contacts) || 0,
        gatherings: Number(d.todayStats?.gatherings) || 0,
        strangers: Number(d.todayStats?.strangers) || 0,
      },
      businessRecords: Array.isArray(d.businessRecords) ? d.businessRecords : [],
      seasonRecord:
        d.seasonRecord && typeof d.seasonRecord === 'object'
          ? { wins: Number(d.seasonRecord.wins) || 0, losses: Number(d.seasonRecord.losses) || 0 }
          : { wins: 0, losses: 0 },
      streak: typeof d.streak === 'number' && d.streak >= 0 ? d.streak : 0,
      tripleDoubleStreak:
        typeof d.tripleDoubleStreak === 'number' && d.tripleDoubleStreak >= 0
          ? d.tripleDoubleStreak
          : 0,
      hasWonToday: !!d.hasWonToday,
      hasPerfectDayToday: !!d.hasPerfectDayToday,
      statRewards:
        d.statRewards && typeof d.statRewards === 'object'
          ? {
              contacts: !!d.statRewards.contacts,
              gatherings: !!d.statRewards.gatherings,
              strangers: !!d.statRewards.strangers,
              doubleDouble: !!d.statRewards.doubleDouble,
              all: !!d.statRewards.all,
            }
          : { ...DEFAULT_STAT_REWARDS },
      guidanceDaily: d.guidanceDaily,
    };

    const settled = settleGameDaysBetween(rawSaved, targetGameDay);

    return {
      baseExp: typeof d.baseExp === 'number' && d.baseExp >= 0 ? d.baseExp : 0,
      seasonRecord: settled.seasonRecord,
      habits,
      gridState: settled.gridState,
      streak: settled.streak,
      hasWonToday: settled.hasWonToday,
      hasPerfectDayToday: settled.hasPerfectDayToday,
      failures: normalizeFailures(d.failures),
      businessRecords: settled.businessRecords,
      todayStats: settled.todayStats,
      statRewards: settled.statRewards,
      tripleDoubleStreak: settled.tripleDoubleStreak,
      guidanceDaily: settled.guidanceDaily,
      lastPlayDate: settled.lastPlayDate,
      guidanceQuotes,
      failureTypes,
      statTargets,
      settlementTime,
    };
  } catch {
    return null;
  }
}

const INITIAL_GAME = loadPersistedGameState() ?? createFreshGameState();

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  
  // --- Game State ---
  const [baseExp, setBaseExp] = useState(INITIAL_GAME.baseExp);
  const [seasonRecord, setSeasonRecord] = useState(INITIAL_GAME.seasonRecord);
  
  // --- Bingo State ---
  const [habits, setHabits] = useState(INITIAL_GAME.habits);
  const [gridState, setGridState] = useState(INITIAL_GAME.gridState);
  const [tempHabits, setTempHabits] = useState([...INITIAL_GAME.habits]);
  const [streak, setStreak] = useState(INITIAL_GAME.streak);
  const [hasWonToday, setHasWonToday] = useState(INITIAL_GAME.hasWonToday);
  const [hasPerfectDayToday, setHasPerfectDayToday] = useState(INITIAL_GAME.hasPerfectDayToday);

  // --- Failures State ---
  const [failures, setFailures] = useState(INITIAL_GAME.failures);
  const [showCelebrate, setShowCelebrate] = useState(false);
  const [recentExpGain, setRecentExpGain] = useState(0);
  const [failureQuote, setFailureQuote] = useState("");
  const [editingFailureId, setEditingFailureId] = useState(null);
  const [draftFailureDateTime, setDraftFailureDateTime] = useState('');

  // --- Stats State ---
  const [businessRecords, setBusinessRecords] = useState(INITIAL_GAME.businessRecords);
  const [editingBusinessRecordIndex, setEditingBusinessRecordIndex] = useState(null);
  const [draftBusinessRecord, setDraftBusinessRecord] = useState({ contacts: 0, gatherings: 0, strangers: 0 });
  
  // --- Match Stats (Today) State ---
  const [todayStats, setTodayStats] = useState(INITIAL_GAME.todayStats);
  const [statRewards, setStatRewards] = useState(INITIAL_GAME.statRewards);
  const [tripleDoubleStreak, setTripleDoubleStreak] = useState(INITIAL_GAME.tripleDoubleStreak);
  
  const [guidanceQuotes, setGuidanceQuotes] = useState(INITIAL_GAME.guidanceQuotes);
  const [failureTypes, setFailureTypes] = useState(INITIAL_GAME.failureTypes);
  const [statTargets, setStatTargets] = useState(INITIAL_GAME.statTargets);
  const [settlementTime, setSettlementTime] = useState(INITIAL_GAME.settlementTime);
  const [iconPickerOpenId, setIconPickerOpenId] = useState(null);

  const [settingsEditingSection, setSettingsEditingSection] = useState(null);
  const [draftGuidanceQuotes, setDraftGuidanceQuotes] = useState([]);
  const [draftFailureTypes, setDraftFailureTypes] = useState([]);
  const [draftStatTargets, setDraftStatTargets] = useState(() => ({
    contacts: { ...INITIAL_GAME.statTargets.contacts },
    gatherings: { ...INITIAL_GAME.statTargets.gatherings },
    strangers: { ...INITIAL_GAME.statTargets.strangers },
  }));
  const [draftSettlementTime, setDraftSettlementTime] = useState(() => ({
    ...INITIAL_GAME.settlementTime,
  }));
  const failuresListEndRef = useRef(null);
  const guidanceListEndRef = useRef(null);
  const prevDraftFailureCount = useRef(0);
  const prevDraftGuidanceCount = useRef(0);

  const pressTimer = useRef(null);
  const isLongPress = useRef(false);
  const lastPlayDateRef = useRef(INITIAL_GAME.lastPlayDate);
  const settlementTimeRef = useRef(INITIAL_GAME.settlementTime);
  const gridStateRef = useRef(INITIAL_GAME.gridState);
  const todayStatsRef = useRef(INITIAL_GAME.todayStats);
  const businessRecordsRef = useRef(INITIAL_GAME.businessRecords);
  const seasonRecordRef = useRef(INITIAL_GAME.seasonRecord);
  const streakRef = useRef(INITIAL_GAME.streak);
  const tripleDoubleStreakRef = useRef(INITIAL_GAME.tripleDoubleStreak);
  const hasWonTodayRef = useRef(INITIAL_GAME.hasWonToday);
  const hasPerfectDayTodayRef = useRef(INITIAL_GAME.hasPerfectDayToday);
  const statRewardsRef = useRef(INITIAL_GAME.statRewards);
  const guidanceDailyRef = useRef(INITIAL_GAME.guidanceDaily);

  // --- Animation State ---
  const [showFullWinAnim, setShowFullWinAnim] = useState(false);
  const [showPerfectDayAnim, setShowPerfectDayAnim] = useState(false);
  const [showLevelUpAnim, setShowLevelUpAnim] = useState(false);
  const [levelUpData, setLevelUpData] = useState({ lv: 1, title: "", isNewTitle: false });
  const [prevLevel, setPrevLevel] = useState(null);
  const [prevLines, setPrevLines] = useState(() => initialCompletedLineCount(INITIAL_GAME.gridState));
  const [floatingTexts, setFloatingTexts] = useState([]);

  // --- 今日指引：每日抽一次 ---
  const [guidanceDaily, setGuidanceDaily] = useState(INITIAL_GAME.guidanceDaily);
  const [guidanceDrawing, setGuidanceDrawing] = useState(false);
  const [guidanceRevealNonce, setGuidanceRevealNonce] = useState(0);
  const guidanceDrawTimerRef = useRef(null);

  useEffect(() => {
    const gk = getGameDayKey(new Date(), settlementTime);
    setGuidanceDaily((prev) => (prev.dayKey === gk ? prev : { dayKey: gk, draws: [] }));
  }, [activeTab, settlementTime]);

  useEffect(() => {
    const gk = getGameDayKey(new Date(), settlementTime);
    if (guidanceDaily.dayKey === gk && guidanceDaily.draws.length === 0) {
      setGuidanceRevealNonce(0);
    }
  }, [guidanceDaily.dayKey, guidanceDaily.draws.length, settlementTime]);

  useEffect(() => {
    gridStateRef.current = gridState;
    todayStatsRef.current = todayStats;
    businessRecordsRef.current = businessRecords;
    seasonRecordRef.current = seasonRecord;
    streakRef.current = streak;
    tripleDoubleStreakRef.current = tripleDoubleStreak;
    hasWonTodayRef.current = hasWonToday;
    hasPerfectDayTodayRef.current = hasPerfectDayToday;
    statRewardsRef.current = statRewards;
    guidanceDailyRef.current = guidanceDaily;
    settlementTimeRef.current = settlementTime;
  });

  useEffect(() => {
    return () => {
      if (guidanceDrawTimerRef.current) clearTimeout(guidanceDrawTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const payload = {
      v: SAVE_VERSION,
      lastPlayDate: getGameDayKey(new Date(), settlementTime),
      baseExp,
      seasonRecord,
      habits,
      gridState,
      streak,
      hasWonToday,
      hasPerfectDayToday,
      failures,
      businessRecords,
      todayStats,
      statRewards,
      tripleDoubleStreak,
      guidanceDaily,
      guidanceQuotes,
      failureTypes,
      statTargets,
      settlementTime,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* 無痕模式或容量不足時略過 */
    }
  }, [
    baseExp,
    seasonRecord,
    habits,
    gridState,
    streak,
    hasWonToday,
    hasPerfectDayToday,
    failures,
    businessRecords,
    todayStats,
    statRewards,
    tripleDoubleStreak,
    guidanceDaily,
    guidanceQuotes,
    failureTypes,
    statTargets,
    settlementTime,
  ]);

  useEffect(() => {
    const runSettlement = () => {
      const target = getGameDayKey(new Date(), settlementTimeRef.current);
      if (lastPlayDateRef.current === target) return;
      const snap = {
        lastPlayDate: lastPlayDateRef.current,
        gridState: gridStateRef.current,
        todayStats: todayStatsRef.current,
        businessRecords: businessRecordsRef.current,
        seasonRecord: seasonRecordRef.current,
        streak: streakRef.current,
        tripleDoubleStreak: tripleDoubleStreakRef.current,
        hasWonToday: hasWonTodayRef.current,
        hasPerfectDayToday: hasPerfectDayTodayRef.current,
        statRewards: statRewardsRef.current,
        guidanceDaily: guidanceDailyRef.current,
      };
      const settled = settleGameDaysBetween(snap, target);
      setBusinessRecords(settled.businessRecords);
      setSeasonRecord(settled.seasonRecord);
      setStreak(settled.streak);
      setGridState(settled.gridState);
      setTodayStats(settled.todayStats);
      setHasWonToday(settled.hasWonToday);
      setHasPerfectDayToday(settled.hasPerfectDayToday);
      setStatRewards(settled.statRewards);
      setTripleDoubleStreak(settled.tripleDoubleStreak);
      setGuidanceDaily(settled.guidanceDaily);
      setPrevLines(initialCompletedLineCount(settled.gridState));
      lastPlayDateRef.current = settled.lastPlayDate;
    };
    const id = setInterval(runSettlement, 60_000);
    const onVis = () => {
      if (document.visibilityState === 'visible') runSettlement();
    };
    document.addEventListener('visibilitychange', onVis);
    runSettlement();
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [settlementTime]);

  useEffect(() => {
    setIconPickerOpenId(null);
  }, [activeTab]);

  useEffect(() => {
    if (!iconPickerOpenId) return;
    const onDocDown = (e) => {
      const wrap = e.target.closest?.('[data-settings-icon-picker]');
      if (wrap) return;
      setIconPickerOpenId(null);
    };
    document.addEventListener('mousedown', onDocDown);
    return () => document.removeEventListener('mousedown', onDocDown);
  }, [iconPickerOpenId]);

  useEffect(() => {
    if (activeTab !== 'settings') {
      setSettingsEditingSection(null);
      setIconPickerOpenId(null);
    }
  }, [activeTab]);

  useLayoutEffect(() => {
    if (settingsEditingSection !== 'failures') return;
    if (draftFailureTypes.length > prevDraftFailureCount.current) {
      failuresListEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    prevDraftFailureCount.current = draftFailureTypes.length;
  }, [draftFailureTypes.length, settingsEditingSection]);

  useLayoutEffect(() => {
    if (settingsEditingSection !== 'guidance') return;
    if (draftGuidanceQuotes.length > prevDraftGuidanceCount.current) {
      guidanceListEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    prevDraftGuidanceCount.current = draftGuidanceQuotes.length;
  }, [draftGuidanceQuotes.length, settingsEditingSection]);

  // --- Logic & Effects ---

  const addFloatingText = (x, y, text, type) => {
    const id = Date.now() + Math.random();
    setFloatingTexts(prev => [...prev, { id, x, y, text, type }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(item => item.id !== id));
    }, 1500); 
  };

  const bingoStats = useMemo(() => {
    let completedLines = 0;
    WIN_LINES.forEach(line => {
      if (gridState[line[0]] && gridState[line[1]] && gridState[line[2]]) {
        completedLines++;
      }
    });

    const stars = gridState.filter(Boolean).length;
    const isWin = stars === 9;
    const expToday = stars * 1 + (completedLines * 3) + (isWin ? 5 : 0);

    return { stars, completedLines, isWin, expToday };
  }, [gridState]);

  const totalExp = baseExp + bingoStats.expToday;
  const level = Math.floor(totalExp / 100) + 1;
  const expProgress = totalExp % 100;
  const currentTitle = getTitleByLevel(level);

  useEffect(() => {
    if (prevLevel === null) {
      setPrevLevel(level);
    } else if (level > prevLevel) {
      const oldTitle = getTitleByLevel(prevLevel);
      const isNewTitle = currentTitle !== oldTitle;
      
      setLevelUpData({ lv: level, title: currentTitle, isNewTitle });
      setShowLevelUpAnim(true);
      setPrevLevel(level);
      const timer = setTimeout(() => setShowLevelUpAnim(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [level, currentTitle, prevLevel]);

  useEffect(() => {
    if (bingoStats.completedLines > prevLines) {
      const diff = bingoStats.completedLines - prevLines;
      addFloatingText(window.innerWidth / 2, window.innerHeight * 0.35, `連線！ +${diff * 3} EXP`, 'line');
      setPrevLines(bingoStats.completedLines);
    } else if (bingoStats.completedLines < prevLines) {
      setPrevLines(bingoStats.completedLines);
    }
  }, [bingoStats.completedLines, prevLines]);

  const businessStats = useMemo(() => {
    const allRecords = [...businessRecords, todayStats];
    const days = businessRecords.length > 0 ? businessRecords.length + 1 : 1; 
    const totals = allRecords.reduce((acc, curr) => ({
      contacts: acc.contacts + (Number(curr.contacts) || 0),
      gatherings: acc.gatherings + (Number(curr.gatherings) || 0),
      strangers: acc.strangers + (Number(curr.strangers) || 0),
    }), { contacts: 0, gatherings: 0, strangers: 0 });

    const highest = allRecords.reduce((acc, curr) => ({
      contacts: Math.max(acc.contacts, Number(curr.contacts) || 0),
      gatherings: Math.max(acc.gatherings, Number(curr.gatherings) || 0),
      strangers: Math.max(acc.strangers, Number(curr.strangers) || 0),
    }), { contacts: 0, gatherings: 0, strangers: 0 });

    return {
      totals,
      avgs: {
        contacts: (totals.contacts / days).toFixed(1),
        gatherings: (totals.gatherings / days).toFixed(1),
        strangers: (totals.strangers / days).toFixed(1),
      },
      days,
      highest
    };
  }, [businessRecords, todayStats]);

  const milestoneCounts = useMemo(() => {
    const all = [...businessRecords, todayStats];
    return all.reduce(
      (acc, r) => {
        const m = getDayMilestones(r);
        if (m.doubleDouble) acc.doubleDouble += 1;
        if (m.tripleDouble) acc.tripleDouble += 1;
        return acc;
      },
      { doubleDouble: 0, tripleDouble: 0 }
    );
  }, [businessRecords, todayStats, statTargets]);

  useEffect(() => {
    if (bingoStats.isWin && !hasWonToday) {
      setHasWonToday(true);
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      setShowFullWinAnim(true);
      setTimeout(() => setShowFullWinAnim(false), 3000);
      
      if (MILESTONES[newStreak]) {
        const bonus = MILESTONES[newStreak];
        setBaseExp(prev => prev + bonus);
      }
    }
  }, [bingoStats.isWin, hasWonToday, streak]);

  useEffect(() => {
    if (bingoStats.isWin && statRewards.all && !hasPerfectDayToday) {
      setHasPerfectDayToday(true);
      setTimeout(() => {
          setBaseExp(prev => prev + 10);
          setShowPerfectDayAnim(true);
          setTimeout(() => setShowPerfectDayAnim(false), 4500);
      }, 3500);
    }
  }, [bingoStats.isWin, statRewards.all, hasPerfectDayToday]);

  const handlePointerDown = (type) => {
    isLongPress.current = false;
    pressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      setTodayStats(prev => {
        const newStats = { ...prev, [type]: 0 };
        syncStatRewards(newStats); 
        return newStats;
      });
      if (navigator.vibrate) navigator.vibrate(50);
    }, 600); 
  };

  const handlePointerUp = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  const handleStatClick = (type, e) => {
    if (isLongPress.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    setTodayStats(prev => {
      const newVal = prev[type] + 1;
      const newStats = { ...prev, [type]: newVal };
      syncStatRewards(newStats, x, y); 
      return newStats;
    });
  };

  const syncStatRewards = (newStats, eventX = window.innerWidth / 2, eventY = window.innerHeight * 0.4) => {
    let expChange = 0;
    let newRewards = { ...statRewards };
    let animTexts = [];

    const metC = newStats.contacts >= statTargets.contacts.target;
    const metG = newStats.gatherings >= statTargets.gatherings.target;
    const metS = newStats.strangers >= statTargets.strangers.target;
    const metCount = [metC, metG, metS].filter(Boolean).length;

    if (metC && !newRewards.contacts) { expChange += 1; newRewards.contacts = true; animTexts.push({ text: '聯絡達標！ +1 EXP', type: 'cell' }); }
    else if (!metC && newRewards.contacts) { expChange -= 1; newRewards.contacts = false; }

    if (metG && !newRewards.gatherings) { expChange += 1; newRewards.gatherings = true; animTexts.push({ text: '聚會達標！ +1 EXP', type: 'cell' }); }
    else if (!metG && newRewards.gatherings) { expChange -= 1; newRewards.gatherings = false; }

    if (metS && !newRewards.strangers) { expChange += 1; newRewards.strangers = true; animTexts.push({ text: '新朋友達標！ +1 EXP', type: 'cell' }); }
    else if (!metS && newRewards.strangers) { expChange -= 1; newRewards.strangers = false; }

    if (metCount >= 2 && !newRewards.doubleDouble) { expChange += 3; newRewards.doubleDouble = true; animTexts.push({ text: 'Double Double! +3 EXP', type: 'line' }); }
    else if (metCount < 2 && newRewards.doubleDouble) { expChange -= 3; newRewards.doubleDouble = false; }

    let newStreak = tripleDoubleStreak;
    let streakBonusToAlert = 0;

    if (metCount === 3 && !newRewards.all) {
      expChange += 10; newRewards.all = true; animTexts.push({ text: 'Triple Double達成！ +10 EXP', type: 'line' });
      newStreak += 1;
      setTripleDoubleStreak(newStreak);
      
      if (TRIPLE_MILESTONES[newStreak]) {
         streakBonusToAlert = TRIPLE_MILESTONES[newStreak];
         expChange += streakBonusToAlert;
      }
    } else if (metCount < 3 && newRewards.all) {
      expChange -= 10; newRewards.all = false;
      if (TRIPLE_MILESTONES[newStreak]) {
         expChange -= TRIPLE_MILESTONES[newStreak];
      }
      newStreak = Math.max(0, newStreak - 1);
      setTripleDoubleStreak(newStreak);
    }

    if (expChange !== 0) {
      setBaseExp(prev => prev + expChange);
      setStatRewards(newRewards);
    }

    animTexts.forEach((anim, idx) => {
      setTimeout(() => {
        if (anim.text.includes('Double')) {
           addFloatingText(window.innerWidth / 2, eventY - 30, anim.text, anim.type);
        } else {
           addFloatingText(eventX, eventY, anim.text, anim.type);
        }
      }, idx * 300);
    });

    if (streakBonusToAlert > 0) {
      setTimeout(() => alert(`太強了！連續 ${newStreak} 場達成大三元！獲得額外 ${streakBonusToAlert} EXP 獎勵！`), 800);
    }
  };

  const toggleGrid = (index, e) => {
    const newGrid = [...gridState];
    const isChecking = !newGrid[index];
    newGrid[index] = isChecking;
    setGridState(newGrid);

    if (isChecking && e) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top; 
      addFloatingText(x, y, "+1 EXP", "cell");
    }
  };

  const saveHabits = () => {
    setHabits(tempHabits);
  };

  const recordFailure = (typeObj, customText = "") => {
    const textToSave = customText || typeObj.label;
    const now = new Date();
    const day = getGameDayKey(now, settlementTime);
    setFailures([
      {
        id: `${now.getTime()}-${Math.random().toString(36).slice(2, 9)}`,
        label: typeObj.label,
        text: textToSave,
        exp: typeObj.exp,
        date: day,
        recordedAt: now.toISOString(),
      },
      ...failures,
    ]);
    
    const randomQuote = FAILURE_QUOTES[Math.floor(Math.random() * FAILURE_QUOTES.length)];
    setFailureQuote(randomQuote);
    
    setBaseExp(prev => prev + typeObj.exp);
    setRecentExpGain(typeObj.exp);
    setShowCelebrate(true);
    setTimeout(() => setShowCelebrate(false), 3000);
  };

  const removeFailure = (id) => {
    const item = failures.find((f) => f.id === id);
    if (!item) return;
    setFailures((prev) => prev.filter((f) => f.id !== id));
    setBaseExp((prev) => Math.max(0, prev - item.exp));
  };

  const calculateDayExp = (stats) => {
    let exp = 0;
    const c = stats.contacts >= statTargets.contacts.target;
    const g = stats.gatherings >= statTargets.gatherings.target;
    const s = stats.strangers >= statTargets.strangers.target;
    const count = [c, g, s].filter(Boolean).length;
    
    if (c) exp += 1;
    if (g) exp += 1;
    if (s) exp += 1;
    if (count >= 2) exp += 3;
    if (count === 3) exp += 10;
    return exp;
  };

  const getDayMilestones = (stats) => {
    const c = Number(stats.contacts) >= statTargets.contacts.target;
    const g = Number(stats.gatherings) >= statTargets.gatherings.target;
    const s = Number(stats.strangers) >= statTargets.strangers.target;
    const metCount = [c, g, s].filter(Boolean).length;
    return {
      doubleDouble: metCount >= 2,
      tripleDouble: metCount === 3,
    };
  };

  const updateHistory = (index, field, value) => {
    const oldRecord = businessRecords[index];
    const newRecord = { ...oldRecord, [field]: Number(value) || 0 };
    
    const oldExp = calculateDayExp(oldRecord);
    const newExp = calculateDayExp(newRecord);
    const expDiff = newExp - oldExp;

    const newRecords = [...businessRecords];
    newRecords[index] = newRecord;
    setBusinessRecords(newRecords);

    if (expDiff !== 0) {
      setBaseExp(prev => prev + expDiff);
    }
  };

  const guidanceTodayKey = getGameDayKey(new Date(), settlementTime);
  const guidanceDrawsToday = guidanceDaily.dayKey === guidanceTodayKey ? guidanceDaily.draws : [];
  const guidanceRemainingToday = Math.max(0, GUIDANCE_DRAWS_PER_DAY - guidanceDrawsToday.length);

  const drawTodayGuidance = () => {
    const today = getGameDayKey(new Date(), settlementTime);
    setGuidanceDaily((prev) => {
      const base = prev.dayKey === today ? prev : { dayKey: today, draws: [] };
      if (base.draws.length >= GUIDANCE_DRAWS_PER_DAY) return base;
      const pool = guidanceQuotes.map((q) => String(q).trim()).filter(Boolean);
      const quote =
        pool.length > 0
          ? pool[Math.floor(Math.random() * pool.length)]
          : '（請至「設定」新增指引內容）';
      return { ...base, draws: [...base.draws, quote] };
    });
  };

  const handleDrawTodayGuidance = () => {
    if (guidanceDrawing || guidanceDrawsToday.length > 0) return;
    setGuidanceDrawing(true);
    if (guidanceDrawTimerRef.current) clearTimeout(guidanceDrawTimerRef.current);
    guidanceDrawTimerRef.current = setTimeout(() => {
      drawTodayGuidance();
      setGuidanceDrawing(false);
      setGuidanceRevealNonce((n) => n + 1);
      guidanceDrawTimerRef.current = null;
    }, 1000);
  };

  const renderHome = () => {
    const cardStyle = getStyleByTitle(currentTitle);

    return (
      <div className="space-y-5 animate-fadeIn pb-6">
        {/* Player Profile / Level Card */}
        <div className={`bg-gradient-to-br ${cardStyle.bg} rounded-2xl p-4 shadow-lg text-white relative overflow-hidden transition-all duration-500`}>
          
          <div className="flex justify-between items-center mb-2 relative z-10">
             <span className="bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-black tracking-wider border border-white/10">
               LV.{level}
             </span>
          </div>

          <div className="relative z-10 mb-2">
            <h2 className={`text-3xl font-black bg-clip-text text-transparent bg-gradient-to-b ${cardStyle.text} leading-tight text-center tracking-wider drop-shadow-sm`}>
              {currentTitle}
            </h2>
          </div>

          <div className="w-full relative z-10">
              <div className="flex justify-between text-[10px] font-medium mb-1.5 text-white/80">
                <span>升級進度</span>
                <span>{expProgress} / 100 EXP</span>
              </div>
              <div className="h-1.5 w-full bg-black/30 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-white transition-all duration-700 ease-out"
                  style={{ width: `${expProgress}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
                <span className="bg-black/20 px-2.5 py-1 rounded-md text-[10px] text-white/90 border border-white/10">
                   本季戰績：{seasonRecord.wins}勝 {seasonRecord.losses}負
                </span>
                <span className="bg-indigo-500/25 px-2.5 py-1 rounded-md text-[10px] text-indigo-100 border border-indigo-400/30 flex items-center gap-1">
                   <Sparkles size={12} className="text-indigo-200" /> 學習紀錄：{failures.length} 筆
                </span>
              </div>
          </div>
        </div>

        {/* 今日指引（獨立匡格） */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-indigo-50 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100">
                <BookOpen size={18} className="text-indigo-600" />
              </div>
              <p className="text-sm font-black tracking-wide text-gray-800">今日指引</p>
            </div>
            {guidanceRemainingToday > 0 && !guidanceDrawsToday.length && !guidanceDrawing && (
              <span className="shrink-0 text-[10px] font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-100">
                可抽
              </span>
            )}
          </div>

          {guidanceDrawing ? (
            <div className="anim-guidance-draw-panel relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 px-4 py-8">
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-30">
                <div className="h-36 w-36 shrink-0 rounded-full bg-[conic-gradient(from_0deg,transparent,rgba(99,102,241,0.35),transparent)] anim-guidance-orbit" />
              </div>
              <div className="relative flex flex-col items-center gap-3">
                <div className="relative flex h-14 w-14 items-center justify-center">
                  <Sparkles size={36} className="relative z-10 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)] anim-guidance-sparkle" />
                  <Sparkles size={18} className="absolute -right-1 top-0 text-indigo-400/70 anim-guidance-sparkle-delay" />
                  <Sparkles size={14} className="absolute -left-0.5 bottom-0 text-amber-300/80 anim-guidance-sparkle-delay2" />
                </div>
                <p className="text-center text-xs font-semibold text-slate-700 anim-guidance-shimmer">
                  正在抽選…
                </p>
              </div>
            </div>
          ) : guidanceDrawsToday.length > 0 ? (
            <div
              key={guidanceRevealNonce}
              className={`rounded-2xl border border-slate-100 bg-white p-4 shadow-sm ${guidanceRevealNonce > 0 ? 'anim-guidance-reveal' : ''}`}
            >
              <p className="text-center text-sm font-bold leading-relaxed text-slate-800">
                「{guidanceDrawsToday[0]}」
              </p>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleDrawTodayGuidance}
              className="group relative w-full overflow-hidden rounded-2xl border border-indigo-100 bg-indigo-50 py-3.5 text-center font-black text-indigo-700 shadow-sm transition-all active:scale-[0.99] md:hover:bg-indigo-100/70"
            >
              <span className="relative flex items-center justify-center gap-2">
                <Sparkles size={18} className="text-amber-500" />
                抽取今日指引
              </span>
            </button>
          )}
        </div>

        {/* --- 今日比賽數據區塊 --- */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-indigo-50 flex flex-col gap-3">
           <div className="flex justify-between items-end mb-1">
              <div>
                <h2 className="text-xl font-bold text-gray-800">今日比賽數據</h2>
                <p className="text-xs text-gray-500 mt-1">點擊增加，長按可歸零</p>
              </div>
              <div className="bg-orange-50 text-orange-700 px-3 py-1.5 rounded-xl font-bold flex flex-col items-end">
                <span className="text-[10px] text-orange-400">連續大三元場次</span>
                <span className="flex items-center gap-1 text-sm"><Zap size={14} className="fill-orange-400 text-orange-400"/> {tripleDoubleStreak} 場</span>
              </div>
           </div>

           {/* Double Double / 大三元 標示 */}
           {(statRewards.all || statRewards.doubleDouble) && (
             <div className="mb-2 mt-1 animate-fadeIn">
                {statRewards.all ? (
                  <p className="text-amber-600 text-sm font-bold flex items-center justify-center gap-1 bg-amber-50 py-1.5 rounded-lg border border-amber-100">
                    <Sparkles size={16} /> 大三元達成！
                  </p>
                ) : (
                  <p className="text-blue-600 text-sm font-bold flex items-center justify-center gap-1 bg-blue-50 py-1.5 rounded-lg border border-blue-100">
                    <Zap size={16} /> Double Double!
                  </p>
                )}
             </div>
           )}
           
           <div className="grid grid-cols-3 gap-3 text-center">
              <button 
                onPointerDown={() => handlePointerDown('contacts')} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} onContextMenu={e => e.preventDefault()} onClick={(e) => handleStatClick('contacts', e)}
                className="bg-emerald-50 md:hover:bg-emerald-100 active:scale-95 transition-all p-3 rounded-2xl flex flex-col items-center border border-emerald-100 select-none shadow-sm relative"
              >
                <span className="text-xs font-bold text-emerald-700 mb-1 line-clamp-2 min-h-[2rem]">{statTargets.contacts.label}</span>
                <span className="text-2xl font-black text-emerald-600 leading-none">{todayStats.contacts}</span>
                <span className="text-[10px] text-emerald-400 mt-1">/ {statTargets.contacts.target}</span>
              </button>
              
              <button 
                onPointerDown={() => handlePointerDown('gatherings')} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} onContextMenu={e => e.preventDefault()} onClick={(e) => handleStatClick('gatherings', e)}
                className="bg-blue-50 md:hover:bg-blue-100 active:scale-95 transition-all p-3 rounded-2xl flex flex-col items-center border border-blue-100 select-none shadow-sm relative"
              >
                <span className="text-xs font-bold text-blue-700 mb-1 line-clamp-2 min-h-[2rem]">{statTargets.gatherings.label}</span>
                <span className="text-2xl font-black text-blue-600 leading-none">{todayStats.gatherings}</span>
                <span className="text-[10px] text-blue-400 mt-1">/ {statTargets.gatherings.target}</span>
              </button>
              
              <button 
                onPointerDown={() => handlePointerDown('strangers')} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} onContextMenu={e => e.preventDefault()} onClick={(e) => handleStatClick('strangers', e)}
                className="bg-purple-50 md:hover:bg-purple-100 active:scale-95 transition-all p-3 rounded-2xl flex flex-col items-center border border-purple-100 select-none shadow-sm relative"
              >
                <span className="text-xs font-bold text-purple-700 mb-1 line-clamp-2 min-h-[2rem]">{statTargets.strangers.label}</span>
                <span className="text-2xl font-black text-purple-600 leading-none">{todayStats.strangers}</span>
                <span className="text-[10px] text-purple-400 mt-1">/ {statTargets.strangers.target}</span>
              </button>
           </div>
        </div>

        {/* 整合至首頁的 今日比賽 */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-indigo-50 flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-800">今日比賽</h2>
              <p className="text-gray-500 text-xs mt-0.5">達成全部目標即獲勝</p>
            </div>
            <div className="bg-orange-50 text-orange-700 px-3 py-1.5 rounded-xl font-bold flex flex-col items-end">
              <span className="text-[10px] text-orange-400">連勝場次</span>
              <span className="flex items-center gap-1 text-sm"><Trophy size={14} className="text-orange-500"/> {streak} 勝</span>
            </div>
          </div>

          {bingoStats.isWin && (
             <p className="text-green-600 text-sm font-bold flex items-center justify-center gap-1 bg-green-50 py-1.5 rounded-lg border border-green-100">
               <Sparkles size={16}/> 恭喜贏下今日比賽！
             </p>
          )}

          <div className="grid grid-cols-3 gap-2 md:gap-3 relative mt-1">
            {habits.map((habit, index) => (
              <div 
                key={index}
                onClick={(e) => toggleGrid(index, e)}
                className={`
                  relative aspect-square rounded-2xl flex items-center justify-center p-2 text-center transition-all duration-300 cursor-pointer select-none
                  ${gridState[index] 
                    ? 'bg-indigo-50 text-indigo-700 border-2 border-indigo-300 shadow-sm scale-95' 
                    : 'bg-gray-50 md:hover:bg-indigo-50 text-gray-700 border border-gray-100'}
                `}
              >
                <>
                  <span className="text-xs md:text-sm font-medium z-10 break-words w-full line-clamp-3 leading-tight">{habit}</span>
                  {gridState[index] && (
                    <div className="absolute top-2 right-2 text-indigo-400">
                      <Check size={16} />
                    </div>
                  )}
                </>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderFailures = () => (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-sky-50 via-indigo-50 to-violet-50 rounded-3xl p-6 text-center border border-indigo-100 relative overflow-hidden">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">學習紀錄</h2>
        <p className="text-gray-600 text-sm mb-3 leading-relaxed px-1">
          失敗為成功之母，每次失敗都是一次學習，把它們記錄下來，賺取經驗值！
        </p>
        <div className="flex justify-center mb-4">
           <span className="bg-white text-indigo-700 font-bold px-4 py-1.5 rounded-full text-sm flex items-center gap-1.5 shadow-sm border border-indigo-100">
             <Sparkles size={16} className="text-amber-500" /> 累計紀錄：{failures.length} 次
           </span>
        </div>
        
        {showCelebrate && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center animate-fadeIn p-6">
            <Sparkles size={40} className="text-amber-500 mb-3" />
            <h3 className="text-lg font-bold text-indigo-800 mb-2 leading-relaxed">「{failureQuote}」</h3>
            <p className="font-black text-2xl text-amber-500 mt-1">+{recentExpGain} EXP</p>
          </div>
        )}

        {failureTypes.length === 0 && (
          <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-xl py-3 px-3 mb-4">
            尚未設定快捷按鈕，請至「設定」新增。
          </p>
        )}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {failureTypes.map((type) => {
            const IconComponent = ICON_MAP[type.iconKey] || Mail;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => recordFailure({ label: type.label, exp: type.exp })}
                className="bg-white md:hover:bg-indigo-50 active:scale-95 transition-all p-3 rounded-xl border border-indigo-100 shadow-sm flex flex-col items-center justify-center gap-1"
              >
                <div className="text-indigo-500 mb-1"><IconComponent size={24} /></div>
                <span className="text-xs font-bold text-gray-700 leading-snug">{type.label}</span>
                <span className="text-[10px] text-amber-600 font-bold">+{type.exp} EXP</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-sm border border-indigo-50">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-black text-gray-800">記錄列表</p>
        </div>
        {failures.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            尚無紀錄
          </p>
        ) : (
          <ul className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
            {failures.map((f) => (
              <li
                key={f.id}
                className="flex items-start gap-2 bg-white rounded-2xl border border-slate-100 px-3 py-2.5 shadow-sm"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-indigo-500 font-mono tabular-nums">
                    {formatFailureRecordedAt(f.recordedAt)}
                  </p>
                  <p className="text-sm font-bold text-gray-800 mt-0.5 break-words">{f.text}</p>
                  <p className="text-[10px] text-amber-600 font-bold mt-1">
                    +{f.exp} EXP · {f.label}
                  </p>
                  {editingFailureId === f.id && (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <input
                        type="datetime-local"
                        step={60}
                        value={draftFailureDateTime}
                        onChange={(e) => setDraftFailureDateTime(e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg px-2 py-1 text-slate-700"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const nextIso = localMinuteInputValueToIso(draftFailureDateTime);
                          if (!nextIso) return;
                          const nextDate = nextIso.split('T')[0];
                          setFailures((prev) =>
                            prev.map((x) =>
                              x.id === f.id
                                ? {
                                    ...x,
                                    date: nextDate,
                                    recordedAt: nextIso,
                                  }
                                : x
                            )
                          );
                          setEditingFailureId(null);
                          setDraftFailureDateTime('');
                        }}
                        className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-white md:hover:bg-slate-700"
                      >
                        儲存
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingFailureId(null);
                          setDraftFailureDateTime('');
                        }}
                        className="text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 md:hover:bg-slate-50"
                      >
                        取消
                      </button>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (editingFailureId === f.id) {
                      setEditingFailureId(null);
                      setDraftFailureDateTime('');
                      return;
                    }
                    setEditingFailureId(f.id);
                    setDraftFailureDateTime(isoToLocalMinuteInputValue(f.recordedAt));
                  }}
                  className="shrink-0 p-2 rounded-lg text-gray-400 md:hover:text-slate-700 md:hover:bg-slate-100 transition-colors"
                  aria-label="修正"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => removeFailure(f.id)}
                  className="shrink-0 p-2 rounded-lg text-gray-400 md:hover:text-rose-600 md:hover:bg-rose-50 transition-colors"
                  aria-label="刪除"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  const renderStats = () => {
    return (
      <div className="space-y-6 animate-fadeIn pb-8">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4">
          <p className="text-xs text-slate-500 mb-2">本季目前戰績</p>
          <p className="text-2xl font-bold text-slate-800 tabular-nums">
            {seasonRecord.wins} 勝 <span className="text-slate-300 font-normal">·</span> {seasonRecord.losses} 負
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
              <p className="text-[10px] text-slate-500 font-bold mb-0.5">累積大三元</p>
              <p className="text-lg font-black text-slate-800 tabular-nums">{milestoneCounts.tripleDouble}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
              <p className="text-[10px] text-slate-500 font-bold mb-0.5">累積 Double Double</p>
              <p className="text-lg font-black text-slate-800 tabular-nums">{milestoneCounts.doubleDouble}</p>
            </div>
          </div>
        </div>

        {/* 本季平均數據 (移至上方, 最醒目) */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 shadow-lg text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Crosshair size={80} />
          </div>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 relative z-10">
            <Crosshair size={20} className="text-indigo-300"/> 本季平均數據
          </h3>
          <div className="grid grid-cols-3 gap-2 text-center divide-x divide-white/20 relative z-10">
            <div>
              <p className="text-xs text-indigo-200 mb-1 line-clamp-2 min-h-[2rem]">{statTargets.contacts.label}</p>
              <p className="text-3xl font-black">{businessStats.avgs.contacts}</p>
            </div>
            <div>
              <p className="text-xs text-indigo-200 mb-1 line-clamp-2 min-h-[2rem]">{statTargets.gatherings.label}</p>
              <p className="text-3xl font-black">{businessStats.avgs.gatherings}</p>
            </div>
            <div>
              <p className="text-xs text-indigo-200 mb-1 line-clamp-2 min-h-[2rem]">{statTargets.strangers.label}</p>
              <p className="text-3xl font-black">{businessStats.avgs.strangers}</p>
            </div>
          </div>
        </div>

        {/* 本季累積數據面板 (顏色變淡) */}
        <div className="bg-blue-50 rounded-3xl p-5 shadow-sm border border-blue-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-5 text-blue-900">
            <Award size={80} />
          </div>
          <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2 relative z-10">
            <TrendingUp size={18} className="text-blue-500" /> 本季累積數據
          </h3>
          <div className="grid grid-cols-3 gap-3 text-center relative z-10 divide-x divide-blue-200">
            <div>
              <p className="text-xs text-blue-600 mb-1 line-clamp-2 min-h-[2rem]">{statTargets.contacts.label}</p>
              <p className="text-2xl font-black text-blue-900">{businessStats.totals.contacts}</p>
              <p className="text-[10px] text-blue-500 mt-1 bg-white rounded-full inline-block px-2 py-0.5 border border-blue-100 whitespace-nowrap">最高: {businessStats.highest.contacts}</p>
            </div>
            <div>
              <p className="text-xs text-blue-600 mb-1 line-clamp-2 min-h-[2rem]">{statTargets.gatherings.label}</p>
              <p className="text-2xl font-black text-blue-900">{businessStats.totals.gatherings}</p>
              <p className="text-[10px] text-blue-500 mt-1 bg-white rounded-full inline-block px-2 py-0.5 border border-blue-100 whitespace-nowrap">最高: {businessStats.highest.gatherings}</p>
            </div>
            <div>
              <p className="text-xs text-blue-600 mb-1 line-clamp-2 min-h-[2rem]">{statTargets.strangers.label}</p>
              <p className="text-2xl font-black text-blue-900">{businessStats.totals.strangers}</p>
              <p className="text-[10px] text-blue-500 mt-1 bg-white rounded-full inline-block px-2 py-0.5 border border-blue-100 whitespace-nowrap">最高: {businessStats.highest.strangers}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-gray-700 mb-3 ml-2 flex items-center gap-2">
            <BarChart2 size={18} className="text-blue-500" /> 歷史紀錄
          </h3>
          <div className="space-y-2">
            {[...businessRecords].reverse().map((record, index) => {
              const realIndex = businessRecords.length - 1 - index;
              const isEditing = editingBusinessRecordIndex === realIndex;
              return (
              <div key={realIndex} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex justify-between items-center md:hover:bg-blue-50/50 transition-colors">
                <span className="text-sm font-bold text-gray-500 w-24">{record.date}</span>
                <div className="flex items-center gap-2 text-sm">
                  <span className="flex items-center gap-1 text-emerald-600">
                    <MessageCircle size={14}/> 
                    <input 
                      type="number"
                      min="0"
                      value={isEditing ? draftBusinessRecord.contacts : record.contacts}
                      disabled={!isEditing}
                      onChange={e => setDraftBusinessRecord((p) => ({ ...p, contacts: Number(e.target.value) || 0 }))}
                      className={`w-10 h-7 border rounded text-center outline-none font-bold tabular-nums ${isEditing ? 'bg-emerald-50 border-emerald-100 focus:ring-1 focus:ring-emerald-400' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                    />
                  </span>
                  <span className="flex items-center gap-1 text-blue-600">
                    <Users size={14}/> 
                    <input 
                      type="number"
                      min="0"
                      value={isEditing ? draftBusinessRecord.gatherings : record.gatherings}
                      disabled={!isEditing}
                      onChange={e => setDraftBusinessRecord((p) => ({ ...p, gatherings: Number(e.target.value) || 0 }))}
                      className={`w-10 h-7 border rounded text-center outline-none font-bold tabular-nums ${isEditing ? 'bg-blue-50 border-blue-100 focus:ring-1 focus:ring-blue-400' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                    />
                  </span>
                  <span className="flex items-center gap-1 text-purple-600">
                    <TrendingUp size={14}/> 
                    <input 
                      type="number"
                      min="0"
                      value={isEditing ? draftBusinessRecord.strangers : record.strangers}
                      disabled={!isEditing}
                      onChange={e => setDraftBusinessRecord((p) => ({ ...p, strangers: Number(e.target.value) || 0 }))}
                      className={`w-10 h-7 border rounded text-center outline-none font-bold tabular-nums ${isEditing ? 'bg-purple-50 border-purple-100 focus:ring-1 focus:ring-purple-400' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                    />
                  </span>
                </div>
                <div className="ml-2 flex items-center gap-1">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          updateHistory(realIndex, 'contacts', draftBusinessRecord.contacts);
                          updateHistory(realIndex, 'gatherings', draftBusinessRecord.gatherings);
                          updateHistory(realIndex, 'strangers', draftBusinessRecord.strangers);
                          setEditingBusinessRecordIndex(null);
                        }}
                        className="p-2 rounded-lg text-slate-600 md:hover:bg-slate-100 md:hover:text-slate-800"
                        aria-label="儲存"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingBusinessRecordIndex(null);
                          setDraftBusinessRecord({ contacts: 0, gatherings: 0, strangers: 0 });
                        }}
                        className="p-2 rounded-lg text-slate-400 md:hover:bg-slate-100 md:hover:text-slate-700"
                        aria-label="取消"
                      >
                        <RefreshCw size={18} />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingBusinessRecordIndex(realIndex);
                        setDraftBusinessRecord({
                          contacts: Number(record.contacts) || 0,
                          gatherings: Number(record.gatherings) || 0,
                          strangers: Number(record.strangers) || 0,
                        });
                      }}
                      className="p-2 rounded-lg text-slate-400 md:hover:bg-slate-100 md:hover:text-slate-700"
                      aria-label="修正"
                    >
                      <Edit3 size={18} />
                    </button>
                  )}
                </div>
              </div>
            )})}
          </div>
        </div>
      </div>
    );
  };

  const beginSettingsEdit = (section) => {
    if (settingsEditingSection && settingsEditingSection !== section) {
      if (!window.confirm('目前有未儲存的編輯，切換區塊將放棄變更。確定嗎？')) return;
    }
    setIconPickerOpenId(null);
    if (section === 'guidance') {
      const next = [...guidanceQuotes];
      prevDraftGuidanceCount.current = next.length;
      setDraftGuidanceQuotes(next);
    }
    if (section === 'failures') {
      const copy = failureTypes.map((ft) => ({ ...ft }));
      prevDraftFailureCount.current = copy.length;
      setDraftFailureTypes(copy);
    }
    if (section === 'stats') {
      setDraftStatTargets({
        contacts: { ...statTargets.contacts },
        gatherings: { ...statTargets.gatherings },
        strangers: { ...statTargets.strangers },
      });
    }
    if (section === 'settlement') {
      setDraftSettlementTime({ ...settlementTime });
    }
    if (section === 'habits') {
      setTempHabits([...habits]);
    }
    setSettingsEditingSection(section);
  };

  const cancelSettingsEdit = () => {
    setSettingsEditingSection(null);
    setIconPickerOpenId(null);
  };

  const saveGuidanceSection = () => {
    setGuidanceQuotes([...draftGuidanceQuotes]);
    cancelSettingsEdit();
  };

  const saveFailuresSection = () => {
    setFailureTypes(normalizeFailureTypesData(draftFailureTypes));
    cancelSettingsEdit();
  };

  const saveStatsSection = () => {
    if (!window.confirm('確定要儲存今日比賽數據設定嗎？')) return;
    setStatTargets(normalizeStatTargets(draftStatTargets));
    cancelSettingsEdit();
  };

  const saveSettlementSection = () => {
    setSettlementTime(normalizeSettlementTime(draftSettlementTime));
    cancelSettingsEdit();
  };

  const saveHabitsSection = () => {
    const next = tempHabits.map((h) => String(h ?? '').trim()).slice(0, 9);
    const filled = [...next];
    while (filled.length < 9) filled.push('');
    setHabits(filled);
    setTempHabits(filled);
    cancelSettingsEdit();
  };

  const updateDraftStatTarget = (key, field, val) => {
    setDraftStatTargets((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: field === 'target' ? Math.max(1, Math.min(99999, Number(val) || 1)) : String(val).slice(0, 32),
      },
    }));
  };

  const renderSettings = () => {
    const settlementDisplay = `${String(settlementTime.hour).padStart(2, '0')}:${String(settlementTime.minute).padStart(2, '0')}`;
    const draftTimeInputValue = `${String(draftSettlementTime.hour).padStart(2, '0')}:${String(draftSettlementTime.minute).padStart(2, '0')}`;

    const editActions = (onSave) => (
      <div className="mt-4 flex gap-2 justify-end border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={cancelSettingsEdit}
          className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 md:hover:bg-slate-50"
        >
          取消
        </button>
        <button
          type="button"
          onClick={onSave}
          className="px-4 py-2 text-sm rounded-lg bg-slate-800 text-white md:hover:bg-slate-700"
        >
          儲存
        </button>
      </div>
    );

    const sectionHeader = (title, sectionKey) => (
      <div className="flex items-start justify-between gap-2 mb-3">
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
        {settingsEditingSection !== sectionKey && (
          <button
            type="button"
            onClick={() => beginSettingsEdit(sectionKey)}
            className="shrink-0 p-2 rounded-lg text-slate-400 md:hover:bg-slate-100 md:hover:text-slate-700"
            aria-label="修正"
          >
            <Edit3 size={18} />
          </button>
        )}
      </div>
    );

    return (
      <div className="space-y-5 animate-fadeIn pb-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          {sectionHeader('今日指引', 'guidance')}
          {settingsEditingSection === 'guidance' ? (
            <>
              <div className="max-h-[52vh] overflow-y-auto pr-1">
                <ul className="space-y-2">
                  {draftGuidanceQuotes.map((q, i) => (
                    <li key={`gq-edit-${i}`} className="flex gap-2">
                      <textarea
                        value={q}
                        onChange={(e) => {
                          const next = [...draftGuidanceQuotes];
                          next[i] = e.target.value;
                          setDraftGuidanceQuotes(next);
                        }}
                        className="flex-1 text-sm rounded-lg border border-slate-200 p-2 min-h-[52px] text-slate-800"
                        rows={2}
                      />
                      <button
                        type="button"
                        onClick={() => setDraftGuidanceQuotes(draftGuidanceQuotes.filter((_, j) => j !== i))}
                        className="shrink-0 text-slate-400 p-2 rounded-lg md:hover:bg-slate-50 md:hover:text-rose-500"
                        aria-label="刪除"
                      >
                        <Trash2 size={18} />
                      </button>
                    </li>
                  ))}
                  <div ref={guidanceListEndRef} className="h-px w-full" aria-hidden />
                </ul>
                <button
                  type="button"
                  onClick={() => setDraftGuidanceQuotes([...draftGuidanceQuotes, ''])}
                  className="mt-3 w-full py-2 rounded-lg border border-dashed border-slate-300 text-sm text-slate-600 md:hover:bg-slate-50"
                >
                  <Plus size={16} className="inline mr-1 -mt-0.5" /> 新增
                </button>
              </div>
              {editActions(saveGuidanceSection)}
            </>
          ) : (
            <div />
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          {sectionHeader('學習紀錄', 'failures')}
          {settingsEditingSection === 'failures' ? (
            <>
              <div className="max-h-[52vh] overflow-y-auto pr-1 space-y-3">
                {draftFailureTypes.map((ft, i) => {
                  const IconComp = ICON_MAP[ft.iconKey] || Mail;
                  return (
                    <div key={ft.id} className="flex gap-2 items-start border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                      <div className="relative shrink-0" data-settings-icon-picker>
                        <button
                          type="button"
                          onClick={() => setIconPickerOpenId(iconPickerOpenId === ft.id ? null : ft.id)}
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 md:hover:bg-slate-50"
                          aria-label="選擇圖示"
                        >
                          <IconComp size={20} />
                        </button>
                        {iconPickerOpenId === ft.id && (
                          <div
                            className="absolute z-[60] left-0 top-full mt-1 w-[220px] rounded-xl border border-slate-200 bg-white p-2 shadow-lg grid grid-cols-5 gap-1"
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            {FAILURE_ICON_KEYS.map((k) => {
                              const Ic = ICON_MAP[k];
                              return (
                                <button
                                  key={k}
                                  type="button"
                                  className={`rounded-md p-2 md:hover:bg-slate-100 ${ft.iconKey === k ? 'ring-1 ring-indigo-400 bg-indigo-50' : ''}`}
                                  onClick={() => {
                                    const next = [...draftFailureTypes];
                                    next[i] = { ...ft, iconKey: k };
                                    setDraftFailureTypes(next);
                                    setIconPickerOpenId(null);
                                  }}
                                >
                                  <Ic size={18} className="mx-auto text-slate-700" />
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <input
                          value={ft.label}
                          onChange={(e) => {
                            const next = [...draftFailureTypes];
                            next[i] = { ...ft, label: e.target.value };
                            setDraftFailureTypes(next);
                          }}
                          className="w-full text-sm border border-slate-200 rounded-lg px-2 py-1.5 text-slate-800"
                          placeholder="名稱"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">EXP</span>
                          <input
                            type="number"
                            min={0}
                            max={99999}
                            value={ft.exp}
                            onChange={(e) => {
                              const next = [...draftFailureTypes];
                              next[i] = { ...ft, exp: Math.max(0, Number(e.target.value) || 0) };
                              setDraftFailureTypes(next);
                            }}
                            className="w-20 text-sm border border-slate-200 rounded-lg px-2 py-1 text-center"
                          />
                          <button
                            type="button"
                            onClick={() => setDraftFailureTypes(draftFailureTypes.filter((_, j) => j !== i))}
                            className="ml-auto text-slate-400 p-1.5 rounded-lg md:hover:bg-rose-50 md:hover:text-rose-500"
                            aria-label="刪除"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={failuresListEndRef} className="h-px w-full" aria-hidden />
                <button
                  type="button"
                  onClick={() =>
                    setDraftFailureTypes([
                      ...draftFailureTypes,
                      { id: `ft-${Date.now()}`, label: '新項目', exp: 1, iconKey: 'Mail' },
                    ])
                  }
                  className="mt-3 w-full py-2 rounded-lg border border-dashed border-slate-300 text-sm text-slate-600 md:hover:bg-slate-50"
                >
                  <Plus size={16} className="inline mr-1 -mt-0.5" /> 新增
                </button>
              </div>
              {editActions(saveFailuresSection)}
            </>
          ) : (
            <div />
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          {sectionHeader('今日比賽', 'habits')}
          {settingsEditingSection === 'habits' ? (
            <>
              <div className="max-h-[52vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-3 gap-2">
                {tempHabits.map((h, i) => (
                  <textarea
                    key={`hb-${i}`}
                    value={h}
                    onChange={(e) => {
                      const next = [...tempHabits];
                      next[i] = e.target.value;
                      setTempHabits(next);
                    }}
                    rows={2}
                    className="rounded-xl border border-slate-200 p-2 text-xs text-slate-800 resize-none min-h-[56px]"
                    placeholder=""
                  />
                ))}
                </div>
              </div>
              {editActions(saveHabitsSection)}
            </>
          ) : (
            <div />
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          {sectionHeader('今日比賽數據', 'stats')}
          <p className="text-xs text-slate-500 mb-3">首頁三格按鈕的顯示名稱與達標數字。</p>
          {settingsEditingSection === 'stats' ? (
            <>
              <div className="max-h-[52vh] overflow-y-auto pr-1">
                {(['contacts', 'gatherings', 'strangers']).map((key) => (
                  <div key={key} className="flex gap-2 items-center mb-2 last:mb-0">
                    <input
                      value={draftStatTargets[key].label}
                      onChange={(e) => updateDraftStatTarget(key, 'label', e.target.value)}
                      className="flex-1 text-sm border border-slate-200 rounded-lg px-2 py-1.5"
                      placeholder=""
                    />
                    <input
                      type="number"
                      min={1}
                      max={99999}
                      value={draftStatTargets[key].target}
                      onChange={(e) => updateDraftStatTarget(key, 'target', e.target.value)}
                      className="w-20 text-sm border border-slate-200 rounded-lg px-2 py-1.5 text-center"
                    />
                  </div>
                ))}
              </div>
              {editActions(saveStatsSection)}
            </>
          ) : (
            <div />
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          {sectionHeader('每日結算時間', 'settlement')}
          <p className="text-xs text-slate-500 mb-2">本地時間到點後切換遊戲日並結算。</p>
          {settingsEditingSection === 'settlement' ? (
            <>
              <div className="max-h-[52vh] overflow-y-auto pr-1">
                <input
                  type="time"
                  value={draftTimeInputValue}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (!v) return;
                    const [hh, mm] = v.split(':').map(Number);
                    setDraftSettlementTime({ hour: hh, minute: Number.isFinite(mm) ? mm : 0 });
                  }}
                  className="text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>
              {editActions(saveSettlementSection)}
            </>
          ) : (
            <div />
          )}
        </div>
      </div>
    );
  };

  // --- Main Layout ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <div className="max-w-md mx-auto bg-slate-50 min-h-screen shadow-xl relative pb-20 overflow-x-hidden">
        
        {/* Header */}
        <header className="pt-10 pb-4 px-6 bg-white rounded-b-3xl shadow-sm z-10 relative">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center gap-2">
              <Gem size={24} className="text-indigo-600" />
              鑽石之路
            </h1>
            <div className="text-right">
              <span className="text-xs text-gray-500 block">獎銜</span>
              <span className="font-bold text-indigo-700 text-sm bg-indigo-50 px-2 py-0.5 rounded-md">{currentTitle}</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-4">
          {activeTab === 'home' && renderHome()}
          {activeTab === 'failures' && renderFailures()}
          {activeTab === 'stats' && renderStats()}
          {activeTab === 'settings' && renderSettings()}
        </main>

        {/* --- Global Animations Overlays --- */}
        
        {/* 浮動文字動畫 (格子的+1 / 連線的+3 / 各項達標) */}
        {floatingTexts.map(anim => (
          <div
            key={anim.id}
            className={`fixed z-[120] pointer-events-none whitespace-nowrap ${
              anim.type === 'line' ? 'anim-float-text-line' : 'anim-float-text-cell'
            }`}
            style={{ left: anim.x, top: anim.y }}
          >
            {anim.text}
          </div>
        ))}

        {/* --- 3. 全壘打 比賽勝利 動畫 --- */}
        {showFullWinAnim && (
          <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="anim-bounce-pop flex flex-col items-center">
                  <div className="relative">
                     <Trophy size={120} className="text-yellow-400 fill-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.8)]" />
                     <Sparkles size={40} className="absolute -top-4 -right-4 text-white animate-pulse" />
                     <Sparkles size={30} className="absolute -bottom-2 -left-4 text-amber-200 animate-pulse" />
                  </div>
                  <h2 className="text-6xl font-black text-white mt-4 tracking-widest drop-shadow-md">WIN!</h2>
                  <p className="text-lg font-bold text-yellow-300 mt-3 bg-black/40 px-5 py-1.5 rounded-full border border-yellow-500/50">今日比賽獲得勝利</p>
              </div>
          </div>
        )}

        {/* --- 3.5 完美的一天 (所有目標達成) 動畫 --- */}
        {showPerfectDayAnim && (
          <div className="fixed inset-0 z-[110] pointer-events-none flex items-center justify-center bg-indigo-900/80 backdrop-blur-sm">
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                 <div className="w-[150vw] h-[150vw] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(255,255,255,0.2)_350deg,transparent_360deg)] anim-spin-slow opacity-60 rounded-full"></div>
              </div>
              <div className="relative z-10 anim-bounce-pop flex flex-col items-center text-center px-4">
                  <Trophy size={160} className="text-amber-400 fill-amber-400 drop-shadow-[0_0_60px_rgba(251,191,36,1)]" />
                  <h2 className="text-4xl md:text-5xl font-black text-white mt-6 tracking-wider drop-shadow-lg leading-tight">今日完成所有目標！</h2>
                  <p className="text-2xl font-bold text-yellow-300 mt-5 bg-white/20 px-8 py-2 rounded-full border border-yellow-400/50 flex items-center gap-2">
                     <Zap size={28}/> 額外 +10 EXP
                  </p>
              </div>
          </div>
        )}

        {/* --- 4. 升級解鎖動畫 --- */}
        {showLevelUpAnim && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-indigo-900/85 backdrop-blur-md">
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                  <div className="w-[150vw] h-[150vw] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(255,255,255,0.1)_350deg,transparent_360deg)] anim-spin-slow opacity-50 rounded-full"></div>
                  <div className="w-[100vw] h-[100vw] border-[4vw] border-dashed border-white/10 rounded-full anim-spin-slow absolute opacity-50"></div>
              </div>
              <div className="relative z-10 anim-bounce-pop flex flex-col items-center bg-white p-8 rounded-3xl shadow-[0_0_50px_rgba(251,191,36,0.3)] border-4 border-amber-300 w-10/12 max-w-sm">
                  <div className="absolute -top-12 bg-gradient-to-br from-yellow-300 to-amber-500 w-24 h-24 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                      <Trophy size={48} className="text-indigo-900" />
                  </div>
                  <h2 className="text-3xl font-black text-indigo-900 mt-10 mb-1">等級提升！</h2>
                  <p className={`text-lg text-gray-500 font-bold ${levelUpData.isNewTitle ? 'mb-4' : 'mb-8'}`}>到達 LV.{levelUpData.lv}</p>
                  
                  {levelUpData.isNewTitle && (
                    <div className="bg-indigo-50 w-full py-4 rounded-xl text-center border border-indigo-100 mb-2">
                        <p className="text-xs text-indigo-600 font-bold mb-1">恭喜上聘！解鎖新獎銜</p>
                        <p className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-500">{levelUpData.title}</p>
                    </div>
                  )}

                  <button onClick={() => setShowLevelUpAnim(false)} className="mt-4 w-full bg-indigo-600 md:hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md active:scale-95">
                      繼續努力！
                  </button>
              </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 px-1 py-2 flex justify-between items-stretch shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50 rounded-t-3xl pb-safe">
          <button onClick={() => setActiveTab('home')} className={`relative flex flex-col items-center gap-0.5 p-1.5 flex-1 min-w-0 transition-colors ${activeTab === 'home' ? 'text-indigo-600' : 'text-gray-400'}`}>
            <div className={`relative p-1 rounded-xl ${activeTab === 'home' ? 'bg-indigo-50' : ''}`}>
              <Home size={20} className={activeTab === 'home' ? 'fill-indigo-600' : ''} />
              {guidanceRemainingToday > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white shadow-sm" aria-hidden />
              )}
            </div>
            <span className="text-[9px] font-bold truncate w-full text-center">首頁</span>
          </button>

          <button onClick={() => setActiveTab('failures')} className={`flex flex-col items-center gap-0.5 p-1.5 flex-1 min-w-0 transition-colors ${activeTab === 'failures' ? 'text-indigo-600' : 'text-gray-400'}`}>
            <div className={`p-1 rounded-xl ${activeTab === 'failures' ? 'bg-indigo-50' : ''}`}><Sparkles size={20} /></div>
            <span className="text-[9px] font-bold truncate w-full text-center">學習紀錄</span>
          </button>

          <button onClick={() => setActiveTab('stats')} className={`flex flex-col items-center gap-0.5 p-1.5 flex-1 min-w-0 transition-colors ${activeTab === 'stats' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`p-1 rounded-xl ${activeTab === 'stats' ? 'bg-blue-50' : ''}`}><BarChart2 size={20} /></div>
            <span className="text-[9px] font-bold truncate w-full text-center">Stats</span>
          </button>

          <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-0.5 p-1.5 flex-1 min-w-0 transition-colors ${activeTab === 'settings' ? 'text-slate-700' : 'text-gray-400'}`}>
            <div className={`p-1 rounded-xl ${activeTab === 'settings' ? 'bg-slate-100' : ''}`}><Settings size={20} /></div>
            <span className="text-[9px] font-bold truncate w-full text-center">設定</span>
          </button>
        </nav>
      </div>

      {/* CSS 輔助組件 */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatTextUp {
          0% { opacity: 1; transform: translate(-50%, 0) scale(0.8); }
          50% { opacity: 1; transform: translate(-50%, -25px) scale(1.1); }
          100% { opacity: 0; transform: translate(-50%, -50px) scale(0.9); }
        }
        .anim-float-text-cell {
          animation: floatTextUp 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          color: #f59e0b; /* amber-500 */
          font-weight: 900;
          font-size: 1.1rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1), 0 0 2px white, 0 0 2px white;
        }
        .anim-float-text-line {
          animation: floatTextUp 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          color: #10b981; /* emerald-500 */
          font-weight: 900;
          font-size: 1.8rem;
          text-shadow: 0 4px 8px rgba(0,0,0,0.2), 0 0 6px white, 0 0 6px white;
        }
        @keyframes bouncePop {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.05); opacity: 1; }
          80% { transform: scale(0.95); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .anim-bounce-pop {
          animation: bouncePop 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .anim-spin-slow {
          animation: spinSlow 12s linear infinite;
        }
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom, 1rem);
        }
        @keyframes guidanceReveal {
          0% { opacity: 0; transform: translateY(14px) scale(0.94); filter: blur(8px); }
          60% { opacity: 1; filter: blur(0); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        .anim-guidance-reveal {
          animation: guidanceReveal 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes guidanceDrawBreath {
          0%, 100% { transform: scale(1); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.12); }
          50% { transform: scale(1.01); box-shadow: inset 0 0 20px rgba(255,255,255,0.08); }
        }
        .anim-guidance-draw-panel {
          animation: guidanceDrawBreath 1.1s ease-in-out infinite;
        }
        @keyframes guidanceOrbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .anim-guidance-orbit {
          animation: guidanceOrbit 2.5s linear infinite;
        }
        @keyframes guidanceSparkle {
          0%, 100% { transform: scale(1) rotate(-6deg); opacity: 1; }
          50% { transform: scale(1.12) rotate(6deg); opacity: 0.85; }
        }
        .anim-guidance-sparkle {
          animation: guidanceSparkle 0.7s ease-in-out infinite;
        }
        .anim-guidance-sparkle-delay {
          animation: guidanceSparkle 0.9s ease-in-out infinite 0.15s;
        }
        .anim-guidance-sparkle-delay2 {
          animation: guidanceSparkle 0.8s ease-in-out infinite 0.3s;
        }
        @keyframes guidanceShimmer {
          0%, 100% { opacity: 0.65; }
          50% { opacity: 1; }
        }
        .anim-guidance-shimmer {
          animation: guidanceShimmer 1s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}