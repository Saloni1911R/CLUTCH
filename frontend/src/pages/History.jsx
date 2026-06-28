import React, { useEffect, useState } from "react";
import axios from "axios";

export default function History() {
  const [completedTasks, setCompletedTasks] = useState([]);
  const currentUser = localStorage.getItem("clutch_username") || "default_gamer";

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  const fetchCompletedTasks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/tasks?username=${currentUser.trim().toLowerCase()}`
      );
      const completed = response.data.filter(task => task.status === "completed");
      setCompletedTasks(completed);
    } catch (err) {
      console.error("Error retrieving historical mission archives:", err);
    }
  };

  const reactivateTask = async (taskId) => {
    try {
      await axios.put(`http://localhost:5001/api/tasks/${taskId}`, {
        status: 'pending'
      });
      fetchCompletedTasks(); 
    } catch (err) {
      console.error("Failed to restore task context:", err);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-[#070b13] text-white font-sans selection:bg-amber-500 selection:text-black">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 border-b border-slate-900/60 pb-5">
          <span className="text-xs font-mono font-black text-amber-500 tracking-[0.2em] uppercase block mb-1">
            SECURED ARCHIVE VECTORS
          </span>
          <h1 className="text-4xl font-black tracking-tight text-white uppercase flex items-center gap-3">
            📁 Mission History Archive
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {completedTasks.map(task => (
            <div
              key={task.id || task._id}
              className="bg-[#0c1220] border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden shadow-lg shadow-emerald-950/5 transition-all hover:border-emerald-500/40"
            >
              <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[9px] font-mono font-black px-3 py-1 uppercase tracking-widest rounded-bl-xl shadow-sm">
                ✓ SECURED
              </div>

              <h3 className="font-black text-xl text-slate-100 capitalize mb-1 truncate pr-16">
                🎯 {task.objective}
              </h3>

              <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-4">
                Timeline: {task.deadlineText || task.deadline || "Completed Channel"}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-900/40">
                <span className="text-emerald-400 text-xs font-mono font-black uppercase tracking-widest flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" /> Operational Clear
                </span>
                <button
                  onClick={() => reactivateTask(task.id || task._id)}
                  className="text-xs font-mono font-bold border border-slate-800 bg-slate-950 px-3 py-1.5 rounded-xl text-slate-400 hover:text-white hover:border-slate-600 transition shadow-sm"
                >
                  ↩ Revert to Board
                </button>
              </div>
            </div>
          ))}
        </div>

        {completedTasks.length === 0 && (
          <div className="text-center py-20 border border-dashed border-slate-900 rounded-3xl text-slate-500 font-mono uppercase tracking-widest text-xs">
            📡 NO HISTORICAL ARCHIVES REGISTERED. CLEAR ACTIVE SECTORS.
          </div>
        )}
      </div>
    </div>
  );
}