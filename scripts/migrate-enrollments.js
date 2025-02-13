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

async function migrateEnrollments() {
  try {
    console.log('Migrando inscripciones a cursos...');
    
    // Obtener inscripciones del proyecto original
    const { data: enrollments, error: enrollmentsError } = await sourceSupabase
      .from('user_courses')
      .select('*');
      
    if (enrollmentsError) {
      throw new Error(`Error al leer inscripciones: ${enrollmentsError.message}`);
    }

    if (!enrollments || enrollments.length === 0) {
      console.log('No hay inscripciones para migrar');
    } else {
      console.log(`Encontradas ${enrollments.length} inscripciones`);

      // Migrar inscripciones en lotes
      const batchSize = 10;
      for (let i = 0; i < enrollments.length; i += batchSize) {
        const batch = enrollments.slice(i, i + batchSize).map(enrollment => ({
          ...enrollment,
          created_at: enrollment.created_at || new Date().toISOString(),
          updated_at: enrollment.updated_at || new Date().toISOString()
        }));

        const { error: insertError } = await targetSupabase
          .from('user_courses')
          .upsert(batch, { 
            onConflict: 'id',
            ignoreDuplicates: true 
          });

        if (insertError) {
          throw new Error(`Error al insertar lote de inscripciones: ${insertError.message}`);
        }

        console.log(`✅ Migrado lote ${Math.floor(i/batchSize) + 1} de ${Math.ceil(enrollments.length/batchSize)}`);
      }
    }

    // Migrar sesiones de estudio
    console.log('\nMigrando sesiones de estudio...');
    
    const { data: studySessions, error: studySessionsError } = await sourceSupabase
      .from('study_sessions')
      .select('*');
      
    if (studySessionsError) {
      throw new Error(`Error al leer sesiones de estudio: ${studySessionsError.message}`);
    }

    if (!studySessions || studySessions.length === 0) {
      console.log('No hay sesiones de estudio para migrar');
    } else {
      console.log(`Encontradas ${studySessions.length} sesiones de estudio`);

      // Migrar sesiones de estudio en lotes
      const batchSize = 20;
      for (let i = 0; i < studySessions.length; i += batchSize) {
        const batch = studySessions.slice(i, i + batchSize).map(session => ({
          ...session,
          created_at: session.created_at || new Date().toISOString()
        }));

        const { error: insertError } = await targetSupabase
          .from('study_sessions')
          .upsert(batch, { 
            onConflict: 'id',
            ignoreDuplicates: true 
          });

        if (insertError) {
          throw new Error(`Error al insertar lote de sesiones de estudio: ${insertError.message}`);
        }

        console.log(`✅ Migrado lote ${Math.floor(i/batchSize) + 1} de ${Math.ceil(studySessions.length/batchSize)}`);
      }
    }

    console.log('\n✅ Migración de inscripciones y sesiones de estudio completada');
  } catch (error) {
    console.error('❌ Error en la migración:', error.message);
  }
}

// Ejecutar la migración
migrateEnrollments();
