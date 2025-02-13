# Variables de conexión
$SOURCE_DB_HOST = "db.upcfokdeubxwjiibapnc.supabase.co"
$SOURCE_DB_PORT = "5432"
$SOURCE_DB_NAME = "postgres"
$SOURCE_DB_USER = "postgres"
$SOURCE_DB_PASSWORD = "S1st3m4s.2025"

# Crear directorio para el esquema si no existe
New-Item -ItemType Directory -Force -Path ".\schema"

# Exportar solo el esquema (sin datos)
docker run --rm -v ${PWD}/schema:/schema postgres:15 pg_dump `
    -h $SOURCE_DB_HOST `
    -p $SOURCE_DB_PORT `
    -U $SOURCE_DB_USER `
    -d $SOURCE_DB_NAME `
    --schema-only `
    --no-owner `
    --no-privileges `
    -f /schema/schema.sql `
    -W

Write-Host "Esquema exportado a ./schema/schema.sql"
