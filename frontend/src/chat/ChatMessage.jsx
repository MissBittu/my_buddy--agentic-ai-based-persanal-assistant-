import { motion } from "framer-motion";

export default function ChatMessage({ role, content }) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`w-full flex ${isUser ? "justify-end" : "justify-start"} mb-3`}
    >
      <div
        className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-md 
          ${isUser ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"}
        `}
      >
        {content}
      </div>
    </motion.div>
  );
}
