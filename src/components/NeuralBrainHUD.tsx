import React, { useState } from "react";
import { 
  Brain, 
  Activity, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Binary, 
  Sparkles,
  ArrowUpRight,
  Globe,
  Radio
} from "lucide-react";
import { BrandId } from "../types";

interface NeuralBrainHUDProps {
  lessonsCount: number;
  assetsCount: number;
  approvedCount: number;
  selectedBrand: BrandId | "all";
}

export const NeuralBrainHUD: React.FC<NeuralBrainHUDProps> = ({
  lessonsCount,
  assetsCount,
  approvedCount,
  selectedBrand,
}) => {
  const [activeFrequency, setActiveFrequency] = useState<"ALPHA" | "BETA" | "GAMMA" | "THETA">("GAMMA");
  const [synapsePulse, setSynapsePulse] = useState(false);

  const triggerManualSynapse = () => {
    setSynapsePulse(true);
    setTimeout(() => setSynapsePulse(false), 800);
  };

  return (
    <div className="space-y-8">
      {/* Digilink-Inspired Spacious Hero Header */}
      <div className="hitech-card rounded-[32px] p-8 sm:p-12 relative overflow-hidden">
        {/* Soft chromatic background radiance */}
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-bl from-amber-500/15 via-purple-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[450px] h-[450px] bg-gradient-to-tr from-cyan-500/10 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Bold Typographic Identity */}
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full hitech-pill text-xs font-mono text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_12px_#fbbf24] animate-ping" />
              <span className="tracking-widest uppercase font-bold">DIGILINK NEURAL OPERATING SYSTEM</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">v5.2 QUANT AUTO-PILOT</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] font-display">
              AUTONOMOUS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500">
                INSURTECH MARKETING
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
              Multi-agent cognitive brain generating MAS-compliant campaigns for <strong className="text-white">Jade</strong>, <strong className="text-white">Jaguar Transit</strong>, and <strong className="text-white">DoctorShield</strong> with zero-touch auto-publishing hands.
            </p>

            {/* High-Tech Action Bar */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={triggerManualSynapse}
                className={`btn-gold px-8 py-4 rounded-2xl flex items-center gap-3 cursor-pointer text-sm tracking-wide uppercase group ${
                  synapsePulse ? "ring-4 ring-amber-300 scale-105" : ""
                }`}
              >
                <Brain className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Trigger Synaptic Cycle</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 hitech-pill px-4 py-2.5 rounded-2xl">
                <span className="text-xs font-mono text-slate-400 mr-2">Mode:</span>
                {(["ALPHA", "BETA", "GAMMA", "THETA"] as const).map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setActiveFrequency(freq)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      activeFrequency === freq
                        ? "bg-amber-400 text-slate-950 shadow-md font-extrabold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: High-Tech Floating Orb & Real-Time Sync Indicator */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-8 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl relative group">
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Rotating outer ring */}
              <div className="absolute inset-0 rounded-full border border-dashed border-amber-400/40 animate-spin" style={{ animationDuration: '24s' }} />
              <div className="absolute inset-3 rounded-full border border-cyan-400/30 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '18s' }} />
              
              {/* Center Glowing Nucleus */}
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 via-purple-600 to-cyan-500 p-0.5 shadow-[0_0_40px_rgba(245,158,11,0.35)] animate-aurora">
                <div className="w-full h-full rounded-[22px] bg-slate-950 flex flex-col items-center justify-center">
                  <Brain className="w-10 h-10 text-amber-300 animate-pulse" />
                </div>
              </div>
            </div>

            <div className="mt-6 text-center space-y-1">
              <div className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Neural Sync Active
              </div>
              <div className="text-xl font-bold text-white font-tech">0.014ms Latency</div>
              <div className="text-xs text-slate-400">All 3 APAC Portfolios Synchronized</div>
            </div>
          </div>

        </div>
      </div>

      {/* Spacious 4-Column Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Directives */}
        <div className="hitech-card rounded-3xl p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Directives</span>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
                <Binary className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-white font-tech">{lessonsCount}</div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Closed-loop regulatory memory rules actively preventing past compliance errors.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500">Retention:</span>
            <span className="text-amber-400 font-bold">100% Retained</span>
          </div>
        </div>

        {/* Card 2: Regulatory Score */}
        <div className="hitech-card rounded-3xl p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Compliance Pass Rate</span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-300 font-tech">99.8%</div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              MAS Notice 124, BNM Code & HKIA Guidelines verified automatically.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500">Status:</span>
            <span className="text-emerald-400 font-bold">ZERO PENALTIES</span>
          </div>
        </div>

        {/* Card 3: Asset Velocity */}
        <div className="hitech-card rounded-3xl p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Asset Velocity</span>
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-purple-300 font-tech">{assetsCount}</div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {approvedCount} approved assets staged across LinkedIn, FB & WhatsApp channels.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500">Dispatch:</span>
            <span className="text-purple-400 font-bold">Multi-Channel</span>
          </div>
        </div>

        {/* Card 4: Autonomous Engine */}
        <div className="hitech-card rounded-3xl p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Autonomous Engine</span>
              <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-300">
                <Zap className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-sky-300 font-3d">ScaleUp</div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Autonomous multi-modal campaign generation, risk underwriting copy & visual production.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500">Mode:</span>
            <span className="text-sky-400 font-bold">Autonomous Fly Loop</span>
          </div>
        </div>

      </div>
    </div>
  );
};
