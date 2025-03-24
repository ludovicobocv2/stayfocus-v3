# Modo de Teste
[CURRENT] - 2024-03-24 - v1.0

## Sumário Executivo
Este documento descreve a implementação do Modo de Teste criado para validar a integração entre o frontend da aplicação e o backend no Supabase, com foco específico na sincronização de dados, tratamento de conflitos e persistência de dados entre dispositivos.

## Pontos-Chave
- Scripts SQL para criar dados de teste e funções de validação
- Helper TypeScript para facilitar a execução de testes
- Interface web para visualizar e executar os testes
- Funções específicas para simular cenários de dispositivos offline
- Mecanismos para detecção e resolução de conflitos

## Implementação

### 1. Estrutura de Arquivos

Foram criados os seguintes arquivos principais:

- `sql/test_data.sql`: Schema e dados de teste
- `sql/test_functions.sql`: Funções SQL para simulação e testes
- `app/lib/testHelper.ts`: Helper TypeScript para interagir com as funções SQL
- `app/test/integration-test.tsx`: Componente React para interface de testes
- `app/test/page.tsx`: Página principal de testes

### 2. Funções de Teste Implementadas

O sistema de testes implementa as seguintes funcionalidades:

#### 2.1 Simulação de Sincronização

Foi implementada uma estrutura para simular a sincronização entre dispositivos, permitindo:

- Criação de dados em diferentes "dispositivos" (identificados por IDs)
- Verificação do estado de sincronização
- Simulação de operações offline
- Merge de dados entre dispositivos

#### 2.2 Detecção e Resolução de Conflitos

O sistema suporta testes para validar o comportamento em situações de conflito:

- Criação deliberada de conflitos entre versões de itens
- Algoritmo de resolução baseado em timestamps e versões
- Registro de conflitos resolvidos

#### 2.3 Geração de Relatórios

Para facilitar a análise dos resultados, implementamos funções para:

- Gerar relatórios detalhados dos testes
- Rastrear métricas de performance
- Verificar contagens e status dos dados

### 3. Interface de Usuário

A interface de teste inclui:

- Campo para seleção do ID de usuário de teste
- Botões para executar testes e limpar dados
- Exibição de logs em tempo real
- Visualização detalhada dos resultados
- Avisos de segurança para operações sensíveis

## Próximos Passos

1. **Expandir Testes**: Adicionar mais cenários de teste para cobrir todos os casos de uso
2. **Automação**: Implementar testes automatizados que possam ser executados via CI/CD
3. **Métricas**: Adicionar métricas de performance mais detalhadas
4. **Cobertura**: Aumentar a cobertura de testes para outros tipos de dados

## Referências

- [Documentação do Supabase sobre RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Estratégias de sincronização offline](https://docs.amplify.aws/lib/datastore/getting-started/q/platform/js/)
- [Padrões de resolução de conflitos](https://www.sqlite.org/conflict.html)

## Histórico de Revisões

| Data | Autor | Versão | Alterações |
|------|-------|--------|------------|
| 2024-03-24 | TestMode | 1.0 | Criação inicial do documento |

## Feedback e Melhorias

Para sugerir melhorias ou reportar problemas com o Modo de Teste, por favor, abra uma issue no repositório com o label "test-mode". 