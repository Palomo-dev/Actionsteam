import { createClient } from '@supabase/supabase-js';

// Configuración del cliente Supabase para el proyecto original
const sourceSupabase = createClient(
  'https://upcfokdeubxwjiibapnc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwY2Zva2RldWJ4d2ppaWJhcG5jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTU2ODk3MCwiZXhwIjoyMDUxMTQ0OTcwfQ.0eGJF5FcOukLHbpXeZRWc4go0Y3hS7z1Uzbxd1rtoBY'
);

// Configuración del cliente Supabase para el nuevo proyecto
const targetSupabase = createClient(
  'https://afjjqienulzsdwlfysex.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmampxaWVudWx6c2R3bGZ5c2V4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTIyOTIyNywiZXhwIjoyMDU0ODA1MjI3fQ.exdi1BxxbIWBVqpFLHMttrlvebx0r1dPbTNCsBiCc0c'
);

// Mapeo de IDs antiguos a nuevos
const userIdMap = new Map();

async function createAndMapUsers() {
  try {
    console.log('Creando usuarios y mapeando IDs...');
    
    // Obtener inscripciones del proyecto original para saber qué usuarios necesitamos
    const { data: enrollments, error: enrollmentsError } = await sourceSupabase
      .from('user_courses')
      .select(`
        *,
        profiles (id, email, first_name)
      `);
      
    if (enrollmentsError) {
      throw new Error(`Error al leer inscripciones: ${enrollmentsError.message}`);
    }

    // Obtener usuarios únicos de las inscripciones
    const uniqueUsers = new Map();
    enrollments.forEach(enrollment => {
      if (enrollment.profiles) {
        uniqueUsers.set(enrollment.user_id, enrollment.profiles);
      }
    });

    console.log(`Encontrados ${uniqueUsers.size} usuarios únicos para migrar`);

    // Crear usuarios y mapear IDs
    for (const [oldId, profile] of uniqueUsers) {
      try {
        // Crear usuario en auth.users
        const { data: newUser, error: createError } = await targetSupabase.auth.admin.createUser({
          email: profile.email,
          email_confirmed: true,
          password: 'temporal123', // Contraseña temporal
          user_metadata: {
            first_name: profile.first_name
          }
        });

        if (createError) {
          if (createError.message.includes('already been registered')) {
            // Si el usuario ya existe, obtener su ID
            const { data: existingUser } = await targetSupabase
              .from('profiles')
              .select('id')
              .eq('email', profile.email)
              .single();
              
            if (existingUser) {
              userIdMap.set(oldId, existingUser.id);
              console.log(`Usuario existente mapeado: ${profile.email}`);
            }
          } else {
            console.error(`Error al crear usuario ${profile.email}:`, createError.message);
          }
          continue;
        }

        // Guardar el mapeo de IDs
        userIdMap.set(oldId, newUser.user.id);

        // Crear perfil
        const { error: profileError } = await targetSupabase
          .from('profiles')
          .upsert({
            id: newUser.user.id,
            email: profile.email,
            first_name: profile.first_name,
            role: 'student',
            is_subscribed: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error(`Error al crear perfil para ${profile.email}:`, profileError.message);
        } else {
          console.log(`✅ Usuario y perfil creados: ${profile.email}`);
        }
      } catch (error) {
        console.error(`Error al procesar usuario ${profile.email}:`, error.message);
      }
    }

    // Migrar inscripciones con los nuevos IDs
    console.log('\nMigrando inscripciones con los nuevos IDs...');
    
    for (const enrollment of enrollments) {
      const newUserId = userIdMap.get(enrollment.user_id);
      if (!newUserId) {
        console.error(`No se encontró mapeo para el usuario ${enrollment.user_id}`);
        continue;
      }

      const { error: enrollmentError } = await targetSupabase
        .from('user_courses')
        .upsert({
          ...enrollment,
          user_id: newUserId,
          created_at: enrollment.created_at || new Date().toISOString(),
          updated_at: enrollment.updated_at || new Date().toISOString()
        });

      if (enrollmentError) {
        console.error(`Error al migrar inscripción:`, enrollmentError.message);
      } else {
        console.log(`✅ Inscripción migrada para curso ${enrollment.course_id}`);
      }
    }

    console.log('\nProceso completado');
  } catch (error) {
    console.error('❌ Error en el proceso:', error.message);
  }
}

// Ejecutar el proceso
createAndMapUsers();
