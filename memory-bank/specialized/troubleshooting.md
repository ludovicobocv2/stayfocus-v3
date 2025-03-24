# Solução de Problemas - Migração Supabase

**Status**: [CURRENT] | Última atualização: 23/09/2023 | Versão: 1.0

## Introdução
Este documento cataloga problemas comuns que podem ocorrer durante a migração do MyNeuroApp para o Supabase, junto com suas soluções e estratégias de mitigação.

## Resumo Executivo
Durante a migração do armazenamento local para o Supabase, vários desafios técnicos podem surgir. Este guia fornece respostas rápidas para problemas frequentes, minimizando o tempo de resolução e garantindo consistência nas abordagens da equipe.

## Pontos-Chave
- Soluções para problemas comuns de autenticação
- Estratégias para lidar com erros de migração de dados
- Abordagens para resolver questões de RLS (Row Level Security)
- Otimizações para melhorar a performance
- Alternativas para funcionalidades offline

## Problemas de Autenticação

### Erro: "Não foi possível fazer login com essas credenciais"

**Sintoma**: Usuário não consegue fazer login apesar de ter credenciais corretas.

**Possíveis Causas**:
1. Email ou senha incorretos no sistema
2. Conta criada com outro método (ex: Google OAuth vs. email/senha)
3. Problemas com a configuração do provedor de autenticação

**Soluções**:
```typescript
// Verificar o método de autenticação usado
const { data, error } = await supabase
  .from('profiles')
  .select('auth_provider')
  .eq('email', email)
  .single();

if (data?.auth_provider !== 'email') {
  // Informar o usuário sobre o método correto
  showMessage(`Você se registrou usando ${data?.auth_provider}. Por favor, use este método para login.`);
}
```

### Erro: "Token expirado ou inválido"

**Sintoma**: Usuário é desconectado inesperadamente ou não consegue acessar rotas protegidas.

**Possíveis Causas**:
1. Token JWT expirado
2. Token armazenado incorretamente
3. Problemas com o middleware de autenticação

**Soluções**:
1. Implementar refresh automático de token:
```typescript
// No middleware.ts
export const middleware = async (req: NextRequest) => {
  const { supabase, response } = createRouteHandlerClient(req);
  
  try {
    // Tenta refreshar o token automaticamente
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session && req.nextUrl.pathname.startsWith('/app')) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    
    return response;
  } catch (error) {
    console.error('Erro de autenticação:', error);
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
};
```

2. Limpar localStorage e redirecionar para login:
```typescript
const handleTokenError = () => {
  localStorage.removeItem('supabase.auth.token');
  window.location.href = '/auth/login';
};
```

## Problemas de Migração de Dados

### Erro: "Violação de chave única"

**Sintoma**: A migração de dados falha com erro de duplicação.

**Possíveis Causas**:
1. Dados sendo migrados já existem no Supabase
2. Tentativas repetidas de migração
3. Índices únicos configurados no banco de dados

**Soluções**:
```typescript
// Verificar existência antes de inserir
async function migrateWithUpsert(userId, items, tableName) {
  // Para cada item a ser migrado
  for (const item of items) {
    // Tenta encontrar item existente
    const { data: existing } = await supabase
      .from(tableName)
      .select('id')
      .eq('user_id', userId)
      .eq('external_id', item.id) // ID original do localStorage
      .single();
      
    if (existing) {
      // Atualiza item existente
      await supabase
        .from(tableName)
        .update({ ...item, updated_at: new Date().toISOString() })
        .eq('id', existing.id);
    } else {
      // Insere novo item
      await supabase
        .from(tableName)
        .insert([{ ...item, user_id: userId }]);
    }
  }
}
```

### Erro: "Dados inconsistentes após migração"

**Sintoma**: Após a migração, os dados não correspondem ao estado original.

**Possíveis Causas**:
1. Transformação incorreta de dados
2. Migração parcial devido a erros
3. Problemas de concorrência durante a migração

**Soluções**:
1. Implementar verificação pós-migração:
```typescript
async function validateMigration(userId, tableName, localItems) {
  // Obter todos os itens migrados
  const { data: migrated } = await supabase
    .from(tableName)
    .select('*')
    .eq('user_id', userId);
    
  // Verificar contagem
  if (localItems.length !== migrated.length) {
    console.error(`Migração incompleta. Local: ${localItems.length}, Migrado: ${migrated.length}`);
    return false;
  }
  
  // Verificar dados críticos
  for (const local of localItems) {
    const migrated = migrated.find(m => m.external_id === local.id);
    if (!migrated || migrated.content !== local.content) {
      console.error(`Inconsistência nos dados: ${local.id}`);
      return false;
    }
  }
  
  return true;
}
```

