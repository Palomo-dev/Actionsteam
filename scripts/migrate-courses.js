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

async function migrateCourses() {
  try {
    console.log('Migrando cursos...');
    
    // Obtener cursos del proyecto original
    const { data: courses, error: coursesError } = await sourceSupabase
      .from('courses')
      .select('*');
      
    if (coursesError) {
      throw new Error(`Error al leer cursos: ${coursesError.message}`);
    }

    if (!courses || courses.length === 0) {
      console.log('No hay cursos para migrar');
      return;
    }

    console.log(`Encontrados ${courses.length} cursos`);

    // Migrar cursos en lotes
    const batchSize = 10;
    for (let i = 0; i < courses.length; i += batchSize) {
      const batch = courses.slice(i, i + batchSize).map(course => ({
        ...course,
        created_at: course.created_at || new Date().toISOString(),
        updated_at: course.updated_at || new Date().toISOString()
      }));

      const { error: insertError } = await targetSupabase
        .from('courses')
        .upsert(batch, { 
          onConflict: 'id',
          ignoreDuplicates: true 
        });

      if (insertError) {
        throw new Error(`Error al insertar lote de cursos: ${insertError.message}`);
      }

      console.log(`✅ Migrado lote ${Math.floor(i/batchSize) + 1} de ${Math.ceil(courses.length/batchSize)}`);
    }

    // Una vez migrados los cursos, migrar las sesiones
    console.log('\nMigrando sesiones de cursos...');
    
    const { data: sessions, error: sessionsError } = await sourceSupabase
      .from('course_sessions')
      .select('*');
      
    if (sessionsError) {
      throw new Error(`Error al leer sesiones: ${sessionsError.message}`);
    }

    if (!sessions || sessions.length === 0) {
      console.log('No hay sesiones para migrar');
      return;
    }

    console.log(`Encontradas ${sessions.length} sesiones`);

    // Migrar sesiones en lotes
    for (let i = 0; i < sessions.length; i += batchSize) {
      const batch = sessions.slice(i, i + batchSize).map(session => ({
        ...session,
        created_at: session.created_at || new Date().toISOString(),
        updated_at: session.updated_at || new Date().toISOString()
      }));

      const { error: insertError } = await targetSupabase
        .from('course_sessions')
        .upsert(batch, { 
          onConflict: 'id',
          ignoreDuplicates: true 
        });

      if (insertError) {
        throw new Error(`Error al insertar lote de sesiones: ${insertError.message}`);
      }

      console.log(`✅ Migrado lote ${Math.floor(i/batchSize) + 1} de ${Math.ceil(sessions.length/batchSize)}`);
    }

    console.log('\n✅ Migración de cursos y sesiones completada');
  } catch (error) {
    console.error('❌ Error en la migración:', error.message);
  }
}

// Ejecutar la migración
migrateCourses();
