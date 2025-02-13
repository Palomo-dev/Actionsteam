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

// Lista de tablas base (sin dependencias)
const baseTables = [
  'profiles',
  'course_categories',
  'course_tags',
  'instructors',
  'subscription_plans'
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

    // Para profiles, asegurarnos que el role sea válido
    if (tableName === 'profiles') {
      data.forEach(profile => {
        // Convertir roles antiguos al nuevo formato
        if (!profile.role || !['student', 'instructor', 'admin'].includes(profile.role)) {
          profile.role = 'student';
        }
      });
    }
    
    // Insertar datos en lotes de 50 para evitar límites de tamaño
    const batchSize = 50;
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      const { error: targetError } = await targetSupabase
        .from(tableName)
        .upsert(batch, { 
          onConflict: 'id',
          ignoreDuplicates: true 
        });
        
      if (targetError) {
        throw new Error(`Error al insertar en ${tableName}: ${targetError.message}`);
      }
    }
    
    console.log(`✅ Migración completada para ${tableName}: ${data.length} registros`);
  } catch (error) {
    console.error(`❌ Error en la migración de ${tableName}:`, error.message);
  }
}

async function migrateBaseTables() {
  console.log('Iniciando migración de tablas base...');
  
  for (const table of baseTables) {
    await migrateTable(table);
  }
  
  console.log('Migración de tablas base completada');
}

// Ejecutar la migración
migrateBaseTables();
