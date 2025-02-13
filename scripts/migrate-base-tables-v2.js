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

// Lista de tablas base (sin dependencias)
const baseTables = [
  'profiles',
  'instructors',
  'subscription_plans'  // course_categories y course_tags ya fueron migradas
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

    // Procesar los datos según la tabla
    let processedData = data;
    if (tableName === 'profiles') {
      processedData = data.map(profile => ({
        ...profile,
        role: normalizeRole(profile.role),
        created_at: profile.created_at || new Date().toISOString(),
        updated_at: profile.updated_at || new Date().toISOString()
      }));
    } else {
      // Asegurar que todas las tablas tengan created_at y updated_at
      processedData = data.map(item => ({
        ...item,
        created_at: item.created_at || new Date().toISOString(),
        updated_at: item.updated_at || new Date().toISOString()
      }));
    }
    
    // Insertar datos en lotes de 50 para evitar límites de tamaño
    const batchSize = 50;
    for (let i = 0; i < processedData.length; i += batchSize) {
      const batch = processedData.slice(i, i + batchSize);
      const { error: targetError } = await targetSupabase
        .from(tableName)
        .upsert(batch, { 
          onConflict: 'id',
          ignoreDuplicates: true 
        });
        
      if (targetError) {
        throw new Error(`Error al insertar en ${tableName}: ${targetError.message}`);
      }
      
      console.log(`  Migrado lote ${i/batchSize + 1} de ${Math.ceil(processedData.length/batchSize)}`);
    }
    
    console.log(`✅ Migración completada para ${tableName}: ${processedData.length} registros`);
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
