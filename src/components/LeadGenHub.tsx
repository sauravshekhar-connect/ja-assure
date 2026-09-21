import React, { useState } from "react";
import { 
  Users, 
  Mail, 
  Send, 
  Copy, 
  Check, 
  Sparkles, 
  ExternalLink, 
  Target, 
  Building2, 
  MapPin, 
  AlertCircle,
  TrendingUp,
  CheckCircle2
} from "lucide-react";
import { LeadProspect, BrandId } from "../types";

interface LeadGenHubProps {
  leads: LeadProspect[];
  selectedBrand: BrandId | "all";
  onLeadUpdated: (updatedLead: LeadProspect) => void;
}

export const LeadGenHub: React.FC<LeadGenHubProps> = ({
  leads,
  selectedBrand,
  onLeadUpdated,
}) => {
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?.id || "");
  const [customAngle, setCustomAngle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedLinkedIn, setCopiedLinkedIn] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Filter leads
  const filteredLeads = leads.filter(
    (l) => selectedBrand === "all" || l.brand === selectedBrand
  );

  const selectedLead = leads.find((l) => l.id === selectedLeadId) || filteredLeads[0];

  const handleGenerateOutreach = async () => {
    if (!selectedLead) return;

    setIsGenerating(true);
    setNotification(null);

    try {
      const res = await fetch("/api/agent/lead-outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: selectedLead.id,
          customAngle,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate outreach");

      const data = await res.json();
      onLeadUpdated(data.lead);
      setNotification(`Drafted personalized outreach sequence for ${selectedLead.contactName}`);
      setTimeout(() => setNotification(null), 3000);
    } catch (e) {
      console.error(e);
      setNotification("Error generating outreach sequence.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMarkSent = async (leadId: string) => {
    try {
      const res = await fetch("/api/leads/mark-sent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId }),
      });
      const data = await res.json();
      onLeadUpdated(data.lead);
      setNotification("Outreach marked as sent.");
      setTimeout(() => setNotification(null), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopy = (text: string, type: "email" | "linkedin") => {
    navigator.clipboard.writeText(text);
    if (type === "email") {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedLinkedIn(true);
      setTimeout(() => setCopiedLinkedIn(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Lead Intelligence & Outreach Engine
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
                Parallel Agent 04
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Enrich public prospect registries (jewellers, clinics, couriers), score fit 0-100 & draft hyper-tailored outreach
            </p>
          </div>
        </div>

        {/* Lead Stats */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            Total Enriched: <strong>{leads.length}</strong>
          </span>
          <span className="px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-300">
            Avg Fit: <strong>93.2%</strong>
          </span>
        </div>
      </div>

      {notification && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Grid: Leads Directory on Left, Outreach Studio on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Prospect Directory Table */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              Qualified Prospects Directory ({filteredLeads.length})
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Public Registries</span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredLeads.map((lead) => {
              const isSelected = selectedLead?.id === lead.id;

              return (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLeadId(lead.id)}
                  className={`cursor-pointer p-3.5 rounded-xl border text-xs transition-all space-y-2 ${
                    isSelected
                      ? "bg-slate-800/80 border-blue-500 shadow-md ring-1 ring-blue-500/30"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-white text-sm leading-tight">
                        {lead.companyName}
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5">
                        {lead.contactName} • <span className="text-slate-400">{lead.role}</span>
                      </div>
                    </div>

                    {/* Fit Score Pill */}
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                        lead.fitScore >= 90
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      }`}>
                        {lead.fitScore} Fit
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {lead.city}, {lead.country}
                    </span>
                    <span>•</span>
                    <span className="text-slate-300 font-medium">
                      {lead.estimatedAssetExposure}
                    </span>
                  </div>

                  {/* Public Signal Reasons */}
                  <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1">
                    <div className="text-[10px] uppercase font-mono text-slate-500 font-semibold">
                      Identified Fit Signals:
                    </div>
                    {lead.scoreReasons.map((r, i) => (
                      <div key={i} className="text-[10px] text-slate-300 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                        <span className="truncate">{r}</span>
                      </div>
                    ))}
                  </div>

                  {/* Status footer */}
                  <div className="flex items-center justify-between text-[10px] pt-1">
                    <span className="text-slate-500">Source: {lead.publicSource}</span>
                    <span className={`font-mono uppercase font-bold ${
                      lead.status === "sent" ? "text-blue-400" : lead.status === "drafted" ? "text-emerald-400" : "text-amber-400"
                    }`}>
                      ● {lead.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Tailored Outreach Generator & Output */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          {selectedLead ? (
            <>
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[10px] font-bold font-mono uppercase rounded ${
                      selectedLead.brand === "jade" ? "bg-emerald-500/10 text-emerald-300" : selectedLead.brand === "jaguar" ? "bg-amber-500/10 text-amber-300" : "bg-cyan-500/10 text-cyan-300"
                    }`}>
                      {selectedLead.brand.toUpperCase()} TARGET
                    </span>
                    <span className="text-xs text-slate-400">
                      {selectedLead.city}, {selectedLead.country}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">
                    Outreach for {selectedLead.contactName} ({selectedLead.companyName})
                  </h3>
                </div>

                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={handleGenerateOutreach}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-950/50 flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGenerating ? "Drafting..." : "Generate Bespoke Pitch"}</span>
                </button>
              </div>

              {/* Optional Custom Angle Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Optional Angle Focus (e.g. upcoming regional exhibition, new clinic wing, or cargo theft alert):
                </label>
                <input
                  type="text"
                  value={customAngle}
                  onChange={(e) => setCustomAngle(e.target.value)}
                  placeholder="e.g. Reference their Bangkok Gem Fair exhibition consignment or expanding aesthetic surgery suites..."
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Outreach Output Display */}
              {selectedLead.personalizedEmail ? (
                <div className="space-y-4">
                  {/* Cold Email Container */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                        <Mail className="w-4 h-4" />
                        Hyper-Personalized Cold Email
                      </span>
                      <button
                        onClick={() => handleCopy(selectedLead.personalizedEmail || "", "email")}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors"
                      >
                        {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy Email</span>
                      </button>
                    </div>

                    <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto pr-1">
                      {selectedLead.personalizedEmail}
                    </div>
                  </div>

                  {/* LinkedIn InMail Container */}
                  {selectedLead.personalizedLinkedInMsg && (
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                          <Send className="w-3.5 h-3.5" />
                          LinkedIn InMail / DM (&lt;80 Words)
                        </span>
                        <button
                          onClick={() => handleCopy(selectedLead.personalizedLinkedInMsg || "", "linkedin")}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors"
                        >
                          {copiedLinkedIn ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>Copy InMail</span>
                        </button>
                      </div>

                      <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {selectedLead.personalizedLinkedInMsg}
                      </div>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Status: <strong className="text-slate-300 uppercase">{selectedLead.status}</strong>
                    </span>

                    {selectedLead.status !== "sent" && (
                      <button
                        onClick={() => handleMarkSent(selectedLead.id)}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Mark as Contacted / Sent</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-500">
                  <Mail className="w-8 h-8 text-slate-600 mb-2" />
                  <p className="text-xs max-w-xs">
                    Click "Generate Bespoke Pitch" above to have the AI Outreach agent craft a personalized sequence tailored to {selectedLead.companyName}'s risk exposure.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-500 text-xs">
              Select a prospect from the directory to review and generate outreach.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
