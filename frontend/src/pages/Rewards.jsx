import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Rewards() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  
  // Custom Theme Matrix Engine State
  const [activeTheme, setActiveTheme] = useState(localStorage.getItem('clutch_theme') || 'amber');
  const [customBgUrl, setCustomBgUrl] = useState(localStorage.getItem('clutch_custom_bg') || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe');
  const [bgInput, setBgInput] = useState('');

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('clutch_tasks') || '[]');
    setTasks(savedTasks);
  }, []);

  const isTaskFinished = (task) => task.subtasks && task.subtasks.length > 0 && task.subtasks.every(s => s.done);
  const completedTasksCount = tasks.filter(isTaskFinished).length;
  
  // XP Tracker Engine (Change this to test different tiers!)
  const xpPerTask = 100;
  const currentXp = completedTasksCount * xpPerTask;

  // Save selection states
  const selectTheme = (themeName) => {
    setActiveTheme(themeName);
    localStorage.setItem('clutch_theme', themeName);
  };

  const handleCustomBgSubmit = (e) => {
    e.preventDefault();
    if (bgInput.trim()) {
      setCustomBgUrl(bgInput);
      localStorage.setItem('clutch_custom_bg', bgInput);
      selectTheme('custom-image');
    }
  };

  const levelsSpec = [
    {
      rank: 1,
      title: "Rookie Operator",
      xpRequired: 0,
      perk: "Base Level Classic Theme",
      desc: "Standard Command Grid access featuring signature high-alert amber highlights.",
      status: "ACTIVE",
      icon: "⚙️"
    },
    {
      rank: 2,
      title: "Field Specialist",
      xpRequired: 500,
      perk: "Light Matrix Protocols & Cyber Pink Theme",
      desc: "Unlock the tactical Light theme variant and high-visibility Cyber Pink aesthetics.",
      status: currentXp >= 500 ? "UNLOCKED" : "LOCKED",
      icon: "🛰️"
    },
    {
      rank: 3,
      title: "Cyber Vanguard",
      xpRequired: 1500,
      perk: "Extended Heatmap & Custom Modifiers",
      desc: "Deep-dive diagnostic analytics calendars with automated burnout filters.",
      status: currentXp >= 1500 ? "UNLOCKED" : "LOCKED",
      icon: "⚡"
    },
    {
      rank: 4,
      title: "Grand Elite Master",
      xpRequired: 100000, // 1 Lakh XP Endgame Criterion
      perk: "God-Mode Custom Image Interface Matrix",
      desc: "The Ultimate Endgame Milestone. Inject any customized external network image directly behind your grid terminal.",
      status: currentXp >= 100000 ? "UNLOCKED" : "LOCKED",
      icon: "👑"
    }
  ];

  const currentRankObj = [...levelsSpec].reverse().find(lvl => currentXp >= lvl.xpRequired) || levelsSpec[0];

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 font-sans selection:bg-pink-500 selection:text-black p-8">
      
      {/* HEADER */}
      <header className="max-w-6xl mx-auto mb-10 flex items-center justify-between border-b border-slate-800/60 pb-6">
        <div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-slate-500 hover:text-pink-500 text-xs font-black tracking-widest uppercase mb-2 flex items-center gap-2 transition-colors"
          >
            ← Back to Command Grid
          </button>
          <h1 className="text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-300 to-slate-500">
            OPERATOR CORE PROGRESSION
          </h1>
        </div>
        
        <div className="bg-[#0b1324] border border-slate-800 px-6 py-3 rounded-xl text-right">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">SAVED WORKLOAD DATA balance</div>
          <div className="text-xl font-black text-pink-500">{currentXp.toLocaleString()} <span className="text-xs text-slate-400 font-normal">XP</span></div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: LIVE DRIVER STATS CARD */}
        <section className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-b from-[#0c1220] to-[#080d18] border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 p-4 font-mono text-[40px] opacity-10 select-none">{currentRankObj.icon}</div>
            <span className="text-[9px] font-black tracking-widest bg-pink-500/10 text-pink-400 px-2 py-0.5 rounded border border-pink-500/20 uppercase">
              NETWORK IDENTITY SECURED
            </span>
            <h2 className="text-2xl font-black text-white mt-4 tracking-wide uppercase">{currentRankObj.title}</h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">Rank Access Segment: Approved</p>
            
            <div className="h-[1px] bg-slate-800/80 my-5" />
            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold uppercase">Missions Accounted:</span>
                <span className="font-mono text-white font-bold">{completedTasksCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold uppercase">Dynamic Level Cap:</span>
                <span className="font-mono text-pink-400 font-bold">{currentRankObj.rank} / 4</span>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: PROGRESSION TREE TIERS */}
        <section className="lg:col-span-8 space-y-4">
          <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase mb-2">Progression Track & Reward Nodes</h3>
          <div className="space-y-4">
            {levelsSpec.map((lvl) => {
              const isActive = currentRankObj.rank === lvl.rank;
              const isLocked = lvl.status === "LOCKED";
              return (
                <div 
                  key={lvl.rank}
                  className={`border rounded-xl p-5 flex items-start gap-5 transition-all ${
                    isActive 
                      ? 'bg-[#14111d] border-pink-500/60 shadow-[0_0_20px_rgba(236,72,153,0.05)] ring-1 ring-pink-500/20' 
                      : isLocked ? 'bg-[#080d18]/40 border-slate-900 opacity-40' : 'bg-[#0c1220] border-slate-800'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg shrink-0 font-mono ${
                    isActive ? 'bg-pink-500 text-slate-950 font-black' : isLocked ? 'bg-slate-950 border border-slate-800 text-slate-600' : 'bg-slate-900 border border-slate-700 text-slate-200'
                  }`}>
                    {lvl.icon}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-white uppercase tracking-wide flex items-center gap-2">
                        Rank {lvl.rank}: {lvl.title} {isActive && <span className="text-[9px] font-black bg-pink-500 text-slate-950 px-1.5 py-0.2 rounded uppercase">CURRENT</span>}
                      </h4>
                      <span className="text-xs font-mono font-bold text-slate-500">{lvl.xpRequired.toLocaleString()} XP</span>
                    </div>
                    <p className="text-xs font-bold text-pink-400">🎁 Unlock: {lvl.perk}</p>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed pt-0.5">{lvl.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* HORIZONTAL THEME DOCK CONTROL HUB */}
      <section className="max-w-6xl mx-auto mt-12 pt-8 border-t border-slate-800/80">
        <h3 className="text-sm font-black tracking-widest text-slate-300 uppercase mb-6 flex items-center gap-2">
          🎨 SYSTEM MATRIX SKINS MATRIX LAB
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* THEME 1: CLASSIC AMBER */}
          <div className={`border p-5 rounded-2xl bg-[#0c1220] transition-all cursor-pointer relative ${activeTheme === 'amber' ? 'border-amber-500 shadow-lg' : 'border-slate-800 hover:border-slate-700'}`} onClick={() => selectTheme('amber')}>
            <div className="w-full h-20 bg-[#070b13] rounded-lg mb-3 border border-slate-800 flex items-center justify-center">
              <div className="bg-amber-500 text-slate-950 font-black text-[10px] px-3 py-1 rounded">AMBER</div>
            </div>
            <p className="text-xs font-black text-white uppercase">Classic Command Amber</p>
            <p className="text-[11px] text-slate-400 mt-1">Unlocked at Rank 1 base systems.</p>
          </div>

          {/* THEME 2: CYBER PINK */}
          <div className={`border p-5 rounded-2xl bg-[#0c1220] transition-all relative ${currentXp >= 500 ? 'cursor-pointer opacity-100' : 'opacity-40 pointer-events-none'} ${activeTheme === 'pink' ? 'border-pink-500 shadow-lg' : 'border-slate-800 hover:border-slate-700'}`} onClick={() => selectTheme('pink')}>
            <div className="w-full h-20 bg-[#0c0a12] rounded-lg mb-3 border border-slate-800 flex items-center justify-center">
              <div className="bg-pink-500 text-slate-950 font-black text-[10px] px-3 py-1 rounded">PINK</div>
            </div>
            <p className="text-xs font-black text-white uppercase">Cyber Neon Pink</p>
            <p className="text-[11px] text-slate-400 mt-1">{currentXp >= 500 ? "Unlocked & Ready." : "Requires 500 XP."}</p>
          </div>

          {/* THEME 3: LIGHT MODE PROTOCOLS */}
          <div className={`border p-5 rounded-2xl bg-[#0c1220] transition-all relative ${currentXp >= 500 ? 'cursor-pointer opacity-100' : 'opacity-40 pointer-events-none'} ${activeTheme === 'light' ? 'border-slate-400 shadow-lg' : 'border-slate-800 hover:border-slate-700'}`} onClick={() => selectTheme('light')}>
            <div className="w-full h-20 bg-slate-100 rounded-lg mb-3 border border-slate-300 flex items-center justify-center">
              <div className="bg-slate-900 text-white font-black text-[10px] px-3 py-1 rounded">LIGHT</div>
            </div>
            <p className="text-xs font-black text-white uppercase">Tactical Day-Run Light</p>
            <p className="text-[11px] text-slate-400 mt-1">{currentXp >= 500 ? "Unlocked & Ready." : "Requires 500 XP."}</p>
          </div>

          {/* THEME 4: 1 LAKH+ ENDGAME IMAGE WALLPAPER COMPONENT */}
          <div className={`border p-5 rounded-2xl bg-[#0c1220] transition-all relative ${currentXp >= 100000 ? 'opacity-100' : 'opacity-40'}`}>
            <div className="w-full h-20 rounded-lg mb-3 overflow-hidden border border-slate-800 relative bg-cover bg-center" style={{ backgroundImage: `url(${customBgUrl})` }}>
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[10px] text-emerald-400 font-mono font-black">IMAGE LAYER</div>
            </div>
            <p className="text-xs font-black text-white uppercase">Custom Wallpaper Matrix</p>
            
            {currentXp >= 100000 ? (
              <form onSubmit={handleCustomBgSubmit} className="mt-2 flex gap-1">
                <input 
                  type="text" 
                  value={bgInput}
                  onChange={(e) => setBgInput(e.target.value)}
                  placeholder="Paste Image URL..." 
                  className="bg-slate-950 border border-slate-800 text-[10px] p-1.5 rounded flex-1 outline-none focus:border-pink-500 text-slate-300"
                />
                <button type="submit" className="bg-pink-500 text-slate-950 px-2 rounded font-black text-[10px] uppercase">Inject</button>
              </form>
            ) : (
              <p className="text-[11px] text-slate-400 mt-1">Requires 1 Lakh (100,000) XP.</p>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}