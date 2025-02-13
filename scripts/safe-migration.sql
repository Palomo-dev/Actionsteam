-- Drop existing types if they exist
DROP TYPE IF EXISTS public.course_level CASCADE;
DROP TYPE IF EXISTS public.notification_type CASCADE;
DROP TYPE IF EXISTS public.user_role CASCADE;

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Crear tipos de enumeración
CREATE TYPE public.course_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE public.notification_type AS ENUM ('course_update', 'achievement', 'system', 'reminder');
CREATE TYPE public.user_role AS ENUM ('student', 'instructor', 'admin');

-- Crear tablas principales
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id),
    full_name text,
    avatar_url text,
    role user_role DEFAULT 'student'::user_role,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.course_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.courses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    category_id uuid REFERENCES public.course_categories(id),
    level course_level DEFAULT 'beginner'::course_level,
    instructor_id uuid REFERENCES public.profiles(id),
    thumbnail_url text,
    is_published boolean DEFAULT false,
    is_free boolean DEFAULT false,
    price numeric(10,2),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
