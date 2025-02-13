import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal } from "lucide-react";
import { useState, KeyboardEvent } from "react";

export interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  courseId?: string; // Made optional with ?
}

export const ChatInput = ({ onSend, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-2 items-end bg-gray-900/50 p-3 rounded-lg border border-gray-800 backdrop-blur-sm">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe tu mensaje aquí..."
        className="resize-none bg-transparent border-gray-800 focus:ring-purple-500/30 min-h-[50px] max-h-[100px]"
        rows={1}
      />
      <Button
        onClick={handleSend}
        disabled={!message.trim() || isLoading}
        size="icon"
        className="shrink-0 bg-purple-500 hover:bg-purple-600 transition-colors h-[50px] w-[50px] rounded-lg"
      >
        <SendHorizontal className="w-5 h-5" />
      </Button>
    </div>
  );
};