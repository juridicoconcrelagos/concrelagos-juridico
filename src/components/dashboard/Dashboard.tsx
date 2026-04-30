import type { ReactNode } from 'react';
import { FileText, DollarSign, Shield, TrendingUp, Calendar, AlertTriangle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from 'recharts';
import type { Processo } from '../../data/types';
import { useStats } from '../../hooks/useStats';
import { formatBRLCompact, formatBRL, formatDate } from '../../utils/formatters';
import KPICard from './KPICard';

interface DashboardProps {
  processos: Processo[];
  onViewProcesso?: (p: Processo) => void;
}

const RISCO_COLORS: Record<string, string> = {
  Alto: '#EF4444',
  Médio: '#F59E0B',
  Baixo: '#22C55E',
  Provisionado: '#8B5CF6',
};

const FASE_COLORS = ['#B47A18', '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#22C55E', '#6B7B82'];

const CHART_TOOLTIP_STYLE = {
  contentStyle: { background: '#2C363B', border: 'none', borderRadius: 8, color: '#FFFFFF' },
  labelStyle: { color: 'rgba(255,255,255,0.65)' },
  cursor: { fill: 'rgba(180,122,24,0.06)' },
};

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl p-5" style={{ background: '#F5F5F5', border: '1px solid #DCDCDC' }}>
      <p className="text-sm font-medium mb-4" style={{ color: '#2C363B' }}>{title}</p>
      {children}
    </div>
  );
}

