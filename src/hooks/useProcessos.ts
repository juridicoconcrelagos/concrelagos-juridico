import { useState, useEffect, useCallback } from 'react';
import type { Processo } from '../data/types';
import { processos as mockData } from '../data/mockData';
import { APPS_SCRIPT_URL } from '../data/sheetsConfig';

interface UseProcessosResult {
  processos: Processo[];
  loading: boolean;
  erro: string | null;
  atualizar: () => void;
  fonte: 'planilha' | 'demo';
}

export function useProcessos(): UseProcessosResult {
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [fonte, setFonte] = useState<'planilha' | 'demo'>('demo');
  const [rev, setRev] = useState(0);

  const atualizar = useCallback(() => setRev(r => r + 1), []);

  useEffect(() => {
    if (!APPS_SCRIPT_URL) {
      setProcessos(mockData);
      setFonte('demo');
      setLoading(false);
      return;
    }

    setLoading(true);
    setErro(null);

    fetch(APPS_SCRIPT_URL, { redirect: 'follow' })
      .then(r => {
        if (!r.ok) throw new Error(`Erro HTTP ${r.status}`);
        return r.json();
      })
      .then((data: { processos?: Processo[]; error?: string }) => {
        if (Array.isArray(data.processos)) {
          setProcessos(data.processos);
          setFonte('planilha');
          setErro(null);
        } else {
          throw new Error(data.error || 'Resposta inválida da planilha');
        }
      })
      .catch(err => {
        console.error('[Sheets] Falha ao buscar dados:', err);
        setErro(err.message);
        setProcessos(mockData);
        setFonte('demo');
      })
      .finally(() => setLoading(false));
  }, [rev]);

  return { processos, loading, erro, atualizar, fonte };
}
