import type { ReactNode } from 'react';
import { X, Calendar, DollarSign, User, Scale, AlertCircle, Clock } from 'lucide-react';
import type { Processo } from '../../data/types';
import { formatBRL, maskCPF, formatDate, calcTempoEmCasa } from '../../utils/formatters';
import RiscoBadge from './RiscoBadge';
import StatusBadge from './StatusBadge';

interface Props {
  processo: Processo | null;
  onClose: () => void;
}

function Section({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span style={{ color: '#B47A18' }}>{icon}</span>
        <h3 className="text-sm font-semibold" style={{ color: '#6B7B82' }}>{title}</h3>
      </div>
      <div className="rounded-xl p-4 space-y-3" style={{ background: '#F5F5F5', border: '1px solid #E0E0E0' }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-xs flex-shrink-0" style={{ color: '#6B7B82', minWidth: 120 }}>{label}</span>
      <span className="text-xs text-right font-medium" style={{ color: '#2C363B' }}>{value || '—'}</span>
    </div>
  );
}

function ValueBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.min((value / total) * 100, 100) : 0;
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs" style={{ color: '#6B7B82' }}>{label}</span>
        <span className="text-xs font-medium" style={{ color }}>{formatBRL(value)}</span>
      </div>
      <div className="rounded-full overflow-hidden" style={{ height: 4, background: '#E0E0E0' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export default function ProcessoModal({ processo: p, onClose }: Props) {
  if (!p) return null;

  const maxVal = Math.max(p.valor_causa, p.valor_provisao, p.valor_condenacao, p.valor_acordo, 1);

  return (
    <div
      className="fixed inset-0 z-50 flex"
      style={{ background: 'rgba(44,54,59,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="ml-auto h-full w-full max-w-2xl overflow-y-auto" style={{ background: '#FFFFFF', borderLeft: '1px solid #DCDCDC', boxShadow: '-8px 0 32px rgba(44,54,59,0.1)' }}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between p-6" style={{ background: '#FFFFFF', borderBottom: '1px solid #E0E0E0' }}>
          <div>
            <p className="text-xs font-mono mb-1" style={{ color: '#B47A18' }}>{p.numero_cnj || p.id}</p>
            <h2 className="text-lg font-bold leading-tight" style={{ color: '#2C363B' }}>{p.reclamante}</h2>
            <p className="text-sm mt-1" style={{ color: '#6B7B82' }}>{p.empresa}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <StatusBadge type="status" value={p.status} />
              <StatusBadge type="vinculo" value={p.vinculo} />
              <RiscoBadge risco={p.risco} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors flex-shrink-0"
            style={{ background: '#F5F5F5', color: '#6B7B82', border: '1px solid #E0E0E0' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {p.pedidos.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#6B7B82' }}>Pedidos</p>
              <div className="flex flex-wrap gap-2">
                {p.pedidos.map((ped) => (
                  <span key={ped} className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(180,122,24,0.08)', color: '#8A5C10', border: '1px solid rgba(180,122,24,0.18)' }}>
                    {ped}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Section title="Identificação Processual" icon={<Scale size={14} />}>
            <Field label="Processo CNJ" value={<span className="font-mono text-xs">{p.numero_cnj}</span>} />
            <Field label="Vara / Tribunal" value={p.vara} />
            <Field label="TRT" value={p.trt} />
            <Field label="Cidade / UF" value={`${p.cidade} / ${p.uf}`} />
            <Field label="Instância" value={p.instancia} />
            <Field label="Fase" value={p.fase_display || p.fase} />
          </Section>

          <Section title="Partes" icon={<User size={14} />}>
            <Field label="Reclamante" value={p.reclamante} />
            <Field label="CPF" value={maskCPF(p.cpf)} />
            <Field label="Adv. Reclamante" value={p.adv_reclamante} />
            <Field label="Advogado Interno" value={p.advogado_responsavel_interno} />
            <Field label="Escritório" value={p.escritorio} />
          </Section>

          <Section title="Vínculo Empregatício" icon={<User size={14} />}>
            <Field label="Tipo de Vínculo" value={<StatusBadge type="vinculo" value={p.vinculo} />} />
            <Field label="Cargo / Função" value={p.cargo} />
            <Field label="Período" value={p.periodo} />
            <Field label="Tempo de Casa" value={calcTempoEmCasa(p.periodo)} />
            <Field label="Unidade" value={p.unidade} />
          </Section>

          <Section title="Valores Financeiros" icon={<DollarSign size={14} />}>
            <div className="space-y-3">
              <ValueBar label="Valor da Causa" value={p.valor_causa} total={maxVal} color="#B47A18" />
              <ValueBar label="Provisão Contábil" value={p.valor_provisao} total={maxVal} color="#8B5CF6" />
              {p.valor_condenacao > 0 && (
                <ValueBar label="Valor da Condenação" value={p.valor_condenacao} total={maxVal} color="#EF4444" />
              )}
              {p.valor_acordo > 0 && (
                <ValueBar label="Valor do Acordo" value={p.valor_acordo} total={maxVal} color="#F59E0B" />
              )}
              {p.valor_pago > 0 && (
                <ValueBar label="Valor Pago" value={p.valor_pago} total={maxVal} color="#22C55E" />
              )}
            </div>
          </Section>

          <Section title="Prazos e Audiências" icon={<Calendar size={14} />}>
            <Field label="Distribuição" value={formatDate(p.data_distribuicao)} />
            {p.data_proxima_audiencia && (
              <Field label="Próxima Audiência" value={
                <span style={{ color: '#B47A18' }}>{formatDate(p.data_proxima_audiencia)} — {p.tipo_audiencia}</span>
              } />
            )}
            {p.prazo_vencimento && (
              <Field label="Próximo Prazo" value={<span className="text-red-600">{formatDate(p.prazo_vencimento)}</span>} />
            )}
            {p.recurso && <Field label="Recurso" value={p.recurso} />}
          </Section>

          {p.resultado && (
            <Section title="Resultado" icon={<AlertCircle size={14} />}>
              <Field label="Resultado" value={p.resultado} />
            </Section>
          )}

          {p.observacoes_internas && (
            <Section title="Observações Internas" icon={<Clock size={14} />}>
              <p className="text-xs leading-relaxed" style={{ color: '#2C363B' }}>{p.observacoes_internas}</p>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}
