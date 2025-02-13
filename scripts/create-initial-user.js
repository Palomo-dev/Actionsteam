import { createClient } from '@supabase/supabase-js';

// Configuración del cliente Supabase para el nuevo proyecto
const targetSupabase = createClient(
  'https://afjjqienulzsdwlfysex.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmampxaWVudWx6c2R3bGZ5c2V4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTIyOTIyNywiZXhwIjoyMDU0ODA1MjI3fQ.exdi1BxxbIWBVqpFLHMttrlvebx0r1dPbTNCsBiCc0c'
);

const userId = '7525087e-d98c-4d6b-ba63-bb694a2e4b37';

async function createInitialUser() {
  try {
    // Crear usuario en el nuevo proyecto
    const { data: newUser, error: createUserError } = await targetSupabase.auth.admin.createUser({
      email: 'imagine.gallego@gmail.com',
      email_confirmed: true,
      password: 'temporal123', // Contraseña temporal
      user_metadata: {
        sub: userId,
        email: 'imagine.gallego@gmail.com',
        first_name: 'Juan Camilo',
        email_verified: true,
        phone_verified: false
      }
    });

    if (createUserError) {
      throw new Error(`Error al crear usuario: ${createUserError.message}`);
    }

    console.log('Usuario creado en auth.users');

    // Crear perfil en el nuevo proyecto
    const { error: createProfileError } = await targetSupabase
      .from('profiles')
      .upsert({
        id: userId,
        email: 'imagine.gallego@gmail.com',
        first_name: 'Juan Camilo',
        role: 'admin', // Asignando rol de admin al primer usuario
        is_subscribed: false,
        created_at: '2025-02-11T01:31:44.895Z',
        updated_at: '2025-02-11T03:13:19.613Z'
      });

    if (createProfileError) {
      throw new Error(`Error al crear perfil: ${createProfileError.message}`);
    }

    console.log('✅ Usuario y perfil creados exitosamente');
  } catch (error) {
    console.error('❌ Error en la creación:', error.message);
  }
}

// Ejecutar la creación
createInitialUser();
