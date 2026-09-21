import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  ShieldCheck, 
  UserCheck, 
  Film, 
  Users, 
  Radar, 
  Send, 
  Workflow, 
  RotateCcw,
  Layers,
  Database,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

import { 
  BrandId, 
  MarketingAsset, 
  LessonLearned, 
  LeadProspect, 
  CompetitorIntelligence, 
  NewsjackTrigger,
  ThemeId 
} from "./types";

import { Header } from "./components/Header";
import { AgentFlowDiagram } from "./components/AgentFlowDiagram";
import { ContentEngine } from "./components/ContentEngine";
import { ComplianceGateHub } from "./components/ComplianceGateHub";
import { HumanReviewQueue } from "./components/HumanReviewQueue";
import { VideoStudio } from "./components/VideoStudio";
import { LeadGenHub } from "./components/LeadGenHub";
import { CompetitorRadar } from "./components/CompetitorRadar";
import { AutoPublishHands } from "./components/AutoPublishHands";
import { NeuralMarketCanvas } from "./components/NeuralMarketCanvas";
import { NeuralMarketTicker } from "./components/NeuralMarketTicker";
import { NeuralBrainHUD } from "./components/NeuralBrainHUD";
import { CoverPage } from "./components/CoverPage";
import { AnimatePresence, motion } from "motion/react";

