import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChatList } from "@/components/chat/ChatList";
import { ChatInput } from "@/components/chat/ChatInput";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
}

interface UserCourseWithDetails {
  course_id: string;
  courses: Course;
}

const ChatIA = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const user = useUser();
  const { toast } = useToast();

  const { data: userCourses } = useQuery<UserCourseWithDetails[]>({
    queryKey: ['user-courses'],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_courses')
        .select(`
          course_id,
          courses (
            id,
            title,
            description,
            level
          )
        `)
        .eq('user_id', user?.id);

      if (error) throw error;
      
      return (data as any[]).map(item => ({
        course_id: item.course_id,
        courses: item.courses
      }));
    },
    enabled: !!user,
  });

  useEffect(() => {
    const loadConversation = async () => {
      if (!user) return;

      try {
        const { data: existingConversation } = await supabase
          .from('chat_conversations')
          .select('id')
          .eq('user_id', user.id)
          .is('course_id', null)
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
              title: 'Chat General de IA'
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
          description: "No se pudo cargar la conversación",
          variant: "destructive"
        });
      }
    };

    loadConversation();
  }, [user, toast]);

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

      // Verificar que userCourses existe y tiene elementos antes de mapear
      const coursesContext = userCourses?.filter(uc => uc.courses).map(uc => ({
        title: uc.courses.title,
        description: uc.courses.description,
        level: uc.courses.level
      })) || [];

      const { data: aiResponse, error } = await supabase.functions.invoke('chat', {
        body: {
          message: content,
          courses: coursesContext
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
        description: "No se pudo enviar el mensaje",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
        Chat con IA
      </h1>

      <Card className="p-6 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 border-purple-500/30">
        <div className="flex flex-col h-[600px]">
          <ChatList messages={messages} />
          <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
        </div>
      </Card>
    </div>
  );
};

export default ChatIA;