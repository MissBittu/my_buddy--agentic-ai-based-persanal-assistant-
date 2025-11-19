import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarView = ({ darkMode, cardClass, events }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const monthNames = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const getDaysInMonth = date => {
    const y = date.getFullYear();
    const m = date.getMonth();
    return {
      days: new Date(y, m + 1, 0).getDate(),
      start: new Date(y, m, 1).getDay()
    };
  };

  const { days, start } = getDaysInMonth(currentDate);

  const prevMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const nextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const eventsForDay = day => {
    const d = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === d);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Calendar 📅</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={prevMonth} 
            className={`p-2 rounded-lg transition ${darkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button 
            onClick={nextMonth} 
            className={`p-2 rounded-lg transition ${darkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className={`${cardClass} border rounded-xl p-6`}>
        <div className="grid grid-cols-7 text-center font-semibold mb-4">
          {dayNames.map(d => <div key={d} className="py-2">{d}</div>)}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {[...Array(start)].map((_, i) => <div key={`empty-${i}`} className="aspect-square" />)}
          
          {[...Array(days)].map((_, i) => {
            const day = i + 1;
            const ev = eventsForDay(day);
            const isToday =
              day === new Date().getDate() &&
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear();

            return (
              <div 
                key={day}
                onClick={() => setSelectedDate(day)}
                className={`p-2 aspect-square rounded-lg cursor-pointer border transition ${
                  isToday ? 'bg-purple-500/20 border-purple-500' : 
                  darkMode ? 'border-gray-700 hover:bg-white/5' : 'border-gray-200 hover:bg-black/5'
                }`}
              >
                <div className="text-sm font-semibold mb-1">{day}</div>
                {ev.slice(0, 2).map((e, idx) => (
                  <div 
                    key={idx} 
                    className={`text-xs truncate px-1 rounded mb-1 ${
                      e.type === 'goal' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'
                    }`}
                  >
                    {e.time} {e.title}
                  </div>
                ))}
                {ev.length > 2 && <div className="text-xs text-gray-500">+{ev.length - 2} more</div>}
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className={`${cardClass} border rounded-xl p-6`}>
          <h3 className="text-xl font-bold mb-4">
            Events for {monthNames[currentDate.getMonth()]} {selectedDate}, {currentDate.getFullYear()}
          </h3>
          <div className="space-y-3">
            {eventsForDay(selectedDate).map((event, idx) => (
              <div key={idx} className={`p-4 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-black/5'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    event.type === 'goal' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {event.type}
                  </span>
                  {event.time && <span className="text-sm">{event.time}</span>}
                </div>
                <h4 className="font-semibold">{event.title}</h4>
              </div>
            ))}
            {eventsForDay(selectedDate).length === 0 && (
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                No events scheduled for this day.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;