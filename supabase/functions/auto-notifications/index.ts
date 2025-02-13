import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Iniciando proceso de notificaciones automáticas');

    // 1. Notificaciones de cursos próximos a lanzarse (7 días de anticipación)
    const { data: upcomingCourses, error: coursesError } = await supabase
      .from('courses')
      .select('id, title, launch_date')
      .gte('launch_date', new Date().toISOString())
      .lte('launch_date', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());

    if (coursesError) {
      console.error('Error al obtener cursos próximos:', coursesError);
      throw coursesError;
    }

    // Obtener todos los usuarios activos
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id')
      .eq('is_subscribed', true);

    if (usersError) {
      console.error('Error al obtener usuarios:', usersError);
      throw usersError;
    }

    const notifications = [];

    // Crear notificaciones de lanzamiento para cada curso próximo
    for (const course of upcomingCourses || []) {
      console.log(`Procesando notificaciones para curso: ${course.title}`);
      for (const user of users || []) {
        notifications.push({
          user_id: user.id,
          title: '¡Nuevo curso próximamente!',
          message: `El curso "${course.title}" estará disponible pronto. ¡No te lo pierdas!`,
          type: 'course_launch',
          read: false
        });
      }
    }

    // 2. Verificar cursos incompletos (sin actividad en los últimos 7 días)
    const { data: incompleteCourses, error: incompleteError } = await supabase
      .from('user_courses')
      .select(`
        user_id,
        courses (
          title
        )
      `)
      .lt('progress', 100)
      .lt('last_accessed', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (incompleteError) {
      console.error('Error al obtener cursos incompletos:', incompleteError);
      throw incompleteError;
    }

    // Crear notificaciones de recordatorio para cursos incompletos
    for (const course of incompleteCourses || []) {
      notifications.push({
        user_id: course.user_id,
        title: '¡Continúa tu aprendizaje!',
        message: `No olvides continuar con tu curso "${course.courses.title}". ¡Te estamos esperando!`,
        type: 'course_reminder',
        read: false
      });
    }

    // 3. Verificar usuarios sin suscripción
    const { data: nonSubscribers, error: subError } = await supabase
      .from('profiles')
      .select('id')
      .eq('is_subscribed', false);

    if (subError) {
      console.error('Error al obtener usuarios sin suscripción:', subError);
      throw subError;
    }

    // Crear notificaciones de sugerencia de suscripción
    for (const user of nonSubscribers || []) {
      notifications.push({
        user_id: user.id,
        title: '¡Descubre todos nuestros cursos!',
        message: 'Suscríbete para acceder a todo nuestro contenido premium y acelera tu aprendizaje.',
        type: 'subscription_suggestion',
        read: false
      });
    }

    // Insertar todas las notificaciones
    if (notifications.length > 0) {
      console.log(`Creando ${notifications.length} notificaciones...`);
      const { error: insertError } = await supabase
        .from('notifications')
        .insert(notifications);

      if (insertError) {
        console.error('Error al insertar notificaciones:', insertError);
        throw insertError;
      }
    }

    console.log(`Se crearon exitosamente ${notifications.length} notificaciones`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        notificationsCreated: notifications.length,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error en auto-notifications:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});