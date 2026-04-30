import type { ReactNode } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import type { FiltrosAtivos, TipoVinculo, StatusProcesso, FaseProcessual, NivelRisco } from '../../data/types';
import type { Processo } from '../../data/types';

interface Props {
  filtros: FiltrosAtivos;
  processos: Processo[];
  activeCount: number;
  onToggleEmpresa: (e: string) => void;
  onToggleVinculo: (v: TipoVinculo) => void;
  onToggleStatus: (s: StatusProcesso) => void;
  onToggleFase: (f: FaseProcessual) => void;
  onToggleRisco: (r: NivelRisco) => void;
  onToggleUF: (uf: string) => void;
  onToggleAudiencia: () => void;
  onTogglePrazo: () => void;
  onClear: () => void;
}

const EMPRESAS = [
  'Concrelagos Concreto S/A', 'MAQLOC Locação S/A', 'Pedreira Apolo',
  'Pedreira Ipepam', 'Pedreira Outeiro', 'Pedreira Imboassica', 'Pedreira Bangu', 'Aditibras',
];
const VINCULOS: TipoVinculo[] = ['CLT', 'Autônomo PJ', 'Terceirizado', 'Cooperado', 'Eventual'];
const STATUS_LIST: StatusProcesso[] = ['Ativo', 'Suspenso', 'Acordo', 'Encerrado', 'Arquivado', 'Recurso'];
const FASES: FaseProcessual[] = ['Inicial', 'Instrução', 'Sentença', 'Recurso Ordinário', 'TST', 'Execução', 'Encerrado'];
const RISCOS: NivelRisco[] = ['Alto', 'Médio', 'Baixo', 'Provisionado'];

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#6B7B82' }}>{title}</p>
      {children}
    </div>
  );
}

function CheckItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2 py-1 cursor-pointer group">
      <div
        onClick={onChange}
        className="rounded flex items-center justify-center flex-shrink-0 transition-all"
        style={{
          width: 16, height: 16,
          background: checked ? '#B47A18' : '#EBEBEB',
          border: checked ? '1px solid #B47A18' : '1px solid #DCDCDC',
        }}
      >
        {checked && <span className="text-white" style={{ fontSize: 10, lineHeight: 1 }}>✓</span>}
      </div>
      <span
        className="text-xs cursor-pointer select-none"
        style={{ color: checked ? '#2C363B' : '#6B7B82' }}
        onClick={onChange}
      >
        {label}
      </span>
    </label>
  );
}

export default function FiltrosPanel({
  filtros, activeCount,
  onToggleEmpresa, onToggleVinculo, onToggleStatus, onToggleFase,
  onToggleRisco, onToggleUF, onToggleAudiencia, onTogglePrazo, onClear,
  processos,
}: Props) {
  const ufsDisponiveis = [...new Set(processos.map((p) => p.uf))].filter(Boolean).sort();

  return (
    <div
      className="h-full overflow-y-auto p-4"
      style={{ width: 240, background: '#F5F5F5', borderRight: '1px solid #E0E0E0' }}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} style={{ color: '#B47A18' }} />
          <span className="text-sm font-semibold" style={{ color: '#2C363B' }}>Filtros</span>
          {activeCount > 0 && (
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: '#B47A18' }}>
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button onClick={onClear} className="text-xs flex items-center gap-1" style={{ color: '#EF4444' }}>
            <X size={12} /> Limpar
          </button>
        )}
      </div>

      <FilterGroup title="Empresa">
        {EMPRESAS.map((e) => (
          <CheckItem key={e} label={e.replace('Concrelagos Concreto S/A', 'Concrelagos').replace(' S/A', '')} checked={filtros.empresas.includes(e)} onChange={() => onToggleEmpresa(e)} />
        ))}
      </FilterGroup>

      <FilterGroup title="Tipo de Vínculo">
        {VINCULOS.map((v) => (
          <CheckItem key={v} label={v} checked={filtros.vinculos.includes(v)} onChange={() => onToggleVinculo(v)} />
        ))}
      </FilterGroup>

      <FilterGroup title="Status">
        {STATUS_LIST.map((s) => (
          <CheckItem key={s} label={s} checked={filtros.status.includes(s)} onChange={() => onToggleStatus(s)} />
        ))}
      </FilterGroup>

      <FilterGroup title="Fase Processual">
        {FASES.map((f) => (
          <CheckItem key={f} label={f} checked={filtros.fases.includes(f)} onChange={() => onToggleFase(f)} />
        ))}
      </FilterGroup>

      <FilterGroup title="Nível de Risco">
        {RISCOS.map((r) => (
          <CheckItem key={r} label={r} checked={filtros.riscos.includes(r)} onChange={() => onToggleRisco(r)} />
        ))}
      </FilterGroup>

      <FilterGroup title="Estado (UF)">
        <div className="grid grid-cols-3 gap-1">
          {ufsDisponiveis.map((uf) => (
            <button
              key={uf}
              onClick={() => onToggleUF(uf)}
              className="text-xs py-1 rounded transition-colors"
              style={{
                background: filtros.ufs.includes(uf) ? '#B47A18' : '#EBEBEB',
                color: filtros.ufs.includes(uf) ? '#fff' : '#6B7B82',
                border: `1px solid ${filtros.ufs.includes(uf) ? '#B47A18' : '#DCDCDC'}`,
              }}
            >
              {uf}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Extras">
        <CheckItem label="Com audiência pendente" checked={filtros.temAudiencia} onChange={onToggleAudiencia} />
        <CheckItem label="Prazo vencendo em 7 dias" checked={filtros.temPrazo} onChange={onTogglePrazo} />
      </FilterGroup>
    </div>
  );
}
