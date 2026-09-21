import React, { useState } from "react";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Send, 
  ShieldCheck, 
  FileText, 
  Video, 
  Layers, 
  Globe, 
  Lightbulb, 
  AlertTriangle,
  RotateCcw,
  Clock,
  ArrowRight,
  Bookmark
} from "lucide-react";
import { 
  BrandId, 
  PlatformId, 
  LanguageCode, 
  MarketingAsset, 
  LessonLearned 
} from "../types";

interface ContentEngineProps {
  selectedBrand: BrandId | "all";
  lessons: LessonLearned[];
  onAssetCreated: (asset: MarketingAsset) => void;
  onNavigateTab: (tab: string) => void;
}

export const ContentEngine: React.FC<ContentEngineProps> = ({
  selectedBrand,
  lessons,
  onAssetCreated,
  onNavigateTab,
}) => {
  // Form State
  const [brand, setBrand] = useState<BrandId>(selectedBrand === "all" ? "jade" : selectedBrand);
  const [platform, setPlatform] = useState<PlatformId>("linkedin");
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [format, setFormat] = useState<"post" | "carousel" | "video" | "blog">("post");
  const [topic, setTopic] = useState("");
  const [customBrief, setCustomBrief] = useState("");
  const [includeVideoScript, setIncludeVideoScript] = useState(false);

  // Execution State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>("");
  const [currentAsset, setCurrentAsset] = useState<MarketingAsset | null>(null);
  const [selectedVariationIdx, setSelectedVariationIdx] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Synchronize with external brand switcher
  React.useEffect(() => {
    if (selectedBrand !== "all") {
      setBrand(selectedBrand);
    }
  }, [selectedBrand]);

  // Niche preset topics per brand
  const presets: Record<BrandId, { title: string; topic: string; platform: PlatformId; format: "post" | "carousel" | "video" | "blog" }[]> = {
    jade: [
      {
        title: "💎 Exhibition Consignment Floats",
        topic: "Bridging the sub-limit insurance gap when boutique jewellers bring $2M+ diamond pieces to regional exhibitions",
        platform: "linkedin",
        format: "post"
      },
      {
        title: "🔐 Vault UL Class 2 vs TL-30 Safe Flaws",
        topic: "The 3 physical safe rating mistakes that inadvertently void jewellers block policy warranties",
        platform: "instagram",
        format: "carousel"
      },
      {
        title: "📈 Surge in Gold & Gemstone Valuation",
        topic: "Preventing the 'Average Clause' under-insurance penalty as diamond and gold bullion prices hit historic highs",
        platform: "linkedin",
        format: "blog"
      },
      {
        title: "🎥 Reel: 3 Safe Myths in Jewellery",
        topic: "Short-form video script on why standard fire safes fail burglary inspections",
        platform: "tiktok",
        format: "video"
      }
    ],
    jaguar: [
      {
        title: "✈️ Tarmac Dwell Air Cargo Risks",
        topic: "Eliminating tarmac theft blind spots during transshipment of advanced microchips and bullion in ASEAN airports",
        platform: "linkedin",
        format: "post"
      },
      {
        title: "🛰️ Smart IoT & Telematics Warranty",
        topic: "How real-time GPS tamper sensors satisfy strict Lloyd's and Specie underwriters for armored transit",
        platform: "x",
        format: "post"
      },
      {
        title: "🛡️ Trans-ASEAN Bonded Corridors",
        topic: "Managing cross-border customs liability between Singapore, Penang, and Bangkok transshipment routes",
        platform: "linkedin",
        format: "carousel"
      }
    ],
    doctorshield: [
      {
        title: "💉 Aesthetic Medicine Complications",
        topic: "Why standard clinic indemnity excludes off-label neurotoxin & dermal filler inquiries, and how DoctorShield guarantees contractual defense",
        platform: "linkedin",
        format: "post"
      },
      {
        title: "⚖️ Contract-Certain vs Discretionary Assistance",
        topic: "The critical difference between mutual defense societies and binding contractual medical indemnity",
        platform: "linkedin",
        format: "carousel"
      },
      {
        title: "🏥 Clinic Retroactive Liability Defense",
        topic: "Protecting newly joined medical associates against past practice inquiries and medical council notices",
        platform: "linkedin",
        format: "blog"
      }
    ]
  };

  // Filter lessons relevant to this brand
  const activeBrandLessons = lessons.filter(l => l.brand === brand || l.brand === "all");

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setErrorMsg("Please enter an idea, topic, or select a preset below.");
      return;
    }

    setErrorMsg(null);
    setIsGenerating(true);
    setGenerationStep("Injecting closed-loop memories & brand voice rules...");

    try {
      setTimeout(() => {
        setGenerationStep("Executing Gemini 3.8 Flash multi-format generation...");
      }, 500);

      const res = await fetch("/api/agent/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand,
          topic,
          platform,
          language,
          format,
          includeVideoScript: includeVideoScript || format === "video",
          customBrief,
        }),
      });

      setGenerationStep("Running automated Compliance Gate check...");

      if (!res.ok) {
        let errDetail = "Server generation failed";
        try {
          const errJson = await res.json();
          if (errJson?.error) errDetail = errJson.error;
        } catch (_) {}
        throw new Error(errDetail);
      }

      const data = await res.json();
      setCurrentAsset(data.asset);
      onAssetCreated(data.asset);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
      setGenerationStep("");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12">
      {/* Top Banner: Studio Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Generator Configuration */}
        <div className="lg:col-span-5 hitech-card rounded-3xl p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <h2 className="text-base font-bold text-white flex items-center gap-3 font-display">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Autonomous Content Engine
            </h2>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
              AGENT STAGE 02
            </span>
          </div>

          {/* Brand Voice Switcher */}
          <div className="space-y-3">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">
              1. Brand Constellation & Voice
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setBrand("jade")}
                className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                  brand === "jade"
                    ? "bg-emerald-950/90 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-950/60"
                    : "bg-slate-900/60 border-white/10 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1.5 font-display">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span> Jade
                </div>
                <div className="text-[10px] text-slate-400 mt-1 truncate font-mono">Jewellers Block</div>
              </button>

              <button
                type="button"
                onClick={() => setBrand("jaguar")}
                className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                  brand === "jaguar"
                    ? "bg-amber-950/90 border-amber-400 text-amber-200 ring-2 ring-amber-500/40 shadow-lg shadow-amber-950/60"
                    : "bg-slate-900/60 border-white/10 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1.5 font-display">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]"></span> Jaguar
                </div>
                <div className="text-[10px] text-slate-400 mt-1 truncate font-mono">Specie Transit</div>
              </button>

              <button
                type="button"
                onClick={() => setBrand("doctorshield")}
                className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                  brand === "doctorshield"
                    ? "bg-cyan-950/90 border-cyan-400 text-cyan-200 ring-2 ring-cyan-500/40 shadow-lg shadow-cyan-950/60"
                    : "bg-slate-900/60 border-white/10 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1.5 font-display">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span> DoctorShield
                </div>
                <div className="text-[10px] text-slate-400 mt-1 truncate font-mono">Medical Indemnity</div>
              </button>
            </div>
          </div>

          {/* Platform & Language Selector */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                Target Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as PlatformId)}
                className="w-full bg-slate-950/90 border border-white/10 text-slate-200 rounded-2xl px-4 py-3 text-xs focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
              >
                <option value="linkedin">LinkedIn (Long-form / Advisory)</option>
                <option value="instagram">Instagram (Visual Carousel)</option>
                <option value="x">X / Twitter (Hook & Thread)</option>
                <option value="tiktok">TikTok / Reels (Vertical Video)</option>
                <option value="blog">InsurTech 101 Whitepaper</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                Multilingual Layer
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="w-full bg-slate-950/90 border border-white/10 text-slate-200 rounded-2xl px-4 py-3 text-xs focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
              >
                <option value="en">English (Singapore / Regional)</option>
                <option value="ms">Bahasa Malaysia (Formal)</option>
                <option value="id">Bahasa Indonesia (Commercial)</option>
                <option value="th">Thai (Bangkok Commercial)</option>
                <option value="zh">Chinese (Traditional / HK & SG)</option>
              </select>
            </div>
          </div>

          {/* Format Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">
              Asset Format
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: "post", label: "Post", icon: FileText },
                { id: "carousel", label: "Carousel", icon: Layers },
                { id: "video", label: "Reel/Clip", icon: Video },
                { id: "blog", label: "Article", icon: Bookmark },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setFormat(f.id as any);
                      if (f.id === "video") setIncludeVideoScript(true);
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      format === f.id
                        ? "bg-amber-400 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-400/20"
                        : "bg-slate-950/80 border-white/10 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{f.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Topic / Idea Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Core Topic / Risk Angle
              </label>
              <span className="text-[10px] font-mono text-slate-500">1 Idea → Multi-Format</span>
            </div>
            <textarea
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Preventing jewel consignment sub-limit losses during international gem trade fairs..."
              className="w-full bg-slate-950/90 border border-white/10 text-slate-200 rounded-2xl p-4 text-xs focus:ring-1 focus:ring-amber-400 focus:border-amber-400 placeholder:text-slate-600 leading-relaxed font-sans"
            />
          </div>

          {/* 1-Click Topic Presets for Hackathon Demonstration */}
          <div className="space-y-2">
            <label className="block text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              Quick Niche Presets ({brand.toUpperCase()}):
            </label>
            <div className="space-y-2">
              {presets[brand].map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setTopic(p.topic);
                    setPlatform(p.platform);
                    setFormat(p.format);
                    if (p.format === "video") setIncludeVideoScript(true);
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/10 hover:border-amber-400/30 text-xs text-slate-300 transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <span className="truncate font-medium">{p.title}</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 group-hover:text-amber-400">
                    Use
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Closed-Loop Memories Injected Preview Chip */}
          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/40 text-xs space-y-2">
            <div className="flex items-center justify-between text-purple-300 font-semibold">
              <span className="flex items-center gap-1.5 font-mono text-xs">
                <RotateCcw className="w-4 h-4 text-purple-400" />
                Memory Bank: {activeBrandLessons.length} Rules Injected
              </span>
              <button 
                onClick={() => onNavigateTab("review")}
                className="text-xs font-mono text-purple-300 underline hover:text-white cursor-pointer"
              >
                Inspect
              </button>
            </div>
            <div className="space-y-1">
              {activeBrandLessons.slice(0, 2).map((l) => (
                <div key={l.id} className="text-xs text-purple-300/80 truncate flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                  <span className="font-mono text-purple-200">[{l.tag}]</span> {l.ruleDirective.slice(0, 55)}...
                </div>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-800/50 text-xs text-red-300 flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Action Button with Gold Digilink Aesthetic */}
          <button
            type="button"
            id="generate-content-btn"
            disabled={isGenerating}
            onClick={handleGenerate}
            className="w-full py-4 px-6 rounded-2xl btn-gold font-bold text-xs tracking-wider flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin text-slate-950" />
                <span className="font-mono">{generationStep || "Running Multi-Agent Pipeline..."}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>GENERATE COMPLIANT ASSET (MULTI-AGENT)</span>
              </>
            )}
          </button>
        </div>

        {/* Right Panel: Result & Preview Hub */}
        <div className="lg:col-span-7 hitech-card rounded-3xl p-8 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_10px_#fbbf24]"></span>
                <h3 className="text-base font-bold text-white tracking-wide font-display">
                  {currentAsset ? currentAsset.title : "Live Asset Transmission Preview"}
                </h3>
              </div>

              {currentAsset && (
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-xs font-mono font-bold rounded-xl uppercase ${
                    currentAsset.complianceReport.status === "PASS"
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm"
                      : "bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm"
                  }`}>
                    Compliance: {currentAsset.complianceReport.status} ({currentAsset.complianceReport.score}/100)
                  </span>
                  
                  <button
                    onClick={() => handleCopy(currentAsset.primaryCopy)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>

            {currentAsset ? (
              <div className="mt-6 space-y-6">
                {/* Meta details bar */}
                <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-slate-400">
                  <span className="px-3 py-1 rounded-lg bg-slate-900 text-slate-300 border border-white/10">
                    Brand: <strong className="text-emerald-300">{currentAsset.brand.toUpperCase()}</strong>
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-slate-900 text-slate-300 border border-white/10">
                    Platform: <strong className="text-cyan-300">{currentAsset.platform}</strong>
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-slate-900 text-slate-300 border border-white/10">
                    Lang: <strong className="text-purple-300">{currentAsset.language.toUpperCase()}</strong>
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-purple-950/60 border border-purple-800/40 text-purple-300">
                    {currentAsset.injectedLessonsCount || 0} Lessons Applied
                  </span>
                </div>

                {/* Simulated Social Card Preview */}
                <div className="p-6 rounded-2xl bg-slate-950/90 border border-white/10 shadow-inner space-y-4">
                  {/* Mock Social Header */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-200 flex items-center justify-center font-bold text-xs text-slate-950 font-display">
                      JA
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        JA Assure — {currentAsset.brand.toUpperCase()}
                        <span className="text-amber-400">✓</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Singapore • Autonomous Agency • Just now
                      </div>
                    </div>
                  </div>

                  {/* Body Copy */}
                  <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto pr-3 font-sans">
                    {currentAsset.primaryCopy}
                  </div>
                </div>

                {/* A/B Variations Switcher */}
                {currentAsset.variations && currentAsset.variations.length > 0 && (
                  <div className="pt-3 border-t border-white/10 space-y-3">
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-amber-400" />
                      A/B Strategic Variations Generated:
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {currentAsset.variations.map((v, i) => (
                        <div 
                          key={i}
                          onClick={() => {
                            // Update primary copy to this variation
                            setCurrentAsset({
                              ...currentAsset,
                              primaryCopy: `${v.content}\n\n${v.callToAction}\n\n${v.hashtags.join(" ")}\n\n*Subject to policy underwriting, terms and conditions. Underwritten by licensed insurers.*`
                            });
                          }}
                          className="cursor-pointer p-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-white/10 hover:border-amber-400/40 transition-all text-xs"
                        >
                          <div className="font-bold text-amber-300 text-xs mb-1 flex items-center justify-between font-display">
                            <span>{v.label}</span>
                            <span className="text-[10px] text-slate-500 font-mono">Click to swap</span>
                          </div>
                          <p className="text-slate-300 text-xs line-clamp-2 leading-relaxed">{v.content}</p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {v.hashtags.slice(0, 2).map((tag, idx) => (
                              <span key={idx} className="text-[10px] text-slate-400 font-mono">{tag}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Video Reel Storyboard Preview (if available) */}
                {currentAsset.videoScript && (
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30">
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200 font-display">
                          Short-Form Reel Script Ready ({currentAsset.videoScript.totalDurationSeconds}s)
                        </div>
                        <div className="text-xs text-slate-400">
                          Hook: "{currentAsset.videoScript.hookTitle}"
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigateTab("video")}
                      className="px-4 py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Open Studio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-96 flex flex-col items-center justify-center text-center p-8 text-slate-500">
                <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-white/10 flex items-center justify-center text-amber-400 mb-4 shadow-xl">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-white mb-2 font-display">
                  Ready to Orchestrate High-Tech Marketing
                </h4>
                <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                  Select an InsurTech brand and risk angle on the left, or pick a 1-click preset to trigger the multi-agent generation pipeline.
                </p>
              </div>
            )}
          </div>

          {/* Action Footer */}
          {currentAsset && (
            <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs font-mono text-slate-400">
                Status: <strong className="text-amber-400">PENDING HUMAN REVIEW (MANDATORY)</strong>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => onNavigateTab("compliance")}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-white/10"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Audit Compliance</span>
                </button>

                <button
                  onClick={() => onNavigateTab("review")}
                  className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-colors cursor-pointer"
                >
                  <span>Go to Review Queue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
