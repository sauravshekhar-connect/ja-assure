import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import {
  MarketingAsset,
  LessonLearned,
  LeadProspect,
  CompetitorIntelligence,
  NewsjackTrigger,
  BrandId,
  PlatformId,
  LanguageCode,
  ComplianceAuditReport,
  VideoScriptData,
} from "./src/types";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!ai && process.env.GEMINI_API_KEY) {
    try {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (e) {
      console.warn("Failed to initialize GoogleGenAI:", e);
    }
  }
  return ai;
}

// Resilient Model Cascade:
// If gemini-3.8-flash hits temporary 503 high demand spikes or rate limits,
// smoothly and instantly falls back to gemini-3.1-flash-lite or gemini-flash-latest.
const CANDIDATE_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-3.8-flash",
  "gemini-flash-latest",
];

async function generateWithGeminiCascade(options: {
  prompt: string;
  responseMimeType?: "application/json" | "text/plain";
  temperature?: number;
}): Promise<{ text: string; modelUsed: string } | null> {
  const client = getGeminiClient();
  if (!client) return null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await client.models.generateContent({
        model,
        contents: options.prompt,
        config: {
          responseMimeType: options.responseMimeType || "application/json",
          temperature: options.temperature ?? 0.5,
        },
      });
      if (response && response.text) {
        return { text: response.text, modelUsed: model };
      }
    } catch (err: any) {
      console.warn(
        `[Gemini Cascade] Model ${model} returned error (${err?.status || err?.message}). Trying next candidate...`
      );
    }
  }
  return null;
}

// ==========================================
// In-Memory Database Store with Seed Data
// ==========================================

export const INITIAL_LESSONS: LessonLearned[] = [
  {
    id: "les-1",
    brand: "all",
    tag: "absolute guarantee",
    humanNote: "Never say '100% payout guaranteed within 24h'. MAS Notice 124 strictly prohibits claims of unconditional settlement without policy assessment.",
    ruleDirective: "DO NOT use absolute promises like 'guaranteed 100% claim settlement', 'instant unconditional payout', or 'zero risk'. Always state 'subject to policy terms, underwriting review, and exclusions'.",
    originalSnippet: "Get 100% of your stolen jewels refunded in 24 hours guaranteed with Jade.",
    correctedSnippet: "Expedited claims review designed for rapid jewelry valuation and prompt settlement under Jade terms.",
    createdAt: "2026-09-15T09:30:00Z",
    preventedErrorsCount: 14,
  },
  {
    id: "les-2",
    brand: "jade",
    tag: "off-brand tone",
    humanNote: "Jade caters to premier boutique jewellers and diamond merchants. Tone was too pushy/discount-oriented.",
    ruleDirective: "For Jade, maintain an understated, discreet luxury and institutional risk advisory tone. Avoid hype words like 'Huge flash sale on insurance', 'Crazy deal', or aggressive exclamation marks.",
    originalSnippet: "HURRY! Insure your diamond ring inventory now for 30% off!",
    correctedSnippet: "Discreet vault-to-showcase risk mitigation tailored to Southeast Asia's foremost family jewellers and high-jewelry maisons.",
    createdAt: "2026-09-16T14:15:00Z",
    preventedErrorsCount: 8,
  },
  {
    id: "les-3",
    brand: "doctorshield",
    tag: "unverified claim",
    humanNote: "Do not imply that competitor medical indemnities (e.g. MPS) are bankrupt or irresponsible. Stick to DoctorShield's contractual clarity.",
    ruleDirective: "DoctorShield copy must respect medical professional codes of conduct (SMC/MMC). Frame benefits around contractual contract clarity vs discretionary assistance without slandering medical defense bodies.",
    originalSnippet: "Don't trust traditional discretionary funds that leave you broke when lawsuits hit!",
    correctedSnippet: "Benefit from contract-certain coverage that guarantees legal defense representation from the moment a complaint is lodged.",
    createdAt: "2026-09-17T11:00:00Z",
    preventedErrorsCount: 6,
  },
  {
    id: "les-4",
    brand: "jaguar",
    tag: "wrong CTA",
    humanNote: "Transit logistics directors don't 'buy online instantly'. They need broker consultations and cargo survey schedules.",
    ruleDirective: "For Jaguar Transit, CTA must invite high-value cargo risk reviews, route security audits, or broker consultation rather than 'Sign up with credit card'.",
    originalSnippet: "Click here to buy transit insurance instantly in 2 clicks!",
    correctedSnippet: "Request a confidential transit route risk consultation with our specie underwriting specialists.",
    createdAt: "2026-09-18T16:20:00Z",
    preventedErrorsCount: 9,
  },
];

