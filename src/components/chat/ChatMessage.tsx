import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { motion } from "framer-motion";
import { marked } from 'marked';

interface ChatMessageProps {
  content: string;
  role: 'assistant' | 'user';
  isLatest?: boolean;
}

export const ChatMessage = ({ content, role, isLatest }: ChatMessageProps) => {
  const isBot = role === 'assistant';

  marked.setOptions({
    gfm: true,
    breaks: true
  });

  const formattedContent = marked(content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-3 p-4 rounded-lg backdrop-blur-sm transition-all duration-300",
        isBot ? 
          "bg-gray-800/40 hover:bg-gray-800/50 border border-gray-700/40" : 
          "bg-purple-900/10 hover:bg-purple-900/20 border border-purple-500/10"
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
        isBot ? 
          "bg-gradient-to-br from-blue-500/10 to-blue-600/10 text-blue-400 ring-1 ring-blue-500/20" : 
          "bg-gradient-to-br from-purple-500/10 to-purple-600/10 text-purple-400 ring-1 ring-purple-500/20"
      )}>
        {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>
      <div className="flex-1 space-y-1 min-w-0">
        <div className={cn(
          "text-xs font-medium",
          isBot ? "text-blue-200" : "text-purple-200"
        )}>
          {isBot ? "Asistente IA" : "Tú"}
        </div>
        <div 
          className="text-gray-300 prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-gray-800/50 prose-pre:border prose-pre:border-gray-700/50 prose-pre:rounded-lg break-words"
          dangerouslySetInnerHTML={{ __html: formattedContent }}
        />
      </div>
    </motion.div>
  );
};