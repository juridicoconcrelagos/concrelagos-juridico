import type { ReactNode } from 'react';

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  accentColor?: string;
  trend?: { value: number; label: string };
}

export default function KPICard({ title, value, subtitle, icon, accentColor = '#B47A18', trend }: KPICardProps) {
  return (
    <div
      className="rounded-xl p-5 fade-in"
      style={{
        background: '#F5F5F5',
        border: '1px solid #DCDCDC',
        boxShadow: '0 1px 4px rgba(44,54,59,0.06)',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#6B7B82' }}>
          {title}
        </p>
        <div
          className="flex items-center justify-center rounded-lg"
          style={{ width: 36, height: 36, background: `${accentColor}18` }}
        >
          <span style={{ color: accentColor }}>{icon}</span>
        </div>
      </div>
      <p className="text-2xl font-bold mb-1" style={{ color: '#2C363B' }}>{value}</p>
      {subtitle && (
        <p className="text-xs" style={{ color: '#6B7B82' }}>{subtitle}</p>
      )}
      {trend && (
        <div className="flex items-center gap-1 mt-2">
          <span
            className="text-xs font-medium"
            style={{ color: trend.value >= 0 ? '#15803D' : '#DC2626' }}
          >
            {trend.value >= 0 ? '▲' : '▼'} {Math.abs(trend.value)}%
          </span>
          <span className="text-xs" style={{ color: '#6B7B82' }}>{trend.label}</span>
        </div>
      )}
    </div>
  );
}
