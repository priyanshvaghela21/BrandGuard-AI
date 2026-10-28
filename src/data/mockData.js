export const INITIAL_RULES = [
  {
    id: "R1",
    category: "Legal & Claims",
    severity: "High",
    title: "No Unverified Guarantees or Absolute Cures",
    description: "Unconditional guarantee claims, 100% cure promises, and absolute superlative efficacy claims without prior clinical trial approval are strictly prohibited in marketing assets.",
    bannedPatterns: ["guarantees 100%", "100% cure", "miraculous", "instant cure", "unconditional guarantee"],
    approvedFacts: ["Clinical efficacy depends on individual condition and diagnosis."]
  },
  {
    id: "R2",
    category: "Terminology",
    severity: "Low",
    title: "Approved Customer Nomenclature",
    description: "Do not refer to clients or patients as generic 'users'. Use the respectful terminology 'customer', 'patient', or 'client'.",
    bannedPatterns: ["user", "users"],
    approvedFacts: ["Preferred term is 'customer' or 'patient'."]
  },
  {
    id: "R3",
    category: "Visual & Palette",
    severity: "Medium",
    title: "Brand Core Palette & Contrast Compliance",
    description: "Creatives must strictly align with brand core hex codes: Deep Navy (#001F3F) and Ocean Teal (#0E7C86). Loud neon colors like Neon Purple (#9851E0) are prohibited. Text contrast must pass WCAG AA (≥ 4.5:1).",
    bannedPatterns: ["#9851E0", "#FF007F"],
    approvedFacts: ["Primary: #001F3F, Secondary: #0E7C86, Contrast threshold: 4.5:1"]
  },
  {
    id: "R4",
    category: "Compliance & Pricing",
    severity: "High",
    title: "Mandatory Disclaimer on 'Zero Fees' / Free Claims",
    description: "Any mention of 'zero fees' or 'free treatment' must include an explicit asterisk (*) and accompanying disclaimer detailing terms and eligibility.",
    bannedPatterns: ["zero fees", "completely free"],
    approvedFacts: ["Must cite terms: 'on covered preventive care*'"]
  }
];

export const INITIAL_PALETTE = [
  { name: "Deep Navy", hex: "#001F3F", role: "Primary Brand Color" },
  { name: "Ocean Teal", hex: "#0E7C86", role: "Secondary Accent" },
  { name: "Pure Slate", hex: "#0F172A", role: "Dark Background" },
  { name: "Snow White", hex: "#FFFFFF", role: "Light Text / Canvas" },
];

export const DEMO_SCENARIO = {
  title: "CarePlus Health-tech Diwali Banner 2026",
  campaign: "Diwali Festive Health Campaign",
  draftText: "Our healthcare policy guarantees 100% cure for all illnesses with zero fees! Don't miss out on this miraculous treatment for every user.",
  bannerImageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=60",
  bannerDominantColor: "#9851E0", // Neon Purple from the PDF scenario!
  bannerContrastRatio: 2.3, // Failed WCAG AA (< 4.5)
};

export const INITIAL_AUDIT_HISTORY = [
  {
    id: "AUD-8021",
    title: "Quarterly Wellness Subscription Newsletter",
    author: "Priyansh Vaghela (Creator)",
    approver: "Sanskruti Antala (Brand Manager)",
    date: "2026-10-25 14:32",
    status: "Approved",
    score: 95,
    issuesFound: 2,
    issuesFixed: 2,
    originalText: "Get 100% guaranteed immunity boost with our latest daily health pack for every user.",
    finalText: "Support your natural immunity with our latest daily health pack for every customer*."
  },
  {
    id: "AUD-8018",
    title: "Preventive Cardiac Care Social Ad",
    author: "Marketing Agency X",
    approver: "Reviewer Team",
    date: "2026-10-24 18:15",
    status: "Changes Requested",
    score: 62,
    issuesFound: 4,
    issuesFixed: 1,
    originalText: "Never worry about heart attacks again with our breakthrough digital monitor.",
    finalText: "Monitor cardiovascular vital signs with our certified digital monitor."
  }
];
