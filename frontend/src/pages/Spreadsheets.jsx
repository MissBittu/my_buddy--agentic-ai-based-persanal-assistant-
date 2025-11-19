import React, { useState } from 'react';
import { Plus, Trash2, X, Save, ArrowLeft } from 'lucide-react';

const Spreadsheets = ({ darkMode, cardClass, spreadsheets, setSpreadsheets }) => {
  const [editingSheet, setEditingSheet] = useState(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState('');

  const templates = [
    { 
      id: 1, 
      name: 'Budget Tracker', 
      icon: '💰', 
      description: 'Track your income and expenses',
      headers: ['Date', 'Category', 'Description', 'Amount', 'Type'],
      rows: 10
    },
    { 
      id: 2, 
      name: 'Habit Tracker', 
      icon: '✅', 
      description: 'Monitor daily habits and progress',
      headers: ['Habit', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      rows: 8
    },
    { 
      id: 3, 
      name: 'Study Planner', 
      icon: '📚', 
      description: 'Organize your study schedule',
      headers: ['Subject', 'Topic', 'Date', 'Duration', 'Status'],
      rows: 12
    },
    { 
      id: 4, 
      name: 'Project Timeline', 
      icon: '📊', 
      description: 'Plan project milestones',
      headers: ['Task', 'Start Date', 'End Date', 'Priority', 'Status'],
      rows: 10
    },
  ];

  const createSpreadsheet = (template) => {
    const newSheet = {
      id: Date.now(),
      name: template.name,
      template: template.name,
      createdAt: new Date().toISOString().split('T')[0],
      headers: template.headers,
      data: Array(template.rows).fill(null).map(() => 
        Array(template.headers.length).fill('')
      )
    };
    setSpreadsheets([...spreadsheets, newSheet]);
    setEditingSheet(newSheet);
  };

  const createCustomSpreadsheet = () => {
    if (!customName.trim()) return;
    
    const newSheet = {
      id: Date.now(),
      name: customName,
      template: 'Custom',
      createdAt: new Date().toISOString().split('T')[0],
      headers: ['Column 1', 'Column 2', 'Column 3', 'Column 4', 'Column 5'],
      data: Array(10).fill(null).map(() => Array(5).fill(''))
    };
    setSpreadsheets([...spreadsheets, newSheet]);
    setEditingSheet(newSheet);
    setShowCustomModal(false);
    setCustomName('');
  };

  const updateCell = (rowIndex, colIndex, value) => {
    const updatedSheet = { ...editingSheet };
    updatedSheet.data[rowIndex][colIndex] = value;
    setEditingSheet(updatedSheet);
    
    // Update in main spreadsheets array
    setSpreadsheets(spreadsheets.map(s => 
      s.id === editingSheet.id ? updatedSheet : s
    ));
  };

  const addRow = () => {
    const updatedSheet = { ...editingSheet };
    updatedSheet.data.push(Array(editingSheet.headers.length).fill(''));
    setEditingSheet(updatedSheet);
    setSpreadsheets(spreadsheets.map(s => 
      s.id === editingSheet.id ? updatedSheet : s
    ));
  };

  const addColumn = () => {
    const updatedSheet = { ...editingSheet };
    updatedSheet.headers.push(`Column ${updatedSheet.headers.length + 1}`);
    updatedSheet.data = updatedSheet.data.map(row => [...row, '']);
    setEditingSheet(updatedSheet);
    setSpreadsheets(spreadsheets.map(s => 
      s.id === editingSheet.id ? updatedSheet : s
    ));
  };

  const updateHeader = (index, value) => {
    const updatedSheet = { ...editingSheet };
    updatedSheet.headers[index] = value;
    setEditingSheet(updatedSheet);
    setSpreadsheets(spreadsheets.map(s => 
      s.id === editingSheet.id ? updatedSheet : s
    ));
  };

  const deleteSpreadsheet = (id) => {
    setSpreadsheets(spreadsheets.filter(s => s.id !== id));
    if (editingSheet?.id === id) {
      setEditingSheet(null);
    }
  };

  const saveAndClose = () => {
    setEditingSheet(null);
  };

  // If editing a spreadsheet, show the editor
  if (editingSheet) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={saveAndClose}
              className={`p-2 rounded-lg transition ${darkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold">{editingSheet.name}</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Created: {editingSheet.createdAt}
              </p>
            </div>
          </div>
          <button
            onClick={saveAndClose}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save & Close
          </button>
        </div>

        <div className={`${cardClass} border rounded-xl p-6 overflow-x-auto`}>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-600 p-2 bg-purple-600/20 w-12">#</th>
                {editingSheet.headers.map((header, idx) => (
                  <th key={idx} className="border border-gray-600 p-2 bg-purple-600/20 min-w-[150px]">
                    <input
                      type="text"
                      value={header}
                      onChange={(e) => updateHeader(idx, e.target.value)}
                      className={`w-full bg-transparent text-center font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1`}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {editingSheet.data.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  <td className="border border-gray-600 p-2 text-center font-semibold bg-purple-600/10">
                    {rowIdx + 1}
                  </td>
                  {row.map((cell, colIdx) => (
                    <td key={colIdx} className="border border-gray-600 p-0">
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
                        className={`w-full px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}
                        placeholder={`Enter ${editingSheet.headers[colIdx]}`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex gap-4 mt-4">
            <button
              onClick={addRow}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Row
            </button>
            <button
              onClick={addColumn}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Column
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main view - showing templates and list of spreadsheets
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Spreadsheets 📊</h2>
        <button 
          onClick={() => setShowCustomModal(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Custom
        </button>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map(template => (
            <div key={template.id} className={`${cardClass} border rounded-xl p-6 hover:shadow-lg transition`}>
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
              <div key={sheet.id} className={`${cardClass} border rounded-xl p-6 hover:shadow-lg transition`}>
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
                <button 
                  onClick={() => setEditingSheet(sheet)}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
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

      {/* Custom Spreadsheet Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`${cardClass} border rounded-xl w-full max-w-md p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Create Custom Spreadsheet</h3>
              <button 
                onClick={() => setShowCustomModal(false)} 
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Spreadsheet Name</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="My Custom Spreadsheet"
                  className={`w-full px-4 py-2 ${cardClass} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
              </div>
              <button
                onClick={createCustomSpreadsheet}
                className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-medium"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Spreadsheets;