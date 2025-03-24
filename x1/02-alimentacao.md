# PRD: Módulo Alimentação

## 1. Visão Geral

**Propósito:** Auxiliar pessoas neurodivergentes a manter rotinas alimentares saudáveis e consistentes, reduzindo a carga cognitiva associada ao planejamento e preparação de refeições.

**Benefícios para Neurodivergentes:**
- Estrutura visual para planejamento de refeições, reduzindo decisões impulsivas
- Lembretes de hidratação para pessoas que têm dificuldade em manter rotinas
- Registro simplificado que fornece padrões claros e previsíveis

## 2. Funcionalidades Detalhadas

### Planejador de Refeições:
- Interface visual para planejamento semanal
- Modelos predefinidos para refeições
- Lembretes personalizáveis
- Rotação automática de refeições favoritas

### Registro de Refeições:
- Entrada simplificada com opções pré-definidas
- Registro de horários e tipos de refeição
- Rastreamento de padrões (sem necessidade de contar calorias)
- Visualização semanal/mensal com códigos visuais

### Lembrete de Hidratação:
- Contador visual de copos de água
- Lembretes personalizáveis por intervalo
- Metas diárias ajustáveis
- Histórico simplificado

## 3. Modelo de Dados

### Modelo Atual (Zustand + LocalStorage):
```typescript
// Refeições
type Refeicao = {
  id: string
  nome: string
  horario: string
  data: string
  categorias: string[]
  observacao?: string
}

// Planejamento
type RefeicaoPlanejada = {
  id: string
  nome: string
  diaSemana: number // 0-6
  horario: string
  categorias: string[]
}

// Hidratação
type RegistroHidratacao = {
  id: string
  data: string
  quantidade: number
  horarios: string[]
}
```

### Modelo Proposto para Supabase:
```sql
-- Tabela Refeições
CREATE TABLE refeicoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  horario TIME NOT NULL,
  data DATE NOT NULL,
  observacao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela Categorias de Refeições
CREATE TABLE refeicao_categorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  refeicao_id UUID REFERENCES refeicoes(id) ON DELETE CASCADE,
  categoria TEXT NOT NULL
);

-- Tabela Planejamento de Refeições
CREATE TABLE refeicoes_planejadas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  dia_semana SMALLINT CHECK (dia_semana BETWEEN 0 AND 6),
  horario TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela Categorias de Refeições Planejadas
CREATE TABLE refeicao_planejada_categorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  refeicao_planejada_id UUID REFERENCES refeicoes_planejadas(id) ON DELETE CASCADE,
  categoria TEXT NOT NULL
);

-- Tabela Hidratação
CREATE TABLE hidratacao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  quantidade INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, data)
);

-- Tabela Registros de Hidratação
CREATE TABLE registros_hidratacao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hidratacao_id UUID REFERENCES hidratacao(id) ON DELETE CASCADE,
  horario TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 4. Fluxos de Usuário Principais

### Fluxo de Planejamento de Refeições:
1. Usuário acessa a tela de planejamento
2. Visualiza template semanal
3. Adiciona ou modifica refeições planejadas
4. Salva o plano para receber lembretes

### Sincronização Multiplataforma:
1. Usuário registra refeição no aplicativo móvel
2. Dados sincronizados automaticamente com Supabase
3. Planejamento acessível em todos dispositivos
4. Lembretes disparados em qualquer dispositivo ativo

## 5. Requisitos de Interface

### Existentes:
- Calendário visual semanal
- Sistema visual de categorias por cores
- Interface simplificada de contagem de água
- Lembretes com notificações claras

### Ajustes para Mobile:
- Versão compacta do calendário semanal
- Widget de contador de água para tela inicial
- Entrada rápida por gestos para registros
- Visualização adaptada para telas menores

## 6. Considerações de Acessibilidade

### Já Implementadas:
- Indicadores visuais de progresso de hidratação
- Códigos de cores com textos alternativos
- Notificações com vibração e som
- Estrutura visual clara e previsível

### A Manter/Aprimorar:
- Adicionar opção de entrada por voz
- Implementar atalhos gestuais personalizáveis
- Ajustar timing de notificações para não sobrecarregar
- Melhorar feedback tátil em dispositivos móveis

## 7. Estratégia de Migração

### Extração e Normalização:
- Exportar dados de refeições e planejamento
- Normalizar as categorias em tabelas separadas
- Preservar histórico de hidratação

### Transformação:
- Adicionar chaves estrangeiras para relações
- Converter timestamps para o formato Supabase
- Normalizar dados de planejamento semanal

### Carregamento:
- Sequência de importação respeitando dependências (primeiro usuários, depois refeições, depois categorias)
- Operações em lote para minimizar latência
- Verificação de integridade referencial
