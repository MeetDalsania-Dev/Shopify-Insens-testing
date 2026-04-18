// Stylized perfume bottle — drawn in SVG. Parallax tilt handled via parent transform.
function Bottle({ shape = "prism", hue = "amber", label = "N°01", name = "Vesper", size = 400 }) {
  // Different silhouettes per fragrance for variety
  const shapes = {
    prism: {
      path: "M 60 30 H 140 V 55 Q 140 62 155 68 Q 172 76 172 96 V 260 Q 172 280 152 280 H 48 Q 28 280 28 260 V 96 Q 28 76 45 68 Q 60 62 60 55 Z",
      cap: { x: 78, y: 0, w: 44, h: 30 }
    },
    orb: {
      path: "M 70 40 H 130 V 60 Q 130 70 145 76 Q 180 92 180 150 Q 180 240 100 280 Q 20 240 20 150 Q 20 92 55 76 Q 70 70 70 60 Z",
      cap: { x: 80, y: 10, w: 40, h: 30 }
    },
    column: {
      path: "M 72 30 H 128 V 52 Q 128 60 138 64 Q 155 70 155 90 V 270 Q 155 282 140 282 H 60 Q 45 282 45 270 V 90 Q 45 70 62 64 Q 72 60 72 52 Z",
      cap: { x: 82, y: 0, w: 36, h: 30 }
    },
    flask: {
      path: "M 80 35 H 120 V 60 Q 120 70 128 78 Q 165 108 165 170 Q 165 280 100 280 Q 35 280 35 170 Q 35 108 72 78 Q 80 70 80 60 Z",
      cap: { x: 86, y: 0, w: 28, h: 35 }
    }
  };
  const s = shapes[shape] || shapes.prism;

  const liquidColors = {
    amber: ["#e6b877", "#8a5a1e"],
    rust:  ["#d97557", "#5a2818"],
    moss:  ["#b3b374", "#3d3d18"],
    iris:  ["#c9b8d9", "#4a3d5a"],
    smoke: ["#a89e8c", "#2a261e"],
    salt:  ["#e8e0d4", "#6a6454"]
  };
  const [top, bot] = liquidColors[hue] || liquidColors.amber;
  const gid = `liq-${Math.random().toString(36).slice(2, 8)}`;
  const gsid = `glass-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <svg viewBox="0 0 200 300" width={size} style={{ maxWidth: "100%", height: "auto" }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={top} stopOpacity="0.92"/>
          <stop offset="100%" stopColor={bot} stopOpacity="0.98"/>
        </linearGradient>
        <linearGradient id={gsid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28"/>
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.02"/>
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.12"/>
        </linearGradient>
        <clipPath id={`clip-${gid}`}>
          <path d={s.path} />
        </clipPath>
      </defs>

      {/* Cap */}
      <rect x={s.cap.x} y={s.cap.y} width={s.cap.w} height={s.cap.h} fill="#1a1612" rx="2"/>
      <rect x={s.cap.x + 2} y={s.cap.y + 2} width={s.cap.w - 4} height="4" fill="#2a251d"/>

      {/* Neck band */}
      <rect x={s.cap.x - 4} y={s.cap.y + s.cap.h} width={s.cap.w + 8} height="5" fill="#0d0b09"/>

      {/* Bottle body */}
      <path d={s.path} fill={`url(#${gid})`} />
      {/* Glass highlight */}
      <path d={s.path} fill={`url(#${gsid})`} />
      {/* Inner shadow edge */}
      <path d={s.path} fill="none" stroke="#000" strokeOpacity="0.35" strokeWidth="1"/>

      {/* Liquid line */}
      <g clipPath={`url(#clip-${gid})`}>
        <rect x="0" y="90" width="200" height="2" fill="#ffffff" fillOpacity="0.18"/>
      </g>

      {/* Label */}
      <g transform="translate(100, 190)" textAnchor="middle" fill="#efe8dc" opacity="0.92">
        <text y="0" fontFamily="JetBrains Mono, monospace" fontSize="7" letterSpacing="2">{label}</text>
        <text y="22" fontFamily="Fraunces, serif" fontSize="14" fontStyle="italic" fontWeight="300">{name}</text>
        <line x1="-20" y1="32" x2="20" y2="32" stroke="#efe8dc" strokeOpacity="0.5"/>
        <text y="46" fontFamily="JetBrains Mono, monospace" fontSize="6" letterSpacing="1.5">EAU DE PARFUM</text>
        <text y="58" fontFamily="JetBrains Mono, monospace" fontSize="6" letterSpacing="1.5">50 ML · 1.7 FL.OZ</text>
      </g>
    </svg>
  );
}

window.Bottle = Bottle;
