import React, { useState } from "react";
import { Plus, Calendar as CalendarIcon, X } from "lucide-react";

const CalendarView = ({ darkMode, cardClass, events, setCalendarEvents, setNotifications }) => {
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const totalDays = daysInMonth(year, month);
  const firstDay = new Date(year, month, 1).getDay();

  const addEvent = () => {
    if (!newTitle.trim() || !newDate.trim()) return;

    const newEvent = {
      id: Date.now(),
      title: newTitle,
      date: newDate,
      time: newTime || "",
      type: "custom",
    };

    setCalendarEvents((prev) => [...prev, newEvent]);

    setNotifications((prev) => [
      ...prev,
      {
        id: Date.now(),
        message: `New event added: ${newTitle}`,
        date: new Date().toISOString(),
      },
    ]);

    setNewTitle("");
    setNewDate("");
    setNewTime("");
    setShowModal(false);
  };

  const getEventsForDate = (date) =>
    events.filter((event) => event.date === date);

  return (
    <div className="space-y-6 relative">

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <CalendarIcon className="w-6 h-6" />
          Calendar
        </h2>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      {/* Calendar Grid */}
      <div
        className={`${cardClass} border rounded-xl p-6 grid grid-cols-7 gap-2`}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center font-bold opacity-70">
            {d}
          </div>
        ))}

        {Array(firstDay)
          .fill(null)
          .map((_, i) => (
            <div key={"empty-" + i}></div>
          ))}

        {Array(totalDays)
          .fill(null)
          .map((_, i) => {
            const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(
              i + 1
            ).padStart(2, "0")}`;
            const dayEvents = getEventsForDate(date);

            const isToday =
              date === today.toISOString().split("T")[0];

            return (
              <div
                key={i}
                className={`${cardClass} border rounded-lg p-2 h-32 overflow-auto ${
                  isToday ? "ring-2 ring-purple-500" : ""
                }`}
              >
                <p className="font-bold">{i + 1}</p>

                {dayEvents.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {dayEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className="text-xs p-1 rounded bg-purple-600/40 border border-purple-600 truncate"
                      >
                        {ev.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Add Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`${cardClass} border rounded-xl p-6 w-full max-w-md`}>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Add Event</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm opacity-70">Event Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className={`${cardClass} border rounded-lg w-full p-2`}
                />
              </div>

              <div>
                <label className="text-sm opacity-70">Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className={`${cardClass} border rounded-lg w-full p-2`}
                />
              </div>

              <div>
                <label className="text-sm opacity-70">Time (optional)</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className={`${cardClass} border rounded-lg w-full p-2`}
                />
              </div>

              <button
                onClick={addEvent}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
              >
                Save Event
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
