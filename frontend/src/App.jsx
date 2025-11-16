import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, Target, Lock, Folder, Plus, X, Check, Star, Sparkles, Moon, Sun, Bell, Edit2, Trash2, ChevronDown, ChevronRight, Zap, TrendingUp, AlertCircle, Brain, Mic, Image, FileText, Activity, BarChart3, RefreshCw, MessageSquare, Send, BellRing, Menu, Settings, Search, Filter, Link2, Archive, Eye, EyeOff, Save, Copy, Download, Upload, LogOut } from 'lucide-react';
import CosmicBackground from "./components/CosmicBackground";
import { sendChatMessage } from "./components/api/chat";

const CosmicAssistant = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [dailyGoals, setDailyGoals] = useState([]);
  const [longTermGoals, setLongTermGoals] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hello! I am your cosmic AI assistant. How can I help you achieve your goals today?', time: new Date() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');
  const [newGoalTime, setNewGoalTime] = useState('');
  const [newGoalDate, setNewGoalDate] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const addDailyGoal = () => {
    if (!newGoalTitle.trim()) return;
    
    const newGoal = {
      id: Date.now(),
      title: newGoalTitle,
      time: newGoalTime,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    setDailyGoals([...dailyGoals, newGoal]);
    setNewGoalTitle('');
    setNewGoalTime('');
    setShowModal(null);
  };

  const addLongTermGoal = () => {
    if (!newGoalTitle.trim()) return;
    
    const newGoal = {
      id: Date.now(),
      title: newGoalTitle,
      description: newGoalDescription,
      targetDate: newGoalDate,
      progress: 0,
      createdAt: new Date().toISOString()
    };
    
    setLongTermGoals([...longTermGoals, newGoal]);
    setNewGoalTitle('');
    setNewGoalDescription('');
    setNewGoalDate('');
    setShowModal(null);
  };

  const toggleTaskComplete = (id) => {
    setDailyGoals(dailyGoals.map(g => 
      g.id === id ? { ...g, completed: !g.completed } : g
    ));
  };

  const deleteGoal = (id, type) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;
    
    if (type === 'daily') {
      setDailyGoals(dailyGoals.filter(g => g.id !== id));
    } else {
      setLongTermGoals(longTermGoals.filter(g => g.id !== id));
    }
  };

