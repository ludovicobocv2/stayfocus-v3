# PRD: Módulo Página Inicial

## 1. Visão Geral

**Propósito:** Fornecer uma visão consolidada do dia para pessoas neurodivergentes, centralizando as informações mais importantes em um único local para reduzir a sobrecarga cognitiva e facilitar o planejamento diário.

**Benefícios para Neurodivergentes:**
- Reduz a sobrecarga de decisões ao evidenciar prioridades claras
- Fornece lembretes visuais para pausas e medicamentos, auxiliando na gestão da atenção
- Oferece estrutura previsível e visual para organizar o dia

## 2. Funcionalidades Detalhadas

### Painel do Dia:
- Exibição clara da data atual
- Resumo visual de atividades programadas
- Indicadores de progresso das metas diárias
- Status das pausas programadas

### Lista de Prioridades:
- Limitação a 3 prioridades principais para evitar sobrecarga
- Estado de conclusão visível (concluído/pendente)
- Histórico de prioridades por data
- Navegação simplificada entre datas

### Lembretes de Pausas:
- Notificações visuais para pausas programadas
- Temporizador de intervalo ajustável
- Registro de pausas completadas
- Sugestões de atividades para pausa

### Checklist de Medicamentos:
- Lista de medicamentos do dia
- Indicadores visuais de doses tomadas/pendentes
- Horários programados com alertas
- Histórico de adesão à medicação

## 3. Modelo de Dados

### Modelo Atual (Zustand + LocalStorage):
```typescript
// Prioridades
type Prioridade = {
  id: string
  texto: string
  concluida: boolean
  data: string // formato ISO: YYYY-MM-DD
}

// Pausas
type Pausa = {
  id: string
  horario: string
  realizada: boolean
  duracao: number
}

// Medicamentos
type Medicamento = {
  id: string
  nome: string
  dosagem: string
  horarios: string[]
  tomados: string[]
  data: string
}
```

### Modelo Proposto para Supabase:
```sql
-- Tabela Users
CREATE TABLE users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela Prioridades
CREATE TABLE prioridades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  texto TEXT NOT NULL,
  concluida BOOLEAN DEFAULT FALSE,
  data DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela Pausas
CREATE TABLE pausas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  horario TIME NOT NULL,
  realizada BOOLEAN DEFAULT FALSE,
  duracao INTEGER NOT NULL,
  data DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela Medicamentos
CREATE TABLE medicamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  dosagem TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela Horários de Medicamentos
CREATE TABLE medicamento_horarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  medicamento_id UUID REFERENCES medicamentos(id) ON DELETE CASCADE,
  horario TIME NOT NULL,
  data DATE NOT NULL,
  tomado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 4. Fluxos de Usuário Principais

### Fluxo de Prioridades:
1. Usuário acessa a página inicial
2. Visualiza suas prioridades do dia
3. Adiciona nova prioridade (máximo 3)
4. Marca prioridades como concluídas
5. Navega pelo histórico de prioridades (opcional)

### Sincronização Multiplataforma:
1. Usuário adiciona prioridade no celular
2. A prioridade é sincronizada com o Supabase
3. Quando o usuário acessa a versão web, a prioridade aparece atualizada
4. Estado de conclusão é sincronizado entre dispositivos

## 5. Requisitos de Interface

### Existentes:
- Layout responsivo com cards bem definidos
- Ícones claros e consistentes (Lucide Icons)
- Feedback visual imediato para ações
- Limitação intencional de elementos na tela

### Ajustes para Mobile:
- Adaptar layout para tela vertical
- Implementar gestos de toque para marcação de tarefas
- Ajustar tamanho de elementos táteis (mínimo 44x44px)
- Implementar navegação por abas para facilitar acesso

## 6. Considerações de Acessibilidade

### Já Implementadas:
- Labels ARIA em todos componentes interativos
- Contraste adequado entre texto e fundo
- Foco visual claro em elementos interativos
- Feedback de estado para tarefas concluídas

### A Manter/Aprimorar:
- Implementar suporte a VoiceOver/TalkBack
- Melhorar navegação por teclado entre plataformas
- Adicionar feedback tátil em dispositivos móveis
- Garantir que todas funções sejam acessíveis sem depender de cores

## 7. Estratégia de Migração

### Extração de Dados:
- Exportar dados do LocalStorage em formato JSON
- Mapear IDs de usuário para dados existentes

### Transformação:
- Converter dados para o esquema do Supabase
- Adicionar campos necessários para relacionamentos

### Carregamento:
- Criar tabelas no Supabase 
- Carregar dados transformados via operações em lote
- Verificar integridade dos dados após importação

### Validação:
- Comparar contagens de registros entre origem e destino
- Verificar dados de amostra para garantir correspondência
- Testes de leitura/escrita na nova estrutura
