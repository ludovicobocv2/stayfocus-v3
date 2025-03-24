import { useCallback, useState } from 'react';
import { createClient } from '@/app/lib/supabase';
import { useAuthContext } from '@/app/context/AuthContext';
import { Medication, MedicationDose, NewMedication, NewMedicationDose, MedicationUpdate } from '@/app/types/supabase';

// Definindo o tipo de retorno para a função de migração
type MigrationResult = {
  success: boolean;
  count: number;
  duplicates: number;
  error?: string;
};

export function useMedications() {
  const supabase = createClient();
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Função para limpar erros
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  // GERENCIAMENTO DE MEDICAMENTOS

  // Obter todos os medicamentos do usuário
  const getMedications = useCallback(async (): Promise<Medication[]> => {
    if (!user) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', user.id)
        .order('name');
        
      if (error) throw new Error(error.message);
      
      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar medicamentos';
      setError(new Error(errorMessage));
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);
  
  // Verificar duplicações antes da migração
  const checkDuplicates = useCallback(async (name: string, dosage?: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const query = supabase
        .from('medications')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', name);
        
      if (dosage) {
        query.eq('dosage', dosage);
      }
      
      const { data, error } = await query.maybeSingle();
        
      if (error) throw new Error(error.message);
      
      return !!data; // retorna true se existir um registro com esse nome/dosagem
    } catch (err) {
      console.error('Erro ao verificar duplicação:', err);
      return false; // em caso de erro, assumimos que não é duplicado
    }
  }, [user, supabase]);
  
  // Obter um medicamento específico por ID
  const getMedication = useCallback(async (id: string): Promise<Medication | null> => {
    if (!user) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();
        
      if (error) throw new Error(error.message);
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar medicamento';
      setError(new Error(errorMessage));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);
  
  // Adicionar um novo medicamento
  const addMedication = useCallback(async (medication: NewMedication): Promise<Medication | null> => {
    if (!user) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('medications')
        .insert([
          { 
            ...medication,
            user_id: user.id,
          }
        ])
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar medicamento';
      setError(new Error(errorMessage));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);
  
  // Atualizar um medicamento existente
  const updateMedication = useCallback(async (id: string, updates: MedicationUpdate): Promise<Medication | null> => {
    if (!user) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('medications')
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
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar medicamento';
      setError(new Error(errorMessage));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);
  
  // Excluir um medicamento
  const deleteMedication = useCallback(async (id: string): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Primeiro excluir as doses relacionadas
      await supabase
        .from('medication_doses')
        .delete()
        .eq('medication_id', id)
        .eq('user_id', user.id);
      
      // Depois excluir o medicamento
      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) throw new Error(error.message);
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir medicamento';
      setError(new Error(errorMessage));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);
  
  // GERENCIAMENTO DE DOSES

  // Registrar uma dose tomada
  const recordMedicationDose = useCallback(async (medicationId: string, dose: NewMedicationDose): Promise<MedicationDose | null> => {
    if (!user) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Inserir registro de dose
      const { data: doseData, error: doseError } = await supabase
        .from('medication_doses')
        .insert([
          { 
            ...dose,
            medication_id: medicationId,
            user_id: user.id,
          }
        ])
        .select()
        .single();
        
      if (doseError) throw new Error(doseError.message);
      
      // Atualizar a última vez que o medicamento foi tomado
      await supabase
        .from('medications')
        .update({
          last_taken: dose.taken_at,
          updated_at: new Date().toISOString(),
        })
        .eq('id', medicationId)
        .eq('user_id', user.id);
      
      return doseData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao registrar dose';
      setError(new Error(errorMessage));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);
  
  // Obter histórico de doses para um medicamento
  const getMedicationDoses = useCallback(async (medicationId: string, limit = 10): Promise<MedicationDose[]> => {
    if (!user) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('medication_doses')
        .select('*')
        .eq('medication_id', medicationId)
        .eq('user_id', user.id)
        .order('taken_at', { ascending: false })
        .limit(limit);
        
      if (error) throw new Error(error.message);
      
      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar histórico de doses';
      setError(new Error(errorMessage));
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);

  // MIGRAÇÃO DE DADOS

  // Migrar medicamentos do localStorage para o Supabase
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
      if (!parsedData?.state?.medicamentos || !Array.isArray(parsedData.state.medicamentos)) {
        return { success: false, count: 0, duplicates: 0, error: 'Formato de dados inválido' };
      }
      
      // Preparar medicamentos para inserção, verificando duplicatas
      const localMedications = parsedData.state.medicamentos;
      const toInsert = [];
      let duplicateCount = 0;
      
      for (const med of localMedications) {
        const isDuplicate = await checkDuplicates(med.nome, med.dosagem);
        if (isDuplicate) {
          duplicateCount++;
          continue;
        }
        
        toInsert.push({
          name: med.nome,
          dosage: med.dosagem || null,
          frequency: med.frequencia,
          schedule: med.horarios || [],
          start_date: med.dataInicio || null,
          notes: med.observacoes || null,
          last_taken: med.ultimaTomada || null,
          interval_minutes: med.intervalo || null,
          user_id: user.id
        });
      }
      
      if (toInsert.length === 0) {
        return { 
          success: true, 
          count: 0, 
          duplicates: duplicateCount,
          error: duplicateCount > 0 ? `${duplicateCount} medicamentos já existem no banco de dados` : undefined
        };
      }
      
      // Inserir no Supabase
      const { error } = await supabase.from('medications').insert(toInsert);
      
      if (error) throw new Error(error.message);
      
      return { 
        success: true, 
        count: toInsert.length,
        duplicates: duplicateCount
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao migrar medicamentos';
      setError(new Error(errorMessage));
      return { success: false, count: 0, duplicates: 0, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase, checkDuplicates]);

  return {
    // Estado
    isLoading,
    error,
    resetError,
    
    // Operações de medicamentos
    getMedications,
    getMedication,
    addMedication,
    updateMedication,
    deleteMedication,
    
    // Operações de doses
    recordMedicationDose,
    getMedicationDoses,
    
    // Migração
    migrateFromLocalStorage
  };
} 