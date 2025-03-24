# PRD: Módulo Notas de Autoconhecimento

## 1. Visão Geral

**Propósito:** Oferecer um espaço estruturado para pessoas neurodivergentes registrarem insights, padrões e observações pessoais, ajudando no processo de autoconhecimento e autogestão através de uma interface visual e organizada.

**Benefícios para Neurodivergentes:**
- Estrutura visual para organizar pensamentos não-lineares
- Sistema de tags intuitivo para facilitar conexões entre ideias
- Âncoras visuais para apoiar o processamento de informação
- Modo refúgio para momentos de sobrecarga sensorial ou emocional

## 2. Funcionalidades Detalhadas

### Seções Organizadas:
- Divisão em categorias personalizáveis (padrões, gatilhos, estratégias)
- Navegação visual entre seções relacionadas
- Hierarquia flexível de notas
- Layout adaptável ao tipo de conteúdo

### Modo Refúgio:
- Interface simplificada para momentos de sobrecarga
- Entrada rápida de texto sem necessidade de categorização
- Opções de acessibilidade reforçadas (alto contraste, texto grande)
- Processamento posterior de notas rápidas

### Sistema de Tags:
- Etiquetas visuais personalizáveis
- Conexões entre notas relacionadas
- Filtragem múltipla e combinada
- Visualização de relações entre conceitos

### Âncoras Visuais:
- Opção para adicionar imagens/ícones associativos
- Codificação por cores personalizável
- Destaques visuais para informações-chave
- Símbolos consistentes para tipos de informação

## 3. Modelo de Dados

### Modelo Atual (Zustand + LocalStorage):
```typescript
// Nota de Autoconhecimento
type NotaAutoconhecimento = {
  id: string
  titulo: string
  conteudo: string
  categoria: string
  data_criacao: string
  data_modificacao: string
  tags?: string[]
  destaque: boolean
  cor?: string
  icone?: string
}

// Categoria de Nota
type CategoriaNotas = {
  id: string
  nome: string
  descricao?: string
  cor: string
  icone?: string
}

// Conexão entre Notas
type ConexaoNotas = {
  id: string
  nota_origem_id: string
  nota_destino_id: string
  tipo: string
  descricao?: string
}
```

### Modelo Proposto para Supabase:
```sql
-- Tabela Categorias de Notas
CREATE TABLE categorias_notas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descricao TEXT,
  cor TEXT,
  icone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, nome)
);

-- Tabela Notas de Autoconhecimento
CREATE TABLE notas_autoconhecimento (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  categoria_id UUID REFERENCES categorias_notas(id),
  titulo TEXT NOT NULL,
  conteudo TEXT,
  destaque BOOLEAN DEFAULT FALSE,
  cor TEXT,
  icone TEXT,
  criado_em_modo_refugio BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela Tags de Notas
CREATE TABLE nota_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nota_id UUID REFERENCES notas_autoconhecimento(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela Conexões entre Notas
CREATE TABLE conexoes_notas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nota_origem_id UUID REFERENCES notas_autoconhecimento(id) ON DELETE CASCADE,
  nota_destino_id UUID REFERENCES notas_autoconhecimento(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 4. Fluxos de Usuário Principais

### Fluxo de Criação de Nota:
1. Usuário acessa o módulo de autoconhecimento
2. Seleciona categoria ou cria nova
3. Adiciona título, conteúdo e formatação básica
4. Associa tags e âncoras visuais (opcional)
5. Salva e visualiza conexões sugeridas com outras notas

### Fluxo de Modo Refúgio:
1. Usuário ativa modo refúgio durante sobrecarga
2. Interface simplifica para entrada rápida
3. Registra pensamentos sem necessidade de estruturação
4. Posteriormente, revisa e organiza as notas quando estiver em melhor estado

### Sincronização Multiplataforma:
1. Notas criadas disponíveis em todos dispositivos
2. Sistema de categorias e tags sincronizado
3. Visualização adaptada a diferentes tamanhos de tela
4. Modo offline com sincronização posterior

## 5. Requisitos de Interface

### Existentes:
- Layout visual com cards para categorias
- Editor de texto simplificado
- Sistema visual de tags coloridas
- Visualização em lista e em grade

### Ajustes para Mobile:
- Interface adaptada para entrada em tela menor
- Gestos para navegação entre notas relacionadas
- Modo de visualização otimizado para leitura
- Entrada rápida a partir da tela inicial

## 6. Considerações de Acessibilidade

### Já Implementadas:
- Opções de alto contraste
- Tamanho de texto ajustável
- Navegação consistente entre seções
- Alternativas textuais para elementos visuais

### A Manter/Aprimorar:
- Entrada por voz para momentos de baixa energia
- Atalhos de teclado para funções frequentes
- Modos adaptados para diferentes estados sensoriais
- Feedback multimodal (visual, tátil, sonoro)

## 7. Estratégia de Migração

### Extração de Dados:
- Exportar notas existentes com metadados
- Preservar sistema de categorias personalizado
- Manter conexões entre notas
- Exportar tags associadas

### Transformação:
- Normalizar estrutura relacional
- Converter formato de datas para padrão SQL
- Preparar sistema de relações entre notas

### Carregamento:
- Migrar categorias primeiro
- Em seguida, notas com seus atributos principais
- Depois, tags associadas
- Por fim, conexões entre notas
- Validar integridade referencial entre objetos
