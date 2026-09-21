import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Activity, Zap, Wifi } from "lucide-react";

interface TickerItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isUp: boolean;
  metric: string;
}

export const NeuralMarketTicker: React.FC = () => {
  const [tickers, setTickers] = useState<TickerItem[]>([
    { symbol: "JADE-IDX", name: "High-Jewelry Block", price: "S$1,428.50", change: "+4.8%", isUp: true, metric: "Underwritten: 99.4%" },
    { symbol: "JAGUAR-SPECIE", name: "Specie Transit Index", price: "$84.2M", change: "+12.4%", isUp: true, metric: "Cargo Safety: 100%" },
    { symbol: "MED-MALP", name: "DoctorShield Indemnity", price: "RM 2,190", change: "-1.2%", isUp: false, metric: "Claims: 0.04%" },
    { symbol: "MAS-124", name: "Regulatory Compliance", price: "99.8%", change: "+0.3%", isUp: true, metric: "Zero Misrep" },
    { symbol: "BNM-MALAYSIA", name: "Bank Negara Audit", price: "Pass", change: "+100%", isUp: true, metric: "Verified" },
    { symbol: "HKIA-CARGO", name: "Hong Kong Specie Flow", price: "HK$680M", change: "+3.7%", isUp: true, metric: "In-Transit" },
    { symbol: "GEMINI-2.5", name: "Inference Velocity", price: "1.24s", change: "-8.4%", isUp: true, metric: "Optimized" },
  ]);

  // Subtle real-time jitter simulation for financial stock ticker feel
  useEffect(() => {
    const interval = setInterval(() => {
      setTickers((prev) =>
        prev.map((item) => {
          if (Math.random() > 0.4) return item;
          const delta = (Math.random() * 0.4 - 0.18).toFixed(1);
          const isUp = parseFloat(delta) >= 0;
          return {
            ...item,
            change: `${isUp ? "+" : ""}${delta}%`,
            isUp,
          };
        })
      );
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-slate-950/90 border-b border-white/10 py-3 px-6 backdrop-blur-xl overflow-hidden relative font-mono text-xs select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        
        {/* Market Terminal Indicator */}
        <div className="flex items-center gap-2.5 text-amber-400 font-bold tracking-wider shrink-0 pr-4 border-r border-white/10">
          <Activity className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-xs uppercase tracking-widest text-slate-200">QUANT TICKER</span>
        </div>

        {/* Ticker Stream with smooth scrolling overflow */}
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-0.5 scroll-smooth">
          {tickers.map((t, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 shrink-0 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 hover:border-amber-400/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-xs group-hover:text-amber-300 transition-colors">
                  {t.symbol}
                </span>
                <span className="text-slate-500 text-xs hidden md:inline">{t.name}</span>
              </div>
              <span className="text-slate-200 font-semibold text-xs">{t.price}</span>
              <span
                className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg ${
                  t.isUp
                    ? "text-emerald-400 bg-emerald-950/60 border border-emerald-500/30"
                    : "text-rose-400 bg-rose-950/60 border border-rose-500/30"
                }`}
              >
                {t.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {t.change}
              </span>
              <span className="text-[10px] text-slate-500 font-normal hidden lg:inline">[{t.metric}]</span>
            </div>
          ))}
        </div>

        {/* High-tech Stream Status */}
        <div className="hidden xl:flex items-center gap-4 shrink-0 pl-4 border-l border-white/10 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-300 font-bold">1.28 TFLOPs</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Wifi className="w-3.5 h-3.5" />
            <span>99.99% SYNC</span>
          </div>
        </div>

      </div>
    </div>
  );
};
