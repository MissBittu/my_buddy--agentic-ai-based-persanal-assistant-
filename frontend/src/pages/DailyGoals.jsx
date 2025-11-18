import React from 'react';
import { Send } from 'lucide-react';

const AIAssistant = ({ darkMode, cardClass, messages, input, setInput, sendMessage }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">AI Assistant 🤖</h2>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          Ask me anything or let me help you with your tasks!
        </p>
      </div>

      <div className={`${cardClass} border rounded-xl p-6 h-[600px] flex flex-col`}>
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-4 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-purple-600 text-white' 
                    : darkMode ? 'bg-gray-700' : 'bg-gray-200 text-gray-900'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className={`flex-1 px-4 py-3 ${cardClass} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
          <button
            onClick={sendMessage}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;