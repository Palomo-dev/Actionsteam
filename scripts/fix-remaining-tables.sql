-- Ajustar tabla instructors
ALTER TABLE public.instructors
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Ajustar tabla subscription_plans
ALTER TABLE public.subscription_plans
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Verificar y ajustar la restricción de roles en profiles
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS valid_roles;
ALTER TABLE public.profiles
ADD CONSTRAINT valid_roles CHECK (role IN ('student', 'instructor', 'admin'));
