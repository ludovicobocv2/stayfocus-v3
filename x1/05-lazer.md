# PRD: Módulo Lazer

## 1. Visão Geral

**Propósito:** Auxiliar pessoas neurodivergentes a equilibrar atividades de lazer com responsabilidades, promovendo descanso intencional e reduzindo a culpa associada a momentos de descompressão.

**Benefícios para Neurodivergentes:**
- Estrutura para momentos de lazer, reduzindo a culpa por "não estar sendo produtivo"
- Lembretes para interromper hiperfoco em atividades de lazer
- Sugestões específicas para descompressão entre tarefas
- Equilíbrio intencional entre responsabilidades e momentos de descanso

## 2. Funcionalidades Detalhadas

### Temporizador de Lazer:
- Contador dedicado para atividades de lazer
- Controles simples de início/pausa
- Notificações não-invasivas para controle de tempo
- Registro automático de duração

### Atividades de Lazer:
- Biblioteca de atividades categorizadas
- Recomendações baseadas em tempo disponível
- Registro de atividades favoritas
- Histórico de atividades realizadas

### Sugestões de Descanso:
- Opções rápidas para intervalos curtos
- Categorização por tipo de esforço mental/sensorial
- Recomendações personalizadas
- Atividades de transição para "mudar de contexto"

## 3. Modelo de Dados

### Modelo Atual (Zustand + LocalStorage):
```typescript
// Sessão de Lazer
type SessaoLazer = {
  id: string
  atividade: string
  categoria: string
  data_inicio: string
  duracao: number
  observacoes?: string
}

// Atividade de Lazer
type AtividadeLazer = {
  id: string
  nome: string
  categoria: string
  duracao_estimada: number
  favorita: boolean
  tags?: string[]
}

// Sugestão de Descanso
type SugestaoDescanso = {
  id: string
  descricao: string
  duracao: number
  tipo: string // "transição", "físico", "mental", "sensorial"
  ultima_vez?: string
}
```

### Modelo Proposto para Supabase:
```sql
-- Tabela Categorias de Lazer
CREATE TABLE categorias_lazer (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  cor TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, nome)
);

-- Tabela Atividades de Lazer
CREATE TABLE atividades_lazer (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  categoria_id UUID REFERENCES categorias_lazer(id),
  duracao_estimada INTEGER, -- em minutos
  favorita BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela Tags de Atividades
CREATE TABLE atividade_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  atividade_id UUID REFERENCES atividades_lazer(id) ON DELETE CASCADE,
  tag TEXT NOT NULL
);

-- Tabela Sessões de Lazer
CREATE TABLE sessoes_lazer (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  atividade_id UUID REFERENCES atividades_lazer(id),
  data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  data_fim TIMESTAMP WITH TIME ZONE,
  duracao INTEGER, -- em minutos
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela Sugestões de Descanso
CREATE TABLE sugestoes_descanso (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  duracao INTEGER NOT NULL, -- em minutos
  tipo TEXT CHECK (tipo IN ('transição', 'físico', 'mental', 'sensorial')),
  favorita BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela Histórico de Sugestões Usadas
CREATE TABLE historico_sugestoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sugestao_id UUID REFERENCES sugestoes_descanso(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  data TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 4. Fluxos de Usuário Principais

### Fluxo de Sessão de Lazer:
1. Usuário acessa módulo de lazer
2. Seleciona atividade da biblioteca ou adiciona nova
3. Inicia temporizador opcional
4. Recebe lembrete quando o tempo planejado terminar
5. Registra sessão ao finalizar

### Fluxo de Sugestões de Descanso:
1. Usuário busca sugestão de pausa
2. Recebe opções filtradas por tempo disponível e tipo
3. Seleciona e realiza a atividade
4. Feedback opcional após a conclusão

### Sincronização Multiplataforma:
1. Biblioteca de atividades acessível em todos dispositivos
2. Sugestões favoritas sincronizadas
3. Histórico de sessões disponível em todas plataformas
4. Continuidade de temporizadores entre dispositivos

## 5. Requisitos de Interface

### Existentes:
- Agrupamento visual de atividades por categoria
- Temporizador com visual claro e não-ansioso
- Seleção simplificada por cards
- Filtros visuais para rápida seleção

### Ajustes para Mobile:
- Widget de temporizador para tela inicial
- Acesso rápido às atividades favoritas
- Notificações para início/fim com opção de extensão
- Interface adaptável a diferentes níveis de energia

## 6. Considerações de Acessibilidade

### Já Implementadas:
- Organização visual consistente
- Uso de ícones e textos combinados
- Agrupamento lógico de elementos relacionados
- Feedback não-julgador sobre uso do tempo

### A Manter/Aprimorar:
- Implementar alternativas de texto para categorias coloridas
- Adicionar atalhos para funções frequentes
- Melhorar feedback tátil para temporizadores
- Oferecer opções para diferentes perfis sensoriais

## 7. Estratégia de Migração

### Extração de Dados:
- Exportar biblioteca de atividades personalizada
- Preservar histórico de sessões
- Manter sugestões personalizadas e favoritas

### Transformação:
- Normalizar estrutura de categorias 
- Adicionar campos para relações
- Converter timestamps para formato consistente

### Carregamento:
- Criar categorias primeiro
- Em seguida, atividades relacionadas
- Por fim, histórico de sessões
- Validar integridade das relações
