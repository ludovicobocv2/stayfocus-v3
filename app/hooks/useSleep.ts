import { useCallback, useState } from 'react';
import { createClient } from '@/app/lib/supabase';
import { useAuthContext } from '@/app/context/AuthContext';
import { 
  SleepRecord, 
  SleepReminder, 
  NewSleepRecord, 
  SleepRecordUpdate,
  NewSleepReminder,
  SleepReminderUpdate 
} from '@/app/types/supabase';

// Definindo o tipo de retorno para a função de migração
type MigrationResult = {
  success: boolean;
  recordsCount: number;
  remindersCount: number;
  duplicateRecordsCount: number;
  duplicateRemindersCount: number;
  error?: string;
};

export function useSleep() {
  const supabase = createClient();
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Função para limpar erros
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  // GERENCIAMENTO DE REGISTROS DE SONO

  // Obter todos os registros de sono do usuário
  const getSleepRecords = useCallback(async (): Promise<SleepRecord[]> => {
    if (!user) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('sleep_records')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false });
        
      if (error) throw new Error(error.message);
      
      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar registros de sono';
      setError(new Error(errorMessage));
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);
  
  // Obter um registro de sono específico por ID
  const getSleepRecord = useCallback(async (id: string): Promise<SleepRecord | null> => {
    if (!user) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('sleep_records')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();
        
      if (error) throw new Error(error.message);
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar registro de sono';
      setError(new Error(errorMessage));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);
  
  // Adicionar um novo registro de sono
  const addSleepRecord = useCallback(async (record: NewSleepRecord): Promise<SleepRecord | null> => {
    if (!user) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('sleep_records')
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
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar registro de sono';
      setError(new Error(errorMessage));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);
  
  // Atualizar um registro de sono existente
  const updateSleepRecord = useCallback(async (id: string, updates: SleepRecordUpdate): Promise<SleepRecord | null> => {
    if (!user) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('sleep_records')
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
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar registro de sono';
      setError(new Error(errorMessage));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);
  
  // Registrar hora de acordar (completar um registro de sono)
  const recordWakeUp = useCallback(async (id: string, endTime: string, quality?: number | null, notes?: string | null): Promise<SleepRecord | null> => {
    return updateSleepRecord(id, { 
      end_time: endTime,
      quality,
      notes,
      updated_at: new Date().toISOString()
    });
  }, [updateSleepRecord]);
  
  // Excluir um registro de sono
  const deleteSleepRecord = useCallback(async (id: string): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('sleep_records')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) throw new Error(error.message);
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir registro de sono';
      setError(new Error(errorMessage));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);

  // GERENCIAMENTO DE LEMBRETES

  // Obter todos os lembretes de sono do usuário
  const getSleepReminders = useCallback(async (): Promise<SleepReminder[]> => {
    if (!user) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('sleep_reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
        
      if (error) throw new Error(error.message);
      
      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar lembretes de sono';
      setError(new Error(errorMessage));
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);
  
  // Adicionar um novo lembrete de sono
  const addSleepReminder = useCallback(async (reminder: NewSleepReminder): Promise<SleepReminder | null> => {
    if (!user) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('sleep_reminders')
        .insert([
          { 
            ...reminder,
            user_id: user.id,
          }
        ])
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar lembrete de sono';
      setError(new Error(errorMessage));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);
  
  // Atualizar um lembrete de sono existente
  const updateSleepReminder = useCallback(async (id: string, updates: SleepReminderUpdate): Promise<SleepReminder | null> => {
    if (!user) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('sleep_reminders')
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
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar lembrete de sono';
      setError(new Error(errorMessage));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);
  
  // Alternar o estado ativo de um lembrete
  const toggleReminderActive = useCallback(async (id: string, active: boolean): Promise<SleepReminder | null> => {
    return updateSleepReminder(id, { active });
  }, [updateSleepReminder]);
  
  // Excluir um lembrete de sono
  const deleteSleepReminder = useCallback(async (id: string): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('sleep_reminders')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) throw new Error(error.message);
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir lembrete de sono';
      setError(new Error(errorMessage));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);
  
  // Migrar registros de sono do localStorage para o Supabase
  const migrateFromLocalStorage = useCallback(async (): Promise<MigrationResult> => {
    if (!user) {
      return {
        success: false,
        recordsCount: 0,
        remindersCount: 0,
        duplicateRecordsCount: 0,
        duplicateRemindersCount: 0,
        error: 'Usuário não autenticado'
      };
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Obter dados do localStorage
      const sleepRecordsData = localStorage.getItem('sleepRecords');
      const sleepRemindersData = localStorage.getItem('sleepReminders');
      
      if (!sleepRecordsData && !sleepRemindersData) {
        return {
          success: true,
          recordsCount: 0,
          remindersCount: 0,
          duplicateRecordsCount: 0,
          duplicateRemindersCount: 0
        };
      }
      
      // Inicializar contadores
      let recordsCount = 0;
      let remindersCount = 0;
      let duplicateRecordsCount = 0;
      let duplicateRemindersCount = 0;
      
      // Migrar registros de sono, se existirem
      if (sleepRecordsData) {
        try {
          const parsedRecords = JSON.parse(sleepRecordsData);
          
          if (Array.isArray(parsedRecords)) {
            const recordsToInsert = [];
            
            // Verificar e preparar registros para inserção
            for (const record of parsedRecords) {
              // Verificar duplicação com base no horário de início
              const { data: existingRecord } = await supabase
                .from('sleep_records')
                .select('id')
                .eq('user_id', user.id)
                .eq('start_time', record.start_time)
                .maybeSingle();
                
              if (existingRecord) {
                duplicateRecordsCount++;
                continue;
              }
              
              recordsToInsert.push({
                start_time: record.start_time,
                end_time: record.end_time,
                quality: record.quality,
                notes: record.notes || '',
                user_id: user.id
              });
            }
            
            if (recordsToInsert.length > 0) {
              const { error: recordsError } = await supabase
                .from('sleep_records')
                .insert(recordsToInsert);
                
              if (recordsError) throw new Error(recordsError.message);
              
              recordsCount = recordsToInsert.length;
            }
          }
        } catch (err) {
          console.error("Erro ao processar registros de sono:", err);
        }
      }
      
      // Migrar lembretes, se existirem
      if (sleepRemindersData) {
        try {
          const parsedReminders = JSON.parse(sleepRemindersData);
          
          if (Array.isArray(parsedReminders)) {
            const remindersToInsert = [];
            
            // Verificar e preparar lembretes para inserção
            for (const reminder of parsedReminders) {
              // Verificar duplicação com base no horário e tipo
              const { data: existingReminder } = await supabase
                .from('sleep_reminders')
                .select('id')
                .eq('user_id', user.id)
                .eq('type', reminder.type)
                .eq('time', reminder.time)
                .maybeSingle();
                
              if (existingReminder) {
                duplicateRemindersCount++;
                continue;
              }
              
              remindersToInsert.push({
                type: reminder.type,
                time: reminder.time,
                days_of_week: reminder.days_of_week,
                active: reminder.active,
                user_id: user.id
              });
            }
            
            if (remindersToInsert.length > 0) {
              const { error: remindersError } = await supabase
                .from('sleep_reminders')
                .insert(remindersToInsert);
                
              if (remindersError) throw new Error(remindersError.message);
              
              remindersCount = remindersToInsert.length;
            }
          }
        } catch (err) {
          console.error("Erro ao processar lembretes de sono:", err);
        }
      }
      
      return {
        success: true,
        recordsCount,
        remindersCount,
        duplicateRecordsCount,
        duplicateRemindersCount
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao migrar dados de sono';
      setError(new Error(errorMessage));
      return {
        success: false,
        recordsCount: 0,
        remindersCount: 0,
        duplicateRecordsCount: 0,
        duplicateRemindersCount: 0,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);
  
  return {
    // Estado
    isLoading,
    error,
    resetError,
    
    // Operações de registros de sono
    getSleepRecords,
    getSleepRecord,
    addSleepRecord,
    updateSleepRecord,
    recordWakeUp,
    deleteSleepRecord,
    
    // Operações de lembretes
    getSleepReminders,
    addSleepReminder,
    updateSleepReminder,
    toggleReminderActive,
    deleteSleepReminder,
    
    // Migração
    migrateFromLocalStorage
  };
} 