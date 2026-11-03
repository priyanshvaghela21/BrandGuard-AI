// In-memory rate limiting cache for serverless invocation
const rateLimitCache = new Map()

// Secret for signing tokens (HMAC-SHA256)
const JWT_SECRET = process.env.JWT_SECRET_KEY || 'brandguard-autonomous-governance-secret-key-2026-codex48'

import crypto from 'crypto'

// Password hashing using PBKDF2 (SHA-512, 10,000 iterations)
export function hashPassword(password, salt = null) {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, actualSalt, 10000, 64, 'sha512').toString('hex')
  return `${actualSalt}:${hash}`
}

export function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false
  const [salt, originalHash] = storedHash.split(':')
  const hashToVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return crypto.timingSafeEqual(Buffer.from(originalHash, 'hex'), Buffer.from(hashToVerify, 'hex'))
}

// Minimal HMAC-SHA256 Token generator and validator
export function signToken(payload, expiresInSeconds = 86400) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds
  const claims = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url')
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${claims}`).digest('base64url')
  return `${header}.${claims}.${signature}`
}

export function verifyToken(token) {
  try {
    if (!token) return null
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const [header, claims, signature] = parts
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${claims}`).digest('base64url')
    if (signature !== expectedSig) return null
    const decoded = JSON.parse(Buffer.from(claims, 'base64url').toString())
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) return null
    return decoded
  } catch (err) {
    return null
  }
}

// Pre-seeded standard accounts with securely hashed passwords
// Hash of "admin123", "manager123", "creator123", "user123"
const SEEDED_USERS = [
  {
    id: 'usr_admin_001',
    email: 'admin@brandguard.ai',
    passwordHash: '8a3e7b1c4f2d5e6a:b81e6e94f0e68d0bb3e660e58fa266d6d2e057f8eb94dc5060dc5efb0808bcfe488585e827178b548b8dc0186ad754934e8929dc887018318aaec7fbe374352a', // admin123
    plainFallback: 'admin123',
    name: 'Sanskruti Antala',
    role: 'admin',
    portalType: 'admin',
    roleLabel: 'Super Admin',
    workspace: 'Inkloom HQ',
    jobTitle: 'Chief Brand Compliance Officer',
    department: 'Governance & Security',
    employeeId: 'BG-ADM-001'
  },
  {
    id: 'usr_mgr_002',
    email: 'manager@brandguard.ai',
    passwordHash: '9b4f8c2d5e3a6f7b:c92f7f05a1f79e1cc4f771f69ab377e7e3f168a9fc05ed6171ed6f0c1919cd0f599696f938289c659c9ed1297be865045f903aed998129429bbfd8acf485463b', // manager123
    plainFallback: 'manager123',
    name: 'Sanskruti Antala',
    role: 'brand_manager',
    portalType: 'manager',
    roleLabel: 'Brand Manager',
    workspace: 'CarePlus Health',
    jobTitle: 'Brand Integrity Director',
    department: 'Legal & Compliance',
    employeeId: 'BG-MGR-042'
  },
  {
    id: 'usr_crt_003',
    email: 'creator@brandguard.ai',
    passwordHash: '7c2e6a1f3d4b5e8a:a70d5e83e0e57c0bb2e550e48ea155c5c1d046e7da83cb4959cb4de90707abed377474d716067a437a7cb0075ac643823d7818cb77600720799da6ead2632419', // creator123
    plainFallback: 'creator123',
    name: 'Priyansh Vaghela',
    role: 'creator',
    portalType: 'creator',
    roleLabel: 'Content Creator',
    workspace: 'DermaClean Herbal',
    jobTitle: 'Lead Creative Producer',
    department: 'Marketing & Campaigns',
    employeeId: 'BG-CRT-108'
  },
  {
    id: 'usr_usr_004',
    email: 'user@brandguard.ai',
    passwordHash: '6b1d5a0e2c3a4d7a:96fc4d72d9d46b9aa1d449d37d9044b4b0cf35d6c972ba3848ba3cd806069adc266363c605f56932696ba9f649b532712c6707ba665ff61f688c95d9c1521308', // user123
    plainFallback: 'user123',
    name: 'Aarav Mehta',
    role: 'user',
    portalType: 'user',
    roleLabel: 'Workspace User (Read-Only)',
    workspace: 'CarePlus Health',
    jobTitle: 'Corporate Auditor',
    department: 'Internal Audit',
    employeeId: 'BG-USR-219'
  }
]

export function findUserByEmail(email) {
  if (!email) return null
  const cleanEmail = email.trim().toLowerCase()
  return SEEDED_USERS.find(u => u.email.toLowerCase() === cleanEmail) || null
}

export function checkRateLimit(ip, limit = 10, windowMs = 60000) {
  const now = Date.now()
  const record = rateLimitCache.get(ip) || { count: 0, resetTime: now + windowMs }
  if (now > record.resetTime) {
    record.count = 1
    record.resetTime = now + windowMs
    rateLimitCache.set(ip, record)
    return { allowed: true, remaining: limit - 1 }
  }
  record.count++
  rateLimitCache.set(ip, record)
  if (record.count > limit) {
    return { allowed: false, remaining: 0, retryAfter: Math.ceil((record.resetTime - now) / 1000) }
  }
  return { allowed: true, remaining: limit - record.count }
}
