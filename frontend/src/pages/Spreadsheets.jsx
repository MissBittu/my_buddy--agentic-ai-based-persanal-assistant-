import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const Spreadsheets = ({ darkMode, cardClass, spreadsheets, setSpreadsheets }) => {
  const templates = [
    { id: 1, name: 'Budget Tracker', icon: '💰', description: 'Track your income and expenses' },
    { id: 2, name: 'Habit Tracker', icon: '✅', description: 'Monitor daily habits and progress' },
    { id: 3, name: 'Study Planner', icon: '📚', description: 'Organize your study schedule' },
    { id: 4, name: 'Project Timeline', icon: '📊', description: 'Plan project milestones' },
  ];

  const createSpreadsheet = (template) => {
    const newSpreadsheet = {
      id: Date.now(),
      name: template.name,
      template: template.name,
      createdAt: new Date().toISOString().split('T')[0],
      data: []
    };
    setSpreadsheets([...spreadsheets, newSpreadsheet]);
  };

  const deleteSpreadsheet = (id) => {
    setSpreadsheets(spreadsheets.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Spreadsheets 📊</h2>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Custom
        </button>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map(template => (
            <div 
              key={template.id} 
              className={`${cardClass} border rounded-xl p-6 hover:shadow-lg transition`}
            >
              <div className="text-4xl mb-4">{template.icon}</div>
              <h3 className="text-lg font-bold mb-2">{template.name}</h3>
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {template.description}
              </p>
              <button 
                onClick={() => createSpreadsheet(template)}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Use Template
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">My Spreadsheets</h3>
        {spreadsheets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spreadsheets.map(sheet => (
              <div 
                key={sheet.id} 
                className={`${cardClass} border rounded-xl p-6 hover:shadow-lg transition`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold mb-1">{sheet.name}</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Created: {sheet.createdAt}
                    </p>
                  </div>
                  <button 
                    onClick={() => deleteSpreadsheet(sheet.id)} 
                    className="p-2 hover:bg-red-500/20 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
                <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                  Open
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className={`${cardClass} border rounded-xl p-6 text-center`}>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              No spreadsheets yet. Create one from a template above!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Spreadsheets;