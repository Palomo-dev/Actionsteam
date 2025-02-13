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

// Función para normalizar los roles
function normalizeRole(role) {
  if (!role) return 'student';
  
  const roleMap = {
    'admin': 'admin',
    'administrator': 'admin',
    'instructor': 'instructor',
    'teacher': 'instructor',
    'student': 'student',
    'user': 'student',
    'client': 'student'
  };
  
  return roleMap[role.toLowerCase()] || 'student';
}

async function migrateProfiles() {
  try {
    console.log('Obteniendo usuarios y perfiles del proyecto original...');
    
    // Obtener usuarios de auth.users del proyecto original
    const { data: sourceUsers, error: sourceUsersError } = await sourceSupabase
      .from('auth.users')
      .select('*');
      
    if (sourceUsersError) {
      throw new Error(`Error al leer usuarios: ${sourceUsersError.message}`);
    }

    // Obtener perfiles del proyecto original
    const { data: sourceProfiles, error: sourceProfilesError } = await sourceSupabase
      .from('profiles')
      .select('*');
      
    if (sourceProfilesError) {
      throw new Error(`Error al leer perfiles: ${sourceProfilesError.message}`);
    }

    console.log(`Encontrados ${sourceUsers?.length || 0} usuarios y ${sourceProfiles?.length || 0} perfiles`);

    // Crear usuarios en el nuevo proyecto
    for (const user of sourceUsers || []) {
      try {
        const { data: newUser, error: createUserError } = await targetSupabase.auth.admin.createUser({
          email: user.email,
          email_confirmed: true,
          password: 'temporal123', // Contraseña temporal que el usuario deberá cambiar
          user_metadata: user.raw_user_meta_data
        });

        if (createUserError) {
          console.error(`Error al crear usuario ${user.email}:`, createUserError.message);
          continue;
        }

        // Buscar el perfil correspondiente
        const profile = sourceProfiles?.find(p => p.id === user.id);
        if (profile) {
          const { error: createProfileError } = await targetSupabase
            .from('profiles')
            .upsert({
              ...profile,
              role: normalizeRole(profile.role),
              created_at: profile.created_at || new Date().toISOString(),
              updated_at: profile.updated_at || new Date().toISOString()
            });

          if (createProfileError) {
            console.error(`Error al crear perfil para ${user.email}:`, createProfileError.message);
          } else {
            console.log(`✅ Usuario y perfil migrados: ${user.email}`);
          }
        }
      } catch (error) {
        console.error(`Error al procesar usuario ${user.email}:`, error.message);
      }
    }

    console.log('Migración de usuarios y perfiles completada');
  } catch (error) {
    console.error('❌ Error en la migración:', error.message);
  }
}

// Ejecutar la migración
migrateProfiles();
