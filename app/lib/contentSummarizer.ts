export interface SummarizationOptions {
  maxLength?: number; // comprimento máximo do resumo
  complexity?: 'simple' | 'moderate' | 'detailed'; // nível de complexidade
  includeKeyPoints?: boolean; // incluir pontos-chave
  format?: 'text' | 'bullets' | 'steps'; // formato do resumo
}

export class ContentSummarizer {
  /**
   * Simplifica e resume textos para reduzir sobrecarga cognitiva
   */
  async summarizeContent(
    content: string, 
    options: SummarizationOptions = {}
  ): Promise<string> {
    const {
      maxLength = 300,
      complexity = 'moderate',
      includeKeyPoints = true,
      format = 'bullets'
    } = options;
    
    // Aqui implementaríamos a chamada para uma API de IA para resumo
    // Como exemplo, vamos criar uma versão simplificada
    
    // Simulação da lógica de resumo
    let summary = this.createSimplifiedSummary(content, maxLength, complexity);
    
    // Adicionar pontos-chave se solicitado
    if (includeKeyPoints) {
      const keyPoints = this.extractKeyPoints(content);
      
      if (format === 'bullets') {
        summary += "\n\nPontos-chave:\n" + keyPoints.map(point => `• ${point}`).join("\n");
      } else if (format === 'steps') {
        summary += "\n\nPassos principais:\n" + keyPoints.map((point, i) => `${i+1}. ${point}`).join("\n");
      } else {
        summary += " Pontos-chave: " + keyPoints.join(". ");
      }
    }
    
    return summary;
  }
  
  private createSimplifiedSummary(content: string, maxLength: number, complexity: string): string {
    // Versão simplificada - em produção usaríamos uma API NLP
    let sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Ajustar número de sentenças com base na complexidade
    let sentenceCount = 1;
    switch (complexity) {
      case 'simple': sentenceCount = Math.min(2, sentences.length); break;
      case 'moderate': sentenceCount = Math.min(4, sentences.length); break;
      case 'detailed': sentenceCount = Math.min(6, sentences.length); break;
    }
    
    let simpleSummary = sentences.slice(0, sentenceCount).join(". ") + ".";
    
    // Garantir comprimento máximo
    if (simpleSummary.length > maxLength) {
      simpleSummary = simpleSummary.substring(0, maxLength - 3) + "...";
    }
    
    return simpleSummary;
  }
  
  private extractKeyPoints(content: string): string[] {
    // Versão simplificada - em produção usaríamos uma API NLP
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Selecionar sentenças que parecem ser pontos-chave
    // (contêm palavras indicativas de importância)
    const keywordPatterns = [
      /importante/i, /principal/i, /essencial/i, /crucial/i, /fundamental/i,
      /chave/i, /destaque/i, /prioridade/i, /relevante/i, /significativo/i
    ];
    
    const keyPoints = sentences.filter(sentence => 
      keywordPatterns.some(pattern => pattern.test(sentence))
    );
    
    // Limitar a 5 pontos no máximo
    return keyPoints.slice(0, 5).map(point => point.trim());
  }
  
  /**
   * Cria uma versão do texto com formatação especial para TDAH
   * (espaçamento, cores, dicas visuais)
   */
  formatForNeurodivergent(content: string): string {
    // Nesta implementação simplificada, retornamos HTML com formatação 
    // que auxilia leitores neurodivergentes
    
    // Dividir em parágrafos
    const paragraphs = content.split(/\n\n+/);
    
    // Criar HTML com formatação especial
    let formattedHtml = '<div class="neurodivergent-friendly-text">';
    
    paragraphs.forEach(para => {
      // Aplicar formatação apenas para parágrafos não vazios
      if (para.trim().length > 0) {
        // Substituir termos importantes com destaque
        let highlightedPara = para
          .replace(/(!important|importante|atenção|atenção|nota|lembre-se|prioridade)/gi, 
                  '<span class="highlight">$1</span>');
                  
        // Adicionar parágrafo com espaçamento adequado
        formattedHtml += `<p class="nd-paragraph">${highlightedPara}</p>`;
      }
    });
    
    formattedHtml += '</div>';
    formattedHtml += `
      <style>
        .neurodivergent-friendly-text {
          line-height: 1.8;
          font-size: 1.1rem;
          max-width: 750px;
          margin: 0 auto;
        }
        .nd-paragraph {
          margin-bottom: 1.5em;
          color: #333;
          background-color: #fff;
          padding: 0.7em;
          border-left: 4px solid #638de3;
          border-radius: 4px;
        }
        .highlight {
          background-color: #ffffd0;
          font-weight: bold;
          padding: 0 3px;
          border-radius: 3px;
        }
      </style>
    `;
    
    return formattedHtml;
  }
}
