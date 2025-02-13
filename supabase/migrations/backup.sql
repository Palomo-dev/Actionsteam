

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";






CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."course_level" AS ENUM (
    'beginner',
    'intermediate',
    'advanced'
);


ALTER TYPE "public"."course_level" OWNER TO "postgres";


CREATE TYPE "public"."course_status" AS ENUM (
    'not_started',
    'in_progress',
    'completed'
);


ALTER TYPE "public"."course_status" OWNER TO "postgres";


CREATE TYPE "public"."notification_recipient_type" AS ENUM (
    'all',
    'students',
    'instructors'
);


ALTER TYPE "public"."notification_recipient_type" OWNER TO "postgres";


CREATE TYPE "public"."user_role" AS ENUM (
    'admin',
    'client'
);


ALTER TYPE "public"."user_role" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."calculate_study_session_duration"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Calculate duration in seconds when end_time is updated
    IF NEW.end_time IS NOT NULL AND OLD.end_time IS NULL THEN
        NEW.duration_seconds := EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time));
        
        -- Update total study time in user_courses
        UPDATE user_courses
        SET study_time_seconds = COALESCE(study_time_seconds, 0) + NEW.duration_seconds
        WHERE user_id = NEW.user_id AND course_id = NEW.course_id;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."calculate_study_session_duration"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_admin_role"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = NEW.admin_id AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Only admin profiles can have permissions';
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."check_admin_role"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_exchange_rate"("from_curr" "text", "to_curr" "text") RETURNS numeric
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN (
    SELECT rate 
    FROM exchange_rates 
    WHERE from_currency = from_curr 
    AND to_currency = to_curr
    ORDER BY updated_at DESC 
    LIMIT 1
  );
END;
$$;


ALTER FUNCTION "public"."get_exchange_rate"("from_curr" "text", "to_curr" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
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
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    'client'::user_role,
    false,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."notify_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    INSERT INTO notifications (user_id, title, message, type)
    VALUES (
        NEW.id,
        '¡Bienvenido a Imagine AI!',
        'Estamos emocionados de tenerte aquí. Explora nuestros cursos y comienza tu viaje de aprendizaje.',
        'welcome'
    );
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."notify_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."notify_purchase"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF NEW.payment_type = 'subscription' THEN
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (
            NEW.user_id,
            '¡Gracias por tu suscripción!',
            'Ahora tienes acceso a todo nuestro contenido premium. ¡Comienza a aprender!',
            'subscription'
        );
    ELSE
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (
            NEW.user_id,
            '¡Gracias por tu compra!',
            'Tu curso está listo para comenzar. ¡Empieza tu aprendizaje ahora!',
            'purchase'
        );
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."notify_purchase"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."send_admin_notification"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    INSERT INTO notifications (user_id, title, message, type)
    SELECT 
        profiles.id,
        NEW.title,
        NEW.message,
        'admin'
    FROM profiles
    WHERE 
        CASE 
            WHEN NEW.recipient_type = 'all' THEN true
            WHEN NEW.recipient_type = 'students' THEN profiles.role = 'client'
            WHEN NEW.recipient_type = 'instructors' THEN profiles.role = 'instructor'
        END;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."send_admin_notification"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_course_progress"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    total_duration INTEGER;
    completed_sessions INTEGER;
    total_sessions INTEGER;
BEGIN
    -- Get total course duration in seconds
    SELECT COALESCE(SUM(duration_seconds), 0)
    INTO total_duration
    FROM course_sessions
    WHERE course_id = NEW.course_id;

    -- Get number of completed sessions (more than 90% progress)
    SELECT COUNT(*)
    INTO completed_sessions
    FROM study_sessions ss
    WHERE ss.course_id = NEW.course_id
    AND ss.user_id = NEW.user_id
    AND ss.end_time IS NOT NULL;

    -- Get total number of sessions
    SELECT COUNT(*)
    INTO total_sessions
    FROM course_sessions
    WHERE course_id = NEW.course_id;

    -- Update progress based on completed sessions
    UPDATE user_courses uc
    SET progress = LEAST(
        ROUND(
            (completed_sessions::float / NULLIF(total_sessions, 0)::float * 100)::numeric,
            2
        ),
        100
    )
    WHERE uc.course_id = NEW.course_id 
    AND uc.user_id = NEW.user_id;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_course_progress"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_last_accessed"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- Insertar o actualizar el registro en user_courses
    INSERT INTO public.user_courses (
        user_id,
        course_id,
        last_accessed,
        status,
        progress
    )
    VALUES (
        NEW.user_id,
        NEW.course_id,
        NEW.start_time,
        'in_progress',
        0
    )
    ON CONFLICT (user_id, course_id)
    DO UPDATE SET
        last_accessed = NEW.start_time,
        status = CASE 
            WHEN user_courses.status = 'not_started' THEN 'in_progress'::course_status
            ELSE user_courses.status
        END;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_last_accessed"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_user_role"("user_id" "uuid", "new_role" "public"."user_role") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Verificar si el usuario que ejecuta la función es admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only administrators can update user roles';
  END IF;

  -- Actualizar el rol del usuario
  UPDATE profiles 
  SET role = new_role 
  WHERE id = user_id;
END;
$$;


ALTER FUNCTION "public"."update_user_role"("user_id" "uuid", "new_role" "public"."user_role") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_video_metrics"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    INSERT INTO video_metrics (
        user_id,
        course_id,
        session_id,
        total_watch_time,
        last_position
    )
    VALUES (
        NEW.user_id,
        NEW.course_id,
        NEW.session_id,
        CASE 
            WHEN NEW.event_type = 'complete' THEN NEW.video_duration
            ELSE NEW.video_time
        END,
        NEW.video_time
    )
    ON CONFLICT (user_id, COALESCE(course_id, '00000000-0000-0000-0000-000000000000'), COALESCE(session_id, '00000000-0000-0000-0000-000000000000'))
    DO UPDATE SET
        total_watch_time = GREATEST(video_metrics.total_watch_time, EXCLUDED.total_watch_time),
        last_position = EXCLUDED.last_position,
        updated_at = now();
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_video_metrics"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."achievements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "type" "text" NOT NULL,
    "points" integer DEFAULT 0,
    "criteria" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."achievements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."admin_notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "message" "text" NOT NULL,
    "recipient_type" "public"."notification_recipient_type" NOT NULL,
    "admin_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "sent_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."admin_notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."admin_permissions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "admin_id" "uuid",
    "permission" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."admin_permissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."certificates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "course_id" "uuid" NOT NULL,
    "score" integer NOT NULL,
    "issued_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."certificates" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chat_conversations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "course_id" "uuid",
    "title" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."chat_conversations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chat_messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "conversation_id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "role" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "chat_messages_role_check" CHECK (("role" = ANY (ARRAY['user'::"text", 'assistant'::"text"])))
);


