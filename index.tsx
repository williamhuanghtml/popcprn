import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Sparkles, 
  Flame, 
  HelpCircle, 
  Send, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Star, 
  Award, 
  BookOpen, 
  AlertTriangle,
  RefreshCw,
  Lightbulb,
  Cpu,
  Smile,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

// 嚴格設計的題庫：選項字數平衡、高誘答力、專門破解學生常見迷思
const QUESTION_BANK = [
  {
    id: 1,
    title: "玉米粒品種迷思",
    question: "日常生活中我們吃的黃金甜玉米、糯玉米，如果直接曬乾加熱，能像爆米花一樣爆出大朵白花嗎？為什麼？",
    options: [
      { text: "可以，只要將水分烘乾到零就能順利爆發", isCorrect: false },
      { text: "可以，所有品種玉米只要加高溫均會爆開", isCorrect: false },
      { text: "不行，因一般玉米外皮較薄無法蓄積壓力", isCorrect: true },
      { text: "不行，因一般玉米含有過多油脂會阻礙膨脹", isCorrect: false }
    ],
    misconception: "【迷思破解】並非所有玉米都能爆！專用「爆米花玉米」具有極其堅硬緻密的硬質外殼（種皮），能像高壓鍋一樣封鎖水蒸氣直到壓力達9-10大氣壓；普通食用玉米種皮太薄脆，蒸氣早早就漏光了，無法形成巨大爆發力。"
  },
  {
    id: 2,
    title: "玉米粒內部水分迷思",
    question: "想要爆出顆粒大且飽滿的爆米花，玉米粒內部的含水量應該維持在什麼狀態最為理想？",
    options: [
      { text: "水分越少越好，最好完全乾燥才容易快速熟透", isCorrect: false },
      { text: "維持約13%至14%適量水分，提供充足的汽化推力", isCorrect: true },
      { text: "水分越多越好，浸泡清水後加熱才具有膨脹力", isCorrect: false },
      { text: "含水量沒有影響，主要是依靠胚乳中的空氣膨脹", isCorrect: false }
    ],
    misconception: "【迷思破解】水分不是越少越好，也不是越多越好！若含水過低（<10%），沒有足夠水蒸氣蓄壓而形成「啞巴豆」；若含水過多，種皮會提早軟化破裂，澱粉無法充分起泡。13.5%~14% 是科學家測出的黃金比例。"
  },
  {
    id: 3,
    title: "爆開動力來源迷思",
    question: "爆米花由一顆小硬粒瞬間「啪」一聲爆開並體積劇增，最核心的物理驅動力是什麼？",
    options: [
      { text: "胚乳內部的油脂在高溫下沸騰引發劇烈燃燒反應", isCorrect: false },
      { text: "玉米粒縫隙中的乾燥空氣受熱依查理定律膨脹", isCorrect: false },
      { text: "密閉受熱使水轉為超高壓蒸氣並在破裂時宣洩", isCorrect: true },
      { text: "外殼表皮的纖維素受熱快速碳化並向外部彈開", isCorrect: false }
    ],
    misconception: "【迷思破解】爆開的力量既不是來自空氣，也不是油脂燃燒，而是「液態水轉變成氣態水蒸氣」！水在氣化時體積可擴大上千倍，在密閉堅硬的種皮內形成巨大高壓（約135-180 psi），破裂瞬間釋放強大推力。"
  },
  {
    id: 4,
    title: "白色海綿狀結構成因",
    question: "爆米花爆開後所看到的蓬鬆白色結構，它的化學本質與形成過程是什麼？",
    options: [
      { text: "玉米胚芽被燒成白色灰燼後在空中凝固而成", isCorrect: false },
      { text: "澱粉糊化為膠狀泡沫，瞬間失壓後冷卻固化", isCorrect: true },
      { text: "玉米粒內蛋白質遇熱變性凝固所形成的蛋白霜", isCorrect: false },
      { text: "添加的砂糖與牛油在高溫下翻滾產生的焦糖泡", isCorrect: false }
    ],
    misconception: "【迷思破解】白色部分是玉米胚乳中的「澱粉」！高溫高壓下，原本結實的硬質澱粉吸水熔融成濃稠流體（糊化）；當種皮炸裂時，超高壓水蒸氣急遽衝出，將熔融澱粉吹成泡沫狀，遇到外界冷空氣在幾毫秒內冷卻固化成香脆的白色泡泡。"
  },
  {
    id: 5,
    title: "未爆彈（啞巴豆）的成因",
    question: "鍋底常常剩下幾顆完全沒爆開的「硬玉米粒」（俗稱未爆彈），最常見的科學原因為何？",
    options: [
      { text: "加熱時間過長導致內部澱粉提早硬化而無法舒展", isCorrect: false },
      { text: "外殼有微細裂紋導致蒸氣提前外洩無法蓄積高壓", isCorrect: true },
      { text: "這幾顆玉米粒內部含有過多水分因而壓抑了溫度", isCorrect: false },
      { text: "玉米粒表面受到鍋鏟過度撞擊導致晶體結構錯位", isCorrect: false }
    ],
    misconception: "【迷思破解】未爆彈通常有兩個元凶：一是「外殼有裂縫或微孔」，水蒸氣在加熱過程中悄悄溜走，壓力無法累積；二是「種子本身過於乾枯（水分流失）」，產生的氣壓不足以炸開厚皮。"
  },
  {
    id: 6,
    title: "加熱溫度與爆裂時機",
    question: "科學實驗顯示，爆米花玉米粒通常在哪個溫度區間會達到破裂臨界點而爆開？",
    options: [
      { text: "達到水的沸點攝氏100度時即刻全面爆裂散開", isCorrect: false },
      { text: "約在攝氏175至190度且內部壓力達9氣壓左右", isCorrect: true },
      { text: "必須在攝氏300度以上的炭火高溫下才會反應", isCorrect: false },
      { text: "只要鍋內油溫達到攝氏60度就足以促成爆裂", isCorrect: false }
    ],
    misconception: "【迷思破解】因為玉米種皮強韌耐壓，內部水分子在達到100°C時無法自由沸騰膨脹（就像壓力鍋內的過熱水）。直到溫度攀升到約180°C左右，內部水蒸氣壓力積聚至約9.3個大氣壓，超過了外殼承受極限才會炸裂！"
  },
  {
    id: 7,
    title: "微波爐專用爆米花紙袋的秘密",
    question: "市售微波爆米花紙袋底部通常有一塊深灰色的特殊薄片（感受體），它的關鍵作用是？",
    options: [
      { text: "吸收微波並將其轉化為局部高溫，加速底部受熱", isCorrect: true },
      { text: "防止水蒸氣透過紙袋滲漏出去，維持內部高氣壓", isCorrect: false },
      { text: "釋放特殊化學氣體催化玉米澱粉在低溫下快速熟化", isCorrect: false },
      { text: "阻擋微波進入玉米粒內部以保護營養成分不被破壞", isCorrect: false }
    ],
    misconception: "【迷思破解】微波袋底部的金屬化薄膜稱為「感受體（Susceptor）」，它能吸收微波輻射並迅速轉化為極高的傳導熱（可達200°C以上），模擬熱油鍋底傳熱，讓玉米粒迅速且均勻達到破裂溫度，減少未爆粒。"
  },
  {
    id: 8,
    title: "烹調油脂的真實功能",
    question: "爆爆米花時加入奶油或沙拉油，從物理熱傳遞的角度來看，最主要的功能是什麼？",
    options: [
      { text: "油脂滲透進玉米內部取代水分成為主要的膨脹源", isCorrect: false },
      { text: "包覆玉米粒均勻傳導熱量，避免局部烤焦與受熱不均", isCorrect: true },
      { text: "軟化玉米堅硬外殼讓內部空氣在較低溫時即可突破", isCorrect: false },
      { text: "與澱粉結合產生化學交聯反應以形成更多白色泡沫", isCorrect: false }
    ],
    misconception: "【迷思破解】氣炸或熱風機「不加油」其實也能爆！油的主要物理角色是「熱傳導介質」，液態油貼合玉米粒凹凸不平的表面，將鍋底熱量快速且均勻傳遍整顆玉米，避免局部烤焦，調味與香氣則是次要加分項。"
  }
];

