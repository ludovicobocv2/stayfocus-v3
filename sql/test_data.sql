-- Schema Teste para Integração com Backend Supabase
-- Criado no Modo de Teste para validar a integração entre frontend e backend

-- Limpeza específica do ID problemático
DO $$
BEGIN
  -- Primeiro limpar todas as referências a este ID específico
  DELETE FROM mood_records WHERE user_id = 'f1124575-9e57-4f71-8bf9-8d0ce5ddedf5';
  DELETE FROM sleep_reminders WHERE user_id = 'f1124575-9e57-4f71-8bf9-8d0ce5ddedf5';
  DELETE FROM sleep_records WHERE user_id = 'f1124575-9e57-4f71-8bf9-8d0ce5ddedf5';
  DELETE FROM priorities WHERE user_id = 'f1124575-9e57-4f71-8bf9-8d0ce5ddedf5';
  DELETE FROM medication_doses WHERE user_id = 'f1124575-9e57-4f71-8bf9-8d0ce5ddedf5';
  DELETE FROM medications WHERE user_id = 'f1124575-9e57-4f71-8bf9-8d0ce5ddedf5';
  
  -- Remover identidades e perfil
  DELETE FROM auth.identities WHERE user_id = 'f1124575-9e57-4f71-8bf9-8d0ce5ddedf5';
  DELETE FROM profiles WHERE id = 'f1124575-9e57-4f71-8bf9-8d0ce5ddedf5';
  DELETE FROM auth.users WHERE id = 'f1124575-9e57-4f71-8bf9-8d0ce5ddedf5';
  
  -- Confirmar que todas as limpezas foram realizadas
  RAISE NOTICE 'Limpeza específica do ID f1124575-9e57-4f71-8bf9-8d0ce5ddedf5 concluída';
END $$;

-- Criar usuários de teste e perfis associados
DO $$
DECLARE
  user1_id UUID := uuid_generate_v4(); -- Usar um UUID novo gerado aleatoriamente ao invés do conflitante
  user2_id UUID := uuid_generate_v4();
