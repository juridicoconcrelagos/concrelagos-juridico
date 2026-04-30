import { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, ExternalLink, FileX } from 'lucide-react';
import type { Processo } from '../../data/types';
import { formatBRLCompact, formatDate } from '../../utils/formatters';
import RiscoBadge from './RiscoBadge';
import StatusBadge from './StatusBadge';

interface Props {
  processos: Processo[];
  searchTerm: string;
  onSearch: (s: string) => void;
  onVerDetalhes: (p: Processo) => void;
}

type SortKey = keyof Pick<Processo, 'reclamante' | 'empresa' | 'fase' | 'status' | 'risco' | 'valor_causa' | 'data_distribuicao' | 'uf'>;

const RISCOS_BORDER: Record<string, string> = {
  Alto: '#EF4444', Médio: '#F59E0B', Baixo: '#22C55E', Provisionado: '#8B5CF6',
};

const PAGE_SIZE = 20;

export default function TabelaProcessos({ processos, searchTerm, onSearch, onVerDetalhes }: Props) {
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>('data_distribuicao');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  }

  const sorted = useMemo(() => {
    return [...processos].sort((a, b) => {
      const av = a[sortKey] as string | number;
      const bv = b[sortKey] as string | number;
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      return sortDir === 'asc'
        ? String(av || '').localeCompare(String(bv || ''), 'pt-BR')
        : String(bv || '').localeCompare(String(av || ''), 'pt-BR');
    });
  }, [processos, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const pageData = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span style={{ opacity: 0.3 }}>⇅</span>;
    return sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  }

  function Th({ col, label }: { col: SortKey; label: string }) {
    return (
      <th
        className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer select-none whitespace-nowrap"
        style={{ color: '#6B7B82', background: '#F5F5F5' }}
        onClick={() => handleSort(col)}
      >
        <span className="flex items-center gap-1 transition-colors" style={{ color: '#6B7B82' }}>
          {label} <SortIcon col={col} />
        </span>
      </th>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex-shrink-0" style={{ borderBottom: '1px solid #E0E0E0', background: '#FFFFFF' }}>
        <div className="relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B7B82' }} />
          <input
            type="text"
            placeholder="Buscar por nome, processo, empresa..."
            value={searchTerm}
            onChange={(e) => { onSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none transition-all"
            style={{ background: '#EBEBEB', border: '1px solid #DCDCDC', color: '#2C363B' }}
          />
        </div>
        <p className="text-xs mt-2" style={{ color: '#6B7B82' }}>
          {sorted.length} processo{sorted.length !== 1 ? 's' : ''} encontrado{sorted.length !== 1 ? 's' : ''}
        </p>
      </div>

      {sorted.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3" style={{ color: '#AAAAAA' }}>
          <FileX size={48} />
          <p className="text-sm">Nenhum processo encontrado</p>
          <p className="text-xs">Tente ajustar os filtros ou o termo de busca</p>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-auto">
            <table className="w-full border-collapse" style={{ minWidth: 900 }}>
              <thead className="sticky top-0 z-10">
                <tr>
                  <th className="w-1" style={{ background: '#F5F5F5' }} />
                  <Th col="reclamante" label="Reclamante" />
                  <Th col="empresa" label="Empresa" />
                  <Th col="uf" label="UF" />
                  <Th col="fase" label="Fase" />
                  <Th col="status" label="Status" />
                  <Th col="risco" label="Risco" />
                  <Th col="valor_causa" label="Valor Causa" />
                  <Th col="data_distribuicao" label="Distribuído" />
                  <th className="px-3 py-3" style={{ background: '#F5F5F5' }} />
                </tr>
              </thead>
              <tbody>
                {pageData.map((p, i) => (
                  <tr
                    key={p.id}
                    className="transition-colors"
                    style={{ background: i % 2 === 0 ? '#FFFFFF' : '#FAFAFA', borderBottom: '1px solid #F0F0F0' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(180,122,24,0.04)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? '#FFFFFF' : '#FAFAFA')}
                  >
                    <td style={{ padding: 0, width: 3 }}>
                      <div style={{ width: 3, height: '100%', minHeight: 48, background: RISCOS_BORDER[p.risco] || '#DCDCDC', borderRadius: '3px 0 0 3px' }} />
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-sm font-medium whitespace-nowrap" style={{ color: '#2C363B' }}>{p.reclamante}</p>
                      <p className="text-xs" style={{ color: '#6B7B82' }}>{p.id}</p>
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-xs whitespace-nowrap max-w-[160px] truncate" style={{ color: '#2C363B' }}>{p.empresa}</p>
                      <p className="text-xs" style={{ color: '#6B7B82' }}>{p.vinculo}</p>
                    </td>
                    <td className="px-3 py-3"><span className="text-xs" style={{ color: '#2C363B' }}>{p.uf}</span></td>
                    <td className="px-3 py-3"><span className="text-xs" style={{ color: '#6B7B82' }}>{p.fase}</span></td>
                    <td className="px-3 py-3"><StatusBadge type="status" value={p.status} /></td>
                    <td className="px-3 py-3"><RiscoBadge risco={p.risco} small /></td>
                    <td className="px-3 py-3 text-right">
                      <span className="text-xs font-medium" style={{ color: '#B45309' }}>
                        {formatBRLCompact(p.valor_causa)}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs" style={{ color: '#6B7B82' }}>{formatDate(p.data_distribuicao)}</span>
                    </td>
                    <td className="px-3 py-3">
                      <button
                        onClick={() => onVerDetalhes(p)}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                        style={{ background: 'rgba(180,122,24,0.08)', color: '#8A5C10', border: '1px solid rgba(180,122,24,0.2)' }}
                      >
                        <ExternalLink size={11} /> Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderTop: '1px solid #E0E0E0', background: '#FFFFFF' }}>
            <p className="text-xs" style={{ color: '#6B7B82' }}>
              Página {page} de {totalPages} · {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} de {sorted.length}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded text-xs transition-colors" style={{ background: '#F0F0F0', color: page === 1 ? '#AAAAAA' : '#6B7B82', border: '1px solid #E0E0E0' }}>← Anterior</button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pg = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                return (
                  <button key={pg} onClick={() => setPage(pg)} className="px-3 py-1 rounded text-xs transition-colors" style={{ background: pg === page ? '#B47A18' : '#F0F0F0', color: pg === page ? '#fff' : '#6B7B82', border: `1px solid ${pg === page ? '#B47A18' : '#E0E0E0'}` }}>{pg}</button>
                );
              })}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded text-xs transition-colors" style={{ background: '#F0F0F0', color: page === totalPages ? '#AAAAAA' : '#6B7B82', border: '1px solid #E0E0E0' }}>Próxima →</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
