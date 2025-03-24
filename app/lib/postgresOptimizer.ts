import { SupabaseMCP } from './supabaseMCP';
import { User } from '@supabase/supabase-js';

export class PostgresOptimizer {
  private mcp: SupabaseMCP;
  
  constructor(user: User | null) {
    this.mcp = new SupabaseMCP(user);
  }
  
  /**
   * Cria índices para otimizar consultas frequentes
   */
  async createOptimizedIndexes(): Promise<boolean> {
    const indexQueries = [
      // Índice para buscas rápidas por período em registros de sono
      `CREATE INDEX IF NOT EXISTS idx_sleep_records_date_range 
       ON sleep_records (user_id, start_time, end_time)`,
       
      // Índice para busca rápida de humor por período
      `CREATE INDEX IF NOT EXISTS idx_mood_records_date 
       ON mood_records (user_id, record_date)`,
       
      // Índice para medicações tomadas recentemente
      `CREATE INDEX IF NOT EXISTS idx_medication_doses_recent 
       ON medication_doses (user_id, taken_at DESC)`,
       
      // Índice para prioridades incompletas
      `CREATE INDEX IF NOT EXISTS idx_priorities_incomplete 
       ON priorities (user_id, completed) 
       WHERE completed = false`
    ];
    
    for (const query of indexQueries) {
      const result = await this.mcp.executeRawQuery(query);
      if (!result.success) {
        console.error(`Falha ao criar índice: ${result.error}`);
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Analisa e sugere otimizações baseadas em estatísticas de uso
   */
  async analyzeQueryPerformance(): Promise<any> {
    const analyzeQuery = `
      SELECT relname as table_name,
             seq_scan,
             seq_tup_read,
             idx_scan,
             idx_tup_fetch
      FROM pg_stat_user_tables
      WHERE relname IN ('priorities', 'sleep_records', 'mood_records', 'medications', 'medication_doses')
      ORDER BY seq_scan DESC;
    `;
    
    return await this.mcp.executeRawQuery(analyzeQuery);
  }

  /**
   * Executa VACUUM ANALYZE para otimizar as tabelas
   */
  async optimizeTables(): Promise<boolean> {
    const tables = [
      'priorities',
      'sleep_records',
      'mood_records',
      'medications',
      'medication_doses'
    ];
    
    for (const table of tables) {
      const query = `VACUUM ANALYZE ${table};`;
      const result = await this.mcp.executeRawQuery(query);
      
      if (!result.success) {
        console.error(`Falha ao otimizar tabela ${table}: ${result.error}`);
        return false;
      }
    }
    
    return true;
  }
}