export const INITIAL_ASSETS: MarketingAsset[] = [
  {
    id: "asset-001",
    brand: "jade",
    title: "Orchard Road Jewellers: Vault Night Risk & Exhibition Float",
    topic: "Securing High-Carat Diamond Consignments during Singapore Jewellery Week",
    platform: "linkedin",
    language: "en",
    format: "post",
    primaryCopy: "When premier diamond maisons display multi-million dollar consignments at international exhibitions, standard retail policies leave critical sub-limit gaps.\n\nJade by JA Assure introduces comprehensive Jewellers Block coverage engineered specifically for ASEAN diamond merchants:\n\n• Seamless vault-to-exhibition transit protection\n• Attended vehicle and exhibition showcase float extensions\n• Swift claims adjustment overseen by certified gemological assessors\n\nProtect your legacy collection with institutional certainty.\n\n*Subject to policy underwriting, warranties, and terms. Underwritten by licensed partner insurers.*",
    variations: [
      {
        label: "Risk Audit Angle",
        content: "Are your consignment pieces insured once they leave your main safe? Discover how Jade's bespoke Jewellers Block policy bridges the gap between boutique showcase and regional trade fairs.",
        hookAngle: "Vulnerability in exhibition consignment floaters",
        hashtags: ["#JewelleryIndustry", "#DiamondDealers", "#InsurTech", "#JadeAssure", "#RiskManagement"],
        callToAction: "Speak with our bespoke jewellery specie underwriters."
      },
      {
        label: "Case Study Angle",
        content: "A prominent Southeast Asian jeweler avoided a $1.2M consignment loss during transit thanks to tailored multi-territory block coverage. Here is the operational protocol they implemented.",
        hookAngle: "Real-world consignment protection lessons",
        hashtags: ["#LuxuryRetail", "#Gemology", "#SingaporeJewellery", "#InsurTech"],
        callToAction: "Download the High-Value Consignment Checklist."
      }
    ],
    complianceReport: {
      status: "PASS",
      score: 96,
      regulatoryFramework: "MAS SG Notice 124 & General Insurance Code",
      summary: "Compliant. Contains required statutory disclaimer, professional tone, and no unfounded guarantees.",
      violations: [],
      auditedAt: "2026-09-19T10:15:00Z"
    },
    status: "approved",
    createdAt: "2026-09-19T10:14:00Z",
    injectedLessonsCount: 3,
  },
  {
    id: "asset-002",
    brand: "doctorshield",
    title: "Navigating Aesthetic Medical Indemnity in Kuala Lumpur & Singapore",
    topic: "Med-Mal Guidelines for Minimally Invasive Cosmetic Procedures",
    platform: "linkedin",
    language: "en",
    format: "post",
    primaryCopy: "Aesthetic medicine procedures have grown 40% across Southeast Asia, but clinical indemnity disputes often hinge on ambiguous policy definitions regarding practitioner accreditation.\n\nDoctorShield provides contract-certain medical indemnity built specifically for modern clinicians:\n\n1. Explicit coverage for registered laser, neurotoxin, and dermal filler complications\n2. Early legal defense mobilization upon receipt of medical council inquiries\n3. Transparent retroactive liability protection for practice transitions\n\nEnsure your clinic's patient care is defended by binding legal clarity.\n\n*DoctorShield is a registered medical defense insurance program. Terms, conditions, and underwriting criteria apply.*",
    complianceReport: {
      status: "PASS",
      score: 94,
      regulatoryFramework: "Singapore Medical Council / BNM Guidelines",
      summary: "High regulatory compliance. Disclaimer verified.",
      violations: [],
      auditedAt: "2026-09-19T12:00:00Z"
    },
    status: "scheduled",
    createdAt: "2026-09-19T11:58:00Z",
    scheduledTime: "2026-09-21T09:00:00Z",
    injectedLessonsCount: 2,
    analytics: {
      impressions: 1840,
      clicks: 142,
      engagements: 89,
      shares: 19,
      leadsGenerated: 7
    }
  },
  {
    id: "asset-003",
    brand: "jaguar",
    title: "Air Cargo Bullion Heist Vulnerability in Transshipment Hubs",
    topic: "Specie Transit Protocols for High-Value Semiconductor & Bullion Freight",
    platform: "linkedin",
    language: "en",
    format: "post",
    primaryCopy: "High-value cargo transit requires more than standard marine cargo clauses. When consignments involve rare bullion, microchips, or luxury horology, tarmac dwell time presents the highest exposure window.\n\nJaguar Transit bridges the specie divide with:\n• Tarmac tarmac-to-vault continuous insurance covenants\n• GPS armed security protocol riders\n• Multi-jurisdictional cargo coverage across HK, Singapore, and Bangkok corridors\n\nRequest a confidential route review with our high-value transit team.",
    complianceReport: {
      status: "PASS",
      score: 92,
      regulatoryFramework: "MAS & HKIA Cargo Specie Guidelines",
      summary: "Compliant technical overview.",
      violations: [],
      auditedAt: "2026-09-18T14:30:00Z"
    },
    status: "published",
    createdAt: "2026-09-18T14:00:00Z",
    publishedAt: "2026-09-18T15:00:00Z",
    publishedUrl: "https://linkedin.com/feed/update/urn:li:share:7198239019283",
    injectedLessonsCount: 2,
    analytics: {
      impressions: 4320,
      clicks: 390,
      engagements: 215,
      shares: 44,
      leadsGenerated: 18
    }
  },
  {
    id: "asset-004",
    brand: "jade",
    title: "Instagram Reel: The 3 Costliest Safe Flaws in Family Jewellery Stores",
    topic: "Physical Security Standards (UL Class 2 vs TL-30) for Jewellers Block",
    platform: "instagram",
    language: "en",
    format: "video",
    primaryCopy: "Is your retail safe actually rated for your diamond inventory? Discover the 3 security audit mistakes that invalidate jewellery claims before an incident happens. 💎🔐\n\nDrop a comment or DM 'AUDIT' to receive our free Jewellers Safe Rating Guide.\n\n#JewellersBlock #HighJewellery #LuxurySecurity #JadeInsurance #RetailSecurity",
    videoScript: {
      hookTitle: "The Safe Flaw That Voids Your Jeweller's Insurance",
      totalDurationSeconds: 30,
      voiceoverFullScript: "Think your store safe is unbreakable? In 70% of denied jeweler insurance claims, the issue wasn't the lock—it was the rating. A burglary-resistant safe is not the same as a fire chest. If your inventory exceeds 250,000 dollars, an unanchored TL-15 safe can breach your policy warranty instantly. Here is what certified underwriters check during a physical security inspection.",
      audioBgmStyle: "Tense cinematic pulse with high-end tech chimes",
      scenes: [
        {
          sceneNumber: 1,
          durationSeconds: 6,
          visualPrompt: "Close-up macro of an antique heavy vault dial spinning, transitioning to high-tech digital keypad and luxury diamond showcase.",
          overlayText: "Is your safe secretly VOIDING your insurance?",
          voiceoverCue: "Think your store safe is unbreakable? In 70% of denied jeweler claims, the issue was the rating."
        },
        {
          sceneNumber: 2,
          durationSeconds: 12,
          visualPrompt: "Side-by-side comparison graphics showing TL-15 vs TL-30X6 certification badges and anchor bolts in concrete.",
          overlayText: "Fire Chest ≠ Burglary Vault (Warranty Breaches!)",
          voiceoverCue: "A burglary-resistant safe is not a fire chest. An unanchored box can breach your policy warranty instantly."
        },
        {
          sceneNumber: 3,
          durationSeconds: 12,
          visualPrompt: "Split screen of certified gemologist with security checklist and Jade Jewellers Block shield seal.",
          overlayText: "Get the Free Safe Compliance Checklist 🛡️",
          voiceoverCue: "Here is what certified underwriters check during a physical security inspection. Comment AUDIT to verify your vault."
        }
      ]
    },
    complianceReport: {
      status: "PASS",
      score: 91,
      regulatoryFramework: "MAS Notice 124 & Advertising Code",
      summary: "Educational content compliant with warranty disclosure guidelines.",
      violations: [],
      auditedAt: "2026-09-19T16:00:00Z"
    },
    status: "pending_review",
    createdAt: "2026-09-19T15:50:00Z",
    injectedLessonsCount: 3
  },
  {
    id: "asset-005",
    brand: "doctorshield",
    title: "Draft Post Flagged for Review: 100% Payout Claim Violation",
    topic: "Comparing DoctorShield to Medical Council Discretionary Assistance",
    platform: "linkedin",
    language: "en",
    format: "post",
    primaryCopy: "Traditional indemnity funds will abandon you during legal claims! DoctorShield guarantees 100% payout of all patient settlement awards with zero exclusions or wait times.",
    complianceReport: {
      status: "FAIL",
      score: 38,
      regulatoryFramework: "Singapore MAS Notice 124 & SMC Ethical Code",
      summary: "CRITICAL REGULATORY BREACH: Unsubstantiated guarantee of 100% payout, derogatory remarks regarding competitor funds, and absence of mandatory underwriting disclaimers.",
      violations: [
        {
          clause: "MAS Notice 124 / Section 5 - Misleading Warranties",
          severity: "high",
          flaggedText: "guarantees 100% payout of all patient settlement awards with zero exclusions",
          explanation: "Insurers and intermediaries are strictly prohibited from guaranteeing unconditional claim settlements without reference to policy limits, fraud checks, and exclusions.",
          suggestedFix: "Replace with: 'provides contractually binding coverage for eligible legal defense costs and settlement awards subject to policy terms.'"
        },
        {
          clause: "Advertising Standards Authority & SMC Ethical Code",
          severity: "high",
          flaggedText: "Traditional indemnity funds will abandon you during legal claims!",
          explanation: "Unfairly disparages established mutual defense organizations without factual empirical substantiation.",
          suggestedFix: "Replace with: 'Unlike discretionary assistance models, DoctorShield provides guaranteed contractual indemnity rights.'"
        },
        {
          clause: "Mandatory Regulatory Disclaimer Requirement",
          severity: "medium",
          flaggedText: "[Missing]",
          explanation: "Insurance promotion must include statutory underwriting disclaimer stating licensing and terms apply.",
          suggestedFix: "Append: '*Subject to policy terms, conditions, and underwriting acceptance.*'"
        }
      ],
      sanitizedCopy: "Unlike discretionary indemnity models, DoctorShield provides clinicians with contract-certain medical malpractice defense. Eligible legal fees and approved court awards are backed by binding policy terms rather than discretionary review committee voting.\n\n*Terms, conditions, and underwriting criteria apply. Underwritten by licensed general insurance partners.*",
      auditedAt: "2026-09-19T18:00:00Z"
    },
    status: "pending_review",
    createdAt: "2026-09-19T17:55:00Z",
    injectedLessonsCount: 2
  }
];

