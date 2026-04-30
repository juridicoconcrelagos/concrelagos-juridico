import { useMemo } from 'react';
import type { Processo } from '../data/types';

export function useStats(processos: Processo[]) {
  return useMemo(() => {
    const total = processos.length;
    const totalCausa = processos.reduce((s, p) => s + p.valor_causa, 0);
    const totalProvisao = processos.reduce((s, p) => s + p.valor_provisao, 0);
    const totalPago = processos.reduce((s, p) => s + p.valor_pago, 0);
    const totalCondenacao = processos.reduce((s, p) => s + p.valor_condenacao, 0);

    const porEmpresa = Array.from(
      processos.reduce((acc, p) => {
        const emp = p.empresa || 'Sem empresa';
        if (!acc.has(emp)) acc.set(emp, { count: 0, totalCausa: 0, totalProvisao: 0 });
        const e = acc.get(emp)!;
        e.count++;
        e.totalCausa += p.valor_causa;
        e.totalProvisao += p.valor_provisao;
        return acc;
      }, new Map<string, { count: number; totalCausa: number; totalProvisao: number }>()),
    ).map(([empresa, data]) => ({ empresa, ...data }));

    const porFase = processos.reduce((acc, p) => {
      acc[p.fase] = (acc[p.fase] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const porRisco = processos.reduce((acc, p) => {
      acc[p.risco] = (acc[p.risco] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const porVinculo = processos.reduce((acc, p) => {
      acc[p.vinculo] = (acc[p.vinculo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const porStatus = processos.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const today = new Date();
    const in30 = new Date(today);
    in30.setDate(in30.getDate() + 30);
    const in7 = new Date(today);
    in7.setDate(in7.getDate() + 7);

    function parseDate(d: string | null | undefined): Date | null {
      if (!d) return null;
      if (d.match(/^\d{4}-\d{2}-\d{2}$/)) return new Date(d + 'T00:00:00');
      const parts = d.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (parts) return new Date(`${parts[3]}-${parts[2].padStart(2,'0')}-${parts[1].padStart(2,'0')}T00:00:00`);
      return null;
    }

    const audienciasProximas = processos.filter((p) => {
      if (!p.data_proxima_audiencia) return false;
      const d = parseDate(p.data_proxima_audiencia);
      if (!d) return false;
      return d >= today && d <= in30;
    });

    const prazosVencendo = processos.filter((p) => {
      if (!p.prazo_vencimento) return false;
      const d = parseDate(p.prazo_vencimento);
      if (!d) return false;
      return d >= today && d <= in7;
    });

    const pedidosCount = processos.reduce((acc, p) => {
      p.pedidos.forEach((ped) => {
        acc[ped] = (acc[ped] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);
    const top5Pedidos = Object.entries(pedidosCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));

    const evolucaoMensal = buildEvolucaoMensal(processos);

    return {
      total,
      totalCausa,
      totalProvisao,
      totalPago,
      totalCondenacao,
      porEmpresa,
      porFase,
      porRisco,
      porVinculo,
      porStatus,
      audienciasProximas,
      prazosVencendo,
      top5Pedidos,
      evolucaoMensal,
    };
  }, [processos]);
}

function buildEvolucaoMensal(processos: Processo[]) {
  const now = new Date();
  const months: { mes: string; novos: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      mes: d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
      novos: 0,
    });
  }
  processos.forEach((p) => {
    const raw = p.data_distribuicao;
    if (!raw) return;
    const parts = raw.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (!parts) return;
    const d = new Date(Number(parts[3]), Number(parts[2]) - 1, Number(parts[1]));
    for (let i = 0; i < 12; i++) {
      const ref = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      const refEnd = new Date(ref.getFullYear(), ref.getMonth() + 1, 0);
      if (d >= ref && d <= refEnd) {
        months[i].novos++;
        break;
      }
    }
  });
  return months;
}
