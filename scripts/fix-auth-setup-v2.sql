-- 1. Eliminar todas las políticas existentes
DO $$ 
DECLARE 
    pol RECORD;
BEGIN 
    FOR pol IN SELECT policyname 
               FROM pg_policies 
               WHERE schemaname = 'public' 
               AND tablename = 'profiles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON profiles', pol.policyname);
    END LOOP;
END $$;

-- 2. Asegurarnos que RLS está habilitado
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Crear nuevas políticas
-- Política para lectura pública
CREATE POLICY "Enable read access for all users" 
ON profiles FOR SELECT 
TO authenticated
USING (true);

-- Política para actualizar perfil propio
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Política para insertar perfil propio
CREATE POLICY "Enable insert for users"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- 4. Verificar la función handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'first_name', split_part(new.email, '@', 1)),
    'client'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Verificar configuración final
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'profiles';

SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles';
