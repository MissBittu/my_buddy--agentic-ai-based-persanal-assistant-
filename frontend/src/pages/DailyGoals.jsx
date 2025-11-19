import React from 'react';
import { Plus, CheckCircle, Clock, Trash2 } from 'lucide-react';

const DailyGoals = ({ darkMode, cardClass, goals, toggleGoal, deleteGoal, setShowModal }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Daily Goals 📅</h2>
        <button 
          onClick={() => setShowModal('daily')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Goal
        </button>
      </div>

      <div className="space-y-3">
        {goals && goals.length > 0 ? (
          goals.map(goal => (
            <div 
              key={goal.id} 
              className={`${cardClass} border rounded-xl p-4 transition ${darkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleGoal(goal.id)}
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                    goal.completed ? 'bg-purple-600 border-purple-600' : 'border-gray-500'
                  }`}
                >
                  {goal.completed && <CheckCircle className="w-4 h-4 text-white" />}
                </button>
                
                <div className="flex-1">
                  <span className={goal.completed ? 'line-through opacity-50' : ''}>
                    {goal.text}
                  </span>
                  {goal.time && (
                    <p className={`text-sm mt-1 flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <Clock className="w-4 h-4" />
                      {goal.time} • {goal.date}
                    </p>
                  )}
                </div>
                
                <button
                  onClick={() => deleteGoal(goal.id, 'daily')}
                  className={`p-2 rounded-lg transition ${darkMode ? 'hover:bg-red-500/20' : 'hover:bg-red-100'}`}
                >
                  <Trash2 className="w-5 h-5 text-red-400" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={`${cardClass} border rounded-xl p-8 text-center`}>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              No daily goals yet. Click "Add Goal" to get started! 🎯
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyGoals;