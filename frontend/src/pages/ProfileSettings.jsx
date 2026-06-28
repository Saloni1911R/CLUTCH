import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { User } from 'lucide-react';

export default function ProfileSettings() {
  const [activeUser, setActiveUser] = useState(() => (localStorage.getItem('clutch_username') || 'default_gamer').trim().toLowerCase());
  const [newUsername, setNewUsername] = useState(activeUser);
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [timeZone, setTimeZone] = useState('GMT+5:30');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  
  const fileInputRef = useRef(null);
  const [savedTheme, setSavedTheme] = useState(() => localStorage.getItem('clutch_theme') || 'amber');

  let themeBgClass = "bg-[#070b13] text-slate-100";
  let themeCardClass = "bg-[#0c1220] text-slate-100"; 
  let themeInputClass = "bg-[#060a12] border-slate-800 text-white focus:border-amber-400";
  let primaryBtnClass = "bg-amber-500 hover:bg-amber-400 text-slate-950";
  let themeBorderClass = "border border-amber-400/20 shadow-[0_0_15px_rgba(245,158,11,0.08)] hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all duration-300";

  if (savedTheme === 'pink' || savedTheme === 'rose') {
    themeBgClass = "bg-[#0f0913] text-pink-50";
    themeCardClass = "bg-[#180f20] text-pink-50";
    themeInputClass = "bg-[#0b0610] border-pink-900 text-white focus:border-pink-400";
    primaryBtnClass = "bg-pink-500 hover:bg-pink-400 text-slate-950";
    themeBorderClass = "border border-pink-400/20 shadow-[0_0_15px_rgba(236,72,153,0.08)] hover:shadow-[0_0_20px_rgba(236,72,153,0.15)] transition-all duration-300";
  } else if (savedTheme === 'blue') {
    themeInputClass = "bg-[#060a12] border-slate-800 text-white focus:border-blue-400";
    themeBorderClass = "border border-blue-400/20 shadow-[0_0_15px_rgba(59,130,246,0.08)] hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300";
  } else if (savedTheme === 'emerald') {
    themeInputClass = "bg-[#060a12] border-slate-800 text-white focus:border-emerald-400";
    themeBorderClass = "border border-emerald-400/20 shadow-[0_0_15px_rgba(16,185,129,0.08)] hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300";
  } else if (savedTheme === 'purple') {
    themeInputClass = "bg-[#060a12] border-slate-800 text-white focus:border-purple-400";
    themeBorderClass = "border border-purple-400/20 shadow-[0_0_15px_rgba(168,85,247,0.08)] hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300";
  } else if (savedTheme === 'light') {
    themeBgClass = "bg-slate-50 text-slate-900";
    themeCardClass = "bg-white text-slate-900 shadow-sm";
    themeInputClass = "bg-slate-50 border-slate-300 text-slate-900 focus:border-slate-800";
    primaryBtnClass = "bg-slate-900 hover:bg-slate-800 text-white";
    themeBorderClass = "border border-slate-200 shadow-sm transition-all duration-300";
  }

  useEffect(() => {
    const loadProfileFromDatabase = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/user/profile?username=${activeUser}`);
        if (response.data) {
          if (response.data.avatarUrl) setAvatar(response.data.avatarUrl);
          if (response.data.displayName) setDisplayName(response.data.displayName);
          if (response.data.timeZone) setTimeZone(response.data.timeZone);
          if (response.data.phone) setPhone(response.data.phone);
        }
      } catch (err) {
        console.log("Fallback to defaults.");
      }
    };
    loadProfileFromDatabase();
  }, [activeUser]);

  const executeUnifiedSync = async (fieldOverrides = {}) => {
    try {
      const formData = new FormData();
      formData.append('username', activeUser);
      formData.append('newUsername', fieldOverrides.newUsername || activeUser);
      formData.append('displayName', fieldOverrides.displayName !== undefined ? fieldOverrides.displayName : displayName);
      formData.append('password', fieldOverrides.password !== undefined ? fieldOverrides.password : password);
      formData.append('timeZone', fieldOverrides.timeZone !== undefined ? fieldOverrides.timeZone : timeZone);
      formData.append('phone', fieldOverrides.phone !== undefined ? fieldOverrides.phone : phone);

      if (fieldOverrides.rawFile) {
        formData.append('avatar', fieldOverrides.rawFile);
      } else {
        formData.append('avatarUrl', avatar);
      }

      await axios.put('http://localhost:5001/api/user/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setStatusMsg('✅ Parameters synchronized to Database!');
    } catch (err) {
      console.error(err);
      setStatusMsg('❌ Server verification failed.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setStatusMsg('❌ Image exceeds 5MB limit.');
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setAvatar(previewUrl);
      executeUnifiedSync({ rawFile: file });
    }
  };

  const triggerFileSelection = () => {
    fileInputRef.current.click();
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    const cleanName = newUsername.trim().toLowerCase();
    if (!cleanName) return;
    localStorage.setItem('clutch_username', cleanName);
    setActiveUser(cleanName);
    executeUnifiedSync({ newUsername: cleanName });
  };

  const handleDisplayNameSubmit = (e) => {
    e.preventDefault();
    executeUnifiedSync({ displayName });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    executeUnifiedSync({ password });
    setPassword('');
  };

  const handleSystemPreferencesSubmit = (e) => {
    e.preventDefault();
    executeUnifiedSync({ timeZone, phone });
  };

  const handleThemeChangeLocally = (newThemeSelection) => {
    localStorage.setItem('clutch_theme', newThemeSelection);
    setSavedTheme(newThemeSelection);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("🚨 PROMPT: Permanently purge data profiles?")) {
      try {
        await axios.delete(`http://localhost:5001/api/user/delete?username=${activeUser}`);
        localStorage.clear();
        window.location.reload();
      } catch (err) {
        setStatusMsg('❌ Purge timeout.');
      }
    }
  };

  return (
    <div className={`min-h-screen font-sans p-6 md:p-8 flex flex-col items-center justify-start overflow-y-auto ${themeBgClass}`}>
      <div className="w-full space-y-6">
        <div className="flex flex-row justify-between items-center pb-4 border-b border-slate-800/60 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-wider text-white uppercase flex items-center gap-2">⚙️ Command Matrix Configuration</h1>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1">Identity Node Profile Data Configuration</p>
          </div>
          {statusMsg && (
            <div className={`text-xs font-mono font-bold px-4 py-2 rounded-xl bg-slate-950 border ${statusMsg.includes('❌') ? 'border-red-900/60 text-red-400' : 'border-slate-800 text-emerald-400'}`}>
              {statusMsg}
            </div>
          )}
        </div>

        <div className={`p-6 rounded-2xl flex flex-col items-center justify-center relative ${themeCardClass} ${themeBorderClass}`}>
          <span className="text-xs font-mono font-black text-slate-400 tracking-widest uppercase mb-4 self-start">📷 Profile Photo</span>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          <button type="button" onClick={triggerFileSelection} className="w-28 h-28 rounded-full overflow-hidden border-2 border-slate-700 hover:border-amber-400 bg-slate-950 flex items-center justify-center relative transition-all duration-300 group shadow-2xl outline-none">
            {avatar ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-60" /> : <User className="w-10 h-10 text-slate-500 group-hover:text-amber-400" />}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
              <span className="text-[9px] font-mono tracking-wider text-white font-black uppercase bg-slate-900/90 px-2 py-1 rounded-md border border-slate-700">Change Photo</span>
            </div>
          </button>
        </div>

        <div className={`p-6 rounded-2xl ${themeCardClass} ${themeBorderClass}`}>
          <form onSubmit={handleUsernameSubmit} className="space-y-3">
            <label className="text-xs font-mono font-black text-slate-400 tracking-widest uppercase block">Change Username:</label>
            <div className="flex gap-3">
              <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className={`flex-1 p-3 rounded-xl text-sm outline-none font-bold transition-all ${themeInputClass}`} />
              <button type="submit" className={`px-5 rounded-xl text-xs font-black uppercase tracking-widest transition-colors ${primaryBtnClass}`}>Update Link</button>
            </div>
          </form>
        </div>

        <div className={`p-6 rounded-2xl ${themeCardClass} ${themeBorderClass}`}>
          <form onSubmit={handleDisplayNameSubmit} className="space-y-3">
            <label className="text-xs font-mono font-black text-slate-400 tracking-widest uppercase block">Display Name:</label>
            <div className="flex gap-3">
              <input type="text" value={displayName} placeholder="Call sign alias..." onChange={(e) => setDisplayName(e.target.value)} className={`flex-1 p-3 rounded-xl text-sm outline-none font-bold transition-all ${themeInputClass}`} />
              <button type="submit" className={`px-5 rounded-xl text-xs font-black uppercase tracking-widest transition-colors ${primaryBtnClass}`}>Sync Identity</button>
            </div>
          </form>
        </div>

        <div className={`p-6 rounded-2xl ${themeCardClass} ${themeBorderClass}`}>
          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <label className="text-xs font-mono font-black text-slate-400 tracking-widest uppercase block">Update Password Secure Node:</label>
            <div className="flex gap-3">
              <input type="password" placeholder="Leave empty to maintain existing keys..." value={password} onChange={(e) => setPassword(e.target.value)} className={`flex-1 p-3 rounded-xl text-sm outline-none font-bold transition-all ${themeInputClass}`} />
              <button type="submit" className={`px-5 rounded-xl text-xs font-black uppercase tracking-widest transition-colors ${primaryBtnClass}`}>Lock Hash Key</button>
            </div>
          </form>
        </div>

        <div className={`p-6 rounded-2xl ${themeCardClass} ${themeBorderClass}`}>
          <span className="text-xs font-mono font-black text-slate-400 tracking-widest uppercase block mb-4">🛠️ System Framework Sync Parameters</span>
          <form onSubmit={handleSystemPreferencesSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold text-slate-400 uppercase block">System Timezone Context:</label>
                <select value={timeZone} onChange={e => setTimeZone(e.target.value)} className="w-full p-3 rounded-xl text-sm font-bold bg-[#060a12] border border-slate-800 text-white outline-none focus:border-amber-500">
                  <option value="GMT+5:30">GMT+5:30 (IST)</option>
                  <option value="GMT-5:00">GMT-5:00 (EST)</option>
                  <option value="GMT+0:00">GMT+0:00 (UTC)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold text-slate-400 uppercase block">Mobile Core Link (OTP):</label>
                <input type="text" placeholder="+91 XXXXX XXXXX" value={phone} onChange={e => setPhone(e.target.value)} className={`w-full p-3 rounded-xl text-sm font-bold outline-none transition-all ${themeInputClass}`} />
              </div>
            </div>
            <button type="submit" className={`w-full font-black text-xs uppercase tracking-widest p-3 rounded-xl transition-all shadow-xl ${primaryBtnClass}`}>🚀 Sync Core Profile Parameters</button>
          </form>
        </div>
      </div>
    </div>
  );
}