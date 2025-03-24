-- Habilitar RLS em todas as tabelas
ALTER TABLE priorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_records ENABLE ROW LEVEL SECURITY;

-- Políticas para tabela priorities
CREATE POLICY "Usuários podem ver suas próprias prioridades"
ON priorities FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias prioridades"
ON priorities FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias prioridades"
ON priorities FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias prioridades"
ON priorities FOR DELETE
USING (auth.uid() = user_id);

-- Políticas para tabela medications
CREATE POLICY "Usuários podem ver seus próprios medicamentos"
ON medications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios medicamentos"
ON medications FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios medicamentos"
ON medications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios medicamentos"
ON medications FOR DELETE
USING (auth.uid() = user_id);

-- Políticas para tabela mood_records
CREATE POLICY "Usuários podem ver seus próprios registros de humor"
ON mood_records FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios registros de humor"
ON mood_records FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios registros de humor"
ON mood_records FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios registros de humor"
ON mood_records FOR DELETE
USING (auth.uid() = user_id);

-- Políticas para tabela sleep_records
CREATE POLICY "Usuários podem ver seus próprios registros de sono"
ON sleep_records FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios registros de sono"
ON sleep_records FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios registros de sono"
ON sleep_records FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios registros de sono"
ON sleep_records FOR DELETE
USING (auth.uid() = user_id); 