import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus, Calendar, Save, Trash2, X } from 'lucide-react';

type AgendaType = 'compromisso' | 'feriado' | 'tarefa' | 'lista' | 'livro' | 'lembrete';

interface PlannerEvent {
  id: string;
  title: string;
  date: string;
  type: AgendaType;
  color: string;
  description: string;
  source?: 'holiday' | 'user';
}

const agendaMeta: Record<AgendaType, { label: string; className: string }> = {
  compromisso: { label: 'Compromisso', className: 'bg-primary' },
  feriado: { label: 'Feriado nacional', className: 'bg-secondary text-secondary-foreground' },
  tarefa: { label: 'Tarefa', className: 'bg-destructive' },
  lista: { label: 'Lista', className: 'bg-vintage-flower' },
  livro: { label: 'Livro lido', className: 'bg-vintage-brown' },
  lembrete: { label: 'Lembrete', className: 'bg-accent' },
};

const defaultEvents: PlannerEvent[] = [
  {
    id: '1',
    title: 'Reunião importante',
    date: '2025-01-15',
    type: 'compromisso',
    color: 'primary',
    description: 'Compromisso importante do dia.',
  },
  {
    id: '2',
    title: 'Aniversário da mamãe',
    date: '2025-01-20',
    type: 'lembrete',
    color: 'accent',
    description: 'Lembrar de preparar uma surpresa com carinho.',
  },
];

