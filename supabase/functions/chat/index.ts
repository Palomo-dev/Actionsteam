import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, courseId, conversationId, courses } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let courseContext = '';
    
    if (courseId) {
      // Get course information
      const { data: course } = await supabase
        .from('courses')
        .select(`
          *,
          course_sessions (
            title,
            description
          )
        `)
        .eq('id', courseId)
        .single();

      if (course) {
        courseContext = `You are an AI teaching assistant for the course "${course.title}". 
                        The course description is: ${course.description}
                        You should help students understand the course content and answer their questions.`;
      }
    } else if (courses) {
      courseContext = `You are an AI teaching assistant. The user has access to the following courses:
                      ${courses.map((c: any) => `- ${c.title} (${c.level}): ${c.description}`).join('\n')}`;
    }

    // Get conversation history
    const { data: messages } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    // Prepare conversation history for OpenAI
    const conversationHistory = messages?.map(msg => ({
      role: msg.role,
      content: msg.content
    })) || [];

    // Prepare system message
    const systemMessage = {
      role: 'system',
      content: courseContext || 'You are a helpful AI teaching assistant that helps students learn about technology and programming.'
    };

    // Make request to OpenAI
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          systemMessage,
          ...conversationHistory,
          { role: 'user', content: message }
        ],
        temperature: 0.7,
      }),
    });

    const data = await openAIResponse.json();
    const aiMessage = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ message: aiMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      },
    );
  }
});