import React from "react";
import { Zap, RefreshCw, Sparkles } from "lucide-react";
import { BrandId, ThemeId } from "../types";
import { ThemeSwitcher } from "./ThemeSwitcher";

interface HeaderProps {
  selectedBrand: BrandId | "all";
  onSelectBrand: (b: BrandId | "all") => void;
  hasApiKey: boolean;
  onResetDemo: () => void;
  currentTheme: ThemeId;
  onThemeChange: (t: ThemeId) => void;
  onOpenCover?: () => void;
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
  onResetDemo,
  currentTheme,
  onThemeChange,
  onOpenCover,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#08090d]/85 backdrop-blur-xl transition-all duration-200">
      {/* Primary Horizontal Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 sm:h-[68px] flex items-center justify-between gap-4">
          
          {/* ========================================================
              LEFT: Modern SaaS Logotype & Sub-branding
              ======================================================== */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Minimalist Geometric Mark */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-white/15 to-white/5 border border-white/15 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.5)] ring-1 ring-white/10 group cursor-pointer hover:border-white/30 transition-all">
              <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
            </div>

            {/* Clean Logotype & Hierarchy */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-baseline gap-1">
                <span className="font-sans font-bold text-base sm:text-lg tracking-tight text-white">
                  Scale<span className="text-emerald-400">Up</span>
                </span>
              </div>

              <span className="h-3.5 w-px bg-white/15 hidden sm:block" />

              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs font-medium text-neutral-300 tracking-tight">
                  JA Assure
                </span>
                <span className="text-[11px] text-neutral-400 hidden lg:inline">
                  Marketing Engine
                </span>
              </div>

              {/* Minimal Regional Market Pill */}
              <div className="hidden xl:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[10px] font-mono text-neutral-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>SG • MY • HK</span>
              </div>
            </div>
          </div>

          {/* ========================================================
              CENTER: SaaS Segmented Navigation Tabs (Portfolios)
              ======================================================== */}
          <nav
            aria-label="Brand Portfolios"
            className="hidden md:flex items-center p-1 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md shadow-inner"
          >
            {/* All Portfolios */}
            <button
              id="brand-filter-all"
              onClick={() => onSelectBrand("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs transition-all duration-150 whitespace-nowrap cursor-pointer ${
                selectedBrand === "all"
                  ? "bg-white text-slate-950 font-semibold shadow-sm"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.05] font-medium"
              }`}
            >
              All Portfolios
            </button>

            {/* Jade Jewellers */}
            <button
              id="brand-filter-jade"
              onClick={() => onSelectBrand("jade")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all duration-150 whitespace-nowrap cursor-pointer ${
                selectedBrand === "jade"
                  ? "bg-white text-slate-950 font-semibold shadow-sm"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.05] font-medium"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${selectedBrand === "jade" ? "bg-emerald-600" : "bg-emerald-400"}`} />
              <span>Jade Jewellers</span>
            </button>

            {/* Jaguar Transit */}
            <button
              id="brand-filter-jaguar"
              onClick={() => onSelectBrand("jaguar")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all duration-150 whitespace-nowrap cursor-pointer ${
                selectedBrand === "jaguar"
                  ? "bg-white text-slate-950 font-semibold shadow-sm"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.05] font-medium"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${selectedBrand === "jaguar" ? "bg-amber-600" : "bg-amber-400"}`} />
              <span>Jaguar Transit</span>
            </button>

            {/* DoctorShield */}
            <button
              id="brand-filter-doctorshield"
              onClick={() => onSelectBrand("doctorshield")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all duration-150 whitespace-nowrap cursor-pointer ${
                selectedBrand === "doctorshield"
                  ? "bg-white text-slate-950 font-semibold shadow-sm"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.05] font-medium"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${selectedBrand === "doctorshield" ? "bg-sky-600" : "bg-sky-400"}`} />
              <span>DoctorShield</span>
            </button>
          </nav>

          {/* ========================================================
              RIGHT: Unified Actions & Controls ending at Reset
              ======================================================== */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Live Engine Status Indicator */}
            <div className="hidden sm:inline-flex items-center gap-2 h-8 px-3 rounded-full bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="font-mono text-[11px] tracking-wide font-medium">FLY MODE</span>
            </div>

            {/* Theme Switcher Trigger */}
            <ThemeSwitcher currentTheme={currentTheme} onThemeChange={onThemeChange} />

            {/* Cover Page Portal Link */}
            {onOpenCover && (
              <button
                id="header-open-cover-btn"
                onClick={onOpenCover}
                title="Return to interactive entrance cover page"
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-white/[0.08] hover:border-white/20 text-xs font-medium transition-all cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Cover Page</span>
              </button>
            )}

            {/* Reset Button (Clean Ending Control) */}
            <button
              id="header-reset-demo-btn"
              onClick={onResetDemo}
              title="Reset application to seed demo baseline"
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-white/[0.04] hover:bg-rose-500/10 hover:text-rose-300 border border-white/[0.08] hover:border-rose-500/20 text-neutral-400 text-xs font-medium transition-all cursor-pointer shadow-sm group"
            >
              <RefreshCw className="w-3.5 h-3.5 text-neutral-400 group-hover:rotate-180 group-hover:text-rose-400 transition-all duration-500" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>

        </div>

        {/* Mobile-Only Segmented Brand Scroller */}
        <div className="md:hidden pb-3 pt-0.5 overflow-x-auto no-scrollbar flex items-center gap-1.5 border-t border-white/[0.04]">
          <button
            onClick={() => onSelectBrand("all")}
            className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-all ${
              selectedBrand === "all"
                ? "bg-white text-slate-950 font-semibold"
                : "text-neutral-400 bg-white/[0.03] border border-white/[0.06]"
            }`}
          >
            All Portfolios
          </button>
          <button
            onClick={() => onSelectBrand("jade")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-all ${
              selectedBrand === "jade"
                ? "bg-white text-slate-950 font-semibold"
                : "text-neutral-400 bg-white/[0.03] border border-white/[0.06]"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Jade</span>
          </button>
          <button
            onClick={() => onSelectBrand("jaguar")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-all ${
              selectedBrand === "jaguar"
                ? "bg-white text-slate-950 font-semibold"
                : "text-neutral-400 bg-white/[0.03] border border-white/[0.06]"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Jaguar</span>
          </button>
          <button
            onClick={() => onSelectBrand("doctorshield")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-all ${
              selectedBrand === "doctorshield"
                ? "bg-white text-slate-950 font-semibold"
                : "text-neutral-400 bg-white/[0.03] border border-white/[0.06]"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span>DoctorShield</span>
          </button>
        </div>
      </div>
    </header>
  );
};

