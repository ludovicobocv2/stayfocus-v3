-- Criar tabela para medicamentos
create table medications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name varchar(255) not null,
  dosage varchar(100),
  frequency varchar(50) not null,
  schedule time[] default '{}',
  start_date date,
  notes text,
  last_taken timestamp with time zone,
  interval_minutes integer,
  observation text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone
);

-- Criar tabela para registro de doses tomadas
create table medication_doses (
  id uuid default uuid_generate_v4() primary key,
  medication_id uuid references medications not null,
  user_id uuid references auth.users not null,
  taken_at timestamp with time zone not null,
  scheduled_time time,
  notes text,
  created_at timestamp with time zone default now()
);

-- Adicionar índices para melhorar performance
create index medications_user_id_idx on medications (user_id);
create index medications_name_idx on medications (name);
create index medication_doses_medication_id_idx on medication_doses (medication_id);
create index medication_doses_user_id_idx on medication_doses (user_id);
create index medication_doses_taken_at_idx on medication_doses (taken_at);

-- Habilitar RLS (Row Level Security)
alter table medications enable row level security;
alter table medication_doses enable row level security;

-- Criar políticas de segurança para medicamentos
create policy "Usuários podem ver apenas seus próprios medicamentos"
  on medications for select
  using (auth.uid() = user_id);

create policy "Usuários podem inserir seus próprios medicamentos"
  on medications for insert
  with check (auth.uid() = user_id);

create policy "Usuários podem atualizar seus próprios medicamentos"
  on medications for update
  using (auth.uid() = user_id);

create policy "Usuários podem deletar seus próprios medicamentos"
  on medications for delete
  using (auth.uid() = user_id);

-- Criar políticas de segurança para doses tomadas
create policy "Usuários podem ver apenas suas próprias doses tomadas"
  on medication_doses for select
  using (auth.uid() = user_id);

create policy "Usuários podem inserir suas próprias doses tomadas"
  on medication_doses for insert
  with check (auth.uid() = user_id);

create policy "Usuários podem atualizar suas próprias doses tomadas"
  on medication_doses for update
  using (auth.uid() = user_id);

create policy "Usuários podem deletar suas próprias doses tomadas"
  on medication_doses for delete
  using (auth.uid() = user_id);

-- Comentários para documentação
comment on table medications is 'Armazena informações de medicamentos dos usuários';
comment on column medications.name is 'Nome do medicamento';
comment on column medications.dosage is 'Dosagem do medicamento';
comment on column medications.frequency is 'Frequência de uso (Diária, Semanal, etc)';
comment on column medications.schedule is 'Horários programados para tomar o medicamento';
comment on column medications.start_date is 'Data de início do uso do medicamento';
comment on column medications.interval_minutes is 'Intervalo mínimo entre doses em minutos';
comment on column medications.last_taken is 'Data e hora da última dose tomada';

comment on table medication_doses is 'Registra as doses de medicamentos tomadas';
comment on column medication_doses.medication_id is 'Referência ao medicamento';
comment on column medication_doses.taken_at is 'Data e hora em que a dose foi tomada';
comment on column medication_doses.scheduled_time is 'Horário programado para a dose'; 