-- Adicionar campos de versionamento em todas as tabelas principais

-- Tabela priorities
ALTER TABLE priorities
ADD COLUMN version INTEGER DEFAULT 1,
ADD COLUMN device_id TEXT,
ADD COLUMN last_synced_at TIMESTAMP WITH TIME ZONE;

-- Tabela medications
ALTER TABLE medications
ADD COLUMN version INTEGER DEFAULT 1,
ADD COLUMN device_id TEXT,
ADD COLUMN last_synced_at TIMESTAMP WITH TIME ZONE;

-- Tabela mood_records
ALTER TABLE mood_records
ADD COLUMN version INTEGER DEFAULT 1,
ADD COLUMN device_id TEXT,
ADD COLUMN last_synced_at TIMESTAMP WITH TIME ZONE;

-- Tabela sleep_records
ALTER TABLE sleep_records
ADD COLUMN version INTEGER DEFAULT 1,
ADD COLUMN device_id TEXT,
ADD COLUMN last_synced_at TIMESTAMP WITH TIME ZONE;

-- Criar índices para otimizar consultas de sincronização
CREATE INDEX idx_priorities_sync ON priorities (user_id, last_synced_at);
CREATE INDEX idx_medications_sync ON medications (user_id, last_synced_at);
CREATE INDEX idx_mood_records_sync ON mood_records (user_id, last_synced_at);
CREATE INDEX idx_sleep_records_sync ON sleep_records (user_id, last_synced_at);

-- Função para atualizar version e last_synced_at
CREATE OR REPLACE FUNCTION update_version_and_sync()
RETURNS TRIGGER AS $$
BEGIN
    NEW.version = OLD.version + 1;
    NEW.last_synced_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar triggers para atualizar version automaticamente
CREATE TRIGGER update_priorities_version
    BEFORE UPDATE ON priorities
    FOR EACH ROW
    EXECUTE FUNCTION update_version_and_sync();

CREATE TRIGGER update_medications_version
    BEFORE UPDATE ON medications
    FOR EACH ROW
    EXECUTE FUNCTION update_version_and_sync();

CREATE TRIGGER update_mood_records_version
    BEFORE UPDATE ON mood_records
    FOR EACH ROW
    EXECUTE FUNCTION update_version_and_sync();

CREATE TRIGGER update_sleep_records_version
    BEFORE UPDATE ON sleep_records
    FOR EACH ROW
    EXECUTE FUNCTION update_version_and_sync(); 