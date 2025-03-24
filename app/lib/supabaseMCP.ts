import { createClient } from './supabase';
import { User } from '@supabase/supabase-js';
import { ModuleType } from './supabaseExport';

export interface MCPQueryResult {
  success: boolean;
  data?: any;
  error?: string;
}

export class SupabaseMCP {
  private userId: string;

  constructor(user: User | null) {
    if (!user) throw new Error('Usuário não autenticado');
    this.userId = user.id;
  }

  /**
   * Executa uma consulta SQL direta no Supabase
   */
  async executeRawQuery(query: string, params?: any[]): Promise<MCPQueryResult> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc('execute_sql', {
        query_text: query,
        query_params: params || []
      });
      
      if (error) throw error;
      
      return {
        success: true,
        data
      };
    } catch (error: any) {
      console.error('Erro ao executar consulta SQL:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtém dados de um módulo específico com filtros avançados
   */
  async getModuleData(module: ModuleType, filters: Record<string, any> = {}): Promise<MCPQueryResult> {
    try {
      const supabase = createClient();
      let query = supabase.from(module).select('*').eq('user_id', this.userId);
      
      // Aplicar filtros dinâmicos
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'dateRange' && value.start && value.end) {
            if (module === 'sleep_records') {
              query = query.gte('start_time', value.start).lte('end_time', value.end);
            } else if (module === 'mood_records') {
              query = query.gte('record_date', value.start).lte('record_date', value.end);
            }
          } else {
            query = query.eq(key, value);
          }
        }
      });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return {
        success: true,
        data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Cria função SQL para análise de tendências
   */
  async createTrendAnalysisFunction(): Promise<MCPQueryResult> {
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION analyze_mood_trends(user_uuid UUID, start_date DATE, end_date DATE)
      RETURNS TABLE (
        date_group TEXT,
        avg_mood NUMERIC,
        common_factors TEXT[]
      ) AS $$
      BEGIN
        RETURN QUERY
        SELECT
          TO_CHAR(record_date, 'YYYY-MM') as date_group,
          AVG(mood_level)::NUMERIC(10,2) as avg_mood,
          ARRAY(
            SELECT UNNEST(x.factors) as factor
            FROM mood_records x
            WHERE x.user_id = user_uuid 
              AND x.record_date BETWEEN start_date AND end_date
            GROUP BY factor
            ORDER BY COUNT(*) DESC
            LIMIT 3
          ) as common_factors
        FROM mood_records
        WHERE user_id = user_uuid 
          AND record_date BETWEEN start_date AND end_date
        GROUP BY date_group
        ORDER BY date_group;
      END;
      $$ LANGUAGE plpgsql;
    `;
    
    return this.executeRawQuery(createFunctionSQL);
  }
}
