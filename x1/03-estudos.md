# PRD: Módulo Estudos

## 1. Visão Geral

**Propósito:** Proporcionar ferramentas adaptadas para gerenciamento de estudos e foco, especialmente desenvolvidas para atender às necessidades de pessoas neurodivergentes, facilitando o planejamento, foco e registro de atividades acadêmicas.

**Benefícios para Neurodivergentes:**
- Temporizador Pomodoro adaptável para diferentes perfis de atenção
- Estrutura visual clara para planejamento de sessões de estudo
- Redução da sobrecarga cognitiva através de pausas programadas
- Sistema simplificado de acompanhamento do progresso

## 2. Funcionalidades Detalhadas

### Temporizador Pomodoro Adaptado:
- Ciclos de trabalho/pausa flexíveis (não apenas 25/5)
- Ajustes de duração baseados em perfil de usuário
- Notificações visuais, sonoras e táteis configuráveis
- Modo de sessão estendida com pausas automáticas

### Registro de Estudos:
- Interface simplificada para registro de matérias/temas
- Acompanhamento visual do tempo dedicado por tema
- Histórico de sessões com métricas básicas
- Visualização semanal de distribuição de tempo

## 3. Modelo de Dados

### Modelo Atual (Zustand + LocalStorage):
```typescript
// Sessão Pomodoro
type SessaoPomodoro = {
  id: string
  duracao_trabalho: number
  duracao_pausa: number
  repeticoes: number
  tema: string
  data_inicio: string
  concluida: boolean
  ciclos_concluidos: number
}

// Registro de Estudo
type RegistroEstudo = {
  id: string
  tema: string
  data: string
  tempo_total: number
  notas?: string
}

// Configurações Pomodoro
type ConfiguracaoPomodoro = {
  duracao_trabalho_padrao: number
  duracao_pausa_padrao: number
  ciclos_padrao: number
  som_notificacao: boolean
  vibracao: boolean
}
```

### Modelo Proposto para Supabase:
```sql
-- Tabela Sessões Pomodoro
CREATE TABLE sessoes_pomodoro (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  duracao_trabalho INTEGER NOT NULL,
  duracao_pausa INTEGER NOT NULL,
  repeticoes INTEGER NOT NULL,
  tema TEXT,
  data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  data_fim TIMESTAMP WITH TIME ZONE,
  concluida BOOLEAN DEFAULT FALSE,
  ciclos_concluidos INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela Ciclos Pomodoro
CREATE TABLE ciclos_pomodoro (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sessao_id UUID REFERENCES sessoes_pomodoro(id) ON DELETE CASCADE,
  tipo TEXT CHECK (tipo IN ('trabalho', 'pausa')),
  inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  fim TIMESTAMP WITH TIME ZONE,
  concluido BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela Registros de Estudo
CREATE TABLE registros_estudo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tema TEXT NOT NULL,
  data DATE NOT NULL,
  tempo_total INTEGER NOT NULL,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela Configurações Pomodoro
CREATE TABLE configuracoes_pomodoro (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  duracao_trabalho_padrao INTEGER NOT NULL DEFAULT 25,
  duracao_pausa_padrao INTEGER NOT NULL DEFAULT 5,
  ciclos_padrao INTEGER NOT NULL DEFAULT 4,
  som_notificacao BOOLEAN DEFAULT TRUE,
  vibracao BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);
```

## 4. Fluxos de Usuário Principais

### Fluxo de Sessão Pomodoro:
1. Usuário acessa a tela de Pomodoro
2. Configura ou aceita parâmetros padrão da sessão
3. Inicia o temporizador e começa a estudar
4. Recebe notificação ao fim de cada ciclo
5. Visualiza estatísticas ao final da sessão completa

### Sincronização Multiplataforma:
1. Configurações Pomodoro sincronizadas entre dispositivos
2. Sessão em andamento pode continuar em outro dispositivo
3. Histórico de estudos acessível em qualquer plataforma
4. Dados estatísticos consolidados em tempo real

## 5. Requisitos de Interface

### Existentes:
- Timer visual grande e claro
- Indicadores de ciclo atual e progresso geral
- Controles simples e intuitivos (iniciar, pausar, pular)
- Minimização de distrações visuais durante sessões

### Ajustes para Mobile:
- Modo não-perturbador automático durante sessões
- Widget minimalista para tela de bloqueio/inicial
- Notificações persistentes durante sessões ativas
- Controles por gestos simples

## 6. Considerações de Acessibilidade

### Já Implementadas:
- Feedback visual, sonoro e tátil configurável
- Alto contraste em indicadores de tempo
- Tamanho de fonte ajustável
- Controles simples e diretos

### A Manter/Aprimorar:
- Adicionar controle por voz
- Melhorar feedback para usuários de leitores de tela
- Implementar atalhos de teclado consistentes
- Oferecer opções para diferentes perfis sensoriais

## 7. Estratégia de Migração

### Extração de Dados:
- Exportar dados de sessões históricas
- Preservar configurações personalizadas
- Manter registros de temas e tempo dedicado

### Transformação:
- Dividir sessões em ciclos individuais (normalização)
- Converter durações para formato consistente (minutos)
- Adicionar campos necessários para relacionamentos

### Carregamento:
- Manter sequência lógica de dependências
- Configurações de usuário primeiro
- Depois sessões históricas
- Por fim, ciclos detalhados
