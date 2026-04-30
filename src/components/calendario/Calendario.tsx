import { useState } from 'react';
import { ChevronLeft, ChevronRight, Gavel, Clock } from 'lucide-react';
import type { Processo } from '../../data/types';
import { formatDate } from '../../utils/formatters';

interface Props {
  processos: Processo[];
  onVerProcesso: (p: Processo) => void;
}

function parseDate(d: string | null | undefined): Date | null {
  if (!d) return null;
  if (d.match(/^\d{4}-\d{2}-\d{2}$/)) return new Date(d + 'T00:00:00');
  const m = d.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return new Date(`${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}T00:00:00`);
  return null;
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

export default function Calendario({ processos, onVerProcesso }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(year - 1); } else setMonth(month - 1);
    setSelectedDay(null);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(year + 1); } else setMonth(month + 1);
    setSelectedDay(null);
  }

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  type DayEvent = { processo: Processo; type: 'audiencia' | 'prazo' };
  const eventsByDay = new Map<string, DayEvent[]>();

  function addEvent(dateStr: string | null, type: DayEvent['type'], p: Processo) {
    const d = parseDate(dateStr);
    if (!d) return;
    if (d.getFullYear() !== year || d.getMonth() !== month) return;
    const key = `${d.getDate()}`;
    const list = eventsByDay.get(key) || [];
    list.push({ processo: p, type });
    eventsByDay.set(key, list);
  }

  processos.forEach((p) => {
    addEvent(p.data_proxima_audiencia, 'audiencia', p);
    addEvent(p.prazo_vencimento, 'prazo', p);
  });

  const selectedKey = selectedDay ? `${selectedDay.getDate()}` : null;
  const selectedEvents = selectedKey ? (eventsByDay.get(selectedKey) || []) : [];
  const todayKey = today.getFullYear() === year && today.getMonth() === month ? `${today.getDate()}` : null;
  const in7 = new Date(today);
  in7.setDate(in7.getDate() + 7);

  function isDangerDay(day: number): boolean {
    const d = new Date(year, month, day);
    return d >= today && d <= in7;
  }

  const allEvents = processos.flatMap((p) => {
    const events: { date: Date; type: DayEvent['type']; processo: Processo }[] = [];
    const ad = parseDate(p.data_proxima_audiencia);
    if (ad) events.push({ date: ad, type: 'audiencia', processo: p });
    const pd = parseDate(p.prazo_vencimento);
    if (pd) events.push({ date: pd, type: 'prazo', processo: p });
    return events;
  }).sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 20);

  return (
    <div className="p-6 flex gap-6">
      <div className="flex-1">
        <div className="rounded-xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #DCDCDC', boxShadow: '0 1px 4px rgba(44,54,59,0.06)' }}>
          {/* Header */}
          <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid #E0E0E0' }}>
            <button onClick={prevMonth} className="p-2 rounded-lg transition-colors" style={{ background: '#F5F5F5', color: '#6B7B82', border: '1px solid #E0E0E0' }}>
              <ChevronLeft size={16} />
            </button>
            <h2 className="text-lg font-bold" style={{ color: '#2C363B' }}>{MONTHS[month]} {year}</h2>
            <button onClick={nextMonth} className="p-2 rounded-lg transition-colors" style={{ background: '#F5F5F5', color: '#6B7B82', border: '1px solid #E0E0E0' }}>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 px-4 pb-2 pt-3" style={{ background: '#F5F5F5' }}>
            {WEEKDAYS.map((w) => (
              <div key={w} className="text-center text-xs font-semibold py-1" style={{ color: '#6B7B82' }}>{w}</div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 px-4 pb-4 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const key = `${day}`;
              const events = eventsByDay.get(key) || [];
              const isToday = todayKey === key;
              const isSelected = selectedDay?.getDate() === day;
              const hasPrazo = events.some((e) => e.type === 'prazo');
              const hasAudiencia = events.some((e) => e.type === 'audiencia');
              const isDanger = hasPrazo && isDangerDay(day);

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(events.length > 0 ? new Date(year, month, day) : null)}
                  className="relative rounded-lg p-1 text-center transition-all"
                  style={{
                    minHeight: 44,
                    background: isSelected ? '#8A5C10' : isToday ? 'rgba(180,122,24,0.10)' : events.length > 0 ? 'rgba(44,54,59,0.03)' : 'transparent',
                    border: isToday ? '1px solid rgba(180,122,24,0.35)' : isSelected ? '1px solid #8A5C10' : '1px solid transparent',
                  }}
                >
                  <span className="text-sm font-medium block" style={{ color: isSelected ? '#fff' : isToday ? '#8A5C10' : events.length > 0 ? '#2C363B' : '#AAAAAA' }}>
                    {day}
                  </span>
                  {events.length > 0 && (
                    <div className="flex justify-center gap-0.5 mt-0.5">
                      {hasAudiencia && <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#B47A18' }} />}
                      {hasPrazo && <div className={`w-1.5 h-1.5 rounded-full ${isDanger ? 'pulse-red' : ''}`} style={{ background: isDanger ? '#EF4444' : '#F59E0B' }} />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex gap-4 px-4 py-3 flex-shrink-0" style={{ borderTop: '1px solid #E0E0E0', background: '#F5F5F5' }}>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: '#B47A18' }} />
              <span className="text-xs" style={{ color: '#6B7B82' }}>Audiência</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: '#F59E0B' }} />
              <span className="text-xs" style={{ color: '#6B7B82' }}>Prazo</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full pulse-red" style={{ background: '#EF4444' }} />
              <span className="text-xs" style={{ color: '#6B7B82' }}>Prazo urgente (&lt;7 dias)</span>
            </div>
          </div>
        </div>

        {selectedDay && selectedEvents.length > 0 && (
          <div className="mt-4 rounded-xl p-4" style={{ background: '#FFFFFF', border: '1px solid #DCDCDC' }}>
            <p className="text-sm font-semibold mb-3" style={{ color: '#2C363B' }}>
              {selectedDay.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
            <div className="space-y-2">
              {selectedEvents.map(({ processo: p, type }, i) => (
                <button key={i} onClick={() => onVerProcesso(p)} className="w-full text-left rounded-lg p-3 flex items-center gap-3 transition-colors" style={{ background: '#F5F5F5', border: '1px solid #E0E0E0' }}>
                  {type === 'audiencia' ? <Gavel size={14} style={{ color: '#B47A18' }} /> : <Clock size={14} style={{ color: '#F59E0B' }} />}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: '#2C363B' }}>{p.reclamante}</p>
                    <p className="text-xs" style={{ color: '#6B7B82' }}>{type === 'audiencia' ? p.tipo_audiencia : 'Prazo processual'} · {p.empresa}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar eventos */}
      <div className="w-72 flex-shrink-0">
        <div className="rounded-xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #DCDCDC', boxShadow: '0 1px 4px rgba(44,54,59,0.06)' }}>
          <div className="p-4" style={{ borderBottom: '1px solid #E0E0E0', background: '#F5F5F5' }}>
            <p className="text-sm font-semibold" style={{ color: '#2C363B' }}>Próximos Eventos</p>
          </div>
          <div className="p-3 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
            {allEvents.length === 0 ? (
              <p className="text-xs text-center py-8" style={{ color: '#AAAAAA' }}>Nenhum evento próximo</p>
            ) : (
              allEvents.map(({ date, type, processo }, i) => {
                const isUrgent = type === 'prazo' && date <= in7 && date >= today;
                return (
                  <button key={i} onClick={() => onVerProcesso(processo)} className="w-full text-left rounded-lg p-3 transition-colors" style={{ background: isUrgent ? 'rgba(239,68,68,0.05)' : '#F5F5F5', border: `1px solid ${isUrgent ? 'rgba(239,68,68,0.2)' : '#E0E0E0'}` }}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        {type === 'audiencia' ? <Gavel size={11} style={{ color: '#B47A18' }} /> : <Clock size={11} style={{ color: isUrgent ? '#EF4444' : '#F59E0B' }} />}
                        <span className="text-xs font-medium" style={{ color: type === 'audiencia' ? '#8A5C10' : isUrgent ? '#EF4444' : '#B45309' }}>
                          {type === 'audiencia' ? 'Audiência' : 'Prazo'}
                        </span>
                      </div>
                      <span className="text-xs" style={{ color: '#6B7B82' }}>{date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>
                    </div>
                    <p className="text-xs font-medium truncate" style={{ color: '#2C363B' }}>{processo.reclamante}</p>
                    <p className="text-xs truncate" style={{ color: '#6B7B82' }}>{processo.empresa}</p>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
