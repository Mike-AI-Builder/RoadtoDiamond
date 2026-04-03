import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Trophy, Star, Frown, TrendingUp, BookOpen, 
  Check, Edit3, Sparkles, Heart, Zap, Award, 
  Calendar, Users, MessageCircle, ArrowRight,
  Home, Shield, Crosshair, AlertTriangle,
  LogOut, PackageX, Meh, CalendarX, MicOff, UserX, EyeOff, MessageSquareOff,
  Gem, Smile, BarChart2
} from 'lucide-react';

// --- Data Constants ---
const DEFAULT_HABITS = [
  "主動搭話", "保養", "寫感恩日記",
  "寫反思日記", "每日睡前看書", "1點前睡",
  "不賴床", "不抽煙", "不喝五十嵐"
];

const GUIDELINES = {
  "品格": ["誠實", "謙虛", "知足", "感謝", "善良", "孝順", "準時", "己所不欲，勿施於人"],
  "事業": ["經營生活帳號", "經營安麗專業帳號", "經營AI專業帳號", "每天早上安排聚會", "認真看待每次上台機會", "提前一週安排行程", "每週對焦一次", "做跟進記錄", "服務做到讓人感動", "搜集故事", "一流的回答異議", "一流的產品示範", "隨時銷售", "保持好形象", "好好用產品，用到有心得", "歸功給團隊、老師"],
  "自我價值感": ["對自己守信", "相信自己", "不討好、不假裝、不解釋自己", "不在意他人對我的看法", "抬頭挺胸、姿勢開放", "接受讚美", "鬆弛感", "社群媒體限時", "管理通知"],
  "家庭": ["與家人聯絡", "對另一半表達讚美", "在外人面前給予稱讚", "每週固定和家人吃飯", "照顧家人健康", "練習分享", "主動安排家庭聚會", "設定共同目標", "珍惜相處時間", "主動表達愛與感謝"],
  "人際關係": ["做一個好的聆聽者，練習傾聽再發表意見。", "給予真誠的讚賞與感謝", "真誠的關心他人、焦點放在他人身上", "尋求雙贏，先利他再利己", "不批評", "不責備", "不抱怨", "記住對方的名字"],
  "學習成長": ["保持空杯心態", "記帳", "主動選擇學習對象、來源", "AI first 嘗試用AI解決各種問題", "持續培養好習慣", "不斷學習新的AI工具"]
};

// 反轉順序：EXP 由少到多
const FAILURE_TYPES = [
  { label: '搭話被無視', exp: 1, icon: EyeOff },
  { label: '訊息被不回', exp: 1, icon: MessageSquareOff },
  { label: '邀約被拒', exp: 3, icon: UserX },
  { label: '被放鳥', exp: 10, icon: CalendarX },
  { label: '講課搞砸', exp: 10, icon: MicOff },
  { label: '聽課無感', exp: 15, icon: Meh },
  { label: '產品退貨', exp: 20, icon: PackageX },
  { label: '退出(不續約)', exp: 30, icon: LogOut },
];