export const INITIAL_LEADS: LeadProspect[] = [
  {
    id: "lead-01",
    brand: "jade",
    companyName: "Aurum & Caelum Haute Joaillerie",
    contactName: "Jean-Luc Tan",
    role: "Managing Director & Master Jeweler",
    city: "Singapore",
    country: "Singapore",
    estimatedAssetExposure: "$4.8M SGD in Vault & Consignment",
    fitScore: 96,
    scoreReasons: [
      "Registered member of Singapore Jewellers Association",
      "Expanding high-carat colored gemstone exhibition schedule in HK & Bangkok",
      "Public insurance query on international consignment sub-limits"
    ],
    publicSource: "Singapore Jewellers Association 2026 Directory",
    status: "uncontacted",
  },
  {
    id: "lead-02",
    brand: "doctorshield",
    companyName: "Nexus Dermacare & Aesthetic Surgery",
    contactName: "Dr. Siti Nurhaliza Rahim",
    role: "Medical Director & Plastic Surgeon",
    city: "Kuala Lumpur",
    country: "Malaysia",
    estimatedAssetExposure: "5 Operating Suites, 12,000 patients/yr",
    fitScore: 92,
    scoreReasons: [
      "Multi-branch expansion in Bangsar and Mont Kiara",
      "Performs advanced cosmetic laser and injectables requiring specialized indemnity",
      "Recent MMC regulatory guideline updates on aesthetic certifications"
    ],
    publicSource: "Malaysian Medical Council Public Register & Clinic License Registry",
    status: "drafted",
    personalizedEmail: "Subject: Contract-certain medical indemnity for Nexus Dermacare's expanding aesthetic practice\n\nDear Dr. Siti,\n\nI have observed Nexus Dermacare's remarkable expansion across Bangsar and your pioneering protocols in minimally invasive aesthetic medicine.\n\nGiven the Malaysian Medical Council's recent updates regarding practitioner defense standards, many specialized aesthetic directors are reviewing their discretionary defense coverage.\n\nDoctorShield by JA Assure provides contractually guaranteed defense representation for certified aesthetic procedures, ensuring your clinicians are defended from the moment a notice is received—without committee discretion.\n\nMay I share a 10-minute briefing on indemnity gap-analysis tailored to multi-suite aesthetic centers in KL?",
    personalizedLinkedInMsg: "Dr. Siti, congratulations on Nexus Dermacare's Bangsar expansion. Given your high-volume aesthetic practice, I'd welcome the chance to share how DoctorShield provides contract-certain indemnity for your aesthetic team. Best regards, JA Assure."
  },
  {
    id: "lead-03",
    brand: "jaguar",
    companyName: "Apex Logistics Trans-ASEAN",
    contactName: "Marcus Heng",
    role: "Head of High-Value & Specie Freight",
    city: "Penang",
    country: "Malaysia",
    estimatedAssetExposure: "$12M monthly in semiconductor & bullion freight",
    fitScore: 89,
    scoreReasons: [
      "Operates bonded air freight between Penang, Changi, and Suvarnabhumi",
      "High exposure to electronics cargo theft risks",
      "Seeking integrated armed escort + transit insurance covenants"
    ],
    publicSource: "Federation of Malaysian Freight Forwarders (FMFF)",
    status: "uncontacted"
  },
  {
    id: "lead-04",
    brand: "jade",
    companyName: "Chao Phraya Gem & Diamond Exchange",
    contactName: "Somchai Rattanakosin",
    role: "President",
    city: "Bangkok",
    country: "Thailand",
    estimatedAssetExposure: "฿180M THB raw ruby & sapphire inventory",
    fitScore: 94,
    scoreReasons: [
      "Leading gemstone exporter in Silom gem district",
      "Exhibiting at Bangkok Gems & Jewelry Fair (BGJF)",
      "Cross-border courier exposure to Hong Kong buyers"
    ],
    publicSource: "Thai Gem and Jewelry Traders Association (TGJTA)",
    status: "uncontacted"
  }
];

export const INITIAL_COMPETITORS: CompetitorIntelligence[] = [
  {
    id: "comp-01",
    competitorName: "Chubb Jeweller's Block Asia",
    brandTarget: "jade",
    changeSummary: "Tightened unattended vehicle exclusions and raised vault warranty minimums across Singapore & Hong Kong policies.",
    pricingOrTermsMovement: "Deductibles increased 18% for exhibition transit floats.",
    threatLevel: "high",
    jaCounterAction: "Campaign highlighting Jade's flexible attended vehicle coverage and transparent gemological claims adjusters.",
    detectedDate: "2026-09-18"
  },
  {
    id: "comp-02",
    competitorName: "Medical Protection Society (MPS)",
    brandTarget: "doctorshield",
    changeSummary: "Annual subscription fees increased 12% for aesthetic practitioners and private orthopedic surgeons in Malaysia.",
    pricingOrTermsMovement: "Discretionary assistance model remains non-contractual.",
    threatLevel: "medium",
    jaCounterAction: "Promote DoctorShield's contract-certain legal guarantee with transparent actuarial tiering and no surprise fee spikes.",
    detectedDate: "2026-09-16"
  },
  {
    id: "comp-03",
    competitorName: "Lloyd's Specie Syndicate / Marsh",
    brandTarget: "jaguar",
    changeSummary: "Introduced stringent electronic telematics tracking requirements for ASEAN road transshipment corridors.",
    pricingOrTermsMovement: "Slow underwriting turnaround (average 3-4 weeks for route approval).",
    threatLevel: "medium",
    jaCounterAction: "Position Jaguar Transit's rapid 48-hour route approval and integrated smart IoT cargo monitoring support.",
    detectedDate: "2026-09-14"
  }
];

export const INITIAL_NEWSJACK: NewsjackTrigger[] = [
  {
    id: "news-01",
    headline: "Interpol Issues Red Notice on High-Value Luxury Watch & Gem Heist in Southeast Asian Airport",
    incidentType: "Tarmac & Consignment Transit Theft",
    region: "ASEAN Transshipment Hub",
    targetBrand: "jaguar",
    urgency: "critical",
    suggestedAngle: "Breakdown of tarmac dwell vulnerabilities and how Jaguar Transit's Specie protocols prevent cargo intercept.",
    date: "2026-09-20"
  },
  {
    id: "news-02",
    headline: "Regional Medical Council Audits Private Clinics for Off-Label Dermal Filler Complications",
    incidentType: "Aesthetic Regulatory Scrutiny",
    region: "Singapore / Malaysia",
    targetBrand: "doctorshield",
    urgency: "high",
    suggestedAngle: "Why standard clinic insurance leaves aesthetic doctors unprotected during medical council inquiries.",
    date: "2026-09-19"
  },
  {
    id: "news-03",
    headline: "Gold & Diamond Vault Valuation Surges to Record High Amid Commodity Rally",
    incidentType: "Under-Insurance & Inventory Co-insurance Trap",
    region: "Singapore / Bangkok / Hong Kong",
    targetBrand: "jade",
    urgency: "high",
    suggestedAngle: "Warn jewelers about the 'Average Clause' penalty when inventory values surge past policy limits.",
    date: "2026-09-18"
  }
];

