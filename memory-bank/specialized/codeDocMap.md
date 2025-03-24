# Mapa de Documentação de Código

**Status**: [CURRENT] | Última atualização: 24/09/2023 | Versão: 1.2

## Introdução
Este documento mapeia os arquivos de código do MyNeuroApp para a documentação relevante no Memory Bank, ajudando a manter a sincronização entre implementação e documentação.

## Estrutura Principal

| Caminho | Descrição | Documentação Relacionada |
|---------|-----------|--------------------------|
| `app/` | Diretório principal da aplicação | `productContext.md`, `systemPatterns.md` |
| `app/components/` | Componentes reutilizáveis | `systemPatterns.md` - Seção Componentes |
| `app/context/` | React Context APIs | `systemPatterns.md` - Seção Gerenciamento de Estado |
| `app/hooks/` | Custom React Hooks | `systemPatterns.md` - Seção Hooks |
| `app/lib/` | Bibliotecas e utilidades | `techContext.md` |
| `app/styles/` | Estilos globais | `systemPatterns.md` - Seção UI |
| `app/types/` | Definições de tipos TypeScript | `techContext.md` |
| `app/store/` | Gerenciamento de estado local | `systemPatterns.md` - Seção Gerenciamento de Estado |
| `public/` | Arquivos estáticos | - |

## Componentes

| Componente | Caminho | Documentação Relacionada |
|------------|---------|--------------------------|
| `Header` | `app/components/Header.tsx` | `systemPatterns.md` - Seção Navegação |
| `Footer` | `app/components/Footer.tsx` | `systemPatterns.md` - Seção Navegação |
| `UserMenu` | `app/components/UserMenu.tsx` | `systemPatterns.md` - Seção Autenticação |
| `LoadingIndicator` | `app/components/LoadingIndicator.tsx` | `systemPatterns.md` - Seção Feedback Visual |
| `Toast` | `app/components/Toast.tsx` | `systemPatterns.md` - Seção Feedback Visual |
| `DataMigration` | `app/components/perfil/DataMigration.tsx` | `migracao_supabase.md` - Seção Interface de Migração |

## Contextos

| Contexto | Caminho | Documentação Relacionada |
|----------|---------|--------------------------|
| `AuthContext` | `app/context/AuthContext.tsx` | `systemPatterns.md` - Seção Autenticação |
| `ToastContext` | `app/context/ToastContext.tsx` | `systemPatterns.md` - Seção Feedback Visual |

## Hooks

| Hook | Caminho | Documentação Relacionada |
|------|---------|--------------------------|
| `useAuth` | `app/hooks/useAuth.ts` | `systemPatterns.md` - Seção Autenticação |
| `usePriorities` | `app/hooks/usePriorities.ts` | `migracao_supabase.md` - Seção Hooks |
| `useSleep` | `app/hooks/useSleep.ts` | `migracao_supabase.md` - Seção Hooks |
| `useHumor` | `app/hooks/useHumor.ts` | `migracao_supabase.md` - Seção Hooks |
| `useToast` | `app/hooks/useToast.ts` | `systemPatterns.md` - Seção Feedback Visual |

## Utilidades e Configurações

| Arquivo | Caminho | Documentação Relacionada |
|---------|---------|--------------------------|
| Cliente Supabase | `app/lib/supabase.ts` | `migracao_supabase.md` - Seção Configuração Inicial |
| Tipos Supabase | `app/types/supabase.ts` | `migracao_supabase.md` - Seção Estruturação do Banco de Dados |
| Middleware | `middleware.ts` | `migracao_supabase.md` - Seção Implementação da Autenticação |

## Módulos por Funcionalidade

### Autenticação

| Arquivo | Caminho | Documentação Relacionada |
|---------|---------|--------------------------|
| Página de Login | `app/auth/login/page.tsx` | `migracao_supabase.md` - Seção Implementação da Autenticação |
| Página de Cadastro | `app/auth/cadastro/page.tsx` | `migracao_supabase.md` - Seção Implementação da Autenticação |
| Rota de Callback | `app/auth/callback/route.ts` | `migracao_supabase.md` - Seção Implementação da Autenticação |

### Prioridades

