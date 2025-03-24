-- Script para criar tabelas relacionadas ao módulo de sono no Supabase

-- Tabela de registros de sono
CREATE TABLE IF NOT EXISTS public.sleep_records (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  quality smallint,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
);

-- Tabela de lembretes de sono
CREATE TABLE IF NOT EXISTS public.sleep_reminders (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  type text NOT NULL,
  time text NOT NULL,
  days_of_week smallint[] NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.sleep_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_reminders ENABLE ROW LEVEL SECURITY;

-- Criar políticas para sleep_records
CREATE POLICY "Usuários podem ver apenas seus próprios registros de sono"
  ON public.sleep_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios registros de sono"
  ON public.sleep_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios registros de sono"
  ON public.sleep_records FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios registros de sono"
  ON public.sleep_records FOR DELETE
  USING (auth.uid() = user_id);

-- Criar políticas para sleep_reminders
CREATE POLICY "Usuários podem ver apenas seus próprios lembretes de sono"
  ON public.sleep_reminders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios lembretes de sono"
  ON public.sleep_reminders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios lembretes de sono"
  ON public.sleep_reminders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios lembretes de sono"
  ON public.sleep_reminders FOR DELETE
  USING (auth.uid() = user_id); 