-- Deshabilitar temporalmente la restricción de clave foránea
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Insertar los perfiles
INSERT INTO public.profiles (
    id,
    email,
    first_name,
    role,
    is_subscribed,
    created_at,
    updated_at
)
VALUES 
(
    'aaad96d1-e172-411a-b1e5-f8d5cdc35f3b',
    'gobuy.com.co@gmail.com',
    'Gobuy User',
    'student',
    false,
    '2025-01-04T06:39:54.97544+00:00',
    '2025-01-04T06:39:54.97544+00:00'
),
(
    '0cf3fcee-d8c2-4902-930b-99401c81d31c',
    'imagine.gallego@gmail.com',
    'Juan Camilo',
    'student',
    false,
    '2025-01-03T23:58:13.943573+00:00',
    '2025-01-03T23:58:13.943573+00:00'
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    role = EXCLUDED.role,
    updated_at = EXCLUDED.updated_at;

-- Volver a habilitar la restricción de clave foránea
ALTER TABLE profiles
ADD CONSTRAINT profiles_id_fkey 
FOREIGN KEY (id) 
REFERENCES auth.users(id);
