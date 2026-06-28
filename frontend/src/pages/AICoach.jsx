import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Send, Sparkles, ShieldAlert, Terminal } from "lucide-react";

export default function AICoach() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "WARNING: I am tracking a 41% surge in your Failure Contingency Vector. You currently have 2 critical tasks sitting deep in the hazard zone. Are we executing today, or are we planning an elegant failure?",
      time: "18:00"
    }
  ]);
  const [input, setInput] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input, time: "18:01" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Analysis received. Your explanation lacks tactical urgency. I have locked your focus matrix and intercepted non-essential communications. Your best move right now is to spend exactly 45 minutes on 'Deploy Backend API to AWS'. Confirm execution authorization.",
          time: "18:02"
        }
      ]);
    }, 1000);
  };

  // 🎨 READ SAVED PROGRESSION THEME DOCK FROM LOCALSTORAGE
  const savedTheme = localStorage.getItem('clutch_theme') || 'amber';
  const savedBgImage = localStorage.getItem('clutch_custom_bg') || '';

  // 🎛️ CORE THEME UTILITY STYLE RESOLVER
  let themeBgClass = "bg-[#070b13] text-slate-100";
  let themeCardClass = "bg-[#0c1220] text-slate-100"; 
  let themeHeaderClass = "bg-[#0c1220]/80"; 
  let themeInputClass = "bg-[#060a12] border-slate-800 text-white";
  let primaryBtnClass = "bg-amber-500 hover:bg-amber-400 text-slate-950";
  let accentTextClass = "text-amber-500";
  let accentBorderClass = "border-amber-500";
  let inlineStyle = {};

  // 🎨 INITIALIZE HIGH-GAMING PERFORMANCE BORDER VECTOR MAP
  let themeBorderClass = "border border-amber-400/30 shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all duration-300";

  if (savedTheme === 'pink' || savedTheme === 'rose') {
    themeBgClass = "bg-[#0f0913] text-pink-50";
    themeCardClass = "bg-[#180f20] text-pink-50";
    themeHeaderClass = "bg-[#180f20]/80";
    themeInputClass = "bg-[#0b0610] border-pink-900 text-white";
    primaryBtnClass = "bg-pink-500 hover:bg-pink-400 text-slate-950 shadow-pink-500/10";
    accentTextClass = "text-pink-500";
    accentBorderClass = "border-pink-500";
    themeBorderClass = "border border-pink-400/30 shadow-[0_0_15px_rgba(236,72,153,0.15)] hover:shadow-[0_0_25px_rgba(236,72,153,0.3)] transition-all duration-300";
  } else if (savedTheme === 'blue') {
    accentTextClass = "text-blue-500";
    accentBorderClass = "border-blue-500";
    themeBorderClass = "border border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] transition-all duration-300";
  } else if (savedTheme === 'emerald') {
    accentTextClass = "text-emerald-500";
    accentBorderClass = "border-emerald-500";
    themeBorderClass = "border border-emerald-400/30 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all duration-300";
  } else if (savedTheme === 'purple') {
    accentTextClass = "text-purple-500";
    accentBorderClass = "border-purple-500";
    themeBorderClass = "border border-purple-400/30 shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] transition-all duration-300";
  } else if (savedTheme === 'light') {
    themeBgClass = "bg-slate-50 text-slate-900";
    themeCardClass = "bg-white text-slate-900 shadow-sm";
    themeHeaderClass = "bg-white/90";
    themeInputClass = "bg-slate-50 border-slate-200 text-slate-900";
    primaryBtnClass = "bg-slate-900 hover:bg-slate-800 text-white";
    accentTextClass = "text-slate-900 font-black";
    accentBorderClass = "border-slate-900";
    themeBorderClass = "border border-slate-300 shadow-sm transition-all duration-300";
  } else if (savedTheme === 'custom-image' && savedBgImage) {
    themeBgClass = "bg-cover bg-center bg-fixed text-slate-100 relative before:content-[''] before:absolute before:inset-0 before:bg-slate-950/85 before:z-0";
    themeCardClass = "bg-slate-900/60 text-slate-100 backdrop-blur-md relative z-10";
    themeHeaderClass = "bg-slate-900/70 backdrop-blur-md relative z-10";
    themeInputClass = "bg-slate-950/80 border-slate-700 text-white";
    primaryBtnClass = "bg-amber-500 hover:bg-amber-400 text-slate-950";
    accentTextClass = "text-amber-400";
    accentBorderClass = "border-amber-400";
    inlineStyle = { backgroundImage: `url(${savedBgImage})` };
    themeBorderClass = "border border-amber-400/20 shadow-[0_0_15px_rgba(245,158,11,0.1)] backdrop-blur-md relative z-10 transition-all duration-300";
  }

  return (
    <div style={inlineStyle} className={`min-h-screen font-sans antialiased flex flex-col relative overflow-y-auto ${themeBgClass}`}>
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#26262b_1px,transparent_1px),linear-gradient(to_bottom,#26262b_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-25 pointer-events-none" />

      {/* Massive Hazard Banner */}
      <div className="bg-red-950/80 border-b-2 border-red-500 text-red-400 text-center py-4 px-6 text-base font-black tracking-widest uppercase flex items-center justify-center gap-4 relative z-20 shadow-lg">
        <ShieldAlert className="w-6 h-6 animate-pulse text-red-500" />
        <span>CLUTCH MODE ENGAGED: CRITICAL EXECUTION WINDOW REACHED</span>
      </div>

      {/* Header Panel */}
      <header className={`w-full backdrop-blur-md p-8 sticky top-0 z-10 flex justify-between items-center ${themeHeaderClass} ${themeBorderClass}`}>
        <div className="flex items-center gap-6 relative z-10">
          <button 
            onClick={() => navigate("/dashboard")} 
            className={`p-4 border-2 rounded-2xl transition shadow-md group ${savedTheme === 'light' ? 'bg-white border-slate-300 text-slate-700 hover:border-slate-900' : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-amber-500'}`}
          >
            <ArrowLeft className="w-7 h-7 group-hover:-translate-x-1 transition" />
          </button>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4 text-white">
              <Terminal className={`w-8 h-8 stroke-[2.5] ${accentTextClass}`} /> AI Strategy Terminal
            </h1>
            <p className="text-base text-neutral-400 uppercase tracking-wider font-bold mt-1">Behavioral Threat Assessment Mode</p>
          </div>
        </div>

        <div className="flex items-center gap-3 scale-125 hidden sm:flex relative z-10">
          <span className={`font-black text-2xl tracking-tighter ${accentTextClass}`}>//</span>
          <span className="text-xl font-black tracking-widest text-white uppercase">CLUTCH<span className={accentTextClass}>.</span></span>
        </div>
      </header>

      {/* Workspace Stream */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 sm:p-12 flex flex-col justify-between relative z-10 min-h-[calc(100vh-200px)]">
        
        {/* Messages Layout Container */}
        <div className="space-y-10 mb-12 flex-1">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
            >
              {/* Massive Name Tags */}
              <div className="flex items-center gap-3 mb-3 text-base font-black tracking-widest text-neutral-300 uppercase">
                {msg.sender === "ai" ? (
                  <>
                    <Sparkles className={`w-5 h-5 animate-spin-slow ${accentTextClass}`} />
                    <span className={accentTextClass}>STRATEGIST CORE</span>
                  </>
                ) : (
                  <span className="text-white">OPERATOR CALL SIGN</span>
                )}
                <span className="text-sm font-bold text-neutral-600 font-mono">[{msg.time}]</span>
              </div>

              {/* Big, Crisp Text Bubble */}
              <div 
                className={`max-w-3xl text-xl font-bold p-8 rounded-3xl border-2 leading-relaxed tracking-wide shadow-2xl hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 ${
                  msg.sender === "user" 
                    ? `${themeCardClass} ${themeBorderClass} rounded-tr-none` 
                    : `bg-gradient-to-b from-[#0c1220] to-[#070b13] text-neutral-100 rounded-tl-none border-l-4 ${themeBorderClass} ${accentBorderClass}`
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Form Module */}
        <form onSubmit={handleSendMessage} className="w-full pt-4 mt-auto">
          <div className="relative flex items-center shadow-2xl hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 rounded-2xl">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Provide tactical defense logs or roadblock variables..."
              className={`w-full p-6 pr-28 rounded-2xl text-xl placeholder-neutral-600 outline-none transition font-bold ${themeInputClass} ${themeBorderClass}`}
            />
            <button 
              type="submit"
              className={`absolute right-4 p-5 rounded-xl transition flex items-center justify-center scale-110 active:scale-95 shadow-md ${primaryBtnClass}`}
            >
              <Send className="w-6 h-6 stroke-[3]" />
            </button>
          </div>
        </form>

      </main>
    </div>
  );
}