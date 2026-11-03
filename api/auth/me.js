import { verifyToken, findUserByEmail } from '../_shared.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  if (req.method === 'OPTIONS') return res.status(200).end()

  // Extract token from Authorization header or Cookie
  let token = null
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7)
  } else if (req.headers.cookie) {
    const cookies = req.headers.cookie.split(';').map(c => c.trim())
    const sessionCookie = cookies.find(c => c.startsWith('brandguard_session='))
    if (sessionCookie) token = sessionCookie.split('=')[1]
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'No active session token provided.'
    })
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: 'Invalid Token',
      message: 'Session token has expired or has been tampered with.'
    })
  }

  const user = findUserByEmail(decoded.email) || decoded
  return res.status(200).json({
    success: true,
    user: {
      id: user.id || decoded.sub,
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
}