const handleChatSubmit = async (e) => {
  e.preventDefault();
  if (!chatInput.trim()) return;

  const userMessage = {
    id: Date.now(),
    sender: "user",
    text: chatInput,
    time: new Date()
  };

  setChatMessages((prev) => [...prev, userMessage]);

  const messageToSend = chatInput;
  setChatInput("");

  try {
    // CALL BACKEND
    const response = await sendChatMessage(messageToSend);

    const aiMessage = {
      id: Date.now() + 1,
      sender: "ai",
      text: response.content,
      time: new Date()
    };

    setChatMessages((prev) => [...prev, aiMessage]);

  } catch (error) {
    console.error("Chat error:", error);
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 2,
        sender: "ai",
        text: "⚠️ AI server error — check your backend.",
        time: new Date()
      }
    ]);
  }
};



  const calculateGoalAlignment = () => {
    if (dailyGoals.length === 0) return 100;
    const completed = dailyGoals.filter(g => g.completed).length;
    return Math.round((completed / dailyGoals.length) * 100);
  };

  return (
    <>
      <CosmicBackground />
      
      <div className="min-h-screen" style={{ position: 'relative', zIndex: 1 }}>
        <div className="p-4" style={{ backdropFilter: 'blur(12px)', background: 'rgba(0, 0, 0, 0.2)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              Cosmic Assistant
            </h1>
            
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                <Bell className="w-5 h-5 text-white" />
              </button>
              <span className="text-white">Welcome, User!</span>
            </div>
          </div>
        </div>

        <div className="flex" style={{ height: 'calc(100vh - 80px)' }}>
          <div className="w-64 p-4" style={{ backdropFilter: 'blur(12px)', background: 'rgba(0, 0, 0, 0.2)', borderRight: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeView === 'dashboard' ? 'bg-purple-500/30 text-white' : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                Dashboard
              </button>

              <button
                onClick={() => setActiveView('daily')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeView === 'daily' ? 'bg-purple-500/30 text-white' : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <Calendar className="w-5 h-5" />
                Daily Goals
              </button>

              <button
                onClick={() => setActiveView('longterm')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeView === 'longterm' ? 'bg-purple-500/30 text-white' : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <Target className="w-5 h-5" />
                Long-Term Goals
              </button>

              <button
                onClick={() => setShowChat(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 transition-all"
              >
                <MessageSquare className="w-5 h-5" />
                AI Assistant
              </button>
            </nav>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeView === 'dashboard' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white mb-6">Dashboard</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div style={{ backdropFilter: 'blur(12px)', background: 'rgba(255, 255, 255, 0.1)' }} className="rounded-xl p-6 border border-white/20">
                    <div className="flex items-center justify-between mb-4">
                      <Target className="w-8 h-8 text-purple-400" />
                      <span className="text-2xl font-bold text-white">
                        {dailyGoals.filter(g => g.completed).length}/{dailyGoals.length}
                      </span>
                    </div>
                    <h3 className="text-white font-semibold mb-1">Daily Progress</h3>
                    <p className="text-gray-300 text-sm">Goals Completed</p>
                  </div>

                  <div style={{ backdropFilter: 'blur(12px)', background: 'rgba(255, 255, 255, 0.1)' }} className="rounded-xl p-6 border border-white/20">
                    <div className="flex items-center justify-between mb-4">
                      <Zap className="w-8 h-8 text-yellow-400" />
                      <span className="text-2xl font-bold text-white">{calculateGoalAlignment()}%</span>
                    </div>
                    <h3 className="text-white font-semibold mb-1">Productivity</h3>
                    <p className="text-gray-300 text-sm">Goal Alignment</p>
                  </div>

                  <div style={{ backdropFilter: 'blur(12px)', background: 'rgba(255, 255, 255, 0.1)' }} className="rounded-xl p-6 border border-white/20">
                    <div className="flex items-center justify-between mb-4">
                      <TrendingUp className="w-8 h-8 text-green-400" />
                      <span className="text-2xl font-bold text-white">{longTermGoals.length}</span>
                    </div>
                    <h3 className="text-white font-semibold mb-1">Long-Term Goals</h3>
                    <p className="text-gray-300 text-sm">Active Projects</p>
                  </div>
                </div>

                <div style={{ backdropFilter: 'blur(12px)', background: 'rgba(255, 255, 255, 0.1)' }} className="rounded-xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {dailyGoals.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">No activity yet. Start by adding some goals!</p>
                    ) : (
                      dailyGoals.slice(0, 5).map(goal => (
                        <div key={goal.id} className="flex items-center justify-between py-2 border-b border-white/10">
                          <div className="flex items-center gap-3">
                            {goal.completed ? (
                              <Check className="w-5 h-5 text-green-400" />
                            ) : (
                              <Clock className="w-5 h-5 text-yellow-400" />
                            )}
                            <span className="text-white">{goal.title}</span>
                          </div>
                          {goal.time && <span className="text-gray-400 text-sm">{goal.time}</span>}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeView === 'daily' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-white">Daily Goals</h2>
                  <button
                    onClick={() => setShowModal('daily')}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    Add Goal
                  </button>
                </div>

                <div className="space-y-4">
                  {dailyGoals.map(goal => (
                    <div
                      key={goal.id}
                      style={{ backdropFilter: 'blur(12px)', background: 'rgba(255, 255, 255, 0.1)' }}
                      className="rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <button
                            onClick={() => toggleTaskComplete(goal.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              goal.completed ? 'bg-green-500 border-green-500' : 'border-white/30 hover:border-white/50'
                            }`}
                          >
                            {goal.completed && <Check className="w-4 h-4 text-white" />}
                          </button>
                          <div className="flex-1">
                            <h3 className={`text-white font-medium ${goal.completed ? 'line-through opacity-50' : ''}`}>
                              {goal.title}
                            </h3>
                            {goal.time && (
                              <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
                                <Clock className="w-4 h-4" />
                                {goal.time}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteGoal(goal.id, 'daily')}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-all"
                        >
                          <Trash2 className="w-5 h-5 text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {dailyGoals.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>No daily goals yet. Add your first goal!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeView === 'longterm' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-white">Long-Term Goals</h2>
                  <button
                    onClick={() => setShowModal('longterm')}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    Add Goal
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {longTermGoals.map(goal => (
                    <div
                      key={goal.id}
                      style={{ backdropFilter: 'blur(12px)', background: 'rgba(255, 255, 255, 0.1)' }}
                      className="rounded-xl p-6 border border-white/20"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">{goal.title}</h3>
                          <p className="text-gray-300 text-sm">{goal.description}</p>
                        </div>
                        <button
                          onClick={() => deleteGoal(goal.id, 'longterm')}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-all"
                        >
                          <Trash2 className="w-5 h-5 text-red-400" />
                        </button>
                      </div>

                      {goal.targetDate && (
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                          <Calendar className="w-4 h-4" />
                          Target: {new Date(goal.targetDate).toLocaleDateString()}
                        </div>
                      )}

                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-300">Progress</span>
                          <span className="text-white font-bold">{goal.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full transition-all"
                            style={{ width: `${goal.progress || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {longTermGoals.length === 0 && (
                    <div className="col-span-2 text-center py-12 text-gray-400">
                      <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>No long-term goals yet. Create your first goal!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {showChat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(8px)' }}>
            <div style={{ backdropFilter: 'blur(12px)', background: 'rgba(255, 255, 255, 0.1)' }} className="rounded-xl border border-white/20 w-full max-w-2xl h-[600px] flex flex-col">
              <div className="p-4 border-b border-white/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-bold text-white">AI Assistant</h3>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.sender === 'user' ? 'bg-purple-500 text-white' : 'bg-white/10 text-white'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleChatSubmit} className="p-4 border-t border-white/20">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showModal === 'daily' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(8px)' }}>
            <div style={{ backdropFilter: 'blur(12px)', background: 'rgba(255, 255, 255, 0.1)' }} className="rounded-xl border border-white/20 w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Add Daily Goal</h3>
                <button
                  onClick={() => {
                    setShowModal(null);
                    setNewGoalTitle('');
                    setNewGoalTime('');
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Goal Title</label>
                  <input
                    type="text"
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    placeholder="What do you want to accomplish?"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Time (Optional)</label>
                  <input
                    type="time"
                    value={newGoalTime}
                    onChange={(e) => setNewGoalTime(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  onClick={addDailyGoal}
                  className="w-full px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all font-medium"
                >
                  Add Goal
                </button>
              </div>
            </div>
          </div>
        )}

        {showModal === 'longterm' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(8px)' }}>
            <div style={{ backdropFilter: 'blur(12px)', background: 'rgba(255, 255, 255, 0.1)' }} className="rounded-xl border border-white/20 w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Add Long-Term Goal</h3>
                <button
                  onClick={() => {
                    setShowModal(null);
                    setNewGoalTitle('');
                    setNewGoalDescription('');
                    setNewGoalDate('');
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Goal Title</label>
                  <input
                    type="text"
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    placeholder="Your long-term goal"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Description</label>
                  <textarea
                    value={newGoalDescription}
                    onChange={(e) => setNewGoalDescription(e.target.value)}
                    placeholder="Describe your goal..."
                    rows="3"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>

                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Target Date</label>
                  <input
                    type="date"
                    value={newGoalDate}
                    onChange={(e) => setNewGoalDate(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  onClick={addLongTermGoal}
                  className="w-full px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all font-medium"
                >
                  Create Goal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CosmicAssistant;