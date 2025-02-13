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

// Función para obtener el esquema de una tabla
async function getTableSchema(client, tableName) {
    const { data, error } = await client.rpc('get_schema_definition', {
        table_name: tableName
    });
    
    if (error) {
        console.error(`Error obteniendo esquema de ${tableName}:`, error.message);
        return null;
    }
    
    return data;
}

// Función para obtener todas las tablas
async function getAllTables(client) {
    const { data, error } = await client.rpc('get_all_tables');
    
    if (error) {
        console.error('Error obteniendo lista de tablas:', error.message);
        return [];
    }
    
    return data;
}

// Función para aplicar el esquema
async function applySchema(client, schema) {
    const { error } = await client.rpc('apply_schema', {
        schema_definition: schema
    });
    
    if (error) {
        console.error('Error aplicando esquema:', error.message);
        return false;
    }
    
    return true;
}

async function migrateSchema() {
    console.log('Iniciando migración de esquema...');
    
    // Obtener lista de tablas
    const tables = await getAllTables(sourceClient);
    
    if (!tables || tables.length === 0) {
        console.error('No se pudieron obtener las tablas');
        return;
    }
    
    console.log(`Encontradas ${tables.length} tablas para migrar`);
    
    // Migrar cada tabla
    for (const table of tables) {
        console.log(`\nMigrando esquema de tabla: ${table}`);
        
        // Obtener esquema
        const schema = await getTableSchema(sourceClient, table);
        
        if (!schema) {
            console.error(`No se pudo obtener el esquema de ${table}`);
            continue;
        }
        
        // Aplicar esquema
        const success = await applySchema(targetClient, schema);
        
        if (success) {
            console.log(`✓ Esquema de ${table} migrado correctamente`);
        } else {
            console.error(`× Error migrando esquema de ${table}`);
        }
    }
    
    console.log('\n¡Migración de esquema completada!');
}

// Ejecutar la migración de esquema
migrateSchema();
