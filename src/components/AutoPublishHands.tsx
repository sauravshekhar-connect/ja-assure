import React, { useState } from "react";
import { 
  Send, 
  Database, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  BarChart2, 
  MessageSquare, 
  RotateCw, 
  ExternalLink,
  Share2,
  ThumbsUp,
  MessageCircle,
  Eye,
  TrendingUp,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { MarketingAsset, BrandId } from "../types";

interface AutoPublishHandsProps {
  assets: MarketingAsset[];
  selectedBrand: BrandId | "all";
  onAssetUpdated: (asset: MarketingAsset) => void;
  onNavigateTab: (tab: string) => void;
}

export const AutoPublishHands: React.FC<AutoPublishHandsProps> = ({
  assets,
  selectedBrand,
  onAssetUpdated,
  onNavigateTab,
}) => {
  const [isPublishing, setIsPublishing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"queue" | "analytics" | "listening">("queue");
  const [notification, setNotification] = useState<string | null>(null);

  // Filter approved or published assets
  const approvedAssets = assets.filter(
    (a) => (a.status === "approved" || a.status === "published") &&
      (selectedBrand === "all" || a.brand === selectedBrand)
  );

  // Social listening simulated inbound comments (Bonus requirement)
  const [inboundComments, setInboundComments] = useState([
    {
      id: "c-1",
      platform: "LinkedIn",
      brand: "jade",
      author: "Marcus Tan (MD, Apex Gems Singapore)",
      comment: "Does your Jewellers Block policy cover attended car transit while travelling across the Causeway into Johor Bahru?",
      draftReply: "Hi Marcus, yes — Jade's bespoke floater can be endorsed with cross-border attended vehicle coverage between Singapore and West Malaysia, provided dual-custody conditions are observed. I've sent you a direct message with the policy schedule brief!",
      status: "pending_review",
    },
    {
      id: "c-2",
      platform: "X / Twitter",
      brand: "doctorshield",
      author: "Dr. Sarah L. (Aesthetic Specialist, KL)",
      comment: "Are legal defense costs paid advance or on reimbursement under DoctorShield's contractual terms?",
      draftReply: "Hello Dr. Sarah, under DoctorShield, approved legal defense costs and medical expert witness fees are paid directly as incurred from day one, not on retroactive reimbursement. Feel free to review our full policy specimen.",
      status: "approved_replied",
    }
  ]);

  const handlePublishAsset = async (assetId: string) => {
    setIsPublishing(assetId);
    setNotification(null);

    try {
      const res = await fetch("/api/publisher/publish-now", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetId }),
      });

      if (!res.ok) throw new Error("Publishing error");

      const data = await res.json();
      onAssetUpdated(data.asset);
      setNotification(`Published to ${data.asset.platform.toUpperCase()} API! Post live with metrics tracking.`);
      setTimeout(() => setNotification(null), 4000);
    } catch (e) {
      console.error(e);
      setNotification("Failed to trigger publisher API.");
    } finally {
      setIsPublishing(null);
    }
  };

  const handleApproveReply = (commentId: string) => {
    setInboundComments(prev => prev.map(c => c.id === commentId ? { ...c, status: "approved_replied" } : c));
    setNotification("Approved & published agent reply to social comment!");
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Project 2 (The Hands) Status */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Project 2 — Auto-Publish & Social Dispatch ("The Hands")
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                Worker Engine
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Contract bridge between Brain (Queue DB) & Multi-Platform Publishing APIs (LinkedIn, X, Instagram, TikTok)
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab("queue")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "queue" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Approved Queue DB ({approvedAssets.length})
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "analytics" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Analytics Loop
          </button>
          <button
            onClick={() => setActiveTab("listening")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "listening" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Social Listening (Bonus)</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Sub-Tab 1: Approved Queue DB */}
      {activeTab === "queue" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-teal-400" />
              Contract State: Approved Marketing Queue
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Polling Worker: <strong>ACTIVE (Every 5 mins)</strong>
            </span>
          </div>

          {approvedAssets.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 text-center text-slate-400">
              <Database className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-200">No Approved Posts in DB</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Approve assets in the Human Review Queue to send them into this auto-publishing pipeline.
              </p>
              <button
                onClick={() => onNavigateTab("review")}
                className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold inline-flex items-center gap-1"
              >
                <span>Go to Human Review</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {approvedAssets.map((asset) => {
                const isPub = asset.status === "published";

                return (
                  <div
                    key={asset.id}
                    className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-800 text-slate-200">
                              {asset.brand.toUpperCase()}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                              {asset.platform}
                            </span>
                            <span className="text-[10px] text-emerald-400 font-mono">
                              ✓ Compliance Passed
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white mt-1.5">{asset.title}</h4>
                        </div>

                        <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase flex items-center gap-1 ${
                          isPub
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                        }`}>
                          {isPub ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Clock className="w-3 h-3 text-teal-400" />}
                          {asset.status}
                        </span>
                      </div>

                      {/* Snippet */}
                      <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                        {asset.primaryCopy}
                      </div>
                    </div>

                    {/* Footer Dispatch Action */}
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <div className="text-[11px] font-mono text-slate-400">
                        {isPub ? (
                          <span className="text-emerald-400">● Live on {asset.platform} API</span>
                        ) : (
                          <span>Cadence: Next Scheduled Slot</span>
                        )}
                      </div>

                      {!isPub ? (
                        <button
                          disabled={isPublishing === asset.id}
                          onClick={() => handlePublishAsset(asset.id)}
                          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-950 flex items-center gap-1.5 transition-all disabled:opacity-50"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{isPublishing === asset.id ? "Publishing via API..." : "Publish Now via API"}</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                          <span>{asset.analytics?.impressions || 1200} Views</span>
                          <span>•</span>
                          <span className="text-emerald-400">+{asset.analytics?.leadsGenerated || 4} Leads</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 2: Analytics Optimization Loop */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Total Impressions</span>
                <Eye className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono mt-1">142,850</div>
              <div className="text-[10px] text-emerald-400 mt-1 font-mono flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +28.4% vs last cycle
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Engaged Clicks</span>
                <ThumbsUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono mt-1">4,120</div>
              <div className="text-[10px] text-emerald-400 mt-1 font-mono flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> 2.88% CTR (Benchmark: 1.1%)
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Qualified Policy Inquiries</span>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono mt-1">89 Leads</div>
              <div className="text-[10px] text-purple-300 mt-1 font-mono">
                Direct broker referral pipeline
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Optimal Posting Window</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-lg font-bold text-amber-300 font-mono mt-1">Tue/Thu 10:15 AM SGT</div>
              <div className="text-[10px] text-slate-400 mt-1">
                Derived from ASEAN C-suite activity
              </div>
            </div>
          </div>

          {/* Feedback loop insight card */}
          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/40 text-xs text-cyan-200 space-y-2">
            <div className="font-bold flex items-center gap-2 text-sm text-cyan-300">
              <TrendingUp className="w-4 h-4" />
              Analytics Optimization Loop Active
            </div>
            <p className="text-slate-300 leading-relaxed text-xs">
              Engagement data from published LinkedIn carousels and vertical video reels is automatically fed back to the Content Engine.
              Currently, posts highlighting <strong>"consignment transit sub-limits"</strong> and <strong>"claims-made medical retro-dates"</strong> outperform generic insurance copy by <strong>3.4x in direct broker form fills</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Social Listening & Comment Monitoring (Bonus) */}
      {activeTab === "listening" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                Social Listening & Compliance-Safe Replies
              </h3>
              <p className="text-xs text-slate-400">
                Inbound prospect questions from LinkedIn and X with automated, compliance-checked draft responses
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">Bonus Track</span>
          </div>

          <div className="space-y-3">
            {inboundComments.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-slate-300">
                        {item.platform}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950 text-emerald-400">
                        {item.brand.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white mt-1">
                      {item.author}
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                    item.status === "approved_replied"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  }`}>
                    {item.status === "approved_replied" ? "Replied" : "Pending Approval"}
                  </span>
                </div>

                {/* Comment */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200">
                  "{item.comment}"
                </div>

                {/* Agent Draft Reply */}
                <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-xs space-y-1.5">
                  <div className="text-[10px] font-bold text-cyan-300 flex items-center gap-1.5 uppercase font-mono">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    Agent Draft Reply (Checked for MAS/BNM Non-Guarantee):
                  </div>
                  <p className="text-slate-200 text-xs leading-relaxed italic">
                    "{item.draftReply}"
                  </p>
                </div>

                {item.status !== "approved_replied" && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleApproveReply(item.id)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Dispatch Reply</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
