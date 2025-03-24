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
  
  -- Remover identidades e perfil - ordem importante para respeitar chaves estrangeiras
  DELETE FROM auth.identities WHERE user_id = 'f1124575-9e57-4f71-8bf9-8d0ce5ddedf5';
  DELETE FROM profiles WHERE id = 'f1124575-9e57-4f71-8bf9-8d0ce5ddedf5';
  DELETE FROM auth.users WHERE id = 'f1124575-9e57-4f71-8bf9-8d0ce5ddedf5';
  
  -- Verificação adicional - garantir que não existe nada relacionado a este email
  DELETE FROM auth.identities WHERE identity_data->>'email' = 'test1@example.com';
  DELETE FROM profiles WHERE email = 'test1@example.com';
  DELETE FROM auth.users WHERE email = 'test1@example.com';
  
  -- Confirmar que a limpeza foi realizada
  RAISE NOTICE 'Limpeza específica do ID f1124575-9e57-4f71-8bf9-8d0ce5ddedf5 concluída';
END $$; 