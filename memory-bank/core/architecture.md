# Arquitetura da Migração para Supabase

## Introdução
Este documento descreve a arquitetura técnica da migração do MyNeuroApp para Supabase, incluindo a estrutura de dados, fluxos de autenticação e padrões de acesso.

## Resumo Executivo
A arquitetura da migração envolve a transição de um modelo de armazenamento local (localStorage) para um sistema de banco de dados relacional gerenciado pelo Supabase, com autenticação de usuários e políticas de segurança em nível de linha (RLS).

## Pontos-Chave
- Autenticação baseada em JWT com Supabase Auth
- Políticas de segurança RLS para proteção de dados
- Hooks React personalizados para acesso a dados
- Migração transparente de dados locais para a nuvem
- Suporte para sincronização offline/online

## Arquitetura de Dados

### Modelo de Dados

```
┌─────────────┐       ┌──────────────┐       ┌───────────────┐
│   profiles  │       │ user_settings │       │   priorities  │
├─────────────┤       ├──────────────┤       ├───────────────┤
│ id (PK)     │───┐   │ id (PK)      │       │ id (PK)       │
│ user_id (FK)│   └──>│ user_id (FK) │       │ user_id (FK)  │
│ name        │       │ theme        │       │ title         │
│ avatar_url  │       │ notifications│       │ description   │
│ created_at  │       │ created_at   │       │ status        │
└─────────────┘       └──────────────┘       │ created_at    │
                                             └───────────────┘
      ┌────────────────┐       ┌───────────────┐
      │  sleep_records  │       │  medications  │
      ├────────────────┤       ├───────────────┤
      │ id (PK)         │       │ id (PK)       │
      │ user_id (FK)    │       │ user_id (FK)  │
      │ date            │       │ name          │
      │ duration        │       │ dosage        │
      │ quality         │       │ frequency     │
      │ notes           │       │ time          │
      │ created_at      │       │ created_at    │
      └────────────────┘       └───────────────┘
                  
      ┌────────────────┐       ┌───────────────┐
      │  mood_records   │       │     studies   │
      ├────────────────┤       ├───────────────┤
      │ id (PK)         │       │ id (PK)       │
      │ user_id (FK)    │       │ user_id (FK)  │
      │ date            │       │ title         │
      │ mood            │       │ description   │
      │ notes           │       │ duration      │
      │ created_at      │       │ completed     │
      └────────────────┘       │ created_at    │
                              └───────────────┘
```

### Políticas de Segurança (RLS)

Todas as tabelas terão as seguintes políticas:

1. **Leitura**: Usuários podem ler apenas seus próprios dados
   ```sql
   CREATE POLICY "Usuários podem ler seus próprios dados" ON [tabela]
   FOR SELECT USING (auth.uid() = user_id);
   ```

2. **Inserção**: Usuários podem inserir apenas seus próprios dados
   ```sql
   CREATE POLICY "Usuários podem inserir seus próprios dados" ON [tabela]
   FOR INSERT WITH CHECK (auth.uid() = user_id);
   ```

3. **Atualização**: Usuários podem atualizar apenas seus próprios dados
   ```sql
   CREATE POLICY "Usuários podem atualizar seus próprios dados" ON [tabela]
   FOR UPDATE USING (auth.uid() = user_id);
   ```

4. **Exclusão**: Usuários podem excluir apenas seus próprios dados
   ```sql
   CREATE POLICY "Usuários podem excluir seus próprios dados" ON [tabela]
   FOR DELETE USING (auth.uid() = user_id);
   ```

## Arquitetura de Autenticação

### Fluxo de Autenticação

```
┌─────────────┐     ┌───────────────┐     ┌─────────────┐
│ Login/Signup│────>│ Supabase Auth │────>│ JWT + User  │
└─────────────┘     └───────────────┘     └─────────────┘
                           │                     │
                           v                     v
                    ┌───────────────┐    ┌──────────────┐
                    │ Auth Provider │───>│ Auth Context │
                    └───────────────┘    └──────────────┘
                                                │
                                                v
                                         ┌──────────────┐
                                         │  Protected   │
                                         │   Routes     │
                                         └──────────────┘
```

### Middleware de Autenticação

O middleware de autenticação protegerá rotas específicas, redirecionando usuários não autenticados:

```typescript
// middleware.ts
export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session && req.nextUrl.pathname.startsWith('/app')) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return res;
};
```

## Arquitetura de Acesso a Dados

### Padrão de Hook

Todos os hooks seguirão o mesmo padrão estrutural:

```typescript
// Exemplo de hook para Prioridades
export function usePriorities() {
  const { supabase, user } = useSupabase();
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Carregar dados
  const fetchPriorities = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('priorities')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setPriorities(data || []);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  };
  
  // Criar item
  const createPriority = async (priority: Omit<Priority, 'id' | 'user_id'>) => {
    try {
      const { data, error } = await supabase
        .from('priorities')
        .insert({ ...priority, user_id: user?.id })
        .select()
        .single();
        
      if (error) throw error;
      setPriorities([data, ...priorities]);
      return data;
    } catch (e) {
      setError(e as Error);
      throw e;
    }
  };
  
  // Atualizar item
  // Excluir item
  
  useEffect(() => {
    if (user) fetchPriorities();
  }, [user]);
  
  return {
    priorities,
    loading,
    error,
    fetchPriorities,
    createPriority,
    updatePriority,
    deletePriority
  };
}
```

### Sincronização Offline/Online

O hook `useSync` gerenciará a sincronização entre dados locais e Supabase:

```typescript
export function useSync() {
  const { supabase, user } = useSupabase();
  const [online, setOnline] = useState<boolean>(typeof window !== 'undefined' ? navigator.onLine : true);
  const [syncQueue, setSyncQueue] = useState<SyncOperation[]>([]);
  
  // Lógica de sincronização 
  // ...
}
```

## Estratégia de Migração de Dados

O processo de migração ocorrerá quando um usuário se registrar ou fizer login pela primeira vez:

1. Obter todos os dados do localStorage
2. Criar usuário e perfil no Supabase
3. Migrar cada tipo de dado (prioridades, sono, medicamentos, etc.)
4. Atualizar localStorage com flag `migrated: true`
5. Redirecionar para o aplicativo

## Considerações de Performance

- Implementação de paginação para tabelas com muitos registros
- Uso de funções RPC para operações complexas
- Cache de dados frequentemente usados
- Estratégia de refetching otimizada

## Feedback e Revisão

Este documento deve ser revisado pela equipe técnica antes da implementação. Ajustes na arquitetura podem ser necessários durante o desenvolvimento.

## Histórico de Revisões

| Versão | Data | Autor | Descrição |
|--------|------|-------|-----------|
| 1.0 | [DATA ATUAL] | [AUTOR] | Versão inicial da arquitetura | 