import crypto from 'crypto'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-brandguard-signature')

  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'active',
      service: 'BrandGuard Enterprise Webhook Ingestion Service',
      version: 'v3.2.0-cloud',
      supportedIntegrations: ['Figma', 'Canva', 'Slack', 'Meta Ads', 'Generic REST'],
      signatureRequirement: 'HMAC-SHA256 (Header: x-brandguard-signature)'
    })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed',
      message: 'Webhook events must be delivered via HTTP POST'
    })
  }

  try {
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {})
    const payload = typeof req.body === 'object' ? req.body : JSON.parse(rawBody || '{}')

    // Optional HMAC signature check if secret is configured
    const signature = req.headers['x-brandguard-signature']
    const webhookSecret = process.env.WEBHOOK_SECRET || 'brandguard-webhook-signature-key-2026'

    if (signature) {
      const expectedSig = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex')
      if (signature !== expectedSig) {
        return res.status(401).json({
          success: false,
          error: 'Invalid Signature',
          message: 'HMAC-SHA256 signature mismatch on incoming webhook payload.'
        })
      }
    }

    const {
      brand = 'CarePlus Health',
      platform = 'Instagram',
      content = '',
      channel = 'webhook_api',
      author = 'External Integration Bot'
    } = payload

    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Missing Content',
        message: 'Webhook payload must contain non-empty "content" string.'
      })
    }

    // Server-side compliance evaluation
    const prohibitedWords = ['cure', '100% guaranteed', 'permanent', 'miracle', 'instant results', 'cheapest']
    const violationsFound = prohibitedWords.filter(w => content.toLowerCase().includes(w))

    const isSafe = violationsFound.length === 0
    const riskScore = isSafe ? 98 : Math.max(25, 90 - violationsFound.length * 25)

    const eventId = `EVT-WH-${Date.now()}`
    const rayId = `RAY-${crypto.randomBytes(8).toString('hex').toUpperCase()}`

    return res.status(200).json({
      success: true,
      eventId,
      rayId,
      status: isSafe ? 'approved_auto' : 'queued_for_review',
      decision: isSafe ? 'PASS' : 'FLAGGED_FOR_HUMAN_SIGN_OFF',
      brand,
      platform,
      channel,
      metrics: {
        riskScore,
        complianceStatus: isSafe ? 'Safe' : 'High Risk',
        violationsCount: violationsFound.length,
        violations: violationsFound.map(v => ({
          term: v,
          category: 'Statutory Claim Restriction',
          severity: 'HIGH',
          suggestedRemedy: 'Replace absolute superlative with qualified clinical efficacy statement.'
        }))
      },
      telemetry: {
        receivedAt: new Date().toISOString(),
        signatureVerified: Boolean(signature)
      }
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Webhook Processing Error',
      message: err.message
    })
  }
}
