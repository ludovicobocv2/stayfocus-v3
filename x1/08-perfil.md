# PRD: Módulo Informações Pessoais

## 1. Visão Geral

**Propósito:** Proporcionar um centro de personalização que permita pessoas neurodivergentes configurarem a aplicação de acordo com suas preferências específicas, necessidades sensoriais e metas pessoais.

**Benefícios para Neurodivergentes:**
- Personalização da interface reduzindo sobrecarga sensorial
- Configuração de metas diárias realistas e adaptáveis
- Sistema visual de preferências para facilitar escolhas
- Ambiente adaptado às necessidades específicas do usuário

## 2. Funcionalidades Detalhadas

### Perfil Personalizável:
- Configuração de nome e preferências básicas
- Seleção de tema visual (claro, escuro, contraste)
- Ajustes de tamanho de fonte e densidade da interface
- Preferências de notificação (visual, tátil, sonora)

### Metas Diárias:
- Definição de objetivos diários personalizados
- Visualização de progresso em formato simplificado
- Ajuste dinâmico de dificuldade baseado em histórico
- Celebração visual de conquistas consistentes

### Preferências Visuais:
- Seleção de esquemas de cores por módulo
- Densidade de informação ajustável
- Configuração de elementos visuais (ícones, animações)
- Modos para diferentes estados sensoriais/energia

## 3. Modelo de Dados

### Modelo Atual (Zustand + LocalStorage):
```typescript
// Perfil Usuário
type PerfilUsuario = {
  id: string
  nome: string
  email: string
  tema: 'claro' | 'escuro' | 'contraste'
  tamanho_fonte: 'pequeno' | 'medio' | 'grande'
  densidade: 'compacta' | 'normal' | 'espaçada'
  preferencia_notificacao: {
    visual: boolean
    tátil: boolean
    sonora: boolean
  }
}

// Metas Diárias
type MetaDiaria = {
  id: string
  categoria: string
  descricao: string
  quantidade_alvo: number
  unidade?: string
  dias_semana: number[] // 0-6, domingo a sábado
  ativa: boolean
}

// Preferências por Módulo
type PreferenciaModulo = {
  modulo: string
  cor_principal: string
  mostrar_resumo: boolean
  notificacoes_ativas: boolean
  ordem_exibicao: number
}
```

### Modelo Proposto para Supabase:
```sql
-- Tabela Users (já criada anteriormente)
CREATE TABLE users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela Preferências Visuais
CREATE TABLE preferencias_visuais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tema TEXT CHECK (tema IN ('claro', 'escuro', 'contraste')),
  tamanho_fonte TEXT CHECK (tamanho_fonte IN ('pequeno', 'medio', 'grande')),
  densidade TEXT CHECK (densidade IN ('compacta', 'normal', 'espacada')),
  notificacao_visual BOOLEAN DEFAULT TRUE,
  notificacao_tatil BOOLEAN DEFAULT TRUE,
  notificacao_sonora BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Tabela Metas Diárias
CREATE TABLE metas_diarias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  categoria TEXT NOT NULL,
  descricao TEXT NOT NULL,
  quantidade_alvo INTEGER NOT NULL,
  unidade TEXT,
  ativa BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela Dias de Metas
CREATE TABLE meta_diaria_dias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meta_id UUID REFERENCES metas_diarias(id) ON DELETE CASCADE,
  dia_semana SMALLINT CHECK (dia_semana BETWEEN 0 AND 6)
);

-- Tabela Preferências de Módulos
CREATE TABLE preferencias_modulo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  modulo TEXT NOT NULL,
  cor_principal TEXT,
  mostrar_resumo BOOLEAN DEFAULT TRUE,
  notificacoes_ativas BOOLEAN DEFAULT TRUE,
  ordem_exibicao INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, modulo)
);
```

## 4. Fluxos de Usuário Principais

### Fluxo de Configuração Inicial:
1. Novo usuário completa cadastro básico
2. É direcionado para tela de preferências essenciais
3. Seleciona tema, tamanho de fonte e preferências de notificação
4. Configurações são aplicadas imediatamente

### Fluxo de Personalização:
1. Usuário acessa configurações de perfil
2. Ajusta preferências visuais específicas
3. Visualiza mudanças em tempo real
4. Confirma e salva novas configurações

### Sincronização Multiplataforma:
1. Preferências sincronizadas entre todos dispositivos
2. Ajustes específicos por tipo de dispositivo (quando necessário)
3. Acessibilidade mantida consistente entre plataformas
4. Metas diárias atualizadas em tempo real

## 5. Requisitos de Interface

### Existentes:
- Controles visuais para seleção de temas
- Visualização em tempo real de mudanças
- Agrupamento lógico de configurações relacionadas
- Controles deslizantes para ajustes graduais

### Ajustes para Mobile:
- Layout otimizado para controles táteis
- Acesso rápido às configurações mais usadas
- Opção de importar/exportar configurações
- Ajustes específicos para orientação da tela

## 6. Considerações de Acessibilidade

### Já Implementadas:
- Suporte a temas de alto contraste
- Opções para aumento de fonte
- Navegação consistente por teclado
- Feedback visual para todas ações

### A Manter/Aprimorar:
- Compatibilidade total com leitores de tela
- Acesso contextual a configurações relevantes
- Opções para diferentes perfis sensoriais
- Navegação simplificada para baixa energia

## 7. Estratégia de Migração

### Extração de Dados:
- Exportar perfil e preferências do usuário
- Preservar metas personalizadas
- Manter configurações específicas por módulo

### Transformação:
- Normalizar estrutura de dias da semana
- Converter configurações para formato relacional
- Preparar para associação com sistema de autenticação

### Carregamento:
- Associar com conta de usuário no Supabase Auth
- Importar preferências visuais
- Carregar metas personalizadas
- Configurar preferências por módulo
- Validar integridade das configurações do usuário