ALTER TABLE "public"."chat_messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."course_categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."course_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."course_category_relations" (
    "course_id" "uuid" NOT NULL,
    "category_id" "uuid" NOT NULL
);


ALTER TABLE "public"."course_category_relations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."course_evaluations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "course_id" "uuid" NOT NULL,
    "question" "text" NOT NULL,
    "options" "jsonb" NOT NULL,
    "correct_option" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."course_evaluations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."course_ratings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "course_id" "uuid" NOT NULL,
    "rating" integer NOT NULL,
    "comment" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "course_ratings_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5)))
);


ALTER TABLE "public"."course_ratings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."course_sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "course_id" "uuid",
    "title" "text" NOT NULL,
    "description" "text",
    "video_url" "text",
    "documentation_url" "text",
    "order_index" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "duration_seconds" integer
);


ALTER TABLE "public"."course_sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."course_slots" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "total_slots" integer DEFAULT 1000 NOT NULL,
    "occupied_slots" integer DEFAULT 200 NOT NULL,
    "start_date" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "end_date" timestamp with time zone DEFAULT '2025-02-01 00:00:00+00'::timestamp with time zone NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."course_slots" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."course_tag_relations" (
    "course_id" "uuid" NOT NULL,
    "tag_id" "uuid" NOT NULL
);


ALTER TABLE "public"."course_tag_relations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."course_tags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."course_tags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."courses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text",
    "thumbnail_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "induction_video_url" "text",
    "banner_url" "text",
    "launch_date" timestamp with time zone,
    "is_published" boolean DEFAULT false,
    "duration" integer,
    "price_cop" numeric(10,2),
    "original_price_cop" numeric(10,2),
    "discount_percentage" integer DEFAULT 0,
    "instructor_id" "uuid",
    "level" "public"."course_level" DEFAULT 'beginner'::"public"."course_level",
    "stripe_product_id" "text",
    "stripe_price_id" "text",
    "is_free" boolean DEFAULT false
);


ALTER TABLE "public"."courses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."detailed_video_metrics" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "course_id" "uuid",
    "session_id" "uuid",
    "device_info" "jsonb",
    "browser_info" "jsonb",
    "quality_changes" integer DEFAULT 0,
    "buffer_count" integer DEFAULT 0,
    "buffer_duration" integer DEFAULT 0,
    "initial_load_time" integer,
    "play_pause_count" integer DEFAULT 0,
    "seek_count" integer DEFAULT 0,
    "most_viewed_segments" "jsonb",
    "preferred_speed" double precision DEFAULT 1.0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."detailed_video_metrics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."exchange_rates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "from_currency" "text" NOT NULL,
    "to_currency" "text" NOT NULL,
    "rate" numeric(10,4) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."exchange_rates" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."instructors" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "bio" "text",
    "avatar_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."instructors" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "message" "text" NOT NULL,
    "type" "text" NOT NULL,
    "read" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE ONLY "public"."notifications" REPLICA IDENTITY FULL;


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "course_id" "uuid",
    "amount" numeric NOT NULL,
    "currency" "text" DEFAULT 'COP'::"text" NOT NULL,
    "status" "text" NOT NULL,
    "stripe_payment_id" "text",
    "payment_type" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."payments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "role" "public"."user_role" DEFAULT 'client'::"public"."user_role",
    "is_subscribed" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "first_name" "text",
    "instructor_image" "text"
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."session_comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "session_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "comment" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."session_comments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."site_settings" (
    "key" "text" NOT NULL,
    "value" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."site_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."study_sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "course_id" "uuid" NOT NULL,
    "start_time" timestamp with time zone DEFAULT "now"() NOT NULL,
    "end_time" timestamp with time zone,
    "duration_seconds" integer,
    "created_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE ONLY "public"."study_sessions" REPLICA IDENTITY FULL;


