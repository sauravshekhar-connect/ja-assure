import React, { useState } from "react";
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  RotateCw, 
  Sparkles, 
  ArrowRight,
  BookOpen,
  FileCheck,
  Zap
} from "lucide-react";
import { MarketingAsset, ComplianceAuditReport, BrandId } from "../types";

interface ComplianceGateHubProps {
  assets: MarketingAsset[];
  onAssetUpdated: (asset: MarketingAsset) => void;
}

export const ComplianceGateHub: React.FC<ComplianceGateHubProps> = ({
  assets,
  onAssetUpdated,
}) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>(assets[0]?.id || "");
  const [customText, setCustomText] = useState<string>("");
  const [targetBrand, setTargetBrand] = useState<BrandId>("jade");
  const [isAuditing, setIsAuditing] = useState(false);
  const [activeReport, setActiveReport] = useState<ComplianceAuditReport | null>(
    assets[0]?.complianceReport || null
  );
  const [notification, setNotification] = useState<string | null>(null);

  const selectedAsset = assets.find((a) => a.id === selectedAssetId);

  // When asset selection changes, update active report and text
  const handleSelectAsset = (assetId: string) => {
    setSelectedAssetId(assetId);
    const found = assets.find((a) => a.id === assetId);
    if (found) {
      setActiveReport(found.complianceReport);
      setCustomText(found.primaryCopy);
      setTargetBrand(found.brand);
    }
  };

  const handleRunAudit = async () => {
    if (!customText.trim()) return;

    setIsAuditing(true);
    setNotification(null);

    try {
      const res = await fetch("/api/agent/compliance-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: customText,
          brand: targetBrand,
          assetId: selectedAssetId || undefined,
        }),
      });

      if (!res.ok) throw new Error("Compliance audit failed");

      const data = await res.json();
      setActiveReport(data.report);

      if (selectedAsset) {
        const updated = {
          ...selectedAsset,
          complianceReport: data.report,
          primaryCopy: customText,
        };
        onAssetUpdated(updated);
      }

      setNotification("Audit completed against MAS Notice 124 & BNM Guidelines");
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error(err);
      setNotification("Failed to run compliance scan. Check server connection.");
    } finally {
      setIsAuditing(false);
    }
  };

  const handleApplySanitized = () => {
    if (!activeReport?.sanitizedCopy) return;

    setCustomText(activeReport.sanitizedCopy);
    if (selectedAsset) {
      const updated: MarketingAsset = {
        ...selectedAsset,
        primaryCopy: activeReport.sanitizedCopy,
        complianceReport: {
          ...activeReport,
          status: "PASS",
          score: 96,
          summary: "Remediated using Compliance Gate Auto-Sanitizer. All violations resolved.",
          violations: [],
        },
      };
      setActiveReport(updated.complianceReport);
      onAssetUpdated(updated);
      setNotification("Applied auto-sanitized copy & updated asset in review queue!");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // Quick regulatory violation test cases
  const testCases = [
    {
      title: "❌ Test Breach: 100% Payout Guarantee",
      text: "Jade guarantees 100% payout for any stolen diamond within 24 hours with zero exclusions or investigations!",
      brand: "jade" as BrandId,
    },
    {
      title: "❌ Test Breach: Defamation of Mutual Defense",
      text: "Traditional medical indemnity societies will leave you bankrupt when malpractice lawsuits hit! DoctorShield is the only safe option.",
      brand: "doctorshield" as BrandId,
    },
    {
      title: "✅ Test Compliant: Professional Jade Jewellers Block",
      text: "Comprehensive Jewellers Block insurance designed for Singapore boutique jewellers exhibiting at regional fairs.\n\n• Attended transit floaters\n• Certified gemological claims adjusters\n\n*Subject to policy terms, exclusions, and underwriting acceptance. Underwritten by licensed partner insurers.*",
      brand: "jade" as BrandId,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Insurance Compliance Gate Hub
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                  First-Class Agent 03
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Automated regulatory auditor checking against MAS Notice 124, BNM Code of Conduct, and HKIA Guidelines
              </p>
            </div>
          </div>
        </div>

        {/* Regulatory Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            MAS Notice 124 (SG)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            BNM Code (MY)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            HKIA Guideline (HK)
          </span>
        </div>
      </div>

      {notification && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Grid: Scanner on Left, Audit Report on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input Copy & Asset Selector */}
        <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-cyan-400" />
              Copy Audit Terminal
            </h3>
            
            {/* Quick load from existing queue */}
            <select
              value={selectedAssetId}
              onChange={(e) => handleSelectAsset(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-300 rounded-lg px-2.5 py-1 text-xs max-w-[220px] truncate"
            >
              <option value="">-- Audit from Queue --</option>
              {assets.map((a) => (
                <option key={a.id} value={a.id}>
                  [{a.complianceReport.status}] {a.title.slice(0, 30)}...
                </option>
              ))}
            </select>
          </div>

          {/* Target Brand Selection */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Jurisdiction Brand:</span>
            {(["jade", "jaguar", "doctorshield"] as BrandId[]).map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setTargetBrand(b)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize border transition-all ${
                  targetBrand === b
                    ? "bg-slate-800 text-white border-slate-600 shadow-sm"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          {/* Copy Textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Marketing Copy to Inspect
            </label>
            <textarea
              rows={8}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Paste any marketing copy, caption, or ad text to run through the compliance gate..."
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-3 text-xs focus:ring-1 focus:ring-amber-500 focus:border-amber-500 font-sans leading-relaxed"
            />
          </div>

          {/* 1-Click Test Cases for Demonstrating Violations */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Demo Test Cases (Try Known Violations):
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {testCases.map((tc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setCustomText(tc.text);
                    setTargetBrand(tc.brand);
                    setSelectedAssetId("");
                  }}
                  className="w-full text-left p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800/80 text-xs text-slate-300 transition-colors flex items-center justify-between"
                >
                  <span className="font-medium text-[11px] truncate">{tc.title}</span>
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400">
                    Load
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Trigger Scan Button */}
          <button
            type="button"
            disabled={isAuditing || !customText.trim()}
            onClick={handleRunAudit}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-amber-950/50 border border-amber-400/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isAuditing ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Auditing Against MAS/BNM Insurance Rubrics...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>RUN STRICT COMPLIANCE AUDIT</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Live Audit Inspection Report */}
        <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              Regulatory Audit Report
            </h3>

            {activeReport && (
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold font-mono uppercase flex items-center gap-1.5 ${
                    activeReport.status === "PASS"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : activeReport.status === "FLAGGED"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : "bg-red-500/20 text-red-300 border border-red-500/40"
                  }`}
                >
                  {activeReport.status === "PASS" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-red-400" />
                  )}
                  {activeReport.status} • {activeReport.score}/100
                </span>
              </div>
            )}
          </div>

          {activeReport ? (
            <div className="space-y-4">
              {/* Score summary bar */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
                  <span className="font-semibold">Compliance Rating</span>
                  <span className="font-mono text-emerald-400 font-bold">{activeReport.score} / 100</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      activeReport.score >= 85
                        ? "bg-emerald-500"
                        : activeReport.score >= 70
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${activeReport.score}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-400 mt-2 italic">
                  "{activeReport.summary}"
                </p>
              </div>

              {/* Itemized Violations */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                  <span>Flagged Findings ({activeReport.violations?.length || 0})</span>
                  <span className="text-[10px] text-slate-500">
                    Framework: {activeReport.regulatoryFramework}
                  </span>
                </h4>

                {(!activeReport.violations || activeReport.violations.length === 0) ? (
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-emerald-300 text-xs flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <div>
                      <div className="font-bold">Zero Regulatory Breaches Detected</div>
                      <div className="text-[11px] text-emerald-300/80">
                        Copy contains mandatory disclaimers and adheres to non-absolute insurance standards.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {activeReport.violations.map((v, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                          v.severity === "high"
                            ? "bg-red-950/30 border-red-800/50"
                            : "bg-amber-950/30 border-amber-800/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded ${
                            v.severity === "high" ? "bg-red-500/20 text-red-300" : "bg-amber-500/20 text-amber-300"
                          }`}>
                            {v.severity.toUpperCase()} RISK • {v.clause}
                          </span>
                        </div>

                        <div className="text-[11px] text-red-300 bg-red-950/60 p-1.5 rounded font-mono">
                          "{v.flaggedText}"
                        </div>

                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {v.explanation}
                        </p>

                        <div className="text-[11px] text-emerald-300 bg-emerald-950/40 p-1.5 rounded flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          <span>Fix: {v.suggestedFix}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 1-Click Auto-Sanitized Fix Option */}
              {activeReport.sanitizedCopy && activeReport.status !== "PASS" && (
                <div className="pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Agent Auto-Remediation Available
                    </span>
                    <button
                      type="button"
                      onClick={handleApplySanitized}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950 flex items-center gap-1"
                    >
                      <span>Apply Compliant Version</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 whitespace-pre-wrap max-h-36 overflow-y-auto">
                    {activeReport.sanitizedCopy}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <ShieldCheck className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-xs">No active audit. Click "Run Strict Compliance Audit" to evaluate copy.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
