import { useState, useMemo } from 'react';
import type { Processo, FiltrosAtivos, TipoVinculo, StatusProcesso, FaseProcessual, NivelRisco } from '../data/types';

const initialFiltros: FiltrosAtivos = {
  empresas: [],
  vinculos: [],
  status: [],
  fases: [],
  riscos: [],
  ufs: [],
  searchTerm: '',
  valorCausaMin: 0,
  valorCausaMax: 10_000_000,
  temAudiencia: false,
  temPrazo: false,
};

export function useFilters(processos: Processo[]) {
  const [filtros, setFiltros] = useState<FiltrosAtivos>(initialFiltros);

  const filtered = useMemo(() => {
    return processos.filter((p) => {
      if (filtros.empresas.length > 0 && !filtros.empresas.includes(p.empresa)) return false;
      if (filtros.vinculos.length > 0 && !filtros.vinculos.includes(p.vinculo)) return false;
      if (filtros.status.length > 0 && !filtros.status.includes(p.status)) return false;
      if (filtros.fases.length > 0 && !filtros.fases.includes(p.fase)) return false;
      if (filtros.riscos.length > 0 && !filtros.riscos.includes(p.risco)) return false;
      if (filtros.ufs.length > 0 && !filtros.ufs.includes(p.uf)) return false;
      if (filtros.valorCausaMin > 0 && p.valor_causa < filtros.valorCausaMin) return false;
      if (filtros.valorCausaMax < 10_000_000 && p.valor_causa > filtros.valorCausaMax) return false;
      if (filtros.temAudiencia && !p.data_proxima_audiencia) return false;
      if (filtros.temPrazo && !p.prazo_vencimento) return false;
      if (filtros.searchTerm) {
        const q = filtros.searchTerm.toLowerCase();
        const fields = [
          p.reclamante, p.numero_cnj, p.empresa, p.cargo,
          p.vara, p.cidade, p.uf, p.adv_reclamante,
        ];
        if (!fields.some((f) => f?.toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }, [processos, filtros]);

  const activeCount = useMemo(() => {
    let c = 0;
    if (filtros.empresas.length) c++;
    if (filtros.vinculos.length) c++;
    if (filtros.status.length) c++;
    if (filtros.fases.length) c++;
    if (filtros.riscos.length) c++;
    if (filtros.ufs.length) c++;
    if (filtros.searchTerm) c++;
    if (filtros.valorCausaMin > 0 || filtros.valorCausaMax < 10_000_000) c++;
    if (filtros.temAudiencia) c++;
    if (filtros.temPrazo) c++;
    return c;
  }, [filtros]);

  function toggleEmpresa(e: string) {
    setFiltros((f) => ({
      ...f,
      empresas: f.empresas.includes(e) ? f.empresas.filter((x) => x !== e) : [...f.empresas, e],
    }));
  }
  function toggleVinculo(v: TipoVinculo) {
    setFiltros((f) => ({
      ...f,
      vinculos: f.vinculos.includes(v) ? f.vinculos.filter((x) => x !== v) : [...f.vinculos, v],
    }));
  }
  function toggleStatus(s: StatusProcesso) {
    setFiltros((f) => ({
      ...f,
      status: f.status.includes(s) ? f.status.filter((x) => x !== s) : [...f.status, s],
    }));
  }
  function toggleFase(fa: FaseProcessual) {
    setFiltros((f) => ({
      ...f,
      fases: f.fases.includes(fa) ? f.fases.filter((x) => x !== fa) : [...f.fases, fa],
    }));
  }
  function toggleRisco(r: NivelRisco) {
    setFiltros((f) => ({
      ...f,
      riscos: f.riscos.includes(r) ? f.riscos.filter((x) => x !== r) : [...f.riscos, r],
    }));
  }
  function toggleUF(uf: string) {
    setFiltros((f) => ({
      ...f,
      ufs: f.ufs.includes(uf) ? f.ufs.filter((x) => x !== uf) : [...f.ufs, uf],
    }));
  }
  function setSearch(s: string) {
    setFiltros((f) => ({ ...f, searchTerm: s }));
  }
  function setValorRange(min: number, max: number) {
    setFiltros((f) => ({ ...f, valorCausaMin: min, valorCausaMax: max }));
  }
  function toggleAudiencia() {
    setFiltros((f) => ({ ...f, temAudiencia: !f.temAudiencia }));
  }
  function togglePrazo() {
    setFiltros((f) => ({ ...f, temPrazo: !f.temPrazo }));
  }
  function clearFilters() {
    setFiltros(initialFiltros);
  }

  return {
    filtros,
    filtered,
    activeCount,
    toggleEmpresa,
    toggleVinculo,
    toggleStatus,
    toggleFase,
    toggleRisco,
    toggleUF,
    setSearch,
    setValorRange,
    toggleAudiencia,
    togglePrazo,
    clearFilters,
  };
}
