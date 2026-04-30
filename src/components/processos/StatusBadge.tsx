import type { StatusProcesso, TipoVinculo } from '../../data/types';

type BadgeType = 'status' | 'vinculo';

const statusConfig: Record<StatusProcesso, { bg: string; text: string }> = {
  Ativo:     { bg: 'rgba(180,122,24,0.10)',  text: '#8A5C10' },
  Suspenso:  { bg: 'rgba(107,123,130,0.12)', text: '#4B5563' },
  Acordo:    { bg: 'rgba(245,158,11,0.12)',  text: '#B45309' },
  Encerrado: { bg: 'rgba(34,197,94,0.12)',  text: '#16A34A' },
  Arquivado: { bg: 'rgba(107,123,130,0.08)', text: '#6B7B82' },
  Recurso:   { bg: 'rgba(236,72,153,0.10)',  text: '#BE185D' },
};

const vinculoConfig: Record<TipoVinculo, { bg: string; text: string }> = {
  'CLT':          { bg: 'rgba(180,122,24,0.10)',  text: '#8A5C10' },
  'Terceirizado': { bg: 'rgba(245,158,11,0.10)',  text: '#B45309' },
  'Autônomo PJ':  { bg: 'rgba(139,92,246,0.10)',  text: '#6D28D9' },
  'Cooperado':    { bg: 'rgba(34,197,94,0.10)',  text: '#16A34A' },
  'Eventual':     { bg: 'rgba(107,123,130,0.10)', text: '#4B5563' },
};

interface Props {
  type: BadgeType;
  value: StatusProcesso | TipoVinculo;
}

export default function StatusBadge({ type, value }: Props) {
  const c = type === 'status'
    ? (statusConfig[value as StatusProcesso] || { bg: 'rgba(107,123,130,0.1)', text: '#6B7B82' })
    : (vinculoConfig[value as TipoVinculo] || { bg: 'rgba(107,123,130,0.1)', text: '#6B7B82' });

  return (
    <span
      className="inline-flex items-center rounded-md font-semibold"
      style={{ background: c.bg, color: c.text, fontSize: 11, padding: '3px 8px' }}
    >
      {value}
    </span>
  );
}
