import { useEffect, useState } from 'react';
import { Clock, AlertTriangle, LogOut, User, RefreshCw, Table2 } from 'lucide-react';

interface HeaderProps {
  prazosCount: number;
  title: string;
  nomeUsuario?: string;
  onLogout?: () => void;
  fonte?: 'planilha' | 'demo';
  erro?: string | null;
  onAtualizar?: () => void;
}

export default function Header({ prazosCount, title, nomeUsuario, onLogout, fonte, erro, onAtualizar }: HeaderProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateStr = now.toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <header
      className="flex items-center justify-between px-6 py-3 flex-shrink-0"
      style={{
        background: '#2C363B',
        borderBottom: '1px solid rgba(0,0,0,0.2)',
        minHeight: 64,
      }}
    >
      <h1 className="font-semibold text-lg" style={{ color: '#FFFFFF' }}>{title}</h1>

      <div className="flex items-center gap-4">
        {/* Indicador de fonte dos dados */}
        {fonte && (
          <div className="flex items-center gap-1.5">
            <Table2 size={13} style={{ color: fonte === 'planilha' ? '#22C55E' : '#F59E0B' }} />
            <span className="text-xs" style={{ color: fonte === 'planilha' ? '#22C55E' : '#F59E0B' }}>
              {fonte === 'planilha' ? 'Planilha' : 'Demo'}
            </span>
            {erro && <span className="text-xs text-red-400" title={erro}>⚠</span>}
            {onAtualizar && (
              <button onClick={onAtualizar} title="Atualizar dados" className="ml-1 opacity-50 hover:opacity-100 transition-opacity">
                <RefreshCw size={12} style={{ color: '#FFFFFF' }} />
              </button>
            )}
          </div>
        )}

        {prazosCount > 0 && (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg pulse-red"
            style={{ background: 'rgba(239,68,68,0.18)', border: '1px solid rgba(239,68,68,0.35)' }}
          >
            <AlertTriangle size={14} className="text-red-400" />
            <span className="text-red-400 text-xs font-medium">
              {prazosCount} prazo{prazosCount > 1 ? 's' : ''} vencendo
            </span>
          </div>
        )}

        <div className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
          <Clock size={14} />
          <div className="text-right">
            <p className="text-xs capitalize" style={{ color: 'rgba(255,255,255,0.55)' }}>{dateStr}</p>
            <p className="text-sm font-mono font-medium" style={{ color: '#CC8E20' }}>{timeStr}</p>
          </div>
        </div>

        {nomeUsuario && (
          <div className="flex items-center gap-2 pl-4" style={{ borderLeft: '1px solid rgba(255,255,255,0.12)' }}>
            <div className="flex items-center gap-1.5">
              <User size={13} style={{ color: 'rgba(255,255,255,0.45)' }} />
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>{nomeUsuario}</span>
            </div>
            <button
              onClick={onLogout}
              title="Sair"
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors"
              style={{ color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#EF4444'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(239,68,68,0.4)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
            >
              <LogOut size={13} />
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
