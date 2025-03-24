-- Funções de Teste para Integração com Backend no Supabase
-- Criado no Modo de Teste para facilitar testes de integração

-- Função para verificar a sincronização de dados entre dispositivos
-- Retorna um registro JSON com o status de sincronização para um usuário específico
CREATE OR REPLACE FUNCTION test_sync_status(test_user_id TEXT)
RETURNS JSONB AS $$
DECLARE
  sync_status JSONB;
BEGIN
  SELECT jsonb_build_object(
    'priorities', (SELECT COUNT(*) FROM priorities WHERE user_id = test_user_id),
    'sleep_records', (SELECT COUNT(*) FROM sleep_records WHERE user_id = test_user_id),
    'sleep_reminders', (SELECT COUNT(*) FROM sleep_reminders WHERE user_id = test_user_id),
    'mood_records', (SELECT COUNT(*) FROM mood_records WHERE user_id = test_user_id),
    'medications', (SELECT COUNT(*) FROM medications WHERE user_id = test_user_id),
    'medication_doses', (SELECT COUNT(*) FROM medication_doses WHERE user_id = test_user_id),
    'last_priority_update', (SELECT MAX(updated_at) FROM priorities WHERE user_id = test_user_id),
    'devices', (SELECT COUNT(DISTINCT device_id) FROM priorities WHERE user_id = test_user_id AND device_id IS NOT NULL)
  ) INTO sync_status;
  
  RETURN sync_status;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para simular operações offline em um dispositivo
-- Cria um conjunto de dados para simular atualizações offline que precisam ser sincronizadas
CREATE OR REPLACE FUNCTION simulate_offline_changes(test_user_id TEXT, device_id TEXT)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  new_priority_id TEXT;
  new_sleep_record_id TEXT;
  cur_timestamp TIMESTAMPTZ;
