# Migração para Supabase

**Status**: [CURRENT] | Última atualização: 24/09/2023 | Versão: 1.2

## Introdução
Este documento descreve o plano de migração para transferir o armazenamento de dados do MyNeuroApp do localStorage para o Supabase, permitindo persistência de dados entre dispositivos e recursos avançados como autenticação e compartilhamento.

## Resumo Executivo
A migração para o Supabase está sendo realizada de forma gradual, módulo por módulo, começando com o módulo de Prioridades como piloto. A implementação segue uma abordagem em fases para minimizar o impacto na experiência do usuário e garantir uma transição suave.

## Pontos-Chave
- Implementação modular, começando pelo módulo de Prioridades
- Autenticação integrada com opções de email/senha e OAuth (Google)
- Migração de dados existentes do localStorage para o Supabase
- Políticas de segurança no nível do banco de dados (Row Level Security)
- Componentes reutilizáveis para consistência entre módulos

## Plano de Migração

### Fase 1: Configuração Inicial ✅
- **Objetivo**: Configurar o projeto Supabase e integrar com o aplicativo
- **Tarefas**:
  - Criar projeto no Supabase
  - Instalar dependências no projeto (`@supabase/supabase-js`, `@supabase/auth-helpers-nextjs`)
  - Configurar variáveis de ambiente (`.env.local`)
  - Configurar cliente Supabase no projeto (`app/lib/supabase.ts`)

### Fase 2: Estruturação do Banco de Dados ✅
- **Objetivo**: Criar tabelas e políticas de segurança
- **Tarefas**:
  - Criar tabela `profiles` para dados de usuário
  - Criar tabela `priorities` para o módulo piloto
  - Configurar Políticas de Segurança (RLS)
  - Definir triggers para criação automática de perfil
  - Criar tipos TypeScript correspondentes (`app/types/supabase.ts`)

### Fase 3: Implementação da Autenticação ✅
- **Objetivo**: Implementar autenticação de usuário
- **Tarefas**:
  - Criar hook `useAuth` para gerenciar sessões (`app/hooks/useAuth.ts`)
  - Implementar Context Provider para autenticação (`app/context/AuthContext.tsx`)
  - Criar páginas de login e registro (`app/auth/login` e `app/auth/cadastro`)
  - Configurar rota para callback de OAuth (`app/auth/callback/route.ts`)
  - Implementar middleware para proteção de rotas (`middleware.ts`)

### Fase 4: Adaptação dos Componentes ✅
- **Objetivo**: Adaptar componentes existentes para utilizar Supabase
- **Tarefas**:
  - Atualizar Header para mostrar estado de autenticação
  - Criar componente de menu de usuário
  - Implementar feedback visual para estados de carregamento
  - Criar componentes Toast e LoadingIndicator para feedback de operações
  - Implementar ToastContext para gerenciamento de notificações

### Fase 5: Migração de Dados ⏳
- **Objetivo**: Migrar dados existentes do localStorage para o Supabase
- **Tarefas**:
  - Implementar função de migração para o módulo de Prioridades ✅
  - Criar UI para migração assistida ✅
  - Adicionar opção para manter ou limpar dados locais após migração ✅
  - Implementar verificação de dados duplicados
  - Testar migração em diferentes cenários

### Fase 6: Criação de Hooks para Acesso a Dados ✅
- **Objetivo**: Criar hooks reutilizáveis para acesso a dados
- **Tarefas**:
  - Criar hook `usePriorities` para o módulo piloto
  - Implementar funções CRUD padronizadas
  - Adicionar tratamento de erros robusto
  - Criar tipos TypeScript para os hooks
  - Documentar padrões para outros hooks

## Interface de Migração de Dados

A interface de migração implementada em `app/components/perfil/DataMigration.tsx` oferece uma experiência de migração intuitiva para o usuário:

1. **Detecção automática de dados** - Verifica se existem dados no localStorage para migrar
2. **Opção de limpeza** - Permite ao usuário escolher se deseja remover os dados locais após a migração
3. **Feedback visual** - Mostra o progresso da migração e notifica sobre o sucesso ou falha
4. **Resumo de resultados** - Exibe quantos itens foram migrados com sucesso

