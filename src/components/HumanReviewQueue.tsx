import React, { useState } from "react";
import { 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  RotateCcw, 
  TrendingDown, 
  ShieldAlert, 
  Tag, 
  Plus, 
  Trash2, 
  Sparkles,
  ArrowRight,
  Clock,
  Check,
  AlertCircle
} from "lucide-react";
import { MarketingAsset, LessonLearned, BrandId } from "../types";

interface HumanReviewQueueProps {
  assets: MarketingAsset[];
  lessons: LessonLearned[];
  selectedBrand: BrandId | "all";
  onAssetReviewed: (updatedAsset: MarketingAsset) => void;
  onLessonAdded: (lesson: LessonLearned) => void;
  onLessonDeleted: (lessonId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const HumanReviewQueue: React.FC<HumanReviewQueueProps> = ({
  assets,
  lessons,
  selectedBrand,
  onAssetReviewed,
  onLessonAdded,
  onLessonDeleted,
  onNavigateTab,
}) => {
  // Modal / Editing states
  const [rejectingAssetId, setRejectingAssetId] = useState<string | null>(null);
  const [rejectionTag, setRejectionTag] = useState<string>("off-brand tone");
  const [rejectionNote, setRejectionNote] = useState<string>("");

  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
  const [editedCopy, setEditedCopy] = useState<string>("");
  const [editLessonNote, setEditLessonNote] = useState<string>("");

  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [newLessonTag, setNewLessonTag] = useState("brand tone");
  const [newLessonBrand, setNewLessonBrand] = useState<BrandId | "all">("all");
  const [newLessonNote, setNewLessonNote] = useState("");
  const [newLessonDirective, setNewLessonDirective] = useState("");

  const [notification, setNotification] = useState<string | null>(null);

  // Filter assets pending review
  const pendingAssets = assets.filter(
    (a) => a.status === "pending_review" && (selectedBrand === "all" || a.brand === selectedBrand)
  );

  // Filter lessons
  const filteredLessons = lessons.filter(
    (l) => selectedBrand === "all" || l.brand === "all" || l.brand === selectedBrand
  );

  const predefinedTags = [
    "too salesy",
    "inaccurate claim",
    "off-brand tone",
    "wrong CTA",
    "absolute guarantee",
    "missing disclaimer",
    "unverified comparison",
  ];

  // Handle Approve
  const handleApprove = async (asset: MarketingAsset) => {
    try {
      const res = await fetch("/api/queue/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: asset.id,
          action: "approve",
        }),
      });
      const data = await res.json();
      onAssetReviewed(data.asset);
      setNotification(`Approved "${asset.title}". Moved to Project 2 (The Hands) Queue.`);
      setTimeout(() => setNotification(null), 3500);
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Edit & Approve
  const handleSaveEditAndApprove = async (asset: MarketingAsset) => {
    try {
      const res = await fetch("/api/queue/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: asset.id,
          action: "approve",
          updatedCopy: editedCopy,
          reasonTag: "human edit refinement",
          humanNote: editLessonNote || "Copy refined by human review editor",
        }),
      });
      const data = await res.json();
      onAssetReviewed(data.asset);
      setEditingAssetId(null);
      setNotification(`Edited & approved "${asset.title}". Lesson logged to memory bank!`);
      setTimeout(() => setNotification(null), 3500);
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Reject
  const handleConfirmReject = async () => {
    if (!rejectingAssetId) return;

    try {
      const res = await fetch("/api/queue/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: rejectingAssetId,
          action: "reject",
          reasonTag: rejectionTag,
          humanNote: rejectionNote,
        }),
      });
      const data = await res.json();
      onAssetReviewed(data.asset);
      setRejectingAssetId(null);
      setRejectionNote("");
      setNotification(
        `Asset rejected with tag [${rejectionTag}]. Automatically stored into Closed-Loop Memory!`
      );
      setTimeout(() => setNotification(null), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Manual Lesson Add
  const handleAddCustomLesson = async () => {
    if (!newLessonNote.trim()) return;

    try {
      const res = await fetch("/api/lessons/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: newLessonBrand,
          tag: newLessonTag,
          humanNote: newLessonNote,
          ruleDirective: newLessonDirective || newLessonNote,
        }),
      });
      const data = await res.json();
      onLessonAdded(data.lesson);
      setShowAddLessonModal(false);
      setNewLessonNote("");
      setNewLessonDirective("");
      setNotification("Custom lesson directive injected into agent memory bank!");
      setTimeout(() => setNotification(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteLesson = async (id: string) => {
    try {
      await fetch(`/api/lessons/${id}`, { method: "DELETE" });
      onLessonDeleted(id);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-10">
      {/* Top Banner: Closed-Loop Performance Statistics (Spacious Digilink Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1: Rejection Rate Trend */}
        <div className="hitech-card rounded-3xl p-7 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="uppercase tracking-wider">Rejection Rate Trend</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-emerald-400 font-tech">8.2%</span>
              <span className="text-xs text-slate-500 line-through font-mono">38.0% initial</span>
            </div>
            <p className="text-xs text-emerald-300/80 mt-2 leading-relaxed">
              -78% error reduction via closed-loop feedback
            </p>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
            <div className="bg-emerald-400 h-full w-[22%]"></div>
          </div>
        </div>

        {/* Metric 2: Lessons in Memory */}
        <div className="hitech-card rounded-3xl p-7 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="uppercase tracking-wider">Lessons in Memory</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <RotateCcw className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-purple-300 font-tech">
              {lessons.length}
            </div>
            <p className="text-xs text-purple-300/80 mt-2 leading-relaxed">
              Guiding next generation runs as few-shot rules
            </p>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
            <div className="bg-purple-400 h-full w-[85%]"></div>
          </div>
        </div>

        {/* Metric 3: Pending Human Decision */}
        <div className="hitech-card rounded-3xl p-7 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="uppercase tracking-wider">Pending Review</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-amber-300 font-tech">
              {pendingAssets.length}
            </div>
            <p className="text-xs text-amber-300/80 mt-2 leading-relaxed">
              Zero publishing without human sign-off
            </p>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
            <div className="bg-amber-400 h-full w-[45%]"></div>
          </div>
        </div>

        {/* Metric 4: Human Edit Delta */}
        <div className="hitech-card rounded-3xl p-7 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="uppercase tracking-wider">Human Edit Distance</span>
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Edit3 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-cyan-300 font-tech">
              4.1%
            </div>
            <p className="text-xs text-cyan-300/80 mt-2 leading-relaxed">
              Humans edit less than 5% of copy over time
            </p>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
            <div className="bg-cyan-400 h-full w-[15%]"></div>
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Content Layout: Pending Assets on Left, Memory Bank on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Human Review Queue Cards */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-base font-bold text-white flex items-center gap-3 font-display">
              <UserCheck className="w-5 h-5 text-amber-400" />
              Pending Human Approval Queue ({pendingAssets.length})
            </h3>
            <span className="text-xs font-mono text-amber-400/80 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
              Contract Step 04
            </span>
          </div>

          {pendingAssets.length === 0 ? (
            <div className="p-12 rounded-3xl hitech-card text-center text-slate-400 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white font-display">All Queue Items Reviewed</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Generate new marketing assets in the Content Engine to populate this autonomous human-in-the-loop review queue.
              </p>
              <button
                onClick={() => onNavigateTab("generator")}
                className="mt-4 px-6 py-3 rounded-2xl btn-gold text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Open Content Engine</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingAssets.map((asset) => {
                const isEditingThis = editingAssetId === asset.id;

                return (
                  <div
                    key={asset.id}
                    className="p-7 rounded-3xl hitech-card space-y-5 relative group"
                  >
                    {/* Header bar */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className={`px-3 py-1 text-[11px] font-bold uppercase rounded-lg font-mono tracking-wider ${
                            asset.brand === "jade"
                              ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                              : asset.brand === "jaguar"
                              ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                              : "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                          }`}>
                            {asset.brand.toUpperCase()}
                          </span>
                          <span className="px-3 py-1 text-[11px] font-mono rounded-lg bg-slate-900 text-slate-300 border border-white/10">
                            {asset.platform}
                          </span>
                          <span className="px-3 py-1 text-[11px] font-mono rounded-lg bg-slate-900 text-slate-300 border border-white/10">
                            {asset.language.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white mt-3 font-display">{asset.title}</h4>
                      </div>

                      {/* Compliance Status Chip */}
                      <div className="flex items-center gap-1">
                        <span
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase flex items-center gap-1.5 ${
                            asset.complianceReport.status === "PASS"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/40"
                              : "bg-red-500/15 text-red-400 border border-red-500/40"
                          }`}
                        >
                          {asset.complianceReport.status === "PASS" ? "PASS" : "FAIL"} ({asset.complianceReport.score}/100)
                        </span>
                      </div>
                    </div>

                    {/* Copy Box or Inline Editor */}
                    {isEditingThis ? (
                      <div className="space-y-3">
                        <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
                          Inline Human Copy Refinement
                        </label>
                        <textarea
                          rows={7}
                          value={editedCopy}
                          onChange={(e) => setEditedCopy(e.target.value)}
                          className="w-full bg-slate-950/90 border border-amber-400/30 text-slate-200 rounded-2xl p-4 text-xs focus:ring-1 focus:ring-amber-400 focus:border-amber-400 font-sans"
                        />
                        <input
                          type="text"
                          value={editLessonNote}
                          onChange={(e) => setEditLessonNote(e.target.value)}
                          placeholder="Optional: Why did you edit this? (e.g. 'Shortened opening hook, removed passive voice')"
                          className="w-full bg-slate-950/90 border border-white/10 text-slate-300 rounded-xl px-4 py-2.5 text-xs placeholder:text-slate-600"
                        />
                      </div>
                    ) : (
                      <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto font-sans">
                        {asset.primaryCopy}
                      </div>
                    )}

                    {/* Compliance Alert snippet if failed */}
                    {asset.complianceReport.status !== "PASS" && (
                      <div className="p-4 rounded-2xl bg-red-950/30 border border-red-800/40 text-xs text-red-300 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-xs">Compliance Warning:</div>
                          <div className="text-xs text-red-300/80 mt-0.5">{asset.complianceReport.summary}</div>
                        </div>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 font-mono">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Ready for decision</span>
                      </div>

                      <div className="flex items-center gap-3">
                        {isEditingThis ? (
                          <>
                            <button
                              onClick={() => setEditingAssetId(null)}
                              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveEditAndApprove(asset)}
                              className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-lg shadow-amber-400/20 flex items-center gap-1.5 cursor-pointer"
                            >
                              <Check className="w-4 h-4" />
                              <span>Save & Approve</span>
                            </button>
                          </>
                        ) : (
                          <>
                            {/* Reject Trigger */}
                            <button
                              onClick={() => {
                                setRejectingAssetId(asset.id);
                                setRejectionNote("");
                              }}
                              className="px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>Reject with Tag</span>
                            </button>

                            {/* Inline Edit Trigger */}
                            <button
                              onClick={() => {
                                setEditingAssetId(asset.id);
                                setEditedCopy(asset.primaryCopy);
                                setEditLessonNote("");
                              }}
                              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
                            >
                              <Edit3 className="w-4 h-4 text-amber-400" />
                              <span>Edit Copy</span>
                            </button>

                            {/* Direct Approve */}
                            <button
                              onClick={() => handleApprove(asset)}
                              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Approve</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Closed-Loop "Lessons Learned" Memory Bank */}
        <div className="lg:col-span-5 space-y-6">
          <div className="hitech-card rounded-3xl p-7 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2.5 font-display">
                  <RotateCcw className="w-4 h-4 text-purple-400" />
                  "Lessons Learned" Memory Bank
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Dynamic rules fed back into future Content Agent runs
                </p>
              </div>

              <button
                onClick={() => setShowAddLessonModal(true)}
                className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-600/20"
                title="Add custom rule"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* List of Active Memory Directives */}
            <div className="space-y-4 max-h-[620px] overflow-y-auto pr-1">
              {filteredLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 hover:border-purple-500/50 text-xs space-y-3 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30 font-mono text-[10px] uppercase font-bold flex items-center gap-1.5">
                      <Tag className="w-3 h-3" />
                      {lesson.tag}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {lesson.brand.toUpperCase()}
                      </span>
                      <button
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-red-400 transition-opacity cursor-pointer"
                        title="Remove lesson"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-100 text-xs font-semibold leading-relaxed">
                    "{lesson.humanNote}"
                  </p>

                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-white/5 text-xs text-purple-200/90 font-mono leading-relaxed">
                    <strong className="text-purple-300">Prompt Directive:</strong> {lesson.ruleDirective}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
                    <span>Active in prompt injection</span>
                    <span className="text-emerald-400">
                      ✓ Prevented {lesson.preventedErrorsCount} repeat errors
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Reject Modal with Tag + Human Note (Requirement 8) */}
      {rejectingAssetId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center gap-2.5 text-red-400">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">
                Reject Asset & Record "Lessons Learned"
              </h3>
            </div>

            <p className="text-xs text-slate-400">
              Every rejection trains the Content Agent. Select why this asset failed and leave a note so it won't repeat the mistake.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Reason Tag (Standard Taxonomy)
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {predefinedTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setRejectionTag(tag)}
                    className={`py-1 px-2.5 rounded-lg text-xs font-mono font-medium border text-left capitalize transition-all ${
                      rejectionTag === tag
                        ? "bg-red-950 border-red-500 text-red-200 ring-1 ring-red-500/40"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Human Reviewer Note (Specific Correction)
              </label>
              <textarea
                rows={3}
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                placeholder="e.g. Tone too salesy for Jade luxury jewellers; replace discount phrasing with vault security advisory..."
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setRejectingAssetId(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-950"
              >
                Reject & Save to Memory Bank
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Lesson Modal */}
      {showAddLessonModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center gap-2 text-purple-400">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-sm font-bold text-white">
                Add Brand Guideline / Memory Rule
              </h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Brand
              </label>
              <select
                value={newLessonBrand}
                onChange={(e) => setNewLessonBrand(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-xs"
              >
                <option value="all">All Brands</option>
                <option value="jade">Jade Jewellers Block</option>
                <option value="jaguar">Jaguar Transit</option>
                <option value="doctorshield">DoctorShield</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Rule Tag
              </label>
              <input
                type="text"
                value={newLessonTag}
                onChange={(e) => setNewLessonTag(e.target.value)}
                placeholder="e.g. brand tone, MAS compliance, CTA"
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Human Guideline
              </label>
              <textarea
                rows={2}
                value={newLessonNote}
                onChange={(e) => setNewLessonNote(e.target.value)}
                placeholder="e.g. Jade must never use words like 'cheap' or 'massive discount'."
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Prompt Instruction for Agent
              </label>
              <textarea
                rows={2}
                value={newLessonDirective}
                onChange={(e) => setNewLessonDirective(e.target.value)}
                placeholder="DO NOT use discount words. Emphasize institutional security covenants."
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-2 text-xs font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddLessonModal(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCustomLesson}
                className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
              >
                Save Directive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
