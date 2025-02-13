-- Agregar columnas faltantes en courses
ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS thumbnail_url text,
ADD COLUMN IF NOT EXISTS level text DEFAULT 'beginner',
ADD COLUMN IF NOT EXISTS description text;