| Arquivo | Caminho | Documentação Relacionada |
|---------|---------|--------------------------|
| Página de Prioridades | `app/prioridades/page.tsx` | `progress.md` - Seção Módulos |
| Hook de Prioridades | `app/hooks/usePriorities.ts` | `migracao_supabase.md` - Seção Hooks |
| Lista de Prioridades | `app/components/prioridades/PriorityList.tsx` | `systemPatterns.md` - Seção Componentes |
| Item de Prioridade | `app/components/prioridades/PriorityItem.tsx` | `systemPatterns.md` - Seção Componentes |
| Formulário de Prioridade | `app/components/prioridades/PriorityForm.tsx` | `systemPatterns.md` - Seção Componentes |

### Sono

| Arquivo | Caminho | Documentação Relacionada |
|---------|---------|--------------------------|
| Página de Sono | `app/sono/page.tsx` | `progress.md` - Seção Módulos |
| Hook de Sono | `app/hooks/useSleep.ts` | `migracao_supabase.md` - Seção Hooks |
| Lista de Registros de Sono | `app/components/sono/SleepRecordList.tsx` | `systemPatterns.md` - Seção Componentes |
| Item de Registro de Sono | `app/components/sono/SleepRecordItem.tsx` | `systemPatterns.md` - Seção Componentes |
| Formulário de Sono | `app/components/sono/SleepForm.tsx` | `systemPatterns.md` - Seção Componentes |
| Migração de Dados de Sono | `app/components/sono/SleepDataMigration.tsx` | `migracao_supabase.md` - Seção Interface de Migração |

### Humor

| Arquivo | Caminho | Documentação Relacionada |
|---------|---------|--------------------------|
| Página de Humor | `app/humor/page.tsx` | `progress.md` - Seção Módulos |
| Hook de Humor | `app/hooks/useHumor.ts` | `migracao_supabase.md` - Seção Hooks |
| Lista de Registros de Humor | `app/components/humor/MoodRecordList.tsx` | `systemPatterns.md` - Seção Componentes |
| Item de Registro de Humor | `app/components/humor/MoodRecordItem.tsx` | `systemPatterns.md` - Seção Componentes |
| Formulário de Humor | `app/components/humor/MoodForm.tsx` | `systemPatterns.md` - Seção Componentes |
| Migração de Dados de Humor | `app/components/humor/MoodDataMigration.tsx` | `migracao_supabase.md` - Seção Interface de Migração |
| SQL de Criação da Tabela | `scripts/mood_records_table.sql` | `migracao_supabase.md` - Seção Estruturação do Banco de Dados |

### Medicamentos

| Arquivo | Caminho | Documentação Relacionada |
|---------|---------|--------------------------|
| Página de Medicamentos | `app/medicamentos/page.tsx` | `progress.md` - Seção Módulos |
| Hook de Medicamentos | `app/hooks/useMedications.ts` | `migracao_supabase.md` - Seção Hooks |
| Lista de Medicamentos | `app/components/saude/MedicationList.tsx` | `systemPatterns.md` - Seção Componentes |
| Item de Medicamento | `app/components/saude/MedicationItem.tsx` | `systemPatterns.md` - Seção Componentes |
| Formulário de Medicamento | `app/components/saude/MedicationForm.tsx` | `systemPatterns.md` - Seção Componentes |
| Migração de Dados de Medicamentos | `app/components/saude/MedicationDataMigration.tsx` | `migracao_supabase.md` - Seção Interface de Migração |
| SQL de Criação da Tabela | `scripts/medications_table.sql` | `migracao_supabase.md` - Seção Estruturação do Banco de Dados |

### Perfil de Usuário

| Arquivo | Caminho | Documentação Relacionada |
|---------|---------|--------------------------|
| Página de Perfil | `app/perfil/page.tsx` | `migracao_supabase.md` - Seção Migração de Dados |
| Componente de Migração | `app/components/perfil/DataMigration.tsx` | `migracao_supabase.md` - Seção Interface de Migração |
| Detalhes do Usuário | `app/components/perfil/UserDetails.tsx` | `systemPatterns.md` - Seção Componentes |

## Histórico de Revisões

| Data | Versão | Autor | Aprovador | Alterações |
|------|--------|-------|-----------|------------|
| 04/10/2023 | 1.3 | DevTeam | TechLead | Adicionados componentes do módulo de Medicamentos |
| 24/09/2023 | 1.2 | DevTeam | TechLead | Adicionados componentes de migração e feedback visual |
| 23/09/2023 | 1.1 | DevTeam | TechLead | Atualização com componentes de autenticação |
| 15/09/2023 | 1.0 | DevTeam | TechLead | Versão inicial do documento | 