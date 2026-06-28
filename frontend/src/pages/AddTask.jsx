import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddTask() {
  const navigate = useNavigate();
  const [objective, setObjective] = useState('');
  const [workload, setWorkload] = useState('Medium');
  const [deadlineDate, setDeadlineDate] = useState(''); // YYYY-MM-DD from calendar picker
  const [loading, setLoading] = useState(false);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!objective || !deadlineDate) return alert("Please fill out all fields.");

    // Parse values from date picker
    const parsedDate = new Date(deadlineDate);
    const dayNumber = parsedDate.getDate(); 
    
    const formattedText = parsedDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    // Enforce requirements #5 & #7: Scoping task data to the logged-in session identity
const activeUsername = (localStorage.getItem('clutch_username') || 'default_gamer').trim().toLowerCase();

const taskPayload = {
  username: activeUsername, // Ensures "googleuser"
  objective: objective,
  workload: workload,
  deadline: deadlineDate,
  deadlineText: formattedText,
  deadlineDay: dayNumber,
  status: "pending",
  createdAt: new Date().toISOString().split('T')[0]
};

    setLoading(true);
    try {
      // Direct integration pipeline connecting directly to the local JSON engine storage
      await axios.post('http://localhost:5001/api/tasks', taskPayload);
      setLoading(false);
      navigate('/dashboard'); // Route back to central deck on success
    } catch (err) {
      console.error(err);
      alert("❌ Critical tracking connection link lost. Server offline.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070708] text-neutral-100 font-sans antialiased relative flex flex-col justify-center items-center px-6 py-12">
      <div className="w-full max-w-xl bg-[#0d0d11]/80 backdrop-blur-xl border border-slate-900 rounded-3xl p-10 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white tracking-tight uppercase">🚀 Initialize Objective</h2>
          <p className="text-sm text-slate-400 mt-2 font-medium tracking-wide">Configure a new tactical progression profile</p>
        </div>

        <form onSubmit={handleCreateTask} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Objective Target Name</label>
            <input 
              type="text" 
              placeholder="e.g., Deploy Backend API to production..." 
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-xl text-base focus:outline-none focus:border-amber-500 text-slate-200 placeholder-slate-600 font-medium transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Workload Complexity Index</label>
            <select 
              value={workload}
              onChange={(e) => setWorkload(e.target.value)}
              className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-xl text-base focus:outline-none focus:border-amber-500 text-slate-200 font-semibold"
            >
              <option value="Small">Small (Green Dot)</option>
              <option value="Medium">Medium (Yellow Dot)</option>
              <option value="Large">Large (Red Dot)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Target Due Timeline Date</label>
            <input 
              type="date" 
              value={deadlineDate}
              onChange={(e) => setDeadlineDate(e.target.value)}
              className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-xl text-base focus:outline-none focus:border-amber-500 text-slate-200 font-medium"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-1/3 py-4 bg-slate-900 hover:bg-slate-800 text-center border border-slate-800 text-slate-300 font-bold rounded-xl text-base transition"
            >
              Abort
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="w-2/3 py-4 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-extrabold rounded-xl transition text-base shadow-lg shadow-amber-500/10 uppercase tracking-wider"
            >
              {loading ? "Syncing Grid..." : "Commit Objective"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}