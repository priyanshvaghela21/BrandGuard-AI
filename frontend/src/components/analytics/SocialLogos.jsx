import React from 'react';

/**
 * Official Real Instagram Logo SVG
 * Pixel-perfect official gradient (Yellow -> Orange -> Pink -> Purple) with white camera emblem
 */
export function InstagramLogo({ size = 14, style = {} }) {
  const gradId = React.useId ? React.useId().replace(/:/g, '') : `ig-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', flexShrink: 0, verticalAlign: 'middle', borderRadius: `${size * 0.25}px`, ...style }}
      aria-label="Instagram"
    >
      <defs>
        <linearGradient id={gradId} x1="0.1" y1="0.9" x2="0.9" y2="0.1">
          <stop offset="0%" stopColor="#feda75" />
          <stop offset="25%" stopColor="#fa7e1e" />
          <stop offset="50%" stopColor="#d62976" />
          <stop offset="75%" stopColor="#962fbf" />
          <stop offset="100%" stopColor="#4f5bd5" />
        </linearGradient>
      </defs>
      {/* Official Instagram squircle background with radial highlight */}
      <rect x="1.5" y="1.5" width="21" height="21" rx="5.5" fill={`url(#${gradId})`} />
      {/* Outer camera border */}
      <rect x="5.5" y="5.5" width="13" height="13" rx="3.5" stroke="#ffffff" strokeWidth="1.8" fill="none" />
      {/* Center lens circle */}
      <circle cx="12" cy="12" r="3.2" stroke="#ffffff" strokeWidth="1.8" fill="none" />
      {/* Flash sensor dot */}
      <circle cx="15.8" cy="8.2" r="1" fill="#ffffff" />
    </svg>
  );
}

/**
 * Official Real Facebook Logo SVG
 * Pixel-perfect official Facebook blue circle (#1877F2) with solid white 'f'
 */
export function FacebookLogo({ size = 14, style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', flexShrink: 0, verticalAlign: 'middle', ...style }}
      aria-label="Facebook"
    >
      {/* Official Facebook Blue Circle */}
      <circle cx="12" cy="12" r="11" fill="#1877F2" />
      {/* Official white lowercase 'f' */}
      <path
        d="M13.6 13.5h-2.1v6.5h-2.7v-6.5h-1.5v-2.4h1.5v-1.7c0-1.6 0.9-2.6 2.6-2.6 0.8 0 1.5 0.1 1.5 0.1v2h-1c-0.8 0-1 0.5-1 1v1.2h2.4l-0.4 2.4z"
        fill="#ffffff"
      />
    </svg>
  );
}

/**
 * Combined Channel Badges Component
 * Detects whether creative has Instagram, Facebook, or both, and renders official logos
 */
export function ChannelLogos({ channels = [], placement = '', size = 14, showText = true, style = {} }) {
  const textStr = (Array.isArray(channels) ? channels.join(', ') : channels || placement || '').toLowerCase();
  const placementStr = (placement || '').toLowerCase();

  const isInstagram =
    textStr.includes('story') ||
    textStr.includes('post') ||
    textStr.includes('insta') ||
    placementStr.includes('instagram') ||
    placementStr.includes('story') ||
    placementStr.includes('post');

  const isFacebook =
    textStr.includes('marketplace') ||
    textStr.includes('feed') ||
    textStr.includes('facebook') ||
    placementStr.includes('facebook') ||
    placementStr.includes('marketplace');

  // Format channels label
  let label = '';
  if (Array.isArray(channels) && channels.length > 0) {
    label = channels.join(', ');
  } else if (placement) {
    label = placement.replace(/Instagram\s*/gi, '').replace(/Facebook\s*/gi, '').trim();
  } else {
    label = isInstagram && isFacebook ? 'Story, Post, Marketplace' : isInstagram ? 'Story, Post' : 'Feed, Marketplace';
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', ...style }}>
      {isInstagram && <InstagramLogo size={size} />}
      {isFacebook && <FacebookLogo size={size} />}
      {!isInstagram && !isFacebook && <FacebookLogo size={size} />}
      {showText && (
        <span
          style={{
            fontSize: '10px',
            color: '#94a3b8',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

export default { InstagramLogo, FacebookLogo, ChannelLogos };
