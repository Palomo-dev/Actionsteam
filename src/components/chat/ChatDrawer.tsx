import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-mobile";

export interface ChatDrawerProps {
  courseId: string;
  courseTitle: string;
}

export const ChatDrawer = ({ courseId, courseTitle }: ChatDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = useUser();
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadConversation = async () => {
      if (!user) return;

      try {
        const { data: existingConversation } = await supabase
          .from('chat_conversations')
          .select('id')
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .maybeSingle();

        if (existingConversation) {
          setConversationId(existingConversation.id);
          const { data: messages } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('conversation_id', existingConversation.id)
            .order('created_at', { ascending: true });

          if (messages) {
            setMessages(messages);
          }
        } else {
          const { data: newConversation, error } = await supabase
            .from('chat_conversations')
            .insert({
              user_id: user.id,
              course_id: courseId,
              title: `Chat about ${courseTitle}`
            })
            .select()
            .single();

          if (error) throw error;
          if (newConversation) {
            setConversationId(newConversation.id);
          }
        }
      } catch (error) {
        console.error('Error loading conversation:', error);
        toast({
          title: "Error",
          description: "Could not load the conversation",
          variant: "destructive"
        });
      }
    };

    if (isOpen) {
      loadConversation();
    }
  }, [isOpen, user, courseId, courseTitle, toast]);

  const handleSendMessage = async (content: string) => {
    if (!user || !conversationId) return;

    try {
      setIsLoading(true);
      const { data: userMessage, error: userMessageError } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          content,
          role: 'user'
        })
        .select()
        .single();

      if (userMessageError) throw userMessageError;
      if (userMessage) {
        setMessages(prev => [...prev, userMessage]);
      }

      const { data: aiResponse, error } = await supabase.functions.invoke('chat', {
        body: {
          message: content,
          courseId,
          conversationId
        }
      });

      if (error) throw error;

      const { data: aiMessage, error: aiMessageError } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          content: aiResponse.message,
          role: 'assistant'
        })
        .select()
        .single();

      if (aiMessageError) throw aiMessageError;
      if (aiMessage) {
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed ${isMobile ? 'bottom-20 left-4' : 'bottom-4 right-4'} z-40`}>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button 
            size="lg"
            className="rounded-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg flex items-center gap-2 px-6 transition-all duration-300"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="font-medium">Chat IA</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[85vh] bg-gradient-to-b from-gray-900 to-gray-950 border-t border-purple-500/20">
          <div className="flex flex-col h-full max-h-[85vh]">
            <DrawerHeader className="border-b border-gray-800 pb-4 flex-shrink-0">
              <DrawerTitle className="text-center text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                Asistente IA del Curso
              </DrawerTitle>
            </DrawerHeader>
            
            <div className="flex-1 overflow-hidden flex flex-col p-4">
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
                <div ref={messagesEndRef} />
              </div>
              
              <div className="flex-shrink-0 pt-2">
                <ChatInput 
                  onSend={handleSendMessage} 
                  isLoading={isLoading} 
                  courseId={courseId}
                />
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
