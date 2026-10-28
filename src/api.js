import { seededDashboard } from './data'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const DEMO_DELAY = 240

export const isApiConfigured = Boolean(API_BASE_URL)
export const hasTurnstileKey = Boolean(import.meta.env.VITE_TURNSTILE_SITE_KEY)

function normalizeIssue(issue) {
  return {
    ...issue,
    id: issue.id || issue.rule_id,
    severity: issue.severity || 'Low',
    type: issue.type || issue.rule_name || 'Brand rule',
    quote: issue.quote || '',
    explanation: issue.explanation || '',
    rewrite: issue.rewrite || issue.suggested_rewrite || '',
    verified: issue.verified ?? issue.verification_status === 'verified',
    state: issue.state || 'open',
  }
}

function normalizeReview(review) {
  if (!review) return null
  return {
    ...review,
    title: review.title || review.name || 'Untitled review',
    author: review.author || review.submitted_by || 'Unknown author',
    submittedAt: review.submittedAt || review.submitted_at || 'Recently',
    contentType: review.contentType || review.content_type || 'Draft copy',
    version: review.version || '—',
    draftTitle: review.draftTitle || review.draft_title || 'Draft copy',
    draft: review.draft || review.draft_text || '',
    issues: (review.issues || review.findings || []).map(normalizeIssue).filter((issue) => issue.verified),
  }
}

function normalizeQueueItem(item) {
  return {
    ...item,
    id: item.id || item.review_id || item.title,
    title: item.title || item.name || 'Untitled review',
    author: item.author || item.submitted_by || 'Unknown author',
    status: item.status || 'In review',
    issues: item.issues ?? item.findings_count ?? 0,
    time: item.time || item.submitted_at || 'Recently',
  }
}

function authHeaders() {
  const token = sessionStorage.getItem('brandguard_access_token') || localStorage.getItem('brandguard_access_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...authHeaders(), ...options.headers },
  })

  if (!response.ok) {
    const error = new Error(response.status === 403 ? 'You do not have permission to perform this action.' : `Request failed (${response.status}).`)
    error.status = response.status
    throw error
  }

  return response.status === 204 ? null : response.json()
}

function demoResponse(value) {
  return new Promise((resolve) => window.setTimeout(() => resolve(structuredClone(value)), DEMO_DELAY))
}

export async function getDashboard() {
  if (!isApiConfigured) return demoResponse(seededDashboard)

  const queue = await request('/reviews')
  const reviews = (Array.isArray(queue) ? queue : queue.items || []).map(normalizeQueueItem)
  const current = reviews.find((review) => ['in review', 'pending'].includes(String(review.status).toLowerCase())) || reviews[0]
  const review = current ? normalizeReview(await request(`/reviews/${current.id}`)) : null
  return { queue: reviews, review, metrics: queue.metrics || seededDashboard.metrics }
}

export function createReview(payload) {
  if (!isApiConfigured) return demoResponse({ ...payload, id: `demo-${Date.now()}`, status: 'In review' })
  return request('/reviews', { method: 'POST', body: JSON.stringify(payload) })
}

export function decideReview(reviewId, decision, note = '') {
  if (!isApiConfigured) return demoResponse({ id: reviewId, decision, note })
  return request(`/reviews/${reviewId}/decision`, { method: 'POST', body: JSON.stringify({ decision, note }) })
}

export async function loginUser({ email, password, turnstileToken, remember }) {
  if (!isApiConfigured) {
    await demoResponse(true)
    return { access_token: `demo-token-${Date.now()}`, user: { name: 'Priyansh Vaghela', email, role: import.meta.env.VITE_DEMO_ROLE || 'creator', role_verified: true }, remember }
  }

  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, turnstile_token: turnstileToken, remember }),
  })
}

export async function registerUser({ name, email, password, requestedRole, company, jobTitle, department, employeeId, verificationCode, turnstileToken }) {
  if (!isApiConfigured) {
    await demoResponse(true)
    return { id: `demo-signup-${Date.now()}`, message: 'Account request created.' }
  }

  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, requested_role: requestedRole, company, job_title: jobTitle, department, employee_id: employeeId, verification_code: verificationCode, turnstile_token: turnstileToken }),
  })
}
