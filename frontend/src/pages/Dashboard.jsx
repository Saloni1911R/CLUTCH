import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 🟢 STEP 1: Add the dynamic API base address setup here
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://clutch-backend-placeholder-xxxx.a.run.app' // We will replace this with your actual Google Cloud URL later!
  : 'http://localhost:5001';

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  
  // Game Systems State
  const [streak, setStreak] = useState(() => Number(localStorage.getItem('clutch_streak')) || 7);
  const [userMood, setUserMood] = useState('🔥 Locked In');
  const [xpPopup, setXpPopup] = useState(null); 
  const [expandedTasks, setExpandedTasks] = useState({}); 

  // Modals & UI Toggles
  const [activeSimulatorTask, setActiveSimulatorTask] = useState(null);
  const [clutchOverrides, setClutchOverrides] = useState({}); // Stores custom toggled Clutch modes

  // Live Calendar State Initialization
  const [currentDate, setCurrentDate] = useState(new Date()); 

  // Ace (AI Wingman) States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // 🎨 READ SAVED PROGRESSION THEME DOCK FROM LOCALSTORAGE
  const savedTheme = localStorage.getItem('clutch_theme') || 'amber';
  const savedBgImage = localStorage.getItem('clutch_custom_bg') || '';

  // User Profile Customizations for Productive DNA
  const [focusWindow, setFocusWindow] = useState(() => localStorage.getItem('clutch_focus_window') || '8PM - 11PM');
  const [criticalZone, setCriticalZone] = useState(() => localStorage.getItem('clutch_critical_zone') || '7AM - 10AM');

  // Dynamic user-scoped identifier configuration 
  const currentUser = localStorage.getItem('clutch_username') || 'default_gamer';

  // --- 👤 SYNCHRONIZED IDENTITY LIFECYCLE LOGIC ---
  const [computedUser, setComputedUser] = useState(
    (localStorage.getItem('clutch_username') || 'default_gamer').trim().toLowerCase()
  );

  useEffect(() => {
    const syncIdentity = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email) {
          const oauthUsername = user.email.split('@')[0].trim().toLowerCase();
          localStorage.setItem('clutch_username', oauthUsername);
          setComputedUser(oauthUsername);
        }
      } catch (err) {
        console.log("Supabase identity pass omitted.");
      }
    };
    syncIdentity();
  }, []);

  // --- 🛠️ REALTIME FLASK OPERATION LAYER ENGINE ---
  const fetchTasksFromBackend = async () => {
    try {
      // 🟢 Updated URL
      const response = await axios.get(`${API_BASE_URL}/api/tasks?username=${computedUser}`);
      
      if (response.data && response.data.length > 0) {
        setTasks(response.data);
      } else {
        console.warn(`📡 Zero channels for "${computedUser}". Pulling root telemetry context...`);
        // 🟢 Updated URL
        const globalResponse = await axios.get(`${API_BASE_URL}/api/tasks`);
        setTasks(globalResponse.data || []);
      }
    } catch (err) {
      console.error("❌ Failed to pull operational strategy layers from python backend server:", err);
    }
  };

  useEffect(() => {
    fetchTasksFromBackend();
  }, [computedUser]);

  useEffect(() => {
    if (tasks.length > 0) {
      console.log("CLUTCH REGISTERED TASKS ARCHITECTURE:", tasks);
    }
  }, [tasks]);

  const isTaskFinished = (task) => {
    if (task.status === 'completed') return true;
    
    const subtaskList = task.subtasks || task.tactical_subtasks || [];
    if (subtaskList.length > 0) {
      return subtaskList.every(s => typeof s === 'object' ? s.done : false);
    }
    return false;
  };

  const triggerXpPopup = (text, points) => {
    setXpPopup({ text, points });
    setTimeout(() => setXpPopup(null), 3500); 
  };

  const forceCompleteTask = async (taskId) => {
    const targetTask = tasks.find(
      t => String(t.id) === String(taskId) || String(t._id) === String(taskId)
    );

    try {
      const subtaskList = targetTask?.subtasks || targetTask?.tactical_subtasks || [];
      const completedSubtasks = subtaskList.map(s =>
        typeof s === "object"
          ? { ...s, done: true }
          : { text: s, done: true }
      );

      // 🟢 Updated URL
      await axios.put(`${API_BASE_URL}/api/tasks/${taskId}`, {
        status: "completed",
        subtasks: completedSubtasks
      });

      triggerXpPopup("VICTORY", 150);
      fetchTasksFromBackend();
    } catch (err) {
      console.error(err);
    }
  };

  const unclaimTask = async (taskId) => {
    try {
      const targetTask = tasks.find(t => t.id === taskId || t._id === taskId);
      const subtaskList = targetTask?.subtasks || targetTask?.tactical_subtasks || [];
      const resetSubtasks = subtaskList.map(s => typeof s === 'object' ? { ...s, done: false } : { text: s, done: false });
      
      // 🟢 Updated URL
      await axios.put(`${API_BASE_URL}/api/tasks/${taskId}`, {
        status: 'pending',
        subtasks: resetSubtasks
      });
      
      triggerXpPopup("CAMPAIGN REVERTED", -100);
      fetchTasksFromBackend();
    } catch (err) {
      console.error("❌ Failed to revert status state:", err);
    }
  };

  const toggleSubtask = async (taskId, subtaskIdx, subtaskText) => {
    const targetTask = tasks.find(t => t.id === taskId || t._id === taskId);
    if (!targetTask) return;

    const rawSubtasks = targetTask.subtasks || targetTask.tactical_subtasks || [];
    const updatedSubtasks = rawSubtasks.map((s, i) => {
      if (typeof s === 'object') return { ...s };
      return { text: s, done: false };
    });

    const initialStatus = updatedSubtasks[subtaskIdx].done;
    updatedSubtasks[subtaskIdx].done = !updatedSubtasks[subtaskIdx].done;
    
    if (!initialStatus === true) {
      triggerXpPopup("OBJECTIVE CLEARED", 20);
    }

    const nextStatus = updatedSubtasks.every(s => s.done) ? 'completed' : 'pending';

    try {
      // 🟢 Updated URL
      await axios.put(`${API_BASE_URL}/api/tasks/${taskId}`, {
        subtasks: updatedSubtasks,
        status: nextStatus
      });
      
      if (nextStatus === 'completed') {
        triggerXpPopup("VICTORY", 150);
      }
      
      fetchTasksFromBackend();
    } catch (err) {
      console.error("❌ Failed to sync subtask item toggle update:", err);
    }
  };

  const toggleTaskDropdown = (taskId) => {
    setExpandedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const toggleClutchOverride = (taskId) => {
    setClutchOverrides(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const calculateClutchScore = (task) => {
    if (clutchOverrides[task.id || task._id]) return 92; 
    let score = 30;
    if (task.workload?.toLowerCase() === 'high' || task.workload?.toLowerCase() === 'large') score += 35;
    if (task.workload?.toLowerCase() === 'medium') score += 15;
    
    const subtaskList = task.subtasks || task.tactical_subtasks || [];
    const completedCount = subtaskList.filter(s => typeof s === 'object' ? s.done : false).length;
    const totalCount = subtaskList.length;
    const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    score += Math.round((100 - pct) * 0.35);
    return Math.min(Math.max(score, 15), 100);
  };

  const openAceChat = (task) => {
    setActiveTask(task);
    setIsSidebarOpen(true);
    
    const currentUserName = localStorage.getItem('clutch_username') || "Gamer";
    let moodGreeting = `Yo ${currentUserName} 👋\n\nLooks like your "${task.objective}" assignment is getting dangerous. Want me to help you recover it? Let's design a flawless play line.`;
    
    if (userMood === '😴 Tired') {
      moodGreeting = `Hey ${currentUserName}, no stress at all if you're wiped out today. 😴\n\nLet's make this light work. What's one tiny milestone we can smash out together right now on "${task.objective}"?`;
    }

    setChatMessages([{ sender: 'ai', text: moodGreeting }]);
    setUserInput(''); 
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || aiLoading) return;

    const userMsg = { sender: 'user', text: userInput };
    setChatMessages(prev => [...prev, userMsg]);
    
    const sendingInput = userInput;
    setUserInput('');
    setAiLoading(true);

    try {
      // 🟢 Updated URL
      const response = await axios.post(`${API_BASE_URL}/api/tasks/generate-preview`, {
        objective: activeTask.objective,
        user_message: sendingInput, 
        workload: activeTask.workload
      });

      const aiReplyText = response.data.tactical_subtasks && response.data.tactical_subtasks[0]
        ? response.data.tactical_subtasks[0]
        : "Let's go! I've updated our play line. What are we tracking next?";

      setChatMessages(prev => [...prev, { sender: 'ai', text: aiReplyText }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { sender: 'ai', text: "Ace: Connection flickered! Make sure our Flask server is up and listening." }]);
    } finally {
      setAiLoading(false);
    }
  };

  const completedTasksCount = tasks.filter(isTaskFinished).length;
  const activeRemainingTasks = tasks.filter(t => !isTaskFinished(t)).length;
  const totalOperationsCount = tasks.length;
  
  const xpPerTask = 100;
  const currentXp = completedTasksCount * xpPerTask;
  const totalXpCap = Math.max(tasks.length * xpPerTask, xpPerTask); 
  const completionPercentage = Math.round((currentXp / totalXpCap) * 100);

  let themeBgClass = "bg-[#070b13] text-slate-100";
  let themeCardClass = "bg-[#0c1220] text-slate-100"; 
  let themeHeaderClass = "bg-[#0c1220]/80"; 
  let themeInputClass = "bg-[#060a12] border-slate-800 text-white";
  let themeTextClass = "text-slate-100";
  let primaryBtnClass = "bg-amber-500 hover:bg-amber-400 text-slate-950";
  let accentTextClass = "text-amber-500";
  let inlineStyle = {};

  let themeBorderClass = "border border-amber-400/30 shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all duration-300";

  if (savedTheme === 'pink' || savedTheme === 'rose') {
    themeBgClass = "bg-[#0f0913] text-pink-50";
    themeCardClass = "bg-[#180f20] text-pink-50";
    themeHeaderClass = "bg-[#180f20]/80";
    themeInputClass = "bg-[#0b0610] border-pink-900 text-white";
    themeTextClass = "text-pink-100";
    primaryBtnClass = "bg-pink-500 hover:bg-pink-400 text-slate-950 shadow-pink-500/10";
    accentTextClass = "text-pink-500";
    themeBorderClass = "border border-pink-400/30 shadow-[0_0_15px_rgba(236,72,153,0.15)] hover:shadow-[0_0_25px_rgba(236,72,153,0.3)] transition-all duration-300";
  } else if (savedTheme === 'blue') {
    themeBorderClass = "border border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] transition-all duration-300";
  } else if (savedTheme === 'emerald') {
    themeBorderClass = "border border-emerald-400/30 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all duration-300";
  } else if (savedTheme === 'purple') {
    themeBorderClass = "border border-purple-400/30 shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] transition-all duration-300";
  } else if (savedTheme === 'light') {
    themeBgClass = "bg-slate-50 text-slate-900";
    themeCardClass = "bg-white text-slate-900 shadow-sm";
    themeHeaderClass = "bg-white/90";
    themeInputClass = "bg-slate-50 border-slate-200 text-slate-900";
    themeTextClass = "text-slate-800";
    primaryBtnClass = "bg-slate-900 hover:bg-slate-800 text-white";
    accentTextClass = "text-slate-900 font-black";
    themeBorderClass = "border border-slate-300 shadow-sm transition-all duration-300";
  } else if (savedTheme === 'custom-image' && savedBgImage) {
    themeBgClass = "bg-cover bg-center bg-fixed text-slate-100 relative before:content-[''] before:absolute before:inset-0 before:bg-slate-950/85 before:z-0";
    themeCardClass = "bg-slate-900/60 text-slate-100 backdrop-blur-md relative z-10";
    themeHeaderClass = "bg-slate-900/70 backdrop-blur-md relative z-10";
    themeInputClass = "bg-slate-950/80 border-slate-700 text-white";
    themeTextClass = "text-slate-100 relative z-10";
    primaryBtnClass = "bg-amber-500 hover:bg-amber-400 text-slate-950";
    accentTextClass = "text-amber-400";
    inlineStyle = { backgroundImage: `url(${savedBgImage})` };
    themeBorderClass = "border border-amber-400/20 shadow-[0_0_15px_rgba(245,158,11,0.1)] backdrop-blur-md relative z-10 transition-all duration-300";
  }

  const activeTasks = tasks.filter(t => !isTaskFinished(t));
  const overallClutchScore = activeTasks.length > 0 
    ? Math.max(...activeTasks.map(t => calculateClutchScore(t))) 
    : 0;

  return (
    <div style={inlineStyle} className={`min-h-screen font-sans selection:bg-amber-500 selection:text-black relative ${themeBgClass}`}>
      
      {/* PREDICTIVE FUTURE FAILURE SIMULATOR MODAL PANEL */}
      {activeSimulatorTask && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center z-[99999] animate-fadeIn p-4">
          <div className="w-full max-w-lg p-6 rounded-2xl border border-slate-800 bg-[#0c1224] text-slate-100 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔮</span>
                <h3 className="text-sm font-black tracking-widest text-slate-400 uppercase">FUTURE FAILURE PROJECTION Matrix</h3>
              </div>
              <button onClick={() => setActiveSimulatorTask(null)} className="text-slate-400 hover:text-white font-mono font-bold text-base">✕</button>
            </div>

            <div className="text-sm text-slate-400 mb-4 uppercase font-bold tracking-wider">
              Target Objective: <span className="text-white text-base capitalize font-black">{activeSimulatorTask.objective}</span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-red-900/30 bg-red-950/20 flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black tracking-wider text-red-400 uppercase">IF YOU DO NOTHING</span>
                  <span className="text-sm font-mono font-black text-red-500 uppercase">❌ Miss Deadline</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Calculated Probability:</span>
                  <span className="font-bold font-mono text-red-400 text-sm">91% Risk Velocity</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-amber-900/20 bg-amber-950/10 flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black tracking-wider text-amber-400 uppercase">IF YOU WORK 2 HOURS DAILY</span>
                  <span className="text-sm font-mono font-black text-amber-400 uppercase">✅ Success Probability</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Calculated Probability:</span>
                  <span className="font-bold font-mono text-amber-400 text-sm">84% Completion Rate</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-emerald-900/30 bg-emerald-950/20 flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black tracking-wider text-emerald-400 uppercase">IF YOU WORK 4 HOURS DAILY</span>
                  <span className="text-sm font-mono font-black text-emerald-400 uppercase">🏆 Guaranteed Finish</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Calculated Probability:</span>
                  <span className="font-bold font-mono text-emerald-400 text-sm">97% Production Rate</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                setActiveSimulatorTask(null);
                openAceChat(activeSimulatorTask);
              }} 
              className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black tracking-wider uppercase text-sm py-3 rounded-xl transition-all"
            >
              ⚡ Load Tactical Recovery Playbook with Ace
            </button>
          </div>
        </div>
      )}

      {/* CINEMATIC VALORANT MATCH VICTORY BANNER POPUP */}
      {xpPopup && (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-[999999] pointer-events-none bg-slate-950/40 backdrop-blur-[1px] animate-fadeIn">
          <div className="w-full bg-gradient-to-r from-transparent via-[#dec177]/95 to-transparent py-7 border-y-2 border-[#efe3be]/60 text-center shadow-[0_0_60px_rgba(222,193,119,0.4)] transform scale-100 transition-all duration-300">
            <h1 className="text-6xl md:text-7xl font-black tracking-[0.3em] text-[#fdfff7] drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] font-sans uppercase italic select-none pl-[0.3em]">
              {xpPopup.text}
            </h1>
            <p className="text-xs md:text-sm font-mono font-black tracking-[0.45em] text-[#0f1622] uppercase mt-2.5 select-none pl-[0.45em]">
              MATCH PERFORMANCE AWARDED // {xpPopup.points > 0 ? `+${xpPopup.points}` : xpPopup.points} XP SECURED
            </p>
          </div>
        </div>
      )}

      {/* HEADER BAR */}
      <header className={`backdrop-blur-md sticky top-0 z-40 px-8 py-5 flex items-center justify-between ${themeHeaderClass} ${themeBorderClass}`}>
        <div className="flex items-center gap-4">
          <div className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
          <div>
            <div className="text-xs font-black text-slate-400 tracking-[0.2em] uppercase flex items-center gap-2">
              SYSTEM ONLINE // OPERATOR 
              <span className={`${accentTextClass} font-bold ml-2 text-sm`}>🔥 {streak || 7} DAY MOMENTUM STREAK</span>
            </div>
            <h1 className={`text-3xl font-black tracking-wider ${savedTheme === 'light' ? 'text-slate-900' : 'text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400'}`}>
              CLUTCH<span className={accentTextClass}>.</span>
            </h1>
          </div>
        </div>

        {/* VIBE CHECK CONTROLS */}
        <div className={`flex items-center gap-6 px-4 py-2 rounded-xl border ${savedTheme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-[#090e1a] border-slate-800'}`}>
          <span className="text-sm font-bold text-slate-400 tracking-wider uppercase">Vibe Check:</span>
          <div className="flex gap-2">
            {['😴 Tired', '😐 Normal', '🔥 Locked In'].map((mood) => (
              <button
                key={mood}
                onClick={() => setUserMood(mood)}
                className={`text-sm px-4 py-2 rounded-lg font-bold transition-all ${
                  userMood === mood 
                    ? `${primaryBtnClass} shadow-md scale-105` 
                    : 'bg-slate-900/50 text-slate-400 hover:text-white'
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button 
            onClick={() => navigate('/rewards')} 
            className={`border font-bold text-sm uppercase tracking-widest px-5 py-3 rounded-xl transition-all ${savedTheme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100' : 'bg-[#0c1220] border-slate-800 text-slate-300 hover:bg-slate-800'}`}
          >
            🏅 View Ranks
          </button>
          <button 
            onClick={() => navigate('/add-task')} 
            className={`font-black text-sm uppercase tracking-widest px-6 py-3 rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2 ${primaryBtnClass}`}
          >
            🚀 New Mission
          </button>
        </div>
      </header>

      {/* THREE-COLUMN BATTLEGRID LAYOUT */}
      <main className="max-w-[1600px] mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* LEFT COLUMN: CRITICAL COMMAND MODULES & INTELLIGENCE DATA */}
        <section className="lg:col-span-4 space-y-6">

          <div className={`rounded-2xl p-6 hover:-translate-y-1 hover:scale-[1.01] ${themeCardClass} ${themeBorderClass}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest mb-1">
                  💥 CURRENT CLUTCH PROFILE RATIO
                </div>
                <div className="text-4xl font-black tracking-tight text-white flex items-baseline gap-2">
                  {overallClutchScore} <span className="text-xs font-mono font-bold text-slate-500">/ 100 PTS</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-[10px] font-mono font-black text-amber-500 tracking-wider uppercase mb-1">
                  ⚡ DAILY STREAK
                </div>
                <div className="text-2xl font-black text-amber-400 font-mono flex items-center justify-end gap-1">
                  🔥 {streak}
                </div>
              </div>
            </div>

            <div className="w-full bg-slate-950/80 h-3 rounded-full border border-slate-900 overflow-hidden p-0.5 shadow-inner">
              <div 
                className={`h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_currentColor] ${
                  overallClutchScore > 80 
                    ? "bg-gradient-to-r from-red-600 to-amber-500 text-red-500" 
                    : "bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 text-amber-400"
                }`}
                style={{ width: `${overallClutchScore}%` }}
              />
            </div>

            <div className="flex items-center justify-between mt-3 text-[11px] font-mono font-bold text-slate-400">
              <span className="uppercase">STATUS ALPHA WINDOW</span>
              <span className="text-slate-500 uppercase">{userMood}</span>
            </div>
          </div>

          {/* HEATMAP CALENDAR (STREAK SYSTEM) */}
          <div className={`rounded-2xl p-6 relative overflow-hidden shadow-xl hover:-translate-y-1 hover:scale-[1.01] ${themeCardClass} ${themeBorderClass}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔥</span>
                <h4 className={`text-sm font-black tracking-wider uppercase ${themeTextClass}`}>
                  MOMENTUM STREAK RADAR
                </h4>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
                LIVE GRID
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-black tracking-widest text-slate-500 uppercase mb-2">
              <div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div><div>S</div>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {(() => {
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const firstDayOfMonth = new Date(year, month, 1);
                let startOffset = firstDayOfMonth.getDay() - 1; 
                if (startOffset === -1) startOffset = 6; 

                const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
                const calendarCells = [];

                for (let i = 0; i < startOffset; i++) {
                  calendarCells.push(<div key={`empty-${i}`} className="w-full aspect-square opacity-0" />);
                }

                for (let day = 1; day <= totalDaysInMonth; day++) {
                  const lookupStringDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  
                  const targetDayTasks = tasks.filter(task => {
                    const stringMatch = task.deadline && task.deadline.includes(lookupStringDate);
                    const explicitMatch = Number(task.deadlineDay) === day;
                    return stringMatch || explicitMatch;
                  });

                  const workloads = targetDayTasks.map(t => t.workload?.toLowerCase() || 'medium');

                  let dayColorClass = "bg-[#0f192e] border-transparent text-slate-400"; 
                  if (workloads.includes('large') || workloads.includes('high')) {
                    dayColorClass = "bg-[#9e1634] border-[#f43f5e] text-white animate-pulse";
                  } else if (workloads.includes('medium')) {
                    dayColorClass = "bg-[#d97706] border-[#f59e0b] text-slate-950 font-black";
                  } else if (workloads.includes('small') || workloads.includes('low')) {
                    dayColorClass = "bg-[#10b981] border-[#34d399] text-slate-950 font-bold";
                  } else if (targetDayTasks.length > 0) {
                    dayColorClass = "bg-[#0284c7] border-[#38bdf8] text-white";
                  }

                  calendarCells.push(
                    <div key={`day-${day}`} className={`w-full aspect-square rounded-[4px] border text-xs font-mono flex items-center justify-center relative group ${dayColorClass}`}>
                      <span>{day}</span>
                      {targetDayTasks.length > 0 && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-950 text-white text-[10px] py-1 px-2 rounded border border-slate-800 whitespace-nowrap z-30">
                          {targetDayTasks.length} Active Target Lines
                        </div>
                      )}
                    </div>
                  );
                }
                return calendarCells;
              })()}
            </div>
          </div>

          {/* PROFILE DNA INTELLIGENCE LOG */}
          <div className={`rounded-2xl p-6 relative overflow-hidden shadow-xl hover:-translate-y-1 hover:scale-[1.01] ${themeCardClass} ${themeBorderClass}`}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🧬</span>
              <h4 className={`text-sm font-black tracking-wider uppercase ${themeTextClass}`}>PRODUCTIVE DNA LOGS</h4>
            </div>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-900 flex justify-between items-center">
                <span className="text-slate-400 uppercase font-bold">⚡ Focus Window:</span>
                <span className="text-amber-400 font-black">{focusWindow}</span>
              </div>
              <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-900 flex justify-between items-center">
                <span className="text-slate-400 uppercase font-bold">🚨 Critical Hazard Zone:</span>
                <span className="text-red-400 font-black">{criticalZone}</span>
              </div>
            </div>
          </div>

          {/* EXP STATS MODULE */}
          <div className={`rounded-2xl p-6 relative overflow-hidden shadow-xl hover:-translate-y-1 hover:scale-[1.01] ${themeCardClass} ${themeBorderClass}`}>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-black tracking-widest text-slate-400 uppercase font-mono">LEVEL EXPERIENCE PROGRESSION</h4>
              <span className="text-xs font-bold text-slate-400 font-mono">{currentXp} / {totalXpCap} XP</span>
            </div>
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-900 p-[2px]">
              <div 
                style={{ width: `${Math.min(completionPercentage, 100)}%` }} 
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500" 
              />
            </div>
            <div className="mt-2 text-[11px] font-mono text-slate-500 text-right uppercase">
              {completionPercentage}% System Calibration Complete
            </div>
          </div>
        </section>

        {/* MIDDLE COLUMN: LIVE WORKFLOW CAMPAIGNS */}
        <section className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/30 pb-3">
            <h2 className="text-sm font-black tracking-widest uppercase text-slate-400 flex items-center gap-2">
              ⚡ Active Campaigns <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-full font-mono font-bold">{activeRemainingTasks}</span>
            </h2>
          </div>

          {tasks
            .filter(t => !isTaskFinished(t))
            .map((task) => {
              const score = calculateClutchScore(task);
              const isClutchActive = score > 80;
              const rawSubtasks = task.subtasks || task.tactical_subtasks || [];

              return (
                <div 
                  key={task._id || task.id}
                  className={`rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 hover:scale-[1.01] ${themeCardClass} ${
                    isClutchActive 
                      ? 'border border-red-500/40 bg-gradient-to-b from-[#160b11] to-[#0c1220] shadow-[0_0_20px_rgba(239,68,68,0.05)]' 
                      : themeBorderClass
                  }`}
                >
                  {isClutchActive && (
                    <div className="absolute top-0 right-0 bg-red-500 text-slate-950 text-[9px] font-mono font-black px-3 py-1 uppercase tracking-widest rounded-bl-xl shadow-md animate-pulse">
                      ⚠️ HIGH RISK VECTOR ACTIVE
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold tracking-wide text-white capitalize group-hover:text-amber-400 transition-colors">
                        🎯 {task.objective}
                      </h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-900 font-mono">
                          ⏳ {task.deadlineText || task.deadline || "Urgent Window"}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-mono">
                          📊 {task.workload || "Medium"} Load
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => forceCompleteTask(task._id || task.id)}
                        className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/20 font-black text-xs uppercase tracking-wider px-3 py-2 rounded-xl transition-all shadow-sm"
                      >
                        🏆 Clear
                      </button>
                      <button 
                        onClick={() => toggleTaskDropdown(task._id || task.id)}
                        className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs font-bold px-3 py-2 rounded-xl border border-slate-800"
                      >
                        {expandedTasks[task._id || task.id] ? '▲' : '▼'}
                      </button>
                    </div>
                  </div>

                  {/* EXPANDABLE SUBTASK TARGET GRID */}
                  {expandedTasks[task._id || task.id] && (
                    <div className="mt-4 pt-4 border-t border-slate-900/60 space-y-2 animate-slideDown">
                      <div className="text-[11px] font-mono font-black tracking-widest text-slate-500 uppercase mb-3">
                        TACTICAL ENGAGEMENT PLAN LINE:
                      </div>
                      {rawSubtasks.map((sub, idx) => {
                        const isDone = typeof sub === 'object' ? sub.done : false;
                        const displayLabel = typeof sub === 'object' ? sub.text : sub;

                        return (
                          <div 
                            key={idx} 
                            onClick={() => toggleSubtask(task._id || task.id, idx, displayLabel)}
                            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                              isDone 
                                ? 'bg-emerald-950/10 border-emerald-900/30 text-slate-500 line-through' 
                                : 'bg-slate-950/40 border-slate-900 text-slate-200 hover:border-slate-700'
                            }`}
                          >
                            <span className="text-sm capitalize font-medium">{displayLabel}</span>
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center font-mono text-[10px] transition-all ${
                              isDone ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-black' : 'border-slate-800 bg-slate-950'
                            }`}>
                              {isDone && "✓"}
                            </div>
                          </div>
                        );
                      })}

                      {/* DYNAMIC COMBAT FOOTER TRIGGERS */}
                      <div className="flex items-center justify-between pt-3 mt-4 text-xs border-t border-slate-900/30">
                        <button 
                          onClick={() => setActiveSimulatorTask(task)}
                          className="text-indigo-400 hover:text-indigo-300 uppercase tracking-wider font-mono font-bold flex items-center gap-1.5"
                        >
                          🔮 Run Failure Projection Matrix
                        </button>
                        <button 
                          onClick={() => openAceChat(task)}
                          className="text-amber-500 hover:text-amber-400 uppercase tracking-wider font-mono font-black flex items-center gap-1"
                        >
                          💬 Talk to Ace Wingman →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </section>

      </main>

      {/* ACE AI SIDEBAR PANEL */}
      {isSidebarOpen && activeTask && (
        <div className={`fixed top-0 right-0 h-full w-[420px] border-l shadow-2xl z-50 flex flex-col hover:-translate-y-1 hover:scale-[1.01] ${themeCardClass} ${themeBorderClass}`}>
          <div className="p-4 border-b border-slate-900 flex justify-between items-center bg-[#090e1a]">
            <div>
              <div className="text-[10px] font-black text-amber-500 tracking-widest font-mono uppercase">COGNITIVE INTERCEPTOR ACTIVE</div>
              <h3 className="text-sm font-black tracking-wider uppercase text-white font-mono">💬 TALK TO ACE</h3>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-white font-black text-base">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#070b13]/40">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-base whitespace-pre-wrap leading-relaxed ${
                  msg.sender === 'user' ? `${primaryBtnClass} font-bold rounded-tr-none shadow-sm` : 'bg-[#121b2e] border border-slate-800 text-slate-200 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {aiLoading && (
              <div className="flex justify-start">
                <div className="bg-[#121b2e] border border-slate-800 text-slate-400 rounded-2xl rounded-tl-none px-4 py-3 text-xs font-mono animate-pulse">
                  Ace is mapping tactical response pathways...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-[#090e1a] border-t border-slate-900 flex gap-2">
            <input 
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask Ace for strategy modifications..."
              className={`flex-1 rounded-xl px-4 py-3 text-sm outline-none transition-colors ${themeInputClass}`}
            />
            <button type="submit" className={`font-black px-5 rounded-xl text-sm uppercase tracking-wider transition-colors ${primaryBtnClass}`}>
              Send
            </button>
          </form>
        </div>
      )}

    </div>
  );
}