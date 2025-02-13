import { createClient } from '@supabase/supabase-js';

// Configuración del cliente Supabase para el proyecto original
const sourceSupabase = createClient(
  'https://upcfokdeubxwjiibapnc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwY2Zva2RldWJ4d2ppaWJhcG5jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTIyOTIyNywiZXhwIjoyMDU0ODA1MjI3fQ.exdi1BxxbIWBVqpFLHMttrlvebx0r1dPbTNCsBiCc0c'
);

// Configuración del cliente Supabase para el nuevo proyecto
const targetSupabase = createClient(
  'https://afjjqienulzsdwlfysex.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmampxaWVudWx6c2R3bGZ5c2V4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTIyOTIyNywiZXhwIjoyMDU0ODA1MjI3fQ.exdi1BxxbIWBVqpFLHMttrlvebx0r1dPbTNCsBiCc0c'
);

// Lista de tablas a migrar en orden de dependencias
const tables = [
  // 1. Tablas base sin dependencias
  'profiles',
  'course_categories',
  'course_tags',
  'instructors',
  'subscription_plans',
  
  // 2. Tablas con dependencias simples
  'courses',
  'course_category_relations',
  'course_tag_relations',
  'course_sessions',
  
  // 3. Tablas con múltiples dependencias
  'user_courses',
  'study_sessions',
  'course_evaluations',
  'user_evaluation_responses',
  
  // 4. Tablas de interacción
  'chat_conversations',
  'chat_messages',
  'session_comments',
  'video_events',
  'video_bookmarks',
  'video_notes',
  
  // 5. Tablas de sistema
  'notifications',
  'payments',
  'subscriptions',
  'certificates',
  'site_settings'
];

async function migrateTable(tableName) {
  try {
    console.log(`Migrando tabla: ${tableName}`);
    
    // Obtener datos de la tabla original
    const { data, error: sourceError } = await sourceSupabase
      .from(tableName)
      .select('*');
      
    if (sourceError) {
      throw new Error(`Error al leer ${tableName}: ${sourceError.message}`);
    }
    
    if (!data || data.length === 0) {
      console.log(`No hay datos para migrar en ${tableName}`);
      return;
    }
    
    // Insertar datos en la nueva tabla
    const { error: targetError } = await targetSupabase
      .from(tableName)
      .insert(data);
      
    if (targetError) {
      throw new Error(`Error al insertar en ${tableName}: ${targetError.message}`);
    }
    
    console.log(`✅ Migración completada para ${tableName}: ${data.length} registros`);
  } catch (error) {
    console.error(`❌ Error en la migración de ${tableName}:`, error.message);
  }
}

async function migrateAll() {
  console.log('Iniciando migración de datos...');
  
  for (const table of tables) {
    await migrateTable(table);
  }
  
  console.log('Migración completada');
}

// Ejecutar la migración
migrateAll();