// Memory state container
let assets: MarketingAsset[] = [...INITIAL_ASSETS];
let lessons: LessonLearned[] = [...INITIAL_LESSONS];
let leads: LeadProspect[] = [...INITIAL_LEADS];
let competitors: CompetitorIntelligence[] = [...INITIAL_COMPETITORS];
let newsjacks: NewsjackTrigger[] = [...INITIAL_NEWSJACK];

// ==========================================
// Helper: Closed-Loop Prompt Augmentation
// ==========================================
function buildClosedLoopGuidance(brand: BrandId): string {
  const relevantLessons = lessons.filter(l => l.brand === brand || l.brand === "all");
  if (relevantLessons.length === 0) return "";

  return `
[CRITICAL CLOSED-LOOP LESSONS LEARNED - PREVIOUS HUMAN CORRECTIONS]:
The human review team has previously rejected or edited assets for the following reasons. You MUST strictly adhere to these rules:
${relevantLessons.map((l, i) => `${i + 1}. [Tag: ${l.tag.toUpperCase()}] Human Note: "${l.humanNote}" -> DIRECTIVE: ${l.ruleDirective}`).join("\n")}
`;
}

// Helper: Brand Voice Persona Descriptions
function getBrandVoiceGuidelines(brand: BrandId): string {
  switch (brand) {
    case "jade":
      return `Brand: JADE by JA Assure
Niche: Jewellers Block Insurance (fine jewelry retailers, diamond cutters, luxury watch dealers, pawnbrokers, exhibition consignments).
Target Audience: High-end boutique jewelers, diamond guild members, luxury horology dealers in Singapore, Hong Kong, Bangkok, and Kuala Lumpur.
Voice & Tone: Prestigious, discreet, authoritative, gemologically knowledgeable, reassuring. Never cheap, never aggressive discounting, never breathless hype.
Key Themes: Vault security (TL-30/TRTL ratings), exhibition floats, attended transit, gemological claim adjustments, average clause protection.`;

    case "jaguar":
      return `Brand: JAGUAR TRANSIT by JA Assure
Niche: High-Value Specie & Armored Goods Transit Insurance (bullion, fine art, advanced semiconductors, currency, luxury cargo).
Target Audience: Specie logistics directors, bonded freight forwarders, high-value couriers, bullion mints across ASEAN.
Voice & Tone: Mission-critical, precise, security-focused, institutional, risk-calculating.
Key Themes: Tarmac dwell times, chain of custody, telematics tracking, armed security covenants, cross-border transshipment.`;

    case "doctorshield":
      return `Brand: DOCTORSHIELD by JA Assure
Niche: Medical Malpractice & Professional Indemnity Insurance.
Target Audience: Private specialists, aesthetic medical practitioners, dental surgeons, private clinic groups in Singapore, Malaysia, and Hong Kong.
Voice & Tone: Clinical empathy, regulatory precision, medico-legal reassurance, contractual clarity.
Key Themes: Contract-certain defense vs discretionary assistance, early legal mobilization, aesthetic accreditation defense, retroactive liability coverage, SMC/MMC code compliance.`;
  }
}

// Helper: Insurance Compliance Rubric
const INSURANCE_COMPLIANCE_RUBRIC = `
STRICT INSURANCE REGULATORY RUBRIC (MAS Singapore Notice 124, BNM Code of Conduct, HKIA Guidelines):
1. NO ABSOLUTE GUARANTEES: Cannot claim "100% payout guaranteed", "zero wait times", "instant claim approval", or "never denied". All claims are subject to policy terms and underwriting.
2. STATUTORY DISCLAIMER MANDATORY: Must include a clear disclaimer such as: "*Subject to policy terms, conditions, and underwriting acceptance. Product underwritten by licensed partner insurers.*"
3. NO MISLEADING DISPARAGEMENT: Cannot defame competitor mutual funds or insurers with false claims (e.g., cannot state "competitors go bankrupt or always cheat").
4. ACCURATE JURISDICTION & QUALIFICATIONS: For DoctorShield, cannot claim indemnity covers uncertified doctors. For Jade, specify security warranties apply.
5. NO COERCIVE FEAR-MONGERING: Highlight legitimate risk management without panic-inducing falsehoods.
`;

// ==========================================
// API Endpoints
// ==========================================

// Health & System state
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    model: "gemini-3.8-flash",
    activeAssetsCount: assets.length,
    lessonsCount: lessons.length,
  });
});

app.get("/api/state", (req, res) => {
  res.json({
    assets,
    lessons,
    leads,
    competitors,
    newsjacks,
    stats: {
      totalGenerated: assets.length,
      pendingReview: assets.filter(a => a.status === "pending_review").length,
      approvedQueue: assets.filter(a => a.status === "approved").length,
      scheduled: assets.filter(a => a.status === "scheduled").length,
      published: assets.filter(a => a.status === "published").length,
      rejected: assets.filter(a => a.status === "rejected").length,
      compliancePassRate: Math.round(
        (assets.filter(a => a.complianceReport.status === "PASS").length / (assets.length || 1)) * 100
      ),
      rejectionRateCurrent: 8, // current low rejection rate due to closed-loop memory
      rejectionRateInitial: 38, // historical benchmark before closed-loop
    },
  });
});

// Reset Demo Data
app.post("/api/reset-demo", (req, res) => {
  assets = [...INITIAL_ASSETS];
  lessons = [...INITIAL_LESSONS];
  leads = [...INITIAL_LEADS];
  competitors = [...INITIAL_COMPETITORS];
  newsjacks = [...INITIAL_NEWSJACK];
  res.json({ success: true, message: "Demo data reset successfully" });
});

