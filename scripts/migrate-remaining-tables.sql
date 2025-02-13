-- Tablas de Gamificación y Logros
CREATE TABLE IF NOT EXISTS public.achievements (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    points integer DEFAULT 0,
    criteria jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_achievements (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id),
    achievement_id uuid REFERENCES public.achievements(id),
    earned_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

-- Tablas de Chat y Comentarios
CREATE TABLE IF NOT EXISTS public.chat_conversations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text,
    created_by uuid REFERENCES public.profiles(id),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id uuid REFERENCES public.chat_conversations(id),
    user_id uuid REFERENCES public.profiles(id),
    message text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.session_comments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id uuid REFERENCES public.course_sessions(id),
    user_id uuid REFERENCES public.profiles(id),
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Tablas de Evaluación
CREATE TABLE IF NOT EXISTS public.course_evaluations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id uuid REFERENCES public.courses(id),
    title text NOT NULL,
    questions jsonb NOT NULL,
    passing_score integer DEFAULT 70,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_evaluation_responses (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    evaluation_id uuid REFERENCES public.course_evaluations(id),
    user_id uuid REFERENCES public.profiles(id),
    responses jsonb NOT NULL,
    score integer,
    passed boolean DEFAULT false,
    completed_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

-- Tablas de Métricas de Video
CREATE TABLE IF NOT EXISTS public.video_metrics (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id),
    session_id uuid REFERENCES public.course_sessions(id),
    completion_rate numeric DEFAULT 0,
    total_watch_time integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.detailed_video_metrics (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    metric_id uuid REFERENCES public.video_metrics(id),
    buffer_count integer DEFAULT 0,
    quality_changes integer DEFAULT 0,
    device_info jsonb,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.video_events (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    metric_id uuid REFERENCES public.video_metrics(id),
    event_type text NOT NULL,
    event_data jsonb,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.video_bookmarks (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id),
    session_id uuid REFERENCES public.course_sessions(id),
    time_stamp integer NOT NULL,
    note text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.video_notes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id),
    session_id uuid REFERENCES public.course_sessions(id),
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Tablas de Pagos y Suscripciones
CREATE TABLE IF NOT EXISTS public.payments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id),
    amount numeric NOT NULL,
    currency text DEFAULT 'COP',
    payment_type text,
    status text DEFAULT 'pending',
    stripe_payment_id text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id),
    plan_id uuid REFERENCES public.subscription_plans(id),
    status text DEFAULT 'active',
    current_period_start timestamp with time zone,
    current_period_end timestamp with time zone,
    stripe_subscription_id text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.exchange_rates (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    from_currency text NOT NULL,
    to_currency text NOT NULL,
    rate numeric NOT NULL,
    last_updated timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

-- Tablas de Configuración
CREATE TABLE IF NOT EXISTS public.site_settings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    key text UNIQUE NOT NULL,
    value jsonb,
    description text,
    updated_by uuid REFERENCES public.profiles(id),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_notifications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    message text NOT NULL,
    type text DEFAULT 'info',
    read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_permissions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id),
    permission text NOT NULL,
    granted_by uuid REFERENCES public.profiles(id),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
