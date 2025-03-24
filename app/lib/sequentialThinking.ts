import { Priority } from '../types/supabase';

export interface TaskContext {
  energyLevel: number; // 1-10
  timeAvailable: number; // em minutos
  currentFocus: 'high' | 'medium' | 'low';
  location: 'home' | 'work' | 'outside';
  previousCompletions: Priority[]; // tarefas concluídas recentemente
}

export class SequentialThinkingEngine {
  /**
   * Prioriza tarefas de acordo com o contexto atual da pessoa com TDAH
   */
  prioritizeTasks(tasks: Priority[], context: TaskContext): Priority[] {
    // Clone para não modificar o original
    const tasksCopy = [...tasks];
    
    // Fatores de peso adaptativos
    const energyFactor = context.energyLevel / 10;
    const timeFactor = Math.min(context.timeAvailable / 120, 1); // Normalizado para 2 horas
    
    return tasksCopy.sort((a, b) => {
      // Calcular pontuação para cada tarefa com base no contexto
      const scoreA = this.calculateTaskScore(a, context, energyFactor, timeFactor);
      const scoreB = this.calculateTaskScore(b, context, energyFactor, timeFactor);
      
      return scoreB - scoreA; // Ordem decrescente de pontuação
    });
  }
  
  private calculateTaskScore(task: Priority, context: TaskContext, energyFactor: number, timeFactor: number): number {
    let score = 0;
    
    // Prazo - tarefas com prazo próximo ganham prioridade
    if (task.due_date) {
      const dueDate = new Date(task.due_date);
      const daysUntilDue = Math.max(0, Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 3600 * 24)));
      
      if (daysUntilDue <= 1) score += 30;
      else if (daysUntilDue <= 3) score += 20;
      else if (daysUntilDue <= 7) score += 10;
    }
    
    // Categoria - alinhar com o foco atual
    if (task.category === 'importante' && context.currentFocus === 'high') score += 15;
    if (task.category === 'saúde' && context.energyLevel < 5) score += 10;
    
    // Adaptação ao nível de energia
    if (energyFactor < 0.4 && task.content.length < 50) score += 10; // Tarefas curtas quando energia baixa
    if (energyFactor > 0.7) score += 5; // Bônus geral quando energia alta
    
    // Adaptação ao tempo disponível
    if (timeFactor < 0.3 && task.content.length < 30) score += 15; // Priorizar tarefas rápidas quando pouco tempo
    
    return score;
  }
  
  /**
   * Gera sequência de passos para completar uma tarefa complexa
   */
  generateTaskSteps(taskDescription: string, stepsCount: number = 5): string[] {
    // Aqui poderia integrar com uma API de IA para decompor a tarefa
    // Por enquanto, implementação simplificada
    
    const steps: string[] = [];
    
    if (taskDescription.includes("relatório")) {
      steps.push("1. Reunir dados necessários");
      steps.push("2. Criar estrutura de tópicos");
      steps.push("3. Escrever introdução");
      steps.push("4. Desenvolver corpo do relatório");
      steps.push("5. Revisar e finalizar");
    } else if (taskDescription.includes("projeto")) {
      steps.push("1. Definir objetivos claros");
      steps.push("2. Dividir em tarefas menores");
      steps.push("3. Estimar tempo para cada tarefa");
      steps.push("4. Identificar recursos necessários");
      steps.push("5. Estabelecer prazos intermediários");
    } else {
      // Passos genéricos para qualquer tarefa
      steps.push("1. Definir objetivo específico");
      steps.push("2. Dividir em subtarefas");
      steps.push("3. Eliminar distrações do ambiente");
      steps.push("4. Trabalhar em blocos de 25min (Pomodoro)");
      steps.push("5. Revisar progresso e ajustar");
    }
    
    return steps.slice(0, stepsCount);
  }
  
  /**
   * Analisa padrões de comportamento e sugere melhorias
   */
  analyzeCompletionPatterns(completedTasks: Priority[]): Record<string, any> {
    if (completedTasks.length === 0) {
      return {
        message: "Nenhuma tarefa completada para analisar",
        patterns: {}
      };
    }
    
    // Análise de tempo
    const tasksByHour: Record<number, number> = {};
    let morningCount = 0;
    let afternoonCount = 0;
    let eveningCount = 0;
    
    completedTasks.forEach(task => {
      if (!task.updated_at) return;
      
      const completionTime = new Date(task.updated_at);
      const hour = completionTime.getHours();
      
      tasksByHour[hour] = (tasksByHour[hour] || 0) + 1;
      
      if (hour >= 5 && hour < 12) morningCount++;
      else if (hour >= 12 && hour < 18) afternoonCount++;
      else eveningCount++;
    });
    
    // Encontrar hora mais produtiva
    let mostProductiveHour = 0;
    let maxTasks = 0;
    
    Object.entries(tasksByHour).forEach(([hour, count]) => {
      if (count > maxTasks) {
        mostProductiveHour = parseInt(hour);
        maxTasks = count;
      }
    });
    
    // Análise de categorias
    const categoryCounts: Record<string, number> = {};
    completedTasks.forEach(task => {
      const category = task.category || 'sem categoria';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    // Determinar melhor período do dia
    let bestPeriod = 'manhã';
    if (afternoonCount > morningCount && afternoonCount > eveningCount) {
      bestPeriod = 'tarde';
    } else if (eveningCount > morningCount && eveningCount > afternoonCount) {
      bestPeriod = 'noite';
    }
    
    return {
      bestPeriod,
      mostProductiveHour,
      categoryCounts,
      recommendation: `Você tende a ser mais produtivo no período da ${bestPeriod}, especialmente por volta das ${mostProductiveHour}h. Considere programar suas tarefas mais desafiadoras para este horário.`
    };
  }
}