const FAILURE_QUOTES = [
  "失敗為成功之母。",
  "失敗是通往勝利的必經之路。",
  "跌倒了，爬起來就是成功。",
  "每一次失敗都是一次學習的機會。",
  "成功是從一個失敗走向另一個失敗，卻不減少熱情。",
  "失敗是成長的養分。",
  "挫折是強者的進身之階。",
  "失敗不是終點，放棄才是。",
  "只有敢於大膽失敗的人，才能取得偉大的成就。",
  "失敗只是暫時的停止，而不是永久的句點。",
  "經驗是失敗的果實。",
  "跌倒不是失敗，不願站起來才是。",
  "失敗是重新開始的契機。",
  "偉大的成功往往建立在無數次的失敗之上。",
  "錯誤是通往真理的橋樑。",
  "失敗能磨練人的意志。",
  "從失敗中吸取教訓，是通往成功的捷徑。",
  "失敗的次數越多，成功的甜度越高。",
  "勇往直前的人，永遠不會被失敗擊倒。",
  "失敗是給予成功滋味的調味品。"
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

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  
  // --- Game State ---
  const [baseExp, setBaseExp] = useState(1250); 
  const [seasonRecord, setSeasonRecord] = useState({ wins: 12, losses: 4 }); // 本季戰績
  
  // --- Bingo State ---
  const [habits, setHabits] = useState(DEFAULT_HABITS);
  const [gridState, setGridState] = useState(Array(9).fill(false));
  const [isEditingHabits, setIsEditingHabits] = useState(false);
  const [tempHabits, setTempHabits] = useState([...DEFAULT_HABITS]);
  const [streak, setStreak] = useState(6); 
  const [hasWonToday, setHasWonToday] = useState(false);
  const [hasPerfectDayToday, setHasPerfectDayToday] = useState(false);

  // --- Failures State ---
  const [failures, setFailures] = useState([
    { id: 1, label: "被放鳥", text: "被放鳥", exp: 10, date: "2023-10-25" }
  ]);
  const [customFailureText, setCustomFailureText] = useState("");
  const [showCelebrate, setShowCelebrate] = useState(false);
  const [recentExpGain, setRecentExpGain] = useState(0);
  const [failureQuote, setFailureQuote] = useState("");

  // --- Stats State ---
  const [businessRecords, setBusinessRecords] = useState([
    { date: "2023-10-21", contacts: 5, gatherings: 1, strangers: 2 },
    { date: "2023-10-22", contacts: 8, gatherings: 2, strangers: 3 },
    { date: "2023-10-23", contacts: 3, gatherings: 0, strangers: 1 },
    { date: "2023-10-24", contacts: 10, gatherings: 1, strangers: 5 },
  ]);
  
  // --- Match Stats (Today) State ---
  const [todayStats, setTodayStats] = useState({ contacts: 0, gatherings: 0, strangers: 0 });
  const [statRewards, setStatRewards] = useState({ contacts: false, gatherings: false, strangers: false, doubleDouble: false, all: false });
  const [tripleDoubleStreak, setTripleDoubleStreak] = useState(0);
  
  const pressTimer = useRef(null);
  const isLongPress = useRef(false);

  // --- Animation State ---
  const [showFullWinAnim, setShowFullWinAnim] = useState(false);
  const [showPerfectDayAnim, setShowPerfectDayAnim] = useState(false);
  const [showLevelUpAnim, setShowLevelUpAnim] = useState(false);
  const [levelUpData, setLevelUpData] = useState({ lv: 1, title: "", isNewTitle: false });
  const [prevLevel, setPrevLevel] = useState(null);
  const [prevLines, setPrevLines] = useState(0);
  const [floatingTexts, setFloatingTexts] = useState([]);

  // --- Guidelines State ---
  const [randomGuideline, setRandomGuideline] = useState(null);

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

    const metC = newStats.contacts >= 10;
    const metG = newStats.gatherings >= 3;
    const metS = newStats.strangers >= 1;
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
    if (isEditingHabits) return;
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
    setIsEditingHabits(false);
  };

  const recordFailure = (typeObj, customText = "") => {
    const textToSave = customText || typeObj.label;
    setFailures([{ 
      id: Date.now(), 
      label: typeObj.label, 
      text: textToSave, 
      exp: typeObj.exp, 
      date: new Date().toISOString().split('T')[0] 
    }, ...failures]);
    
    const randomQuote = FAILURE_QUOTES[Math.floor(Math.random() * FAILURE_QUOTES.length)];
    setFailureQuote(randomQuote);
    
    setBaseExp(prev => prev + typeObj.exp);
    setRecentExpGain(typeObj.exp);
    setShowCelebrate(true);
    setCustomFailureText("");
    
    setTimeout(() => setShowCelebrate(false), 3000);
  };

  const calculateDayExp = (stats) => {
    let exp = 0;
    const c = stats.contacts >= 10;
    const g = stats.gatherings >= 3;
    const s = stats.strangers >= 1;
    const count = [c, g, s].filter(Boolean).length;
    
    if (c) exp += 1;
    if (g) exp += 1;
    if (s) exp += 1;
    if (count >= 2) exp += 3;
    if (count === 3) exp += 10;
    return exp;
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

  const renderHome = () => {
    const cardStyle = getStyleByTitle(currentTitle);

    return (
      <div className="space-y-5 animate-fadeIn pb-6">
        {/* Player Profile / Level Card */}
        <div className={`bg-gradient-to-br ${cardStyle.bg} rounded-3xl p-6 shadow-lg text-white relative overflow-hidden transition-all duration-500`}>
          <div className="absolute top-0 right-0 p-2 opacity-10"><Award size={120} /></div>
          
          <div className="flex justify-between items-center mb-4 relative z-10">
             <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold tracking-wider border border-white/10">
               LV.{level}
             </span>
             <div className="text-right">
                <p className="text-white/70 text-[10px] leading-tight mb-0.5">總經驗值</p>
                <p className="font-bold text-sm leading-tight">{totalExp} <span className="text-[10px] font-normal">EXP</span></p>
             </div>
          </div>

          <div className="flex flex-col items-center justify-center mb-6 relative z-10">
             <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-inner border border-white/20 mb-3">
                <Gem size={32} className={cardStyle.icon} />
             </div>
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
              <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
                <span className="bg-black/20 px-2.5 py-1 rounded-md text-[10px] text-white/90 border border-white/10">
                   本季戰績：{seasonRecord.wins}勝 {seasonRecord.losses}負
                </span>
                <span className="bg-rose-500/30 px-2.5 py-1 rounded-md text-[10px] text-rose-100 border border-rose-500/30 flex items-center gap-1">
                   <Frown size={12} /> 累計失敗：{failures.length}
                </span>
              </div>
          </div>
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
                className="bg-emerald-50 hover:bg-emerald-100 active:scale-95 transition-all p-3 rounded-2xl flex flex-col items-center border border-emerald-100 select-none shadow-sm relative"
              >
                <span className="text-xs font-bold text-emerald-700 mb-1">聯絡人數</span>
                <span className="text-2xl font-black text-emerald-600 leading-none">{todayStats.contacts}</span>
                <span className="text-[10px] text-emerald-400 mt-1">/ 10</span>
              </button>
              
              <button 
                onPointerDown={() => handlePointerDown('gatherings')} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} onContextMenu={e => e.preventDefault()} onClick={(e) => handleStatClick('gatherings', e)}
                className="bg-blue-50 hover:bg-blue-100 active:scale-95 transition-all p-3 rounded-2xl flex flex-col items-center border border-blue-100 select-none shadow-sm relative"
              >
                <span className="text-xs font-bold text-blue-700 mb-1">聚會場次</span>
                <span className="text-2xl font-black text-blue-600 leading-none">{todayStats.gatherings}</span>
                <span className="text-[10px] text-blue-400 mt-1">/ 3</span>
              </button>
              
              <button 
                onPointerDown={() => handlePointerDown('strangers')} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} onContextMenu={e => e.preventDefault()} onClick={(e) => handleStatClick('strangers', e)}
                className="bg-purple-50 hover:bg-purple-100 active:scale-95 transition-all p-3 rounded-2xl flex flex-col items-center border border-purple-100 select-none shadow-sm relative"
              >
                <span className="text-xs font-bold text-purple-700 mb-1">認識人數</span>
                <span className="text-2xl font-black text-purple-600 leading-none">{todayStats.strangers}</span>
                <span className="text-[10px] text-purple-400 mt-1">/ 1</span>
              </button>
           </div>
        </div>

        {/* 整合至首頁的 今日比賽 */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-indigo-50 flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                 <h2 className="text-xl font-bold text-gray-800">今日比賽</h2>
                 <button 
                   onClick={() => isEditingHabits ? saveHabits() : setIsEditingHabits(true)}
                   className="text-indigo-500 hover:bg-indigo-50 p-1 rounded-full transition-colors"
                 >
                   {isEditingHabits ? <Check size={16} /> : <Edit3 size={16} />}
                 </button>
              </div>
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
                  ${isEditingHabits ? 'bg-gray-50 border-2 border-dashed border-gray-300' : 
                    gridState[index] 
                      ? 'bg-indigo-50 text-indigo-700 border-2 border-indigo-300 shadow-sm scale-95' 
                      : 'bg-gray-50 hover:bg-indigo-50 text-gray-700 border border-gray-100'}
                `}
              >
                {isEditingHabits ? (
                  <textarea 
                    className="w-full h-full bg-transparent resize-none text-center text-xs md:text-sm outline-none"
                    value={tempHabits[index]}
                    onChange={(e) => {
                      const newTemp = [...tempHabits];
                      newTemp[index] = e.target.value;
                      setTempHabits(newTemp);
                    }}
                    placeholder="輸入習慣..."
                  />
                ) : (
                  <>
                    <span className="text-xs md:text-sm font-medium z-10 break-words w-full line-clamp-3 leading-tight">{habit}</span>
                    {gridState[index] && (
                      <div className="absolute top-2 right-2 text-indigo-400">
                        <Check size={16} />
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderFailures = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-3xl p-6 text-center border border-rose-100 relative overflow-hidden">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">失敗記錄</h2>
        <div className="flex justify-center mb-3">
           <span className="bg-white text-rose-600 font-bold px-4 py-1.5 rounded-full text-sm flex items-center gap-1 shadow-sm border border-rose-100">
             <Frown size={16} /> 累積失敗次數：{failures.length}
           </span>
        </div>
        <p className="text-gray-600 text-sm mb-4">失敗是養分！紀錄搞砸的事，獲取大量 EXP！</p>
        
        {showCelebrate && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center animate-fadeIn p-6">
            <Sparkles size={40} className="text-rose-500 mb-3" />
            <h3 className="text-lg font-bold text-rose-600 mb-2 leading-relaxed">「{failureQuote}」</h3>
            <p className="font-black text-2xl text-amber-500 mt-1">+{recentExpGain} EXP</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 mb-4">
          {FAILURE_TYPES.map((type, idx) => {
            const IconComponent = type.icon;
            return (
              <button
                key={idx}
                onClick={() => recordFailure(type)}
                className="bg-white hover:bg-rose-100 active:scale-95 transition-all p-3 rounded-xl border border-rose-100 shadow-sm flex flex-col items-center justify-center gap-1"
              >
                <div className="text-rose-400 mb-1"><IconComponent size={24} /></div>
                <span className="text-xs font-bold text-gray-700">{type.label}</span>
                <span className="text-[10px] text-amber-500 font-bold">+{type.exp} EXP</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-rose-200/50">
          <p className="text-xs text-gray-500 font-medium text-left ml-1">其他搞砸的事情 (+1 EXP)</p>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={customFailureText}
              onChange={(e) => setCustomFailureText(e.target.value)}
              placeholder="例如：講錯話、忘記帶資料..."
              className="flex-1 px-4 py-2 rounded-xl border-none shadow-inner bg-white/60 focus:bg-white focus:ring-2 focus:ring-rose-400 outline-none transition-all text-sm"
            />
            <button 
              onClick={() => {
                if(!customFailureText) return;
                recordFailure({ label: '自訂', exp: 1 }, customFailureText);
              }}
              className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-4 rounded-xl transition-all shadow-md active:scale-95 whitespace-nowrap text-sm"
            >
              記錄
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStats = () => {
    return (
      <div className="space-y-6 animate-fadeIn pb-8">
        
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
              <p className="text-xs text-indigo-200 mb-1">聯絡</p>
              <p className="text-3xl font-black">{businessStats.avgs.contacts}</p>
            </div>
            <div>
              <p className="text-xs text-indigo-200 mb-1">聚會</p>
              <p className="text-3xl font-black">{businessStats.avgs.gatherings}</p>
            </div>
            <div>
              <p className="text-xs text-indigo-200 mb-1">認識陌生人</p>
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
              <p className="text-xs text-blue-600 mb-1">聯絡人數</p>
              <p className="text-2xl font-black text-blue-900">{businessStats.totals.contacts}</p>
              <p className="text-[10px] text-blue-500 mt-1 bg-white rounded-full inline-block px-2 py-0.5 border border-blue-100 whitespace-nowrap">最高: {businessStats.highest.contacts}</p>
            </div>
            <div>
              <p className="text-xs text-blue-600 mb-1">聚會場次</p>
              <p className="text-2xl font-black text-blue-900">{businessStats.totals.gatherings}</p>
              <p className="text-[10px] text-blue-500 mt-1 bg-white rounded-full inline-block px-2 py-0.5 border border-blue-100 whitespace-nowrap">最高: {businessStats.highest.gatherings}</p>
            </div>
            <div>
              <p className="text-xs text-blue-600 mb-1">認識人數</p>
              <p className="text-2xl font-black text-blue-900">{businessStats.totals.strangers}</p>
              <p className="text-[10px] text-blue-500 mt-1 bg-white rounded-full inline-block px-2 py-0.5 border border-blue-100 whitespace-nowrap">最高: {businessStats.highest.strangers}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-gray-700 mb-3 ml-2 flex items-center gap-2">
            <BarChart2 size={18} className="text-blue-500" /> 歷史紀錄 (點擊數字可直接修改)
          </h3>
          <div className="space-y-2">
            {[...businessRecords].reverse().map((record, index) => {
              const realIndex = businessRecords.length - 1 - index;
              return (
              <div key={realIndex} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex justify-between items-center hover:bg-blue-50/50 transition-colors">
                <span className="text-sm font-bold text-gray-500 w-24">{record.date}</span>
                <div className="flex gap-2 text-sm">
                  <span className="flex items-center gap-1 text-emerald-600">
                    <MessageCircle size={14}/> 
                    <input 
                      type="number" min="0" value={record.contacts} 
                      onChange={e => updateHistory(realIndex, 'contacts', e.target.value)} 
                      className="w-10 h-7 bg-emerald-50 border border-emerald-100 rounded text-center outline-none focus:ring-1 focus:ring-emerald-400 font-bold" 
                    />
                  </span>
                  <span className="flex items-center gap-1 text-blue-600">
                    <Users size={14}/> 
                    <input 
                      type="number" min="0" value={record.gatherings} 
                      onChange={e => updateHistory(realIndex, 'gatherings', e.target.value)} 
                      className="w-10 h-7 bg-blue-50 border border-blue-100 rounded text-center outline-none focus:ring-1 focus:ring-blue-400 font-bold" 
                    />
                  </span>
                  <span className="flex items-center gap-1 text-purple-600">
                    <TrendingUp size={14}/> 
                    <input 
                      type="number" min="0" value={record.strangers} 
                      onChange={e => updateHistory(realIndex, 'strangers', e.target.value)} 
                      className="w-10 h-7 bg-purple-50 border border-purple-100 rounded text-center outline-none focus:ring-1 focus:ring-purple-400 font-bold" 
                    />
                  </span>
                </div>
              </div>
            )})}
          </div>
        </div>
      </div>
    );
  };

  const renderGuidelines = () => {
    const drawRandomGuideline = () => {
      const categories = Object.keys(GUIDELINES);
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const items = GUIDELINES[randomCategory];
      const randomItem = items[Math.floor(Math.random() * items.length)];
      setRandomGuideline({ category: randomCategory, text: randomItem });
    };

    return (
      <div className="space-y-6 animate-fadeIn pb-10">
        <div className="bg-gradient-to-br from-violet-600 to-indigo-800 rounded-3xl p-8 text-center text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles size={80} />
          </div>
          <h2 className="text-2xl font-bold mb-2">宇宙指引盲盒</h2>
          <p className="text-indigo-200 text-sm mb-6">迷茫的時候，抽一張今天的行動方針吧！</p>
          
          {randomGuideline ? (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-6 animate-fadeIn">
              <p className="text-indigo-200 text-xs font-bold tracking-wider mb-2">{randomGuideline.category}</p>
              <p className="text-xl font-bold leading-snug">「{randomGuideline.text}」</p>
            </div>
          ) : (
             <div className="bg-white/5 border border-white/10 border-dashed rounded-2xl p-6 mb-6">
                <p className="text-indigo-300">點擊下方按鈕抽取</p>
             </div>
          )}

          <button 
            onClick={drawRandomGuideline}
            className="bg-white text-indigo-900 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-indigo-50 transition-all active:scale-95 w-full flex items-center justify-center gap-2"
          >
            <Sparkles size={18} /> 抽取今日指引
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-700 ml-2">完整指導方針</h3>
          {Object.entries(GUIDELINES).map(([category, items]) => (
            <div key={category} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h4 className="font-bold text-lg text-indigo-900 mb-3 border-b border-gray-50 pb-2">{category}</h4>
              <ul className="space-y-2">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                    <ArrowRight size={14} className="text-indigo-300 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
          {activeTab === 'guidelines' && renderGuidelines()}
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

                  <button onClick={() => setShowLevelUpAnim(false)} className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md active:scale-95">
                      繼續努力！
                  </button>
              </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 px-2 py-3 flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50 rounded-t-3xl pb-safe">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 p-2 flex-1 transition-colors ${activeTab === 'home' ? 'text-indigo-600' : 'text-gray-400'}`}>
            <div className={`p-1 rounded-xl ${activeTab === 'home' ? 'bg-indigo-50' : ''}`}><Home size={22} className={activeTab === 'home' ? 'fill-indigo-600' : ''} /></div>
            <span className="text-[10px] font-bold">首頁</span>
          </button>

          <button onClick={() => setActiveTab('failures')} className={`flex flex-col items-center gap-1 p-2 flex-1 transition-colors ${activeTab === 'failures' ? 'text-emerald-600' : 'text-gray-400'}`}>
            <div className={`p-1 rounded-xl ${activeTab === 'failures' ? 'bg-emerald-50' : ''}`}><Smile size={22} /></div>
            <span className="text-[10px] font-bold">失敗記錄</span>
          </button>

          <button onClick={() => setActiveTab('stats')} className={`flex flex-col items-center gap-1 p-2 flex-1 transition-colors ${activeTab === 'stats' ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`p-1 rounded-xl ${activeTab === 'stats' ? 'bg-blue-50' : ''}`}><BarChart2 size={22} /></div>
            <span className="text-[10px] font-bold">Stats</span>
          </button>

          <button onClick={() => setActiveTab('guidelines')} className={`flex flex-col items-center gap-1 p-2 flex-1 transition-colors ${activeTab === 'guidelines' ? 'text-violet-600' : 'text-gray-400'}`}>
            <div className={`p-1 rounded-xl ${activeTab === 'guidelines' ? 'bg-violet-50' : ''}`}><BookOpen size={22} /></div>
            <span className="text-[10px] font-bold">指南</span>
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
      `}} />
    </div>
  );
}