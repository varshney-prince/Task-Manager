import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Target } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/sessions');
      const data = await response.json();
      if (Array.isArray(data)) {
        setSessions(data);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getSessionsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return sessions.filter(s => s.date === dateStr);
  };

  const getTotalFocusTimeForDate = (day: number) => {
    const daySessions = getSessionsForDate(day);
    return daySessions.reduce((total, s) => total + (s.duration || 0), 0);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-primary font-headline tracking-tight">Focus Calendar</h2>
          <p className="text-secondary mt-1">Track your daily focus sessions and rituals.</p>
        </div>
        <div className="flex items-center gap-4 bg-surface-container-low p-2 rounded-xl border border-outline-variant/10">
          <button onClick={prevMonth} className="p-2 hover:bg-surface-container-high rounded-lg transition-colors text-secondary hover:text-primary">
            <ChevronLeft size={20} />
          </button>
          <span className="font-bold text-lg min-w-[140px] text-center">
            {monthNames[month]} {year}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-surface-container-high rounded-lg transition-colors text-secondary hover:text-primary">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="bg-surface-container-low rounded-3xl border border-outline-variant/10 overflow-hidden shadow-sm">
        <div className="grid grid-cols-7 border-b border-outline-variant/10 bg-surface-container-lowest">
          {dayNames.map(day => (
            <div key={day} className="py-4 text-center font-bold text-sm text-secondary uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 auto-rows-fr">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="min-h-[120px] border-r border-b border-outline-variant/5 bg-surface-container-lowest/50"></div>;
            }

            const daySessions = getSessionsForDate(day);
            const totalSeconds = getTotalFocusTimeForDate(day);
            const totalMinutes = Math.floor(totalSeconds / 60);
            const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;

            return (
              <motion.div 
                key={`day-${day}`} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.01 }}
                className={`min-h-[120px] p-2 border-r border-b border-outline-variant/10 transition-colors hover:bg-surface-container-high/50 group relative ${isToday ? 'bg-primary/5' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${isToday ? 'bg-primary text-white shadow-md' : 'text-secondary group-hover:text-primary'}`}>
                    {day}
                  </span>
                  {totalMinutes > 0 && (
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md flex items-center gap-1">
                      <Clock size={10} />
                      {totalMinutes}m
                    </span>
                  )}
                </div>
                
                <div className="space-y-1 mt-2">
                  {daySessions.slice(0, 3).map((session, i) => (
                    <div key={i} className="text-[10px] truncate bg-surface-container-high px-2 py-1 rounded text-secondary border border-outline-variant/10 flex items-center gap-1" title={session.taskTitle}>
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0"></div>
                      <span className="truncate">{session.taskTitle}</span>
                    </div>
                  ))}
                  {daySessions.length > 3 && (
                    <div className="text-[10px] text-center text-secondary font-medium pt-1">
                      +{daySessions.length - 3} more
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
