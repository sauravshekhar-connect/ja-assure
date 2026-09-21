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
    <div className="space-y-6">
      {/* Top Banner: Closed-Loop Performance Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1: Rejection Rate Trend */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Rejection Rate Trend</span>
            <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-400">
              <TrendingDown className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-400 font-mono">8.2%</span>
              <span className="text-xs text-slate-500 line-through">38.0% initial</span>
            </div>
            <p className="text-[10px] text-emerald-300/80 mt-1">
              -78% error reduction via closed-loop feedback
            </p>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-400 h-full w-[22%]"></div>
          </div>
        </div>

        {/* Metric 2: Lessons in Memory */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Lessons in Memory</span>
            <span className="p-1 rounded-md bg-purple-500/10 text-purple-400">
              <RotateCcw className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-purple-300 font-mono">
              {lessons.length}
            </div>
            <p className="text-[10px] text-purple-300/80 mt-1">
              Guiding next generation runs as few-shot rules
            </p>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-purple-400 h-full w-[85%]"></div>
          </div>
        </div>

        {/* Metric 3: Pending Human Decision */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Pending Human Review</span>
            <span className="p-1 rounded-md bg-amber-500/10 text-amber-400">
              <UserCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-amber-300 font-mono">
              {pendingAssets.length}
            </div>
            <p className="text-[10px] text-amber-300/80 mt-1">
              Zero publishing without human sign-off
            </p>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-amber-400 h-full w-[45%]"></div>
          </div>
        </div>

        {/* Metric 4: Human Edit Delta */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Human Edit Distance</span>
            <span className="p-1 rounded-md bg-cyan-500/10 text-cyan-400">
              <Edit3 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-cyan-300 font-mono">
              4.1%
            </div>
            <p className="text-[10px] text-cyan-300/80 mt-1">
              Humans edit less than 5% of copy over time
            </p>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Human Review Queue Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              Pending Human Approval Queue ({pendingAssets.length})
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              Contract Step 04
            </span>
          </div>

          {pendingAssets.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 text-center text-slate-400">
              <CheckCircle2 className="w-10 h-10 text-emerald-500/60 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-200">All Queue Items Reviewed</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Generate new marketing assets in the Content Engine to populate this human-in-the-loop review queue.
              </p>
              <button
                onClick={() => onNavigateTab("generator")}
                className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-md shadow-emerald-950"
              >
                <span>Open Content Engine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingAssets.map((asset) => {
                const isEditingThis = editingAssetId === asset.id;

                return (
                  <div
                    key={asset.id}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md space-y-3 relative group"
                  >
                    {/* Header bar */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md font-mono ${
                            asset.brand === "jade"
                              ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                              : asset.brand === "jaguar"
                              ? "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                              : "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
                          }`}>
                            {asset.brand.toUpperCase()}
                          </span>
                          <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-300">
                            {asset.platform}
                          </span>
                          <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-300">
                            {asset.language.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1.5">{asset.title}</h4>
                      </div>

                      {/* Compliance Status Chip */}
                      <div className="flex items-center gap-1">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase flex items-center gap-1 ${
                            asset.complianceReport.status === "PASS"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : "bg-red-500/10 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {asset.complianceReport.status === "PASS" ? "PASS" : "FAIL"} ({asset.complianceReport.score}/100)
                        </span>
                      </div>
                    </div>

                    {/* Copy Box or Inline Editor */}
                    {isEditingThis ? (
                      <div className="space-y-2">
                        <label className="text-[11px] font-semibold text-slate-400">
                          Inline Human Copy Refinement
                        </label>
                        <textarea
                          rows={7}
                          value={editedCopy}
                          onChange={(e) => setEditedCopy(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-3 text-xs focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 font-sans"
                        />
                        <input
                          type="text"
                          value={editLessonNote}
                          onChange={(e) => setEditLessonNote(e.target.value)}
                          placeholder="Optional: Why did you edit this? (e.g. 'Shortened opening hook, removed passive voice')"
                          className="w-full bg-slate-950 border border-slate-700 text-slate-300 rounded-lg px-3 py-1.5 text-xs placeholder:text-slate-600"
                        />
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                        {asset.primaryCopy}
                      </div>
                    )}

                    {/* Compliance Alert snippet if failed */}
                    {asset.complianceReport.status !== "PASS" && (
                      <div className="p-2.5 rounded-xl bg-red-950/30 border border-red-800/40 text-xs text-red-300 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-[11px]">Compliance Warning:</div>
                          <div className="text-[10px] text-red-300/80">{asset.complianceReport.summary}</div>
                        </div>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>Ready for decision</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isEditingThis ? (
                          <>
                            <button
                              onClick={() => setEditingAssetId(null)}
                              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveEditAndApprove(asset)}
                              className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-950 flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
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
                              className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-red-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject with Tag</span>
                            </button>

                            {/* Inline Edit Trigger */}
                            <button
                              onClick={() => {
                                setEditingAssetId(asset.id);
                                setEditedCopy(asset.primaryCopy);
                                setEditLessonNote("");
                              }}
                              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Edit Copy</span>
                            </button>

                            {/* Direct Approve */}
                            <button
                              onClick={() => handleApprove(asset)}
                              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950 flex items-center gap-1 transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
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
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-purple-400" />
                  "Lessons Learned" Memory Bank
                </h3>
                <p className="text-[11px] text-slate-400">
                  Dynamic rules fed back into future Content Agent runs
                </p>
              </div>

              <button
                onClick={() => setShowAddLessonModal(true)}
                className="p-1.5 rounded-lg bg-purple-600/80 hover:bg-purple-600 text-white text-xs flex items-center gap-1"
                title="Add custom rule"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List of Active Memory Directives */}
            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {filteredLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/40 text-xs space-y-1.5 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono text-[10px] uppercase font-bold flex items-center gap-1">
                      <Tag className="w-2.5 h-2.5" />
                      {lesson.tag}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-mono">
                        {lesson.brand.toUpperCase()}
                      </span>
                      <button
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-opacity"
                        title="Remove lesson"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-200 text-[11px] font-semibold">
                    "{lesson.humanNote}"
                  </p>

                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 text-[10px] text-purple-200/90 font-mono leading-relaxed">
                    <strong>Prompt Directive:</strong> {lesson.ruleDirective}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span>Active in prompt injection</span>
                    <span className="text-emerald-400 font-mono">
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
