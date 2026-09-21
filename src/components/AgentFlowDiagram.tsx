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
  ArrowRight,
  ArrowUpRight
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
    <div className="hitech-card rounded-[32px] p-8 sm:p-12 relative overflow-hidden">
      {/* Background chromatic glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header section with generous spacing */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 pb-8 border-b border-white/10 relative z-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full hitech-pill text-xs font-mono text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>ARCHITECTURE BLUEPRINT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
            PIPELINE ORCHESTRATION MATRIX
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Autonomous multi-agent execution with hard compliance gates and closed-loop reinforcement memory.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <span className="px-4 py-2 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-300 font-bold">
            MODULE 1: AUTONOMOUS BRAIN
          </span>
          <span className="px-4 py-2 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 font-bold">
            MODULE 2: PUBLISHING HANDS
          </span>
        </div>
      </div>

      {/* Main Agent Step Pipeline with Generous Gaps (Digilink Services style cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5 relative z-10">
        
        {/* Step 1: Research Agent */}
        <div 
          onClick={() => onSelectTab && onSelectTab("competitors")}
          className="group cursor-pointer p-6 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-amber-400/60 hover:bg-slate-900/90 transition-all shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono text-slate-400 font-bold">01</span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
              Market Radar
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Competitor pricing, newsjack events & regulatory alerts
            </p>
          </div>
          <div className="mt-6 flex items-center text-xs text-slate-500 group-hover:text-amber-400 font-mono gap-1">
            <span>Explore</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Step 2: Content Agent (Special Highlighted Card like Digilink yellow card) */}
        <div 
          onClick={() => onSelectTab && onSelectTab("generator")}
          className="group cursor-pointer p-6 rounded-3xl hitech-card-gold transition-all shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-400/40 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-slate-950" />
              </div>
              <span className="text-xs font-mono text-amber-300 font-bold">02</span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-200 transition-colors">
              Content Engine
            </h3>
            <p className="text-xs text-amber-200/80 mt-2 leading-relaxed">
              Multi-brand personas, video scripts & multi-lingual layers
            </p>
          </div>
          <div className="mt-6 flex items-center text-xs text-amber-300 font-mono font-bold gap-1">
            <span>Generate</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Step 3: Compliance Gate */}
        <div 
          onClick={() => onSelectTab && onSelectTab("compliance")}
          className="group cursor-pointer p-6 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-emerald-400/60 hover:bg-slate-900/90 transition-all shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono text-slate-400 font-bold">03</span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
              Compliance Gate
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              MAS 124 / BNM rubric, zero-guarantee check & auto-remedy
            </p>
          </div>
          <div className="mt-6 flex items-center text-xs text-slate-500 group-hover:text-emerald-400 font-mono gap-1">
            <span>Audit</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Step 4: Human Review */}
        <div 
          onClick={() => onSelectTab && onSelectTab("review")}
          className="group cursor-pointer p-6 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-purple-400/60 hover:bg-slate-900/90 transition-all shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <UserCheck className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono text-slate-400 font-bold">04</span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
              Human Review
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Approve, edit copy, or reject with tag + human memory note
            </p>
          </div>
          <div className="mt-6 flex items-center text-xs text-slate-500 group-hover:text-purple-400 font-mono gap-1">
            <span>Approve</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Step 5: Approved Queue (DB) */}
        <div 
          onClick={() => onSelectTab && onSelectTab("hands")}
          className="group cursor-pointer p-6 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-teal-400/60 hover:bg-slate-900/90 transition-all shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                <Database className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono text-slate-400 font-bold">05</span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
              Staging DB
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Immutable buffer isolating autonomous creation from publishing
            </p>
          </div>
          <div className="mt-6 flex items-center text-xs text-slate-500 group-hover:text-teal-400 font-mono gap-1">
            <span>Inspect</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Step 6: Project 2 (The Hands) */}
        <div 
          onClick={() => onSelectTab && onSelectTab("hands")}
          className="group cursor-pointer p-6 rounded-3xl bg-slate-900/60 border border-white/10 hover:border-cyan-400/60 hover:bg-slate-900/90 transition-all shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Send className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono text-slate-400 font-bold">06</span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
              Dispatch Hands
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Cron worker fan-out to LinkedIn, X, FB & WhatsApp
            </p>
          </div>
          <div className="mt-6 flex items-center text-xs text-slate-500 group-hover:text-cyan-400 font-mono gap-1">
            <span>Publish</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

      </div>

      {/* Two Critical Feedback Loops with Generous Spacing */}
      <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        
        {/* Loop 1: Feedback Loop */}
        <div 
          onClick={() => onSelectTab && onSelectTab("review")}
          className="cursor-pointer flex items-start gap-5 p-6 rounded-3xl bg-slate-900/50 border border-purple-500/20 hover:border-purple-400/50 hover:bg-purple-950/20 transition-all shadow-lg group"
        >
          <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-300 border border-purple-500/30 group-hover:scale-110 transition-transform">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="font-bold text-sm text-purple-200 flex items-center gap-2">
              <span>CLOSED-LOOP MEMORY DIRECTIVE</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 font-mono">
                {lessonsCount} RULES
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every rejection or edit writes an immutable rule to long-term memory, automatically injected into all future prompts so the AI never repeats a compliance failure.
            </p>
          </div>
        </div>

        {/* Loop 2: Analytics Loop */}
        <div 
          onClick={() => onSelectTab && onSelectTab("hands")}
          className="cursor-pointer flex items-start gap-5 p-6 rounded-3xl bg-slate-900/50 border border-cyan-500/20 hover:border-cyan-400/50 hover:bg-cyan-950/20 transition-all shadow-lg group"
        >
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="font-bold text-sm text-cyan-200 flex items-center gap-2">
              <span>ANALYTICS OPTIMIZATION LOOP</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-mono">
                REAL-TIME
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Live engagement metrics (impressions, clicks, lead conversion) flow backward into the generation engine to refine optimal posting schedules and topic weighting.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
