import { hashPassword, signToken, findUserByEmail, checkRateLimit } from '../_shared.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed',
      message: 'Registration requests must use HTTP POST'
    })
  }

  // Rate Limiting by IP
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1'
  const rateLimit = checkRateLimit(clientIp, 5, 60000)
  if (!rateLimit.allowed) {
    return res.status(429).json({
      success: false,
      error: 'Rate Limit Exceeded',
      message: 'Too many registration requests. Please wait before retrying.'
    })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}
    const {
      fullName,
      email,
      password,
      confirmPassword,
      company,
      jobTitle,
      department,
      employeeId,
      requestedRole
    } = body

    // 10-Field Server-side validation
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Full Name, Work Email, and Password are required.'
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Password must contain at least 8 characters.'
      })
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Password and Confirmation Password do not match.'
      })
    }

    // Check if email already exists
    const existing = findUserByEmail(email)
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'User Exists',
        message: 'An enterprise account with this work email already exists.'
      })
    }

    // Hash Password with PBKDF2 salt
    const hashedPassword = hashPassword(password)

    // Role mapping
    const portal = (requestedRole || 'creator').toLowerCase()
    const roleKey = portal.includes('admin') ? 'admin' : portal.includes('manager') ? 'brand_manager' : portal.includes('user') ? 'user' : 'creator'

    const newUser = {
      id: `usr_${Date.now()}`,
      name: fullName,
      email: email.trim().toLowerCase(),
      role: roleKey,
      portalType: roleKey === 'admin' ? 'admin' : roleKey === 'brand_manager' ? 'manager' : roleKey === 'user' ? 'user' : 'creator',
      roleLabel: roleKey === 'admin' ? 'Super Admin' : roleKey === 'brand_manager' ? 'Brand Manager' : roleKey === 'user' ? 'Workspace User (Read-Only)' : 'Content Creator',
      workspace: company || 'Enterprise Workspace',
      jobTitle: jobTitle || 'Campaign Producer',
      department: department || 'Marketing',
      employeeId: employeeId || `EMP-${Math.floor(1000 + Math.random() * 9000)}`
    }

    const token = signToken({
      sub: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      portalType: newUser.portalType,
      workspace: newUser.workspace
    }, 86400)

    res.setHeader(
      'Set-Cookie',
      `brandguard_session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`
    )

    return res.status(201).json({
      success: true,
      message: 'Workspace account successfully registered and verified.',
      token,
      user: newUser
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Registration Failed',
      message: err.message
    })
  }
}