ALTER TABLE "public"."study_sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."subscription_plans" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "price_cop" numeric(10,2) NOT NULL,
    "stripe_price_id" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."subscription_plans" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."subscriptions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "stripe_subscription_id" "text",
    "status" "text" NOT NULL,
    "current_period_start" timestamp with time zone,
    "current_period_end" timestamp with time zone,
    "cancel_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "plan_id" "uuid"
);


ALTER TABLE "public"."subscriptions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_achievements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "achievement_id" "uuid" NOT NULL,
    "earned_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_achievements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_courses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "course_id" "uuid" NOT NULL,
    "status" "public"."course_status" DEFAULT 'not_started'::"public"."course_status" NOT NULL,
    "progress" integer DEFAULT 0 NOT NULL,
    "last_accessed" timestamp with time zone,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "study_time_seconds" integer DEFAULT 0
);


ALTER TABLE "public"."user_courses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_evaluation_responses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "course_id" "uuid" NOT NULL,
    "score" integer NOT NULL,
    "completed_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_evaluation_responses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."video_bookmarks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "course_id" "uuid",
    "session_id" "uuid",
    "timestamp" integer NOT NULL,
    "note" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."video_bookmarks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."video_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "course_id" "uuid",
    "session_id" "uuid",
    "event_type" "text" NOT NULL,
    "video_time" double precision NOT NULL,
    "video_duration" double precision,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."video_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."video_metrics" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "course_id" "uuid",
    "session_id" "uuid",
    "total_watch_time" double precision DEFAULT 0,
    "completion_rate" double precision DEFAULT 0,
    "average_quality" "text",
    "total_buffering_time" double precision DEFAULT 0,
    "last_position" double precision DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."video_metrics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."video_notes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "course_id" "uuid",
    "session_id" "uuid",
    "timestamp" integer NOT NULL,
    "content" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."video_notes" OWNER TO "postgres";


ALTER TABLE ONLY "public"."achievements"
    ADD CONSTRAINT "achievements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."admin_notifications"
    ADD CONSTRAINT "admin_notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."admin_permissions"
    ADD CONSTRAINT "admin_permissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."certificates"
    ADD CONSTRAINT "certificates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."certificates"
    ADD CONSTRAINT "certificates_user_id_course_id_key" UNIQUE ("user_id", "course_id");



ALTER TABLE ONLY "public"."chat_conversations"
    ADD CONSTRAINT "chat_conversations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chat_messages"
    ADD CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."course_categories"
    ADD CONSTRAINT "course_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."course_category_relations"
    ADD CONSTRAINT "course_category_relations_pkey" PRIMARY KEY ("course_id", "category_id");



ALTER TABLE ONLY "public"."course_evaluations"
    ADD CONSTRAINT "course_evaluations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."course_ratings"
    ADD CONSTRAINT "course_ratings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."course_ratings"
    ADD CONSTRAINT "course_ratings_user_id_course_id_key" UNIQUE ("user_id", "course_id");



ALTER TABLE ONLY "public"."course_sessions"
    ADD CONSTRAINT "course_sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."course_slots"
    ADD CONSTRAINT "course_slots_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."course_tag_relations"
    ADD CONSTRAINT "course_tag_relations_pkey" PRIMARY KEY ("course_id", "tag_id");



ALTER TABLE ONLY "public"."course_tags"
    ADD CONSTRAINT "course_tags_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."course_tags"
    ADD CONSTRAINT "course_tags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."courses"
    ADD CONSTRAINT "courses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."courses"
    ADD CONSTRAINT "courses_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."detailed_video_metrics"
    ADD CONSTRAINT "detailed_video_metrics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."detailed_video_metrics"
    ADD CONSTRAINT "detailed_video_metrics_unique_key" UNIQUE ("user_id", "course_id", "session_id");



ALTER TABLE ONLY "public"."exchange_rates"
    ADD CONSTRAINT "exchange_rates_from_currency_to_currency_key" UNIQUE ("from_currency", "to_currency");



ALTER TABLE ONLY "public"."exchange_rates"
    ADD CONSTRAINT "exchange_rates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."instructors"
    ADD CONSTRAINT "instructors_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."session_comments"
    ADD CONSTRAINT "session_comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."site_settings"
    ADD CONSTRAINT "site_settings_pkey" PRIMARY KEY ("key");



ALTER TABLE ONLY "public"."study_sessions"
    ADD CONSTRAINT "study_sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subscription_plans"
    ADD CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subscription_plans"
    ADD CONSTRAINT "subscription_plans_stripe_price_id_key" UNIQUE ("stripe_price_id");



ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_achievements"
    ADD CONSTRAINT "user_achievements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_achievements"
    ADD CONSTRAINT "user_achievements_user_id_achievement_id_key" UNIQUE ("user_id", "achievement_id");



