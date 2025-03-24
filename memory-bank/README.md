# Memory Bank do MyNeuroApp

## Status: [CURRENT] | Última Atualização: Data Atual | Versão: 1.0

## Introdução
Este diretório contém a documentação completa (Memory Bank) do projeto MyNeuroApp, uma aplicação web para pessoas neurodivergentes. O Memory Bank serve como fonte única de verdade para todos os aspectos do projeto.

## Resumo Executivo
O Memory Bank é um sistema de documentação estruturado que armazena todo o conhecimento do projeto, desde sua visão geral até detalhes técnicos específicos. Ele é projetado para manter uma documentação consistente e atualizada, facilitando a compreensão do projeto por qualquer pessoa que trabalhe nele.

## Pontos-Chave [IMPORTANTE]
- O Memory Bank é a fonte única de verdade para o projeto
- A documentação segue uma estrutura hierárquica clara
- Todos os documentos seguem um formato padronizado
- A atualização regular da documentação é essencial
- O índice (index.md) é o ponto de entrada central

## Estrutura do Memory Bank

```
memory-bank/
│
├── core/                          # Documentação central
│   ├── projectbrief.md            # Visão geral do projeto
│   ├── productContext.md          # Contexto do produto
│   ├── activeContext.md           # Foco atual do desenvolvimento
│   ├── systemPatterns.md          # Padrões técnicos e arquiteturais
│   ├── techContext.md             # Contexto técnico
│   └── progress.md                # Status atual e progresso
│
├── navigation/                    # Documentos de navegação
│   ├── index.md                   # Índice geral (ponto de entrada)
│   ├── knowledgeGraph.md          # Grafo visual de relações
│   ├── timeline.md                # Linha do tempo do projeto
│   ├── changelog.md               # Registro de mudanças
│   └── communicationRegistry.md   # Registro de comunicações
│
├── specialized/                   # Documentação especializada
│   ├── decisions.md               # Registro de decisões
│   ├── techDebt.md                # Dívida técnica
│   ├── codeDocMap.md              # Mapeamento código-documentação
│   ├── llm_patterns.md            # Padrões de interação com LLMs
│   └── code_generation_guidelines.md  # Diretrizes para geração de código
│
├── modules/                       # Documentação por módulo
│   ├── homepage.md                # Módulo da página inicial
│   ├── food.md                    # Módulo de alimentação
│   ├── health.md                  # Módulo de saúde
│   └── ...                        # Outros módulos
│
├── templates/                     # Templates para documentação
│   ├── document_template.md       # Template básico de documento
│   ├── decision_template.md       # Template para decisões
│   └── ...                        # Outros templates
│
├── views/                         # Visualizações específicas
│   ├── developer_view.md          # Visão para desenvolvedores
│   ├── manager_view.md            # Visão para gerentes
│   └── ...                        # Outras visualizações
│
└── README.md                      # Este arquivo
```

## Como Usar o Memory Bank

### Para Novos Membros da Equipe
1. Comece pelo arquivo `navigation/index.md`
2. Leia os documentos core na seguinte ordem:
   - `core/projectbrief.md`
   - `core/productContext.md`
   - `core/activeContext.md`
3. Explore a documentação específica do seu papel utilizando as visualizações em `views/`

### Para Desenvolvedores Atuais
1. Consulte `core/activeContext.md` para entender o foco atual
2. Verifique `core/systemPatterns.md` e `specialized/decisions.md` antes de implementar novas funcionalidades
3. Consulte a documentação específica do módulo em que está trabalhando
4. Atualize a documentação após fazer alterações significativas

### Para Atualizar a Documentação
1. Siga o formato padrão definido nos templates
2. Atualize o status do documento e a data de última atualização
3. Registre a mudança no arquivo `navigation/changelog.md`
4. Atualize o índice (`navigation/index.md`) se necessário
5. Atualize qualquer documentação relacionada que possa ser afetada

## Convenções de Documentação

### Status do Documento
- **[CURRENT]**: Documento atualizado e confiável
- **[NEEDS UPDATE]**: Documento desatualizado que precisa de revisão
- **[DEPRECATED]**: Documento não mais relevante mas mantido para referência
- **[DRAFT]**: Documento em estado de rascunho
- **[REVIEW]**: Documento pronto para revisão
- **[PENDING APPROVAL]**: Documento atualizado aguardando aprovação

### Versionamento
- Versão principal (e.g., 1.0 → 2.0): Mudanças significativas
- Versão secundária (e.g., 1.0 → 1.1): Atualizações menores
- Formato de identificador único: DOC-AAAAMMDD-X.Y

### Formato Padrão dos Documentos
1. Título
2. Status e informações de versão
3. Introdução
4. Resumo Executivo
5. Pontos-Chave
6. Conteúdo Principal (seções específicas)
7. Feedback
8. Histórico de Revisões
9. Changelog

## Manutenção do Memory Bank

### Quando Atualizar
- Após concluir uma nova funcionalidade
- Quando ocorrerem mudanças no planejamento
- Ao tomar decisões técnicas importantes
- Durante revisões periódicas (semanais/mensais)
- Quando identificar inconsistências ou desatualizações

### Processo de Revisão
1. Autor atualiza o documento e altera o status para [REVIEW]
2. Revisor verifica a precisão e completude
3. Feedback é incorporado ou endereçado
4. Documento é aprovado e status alterado para [CURRENT]
5. Alterações são registradas no changelog

## Contribuição

Para contribuir com o Memory Bank:
1. Identifique lacunas ou necessidades de atualização
2. Utilize os templates apropriados
3. Mantenha a estrutura e formato consistentes
4. Submeta para revisão por outro membro da equipe
5. Atualize o índice e referências cruzadas

## Feedback

Este documento está aberto a sugestões e melhorias. Por favor, forneça feedback sobre:
- Clareza da estrutura do Memory Bank
- Facilidade de uso e navegação
- Áreas não cobertas pela documentação atual
- Sugestões para melhorias no processo

## Histórico de Revisões

| Data | Versão | Autor | Mudanças |
|------|--------|-------|----------|
| Data Atual | 1.0 | Equipe | Versão inicial |

## Changelog

- **DOC-20230322-1.0**: Criação do documento README.md 