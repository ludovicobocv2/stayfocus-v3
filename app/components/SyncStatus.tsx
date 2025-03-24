import { useDataSync } from '../hooks/useDataSync'
import { useStore } from '../stores/store'
import { Button } from '@/app/components/ui/Button'
import { Loader2 } from 'lucide-react'

export function SyncStatus() {
  const store = useStore()
  const { syncStatus } = useDataSync({
    table: 'priorities',
    localStorageKey: 'priorities',
    getLocalData: () => store.prioridades,
    setLocalData: (data) => store.setPrioridades(data)
  })

  return (
    <div className="flex items-center gap-2">
      {syncStatus === 'syncing' && (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-muted-foreground">Sincronizando...</span>
        </>
      )}
      {syncStatus === 'error' && (
        <>
          <span className="text-sm text-destructive">Erro na sincronização</span>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </>
      )}
    </div>
  )
} 