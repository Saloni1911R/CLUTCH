import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  
  // Interactive Live Showcase State
  const [previewScore, setPreviewScore] = useState(87);
  const [demoStreak, setDemoStreak] = useState(7);

  // Auth Guard: Verifies if an operator token or username exists before booting dashboard
  const handleSecureNavigation = (targetPath) => {
    const isAuthenticated = localStorage.getItem('clutch_username') || localStorage.getItem('clutch_token');
    if (isAuthenticated) {
      navigate(targetPath);
    } else {
      navigate('/login');
    }
  };

  // 🎨 FIXED AMBER THEME ARCHITECTURE STYLING (As seen in image_c14c22.png)
  const themeBgClass = "bg-[#070b13] text-slate-100";
  const themeCardClass = "bg-[#0c1220] border-slate-800 text-slate-100";
  const primaryBtnClass = "bg-amber-500 hover:bg-amber-400 text-slate-950";
  const accentTextClass = "text-amber-500";
  const accentBorderClass = "border-amber-500/20";
  const gradientText = "bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500";

  const blockString = "█".repeat(Math.round(previewScore / 10)) + "░".repeat(10 - Math.round(previewScore / 10));

  return (
    <div className={`min-h-screen font-sans selection:bg-amber-500 selection:text-black transition-colors duration-300 overflow-x-hidden relative ${themeBgClass}`}>
      
      {/* BACKGROUND GLOWS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-20%] w-[600px] h-[600px] rounded-full blur-[150px] opacity-10 bg-amber-500" />
        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[130px]" />
      </div>

      {/* STICKY NAVIGATION HEADER */}
      <header className="border-b border-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-8 py-4 flex items-center justify-between bg-transparent">
        {/* LOGO */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
          <h1 className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-current to-slate-400">
            CLUTCH<span className={accentTextClass}>.</span>
          </h1>
        </div>

        {/* 🧭 NAVIGATION / ABOUT LINKS */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-black tracking-widest uppercase text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">// About Specs</a>
          <a href="#cosmetics" className="hover:text-white transition-colors">// Cosmetic Unlocks</a>
          <span className="text-slate-700 font-normal">|</span>
          <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-mono">
            DEFAULT OPERATOR THEME ACTIVE
          </span>
        </nav>

        {/* 🔐 TOP CONTROLS: REGISTER & LOGIN ONLY */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            onClick={() => navigate('/register')} 
            className="text-xs font-black tracking-widest uppercase text-slate-400 hover:text-white border border-slate-800 bg-[#0c1220] px-5 py-2.5 rounded-xl transition-all"
          >
            Register
          </button>
          
          <button 
            onClick={() => navigate('/login')} 
            className="text-xs font-black tracking-widest uppercase text-slate-950 bg-slate-100 hover:bg-white px-5 py-2.5 rounded-xl transition-all"
          >
            Login
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pt-16 lg:pt-24 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-black uppercase tracking-widest ${accentBorderClass}`}>
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
            <span className={accentTextClass}>TACTICAL TASK MANAGER v2.0</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight uppercase">
            Deflect Burnout.<br />
            Execute in the <br />
            <span className={`text-transparent bg-clip-text ${gradientText}`}>CLUTCH MOMENT.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-400 max-w-xl font-normal leading-relaxed">
            Stop letting massive backlogs paralyze your productivity. CLUTCH gamifies complex workflows, tracks your cognitive energy, maps future failures, and uses Ace AI to keep you context-locked.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button 
              onClick={() => handleSecureNavigation('/dashboard')}
              className={`font-black text-sm uppercase tracking-widest px-8 py-4 rounded-xl shadow-xl transition-all active:scale-95 text-center ${primaryBtnClass}`}
            >
              Enter Battle Grid (Free)
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="border border-slate-800 bg-[#0c1220] text-slate-300 hover:bg-slate-800 font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-xl transition-all text-center"
            >
              🛰️ Register New Operator
            </button>
          </div>
        </div>

        {/* RIGHT HERO SIDE: INTERACTIVE CORE MODULE PREVIEW BLOCK */}
        <div className="lg:col-span-5 relative w-full max-w-md mx-auto">
          <div className={`border rounded-2xl p-6 relative overflow-hidden shadow-2xl ${themeCardClass} ${previewScore > 80 ? 'border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.15)]' : ''}`}>
            {previewScore > 80 && (
              <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-mono font-black text-[10px] tracking-[0.25em] py-1 px-4 flex justify-between uppercase">
                <span>🚨 DEMO TRIGGER ENGAGED</span>
                <span>CRITICAL RISK THRESHOLD</span>
              </div>
            )}
            
            <div className={`space-y-4 ${previewScore > 80 ? 'mt-4' : ''}`}>
              <div className="flex justify-between items-center font-mono">
                <span className="font-black text-xs uppercase tracking-wider text-slate-400">🚨 CLUTCH SCORE ENGINE</span>
                <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${previewScore > 80 ? 'text-red-400 bg-red-950/40' : 'text-emerald-400 bg-emerald-950/40'}`}>
                  {previewScore > 80 ? "CRITICAL" : "STABLE"}
                </span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 font-mono text-sm">
                <div className="flex justify-between items-center text-white mb-2">
                  <span className="text-slate-400 tracking-tighter">{blockString}</span>
                  <span className={`font-black ${previewScore > 80 ? 'text-red-500' : 'text-emerald-400'}`}>{previewScore}</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="100" 
                  value={previewScore} 
                  onChange={(e) => setPreviewScore(Number(e.target.value))} 
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="text-[11px] text-slate-500 text-center mt-2 uppercase font-bold">Slide to test the automatic UI volatility scaler</div>
              </div>

              {/* SIMULATED MOMENTUM CALENDAR */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-black font-mono text-slate-400 uppercase">
                  <span>STREAK DEFENSE CAPACITOR</span>
                  <span className={accentTextClass}>🔥 {demoStreak} DAYS</span>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {[...Array(7)].map((_, i) => (
                    <div 
                      key={i} 
                      onClick={() => setDemoStreak(prev => Math.max(3, (prev + 1) % 15))}
                      className={`aspect-square rounded border border-transparent cursor-pointer transition-all hover:scale-110 ${
                        i < 5 
                          ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
                          : i === 5 ? 'bg-amber-500' : 'bg-slate-900'
                      }`} 
                    />
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-900 text-xs">
                <span className="font-mono font-black text-indigo-400 block uppercase tracking-wider mb-0.5">💬 ACE AI WINGMAN:</span>
                <p className="text-slate-300 italic">"Your cognitive window is shrinking. Secure your dashboard access matrix to begin execution parameters."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="my-12 max-w-7xl mx-auto border-dashed border-slate-900" />

      {/* CORE SPECIFICATIONS GRID */}
      <section id="features" className="max-w-7xl mx-auto px-8 py-12 space-y-12 relative z-10 text-center scroll-mt-24">
        <div className="space-y-3">
          <h3 className="text-xs font-black tracking-[0.25em] text-slate-400 uppercase font-mono">SYSTEM SPECIFICATIONS</h3>
          <h2 className="text-3xl font-black uppercase tracking-wide">Built for High-Velocity Execution</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`border rounded-2xl p-6 text-left space-y-3 shadow-sm ${themeCardClass}`}>
            <div className="text-2xl">🚨</div>
            <h4 className="text-lg font-black uppercase tracking-wide">Clutch Score Engine</h4>
            <p className="text-sm text-slate-400 leading-relaxed">Automated algorithmic threat modeling metrics that calculate risk variables based on assignment parameters.</p>
          </div>
          <div className={`border rounded-2xl p-6 text-left space-y-3 shadow-sm ${themeCardClass}`}>
            <div className="text-2xl">🔮</div>
            <h4 className="text-lg font-black uppercase tracking-wide">Future Failure Simulator</h4>
            <p className="text-sm text-slate-400 leading-relaxed">Simulate trajectory analysis. See exact statistical failure models if procrastination paths persist.</p>
          </div>
          <div className={`border rounded-2xl p-6 text-left space-y-3 shadow-sm ${themeCardClass}`}>
            <div className="text-2xl">💬</div>
            <h4 className="text-lg font-black uppercase tracking-wide">Ace AI Integration</h4>
            <p className="text-sm text-slate-400 leading-relaxed">Request micro-deconstructions, dynamic tactical checklists, and cognitive behavioral prompt updates.</p>
          </div>
          <div className={`border rounded-2xl p-6 text-left space-y-3 shadow-sm ${themeCardClass}`}>
            <div className="text-2xl">🧬</div>
            <h4 className="text-lg font-black uppercase tracking-wide">Productivity DNA Grid</h4>
            <p className="text-sm text-slate-400 leading-relaxed">Isolate focus vectors. Dynamically log consecutive momentum heatmaps and block out attention risks.</p>
          </div>
        </div>
      </section>

      {/* COSMETIC UNLOCKS AND REWARDS SYSTEM */}
      <section id="cosmetics" className="max-w-7xl mx-auto px-8 py-16 space-y-12 relative z-10 scroll-mt-24">
        <div className="text-center space-y-3">
          <h3 className="text-xs font-black tracking-[0.25em] text-amber-500 uppercase font-mono">// ARMORY LOGISTICS</h3>
          <h2 className="text-3xl font-black uppercase tracking-wide">Earn XP to Unlock Dashboard Variants</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">Complete tasks on time, clear clutch situations, and scale your multiplier tier to unlock localized UI modification arrays.</p>
        </div>

        {/* 4-COLUMN RESPONSIVE THEME DISPLAY MATRIX */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* AMBER THEME STATE (UNLOCKED BY DEFAULT) */}
          <div className="border border-amber-500/30 bg-[#0c1220] rounded-2xl p-5 space-y-4 relative flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <h4 className="font-mono font-black tracking-wider text-sm text-amber-400 uppercase">🔥 OPERATOR AMBER</h4>
                <span className="text-[10px] bg-amber-500 text-slate-950 font-mono font-black px-2 py-0.5 rounded">ACTIVE</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">The default cybergrid layout environment optimization setup seen in image_c14c22.png.</p>
            </div>
            {/* MINI VISUAL BOX PREVIEW */}
            <div className="bg-[#070b13] border border-slate-800 p-3 rounded-xl space-y-2 pointer-events-none">
              <div className="flex gap-1.5"><div className="h-2 w-2 rounded-full bg-amber-500" /><div className="h-2 w-12 bg-slate-800 rounded" /></div>
              <div className="h-6 w-full bg-amber-500/10 border border-amber-500/20 rounded-md" />
              <div className="h-3 w-2/3 bg-slate-900 rounded" />
            </div>
          </div>

          {/* NEON PINK THEME STATE (LOCKED) */}
          <div className="border border-slate-900 bg-[#0c1220]/50 rounded-2xl p-5 space-y-4 opacity-75 relative flex flex-col justify-between group hover:border-pink-500/20 transition-colors">
            <div>
              <div className="flex justify-between items-start">
                <h4 className="font-mono font-black tracking-wider text-sm text-pink-400 uppercase">🌸 NEON PINK OVERDRIVE</h4>
                <span className="text-[10px] bg-slate-950 border border-pink-900/60 text-pink-400 font-mono font-bold px-2 py-0.5 rounded">🔒 2.5K XP</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">High-contrast, vapor-fused HUD customized for midnight hacking and deployment operations.</p>
            </div>
            {/* MINI VISUAL BOX PREVIEW */}
            <div className="bg-[#0f0913] border border-pink-950/30 p-3 rounded-xl space-y-2 pointer-events-none grayscale group-hover:grayscale-0 transition-all">
              <div className="flex gap-1.5"><div className="h-2 w-2 rounded-full bg-pink-500" /><div className="h-2 w-12 bg-slate-900 rounded" /></div>
              <div className="h-6 w-full bg-pink-500/10 border border-pink-500/20 rounded-md" />
              <div className="h-3 w-1/2 bg-slate-900 rounded" />
            </div>
          </div>

          {/* LIGHT THEME STATE (LOCKED) */}
          <div className="border border-slate-900 bg-[#0c1220]/50 rounded-2xl p-5 space-y-4 opacity-75 relative flex flex-col justify-between group hover:border-slate-700 transition-colors">
            <div>
              <div className="flex justify-between items-start">
                <h4 className="font-mono font-black tracking-wider text-sm text-slate-300 uppercase">☀️ MINIMALIST BRIGHT</h4>
                <span className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 font-mono font-bold px-2 py-0.5 rounded">🔒 5K XP</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Maximum clarity paper-white configuration matrix engineered specifically for bright daylight work cycles.</p>
            </div>
            {/* MINI VISUAL BOX PREVIEW */}
            <div className="bg-slate-200 border border-slate-300 p-3 rounded-xl space-y-2 pointer-events-none grayscale group-hover:grayscale-0 transition-all">
              <div className="flex gap-1.5"><div className="h-2 w-2 rounded-full bg-slate-900" /><div className="h-2 w-12 bg-slate-300 rounded" /></div>
              <div className="h-6 w-full bg-white border border-slate-300 rounded-md shadow-xs" />
              <div className="h-3 w-3/4 bg-slate-300 rounded" />
            </div>
          </div>

          {/* CUSTOM THEME STATE (LOCKED - MATCHING image_c14c22.png CONTEXT) */}
          <div className="border border-slate-900 bg-[#0c1220]/50 rounded-2xl p-5 space-y-4 opacity-75 relative flex flex-col justify-between group hover:border-emerald-500/20 transition-colors">
            <div>
              <div className="flex justify-between items-start">
                <h4 className="font-mono font-black tracking-wider text-sm text-emerald-400 uppercase">🛠️ CUSTOM THEME MATRIX</h4>
                <span className="text-[10px] bg-slate-950 border border-emerald-900/60 text-emerald-400 font-mono font-bold px-2 py-0.5 rounded">🔒 10K XP</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Unlock total stylistic autonomy. Pick hex values, glow values, and custom system status nodes.</p>
            </div>
            {/* MINI VISUAL BOX PREVIEW */}
            <div className="bg-[#050a10] border border-slate-800 p-3 rounded-xl space-y-2 pointer-events-none grayscale group-hover:grayscale-0 transition-all">
              <div className="flex gap-1 justify-between">
                <div className="flex gap-1"><div className="h-2 w-2 rounded-full bg-emerald-400" /><div className="h-2 w-8 bg-slate-800 rounded" /></div>
                <div className="h-2 w-2 bg-indigo-500 rounded-xs" />
              </div>
              <div className="h-6 w-full bg-slate-900 border border-dashed border-slate-700 rounded-md flex items-center justify-center text-[8px] font-mono text-slate-600">HEX_CONFIG</div>
              <div className="h-3 w-full bg-gradient-to-r from-emerald-500/20 to-indigo-500/20 rounded" />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-900/60 bg-[#04070d]/60 py-12 mt-16 text-center text-sm text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-8 space-y-4">
          <p className="font-black tracking-widest text-slate-400 font-mono text-xs uppercase">
            // CLUTCH PROCESSOR ONLINE // ALL ENGINE CHANNELS FULLY FUNCTIONAL
          </p>
          <div className="pt-2 text-[11px]">
            &copy; {new Date().getFullYear()} CLUTCH system network. All systems operational.
          </div>
        </div>
      </footer>

    </div>
  );
}