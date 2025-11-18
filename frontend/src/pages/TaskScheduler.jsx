import React from 'react';
import { Plus, Edit2, Trash2, AlertCircle, Clock } from 'lucide-react';

const TaskScheduler = ({ darkMode, cardClass, tasks, editTask, deleteTask, updateTaskStatus, setShowModal }) => {
  const getPriorityColor = (priority) => {
    if (priority >= 4) return 'text-red-500';
    if (priority >= 3) return 'text-orange-500';
    return 'text-green-500';
  };

  const autoReschedule = (taskId) => {
    const newTime = new Date();
    newTime.setHours(newTime.getHours() + 2);
    const timeStr = newTime.toTimeString().slice(0, 5);
    alert(`Task rescheduled to ${timeStr}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Smart Scheduler 🤖</h2>
        <button 
          onClick={() => setShowModal('task')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      <div className="space-y-4">
        {tasks.map(task => (
          <div 
            key={task.id} 
            className={`${cardClass} border rounded-xl p-6 hover:shadow-lg transition`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">{task.title}</h3>
                <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {task.description}
                </p>
                
                <div className="flex items-center gap-4 text-sm flex-wrap">
                  <div className="flex items-center gap-2">
                    <AlertCircle className={`w-4 h-4 ${getPriorityColor(task.priority)}`} />
                    <span>Priority: {task.priority}/5</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{task.deadline} at {task.scheduledTime}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span>{task.duration} min</span>
                  </div>
                  
                  <select 
                    value={task.status} 
                    onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-xs ${cardClass} border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      task.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' : 
                      'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => autoReschedule(task.id)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm whitespace-nowrap"
                >
                  Auto-Schedule
                </button>
                <button 
                  onClick={() => editTask(task)} 
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => deleteTask(task.id)} 
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

export default TaskScheduler;