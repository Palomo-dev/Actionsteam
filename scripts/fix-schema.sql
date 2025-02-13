-- 1. Ajustar tipos enumerados
DROP TYPE IF EXISTS public.user_role CASCADE;
CREATE TYPE public.user_role AS ENUM ('student', 'instructor', 'admin');

-- 2. Ajustar columnas faltantes en las tablas

-- Profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS is_subscribed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'student'::user_role;

-- Course Categories
ALTER TABLE public.course_categories
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Courses
ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS slug text,
ADD COLUMN IF NOT EXISTS is_free boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS price_cop numeric(10,2),
ADD COLUMN IF NOT EXISTS original_price_cop numeric(10,2),
ADD COLUMN IF NOT EXISTS discount_percentage integer,
ADD COLUMN IF NOT EXISTS banner_url text,
ADD COLUMN IF NOT EXISTS induction_video_url text,
ADD COLUMN IF NOT EXISTS stripe_product_id text,
ADD COLUMN IF NOT EXISTS stripe_price_id text,
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Course Sessions
ALTER TABLE public.course_sessions
ADD COLUMN IF NOT EXISTS documentation_url text,
ADD COLUMN IF NOT EXISTS duration_seconds integer,
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- User Courses
ALTER TABLE public.user_courses
ADD COLUMN IF NOT EXISTS status text DEFAULT 'not_started',
ADD COLUMN IF NOT EXISTS study_time_seconds integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_accessed timestamp with time zone,
ADD COLUMN IF NOT EXISTS completed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Study Sessions
ALTER TABLE public.study_sessions
ADD COLUMN IF NOT EXISTS duration_minutes numeric(10,2),
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();

-- 3. Agregar triggers para updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para updated_at en todas las tablas relevantes
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS update_updated_at_timestamp ON %I;
            CREATE TRIGGER update_updated_at_timestamp
                BEFORE UPDATE ON %I
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();
        ', t, t);
    END LOOP;
END $$;
