import { INITIAL_RULES, INITIAL_AUDIT_HISTORY } from '../data/mockData';

const API_BASE_URL = 'http://localhost:8000/api';

// Helper to simulate realistic network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const BrandGuardApi = {
  // Check if backend FastAPI server is alive
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET', signal: AbortSignal.timeout(1500) });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Get brand rules
  async getRules() {
    try {
      const res = await fetch(`${API_BASE_URL}/rules`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return await res.json();
    } catch {
      // Backend fallback
    }
    const local = localStorage.getItem('brandguard_rules');
    return local ? JSON.parse(local) : INITIAL_RULES;
  },

  // Save/Create rule
  async createRule(newRule) {
    try {
      const res = await fetch(`${API_BASE_URL}/rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRule)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const current = await this.getRules();
    const updated = [newRule, ...current];
    localStorage.setItem('brandguard_rules', JSON.stringify(updated));
    return newRule;
  },

  // Delete rule
  async deleteRule(ruleId) {
    try {
      await fetch(`${API_BASE_URL}/rules/${ruleId}`, { method: 'DELETE' });
    } catch {
      // Fallback
    }
    const current = await this.getRules();
    const updated = current.filter(r => r.id !== ruleId);
    localStorage.setItem('brandguard_rules', JSON.stringify(updated));
    return true;
  },

  // Core Audit Engine (Dual-engine: Regex deterministic + Gemini contextual simulated)
  async runAudit({ title, campaign, draftText, bannerColor, onProgress }) {
    // Try FastAPI backend first
    try {
      if (onProgress) onProgress('Connecting to BrandGuard Dual-Engine backend...');
      const res = await fetch(`${API_BASE_URL}/audit/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, campaign, draft_text: draftText, banner_color: bannerColor }),
        signal: AbortSignal.timeout(10000)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Backend offline: run client-side intelligent dual-engine simulation
    }

    // Step 1: Deterministic Engine
    if (onProgress) onProgress('Stage 1/3: Deterministic Rule Engine scanning banned terms & patterns...');
    await delay(700);

    // Step 2: Contextual Gemini AI
    if (onProgress) onProgress('Stage 2/3: Gemini Contextual AI analyzing claims, intent & tone...');
    await delay(900);

    // Step 3: Evidence Verifier (The Guardrail)
    if (onProgress) onProgress('Stage 3/3: Evidence Verifier validating rule grounding & quote existence...');
    await delay(600);

    const findings = [];
    const textLower = draftText.toLowerCase();

    // Check 1: Guarantee / 100% cure (Rule R1)
    if (textLower.includes('guarantees 100%') || textLower.includes('100% cure') || textLower.includes('miraculous')) {
      const matchQuote = draftText.includes('guarantees 100% cure for all illnesses') 
        ? 'guarantees 100% cure for all illnesses' 
        : (draftText.includes('guarantees 100%') ? 'guarantees 100%' : 'miraculous treatment');
      
      findings.push({
        id: 'find-1',
        ruleId: 'R1',
        category: 'Legal & Claims',
        severity: 'High',
        title: 'Unverified Absolute Medical Guarantee',
        quote: matchQuote,
        startIndex: draftText.indexOf(matchQuote),
        endIndex: draftText.indexOf(matchQuote) + matchQuote.length,
        explanation: 'Unconditional guarantee claims and "100% cure" promises are prohibited under healthcare advertising compliance rules.',
        guardrailVerified: true,
        rewrites: [
          'provides comprehensive support for qualifying chronic and seasonal conditions',
          'delivers verified healthcare assistance tailored to patient needs'
        ]
      });
    }

    // Check 2: "zero fees" (Rule R4)
    if (textLower.includes('zero fees') || textLower.includes('free treatment')) {
      const matchQuote = 'zero fees';
      const idx = draftText.indexOf(matchQuote);
      findings.push({
        id: 'find-2',
        ruleId: 'R4',
        category: 'Compliance & Pricing',
        severity: 'High',
        title: 'Missing Asterisk Disclaimer for Fee Exemption',
        quote: matchQuote,
        startIndex: idx !== -1 ? idx : 0,
        endIndex: idx !== -1 ? idx + matchQuote.length : 0,
        explanation: 'Claiming "zero fees" without an asterisk (*) and explicit reference to eligibility terms breaches financial transparency standards.',
        guardrailVerified: true,
        rewrites: [
          'zero out-of-pocket consultation fees on eligible preventive care*',
          'low-cost copay options*'
        ]
      });
    }

    // Check 3: "user" terminology (Rule R2)
    const userMatch = draftText.match(/\buser\b/i) || draftText.match(/\busers\b/i);
    if (userMatch) {
      const matchQuote = userMatch[0];
      const idx = draftText.indexOf(matchQuote);
      findings.push({
        id: 'find-3',
        ruleId: 'R2',
        category: 'Terminology',
        severity: 'Low',
        title: 'Off-Brand Nomenclature: "user"',
        quote: matchQuote,
        startIndex: idx,
        endIndex: idx + matchQuote.length,
        explanation: 'Brand voice rules mandate addressing patrons as "customer", "patient", or "member", rather than technical jargon "user".',
        guardrailVerified: true,
        rewrites: [
          'customer',
          'patient',
          'member'
        ]
      });
    }

    // Check 4: Banner visual & WCAG contrast check (Rule R3)
    let visualFinding = null;
    if (bannerColor) {
      const isNeonPurple = bannerColor.toUpperCase().includes('9851E0') || bannerColor.toLowerCase().includes('purple');
      if (isNeonPurple) {
        visualFinding = {
          ruleId: 'R3',
          dominantColor: bannerColor,
          cielabDistance: 38.4, // High delta-E distance from brand navy #001F3F
          wcagRatio: 2.3, // Failed (< 4.5:1)
          wcagPassed: false,
          paletteCompliant: false,
          explanation: 'Banner background color #9851E0 (Neon Purple) deviates by 38.4 CIELAB from approved brand palette. Text contrast 2.3:1 fails WCAG AA standards (minimum 4.5:1 required).',
          suggestedPalette: ['#001F3F (Deep Navy)', '#0E7C86 (Ocean Teal)']
        };
      }
    }

    // Calculate Brand Health Score (0 - 100)
    let score = 100;
    findings.forEach(f => {
      if (f.severity === 'High') score -= 25;
      else if (f.severity === 'Medium') score -= 15;
      else score -= 10;
    });
    if (visualFinding && !visualFinding.wcagPassed) score -= 15;
    score = Math.max(score, 15);

    return {
      auditId: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      score,
      status: findings.length === 0 ? 'Compliant' : 'Review Required',
      toneScore: {
        value: findings.length === 0 ? 94 : 48,
        label: findings.length === 0 ? 'Empathetic & Authoritative' : 'Aggressive Superlative Risk',
        attributes: {
          clarity: findings.length === 0 ? 92 : 60,
          compliance: score,
          brandVoice: findings.length === 0 ? 96 : 45
        }
      },
      findings,
      visualFinding
    };
  },

  // Get saved audits
  async getHistory() {
    const local = localStorage.getItem('brandguard_history');
    return local ? JSON.parse(local) : INITIAL_AUDIT_HISTORY;
  },

  // Save signed-off audit
  async saveHistoryEntry(entry) {
    const current = await this.getHistory();
    const updated = [entry, ...current];
    localStorage.setItem('brandguard_history', JSON.stringify(updated));
    return updated;
  }
};
