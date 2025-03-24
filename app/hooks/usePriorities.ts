import { useCallback, useState } from 'react';
import { createClient } from '@/app/lib/supabase';
import { useAuthContext } from '@/app/context/AuthContext';
import { Priority } from '@/app/types/supabase';

export function usePriorities() {
  const supabase = createClient();
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Função para limpar erros
  const resetError = useCallback(() => {
    setError(null);
  }, []);
  
  // Obter todas as prioridades do usuário
  const getPriorities = useCallback(async (): Promise<Priority[]> => {
    if (!user) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('priorities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw new Error(error.message);
      
      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar prioridades';
      setError(new Error(errorMessage));
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);
  
  // Verificar duplicações antes da migração
  const checkDuplicates = useCallback(async (content: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('priorities')
        .select('id')
        .eq('user_id', user.id)
        .eq('content', content)
        .maybeSingle();
        
      if (error) throw new Error(error.message);
      
      return !!data; // retorna true se existir um registro com esse conteúdo
    } catch (err) {
      console.error('Erro ao verificar duplicação:', err);
      return false; // em caso de erro, assumimos que não é duplicado
    }
  }, [user, supabase]);
  
  // Obter uma prioridade específica por ID
  const getPriority = useCallback(async (id: string): Promise<Priority | null> => {
    if (!user) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('priorities')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();
        
      if (error) throw new Error(error.message);
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar prioridade';
      setError(new Error(errorMessage));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);
  
  // Adicionar uma nova prioridade
  const addPriority = useCallback(async (priority: Omit<Priority, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Priority | null> => {
    if (!user) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('priorities')
        .insert([
          { 
            ...priority,
            user_id: user.id,
          }
        ])
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar prioridade';
      setError(new Error(errorMessage));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);
  
  // Atualizar uma prioridade existente
  const updatePriority = useCallback(async (id: string, updates: Partial<Omit<Priority, 'id' | 'user_id' | 'created_at'>>): Promise<Priority | null> => {
    if (!user) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('priorities')
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
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar prioridade';
      setError(new Error(errorMessage));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);
  
  // Alternar o estado de conclusão de uma prioridade
  const togglePriorityCompletion = useCallback(async (id: string, completed: boolean): Promise<Priority | null> => {
    return updatePriority(id, { completed });
  }, [updatePriority]);
  
  // Excluir uma prioridade
  const deletePriority = useCallback(async (id: string): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('priorities')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) throw new Error(error.message);
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir prioridade';
      setError(new Error(errorMessage));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);
  
  // Migrar prioridades do localStorage para o Supabase
  const migrateFromLocalStorage = useCallback(async (): Promise<{ success: boolean; count: number; duplicates: number; error?: string }> => {
    if (!user) return { success: false, count: 0, duplicates: 0, error: 'Usuário não autenticado' };
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Obter dados do localStorage
      const localData = localStorage.getItem('prioridades-diarias');
      if (!localData) return { success: true, count: 0, duplicates: 0 };
      
      // Transformar dados
      const parsedData = JSON.parse(localData);
      if (!parsedData?.state?.prioridades || !Array.isArray(parsedData.state.prioridades)) {
        return { success: false, count: 0, duplicates: 0, error: 'Formato de dados inválido' };
      }
      
      // Preparar prioridades para inserção, verificando duplicatas
      const priorities = parsedData.state.prioridades;
      const toInsert = [];
      let duplicateCount = 0;
      
      for (const p of priorities) {
        const isDuplicate = await checkDuplicates(p.texto);
        if (isDuplicate) {
          duplicateCount++;
          continue;
        }
        
        toInsert.push({
          content: p.texto,
          completed: p.concluida || false,
          due_date: p.data || null,
          category: 'migrated',
          user_id: user.id
        });
      }
      
      if (toInsert.length === 0) {
        return { 
          success: true, 
          count: 0, 
          duplicates: duplicateCount,
          error: duplicateCount > 0 ? `${duplicateCount} prioridades já existiam no banco de dados` : undefined
        };
      }
      
      // Inserir no Supabase
      const { error } = await supabase.from('priorities').insert(toInsert);
      
      if (error) throw new Error(error.message);
      
      return { 
        success: true, 
        count: toInsert.length,
        duplicates: duplicateCount
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao migrar prioridades';
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
    
    // Operações CRUD
    getPriorities,
    getPriority,
    addPriority,
    updatePriority,
    togglePriorityCompletion,
    deletePriority,
    
    // Migração
    migrateFromLocalStorage,
    checkDuplicates
  };
} 