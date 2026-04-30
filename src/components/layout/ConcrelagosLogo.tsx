export const BRAND_GOLD = '#B47A18';
export const BRAND_GOLD_LIGHT = '#CC8E20';
export const BRAND_GOLD_DARK = '#8A5C10';

function sunPath(cx: number, cy: number, outerR: number, innerR: number, n = 12): string {
  return Array.from({ length: n * 2 }, (_, i) => {
    const angle = (i * Math.PI / n) - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = (cx + r * Math.cos(angle)).toFixed(2);
    const y = (cy + r * Math.sin(angle)).toFixed(2);
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ') + ' Z';
}

interface SunIconProps { size?: number; color?: string }

export function SunIcon({ size = 36, color = BRAND_GOLD }: SunIconProps) {
  const c = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <path d={sunPath(c, c, size * 0.48, size * 0.26, 12)} fill={color} />
    </svg>
  );
}

interface LogoProps {
  collapsed?: boolean;
  subtitle?: string;
  dark?: boolean;
  width?: number;
}

export default function ConcrelagosLogo({ collapsed = false, subtitle, dark = true, width = 200 }: LogoProps) {
  const textColor = dark ? '#FFFFFF' : '#3D4449';
  const subTextColor = dark ? 'rgba(255,255,255,0.6)' : '#3D4449';
  const subtitleColor = dark ? 'rgba(255,255,255,0.55)' : '#6B7B82';

  if (collapsed) {
    return <SunIcon size={32} />;
  }

  // ViewBox: 252 wide × 60 tall
  // CONCRELAG at fs=36 bold-condensed ~190u | sun cx=195 r=20 | S at x=217
  const VW = 252, VH = 60;
  const SUN_CX = 194, SUN_CY = 21;
  const OUT_R = 20, IN_R = 10;
  const height = Math.round(width * VH / VW);

  return (
    <div className="flex flex-col items-start">
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        width={width}
        height={height}
        style={{ display: 'block', overflow: 'visible' }}
      >
        {/* CONCRELAG */}
        <text
          x="0" y="40"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fontWeight="900"
          fontSize="36"
          letterSpacing="-1"
          fill={textColor}
        >
          CONCRELAG
        </text>

        {/* Sol */}
        <path d={sunPath(SUN_CX, SUN_CY, OUT_R, IN_R, 12)} fill={BRAND_GOLD} />

        {/* S */}
        <text
          x="216" y="40"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fontWeight="900"
          fontSize="36"
          letterSpacing="-1"
          fill={textColor}
        >
          S
        </text>

        {/* CONCRETO */}
        <text
          x="1" y="55"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fontWeight="500"
          fontSize="10"
          letterSpacing="5.5"
          fill={subTextColor}
        >
          CONCRETO
        </text>
      </svg>

      {subtitle && (
        <p
          style={{
            color: subtitleColor,
            fontSize: 10,
            marginTop: 3,
            letterSpacing: '0.18em',
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontWeight: 500,
          }}
        >
          {subtitle.toUpperCase()}
        </p>
      )}
    </div>
  );
}