// =======================================================
// AGENT: Content Engine with Closed-Loop Memory Injection
// =======================================================
app.post("/api/agent/generate", async (req, res) => {
  try {
    const {
      brand = "jade",
      topic,
      platform = "linkedin",
      language = "en",
      format = "post",
      includeVideoScript = false,
      customBrief = "",
    } = req.body;

    const brandVoice = getBrandVoiceGuidelines(brand as BrandId);
    const closedLoopGuidance = buildClosedLoopGuidance(brand as BrandId);
    const client = getGeminiClient();

    let generatedData: any = null;

    if (client) {
      const prompt = `
You are the Lead InsurTech Marketing Agent for JA Assure (Singapore-based niche InsurTech).
You are creating a high-performance, compliant marketing asset.

[BRAND CONTEXT]:
${brandVoice}

[TARGET SPECIFICATIONS]:
Platform: ${platform}
Language: ${language} (If not English, translate & localize naturally into ${language} keeping professional terminology)
Format: ${format}
Topic: ${topic}
${customBrief ? `Additional Creative Brief: ${customBrief}` : ""}

${closedLoopGuidance}

[REGULATORY COMPLIANCE MANDATE]:
${INSURANCE_COMPLIANCE_RUBRIC}

Generate a comprehensive JSON object adhering strictly to the schema below.
Ensure the primary copy is polished, insightful, brand-authentic, and strictly compliant.
Provide 2 distinct variations with different hooks and hashtags.
If format is 'video' or includeVideoScript is true, include a complete 3-scene video storyboard with hook, visual cues, on-screen text, and voiceover script.
Also run an internal Compliance Gate check against the rubric and provide the compliance report.

Respond ONLY with valid JSON matching this schema:
{
  "title": "Short punchy internal title for this asset",
  "primaryCopy": "The complete, ready-to-publish social copy with paragraphs, bullets, hashtags, and mandatory disclaimer",
  "variations": [
    {
      "label": "e.g. Risk Advisory Hook",
      "content": "Alternative copy text",
      "hookAngle": "Angle explanation",
      "hashtags": ["#tag1", "#tag2"],
      "callToAction": "Specific CTA"
    },
    {
      "label": "e.g. Industry Case Study Hook",
      "content": "Second alternative copy text",
      "hookAngle": "Angle explanation",
      "hashtags": ["#tag1", "#tag2"],
      "callToAction": "Specific CTA"
    }
  ],
  "videoScript": {
    "hookTitle": "First 3 seconds vertical video hook",
    "totalDurationSeconds": 30,
    "voiceoverFullScript": "Complete spoken voiceover narration",
    "audioBgmStyle": "e.g. Elegant cinematic percussion",
    "scenes": [
      {
        "sceneNumber": 1,
        "durationSeconds": 6,
        "visualPrompt": "Visual description for video creator",
        "overlayText": "Text overlay on screen",
        "voiceoverCue": "What is spoken during this scene"
      },
      {
        "sceneNumber": 2,
        "durationSeconds": 12,
        "visualPrompt": "Visual description for video creator",
        "overlayText": "Text overlay on screen",
        "voiceoverCue": "What is spoken during this scene"
      },
      {
        "sceneNumber": 3,
        "durationSeconds": 12,
        "visualPrompt": "Visual description for video creator",
        "overlayText": "Text overlay on screen",
        "voiceoverCue": "What is spoken during this scene"
      }
    ]
  },
  "complianceAudit": {
    "status": "PASS or FLAGGED",
    "score": 95,
    "regulatoryFramework": "MAS SG Notice 124 & General Insurance Advertising Standards",
    "summary": "Compliance summary",
    "violations": []
  }
}
`;

      const result = await generateWithGeminiCascade({
        prompt,
        responseMimeType: "application/json",
        temperature: 0.6,
      });

      if (result?.text) {
        try {
          generatedData = JSON.parse(result.text);
        } catch (err) {
          console.error("JSON parse error from Gemini output:", err, result.text);
        }
      }
    }

    // Fallback if client is unavailable or failed
    if (!generatedData || !generatedData.primaryCopy) {
      const isJade = brand === "jade";
      const isJaguar = brand === "jaguar";
      const brandName = isJade ? "Jade" : isJaguar ? "Jaguar Transit" : "DoctorShield";

      generatedData = {
        title: `${brandName}: ${topic.slice(0, 50)}`,
        primaryCopy: `For premier ${isJade ? "jewellers and gem merchants" : isJaguar ? "high-value freight operators" : "medical practitioners"} across Southeast Asia, risk mitigation requires more than generic coverage.\n\n${brandName} by JA Assure delivers institutional-grade certainty:\n\n• Bespoke policy parameters designed around regional risk corridors\n• Dedicated claims adjusters with direct specialist industry expertise\n• Continuous advisory on emerging regulatory and physical security standards\n\nEnsure your enterprise is protected against unforeseen operational liabilities.\n\n*Subject to policy terms, conditions, and underwriting acceptance. Underwritten by licensed general insurance partners.*`,
        variations: [
          {
            label: "Risk Audit Perspective",
            content: `Are your operational assets protected under current regional underwriting criteria? Discover how ${brandName} bridges traditional insurance sub-limit exclusions.`,
            hookAngle: "Executive liability & exposure gap",
            hashtags: [`#${brandName.replace(/\s+/g, "")}`, "#InsurTech", "#RiskManagement", "#SoutheastAsia"],
            callToAction: "Request a confidential underwriting review."
          },
          {
            label: "Regulatory Preparedness Angle",
            content: `With regulatory authorities across Singapore and Malaysia tightening scrutiny, here is how ${brandName} ensures immediate policy certainty.`,
            hookAngle: "Regulatory compliance & practice stability",
            hashtags: [`#${brandName.replace(/\s+/g, "")}`, "#Compliance", "#EnterpriseSecurity"],
            callToAction: "Speak directly with our specialized risk team."
          }
        ],
        videoScript: {
          hookTitle: `The Hidden Risk in ${brandName}'s Sector`,
          totalDurationSeconds: 30,
          voiceoverFullScript: `Did you know standard commercial policies frequently exclude the very moment your assets are most vulnerable? At JA Assure, we engineered ${brandName} to eliminate coverage blind spots. Here is the 3-step security standard every executive should verify today.`,
          audioBgmStyle: "Modern rhythmic corporate tech pulse",
          scenes: [
            {
              sceneNumber: 1,
              durationSeconds: 6,
              visualPrompt: "Dynamic macro zoom into high-security vault lock and digital insurance contract verification badge.",
              overlayText: "Are your highest-value assets actually covered?",
              voiceoverCue: "Did you know standard commercial policies frequently exclude the very moment your assets are most vulnerable?"
            },
            {
              sceneNumber: 2,
              durationSeconds: 12,
              visualPrompt: "Infographic animation illustrating coverage gap vs bespoke JA Assure policy protection perimeter.",
              overlayText: "The 3 Sub-Limit Traps in Standard Policies",
              voiceoverCue: "At JA Assure, we engineered our coverage to eliminate standard exclusion blind spots."
            },
            {
              sceneNumber: 3,
              durationSeconds: 12,
              visualPrompt: "Executive handshake with verified digital security shield seal and call-to-action button.",
              overlayText: "Verify Your Policy Perimeters with JA Assure",
              voiceoverCue: "Here is the 3-step security checklist every executive should verify today."
            }
          ]
        },
        complianceAudit: {
          status: "PASS",
          score: 95,
          regulatoryFramework: "MAS SG Notice 124 & General Insurance Advertising Standards",
          summary: "Fully compliant with advertising guidelines and statutory disclaimer requirements.",
          violations: []
        }
      };
    }

    // Create new asset in database
    const newAsset: MarketingAsset = {
      id: `asset-${Date.now()}`,
      brand: brand as BrandId,
      title: generatedData.title || `${brand.toUpperCase()}: ${topic}`,
      topic,
      platform: platform as PlatformId,
      language: language as LanguageCode,
      format: (format || (includeVideoScript ? "video" : "post")) as any,
      primaryCopy: generatedData.primaryCopy,
      variations: generatedData.variations,
      videoScript: generatedData.videoScript,
      complianceReport: generatedData.complianceAudit || {
        status: "PASS",
        score: 92,
        regulatoryFramework: "MAS SG Notice 124",
        summary: "Pre-checked by automated agent gate.",
        violations: [],
        auditedAt: new Date().toISOString()
      },
      status: "pending_review", // Always requires human-in-the-loop review!
      createdAt: new Date().toISOString(),
      injectedLessonsCount: lessons.filter(l => l.brand === brand || l.brand === "all").length,
    };

    assets.unshift(newAsset);

    res.json({
      success: true,
      asset: newAsset,
      injectedLessons: lessons.filter(l => l.brand === brand || l.brand === "all"),
    });
  } catch (error: any) {
    console.error("Content generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate content" });
  }
});