ALTER TABLE ONLY "public"."user_courses"
    ADD CONSTRAINT "user_courses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_courses"
    ADD CONSTRAINT "user_courses_user_id_course_id_key" UNIQUE ("user_id", "course_id");



ALTER TABLE ONLY "public"."user_evaluation_responses"
    ADD CONSTRAINT "user_evaluation_responses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_evaluation_responses"
    ADD CONSTRAINT "user_evaluation_responses_user_id_course_id_key" UNIQUE ("user_id", "course_id");



ALTER TABLE ONLY "public"."video_bookmarks"
    ADD CONSTRAINT "video_bookmarks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."video_bookmarks"
    ADD CONSTRAINT "video_bookmarks_unique_per_time" UNIQUE ("user_id", "course_id", "session_id", "timestamp");



ALTER TABLE ONLY "public"."video_events"
    ADD CONSTRAINT "video_events_new_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."video_events"
    ADD CONSTRAINT "video_events_unique_event" UNIQUE ("user_id", "course_id", "session_id", "event_type", "video_time");



ALTER TABLE ONLY "public"."video_metrics"
    ADD CONSTRAINT "video_metrics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."video_notes"
    ADD CONSTRAINT "video_notes_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_admin_permissions_admin_id" ON "public"."admin_permissions" USING "btree" ("admin_id");



CREATE INDEX "idx_exchange_rates_currencies" ON "public"."exchange_rates" USING "btree" ("from_currency", "to_currency");



CREATE INDEX "idx_study_sessions_user_course" ON "public"."study_sessions" USING "btree" ("user_id", "course_id");



CREATE INDEX "idx_user_courses_tracking" ON "public"."user_courses" USING "btree" ("user_id", "course_id", "last_accessed");



CREATE INDEX "idx_user_courses_user" ON "public"."user_courses" USING "btree" ("user_id");



CREATE INDEX "video_events_course_id_idx" ON "public"."video_events" USING "btree" ("course_id");



CREATE INDEX "video_events_session_id_idx" ON "public"."video_events" USING "btree" ("session_id");



CREATE UNIQUE INDEX "video_events_unique_event_key" ON "public"."video_events" USING "btree" (COALESCE("user_id", '00000000-0000-0000-0000-000000000000'::"uuid"), COALESCE("course_id", '00000000-0000-0000-0000-000000000000'::"uuid"), COALESCE("session_id", '00000000-0000-0000-0000-000000000000'::"uuid"), "event_type", COALESCE(("metadata" ->> 'event_timestamp'::"text"), ''::"text"));



CREATE INDEX "video_events_user_id_idx" ON "public"."video_events" USING "btree" ("user_id");



CREATE OR REPLACE TRIGGER "ensure_admin_role" BEFORE INSERT OR UPDATE ON "public"."admin_permissions" FOR EACH ROW EXECUTE FUNCTION "public"."check_admin_role"();



CREATE OR REPLACE TRIGGER "on_admin_notification_created" AFTER INSERT ON "public"."admin_notifications" FOR EACH ROW EXECUTE FUNCTION "public"."send_admin_notification"();



CREATE OR REPLACE TRIGGER "on_study_session_created" AFTER INSERT ON "public"."study_sessions" FOR EACH ROW EXECUTE FUNCTION "public"."update_last_accessed"();



CREATE OR REPLACE TRIGGER "on_video_event_insert" AFTER INSERT ON "public"."video_events" FOR EACH ROW EXECUTE FUNCTION "public"."update_video_metrics"();



CREATE OR REPLACE TRIGGER "send_purchase_notification" AFTER INSERT ON "public"."payments" FOR EACH ROW EXECUTE FUNCTION "public"."notify_purchase"();



CREATE OR REPLACE TRIGGER "send_welcome_notification" AFTER INSERT ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."notify_new_user"();



CREATE OR REPLACE TRIGGER "update_course_progress_on_study_time" AFTER UPDATE OF "study_time_seconds" ON "public"."user_courses" FOR EACH ROW EXECUTE FUNCTION "public"."update_course_progress"();



CREATE OR REPLACE TRIGGER "update_course_ratings_updated_at" BEFORE UPDATE ON "public"."course_ratings" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_course_slots_updated_at" BEFORE UPDATE ON "public"."course_slots" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_study_session_duration" BEFORE UPDATE ON "public"."study_sessions" FOR EACH ROW EXECUTE FUNCTION "public"."calculate_study_session_duration"();



ALTER TABLE ONLY "public"."admin_notifications"
    ADD CONSTRAINT "admin_notifications_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."admin_permissions"
    ADD CONSTRAINT "admin_permissions_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."certificates"
    ADD CONSTRAINT "certificates_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id");



ALTER TABLE ONLY "public"."certificates"
    ADD CONSTRAINT "certificates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."chat_conversations"
    ADD CONSTRAINT "chat_conversations_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id");



ALTER TABLE ONLY "public"."chat_conversations"
    ADD CONSTRAINT "chat_conversations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."chat_messages"
    ADD CONSTRAINT "chat_messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."chat_conversations"("id");



