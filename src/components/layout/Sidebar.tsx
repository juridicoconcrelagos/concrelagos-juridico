import { useState, type ComponentType } from 'react';
import { LayoutDashboard, FileText, Building2, Users, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import ConcrelagosLogo, { SunIcon } from './ConcrelagosLogo';

export type View = 'dashboard' | 'processos' | 'empresa' | 'vinculo' | 'calendario';

interface SidebarProps {
  activeView: View;
  onNavigate: (v: View) => void;
}

const navItems: { view: View; label: string; icon: ComponentType<{ size?: number; className?: string }> }[] = [
  { view: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { view: 'processos', label: 'Processos', icon: FileText },
  { view: 'empresa', label: 'Por Empresa', icon: Building2 },
  { view: 'vinculo', label: 'CLT vs PJ', icon: Users },
  { view: 'calendario', label: 'Calendário', icon: Calendar },
];

export default function Sidebar({ activeView, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="flex flex-col h-screen sticky top-0 transition-all duration-200 z-20"
      style={{
        width: collapsed ? 64 : 220,
        background: '#2C363B',
        borderRight: '1px solid rgba(0,0,0,0.15)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center px-3 py-4" style={{ minHeight: 64, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {collapsed ? (
          <div className="mx-auto">
            <SunIcon size={32} color="#B47A18" />
          </div>
        ) : (
          <ConcrelagosLogo dark={true} subtitle="Jurídico Trabalhista" />
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-1">
        {navItems.map(({ view, label, icon: Icon }) => {
          const active = activeView === view;
          return (
            <button
              key={view}
              onClick={() => onNavigate(view)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-left"
              style={{
                background: active ? 'rgba(180,122,24,0.18)' : 'transparent',
                borderLeft: active ? '3px solid #B47A18' : '3px solid transparent',
                color: active ? '#CC8E20' : 'rgba(255,255,255,0.55)',
              }}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium truncate">{label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center m-3 p-2 rounded-lg transition-colors"
        style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}
