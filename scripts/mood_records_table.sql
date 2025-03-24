-- Criar tabela para registros de humor
create table mood_records (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  record_date date not null,
  mood_level integer not null check (mood_level >= 1 and mood_level <= 10),
  factors text[] default '{}',
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone
);

-- Adicionar índices para melhorar performance
create index mood_records_user_id_idx on mood_records (user_id);
create index mood_records_record_date_idx on mood_records (record_date);

-- Habilitar RLS (Row Level Security)
alter table mood_records enable row level security;

-- Criar políticas de segurança
create policy "Usuários podem ver apenas seus próprios registros de humor"
  on mood_records for select
  using (auth.uid() = user_id);

create policy "Usuários podem inserir seus próprios registros de humor"
  on mood_records for insert
  with check (auth.uid() = user_id);

create policy "Usuários podem atualizar seus próprios registros de humor"
  on mood_records for update
  using (auth.uid() = user_id);

create policy "Usuários podem deletar seus próprios registros de humor"
  on mood_records for delete
  using (auth.uid() = user_id);

-- Comentários para documentação
comment on table mood_records is 'Armazena registros diários de humor dos usuários';
comment on column mood_records.record_date is 'Data do registro de humor';
comment on column mood_records.mood_level is 'Nível de humor em uma escala de 1 a 10';
comment on column mood_records.factors is 'Fatores que influenciaram o humor do usuário';
comment on column mood_records.notes is 'Notas adicionais sobre o registro de humor'; 