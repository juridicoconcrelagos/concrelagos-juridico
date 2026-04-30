import type { ReactNode } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, Cell, CartesianGrid,
} from 'recharts';
import type { Processo } from '../../data/types';
import { formatBRLCompact, formatBRL } from '../../utils/formatters';

interface Props { processos: Processo[] }

const CHART_TOOLTIP_STYLE = {
  contentStyle: { background: '#2C363B', border: 'none', borderRadius: 8, color: '#FFFFFF' },
  labelStyle: { color: 'rgba(255,255,255,0.65)' },
};

const RISCO_COLORS: Record<string, string> = {
  Alto: '#EF4444', Médio: '#F59E0B', Baixo: '#22C55E', Provisionado: '#8B5CF6',
};

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl p-5" style={{ background: '#F5F5F5', border: '1px solid #DCDCDC' }}>
      <p className="text-sm font-medium mb-4" style={{ color: '#2C363B' }}>{title}</p>
      {children}
    </div>
  );
}

export default function AnaliseEmpresa({ processos }: Props) {
  const empresaMap = processos.reduce((acc, p) => {
    const e = p.empresa || 'Sem empresa';
    if (!acc[e]) acc[e] = { count: 0, totalCausa: 0, totalProvisao: 0, altos: 0, medios: 0, baixos: 0, clt: 0, pj: 0, outros: 0 };
    acc[e].count++;
    acc[e].totalCausa += p.valor_causa;
    acc[e].totalProvisao += p.valor_provisao;
    if (p.risco === 'Alto') acc[e].altos++;
    else if (p.risco === 'Médio') acc[e].medios++;
    else acc[e].baixos++;
    if (p.vinculo === 'CLT') acc[e].clt++;
    else if (p.vinculo === 'Autônomo PJ') acc[e].pj++;
    else acc[e].outros++;
    return acc;
  }, {} as Record<string, { count: number; totalCausa: number; totalProvisao: number; altos: number; medios: number; baixos: number; clt: number; pj: number; outros: number }>);

  const empresaData = Object.entries(empresaMap)
    .map(([empresa, d]) => ({
      empresa,
      shortName: empresa.replace('Concrelagos Concreto S/A', 'Concrelagos').replace('MAQLOC Locação S/A', 'MAQLOC').replace('Pedreira ', ''),
      ...d,
      riscoMedioScore: d.count > 0 ? (d.altos * 3 + d.medios * 2 + d.baixos) / d.count : 0,
      pctCLT: d.count > 0 ? Math.round((d.clt / d.count) * 100) : 0,
    }))
    .sort((a, b) => b.totalProvisao - a.totalProvisao);

  const scatterData = empresaData.map((e) => ({
    x: e.count,
    y: e.totalProvisao / 1000,
    z: Math.max(e.riscoMedioScore * 20, 20),
    empresa: e.shortName,
    risco: e.riscoMedioScore > 2.5 ? 'Alto' : e.riscoMedioScore > 1.5 ? 'Médio' : 'Baixo',
  }));

  const barData = empresaData.map((e) => ({
    name: e.shortName,
    Causa: Math.round(e.totalCausa / 1000),
    Provisão: Math.round(e.totalProvisao / 1000),
  }));

  const vinculoData = empresaData.map((e) => ({
    name: e.shortName,
    CLT: e.clt,
    PJ: e.pj,
    Outros: e.outros,
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {empresaData.slice(0, 4).map((e) => (
          <div key={e.empresa} className="rounded-xl p-4" style={{ background: '#F5F5F5', border: '1px solid #DCDCDC' }}>
            <p className="text-xs font-bold truncate mb-1" style={{ color: '#2C363B' }}>{e.shortName}</p>
            <p className="text-2xl font-bold" style={{ color: '#B47A18' }}>{e.count}</p>
            <p className="text-xs" style={{ color: '#6B7B82' }}>processos</p>
            <div className="mt-3 space-y-1">
              <div className="flex justify-between">
                <span className="text-xs" style={{ color: '#6B7B82' }}>Causa total</span>
                <span className="text-xs font-medium" style={{ color: '#B45309' }}>{formatBRLCompact(e.totalCausa)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs" style={{ color: '#6B7B82' }}>Provisionado</span>
                <span className="text-xs font-medium" style={{ color: '#6D28D9' }}>{formatBRLCompact(e.totalProvisao)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs" style={{ color: '#6B7B82' }}>Risco Alto</span>
                <span className="text-xs font-medium text-red-600">{e.altos}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs" style={{ color: '#6B7B82' }}>% CLT</span>
                <span className="text-xs font-medium" style={{ color: '#8A5C10' }}>{e.pctCLT}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Exposição Financeira por Empresa (R$ mil)">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} margin={{ left: 0, right: 8, top: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,54,59,0.08)" />
              <XAxis dataKey="name" tick={{ fill: '#6B7B82', fontSize: 9 }} angle={-35} textAnchor="end" axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B7B82', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}k`} />
              <Tooltip {...CHART_TOOLTIP_STYLE} formatter={(v: number) => [formatBRL(v * 1000)]} />
              <Bar dataKey="Causa" fill="#B47A18" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Provisão" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Distribuição CLT vs PJ por Empresa">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={vinculoData} margin={{ left: 0, right: 8, top: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,54,59,0.08)" />
              <XAxis dataKey="name" tick={{ fill: '#6B7B82', fontSize: 9 }} angle={-35} textAnchor="end" axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B7B82', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip {...CHART_TOOLTIP_STYLE} />
              <Bar dataKey="CLT" stackId="a" fill="#B47A18" />
              <Bar dataKey="PJ" stackId="a" fill="#8B5CF6" />
              <Bar dataKey="Outros" stackId="a" fill="#AAAAAA" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Ranking de Exposição Financeira por Empresa">
        <div className="space-y-3">
          {empresaData.map((e, i) => {
            const maxProvisao = empresaData[0]?.totalProvisao || 1;
            const pct = (e.totalProvisao / maxProvisao) * 100;
            return (
              <div key={e.empresa} className="flex items-center gap-3">
                <span className="text-xs font-bold w-5 text-right" style={{ color: '#AAAAAA' }}>{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium" style={{ color: '#2C363B' }}>{e.shortName}</span>
                    <span className="text-xs" style={{ color: '#6D28D9' }}>{formatBRL(e.totalProvisao)}</span>
                  </div>
                  <div className="rounded-full overflow-hidden" style={{ height: 6, background: '#E0E0E0' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#B47A18,#8B5CF6)' }} />
                  </div>
                </div>
                <span className="text-xs w-12 text-right" style={{ color: '#6B7B82' }}>{e.count} proc.</span>
              </div>
            );
          })}
        </div>
      </ChartCard>

      <ChartCard title="Mapa de Risco: Nº de Processos × Provisão Total (por empresa)">
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ left: 16, right: 16, top: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,54,59,0.08)" />
            <XAxis dataKey="x" name="Processos" tick={{ fill: '#6B7B82', fontSize: 11 }} axisLine={false} tickLine={false} label={{ value: 'Nº Processos', position: 'bottom', fill: '#6B7B82', fontSize: 11 }} />
            <YAxis dataKey="y" name="Provisão (R$ mil)" tick={{ fill: '#6B7B82', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}k`} />
            <Tooltip
              {...CHART_TOOLTIP_STYLE}
              content={({ payload }) => {
                if (!payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="rounded-lg px-3 py-2" style={{ background: '#2C363B', border: 'none' }}>
                    <p className="text-xs font-bold" style={{ color: '#FFFFFF' }}>{d.empresa}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>Processos: {d.x}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>Provisão: {formatBRL(d.y * 1000)}</p>
                  </div>
                );
              }}
            />
            <Scatter data={scatterData} fill="#B47A18">
              {scatterData.map((entry, i) => (<Cell key={i} fill={RISCO_COLORS[entry.risco] || '#B47A18'} />))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