ALTER TABLE ONLY "public"."course_category_relations"
    ADD CONSTRAINT "course_category_relations_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."course_categories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."course_category_relations"
    ADD CONSTRAINT "course_category_relations_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."course_evaluations"
    ADD CONSTRAINT "course_evaluations_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."course_ratings"
    ADD CONSTRAINT "course_ratings_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id");



ALTER TABLE ONLY "public"."course_ratings"
    ADD CONSTRAINT "course_ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."course_sessions"
    ADD CONSTRAINT "course_sessions_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."course_tag_relations"
    ADD CONSTRAINT "course_tag_relations_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."course_tag_relations"
    ADD CONSTRAINT "course_tag_relations_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."course_tags"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."courses"
    ADD CONSTRAINT "courses_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "public"."instructors"("id");



ALTER TABLE ONLY "public"."detailed_video_metrics"
    ADD CONSTRAINT "detailed_video_metrics_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id");



ALTER TABLE ONLY "public"."detailed_video_metrics"
    ADD CONSTRAINT "detailed_video_metrics_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."course_sessions"("id");



ALTER TABLE ONLY "public"."detailed_video_metrics"
    ADD CONSTRAINT "detailed_video_metrics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."admin_notifications"
    ADD CONSTRAINT "fk_admin" FOREIGN KEY ("admin_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."chat_messages"
    ADD CONSTRAINT "fk_conversation_id" FOREIGN KEY ("conversation_id") REFERENCES "public"."chat_conversations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."session_comments"
    ADD CONSTRAINT "fk_session_comments_session" FOREIGN KEY ("session_id") REFERENCES "public"."course_sessions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."session_comments"
    ADD CONSTRAINT "fk_session_comments_user" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "fk_subscription_plan" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id");



ALTER TABLE ONLY "public"."chat_conversations"
    ADD CONSTRAINT "fk_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."session_comments"
    ADD CONSTRAINT "session_comments_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."course_sessions"("id");



ALTER TABLE ONLY "public"."study_sessions"
    ADD CONSTRAINT "study_sessions_user_id_course_id_fkey" FOREIGN KEY ("user_id", "course_id") REFERENCES "public"."user_courses"("user_id", "course_id");



ALTER TABLE ONLY "public"."study_sessions"
    ADD CONSTRAINT "study_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id");



ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."user_achievements"
    ADD CONSTRAINT "user_achievements_achievement_id_fkey" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("id");



ALTER TABLE ONLY "public"."user_achievements"
    ADD CONSTRAINT "user_achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."user_courses"
    ADD CONSTRAINT "user_courses_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id");



ALTER TABLE ONLY "public"."user_courses"
    ADD CONSTRAINT "user_courses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."user_evaluation_responses"
    ADD CONSTRAINT "user_evaluation_responses_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id");



ALTER TABLE ONLY "public"."user_evaluation_responses"
    ADD CONSTRAINT "user_evaluation_responses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."video_bookmarks"
    ADD CONSTRAINT "video_bookmarks_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id");



ALTER TABLE ONLY "public"."video_bookmarks"
    ADD CONSTRAINT "video_bookmarks_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."course_sessions"("id");



ALTER TABLE ONLY "public"."video_bookmarks"
    ADD CONSTRAINT "video_bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."video_events"
    ADD CONSTRAINT "video_events_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id");



ALTER TABLE ONLY "public"."video_events"
    ADD CONSTRAINT "video_events_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."course_sessions"("id");



ALTER TABLE ONLY "public"."video_events"
    ADD CONSTRAINT "video_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."video_metrics"
    ADD CONSTRAINT "video_metrics_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id");



ALTER TABLE ONLY "public"."video_metrics"
    ADD CONSTRAINT "video_metrics_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."course_sessions"("id");



ALTER TABLE ONLY "public"."video_metrics"
    ADD CONSTRAINT "video_metrics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."video_notes"
    ADD CONSTRAINT "video_notes_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id");



ALTER TABLE ONLY "public"."video_notes"
    ADD CONSTRAINT "video_notes_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."course_sessions"("id");



ALTER TABLE ONLY "public"."video_notes"
    ADD CONSTRAINT "video_notes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



CREATE POLICY "Admins can manage categories" ON "public"."course_categories" TO "authenticated" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"public"."user_role"))));



CREATE POLICY "Admins can manage category relations" ON "public"."course_category_relations" TO "authenticated" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"public"."user_role"))));



CREATE POLICY "Admins can manage certificates" ON "public"."certificates" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"public"."user_role"))));



CREATE POLICY "Admins can manage course evaluations" ON "public"."course_evaluations" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"public"."user_role"))));



CREATE POLICY "Admins can manage course sessions" ON "public"."course_sessions" TO "authenticated" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"public"."user_role"))));



CREATE POLICY "Admins can manage courses" ON "public"."courses" TO "authenticated" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"public"."user_role"))));



CREATE POLICY "Admins can manage instructors" ON "public"."instructors" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"public"."user_role"))));



CREATE POLICY "Admins can manage notifications" ON "public"."notifications" TO "authenticated" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"public"."user_role"))));