BEGIN
  -- Primeiro, remover dados antigos para evitar violações de chave primária
  -- Remover dados de teste
  DELETE FROM mood_records WHERE user_id IN (SELECT id FROM profiles WHERE email IN ('test1@example.com', 'test2@example.com'));
  DELETE FROM sleep_reminders WHERE user_id IN (SELECT id FROM profiles WHERE email IN ('test1@example.com', 'test2@example.com'));
  DELETE FROM sleep_records WHERE user_id IN (SELECT id FROM profiles WHERE email IN ('test1@example.com', 'test2@example.com'));
  DELETE FROM priorities WHERE user_id IN (SELECT id FROM profiles WHERE email IN ('test1@example.com', 'test2@example.com'));
  DELETE FROM medication_doses WHERE user_id IN (SELECT id FROM profiles WHERE email IN ('test1@example.com', 'test2@example.com'));
  DELETE FROM medications WHERE user_id IN (SELECT id FROM profiles WHERE email IN ('test1@example.com', 'test2@example.com'));
  
  -- Limpar usuários e perfis de forma mais segura
  DELETE FROM auth.identities WHERE user_id IN (
    SELECT id FROM auth.users WHERE email IN ('test1@example.com', 'test2@example.com')
  );
  DELETE FROM profiles WHERE email IN ('test1@example.com', 'test2@example.com');
  DELETE FROM auth.users WHERE email IN ('test1@example.com', 'test2@example.com');
  
  -- Agora inserir os usuários na tabela auth.users
  INSERT INTO auth.users (id, email, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at)
  VALUES 
    (user1_id, 'test1@example.com', CURRENT_TIMESTAMP, '{"provider":"email","providers":["email"]}', '{"name":"Usuário de Teste 1"}', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (user2_id, 'test2@example.com', CURRENT_TIMESTAMP, '{"provider":"email","providers":["email"]}', '{"name":"Usuário de Teste 2"}', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

  -- Inserir identidades para autenticação (uma por vez para evitar conflitos)
  INSERT INTO auth.identities (provider_id, id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  VALUES 
    ('email_' || user1_id, user1_id, user1_id, jsonb_build_object('sub', user1_id, 'email', 'test1@example.com'), 'email', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
  
  INSERT INTO auth.identities (provider_id, id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  VALUES 
    ('email_' || user2_id, user2_id, user2_id, jsonb_build_object('sub', user2_id, 'email', 'test2@example.com'), 'email', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

  -- Agora inserir os perfis, um por vez para evitar conflitos
  INSERT INTO profiles (id, email, full_name, updated_at, preferences)
  VALUES 
    (user1_id, 'test1@example.com', 'Usuário de Teste 1', CURRENT_TIMESTAMP, '{"theme": "dark", "notifications": true}');
    
  INSERT INTO profiles (id, email, full_name, updated_at, preferences)
  VALUES
    (user2_id, 'test2@example.com', 'Usuário de Teste 2', CURRENT_TIMESTAMP, '{"theme": "light", "notifications": false}');

  -- Inserir prioridades de teste usando os UUIDs
  INSERT INTO priorities (id, user_id, content, completed, due_date, created_at, category, updated_at, version, device_id, last_synced_at)
  VALUES 
    (uuid_generate_v4(), user1_id, 'Prioridade teste 1', false, CURRENT_DATE + INTERVAL '1 day', CURRENT_TIMESTAMP, 'trabalho', CURRENT_TIMESTAMP, 1, 'device-1', CURRENT_TIMESTAMP),
    (uuid_generate_v4(), user1_id, 'Prioridade teste 2', true, CURRENT_DATE - INTERVAL '1 day', CURRENT_TIMESTAMP, 'pessoal', CURRENT_TIMESTAMP, 1, 'device-1', CURRENT_TIMESTAMP),
    (uuid_generate_v4(), user2_id, 'Prioridade teste 3', false, CURRENT_DATE + INTERVAL '3 day', CURRENT_TIMESTAMP, 'estudos', CURRENT_TIMESTAMP, 1, 'device-2', CURRENT_TIMESTAMP);

  -- Inserir registros de sono de teste
  INSERT INTO sleep_records (id, user_id, start_time, end_time, quality, notes, created_at, updated_at)
  VALUES 
    (uuid_generate_v4(), user1_id, CURRENT_TIMESTAMP - INTERVAL '8 hours', CURRENT_TIMESTAMP, 4, 'Dormi bem', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (uuid_generate_v4(), user1_id, CURRENT_TIMESTAMP - INTERVAL '32 hours', CURRENT_TIMESTAMP - INTERVAL '24 hours', 2, 'Dormi mal', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (uuid_generate_v4(), user2_id, CURRENT_TIMESTAMP - INTERVAL '9 hours', CURRENT_TIMESTAMP - INTERVAL '1 hour', 5, 'Dormi muito bem', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

  -- Inserir lembretes de sono de teste
  INSERT INTO sleep_reminders (id, user_id, type, time, days_of_week, active, created_at, updated_at)
  VALUES 
    (uuid_generate_v4(), user1_id, 'dormir', '22:00:00', ARRAY[1,2,3,4,5], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (uuid_generate_v4(), user1_id, 'acordar', '07:00:00', ARRAY[1,2,3,4,5], true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (uuid_generate_v4(), user2_id, 'dormir', '23:00:00', ARRAY[1,2,3,4,5,6,7], false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

  -- Inserir registros de humor de teste
  INSERT INTO mood_records (id, user_id, record_date, mood_level, factors, notes, created_at, updated_at)
  VALUES 
    (uuid_generate_v4(), user1_id, CURRENT_DATE, 4, ARRAY['trabalho', 'exercício'], 'Dia produtivo', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (uuid_generate_v4(), user1_id, CURRENT_DATE - INTERVAL '1 day', 2, ARRAY['estresse', 'sono ruim'], 'Dia difícil', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (uuid_generate_v4(), user2_id, CURRENT_DATE, 5, ARRAY['lazer', 'família'], 'Dia excelente', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
END $$;

-- Função para criar usuário de teste automaticamente com configurações de teste
CREATE OR REPLACE FUNCTION create_test_user(test_email TEXT, test_password TEXT)
RETURNS UUID AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Verificar se o usuário já existe e remover
  DELETE FROM profiles WHERE email = test_email;
  DELETE FROM auth.identities WHERE identity_data->>'email' = test_email;
  DELETE FROM auth.users WHERE email = test_email;
  
  -- Gerar um novo UUID para o usuário
  new_user_id := uuid_generate_v4();
  
  -- Criar um novo usuário usando a função auth.sign_up
  INSERT INTO auth.users (id, email, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at)
  VALUES (
    new_user_id,
    test_email,
    CURRENT_TIMESTAMP,
    '{"provider":"email","providers":["email"]}',
    '{"name":"Usuário de Teste"}',
    FALSE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  );
  
  -- Inserir as credenciais
  INSERT INTO auth.identities (provider_id, id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  VALUES (
    'email_' || new_user_id,
    new_user_id,
    new_user_id,
    jsonb_build_object('sub', new_user_id, 'email', test_email),
    'email',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  );
  
  -- Criar um perfil para o usuário
  INSERT INTO public.profiles (id, email, full_name, updated_at)
  VALUES (
    new_user_id,
    test_email,
    'Usuário de Teste Automático',
    CURRENT_TIMESTAMP
  );
  
  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para limpar todos os dados de teste
CREATE OR REPLACE FUNCTION clear_test_data()
RETURNS VOID AS $$
BEGIN
  -- Remover dados de teste
  DELETE FROM mood_records 
  WHERE user_id IN (SELECT id FROM profiles WHERE email LIKE 'test%@example.com');
  
  DELETE FROM sleep_reminders 
  WHERE user_id IN (SELECT id FROM profiles WHERE email LIKE 'test%@example.com');
  
  DELETE FROM sleep_records 
  WHERE user_id IN (SELECT id FROM profiles WHERE email LIKE 'test%@example.com');
  
  DELETE FROM priorities 
  WHERE user_id IN (SELECT id FROM profiles WHERE email LIKE 'test%@example.com');
  
  -- Obter IDs dos usuários de teste para limpar auth tables
  WITH test_users AS (
    SELECT id FROM profiles WHERE email LIKE 'test%@example.com'
  )
  DELETE FROM auth.identities 
  WHERE user_id IN (SELECT id FROM test_users);
  
  -- Finalmente remover os perfis e usuários
  WITH test_users AS (
    SELECT id FROM profiles WHERE email LIKE 'test%@example.com'
  )
  DELETE FROM auth.users 
  WHERE id IN (SELECT id FROM test_users);
  
  DELETE FROM profiles 
  WHERE email LIKE 'test%@example.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 