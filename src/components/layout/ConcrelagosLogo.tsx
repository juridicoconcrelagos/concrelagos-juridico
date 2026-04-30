export const BRAND_GOLD = '#B47A18';
export const BRAND_GOLD_LIGHT = '#CC8E20';
export const BRAND_GOLD_DARK = '#8A5C10';

interface SunIconProps {
  size?: number;
  color?: string;
}

export function SunIcon({ size = 36, color = BRAND_GOLD }: SunIconProps) {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.47;
  const innerR = size * 0.16;
  const N = 8;

  const d = Array.from({ length: N * 2 }, (_, i) => {
    const angle = (i * Math.PI / N) - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = (cx + r * Math.cos(angle)).toFixed(2);
    const y = (cy + r * Math.sin(angle)).toFixed(2);
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ') + ' Z';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <path d={d} fill={color} />
    </svg>
  );
}

interface LogoProps {
  collapsed?: boolean;
  subtitle?: string;
  iconSize?: number;
}

export default function ConcrelagosLogo({ collapsed = false, subtitle = 'Jurídico Trabalhista', iconSize = 36 }: LogoProps) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-shrink-0">
        <SunIcon size={iconSize} color={BRAND_GOLD} />
      </div>
      {!collapsed && (
        <div className="overflow-hidden leading-tight">
          <p
            className="font-black truncate"
            style={{
              color: '#FFFFFF',
              fontSize: iconSize * 0.33,
              letterSpacing: '0.10em',
              fontFamily: "'Playfair Display', serif",
            }}
          >
            CONCRELAGOS
          </p>
          {subtitle && (
            <p
              className="font-medium tracking-wider truncate"
              style={{ color: 'rgba(255,255,255,0.55)', fontSize: iconSize * 0.22 }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