CREATE POLICY "Admins can manage permissions" ON "public"."admin_permissions" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"public"."user_role"))));



CREATE POLICY "Admins can manage study sessions" ON "public"."study_sessions" TO "authenticated" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"public"."user_role"))));



CREATE POLICY "Admins can manage tag relations" ON "public"."course_tag_relations" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"public"."user_role"))));



CREATE POLICY "Admins can manage tags" ON "public"."course_tags" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"public"."user_role"))));



CREATE POLICY "Admins can manage user courses" ON "public"."user_courses" TO "authenticated" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"public"."user_role"))));



CREATE POLICY "Admins can view all notifications" ON "public"."notifications" FOR SELECT TO "authenticated" USING ((("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"public"."user_role"))) OR ("auth"."uid"() = "user_id")));



CREATE POLICY "Admins can view all responses" ON "public"."user_evaluation_responses" FOR SELECT USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"public"."user_role"))));



CREATE POLICY "Admins can view all study sessions" ON "public"."study_sessions" FOR SELECT TO "authenticated" USING ((("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"public"."user_role"))) OR ("auth"."uid"() = "user_id")));



CREATE POLICY "Admins can view all user courses" ON "public"."user_courses" FOR SELECT TO "authenticated" USING ((("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"public"."user_role"))) OR ("auth"."uid"() = "user_id")));



CREATE POLICY "Admins can view all video metrics" ON "public"."video_metrics" FOR SELECT TO "authenticated" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"public"."user_role"))));



CREATE POLICY "Allow admins to manage notifications" ON "public"."admin_notifications" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"public"."user_role")))));



CREATE POLICY "Allow admins to modify site settings" ON "public"."site_settings" TO "authenticated" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"public"."user_role"))));



CREATE POLICY "Allow public read access to site settings" ON "public"."site_settings" FOR SELECT USING (true);



CREATE POLICY "Allow viewing free courses" ON "public"."courses" FOR SELECT TO "authenticated" USING ((("is_free" = true) OR (EXISTS ( SELECT 1
   FROM "public"."user_courses" "uc"
  WHERE (("uc"."course_id" = "courses"."id") AND ("uc"."user_id" = "auth"."uid"())))) OR (EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."is_subscribed" = true))))));



CREATE POLICY "Anyone can view achievements" ON "public"."achievements" FOR SELECT USING (true);



CREATE POLICY "Anyone can view comments" ON "public"."session_comments" FOR SELECT USING (true);



CREATE POLICY "Anyone can view instructors" ON "public"."instructors" FOR SELECT USING (true);



CREATE POLICY "Anyone can view ratings" ON "public"."course_ratings" FOR SELECT USING (true);



CREATE POLICY "Anyone can view slots" ON "public"."course_slots" FOR SELECT USING (true);



CREATE POLICY "Anyone can view tag relations" ON "public"."course_tag_relations" FOR SELECT USING (true);



CREATE POLICY "Anyone can view tags" ON "public"."course_tags" FOR SELECT USING (true);



CREATE POLICY "Categories are viewable by everyone" ON "public"."course_categories" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Category relations are viewable by everyone" ON "public"."course_category_relations" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Cualquier usuario autenticado puede ver las sesiones" ON "public"."course_sessions" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Cursos publicados son visibles para todos" ON "public"."courses" FOR SELECT USING (("is_published" = true));



CREATE POLICY "Enable insert for authenticated users" ON "public"."notifications" FOR INSERT TO "authenticated" WITH CHECK ((("auth"."uid"() = "user_id") OR (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"public"."user_role"))))));



CREATE POLICY "Exchange rates are viewable by everyone" ON "public"."exchange_rates" FOR SELECT USING (true);



CREATE POLICY "Only admins can manage achievements" ON "public"."achievements" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"public"."user_role"))));



CREATE POLICY "Only admins can manage subscription plans" ON "public"."subscription_plans" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"public"."user_role"))));



CREATE POLICY "Only admins can modify slots" ON "public"."course_slots" TO "authenticated" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"public"."user_role"))));



CREATE POLICY "Subscription plans are viewable by everyone" ON "public"."subscription_plans" FOR SELECT USING (true);



CREATE POLICY "System can insert achievements" ON "public"."user_achievements" FOR INSERT WITH CHECK (true);