```typescript
// Trecho simplificado da implementação
const startMigration = async () => {
  setIsMigrating(true);
  
  try {
    const result = await migrateFromLocalStorage();
    
    if (result.success) {
      setShowSuccess(true);
      setMigrationCount(result.count);
      showToast(`${result.count} prioridades migradas com sucesso`, 'success');
      
      if (shouldClearLocal && result.count > 0) {
        clearLocalData();
      }
    } else {
      showToast(`Erro na migração: ${result.error}`, 'error');
    }
  } catch (error) {
    showToast('Erro ao migrar dados', 'error');
  } finally {
    setIsMigrating(false);
  }
};
```

## Estrutura do Banco de Dados

### Tabela `profiles`
```sql
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text,
  full_name text,
  email text not null,
  preferences jsonb
);

-- Criar automaticamente um perfil para novos usuários
create function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### Tabela `priorities`
```sql
create table priorities (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  content text not null,
  completed boolean default false,
  due_date date,
  created_at timestamp with time zone default now(),
  category text,
  updated_at timestamp with time zone
);

-- Habilitar RLS
alter table priorities enable row level security;

-- Criar políticas
create policy "Usuários podem ver apenas suas próprias prioridades"
  on priorities for select
  using (auth.uid() = user_id);

create policy "Usuários podem inserir suas próprias prioridades"
  on priorities for insert
  with check (auth.uid() = user_id);

create policy "Usuários podem atualizar suas próprias prioridades"
  on priorities for update
  using (auth.uid() = user_id);

create policy "Usuários podem deletar suas próprias prioridades"
  on priorities for delete
  using (auth.uid() = user_id);
```

## Estratégia de Migração de Dados

Para migrar dados do localStorage para o Supabase, usamos a seguinte abordagem:

1. **Verificação** - Verificar se há dados no localStorage
2. **Extração** - Extrair e transformar dados para o formato do Supabase
3. **Validação** - Validar dados antes da migração
4. **Inserção** - Inserir dados no Supabase
5. **Confirmação** - Confirmar sucesso e oferecer opção de limpar localStorage

```typescript
// Exemplo simplificado da função de migração
const migratePriorities = async () => {
  // Verificar autenticação
  if (!user) return { success: false, error: 'Usuário não autenticado' };
  
  // Obter dados do localStorage
  const localData = localStorage.getItem('prioridades-diarias');
  if (!localData) return { success: true, count: 0 };
  
  // Transformar dados
  const parsedData = JSON.parse(localData);
  const priorities = parsedData.state.prioridades.map(p => ({
    content: p.texto,
    completed: p.concluida,
    due_date: p.data,
    user_id: user.id
  }));
  
  // Inserir no Supabase
  const { error } = await supabase.from('priorities').insert(priorities);
  
  if (error) return { success: false, error };
  return { success: true, count: priorities.length };
};
```

## Benefícios da Migração

1. **Sincronização entre dispositivos** - Dados acessíveis de qualquer dispositivo
2. **Segurança** - Dados protegidos por autenticação e políticas de segurança
3. **Backup automático** - Dados armazenados no servidor com backup
4. **Funcionalidades sociais** - Possibilidade de compartilhamento e colaboração
5. **Escalabilidade** - Suporte para grandes volumes de dados

## Próximos Passos

Após a conclusão da Fase 5, seguiremos com:

1. **Fase de Validação** - Testar a migração em diferentes cenários e com diferentes volumes de dados
2. **Expansão para outros módulos** - Aplicar a mesma estratégia para outros módulos, começando pelo módulo de Sono
3. **Melhorias de UX** - Refinar a experiência de migração com base no feedback dos usuários
4. **Monitoramento** - Implementar ferramentas para monitorar o sucesso da migração e resolver problemas 

## Histórico de Revisões

| Data | Versão | Autor | Aprovador | Alterações |
|------|--------|-------|-----------|------------|
| 24/09/2023 | 1.2 | DevTeam | TechLead | Atualização sobre implementação da interface de migração |
| 23/09/2023 | 1.1 | DevTeam | TechLead | Atualização sobre progresso da Fase 3 |
| 15/09/2023 | 1.0 | DevTeam | TechLead | Versão inicial do documento |

## Changelog

- 2023-09-24: Atualização sobre a implementação da interface de migração (v1.2)
- 2023-09-23: Atualização sobre a implementação da autenticação (v1.1)
- 2023-09-15: Criação do documento de migração (v1.0) 