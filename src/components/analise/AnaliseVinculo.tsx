import type { ReactNode } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, CartesianGrid, Cell,
} from 'recharts';
import type { Processo } from '../../data/types';
import { formatBRL, formatBRLCompact } from '../../utils/formatters';

interface Props { processos: Processo[] }

const CHART_TOOLTIP_STYLE = {
  contentStyle: { background: '#2C363B', border: 'none', borderRadius: 8, color: '#FFFFFF' },
  labelStyle: { color: 'rgba(255,255,255,0.65)' },
};

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl p-5" style={{ background: '#F5F5F5', border: '1px solid #DCDCDC' }}>
      <p className="text-sm font-medium mb-4" style={{ color: '#2C363B' }}>{title}</p>
      {children}
    </div>
  );
}

function KPIRow({ label, clt, pj, outros }: { label: string; clt: string | number; pj: string | number; outros?: string | number }) {
  return (
    <div className="grid grid-cols-4 gap-3 py-2" style={{ borderBottom: '1px solid #E0E0E0' }}>
      <span className="text-xs" style={{ color: '#6B7B82' }}>{label}</span>
      <span className="text-xs font-medium text-center" style={{ color: '#8A5C10' }}>{clt}</span>
      <span className="text-xs font-medium text-center" style={{ color: '#6D28D9' }}>{pj}</span>
      {outros !== undefined && <span className="text-xs font-medium text-center" style={{ color: '#B45309' }}>{outros}</span>}
    </div>
  );
}