CREATE POLICY "System can insert notifications" ON "public"."notifications" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Users can create messages in their conversations" ON "public"."chat_messages" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."chat_conversations"
  WHERE (("chat_conversations"."id" = "chat_messages"."conversation_id") AND ("chat_conversations"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can create study sessions" ON "public"."study_sessions" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own conversations" ON "public"."chat_conversations" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own comments" ON "public"."session_comments" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can enroll in courses" ON "public"."user_courses" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own certificates" ON "public"."certificates" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own comments" ON "public"."session_comments" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own courses" ON "public"."user_courses" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own payments" ON "public"."payments" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own ratings" ON "public"."course_ratings" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own responses" ON "public"."user_evaluation_responses" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own study sessions" ON "public"."study_sessions" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own subscriptions" ON "public"."subscriptions" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own video metrics" ON "public"."video_metrics" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their study sessions" ON "public"."study_sessions" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their own bookmarks" ON "public"."video_bookmarks" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their own detailed metrics" ON "public"."detailed_video_metrics" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their own notes" ON "public"."video_notes" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their own ratings" ON "public"."course_ratings" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their own responses" ON "public"."user_evaluation_responses" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own course progress" ON "public"."user_courses" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own notifications" ON "public"."notifications" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own study sessions" ON "public"."study_sessions" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own subscriptions" ON "public"."subscriptions" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own video metrics" ON "public"."video_metrics" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view course evaluations" ON "public"."course_evaluations" FOR SELECT USING (true);



CREATE POLICY "Users can view course sessions" ON "public"."course_sessions" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Users can view messages from their conversations" ON "public"."chat_messages" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."chat_conversations"
  WHERE (("chat_conversations"."id" = "chat_messages"."conversation_id") AND ("chat_conversations"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can view their own achievements" ON "public"."user_achievements" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own certificates" ON "public"."certificates" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own conversations" ON "public"."chat_conversations" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own course enrollments" ON "public"."user_courses" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own courses" ON "public"."user_courses" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own notifications" ON "public"."notifications" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own payments" ON "public"."payments" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own study sessions" ON "public"."study_sessions" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own subscriptions" ON "public"."subscriptions" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own video metrics" ON "public"."video_metrics" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their study sessions" ON "public"."study_sessions" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Usuarios suscritos pueden crear registros de cursos" ON "public"."user_courses" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_subscribed" = true)))));



CREATE POLICY "Usuarios suscritos pueden ver todas las sesiones" ON "public"."course_sessions" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_subscribed" = true)))));



CREATE POLICY "Usuarios suscritos pueden ver todos los cursos" ON "public"."courses" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_subscribed" = true)))));



ALTER TABLE "public"."achievements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."admin_notifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."admin_permissions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."certificates" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."chat_conversations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."chat_messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."course_categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."course_category_relations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."course_evaluations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."course_ratings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."course_slots" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."course_tag_relations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."course_tags" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."courses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."detailed_video_metrics" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "enable_insert_for_authenticated_users" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "enable_profiles_for_authenticated_users" ON "public"."profiles" FOR SELECT TO "authenticated" USING (true);



ALTER TABLE "public"."exchange_rates" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."instructors" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."session_comments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."site_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."study_sessions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."subscription_plans" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."subscriptions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_achievements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_courses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_evaluation_responses" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "users_can_update_own_profile" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



ALTER TABLE "public"."video_bookmarks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."video_metrics" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."video_notes" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


CREATE PUBLICATION "supabase_realtime_messages_publication" WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION "supabase_realtime_messages_publication" OWNER TO "supabase_admin";


ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."notifications";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."study_sessions";









GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";















































































































































































































GRANT ALL ON FUNCTION "public"."calculate_study_session_duration"() TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_study_session_duration"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_study_session_duration"() TO "service_role";



GRANT ALL ON FUNCTION "public"."check_admin_role"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_admin_role"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_admin_role"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_exchange_rate"("from_curr" "text", "to_curr" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_exchange_rate"("from_curr" "text", "to_curr" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_exchange_rate"("from_curr" "text", "to_curr" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."notify_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."notify_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."notify_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."notify_purchase"() TO "anon";
GRANT ALL ON FUNCTION "public"."notify_purchase"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."notify_purchase"() TO "service_role";



GRANT ALL ON FUNCTION "public"."send_admin_notification"() TO "anon";
GRANT ALL ON FUNCTION "public"."send_admin_notification"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."send_admin_notification"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_course_progress"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_course_progress"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_course_progress"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_last_accessed"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_last_accessed"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_last_accessed"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_user_role"("user_id" "uuid", "new_role" "public"."user_role") TO "anon";
GRANT ALL ON FUNCTION "public"."update_user_role"("user_id" "uuid", "new_role" "public"."user_role") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_user_role"("user_id" "uuid", "new_role" "public"."user_role") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_video_metrics"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_video_metrics"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_video_metrics"() TO "service_role";
























GRANT ALL ON TABLE "public"."achievements" TO "anon";
GRANT ALL ON TABLE "public"."achievements" TO "authenticated";
GRANT ALL ON TABLE "public"."achievements" TO "service_role";



GRANT ALL ON TABLE "public"."admin_notifications" TO "anon";
GRANT ALL ON TABLE "public"."admin_notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."admin_notifications" TO "service_role";



GRANT ALL ON TABLE "public"."admin_permissions" TO "anon";
GRANT ALL ON TABLE "public"."admin_permissions" TO "authenticated";
GRANT ALL ON TABLE "public"."admin_permissions" TO "service_role";



GRANT ALL ON TABLE "public"."certificates" TO "anon";
GRANT ALL ON TABLE "public"."certificates" TO "authenticated";
GRANT ALL ON TABLE "public"."certificates" TO "service_role";



GRANT ALL ON TABLE "public"."chat_conversations" TO "anon";
GRANT ALL ON TABLE "public"."chat_conversations" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_conversations" TO "service_role";



GRANT ALL ON TABLE "public"."chat_messages" TO "anon";
GRANT ALL ON TABLE "public"."chat_messages" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_messages" TO "service_role";



GRANT ALL ON TABLE "public"."course_categories" TO "anon";
GRANT ALL ON TABLE "public"."course_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."course_categories" TO "service_role";



GRANT ALL ON TABLE "public"."course_category_relations" TO "anon";
GRANT ALL ON TABLE "public"."course_category_relations" TO "authenticated";
GRANT ALL ON TABLE "public"."course_category_relations" TO "service_role";



GRANT ALL ON TABLE "public"."course_evaluations" TO "anon";
GRANT ALL ON TABLE "public"."course_evaluations" TO "authenticated";
GRANT ALL ON TABLE "public"."course_evaluations" TO "service_role";



GRANT ALL ON TABLE "public"."course_ratings" TO "anon";
GRANT ALL ON TABLE "public"."course_ratings" TO "authenticated";
GRANT ALL ON TABLE "public"."course_ratings" TO "service_role";



GRANT ALL ON TABLE "public"."course_sessions" TO "anon";
GRANT ALL ON TABLE "public"."course_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."course_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."course_slots" TO "anon";
GRANT ALL ON TABLE "public"."course_slots" TO "authenticated";
GRANT ALL ON TABLE "public"."course_slots" TO "service_role";



GRANT ALL ON TABLE "public"."course_tag_relations" TO "anon";
GRANT ALL ON TABLE "public"."course_tag_relations" TO "authenticated";
GRANT ALL ON TABLE "public"."course_tag_relations" TO "service_role";



GRANT ALL ON TABLE "public"."course_tags" TO "anon";
GRANT ALL ON TABLE "public"."course_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."course_tags" TO "service_role";



GRANT ALL ON TABLE "public"."courses" TO "anon";
GRANT ALL ON TABLE "public"."courses" TO "authenticated";
GRANT ALL ON TABLE "public"."courses" TO "service_role";



GRANT ALL ON TABLE "public"."detailed_video_metrics" TO "anon";
GRANT ALL ON TABLE "public"."detailed_video_metrics" TO "authenticated";
GRANT ALL ON TABLE "public"."detailed_video_metrics" TO "service_role";



GRANT ALL ON TABLE "public"."exchange_rates" TO "anon";
GRANT ALL ON TABLE "public"."exchange_rates" TO "authenticated";
GRANT ALL ON TABLE "public"."exchange_rates" TO "service_role";



GRANT ALL ON TABLE "public"."instructors" TO "anon";
GRANT ALL ON TABLE "public"."instructors" TO "authenticated";
GRANT ALL ON TABLE "public"."instructors" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."payments" TO "anon";
GRANT ALL ON TABLE "public"."payments" TO "authenticated";
GRANT ALL ON TABLE "public"."payments" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."session_comments" TO "anon";
GRANT ALL ON TABLE "public"."session_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."session_comments" TO "service_role";



GRANT ALL ON TABLE "public"."site_settings" TO "anon";
GRANT ALL ON TABLE "public"."site_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."site_settings" TO "service_role";



GRANT ALL ON TABLE "public"."study_sessions" TO "anon";
GRANT ALL ON TABLE "public"."study_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."study_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."subscription_plans" TO "anon";
GRANT ALL ON TABLE "public"."subscription_plans" TO "authenticated";
GRANT ALL ON TABLE "public"."subscription_plans" TO "service_role";



GRANT ALL ON TABLE "public"."subscriptions" TO "anon";
GRANT ALL ON TABLE "public"."subscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."subscriptions" TO "service_role";



GRANT ALL ON TABLE "public"."user_achievements" TO "anon";
GRANT ALL ON TABLE "public"."user_achievements" TO "authenticated";
GRANT ALL ON TABLE "public"."user_achievements" TO "service_role";



GRANT ALL ON TABLE "public"."user_courses" TO "anon";
GRANT ALL ON TABLE "public"."user_courses" TO "authenticated";
GRANT ALL ON TABLE "public"."user_courses" TO "service_role";



GRANT ALL ON TABLE "public"."user_evaluation_responses" TO "anon";
GRANT ALL ON TABLE "public"."user_evaluation_responses" TO "authenticated";
GRANT ALL ON TABLE "public"."user_evaluation_responses" TO "service_role";



GRANT ALL ON TABLE "public"."video_bookmarks" TO "anon";
GRANT ALL ON TABLE "public"."video_bookmarks" TO "authenticated";
GRANT ALL ON TABLE "public"."video_bookmarks" TO "service_role";



GRANT ALL ON TABLE "public"."video_events" TO "anon";
GRANT ALL ON TABLE "public"."video_events" TO "authenticated";
GRANT ALL ON TABLE "public"."video_events" TO "service_role";



GRANT ALL ON TABLE "public"."video_metrics" TO "anon";
GRANT ALL ON TABLE "public"."video_metrics" TO "authenticated";
GRANT ALL ON TABLE "public"."video_metrics" TO "service_role";



GRANT ALL ON TABLE "public"."video_notes" TO "anon";
GRANT ALL ON TABLE "public"."video_notes" TO "authenticated";
GRANT ALL ON TABLE "public"."video_notes" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
