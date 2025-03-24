# PRD: Módulo Gestão do Sono

## 1. Visão Geral

**Propósito:** Auxiliar pessoas neurodivergentes a estabelecer rotinas de sono saudáveis e consistentes, oferecendo uma interface visual para rastreamento e análise simplificada de padrões de sono.

**Benefícios para Neurodivergentes:**
- Visualização clara de padrões de sono para identificar inconsistências
- Lembretes personalizáveis para rotina pré-sono, reduzindo ansiedade
- Interface simplificada para registro rápido, minimizando a fricção
- Feedback visual sobre consistência, não apenas quantidade de sono

## 2. Funcionalidades Detalhadas

### Registro de Sono:
- Interface visual para marcar horários de deitar e acordar
- Avaliação simplificada da qualidade (1-5 estrelas)
- Opção para adicionar fatores influenciadores (tags)
- Entrada rápida com valores padrão pré-definidos

### Visualizador Semanal:
- Gráfico simplificado de horários e duração
- Codificação por cores para qualidade
- Identificação visual de padrões e inconsistências
- Resumo semanal com métricas básicas

### Lembretes Personalizáveis:
- Alerta para iniciar rotina pré-sono
- Configuração de horários ideais
- Notificações adaptativas baseadas em padrões
- Feedback não-julgador sobre consistência

### Metas de Sono:
- Definição de janela ideal de sono
- Monitoramento visual de progresso
- Celebração de sequências de consistência
- Ajuste gradual para novas metas

## 3. Modelo de Dados

### Modelo Atual (Zustand + LocalStorage):
```typescript
// Registro de Sono
type RegistroSono = {
  id: string
  data: string
  hora_dormir: string
  hora_acordar: string
  qualidade: number // 1-5
  observacoes?: string
  tags?: string[]
}

// Metas de Sono
type MetaSono = {
  id: string
  hora_dormir_meta: string
  hora_acordar_meta: string
  dias_semana: number[] // 0-6, domingo a sábado
  ativa: boolean
}

// Rotina Pré-Sono
type RotinaSono = {
  id: string
  nome: string
  duracao: number
  ordem: number
  ativa: boolean
}
```

### Modelo Proposto para Supabase:
```sql
-- Tabela Registros de Sono
CREATE TABLE registros_sono (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  hora_dormir TIME NOT NULL,
  hora_acordar TIME NOT NULL,
  qualidade SMALLINT CHECK (qualidade BETWEEN 1 AND 5),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, data)
);

-- Tabela Tags de Sono
CREATE TABLE sono_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registro_id UUID REFERENCES registros_sono(id) ON DELETE CASCADE,
  tag TEXT NOT NULL
);

-- Tabela Metas de Sono
CREATE TABLE metas_sono (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  hora_dormir_meta TIME NOT NULL,
  hora_acordar_meta TIME NOT NULL,
  ativa BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela Dias de Metas
CREATE TABLE meta_sono_dias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meta_id UUID REFERENCES metas_sono(id) ON DELETE CASCADE,
  dia_semana SMALLINT CHECK (dia_semana BETWEEN 0 AND 6)
);

-- Tabela Rotinas Pré-Sono
CREATE TABLE rotinas_sono (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  duracao INTEGER NOT NULL, -- em minutos
  ordem INTEGER NOT NULL,
  ativa BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 4. Fluxos de Usuário Principais

### Fluxo de Registro de Sono:
1. Usuário acessa módulo de sono
2. Visualiza registro do dia atual ou anterior
3. Adiciona rapidamente horários e qualidade
4. Opcionalmente adiciona tags ou observações
5. Visualiza o padrão semanal atualizado

### Fluxo de Definição de Metas:
1. Usuário acessa configurações de sono
2. Define horários ideais para dormir e acordar
3. Seleciona dias da semana aplicáveis
4. Configura lembretes para rotina pré-sono
5. Recebe feedback sobre progresso

### Sincronização Multiplataforma:
1. Registros de sono sincronizados entre dispositivos
2. Configurações e metas disponíveis em todas plataformas
3. Lembretes emitidos no dispositivo ativo
4. Análises e tendências acessíveis em qualquer dispositivo

## 5. Requisitos de Interface

### Existentes:
- Visualização em forma de timeline
- Cores distintas para qualidade do sono
- Entrada simplificada com valores padrão sugeridos
- Gráficos minimalistas para análises

### Ajustes para Mobile:
- Widget para registro rápido na tela inicial
- Lembretes com opção de registro direto da notificação
- Versão compacta da visualização semanal
- Entrada adaptada para períodos de baixa energia

## 6. Considerações de Acessibilidade

### Já Implementadas:
- Contraste suficiente para gráficos
- Entrada facilitada para momentos de cansaço
- Lembretes não-intrusivos e personalizáveis
- Feedback não-julgador sobre consistência

### A Manter/Aprimorar:
- Adicionar entrada por voz para registros
- Melhorar navegação por teclado na visualização semanal
- Implementar modo de baixa estimulação para rotina noturna
- Oferecer descrições textuais para elementos visuais

## 7. Estratégia de Migração

### Extração de Dados:
- Exportar histórico de registros de sono
- Preservar configurações de metas e lembretes
- Manter dados de rotinas personalizadas

### Transformação:
- Normalizar tags em tabela separada
- Converter formato de hora para padrão SQL
- Estruturar dias da semana em tabela relacionada

### Carregamento:
- Priorizar configurações de usuário
- Em seguida, metas e rotinas
- Por fim, histórico de registros
- Validar consistência temporal dos dados
