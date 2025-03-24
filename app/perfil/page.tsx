'use client'

import { useState, useEffect } from 'react'
import { usePerfilStore } from '../stores/perfilStore'
import { InformacoesPessoais } from '../components/perfil/InformacoesPessoais'
import { MetasDiarias } from '../components/perfil/MetasDiarias'
import { PreferenciasVisuais } from '../components/perfil/PreferenciasVisuais'
import { DataMigration } from '../components/perfil/DataMigration'
import { ExportarImportarDados } from '../components/ExportarImportarDados'
import { RefreshCw, User } from 'lucide-react'
import { useAuthContext } from '../context/AuthContext'
import { LoadingIndicator } from '../components/ui/LoadingIndicator'

export default function PerfilPage() {
  const { resetarPerfil, preferenciasVisuais } = usePerfilStore()
  const { user, loading } = useAuthContext()
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false)
  
  // Aplicar classes de acessibilidade ao carregar a página
  useEffect(() => {
    if (preferenciasVisuais.altoContraste) {
      document.documentElement.classList.add('alto-contraste')
    }
    
    if (preferenciasVisuais.reducaoEstimulos) {
      document.documentElement.classList.add('reducao-estimulos')
    }
    
    if (preferenciasVisuais.textoGrande) {
      document.documentElement.classList.add('texto-grande')
    }
    
    // Cleanup
    return () => {
      document.documentElement.classList.remove('alto-contraste', 'reducao-estimulos', 'texto-grande')
    }
  }, [preferenciasVisuais])
  
  const confirmarReset = () => {
    resetarPerfil()
    setResetConfirmOpen(false)
  }

  // Mostrar indicador de carregamento enquanto verifica autenticação
  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <LoadingIndicator size="large" text="Carregando perfil..." />
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-perfil-primary flex items-center justify-center text-white text-xl font-bold mr-4">
            <User className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user ? `Perfil - ${user.email}` : 'Informações Pessoais'}
          </h1>
        </div>
        
        <button
          onClick={() => setResetConfirmOpen(true)}
          className="text-sm flex items-center text-gray-500 hover:text-perfil-primary dark:text-gray-400 dark:hover:text-perfil-secondary focus:outline-none"
          aria-label="Redefinir configurações"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Redefinir
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <InformacoesPessoais />
          <MetasDiarias />
          
          {/* Componente de migração de dados apenas para usuários autenticados */}
          {user && <DataMigration />}
        </div>
        
        <div className="space-y-6">
          <PreferenciasVisuais />
          <ExportarImportarDados />
        </div>
      </div>
      
      {/* Modal de confirmação */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Redefinir configurações?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Todas as suas preferências, metas e configurações serão restauradas para os valores padrão.
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarReset}
                className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Redefinir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
