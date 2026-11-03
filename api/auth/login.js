import { findUserByEmail, verifyPassword, signToken, checkRateLimit } from '../_shared.js'

export default async function handler(req, res) {
  // Enforce CORS headers
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-turnstile-token')
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed',
      message: 'Authentication requests must use HTTP POST'
    })
  }

  // Rate Limiting by IP
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1'
  const rateLimit = checkRateLimit(clientIp, 8, 60000)
  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', rateLimit.retryAfter)
    return res.status(429).json({
      success: false,
      error: 'Rate Limit Exceeded',
      message: `Too many login attempts. Account temporarily locked for ${rateLimit.retryAfter} seconds.`
    })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}
    const { email, password, turnstileToken } = body

    // Server-side validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Both email and password are required.'
      })
    }

    // Server-side Turnstile verification check
    // (If token provided, ensure it is non-empty string)
    if (turnstileToken !== undefined && !turnstileToken) {
      return res.status(400).json({
        success: false,
        error: 'CAPTCHA Failed',
        message: 'Cloudflare Turnstile bot verification check failed.'
      })
    }

    // Lookup User
    const user = findUserByEmail(email)
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication Failed',
        message: 'No registered workspace account found with this email address.'
      })
    }

    // Verify Password (via PBKDF2 hash or fallback)
    const isValid = (user.plainFallback && user.plainFallback === password) ||
                    (user.passwordHash && verifyPassword(password, user.passwordHash))

    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid Credentials',
        message: 'Incorrect password entered. Please verify credentials.'
      })
    }

    // Generate JWT Token signed with HMAC-SHA256
    const tokenPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      portalType: user.portalType,
      workspace: user.workspace
    }
    const token = signToken(tokenPayload, 86400) // 24 hours

    // Set HttpOnly, Secure, SameSite Cookie
    res.setHeader(
      'Set-Cookie',
      `brandguard_session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`
    )

    return res.status(200).json({
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        portalType: user.portalType,
        roleLabel: user.roleLabel,
        workspace: user.workspace,
        jobTitle: user.jobTitle,
        department: user.department,
        employeeId: user.employeeId
      }
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: err.message
    })
  }
}
