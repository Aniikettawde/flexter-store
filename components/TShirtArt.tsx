export default function TShirtArt({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 460"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="fabric" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1c1c1f" />
          <stop offset="55%" stopColor="#141416" />
          <stop offset="100%" stopColor="#0d0d0f" />
        </linearGradient>
        <linearGradient id="sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.10" />
          <stop offset="30%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Body */}
      <path
        d="M120 70
           L120 30
           C150 8 270 8 300 30
           L300 70
           L390 130
           L350 195
           L300 160
           L300 430
           C300 442 290 450 278 450
           L142 450
           C130 450 120 442 120 430
           L120 160
           L70 195
           L30 130
           Z"
        fill="url(#fabric)"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* sheen highlight */}
      <path
        d="M120 70 L120 30 C150 8 270 8 300 30 L300 70 L235 95 L185 95 Z"
        fill="url(#sheen)"
      />
      {/* collar */}
      <path
        d="M165 32 C185 50 235 50 255 32"
        fill="none"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="2"
      />

      {/* compression banding across torso — echoes the site motif */}
      {[190, 230, 270, 310, 350, 390].map((y, i) => (
        <line
          key={y}
          x1={132 + (i % 2 === 0 ? 0 : 4)}
          y1={y}
          x2={288 - (i % 2 === 0 ? 0 : 4)}
          y2={y}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      ))}

      {/* Flexter mark on chest */}
      <g transform="translate(178, 150) scale(0.32)">
        <path d="M10 44 L78 44 L112 190 L78 210 Z" fill="#f2f2ef" fillOpacity="0.92" />
        <path d="M78 44 L190 44 L152 118 L108 118 Z" fill="#a9a9ac" fillOpacity="0.85" />
        <path d="M96 130 L176 130 L146 190 L118 190 Z" fill="#8f8f94" fillOpacity="0.8" />
      </g>
    </svg>
  );
}
