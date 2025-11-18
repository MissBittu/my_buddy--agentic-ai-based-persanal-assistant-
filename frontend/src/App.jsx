import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Target, Calendar as CalendarIcon, Bot, Lock, 
  FolderOpen, Table, Moon, Sun, Bell, Search,
  Plus, Edit2, Trash2, Star, Tag, Upload,
  FileText, Image, Film, Music, Download,
  Clock, CheckCircle, AlertCircle, TrendingUp, X, Send,
  Save, Eye, EyeOff, Filter, ChevronLeft, ChevronRight
} from 'lucide-react';

import DailyGoals from './pages/DailyGoals';
import LongTermGoals from './pages/LongTermGoals';
import AIAssistant from './pages/AIAssistant';
import SecretNotes from './pages/SecretNotes';
import FileVault from './pages/FileVault';
import TaskScheduler from './pages/TaskScheduler';
import Spreadsheets from './pages/Spreadsheets';
import CalendarView from './pages/CalendarView';


const AnimatedBackground = ({ isDark }) => {
  if (isDark) {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900 to-black">
          <div className="absolute inset-0 opacity-30"
            style={{
              background: 'radial-gradient(ellipse at 20% 30%, rgba(147, 51, 234, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
              animation: 'pulse 8s ease-in-out infinite'
            }}
          />
        </div>
        {[...Array(100)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: Math.random() * 3 + 's',
              opacity: Math.random() * 0.8 + 0.2
            }}
          />
        ))}
        {[...Array(3)].map((_, i) => (
          <div key={`shooting-${i}`} className="absolute h-0.5 bg-gradient-to-r from-white to-transparent"
            style={{
              width: '150px',
              top: Math.random() * 50 + '%',
              left: '-150px',
              animation: `shooting 3s ease-out infinite`,
              animationDelay: i * 4 + 's',
              transform: 'rotate(-45deg)'
            }}
          />
        ))}
        <style>{`
          @keyframes twinkle { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }
          @keyframes shooting { 0% { left: -150px; opacity: 1; } 70% { opacity: 1; } 100% { left: 100%; opacity: 0; } }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } }
        `}</style>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-blue-300 to-blue-200" />
      <div className="absolute top-20 right-20 w-24 h-24 bg-yellow-300 rounded-full shadow-2xl"
        style={{ boxShadow: '0 0 60px 30px rgba(253, 224, 71, 0.4)', animation: 'pulse 4s ease-in-out infinite' }}>
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute top-1/2 left-1/2 w-1 h-16 bg-yellow-200 origin-bottom"
            style={{
              transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
              opacity: 0.6,
              animation: `sunray 3s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>
      {[...Array(8)].map((_, i) => (
        <div key={i} className="absolute"
          style={{
            top: Math.random() * 40 + 10 + '%',
            left: `${(i * 20) - 20}%`,
            animation: `cloud ${Math.random() * 40 + 40}s linear infinite`,
            animationDelay: `${i * -8}s`
          }}>
          <div className="relative">
            <div className="w-24 h-12 bg-white rounded-full opacity-80 blur-sm" />
            <div className="absolute top-2 left-6 w-32 h-16 bg-white rounded-full opacity-80 blur-sm" />
            <div className="absolute top-4 left-16 w-20 h-10 bg-white rounded-full opacity-80 blur-sm" />
          </div>
        </div>
      ))}
      <style>{`
        @keyframes cloud { 0% { transform: translateX(0); } 100% { transform: translateX(calc(100vw + 200px)); } }
        @keyframes sunray { 0%, 100% { transform: translate(-50%, -100%) rotate(var(--rotation)) scale(1); } 50% { transform: translate(-50%, -100%) rotate(var(--rotation)) scale(1.2); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
      `}</style>
    </div>
  );
};

const CosmicAssistant = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(null);
  
  const [dailyGoals, setDailyGoals] = useState([
    { id: 1, text: 'Complete project documentation', completed: true, time: '09:00', date: '2024-11-17' },
    { id: 2, text: 'Review pull requests', completed: false, time: '14:00', date: '2024-11-17' },
  ]);
  
  const [longTermGoals, setLongTermGoals] = useState([
    { id: 1, title: 'Learn React Advanced', description: 'Master hooks, context, and performance optimization', targetDate: '2025-12-31', progress: 45 },
  ]);
  
  const [notes, setNotes] = useState([
    { id: 1, title: 'Personal Ideas', content: 'My secret project ideas...', category: 'Personal', favorite: true, tags: ['ideas', 'projects'], locked: true },
    { id: 2, title: 'Work Notes', content: 'Meeting notes from today...', category: 'Work', favorite: false, tags: ['work'], locked: false },
  ]);
  
  const [files, setFiles] = useState([
    { id: 1, name: 'Project_Presentation.pdf', type: 'pdf', size: '2.4 MB', uploadedAt: '2024-11-15', category: 'Documents' },
    { id: 2, name: 'Design_Mockup.png', type: 'image', size: '1.8 MB', uploadedAt: '2024-11-14', category: 'Images' },
  ]);
  
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete project report', description: 'Write the Q4 report', priority: 5, deadline: '2024-11-20', scheduledTime: '10:00', status: 'pending', duration: 120 },
    { id: 2, title: 'Review code changes', description: 'Review PR #234', priority: 3, deadline: '2024-11-18', scheduledTime: '14:00', status: 'in_progress', duration: 60 },
  ]);
  
  const [spreadsheets, setSpreadsheets] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');
  const [newGoalTime, setNewGoalTime] = useState('');
  const [newGoalDate, setNewGoalDate] = useState('');
  
  const [editingNote, setEditingNote] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState('Personal');
  const [noteTags, setNoteTags] = useState('');
  
  const [editingTask, setEditingTask] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState(3);
  const [taskDeadline, setTaskDeadline] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [taskDuration, setTaskDuration] = useState(60);

  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your Cosmic AI Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const events = [
      ...dailyGoals.map(goal => ({
        id: `goal-${goal.id}`,
        title: goal.text,
        date: goal.date || new Date().toISOString().split('T')[0],
        time: goal.time,
        type: 'goal',
        completed: goal.completed
      })),
      ...tasks.map(task => ({
        id: `task-${task.id}`,
        title: task.title,
        date: task.deadline,
        time: task.scheduledTime,
        type: 'task',
        priority: task.priority,
        status: task.status
      }))
    ];
    setCalendarEvents(events);
  }, [dailyGoals, tasks]);

  const bgClass = darkMode ? 'bg-transparent text-white' : 'bg-transparent text-gray-900';
  const cardClass = darkMode ? 'bg-gray-800/40 backdrop-blur-md border-gray-700' : 'bg-white/40 backdrop-blur-md border-gray-200';

  const toggleGoal = (id) => {
    setDailyGoals(dailyGoals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const addDailyGoal = () => {
    if (!newGoalTitle.trim()) return;
    const newGoal = {
      id: Date.now(),
      text: newGoalTitle,
      time: newGoalTime,
      date: newGoalDate || new Date().toISOString().split('T')[0],
      completed: false
    };
    setDailyGoals([...dailyGoals, newGoal]);
    setNewGoalTitle('');
    setNewGoalTime('');
    setNewGoalDate('');
    setShowModal(null);
  };

  const addLongTermGoal = () => {
    if (!newGoalTitle.trim()) return;
    const newGoal = {
      id: Date.now(),
      title: newGoalTitle,
      description: newGoalDescription,
      targetDate: newGoalDate,
      progress: 0
    };
    setLongTermGoals([...longTermGoals, newGoal]);
    setNewGoalTitle('');
    setNewGoalDescription('');
    setNewGoalDate('');
    setShowModal(null);
  };

  const deleteGoal = (id, type) => {
    if (type === 'daily') {
      setDailyGoals(dailyGoals.filter(g => g.id !== id));
    } else {
      setLongTermGoals(longTermGoals.filter(g => g.id !== id));
    }
  };

  const saveNote = () => {
    if (!noteTitle.trim()) return;
    if (editingNote) {
      setNotes(notes.map(n => n.id === editingNote.id ? {
        ...n,
        title: noteTitle,
        content: noteContent,
        category: noteCategory,
        tags: noteTags.split(',').map(t => t.trim()).filter(Boolean)
      } : n));
    } else {
      const newNote = {
        id: Date.now(),
        title: noteTitle,
        content: noteContent,
        category: noteCategory,
        tags: noteTags.split(',').map(t => t.trim()).filter(Boolean),
        favorite: false,
        locked: false
      };
      setNotes([...notes, newNote]);
    }
    setNoteTitle('');
    setNoteContent('');
    setNoteCategory('Personal');
    setNoteTags('');
    setEditingNote(null);
    setShowModal(null);
  };

  const editNote = (note) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteCategory(note.category);
    setNoteTags(note.tags.join(', '));
    setShowModal('note');
  };

  const deleteNote = (id) => setNotes(notes.filter(n => n.id !== id));
  const toggleNoteFavorite = (id) => setNotes(notes.map(n => n.id === id ? { ...n, favorite: !n.favorite } : n));

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;
    const newFile = {
      id: Date.now(),
      name: uploadedFile.name,
      type: uploadedFile.type.split('/')[0] || 'file',
      size: (uploadedFile.size / (1024 * 1024)).toFixed(2) + ' MB',
      uploadedAt: new Date().toISOString().split('T')[0],
      category: 'Uncategorized'
    };
    setFiles([...files, newFile]);
  };

  const deleteFile = (id) => setFiles(files.filter(f => f.id !== id));

  const saveTask = () => {
    if (!taskTitle.trim()) return;
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? {
        ...t,
        title: taskTitle,
        description: taskDescription,
        priority: taskPriority,
        deadline: taskDeadline,
        scheduledTime: taskTime,
        duration: taskDuration
      } : t));
    } else {
      const newTask = {
        id: Date.now(),
        title: taskTitle,
        description: taskDescription,
        priority: taskPriority,
        deadline: taskDeadline,
        scheduledTime: taskTime,
        status: 'pending',
        duration: taskDuration
      };
      setTasks([...tasks, newTask]);
    }
    setTaskTitle('');
    setTaskDescription('');
    setTaskPriority(3);
    setTaskDeadline('');
    setTaskTime('');
    setTaskDuration(60);
    setEditingTask(null);
    setShowModal(null);
  };

  const editTask = (task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setTaskPriority(task.priority);
    setTaskDeadline(task.deadline);
    setTaskTime(task.scheduledTime);
    setTaskDuration(task.duration);
    setShowModal('task');
  };

  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));
  const updateTaskStatus = (id, newStatus) => setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(m => [...m, { role: 'assistant', content: 'I\'m processing your request...' }]);
    }, 500);
  };

  return (
    <div className={`min-h-screen relative ${bgClass} transition-all duration-500`}>
      <AnimatedBackground isDark={darkMode} />
      
      <header className={`${cardClass} border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <h1 className="text-xl font-bold">Cosmic Assistant</h1>
          </div>
          <div className="relative ml-8">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search everything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${cardClass} border rounded-lg pl-10 pr-4 py-2 w-96 focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg transition ${darkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button className={`relative p-2 rounded-lg transition ${darkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}>
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        </div>
      </header>

      <div className="flex">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} darkMode={darkMode} cardClass={cardClass} />
        <main className="flex-1 p-8 relative z-10">
{currentPage === 'dashboard' &&
<Dashboard
  darkMode={darkMode}
  cardClass={cardClass}
  dailyGoals={dailyGoals}
  longTermGoals={longTermGoals}
/>
}
          {currentPage === 'daily-goals' && <DailyGoals darkMode={darkMode} cardClass={cardClass} goals={dailyGoals} toggleGoal={toggleGoal} deleteGoal={deleteGoal} setShowModal={setShowModal} />}
          {currentPage === 'long-term-goals' && <LongTermGoals darkMode={darkMode} cardClass={cardClass} goals={longTermGoals} deleteGoal={deleteGoal} setShowModal={setShowModal} />}
          {currentPage === 'ai-assistant' && <AIAssistant darkMode={darkMode} cardClass={cardClass} messages={messages} input={input} setInput={setInput} sendMessage={sendMessage} />}
          {currentPage === 'secret-notes' && <SecretNotes darkMode={darkMode} cardClass={cardClass} notes={notes} editNote={editNote} deleteNote={deleteNote} toggleNoteFavorite={toggleNoteFavorite} setShowModal={setShowModal} />}
          {currentPage === 'file-vault' && <FileVault darkMode={darkMode} cardClass={cardClass} files={files} deleteFile={deleteFile} handleFileUpload={handleFileUpload} />}
          {currentPage === 'scheduler' && <TaskScheduler darkMode={darkMode} cardClass={cardClass} tasks={tasks} editTask={editTask} deleteTask={deleteTask} updateTaskStatus={updateTaskStatus} setShowModal={setShowModal} />}
          {currentPage === 'spreadsheets' && <Spreadsheets darkMode={darkMode} cardClass={cardClass} spreadsheets={spreadsheets} setSpreadsheets={setSpreadsheets} />}
          {currentPage === 'calendar' && <CalendarView darkMode={darkMode} cardClass={cardClass} events={calendarEvents} />}
        </main>
      </div>

      {showModal === 'daily' && (
        <Modal title="Add Daily Goal" onClose={() => setShowModal(null)} cardClass={cardClass}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Goal Title</label>
              <input type="text" value={newGoalTitle} onChange={(e) => setNewGoalTitle(e.target.value)}
                placeholder="What do you want to accomplish?"
                className={`w-full px-4 py-2 ${cardClass} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Date</label>
              <input type="date" value={newGoalDate} onChange={(e) => setNewGoalDate(e.target.value)}
                className={`w-full px-4 py-2 ${cardClass} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Time (Optional)</label>
              <input type="time" value={newGoalTime} onChange={(e) => setNewGoalTime(e.target.value)}
                className={`w-full px-4 py-2 ${cardClass} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>
            <button onClick={addDailyGoal}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-medium"
            >Add Goal</button>
          </div>
        </Modal>
      )}

      {showModal === 'longterm' && (
        <Modal title="Add Long-Term Goal" onClose={() => setShowModal(null)} cardClass={cardClass}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Goal Title</label>
              <input type="text" value={newGoalTitle} onChange={(e) => setNewGoalTitle(e.target.value)}
                placeholder="Your long-term goal"
                className={`w-full px-4 py-2 ${cardClass} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <textarea value={newGoalDescription} onChange={(e) => setNewGoalDescription(e.target.value)}
                placeholder="Describe your goal..." rows="3"
                className={`w-full px-4 py-2 ${cardClass} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none`}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Target Date</label>
              <input type="date" value={newGoalDate} onChange={(e) => setNewGoalDate(e.target.value)}
                className={`w-full px-4 py-2 ${cardClass} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>
            <button onClick={addLongTermGoal}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-medium"
            >Create Goal</button>
          </div>
        </Modal>
      )}

      {showModal === 'note' && (
        <Modal title={editingNote ? 'Edit Note' : 'New Secret Note'} onClose={() => { setShowModal(null); setEditingNote(null); }} cardClass={cardClass}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title</label>
              <input type="text" value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Note title..."
                className={`w-full px-4 py-2 ${cardClass} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Content</label>
              <textarea value={noteContent} onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Write your secret note..." rows="6"
                className={`w-full px-4 py-2 ${cardClass} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none`}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <select value={noteCategory} onChange={(e) => setNoteCategory(e.target.value)}
                className={`w-full px-4 py-2 ${cardClass} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              >
                <option>Personal</option>
                <option>Work</option>
                <option>Ideas</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Tags (comma-separated)</label>
              <input type="text" value={noteTags} onChange={(e) => setNoteTags(e.target.value)}
                placeholder="ideas, important, etc..."
                className={`w-full px-4 py-2 ${cardClass} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>
            <button onClick={saveNote}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-medium flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {editingNote ? 'Update Note' : 'Save Note'}
            </button>
          </div>
        </Modal>
      )}

      {showModal === 'task' && (
        <Modal title={editingTask ? 'Edit Task' : 'New Task'} onClose={() => { setShowModal(null); setEditingTask(null); }} cardClass={cardClass}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Task Title</label>
              <input type="text" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="What needs to be done?"
                className={`w-full px-4 py-2 ${cardClass} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <textarea value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Task details..." rows="3"
                className={`w-full px-4 py-2 ${cardClass} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none`}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Priority (1-5): {taskPriority}</label>
              <input type="range" min="1" max="5" value={taskPriority}
                onChange={(e) => setTaskPriority(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Deadline</label>
                <input type="date" value={taskDeadline} onChange={(e) => setTaskDeadline(e.target.value)}
                  className={`w-full px-4 py-2 ${cardClass} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Time</label>
                <input type="time" value={taskTime} onChange={(e) => setTaskTime(e.target.value)}
                  className={`w-full px-4 py-2 ${cardClass} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Duration (minutes)</label>
              <input type="number" value={taskDuration} onChange={(e) => setTaskDuration(parseInt(e.target.value))}
                placeholder="60"
                className={`w-full px-4 py-2 ${cardClass} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>
            <button onClick={saveTask}
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-medium flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {editingTask ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

const Modal = ({ title, children, onClose, cardClass }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div className={`${cardClass} border rounded-xl w-full max-w-md p-6`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">{title}</h3>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition">
          <X className="w-5 h-5" />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const Sidebar = ({ currentPage, setCurrentPage, darkMode, cardClass }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'daily-goals', label: 'Daily Goals', icon: CalendarIcon },
    { id: 'long-term-goals', label: 'Long-Term Goals', icon: Target },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon, badge: 'New' },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot },
    { id: 'secret-notes', label: 'Secret Notes', icon: Lock, badge: 'New' },
    { id: 'file-vault', label: 'File Vault', icon: FolderOpen, badge: 'New' },
    { id: 'scheduler', label: 'Smart Scheduler', icon: Clock, badge: 'New' },
    { id: 'spreadsheets', label: 'Spreadsheets', icon: Table, badge: 'New' },
  ];

  return (
    <aside className={`${cardClass} w-64 border-r min-h-screen p-4`}>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive ? 'bg-purple-600 text-white' : darkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

const Dashboard = ({ darkMode, cardClass, dailyGoals, longTermGoals }) => {
  const completedGoals = dailyGoals.filter(g => g.completed).length;
  const totalGoals = dailyGoals.length;
  const productivity = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  const stats = [
    { label: 'Tasks Completed', value: `${completedGoals}/${totalGoals}`, change: '+12%', icon: CheckCircle, color: 'text-green-500' },
    { label: 'Active Goals', value: longTermGoals.length.toString(), change: '+2', icon: Target, color: 'text-blue-500' },
    { label: 'Productivity', value: `${productivity}%`, change: '+5%', icon: TrendingUp, color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Welcome back! 🚀</h2>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Here's what's happening with your productivity today.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`${cardClass} border rounded-xl p-6`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
                  <h3 className="text-3xl font-bold">{stat.value}</h3>
                  <p className={`text-sm mt-2 ${stat.color}`}>{stat.change}</p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>
      <div className={`${cardClass} border rounded-xl p-6`}>
        <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {dailyGoals.slice(0, 5).map((goal) => (
              <div key={goal.id} className={`${cardClass} border rounded-xl p-4 transition ${darkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}>
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p><span className="text-purple-400">{goal.completed ? 'Completed' : 'Pending'}</span>: {goal.text}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{goal.time || 'No time set'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CosmicAssistant;