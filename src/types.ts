export type BrandId = 'jade' | 'jaguar' | 'doctorshield';

export interface BrandInfo {
  id: BrandId;
  name: string;
  tagline: string;
  niche: string;
  accentColor: string;
  voiceDescription: string;
  primaryMarkets: string[];
  keyRiskThemes: string[];
}

export type PlatformId = 'linkedin' | 'instagram' | 'x' | 'blog' | 'tiktok';

export type LanguageCode = 'en' | 'ms' | 'id' | 'th' | 'zh';

export interface ComplianceViolation {
  clause: string;
  severity: 'high' | 'medium' | 'low';
  flaggedText: string;
  explanation: string;
  suggestedFix: string;
}

export interface ComplianceAuditReport {
  status: 'PASS' | 'FAIL' | 'FLAGGED';
  score: number; // 0-100
  regulatoryFramework: string; // e.g. MAS SG Notice 124 / BNM / HKIA
  summary: string;
  violations: ComplianceViolation[];
  sanitizedCopy?: string;
  auditedAt: string;
}

export interface VideoScene {
  sceneNumber: number;
  durationSeconds: number;
  visualPrompt: string;
  overlayText: string;
  voiceoverCue: string;
}

export interface VideoScriptData {
  hookTitle: string;
  totalDurationSeconds: number;
  voiceoverFullScript: string;
  scenes: VideoScene[];
  audioBgmStyle: string;
}

export type AssetStatus = 'pending_review' | 'approved' | 'scheduled' | 'published' | 'rejected';

export interface ContentVariation {
  label: string;
  content: string;
  hookAngle: string;
  hashtags: string[];
  callToAction: string;
}

export interface MarketingAsset {
  id: string;
  brand: BrandId;
  title: string;
  topic: string;
  platform: PlatformId;
  language: LanguageCode;
  format: 'post' | 'carousel' | 'video' | 'blog' | 'thread';
  primaryCopy: string;
  variations?: ContentVariation[];
  videoScript?: VideoScriptData;
  complianceReport: ComplianceAuditReport;
  status: AssetStatus;
  createdAt: string;
  scheduledTime?: string;
  publishedAt?: string;
  publishedUrl?: string;
  rejectionReasonTag?: string;
  rejectionHumanNote?: string;
  humanEditDelta?: number; // percentage of copy modified by human
  injectedLessonsCount?: number;
  analytics?: {
    impressions: number;
    clicks: number;
    engagements: number;
    shares: number;
    leadsGenerated: number;
  };
}

export interface LessonLearned {
  id: string;
  brand: BrandId | 'all';
  tag: string; // e.g. "too salesy", "inaccurate claim", "off-brand tone", "wrong CTA", "absolute guarantee"
  humanNote: string;
  ruleDirective: string; // Prompt instruction fed to Content Agent
  originalSnippet?: string;
  correctedSnippet?: string;
  createdAt: string;
  preventedErrorsCount: number;
}

export interface LeadProspect {
  id: string;
  brand: BrandId;
  companyName: string;
  contactName: string;
  role: string;
  city: string;
  country: string;
  estimatedAssetExposure: string;
  fitScore: number; // 0-100
  scoreReasons: string[];
  publicSource: string; // e.g. "SG Jewellers Guild 2026 Registry", "Doctor directory MOH"
  status: 'uncontacted' | 'drafted' | 'sent';
  personalizedEmail?: string;
  personalizedLinkedInMsg?: string;
}

export interface CompetitorIntelligence {
  id: string;
  competitorName: string;
  brandTarget: BrandId;
  changeSummary: string;
  pricingOrTermsMovement: string;
  threatLevel: 'high' | 'medium' | 'low';
  jaCounterAction: string;
  detectedDate: string;
}

export interface NewsjackTrigger {
  id: string;
  headline: string;
  incidentType: string;
  region: string;
  targetBrand: BrandId;
  urgency: 'critical' | 'high' | 'moderate';
  suggestedAngle: string;
  date: string;
}

export type ThemeId = 'runner-dark' | 'runner-light' | 'digilink-gold' | 'cyber-matrix' | 'royal-amethyst';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  tagline: string;
  previewColor: string;
  accentBadge: string;
  isDark: boolean;
}