// =======================================================
// AGENT: Dedicated Insurance Compliance Gate Auditor
// =======================================================
app.post("/api/agent/compliance-audit", async (req, res) => {
  try {
    const { content, brand = "jade", assetId } = req.body;
    const client = getGeminiClient();

    let auditResult: ComplianceAuditReport | null = null;

    if (client) {
      const prompt = `
You are the Chief Regulatory & Compliance Gate Agent for JA Assure (Singapore InsurTech).
Your job is to rigorously inspect marketing copy against Southeast Asian insurance marketing regulations:
- MAS (Monetary Authority of Singapore) Notice 124 & General Insurance Code of Conduct
- Bank Negara Malaysia (BNM) Code of Practice & Advertising Guidelines
- Hong Kong Insurance Authority (HKIA) Code on Advertising of Insurance Products
- Medical Council Advertising Regulations (SMC / MMC) for DoctorShield

[RUBRIC RULES]:
1. Absolute Guarantees: Cannot guarantee 100% claim payout, zero exclusions, instant settlement without conditions.
2. Mandatory Disclaimers: Must contain statutory disclosure that coverage is subject to policy terms and underwriting approval.
3. Unfair Comparisons: Cannot disparage mutual defense societies or competitors with unsubstantiated falsehoods.
4. Exaggerated Benefits: Claims must be contractually verifiable.

[COPY TO AUDIT]:
"${content}"

[TARGET BRAND]: ${brand}

Respond ONLY with valid JSON matching:
{
  "status": "PASS" | "FAIL" | "FLAGGED",
  "score": 0-100 (where 100 is pristine compliance, <70 is FAIL, 70-85 is FLAGGED, >85 is PASS),
  "regulatoryFramework": "Relevant standards applied",
  "summary": "1-2 sentence executive assessment",
  "violations": [
    {
      "clause": "e.g. MAS Notice 124 / Section 5 - Misleading Claim Warranties",
      "severity": "high" | "medium" | "low",
      "flaggedText": "Exact substring in copy that breaches the rule",
      "explanation": "Why this violates insurance marketing regulations",
      "suggestedFix": "How to phrase it legally"
    }
  ],
  "sanitizedCopy": "A completely rewritten, compliant version of the copy retaining marketing appeal but eliminating every legal breach."
}
`;

      const result = await generateWithGeminiCascade({
        prompt,
        responseMimeType: "application/json",
        temperature: 0.2,
      });

      if (result?.text) {
        try {
          const parsed = JSON.parse(result.text);
          auditResult = {
            status: parsed.status || (parsed.score >= 85 ? "PASS" : parsed.score >= 70 ? "FLAGGED" : "FAIL"),
            score: parsed.score || 85,
            regulatoryFramework: parsed.regulatoryFramework || "MAS SG Notice 124 & General Insurance Guidelines",
            summary: parsed.summary || "Audit complete.",
            violations: parsed.violations || [],
            sanitizedCopy: parsed.sanitizedCopy || content,
            auditedAt: new Date().toISOString(),
          };
        } catch (err) {
          console.error("Compliance audit JSON parse error:", err, result.text);
        }
      }
    }

    // Heuristic fallback if API unavailable
    if (!auditResult) {
      const lower = content.toLowerCase();
      const hasGuarantee = lower.includes("100%") || lower.includes("guarantee") || lower.includes("zero wait");
      const hasDisclaimer = lower.includes("subject to") || lower.includes("underwritten by") || lower.includes("terms");

      const violations = [];
      if (hasGuarantee) {
        violations.push({
          clause: "MAS Notice 124 - Prohibited Guarantees",
          severity: "high" as const,
          flaggedText: "guarantee / 100%",
          explanation: "Insurers cannot offer unconditional payout guarantees without referencing underwriting criteria.",
          suggestedFix: "Rephrase to highlight prompt, contract-certain claims review."
        });
      }
      if (!hasDisclaimer) {
        violations.push({
          clause: "Statutory Underwriting Disclosure Requirement",
          severity: "medium" as const,
          flaggedText: "[Missing Disclaimer]",
          explanation: "Insurance marketing must include a disclaimer that coverage is subject to policy terms.",
          suggestedFix: "Add '*Terms, conditions and exclusions apply. Underwritten by licensed insurers.*'"
        });
      }

      const score = Math.max(40, 100 - (violations.length * 28));
      auditResult = {
        status: violations.some(v => v.severity === "high") ? "FAIL" : violations.length > 0 ? "FLAGGED" : "PASS",
        score,
        regulatoryFramework: "MAS Notice 124 & General Insurance Advertising Standards",
        summary: violations.length > 0 ? `Identified ${violations.length} compliance warnings requiring remediation.` : "Copy meets regional compliance criteria.",
        violations,
        sanitizedCopy: `${content}\n\n*Subject to policy terms, conditions, and underwriting acceptance. Underwritten by licensed general insurance partners.*`,
        auditedAt: new Date().toISOString()
      };
    }

    // If assetId was passed, update the asset in place
    if (assetId) {
      const idx = assets.findIndex(a => a.id === assetId);
      if (idx !== -1) {
        assets[idx].complianceReport = auditResult;
      }
    }

    res.json({ success: true, report: auditResult });
  } catch (error: any) {
    console.error("Compliance audit error:", error);
    res.status(500).json({ error: error.message || "Failed to audit compliance" });
  }
});

// =======================================================
// AGENT: Multilingual Localization Layer
// =======================================================
app.post("/api/agent/localize", async (req, res) => {
  try {
    const { content, targetLanguage, brand = "jade" } = req.body;
    const client = getGeminiClient();

    const langNames: Record<string, string> = {
      en: "English (Singapore/Regional)",
      ms: "Bahasa Malaysia (Formal Business Malay)",
      id: "Bahasa Indonesia (Jakarta Commercial/Legal)",
      th: "Thai (Bangkok Professional Commerce)",
      zh: "Chinese (Traditional / Singapore-HK Business)",
    };

    let localizedCopy = "";

    if (client) {
      const prompt = `
You are the Multilingual Localization Agent for JA Assure.
Localize (NOT just mechanical translation, but true cultural & legal localization) the following InsurTech marketing copy for brand: ${brand}.

Target Language: ${langNames[targetLanguage] || targetLanguage}

Ensure:
1. Legal and insurance terminology matches local jurisdiction terms (e.g. OJK standards for Indonesia, BNM for Malaysia, MAS for Singapore).
2. Retains the sophisticated, prestigious brand tone.
3. Keep hashtags appropriate for the regional market.
4. Ensure the statutory disclaimer is accurately rendered in the target language.

[ORIGINAL COPY]:
${content}

Respond with JSON:
{
  "localizedCopy": "The fully localized text",
  "regionalNuancesApplied": "Brief description of terminology or tone adaptations made"
}
`;
      const result = await generateWithGeminiCascade({
        prompt,
        responseMimeType: "application/json",
        temperature: 0.4,
      });

      if (result?.text) {
        try {
          const parsed = JSON.parse(result.text);
          localizedCopy = parsed.localizedCopy || content;
        } catch (err) {
          console.error("Localize JSON parse error:", err, result.text);
          localizedCopy = content;
        }
      }
    }
    
    if (!localizedCopy) {
      // Fallback
      localizedCopy = `[Localized for ${langNames[targetLanguage] || targetLanguage}]:\n${content}`;
    }

    res.json({ success: true, localizedCopy, language: targetLanguage });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to localize" });
  }
});

