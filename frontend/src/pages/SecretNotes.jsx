import React, { useState } from 'react';
import { Plus, Star, Edit2, Trash2 } from 'lucide-react';

const SecretNotes = ({ darkMode, cardClass, notes, editNote, deleteNote, toggleNoteFavorite, setShowModal }) => {
  const [filter, setFilter] = useState('all');
  
  const filteredNotes = filter === 'all' ? notes : notes.filter(n => n.category === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Secret Notes 🔐</h2>
        <button 
          onClick={() => setShowModal('note')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Note
        </button>
      </div>

      <div className="flex gap-2">
        {['all', 'Personal', 'Work', 'Ideas'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg transition ${
              filter === cat 
                ? 'bg-purple-600 text-white' 
                : darkMode ? 'bg-white/10' : 'bg-black/10'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredNotes.map(note => (
          <div 
            key={note.id} 
            className={`${cardClass} border rounded-xl p-6 hover:shadow-lg transition`}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-bold flex-1">{note.title}</h3>
              <button onClick={() => toggleNoteFavorite(note.id)}>
                <Star 
                  className={`w-5 h-5 ${
                    note.favorite 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-gray-400'
                  }`} 
                />
              </button>
            </div>
            
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-3`}>
              {note.content}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {note.tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-xs">
                {note.category}
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => editNote(note)} 
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => deleteNote(note.id)} 
                  className="p-2 hover:bg-red-500/20 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecretNotes;