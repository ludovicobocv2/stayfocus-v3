'use client'

import { useState, useCallback } from 'react'
import { usePriorities } from '../../hooks/usePriorities'
import { useToast } from '../../context/ToastContext'
import { LoadingIndicator } from '../ui/LoadingIndicator'

export function DataMigration() {
  const [isMigrating, setIsMigrating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [migrationCount, setMigrationCount] = useState(0)
  const [duplicateCount, setDuplicateCount] = useState(0)
  const [shouldClearLocal, setShouldClearLocal] = useState(false)
  
  const { migrateFromLocalStorage, isLoading } = usePriorities()
  const { showToast } = useToast()
  
  // Verificar se existem dados no localStorage para prioridades
  const hasPrioritiesData = useCallback(() => {
    const localData = localStorage.getItem('prioridades-diarias')
    if (!localData) return false
    
    try {
      const parsedData = JSON.parse(localData)
      return parsedData?.state?.prioridades && Array.isArray(parsedData.state.prioridades) && parsedData.state.prioridades.length > 0
    } catch (e) {
      return false
    }
  }, [])
  
  // Função para limpar dados locais após migração
  const clearLocalData = useCallback(() => {
    localStorage.removeItem('prioridades-diarias')
    showToast('Dados locais removidos com sucesso', 'success')
  }, [showToast])
  
  // Iniciar o processo de migração
  const startMigration = async () => {
    setIsMigrating(true)
    
    try {
      const result = await migrateFromLocalStorage()
      
      if (result.success) {
        setShowSuccess(true)
        setMigrationCount(result.count)
        setDuplicateCount(result.duplicates)
        
        // Mensagem de sucesso personalizada com informações sobre duplicatas
        let mensagem = `${result.count} prioridades migradas com sucesso`
        if (result.duplicates > 0) {
          mensagem += ` (${result.duplicates} itens ignorados por já existirem)`
        }
        showToast(mensagem, 'success')
        
        if (shouldClearLocal && (result.count > 0 || result.duplicates > 0)) {
          clearLocalData()
        }
      } else {
        showToast(`Erro na migração: ${result.error}`, 'error')
      }
    } catch (error) {
      showToast('Erro ao migrar dados', 'error')
    } finally {
      setIsMigrating(false)
    }
  }
  
  // Reset do estado para permitir nova tentativa
  const resetState = () => {
    setShowSuccess(false)
    setMigrationCount(0)
    setDuplicateCount(0)
  }

  // Se não houver dados para migrar, mostrar mensagem
  if (!hasPrioritiesData()) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Migração de Dados</h2>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md text-blue-800 dark:text-blue-200">
          <p>Não foram encontrados dados locais para migrar.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Migração de Dados</h2>
      
      {showSuccess ? (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-md text-green-800 dark:text-green-200">
          <p className="font-medium">Migração concluída com sucesso!</p>
          <p>{migrationCount} prioridades foram migradas para a nuvem.</p>
          {duplicateCount > 0 && (
            <p className="mt-1 text-amber-600 dark:text-amber-400">
              {duplicateCount} {duplicateCount === 1 ? 'item foi ignorado' : 'itens foram ignorados'} por já {duplicateCount === 1 ? 'existir' : 'existirem'} no banco de dados.
            </p>
          )}
          <button 
            onClick={resetState}
            className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Entendi
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md text-yellow-800 dark:text-yellow-200">
            <p className="font-medium">Importante</p>
            <p>Esta ação irá migrar suas prioridades do armazenamento local para a nuvem. Isso permitirá que você acesse seus dados em qualquer dispositivo.</p>
            <p className="mt-2 text-sm">Itens idênticos já existentes no banco de dados serão ignorados para evitar duplicação.</p>
          </div>
          
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={shouldClearLocal}
                onChange={(e) => setShouldClearLocal(e.target.checked)}
                className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Remover dados locais após a migração</span>
            </label>
          </div>
          
          <button
            onClick={startMigration}
            disabled={isMigrating || isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {(isMigrating || isLoading) ? (
              <>
                <LoadingIndicator size="small" text="" />
                <span className="ml-2">Migrando dados...</span>
              </>
            ) : (
              <span>Iniciar Migração</span>
            )}
          </button>
        </>
      )}
    </div>
  )
} 