const PlannerMensal = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<PlannerEvent[]>(defaultEvents);
  const [holidays, setHolidays] = useState<PlannerEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const loadedHolidayYears = useRef(new Set<number>());
  const [newItem, setNewItem] = useState({
    title: '',
    type: 'tarefa' as AgendaType,
    description: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('planme_agenda_items');
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        setEvents(parsed);
      }
    } catch {
      setEvents(defaultEvents);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('planme_agenda_items', JSON.stringify(events));
  }, [events]);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDay = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + (direction === 'prev' ? -1 : 1));
      return newDate;
    });
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return [
      ...events.filter(event => event.date === dateStr),
      ...holidays.filter(holiday => holiday.date === dateStr),
    ];
  };

  const getSelectedItems = () => {
    return selectedDate
      ? [
          ...events.filter(event => event.date === selectedDate),
          ...holidays.filter(holiday => holiday.date === selectedDate),
        ]
      : [];
  };

  const loadHolidaysForYear = async (year: number) => {
    if (loadedHolidayYears.current.has(year)) return;
    loadedHolidayYears.current.add(year);

    try {
      const response = await fetch(`https://brasilapi.com.br/api/feriados/v1/${year}`);
      if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
      }

      const data: Array<{ date: string; name: string }> = await response.json();
      setHolidays(prev => [
        ...prev.filter(holiday => !holiday.id.startsWith(`holiday-${year}-`)),
        ...data.map(holiday => ({
          id: `holiday-${year}-${holiday.date}`,
          title: holiday.name,
          date: holiday.date,
          type: 'feriado' as AgendaType,
          color: 'holiday',
          description: 'Feriado nacional',
          source: 'holiday' as const,
        })),
      ]);
    } catch (error) {
      console.warn(`Não foi possível carregar feriados de ${year}.`, error);
    }
  };

  const handleSaveAgendaItem = () => {
    if (!selectedDate || !newItem.title.trim()) return;

    const meta = agendaMeta[newItem.type];
    setEvents(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        title: newItem.title.trim(),
        type: newItem.type,
        date: selectedDate,
        color: meta.className.replace('bg-', ''),
        description: newItem.description.trim(),
      },
    ]);
    setNewItem({ title: '', type: 'tarefa', description: '' });
  };

  const handleDeleteAgendaItem = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const isCurrentMonth = (date: Date) => date.getMonth() === currentDate.getMonth();
  const isToday = (date: Date) => date.toDateString() === new Date().toDateString();
  const days = getDaysInMonth(currentDate);

  useEffect(() => {
    [...new Set(days.map(day => day.getFullYear()))].forEach(year => {
      loadHolidaysForYear(year);
    });
  }, [currentDate]);

  return (
    <>
      <Card className="vintage-paper w-full max-w-4xl mx-auto">
        <CardHeader className="text-center border-b border-vintage-brown/20">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              onClick={() => navigateMonth('prev')}
              className="hover:bg-secondary font-vintage"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <CardTitle className="font-vintage text-2xl text-vintage-brown flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-primary" />
              <span>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
            </CardTitle>

            <Button
              variant="ghost"
              onClick={() => navigateMonth('next')}
              className="hover:bg-secondary font-vintage"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDays.map(day => (
              <div
                key={day}
                className="p-3 text-center font-vintage text-vintage-brown bg-vintage-pink/30 rounded-lg"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              const dateStr = formatDate(day);
              const dayEvents = getEventsForDate(day);
              const isCurrentMonthDay = isCurrentMonth(day);
              const isTodayDay = isToday(day);

              return (
                <div
                  key={index}
                  onClick={() => isCurrentMonthDay && setSelectedDate(dateStr)}
                  className={`
                    h-24 min-h-24 max-h-24 min-w-0 overflow-hidden flex flex-col p-2 rounded-lg border-2 transition-all duration-300 hover:shadow-md cursor-pointer
                    ${isCurrentMonthDay
                      ? 'bg-card border-vintage-brown/20 hover:border-primary/50'
                      : 'bg-muted/50 border-vintage-brown/10 text-muted-foreground'
                    }
                    ${isTodayDay ? 'ring-2 ring-primary bg-primary/10' : ''}
                  `}
                >
                  <div className={`text-sm font-soft mb-1 ${isTodayDay ? 'font-bold text-primary' : ''}`}>
                    {day.getDate()}
                  </div>

                  <div className="min-w-0 flex-1 overflow-hidden space-y-1">
                    {dayEvents.slice(0, 2).map(event => {
                      const meta = agendaMeta[event.type] || agendaMeta.compromisso;
                      return (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded text-white truncate font-soft ${meta.className}`}
                          title={event.description || event.title}
                        >
                          {meta.label}: {event.title}
                        </div>
                      );
                    })}
                    {dayEvents.length > 2 && (
                      <div className="truncate text-xs text-vintage-brown/70 font-soft">
                        +{dayEvents.length - 2} mais
                      </div>
                    )}
                  </div>

                  {isCurrentMonthDay && (
                    <button className="w-full mt-1 shrink-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <Plus className="h-3 w-3 mx-auto text-vintage-brown/50 hover:text-primary" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            {(Object.keys(agendaMeta) as AgendaType[]).map(type => (
              <div key={type} className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded ${agendaMeta[type].className}`}></div>
                <span className="text-sm font-soft text-vintage-brown">{agendaMeta[type].label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-vintage-brown/40 p-4">
          <Card className="vintage-paper w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="font-vintage text-vintage-brown">
                    Adicionar na agenda
                  </CardTitle>
                  <p className="font-soft text-sm text-vintage-brown/70 mt-1">
                    Dia {formatDisplayDate(selectedDate)}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedDate(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
                <input
                  value={newItem.title}
                  onChange={(event) => setNewItem(prev => ({ ...prev, title: event.target.value }))}
                  placeholder="Título..."
                  className="px-4 py-2 rounded-lg border border-vintage-brown/20 bg-card font-soft focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <select
                  value={newItem.type}
                  onChange={(event) => setNewItem(prev => ({ ...prev, type: event.target.value as AgendaType }))}
                  className="px-4 py-2 rounded-lg border border-vintage-brown/20 bg-card font-soft focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {(Object.keys(agendaMeta) as AgendaType[])
                    .filter(type => type !== 'feriado')
                    .map(type => (
                    <option key={type} value={type}>{agendaMeta[type].label}</option>
                  ))}
                </select>
              </div>
              <textarea
                value={newItem.description}
                onChange={(event) => setNewItem(prev => ({ ...prev, description: event.target.value }))}
                placeholder="Descrição, detalhes ou observações..."
                className="min-h-28 w-full px-4 py-2 rounded-lg border border-vintage-brown/20 bg-card font-soft focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedDate(null)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveAgendaItem}
                  disabled={!newItem.title.trim()}
                  className="bg-primary hover:bg-primary-hover text-primary-foreground"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar na Agenda
                </Button>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="font-vintage text-vintage-brown">Itens do dia</h3>
                {getSelectedItems().length === 0 ? (
                  <p className="font-soft text-sm text-vintage-brown/70 text-center">
                    Nenhum item neste dia ainda.
                  </p>
                ) : (
                  getSelectedItems().map(item => {
                    const meta = agendaMeta[item.type] || agendaMeta.compromisso;
                    return (
                      <div key={item.id} className="flex items-start justify-between gap-3 rounded-lg bg-card/70 p-3 border-l-4 border-primary">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-vintage-brown">
                            <span className={`rounded px-2 py-0.5 text-xs text-white font-soft ${meta.className}`}>
                              {meta.label}
                            </span>
                            <strong className="break-words">{item.title}</strong>
                          </div>
                          {item.description && (
                            <p className="font-soft text-sm text-vintage-brown/70 mt-1 break-words">
                              {item.description}
                            </p>
                          )}
                        </div>
                        {item.source !== 'holiday' && (
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteAgendaItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default PlannerMensal;