2. Implementar migração em transação (usando funções PostgreSQL):
```sql
-- Função no Supabase SQL Editor
CREATE OR REPLACE FUNCTION migrate_user_data(
  p_user_id UUID,
  p_priorities JSONB,
  p_sleep_records JSONB,
  p_medications JSONB
) RETURNS BOOLEAN AS $$
BEGIN
  -- Deletar dados existentes
  DELETE FROM priorities WHERE user_id = p_user_id;
  DELETE FROM sleep_records WHERE user_id = p_user_id;
  DELETE FROM medications WHERE user_id = p_user_id;
  
  -- Inserir novos dados
  INSERT INTO priorities 
    SELECT * FROM jsonb_populate_recordset(null::priorities, p_priorities);
  
  INSERT INTO sleep_records 
    SELECT * FROM jsonb_populate_recordset(null::sleep_records, p_sleep_records);
    
  INSERT INTO medications 
    SELECT * FROM jsonb_populate_recordset(null::medications, p_medications);
    
  RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
  -- Rollback acontece automaticamente
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql;
```

## Problemas com Row Level Security (RLS)

### Erro: "Permissão negada para tabela X"

**Sintoma**: Operações CRUD falham com erro de permissão, apesar do usuário estar autenticado.

**Possíveis Causas**:
1. Políticas RLS mal configuradas
2. Token de autenticação não está sendo enviado corretamente
3. Usuário tentando acessar dados de outro usuário

**Soluções**:
1. Verificar e corrigir políticas RLS:
```sql
-- Exemplo de política RLS correta para tabela priorities
CREATE POLICY "Usuários podem ler suas próprias prioridades" 
ON priorities FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias prioridades" 
ON priorities FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias prioridades" 
ON priorities FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias prioridades" 
ON priorities FOR DELETE 
USING (auth.uid() = user_id);
```

2. Garantir que o user_id está sendo definido corretamente:
```typescript
const addPriority = async (priority) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuário não autenticado');
  }
  
  const { data, error } = await supabase
    .from('priorities')
    .insert({
      ...priority,
      user_id: user.id // Garantir que user_id é o ID do usuário autenticado
    });
    
  // Resto da implementação...
};
```

## Problemas de Performance

### Problema: "Carregamento lento de dados"

**Sintoma**: As operações de leitura estão demorando muito mais que no localStorage.

**Possíveis Causas**:
1. Consultas ineficientes
2. Muitos dados sendo retornados
3. Conexão de rede lenta
4. Falta de índices no banco de dados

**Soluções**:
1. Otimizar consultas para selecionar apenas os campos necessários:
```typescript
// Antes
const { data } = await supabase.from('priorities').select('*');

// Depois - selecionar apenas campos necessários
const { data } = await supabase
  .from('priorities')
  .select('id, content, due_date, completed')
  .order('created_at', { ascending: false })
  .limit(20); // Limitar número de resultados
```

2. Implementar paginação:
```typescript
const PAGE_SIZE = 10;

const getPrioritiesPaginated = async (page = 0) => {
  const { data, error } = await supabase
    .from('priorities')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
    
  return { data, error, hasMore: data?.length === PAGE_SIZE };
};
```

3. Adicionar índices no banco de dados:
```sql
-- Adicionar índice para melhorar performance de consultas por user_id
CREATE INDEX idx_priorities_user_id ON priorities(user_id);

-- Índice para ordenação por data
CREATE INDEX idx_priorities_created_at ON priorities(created_at DESC);

-- Índice composto para consultas frequentes
CREATE INDEX idx_priorities_user_completed ON priorities(user_id, completed);
```

## Problemas de Funcionalidade Offline

### Problema: "Perda de dados ao usar offline"

**Sintoma**: Dados inseridos offline não são sincronizados quando o usuário volta a ficar online.

**Possíveis Causas**:
1. Lógica de sincronização não implementada
2. Falha na detecção do estado da conexão
3. Conflitos entre dados offline e online

**Soluções**:
1. Implementar uma solução robusta de detecção de conexão:
```typescript
function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean' 
      ? navigator.onLine 
      : true
  );
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return { isOnline };
}
```

