# Integração com IA - Gemini 2.0-flash

## Visão Geral

Este diretório contém a integração com o modelo Gemini 2.0-flash do Google, que é usado para fornecer funcionalidades de IA para usuários neurodivergentes no aplicativo.

## Arquivos Principais

- `ai.ts`: Contém a configuração do modelo Gemini 2.0-flash e funções para diferentes casos de uso.

## Modelo Utilizado

O aplicativo utiliza o modelo `gemini-2.0-flash` do Google, que oferece:

- Respostas mais rápidas que o modelo anterior (gemini-pro)
- Melhor qualidade de resposta para casos de uso específicos
- Otimização para prompts de tamanho médio

## Configuração

Para que a integração funcione corretamente, é necessário configurar a variável de ambiente `GEMINI_API_KEY` com uma chave de API válida do Google AI Studio.

## Funções Disponíveis

O arquivo `ai.ts` exporta as seguintes funções:

- `priorizarTarefas`: Ajuda a priorizar tarefas considerando necessidades de pessoas com TDAH
- `gerarRotinaDiaria`: Cria uma rotina diária estruturada
- `analisarHumor`: Analisa registros de humor e sugere estratégias
- `estrategiasSono`: Fornece estratégias para melhorar a qualidade do sono
- `planoDeEstudos`: Gera um plano de estudos adaptado para neurodivergentes
- `analiseFinanceira`: Analisa padrões de gastos e sugere estratégias financeiras

## Uso

Importe as funções necessárias do arquivo `ai.ts` e utilize-as em seus componentes:

```typescript
import { priorizarTarefas } from '@/app/lib/ai';

// Exemplo de uso
const resultado = await priorizarTarefas(['Tarefa 1', 'Tarefa 2'], 'Contexto adicional');
```

## Manutenção

Ao atualizar o modelo ou adicionar novas funcionalidades, certifique-se de:

1. Testar todas as funções existentes para garantir compatibilidade
2. Atualizar a documentação com novas funções ou parâmetros
3. Ajustar os parâmetros de geração (temperatura, topP, topK) conforme necessário para cada caso de uso