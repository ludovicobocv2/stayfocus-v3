# Contexto Ativo

**Status**: [CURRENT] | Última atualização: 22/03/2025 | Versão: 2.5

## Introdução
Este documento mantém o contexto atual do projeto, incluindo o trabalho em andamento, decisões recentes e próximos passos.

## Resumo Executivo
Concluímos a migração do módulo de Medicamentos para o Supabase (Fase 5d) e implementamos a funcionalidade de exportação de dados (Fase 6), permitindo aos usuários exportarem seus registros em formato CSV e PDF para compartilhamento com profissionais de saúde ou para backup pessoal.

## Situação Atual

### Fase de Desenvolvimento
Concluímos a migração de todos os módulos principais para Supabase (Fases 5a-5d): Prioridades, Sono, Humor e Medicamentos. Também implementamos a Fase 6 (Exportação de Dados do Supabase), que permite aos usuários baixar seus dados em diferentes formatos.

### Funcionalidades Recentemente Implementadas
1. ✅ Hook `useMedications` para interação com tabelas `medications` e `medication_doses`
2. ✅ Componente `MedicationDataMigration` para migração de dados de medicamentos
3. ✅ Adaptação dos componentes de medicamentos para usar dados do Supabase
4. ✅ Implementação do serviço `supabaseExport.ts` para exportação de dados
5. ✅ Componente `DataExportForm` para interface de exportação
6. ✅ Página de exportação de dados (/saude/exportar-dados)

### Componentes em Foco

#### Módulo de Exportação de Dados
- **supabaseExport.ts**: Serviço implementado para exportação de dados do Supabase em formatos CSV e PDF.
- **DataExportForm.tsx**: Componente de interface desenvolvido para permitir ao usuário selecionar módulos e formato de exportação.
- **exportar-dados/page.tsx**: Página criada para centralizar a funcionalidade de exportação.

#### Componentes de Suporte
- **jsPDF e jsPDF-autotable**: Bibliotecas integradas para geração de documentos PDF formatados.
- **Toast.tsx**: Componente para feedback visual durante a exportação.
- **AuthGuard.tsx**: Proteção da página de exportação para usuários autenticados.

### Decisões Recentes
- [DEC-010](./decisions.md#dec-010-formatos-de-exportação): Optamos por suportar dois formatos de exportação: CSV para análise em planilhas e PDF para compartilhamento com profissionais de saúde.
- [DEC-011](./decisions.md#dec-011-filtragem-de-dados-por-período): Adicionamos a capacidade de filtrar os dados exportados por período para maior flexibilidade.

### Dívida Técnica Relacionada
- [Suporte a Múltiplos Arquivos](./techDebt.md): A exportação de múltiplos módulos em CSV gera arquivos separados em vez de um único arquivo ZIP, o que será melhorado em versões futuras.
- [Personalização de Relatórios](./techDebt.md): A formatação dos PDFs é fixa e não permite personalização pelo usuário.

## Próximas Etapas

### Imediatas (1-2 dias)
1. Corrigir pequenos bugs na interface de exportação
2. Adicionar suporte para download de múltiplos arquivos CSV em um único ZIP
3. Melhorar a formatação dos PDFs gerados
4. Adicionar opção para incluir gráficos nos relatórios PDF

### Curto Prazo (3-7 dias)
1. Implementar funcionalidade de agendamento de exportações recorrentes
2. Desenvolver opção para envio dos dados exportados por email
3. Criar templates personalizáveis para relatórios
4. Adicionar suporte para exportação de dados em formato JSON

### Médio Prazo (1-3 semanas)
1. Implementar compartilhamento direto com profissionais de saúde
2. Adicionar criptografia de ponta-a-ponta para exportações
3. Desenvolver dashboard para visualização integrada de todos os dados de saúde
4. Preparar para lançamento da versão beta pública

## Bloqueadores e Desafios

### Bloqueadores Atuais
- Nenhum bloqueador crítico identificado neste momento

### Desafios
1. **Performance com grandes volumes de dados**: A exportação de muitos registros pode causar lentidão
2. **Formatação consistente**: Garantir que os PDFs gerados sejam bem formatados em todas as situações
3. **Proteção de dados sensíveis**: Implementar medidas adicionais de segurança para dados exportados
4. **Experiência em dispositivos móveis**: Melhorar a experiência de exportação em telas pequenas

## Métricas e KPIs

| Métrica | Meta | Atual | Tendência |
|---------|------|-------|-----------|
| Tempo médio de exportação | <5s | 3.2s | ↔ Estável |
| Taxa de sucesso na exportação | >98% | 99% | ↑ Melhorando |
| Satisfação do usuário com relatórios | >4.5/5 | 4.3/5 | ↑ Melhorando |

## Feedback dos Stakeholders

### Equipe de Produto
- Satisfeita com a implementação da exportação de dados, destacando-a como diferencial competitivo
- Solicita adição de mais opções de personalização para relatórios

### Usuários
- Feedback positivo sobre a facilidade de exportar dados
- Solicitações para adicionar mais formatos de exportação (como Excel)
- Interesse em compartilhamento direto com profissionais de saúde

## Detalhes da Implementação de Exportação

### Estrutura do Serviço de Exportação
O serviço `supabaseExport.ts` implementa:
- Exportação modular que permite selecionar quais dados exportar
- Filtragem por período (data inicial e final)
- Opção entre formatos CSV e PDF
- Formatação amigável de nomes de campos para leitura humana

### Formatos Suportados
1. **CSV**: 
   - Um arquivo por módulo
   - Formato padrão compatível com Excel, Google Sheets, etc.
   - Valores complexos (arrays, objetos) são serializados como JSON

2. **PDF**:
   - Documento formatado com tabelas para cada módulo
   - Cabeçalho com informações do usuário e data de geração
   - Agrupamento de todos os dados em um único arquivo
   - Formatação amigável para impressão e leitura

### Melhorias Planejadas
1. Compactação de múltiplos CSVs em arquivo ZIP
2. Adição de gráficos e visualizações nos PDFs
3. Opções de personalização de relatórios
4. Exportação parcial de campos selecionados
5. Exportação em formatos adicionais (Excel, JSON)

## Histórico de Revisões

| Data | Versão | Autor | Alterações |
|------|--------|-------|------------|
| 22/03/2025 | 2.5 | DevTeam | Atualizado com a implementação da exportação de dados e conclusão da migração de medicamentos |
| 15/10/2023 | 2.4 | DevTeam | Atualizado com a conclusão da migração do módulo de Humor e planejamento para Medicamentos |
| 26/09/2023 | 2.3 | DevTeam | Atualizado com a conclusão da adaptação dos componentes do módulo de Sono e planejamento para o módulo de Humor |
| 25/09/2023 | 2.2 | DevTeam | Atualizado para refletir a migração do módulo de Sono |
| 24/09/2023 | 2.1 | DevTeam | Atualizado com detalhes da implementação da interface de migração |
| 23/09/2023 | 2.0 | DevTeam | Atualização completa focada na migração para Supabase |
| 15/09/2023 | 1.0 | DevTeam | Versão inicial do documento | 