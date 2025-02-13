import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WelcomeNotification {
  title: string;
  message: string;
  type: 'welcome';
}

const welcomeNotification: WelcomeNotification = {
  title: '¡Bienvenido a Imagine AI!',
  message: 'Estamos emocionados de tenerte aquí. Explora nuestros cursos y comienza tu viaje de aprendizaje con nosotros.',
  type: 'welcome'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get all users that don't have a welcome notification yet
    const { data: users, error: usersError } = await supabaseClient
      .from('profiles')
      .select('id, email')
      .not('notifications', 'cs', JSON.stringify([welcomeNotification]));

    if (usersError) throw usersError;

    console.log(`Found ${users?.length || 0} users without welcome notifications`);

    // Send welcome notifications to each user
    const notifications = users?.map(user => ({
      user_id: user.id,
      ...welcomeNotification
    })) || [];

    if (notifications.length > 0) {
      const { error: notificationError } = await supabaseClient
        .from('notifications')
        .insert(notifications);

      if (notificationError) throw notificationError;

      console.log(`Successfully sent ${notifications.length} welcome notifications`);
    }

    return new Response(
      JSON.stringify({ 
        message: `Welcome notifications sent to ${notifications.length} users` 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})