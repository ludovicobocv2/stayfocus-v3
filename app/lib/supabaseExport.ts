/**
 * Serviço para exportação de dados do Supabase para formatos CSV e PDF
 * Permite que usuários façam backup e compartilhem seus dados com profissionais de saúde
 */

import { createClient } from '@/app/lib/supabase';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { User } from '@supabase/supabase-js';

// Tipos de módulos que podem ser exportados
export type ModuleType = 'priorities' | 'sleep_records' | 'mood_records' | 'medications';

// Opções de formato para exportação
export type ExportFormat = 'csv' | 'pdf';

// Opções para exportação
export interface ExportOptions {
  startDate?: Date;
  endDate?: Date;
  modules: ModuleType[];
  format: ExportFormat;
}

// Resultado da exportação
export interface ExportResult {
  success: boolean;
  message?: string;
  error?: string;
  filename?: string;
}

/**
 * Exporta dados do Supabase para o formato selecionado
 * @param user Usuário atual autenticado
 * @param options Opções de exportação (formato, datas, módulos)
 * @returns Resultado da exportação
 */
export const exportSupabaseData = async (
  user: User | null,
  options: ExportOptions
): Promise<ExportResult> => {
  if (!user) {
    return {
      success: false,
      error: 'Usuário não autenticado',
    };
  }

  try {
    const supabase = createClient();
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const data: Record<string, any[]> = {};

    // Buscar dados de cada módulo selecionado
    for (const module of options.modules) {
      let query = supabase.from(module).select('*').eq('user_id', user.id);

      // Aplicar filtros de data se forem fornecidos
      if (options.startDate) {
        const dateField = getDateFieldForModule(module);
        query = query.gte(dateField, options.startDate.toISOString());
      }

      if (options.endDate) {
        const dateField = getDateFieldForModule(module);
        query = query.lte(dateField, options.endDate.toISOString());
      }

      // Executar query
      const { data: moduleData, error } = await query;

      if (error) {
        console.error(`Erro ao buscar dados de ${module}:`, error);
        continue;
      }

      data[module] = moduleData || [];
    }

    // Gerar o arquivo no formato selecionado
    if (options.format === 'csv') {
      return generateCSV(data, formattedDate);
    } else if (options.format === 'pdf') {
      return generatePDF(data, formattedDate, user);
    }

    return {
      success: false,
      error: 'Formato de exportação não suportado',
    };
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    
    return {
      success: false,
      error: `Erro ao exportar dados: ${errorMessage}`,
    };
  }
};

/**
 * Obtém o campo de data para cada tipo de módulo
 * @param module Tipo do módulo
 * @returns Nome do campo de data
 */
const getDateFieldForModule = (module: ModuleType): string => {
  switch (module) {
    case 'priorities':
      return 'created_at';
    case 'sleep_records':
      return 'start_time';
    case 'mood_records':
      return 'record_date';
    case 'medications':
      return 'created_at';
    default:
      return 'created_at';
  }
};

/**
 * Gera um arquivo CSV com os dados exportados
 * @param data Dados dos módulos
 * @param formattedDate Data formatada para o nome do arquivo
 * @returns Resultado da exportação
 */
const generateCSV = (data: Record<string, any[]>, formattedDate: string): ExportResult => {
  try {
    const modulesWithData = Object.keys(data).filter(module => data[module].length > 0);
    
    if (modulesWithData.length === 0) {
      return {
        success: false,
        error: 'Nenhum dado encontrado para exportar',
      };
    }

    // Gerar um CSV para cada módulo
    const csvFiles: Blob[] = [];
    
    for (const module of modulesWithData) {
      if (data[module].length > 0) {
        const headers = Object.keys(data[module][0]).join(',');
        const rows = data[module].map(item => 
          Object.values(item).map(value => 
            typeof value === 'object' ? JSON.stringify(value) : value
          ).join(',')
        ).join('\n');
        
        const csvContent = `${headers}\n${rows}`;
        csvFiles.push(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }));
      }
    }

    // Se há apenas um módulo, baixamos diretamente
    if (csvFiles.length === 1) {
      const url = URL.createObjectURL(csvFiles[0]);
      const filename = `myneuroapp_${modulesWithData[0]}_${formattedDate}.csv`;
      
      triggerDownload(url, filename);
      
      return {
        success: true,
        message: 'Dados exportados com sucesso',
        filename,
      };
    } 
    // Se há múltiplos módulos, criamos um arquivo zip (simplificado para este exemplo)
    else {
      // Em uma implementação real, usaríamos uma biblioteca como JSZip para criar um arquivo .zip
      // Para este exemplo, baixaremos apenas o primeiro arquivo
      const url = URL.createObjectURL(csvFiles[0]);
      const filename = `myneuroapp_${modulesWithData[0]}_${formattedDate}.csv`;
      
      triggerDownload(url, filename);
      
      return {
        success: true,
        message: `Exportado primeiro módulo (${modulesWithData[0]}). Em uma implementação completa, todos os módulos seriam compactados em um arquivo zip.`,
        filename,
      };
    }
  } catch (error) {
    console.error('Erro ao gerar CSV:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    
    return {
      success: false,
      error: `Erro ao gerar CSV: ${errorMessage}`,
    };
  }
};

