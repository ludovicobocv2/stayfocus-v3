# Decisões Técnicas e Arquiteturais

**Status**: [CURRENT] | Última atualização: 26/09/2023 | Versão: 1.4

## Resumo Executivo
Este documento registra decisões importantes relacionadas à arquitetura, tecnologia e implementação do MyNeuroApp. Cada decisão inclui contexto, alternativas consideradas, solução escolhida e impactos. Foi adicionada uma nova seção sobre decisões relacionadas à migração de dados do módulo Sono e à estruturação das tabelas do módulo de Humor.

## Índice de Decisões
1. [DEC-001: Escolha do Next.js 13](#dec-001-escolha-do-nextjs-13)
2. [DEC-002: Migração para Supabase](#dec-002-migração-para-supabase)
3. [DEC-003: Estratégia de Autenticação](#dec-003-estratégia-de-autenticação)
4. [DEC-004: Abordagem de Migração Modular](#dec-004-abordagem-de-migração-modular)
5. [DEC-005: Verificação de Duplicação na Migração](#dec-005-verificação-de-duplicação-na-migração)
6. [DEC-006: Estruturação das Tabelas de Sono](#dec-006-estruturação-das-tabelas-de-sono)
7. [DEC-007: Estruturação das Tabelas de Humor](#dec-007-estruturação-das-tabelas-de-humor)

## DEC-001: Escolha do Next.js 13
**Data**: 01/06/2023  
**Status**: Implementado  
**Autor**: Tech Lead  

**Contexto**:  
Necessidade de escolher um framework React moderno para desenvolver uma aplicação web responsiva com bom SEO e experiência de desenvolvimento.

**Alternativas Consideradas**:
1. Create React App
2. Remix
3. Gatsby
4. Next.js 13

**Decisão**:  
Adotar Next.js 13 com App Router para desenvolvimento da aplicação.

**Justificativa**:
- Suporte a Server Components para melhor performance
- Roteamento baseado em sistema de arquivos
- Renderização híbrida (SSR, SSG, ISR)
- Comunidade grande e ativa
- Facilidade de deploy com Vercel

**Implicações**:
- Curva de aprendizado para desenvolvedores não familiarizados com Next.js 13
- Necessidade de planejamento cuidadoso da estrutura de arquivos
- Benefícios de performance e SEO para a aplicação

## DEC-002: Migração para Supabase
**Data**: 15/08/2023  
**Status**: Em implementação  
**Autor**: Tech Lead, DevOps  

**Contexto**:  
O aplicativo inicialmente usava localStorage para persistência de dados, limitando funcionalidades como sincronização entre dispositivos e backup. Necessitamos de uma solução de backend como serviço.

**Alternativas Consideradas**:
1. Firebase
2. Supabase
3. Amplify
4. Backend personalizado com Node.js

**Decisão**:  
Migrar gradualmente do localStorage para Supabase.

**Justificativa**:
- API compatível com PostgreSQL
- Autenticação incorporada
- Políticas de segurança a nível de linha (RLS)
- Open-source e plano gratuito generoso
- APIs para React Native (futura expansão mobile)

**Implicações**:
- Necessidade de migração de dados existentes
- Implementação de estratégias para experiência offline
- Curva de aprendizado para equipe

## DEC-003: Estratégia de Autenticação
**Data**: 01/09/2023  
**Status**: Implementado  
**Autor**: Equipe de Segurança  

**Contexto**:  
Com a migração para Supabase, precisamos implementar autenticação segura e fácil de usar.

**Alternativas Consideradas**:
1. Autenticação exclusiva por email/senha
2. OAuth com provedores populares
3. Autenticação sem senha (magic link)
4. Combinação das opções acima

**Decisão**:  
Implementar autenticação híbrida: email/senha e OAuth (Google), com possibilidade de expansão futura.

**Justificativa**:
- Flexibilidade para usuários
- Segurança robusta
- Facilidade de uso (redução de fricção no registro)
- Suporte nativo no Supabase

**Implicações**:
- Necessidade de tratamento adequado de perfis vindos de diferentes fontes
- Gestão de sessões entre dispositivos
- Configuração de provedores OAuth

## DEC-004: Abordagem de Migração Modular
**Data**: 20/09/2023  
**Status**: Em implementação  
**Autor**: Tech Lead  

**Contexto**:  
A migração do localStorage para Supabase envolve múltiplos módulos da aplicação. Precisamos definir uma estratégia clara.

**Alternativas Consideradas**:
1. Migração completa de uma vez
2. Migração gradual por módulo
3. Sistema híbrido com suporte a ambas fontes de dados

**Decisão**:  
Adotar migração gradual por módulo, começando pelo módulo de Prioridades como piloto.

**Justificativa**:
- Menor risco de perda de dados
- Permite avaliar e ajustar a abordagem entre módulos
- Experiência de usuário mais controlada
- Facilita testes e validação

**Implicações**:
- Complexidade temporária com dois sistemas de armazenamento
- Necessidade de interfaces de migração por módulo
- Documentação clara sobre o estado de cada módulo

## DEC-005: Verificação de Duplicação na Migração
**Data**: 25/09/2023  
**Status**: Implementado  
**Autor**: DevTeam  

**Contexto**:  
Durante a migração de dados de localStorage para Supabase, foi identificado o risco de duplicação quando usuários executam a migração múltiplas vezes.

**Alternativas Consideradas**:
1. Ignorar o problema (permitir duplicação)
2. Bloquear migração após primeira tentativa
3. Verificar e prevenir duplicação durante migração
4. Implementar limpeza periódica de duplicados

**Decisão**:  
Implementar verificação de duplicação durante o processo de migração, tanto para prioridades quanto para registros de sono.

**Justificativa**:
- Previne proliferação de dados redundantes
- Melhora experiência do usuário
- Reduz consumo de recursos no banco de dados
- Mantém integridade dos dados

**Implicações**:
- Aumento da complexidade do código de migração
- Possível impacto de performance para grandes volumes de dados
- Necessidade de critérios claros para determinar duplicação

## DEC-006: Estruturação das Tabelas de Sono
**Data**: 25/09/2023  
**Status**: Implementado  
**Autor**: DevTeam  

**Contexto**:  
A implementação do módulo de Sono no Supabase requer definir a estrutura das tabelas e relacionamentos.

**Alternativas Consideradas**:
1. Tabela única para todos os dados de sono
2. Tabelas separadas para registros e lembretes
3. Estrutura normalizada com tabelas de referência

**Decisão**:  
Implementar duas tabelas principais:
- `sleep_records`: para armazenar registros diários de sono
- `sleep_reminders`: para configurações de lembretes

**Justificativa**:
- Separação clara de responsabilidades
- Facilita consultas e atualizações específicas
- Segue padrões de modelagem relacional
- Preparação para futuros recursos como estatísticas avançadas

**Implicações**:
- Necessidade de manter relacionamentos consistentes
- Implementação de políticas RLS em ambas tabelas
- Hooks de React específicos para cada entidade
- Migrations SQL para criação das estruturas

## DEC-007: Estruturação das Tabelas de Humor
**Data**: 26/09/2023  
**Status**: Implementado  
**Autor**: DevTeam  

**Contexto**:  
A implementação do módulo de Humor no Supabase requer definir a estrutura das tabelas, considerando os requisitos de registro de humor, notas e categorização.

**Alternativas Consideradas**:
1. Tabela única com array de tags
2. Tabela principal com tabela separada para tags
3. Modelo completamente normalizado com múltiplas tabelas
4. Armazenamento JSON para dados não estruturados

**Decisão**:  
Implementar uma única tabela `mood_records` com a seguinte estrutura:
- `id`: UUID (chave primária)
- `user_id`: UUID (referência para auth.users)
- `value`: smallint (valor do humor de 1-5)
- `notes`: text (notas associadas, opcional)
- `tags`: text[] (array de tags, opcional)
- `date`: date (data do registro)
- `created_at`: timestamptz
- `updated_at`: timestamptz

**Justificativa**:
- Simplicidade de implementação e manutenção
- Arrays nativos do PostgreSQL oferecem boa performance para o caso de uso
- Evita joins desnecessários para um volume relativamente pequeno de tags
- Facilita a migração de dados do localStorage
- Mantém consistência com o modelo mental dos usuários na interface existente

**Implicações**:
- Limitações nas operações de filtragem complexas por tags
- Necessidade de usar funções específicas do PostgreSQL para manipulação de arrays
- Simplificação das consultas para recuperar registros completos
- Políticas de segurança mais diretas
- Hook `useHumor` com implementação mais simples

## Histórico de Revisões

| Data | Versão | Autor | Alterações |
|------|--------|-------|------------|
| 26/09/2023 | 1.4 | DevTeam | Adicionada DEC-007 sobre estruturação das tabelas de humor |
| 25/09/2023 | 1.3 | DevTeam | Adicionada DEC-006 sobre estruturação das tabelas de sono |
| 22/09/2023 | 1.2 | DevTeam | Adicionada DEC-005 sobre verificação de duplicação |
| 15/09/2023 | 1.1 | DevTeam | Adicionadas DEC-003 e DEC-004 |
| 01/07/2023 | 1.0 | Tech Lead | Versão inicial com DEC-001 e DEC-002 | 