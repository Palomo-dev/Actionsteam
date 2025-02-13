import { createClient } from '@supabase/supabase-js';

// Configuración del cliente Supabase para el nuevo proyecto
const targetSupabase = createClient(
  'https://afjjqienulzsdwlfysex.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmampxaWVudWx6c2R3bGZ5c2V4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTIyOTIyNywiZXhwIjoyMDU0ODA1MjI3fQ.exdi1BxxbIWBVqpFLHMttrlvebx0r1dPbTNCsBiCc0c'
);

const additionalUsers = [
  {
    id: 'aaad96d1-e172-411a-b1e5-f8d5cdc35f3b',
    email: 'gobuy.com.co@gmail.com',
    firstName: 'Gobuy User',
    created_at: '2025-01-04T06:39:54.97544+00:00'
  },
  {
    id: '0cf3fcee-d8c2-4902-930b-99401c81d31c',
    email: 'imagine.gallego@gmail.com',
    firstName: 'Juan Camilo',
    created_at: '2025-01-03T23:58:13.943573+00:00'
  }
];

async function createUsers() {
  try {
    console.log('Creando usuarios adicionales...');
    
    for (const user of additionalUsers) {
      try {
        // Crear usuario en auth.users
        const { data: newUser, error: createError } = await targetSupabase.auth.admin.createUser({
          email: user.email,
          email_confirmed: true,
          password: 'temporal123', // Contraseña temporal
          user_metadata: {
            first_name: user.firstName
          }
        });

        if (createError) {
          console.error(`Error al crear usuario ${user.email}:`, createError.message);
          continue;
        }

        // Crear perfil
        const { error: profileError } = await targetSupabase
          .from('profiles')
          .upsert({
            id: user.id,
            email: user.email,
            first_name: user.firstName,
            role: 'student',
            is_subscribed: false,
            created_at: user.created_at,
            updated_at: user.created_at
          });

        if (profileError) {
          console.error(`Error al crear perfil para ${user.email}:`, profileError.message);
        } else {
          console.log(`✅ Usuario y perfil creados: ${user.email}`);
        }
      } catch (error) {
        console.error(`Error al procesar usuario ${user.email}:`, error.message);
      }
    }

    console.log('Proceso completado');
  } catch (error) {
    console.error('❌ Error en el proceso:', error.message);
  }
}

// Ejecutar la creación de usuarios
createUsers();