const KEY_CONCEPTS = [
  {
    id: 'hull',
    name: '堅硬外殼/密閉種皮',
    weight: 20,
    keywords: ['外殼', '種皮', '堅硬', '硬殼', '外皮', '密閉', '包裹', '耐壓', '厚'],
    advice: '試著提到「堅硬的外殼（種皮）」如何扮演像壓力鍋一樣的角色！'
  },
  {
    id: 'water',
    name: '內部水分與水蒸氣',
    weight: 20,
    keywords: ['水分', '水', '水蒸氣', '水氣', '蒸氣', '含水量', '汽化', '13%'],
    advice: '別忘了提及玉米內部蘊藏的「水分」在受熱時會轉變成「水蒸氣」！'
  },
  {
    id: 'pressure',
    name: '高溫蓄壓/壓力劇增',
    weight: 20,
    keywords: ['壓力', '蓄壓', '高壓', '累積', '膨脹', '受熱', '加熱', '溫度', '180'],
    advice: '請說明加熱後外殼內部「壓力逐漸累積升高（達高壓）」的關鍵過程。'
  },
  {
    id: 'starch',
    name: '澱粉糊化/凝膠熔融',
    weight: 20,
    keywords: ['澱粉', '糊化', '軟化', '融化', '胚乳', '膠狀', '濃稠', '泡沫'],
    advice: '爆米花白白蓬鬆的本質是玉米胚乳中的「澱粉」，受熱糊化變成膠狀流體。'
  },
  {
    id: 'burst_cool',
    name: '爆破降壓與冷卻固化',
    weight: 20,
    keywords: ['爆開', '炸裂', '破裂', '冷卻', '固化', '凝固', '噴出', '瞬間', '定型', '膨脹'],
    advice: '補充說明外殼承受不住而「爆開」時，噴出的澱粉泡沫遇到空氣「瞬間冷卻固化」。'
  }
];

