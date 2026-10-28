export const seededIssues = [
  {
    id: 'R1',
    severity: 'High',
    type: 'Unsupported claim',
    quote: 'guarantees 100% results for every user',
    explanation: 'Absolute guarantees need approved evidence. This claim is not present in the approved facts.',
    rewrite: 'delivers verified, comprehensive support for your health journey',
    state: 'open',
    verified: true,
  },
  {
    id: 'R2',
    severity: 'Low',
    type: 'Terminology',
    quote: 'user',
    explanation: 'Use the approved term “customer” or “patient” in customer-facing content.',
    rewrite: 'customer',
    state: 'open',
    verified: true,
  },
  {
    id: 'R3',
    severity: 'Medium',
    type: 'Brand tone',
    quote: '#9851E0',
    explanation: 'Banner background #9851E0 (Neon Purple) deviates by 38.4 CIELAB from CarePlus palette. Text contrast 2.3:1 fails WCAG AA standards (minimum 4.5:1 required).',
    rewrite: 'Use approved navy #001F3F',
    state: 'open',
    verified: true,
  },
]

export const seededQueueItems = [
  { id: 'review-1', title: 'CarePlus Diwali campaign', author: 'Priyansh Vaghela', authorEmail: 'client@brandguard.ai', status: 'Pending', issues: 3, time: '12 min ago', tone: 'amber' },
  { id: 'review-2', title: 'Q4 product announcement', author: 'Nisha Shah', authorEmail: 'nisha@agency.com', status: 'Changes requested', issues: 1, time: '1 hr ago', tone: 'rose' },
  { id: 'review-3', title: 'Customer success email', author: 'Rohan Patel', authorEmail: 'rohan@freelance.org', status: 'Approved', issues: 0, time: 'Yesterday', tone: 'green' },
  { id: 'review-4', title: 'Preventive Care Mobile Ad', author: 'Priyansh Vaghela', authorEmail: 'client@brandguard.ai', status: 'Approved', issues: 0, time: '2 days ago', tone: 'green' },
]

export const seededReview = {
  id: 'review-1',
  title: 'CarePlus Diwali campaign',
  author: 'Priyansh Vaghela',
  submittedAt: '12 minutes ago',
  contentType: 'Social media banner & copy',
  version: 'v3.2',
  draftTitle: 'Festival of faster, smarter care',
  draft: 'Meet the future of healthcare with CarePlus. Our app guarantees 100% results for every user, so you can spend less time worrying and more time living.\n\nJoin millions of user this Diwali and discover care that puts you first. Download today.',
  bannerColor: '#9851E0',
  issues: seededIssues,
}

export const seededDashboard = {
  queue: seededQueueItems,
  review: seededReview,
  metrics: {
    needsReview: '04',
    averageReviewTime: '8m 42s',
    approvalRate: '92.4%',
    activeRules: '28',
  },
}

export const seededRules = [
  {
    id: 'R1',
    category: 'Legal & Claims',
    severity: 'High',
    title: 'Absolute Medical Guarantees & Cure Claims',
    description: 'Prohibits unqualified guarantees ("100% cure", "miraculous results") without regulatory substantiated clinical evidence.',
    bannedPatterns: ['guarantees 100%', '100% cure', 'miraculous treatment', 'guaranteed results'],
    approvedFacts: ['clinically proven relief in eligible cohorts', 'verified care pathways'],
    status: 'Active',
    triggerCount: 42
  },
  {
    id: 'R2',
    category: 'Terminology',
    severity: 'Low',
    title: 'Patient-Centric Nomenclature',
    description: 'Mandates referring to individuals as "customer", "patient", or "member" instead of technical jargon "user".',
    bannedPatterns: ['user', 'users', 'end-user'],
    approvedFacts: ['customer', 'patient', 'member'],
    status: 'Active',
    triggerCount: 26
  },
  {
    id: 'R3',
    category: 'Visual & Palette',
    severity: 'Medium',
    title: 'CIELAB Color Delta-E & WCAG AA Contrast',
    description: 'Enforces brand palette (#001F3F Navy, #0E7C86 Teal). Flags color deviations > 12 CIELAB and contrast < 4.5:1.',
    bannedPatterns: ['#9851E0', 'neon purple', 'electric pink'],
    approvedFacts: ['#001F3F (Deep Navy)', '#0E7C86 (Ocean Teal)', '#FFFFFF (Crisp White)'],
    status: 'Active',
    triggerCount: 19
  },
  {
    id: 'R4',
    category: 'Compliance & Pricing',
    severity: 'High',
    title: 'Zero Fees & Free Treatment Asterisk Disclaimer',
    description: 'Any claim mentioning "zero fees" or "free consultation" must include an asterisk (*) referencing eligibility conditions.',
    bannedPatterns: ['zero fees without asterisk', 'free treatment without conditions'],
    approvedFacts: ['zero out-of-pocket consultation fees on eligible plans*'],
    status: 'Active',
    triggerCount: 13
  }
]

