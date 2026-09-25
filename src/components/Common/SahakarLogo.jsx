import React from 'react';

/**
 * SahakarSeva Official Emblem & Brand Logo
 * Features:
 * - Dynamic geometric cooperative synergy arcs forming an interlocking "S"
 * - Central upward golden star of worker empowerment & dignity
 * - Scalable vector graphic with glowing cyan-teal-emerald gradients
 */
export const SahakarLogo = ({ className = "w-10 h-10", size = 40, animated = false }) => {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full drop-shadow-md ${animated ? 'hover:scale-105 transition-transform' : ''}`}
      >
        <defs>
          {/* Outer Shield Gradient */}
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f766e" />
            <stop offset="50%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* Inner Cyan-Emerald Glow Gradient */}
          <linearGradient id="arcGradLeft" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>

          <linearGradient id="arcGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>

          {/* Golden Center Star Gradient */}
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          {/* Drop Glow Filter */}
          <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0d9488" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Squircle Hex Shield Base */}
        <rect
          x="6"
          y="6"
          width="88"
          height="88"
          rx="24"
          fill="#020617"
          stroke="url(#shieldGrad)"
          strokeWidth="3.5"
          filter="url(#logoGlow)"
        />

        {/* Subtle Background Radial Aura */}
        <circle cx="50" cy="50" r="32" fill="#0f766e" opacity="0.15" />

        {/* Interlocking Cooperative Arc 1: Left Ascending Arm (Sahakar Unity) */}
        <path
          d="M 28 64 C 24 50, 32 32, 50 28 C 42 36, 40 48, 48 54 C 54 58, 62 62, 60 72 C 58 78, 44 82, 34 76 C 30 73, 28 68, 28 64 Z"
          fill="url(#arcGradLeft)"
          opacity="0.95"
        />

        {/* Interlocking Cooperative Arc 2: Right Descending & Soaring Arm (Seva Support) */}
        <path
          d="M 72 36 C 76 50, 68 68, 50 72 C 58 64, 60 52, 52 46 C 46 42, 38 38, 40 28 C 42 22, 56 18, 66 24 C 70 27, 72 32, 72 36 Z"
          fill="url(#arcGradRight)"
          opacity="0.95"
        />

        {/* Central Upward Diamond Star of Empowerment (Shramik Gaurav / NCCT Excellence) */}
        <polygon
          points="50,30 55,46 71,50 55,54 50,70 45,54 29,50 45,46"
          fill="url(#goldGrad)"
          filter="drop-shadow(0 0 5px rgba(251, 191, 36, 0.7))"
        />

        {/* Center Precision Core */}
        <circle cx="50" cy="50" r="3" fill="#ffffff" />
      </svg>
    </div>
  );
};
