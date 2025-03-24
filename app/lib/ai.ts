import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

// Verifica se a chave da API do Gemini está configurada
if (!process.env.GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY não configurada. Funcionalidades de IA não estarão disponíveis.");
}

// Inicializa o cliente do Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Inicializa o modelo do Gemini 2.0-flash
const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    temperature: 0.5,
    topP: 0.8,
    topK: 40
  }
});

// Função auxiliar para adaptar o Gemini 2.0-flash ao formato esperado pelo LangChain
const model = {
  invoke: async (prompt: any) => {
    try {
      // Garantir que o prompt esteja no formato correto para o Gemini 2.0-flash
      const content = typeof prompt.content === 'string' ? prompt.content : prompt.content;
      
      // Chamar o modelo Gemini 2.0-flash
      const result = await geminiModel.generateContent(content);
      
      // Verificar se a resposta foi gerada com sucesso
      if (!result || !result.response) {
        throw new Error("Resposta vazia do modelo Gemini 2.0-flash");
      }
      
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Erro ao chamar o modelo Gemini 2.0-flash:", error);
      throw error;
    }
  }
};

const outputParser = new StringOutputParser();

/**
 * Gera recomendações para priorizar tarefas com base nas necessidades de neurodivergentes
 * @param tarefas Lista de tarefas a serem priorizadas
 * @param contexto Contexto adicional sobre o estado atual do usuário (opcional)
 * @returns Uma lista de tarefas priorizadas com explicações
 */
export async function priorizarTarefas(tarefas: string[], contexto?: string): Promise<string> {
  const template = `
  Como assistente especializado em ajudar pessoas neurodivergentes com TDAH, organize as seguintes tarefas em ordem de prioridade.
  Considere fatores como urgência, importância, tempo necessário e dificuldade.
  
  TAREFAS:
  ${tarefas.map((tarefa, index) => `${index + 1}. ${tarefa}`).join('\n')}
  
  ${contexto ? `CONTEXTO ADICIONAL:\n${contexto}\n` : ''}
  
  Para cada tarefa, forneça:
  1. Nível de prioridade (Alta, Média, Baixa)
  2. Explicação breve do motivo da priorização
  3. Sugestão de quanto tempo dedicar
  4. Uma pequena dica para facilitar o início da tarefa (vencendo a procrastinação)
  
  Apresente o resultado em formato de lista, fácil de ler e estruturado.
  `;

  const promptTemplate = PromptTemplate.fromTemplate(template);
  const chain = RunnableSequence.from([promptTemplate, model, outputParser]);
  
  return chain.invoke({ tarefas, contexto });
}

/**
 * Gera sugestões de rotina diária com base nas necessidades de neurodivergentes
 * @param acordar Horário em que o usuário acorda
 * @param dormir Horário em que o usuário dorme
 * @param preferencias Preferências e necessidades específicas do usuário
 * @returns Uma rotina diária estruturada
 */
export async function gerarRotinaDiaria(acordar: string, dormir: string, preferencias?: string): Promise<string> {
  const template = `
  Como assistente especializado em ajudar pessoas neurodivergentes com TDAH, crie uma rotina diária estruturada.
  
  HORÁRIO DE ACORDAR: ${acordar}
  HORÁRIO DE DORMIR: ${dormir}
  ${preferencias ? `PREFERÊNCIAS E NECESSIDADES:\n${preferencias}\n` : ''}
  
  Crie uma rotina que:
  1. Inclua blocos de tempo específicos para diferentes atividades
  2. Tenha intervalos regulares para descanso
  3. Alterne entre tarefas que exigem foco intenso e tarefas mais leves
  4. Inclua lembretes para necessidades básicas (alimentação, hidratação, etc.)
  5. Reserve tempo para lazer e atividades prazerosas
  
  Apresente a rotina em formato de cronograma, fácil de seguir e com horários específicos.
  Inclua pequenas dicas para transição entre atividades.
  `;

  const promptTemplate = PromptTemplate.fromTemplate(template);
  const chain = RunnableSequence.from([promptTemplate, model, outputParser]);
  
  return chain.invoke({ acordar, dormir, preferencias });
}

/**
 * Analisa as tendências de humor e sugere ações para melhorar bem-estar
 * @param registrosHumor Array de registros de humor com data e nível
 * @returns Análise e sugestões personalizadas
 */
export async function analisarHumor(registrosHumor: Array<{ data: string, nivel: number, notas?: string }>): Promise<string> {
  const template = `
  Como assistente especializado em ajudar pessoas neurodivergentes com TDAH, analise os seguintes registros de humor:
  
  REGISTROS DE HUMOR:
  ${registrosHumor.map(r => `Data: ${r.data}, Nível: ${r.nivel}/10 ${r.notas ? `, Notas: ${r.notas}` : ''}`).join('\n')}
  
  Com base nesses registros:
  1. Identifique padrões ou tendências no humor
  2. Sugira possíveis gatilhos para alterações de humor
  3. Recomende 3-5 estratégias específicas para melhorar o bem-estar emocional
  4. Destaque pontos positivos (se houver)
  
  Considere que pessoas com TDAH podem ter desregulação emocional e responda com sensibilidade.
  Foque em sugestões práticas e implementáveis.
  `;

  const promptTemplate = PromptTemplate.fromTemplate(template);
  const chain = RunnableSequence.from([promptTemplate, model, outputParser]);
  
  return chain.invoke({ registrosHumor: JSON.stringify(registrosHumor) });
}