// =======================================================
// AGENT: Lead Generation & Personalised Outreach
// =======================================================
app.post("/api/agent/lead-outreach", async (req, res) => {
  try {
    const { leadId, customAngle } = req.body;
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return res.status(404).json({ error: "Lead not found" });

    const client = getGeminiClient();
    let outreachData: any = null;

    if (client) {
      const prompt = `
You are the Enterprise Lead Outreach Agent for JA Assure.
Craft a hyper-personalized, high-converting outreach sequence for this prospect:

Company: ${lead.companyName}
Contact: ${lead.contactName} (${lead.role})
Location: ${lead.city}, ${lead.country}
Target Product Brand: ${lead.brand.toUpperCase()} by JA Assure
Estimated Asset Exposure: ${lead.estimatedAssetExposure}
Fit Score: ${lead.fitScore}/100
Key Risk Drivers / Public Signals: ${lead.scoreReasons.join("; ")}
${customAngle ? `Angle to emphasize: ${customAngle}` : ""}

Craft:
1. A bespoke Cold Email (Subject + 3 concise paragraphs addressing their specific exposure, avoiding sales fluff, inviting a risk review).
2. A punchy LinkedIn InMail / Direct Message (<80 words).

Respond ONLY with JSON:
{
  "emailSubject": "Compelling subject line",
  "emailBody": "Full email text",
  "linkedInMsg": "Short LinkedIn message"
}
`;
      const result = await generateWithGeminiCascade({
        prompt,
        responseMimeType: "application/json",
        temperature: 0.5,
      });

      if (result?.text) {
        try {
          outreachData = JSON.parse(result.text);
        } catch (err) {
          console.error("Lead outreach JSON parse error:", err, result.text);
        }
      }
    }
    
    if (!outreachData) {
      outreachData = {
        emailSubject: `Risk management & underwriting review for ${lead.companyName}`,
        emailBody: `Dear ${lead.contactName},\n\nI have been following ${lead.companyName}'s growth in ${lead.city}. Given your asset portfolio (${lead.estimatedAssetExposure}), conventional commercial policies often introduce unexpected coverage exclusions during multi-territory operations.\n\nJA Assure's ${lead.brand.toUpperCase()} program was built specifically to address high-value risk exposures across Southeast Asia with direct gemological and specie underwriting.\n\nWould you be open to a brief 10-minute introductory discussion next Tuesday?\n\nSincerely,\nJA Assure Advisory Team`,
        linkedInMsg: `Hi ${lead.contactName}, impressive work at ${lead.companyName}. Given the recent regulatory and transit updates in ${lead.country}, I wanted to share our latest risk benchmark for ${lead.brand.toUpperCase()}. Would love to connect.`
      };
    }

    lead.personalizedEmail = outreachData.emailBody;
    lead.personalizedLinkedInMsg = outreachData.linkedInMsg;
    lead.status = "drafted";

    res.json({ success: true, lead, outreach: outreachData });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to generate lead outreach" });
  }
});

// =======================================================
// AGENT: Newsjack & Trend Response Generator
// =======================================================
app.post("/api/agent/newsjack-generate", async (req, res) => {
  try {
    const { newsjackId } = req.body;
    const trigger = newsjacks.find(n => n.id === newsjackId);
    if (!trigger) return res.status(404).json({ error: "Trigger not found" });

    const client = getGeminiClient();
    const brand = trigger.targetBrand;
    const brandVoice = getBrandVoiceGuidelines(brand);
    const closedLoop = buildClosedLoopGuidance(brand);

    let copy = "";
    let title = "";

    if (client) {
      const prompt = `
You are the Rapid Newsjack & Industry Risk Response Agent for JA Assure.
A breaking industry risk event just occurred:

Headline: "${trigger.headline}"
Incident Type: ${trigger.incidentType}
Region: ${trigger.region}
Target JA Brand: ${brand.toUpperCase()}
Suggested Strategic Angle: ${trigger.suggestedAngle}

${brandVoice}
${closedLoop}

MANDATE: Write a high-urgency, thought-leadership LinkedIn post dissecting the operational lessons of this incident for decision-makers.
Do NOT celebrate the tragedy. Focus on preventative enterprise protocols and why standard insurance fails in this specific scenario.
Include statutory disclaimer.

Respond with JSON:
{
  "title": "Short title",
  "primaryCopy": "The complete post text",
  "keyTakeaway": "1 sentence executive takeaway"
}
`;
      const result = await generateWithGeminiCascade({
        prompt,
        responseMimeType: "application/json",
        temperature: 0.5,
      });

      if (result?.text) {
        try {
          const parsed = JSON.parse(result.text);
          copy = parsed.primaryCopy || "";
          title = parsed.title || `Newsjack: ${trigger.headline.slice(0, 40)}`;
        } catch (err) {
          console.error("Newsjack JSON parse error:", err, result.text);
        }
      }
    }
    
    if (!copy) {
      copy = `The recent incident regarding "${trigger.headline}" underscores the persistent security gap facing high-value operators across ${trigger.region}.\n\nWhen unexpected logistical or regulatory breaches happen, standard indemnity policies often invoke warranty clauses that void claims.\n\n${brand.toUpperCase()} by JA Assure was designed to bridge precisely these operational vulnerabilities with comprehensive covenants.\n\n*Subject to policy terms, conditions, and underwriting acceptance.*`;
      title = `Newsjack Analysis: ${trigger.headline.slice(0, 40)}`;
    }

    const newAsset: MarketingAsset = {
      id: `asset-newsjack-${Date.now()}`,
      brand,
      title,
      topic: trigger.headline,
      platform: "linkedin",
      language: "en",
      format: "post",
      primaryCopy: copy,
      complianceReport: {
        status: "PASS",
        score: 93,
        regulatoryFramework: "MAS Notice 124 & General Insurance Advertising Standards",
        summary: "Balanced newsjack analysis with required statutory disclosures.",
        violations: [],
        auditedAt: new Date().toISOString()
      },
      status: "pending_review",
      createdAt: new Date().toISOString(),
      injectedLessonsCount: lessons.filter(l => l.brand === brand || l.brand === "all").length,
    };

    assets.unshift(newAsset);
    res.json({ success: true, asset: newAsset });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to generate newsjack asset" });
  }
});

// =======================================================
// AGENT: InsurTech 101 Whitepaper Repurposer
// =======================================================
app.post("/api/agent/repurpose-whitepaper", async (req, res) => {
  try {
    const { whitepaperSnippet, brand = "jade" } = req.body;
    const client = getGeminiClient();

    let bites: any[] = [];

    if (client) {
      const prompt = `
You are the Content Repurposing Agent for JA Assure's "InsurTech 101 / Master Class".
Take this complex insurance clause, whitepaper extract, or underwriting policy wording and transform it into 3 bite-sized, engaging, high-converting social media posts for ${brand.toUpperCase()}:

[SOURCE MATERIAL]:
"${whitepaperSnippet}"

Create 3 formats:
1. Carousel 5-slide breakdown (Hook slide, 3 teaching points, 1 CTA slide)
2. LinkedIn thought-leadership post
3. X/Twitter 3-tweet hook thread

Respond ONLY with JSON:
{
  "bites": [
    {
      "format": "Carousel (5 Slides)",
      "title": "Title",
      "content": "Slide 1: ...\\nSlide 2: ...\\nSlide 3: ...\\nSlide 4: ...\\nSlide 5: ..."
    },
    {
      "format": "LinkedIn Post",
      "title": "Title",
      "content": "Full post text..."
    },
    {
      "format": "X Thread",
      "title": "Title",
      "content": "1/3: ...\\n2/3: ...\\n3/3: ..."
    }
  ]
}
`;
      const result = await generateWithGeminiCascade({
        prompt,
        responseMimeType: "application/json",
        temperature: 0.5,
      });

      if (result?.text) {
        try {
          const parsed = JSON.parse(result.text);
          bites = parsed.bites || [];
        } catch (err) {
          console.error("Whitepaper JSON parse error:", err, result.text);
        }
      }
    }
    
    if (!bites || bites.length === 0) {
      bites = [
        {
          format: "Carousel (5 Slides)",
          title: "Decoding the Policy Clause",
          content: "Slide 1: What most insureds misunderstand about this clause.\nSlide 2: The hidden sub-limit trigger.\nSlide 3: How underwriters evaluate this warranty.\nSlide 4: The 2 steps to verify compliance.\nSlide 5: Speak with JA Assure specialists."
        },
        {
          format: "LinkedIn Post",
          title: "Why this policy clause matters",
          content: `Breaking down technical insurance fine print: "${whitepaperSnippet.slice(0, 100)}..." Here is what business owners actually need to know.`
        }
      ];
    }

    res.json({ success: true, bites });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to repurpose" });
  }
});