export const seededPalette = [
  { name: 'Deep Navy', hex: '#001F3F', role: 'Primary Brand Color', contrast: '14.2:1 (Pass AAA)' },
  { name: 'Ocean Teal', hex: '#0E7C86', role: 'Secondary Accent', contrast: '4.8:1 (Pass AA)' },
  { name: 'Pure White', hex: '#FFFFFF', role: 'Background Canvas', contrast: '21:1 (Pass AAA)' },
  { name: 'Mint Green', hex: '#BAF57F', role: 'Compliance Highlight', contrast: '8.4:1 (Pass AAA)' },
]

export const seededAuditHistory = [
  {
    auditId: 'AUD-9104',
    title: 'CarePlus Diwali campaign',
    author: 'Priyansh Vaghela (Creator)',
    approver: 'Sanskruti Antala (Brand Manager)',
    date: '2026-10-27 10:45',
    status: 'Approved',
    score: 95,
    issuesFixed: 3,
    originalText: 'Meet the future of healthcare with CarePlus. Our app guarantees 100% results for every user... Join millions of user this Diwali.',
    approvedText: 'Meet the future of healthcare with CarePlus. Our app delivers verified, comprehensive support for every customer... Join millions of customers this Diwali.',
    aiSuggestions: [
      {
        id: 'R1',
        type: 'Medical Guarantee Violation',
        severity: 'High',
        quote: 'guarantees 100% results for every user',
        explanation: 'Medical regulatory policy prohibits unconditional efficacy guarantees without clinical verification.',
        rewrite: 'delivers verified, comprehensive support for every customer',
        state: 'applied'
      },
      {
        id: 'R2',
        type: 'Brand Nomenclature Policy',
        severity: 'Low',
        quote: 'user',
        explanation: 'CarePlus brand voice mandates using "customer" or "patient" instead of technical term "user".',
        rewrite: 'customer',
        state: 'applied'
      },
      {
        id: 'R3',
        type: 'Grammar & Tone Agreement',
        severity: 'Medium',
        quote: 'Join millions of user',
        explanation: 'Plurality mismatch in festive campaign copy.',
        rewrite: 'Join millions of customers',
        state: 'applied'
      }
    ]
  },
  {
    auditId: 'AUD-8842',
    title: 'Annual Wellness Checkup Promo',
    author: 'Aarav Mehta (Creator)',
    approver: 'Sanskruti Antala (Brand Manager)',
    date: '2026-10-26 14:12',
    status: 'Approved',
    score: 100,
    issuesFixed: 1,
    originalText: 'Book today for zero fees consultation and meet our specialist doctors.',
    approvedText: 'Book today for zero out-of-pocket consultation fees on eligible plans* and meet our specialist doctors.',
    aiSuggestions: [
      {
        id: 'R1',
        type: 'Pricing Transparency Policy',
        severity: 'High',
        quote: 'zero fees consultation',
        explanation: 'Financial compliance mandates disclosing qualification criteria ("eligible plans*") to avoid misleading claims.',
        rewrite: 'zero out-of-pocket consultation fees on eligible plans*',
        state: 'applied'
      }
    ]
  },
  {
    auditId: 'AUD-8720',
    title: 'Q4 Enterprise Healthcare Launch',
    author: 'Nisha Shah (Creator)',
    approver: 'Review Team',
    date: '2026-10-25 18:30',
    status: 'Changes Requested',
    score: 65,
    issuesFixed: 0,
    originalText: 'Our healthcare platform guarantees 100% cure for workplace stress and anxiety.',
    approvedText: 'Draft returned for revision. Replaced with evidence-backed mental health wellness assistance.',
    aiSuggestions: [
      {
        id: 'R1',
        type: 'Unsubstantiated Clinical Claim',
        severity: 'Critical',
        quote: 'guarantees 100% cure for workplace stress and anxiety',
        explanation: 'Strict prohibition on absolute clinical curative claims for mental wellness products.',
        rewrite: 'delivers evidence-backed mental health wellness assistance for enterprise teams',
        state: 'open'
      }
    ]
  }
]
