import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CalendarView() {
  const [tasks, setTasks] = useState([]);
  
  // Adjusted keys to read uniformly from 'clutch_username' to preserve auth identity mappings
  const activeUser = localStorage.getItem('clutch_username') || localStorage.getItem('username') || 'default_gamer';
  
  const today = new Date();
  const currentYear = today.getFullYear(); // Will deterministically map inside your 2026 runtime environment
  const currentMonth = today.getMonth();

  useEffect(() => {
    axios.get(`http://localhost:5001/api/tasks?username=${activeUser}`)
      .then(res => setTasks(res.data || []))
      .catch(err => console.error("❌ Failed to pull operational calendar datasets:", err));
  }, [activeUser]);

  // Generate date markers for a standard calendar offset grid layout context
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Determine starting day offset padding elements (Aligns days perfectly with weekday headers)
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const blankPaddingCells = Array.from({ length: firstDayIndex }, (_, i) => i);

  // 🎨 READ SAVED PROGRESSION THEME DOCK FROM LOCALSTORAGE
  const savedTheme = localStorage.getItem('clutch_theme') || 'amber';
  const savedBgImage = localStorage.getItem('clutch_custom_bg') || '';

  // 🎛️ CORE THEME UTILITY STYLE RESOLVER
  let themeBgClass = "bg-[#070b13] text-slate-100";
  let themeCardClass = "bg-[#0c1220] text-slate-100"; 
  let themeHeaderClass = "text-white"; 
  let accentTextClass = "text-amber-500";
  let badgeColorClass = "bg-amber-500/10 text-amber-500 border-amber-500/20";
  let inlineStyle = {};

  // 🎨 INITIALIZE HIGH-GAMING PERFORMANCE BORDER VECTOR MAP
  let themeBorderClass = "border border-amber-400/30 shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all duration-300";

  if (savedTheme === 'pink' || savedTheme === 'rose') {
    themeBgClass = "bg-[#0f0913] text-pink-50";
    themeCardClass = "bg-[#180f20] text-pink-50";
    themeHeaderClass = "text-pink-100";
    accentTextClass = "text-pink-500";
    badgeColorClass = "bg-pink-500/10 text-pink-400 border-pink-500/20";
    themeBorderClass = "border border-pink-400/30 shadow-[0_0_15px_rgba(236,72,153,0.15)] hover:shadow-[0_0_25px_rgba(236,72,153,0.3)] transition-all duration-300";
  } else if (savedTheme === 'blue') {
    accentTextClass = "text-blue-500";
    badgeColorClass = "bg-blue-500/10 text-blue-400 border-blue-500/20";
    themeBorderClass = "border border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] transition-all duration-300";
  } else if (savedTheme === 'emerald') {
    accentTextClass = "text-emerald-500";
    badgeColorClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    themeBorderClass = "border border-emerald-400/30 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all duration-300";
  } else if (savedTheme === 'purple') {
    accentTextClass = "text-purple-500";
    badgeColorClass = "bg-purple-500/10 text-purple-400 border-purple-500/20";
    themeBorderClass = "border border-purple-400/30 shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] transition-all duration-300";
  } else if (savedTheme === 'light') {
    themeBgClass = "bg-slate-50 text-slate-900";
    themeCardClass = "bg-white text-slate-900";
    themeHeaderClass = "text-slate-900 font-black";
    accentTextClass = "text-slate-900";
    badgeColorClass = "bg-slate-900 text-white border-transparent";
    themeBorderClass = "border border-slate-300 shadow-sm transition-all duration-300";
  } else if (savedTheme === 'custom-image' && savedBgImage) {
    themeBgClass = "bg-cover bg-center bg-fixed text-slate-100 relative before:content-[''] before:absolute before:inset-0 before:bg-slate-950/85 before:z-0";
    themeCardClass = "bg-slate-900/60 text-slate-100 backdrop-blur-md relative z-10";
    themeHeaderClass = "text-white relative z-10";
    accentTextClass = "text-amber-400";
    badgeColorClass = "bg-amber-500/20 text-amber-300 border-amber-500/30";
    inlineStyle = { backgroundImage: `url(${savedBgImage})` };
    themeBorderClass = "border border-amber-400/20 shadow-[0_0_15px_rgba(245,158,11,0.1)] backdrop-blur-md relative z-10 transition-all duration-300";
  }

  return (
    <div style={inlineStyle} className={`min-h-screen font-sans p-8 flex flex-col justify-start relative overflow-y-auto ${themeBgClass}`}>
      
      {/* Background Combat Grid Accent Line Layer Decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-10 pointer-events-none" />

      {/* Main Structural Layout Wrap Context */}
      <div className="w-full max-w-6xl mx-auto relative z-10 space-y-6">
        
        {/* Calendar Main Heading Layout */}
        <div className={`p-6 rounded-2xl flex items-center justify-between shadow-xl border ${themeCardClass} ${themeBorderClass} hover:-translate-y-1 hover:scale-[1.01]`}>
          <div>
            <span className={`text-[10px] font-mono font-black tracking-widest uppercase block mb-1 ${accentTextClass}`}>
              ⚡ TELEMETRY STRATEGY DEPLOYMENT MAPPING
            </span>
            <h2 className={`text-2xl font-black uppercase tracking-tight ${themeHeaderClass}`}>
              📅 Operational Strategy Calendar ({today.toLocaleString('default', { month: 'long' })} {currentYear})
            </h2>
          </div>
          <span className={`text-xs font-mono font-black uppercase border px-3 py-1.5 rounded-xl tracking-wider ${badgeColorClass}`}>
            Live Grid View
          </span>
        </div>

        {/* Calendar Core Grid Component */}
        <div className={`p-6 rounded-2xl shadow-xl border grid grid-cols-7 gap-3 ${themeCardClass} ${themeBorderClass}`}>
          
          {/* Weekday Identity Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div 
              key={d} 
              className="font-mono text-xs font-black uppercase text-slate-500 tracking-widest text-center pb-2 border-b border-slate-800/40"
            >
              {d}
            </div>
          ))}

          {/* Padding Empty Balancing Box Layout Arrays */}
          {blankPaddingCells.map(idx => (
            <div key={`blank-${idx}`} className="min-h-[110px] bg-slate-950/20 opacity-30 rounded-xl pointer-events-none" />
          ))}

          {/* Live Strategy Active Numeric Month Cells */}
          {daysArray.map(day => {
            const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            // Evaluates deadline format properties against local database values seamlessly
            const dayTasks = tasks.filter(t => {
              const matchesStringDeadline = t.deadline && t.deadline.includes(dateString);
              const matchesNumericDeadline = Number(t.deadlineDay) === day;
              return matchesStringDeadline || matchesNumericDeadline;
            });

            const hasActiveObjectives = dayTasks.length > 0;

            return (
              <div 
                key={day} 
                className={`min-h-[115px] p-3 rounded-xl border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] ${
                  hasActiveObjectives 
                    ? 'bg-slate-950/70 border-amber-400/40 shadow-[0_0_10px_rgba(245,158,11,0.05)]' 
                    : 'bg-slate-950/40 border-slate-900/60'
                }`}
              >
                {/* Cell Number Flag */}
                <span className={`text-xs font-mono font-black ${hasActiveObjectives ? accentTextClass : 'text-slate-500'}`}>
                  {String(day).padStart(2, '0')}
                </span>

                {/* Micro-Target Stack Wrapper List */}
                <div className="mt-2 flex-1 flex flex-col gap-1.5 overflow-hidden justify-end">
                  {dayTasks.map((t, index) => (
                    <div 
                      key={t.id || t._id || index} 
                      title={t.objective}
                      className="text-[10px] font-bold px-2 py-1 rounded bg-amber-500 text-slate-950 uppercase tracking-wide truncate border border-amber-400/20 shadow-sm"
                    >
                      🎯 {t.objective}
                    </div>
                  ))}
                </div>

              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}