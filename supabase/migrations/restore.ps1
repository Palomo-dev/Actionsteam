# Configuración del proyecto original
$ORIGINAL_DB_HOST = "db.upcfokdeubxwjiibapnc.supabase.co"
$ORIGINAL_DB_NAME = "postgres"
$ORIGINAL_DB_PORT = "5432"
$ORIGINAL_DB_USER = "postgres"
$ORIGINAL_DB_PASSWORD = "S1st3m4s.2025"

# Configuración del nuevo proyecto
$NEW_DB_HOST = "db.afjjqienulzsdwlfysex.supabase.co"
$NEW_DB_NAME = "postgres"
$NEW_DB_PORT = "5432"
$NEW_DB_USER = "postgres"
$NEW_DB_PASSWORD = "S1st3m4s.2025"

# Exportar la base de datos original
Write-Host "Exportando base de datos original..."
$env:PGPASSWORD = $ORIGINAL_DB_PASSWORD
pg_dump -h $ORIGINAL_DB_HOST -p $ORIGINAL_DB_PORT -U $ORIGINAL_DB_USER -d $ORIGINAL_DB_NAME --clean --if-exists --exclude-table-data 'storage.objects' --exclude-schema 'pgbouncer' -f "full_backup.sql"

# Restaurar en el nuevo proyecto
Write-Host "Restaurando en el nuevo proyecto..."
$env:PGPASSWORD = $NEW_DB_PASSWORD
psql -h $NEW_DB_HOST -p $NEW_DB_PORT -U $NEW_DB_USER -d $NEW_DB_NAME -f "full_backup.sql"

Write-Host "Migración completada!"
