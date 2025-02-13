import { createClient } from '@supabase/supabase-js';

// Configuración del cliente Supabase para el proyecto original
const sourceSupabase = createClient(
  'https://upcfokdeubxwjiibapnc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwY2Zva2RldWJ4d2ppaWJhcG5jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTU2ODk3MCwiZXhwIjoyMDUxMTQ0OTcwfQ.0eGJF5FcOukLHbpXeZRWc4go0Y3hS7z1Uzbxd1rtoBY'
);

async function verifyEnrollments() {
  try {
    console.log('Verificando inscripciones a cursos...');
    
    // Obtener inscripciones del proyecto original
    const { data: enrollments, error: enrollmentsError } = await sourceSupabase
      .from('user_courses')
      .select(`
        *,
        profiles (id, email),
        courses (id, title)
      `);
      
    if (enrollmentsError) {
      throw new Error(`Error al leer inscripciones: ${enrollmentsError.message}`);
    }

    if (!enrollments || enrollments.length === 0) {
      console.log('No hay inscripciones para verificar');
      return;
    }

    console.log('\nDetalles de inscripciones encontradas:');
    enrollments.forEach((enrollment, index) => {
      console.log(`\nInscripción ${index + 1}:`);
      console.log('ID:', enrollment.id);
      console.log('Usuario ID:', enrollment.user_id);
      console.log('Usuario Email:', enrollment.profiles?.email);
      console.log('Curso ID:', enrollment.course_id);
      console.log('Curso Título:', enrollment.courses?.title);
      console.log('Estado:', enrollment.status);
      console.log('Creado:', enrollment.created_at);
    });

  } catch (error) {
    console.error('❌ Error en la verificación:', error.message);
  }
}

// Ejecutar la verificación
verifyEnrollments();
