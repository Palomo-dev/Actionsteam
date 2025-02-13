import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { ChatMessage } from "./ChatMessage";

export interface ChatListProps {
  messages: any[];
  courseId?: string;
}

export const ChatList = ({ messages }: ChatListProps) => {
  return (
    <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2 min-h-0">
      {messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-gray-400 mt-8 p-8 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50"
        >
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-purple-400" />
          <p className="text-lg font-medium mb-2">¡Comienza una conversación!</p>
          <p className="text-sm text-gray-500">Pregunta sobre el contenido del curso.</p>
        </motion.div>
      )}
      {messages.map((message, index) => (
        <ChatMessage
          key={message.id}
          content={message.content}
          role={message.role}
          isLatest={index === messages.length - 1}
        />
      ))}
    </div>
  );
};