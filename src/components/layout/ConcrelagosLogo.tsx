export const BRAND_GOLD = '#B47A18';
export const BRAND_GOLD_LIGHT = '#CC8E20';
export const BRAND_GOLD_DARK = '#8A5C10';

function sunPath(cx: number, cy: number, outerR: number, innerR: number, n = 8): string {
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
      <path d={sunPath(c, c, size * 0.46, size * 0.24, 8)} fill={color} />
    </svg>
  );
}

interface LogoProps {
  collapsed?: boolean;
  subtitle?: string;
  dark?: boolean;
}

export default function ConcrelagosLogo({ collapsed = false, subtitle = 'Jurídico Trabalhista', dark = true }: LogoProps) {
  const textColor = dark ? '#FFFFFF' : '#2C363B';
  const subColor = dark ? 'rgba(255,255,255,0.55)' : '#6B7B82';

  if (collapsed) {
    return <SunIcon size={32} />;
  }

  // SVG canvas: 244 × 62
  // CONCRELAG (9 chars ~190u at fs38) | sun center 197 | S at 218 | total ~240
  const SUN_CX = 195, SUN_CY = 22;
  const OUT_R = 20, IN_R = 9;

  return (
    <div className="flex flex-col">
      <svg
        viewBox="0 0 244 62"
        width="200"
        height="51"
        style={{ display: 'block', overflow: 'visible' }}
      >
        {/* CONCRELAG */}
        <text
          x="0" y="42"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fontWeight="800"
          fontSize="38"
          letterSpacing="-0.5"
          fill={textColor}
        >
          CONCRELAG
        </text>

        {/* Sol */}
        <path d={sunPath(SUN_CX, SUN_CY, OUT_R, IN_R, 8)} fill={BRAND_GOLD} />

        {/* S */}
        <text
          x="217" y="42"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fontWeight="800"
          fontSize="38"
          letterSpacing="-0.5"
          fill={textColor}
        >
          S
        </text>

        {/* CONCRETO */}
        <text
          x="1" y="58"
          fontFamily="'DM Sans', system-ui, sans-serif"
          fontWeight="400"
          fontSize="10.5"
          letterSpacing="5.8"
          fill={subColor}
        >
          CONCRETO
        </text>
      </svg>

      {subtitle && (
        <p
          className="font-medium tracking-widest"
          style={{ color: subColor, fontSize: 10, marginTop: 2, letterSpacing: '0.15em' }}
        >
          {subtitle.toUpperCase()}
        </p>
      )}
    </div>
  );
}
