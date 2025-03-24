# Estratégia de Testes para Migração Supabase

## Introdução
Este documento detalha a estratégia de testes para garantir que a migração do MyNeuroApp para Supabase seja realizada de forma segura e confiável.

## Resumo Executivo
A estratégia de testes abrange testes unitários, de integração e de ponta a ponta para validar todos os aspectos da migração, incluindo autenticação, acesso a dados e migração de dados locais.

## Pontos-Chave
- Testes unitários para hooks e funções de migração
- Testes de integração para validar interações com Supabase
- Testes de ponta a ponta para fluxos completos
- Testes de migração para validar preservação de dados
- Testes de segurança para validar políticas RLS

## Plano de Testes

### 1. Testes Unitários

#### 1.1 Hooks de Acesso a Dados
Todos os hooks de acesso a dados serão testados com Jest e React Testing Library:

```typescript
// Exemplo de teste para usePriorities
describe('usePriorities', () => {
  it('deve carregar prioridades corretamente', async () => {
    // Mock do retorno do Supabase
    mockSupabaseQuery.mockResolvedValueOnce({
      data: [{ id: 1, title: 'Prioridade 1', user_id: 'user-123' }],
      error: null
    });
    
    const { result, waitForNextUpdate } = renderHook(() => usePriorities());
    
    expect(result.current.loading).toBe(true);
    await waitForNextUpdate();
    
    expect(result.current.priorities).toHaveLength(1);
    expect(result.current.priorities[0].title).toBe('Prioridade 1');
    expect(result.current.loading).toBe(false);
  });
  
  // Testes para criar, atualizar e excluir
  // ...
});
```

#### 1.2 Funções de Migração
Testes para funções de migração de dados do localStorage para Supabase:

```typescript
describe('migrateData', () => {
  it('deve migrar prioridades corretamente', async () => {
    // Mock do localStorage
    localStorage.setItem('priorities', JSON.stringify([
      { id: 'local-1', title: 'Prioridade Local' }
    ]));
    
    // Mock do Supabase
    mockSupabaseInsert.mockResolvedValueOnce({
      data: { id: 'supabase-1', title: 'Prioridade Local', user_id: 'user-123' },
      error: null
    });
    
    const result = await migratePriorities('user-123');
    
    expect(result.success).toBe(true);
    expect(result.migratedCount).toBe(1);
    expect(mockSupabaseInsert).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Prioridade Local'
    }));
  });
});
```

#### 1.3 Componentes de Interface
Testes para componentes com interações de autenticação:

```typescript
describe('Header', () => {
  it('deve mostrar botão de login quando usuário não estiver autenticado', () => {
    const { getByText } = render(<Header />);
    expect(getByText('Entrar')).toBeInTheDocument();
  });
  
  it('deve mostrar perfil do usuário quando autenticado', () => {
    mockUseUser.mockReturnValueOnce({ 
      user: { id: 'user-123', email: 'user@example.com' }, 
      loading: false 
    });
    
    const { getByText } = render(<Header />);
    expect(getByText('user@example.com')).toBeInTheDocument();
  });
});
```

### 2. Testes de Integração

#### 2.1 Autenticação com Supabase
Testes para fluxo de autenticação real com o Supabase:

```typescript
describe('Autenticação', () => {
  // Usar um banco de teste ou Supabase emulado
  beforeEach(() => {
    // Configurar banco de teste
  });
  
  it('deve registrar um novo usuário', async () => {
    const result = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'password123'
    });
    
    expect(result.error).toBeNull();
    expect(result.data.user).toBeDefined();
    expect(result.data.user.email).toBe('test@example.com');
  });
  
  it('deve fazer login com credenciais válidas', async () => {
    // Criar usuário primeiro
    // ...
    
    const result = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password123'
    });
    
    expect(result.error).toBeNull();
    expect(result.data.session).toBeDefined();
  });
});
```

#### 2.2 Políticas RLS
Testes para validar políticas de segurança:

```typescript
describe('Políticas RLS', () => {
  let userAClient, userBClient;
  
  beforeEach(async () => {
    // Criar dois usuários e clientes Supabase separados
  });
  
  it('usuário deve acessar apenas seus próprios dados', async () => {
    // Inserir dados para usuário A
    const { data: priorityA } = await userAClient
      .from('priorities')
      .insert({ title: 'Prioridade A' })
      .select()
      .single();
      
    // Inserir dados para usuário B
    const { data: priorityB } = await userBClient
      .from('priorities')
      .insert({ title: 'Prioridade B' })
      .select()
      .single();
      
    // Usuário A tenta ler todos os dados
    const { data: prioritiesForA } = await userAClient
      .from('priorities')
      .select('*');
      
    expect(prioritiesForA).toHaveLength(1);
    expect(prioritiesForA[0].id).toBe(priorityA.id);
  });
});
```

### 3. Testes de Ponta a Ponta (E2E)

Utilizando Cypress para testes de ponta a ponta:

```javascript
describe('Fluxo de Migração', () => {
  beforeEach(() => {
    // Configurar dados de teste no localStorage
    cy.window().then(win => {
      win.localStorage.setItem('priorities', JSON.stringify([
        { id: 'local-1', title: 'Prioridade local' }
      ]));
    });
  });
  
  it('deve migrar dados ao fazer login pela primeira vez', () => {
    // Visitar página de login
    cy.visit('/auth/login');
    
    // Preencher formulário de login
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    // Verificar se foi redirecionado para página de migração
    cy.url().should('include', '/migrate');
    
    // Verificar se mostra progresso de migração
    cy.contains('Migrando seus dados');
    
    // Aguardar conclusão e verificar se dados foram migrados
    cy.contains('Migração concluída', { timeout: 10000 });
    
    // Navegar para prioridades e verificar se dados locais estão presentes
    cy.visit('/app/priorities');
    cy.contains('Prioridade local');
  });
});
```

### 4. Testes de Segurança

#### 4.1 Penetration Testing
Testes manuais para tentar acessar dados de outros usuários:

- Tentar modificar IDs nas requisições
- Tentar manipular tokens JWT
- Verificar headers HTTP para evitar vazamentos

#### 4.2 Auditoria de Configuração
Verificação das configurações do Supabase:

- Validar configuração de CORS
- Verificar configurações de autenticação
- Confirmar que todas as tabelas têm RLS ativo

## Ambientes de Teste

### Ambiente de Desenvolvimento
- Instância Supabase de desenvolvimento
- Banco de dados com dados de teste
- Usuários pré-configurados para testes

### Ambiente de Staging
- Instância Supabase separada para staging
- Dados mais próximos do ambiente de produção
- Testes de performance e carga

## Métricas de Qualidade

- **Cobertura de código**: Mínimo de 80% para hooks e funções de migração
- **Testes passando**: 100% dos testes devem passar antes da implantação
- **Tempo de migração**: A migração de dados não deve levar mais de 30 segundos
- **Performance**: Tempo de resposta médio não deve exceder 300ms

## Cronograma de Testes

| Semana | Atividade |
|--------|-----------|
| Semana 1 | Configuração do ambiente de testes e implementação de testes unitários |
| Semana 2 | Implementação de testes de integração |
| Semana 3 | Implementação de testes E2E e execução de testes de segurança |
| Semana 4 | Correção de bugs e ajustes finais |

## Feedback e Revisão

Este documento deve ser revisado pela equipe técnica para garantir que todos os cenários críticos estejam cobertos pelos testes.

## Histórico de Revisões

| Versão | Data | Autor | Descrição |
|--------|------|-------|-----------|
| 1.0 | [DATA ATUAL] | [AUTOR] | Versão inicial da estratégia de testes | 