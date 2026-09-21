import React from "react";
import { Shield, Sparkles, RefreshCw, Cpu, Activity, AlertCircle } from "lucide-react";
import { BrandId } from "../types";

interface HeaderProps {
  selectedBrand: BrandId | "all";
  onSelectBrand: (b: BrandId | "all") => void;
  hasApiKey: boolean;
  onResetDemo: () => void;
  stats: {
    pendingReview: number;
    approvedQueue: number;
    scheduled: number;
    published: number;
    lessonsCount: number;
  };
}

export const Header: React.FC<HeaderProps> = ({
  selectedBrand,
  onSelectBrand,
  hasApiKey,
  onResetDemo,
  stats,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      {/* Top Banner: Status & Brand Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Logo & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 flex items-center justify-center shadow-lg shadow-emerald-900/30 border border-emerald-400/30">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white font-['Plus_Jakarta_Sans']">
                JA ASSURE
              </span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                InsurTech AI Agent
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Multi-Agent Brain & Hands Pipeline • Singapore, Malaysia, HK, TH, ID
            </p>
          </div>
        </div>

        {/* Brand Switcher Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 border border-slate-800 rounded-xl overflow-x-auto">
          <button
            id="brand-filter-all"
            onClick={() => onSelectBrand("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              selectedBrand === "all"
                ? "bg-slate-700 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All Brands
          </button>
          <button
            id="brand-filter-jade"
            onClick={() => onSelectBrand("jade")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              selectedBrand === "jade"
                ? "bg-emerald-600/90 text-white shadow-sm shadow-emerald-950"
                : "text-emerald-400 hover:bg-emerald-950/40"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Jade Jewellers
          </button>
          <button
            id="brand-filter-jaguar"
            onClick={() => onSelectBrand("jaguar")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              selectedBrand === "jaguar"
                ? "bg-amber-600/90 text-white shadow-sm shadow-amber-950"
                : "text-amber-400 hover:bg-amber-950/40"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            Jaguar Transit
          </button>
          <button
            id="brand-filter-doctorshield"
            onClick={() => onSelectBrand("doctorshield")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              selectedBrand === "doctorshield"
                ? "bg-cyan-600/90 text-white shadow-sm shadow-cyan-950"
                : "text-cyan-400 hover:bg-cyan-950/40"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            DoctorShield
          </button>
        </div>

        {/* Right side: AI Model Badge & Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300 font-mono">gemini-3.8-flash</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>

          <button
            id="header-reset-demo-btn"
            onClick={onResetDemo}
            title="Reset to fresh demo state with seed data"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition-colors"
          >
            <RefreshCw className="w-3 h-3 text-slate-400" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Real-Time Pipeline Stats Ribbon */}
      <div className="border-t border-slate-800/60 bg-slate-900/40 px-4 sm:px-6 py-1.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-400 overflow-x-auto gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Pipeline Status:</span>
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <Activity className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} /> Multi-Agent Orchestrator Online
              </span>
            </div>
            <div className="h-3 w-px bg-slate-800"></div>
            <div className="flex items-center gap-1">
              <span className="text-slate-500">Compliance Gate:</span>
              <span className="text-cyan-400 font-mono font-medium">Strict (MAS 124 / BNM)</span>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Pending Review: <strong>{stats.pendingReview}</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Approved Queue: <strong>{stats.approvedQueue}</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
              Published: <strong>{stats.published}</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
              Lessons Memory: <strong>{stats.lessonsCount}</strong>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
