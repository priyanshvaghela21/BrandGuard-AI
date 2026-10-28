import { useState } from 'react'

export default function AkiraWorkflowPipeline({
  currentReview,
  complianceScore = 85,
  issues = [],
  currentUser = null,
  currentRole = 'creator',
  onNavigateToQueue,
  onNavigateToNewReview
}) {
  const [activeView, setActiveView] = useState('workflow') // 'workflow' | 'roles' | 'architecture'
  const [simulatedScenario, setSimulatedScenario] = useState('escalate') // 'auto' | 'reject' | 'escalate'
  const [roleFocus, setRoleFocus] = useState('all') // 'all' | 'admin' | 'manager' | 'creator' | 'user'

  // Determine current active path based on simulation or live currentReview
  const liveRoute = currentReview?.route_decision || (
    complianceScore < 45 || issues.some((i) => (i.explanation || '').toLowerCase().includes('zero chemical') || (i.quote || '').toLowerCase().includes('cancer'))
      ? 'Reject'
      : complianceScore >= 80 && !issues.some((i) => i.severity === 'High')
      ? 'Auto-Resolve'
      : 'Escalate'
  )

  const effectiveRoute = simulatedScenario === 'auto' ? 'Auto-Resolve' : simulatedScenario === 'reject' ? 'Reject' : 'Escalate'

  const toxicityScore = effectiveRoute === 'Reject' ? 42 : effectiveRoute === 'Auto-Resolve' ? 96 : 74
  const sentiment = effectiveRoute === 'Reject' ? 'High Risk / Unsubstantiated' : effectiveRoute === 'Auto-Resolve' ? 'Promotional / Compliant' : 'Aggressive Medical Claim'
  const contextTags = effectiveRoute === 'Reject'
    ? ['[FDA 21 CFR 312]', '[Prohibited Medical Cure]', '[FTC Section 5]']
    : effectiveRoute === 'Auto-Resolve'
    ? ['[Botanical Cosmetics]', '[FTC Pricing Transparency]', '[WCAG AA]']
    : ['[Dermatological Claim]', '[Unverified Overnight Guarantee]', '[Regulatory Review]']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(16, 32, 43, 0.95), rgba(9, 18, 24, 0.98))',
          border: '1px solid #233b49',
          borderRadius: '12px',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.35)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span
              style={{
                fontSize: '10px',
                fontWeight: '900',
                padding: '3px 8px',
                borderRadius: '5px',
                background: 'rgba(186, 245, 127, 0.15)',
                color: 'var(--mint, #baf57f)',
                border: '1px solid rgba(186, 245, 127, 0.35)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              Akira AI Standard v2.4
            </span>
            <span style={{ fontSize: '11px', color: '#7f939f' }}>• Autonomous Content Governance &amp; Routing Engine</span>
          </div>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#edf4f5', fontFamily: 'Manrope, sans-serif', fontWeight: 800 }}>
            Akira AI Content Governance &amp; Moderation Pipeline
          </h2>
          <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#8aa1ad', maxWidth: '680px', lineHeight: 1.5 }}>
            Automated 4-stage pipeline: Pre-filtering spam/blacklists, deep tagging for toxicity &amp; regulatory context, and 3-way dynamic routing (Auto-Resolve, Reject, Escalate).
          </p>
        </div>

        {/* View Switcher: Workflow vs Role Matrix vs Architecture */}
        <div style={{ display: 'flex', background: '#0e1a22', padding: '4px', borderRadius: '8px', border: '1px solid #233744', gap: '4px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setActiveView('workflow')}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: 0,
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              background: activeView === 'workflow' ? '#2563eb' : 'transparent',
              color: activeView === 'workflow' ? '#ffffff' : '#8aa1ad',
              transition: '0.2s'
            }}
          >
            ⚡ Akira AI Workflow (Image 1)
          </button>
          <button
            type="button"
            onClick={() => setActiveView('roles')}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: 0,
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              background: activeView === 'roles' ? '#2563eb' : 'transparent',
              color: activeView === 'roles' ? '#ffffff' : '#8aa1ad',
              transition: '0.2s'
            }}
          >
            👥 Role Matrix &amp; Utility
          </button>
          <button
            type="button"
            onClick={() => setActiveView('architecture')}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: 0,
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              background: activeView === 'architecture' ? '#2563eb' : 'transparent',
              color: activeView === 'architecture' ? '#ffffff' : '#8aa1ad',
              transition: '0.2s'
            }}
          >
            🐳 Docker Architecture (Image 2)
          </button>
        </div>
      </div>

      {activeView === 'workflow' ? (
        <>
          {/* Role Focus Selector Bar */}
          <div
            style={{
              background: '#0d1820',
              border: '1px solid #1f3647',
              borderRadius: '10px',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div>
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#edf4f5', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🎯 Filter Akira AI by Role Focus:
              </span>
              <span style={{ fontSize: '11px', color: '#7a929f' }}>
                Click a role to highlight which stages &amp; actions belong specifically to that role
              </span>
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: '🌐 All Roles' },
                { id: 'admin', label: '👑 Super Admin (Security & Reject)' },
                { id: 'manager', label: '🛡️ Brand Manager (80% Triage)' },
                { id: 'creator', label: '✍️ Creator (1-Click Rewrites)' },
                { id: 'user', label: '👤 User (Risk Guardrails)' }
              ].map((rf) => {
                const isActive = roleFocus === rf.id
                return (
                  <button
                    key={rf.id}
                    type="button"
                    onClick={() => setRoleFocus(rf.id)}
                    style={{
                      padding: '5px 11px',
                      borderRadius: '6px',
                      border: isActive ? '1px solid var(--mint, #baf57f)' : '1px solid #233b49',
                      background: isActive ? '#162e24' : '#081116',
                      color: isActive ? 'var(--mint, #baf57f)' : '#8fa2ae',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: '0.15s'
                    }}
                  >
                    {rf.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Simulation Scenario Controls */}
          <div
            style={{
              background: '#0e181f',
              border: '1px solid #203340',
              borderRadius: '10px',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#edf4f5' }}>Simulate Decision Route:</span>
              <span style={{ fontSize: '11px', color: '#7f939f' }}>(Click to test how Akira AI routes different content types)</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setSimulatedScenario('auto')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: simulatedScenario === 'auto' ? '1px solid #2e5944' : '1px solid #203340',
                  background: simulatedScenario === 'auto' ? '#152d22' : '#121e26',
                  color: simulatedScenario === 'auto' ? 'var(--mint, #baf57f)' : '#8aa1ad',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                🟢 1. Auto-Resolve (Compliant Copy)
              </button>

              <button
                type="button"
                onClick={() => setSimulatedScenario('reject')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: simulatedScenario === 'reject' ? '1px solid #5a2727' : '1px solid #203340',
                  background: simulatedScenario === 'reject' ? '#2c1414' : '#121e26',
                  color: simulatedScenario === 'reject' ? '#ff7878' : '#8aa1ad',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                🔴 2. Reject (Fatal / Scam Claim)
              </button>

              <button
                type="button"
                onClick={() => setSimulatedScenario('escalate')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: simulatedScenario === 'escalate' ? '1px solid #5a4b27' : '1px solid #203340',
                  background: simulatedScenario === 'escalate' ? '#2b2314' : '#121e26',
                  color: simulatedScenario === 'escalate' ? '#ffd27d' : '#8aa1ad',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                🟡 3. Escalate to Moderator (Admin Queue)
              </button>
            </div>
          </div>

          {/* Interactive Akira Flowchart (Matching Image 1) */}
          <div
            style={{
              background: '#091319',
              border: '1px solid #1c2e3a',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              position: 'relative',
              overflowX: 'auto'
            }}
          >
            {/* Top Linear Stages: Stage 1 -> Stage 2 -> Stage 3 -> Stage 4 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
                position: 'relative'
              }}
            >
              {/* STAGE 1: Incoming User Content */}
              <div
                style={{
                  background: 'linear-gradient(180deg, #12212b 0%, #0d1921 100%)',
                  border: (roleFocus === 'creator' || roleFocus === 'user') ? '2px solid #eab308' : '1px solid #274558',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  boxShadow: (roleFocus === 'creator' || roleFocus === 'user') ? '0 0 20px rgba(234, 179, 8, 0.3)' : '0 4px 16px rgba(0,0,0,0.2)',
                  transition: '0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--blue, #57abff)', textTransform: 'uppercase' }}>
                    Stage 01
                  </span>
                  <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', background: '#1c2f3d', color: '#90aab9' }}>
                    Input Stream
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '9px', background: 'rgba(234, 179, 8, 0.15)', color: '#fde047', border: '1px solid rgba(234, 179, 8, 0.3)', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                    ✍️ Creator &amp; 👤 User Origin
                  </span>
                </div>
                <h4 style={{ margin: 0, fontSize: '14px', color: '#edf4f5', fontWeight: '700' }}>
                  Incoming User Content
                </h4>
                <p style={{ margin: 0, fontSize: '11px', color: '#7f939f', lineHeight: 1.5 }}>
                  Marketing drafts, ad creatives, slogans, and banners submitted via Creator Content Studio.
                </p>
                <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #1c2f3d', fontSize: '10px', color: '#93a9b6' }}>
                  <b>Source:</b> {currentReview?.author || 'Creator Portal'} • <b>Format:</b> Text / Multimodal
                </div>
              </div>

              {/* STAGE 2: AI Filtering (Spam, Malware & Blacklist) */}
              <div
                style={{
                  background: 'linear-gradient(180deg, #12212b 0%, #0d1921 100%)',
                  border: roleFocus === 'admin' ? '2px solid #7c3aed' : '1px solid #274558',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  boxShadow: roleFocus === 'admin' ? '0 0 20px rgba(124, 58, 237, 0.35)' : '0 4px 16px rgba(0,0,0,0.2)',
                  transition: '0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--mint, #baf57f)', textTransform: 'uppercase' }}>
                    Stage 02
                  </span>
                  <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', background: '#172e23', color: 'var(--mint, #baf57f)' }}>
                    Passed ✓
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '9px', background: 'rgba(124, 58, 237, 0.15)', color: '#c4b5fd', border: '1px solid rgba(124, 58, 237, 0.3)', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                    👑 Super Admin Defense Gate
                  </span>
                </div>
                <h4 style={{ margin: 0, fontSize: '14px', color: '#edf4f5', fontWeight: '700' }}>
                  AI Filtering (Spam &amp; Blacklist)
                </h4>
                <p style={{ margin: 0, fontSize: '11px', color: '#7f939f', lineHeight: 1.5 }}>
                  Deterministic heuristic regex: Flags phishing URLs, malware, unverified absolute zero-chemical guarantees.
                </p>
                <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #1c2f3d', fontSize: '10px', color: '#93a9b6' }}>
                  <b>Spam:</b> Clean • <b>Blacklist check:</b> 100% Executed
                </div>
              </div>

              {/* STAGE 3: AI Tagging & Analysis (Toxicity, Sentiment, Context) */}
              <div
                style={{
                  background: 'linear-gradient(180deg, #12212b 0%, #0d1921 100%)',
                  border: roleFocus === 'creator' ? '2px solid #eab308' : '1px solid #274558',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  boxShadow: roleFocus === 'creator' ? '0 0 20px rgba(234, 179, 8, 0.35)' : '0 4px 16px rgba(0,0,0,0.2)',
                  transition: '0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: '800', color: '#ffb357', textTransform: 'uppercase' }}>
                    Stage 03
                  </span>
                  <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', background: '#2c2214', color: '#ffd27d' }}>
                    Gemini AI Tagged
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '9px', background: 'rgba(234, 179, 8, 0.15)', color: '#fde047', border: '1px solid rgba(234, 179, 8, 0.3)', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                    ✍️ Creator 1-Click Rewrite Engine
                  </span>
                </div>
                <h4 style={{ margin: 0, fontSize: '14px', color: '#edf4f5', fontWeight: '700' }}>
                  AI Tagging &amp; Deep Analysis
                </h4>
                <div style={{ fontSize: '11px', color: '#c5d5de', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div><b>Brand Safety:</b> <span style={{ color: toxicityScore > 80 ? 'var(--mint, #baf57f)' : toxicityScore > 50 ? '#ffd27d' : '#ff7878' }}>{toxicityScore}%</span></div>
                  <div><b>Sentiment:</b> {sentiment}</div>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '2px' }}>
                    {contextTags.map((tag) => (
                      <span key={tag} style={{ fontSize: '9px', background: '#1c2f3c', padding: '1px 5px', borderRadius: '3px', color: '#9ab3c2' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* STAGE 4: AI Routing (Decision Engine) */}
              <div
                style={{
                  background: 'linear-gradient(180deg, #162a37 0%, #0f1c25 100%)',
                  border: (roleFocus === 'manager' || roleFocus === 'admin') ? '2px solid #10b981' : '2px solid #3b82f6',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  boxShadow: (roleFocus === 'manager' || roleFocus === 'admin') ? '0 0 24px rgba(16, 185, 129, 0.35)' : '0 0 20px rgba(59, 130, 246, 0.25)',
                  transition: '0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: '800', color: '#60a5fa', textTransform: 'uppercase' }}>
                    Stage 04 Core
                  </span>
                  <span style={{ fontSize: '11px', padding: '2px 7px', borderRadius: '4px', background: '#1e3a8a', color: '#93c5fd', fontWeight: '700' }}>
                    {effectiveRoute}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '9px', background: 'rgba(5, 150, 105, 0.2)', color: '#6ee7b7', border: '1px solid rgba(5, 150, 105, 0.4)', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                    🛡️ Brand Manager Triage Engine
                  </span>
                </div>
                <h4 style={{ margin: 0, fontSize: '14px', color: '#ffffff', fontWeight: '800' }}>
                  AI Routing (Decision Engine)
                </h4>
                <p style={{ margin: 0, fontSize: '11px', color: '#a0b9c9', lineHeight: 1.5 }}>
                  Evaluates composite severity vectors and forks into 3 automated branches.
                </p>
                <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #233e52', fontSize: '10px', color: '#93c5fd' }}>
                  ⚡ Selected Branch: <b>{effectiveRoute}</b>
                </div>
              </div>
            </div>

            {/* Downward Connector Arrow to the 3-Way Fork */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '4px 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#7f939f', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Dynamic 3-Way Fork Execution
                </span>
                <span style={{ fontSize: '18px', color: '#60a5fa' }}>▼</span>
              </div>
            </div>

            {/* STAGE 4 BRANCHES (Matching Image 1: Auto-Resolve | Reject | Escalate) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '18px'
              }}
            >
              {/* BRANCH 1: Auto-Resolve */}
              <div
                style={{
                  background: effectiveRoute === 'Auto-Resolve' ? 'linear-gradient(180deg, #132b21 0%, #0d1e17 100%)' : '#0d181f',
                  border: effectiveRoute === 'Auto-Resolve' ? '2px solid var(--mint, #baf57f)' : '1px solid #1c2e39',
                  borderRadius: '10px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  opacity: effectiveRoute === 'Auto-Resolve' ? 1 : 0.6,
                  boxShadow: effectiveRoute === 'Auto-Resolve' ? '0 0 24px rgba(186, 245, 127, 0.2)' : 'none',
                  transition: '0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--mint, #baf57f)' }}>
                    🟢 BRANCH 1: AUTO-RESOLVE
                  </span>
                  <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: '#19382b', color: 'var(--mint, #baf57f)' }}>
                    Score &ge; 80
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', border: '1px solid rgba(16, 185, 129, 0.4)', fontWeight: '700' }}>
                    🛡️ Clears 80% Manager Workload
                  </span>
                </div>

                <div style={{ background: '#12241c', borderRadius: '8px', padding: '10px 12px', border: '1px solid #234737' }}>
                  <strong style={{ fontSize: '12px', color: '#d9f7be', display: 'block' }}>AI Auto-Resolve Action</strong>
                  <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#9bb8a8', lineHeight: 1.4 }}>
                    Automated insertion of mandatory FTC disclaimer (*Based on dermatological 60-day consumer study) &amp; terminology correction.
                  </p>
                </div>

                <div
                  style={{
                    marginTop: 'auto',
                    background: '#193b2c',
                    borderRadius: '8px',
                    padding: '12px',
                    border: '1px solid #2e664d',
                    textAlign: 'center'
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--mint, #baf57f)' }}>
                    ✓ Content Approved (Limited)
                  </span>
                  <small style={{ display: 'block', fontSize: '10px', color: '#b2d9c4', marginTop: '3px' }}>
                    Instant publication clearance with appended warning notes.
                  </small>
                </div>
              </div>

              {/* BRANCH 2: Reject */}
              <div
                style={{
                  background: effectiveRoute === 'Reject' ? 'linear-gradient(180deg, #2b1414 0%, #1c0d0d 100%)' : '#0d181f',
                  border: effectiveRoute === 'Reject' ? '2px solid #ef4444' : '1px solid #1c2e39',
                  borderRadius: '10px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  opacity: effectiveRoute === 'Reject' ? 1 : 0.6,
                  boxShadow: effectiveRoute === 'Reject' ? '0 0 24px rgba(239, 68, 68, 0.2)' : 'none',
                  transition: '0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#f87171' }}>
                    🔴 BRANCH 2: REJECT
                  </span>
                  <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: '#3b1616', color: '#fca5a5' }}>
                    Score &lt; 45 / Fatal
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.4)', fontWeight: '700' }}>
                    👑 Auto-Shields Admin from Legal Fines
                  </span>
                </div>

                <div style={{ background: '#241212', borderRadius: '8px', padding: '10px 12px', border: '1px solid #4a1d1d' }}>
                  <strong style={{ fontSize: '12px', color: '#fecaca', display: 'block' }}>Immediate AI Disqualification</strong>
                  <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#d19f9f', lineHeight: 1.4 }}>
                    Unverifiable health promises (&ldquo;100% cure for cancer&rdquo; or fatal scam words) violate national regulatory standards.
                  </p>
                </div>

                <div
                  style={{
                    marginTop: 'auto',
                    background: '#361515',
                    borderRadius: '8px',
                    padding: '12px',
                    border: '1px solid #5c2323',
                    textAlign: 'center'
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#fca5a5' }}>
                    ✕ Content Rejected
                  </span>
                  <small style={{ display: 'block', fontSize: '10px', color: '#fecaca', marginTop: '3px' }}>
                    Direct rejection notification returned to creator with regulatory citations.
                  </small>
                </div>
              </div>

              {/* BRANCH 3: Escalate to Human Moderator */}
              <div
                style={{
                  background: effectiveRoute === 'Escalate' ? 'linear-gradient(180deg, #2b2314 0%, #1e170d 100%)' : '#0d181f',
                  border: effectiveRoute === 'Escalate' ? '2px solid #f59e0b' : '1px solid #1c2e39',
                  borderRadius: '10px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  opacity: effectiveRoute === 'Escalate' ? 1 : 0.6,
                  boxShadow: effectiveRoute === 'Escalate' ? '0 0 24px rgba(245, 158, 11, 0.25)' : 'none',
                  transition: '0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#ffd27d' }}>
                    🟡 BRANCH 3: ESCALATE (Active)
                  </span>
                  <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: '#453313', color: '#fde68a' }}>
                    Moderator Required
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.2)', color: '#fde68a', border: '1px solid rgba(245, 158, 11, 0.4)', fontWeight: '700' }}>
                    🛡️ Manager &amp; 👑 Admin Sign-Off Desk
                  </span>
                </div>

                <div style={{ background: '#261e11', borderRadius: '8px', padding: '10px 12px', border: '1px solid #54411b' }}>
                  <strong style={{ fontSize: '12px', color: '#fef3c7', display: 'block' }}>Human Moderator Review (Admin Queue)</strong>
                  <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#d6c59b', lineHeight: 1.4 }}>
                    Content enqueued in Admin/Manager queue for manual review, high-risk claim verification, or smart rewrites.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: 'auto' }}>
                  <div
                    style={{
                      background: '#193b2c',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      border: '1px solid #2e664d',
                      textAlign: 'center'
                    }}
                  >
                    <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--mint, #baf57f)' }}>
                      ✓ Content Approved
                    </span>
                    <small style={{ display: 'block', fontSize: '9px', color: '#a5d6bb' }}>
                      SHA-256 seal signed
                    </small>
                  </div>

                  <div
                    style={{
                      background: '#361515',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      border: '1px solid #5c2323',
                      textAlign: 'center'
                    }}
                  >
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#fca5a5' }}>
                      ✕ Content Rejected
                    </span>
                    <small style={{ display: 'block', fontSize: '9px', color: '#fecaca' }}>
                      Sent back for revisions
                    </small>
                  </div>
                </div>

                {onNavigateToQueue && (
                  <button
                    type="button"
                    onClick={onNavigateToQueue}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid #d97706',
                      background: '#b45309',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    👑 Open Super Admin Review Queue &rarr;
                  </button>
                )}
              </div>
            </div>

            {/* 🎯 Akira AI Role Priority & Specific Utility Banner */}
            <div
              style={{
                background: '#0a141b',
                border: '1px solid #1f3545',
                borderRadius: '12px',
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginTop: '10px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#edf4f5', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🎯 Who is Akira AI Main For &amp; Why is it Important?
                </span>
                <button
                  type="button"
                  onClick={() => setActiveView('roles')}
                  style={{
                    background: 'transparent',
                    border: '1px solid #28475c',
                    color: 'var(--mint, #baf57f)',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '4px 10px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  View Full Role Matrix &rarr;
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                <div style={{ background: '#0e1d27', border: '1px solid #1c384c', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '12px', color: '#edf4f5' }}>👑 Super Admin</strong>
                    <span style={{ fontSize: '9px', background: 'rgba(124, 58, 237, 0.2)', color: '#c4b5fd', padding: '1px 5px', borderRadius: '3px', fontWeight: '800' }}>⭐⭐⭐⭐⭐ ROOT SHIELD</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '11px', color: '#8aa1ad', lineHeight: 1.4 }}>
                    <strong>Specific Work:</strong> Auto-blocks fatal scam claims in Branch 2, generates cryptographic audit ledger &amp; Turnstile security telemetry.
                  </p>
                </div>

                <div style={{ background: '#0e1d27', border: '1px solid #1c384c', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '12px', color: '#edf4f5' }}>🛡️ Brand Manager</strong>
                    <span style={{ fontSize: '9px', background: 'rgba(5, 150, 105, 0.2)', color: '#6ee7b7', padding: '1px 5px', borderRadius: '3px', fontWeight: '800' }}>⭐⭐⭐⭐⭐ 80% TIME SAVED</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '11px', color: '#8aa1ad', lineHeight: 1.4 }}>
                    <strong>Specific Work:</strong> Auto-resolves 80%+ mundane drafts via Branch 1. Only escalates 15% complex claims to manager's desk for final sign-off.
                  </p>
                </div>

                <div style={{ background: '#0e1d27', border: '1px solid #1c384c', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '12px', color: '#edf4f5' }}>✍️ Content Creator</strong>
                    <span style={{ fontSize: '9px', background: 'rgba(234, 179, 8, 0.2)', color: '#fde047', padding: '1px 5px', borderRadius: '3px', fontWeight: '800' }}>⭐⭐⭐⭐ 1-CLICK CO-PILOT</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '11px', color: '#8aa1ad', lineHeight: 1.4 }}>
                    <strong>Specific Work:</strong> 2-second pre-submission safety scan and 1-Click Smart AI Rewrites so creators never get rejected by governance boards.
                  </p>
                </div>

                <div style={{ background: '#0e1d27', border: '1px solid #1c384c', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '12px', color: '#edf4f5' }}>👤 Workspace User</strong>
                    <span style={{ fontSize: '9px', background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', padding: '1px 5px', borderRadius: '3px', fontWeight: '800' }}>⭐⭐⭐ SAFE DRAFTING</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '11px', color: '#8aa1ad', lineHeight: 1.4 }}>
                    <strong>Specific Work:</strong> Teaches brand terminology (e.g. &ldquo;customer&rdquo; vs &ldquo;user&rdquo;) and prevents internal team members from making risky claims.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : activeView === 'roles' ? (
        /* DEDICATED ROLE MATRIX & UTILITY VIEW */
        <div
          style={{
            background: '#091319',
            border: '1px solid #1c2e3a',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          <div>
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--mint, #baf57f)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              AKIRA AI ROLE MATRIX &bull; SPECIFIC RESPONSIBILITIES
            </span>
            <h3 style={{ margin: '4px 0 0', color: '#edf4f5', fontSize: '18px', fontWeight: '800' }}>
              Who is Akira AI For and Why is it Important?
            </h3>
            <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#8aa1ad', maxWidth: '780px', lineHeight: 1.5 }}>
              Akira AI operates as an autonomous bridge between content authors and executive gatekeepers. Here is the specific breakdown of how Akira AI works for each role and who it impacts most:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {/* CARD 1: SUPER ADMIN */}
            <div style={{ background: '#0e1922', border: '1px solid #4f46e5', borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '18px' }}>👑</span>
                  <h4 style={{ margin: '4px 0 2px', fontSize: '15px', color: '#edf4f5' }}>Super Admin</h4>
                  <span style={{ fontSize: '11px', color: '#a78bfa', fontWeight: '700' }}>Root Legal &amp; Platform Defense Shield</span>
                </div>
                <span style={{ fontSize: '10px', background: 'rgba(124, 58, 237, 0.25)', color: '#c4b5fd', padding: '3px 8px', borderRadius: '4px', fontWeight: '800', border: '1px solid #7c3aed' }}>
                  ⭐⭐⭐⭐⭐ TOP PRIORITY
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#9baec8', lineHeight: 1.5 }}>
                <strong>Why it is Most Important:</strong> The Super Admin holds absolute legal liability for all public marketing copy. Akira AI acts as their automated watchdog.
              </p>
              <div style={{ background: '#081116', borderRadius: '6px', padding: '10px 12px', border: '1px solid #1a2a36', fontSize: '11px', color: '#889fae' }}>
                <strong style={{ color: '#edf4f5', display: 'block', marginBottom: '4px' }}>Specific Work Executed:</strong>
                <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>Auto-rejects fatal scams (Branch 2) before any human sees them.</li>
                  <li>Generates immutable SHA-256 cryptographic compliance certificates.</li>
                  <li>Tracks session telemetry, IP addresses, and Cloudflare Turnstile token validation.</li>
                </ul>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #1b2e3c', fontSize: '11px', color: 'var(--mint, #baf57f)' }}>
                ✓ <strong>Value:</strong> 100% immunity against regulatory lawsuits &amp; false-claim fines.
              </div>
            </div>

            {/* CARD 2: BRAND MANAGER */}
            <div style={{ background: '#0e1922', border: '1px solid #10b981', borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '18px' }}>🛡️</span>
                  <h4 style={{ margin: '4px 0 2px', fontSize: '15px', color: '#edf4f5' }}>Brand Manager</h4>
                  <span style={{ fontSize: '11px', color: '#6ee7b7', fontWeight: '700' }}>80% Workload Reducer &amp; Sign-Off Gate</span>
                </div>
                <span style={{ fontSize: '10px', background: 'rgba(5, 150, 105, 0.25)', color: '#a7f3d0', padding: '3px 8px', borderRadius: '4px', fontWeight: '800', border: '1px solid #10b981' }}>
                  ⭐⭐⭐⭐⭐ HIGHEST IMPACT
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#9baec8', lineHeight: 1.5 }}>
                <strong>Why it is Main for Managers:</strong> Brand Managers cannot manually audit 1,000 campaigns word-by-word. Akira AI eliminates 80%+ of their manual workload.
              </p>
              <div style={{ background: '#081116', borderRadius: '6px', padding: '10px 12px', border: '1px solid #1a2a36', fontSize: '11px', color: '#889fae' }}>
                <strong style={{ color: '#edf4f5', display: 'block', marginBottom: '4px' }}>Specific Work Executed:</strong>
                <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>Auto-approves compliant drafts (Branch 1) with mandatory disclaimers.</li>
                  <li>Only routes 15% high-risk or complex claims to the Manager&rsquo;s desk (Branch 3: Escalation).</li>
                  <li>Automates CIELAB Delta-E color checks (&lt; 3.0) and WCAG AA contrast measurements.</li>
                </ul>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #1b2e3c', fontSize: '11px', color: 'var(--mint, #baf57f)' }}>
                ✓ <strong>Value:</strong> Saves 80% of review time — review 15 campaigns instead of 100!
              </div>
            </div>

            {/* CARD 3: CONTENT CREATOR */}
            <div style={{ background: '#0e1922', border: '1px solid #eab308', borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '18px' }}>✍️</span>
                  <h4 style={{ margin: '4px 0 2px', fontSize: '15px', color: '#edf4f5' }}>Content Creator</h4>
                  <span style={{ fontSize: '11px', color: '#fde047', fontWeight: '700' }}>Pre-Submission Co-Pilot &amp; 1-Click Rewriter</span>
                </div>
                <span style={{ fontSize: '10px', background: 'rgba(234, 179, 8, 0.25)', color: '#fef08a', padding: '3px 8px', borderRadius: '4px', fontWeight: '800', border: '1px solid #eab308' }}>
                  ⭐⭐⭐⭐ ESSENTIAL HELPER
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#9baec8', lineHeight: 1.5 }}>
                <strong>Why it is Main for Creators:</strong> Creators get immediate feedback on prohibited terms without waiting days for a human manager to reject their work.
              </p>
              <div style={{ background: '#081116', borderRadius: '6px', padding: '10px 12px', border: '1px solid #1a2a36', fontSize: '11px', color: '#889fae' }}>
                <strong style={{ color: '#edf4f5', display: 'block', marginBottom: '4px' }}>Specific Work Executed:</strong>
                <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>2-second instant scan identifying banned words before submission.</li>
                  <li>1-Click Smart AI Rewrites: Gemini AI writes the compliant line for you.</li>
                  <li>Allocates $100 Inkloom AI Studio credits for generating fresh ideas.</li>
                </ul>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #1b2e3c', fontSize: '11px', color: 'var(--mint, #baf57f)' }}>
                ✓ <strong>Value:</strong> 3x faster approval rates and zero fear of rejection.
              </div>
            </div>

            {/* CARD 4: WORKSPACE USER */}
            <div style={{ background: '#0e1922', border: '1px solid #3b82f6', borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '18px' }}>👤</span>
                  <h4 style={{ margin: '4px 0 2px', fontSize: '15px', color: '#edf4f5' }}>Workspace User</h4>
                  <span style={{ fontSize: '11px', color: '#93c5fd', fontWeight: '700' }}>Safety Guardrails &amp; Brand Terminology Guide</span>
                </div>
                <span style={{ fontSize: '10px', background: 'rgba(59, 130, 246, 0.25)', color: '#bfdbfe', padding: '3px 8px', borderRadius: '4px', fontWeight: '800', border: '1px solid #3b82f6' }}>
                  ⭐⭐⭐ GUIDANCE SHIELD
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#9baec8', lineHeight: 1.5 }}>
                <strong>Why it is Main for Users:</strong> General team members who lack marketing legal training are protected from accidentally publishing non-compliant promises.
              </p>
              <div style={{ background: '#081116', borderRadius: '6px', padding: '10px 12px', border: '1px solid #1a2a36', fontSize: '11px', color: '#889fae' }}>
                <strong style={{ color: '#edf4f5', display: 'block', marginBottom: '4px' }}>Specific Work Executed:</strong>
                <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>Guides terminology (e.g. reminding users to write &ldquo;customer&rdquo; or &ldquo;patient&rdquo;).</li>
                  <li>Restricts publishing until an authorized manager has issued a certificate.</li>
                  <li>Prevents costly compliance errors from internal cross-departmental teams.</li>
                </ul>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #1b2e3c', fontSize: '11px', color: 'var(--mint, #baf57f)' }}>
                ✓ <strong>Value:</strong> Safe internal collaboration with built-in guardrails.
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* DOCKER & FULL-STACK CONTAINER ARCHITECTURE (Matching Image 2) */
        <div
          style={{
            background: '#091319',
            border: '1px solid #1c2e3a',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}
        >
          <div>
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--blue, #57abff)', textTransform: 'uppercase' }}>
              Multi-Container Microservices Architecture (Image 2)
            </span>
            <h3 style={{ margin: '4px 0 0', color: '#edf4f5', fontSize: '18px' }}>
              Docker Compose Full-Stack Pipeline Deployment
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#8aa1ad' }}>
              Full separation of concerns: Client Browser &rarr; React+Vite Frontend Container &rarr; FastAPI Backend Container &rarr; PostgreSQL Database Container.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '16px'
            }}
          >
            {/* Box 1: Browser */}
            <div
              style={{
                background: '#0e1a22',
                border: '1px solid #233b49',
                borderRadius: '10px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#7fa3b7' }}>CLIENT</span>
                <span style={{ fontSize: '10px', padding: '2px 6px', background: '#1c2f3d', borderRadius: '4px', color: '#b0c7d5' }}>Port 5173</span>
              </div>
              <h4 style={{ margin: 0, color: '#edf4f5', fontSize: '15px' }}>Browser</h4>
              <p style={{ margin: 0, fontSize: '11px', color: '#7f939f', lineHeight: 1.5 }}>
                End-user client interface accessing the BrandGuard application on local or production network.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #1c2f3d', fontSize: '11px', color: 'var(--mint, #baf57f)' }}>
                http://localhost:5173
              </div>
            </div>

            {/* Box 2: React + Vite Frontend */}
            <div
              style={{
                background: '#12222e',
                border: '2px solid #2563eb',
                borderRadius: '10px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#60a5fa' }}>FRONTEND CONTAINER</span>
                <span style={{ fontSize: '10px', padding: '2px 6px', background: '#1e3a8a', borderRadius: '4px', color: '#93c5fd' }}>5173:5173</span>
              </div>
              <h4 style={{ margin: 0, color: '#edf4f5', fontSize: '15px' }}>React + Vite</h4>
              <p style={{ margin: 0, fontSize: '11px', color: '#8aa1ad', lineHeight: 1.5 }}>
                Single-page application featuring Creator Studio, Admin Review Queue, Inkloom AI modal, and live Akira flowcharts.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #233e52', fontSize: '10px', color: '#93c5fd' }}>
                Container: <b>frontend</b> (Node.js 20 Alpine)
              </div>
            </div>

            {/* Box 3: FastAPI Backend */}
            <div
              style={{
                background: '#12261e',
                border: '2px solid #10b981',
                borderRadius: '10px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--mint, #baf57f)' }}>BACKEND CONTAINER</span>
                <span style={{ fontSize: '10px', padding: '2px 6px', background: '#134e4a', borderRadius: '4px', color: '#a7f3d0' }}>8000:8000</span>
              </div>
              <h4 style={{ margin: 0, color: '#edf4f5', fontSize: '15px' }}>FastAPI (Python 3.14)</h4>
              <p style={{ margin: 0, fontSize: '11px', color: '#8aa1ad', lineHeight: 1.5 }}>
                Hosts the <code>AIRoutingEngine</code>, JWT Authentication, Gemini AI API, Inkloom Vectorizer, and Review routers.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #1c4033', fontSize: '10px', color: 'var(--mint, #baf57f)' }}>
                Container: <b>backend</b> (Uvicorn Async)
              </div>
            </div>

            {/* Box 4: PostgreSQL Database */}
            <div
              style={{
                background: '#1c1b29',
                border: '2px solid #8b5cf6',
                borderRadius: '10px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#c4b5fd' }}>DATABASE CONTAINER</span>
                <span style={{ fontSize: '10px', padding: '2px 6px', background: '#3b2064', borderRadius: '4px', color: '#ddd6fe' }}>5432:5432</span>
              </div>
              <h4 style={{ margin: 0, color: '#edf4f5', fontSize: '15px' }}>PostgreSQL 16</h4>
              <p style={{ margin: 0, fontSize: '11px', color: '#8aa1ad', lineHeight: 1.5 }}>
                Persists users, immutable audit history logs, brand rulebooks, and evaluated reviews with routing metadata.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #3b2859', fontSize: '10px', color: '#c4b5fd' }}>
                Container: <b>db</b> (pg_data volume)
              </div>
            </div>
          </div>

          {/* Quick Docker Launch CLI Card */}
          <div
            style={{
              background: '#0a1015',
              border: '1px solid #203542',
              borderRadius: '8px',
              padding: '14px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#edf4f5' }}>
              One-Command Production Deployment:
            </span>
            <code
              style={{
                background: '#03070a',
                border: '1px solid #182833',
                padding: '8px 12px',
                borderRadius: '6px',
                color: 'var(--mint, #baf57f)',
                fontSize: '12px',
                fontFamily: 'monospace'
              }}
            >
              docker compose up --build
            </code>
            <small style={{ color: '#7f939f', fontSize: '11px' }}>
              Spins up all three services concurrently with healthchecks and network bridging.
            </small>
          </div>
        </div>
      )}
    </div>
  )
}