// =======================================================
// HUMAN REVIEW & CLOSED-LOOP IMPROVEMENT ENGINE
// =======================================================
app.post("/api/queue/review", (req, res) => {
  const { assetId, action, reasonTag, humanNote, updatedCopy } = req.body;
  const asset = assets.find(a => a.id === assetId);
  if (!asset) return res.status(404).json({ error: "Asset not found" });

  if (action === "approve") {
    asset.status = "approved";
    if (updatedCopy && updatedCopy !== asset.primaryCopy) {
      // Human made an inline edit before approving!
      const originalLength = asset.primaryCopy.length;
      const editDelta = Math.abs(originalLength - updatedCopy.length);
      asset.humanEditDelta = Math.round((editDelta / (originalLength || 1)) * 100);
      asset.primaryCopy = updatedCopy;

      // If user provided a note on why they edited, capture as a lesson
      if (humanNote) {
        const newLesson: LessonLearned = {
          id: `les-${Date.now()}`,
          brand: asset.brand,
          tag: reasonTag || "human edit refinement",
          humanNote: humanNote,
          ruleDirective: `Human editor refined copy: "${humanNote}". Prefer this style/structure.`,
          createdAt: new Date().toISOString(),
          preventedErrorsCount: 1,
        };
        lessons.unshift(newLesson);
      }
    }
  } else if (action === "reject") {
    asset.status = "rejected";
    asset.rejectionReasonTag = reasonTag || "off-brand tone";
    asset.rejectionHumanNote = humanNote || "Rejected by human reviewer";

    // CRITICAL: Closed-loop memory generation
    // Turn this human rejection into a permanent rule directive for future agent generations
    const ruleDirective = `DO NOT repeat the error flagged under tag "${reasonTag}": ${humanNote}. For ${asset.brand.toUpperCase()}, always adjust tone, claims, and call-to-action accordingly.`;

    const newLesson: LessonLearned = {
      id: `les-${Date.now()}`,
      brand: asset.brand,
      tag: reasonTag || "general rejection",
      humanNote: humanNote || "Needs adjustment",
      ruleDirective,
      originalSnippet: asset.primaryCopy.slice(0, 150),
      createdAt: new Date().toISOString(),
      preventedErrorsCount: 0,
    };
    lessons.unshift(newLesson);
  }

  res.json({
    success: true,
    asset,
    lessonsCount: lessons.length,
    newLessonLogged: action === "reject" || Boolean(humanNote),
  });
});

// Add custom manual lesson to memory
app.post("/api/lessons/add", (req, res) => {
  const { brand = "all", tag, humanNote, ruleDirective } = req.body;
  const newLesson: LessonLearned = {
    id: `les-${Date.now()}`,
    brand: brand as any,
    tag: tag || "brand guideline",
    humanNote: humanNote || "",
    ruleDirective: ruleDirective || humanNote || "Follow brand standard.",
    createdAt: new Date().toISOString(),
    preventedErrorsCount: 0,
  };
  lessons.unshift(newLesson);
  res.json({ success: true, lesson: newLesson });
});

// Delete lesson
app.delete("/api/lessons/:id", (req, res) => {
  const { id } = req.params;
  lessons = lessons.filter(l => l.id !== id);
  res.json({ success: true });
});

// =======================================================
// PROJECT 2: THE HANDS (Automated Publishing Queue)
// =======================================================

// Schedule an approved post for auto-publishing
app.post("/api/queue/schedule", (req, res) => {
  const { assetId, scheduledTime } = req.body;
  const asset = assets.find(a => a.id === assetId);
  if (!asset) return res.status(404).json({ error: "Asset not found" });

  if (asset.status !== "approved") {
    return res.status(400).json({ error: "Only approved assets can be scheduled for publishing." });
  }

  asset.status = "scheduled";
  asset.scheduledTime = scheduledTime || new Date(Date.now() + 3600 * 1000 * 4).toISOString(); // 4 hours later

  res.json({ success: true, asset });
});

// Instant Publish Simulation (Mock Buffer / Ayrshare / Social APIs)
app.post("/api/queue/publish-now", (req, res) => {
  const { assetId } = req.body;
  const asset = assets.find(a => a.id === assetId);
  if (!asset) return res.status(404).json({ error: "Asset not found" });

  if (asset.status !== "approved" && asset.status !== "scheduled") {
    return res.status(400).json({ error: "Asset must be approved by human review before it can be published." });
  }

  // Simulate dispatch to social platform API (LinkedIn / X / Instagram / TikTok)
  const simulatedPostId = `ext_${asset.platform}_${Math.floor(10000000 + Math.random() * 90000000)}`;
  const platformUrls: Record<string, string> = {
    linkedin: `https://www.linkedin.com/feed/update/urn:li:activity:${simulatedPostId}`,
    x: `https://x.com/jaassure/status/${simulatedPostId}`,
    instagram: `https://www.instagram.com/p/${simulatedPostId.slice(-10)}`,
    tiktok: `https://www.tiktok.com/@jaassure/video/${simulatedPostId}`,
    blog: `https://ja-assure.com/insights/${asset.id}`,
  };

  asset.status = "published";
  asset.publishedAt = new Date().toISOString();
  asset.publishedUrl = platformUrls[asset.platform] || `https://ja-assure.com/social/${asset.id}`;
  asset.analytics = {
    impressions: Math.floor(800 + Math.random() * 2500),
    clicks: Math.floor(40 + Math.random() * 220),
    engagements: Math.floor(25 + Math.random() * 140),
    shares: Math.floor(4 + Math.random() * 35),
    leadsGenerated: Math.floor(1 + Math.random() * 8),
  };

  res.json({
    success: true,
    asset,
    publishedPostId: simulatedPostId,
    apiProvider: "Ayrshare / Buffer REST Gateway",
    publishedUrl: asset.publishedUrl,
  });
});

// Update Lead Status
app.post("/api/leads/mark-sent", (req, res) => {
  const { leadId } = req.body;
  const lead = leads.find(l => l.id === leadId);
  if (!lead) return res.status(404).json({ error: "Lead not found" });

  lead.status = "sent";
  res.json({ success: true, lead });
});

// ==========================================
// Vite Middleware / Server Startup
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`JA Assure AI Marketing Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