/**
 * Gera um arquivo PDF com os dados exportados
 * @param data Dados dos módulos
 * @param formattedDate Data formatada para o nome do arquivo
 * @param user Usuário atual
 * @returns Resultado da exportação
 */
const generatePDF = (data: Record<string, any[]>, formattedDate: string, user: User): ExportResult => {
  try {
    const modulesWithData = Object.keys(data).filter(module => data[module].length > 0);
    
    if (modulesWithData.length === 0) {
      return {
        success: false,
        error: 'Nenhum dado encontrado para exportar',
      };
    }

    // Criar documento PDF
    const doc = new jsPDF();
    
    // Adicionar título e data
    doc.setFontSize(16);
    doc.text('MyNeuroApp - Relatório de Dados', 14, 15);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 22);
    doc.text(`Usuário: ${user.email}`, 14, 28);
    doc.line(14, 30, 196, 30); // Linha separadora
    
    let yPosition = 35;
    
    // Adicionar dados de cada módulo
    for (const module of modulesWithData) {
      const moduleData = data[module];
      
      if (moduleData.length === 0) continue;
      
      // Adicionar título do módulo
      yPosition += 10;
      doc.setFontSize(14);
      doc.text(getModuleTitle(module), 14, yPosition);
      yPosition += 5;
      
      // Configurar tabela com os dados
      const headers = Object.keys(moduleData[0]).map(key => ({
        header: formatHeaderName(key),
        dataKey: key
      }));
      
      // @ts-ignore - usando jspdf-autotable
      doc.autoTable({
        startY: yPosition,
        columns: headers,
        body: moduleData.map(item => {
          // Formatar valores de objeto para string
          const formattedItem: Record<string, any> = {};
          
          Object.entries(item).forEach(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
              formattedItem[key] = JSON.stringify(value);
            } else {
              formattedItem[key] = value;
            }
          });
          
          return formattedItem;
        }),
        didDrawPage: (data: any) => {
          // Atualizar posição Y após desenhar a tabela
          yPosition = data.cursor.y + 15;
          
          // Adicionar nova página se necessário
          if (yPosition > doc.internal.pageSize.height - 20) {
            doc.addPage();
            yPosition = 15;
          }
        }
      });
    }
    
    // Salvar o PDF
    const filename = `myneuroapp_relatorio_${formattedDate}.pdf`;
    doc.save(filename);
    
    return {
      success: true,
      message: 'PDF gerado com sucesso',
      filename,
    };
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    
    return {
      success: false,
      error: `Erro ao gerar PDF: ${errorMessage}`,
    };
  }
};

/**
 * Obtém o título formatado para cada tipo de módulo
 * @param module Tipo do módulo
 * @returns Título formatado
 */
const getModuleTitle = (module: string): string => {
  switch (module) {
    case 'priorities':
      return 'Prioridades';
    case 'sleep_records':
      return 'Registros de Sono';
    case 'mood_records':
      return 'Registros de Humor';
    case 'medications':
      return 'Medicamentos';
    default:
      return module.charAt(0).toUpperCase() + module.slice(1).replace('_', ' ');
  }
};

/**
 * Formata nomes de cabeçalho para exibição
 * @param header Nome do cabeçalho
 * @returns Nome formatado
 */
const formatHeaderName = (header: string): string => {
  return header
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Dispara o download de um arquivo
 * @param url URL do arquivo
 * @param filename Nome do arquivo
 */
const triggerDownload = (url: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  
  // Liberar URL
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
}; 