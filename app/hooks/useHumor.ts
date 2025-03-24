import { useCallback, useState } from 'react';
import { createClient } from '@/app/lib/supabase';
import { useAuthContext } from '@/app/context/AuthContext';
import { MoodRecord, NewMoodRecord, MoodRecordUpdate } from '@/app/types/supabase';

// Definindo o tipo de retorno para a função de migração
type MigrationResult = {
  success: boolean;
  count: number;
  duplicates: number;
  error?: string;
};

export function useHumor() {
  const supabase = createClient();
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Função para limpar erros
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  // GERENCIAMENTO DE REGISTROS DE HUMOR

  // Obter todos os registros de humor do usuário
  const getMoodRecords = useCallback(async (): Promise<MoodRecord[]> => {
    if (!user) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('mood_records')
        .select('*')
        .eq('user_id', user.id)
        .order('record_date', { ascending: false });
        
      if (error) throw new Error(error.message);
      
      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar registros de humor';
      setError(new Error(errorMessage));
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);
  
  // Verificar duplicações antes da migração
  const checkDuplicates = useCallback(async (date: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('mood_records')
        .select('id')
        .eq('user_id', user.id)
        .eq('record_date', date)
        .maybeSingle();
        
      if (error) throw new Error(error.message);
      
      return !!data; // retorna true se existir um registro para essa data
    } catch (err) {
      console.error('Erro ao verificar duplicação:', err);
      return false; // em caso de erro, assumimos que não é duplicado
    }
  }, [user, supabase]);
  
  // Obter um registro de humor específico por ID
  const getMoodRecord = useCallback(async (id: string): Promise<MoodRecord | null> => {
    if (!user) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('mood_records')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();
        
      if (error) throw new Error(error.message);
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar registro de humor';
      setError(new Error(errorMessage));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);
  
  // Adicionar um novo registro de humor
  const addMoodRecord = useCallback(async (record: NewMoodRecord): Promise<MoodRecord | null> => {
    if (!user) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('mood_records')
        .insert([
          { 
            ...record,
            user_id: user.id,
          }
        ])
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar registro de humor';
      setError(new Error(errorMessage));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);
  
  // Atualizar um registro de humor existente
  const updateMoodRecord = useCallback(async (id: string, updates: MoodRecordUpdate): Promise<MoodRecord | null> => {
    if (!user) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('mood_records')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar registro de humor';
      setError(new Error(errorMessage));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);
  
  // Excluir um registro de humor
  const deleteMoodRecord = useCallback(async (id: string): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('mood_records')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) throw new Error(error.message);
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir registro de humor';
      setError(new Error(errorMessage));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);
  
  // Migrar registros de humor do localStorage para o Supabase
  const migrateFromLocalStorage = useCallback(async (): Promise<MigrationResult> => {
    if (!user) return { success: false, count: 0, duplicates: 0, error: 'Usuário não autenticado' };
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Obter dados do localStorage
      const localData = localStorage.getItem('zustand');
      if (!localData) return { success: true, count: 0, duplicates: 0 };
      
      // Transformar dados
      const parsedData = JSON.parse(localData);
      if (!parsedData?.state?.registrosHumor || !Array.isArray(parsedData.state.registrosHumor)) {
        return { success: false, count: 0, duplicates: 0, error: 'Formato de dados inválido' };
      }
      
      // Preparar registros para inserção, verificando duplicatas
      const moodRecords = parsedData.state.registrosHumor;
      const toInsert = [];
      let duplicateCount = 0;
      
      for (const record of moodRecords) {
        const isDuplicate = await checkDuplicates(record.data);
        if (isDuplicate) {
          duplicateCount++;
          continue;
        }
        
        toInsert.push({
          record_date: record.data,
          mood_level: record.nivel,
          factors: record.fatores,
          notes: record.notas || '',
          user_id: user.id
        });
      }
      
      if (toInsert.length === 0) {
        return { 
          success: true, 
          count: 0, 
          duplicates: duplicateCount,
          error: duplicateCount > 0 ? `${duplicateCount} registros já existiam no banco de dados` : undefined
        };
      }
      
      // Inserir no Supabase
      const { error } = await supabase.from('mood_records').insert(toInsert);
      
      if (error) throw new Error(error.message);
      
      return { 
        success: true, 
        count: toInsert.length,
        duplicates: duplicateCount
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao migrar registros de humor';
      setError(new Error(errorMessage));
      return { success: false, count: 0, duplicates: 0, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase, checkDuplicates]);
  
  // Obter estatísticas de humor
  const getMoodStats = useCallback(async (startDate: string, endDate: string): Promise<any> => {
    if (!user) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('mood_records')
        .select('*')
        .eq('user_id', user.id)
        .gte('record_date', startDate)
        .lte('record_date', endDate)
        .order('record_date', { ascending: true });
        
      if (error) throw new Error(error.message);
      
      // Calcular estatísticas básicas
      if (!data || data.length === 0) return { average: 0, records: [] };
      
      const sum = data.reduce((acc, record) => acc + record.mood_level, 0);
      const average = sum / data.length;
      
      // Análise de fatores mais comuns
      const factorCount: Record<string, number> = {};
      data.forEach(record => {
        if (record.factors) {
          record.factors.forEach((factor: string) => {
            factorCount[factor] = (factorCount[factor] || 0) + 1;
          });
        }
      });
      
      // Ordenar fatores por frequência
      const sortedFactors = Object.entries(factorCount)
        .sort((a, b) => b[1] - a[1])
        .map(([factor, count]) => ({ factor, count }));
      
      return {
        average,
        lowest: Math.min(...data.map(r => r.mood_level)),
        highest: Math.max(...data.map(r => r.mood_level)),
        records: data,
        commonFactors: sortedFactors.slice(0, 5),
        total: data.length
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar estatísticas de humor';
      setError(new Error(errorMessage));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);

  return {
    // Estado
    isLoading,
    error,
    resetError,
    
    // Operações CRUD
    getMoodRecords,
    getMoodRecord,
    addMoodRecord,
    updateMoodRecord,
    deleteMoodRecord,
    
    // Migração
    migrateFromLocalStorage,
    
    // Análise
    getMoodStats
  };
} 