import React from 'react';
import { CheckCircle, Target, TrendingUp } from 'lucide-react';

const Dashboard = ({ darkMode, cardClass, dailyGoals, longTermGoals }) => {
  const completedGoals = dailyGoals ? dailyGoals.filter(g => g.completed).length : 0;
  const totalGoals = dailyGoals ? dailyGoals.length : 0;
  const productivity = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  const stats = [
    { 
      label: 'Tasks Completed', 
      value: `${completedGoals}/${totalGoals}`, 
      change: '+12%', 
      icon: CheckCircle, 
      color: 'text-green-500' 
    },
    { 
      label: 'Active Goals', 
      value: longTermGoals ? longTermGoals.length.toString() : '0', 
      change: '+2', 
      icon: Target, 
      color: 'text-blue-500' 
    },
    { 
      label: 'Productivity', 
      value: `${productivity}%`, 
      change: '+5%', 
      icon: TrendingUp, 
      color: 'text-orange-500' 
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Welcome back! 🚀</h2>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          Here's what's happening with your productivity today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`${cardClass} border rounded-xl p-6`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.label}
                  </p>
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
          {dailyGoals && dailyGoals.length > 0 ? (
            dailyGoals.slice(0, 5).map((goal) => (
              <div 
                key={goal.id} 
                className={`flex items-center gap-3 p-3 rounded-lg transition ${
                  darkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'
                }`}
              >
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p>
                    <span className="text-purple-400">
                      {goal.completed ? 'Completed' : 'Pending'}
                    </span>
                    : {goal.text}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {goal.time || 'No time set'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              No recent activity yet. Start by adding some goals! 🎯
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;