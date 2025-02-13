# Crear directorio temporal si no existe
New-Item -ItemType Directory -Force -Path ".\temp" | Out-Null

# Combinar todos los archivos SQL en uno solo
Get-Content .\supabase\migrations\20240320000000_setup_notification_cron.sql | Add-Content .\temp\combined.sql
Get-Content .\supabase\migrations\20240320000001_update_progress_trigger.sql | Add-Content .\temp\combined.sql

Write-Host "Migraciones combinadas en ./temp/combined.sql"
