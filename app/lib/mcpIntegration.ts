import { User } from '@supabase/supabase-js';
import { SupabaseMCP, MCPQueryResult } from './supabaseMCP';
import { PostgresOptimizer } from './postgresOptimizer';
import { SequentialThinkingEngine, TaskContext } from './sequentialThinking';
import { ContentSummarizer, SummarizationOptions } from './contentSummarizer';
import { Priority } from '../types/supabase';

/**
 * Classe de integração que facilita o uso dos vários MCPs implementados
 */
export class MCPIntegrationManager {
  private supabaseMCP: SupabaseMCP;
  private postgresOptimizer: PostgresOptimizer;
  private sequentialThinking: SequentialThinkingEngine;
  private contentSummarizer: ContentSummarizer;
  
  constructor(user: User | null) {
    if (!user) throw new Error('Usuário não autenticado');
    
    this.supabaseMCP = new SupabaseMCP(user);
    this.postgresOptimizer = new PostgresOptimizer(user);
    this.sequentialThinking = new SequentialThinkingEngine();
    this.contentSummarizer = new ContentSummarizer();
  }
  
  /**
   * Configuração inicial - criar funções SQL e otimizações de banco de dados
   */
  async setupDatabase(): Promise<boolean> {
    try {
      // 1. Criar função de análise de tendências
      const trendFunctionResult = await this.supabaseMCP.createTrendAnalysisFunction();
      if (!trendFunctionResult.success) {
        console.error('Falha ao criar função de análise de tendências:', trendFunctionResult.error);
        return false;
      }
      
      // 2. Criar índices otimizados
      const indexResult = await this.postgresOptimizer.createOptimizedIndexes();
      if (!indexResult) {
        console.error('Falha ao criar índices otimizados');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Erro durante configuração do banco de dados:', error);
      return false;
    }
  }
  
  /**
   * Análise de prioridades específica para neurodivergentes
   */
  async analyzePrioritiesForNeurodivergent(
    priorities: Priority[],
    context: TaskContext
  ): Promise<{
    prioritizedTasks: Priority[],
    analysis: string,
    taskBreakdown?: Record<string, string[]>
  }> {
    // 1. Priorizar tarefas usando Sequential Thinking
    const prioritizedTasks = this.sequentialThinking.prioritizeTasks(priorities, context);
    
    // 2. Análise de padrões de conclusão
    const patterns = this.sequentialThinking.analyzeCompletionPatterns(
      context.previousCompletions || []
    );
    
    // 3. Decompor tarefas complexas
    const taskBreakdown: Record<string, string[]> = {};
    
    // Identificar e decompor tarefas complexas (>50 caracteres)
    prioritizedTasks
      .filter(task => task.content.length > 50)
      .slice(0, 3) // Foco nas 3 mais prioritárias
      .forEach(task => {
        taskBreakdown[task.id] = this.sequentialThinking.generateTaskSteps(task.content);
      });
    
    // 4. Resumir a análise usando o Content Summarizer
    const analysisText = `
      Análise de Prioridades para Neurodivergentes
      
      Baseado nos seus padrões de produtividade, você tende a ser mais produtivo no período da ${patterns.bestPeriod}, 
      especialmente por volta das ${patterns.mostProductiveHour}h.
      
      Seu nível de energia atual (${context.energyLevel}/10) e tempo disponível (${context.timeAvailable} minutos)
      foram considerados na priorização.
      
      Recomendação: ${patterns.recommendation}
      
      As tarefas foram priorizadas considerando seu contexto atual. Lembre-se de dividir 
      tarefas complexas em passos menores e mais gerenciáveis.
    `;
    
    const analysis = await this.contentSummarizer.summarizeContent(analysisText, {
      complexity: 'moderate',
      format: 'bullets',
      includeKeyPoints: true
    });
    
    return {
      prioritizedTasks,
      analysis,
      taskBreakdown
    };
  }
  
  /**
   * Executar análises avançadas sobre dados de humor
   */
  async analyzeMoodTrends(startDate: Date, endDate: Date): Promise<MCPQueryResult> {
    try {
      const query = `
        SELECT * FROM analyze_mood_trends(
          auth.uid(),
          '${startDate.toISOString().split('T')[0]}',
          '${endDate.toISOString().split('T')[0]}'
        );
      `;
      
      return await this.supabaseMCP.executeRawQuery(query);
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Formata texto para ser mais amigável a pessoas neurodivergentes
   */
  formatContentForNeurodivergent(content: string): string {
    return this.contentSummarizer.formatForNeurodivergent(content);
  }
  
  /**
   * Otimiza performance do banco de dados
   */
  async optimizeDatabasePerformance(): Promise<{
    success: boolean,
    performanceReport?: any
  }> {
    try {
      // 1. Executar vacuum analyze
      const vacuumResult = await this.postgresOptimizer.optimizeTables();
      if (!vacuumResult) {
        return { success: false };
      }
      
      // 2. Analisar estatísticas de uso
      const performanceData = await this.postgresOptimizer.analyzeQueryPerformance();
      if (!performanceData.success) {
        return { success: false };
      }
      
      return {
        success: true,
        performanceReport: performanceData.data
      };
    } catch (error) {
      console.error('Erro ao otimizar performance:', error);
      return { success: false };
    }
  }
}
