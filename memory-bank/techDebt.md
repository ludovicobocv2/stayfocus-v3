# Dívida Técnica

**Status**: [CURRENT] | Última atualização: 25/09/2023 | Versão: 1.2

## Resumo Executivo
Este documento registra a dívida técnica atual do projeto MyNeuroApp, incluindo limitações conhecidas, melhorias planejadas e riscos técnicos. Prioriza-se questões de acordo com seu impacto no desenvolvimento e experiência do usuário, com foco especial no processo de migração para Supabase.

## Dívidas Técnicas Ativas

### Alta Prioridade

#### Módulo de Sono - Duplicação de Código
- **Descrição**: O padrão de implementação do hook `useSleep` segue o mesmo padrão de `usePriorities`, resultando em duplicação de lógica.
- **Impacto**: Aumenta a complexidade de manutenção e risco de inconsistências.
- **Plano de Mitigação**: Criar um hook base genérico `useSupabaseEntity` que possa ser estendido pelos hooks específicos.
- **Status**: 📅 Planejado para depois da migração completa de todos os módulos
- **Responsável**: Equipe de Desenvolvimento
- **Data Limite**: 20/10/2023

#### Experiência Offline Limitada
- **Descrição**: Com a migração para Supabase, a experiência offline ficou comprometida.
- **Impacto**: Usuários sem conexão não conseguem acessar ou modificar seus dados.
- **Plano de Mitigação**: Implementar Progressive Web App (PWA) com sincronização quando online.
- **Status**: 📅 Planejado
- **Responsável**: Equipe de Frontend
- **Data Limite**: 01/11/2023

### Média Prioridade

#### Verificação de Duplicação Redundante
- **Descrição**: A verificação de duplicação é implementada individualmente em cada hook (usePriorities, useSleep).
- **Impacto**: Código redundante e potencial para comportamentos inconsistentes.
- **Plano de Mitigação**: Refatorar a lógica de verificação em um utilitário comum.
- **Status**: ⏳ Em análise
- **Responsável**: Equipe de Desenvolvimento
- **Data Limite**: 15/10/2023

#### Gerenciamento de Estado Inconsistente
- **Descrição**: Alguns componentes usam estado local (useState), outros usam React Query.
- **Impacto**: Padrões de código inconsistentes e possíveis problemas de sincronização.
- **Plano de Mitigação**: Padronizar o uso de React Query para interações com a API.
- **Status**: ⏳ Em andamento
- **Responsável**: Tech Lead
- **Data Limite**: 15/10/2023

### Baixa Prioridade

#### Testes Automatizados Insuficientes
- **Descrição**: Cobertura de testes é baixa, especialmente para os hooks de Supabase.
- **Impacto**: Aumenta o risco de regressões durante refatorações.
- **Plano de Mitigação**: Adicionar testes unitários e de integração, começando pelos hooks centrais.
- **Status**: 📅 Planejado
- **Responsável**: Equipe de QA
- **Data Limite**: 30/10/2023

#### Dependências Desatualizadas
- **Descrição**: Algumas dependências estão em versões antigas.
- **Impacto**: Potenciais vulnerabilidades de segurança e recursos ausentes.
- **Plano de Mitigação**: Estabelecer processo regular de atualização de dependências.
- **Status**: 📅 Planejado
- **Responsável**: DevOps
- **Data Limite**: Contínuo

## Dívidas Técnicas Resolvidas

#### Detecção de Duplicação Durante Migração
- **Descrição**: Dados migrados podiam ser duplicados se o usuário executasse a migração múltiplas vezes.
- **Solução Implementada**: Adicionada verificação de duplicação em `usePriorities` e `useSleep`.
- **Data de Resolução**: 25/09/2023
- **Responsável**: Equipe de Desenvolvimento

#### Autenticação Inconsistente
- **Descrição**: Estado de autenticação não era persistido adequadamente entre recargas de página.
- **Solução Implementada**: Implementado sistema de gerenciamento de sessão baseado no Supabase Auth Helpers.
- **Data de Resolução**: 20/09/2023
- **Responsável**: Equipe de Segurança

## Riscos Técnicos

| Risco | Probabilidade | Impacto | Estratégia de Mitigação |
|-------|--------------|---------|-------------------------|
| Perda de dados durante migração | Baixa | Alto | Implementar backup automático antes da migração |
| Conflitos de concorrência em multi-dispositivos | Média | Médio | Adicionar timestamps e estratégia de resolução de conflitos |
| Limites de uso da API Supabase (tier gratuito) | Alta | Alto | Monitorar uso e implementar cache onde apropriado |
| Interrupções do serviço Supabase | Baixa | Alto | Implementar modo offline resiliente |

## Melhorias Futuras

1. **Arquitetura de Plugins**
   - Implementar sistema modular que permita adicionar novos módulos de forma mais fácil
   - Prioridade: Média
   - Previsão: Q1 2024

2. **API Unificada de Dados**
   - Criar camada de abstração para acesso a dados, independente da fonte
   - Prioridade: Alta
   - Previsão: Q4 2023

3. **Sistema de Backup Integrado**
   - Permitir que usuários façam backup e restauração de seus dados
   - Prioridade: Média
   - Previsão: Q4 2023

4. **Métricas e Analytics**
   - Implementar telemetria anônima para entender padrões de uso
   - Prioridade: Baixa
   - Previsão: Q1 2024

## Histórico de Revisões

| Data | Versão | Autor | Alterações |
|------|--------|-------|------------|
| 25/09/2023 | 1.2 | DevTeam | Atualização com foco na migração de Sono e resolução da dívida de detecção de duplicação |
| 23/09/2023 | 1.1 | DevTeam | Adição de riscos técnicos e melhorias futuras |
| 15/09/2023 | 1.0 | DevTeam | Versão inicial do documento |

## Feedback e Sugestões

Para sugerir novos itens de dívida técnica ou comentar sobre os existentes, entre em contato com a equipe de desenvolvimento ou abra uma issue no repositório do projeto. 