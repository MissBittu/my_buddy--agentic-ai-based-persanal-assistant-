import React from 'react';
import { Plus, Calendar, Trash2 } from 'lucide-react';

const LongTermGoals = ({ darkMode, cardClass, goals, deleteGoal, setShowModal }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Long-Term Goals 🎯</h2>
        <button 
          onClick={() => setShowModal('longterm')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map(goal => (
          <div key={goal.id} className={`${cardClass} border rounded-xl p-6`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold mb-2">{goal.title}</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  {goal.description}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{goal.targetDate}</span>
                </div>
              </div>
              <button
                onClick={() => deleteGoal(goal.id, 'longterm')}
                className={`p-2 rounded-lg transition ${
                  darkMode ? 'hover:bg-red-500/20' : 'hover:bg-red-100'
                }`}
              >
                <Trash2 className="w-5 h-5 text-red-400" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Progress
                </span>
                <span className="font-medium">{goal.progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LongTermGoals;