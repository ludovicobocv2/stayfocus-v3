-- Habilitar RLS na tabela profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam seus próprios perfis
CREATE POLICY "Usuários podem ver seus próprios perfis"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Política para permitir que usuários atualizem seus próprios perfis
CREATE POLICY "Usuários podem atualizar seus próprios perfis"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Política para permitir inserção de perfil durante o cadastro
CREATE POLICY "Permitir inserção de perfil durante cadastro"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Trigger para criar perfil automaticamente após cadastro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_new_user();
  END IF;
END
$$; 