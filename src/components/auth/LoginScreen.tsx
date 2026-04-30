import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import ConcrelagosLogo from '../layout/ConcrelagosLogo';
import { autenticar, salvarSessao, type Usuario } from '../../data/auth';

interface Props {
  onLogin: (usuario: Pick<Usuario, 'email' | 'nome' | 'perfil'>) => void;
}

export default function LoginScreen({ onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro('');
    if (!email.trim() || !senha) { setErro('Preencha e-mail e senha.'); return; }
    setLoading(true);
    setTimeout(() => {
      const user = autenticar(email, senha);
      if (user) {
        salvarSessao(user);
        onLogin({ email: user.email, nome: user.nome, perfil: user.perfil });
      } else {
        setErro('E-mail ou senha incorretos.');
        setLoading(false);
      }
    }, 400);
  }

  const inputBase: React.CSSProperties = {
    background: '#EBEBEB',
    border: '1px solid #DCDCDC',
    color: '#2C363B',
  };

  const inputError: React.CSSProperties = {
    background: '#EBEBEB',
    border: '1px solid rgba(239,68,68,0.5)',
    color: '#2C363B',
  };

  return (
    <div
      className="h-screen flex items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(180,122,24,0.07) 0%, #FFFFFF 55%)' }}
    >
      <div className="w-full max-w-sm px-4">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <ConcrelagosLogo dark={false} subtitle="Sistema Jurídico Trabalhista" />
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{ background: '#FFFFFF', border: '1px solid #DCDCDC', boxShadow: '0 4px 32px rgba(44,54,59,0.08)' }}
        >
          <p className="text-sm font-semibold mb-6" style={{ color: '#2C363B' }}>Acesso restrito</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* E-mail */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#6B7B82' }}>E-mail</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B7B82' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErro(''); }}
                  autoComplete="email"
                  autoFocus
                  placeholder="seu@concrelagos.com.br"
                  className="w-full rounded-lg pl-9 pr-4 py-2.5 text-sm outline-none transition-all"
                  style={erro ? inputError : inputBase}
                  onFocus={(e) => { e.target.style.borderColor = '#B47A18'; e.target.style.boxShadow = '0 0 0 3px rgba(180,122,24,0.12)'; }}
                  onBlur={(e) => { e.target.style.borderColor = erro ? 'rgba(239,68,68,0.5)' : '#DCDCDC'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#6B7B82' }}>Senha</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B7B82' }} />
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => { setSenha(e.target.value); setErro(''); }}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-lg pl-9 pr-10 py-2.5 text-sm outline-none transition-all"
                  style={erro ? inputError : inputBase}
                  onFocus={(e) => { e.target.style.borderColor = '#B47A18'; e.target.style.boxShadow = '0 0 0 3px rgba(180,122,24,0.12)'; }}
                  onBlur={(e) => { e.target.style.borderColor = erro ? 'rgba(239,68,68,0.5)' : '#DCDCDC'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#6B7B82' }}
                >
                  {mostrarSenha ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {erro && (
              <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-500">{erro}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg py-2.5 text-sm font-bold text-white transition-all mt-2"
              style={{
                background: loading ? 'rgba(180,122,24,0.5)' : 'linear-gradient(135deg, #B47A18, #8A5C10)',
                cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: '0.05em',
              }}
            >
              {loading ? 'Verificando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#AAAAAA' }}>
          Acesso exclusivo para colaboradores autorizados do Grupo Concrelagos
        </p>
      </div>
    </div>
  );
}
