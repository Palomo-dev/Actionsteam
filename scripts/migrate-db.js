import { createClient } from '@supabase/supabase-js';

// Configuración del proyecto original
const SOURCE_URL = 'https://upcfokdeubxwjiibapnc.supabase.co';
const SOURCE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwY2Zva2RldWJ4d2ppaWJhcG5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1Njg5NzAsImV4cCI6MjA1MTE0NDk3MH0.mPm3hH1SubBZPhXl0ie2B4EKyq990MQ2MTRVF8SAr54';

// Configuración del nuevo proyecto
const TARGET_URL = 'https://afjjqienulzsdwlfysex.supabase.co';
const TARGET_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmampxaWVudWx6c2R3bGZ5c2V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyMjkyMjcsImV4cCI6MjA1NDgwNTIyN30.lxuBnemIVO9Y8NQzkHnJKn4NVxwWhEmj7-vogGqky64';

// Crear clientes de Supabase
const sourceClient = createClient(SOURCE_URL, SOURCE_KEY);
const targetClient = createClient(TARGET_URL, TARGET_KEY);

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
            
        if (error) throw error;
        
        if (data && data.length > 0) {
            // Insertar datos en la nueva tabla
            const { error: insertError } = await targetClient
                .from(tableName)
                .upsert(data);
                
            if (insertError) throw insertError;
            
            console.log(`✓ Migrados ${data.length} registros de ${tableName}`);
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
