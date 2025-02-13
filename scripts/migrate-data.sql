-- Migración de datos en orden de dependencias

-- 1. Primero las tablas base sin dependencias
INSERT INTO profiles
SELECT * FROM profiles@db_link;

INSERT INTO course_categories
SELECT * FROM course_categories@db_link;

INSERT INTO course_tags
SELECT * FROM course_tags@db_link;

INSERT INTO instructors
SELECT * FROM instructors@db_link;

INSERT INTO subscription_plans
SELECT * FROM subscription_plans@db_link;

-- 2. Tablas con dependencias simples
INSERT INTO courses
SELECT * FROM courses@db_link;

INSERT INTO course_category_relations
SELECT * FROM course_category_relations@db_link;

INSERT INTO course_tag_relations
SELECT * FROM course_tag_relations@db_link;

INSERT INTO course_sessions
SELECT * FROM course_sessions@db_link;

-- 3. Tablas con múltiples dependencias
INSERT INTO user_courses
SELECT * FROM user_courses@db_link;

INSERT INTO study_sessions
SELECT * FROM study_sessions@db_link;

INSERT INTO course_evaluations
SELECT * FROM course_evaluations@db_link;

INSERT INTO user_evaluation_responses
SELECT * FROM user_evaluation_responses@db_link;

-- 4. Tablas de interacción y contenido
INSERT INTO chat_conversations
SELECT * FROM chat_conversations@db_link;

INSERT INTO chat_messages
SELECT * FROM chat_messages@db_link;

INSERT INTO session_comments
SELECT * FROM session_comments@db_link;

INSERT INTO video_events
SELECT * FROM video_events@db_link;

INSERT INTO video_bookmarks
SELECT * FROM video_bookmarks@db_link;

INSERT INTO video_notes
SELECT * FROM video_notes@db_link;

-- 5. Tablas de sistema y configuración
INSERT INTO notifications
SELECT * FROM notifications@db_link;

INSERT INTO payments
SELECT * FROM payments@db_link;

INSERT INTO subscriptions
SELECT * FROM subscriptions@db_link;

INSERT INTO certificates
SELECT * FROM certificates@db_link;

INSERT INTO site_settings
SELECT * FROM site_settings@db_link;
