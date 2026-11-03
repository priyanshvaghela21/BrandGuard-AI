import React from 'react'

export default function QuickStartWalkthroughBanner({
  currentUser,
  currentRole,
  onSwitchRole,
  onLoadReelSample,
  onApplyAllRewrites,
  onDismiss,
  showGuide,
  onReopenGuide
}) {
  if (!showGuide) {
    return (
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '14px' }}>
        <button
          type="button"
          onClick={onReopenGuide}
          style={{
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '20px',
            padding: '6px 14px',
            fontSize: '11.5px',
            fontWeight: '700',
            color: '#38bdf8',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            transition: 'all 0.15s ease'
          }}
        >
          <span>💡</span> Open Quick Start Guide (3-Step Walkthrough)
        </button>
      </div>
    )
  }

  const isAdmin = currentUser?.portalType === 'admin' || currentRole === 'admin'
  const isManager = currentUser?.portalType === 'manager' || currentRole === 'brand_manager'
  const isCreator = currentRole === 'creator' || (!isAdmin && !isManager)

  return (
    <div
      id="quick-start-walkthrough-banner"
      style={{
        background: 'linear-gradient(135deg, rgba(16, 33, 45, 0.95) 0%, rgba(10, 20, 28, 0.98) 100%)',
        border: '1.5px solid #234255',
        borderRadius: '14px',
        padding: '20px 24px',
        marginBottom: '24px',
        boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
        position: 'relative',
        width: '100%'
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '18px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '10px',
                fontWeight: '800',
                letterSpacing: '0.8px',
                color: '#38bdf8',
                textTransform: 'uppercase',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                padding: '2px 8px',
                borderRadius: '4px'
              }}
            >
              🚀 FIRST-TIME USER ONBOARDING
            </span>
            <span
              style={{
                fontSize: '10px',
                color: 'var(--mint, #baf57f)',
                background: 'rgba(186, 245, 127, 0.12)',
                border: '1px solid rgba(186, 245, 127, 0.3)',
                padding: '2px 8px',
                borderRadius: '4px',
                fontWeight: '700'
              }}
            >
              Quick Start Guide
            </span>
          </div>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#edf4f5', letterSpacing: '-0.3px' }}>
            Welcome to BrandGuard AI! Master the Workflow in 3 Simple Steps
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.5 }}>
            Follow this 3-step walkthrough to select your role, audit an ad or Reel script, and instantly generate compliant marketing copy.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={onDismiss}
            style={{
              background: 'transparent',
              border: '1px solid #233b49',
              color: '#7e96a4',
              padding: '5px 12px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            title="Minimize guide"
          >
            ✕ Dismiss
          </button>
        </div>
      </div>

      {/* 3 Steps Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        {/* STEP 1: SELECT ROLE */}
        <div
          style={{
            background: '#0a141b',
            border: '1px solid #1a3242',
            borderRadius: '10px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#38bdf8', letterSpacing: '0.6px' }}>
                STEP 1 • SELECT ROLE
              </span>
              <span style={{ fontSize: '16px' }}>👑</span>
            </div>
            <h4 style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: '800', color: '#edf4f5' }}>
              Select Governance Role
            </h4>
            <p style={{ margin: '0 0 12px', fontSize: '11.5px', color: '#94a3b8', lineHeight: 1.4 }}>
              Experience multi-tier permissions by switching between Admin, Brand Manager, or Content Creator.
            </p>
          </div>

          {/* 3 Role Pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => onSwitchRole('admin')}
              style={{
                flex: 1,
                padding: '7px 6px',
                borderRadius: '6px',
                fontSize: '10.5px',
                fontWeight: '700',
                cursor: 'pointer',
                border: isAdmin ? '1px solid var(--mint, #baf57f)' : '1px solid #223744',
                background: isAdmin ? 'rgba(186, 245, 127, 0.15)' : '#0d1820',
                color: isAdmin ? 'var(--mint, #baf57f)' : '#8fa6b3',
                transition: 'all 0.15s ease'
              }}
            >
              👑 Admin
            </button>

            <button
              type="button"
              onClick={() => onSwitchRole('brand_manager')}
              style={{
                flex: 1,
                padding: '7px 6px',
                borderRadius: '6px',
                fontSize: '10.5px',
                fontWeight: '700',
                cursor: 'pointer',
                border: isManager ? '1px solid #e5b869' : '1px solid #223744',
                background: isManager ? 'rgba(229, 184, 105, 0.15)' : '#0d1820',
                color: isManager ? '#e5b869' : '#8fa6b3',
                transition: 'all 0.15s ease'
              }}
            >
              👔 Manager
            </button>

            <button
              type="button"
              onClick={() => onSwitchRole('creator')}
              style={{
                flex: 1,
                padding: '7px 6px',
                borderRadius: '6px',
                fontSize: '10.5px',
                fontWeight: '700',
                cursor: 'pointer',
                border: isCreator ? '1px solid #72bdf2' : '1px solid #223744',
                background: isCreator ? 'rgba(114, 189, 242, 0.15)' : '#0d1820',
                color: isCreator ? '#72bdf2' : '#8fa6b3',
                transition: 'all 0.15s ease'
              }}
            >
              🎨 Creator
            </button>
          </div>
        </div>

        {/* STEP 2: PASTE AD OR REEL SCRIPT */}
        <div
          style={{
            background: '#0a141b',
            border: '1px solid #1a3242',
            borderRadius: '10px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#fbbf24', letterSpacing: '0.6px' }}>
                STEP 2 • INPUT CONTENT
              </span>
              <span style={{ fontSize: '16px' }}>🎬</span>
            </div>
            <h4 style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: '800', color: '#edf4f5' }}>
              Paste Ad or Reel Script
            </h4>
            <p style={{ margin: '0 0 12px', fontSize: '11.5px', color: '#94a3b8', lineHeight: 1.4 }}>
              In Review Studio, paste your Instagram Reel hook, ad caption, or marketing text to test compliance.
            </p>
          </div>

          <button
            type="button"
            onClick={onLoadReelSample}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(251, 191, 36, 0.4)',
              background: 'rgba(251, 191, 36, 0.12)',
              color: '#fbbf24',
              fontSize: '11px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            ⚡ Load Sample Reel Script →
          </button>
        </div>

        {/* STEP 3: 1-CLICK SMART REWRITE */}
        <div
          style={{
            background: '#0a141b',
            border: '1px solid #1a3242',
            borderRadius: '10px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--mint, #baf57f)', letterSpacing: '0.6px' }}>
                STEP 3 • 1-CLICK FIX
              </span>
              <span style={{ fontSize: '16px' }}>✨</span>
            </div>
            <h4 style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: '800', color: '#edf4f5' }}>
              1-Click Smart Rewrite
            </h4>
            <p style={{ margin: '0 0 12px', fontSize: '11.5px', color: '#94a3b8', lineHeight: 1.4 }}>
              Click the glowing &ldquo;1-Click Smart Rewrite&rdquo; button on any flagged violation to generate 100% compliant copy.
            </p>
          </div>

          <button
            type="button"
            onClick={onApplyAllRewrites}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              background: 'var(--mint, #baf57f)',
              color: '#09120e',
              fontSize: '11px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 2px 10px rgba(186, 245, 127, 0.3)'
            }}
          >
            ✨ Try 1-Click Fix All →
          </button>
        </div>
      </div>
    </div>
  )
}