export default function App() {
  // Navigation & Filtering
  const [activeTab, setActiveTab] = useState<string>("generator");
  const [selectedBrand, setSelectedBrand] = useState<BrandId | "all">("all");
  const [showCoverPage, setShowCoverPage] = useState<boolean>(true);

  // Application State
  const [assets, setAssets] = useState<MarketingAsset[]>([]);
  const [lessons, setLessons] = useState<LessonLearned[]>([]);
  const [leads, setLeads] = useState<LeadProspect[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorIntelligence[]>([]);
  const [newsjacks, setNewsjacks] = useState<NewsjackTrigger[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Visual Theme state (with persistence, defaulting to Runner AI)
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => {
    const saved = localStorage.getItem("ja_theme");
    if (saved && ["runner-dark", "runner-light", "digilink-gold", "cyber-matrix", "royal-amethyst"].includes(saved)) {
      return saved as ThemeId;
    }
    return "runner-dark";
  });

  const handleThemeChange = (newTheme: ThemeId) => {
    setCurrentTheme(newTheme);
    localStorage.setItem("ja_theme", newTheme);
    setToastMessage(`Theme switched to ${newTheme.replace("-", " ").toUpperCase()}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Initial State Hydration
  const loadState = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/state");
      if (!res.ok) throw new Error("Failed to fetch state");
      const data = await res.json();
      setAssets(data.assets || []);
      setLessons(data.lessons || []);
      setLeads(data.leads || []);
      setCompetitors(data.competitors || []);
      setNewsjacks(data.newsjacks || []);
    } catch (err) {
      console.error("Error loading application state:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadState();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // State Mutators
  const handleAssetCreated = (newAsset: MarketingAsset) => {
    setAssets((prev) => [newAsset, ...prev]);
    showToast(`Asset "${newAsset.title}" generated & queued for Human Review!`);
  };

  const handleAssetUpdated = (updatedAsset: MarketingAsset) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === updatedAsset.id ? updatedAsset : a))
    );
  };

  const handleLessonAdded = (newLesson: LessonLearned) => {
    setLessons((prev) => [newLesson, ...prev]);
    showToast(`Memory Bank updated: Rule [${newLesson.tag}] added!`);
  };

  const handleLessonDeleted = (lessonId: string) => {
    setLessons((prev) => prev.filter((l) => l.id !== lessonId));
    showToast("Lesson removed from memory bank.");
  };

  const handleLeadUpdated = (updatedLead: LeadProspect) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === updatedLead.id ? updatedLead : l))
    );
  };

  const handleResetDemoData = async () => {
    if (!window.confirm("Reset all assets, lessons, and queues to default demo state?")) return;
    try {
      const res = await fetch("/api/demo/reset", { method: "POST" });
      const data = await res.json();
      setAssets(data.assets || []);
      setLessons(data.lessons || []);
      setLeads(data.leads || []);
      setCompetitors(data.competitors || []);
      setNewsjacks(data.newsjacks || []);
      showToast("Demo state reset to clean starting baseline.");
    } catch (e) {
      console.error(e);
    }
  };

  // Navigation Items
  const navTabs = [
    {
      id: "flow",
      label: "Agent Architecture",
      icon: Workflow,
      badge: null,
      highlight: false,
    },
    {
      id: "generator",
      label: "Content Engine",
      icon: Sparkles,
      badge: "Gemini",
      highlight: true,
    },
    {
      id: "compliance",
      label: "Compliance Gate",
      icon: ShieldCheck,
      badge: "MAS 124",
      highlight: false,
    },
    {
      id: "review",
      label: "Human Review & Memory",
      icon: UserCheck,
      badge: assets.filter((a) => a.status === "pending_review").length.toString(),
      highlight: false,
    },
    {
      id: "video",
      label: "Reels / Video Studio",
      icon: Film,
      badge: "9:16",
      highlight: false,
    },
    {
      id: "leads",
      label: "Lead Intelligence",
      icon: Users,
      badge: leads.length.toString(),
      highlight: false,
    },
    {
      id: "competitors",
      label: "Market Radar",
      icon: Radar,
      badge: newsjacks.length > 0 ? "Alert" : null,
      highlight: false,
    },
    {
      id: "hands",
      label: "Project 2: The Hands",
      icon: Send,
      badge: "Publish",
      highlight: false,
    },
  ];

  const pendingReviewCount = assets.filter((a) => a.status === "pending_review").length;

  return (
    <div className={`theme-${currentTheme} min-h-screen hitech-bg text-slate-100 flex flex-col antialiased selection:bg-amber-400 selection:text-slate-950 relative overflow-x-hidden transition-colors duration-300`}>
      {/* Interactive Neural Canvas Background Layer (Neurons & Stock Waves) */}
      <div className="fixed inset-0 pointer-events-auto z-0 opacity-45">
        <NeuralMarketCanvas interactive={true} theme={currentTheme} />
      </div>

      {/* Ambient High-Tech Chromatic Glows */}
      <div className="fixed top-12 left-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="fixed top-1/2 right-10 w-[600px] h-[600px] bg-purple-600/12 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="fixed bottom-10 left-10 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none"></div>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 p-5 rounded-3xl bg-slate-900/95 border border-amber-400/40 shadow-2xl shadow-black text-amber-200 text-xs font-semibold flex items-center gap-3 backdrop-blur-2xl">
          <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <span className="font-tech">{toastMessage}</span>
        </div>
      )}

      {/* Global Header */}
      <div className="relative z-30">
        <Header
          selectedBrand={selectedBrand}
          onSelectBrand={setSelectedBrand}
          hasApiKey={true}
          onResetDemo={handleResetDemoData}
          currentTheme={currentTheme}
          onThemeChange={handleThemeChange}
          onOpenCover={() => setShowCoverPage(true)}
          stats={{
            pendingReview: pendingReviewCount,
            approvedQueue: assets.filter((a) => a.status === "approved").length,
            scheduled: assets.filter((a) => a.status === "scheduled").length,
            published: assets.filter((a) => a.status === "published").length,
            lessonsCount: lessons.length,
          }}
        />

        {/* Live Stock & Neural Synapse Market Ticker Stream */}
        <NeuralMarketTicker />
      </div>

      {/* Interactive Entrance Cover Portal */}
      <AnimatePresence>
        {showCoverPage && (
          <motion.div
            key="scaleup-cover-portal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="fixed inset-0 z-50 overflow-hidden"
          >
            <CoverPage onEnter={() => setShowCoverPage(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Sub-Header Bar (Runner AI Clean Tab Bar) */}
      <div className="border-b border-white/[0.08] bg-[#090a0f]/85 backdrop-blur-2xl sticky top-0 z-30 shadow-lg relative transition-colors">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-3">
            <div className="flex items-center gap-2 min-w-max">
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                      isActive
                        ? "bg-white text-slate-950 font-bold shadow-md shadow-white/10"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-800/60 border border-transparent"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-slate-950" : "text-neutral-400"}`} />
                    <span className="tracking-tight">{tab.label}</span>
                    {tab.badge && (
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                          isActive
                            ? "bg-slate-950/20 text-slate-950"
                            : "bg-[#161a23] text-neutral-400 border border-white/10"
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Body with Generous Space Between Features */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-8 py-14 space-y-16 relative z-10">
        
        {/* Top Neural Brain HUD & Market Cognitive Matrix */}
        <NeuralBrainHUD
          lessonsCount={lessons.length}
          assetsCount={assets.length}
          approvedCount={assets.filter((a) => a.status === "approved").length}
          selectedBrand={selectedBrand}
        />
        
        {/* Persistent Pipeline Flow Quick Visual on Home Tab */}
        {activeTab === "flow" && (
          <div className="space-y-10 animate-fadeIn">
            <AgentFlowDiagram
              lessonsCount={lessons.length}
              onSelectTab={(tab) => setActiveTab(tab)}
            />

            {/* Hackathon Executive Brief Overview Cards with Space Theme & Generous Gaps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-cyan-500/20 space-y-3 shadow-xl shadow-black/40 backdrop-blur-md hover:border-cyan-500/40 transition-all">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                  01
                </div>
                <h3 className="text-sm font-bold text-white tracking-wide">Three Niche Insurance Brands</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tailored persona engines for <strong>Jade</strong> (Jewellers Block), <strong>Jaguar Transit</strong> (High-value specie air cargo), and <strong>DoctorShield</strong> (Medical malpractice indemnity).
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-purple-500/20 space-y-3 shadow-xl shadow-black/40 backdrop-blur-md hover:border-purple-500/40 transition-all">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-mono font-bold text-xs shadow-[0_0_12px_rgba(168,85,247,0.2)]">
                  02
                </div>
                <h3 className="text-sm font-bold text-white tracking-wide">Closed-Loop Reinforcement Memory</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every human edit or rejection captures a tag + note, instantly updating the <strong>{lessons.length} active directives</strong> injected into future prompts so the AI never repeats a mistake.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-amber-500/20 space-y-3 shadow-xl shadow-black/40 backdrop-blur-md hover:border-amber-500/40 transition-all">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold text-xs shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                  03
                </div>
                <h3 className="text-sm font-bold text-white tracking-wide">First-Class Compliance Gate</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Strict regulatory auditing against <strong>MAS SG Notice 124</strong>, BNM Code of Practice, and HKIA rules. Flags absolute guarantees and auto-remediates copy before human signoff.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Content Engine Studio */}
        {activeTab === "generator" && (
          <div className="space-y-8 animate-fadeIn">
            <ContentEngine
              selectedBrand={selectedBrand}
              lessons={lessons}
              onAssetCreated={handleAssetCreated}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          </div>
        )}

        {/* Tab 2: Compliance Gate Hub */}
        {activeTab === "compliance" && (
          <div className="space-y-8 animate-fadeIn">
            <ComplianceGateHub
              assets={assets}
              onAssetUpdated={handleAssetUpdated}
            />
          </div>
        )}

        {/* Tab 3: Human Review & Closed-Loop Memory Queue */}
        {activeTab === "review" && (
          <div className="space-y-8 animate-fadeIn">
            <HumanReviewQueue
              assets={assets}
              lessons={lessons}
              selectedBrand={selectedBrand}
              onAssetReviewed={handleAssetUpdated}
              onLessonAdded={handleLessonAdded}
              onLessonDeleted={handleLessonDeleted}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          </div>
        )}

        {/* Tab 4: Video Studio & Short-form Reels */}
        {activeTab === "video" && (
          <div className="space-y-8 animate-fadeIn">
            <VideoStudio
              assets={assets}
              selectedBrand={selectedBrand}
              onAssetCreated={handleAssetCreated}
            />
          </div>
        )}

        {/* Tab 5: Lead Intelligence & Personalized Outreach */}
        {activeTab === "leads" && (
          <div className="space-y-8 animate-fadeIn">
            <LeadGenHub
              leads={leads}
              selectedBrand={selectedBrand}
              onLeadUpdated={handleLeadUpdated}
            />
          </div>
        )}

        {/* Tab 6: Market Radar & Newsjack Triggers */}
        {activeTab === "competitors" && (
          <div className="space-y-8 animate-fadeIn">
            <CompetitorRadar
              competitors={competitors}
              newsjacks={newsjacks}
              selectedBrand={selectedBrand}
              onAssetCreated={handleAssetCreated}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          </div>
        )}

        {/* Tab 7: Project 2 (The Hands) Auto-Publisher */}
        {activeTab === "hands" && (
          <div className="space-y-8 animate-fadeIn">
            <AutoPublishHands
              assets={assets}
              selectedBrand={selectedBrand}
              onAssetUpdated={handleAssetUpdated}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          </div>
        )}

      </main>

      {/* Footer with Space Theme & Mission Control Status */}
      <footer className="border-t border-cyan-500/15 bg-slate-950/95 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse"></span>
            <span className="text-slate-300 font-semibold">JA ASSURE ORBITAL MISSION CONTROL</span>
            <span>•</span>
            <span>MULTI-AGENT MARKETING BRAIN & HANDS</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>MAS Notice 124 / BNM Strict Gate</span>
            <span>•</span>
            <span className="text-cyan-400 font-medium">Closed-Loop Reinforcement Active</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
