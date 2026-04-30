import { useState } from 'react';
import Sidebar, { type View } from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import PainelProcessos from './components/processos/PainelProcessos';
import AnaliseEmpresa from './components/analise/AnaliseEmpresa';
import AnaliseVinculo from './components/analise/AnaliseVinculo';
import Calendario from './components/calendario/Calendario';
import ProcessoModal from './components/processos/ProcessoModal';
import LoginScreen from './components/auth/LoginScreen';
import { processos } from './data/mockData';
import { carregarSessao, encerrarSessao, type Usuario } from './data/auth';
import type { Processo } from './data/types';
import { useStats } from './hooks/useStats';

const VIEW_TITLES: Record<View, string> = {
  dashboard: 'Dashboard Executivo',
  processos: 'Painel de Processos',
  empresa: 'Análise por Empresa',
  vinculo: 'CLT vs Autônomos / PJ',
  calendario: 'Calendário de Prazos e Audiências',
};

export default function App() {
  const [sessao, setSessao] = useState<Pick<Usuario, 'email' | 'nome' | 'perfil'> | null>(
    () => carregarSessao()
  );
  const [view, setView] = useState<View>('dashboard');
  const [modalProcesso, setModalProcesso] = useState<Processo | null>(null);
  const stats = useStats(processos);

  function handleLogin(usuario: Pick<Usuario, 'email' | 'nome' | 'perfil'>) {
    setSessao(usuario);
  }

  function handleLogout() {
    encerrarSessao();
    setSessao(null);
    setView('dashboard');
    setModalProcesso(null);
  }

  if (!sessao) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#FFFFFF' }}>
      <Sidebar activeView={view} onNavigate={(v) => { setView(v); setModalProcesso(null); }} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          prazosCount={stats.prazosVencendo.length}
          title={VIEW_TITLES[view]}
          nomeUsuario={sessao.nome}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-auto" style={{ background: '#FFFFFF' }}>
          {view === 'dashboard' && (
            <Dashboard processos={processos} onViewProcesso={(p) => setModalProcesso(p)} />
          )}
          {view === 'processos' && (
            <PainelProcessos processos={processos} />
          )}
          {view === 'empresa' && (
            <AnaliseEmpresa processos={processos} />
          )}
          {view === 'vinculo' && (
            <AnaliseVinculo processos={processos} />
          )}
          {view === 'calendario' && (
            <Calendario processos={processos} onVerProcesso={(p) => setModalProcesso(p)} />
          )}
        </main>
      </div>

      <ProcessoModal processo={modalProcesso} onClose={() => setModalProcesso(null)} />
    </div>
  );
}
