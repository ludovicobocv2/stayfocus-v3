# Contexto Ativo - MyNeuroApp

**Status**: [CURRENT] | Última atualização: 23/09/2023 | Versão: 1.2

## Introdução
Este documento contém o contexto atual de desenvolvimento do MyNeuroApp, destacando o foco de trabalho atual, decisões recentes, e próximos passos planejados.

## Resumo Executivo
Atualmente, o foco principal é a migração do armazenamento de dados do localStorage para o Supabase, permitindo sincronização entre dispositivos e melhor segurança dos dados dos usuários neurodivergentes. A migração progrediu satisfatoriamente, com os módulos de Prioridades, Sono e Humor já migrados. O próximo passo é a migração do módulo de Medicamentos, seguida pela implementação de funcionalidades de exportação de dados.

## Pontos-Chave
- Migração para Supabase alcançou 75% de conclusão, com três dos quatro módulos já migrados
- Módulo de Medicamentos selecionado como foco atual para completar a migração
- Planejamento para funcionalidades de exportação de dados iniciado
- Necessidade de refatoração identificada para reduzir duplicação de código nos hooks
- Experiência offline comprometida pela migração, necessitando implementação posterior

## Foco Atual

### Migração para Supabase
Estamos implementando a migração do armazenamento local para o Supabase, seguindo o plano documentado em `specialized/migracao_supabase.md`. O trabalho atual concentra-se nas seguintes fases:

#### Concluído:
- ✅ **Fase 1: Configuração Inicial**
  - Projeto criado no Supabase
  - Dependências instaladas no projeto
  - Variáveis de ambiente configuradas

- ✅ **Fase 2: Estruturação do Banco de Dados**
  - Tabelas principais criadas
  - Políticas de segurança RLS implementadas
  - Triggers para criação automática de perfil configurados

- ✅ **Fase 3: Implementação da Autenticação**
  - Páginas de login e registro implementadas
  - Middleware para proteção de rotas configurado
  - Provider de autenticação implementado

- ✅ **Fase 4: Adaptação dos Componentes**
  - Componentes atualizados para refletir estado de autenticação
  - Feedback visual para operações assíncronas implementado
  - Navegação adaptada para usuários autenticados/não autenticados

- ✅ **Fase 5: Migração de Dados - Módulo de Prioridades**
  - Hook `usePriorities` implementado
  - Componente de migração de dados criado
  - Interfaces adaptadas para usar Supabase

- ✅ **Fase 5b: Migração de Dados - Módulo de Sono**
  - Hook `useSleep` implementado
  - Componente `SleepDataMigration` criado
  - Interfaces adaptadas para usar Supabase

- ✅ **Fase 5c: Migração de Dados - Módulo de Humor**
  - Hook `useHumor` implementado
  - Componente `MoodDataMigration` criado
  - Interfaces adaptadas para usar Supabase
  - Análise e estatísticas de humor implementadas

#### Em Progresso:
- 🔄 **Fase 5d: Migração de Dados - Módulo de Medicamentos**
  - Definição da estrutura da tabela no Supabase
  - Implementação do hook `useMedications`
  - Desenvolvimento do componente de migração de dados

#### Próximos:
- 📅 **Fase 6: Implementação de Exportação de Dados**
  - Exportação de histórico em CSV e PDF
  - Interface para seleção de período e formato

- 📅 **Fase 7: Refatoração e Otimização**
  - Criação de hook base para redução de duplicação
  - Implementação de estratégia para experiência offline
  - Melhoria de performance para conexões lentas

### Decisões Recentes

1. **Padrão de Análise de Dados** (03/10/2023)
   - Implementação de funções de análise e estatísticas no hook `useHumor`
   - Decisão de aplicar padrão semelhante aos demais módulos
   - Benefício: Valor agregado para usuários e insights sobre seus padrões

2. **Abordagem para Exportação de Dados** (01/10/2023)
   - Decisão por exportação em múltiplos formatos (CSV, PDF)
   - Foco na facilidade de uso para compartilhamento com profissionais de saúde
   - Implementação prevista após conclusão de todas as migrações

3. **Estratégia para Experiência Offline** (27/09/2023)
   - Reconhecimento da necessidade de restaurar funcionalidade offline
   - Decisão por implementação de PWA com sincronização
   - Priorização após conclusão das migrações principais

## Desafios Atuais

1. **Duplicação de Código nos Hooks**
   - Desafio: Padrões semelhantes implementados em cada hook resultam em duplicação
   - Abordagem: Criar hook base genérico que possa ser estendido pelos hooks específicos
   - Status: Planejado para início em 15/10/2023

2. **Migração de Medicamentos com Esquema Complexo**
   - Desafio: O módulo de medicamentos possui estrutura de dados mais complexa
   - Abordagem: Modelagem cuidadosa da tabela e estratégia de migração específica
   - Status: Em análise e desenvolvimento

3. **Testes Insuficientes**
   - Desafio: Cobertura de testes automatizados abaixo da meta
   - Abordagem: Implementar testes para hooks e componentes críticos
   - Status: Planejado para após conclusão das migrações

## Próximos Passos

1. **Completar a Migração do Módulo de Medicamentos** (Prazo: 10/10/2023)
   - Definir esquema da tabela
   - Implementar hook `useMedications`
   - Criar componente `MedicationDataMigration`
   - Adaptar interfaces de usuário

2. **Iniciar Implementação da Exportação de Dados** (Prazo: 15/10/2023)
   - Definir formatos e estrutura dos dados exportados
   - Criar interfaces de seleção e configuração
   - Implementar geração de arquivos e download

3. **Planejar Refatoração dos Hooks** (Prazo: 18/10/2023)
   - Analisar código comum entre hooks
   - Projetar hook base genérico
   - Documentar estratégia de refatoração

4. **Iniciar Testes de Usabilidade** (Prazo: 20/10/2023)
   - Preparar cenários de teste
   - Recrutar usuários para testes
   - Elaborar questionários de feedback

## Feedback e Iteração

Estamos coletando feedback contínuo sobre:
- Experiência de migração (clareza e facilidade)
- Performance das operações com Supabase
- Utilidade das estatísticas e análises implementadas
- Problemas técnicos encontrados durante migração

## Histórico de Revisões

| Data | Versão | Autor | Aprovador | Alterações |
|------|--------|-------|-----------|------------|
| 03/10/2023 | 1.3 | DevTeam | TechLead | Atualização com conclusão da migração do módulo de Humor |
| 23/09/2023 | 1.2 | DevTeam | TechLead | Atualização com progresso da migração Supabase |
| 15/09/2023 | 1.1 | DevTeam | TechLead | Adicionados módulos de sono e medicamentos |
| 01/09/2023 | 1.0 | DevTeam | TechLead | Versão inicial do documento |

## Changelog

- 2023-10-03: Atualização com foco na migração do módulo de Medicamentos (v1.3)
- 2023-09-23: Atualização com foco na migração Supabase (v1.2)
- 2023-09-15: Adição de informações sobre novos módulos (v1.1)
- 2023-09-01: Criação do documento (v1.0) 