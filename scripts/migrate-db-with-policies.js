import { createClient } from '@supabase/supabase-js';

// Configuración del proyecto original
const SOURCE_URL = 'https://upcfokdeubxwjiibapnc.supabase.co';
const SOURCE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwY2Zva2RldWJ4d2ppaWJhcG5jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTU2ODk3MCwiZXhwIjoyMDUxMTQ0OTcwfQ.mPm3hH1SubBZPhXl0ie2B4EKyq990MQ2MTRVF8SAr54';

// Configuración del nuevo proyecto
const TARGET_URL = 'https://afjjqienulzsdwlfysex.supabase.co';
const TARGET_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmampxaWVudWx6c2R3bGZ5c2V4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTIyOTIyNywiZXhwIjoyMDU0ODA1MjI3fQ.lxuBnemIVO9Y8NQzkHnJKn4NVxwWhEmj7-vogGqky64';

// Crear clientes de Supabase
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

// Lista de tablas a migrar
const tables = [
    'profiles',
    'courses',
    'course_sessions',
    'user_courses',
    'study_sessions',
    'notifications',
    'achievements',
    'admin_permissions',
    'certificates',
    'chat_conversations',
    'chat_messages',
    'course_categories',
    'course_evaluations',
    'course_ratings',
    'course_tags',
    'detailed_video_metrics',
    'exchange_rates',
    'payments',
    'session_comments',
    'subscription_plans',
    'subscriptions',
    'user_achievements',
    'user_evaluation_responses',
    'video_bookmarks',
    'video_events',
    'video_metrics',
    'video_notes'
];

async function migrateTable(tableName) {
    console.log(`Migrando tabla: ${tableName}`);
    
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
            // Insertar datos en la nueva tabla
            for (let i = 0; i < data.length; i += 100) {
                const chunk = data.slice(i, i + 100);
                const { error: insertError } = await targetClient
                    .from(tableName)
                    .upsert(chunk);
                    
                if (insertError) {
                    console.error(`Error insertando en ${tableName}:`, insertError.message);
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
    console.log('Iniciando migración...');
    
    for (const table of tables) {
        await migrateTable(table);
    }
    
    console.log('Migración completada!');
}

// Ejecutar la migración
migrateAll();
