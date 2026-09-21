import React, { useState } from "react";
import { 
  Radar, 
  Search, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  BookOpen, 
  Layers,
  Copy,
  Check
} from "lucide-react";
import { 
  CompetitorIntelligence, 
  NewsjackTrigger, 
  MarketingAsset, 
  BrandId 
} from "../types";

interface CompetitorRadarProps {
  competitors: CompetitorIntelligence[];
  newsjacks: NewsjackTrigger[];
  selectedBrand: BrandId | "all";
  onAssetCreated: (asset: MarketingAsset) => void;
  onNavigateTab: (tab: string) => void;
}

export const CompetitorRadar: React.FC<CompetitorRadarProps> = ({
  competitors,
  newsjacks,
  selectedBrand,
  onAssetCreated,
  onNavigateTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"digest" | "newsjack" | "repurpose">("digest");
  const [isGeneratingNewsjack, setIsGeneratingNewsjack] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Repurposer state
  const [whitepaperText, setWhitepaperText] = useState(
    "Specie transit warranty clause: High-value consignments exceeding $1,000,000 SGD in transit are subject to strict attended vehicle warranties. The transport vehicle must not be left unattended at any point during transshipment, including tarmac staging areas, unless housed in a security-bonded vault under 24-hour dual-custody armed surveillance."
  );
  const [repurposedBites, setRepurposedBites] = useState<any[]>([]);
  const [isRepurposing, setIsRepurposing] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Filter
  const filteredCompetitors = competitors.filter(
    (c) => selectedBrand === "all" || c.brandTarget === selectedBrand
  );
  const filteredNewsjacks = newsjacks.filter(
    (n) => selectedBrand === "all" || n.targetBrand === selectedBrand
  );

  const handleNewsjackClick = async (item: NewsjackTrigger) => {
    setIsGeneratingNewsjack(item.id);
    setNotification(null);

    try {
      const res = await fetch("/api/agent/newsjack-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newsjackId: item.id }),
      });

      if (!res.ok) throw new Error("Failed to generate newsjack campaign");

      const data = await res.json();
      onAssetCreated(data.asset);
      setNotification(`Created newsjack campaign for "${item.headline.slice(0, 45)}...". Sent to Human Review Queue!`);
      setTimeout(() => setNotification(null), 4000);
    } catch (e) {
      console.error(e);
      setNotification("Error generating newsjack asset.");
    } finally {
      setIsGeneratingNewsjack(null);
    }
  };

  const handleRunRepurpose = async () => {
    if (!whitepaperText.trim()) return;

    setIsRepurposing(true);
    try {
      const res = await fetch("/api/agent/repurpose-whitepaper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whitepaperSnippet: whitepaperText,
          brand: selectedBrand === "all" ? "jade" : selectedBrand,
        }),
      });
      const data = await res.json();
      setRepurposedBites(data.bites || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRepurposing(false);
    }
  };

  const handleCopyBite = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Radar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Competitor Intelligence & Newsjack Radar
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                Agent 01: Research
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Continuous monitoring of niche competitor pricing & terms, breaking risk triggers, and whitepaper repurposing
            </p>
          </div>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveSubTab("digest")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === "digest"
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Competitor Digest
          </button>
          <button
            onClick={() => setActiveSubTab("newsjack")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSubTab === "newsjack"
                ? "bg-red-950/80 text-red-200 border border-red-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Zap className="w-3 h-3 text-red-400" />
            <span>Newsjack Radar ({newsjacks.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab("repurpose")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === "repurpose"
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            InsurTech 101 Repurposer
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Sub-Tab 1: Competitor Intelligence Digest */}
      {activeSubTab === "digest" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-400" />
              Periodic Market Movements & Counter-Actions
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Active Competitors: Chubb, MPS, Lloyd's Specie
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredCompetitors.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{c.competitorName}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                      c.threatLevel === "high"
                        ? "bg-red-500/10 text-red-400 border border-red-500/30"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                    }`}>
                      {c.threatLevel} Threat
                    </span>
                  </div>

                  <div className="mt-1 text-[11px] font-mono text-slate-400">
                    Target: <strong className="text-emerald-300">{c.brandTarget.toUpperCase()}</strong> • Detected: {c.detectedDate}
                  </div>

                  {/* What Changed */}
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <div className="text-[10px] font-bold uppercase text-slate-400">
                      What Changed in Market:
                    </div>
                    <p className="text-slate-200 text-[11px] leading-relaxed">
                      {c.changeSummary}
                    </p>
                    <div className="text-[10px] text-amber-400/90 font-mono mt-1">
                      Terms/Pricing: {c.pricingOrTermsMovement}
                    </div>
                  </div>

                  {/* What JA Assure Should Do */}
                  <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs space-y-1">
                    <div className="text-[10px] font-bold uppercase text-emerald-400">
                      Recommended JA Assure Counter-Action:
                    </div>
                    <p className="text-emerald-200 text-[11px] leading-relaxed">
                      {c.jaCounterAction}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab("generator")}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Launch Counter-Campaign</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Breaking Newsjack Radar */}
      {activeSubTab === "newsjack" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-red-400" />
                Live Industry Risk Triggers (Newsjack Radar)
              </h3>
              <p className="text-xs text-slate-400">
                1-click convert breaking incidents into compliant thought leadership campaigns
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {filteredNewsjacks.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-red-500/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-red-500/10 text-red-400 border border-red-500/30">
                      {item.urgency.toUpperCase()} URGENCY
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-800">
                      {item.incidentType}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{item.region}</span>
                  </div>

                  <h4 className="text-sm font-bold text-white">{item.headline}</h4>

                  <p className="text-xs text-slate-300">
                    <strong className="text-emerald-400">Angle:</strong> {item.suggestedAngle}
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <span className={`px-2.5 py-1 text-xs font-mono font-bold uppercase rounded ${
                    item.targetBrand === "jade" ? "text-emerald-400 bg-emerald-950/40" : item.targetBrand === "jaguar" ? "text-amber-400 bg-amber-950/40" : "text-cyan-400 bg-cyan-950/40"
                  }`}>
                    {item.targetBrand.toUpperCase()}
                  </span>

                  <button
                    disabled={isGeneratingNewsjack === item.id}
                    onClick={() => handleNewsjackClick(item)}
                    className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-950 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isGeneratingNewsjack === item.id ? "Drafting Campaign..." : "Draft Campaign Now"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 3: InsurTech 101 Whitepaper Repurposer */}
      {activeSubTab === "repurpose" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              InsurTech 101 Source Clause / Whitepaper
            </h3>
            <p className="text-xs text-slate-400">
              Paste complex insurance policy definitions or whitepaper excerpts. The agent turns it into 3 bite-sized social formats.
            </p>

            <textarea
              rows={8}
              value={whitepaperText}
              onChange={(e) => setWhitepaperText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-3 text-xs focus:ring-1 focus:ring-cyan-500 leading-relaxed font-sans"
            />

            <button
              disabled={isRepurposing || !whitepaperText.trim()}
              onClick={handleRunRepurpose}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-950 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isRepurposing ? "Repurposing into Social Bites..." : "Repurpose into 3 Formats"}</span>
            </button>
          </div>

          <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Repurposed Social Assets
            </h3>

            {repurposedBites.length > 0 ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {repurposedBites.map((bite, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono font-bold">
                        {bite.format}
                      </span>
                      <button
                        onClick={() => handleCopyBite(bite.content, i)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 text-[11px]"
                      >
                        {copiedIdx === i ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <div className="font-bold text-white text-xs">{bite.title}</div>
                    <div className="text-slate-300 whitespace-pre-wrap leading-relaxed text-[11px]">
                      {bite.content}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-500 text-xs">
                <BookOpen className="w-8 h-8 text-slate-600 mb-2" />
                <p>Click "Repurpose into 3 Formats" to transform the insurance policy wording into social carousels and threads.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