2. Armazenar alterações offline em IndexedDB e sincronizar quando online:
```typescript
// Usando Dexie.js para IndexedDB
const db = new Dexie('MyNeuroAppOffline');
db.version(1).stores({
  pendingOperations: '++id, table, operation, data, timestamp'
});

// Executar ou enfileirar operações
async function executeOrQueue(operation, table, data) {
  const { isOnline } = useNetworkStatus();
  
  if (isOnline) {
    // Executar online
    return await executeOperation(operation, table, data);
  } else {
    // Enfileirar para execução posterior
    await db.pendingOperations.add({
      table,
      operation,
      data,
      timestamp: new Date().toISOString()
    });
    
    return { success: true, isOffline: true };
  }
}

// Sincronizar quando online
async function syncPendingOperations() {
  const pendingOps = await db.pendingOperations.toArray();
  
  for (const op of pendingOps) {
    try {
      await executeOperation(op.operation, op.table, op.data);
      await db.pendingOperations.delete(op.id);
    } catch (error) {
      console.error('Erro ao sincronizar:', error);
      // Tenta novamente na próxima sincronização
    }
  }
}

// Detectar quando volta a ficar online
useEffect(() => {
  if (isOnline) {
    syncPendingOperations();
  }
}, [isOnline]);
```

## Problemas com Supabase SDK

### Erro: "Incompatibilidade de versão do SDK"

**Sintoma**: Erros de tipo ou funções não encontradas ao usar o Supabase SDK.

**Possíveis Causas**:
1. Versões incompatíveis de pacotes Supabase
2. Uso de APIs obsoletas
3. Atualizações recentes do SDK que quebram compatibilidade

**Soluções**:
1. Garantir que todas as dependências Supabase tenham versões compatíveis:
```json
// package.json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.32.0",
    "@supabase/auth-helpers-nextjs": "^0.7.4",
    "@supabase/auth-helpers-react": "^0.4.2"
  }
}
```

2. Seguir o padrão recomendado para criar clientes em Next.js:
```typescript
// lib/supabase.ts - Cliente do navegador
import { createBrowserClient } from '@supabase/auth-helpers-nextjs';

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// No middleware.ts e route handlers
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  // ...
}
```

## Resolução de Conflitos

### Problema: "Conflitos ao editar em múltiplos dispositivos"

**Sintoma**: Alterações feitas em um dispositivo sobrescrevem alterações feitas em outro dispositivo.

**Possíveis Causas**:
1. Falta de estratégia de resolução de conflitos
2. Ausência de versionamento de dados
3. Falta de timestamp para controle de modificações

**Soluções**:
1. Implementar sistema de versionamento otimista:
```typescript
async function updateWithVersion(tableName, id, updates) {
  // Obter versão atual
  const { data: current } = await supabase
    .from(tableName)
    .select('version, updated_at')
    .eq('id', id)
    .single();
    
  if (!current) return { error: 'Item não encontrado' };
  
  // Verificar se a versão local é a mais recente
  if (updates.version && updates.version < current.version) {
    return { 
      error: 'Conflito de versão', 
      conflictType: 'version',
      serverData: current 
    };
  }
  
  // Atualizar com incremento de versão
  const { data, error } = await supabase
    .from(tableName)
    .update({
      ...updates,
      version: (current.version || 0) + 1,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select();
    
  return { data, error };
}
```

2. Implementar merge de dados em caso de conflito:
```typescript
function mergeChanges(localData, serverData) {
  // Estratégia simples: usar o mais recente por campo
  const merged = { ...localData };
  
  for (const key in serverData) {
    // Se o servidor tem dados mais recentes para este campo
    if (serverData[key + '_updated_at'] > localData[key + '_updated_at']) {
      merged[key] = serverData[key];
      merged[key + '_updated_at'] = serverData[key + '_updated_at'];
    }
  }
  
  return merged;
}
```

## Feedback e Melhorias

Este documento será atualizado continuamente à medida que novos problemas e soluções forem identificados. Toda a equipe de desenvolvimento deve contribuir com novos problemas encontrados e suas respectivas soluções.

## Histórico de Revisões

| Data | Versão | Autor | Aprovador | Alterações |
|------|--------|-------|-----------|------------|
| 23/09/2023 | 1.0 | DevTeam | TechLead | Versão inicial do documento |

## Changelog

- 2023-09-23: Criação do documento de solução de problemas (v1.0) 