-- Crear perfil para el usuario existente
INSERT INTO public.profiles (
    id,
    email,
    first_name,
    role,
    is_subscribed,
    created_at,
    updated_at
)
VALUES (
    '7525087e-d98c-4d6b-ba63-bb694a2e4b37',
    'imagine.gallego@gmail.com',
    'Juan Camilo',
    'admin',
    false,
    '2025-02-11 01:31:44.895Z',
    '2025-02-11 03:13:19.613Z'
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    role = EXCLUDED.role,
    is_subscribed = EXCLUDED.is_subscribed,
    updated_at = EXCLUDED.updated_at;
