# Hooks Supabase: Padrões e Implementação

**Status**: [CURRENT] | Última atualização: 23/09/2023 | Versão: 1.1

## Introdução
Este documento define os padrões para a criação e utilização de hooks React para acesso a dados no Supabase no MyNeuroApp. Estes hooks seguem uma estrutura consistente para garantir uniformidade e facilidade de manutenção.

## Resumo Executivo
Para facilitar o acesso aos dados do Supabase no MyNeuroApp, utilizamos hooks React personalizados que encapsulam a lógica de acesso a dados e gerenciamento de estado. Cada módulo do aplicativo tem seu próprio hook especializado que segue um padrão comum.

## Pontos-Chave
- Hooks encapsulam lógica de acesso ao Supabase
- Estrutura padronizada para funções CRUD
- Tratamento de erros consistente
- Estado de carregamento centralizado
- Suporte para migração de dados do localStorage

## Estrutura do Hook Padrão

Todos os hooks do Supabase seguem a estrutura básica:

```typescript
export function useEntity() {
  const supabase = createClient();
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const resetError = useCallback(() => {
    setError(null);
  }, []);
  
  // Funções CRUD...
  
  return {
    // Estado
    isLoading,
    error,
    resetError,
    
    // Operações CRUD
    getItems,
    getItem,
    addItem,
    updateItem,
    deleteItem,
    
    // Funções específicas da entidade
    // ...
    
    // Migração (se aplicável)
    migrateFromLocalStorage
  };
}
```

## Hooks Implementados

### `useAuth`

Hook para gerenciamento de autenticação:

```typescript
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Métodos de autenticação (signIn, signUp, signOut, etc.)
  
  return {
    user,
    session,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    // ...
  };
}
```

### `usePriorities`

Hook para gerenciamento de prioridades:

```typescript
export function usePriorities() {
  const supabase = createClient();
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Funções CRUD para prioridades
  const getPriorities = async (): Promise<Priority[]> => {
    if (!user) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('priorities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw new Error(error.message);
      
      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar prioridades';
      setError(new Error(errorMessage));
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  // Outras funções CRUD...
  
  // Migração de prioridades do localStorage
  const migrateFromLocalStorage = async (): Promise<{ success: boolean; count: number; error?: string }> => {
    // Implementação da migração...
  };
  
  return {
    isLoading,
    error,
    resetError,
    getPriorities,
    getPriority,
    addPriority,
    updatePriority,
    togglePriorityCompletion,
    deletePriority,
    migrateFromLocalStorage
  };
}
```

## Padrões de Nomenclatura

### Nomes de Hooks
- Sempre prefixado com `use` (convenção React)
- Nome no plural para hooks que lidam com coleções (`usePriorities`, `useMedications`)
- Nome no singular para hooks que lidam com uma única entidade (`useUser`, `useProfile`)

### Nomes de Métodos
- `getItems`: Buscar todos os itens (plural)
- `getItem`: Buscar um item específico (singular)
- `addItem`: Adicionar um novo item
- `updateItem`: Atualizar um item existente
- `deleteItem`: Excluir um item
- `toggleItemFeature`: Alternar uma propriedade booleana
- `migrateFromLocalStorage`: Migrar dados do localStorage para o Supabase

## Tratamento de Erros

Todos os hooks seguem o mesmo padrão de tratamento de erros:

1. Centralização do estado de erro em um único `useState`
2. Try/catch em todas as operações assíncronas
3. Formatação consistente de mensagens de erro
4. Método `resetError` para limpar o estado de erro

```typescript
try {
  // Operação com Supabase
  if (error) throw new Error(error.message);
  return data;
} catch (err) {
  const errorMessage = err instanceof Error ? err.message : 'Erro genérico';
  setError(new Error(errorMessage));
  return null; // ou array vazio, dependendo do contexto
} finally {
  setIsLoading(false);
}
```

## Estado de Carregamento

Para controlar o estado de carregamento, seguimos o padrão:

1. Iniciar o `isLoading` como `false`
2. Definir como `true` no início de cada operação assíncroma
3. Definir como `false` no bloco `finally`
4. Expor `isLoading` no retorno do hook

## Migração de Dados

Para hooks que oferecem funcionalidade de migração:

1. Acessar dados do localStorage
2. Transformar para o formato do Supabase
3. Validar dados antes da migração
4. Inserir no Supabase
5. Retornar resultado com contagem e status

```typescript
const migrateFromLocalStorage = async () => {
  // Verificar autenticação
  if (!user) return { success: false, count: 0, error: 'Usuário não autenticado' };
  
  setIsLoading(true);
  setError(null);
  
  try {
    // Obter dados do localStorage
    const localData = localStorage.getItem('key');
    if (!localData) return { success: true, count: 0 };
    
    // Transformar dados
    const parsedData = JSON.parse(localData);
    // Validação e transformação...
    
    // Inserir no Supabase
    // ...
    
    return { success: true, count: items.length };
  } catch (err) {
    // Tratamento de erro...
  } finally {
    setIsLoading(false);
  }
};
```

## Uso com Context API

Para compartilhar estados em toda a aplicação, combinamos hooks com Context API:

```typescript
// No provedor de contexto (simplificado)
const AuthProvider = ({ children }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Em um componente
const { user, signIn } = useAuthContext();
```

## Próximos Hooks Planejados

À medida que a migração avança, os seguintes hooks serão implementados:

1. `useSleep` - Gerenciamento de dados de sono
2. `useMedications` - Gerenciamento de medicamentos
3. `useMood` - Gerenciamento de registros de humor
4. `useStudy` - Gerenciamento de sessões de estudo

## Melhores Práticas

1. **Sempre verificar autenticação** no início de cada função
2. **Centralizar tratamento de erros** para facilitar depuração
3. **Usar tipos TypeScript** para melhorar a experiência de desenvolvimento
4. **Separar lógica de UI** da lógica de acesso a dados
5. **Documentar hooks** com JSDoc para melhor intellisense
6. **Testes unitários** para validar comportamento dos hooks

## Histórico de Revisões

| Data | Versão | Autor | Aprovador | Alterações |
|------|--------|-------|-----------|------------|
| 23/09/2023 | 1.1 | DevTeam | TechLead | Adição do hook usePriorities e padrões atualizados |
| 15/09/2023 | 1.0 | DevTeam | TechLead | Versão inicial |

## Changelog

- 2023-09-23: Criação do documento de padrões de hooks (v1.0) 