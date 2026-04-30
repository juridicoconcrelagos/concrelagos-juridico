export function formatBRL(value: number): string {
  if (!value || value === 0) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatBRLCompact(value: number): string {
  if (!value || value === 0) return 'R$ 0';
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `R$ ${(value / 1_000).toFixed(0)}K`;
  return formatBRL(value);
}

export function maskCPF(cpf: string): string {
  if (!cpf) return '***.***.***-**';
  const nums = cpf.replace(/\D/g, '');
  if (nums.length === 11) {
    return `***.${nums.slice(3, 6)}.${nums.slice(6, 9)}-**`;
  }
  return '***.***.***-**';
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  if (dateStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
    const [d, m, y] = dateStr.split('/');
    return `${d}/${m}/${y}`;
  }
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  }
  if (dateStr.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
    return dateStr;
  }
  return dateStr;
}

export function parseDateToISO(dateStr: string): string | null {
  if (!dateStr) return null;
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
  if (dateStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
    const [d, m, y] = dateStr.split('/');
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  const parts = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (parts) {
    return `${parts[3]}-${parts[2].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
  }
  return null;
}

export function daysUntil(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null;
  const iso = parseDateToISO(dateStr);
  if (!iso) return null;
  const target = new Date(iso + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

export function calcTempoEmCasa(periodo: string): string {
  if (!periodo) return '—';
  const match = periodo.match(/(\d{2})\/(\d{2})\/(\d{4})/g);
  if (!match || match.length < 2) return '—';
  const [d1, m1, y1] = match[0].split('/').map(Number);
  const [d2, m2, y2] = match[1].split('/').map(Number);
  const start = new Date(y1, m1 - 1, d1);
  const end = new Date(y2, m2 - 1, d2);
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (years === 0) return `${rem} meses`;
  if (rem === 0) return `${years} anos`;
  return `${years} anos e ${rem} meses`;
}
