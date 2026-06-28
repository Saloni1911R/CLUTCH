import { Clock, CheckCircle2, Award } from "lucide-react";

export default function TaskCard({ task, onComplete }) {
  // Map internal status/size to high-visibility tactical style configurations
  const configurationMap = {
    large: { border: "border-red-900/40 shadow-[inset_4px_0_0_0_#ef4444]", badge: "bg-red-950/40 border-red-500/20 text-red-400", dot: "🔴" },
    medium: { border: "border-orange-900/40 shadow-[inset_4px_0_0_0_#f97316]", badge: "bg-orange-950/40 border-orange-500/20 text-orange-400", dot: "🟠" },
    small: { border: "border-neutral-900 shadow-[inset_4px_0_0_0_#10b981]", badge: "bg-emerald-950/40 border-emerald-500/20 text-emerald-400", dot: "🟢" }
  };

  const config = configurationMap[task.length || "medium"];

  return (
    <div className={`bg-gradient-to-r from-neutral-900/40 to-neutral-900/10 border p-6 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all duration-300 hover:scale-[1.01] ${config.border}`}>
      <div className="space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <h4 className="font-bold text-white tracking-tight text-lg">{task.title}</h4>
          <span className="text-xs text-neutral-400 uppercase tracking-widest bg-neutral-950 px-2.5 py-1 rounded border border-neutral-800/80 font-bold">
            {task.project}
          </span>
        </div>
        <div className="flex items-center gap-5 text-sm text-neutral-400 font-medium">
          <span className="flex items-center gap-1.5 text-neutral-300">
            <Clock className="w-4 h-4 text-neutral-500" /> {task.deadline}
          </span>
          <span className="text-neutral-800">•</span>
          <span className="flex items-center gap-1.5 text-red-400 font-bold bg-red-950/20 px-2 py-0.5 rounded border border-red-900/30">
            <Award className="w-4 h-4" /> Score: {task.clutchScore || 90}
          </span>
          <span className="text-neutral-800">•</span>
          <span>Workload: {task.hours}h</span>
        </div>
      </div>

      <div className="flex items-center gap-3 justify-between sm:justify-end">
        <span className={`text-xs font-black uppercase tracking-widest px-3 py-2 rounded-md border font-mono ${config.badge}`}>
          {config.dot} {task.length ? task.length.toUpperCase() : "MEDIUM"}
        </span>
        <button 
          onClick={() => onComplete(task.id)}
          className="p-3 bg-neutral-950 border border-neutral-800 hover:border-emerald-500 text-neutral-400 hover:text-emerald-400 rounded-lg transition"
        >
          <CheckCircle2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}