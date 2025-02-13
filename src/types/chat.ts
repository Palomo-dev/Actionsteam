export type ChatMessageType = {
  id: string;
  conversation_id: string;
  content: string;
  role: 'assistant' | 'user';
  created_at: string;
};

export type ChatConversationType = {
  id: string;
  user_id: string;
  course_id: string | null;
  title: string;
  created_at: string;
  updated_at: string;
};