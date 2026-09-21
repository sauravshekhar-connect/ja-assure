import React from "react";
import { 
  Search, 
  Sparkles, 
  ShieldCheck, 
  UserCheck, 
  Database, 
  Send, 
  RotateCcw, 
  TrendingUp, 
  Users,
  ArrowRight
} from "lucide-react";

interface AgentFlowDiagramProps {
  activeStep?: string;
  onSelectTab?: (tabKey: string) => void;
  lessonsCount: number;
}

export const AgentFlowDiagram: React.FC<AgentFlowDiagramProps> = ({
  activeStep,
  onSelectTab,
  lessonsCount,
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden backdrop-blur-sm">
      {/* Background glow accents */}
      <div className="absolute top-0 right-1/4 w-72 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-72 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2 tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            JA ASSURE MULTI-AGENT ARCHITECTURE (HACKATHON PIPELINE)
          </h3>
          <p className="text-xs text-slate-400">
            End-to-end agentic workflow with mandatory Human-in-the-Loop & Closed-Loop Reinforcement
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-700/30 text-emerald-300">
            Project 1: The Brain (Active)
          </span>
          <span className="px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-700/30 text-cyan-300">
            Project 2: The Hands (Active)
          </span>
        </div>
      </div>

      {/* Main Agent Step Pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 relative z-10">
        {/* Step 1: Research Agent */}
        <div 
          onClick={() => onSelectTab && onSelectTab("competitors")}
          className="group cursor-pointer p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 hover:border-emerald-500/60 hover:bg-slate-800/80 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Search className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-mono text-slate-500">01</span>
          </div>
          <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition-colors">
            Research Agent
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
            Competitor pricing, newsjack events & trend alerts
          </p>
        </div>

        {/* Step 2: Content Agent */}
        <div 
          onClick={() => onSelectTab && onSelectTab("generator")}
          className="group cursor-pointer p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 hover:border-emerald-500/60 hover:bg-slate-800/80 transition-all ring-1 ring-emerald-500/20"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-mono text-slate-500">02</span>
          </div>
          <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition-colors">
            Content Engine
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
            Brand voice, multi-platform, video & multi-lingual
          </p>
        </div>

        {/* Step 3: Compliance Gate */}
        <div 
          onClick={() => onSelectTab && onSelectTab("compliance")}
          className="group cursor-pointer p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 hover:border-emerald-500/60 hover:bg-slate-800/80 transition-all ring-1 ring-amber-500/20"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-mono text-slate-500">03</span>
          </div>
          <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition-colors">
            Compliance Gate
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
            MAS 124 / BNM rubric, guarantee check & auto-amend
          </p>
        </div>

        {/* Step 4: Human Review */}
        <div 
          onClick={() => onSelectTab && onSelectTab("review")}
          className="group cursor-pointer p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 hover:border-emerald-500/60 hover:bg-slate-800/80 transition-all ring-1 ring-emerald-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-mono text-slate-500">04</span>
          </div>
          <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition-colors">
            Human Review
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
            Approve, edit copy, or reject with reason tag + note
          </p>
        </div>

        {/* Step 5: Approved Queue (DB) */}
        <div 
          onClick={() => onSelectTab && onSelectTab("hands")}
          className="group cursor-pointer p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 hover:border-emerald-500/60 hover:bg-slate-800/80 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
              <Database className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-mono text-slate-500">05</span>
          </div>
          <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition-colors">
            Approved DB Queue
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
            Contract between Brain & Hands: rows ready to publish
          </p>
        </div>

        {/* Step 6: Project 2 (The Hands) */}
        <div 
          onClick={() => onSelectTab && onSelectTab("hands")}
          className="group cursor-pointer p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 hover:border-emerald-500/60 hover:bg-slate-800/80 transition-all ring-1 ring-cyan-500/30"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Send className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold">BONUS</span>
          </div>
          <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition-colors">
            Auto-Publish Hands
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
            Cron worker, fan-out to LinkedIn, X, IG, TikTok
          </p>
        </div>
      </div>

      {/* Two Critical Feedback Loops from Hackathon Brief Page 3 */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Loop 1: Feedback Loop */}
        <div 
          onClick={() => onSelectTab && onSelectTab("review")}
          className="cursor-pointer flex items-center gap-2.5 p-2 rounded-lg bg-purple-950/20 border border-purple-800/30 text-purple-300 hover:bg-purple-950/40 transition-colors"
        >
          <div className="p-1.5 rounded-md bg-purple-500/20 text-purple-400">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-[11px] text-purple-200 flex items-center gap-1.5">
              <span>CLOSED-LOOP REINFORCEMENT ({lessonsCount} Lessons in Memory)</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">Key Differentiator</span>
            </div>
            <p className="text-[10px] text-purple-300/80">
              Every reject/edit captures tag + note; dynamically injected into Content Agent prompt so mistakes never repeat.
            </p>
          </div>
        </div>

        {/* Loop 2: Analytics Loop */}
        <div 
          onClick={() => onSelectTab && onSelectTab("hands")}
          className="cursor-pointer flex items-center gap-2.5 p-2 rounded-lg bg-cyan-950/20 border border-cyan-800/30 text-cyan-300 hover:bg-cyan-950/40 transition-colors"
        >
          <div className="p-1.5 rounded-md bg-cyan-500/20 text-cyan-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-[11px] text-cyan-200">
              ANALYTICS OPTIMIZATION LOOP
            </div>
            <p className="text-[10px] text-cyan-300/80">
              Engagement data (impressions, clicks, leads) flows back into Content Agent for optimal timing and topic scoring.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