export default function Dashboard({ processos, onViewProcesso }: DashboardProps) {
  const stats = useStats(processos);

  const faseData = Object.entries(stats.porFase)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name: name.replace('Recurso Ordinário', 'Rec. Ordinário'), value }));

  const riscoData = Object.entries(stats.porRisco).map(([name, value]) => ({ name, value }));
  const vinculoData = Object.entries(stats.porVinculo).map(([name, value]) => ({ name, value }));

  const empresaData = stats.porEmpresa
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
    .map((e) => ({ name: e.empresa.replace('Concrelagos Concreto S/A', 'Concrelagos').replace('MAQLOC Locação S/A', 'MAQLOC').replace('Pedreira ', ''), value: e.count, provisao: e.totalProvisao }));

  const ativosCount = stats.porStatus['Ativo'] || 0;

  return (
    <div className="p-6 space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPICard
          title="Total de Processos"
          value={String(stats.total)}
          subtitle={`${ativosCount} ativos`}
          icon={<FileText size={18} />}
          accentColor="#B47A18"
        />
        <KPICard
          title="Valor Total das Causas"
          value={formatBRLCompact(stats.totalCausa)}
          subtitle={formatBRL(stats.totalCausa)}
          icon={<DollarSign size={18} />}
          accentColor="#F59E0B"
        />
        <KPICard
          title="Total Provisionado"
          value={formatBRLCompact(stats.totalProvisao)}
          subtitle={`${stats.totalCausa > 0 ? ((stats.totalProvisao / stats.totalCausa) * 100).toFixed(0) : 0}% do valor das causas`}
          icon={<Shield size={18} />}
          accentColor="#8B5CF6"
        />
        <KPICard
          title="Total Pago"
          value={formatBRLCompact(stats.totalPago + stats.totalCondenacao)}
          subtitle="Condenações + Acordos"
          icon={<TrendingUp size={18} />}
          accentColor="#22C55E"
        />
      </div>

      {/* Alertas */}
      {(stats.prazosVencendo.length > 0 || stats.audienciasProximas.length > 0) && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {stats.prazosVencendo.length > 0 && (
            <div className="rounded-xl p-4 pulse-red" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={16} className="text-red-500" />
                <p className="text-sm font-semibold text-red-500">
                  {stats.prazosVencendo.length} Prazo{stats.prazosVencendo.length > 1 ? 's' : ''} vencendo em 7 dias
                </p>
              </div>
              <div className="space-y-2">
                {stats.prazosVencendo.slice(0, 4).map((p) => (
                  <button key={p.id} onClick={() => onViewProcesso?.(p)} className="w-full text-left rounded-lg px-3 py-2 transition-colors" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.12)' }}>
                    <p className="text-xs font-medium truncate" style={{ color: '#2C363B' }}>{p.reclamante}</p>
                    <p className="text-xs" style={{ color: '#6B7B82' }}>{p.empresa} · Vence: {formatDate(p.prazo_vencimento)}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
          {stats.audienciasProximas.length > 0 && (
            <div className="rounded-xl p-4" style={{ background: 'rgba(180,122,24,0.05)', border: '1px solid rgba(180,122,24,0.18)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={16} style={{ color: '#B47A18' }} />
                <p className="text-sm font-semibold" style={{ color: '#8A5C10' }}>
                  {stats.audienciasProximas.length} Audiência{stats.audienciasProximas.length > 1 ? 's' : ''} nos próximos 30 dias
                </p>
              </div>
              <div className="space-y-2">
                {stats.audienciasProximas.slice(0, 4).map((p) => (
                  <button key={p.id} onClick={() => onViewProcesso?.(p)} className="w-full text-left rounded-lg px-3 py-2 transition-colors" style={{ background: 'rgba(180,122,24,0.05)', border: '1px solid rgba(180,122,24,0.12)' }}>
                    <p className="text-xs font-medium truncate" style={{ color: '#2C363B' }}>{p.reclamante}</p>
                    <p className="text-xs" style={{ color: '#6B7B82' }}>{p.tipo_audiencia} · {formatDate(p.data_proxima_audiencia)}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Processos por Empresa">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={empresaData} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
              <XAxis type="number" tick={{ fill: '#6B7B82', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#6B7B82', fontSize: 10 }} width={90} axisLine={false} tickLine={false} />
              <Tooltip {...CHART_TOOLTIP_STYLE} formatter={(v) => [v, 'Processos']} />
              <Bar dataKey="value" fill="#B47A18" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Distribuição por Fase">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={faseData} margin={{ left: 0, right: 8, top: 0, bottom: 40 }}>
              <XAxis dataKey="name" tick={{ fill: '#6B7B82', fontSize: 9 }} angle={-35} textAnchor="end" axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B7B82', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...CHART_TOOLTIP_STYLE} formatter={(v) => [v, 'Processos']} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {faseData.map((_, i) => (
                  <Cell key={i} fill={FASE_COLORS[i % FASE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="grid grid-rows-2 gap-4">
          <ChartCard title="Distribuição por Risco">
            <ResponsiveContainer width="100%" height={90}>
              <PieChart>
                <Pie data={riscoData} cx="50%" cy="50%" outerRadius={40} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false} fontSize={10}>
                  {riscoData.map((entry, i) => (<Cell key={i} fill={RISCO_COLORS[entry.name] || '#6B7B82'} />))}
                </Pie>
                <Tooltip {...CHART_TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="CLT vs Outros vínculos">
            <ResponsiveContainer width="100%" height={90}>
              <PieChart>
                <Pie data={vinculoData} cx="50%" cy="50%" outerRadius={40} dataKey="value" label={({ name, value }) => `${name.replace('Autônomo PJ','PJ')}: ${value}`} labelLine={false} fontSize={10}>
                  {vinculoData.map((_, i) => (<Cell key={i} fill={['#B47A18', '#F59E0B', '#8B5CF6', '#22C55E', '#EC4899'][i % 5]} />))}
                </Pie>
                <Tooltip {...CHART_TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Evolução Mensal de Novos Processos (12 meses)">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={stats.evolucaoMensal} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,54,59,0.08)" />
              <XAxis dataKey="mes" tick={{ fill: '#6B7B82', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B7B82', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...CHART_TOOLTIP_STYLE} formatter={(v) => [v, 'Novos processos']} />
              <Line type="monotone" dataKey="novos" stroke="#B47A18" strokeWidth={2} dot={{ fill: '#B47A18', r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top 5 Pedidos Mais Recorrentes">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={stats.top5Pedidos} layout="vertical" margin={{ left: 0, right: 32, top: 0, bottom: 0 }}>
              <XAxis type="number" tick={{ fill: '#6B7B82', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#6B7B82', fontSize: 11 }} width={130} axisLine={false} tickLine={false} />
              <Tooltip {...CHART_TOOLTIP_STYLE} formatter={(v) => [v, 'Processos']} />
              <Bar dataKey="value" fill="#F59E0B" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
