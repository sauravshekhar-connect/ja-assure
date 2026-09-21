import React, { useState, useRef, useEffect } from "react";
import { Palette, Check, Sparkles, Sun, Moon, Zap, Shield } from "lucide-react";
import { ThemeId, ThemeOption } from "../types";

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "runner-dark",
    name: "ScaleUp (Dark)",
    tagline: "Sleek carbon canvas, ultra-crisp micro-borders & ice white/cyan accents",
    previewColor: "#38bdf8",
    accentBadge: "ScaleUp OS",
    isDark: true,
  },
  {
    id: "runner-light",
    name: "ScaleUp (Light)",
    tagline: "Pure minimalist studio white, slate-900 typography & steel lines",
    previewColor: "#0f172a",
    accentBadge: "ScaleUp Studio",
    isDark: false,
  },
  {
    id: "digilink-gold",
    name: "Digilink Gold",
    tagline: "Obsidian canvas with warm amber & gold aurora",
    previewColor: "#f59e0b",
    accentBadge: "Gold OS",
    isDark: true,
  },
  {
    id: "cyber-matrix",
    name: "Cyber Matrix",
    tagline: "Midnight space with high-voltage neon cyan",
    previewColor: "#06b6d4",
    accentBadge: "Cyber Cyan",
    isDark: true,
  },
  {
    id: "royal-amethyst",
    name: "Royal Amethyst",
    tagline: "Imperial deep violet with orchid & magenta beams",
    previewColor: "#a855f7",
    accentBadge: "Velvet Purple",
    isDark: true,
  },
];

interface ThemeSwitcherProps {
  currentTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  currentTheme,
  onThemeChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeOption =
    THEME_OPTIONS.find((t) => t.id === currentTheme) || THEME_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        id="theme-switcher-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 h-8 px-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-white/[0.08] hover:border-white/20 text-xs font-medium transition-all cursor-pointer shadow-sm group"
        title="Change visual theme"
        aria-label="Change visual theme"
      >
        <span
          className="w-2 h-2 rounded-full shadow-sm ring-1 ring-white/20 shrink-0"
          style={{ backgroundColor: activeOption.previewColor }}
        />
        <span className="hidden lg:inline text-neutral-400 font-normal">Theme:</span>
        <span className="font-medium text-white text-xs truncate max-w-[85px] sm:max-w-none">
          {activeOption.name.replace(" (Dark)", "").replace(" (Light)", "")}
        </span>
        <Palette className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#0d0f15]/95 border border-white/[0.12] p-3 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-2">
          <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08] px-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-semibold tracking-tight text-white">
                Visual Themes
              </span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400 px-1.5 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08]">
              {THEME_OPTIONS.length} Presets
            </span>
          </div>

          <div className="space-y-1.5">
            {THEME_OPTIONS.map((theme) => {
              const isSelected = theme.id === currentTheme;
              return (
                <button
                  key={theme.id}
                  id={`theme-option-${theme.id}`}
                  onClick={() => {
                    onThemeChange(theme.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                    isSelected
                      ? "bg-white/[0.08] border-white/20 shadow-sm"
                      : "bg-white/[0.02] hover:bg-white/[0.06] border-transparent hover:border-white/[0.08]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Swatch Sphere */}
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm relative shrink-0 border border-white/15"
                      style={{
                        backgroundColor: theme.isDark ? "#090a0f" : "#ffffff",
                      }}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full shadow-inner"
                        style={{ backgroundColor: theme.previewColor }}
                      />
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-white">
                          {theme.name}
                        </span>
                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-white/5 text-neutral-400 border border-white/10">
                          {theme.accentBadge}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400 leading-tight line-clamp-1">
                        {theme.tagline}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/[0.08] px-1 text-[10px] text-neutral-400 font-mono text-center flex items-center justify-center gap-1.5">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>Real-time CSS canvas & HUD styling</span>
          </div>
        </div>
      )}
    </div>
  );
};
