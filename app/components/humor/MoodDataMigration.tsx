import { useState, useEffect } from 'react';
import { useHumor } from '@/app/hooks/useHumor';
import { useToast } from '@/app/hooks/useToast';

interface MoodDataMigrationProps {
  onMigrationComplete?: () => void;
}

export default function MoodDataMigration({ onMigrationComplete }: MoodDataMigrationProps) {
  const { migrateFromLocalStorage, isLoading, error } = useHumor();
  const { showToast } = useToast();
  
  const [hasLocalData, setHasLocalData] = useState(false);
  const [shouldClearLocal, setShouldClearLocal] = useState(true);
  const [isMigrating, setIsMigrating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [migrationCount, setMigrationCount] = useState(0);
  const [duplicateCount, setDuplicateCount] = useState(0);
  
  // Verificar se há dados locais para migrar
  useEffect(() => {
    const localData = localStorage.getItem('zustand');
    if (localData) {
      try {
        const parsedData = JSON.parse(localData);
        if (parsedData?.state?.registrosHumor && parsedData.state.registrosHumor.length > 0) {
          setHasLocalData(true);
        }
      } catch (e) {
        console.error('Erro ao analisar dados locais:', e);
      }
    }
  }, []);
  
  // Limpar dados locais após migração bem-sucedida
  const clearLocalData = () => {
    try {
      const localData = localStorage.getItem('zustand');
      if (localData) {
        const parsedData = JSON.parse(localData);
        
        if (parsedData?.state?.registrosHumor) {
          parsedData.state.registrosHumor = [];
          localStorage.setItem('zustand', JSON.stringify(parsedData));
          showToast('Dados locais de humor removidos com sucesso', 'success');
        }
      }
    } catch (e) {
      console.error('Erro ao limpar dados locais:', e);
      showToast('Erro ao limpar dados locais', 'error');
    }
  };
  
  // Iniciar o processo de migração
  const startMigration = async () => {
    setIsMigrating(true);
    
    try {
      const result = await migrateFromLocalStorage();
      
      if (result.success) {
        setShowSuccess(true);
        setMigrationCount(result.count);
        setDuplicateCount(result.duplicates);
        
        let message = `${result.count} registros de humor migrados com sucesso`;
        if (result.duplicates > 0) {
          message += ` (${result.duplicates} duplicados ignorados)`;
        }
        
        showToast(message, 'success');
        
        if (shouldClearLocal && result.count > 0) {
          clearLocalData();
        }
        
        if (onMigrationComplete) {
          onMigrationComplete();
        }
      } else {
        showToast(`Erro na migração: ${result.error}`, 'error');
      }
    } catch (err) {
      showToast('Erro ao migrar dados', 'error');
    } finally {
      setIsMigrating(false);
    }
  };
  
  // Se não houver dados para migrar, não renderize nada
  if (!hasLocalData && !showSuccess) {
    return null;
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
      <h3 className="text-lg font-medium mb-2">
        {showSuccess ? 'Migração Concluída!' : 'Migrar Dados de Humor'}
      </h3>
      
      {!showSuccess ? (
        <>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Encontramos registros de humor armazenados localmente neste dispositivo.
            Você deseja migrá-los para a nuvem?
          </p>
          
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="clearLocal"
              checked={shouldClearLocal}
              onChange={(e) => setShouldClearLocal(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="clearLocal" className="text-sm">
              Remover dados locais após migração bem-sucedida
            </label>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={startMigration}
              disabled={isMigrating}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isMigrating ? 'Migrando...' : 'Migrar Dados'}
            </button>
          </div>
          
          {error && (
            <p className="text-red-500 mt-2 text-sm">{error.message}</p>
          )}
        </>
      ) : (
        <>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            {migrationCount > 0 
              ? `${migrationCount} registros de humor foram migrados com sucesso para a nuvem.` 
              : 'Nenhum novo registro precisou ser migrado.'}
          </p>
          
          {duplicateCount > 0 && (
            <p className="text-yellow-600 dark:text-yellow-400 mb-2 text-sm">
              {duplicateCount} registros foram ignorados por já existirem no banco de dados.
            </p>
          )}
          
          {shouldClearLocal && migrationCount > 0 && (
            <p className="text-green-600 dark:text-green-400 text-sm">
              Os dados locais foram removidos com sucesso.
            </p>
          )}
        </>
      )}
    </div>
  );
} 