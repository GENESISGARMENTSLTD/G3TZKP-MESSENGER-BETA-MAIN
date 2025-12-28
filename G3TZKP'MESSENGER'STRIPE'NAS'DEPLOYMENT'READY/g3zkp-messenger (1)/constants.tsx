
import React from 'react';

export const COLORS = {
  BLUE: '#0088FF',
  GREEN: '#00CC88',
};

export const PRICING = {
  ONE_TIME: '£29.99',
  TRIAL_DAYS: 7,
};

export const LOGO = (className?: string) => (
  <svg 
    viewBox="0 0 200 200" 
    className={className || "w-10 h-10"} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="emblemGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="#00f3ff" stopOpacity="0.8" />
        <stop offset="70%" stopColor="#00f3ff" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#00f3ff" stopOpacity="0" />
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <pattern id="flowerPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <circle cx="20" cy="20" r="18" stroke="#00f3ff" strokeWidth="0.5" opacity="0.3"/>
        <circle cx="0" cy="20" r="18" stroke="#00f3ff" strokeWidth="0.5" opacity="0.3"/>
        <circle cx="40" cy="20" r="18" stroke="#00f3ff" strokeWidth="0.5" opacity="0.3"/>
        <circle cx="20" cy="0" r="18" stroke="#00f3ff" strokeWidth="0.5" opacity="0.3"/>
        <circle cx="20" cy="40" r="18" stroke="#00f3ff" strokeWidth="0.5" opacity="0.3"/>
      </pattern>
    </defs>
    
    {/* Outer Atmosphere Glow */}
    <circle cx="100" cy="100" r="95" fill="url(#emblemGlow)" opacity="0.2" />
    
    {/* Outer Shell - Isomorphic Fractal Boundary */}
    <g className="animate-[spin_60s_linear_infinite]" style={{ transformOrigin: 'center' }}>
      <circle cx="100" cy="100" r="85" stroke="#00f3ff" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.5"/>
      {[...Array(12)].map((_, i) => (
        <path 
          key={i}
          d="M100 15 A85 85 0 0 1 185 100" 
          stroke="#00f3ff" 
          strokeWidth="0.2" 
          transform={`rotate(${i * 30} 100 100)`}
          opacity="0.3"
        />
      ))}
    </g>

    {/* Core Isomorphic Structure - Flower of Life Variant */}
    <g className="animate-[pulse_4s_easeInOut_infinite]" style={{ transformOrigin: 'center' }} filter="url(#glow)">
      <circle cx="100" cy="100" r="60" stroke="#00f3ff" strokeWidth="1" opacity="0.8"/>
      <g>
        {/* Central Hexagonal Lattice */}
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <circle 
            key={angle}
            cx={100 + 30 * Math.cos(angle * Math.PI / 180)} 
            cy={100 + 30 * Math.sin(angle * Math.PI / 180)} 
            r="30" 
            stroke="#00f3ff" 
            strokeWidth="0.8" 
            opacity="0.6"
          />
        ))}
        <circle cx="100" cy="100" r="30" stroke="#00f3ff" strokeWidth="0.8" opacity="0.9"/>
      </g>
      
      {/* Inner Fractal Nodes */}
      <g className="animate-[spin_20s_linear_infinite]" style={{ transformOrigin: 'center' }}>
        {[...Array(18)].map((_, i) => (
          <circle 
            key={i}
            cx={100 + 50 * Math.cos(i * 20 * Math.PI / 180)} 
            cy={100 + 50 * Math.sin(i * 20 * Math.PI / 180)} 
            r="2" 
            fill="#00f3ff" 
            className="animate-pulse"
          />
        ))}
      </g>
    </g>

    {/* Center Singularity */}
    <circle cx="100" cy="100" r="5" fill="#fff" filter="url(#glow)">
      <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
    </circle>
  </svg>
);
