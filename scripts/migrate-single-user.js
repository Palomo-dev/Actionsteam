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

const userId = '7525087e-d98c-4d6b-ba63-bb694a2e4b37';

async function migrateUser() {
  try {
    console.log('Obteniendo perfil del usuario...');
    
    // Obtener perfil del proyecto original
    const { data: profile, error: profileError } = await sourceSupabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      throw new Error(`Error al leer perfil: ${profileError.message}`);
    }

    console.log('Perfil encontrado:', profile);

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
        role: profile?.role || 'student',
        is_subscribed: profile?.is_subscribed || false,
        created_at: profile?.created_at || '2025-02-11T01:31:44.895Z',
        updated_at: profile?.updated_at || '2025-02-11T03:13:19.613Z'
      });

    if (createProfileError) {
      throw new Error(`Error al crear perfil: ${createProfileError.message}`);
    }

    console.log('✅ Usuario y perfil migrados exitosamente');
  } catch (error) {
    console.error('❌ Error en la migración:', error.message);
  }
}

// Ejecutar la migración
migrateUser();
