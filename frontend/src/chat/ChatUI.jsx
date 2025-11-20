import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ChatMessage from "./ChatMessage";
import { sendChatMessage } from "../components/api/chat";
import { Send } from "lucide-react";

export default function ChatUI() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Hey! I'm your Cosmic AI assistant. What can I help you accomplish?" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Auto scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;
    setInput("");

    try {
      const res = await sendChatMessage(currentInput);
      const aiMessage = { role: "assistant", content: res.content };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Error: Unable to connect to AI service.",
        },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">

      {/* Header */}
      <div className="px-5 py-4 bg-white border-b shadow-sm flex items-center">
        <h2 className="font-semibold text-lg">🤖 AI Assistant</h2>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-5 bg-gray-50">
        {messages.map((msg, index) => (
          <ChatMessage key={index} role={msg.role} content={msg.content} />
        ))}

        <div ref={messagesEndRef}></div>
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t bg-white flex items-center gap-3">
        <input
          className="flex-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Type your message..."
          value={input}
          onKeyDown={handleKeyPress}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Send size={18} />
          Send
        </button>
      </div>
    </div>
  );
}
