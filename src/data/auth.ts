export interface Usuario {
  email: string;
  nome: string;
  senha: string;
  perfil: 'admin' | 'juridico' | 'visualizador';
}

export const USUARIOS: Usuario[] = [
  { email: 'admin@concrelagos.com.br', nome: 'Administrador', senha: 'Concrelagos@2026', perfil: 'admin' },
  { email: 'juridico@concrelagos.com.br', nome: 'Equipe Jurídica', senha: 'Juridico@2026', perfil: 'juridico' },
  { email: 'diretoria@concrelagos.com.br', nome: 'Diretoria', senha: 'Diretoria@2026', perfil: 'visualizador' },
];

export function autenticar(email: string, senha: string): Usuario | null {
  return USUARIOS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.senha === senha
  ) ?? null;
}

const SESSION_KEY = 'concrelagos_auth';

export function salvarSessao(usuario: Usuario): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email: usuario.email, nome: usuario.nome, perfil: usuario.perfil }));
}

export function carregarSessao(): Pick<Usuario, 'email' | 'nome' | 'perfil'> | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function encerrarSessao(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