BEGIN
  -- Define um timestamp que está no passado (simula mudanças feitas offline)
  cur_timestamp := NOW() - INTERVAL '3 hours';
  
  -- Cria uma nova prioridade com versão incrementada
  new_priority_id := 'offline-prio-' || FLOOR(RANDOM() * 1000)::TEXT;
  INSERT INTO priorities (
    id, user_id, content, completed, due_date, created_at, 
    category, updated_at, version, device_id, last_synced_at
  ) VALUES (
    new_priority_id, 
    test_user_id, 
    'Prioridade criada offline', 
    false, 
    CURRENT_DATE + INTERVAL '2 days', 
    cur_timestamp, 
    'offline', 
    cur_timestamp, 
    (SELECT COALESCE(MAX(version), 0) + 1 FROM priorities WHERE user_id = test_user_id), 
    device_id, 
    NULL  -- NULL indica que ainda não foi sincronizado
  );
  
  -- Cria um registro de sono com timestamp defasado
  new_sleep_record_id := 'offline-sleep-' || FLOOR(RANDOM() * 1000)::TEXT;
  INSERT INTO sleep_records (
    id, user_id, start_time, end_time, quality, notes, created_at, updated_at
  ) VALUES (
    new_sleep_record_id,
    test_user_id,
    cur_timestamp - INTERVAL '8 hours',
    cur_timestamp,
    3,
    'Registro criado offline',
    cur_timestamp,
    cur_timestamp
  );
  
  -- Retorna informações sobre as alterações simuladas
  SELECT jsonb_build_object(
    'operation', 'simulate_offline_changes',
    'user_id', test_user_id,
    'device_id', device_id,
    'timestamp', cur_timestamp,
    'created_items', jsonb_build_object(
      'priority_id', new_priority_id,
      'sleep_record_id', new_sleep_record_id
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para simular conflitos de sincronização
-- Cria entradas conflitantes para o mesmo item em dispositivos diferentes
CREATE OR REPLACE FUNCTION simulate_sync_conflict(test_user_id TEXT, item_id TEXT)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  conflict_device_id TEXT := 'conflict-device-' || FLOOR(RANDOM() * 1000)::TEXT;
  original_version INT;
  conflict_item_id TEXT;
BEGIN
  -- Verifica se o item existe
  SELECT version INTO original_version FROM priorities WHERE id = item_id AND user_id = test_user_id;
  
  IF original_version IS NULL THEN
    RETURN jsonb_build_object('error', 'Item não encontrado', 'item_id', item_id);
  END IF;
  
  -- Cria uma versão conflitante do mesmo item com um dispositivo diferente
  -- mas com a mesma versão (simulando uma edição simultânea)
  conflict_item_id := 'conflict-' || item_id;
  
  INSERT INTO priorities (
    id, user_id, content, completed, due_date, created_at, 
    category, updated_at, version, device_id, last_synced_at
  )
  SELECT 
    conflict_item_id,
    user_id,
    content || ' (CONFLITO)',
    NOT completed, -- Inverte o status para garantir conflito
    due_date,
    created_at,
    category,
    NOW(), -- Atualização atual
    version, -- Mesma versão para causar conflito
    conflict_device_id,
    NULL -- Não sincronizado
  FROM priorities
  WHERE id = item_id AND user_id = test_user_id;
  
  -- Retorna informações sobre o conflito criado
  SELECT jsonb_build_object(
    'operation', 'simulate_sync_conflict',
    'user_id', test_user_id,
    'original_item_id', item_id,
    'conflict_item_id', conflict_item_id,
    'original_version', original_version,
    'conflict_device_id', conflict_device_id,
    'timestamp', NOW()
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para testar a resolução de conflitos
-- Verifica e resolve conflitos para um usuário específico
CREATE OR REPLACE FUNCTION test_resolve_conflicts(test_user_id TEXT)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  conflicts_count INT := 0;
  resolved_count INT := 0;
  conflict_record RECORD;
  winner_id TEXT;
BEGIN
  -- Encontrar itens com o mesmo item_id base (removendo o prefixo 'conflict-')
  FOR conflict_record IN (
    SELECT 
      p1.id as id1, 
      p2.id as id2, 
      p1.version as v1, 
      p2.version as v2,
      p1.updated_at as t1,
      p2.updated_at as t2
    FROM priorities p1
    JOIN priorities p2 ON 
      (p2.id = 'conflict-' || p1.id OR p1.id = 'conflict-' || p2.id) AND
      p1.user_id = p2.user_id AND
      p1.id != p2.id
    WHERE p1.user_id = test_user_id
  ) LOOP
    conflicts_count := conflicts_count + 1;
    
    -- Determinar vencedor com base no timestamp mais recente
    IF conflict_record.t1 > conflict_record.t2 THEN
      winner_id := conflict_record.id1;
      -- Excluir o perdedor
      DELETE FROM priorities WHERE id = conflict_record.id2;
    ELSE
      winner_id := conflict_record.id2;
      -- Excluir o perdedor
      DELETE FROM priorities WHERE id = conflict_record.id1;
    END IF;
    
    -- Incrementar a versão do vencedor para indicar resolução
    UPDATE priorities 
    SET 
      version = GREATEST(conflict_record.v1, conflict_record.v2) + 1,
      updated_at = NOW(),
      last_synced_at = NOW(),
      content = content || ' (Resolvido)'
    WHERE id = winner_id;
    
    resolved_count := resolved_count + 1;
  END LOOP;
  
  -- Retorna resultado da resolução
  SELECT jsonb_build_object(
    'operation', 'test_resolve_conflicts',
    'user_id', test_user_id,
    'conflicts_found', conflicts_count,
    'conflicts_resolved', resolved_count,
    'timestamp', NOW()
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para gerar relatório de testes
CREATE OR REPLACE FUNCTION generate_test_report(test_user_id TEXT)
RETURNS JSONB AS $$
DECLARE
  report JSONB;
BEGIN
  SELECT jsonb_build_object(
    'report_type', 'test_integration_summary',
    'user_id', test_user_id,
    'timestamp', NOW(),
    'data_counts', jsonb_build_object(
      'priorities', (SELECT COUNT(*) FROM priorities WHERE user_id = test_user_id),
      'sleep_records', (SELECT COUNT(*) FROM sleep_records WHERE user_id = test_user_id),
      'sleep_reminders', (SELECT COUNT(*) FROM sleep_reminders WHERE user_id = test_user_id),
      'mood_records', (SELECT COUNT(*) FROM mood_records WHERE user_id = test_user_id),
      'medications', (SELECT COUNT(*) FROM medications WHERE user_id = test_user_id),
      'medication_doses', (SELECT COUNT(*) FROM medication_doses WHERE user_id = test_user_id)
    ),
    'sync_status', jsonb_build_object(
      'devices', (SELECT COUNT(DISTINCT device_id) FROM priorities WHERE user_id = test_user_id AND device_id IS NOT NULL),
      'unsynced_items', (SELECT COUNT(*) FROM priorities WHERE user_id = test_user_id AND last_synced_at IS NULL),
      'last_sync', (SELECT MAX(last_synced_at) FROM priorities WHERE user_id = test_user_id)
    ),
    'performance', jsonb_build_object(
      'avg_query_time_ms', 15.7, -- Valor fictício para demonstração
      'peak_memory_usage_kb', 1024 -- Valor fictício para demonstração
    )
  ) INTO report;
  
  RETURN report;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 