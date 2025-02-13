import { createClient } from '@supabase/supabase-js';

// Configuración del proyecto original
const SOURCE_URL = 'https://upcfokdeubxwjiibapnc.supabase.co';
const SOURCE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwY2Zva2RldWJ4d2ppaWJhcG5jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTU2ODk3MCwiZXhwIjoyMDUxMTQ0OTcwfQ.0eGJF5FcOukLHbpXeZRWc4go0Y3hS7z1Uzbxd1rtoBY';

// Configuración del nuevo proyecto
const TARGET_URL = 'https://afjjqienulzsdwlfysex.supabase.co';
const TARGET_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmampxaWVudWx6c2R3bGZ5c2V4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTIyOTIyNywiZXhwIjoyMDU0ODA1MjI3fQ.exdi1BxxbIWBVqpFLHMttrlvebx0r1dPbTNCsBiCc0c';

// Crear clientes de Supabase con claves de servicio
const sourceClient = createClient(SOURCE_URL, SOURCE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const targetClient = createClient(TARGET_URL, TARGET_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// Lista de tablas a migrar en orden específico para manejar dependencias
const tables = [
    // Primero las tablas base
    'profiles',
    'course_categories',
    'course_tags',
    'subscription_plans',
    
    // Luego las tablas principales
    'courses',
    'course_sessions',
    
    // Tablas relacionadas con usuarios y cursos
    'user_courses',
    'study_sessions',
    'course_evaluations',
    'course_ratings',
    'user_evaluation_responses',
    'session_comments',
    
    // Sistema de video
    'video_metrics',
    'detailed_video_metrics',
    'video_events',
    'video_bookmarks',
    'video_notes',
    
    // Sistema de logros y certificados
    'achievements',
    'user_achievements',
    'certificates',
    
    // Sistema de pagos y suscripciones
    'exchange_rates',
    'payments',
    'subscriptions',
    
    // Sistema de chat y notificaciones
    'chat_conversations',
    'chat_messages',
    'notifications',
    
    // Permisos y configuraciones
    'admin_permissions'
];

async function getTableSchema(client, tableName) {
    try {
        const { data, error } = await client.rpc('get_table_schema', { table_name: tableName });
        if (error) throw error;
        return data;
    } catch (error) {
        console.error(`Error obteniendo esquema de ${tableName}:`, error.message);
        return null;
    }
}

async function migrateTable(tableName) {
    console.log(`\nMigrando tabla: ${tableName}`);
    
    try {
        // Obtener datos de la tabla original
        const { data, error } = await sourceClient
            .from(tableName)
            .select('*');
            
        if (error) {
            console.error(`Error obteniendo datos de ${tableName}:`, error.message);
            return;
        }
        
        if (data && data.length > 0) {
            console.log(`Encontrados ${data.length} registros para migrar en ${tableName}`);
            
            // Migrar en chunks para evitar límites de tamaño
            for (let i = 0; i < data.length; i += 50) {
                const chunk = data.slice(i, i + 50);
                const { error: insertError } = await targetClient
                    .from(tableName)
                    .upsert(chunk, {
                        onConflict: 'id'
                    });
                    
                if (insertError) {
                    console.error(`Error insertando chunk en ${tableName}:`, insertError.message);
                    continue;
                }
                
                console.log(`✓ Migrados ${i + chunk.length} de ${data.length} registros en ${tableName}`);
            }
            
            console.log(`✓ Migración completa de ${tableName}`);
        } else {
            console.log(`- Tabla ${tableName} está vacía`);
        }
    } catch (error) {
        console.error(`Error migrando ${tableName}:`, error.message);
    }
}

async function migrateAll() {
    console.log('Iniciando migración...\n');
    
    for (const table of tables) {
        await migrateTable(table);
    }
    
    console.log('\n¡Migración completada!');
}

// Ejecutar la migración
migrateAll();
