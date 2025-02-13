-- Función para verificar rol de administrador
CREATE OR REPLACE FUNCTION public.check_admin_role()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = NEW.user_id AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'User is not an admin';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para manejar nuevos usuarios
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
        'student'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para notificar nuevos usuarios
CREATE OR REPLACE FUNCTION public.notify_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (user_id, title, message, type)
    VALUES (
        NEW.id,
        '¡Bienvenido a CourseHub!',
        format('Hola %s, ¡bienvenido a nuestra plataforma de aprendizaje!', 
               COALESCE(NEW.first_name, 'estudiante')),
        'welcome'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para notificar compras
CREATE OR REPLACE FUNCTION public.notify_purchase()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (
        user_id,
        title,
        message,
        type
    )
    VALUES (
        NEW.user_id,
        'Compra Exitosa',
        format('Tu pago de %s %s ha sido procesado exitosamente.', 
               NEW.amount::text, 
               NEW.currency),
        'purchase'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para enviar notificaciones admin
CREATE OR REPLACE FUNCTION public.send_admin_notification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO admin_notifications (title, message, type)
    VALUES (
        CASE 
            WHEN TG_TABLE_NAME = 'payments' THEN 'Nueva Venta'
            WHEN TG_TABLE_NAME = 'profiles' THEN 'Nuevo Usuario'
            ELSE 'Notificación del Sistema'
        END,
        CASE 
            WHEN TG_TABLE_NAME = 'payments' 
            THEN format('Venta realizada por %s: %s %s', NEW.user_id, NEW.amount, NEW.currency)
            WHEN TG_TABLE_NAME = 'profiles' 
            THEN format('Nuevo usuario registrado: %s', NEW.email)
            ELSE 'Evento del sistema'
        END,
        'system'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar última fecha de acceso
CREATE OR REPLACE FUNCTION public.update_last_accessed()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_courses
    SET last_accessed = CURRENT_TIMESTAMP
    WHERE user_id = NEW.user_id AND course_id = NEW.course_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar columna updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar métricas de video
CREATE OR REPLACE FUNCTION public.update_video_metrics()
RETURNS TRIGGER AS $$
BEGIN
    WITH video_stats AS (
        SELECT 
            COUNT(*) as total_events,
            SUM(CASE WHEN event_type = 'buffer' THEN 1 ELSE 0 END) as buffer_count,
            SUM(CASE WHEN event_type = 'quality_change' THEN 1 ELSE 0 END) as quality_changes
        FROM video_events
        WHERE metric_id = NEW.metric_id
    )
    UPDATE detailed_video_metrics
    SET 
        buffer_count = video_stats.buffer_count,
        quality_changes = video_stats.quality_changes,
        updated_at = CURRENT_TIMESTAMP
    FROM video_stats
    WHERE metric_id = NEW.metric_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener tasa de cambio
CREATE OR REPLACE FUNCTION public.get_exchange_rate(
    from_curr text,
    to_curr text
)
RETURNS numeric AS $$
DECLARE
    rate numeric;
BEGIN
    SELECT er.rate INTO rate
    FROM exchange_rates er
    WHERE er.from_currency = from_curr
    AND er.to_currency = to_curr
    AND er.last_updated >= (CURRENT_TIMESTAMP - interval '1 day')
    ORDER BY er.last_updated DESC
    LIMIT 1;
    
    RETURN COALESCE(rate, 1);
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar rol de usuario
CREATE OR REPLACE FUNCTION public.update_user_role(
    user_id uuid,
    new_role text
)
RETURNS void AS $$
BEGIN
    UPDATE profiles
    SET 
        role = new_role,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Triggers para las funciones anteriores
DROP TRIGGER IF EXISTS check_admin_role_trigger ON admin_permissions;
CREATE TRIGGER check_admin_role_trigger
    BEFORE INSERT OR UPDATE ON admin_permissions
    FOR EACH ROW
    EXECUTE FUNCTION check_admin_role();

DROP TRIGGER IF EXISTS handle_new_user_trigger ON auth.users;
CREATE TRIGGER handle_new_user_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

DROP TRIGGER IF EXISTS notify_new_user_trigger ON profiles;
CREATE TRIGGER notify_new_user_trigger
    AFTER INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_user();

DROP TRIGGER IF EXISTS notify_purchase_trigger ON payments;
CREATE TRIGGER notify_purchase_trigger
    AFTER INSERT ON payments
    FOR EACH ROW
    WHEN (NEW.status = 'completed')
    EXECUTE FUNCTION notify_purchase();

DROP TRIGGER IF EXISTS send_admin_notification_payment_trigger ON payments;
CREATE TRIGGER send_admin_notification_payment_trigger
    AFTER INSERT ON payments
    FOR EACH ROW
    WHEN (NEW.status = 'completed')
    EXECUTE FUNCTION send_admin_notification();

DROP TRIGGER IF EXISTS send_admin_notification_user_trigger ON profiles;
CREATE TRIGGER send_admin_notification_user_trigger
    AFTER INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION send_admin_notification();

DROP TRIGGER IF EXISTS update_last_accessed_trigger ON study_sessions;
CREATE TRIGGER update_last_accessed_trigger
    AFTER INSERT ON study_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_last_accessed();

DROP TRIGGER IF EXISTS update_video_metrics_trigger ON video_events;
CREATE TRIGGER update_video_metrics_trigger
    AFTER INSERT ON video_events
    FOR EACH ROW
    EXECUTE FUNCTION update_video_metrics();
