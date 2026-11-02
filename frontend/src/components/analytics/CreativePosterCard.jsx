import React, { useState } from 'react';
import CreativePosterArtwork from './CreativePosterArtwork';
import { ChannelLogos } from './SocialLogos';

/**
 * CreativePosterCard - Visual Ad Poster Card matching Sprinklr Creative Management UI.
 * Displays real photorealistic commercial advertising imagery matching the user's reference screenshot:
 * - High-res commercial ad photography with subtle vignette & hover zoom
 * - File Name with file icon (Drink_Test.jpg)
 * - Brand Score + Status Pill (90% Brand Score • Excellent / 80% • On Track / 50% • Need Work)
 * - Social Channels (Story, Post, Marketplace with Meta/Insta icon)
 * - Click to open Judge Live Verification Gate Modal
 */
export default function CreativePosterCard({
  creative,
  isSealed = false,
  onClick
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Determine dynamic brand score & status
  let score = creative.brandScore || (creative.groundTruth === 'Compliant' ? 90 : 50);
  let grade = creative.grade || (creative.groundTruth === 'Compliant' ? 'Excellent' : 'Need Work');
  let gradeBg = 'rgba(16, 185, 129, 0.15)';
  let gradeColor = '#10b981';
  let gradeBorder = 'rgba(16, 185, 129, 0.35)';

  if (isSealed) {
    score = 98;
    grade = 'Certified';
    gradeBg = 'rgba(186, 245, 127, 0.2)';
    gradeColor = '#baf57f';
    gradeBorder = '#baf57f';
  } else if (grade === 'On Track' || (score >= 80 && score < 90)) {
    grade = 'On Track';
    gradeBg = 'rgba(245, 158, 11, 0.15)';
    gradeColor = '#f59e0b';
    gradeBorder = 'rgba(245, 158, 11, 0.35)';
  } else if (grade === 'Need Work' || score < 80) {
    grade = 'Need Work';
    gradeBg = 'rgba(236, 72, 153, 0.15)';
    gradeColor = '#ec4899';
    gradeBorder = 'rgba(236, 72, 153, 0.35)';
  }

  // Channels text & list
  const channelsText = creative.channels
    ? creative.channels.join(', ')
    : (creative.groundTruth === 'Compliant' ? 'Story, Post' : 'Story, Post, Marketplace');

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: '#0c161d',
        border: isSealed
          ? '1px solid rgba(186, 245, 127, 0.55)'
          : isHovered
          ? '1px solid #38bdf8'
          : '1px solid #1e3848',
        borderRadius: '10px',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isSealed
          ? '0 6px 22px rgba(186, 245, 127, 0.15)'
          : isHovered
          ? '0 12px 30px rgba(0,0,0,0.6)'
          : '0 4px 14px rgba(0,0,0,0.3)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, box-shadow 0.2s ease',
        position: 'relative'
      }}
      title="Click to open Judge Live Verification Gate"
    >
      {/* ── Top Poster Image Banner (400x250 aspect 16:10) ── */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/10',
          overflow: 'hidden',
          background: '#081219'
        }}
      >
        {!imgFailed && creative.imgUrl ? (
          <img
            src={creative.imgUrl}
            alt={creative.fileName || creative.brand}
            onError={() => setImgFailed(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transform: isHovered ? 'scale(1.06)' : 'scale(1.0)',
              transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              filter: 'brightness(0.96) contrast(1.05)'
            }}
            loading="lazy"
          />
        ) : (
          <CreativePosterArtwork
            theme={creative.posterTheme || 'cocktail_dark'}
            brand={creative.brand}
            id={creative.id}
          />
        )}

        {/* Photorealistic Dark Vignette Overlay for Crisp Readability */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '45%',
            background: 'linear-gradient(to top, rgba(12, 22, 29, 0.88) 0%, rgba(12, 22, 29, 0.25) 60%, transparent 100%)',
            pointerEvents: 'none'
          }}
        />

        {/* Media Type pill on top right */}
        <span
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'rgba(5, 12, 17, 0.78)',
            backdropFilter: 'blur(6px)',
            color: '#e2e8f0',
            fontSize: '9px',
            fontWeight: '700',
            padding: '2px 7px',
            borderRadius: '4px',
            border: '1px solid rgba(255,255,255,0.18)',
            letterSpacing: '0.4px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
          }}
        >
          {creative.mediaType || 'Image'}
        </span>

        {/* Cryptographic Seal badge if certified */}
        {isSealed && (
          <span
            style={{
              position: 'absolute',
              bottom: '8px',
              left: '8px',
              background: 'rgba(14, 38, 26, 0.95)',
              backdropFilter: 'blur(6px)',
              color: 'var(--mint)',
              fontSize: '10px',
              fontWeight: '800',
              padding: '3px 8px',
              borderRadius: '6px',
              border: '1px solid var(--mint)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
            }}
          >
            ✓ SEALED
          </span>
        )}
      </div>

      {/* ── Card Content Details (matching Sprinklr screenshot) ── */}
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* 1. File Name row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* File icon */}
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0 }}
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <span
            style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#edf4f5',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontFamily: 'Inter, system-ui, sans-serif'
            }}
            title={creative.fileName || `${creative.brand}.jpg`}
          >
            {creative.fileName || `${creative.id}_${creative.brand.replace(/\s+/g, '_')}.jpg`}
          </span>
        </div>

        {/* 2. Brand Score & Grade Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#cbd5e1' }}>
            {score}% Brand Score
          </span>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: '800',
              background: gradeBg,
              color: gradeColor,
              border: `1px solid ${gradeBorder}`,
              textTransform: 'capitalize',
              letterSpacing: '0.2px'
            }}
          >
            {grade}
          </span>
        </div>

        {/* 3. Channels row (Official Real Instagram & Facebook Logos + channels text) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '2px' }}>
          <ChannelLogos
            channels={creative.channels}
            placement={creative.placement}
            size={14}
            showText={true}
          />
        </div>
      </div>
    </div>
  );
}