export default function AnaliseVinculo({ processos }: Props) {
  const clt = processos.filter((p) => p.vinculo === 'CLT');
  const pj = processos.filter((p) => p.vinculo === 'Autônomo PJ');
  const outros = processos.filter((p) => !['CLT', 'Autônomo PJ'].includes(p.vinculo));

  function avg(arr: Processo[], key: 'valor_causa' | 'valor_provisao') {
    if (!arr.length) return 0;
    return arr.reduce((s, p) => s + p[key], 0) / arr.length;
  }
  function total(arr: Processo[], key: 'valor_causa' | 'valor_provisao') {
    return arr.reduce((s, p) => s + p[key], 0);
  }
  function pctRisco(arr: Processo[], r: string) {
    if (!arr.length) return '0%';
    return `${Math.round((arr.filter((p) => p.risco === r).length / arr.length) * 100)}%`;
  }

  const cargosMap = processos.reduce((acc, p) => {
    const c = p.cargo?.trim().toUpperCase() || 'NÃO INFORMADO';
    if (!acc[c]) acc[c] = { total: 0, clt: 0, pj: 0 };
    acc[c].total++;
    if (p.vinculo === 'CLT') acc[c].clt++;
    else if (p.vinculo === 'Autônomo PJ') acc[c].pj++;
    return acc;
  }, {} as Record<string, { total: number; clt: number; pj: number }>);

  const topCargos = Object.entries(cargosMap)
    .filter(([k]) => k && k !== 'NÃO INFORMADO')
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 8)
    .map(([name, d]) => ({ name: name.length > 28 ? name.slice(0, 26) + '…' : name, ...d }));

  const scatterCLT = clt.slice(0, 80).map((p) => {
    const yr = p.data_distribuicao?.match(/\d{4}/)?.[0];
    return { x: yr ? parseInt(yr) + (Math.random() * 0.8) : 2024, y: p.valor_causa / 1000, id: p.id };
  }).filter((d) => d.y > 0);

  const scatterPJ = pj.slice(0, 80).map((p) => {
    const yr = p.data_distribuicao?.match(/\d{4}/)?.[0];
    return { x: yr ? parseInt(yr) + (Math.random() * 0.8) : 2024, y: p.valor_causa / 1000, id: p.id };
  }).filter((d) => d.y > 0);

  const pedidosCLT = clt.reduce((acc, p) => { p.pedidos.forEach((ped) => { acc[ped] = (acc[ped] || 0) + 1; }); return acc; }, {} as Record<string, number>);
  const pedidosPJ = pj.reduce((acc, p) => { p.pedidos.forEach((ped) => { acc[ped] = (acc[ped] || 0) + 1; }); return acc; }, {} as Record<string, number>);
  const allPedidos = [...new Set([...Object.keys(pedidosCLT), ...Object.keys(pedidosPJ)])];
  const pedidosComparison = allPedidos.map((ped) => ({ name: ped, CLT: pedidosCLT[ped] || 0, PJ: pedidosPJ[ped] || 0 }))
    .sort((a, b) => (b.CLT + b.PJ) - (a.CLT + a.PJ)).slice(0, 8);

  return (
    <div className="p-6 space-y-6">
      {/* Summary KPIs */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #DCDCDC' }}>
        <div className="grid grid-cols-4 gap-3 px-4 py-3" style={{ background: '#F5F5F5', borderBottom: '1px solid #E0E0E0' }}>
          <span className="text-xs font-semibold uppercase" style={{ color: '#6B7B82' }}>Indicador</span>
          <span className="text-xs font-semibold uppercase text-center" style={{ color: '#8A5C10' }}>CLT ({clt.length})</span>
          <span className="text-xs font-semibold uppercase text-center" style={{ color: '#6D28D9' }}>Autônomo PJ ({pj.length})</span>
          <span className="text-xs font-semibold uppercase text-center" style={{ color: '#B45309' }}>Outros ({outros.length})</span>
        </div>
        <div className="px-4 py-2">
          <KPIRow label="Total Causa" clt={formatBRLCompact(total(clt, 'valor_causa'))} pj={formatBRLCompact(total(pj, 'valor_causa'))} outros={formatBRLCompact(total(outros, 'valor_causa'))} />
          <KPIRow label="Média por Processo" clt={formatBRLCompact(avg(clt, 'valor_causa'))} pj={formatBRLCompact(avg(pj, 'valor_causa'))} outros={formatBRLCompact(avg(outros, 'valor_causa'))} />
          <KPIRow label="Total Provisionado" clt={formatBRLCompact(total(clt, 'valor_provisao'))} pj={formatBRLCompact(total(pj, 'valor_provisao'))} outros={formatBRLCompact(total(outros, 'valor_provisao'))} />
          <KPIRow label="Risco Alto" clt={pctRisco(clt, 'Alto')} pj={pctRisco(pj, 'Alto')} outros={pctRisco(outros, 'Alto')} />
          <KPIRow label="Risco Médio" clt={pctRisco(clt, 'Médio')} pj={pctRisco(pj, 'Médio')} outros={pctRisco(outros, 'Médio')} />
          <KPIRow label="Risco Baixo" clt={pctRisco(clt, 'Baixo')} pj={pctRisco(pj, 'Baixo')} outros={pctRisco(outros, 'Baixo')} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Top Cargos com Mais Ações Trabalhistas">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topCargos} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
              <XAxis type="number" tick={{ fill: '#6B7B82', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#6B7B82', fontSize: 10 }} width={185} axisLine={false} tickLine={false} />
              <Tooltip {...CHART_TOOLTIP_STYLE} />
              <Bar dataKey="clt" name="CLT" fill="#B47A18" stackId="a" />
              <Bar dataKey="pj" name="PJ" fill="#8B5CF6" stackId="a" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Pedidos por Tipo de Vínculo">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={pedidosComparison} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
              <XAxis type="number" tick={{ fill: '#6B7B82', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#6B7B82', fontSize: 10 }} width={140} axisLine={false} tickLine={false} />
              <Tooltip {...CHART_TOOLTIP_STYLE} />
              <Bar dataKey="CLT" fill="#B47A18" radius={[0, 4, 4, 0]} />
              <Bar dataKey="PJ" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Dispersão: Ano de Ajuizamento × Valor da Causa (R$ mil)">
        <div className="flex gap-4 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: '#B47A18' }} />
            <span className="text-xs" style={{ color: '#6B7B82' }}>CLT</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: '#8B5CF6' }} />
            <span className="text-xs" style={{ color: '#6B7B82' }}>Autônomo PJ</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <ScatterChart margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,54,59,0.08)" />
            <XAxis dataKey="x" type="number" domain={[2021, 2027]} tick={{ fill: '#6B7B82', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => String(Math.round(v))} />
            <YAxis dataKey="y" tick={{ fill: '#6B7B82', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}k`} />
            <Tooltip
              {...CHART_TOOLTIP_STYLE}
              content={({ payload }) => {
                if (!payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="rounded-lg px-3 py-2" style={{ background: '#2C363B', border: 'none' }}>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>Ano: {Math.round(d.x)}</p>
                    <p className="text-xs" style={{ color: '#FFFFFF' }}>Valor: {formatBRL(d.y * 1000)}</p>
                  </div>
                );
              }}
            />
            <Scatter data={scatterCLT} fill="#B47A18" opacity={0.7}>
              {scatterCLT.map((_, i) => <Cell key={i} fill="#B47A18" />)}
            </Scatter>
            <Scatter data={scatterPJ} fill="#8B5CF6" opacity={0.7}>
              {scatterPJ.map((_, i) => <Cell key={i} fill="#8B5CF6" />)}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
