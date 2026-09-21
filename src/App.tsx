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
  NewsjackTrigger 
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

export default function App() {
  // Navigation & Filtering
  const [activeTab, setActiveTab] = useState<string>("generator");
  const [selectedBrand, setSelectedBrand] = useState<BrandId | "all">("all");

  // Application State
  const [assets, setAssets] = useState<MarketingAsset[]>([]);
  const [lessons, setLessons] = useState<LessonLearned[]>([]);
  const [leads, setLeads] = useState<LeadProspect[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorIntelligence[]>([]);
  const [newsjacks, setNewsjacks] = useState<NewsjackTrigger[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 shadow-2xl text-emerald-200 text-xs font-medium flex items-center gap-2.5 backdrop-blur-md animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Header */}
      <Header
        selectedBrand={selectedBrand}
        onSelectBrand={setSelectedBrand}
        hasApiKey={true}
        onResetDemo={handleResetDemoData}
        stats={{
          pendingReview: pendingReviewCount,
          approvedQueue: assets.filter((a) => a.status === "approved").length,
          scheduled: assets.filter((a) => a.status === "scheduled").length,
          published: assets.filter((a) => a.status === "published").length,
          lessonsCount: lessons.length,
        }}
      />

      {/* Navigation Sub-Header Bar */}
      <div className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-2">
            <div className="flex items-center gap-1 min-w-max">
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 shadow-sm"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md ${
                          isActive
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-slate-800 text-slate-400"
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

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Persistent Pipeline Flow Quick Visual on Home Tab */}
        {activeTab === "flow" && (
          <div className="space-y-6 animate-fadeIn">
            <AgentFlowDiagram
              lessonsCount={lessons.length}
              onSelectTab={(tab) => setActiveTab(tab)}
            />

            {/* Hackathon Executive Brief Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
                  01
                </div>
                <h3 className="text-sm font-bold text-white">Three Niche Insurance Brands</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tailored persona engines for <strong>Jade</strong> (Jewellers Block), <strong>Jaguar Transit</strong> (High-value specie air cargo), and <strong>DoctorShield</strong> (Medical malpractice indemnity).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-mono font-bold text-xs">
                  02
                </div>
                <h3 className="text-sm font-bold text-white">Closed-Loop Reinforcement Memory</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every human edit or rejection captures a tag + note, instantly updating the <strong>{lessons.length} active directives</strong> injected into future prompts so the AI never repeats a mistake.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-mono font-bold text-xs">
                  03
                </div>
                <h3 className="text-sm font-bold text-white">First-Class Compliance Gate</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Strict regulatory auditing against <strong>MAS SG Notice 124</strong>, BNM Code of Practice, and HKIA rules. Flags absolute guarantees and auto-remediates copy before human signoff.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Content Engine Studio */}
        {activeTab === "generator" && (
          <div className="space-y-6 animate-fadeIn">
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
          <div className="space-y-6 animate-fadeIn">
            <ComplianceGateHub
              assets={assets}
              onAssetUpdated={handleAssetUpdated}
            />
          </div>
        )}

        {/* Tab 3: Human Review & Closed-Loop Memory Queue */}
        {activeTab === "review" && (
          <div className="space-y-6 animate-fadeIn">
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
          <div className="space-y-6 animate-fadeIn">
            <VideoStudio
              assets={assets}
              selectedBrand={selectedBrand}
              onAssetCreated={handleAssetCreated}
            />
          </div>
        )}

        {/* Tab 5: Lead Intelligence & Personalized Outreach */}
        {activeTab === "leads" && (
          <div className="space-y-6 animate-fadeIn">
            <LeadGenHub
              leads={leads}
              selectedBrand={selectedBrand}
              onLeadUpdated={handleLeadUpdated}
            />
          </div>
        )}

        {/* Tab 6: Market Radar & Newsjack Triggers */}
        {activeTab === "competitors" && (
          <div className="space-y-6 animate-fadeIn">
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
          <div className="space-y-6 animate-fadeIn">
            <AutoPublishHands
              assets={assets}
              selectedBrand={selectedBrand}
              onAssetUpdated={handleAssetUpdated}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>JA ASSURE MULTI-AGENT MARKETING BRAIN & HANDS • HACKATHON EDITION</span>
          </div>
          <div>
            <span>Strict MAS Notice 124 / BNM Compliance • Closed-Loop Reinforcement Active</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
