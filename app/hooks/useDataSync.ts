import { useEffect, useState } from 'react'
import { useStore } from '../stores/store'
import { useSupabase } from '../components/providers/supabase-provider'
import { BaseItem } from '../types/supabase'

interface SyncConfig<T extends BaseItem> {
  table: string
  localStorageKey: string
  getLocalData: () => T[]
  setLocalData: (data: T[]) => void
}

export function useDataSync<T extends BaseItem>(config: SyncConfig<T>) {
  const { supabase } = useSupabase()
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle')
  const store = useStore()

  useEffect(() => {
    const syncData = async () => {
      try {
        setSyncStatus('syncing')
        
        // Buscar dados do Supabase
        const { data: remoteData, error } = await supabase
          .from(config.table)
          .select('*')
          .order('updated_at', { ascending: false })

        if (error) throw error

        // Atualizar dados locais
        config.setLocalData(remoteData)
        
        setSyncStatus('idle')
      } catch (error) {
        console.error('Erro na sincronização:', error)
        setSyncStatus('error')
      }
    }

    // Sincronizar ao montar o componente
    syncData()

    // Configurar subscription para mudanças em tempo real
    const subscription = supabase
      .channel(config.table)
      .on('postgres_changes', { event: '*', schema: 'public', table: config.table }, () => {
        syncData()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, config])

  return { syncStatus }
} 