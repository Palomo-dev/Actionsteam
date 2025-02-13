# Crear directorio para backups si no existe
New-Item -ItemType Directory -Force -Path ".\backups"

# Variables de entorno
$ORIGINAL_DB_HOST = "db.upcfokdeubxwjiibapnc.supabase.co"
$NEW_DB_HOST = "db.afjjqienulzsdwlfysex.supabase.co"
$DB_PORT = "5432"
$DB_USER = "postgres"
$DB_NAME = "postgres"
$DB_PASSWORD = "S1st3m4s.2025"

Write-Host "Iniciando respaldo de la base de datos original..."

# Exportar la base de datos original usando Docker
docker run --rm -v ${PWD}/backups:/backups postgres:15 pg_dump `
    -h $ORIGINAL_DB_HOST `
    -p $DB_PORT `
    -U $DB_USER `
    -d $DB_NAME `
    --clean `
    --if-exists `
    --exclude-table-data 'storage.objects' `
    --exclude-schema 'pgbouncer' `
    -f /backups/full_backup.sql `
    -W

Write-Host "Respaldo completado. Iniciando restauración en el nuevo proyecto..."

# Restaurar en el nuevo proyecto usando Docker
docker run --rm -v ${PWD}/backups:/backups postgres:15 psql `
    -h $NEW_DB_HOST `
    -p $DB_PORT `
    -U $DB_USER `
    -d $DB_NAME `
    -f /backups/full_backup.sql `
    -W

Write-Host "¡Migración completada!"
