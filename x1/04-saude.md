# PRD: Módulo Saúde

## 1. Visão Geral

**Propósito:** Prover ferramentas intuitivas para o gerenciamento de saúde mental e física, ajudando pessoas neurodivergentes a monitorar medicamentos e estados emocionais com uma interface simplificada e visual.

**Benefícios para Neurodivergentes:**
- Sistema de registro de medicamentos que reduz sobrecarga cognitiva
- Acompanhamento visual de humor para identificação de padrões
- Interface adaptada para períodos de baixa capacidade executiva
- Lembretes não-invasivos para momentos de hiperfoco

## 2. Funcionalidades Detalhadas

### Registro de Medicamentos:
- Cadastro simplificado de medicamentos com dosagens
- Programação de horários com repetição configurável
- Sistema visual de confirmação de doses tomadas
- Histórico de adesão com visualização simplificada

### Monitoramento de Humor:
- Interface visual para registro rápido (escala de 1-5)
- Opção para adicionar notas curtas contextuais
- Visualização de tendências semanais/mensais
- Correlação opcional com outros módulos (sono, alimentação)

## 3. Modelo de Dados

### Modelo Atual (Zustand + LocalStorage):
```typescript
// Medicamentos
type Medicamento = {
  id: string
  nome: string
  dosagem: string
  horarios: string[]
  dias_semana: number[] // 0-6, domingo a sábado
  ativo: boolean
}

// Registro de Medicamentos
type RegistroMedicamento = {
  id: string
  medicamento_id: string
  data: string
  horario: string
  tomado: boolean
}

// Humor
type RegistroHumor = {
  id: string
  data: string
  nivel: number // 1-5
  nota?: string
  tags?: string[]
}
```

### Modelo Proposto para Supabase:
```sql
-- Tabela Medicamentos
CREATE TABLE medicamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  dosagem TEXT NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela Horários de Medicamentos
CREATE TABLE medicamento_horarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  medicamento_id UUID REFERENCES medicamentos(id) ON DELETE CASCADE,
  horario TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela Dias da Semana de Medicamentos
CREATE TABLE medicamento_dias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  medicamento_id UUID REFERENCES medicamentos(id) ON DELETE CASCADE,
  dia_semana SMALLINT CHECK (dia_semana BETWEEN 0 AND 6)
);

-- Tabela Registros de Medicamentos
CREATE TABLE registros_medicamento (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  medicamento_id UUID REFERENCES medicamentos(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  horario TIME NOT NULL,
  tomado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela Registros de Humor
CREATE TABLE registros_humor (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  nivel SMALLINT CHECK (nivel BETWEEN 1 AND 5),
  nota TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela Tags de Humor
CREATE TABLE humor_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registro_id UUID REFERENCES registros_humor(id) ON DELETE CASCADE,
  tag TEXT NOT NULL
);
```

## 4. Fluxos de Usuário Principais

### Fluxo de Gestão de Medicamentos:
1. Usuário cadastra medicamentos e configura horários
2. Recebe notificações nos horários programados
3. Confirma a medicação tomada com um toque
4. Visualiza histórico de adesão quando necessário

### Fluxo de Registro de Humor:
1. Usuário acessa a tela de humor
2. Seleciona nível atual em interface visual simples
3. Opcionalmente adiciona nota ou tags contextuais
4. Visualiza tendência ao longo do tempo

### Sincronização Multiplataforma:
1. Configurações de medicamentos sincronizadas
2. Notificações entregues no dispositivo ativo
3. Registros de humor atualizados em tempo real
4. Histórico completo disponível em qualquer dispositivo

## 5. Requisitos de Interface

### Existentes:
- Cards visuais para medicamentos
- Escala de humor com emojis e cores
- Gráfico simplificado de tendências
- Notificações com feedback visual

### Ajustes para Mobile:
- Widgets para tela inicial
- Confirmação rápida por notificação
- Interface adaptativa para períodos de baixa energia
- Modos de alto contraste para dias difíceis

## 6. Considerações de Acessibilidade

### Já Implementadas:
- Uso de cores e símbolos para comunicação redundante
- Interface simplificada para períodos de sobrecarga
- Confirmações com baixa fricção
- Opção de entrada rápida em 1-2 toques

### A Manter/Aprimorar:
- Rotinas de medicação com confirmação visual/sonora
- Opção para registros retroativos (se esqueceu de registrar)
- Modo minimalista para períodos de sobrecarga sensorial
- Suporte completo para TalkBack/VoiceOver

## 7. Estratégia de Migração

### Extração de Dados:
- Exportar cadastro de medicamentos atual
- Preservar histórico de registros
- Manter configurações de notificações

### Transformação:
- Normalizar horários e dias em tabelas separadas
- Converter estrutura de tags para modelo relacional
- Preservar relações entre medicamentos e registros

### Carregamento:
- Migrar dados mestre (medicamentos, configurações)
- Em seguida, migrar registros históricos
- Validar consistência das relações após migração
