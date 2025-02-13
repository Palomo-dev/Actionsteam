-- 1. Asegurar que el rol service_role tiene todos los permisos necesarios
GRANT ALL ON profiles TO service_role;
GRANT ALL ON auth.users TO service_role;

-- 2. Permitir que la función handle_new_user pueda insertar en profiles
GRANT INSERT ON profiles TO postgres;

-- 3. Ajustar las políticas de inserción para profiles
DROP POLICY IF EXISTS "Enable insert for users" ON profiles;
DROP POLICY IF EXISTS "Allow service role full access" ON profiles;

-- Política para el service_role
CREATE POLICY "Allow service role full access"
ON profiles
TO service_role
USING (true)
WITH CHECK (true);

-- Política para inserción desde la función trigger
CREATE POLICY "Enable insert for service role"
ON profiles
FOR INSERT
TO postgres
WITH CHECK (true);

-- 4. Verificar que la función handle_new_user está correctamente configurada
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  default_role text := 'client';
BEGIN
  -- Insertar el nuevo perfil
  INSERT INTO public.profiles (id, email, first_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'first_name', split_part(new.email, '@', 1)),
    default_role
  );
  
  -- Log para debugging
  RAISE NOTICE 'Created profile for user % with email % and role %', new.id, new.email, default_role;
  
  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Log cualquier error que ocurra
    RAISE NOTICE 'Error creating profile: %', SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Asegurarse que el trigger está correctamente configurado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Verificar las políticas actualizadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles';
