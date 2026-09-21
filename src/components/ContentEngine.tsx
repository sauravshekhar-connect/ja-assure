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
    <div className="space-y-6">
      {/* Top Banner: Studio Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form: Generator Configuration */}
        <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Content Engine Studio
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Agent 02
            </span>
          </div>

          {/* Brand Voice Switcher */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              1. Brand Voice & Niche
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setBrand("jade")}
                className={`p-2 rounded-xl text-left border transition-all ${
                  brand === "jade"
                    ? "bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500/40"
                    : "bg-slate-800/40 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Jade
                </div>
                <div className="text-[10px] text-slate-400 truncate">Jewellers Block</div>
              </button>

              <button
                type="button"
                onClick={() => setBrand("jaguar")}
                className={`p-2 rounded-xl text-left border transition-all ${
                  brand === "jaguar"
                    ? "bg-amber-950/80 border-amber-500 text-amber-200 ring-1 ring-amber-500/40"
                    : "bg-slate-800/40 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Jaguar
                </div>
                <div className="text-[10px] text-slate-400 truncate">Specie Transit</div>
              </button>

              <button
                type="button"
                onClick={() => setBrand("doctorshield")}
                className={`p-2 rounded-xl text-left border transition-all ${
                  brand === "doctorshield"
                    ? "bg-cyan-950/80 border-cyan-500 text-cyan-200 ring-1 ring-cyan-500/40"
                    : "bg-slate-800/40 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="font-bold text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> DoctorShield
                </div>
                <div className="text-[10px] text-slate-400 truncate">Medical Indemnity</div>
              </button>
            </div>
          </div>

          {/* Platform & Language Selector */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as PlatformId)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="linkedin">LinkedIn (Long-form / Advisory)</option>
                <option value="instagram">Instagram (Visual Carousel)</option>
                <option value="x">X / Twitter (Hook & Thread)</option>
                <option value="tiktok">TikTok / Reels (Vertical Video)</option>
                <option value="blog">InsurTech 101 Whitepaper</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Multilingual Layer
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
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
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Asset Format
            </label>
            <div className="grid grid-cols-4 gap-1.5">
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
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 border transition-all ${
                      format === f.id
                        ? "bg-slate-700 text-white border-slate-600 shadow-sm"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
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
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Core Topic / Risk Angle
              </label>
              <span className="text-[10px] text-slate-500">1 Idea → Multi-Format</span>
            </div>
            <textarea
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Preventing jewel consignment sub-limit losses during international gem trade fairs..."
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-600"
            />
          </div>

          {/* 1-Click Topic Presets for Hackathon Demonstration */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              Quick Niche Presets ({brand.toUpperCase()}):
            </label>
            <div className="space-y-1">
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
                  className="w-full text-left p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 text-[11px] text-slate-300 transition-colors flex items-center justify-between group"
                >
                  <span className="truncate font-medium">{p.title}</span>
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 group-hover:text-emerald-400">
                    Use
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Closed-Loop Memories Injected Preview Chip */}
          <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-800/30 text-xs">
            <div className="flex items-center justify-between text-purple-300 font-semibold mb-1">
              <span className="flex items-center gap-1 text-[11px]">
                <RotateCcw className="w-3.5 h-3.5" />
                Closed-Loop Memory: {activeBrandLessons.length} Rules Injected
              </span>
              <button 
                onClick={() => onNavigateTab("review")}
                className="text-[10px] underline hover:text-purple-200"
              >
                Inspect
              </button>
            </div>
            <div className="space-y-1">
              {activeBrandLessons.slice(0, 2).map((l) => (
                <div key={l.id} className="text-[10px] text-purple-300/80 truncate flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-purple-400"></span>
                  <span className="font-mono text-purple-200">[{l.tag}]</span> {l.ruleDirective.slice(0, 55)}...
                </div>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-800/50 text-xs text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Action Button */}
          <button
            type="button"
            id="generate-content-btn"
            disabled={isGenerating}
            onClick={handleGenerate}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-emerald-950/50 border border-emerald-400/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>{generationStep || "Running Multi-Agent Pipeline..."}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>GENERATE COMPLIANT ASSET (MULTI-AGENT)</span>
              </>
            )}
          </button>
        </div>

        {/* Right Panel: Result & Preview Hub */}
        <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <h3 className="text-sm font-bold text-white">
                  {currentAsset ? currentAsset.title : "Live Output Preview"}
                </h3>
              </div>

              {currentAsset && (
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-md uppercase ${
                    currentAsset.complianceReport.status === "PASS"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  }`}>
                    Compliance: {currentAsset.complianceReport.status} ({currentAsset.complianceReport.score}/100)
                  </span>
                  
                  <button
                    onClick={() => handleCopy(currentAsset.primaryCopy)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>

            {currentAsset ? (
              <div className="mt-4 space-y-4">
                {/* Meta details bar */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Brand: <strong className="text-emerald-300">{currentAsset.brand.toUpperCase()}</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Platform: <strong className="text-cyan-300">{currentAsset.platform}</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Lang: <strong className="text-purple-300">{currentAsset.language.toUpperCase()}</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/30 text-purple-300">
                    {currentAsset.injectedLessonsCount || 0} Lessons Applied
                  </span>
                </div>

                {/* Simulated Social Card Preview */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
                  {/* Mock Social Header */}
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-xs text-white">
                      JA
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        JA Assure — {currentAsset.brand.toUpperCase()}
                        <span className="text-[10px] text-emerald-400">✓</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Singapore • InsurTech Specialist • Just now
                      </div>
                    </div>
                  </div>

                  {/* Body Copy */}
                  <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto pr-2">
                    {currentAsset.primaryCopy}
                  </div>
                </div>

                {/* A/B Variations Switcher */}
                {currentAsset.variations && currentAsset.variations.length > 0 && (
                  <div className="pt-2 border-t border-slate-800">
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      A/B Strategic Variations Generated:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
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
                          className="cursor-pointer p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 transition-all text-xs"
                        >
                          <div className="font-bold text-cyan-300 text-[11px] mb-1 flex items-center justify-between">
                            <span>{v.label}</span>
                            <span className="text-[9px] text-slate-500">Click to swap</span>
                          </div>
                          <p className="text-slate-300 text-[11px] line-clamp-2">{v.content}</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {v.hashtags.slice(0, 2).map((tag, idx) => (
                              <span key={idx} className="text-[9px] text-slate-400 font-mono">{tag}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Video Reel Storyboard Preview (if available) */}
                {currentAsset.videoScript && (
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200">
                          Short-Form Reel Script Ready ({currentAsset.videoScript.totalDurationSeconds}s)
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Hook: "{currentAsset.videoScript.hookTitle}"
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigateTab("video")}
                      className="px-3 py-1 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>Open Video Studio</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-80 flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <div className="w-12 h-12 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-center text-slate-400 mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-300 mb-1">
                  Ready to Orchestrate Content
                </h4>
                <p className="text-xs max-w-sm">
                  Select a brand and topic on the left or click a quick preset to trigger the multi-agent generation pipeline.
                </p>
              </div>
            )}
          </div>

          {/* Action Footer */}
          {currentAsset && (
            <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-slate-400">
                Status: <strong className="text-amber-400">PENDING HUMAN REVIEW (MANDATORY)</strong>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => onNavigateTab("compliance")}
                  className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Audit Compliance</span>
                </button>

                <button
                  onClick={() => onNavigateTab("review")}
                  className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950 transition-colors"
                >
                  <span>Go to Review Queue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