export default function PopcornScienceApp() {
  // Navigation tabs: 'explore' (overview/search info), 'chatbot' (step 1), 'quiz' (step 2)
  const [activeTab, setActiveTab] = useState('chatbot');

  // Chatbot State
  const [inputText, setInputText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'bot',
      message: '哈囉探究小科學家！🍿 歡迎來到爆米花科學檢核站。\n請先在網路上搜尋或閱讀「爆米花原理」，接著在下方用自己的話打字告訴我：\n\n「爆米花為什麼會爆開？又是如何變成白色香脆花朵的呢？」\n\n我會依據你的回答進行 1～5 顆星科學審查並提供專屬建議喔！',
      time: '剛剛'
    }
  ]);

  // Quiz State
  const [currentQuizQuestions, setCurrentQuizQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qIndex]: optionIndex }
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Auto-scroll chat ref
  const chatBottomRef = useRef(null);

  const generateNewQuiz = () => {
    // Shuffle and pick exactly 4 questions
    const shuffled = [...QUESTION_BANK].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);
    setCurrentQuizQuestions(selected);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  useEffect(() => {
    generateNewQuiz();
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isEvaluating]);

  const evaluateAnswerLocally = (text) => {
    let score = 0;
    const matchedConcepts = [];
    const missingConcepts = [];

    const lower = text.toLowerCase();

    KEY_CONCEPTS.forEach(concept => {
      const isMatched = concept.keywords.some(kw => lower.includes(kw.toLowerCase()));
      if (isMatched) {
        score += concept.weight;
        matchedConcepts.push(concept);
      } else {
        missingConcepts.push(concept);
      }
    });

    // Length and coherence bonus / penalty
    const wordCount = text.trim().length;
    let stars = 1;
    if (score >= 80 && wordCount >= 30) {
      stars = 5;
    } else if (score >= 60 && wordCount >= 25) {
      stars = 4;
    } else if (score >= 40 && wordCount >= 15) {
      stars = 3;
    } else if (score >= 20 || wordCount >= 10) {
      stars = 2;
    } else {
      stars = 1;
    }

    let feedbackMsg = '';
    if (stars === 5) {
      feedbackMsg = '太精彩了！🌟 你完美掌握了「堅硬外殼蓄壓」、「內部水分氣化」、「高溫高壓環境」、「澱粉糊化」與「爆開瞬間冷卻定型」的完整科學鏈！具備小小物理化學家水準！';
    } else if (stars === 4) {
      feedbackMsg = '非常出色！👏 你的科學因果推論很完整，核心概念幾乎都提到了，距離滿分只差一點點關鍵細節囉！';
    } else if (stars === 3) {
      feedbackMsg = '表現不錯！👍 你已經抓到爆米花爆裂的基本原因（如水分與加熱），但還能更進一步探討壓力和外殼的特殊機制喔！';
    } else if (stars === 2) {
      feedbackMsg = '加油！💡 你已經邁出了探究的第一步，但目前的說明較為簡略，許多關鍵的物理與化學轉變還沒說明清楚。';
    } else {
      feedbackMsg = '這是一個好的嘗試！🌱 但內容似乎缺少關鍵要素。請參考下方的科學提示，重新組織後再試一次吧！';
    }

    return {
      stars,
      score,
      matchedConcepts,
      missingConcepts,
      feedbackMsg,
      wordCount
    };
  };

  const handleBotEvaluation = async () => {
    if (!inputText.trim()) return;

    const userMessageText = inputText.trim();
    setInputText('');

    // Append user message to chat
    setChatHistory(prev => [
      ...prev,
      { sender: 'user', message: userMessageText, time: '剛才' }
    ]);

    setIsEvaluating(true);

    // Rule-based base evaluation
    const localEval = evaluateAnswerLocally(userMessageText);

    // Attempt Gemini enhanced feedback
    let aiAdvice = "";
    try {
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      const prompt = `學生正在回答「爆米花原理」，學生的回答是：「${userMessageText}」。
請以親切、富啟發性的科學老師口吻進行評語：
1. 肯定學生答對的物理或化學概念（例如水分汽化、堅硬種皮外殼壓力、澱粉糊化噴發與降壓冷卻）。
2. 指出尚未提及或可以更精準說明的概念。
3. 繁體中文回答，控制在 100-150 字內，語氣正面鼓勵。`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: {
            parts: [{ text: "你是一位充滿熱忱的國高中自然科學探究教師，善於肯定學生並引導科學概念。" }]
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          aiAdvice = candidateText;
        }
      }
    } catch (e) {
      // Fallback silently to rule-based review
      console.log('AI Evaluation fallback to local rule engine');
    }

    setIsEvaluating(false);

    const fullEvaluation = {
      ...localEval,
      aiAdvice: aiAdvice || localEval.feedbackMsg
    };

    setEvaluationResult(fullEvaluation);

    // Append Bot Feedback to chat
    setChatHistory(prev => [
      ...prev,
      {
        sender: 'bot',
        message: fullEvaluation.aiAdvice,
        isReview: true,
        evaluation: fullEvaluation,
        time: '剛剛'
      }
    ]);
  };

  const handleSelectOption = (qIdx, optIdx) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [qIdx]: optIdx
    }));
  };

  const handleQuizSubmit = () => {
    if (Object.keys(selectedAnswers).length < currentQuizQuestions.length) {
      // Let user finish all questions
      return;
    }

    let correctCount = 0;
    currentQuizQuestions.forEach((q, idx) => {
      const chosen = selectedAnswers[idx];
      if (chosen !== undefined && q.options[chosen].isCorrect) {
        correctCount += 1;
      }
    });

    const percentage = Math.round((correctCount / currentQuizQuestions.length) * 100);
    setQuizScore(percentage);
    setQuizSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-amber-50/50 text-slate-800 flex flex-col font-sans">
      {/* Top Banner & Header */}
      <header className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 text-white shadow-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl filter drop-shadow">🍿</span>
            <div>
              <h1 className="text-xl font-bold tracking-wide flex items-center gap-2">
                爆米花原理：科學探究與迷思澄清
                <span className="text-xs bg-amber-800/60 px-2 py-0.5 rounded-full border border-amber-300/40">
                  互動教學平台
                </span>
              </h1>
              <p className="text-xs text-amber-100 hidden sm:block">
                搜尋探究 ➔ 文字輸入檢核 ➔ 星級診斷反饋 ➔ 迷思概念大挑戰
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center bg-black/20 p-1 rounded-xl backdrop-blur-sm">
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'explore'
                  ? 'bg-white text-amber-900 shadow-sm font-semibold'
                  : 'text-amber-100 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              探究背景錦囊
            </button>
            <button
              onClick={() => setActiveTab('chatbot')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'chatbot'
                  ? 'bg-white text-amber-900 shadow-sm font-semibold'
                  : 'text-amber-100 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              第一關：機器人檢核
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'quiz'
                  ? 'bg-white text-amber-900 shadow-sm font-semibold'
                  : 'text-amber-100 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              第二關：迷思測驗 (4題)
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* TAB 1: 探究指引錦囊 (Search Guide & Core Mechanics) */}
        {activeTab === 'explore' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-lg mb-3">
                <Lightbulb className="w-5 h-5 text-amber-600" />
                學生自主搜尋探究指南：爆米花的爆裂物理學
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                請在 Google 或科普網站搜尋關鍵詞：<strong>「爆米花原理」、「爆米花 水分 澱粉 壓力」</strong>。閱讀資料時，請特別觀察以下五大核心環節，並準備用自己的話彙整給機器人！
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200/80">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5 mb-2">
                    <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs">1</span>
                    堅硬外殼（種皮）
                  </div>
                  <p className="text-slate-700 leading-normal">
                    爆米花專用玉米具有極厚實緻密的防水外殼，能承受超大氣壓，相當於微型的密閉壓力鍋。
                  </p>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200/80">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5 mb-2">
                    <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs">2</span>
                    黃金水分與高溫高壓
                  </div>
                  <p className="text-slate-700 leading-normal">
                    胚乳內部約含 13.5%~14% 水分。加熱到 180°C 時汽化為高壓水蒸氣，壓力高達 9 大氣壓（約 135 psi）。
                  </p>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200/80">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5 mb-2">
                    <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs">3</span>
                    澱粉糊化與瞬間冷卻
                  </div>
                  <p className="text-slate-700 leading-normal">
                    硬質澱粉受熱吸水糊化為熔融膠狀。外殼爆開瞬間，蒸氣衝出吹起澱粉泡沫，在空氣中驟冷凝固成白花！
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setActiveTab('chatbot')}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl text-sm flex items-center gap-2 shadow-sm transition-all"
                >
                  我閱讀完了，前往打字檢核
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 第一關 機器人檢核 (Chatbot Assessment) */}
        {activeTab === 'chatbot' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Chat Window */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-[620px] overflow-hidden">
              {/* Chat Header */}
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-inner">
                    🍿
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">爆米花科學評估導師</h3>
                    <p className="text-[11px] text-slate-500">線上關鍵概念即時檢核系統</p>
                  </div>
                </div>

                {evaluationResult && (
                  <div className="flex items-center gap-1 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold">
                    <span>獲得評分：</span>
                    <span className="text-amber-600 flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${i < evaluationResult.stars ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`} 
                        />
                      ))}
                    </span>
                  </div>
                )}
              </div>

              {/* Message History */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
                {chatHistory.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`flex ${item.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {item.sender === 'bot' && (
                      <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs mr-2 shrink-0 mt-1 shadow-sm">
                        🤖
                      </div>
                    )}
                    <div 
                      className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                        item.sender === 'user' 
                          ? 'bg-amber-600 text-white rounded-tr-none' 
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                      }`}
                    >
                      <p className="whitespace-pre-line">{item.message}</p>

                      {/* If this message contains detailed evaluation badges */}
                      {item.isReview && item.evaluation && (
                        <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                          {/* Star Score Header */}
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-600">概念完整度等級：</span>
                            <div className="flex items-center text-amber-500">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < item.evaluation.stars ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`} 
                                />
                              ))}
                              <span className="ml-1.5 font-bold text-slate-700">{item.evaluation.stars} / 5 星</span>
                            </div>
                          </div>

                          {/* Concept Checklist */}
                          <div className="space-y-1 text-xs">
                            <p className="font-semibold text-slate-500 text-[11px]">關鍵概念檢核：</p>
                            <div className="flex flex-wrap gap-1.5">
                              {KEY_CONCEPTS.map(c => {
                                const matched = item.evaluation.matchedConcepts.some(m => m.id === c.id);
                                return (
                                  <span
                                    key={c.id}
                                    className={`px-2 py-0.5 rounded-md text-[11px] flex items-center gap-1 font-medium ${
                                      matched 
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                        : 'bg-rose-50 text-rose-600 border border-rose-200'
                                    }`}
                                  >
                                    {matched ? '✓' : '✗'} {c.name}
                                  </span>
                                );
                              })}
                            </div>
                          </div>

                          {/* Suggestion & Next Action */}
                          {item.evaluation.stars < 5 ? (
                            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 mt-2">
                              <p className="font-bold flex items-center gap-1 text-amber-800 mb-1">
                                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                                衝刺 5 顆星指引建議：
                              </p>
                              <ul className="list-disc pl-4 space-y-0.5 text-slate-700 text-[11px]">
                                {item.evaluation.missingConcepts.map(c => (
                                  <li key={c.id}>{c.advice}</li>
                                ))}
                              </ul>
                              <div className="mt-2.5 flex items-center gap-2">
                                <span className="text-[11px] text-slate-600 font-medium">你可以直接重新打字精進，或：</span>
                                <button
                                  onClick={() => setActiveTab('quiz')}
                                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all flex items-center gap-1"
                                >
                                  直接前往第2關測驗
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 mt-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>恭喜達成 5 顆星大滿貫！你已具備扎實科學觀念。</span>
                              </div>
                              <button
                                onClick={() => setActiveTab('quiz')}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                              >
                                馬上開始測驗
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isEvaluating && (
                  <div className="flex items-center gap-2 text-slate-500 text-xs italic">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></div>
                    機器人正在仔細閱讀你的回答並分析關鍵詞...
                  </div>
                )}

                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 border-t border-slate-200 bg-white">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleBotEvaluation();
                  }}
                  className="flex gap-2"
                >
                  <textarea
                    rows={2}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="請在此打字輸入你整理的爆米花爆裂原理（例：玉米外殼很硬、水分受熱變成水蒸氣、高溫高壓下澱粉糊化...）"
                    className="flex-1 border border-slate-300 rounded-xl p-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleBotEvaluation();
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isEvaluating || !inputText.trim()}
                    className={`px-4 rounded-xl flex flex-col items-center justify-center text-xs font-semibold transition-all ${
                      isEvaluating || !inputText.trim()
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
                    }`}
                  >
                    <Send className="w-4 h-4 mb-1" />
                    送出檢核
                  </button>
                </form>
                <div className="flex justify-between items-center mt-2 px-1 text-[11px] text-slate-400">
                  <span>💡 提示：講出越多關鍵科學概念，星級評分越高喔！</span>
                  <span>按 Enter 送出</span>
                </div>
              </div>
            </div>

            {/* Right: Real-time Rubrics & Progress Panel */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-amber-600" />
                  科學檢核評分標準（1～5 星）
                </h4>

                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  系統透過自然語言與關鍵詞比對五大科學維度。若未達 5 星，可依據提示反覆修正輸入！
                </p>

                <div className="space-y-3">
                  {KEY_CONCEPTS.map((c, i) => {
                    const isMatched = evaluationResult?.matchedConcepts?.some(m => m.id === c.id);
                    return (
                      <div 
                        key={c.id} 
                        className={`p-2.5 rounded-xl border transition-all text-xs ${
                          isMatched 
                            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900' 
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold flex items-center gap-1.5">
                            {isMatched ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <span className="w-3.5 h-3.5 rounded-full border border-slate-400 inline-block text-[10px] text-center leading-3">
                                {i + 1}
                              </span>
                            )}
                            {c.name}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${isMatched ? 'bg-emerald-200/60 text-emerald-800 font-bold' : 'bg-slate-200 text-slate-600'}`}>
                            {c.weight}%
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-normal pl-5">
                          關鍵字如：{c.keywords.slice(0, 4).join('、')}等
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col gap-2">
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    進入第二關：迷思概念測驗
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-center text-slate-400">
                    隨時可切換回來修改回答，挑戰 5 星大滿貫！
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: 第二關 迷思概念大挑戰 (Misconception Quiz) */}
        {activeTab === 'quiz' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Quiz Banner & Dynamic Reset Header */}
            <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  爆米花原理迷思概念大挑戰
                  <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                    隨機 4 題
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  每道題目的選項字數均勻平衡，具有高度誘答力。請仔細思考排除迷思！
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={generateNewQuiz}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all"
                  title="每次點擊都會重新從題庫抽取不同的 4 題"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
                  重新抽取 4 題
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-5">
              {currentQuizQuestions.map((q, qIdx) => {
                const userChoice = selectedAnswers[qIdx];
                return (
                  <div 
                    key={q.id || qIdx} 
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm transition-all"
                  >
                    {/* Question Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-amber-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {qIdx + 1}
                        </span>
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {q.title}
                        </span>
                      </div>

                      {quizSubmitted && (
                        <div>
                          {userChoice !== undefined && q.options[userChoice].isCorrect ? (
                            <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" /> 答對了！
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-rose-600 text-xs font-bold bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                              <XCircle className="w-3.5 h-3.5" /> 有迷思觀念
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <h4 className="font-semibold text-slate-800 text-sm sm:text-base leading-snug mb-4">
                      {q.question}
                    </h4>

                    {/* Options (Designed with Balanced Character Lengths) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userChoice === optIdx;
                        let optionStyle = "border-slate-200 hover:border-amber-400 bg-slate-50/50 text-slate-700";

                        if (quizSubmitted) {
                          if (opt.isCorrect) {
                            optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-500";
                          } else if (isSelected && !opt.isCorrect) {
                            optionStyle = "border-rose-400 bg-rose-50 text-rose-900 font-medium ring-1 ring-rose-400";
                          } else {
                            optionStyle = "border-slate-200 bg-slate-50 text-slate-400 opacity-60";
                          }
                        } else if (isSelected) {
                          optionStyle = "border-amber-600 bg-amber-50 text-amber-900 font-semibold ring-1 ring-amber-600";
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOption(qIdx, optIdx)}
                            disabled={quizSubmitted}
                            className={`p-3 rounded-xl border text-left text-xs sm:text-sm flex items-start gap-2.5 transition-all ${optionStyle}`}
                          >
                            <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                              isSelected 
                                ? 'bg-amber-600 text-white border-amber-600 font-bold' 
                                : 'border-slate-300 bg-white text-slate-600'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="flex-1 leading-relaxed">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Misconception Clarification & Detailed Insight */}
                    {quizSubmitted && (
                      <div className="mt-4 p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-slate-700 leading-relaxed animate-fadeIn">
                        <div className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                          觀念透視與迷思澄清：
                        </div>
                        <p className="text-slate-700 pl-5">{q.misconception}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quiz Action & Results Banner */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
              {!quizSubmitted ? (
                <div className="space-y-3 max-w-md">
                  <p className="text-xs text-slate-500">
                    目前已完成：{Object.keys(selectedAnswers).length} / {currentQuizQuestions.length} 題
                  </p>
                  <button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(selectedAnswers).length < currentQuizQuestions.length}
                    className={`px-8 py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                      Object.keys(selectedAnswers).length === currentQuizQuestions.length
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white cursor-pointer transform hover:scale-[1.02]'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    交卷並查看答對百分比與迷思解析
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-w-lg animate-scaleUp">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-700 text-2xl font-bold shadow-inner mb-1">
                    {quizScore}%
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-800">
                      測驗完成！你的答對率為：
                      <span className={`ml-1 ${quizScore >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {quizScore}%
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      共答對 {Math.round((quizScore / 100) * currentQuizQuestions.length)} / {currentQuizQuestions.length} 題
                    </p>
                  </div>

                  {/* Encouraging Feedback Badge */}
                  <div className="p-4 rounded-xl border text-xs sm:text-sm text-left leading-relaxed">
                    {quizScore === 100 && (
                      <div className="bg-emerald-50 border-emerald-200 text-emerald-900 p-3 rounded-xl flex items-start gap-2.5">
                        <Smile className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-bold mb-0.5">太不可思議了！特級爆米花科學大師 👑</strong>
                          你徹底識破了所有誘答陷阱與常見迷思，完美掌握了玉米外殼、水蒸氣壓力與澱粉物理變化的全部機制！
                        </div>
                      </div>
                    )}
                    {quizScore >= 75 && quizScore < 100 && (
                      <div className="bg-blue-50 border-blue-200 text-blue-900 p-3 rounded-xl flex items-start gap-2.5">
                        <Award className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-bold mb-0.5">非常優異！科學概念相當扎實 🌟</strong>
                          你僅有極少數的細節落入誘答陷阱，查看上方每道題的「觀念透視」，相信你下次一定能拿到 100% 滿分！
                        </div>
                      </div>
                    )}
                    {quizScore >= 50 && quizScore < 75 && (
                      <div className="bg-amber-50 border-amber-200 text-amber-900 p-3 rounded-xl flex items-start gap-2.5">
                        <TrendingUp className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-bold mb-0.5">很棒的挑戰！迷思概念正在逐步突破 💡</strong>
                          這些題目非常有誘答性，答錯是最好的學習機會！請仔細閱讀上方題目附帶的迷思澄清，再次挑戰吧！
                        </div>
                      </div>
                    )}
                    {quizScore < 50 && (
                      <div className="bg-rose-50 border-rose-200 text-rose-900 p-3 rounded-xl flex items-start gap-2.5">
                        <RotateCcw className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-bold mb-0.5">不要氣餒！科學探究就是從破除迷思開始 🌱</strong>
                          許多日常對爆米花的直覺想像（例如以為只是空氣膨脹或燃燒）其實都是誤解。看看解析，重新出題挑戰一次！
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Retry & Navigation Actions */}
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={generateNewQuiz}
                      className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      重新抽取 4 題重複練習
                    </button>
                    <button
                      onClick={() => setActiveTab('chatbot')}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-2"
                    >
                      回第一關加強打字檢核
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white/80 py-4 text-center text-xs text-slate-400">
        🍿 爆米花科學探究與迷思澄清學習系統 • 探究與實作自主學習模組
      </footer>
    </div>
  );
}