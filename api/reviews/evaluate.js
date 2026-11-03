import crypto from 'crypto'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed',
      message: 'Evaluation requests must use HTTP POST'
    })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}
    const { draftText = '', brandName = 'CarePlus Health', category = 'Ad Script' } = body

    if (!draftText.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Draft text cannot be empty.'
      })
    }

    const rules = [
      {
        id: 'RULE_01',
        title: 'Absolute Health / Medical Cures',
        category: 'Legal & Claims',
        regex: /(cure|cures|permanently\s+cures|eradicates|guaranteed\s+cure)/i,
        explanation: 'Regulatory laws prohibit claiming permanent cures without clinical drug certification.',
        suggestedFix: 'helps visibly reduce the appearance of'
      },
      {
        id: 'RULE_02',
        title: 'Unverified Timeframe Guarantees',
        category: 'Legal & Claims',
        regex: /(in\s+8\s+hours|overnight\s+results|instant\s+fix|7\s+days\s+guaranteed)/i,
        explanation: 'Time-bound clinical promises violate advertising standards without certified trial backing.',
        suggestedFix: 'with regular, consistent usage'
      },
      {
        id: 'RULE_03',
        title: 'Absolute Superlatives & Exaggerations',
        category: 'Terminology',
        regex: /(100%\s+effective|miracle\s+formula|zero\s+risk|never\s+fails)/i,
        explanation: 'Absolute superlatives must carry qualification statements.',
        suggestedFix: 'formulated to deliver high-performance care'
      },
      {
        id: 'RULE_04',
        title: 'Missing Mandatory Slogan or Disclaimer',
        category: 'Compliance & Pricing',
        regex: /(cheapest|free|lowest\s+price)/i,
        explanation: 'Pricing superlatives require explicit terms and conditions references.',
        suggestedFix: 'exceptional value starting from approved tier'
      }
    ]

    const violations = []
    let compliantCopy = draftText

    for (const rule of rules) {
      const match = draftText.match(rule.regex)
      if (match) {
        violations.push({
          ruleId: rule.id,
          title: rule.title,
          category: rule.category,
          offendingSnippet: match[0],
          severity: 'HIGH',
          explanation: rule.explanation,
          suggestedFix: rule.suggestedFix
        })
        compliantCopy = compliantCopy.replace(rule.regex, rule.suggestedFix)
      }
    }

    const totalViolations = violations.length
    const score = totalViolations === 0 ? 100 : Math.max(15, 100 - (totalViolations * 28))
    const riskTier = score >= 90 ? 'Safe' : score >= 70 ? 'Normal' : score >= 45 ? 'Moderate' : 'High Risk'

    const auditRayId = `RAY-${crypto.randomBytes(6).toString('hex').toUpperCase()}`

    return res.status(200).json({
      success: true,
      auditRayId,
      brandName,
      category,
      score,
      riskTier,
      unresolvedViolationsCount: totalViolations,
      violations,
      isCompliantForApproval: totalViolations === 0,
      suggestedCompliantRewrite: compliantCopy,
      evaluatedAt: new Date().toISOString()
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Evaluation Error',
      message: err.message
    })
  }
}
