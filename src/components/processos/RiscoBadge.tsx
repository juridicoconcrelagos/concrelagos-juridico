import type { NivelRisco } from '../../data/types';

interface Props { risco: NivelRisco; small?: boolean }

const config: Record<NivelRisco, { bg: string; text: string; border: string; label: string }> = {
  Alto:         { bg: '#FEE2E2', text: '#DC2626', border: '#FECACA',  label: 'Alto' },
  Médio:        { bg: '#FEF9C3', text: '#B45309', border: '#FDE68A',  label: 'Médio' },
  Baixo:        { bg: '#DCFCE7', text: '#15803D', border: '#BBF7D0',  label: 'Baixo' },
  Provisionado: { bg: '#EDE9FE', text: '#6D28D9', border: '#DDD6FE',  label: 'Provisionado' },
};

export default function RiscoBadge({ risco, small }: Props) {
  const c = config[risco] || config['Médio'];
  return (
    <span
      className="inline-flex items-center rounded-md font-semibold"
      style={{
        background: c.bg, color: c.text, border: `1px solid ${c.border}`,
        fontSize: small ? 10 : 11, padding: small ? '2px 6px' : '3px 8px',
      }}
    >
      {c.label}
    </span>
  );
}
