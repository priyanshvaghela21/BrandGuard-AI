import React from 'react';

/**
 * High-fidelity, self-contained SVG creative poster artworks matching
 * enterprise ad management platforms (Sprinklr Creative Management).
 * 100% offline, zero external image dependencies.
 */
export default function CreativePosterArtwork({ theme = 'cocktail_dark', brand = 'Smirnoff', id = 'BM-01' }) {
  switch (theme) {
    // ── 1. SMIRNOFF / DARK SPIRITS BOTTLE & SHOT GLASS (Card 1 in reference) ──
    case 'cocktail_dark':
      return (
        <svg viewBox="0 0 400 250" width="100%" height="100%" style={{ display: 'block', borderRadius: '8px 8px 0 0' }}>
          <defs>
            <linearGradient id={`bg_dark_${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1a1816" />
              <stop offset="50%" stopColor="#0d0b09" />
              <stop offset="100%" stopColor="#050505" />
            </linearGradient>
            <radialGradient id={`spotlight_${id}`} cx="50%" cy="40%" r="55%">
              <stop offset="0%" stopColor="rgba(255, 235, 200, 0.18)" />
              <stop offset="70%" stopColor="rgba(255, 140, 50, 0.05)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <linearGradient id={`bottle_grad_${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1c1917" />
              <stop offset="25%" stopColor="#44403c" />
              <stop offset="50%" stopColor="#78716c" />
              <stop offset="75%" stopColor="#292524" />
              <stop offset="100%" stopColor="#0c0a09" />
            </linearGradient>
            <linearGradient id={`red_foil_${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#991b1b" />
              <stop offset="40%" stopColor="#ef4444" />
              <stop offset="70%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </linearGradient>
          </defs>

          {/* Background & Spotlight */}
          <rect width="400" height="250" fill={`url(#bg_dark_${id})`} />
          <circle cx="200" cy="120" r="160" fill={`url(#spotlight_${id})`} />

          {/* Wooden / Slate Countertop Surface */}
          <rect y="195" width="400" height="55" fill="#14110e" />
          <line x1="0" y1="195" x2="400" y2="195" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
          <ellipse cx="200" cy="205" rx="140" ry="25" fill="rgba(0,0,0,0.6)" />

          {/* Central Bottle (Smirnoff Premium Look) */}
          <g transform="translate(160, 30)">
            {/* Neck Foil & Cap */}
            <rect x="28" y="0" width="24" height="28" rx="2" fill={`url(#red_foil_${id})`} />
            <rect x="26" y="24" width="28" height="4" fill="#fbbf24" opacity="0.9" />
            {/* Tapered Bottle Neck */}
            <path d="M 28 28 L 52 28 L 62 75 L 18 75 Z" fill={`url(#bottle_grad_${id})`} />
            {/* Bottle Body */}
            <rect x="14" y="75" width="52" height="115" rx="6" fill={`url(#bottle_grad_${id})`} />
            {/* Black & Gold Label */}
            <rect x="18" y="95" width="44" height="65" rx="3" fill="#09090b" stroke="#ca8a04" strokeWidth="1" />
            <text x="40" y="112" fill="#ef4444" fontSize="8" fontWeight="900" textAnchor="middle" letterSpacing="1">SMIRNOFF</text>
            <text x="40" y="124" fill="#fafaf9" fontSize="6.5" fontWeight="700" textAnchor="middle" letterSpacing="0.5">FALL 2023</text>
            <line x1="24" y1="130" x2="56" y2="130" stroke="#ca8a04" strokeWidth="0.8" />
            <text x="40" y="142" fill="#a1a1aa" fontSize="5.5" textAnchor="middle">TRIPLE DISTILLED</text>
            {/* Glass Specular Reflection Highlight */}
            <path d="M 20 80 L 25 80 L 25 180 L 20 180 Z" fill="rgba(255,255,255,0.22)" />
            <path d="M 22 32 L 25 32 L 27 70 L 24 70 Z" fill="rgba(255,255,255,0.3)" />
          </g>

          {/* Foreground Crystal Shot Glass with Ice */}
          <g transform="translate(115, 145)">
            <ellipse cx="20" cy="55" rx="16" ry="6" fill="rgba(0,0,0,0.5)" />
            {/* Shot Glass Body */}
            <polygon points="6,15 34,15 30,55 10,55" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
            {/* Spirit Liquid Inside */}
            <polygon points="9,26 31,26 28,52 12,52" fill="rgba(240, 249, 255, 0.28)" />
            {/* Ice Cube */}
            <rect x="14" y="32" width="12" height="12" rx="2" fill="rgba(255,255,255,0.5)" transform="rotate(12 20 38)" />
            {/* Specular Edge Highlights */}
            <line x1="7" y1="16" x2="11" y2="54" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
          </g>

          {/* Subdued Editorial Text */}
          <text x="24" y="36" fill="#a8a29e" fontSize="9" fontWeight="800" letterSpacing="1.2">PREMIUM VODKA</text>
          <text x="24" y="52" fill="#fafaf9" fontSize="13" fontWeight="800" fontFamily="Manrope, sans-serif">Smirnoff Fall Edit</text>
          <rect x="330" y="16" width="50" height="18" rx="4" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.2)" />
          <text x="355" y="29" fill="#e2e8f0" fontSize="8" fontWeight="800" textAnchor="middle">IMAGE</text>
        </svg>
      );

    // ── 2. CITRUS COCKTAIL WITH ICE, LIME & MINT (Card 2 in reference) ──
    case 'cocktail_citrus':
      return (
        <svg viewBox="0 0 400 250" width="100%" height="100%" style={{ display: 'block', borderRadius: '8px 8px 0 0' }}>
          <defs>
            <linearGradient id={`bg_citrus_${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#064e3b" />
              <stop offset="45%" stopColor="#047857" />
              <stop offset="100%" stopColor="#022c22" />
            </linearGradient>
            <radialGradient id={`glow_citrus_${id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(167, 243, 208, 0.35)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          <rect width="400" height="250" fill={`url(#bg_citrus_${id})`} />
          <circle cx="200" cy="130" r="140" fill={`url(#glow_citrus_${id})`} />

          {/* Tumbler Glass */}
          <g transform="translate(150, 45)">
            <ellipse cx="50" cy="165" rx="42" ry="12" fill="rgba(0,0,0,0.4)" />
            {/* Glass Contour */}
            <polygon points="12,10 88,10 78,160 22,160" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
            {/* Crushed Ice & Green Mojito Liquid */}
            <polygon points="16,35 84,35 76,155 24,155" fill="rgba(110, 231, 183, 0.45)" />

            {/* Sliced Lime Wheels */}
            <circle cx="45" cy="80" r="22" fill="#84cc16" stroke="#4d7c0f" strokeWidth="2" />
            <circle cx="45" cy="80" r="18" fill="#bef264" />
            <path d="M 45 62 L 45 98 M 27 80 L 63 80 M 32 67 L 58 93 M 32 93 L 58 67" stroke="#65a30d" strokeWidth="1.2" />

            {/* Watermelon Cubes & Mint */}
            <rect x="52" y="105" width="18" height="18" rx="3" fill="#f43f5e" transform="rotate(20 61 114)" />
            <rect x="25" y="115" width="16" height="16" rx="3" fill="#fb7185" transform="rotate(-15 33 123)" />

            {/* Fresh Mint Sprig */}
            <path d="M 50 20 C 35 5 25 10 32 28 C 38 18 45 22 50 20 Z" fill="#15803d" />
            <path d="M 50 20 C 65 5 75 10 68 28 C 62 18 55 22 50 20 Z" fill="#22c55e" />

            {/* Micro Ice Cubes */}
            <rect x="35" y="45" width="14" height="14" rx="2" fill="rgba(255,255,255,0.6)" transform="rotate(15 42 52)" />
            <rect x="60" y="60" width="12" height="12" rx="2" fill="rgba(255,255,255,0.5)" transform="rotate(-25 66 66)" />

            {/* Condensation Frosted Glass Rim */}
            <line x1="14" y1="12" x2="24" y2="158" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" />
          </g>

          <text x="24" y="36" fill="#a7f3d0" fontSize="9" fontWeight="800" letterSpacing="1.2">REFRESHING MINT & LIME</text>
          <text x="24" y="52" fill="#ffffff" fontSize="13" fontWeight="800">Fresh Mojito Craft</text>
          <rect x="330" y="16" width="50" height="18" rx="4" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.2)" />
          <text x="355" y="29" fill="#e2e8f0" fontSize="8" fontWeight="800" textAnchor="middle">IMAGE</text>
        </svg>
      );

    // ── 3. WATER & TONIC SPLASH WITH LEMON SLICE (Card 3 in reference) ──
    case 'cocktail_splash':
      return (
        <svg viewBox="0 0 400 250" width="100%" height="100%" style={{ display: 'block', borderRadius: '8px 8px 0 0' }}>
          <defs>
            <linearGradient id={`bg_splash_${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="40%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#075985" />
            </linearGradient>
            <radialGradient id={`sunburst_${id}`} cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          <rect width="400" height="250" fill={`url(#bg_splash_${id})`} />
          <circle cx="180" cy="110" r="130" fill={`url(#sunburst_${id})`} />

          {/* Water Splash Crown */}
          <g transform="translate(110, 30)">
            {/* Splash Droplets */}
            <circle cx="45" cy="40" r="5" fill="#f0f9ff" opacity="0.9" />
            <circle cx="150" cy="35" r="4" fill="#f0f9ff" opacity="0.85" />
            <circle cx="25" cy="90" r="3.5" fill="#e0f2fe" opacity="0.9" />
            <circle cx="170" cy="85" r="5" fill="#e0f2fe" opacity="0.9" />

            {/* Large Splash Arcs */}
            <path d="M 20 160 C 15 110, 50 80, 80 110 C 110 70, 150 90, 175 160 Z" fill="rgba(255,255,255,0.4)" />
            <path d="M 35 155 C 30 120, 60 95, 90 125 C 115 85, 145 105, 165 155 Z" fill="rgba(255,255,255,0.6)" />

            {/* Bright Lemon Slice in Mid-Splash */}
            <g transform="translate(65, 45) rotate(-22 35 35)">
              <circle cx="35" cy="35" r="32" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
              <circle cx="35" cy="35" r="27" fill="#fef08a" />
              <circle cx="35" cy="35" r="24" fill="#facc15" />
              <path d="M 35 11 L 35 59 M 11 35 L 59 35 M 18 18 L 52 52 M 18 52 L 52 18" stroke="#eab308" strokeWidth="1.5" />
            </g>

            {/* Effervescent Rising Bubbles */}
            <circle cx="65" cy="140" r="6" fill="rgba(255,255,255,0.7)" />
            <circle cx="130" cy="135" r="4.5" fill="rgba(255,255,255,0.8)" />
            <circle cx="100" cy="155" r="7" fill="rgba(255,255,255,0.6)" />
          </g>

          <text x="24" y="36" fill="#bae6fd" fontSize="9" fontWeight="800" letterSpacing="1.2">ZERO SUGAR • SPARKLING</text>
          <text x="24" y="52" fill="#ffffff" fontSize="13" fontWeight="800">Citrus Tonic Splash</text>
          <rect x="330" y="16" width="50" height="18" rx="4" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.2)" />
          <text x="355" y="29" fill="#e2e8f0" fontSize="8" fontWeight="800" textAnchor="middle">IMAGE</text>
        </svg>
      );

    // ── 4. STEMMED COUPE GLASS WITH AMBER COCKTAIL & BOKEH (Card 4 in reference) ──
    case 'cocktail_sunset':
      return (
        <svg viewBox="0 0 400 250" width="100%" height="100%" style={{ display: 'block', borderRadius: '8px 8px 0 0' }}>
          <defs>
            <linearGradient id={`bg_sunset_${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#451a03" />
              <stop offset="50%" stopColor="#1c1917" />
              <stop offset="100%" stopColor="#0c0a09" />
            </linearGradient>
            <radialGradient id={`amber_glow_${id}`} cx="50%" cy="40%" r="45%">
              <stop offset="0%" stopColor="rgba(245, 158, 11, 0.4)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          <rect width="400" height="250" fill={`url(#bg_sunset_${id})`} />
          <circle cx="200" cy="115" r="130" fill={`url(#amber_glow_${id})`} />

          {/* Dreamy Bokeh Lights in Background */}
          <circle cx="90" cy="65" r="28" fill="rgba(251, 191, 36, 0.12)" />
          <circle cx="310" cy="90" r="35" fill="rgba(245, 158, 11, 0.1)" />
          <circle cx="290" cy="160" r="22" fill="rgba(234, 88, 12, 0.15)" />
          <circle cx="110" cy="175" r="25" fill="rgba(251, 191, 36, 0.08)" />

          {/* Stemmed Coupe Glass */}
          <g transform="translate(145, 35)">
            <ellipse cx="55" cy="180" rx="36" ry="10" fill="rgba(0,0,0,0.5)" />
            {/* Glass Base */}
            <ellipse cx="55" cy="175" rx="30" ry="6" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            {/* Elegant Stem */}
            <rect x="53" y="105" width="4" height="70" fill="rgba(255,255,255,0.3)" />
            {/* Coupe Bowl */}
            <path d="M 10 40 C 10 110, 100 110, 100 40 Z" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
            {/* Amber Spirit Liquid */}
            <path d="M 18 52 C 18 102, 92 102, 92 52 Z" fill="rgba(245, 158, 11, 0.55)" />
            {/* Surface Meniscus Line */}
            <ellipse cx="55" cy="52" rx="37" ry="6" fill="rgba(251, 191, 36, 0.7)" />

            {/* Specular Glints on Rim */}
            <line x1="16" y1="46" x2="30" y2="48" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <circle cx="90" cy="52" r="2.5" fill="#ffffff" />
          </g>

          <text x="24" y="36" fill="#fde68a" fontSize="9" fontWeight="800" letterSpacing="1.2">GOLDEN HOUR SPECIAL</text>
          <text x="24" y="52" fill="#fafaf9" fontSize="13" fontWeight="800">Amber Coupe Spritz</text>
          <rect x="330" y="16" width="50" height="18" rx="4" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.2)" />
          <text x="355" y="29" fill="#e2e8f0" fontSize="8" fontWeight="800" textAnchor="middle">IMAGE</text>
        </svg>
      );

    // ── 5. TALL HIGHBALL DRINK WITH ORANGE SLICE & ICE (Card 5 & 7 in reference) ──
    case 'cocktail_highball':
      return (
        <svg viewBox="0 0 400 250" width="100%" height="100%" style={{ display: 'block', borderRadius: '8px 8px 0 0' }}>
          <defs>
            <linearGradient id={`bg_hb_${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="50%" stopColor="#451a03" />
              <stop offset="100%" stopColor="#1c1917" />
            </linearGradient>
            <radialGradient id={`glow_hb_${id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(251, 146, 60, 0.35)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          <rect width="400" height="250" fill={`url(#bg_hb_${id})`} />
          <circle cx="200" cy="120" r="130" fill={`url(#glow_hb_${id})`} />

          {/* Highball Tumbler */}
          <g transform="translate(160, 30)">
            <ellipse cx="40" cy="185" rx="36" ry="10" fill="rgba(0,0,0,0.5)" />
            {/* Faceted Highball Glass Body */}
            <polygon points="10,10 70,10 65,180 15,180" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
            {/* Amber Tea / Whisky Liquid */}
            <polygon points="14,35 66,35 62,175 18,175" fill="rgba(234, 88, 12, 0.65)" />

            {/* Stacked Ice Cubes */}
            <rect x="24" y="125" width="28" height="26" rx="4" fill="rgba(255,255,255,0.45)" transform="rotate(6 38 138)" />
            <rect x="26" y="80" width="28" height="26" rx="4" fill="rgba(255,255,255,0.5)" transform="rotate(-8 40 93)" />
            <rect x="22" y="38" width="28" height="26" rx="4" fill="rgba(255,255,255,0.55)" transform="rotate(12 36 51)" />

            {/* Sliced Orange Garnish Wheel */}
            <g transform="translate(48, 15) rotate(35)">
              <circle cx="20" cy="20" r="20" fill="#ea580c" />
              <circle cx="20" cy="20" r="17" fill="#fed7aa" />
              <circle cx="20" cy="20" r="14" fill="#f97316" />
              <path d="M 20 6 L 20 34 M 6 20 L 34 20" stroke="#c2410c" strokeWidth="1.2" />
            </g>

            {/* Specular Highlight */}
            <line x1="14" y1="12" x2="18" y2="178" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
          </g>

          <text x="24" y="36" fill="#fed7aa" fontSize="9" fontWeight="800" letterSpacing="1.2">CRAFT INFUSION</text>
          <text x="24" y="52" fill="#fafaf9" fontSize="13" fontWeight="800">Highball Citrus Blend</text>
          <rect x="330" y="16" width="50" height="18" rx="4" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.2)" />
          <text x="355" y="29" fill="#e2e8f0" fontSize="8" fontWeight="800" textAnchor="middle">IMAGE</text>
        </svg>
      );

    // ── 6. ELECTRIC BLUE CURACAO MOCKTAIL (Card 9 in reference) ──
    case 'cocktail_blue':
      return (
        <svg viewBox="0 0 400 250" width="100%" height="100%" style={{ display: 'block', borderRadius: '8px 8px 0 0' }}>
          <defs>
            <linearGradient id={`bg_blue_${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="40%" stopColor="#083344" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
            <radialGradient id={`glow_curacao_${id}`} cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="rgba(6, 182, 212, 0.45)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          <rect width="400" height="250" fill={`url(#bg_blue_${id})`} />
          <circle cx="200" cy="125" r="140" fill={`url(#glow_curacao_${id})`} />

          {/* Curved Hurricane Glass */}
          <g transform="translate(155, 30)">
            <ellipse cx="45" cy="185" rx="38" ry="10" fill="rgba(0,0,0,0.5)" />
            {/* Glass Stem & Base */}
            <ellipse cx="45" cy="180" rx="32" ry="6" fill="rgba(255,255,255,0.2)" />
            <rect x="43" y="150" width="4" height="30" fill="rgba(255,255,255,0.3)" />

            {/* Hurricane Curving Glass Body */}
            <path d="M 22 15 C 32 60, 10 110, 22 150 L 68 150 C 80 110, 58 60, 68 15 Z" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
            {/* Vivid Blue Curacao Liquid */}
            <path d="M 26 35 C 34 70, 16 110, 26 146 L 64 146 C 74 110, 56 70, 64 35 Z" fill="rgba(6, 182, 212, 0.75)" />

            {/* Cocktail Straw */}
            <line x1="30" y1="5" x2="58" y2="140" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />
            <line x1="28" y1="8" x2="35" y2="12" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />

            {/* Ice Cubes floating in Blue */}
            <rect x="32" y="55" width="22" height="20" rx="3" fill="rgba(255,255,255,0.6)" transform="rotate(10 43 65)" />
            <rect x="36" y="95" width="20" height="20" rx="3" fill="rgba(255,255,255,0.5)" transform="rotate(-15 46 105)" />
          </g>

          <text x="24" y="36" fill="#67e8f9" fontSize="9" fontWeight="800" letterSpacing="1.2">TROPICAL NIGHTS</text>
          <text x="24" y="52" fill="#fafaf9" fontSize="13" fontWeight="800">Blue Curacao Mocktail</text>
          <rect x="330" y="16" width="50" height="18" rx="4" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.2)" />
          <text x="355" y="29" fill="#e2e8f0" fontSize="8" fontWeight="800" textAnchor="middle">IMAGE</text>
        </svg>
      );

    // ── 7. HEALTHCARE & CARDIAC MONITOR (CarePlus Health) ──
    case 'healthcare_cardio':
      return (
        <svg viewBox="0 0 400 250" width="100%" height="100%" style={{ display: 'block', borderRadius: '8px 8px 0 0' }}>
          <defs>
            <linearGradient id={`bg_cardio_${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#042f2e" />
              <stop offset="50%" stopColor="#115e59" />
              <stop offset="100%" stopColor="#021f1d" />
            </linearGradient>
            <linearGradient id={`pulse_grad_${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="40%" stopColor="#2dd4bf" />
              <stop offset="60%" stopColor="#99f6e4" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
          </defs>

          <rect width="400" height="250" fill={`url(#bg_cardio_${id})`} />

          {/* Medical Grid Lines */}
          <g stroke="rgba(45, 212, 191, 0.12)" strokeWidth="0.8">
            <line x1="0" y1="50" x2="400" y2="50" />
            <line x1="0" y1="100" x2="400" y2="100" />
            <line x1="0" y1="150" x2="400" y2="150" />
            <line x1="0" y1="200" x2="400" y2="200" />
            <line x1="80" y1="0" x2="80" y2="250" />
            <line x1="160" y1="0" x2="160" y2="250" />
            <line x1="240" y1="0" x2="240" y2="250" />
            <line x1="320" y1="0" x2="320" y2="250" />
          </g>

          {/* Glowing Medical Shield */}
          <g transform="translate(160, 40)">
            <ellipse cx="40" cy="120" rx="55" ry="14" fill="rgba(0,0,0,0.5)" />
            <path
              d="M 40 10 L 80 25 C 80 75, 40 105, 40 105 C 40 105, 0 75, 0 25 Z"
              fill="rgba(20, 184, 166, 0.3)"
              stroke="#2dd4bf"
              strokeWidth="2.5"
            />
            {/* White Cross */}
            <rect x="33" y="38" width="14" height="40" rx="3" fill="#ffffff" />
            <rect x="20" y="51" width="40" height="14" rx="3" fill="#ffffff" />
          </g>

          {/* Real-Time Cardiogram ECG Pulse Wave */}
          <path
            d="M 0 160 L 110 160 L 125 140 L 138 185 L 155 90 L 172 210 L 188 150 L 205 160 L 400 160"
            fill="none"
            stroke={`url(#pulse_grad_${id})`}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <text x="24" y="36" fill="#99f6e4" fontSize="9" fontWeight="800" letterSpacing="1.2">CLINICAL HEALTHCARE</text>
          <text x="24" y="52" fill="#fafaf9" fontSize="13" fontWeight="800">{brand || 'CarePlus Cardiac'}</text>
          <rect x="330" y="16" width="50" height="18" rx="4" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.2)" />
          <text x="355" y="29" fill="#e2e8f0" fontSize="8" fontWeight="800" textAnchor="middle">IMAGE</text>
        </svg>
      );

    // ── 8. FINTECH & WEALTH VAULT (ZenithPay / CryptoVault) ──
    case 'fintech_gold':
      return (
        <svg viewBox="0 0 400 250" width="100%" height="100%" style={{ display: 'block', borderRadius: '8px 8px 0 0' }}>
          <defs>
            <linearGradient id={`bg_fin_${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="50%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
            <linearGradient id={`gold_coin_${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="35%" stopColor="#eab308" />
              <stop offset="70%" stopColor="#ca8a04" />
              <stop offset="100%" stopColor="#854d0e" />
            </linearGradient>
          </defs>

          <rect width="400" height="250" fill={`url(#bg_fin_${id})`} />

          {/* Cyber Isometric Grid */}
          <g stroke="rgba(99, 102, 241, 0.15)" strokeWidth="0.8">
            <line x1="0" y1="180" x2="400" y2="180" />
            <line x1="0" y1="215" x2="400" y2="215" />
            <line x1="50" y1="150" x2="20" y2="250" />
            <line x1="150" y1="150" x2="120" y2="250" />
            <line x1="250" y1="150" x2="280" y2="250" />
            <line x1="350" y1="150" x2="380" y2="250" />
          </g>

          {/* Bullish Trend Growth Curve */}
          <path
            d="M 20 180 Q 120 170 190 125 T 380 50"
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <polygon points="375,44 388,48 382,60" fill="#10b981" />

          {/* 3D Shiny Gold Crypto & Rupee Coin */}
          <g transform="translate(155, 55)">
            <ellipse cx="45" cy="85" rx="50" ry="14" fill="rgba(0,0,0,0.6)" />
            {/* Outer Coin Rim */}
            <circle cx="45" cy="45" r="42" fill={`url(#gold_coin_${id})`} stroke="#fef08a" strokeWidth="2.5" />
            <circle cx="45" cy="45" r="34" fill="#a16207" stroke="#eab308" strokeWidth="1" />
            {/* Center Symbol */}
            <text x="45" y="55" fill="#fef08a" fontSize="30" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">₹</text>
            {/* Specular Sparkle */}
            <polygon points="65,22 68,27 73,28 68,30 65,35 63,30 58,28 63,27" fill="#ffffff" />
          </g>

          <text x="24" y="36" fill="#fde047" fontSize="9" fontWeight="800" letterSpacing="1.2">SECURE WEALTH</text>
          <text x="24" y="52" fill="#fafaf9" fontSize="13" fontWeight="800">{brand || 'Zenith Financial'}</text>
          <rect x="330" y="16" width="50" height="18" rx="4" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.2)" />
          <text x="355" y="29" fill="#e2e8f0" fontSize="8" fontWeight="800" textAnchor="middle">IMAGE</text>
        </svg>
      );

    // ── 9. E-COMMERCE & SMARTPHONE SALE (Velox Mobile / Retail) ──
    case 'ecommerce_sale':
      return (
        <svg viewBox="0 0 400 250" width="100%" height="100%" style={{ display: 'block', borderRadius: '8px 8px 0 0' }}>
          <defs>
            <linearGradient id={`bg_ecom_${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b0764" />
              <stop offset="50%" stopColor="#581c87" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
            <radialGradient id={`flare_neon_${id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(236, 72, 153, 0.4)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          <rect width="400" height="250" fill={`url(#bg_ecom_${id})`} />
          <circle cx="200" cy="120" r="130" fill={`url(#flare_neon_${id})`} />

          {/* Smartphone Mockup */}
          <g transform="translate(160, 25)">
            <ellipse cx="40" cy="190" rx="46" ry="12" fill="rgba(0,0,0,0.6)" />
            {/* Phone Body */}
            <rect x="5" y="5" width="70" height="145" rx="14" fill="#09090b" stroke="#a855f7" strokeWidth="2.5" />
            {/* Screen */}
            <rect x="9" y="10" width="62" height="135" rx="10" fill="#18181b" />
            {/* Camera Dynamic Island */}
            <rect x="28" y="14" width="24" height="6" rx="3" fill="#000000" />
            {/* Screen Content: Big Offer */}
            <text x="40" y="65" fill="#f43f5e" fontSize="16" fontWeight="900" textAnchor="middle">5G SALE</text>
            <text x="40" y="82" fill="#38bdf8" fontSize="10" fontWeight="800" textAnchor="middle">₹14,999*</text>
            <rect x="18" y="94" width="44" height="16" rx="4" fill="#ec4899" />
            <text x="40" y="105" fill="#ffffff" fontSize="7" fontWeight="800" textAnchor="middle">BUY NOW</text>
          </g>

          <text x="24" y="36" fill="#f472b6" fontSize="9" fontWeight="800" letterSpacing="1.2">ONLINE EXCLUSIVE</text>
          <text x="24" y="52" fill="#fafaf9" fontSize="13" fontWeight="800">{brand || 'Velox Mobile'}</text>
          <rect x="330" y="16" width="50" height="18" rx="4" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.2)" />
          <text x="355" y="29" fill="#e2e8f0" fontSize="8" fontWeight="800" textAnchor="middle">IMAGE</text>
        </svg>
      );

    // ── 10. COSMETICS & BOTANICAL SERUM (NutriGlow / PureGlow) ──
    case 'cosmetics_glow':
      return (
        <svg viewBox="0 0 400 250" width="100%" height="100%" style={{ display: 'block', borderRadius: '8px 8px 0 0' }}>
          <defs>
            <linearGradient id={`bg_cos_${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4a044e" />
              <stop offset="50%" stopColor="#701a75" />
              <stop offset="100%" stopColor="#2e1065" />
            </linearGradient>
            <radialGradient id={`glow_droplet_${id}`} cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="rgba(244, 114, 182, 0.45)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          <rect width="400" height="250" fill={`url(#bg_cos_${id})`} />
          <circle cx="200" cy="115" r="130" fill={`url(#glow_droplet_${id})`} />

          {/* Botanical Aloe / Rose Leaf Silhouette */}
          <path d="M 60 210 C 80 140, 140 120, 170 170 C 140 210, 90 220, 60 210 Z" fill="rgba(74, 222, 128, 0.25)" />
          <path d="M 330 210 C 310 130, 250 110, 220 160 C 250 200, 300 210, 330 210 Z" fill="rgba(74, 222, 128, 0.2)" />

          {/* Glass Serum Bottle with Dropper */}
          <g transform="translate(160, 45)">
            <ellipse cx="40" cy="155" rx="38" ry="10" fill="rgba(0,0,0,0.5)" />
            {/* Dropper Bulb & Pipette */}
            <path d="M 34 10 Q 40 0 46 10 L 46 25 L 34 25 Z" fill="#fdf2f8" />
            <rect x="31" y="25" width="18" height="8" rx="2" fill="#ca8a04" />
            {/* Frosted Glass Body */}
            <rect x="14" y="33" width="52" height="105" rx="8" fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
            {/* Amber Serum Essence Inside */}
            <rect x="18" y="55" width="44" height="80" rx="5" fill="rgba(251, 146, 60, 0.65)" />
            {/* Falling Golden Serum Droplet */}
            <path d="M 40 45 C 36 50, 44 50, 40 45 Z" fill="#fde047" />
          </g>

          <text x="24" y="36" fill="#fbcfe8" fontSize="9" fontWeight="800" letterSpacing="1.2">DERMATOLOGIST TESTED</text>
          <text x="24" y="52" fill="#fafaf9" fontSize="13" fontWeight="800">{brand || 'NutriGlow Organics'}</text>
          <rect x="330" y="16" width="50" height="18" rx="4" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.2)" />
          <text x="355" y="29" fill="#e2e8f0" fontSize="8" fontWeight="800" textAnchor="middle">IMAGE</text>
        </svg>
      );

    // ── 11. AUTOMOTIVE & HYPER EV (SpeedyWheels EV) ──
    case 'automotive_speed':
      return (
        <svg viewBox="0 0 400 250" width="100%" height="100%" style={{ display: 'block', borderRadius: '8px 8px 0 0' }}>
          <defs>
            <linearGradient id={`bg_auto_${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#18181b" />
              <stop offset="50%" stopColor="#09090b" />
              <stop offset="100%" stopColor="#042f2e" />
            </linearGradient>
          </defs>

          <rect width="400" height="250" fill={`url(#bg_auto_${id})`} />

          {/* Speed Streaks */}
          <line x1="20" y1="120" x2="380" y2="120" stroke="rgba(20, 184, 166, 0.3)" strokeWidth="1" strokeDasharray="10 20" />
          <line x1="0" y1="185" x2="400" y2="185" stroke="rgba(45, 212, 191, 0.4)" strokeWidth="2" />

          {/* Sleek EV Car Silhouette */}
          <g transform="translate(90, 85)">
            <ellipse cx="110" cy="85" rx="100" ry="12" fill="rgba(0,0,0,0.7)" />
            {/* Aerodynamic Roof & Body Contour */}
            <path
              d="M 15 65 C 45 40, 95 25, 140 25 C 175 25, 205 45, 215 65 L 205 78 L 10 78 Z"
              fill="#27272a"
              stroke="#2dd4bf"
              strokeWidth="2"
            />
            {/* Cyan LED Lightbar */}
            <path d="M 180 58 L 214 66" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
            {/* Wheels */}
            <circle cx="55" cy="78" r="16" fill="#09090b" stroke="#71717a" strokeWidth="2.5" />
            <circle cx="55" cy="78" r="7" fill="#2dd4bf" />
            <circle cx="175" cy="78" r="16" fill="#09090b" stroke="#71717a" strokeWidth="2.5" />
            <circle cx="175" cy="78" r="7" fill="#2dd4bf" />
          </g>

          <text x="24" y="36" fill="#a7f3d0" fontSize="9" fontWeight="800" letterSpacing="1.2">ELECTRIC PERFORMANCE</text>
          <text x="24" y="52" fill="#fafaf9" fontSize="13" fontWeight="800">{brand || 'SpeedyWheels EV'}</text>
          <rect x="330" y="16" width="50" height="18" rx="4" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.2)" />
          <text x="355" y="29" fill="#e2e8f0" fontSize="8" fontWeight="800" textAnchor="middle">IMAGE</text>
        </svg>
      );

    // ── 12. REAL ESTATE & SKYLINE (Apex Builders) ──
    case 'realestate_horizon':
      return (
        <svg viewBox="0 0 400 250" width="100%" height="100%" style={{ display: 'block', borderRadius: '8px 8px 0 0' }}>
          <defs>
            <linearGradient id={`bg_re_${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="45%" stopColor="#6366f1" />
              <stop offset="70%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
          </defs>

          <rect width="400" height="250" fill={`url(#bg_re_${id})`} />

          {/* Sunset Horizon Sun */}
          <circle cx="200" cy="155" r="45" fill="#fef08a" opacity="0.85" />

          {/* Modern Architectural Skyline Silhouettes */}
          <g fill="#09090b">
            {/* Tower 1 */}
            <rect x="60" y="90" width="45" height="130" />
            <polygon points="60,90 82,60 105,90" />
            {/* Tower 2 (Apex Glass Tower) */}
            <rect x="120" y="50" width="60" height="170" />
            <polygon points="120,50 150,25 180,50" />
            {/* Tower 3 */}
            <rect x="200" y="75" width="55" height="145" />
            {/* Tower 4 */}
            <rect x="270" y="105" width="65" height="115" />
          </g>

          {/* Illuminated Glass Windows */}
          <g fill="#fef08a" opacity="0.75">
            <rect x="135" y="65" width="6" height="6" />
            <rect x="155" y="65" width="6" height="6" />
            <rect x="135" y="85" width="6" height="6" />
            <rect x="155" y="85" width="6" height="6" />
            <rect x="135" y="105" width="6" height="6" />
            <rect x="155" y="105" width="6" height="6" />
          </g>

          <text x="24" y="36" fill="#fed7aa" fontSize="9" fontWeight="800" letterSpacing="1.2">LUXURY SEA-FACING</text>
          <text x="24" y="52" fill="#fafaf9" fontSize="13" fontWeight="800">{brand || 'Apex Residences'}</text>
          <rect x="330" y="16" width="50" height="18" rx="4" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.2)" />
          <text x="355" y="29" fill="#e2e8f0" fontSize="8" fontWeight="800" textAnchor="middle">IMAGE</text>
        </svg>
      );

    // Default Fallback
    default:
      return (
        <svg viewBox="0 0 400 250" width="100%" height="100%" style={{ display: 'block', borderRadius: '8px 8px 0 0' }}>
          <rect width="400" height="250" fill="#0f172a" />
          <text x="200" y="125" fill="#94a3b8" fontSize="14" textAnchor="middle">{brand}</text>
        </svg>
      );
  }
}