/**
 * Gera estratégias para melhorar a qualidade do sono
 * @param horasDormidas Média de horas dormidas recentemente
 * @param problemas Problemas específicos de sono relatados
 * @returns Estratégias personalizadas para melhorar o sono
 */
export async function estrategiasSono(horasDormidas: number, problemas?: string[]): Promise<string> {
  const template = `
  Como assistente especializado em ajudar pessoas neurodivergentes com TDAH, sugira estratégias para melhorar o sono.
  
  MÉDIA DE HORAS DORMIDAS: ${horasDormidas} horas por noite
  ${problemas ? `PROBLEMAS ESPECÍFICOS:\n${problemas.map(p => `- ${p}`).join('\n')}\n` : ''}
  
  Pessoas com TDAH frequentemente enfrentam desafios com o sono, incluindo dificuldade para adormecer, sono agitado e manutenção de uma rotina regular.
  
  Forneça:
  1. Uma explicação sobre como o TDAH afeta o sono
  2. 5-7 estratégias específicas e práticas para melhorar a qualidade do sono
  3. Sugestões de rotina noturna que podem ajudar
  4. Quando procurar ajuda profissional
  
  Suas sugestões devem ser específicas para pessoas com TDAH e considerar a dificuldade em manter rotinas.
  `;

  const promptTemplate = PromptTemplate.fromTemplate(template);
  const chain = RunnableSequence.from([promptTemplate, model, outputParser]);
  
  return chain.invoke({ horasDormidas, problemas: problemas ? problemas.join(', ') : '' });
}

/**
 * Gera um plano de estudos adaptado para neurodivergentes
 * @param assunto Assunto a ser estudado
 * @param objetivo Objetivo de aprendizado
 * @param tempoDisponivel Tempo disponível para estudo (em minutos/horas)
 * @returns Um plano de estudos estruturado
 */
export async function planoDeEstudos(assunto: string, objetivo: string, tempoDisponivel: string): Promise<string> {
  const template = `
  Como assistente especializado em ajudar pessoas neurodivergentes com TDAH, crie um plano de estudos para o seguinte:
  
  ASSUNTO: ${assunto}
  OBJETIVO: ${objetivo}
  TEMPO DISPONÍVEL: ${tempoDisponivel}
  
  Crie um plano de estudos que:
  1. Divida o conteúdo em segmentos pequenos e gerenciáveis
  2. Utilize técnicas como Pomodoro (25 minutos de estudo, 5 de pausa)
  3. Incorpore diferentes métodos de aprendizado (visual, auditivo, prático)
  4. Inclua intervalos regulares e microrrotinas
  5. Utilize estratégias para manter o engajamento e evitar a procrastinação
  
  Adicione dicas específicas para manter o foco durante cada sessão de estudo.
  O plano deve ser realista, considerando as dificuldades de atenção relacionadas ao TDAH.
  `;

  const promptTemplate = PromptTemplate.fromTemplate(template);
  const chain = RunnableSequence.from([promptTemplate, model, outputParser]);
  
  return chain.invoke({ assunto, objetivo, tempoDisponivel });
}

/**
 * Analisa padrões de gastos e sugere estratégias para organização financeira
 * @param categorias Categorias de gastos e valores
 * @param renda Renda disponível
 * @returns Análise e recomendações para organização financeira
 */
export async function analiseFinanceira(categorias: Record<string, number>, renda: number): Promise<string> {
  const template = `
  Como assistente especializado em ajudar pessoas neurodivergentes com TDAH, analise os seguintes dados financeiros:
  
  RENDA DISPONÍVEL: R$ ${renda}
  
  CATEGORIAS DE GASTOS:
  ${Object.entries(categorias).map(([categoria, valor]) => `${categoria}: R$ ${valor}`).join('\n')}
  
  Pessoas com TDAH frequentemente enfrentam desafios com gestão financeira, incluindo compras por impulso, dificuldade em manter um orçamento e falta de planejamento de longo prazo.
  
  Forneça:
  1. Uma análise simples dos gastos atuais (percentuais por categoria)
  2. Identificação de possíveis áreas de melhoria
  3. 3-5 estratégias práticas para melhorar a organização financeira, específicas para pessoas com TDAH
  4. Sugestões de ferramentas ou sistemas que podem ajudar a automatizar e simplificar o gerenciamento financeiro
  
  Mantenha suas recomendações simples, práticas e fáceis de implementar.
  `;

  const promptTemplate = PromptTemplate.fromTemplate(template);
  const chain = RunnableSequence.from([promptTemplate, model, outputParser]);
  
  return chain.invoke({ categorias: JSON.stringify(categorias), renda });
}