# Variables de conexión
$TARGET_DB_HOST = "db.afjjqienulzsdwlfysex.supabase.co"
$TARGET_DB_PORT = "5432"
$TARGET_DB_NAME = "postgres"
$TARGET_DB_USER = "postgres"
$TARGET_DB_PASSWORD = "S1st3m4s.2025"

Write-Host "Restaurando base de datos desde backup.sql..."

# Restaurar desde el backup
docker run --rm -v ${PWD}/supabase/migrations:/migrations postgres:15 psql `
    -h $TARGET_DB_HOST `
    -p $TARGET_DB_PORT `
    -U $TARGET_DB_USER `
    -d $TARGET_DB_NAME `
    -f /migrations/backup.sql `
    -W

Write-Host "¡Restauración completada!"
