-- Resetar (caso necessário)
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Criar extensão para UUID se não existir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tabela profiles no schema public
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_user
    FOREIGN KEY (id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Garantir que o papel autenticado tenha acesso
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Criar políticas de acesso
CREATE POLICY "Usuários podem ver seus próprios perfis"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seus próprios perfis"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seus próprios perfis"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Criar função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email)
  );
  RETURN new;
END;
$$;

-- Remover trigger existente se houver
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Criar novo trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 