-- Obtener usuarios y sus metadatos
SELECT 
    id,
    email,
    raw_user_meta_data,
    email_confirmed_at,
    created_at,
    updated_at
FROM auth.users;
