import { useState } from 'react';
import type { Processo } from '../../data/types';
import { useFilters } from '../../hooks/useFilters';
import FiltrosPanel from './FiltrosPanel';
import TabelaProcessos from './TabelaProcessos';
import ProcessoModal from './ProcessoModal';

interface Props {
  processos: Processo[];
  initialProcesso?: Processo | null;
  onClearInitial?: () => void;
}

export default function PainelProcessos({ processos, initialProcesso, onClearInitial }: Props) {
  const [selectedProcesso, setSelectedProcesso] = useState<Processo | null>(initialProcesso ?? null);

  const {
    filtros, filtered, activeCount,
    toggleEmpresa, toggleVinculo, toggleStatus, toggleFase,
    toggleRisco, toggleUF, setSearch, toggleAudiencia, togglePrazo, clearFilters,
  } = useFilters(processos);

  function handleVerDetalhes(p: Processo) {
    setSelectedProcesso(p);
    onClearInitial?.();
  }

  return (
    <div className="flex h-full">
      <FiltrosPanel
        filtros={filtros}
        processos={processos}
        activeCount={activeCount}
        onToggleEmpresa={toggleEmpresa}
        onToggleVinculo={toggleVinculo}
        onToggleStatus={toggleStatus}
        onToggleFase={toggleFase}
        onToggleRisco={toggleRisco}
        onToggleUF={toggleUF}
        onToggleAudiencia={toggleAudiencia}
        onTogglePrazo={togglePrazo}
        onClear={clearFilters}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TabelaProcessos
          processos={filtered}
          searchTerm={filtros.searchTerm}
          onSearch={setSearch}
          onVerDetalhes={handleVerDetalhes}
        />
      </div>
      <ProcessoModal
        processo={selectedProcesso}
        onClose={() => setSelectedProcesso(null)}
      />
    </div>
  );
}
