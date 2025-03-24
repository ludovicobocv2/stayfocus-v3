# PRD: MyNeuroApp - Aplicativo de Gestão para Neurodivergentes

## Status: [CURRENT] | Última Atualização: Data Atual | Versão: 1.0

## Introdução
Este documento define os requisitos e objetivos fundamentais do MyNeuroApp, uma aplicação web destinada a pessoas neurodivergentes para auxiliar na gestão de rotinas diárias e reduzir a sobrecarga cognitiva.

## Resumo Executivo
MyNeuroApp é uma plataforma centrada no usuário que oferece ferramentas para organização de rotinas, gestão de tarefas, monitoramento de saúde e bem-estar, com foco nas necessidades específicas de pessoas neurodivergentes, incluindo aquelas com TDAH, autismo, dislexia e outras condições.

## Pontos-Chave [IMPORTANTE]
- Aplicação destinada especificamente para pessoas neurodivergentes
- Foco na redução de sobrecarga cognitiva e estímulos
- Design minimalista e acessível
- Organização em módulos especializados
- Implementação gradual de funcionalidades
- Priorização da experiência do usuário e acessibilidade

## 1. Visão do Produto

**Propósito:** Fornecer uma solução digital abrangente para pessoas neurodivergentes gerenciarem diversos aspectos de sua vida diária, incluindo rotinas, saúde, bem-estar e produtividade, através de uma interface adaptada às suas necessidades específicas.

**Missão:** Reduzir a sobrecarga cognitiva e melhorar a qualidade de vida de pessoas neurodivergentes através de uma plataforma digital acessível, personalizável e inclusiva.

## 2. Módulos Principais

### Página Inicial
- Visão consolidada do dia
- Lista de prioridades limitada
- Lembretes de pausas
- Checklist de medicamentos

### Alimentação
- Planejador de refeições visual
- Registro simplificado
- Lembretes de hidratação
- Bibliotecas de refeições favoritas

### Estudos
- Gerenciador de sessões de estudo
- Técnicas de estudo adaptadas
- Registro de progressos
- Gestão de recursos de aprendizagem

### Saúde
- Rastreador de medicamentos
- Registro de sintomas
- Monitoramento de humor
- Histórico médico simplificado

### Lazer
- Sugestões de atividades de relaxamento
- Rastreador de hobbies
- Técnicas de autorregulação
- Planejador de tempo livre

### Sono
- Registro de padrões de sono
- Rotinas personalizáveis pré-sono
- Análise de qualidade do sono
- Sugestões para melhorar o sono

### Autoconhecimento
- Diário de gatilhos e soluções
- Rastreador de energia e foco
- Biblioteca de estratégias de regulação
- Registro de necessidades sensoriais

### Perfil
- Configurações de personalização
- Preferências de acessibilidade
- Gestão de conta
- Configurações de sincronização

## 3. Requisitos Técnicos

### Tecnologias
- Frontend: Next.js com TypeScript
- Estilização: Tailwind CSS
- Backend: Supabase (PostgreSQL)
- Autenticação: Supabase Auth
- Armazenamento: Combinação de localStorage e banco de dados remoto
- Hospedagem: Vercel

### Requisitos Não-Funcionais
- Acessibilidade: Conformidade com WCAG 2.1 AA
- Performance: Tempo de carregamento inicial < 2 segundos
- Responsividade: Adaptação para desktop, tablet e mobile
- Segurança: Criptografia de dados sensíveis
- Disponibilidade: Uptime de 99.9%
- Usabilidade: Interface simplificada e intuitiva

## 4. Público-Alvo

**Usuários Primários:**
- Adultos e adolescentes neurodivergentes (TDAH, autismo, dislexia, etc.)
- Idade: 16-45 anos
- Familiaridade tecnológica: Básica a avançada
- Necessidades: Estrutura, lembretes, redução de sobrecarga cognitiva

**Personas Principais:**
1. Carlos, 28 anos, TDAH, profissional de tecnologia
2. Ana, 19 anos, autista, estudante universitária
3. Miguel, 35 anos, dislexia e TDAH, empreendedor
4. Júlia, 42 anos, sensibilidade sensorial, professora

## 5. Cronograma de Alto Nível

**Fase 1: MVP (3 meses)**
- Desenvolvimento de módulos essenciais: Página Inicial, Alimentação, Saúde
- Implementação de autenticação básica
- Armazenamento local com sincronização limitada

**Fase 2: Expansão (3 meses)**
- Adição de módulos: Estudos, Sono, Lazer
- Migração completa para Supabase
- Melhorias de acessibilidade
- Funcionalidades de personalização

**Fase 3: Refinamento (2 meses)**
- Implementação dos módulos finais: Autoconhecimento, Perfil avançado
- Análises e insights baseados em dados
- Otimizações de performance
- Testes de usabilidade e ajustes finais

## 6. Métricas de Sucesso

- Retenção de usuários: 70% após 30 dias
- NPS (Net Promoter Score): >40
- Satisfação do usuário: >4.2/5
- Tempo médio de uso diário: >10 minutos
- Redução reportada em sobrecarga cognitiva: >30%

## Feedback

Este documento está aberto a sugestões e melhorias. Por favor, forneça feedback sobre:
- Funcionalidades adicionais relevantes
- Considerações específicas para diferentes tipos de neurodivergência
- Experiências similares e lições aprendidas

## Histórico de Revisões

| Data | Versão | Autor | Mudanças |
|------|--------|-------|----------|
| Data Atual | 1.0 | Equipe | Versão inicial |

## Changelog

- **DOC-20230322-1.0**: Criação do documento com definição inicial do projeto 