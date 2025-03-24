import { useState, useEffect } from 'react';
import { useHumor } from '@/app/hooks/useHumor';
import MoodRecordItem from './MoodRecordItem';
import MoodForm from './MoodForm';
import MoodDataMigration from './MoodDataMigration';
import { MoodRecord } from '@/app/types/supabase';

export default function MoodRecordList() {
  const { getMoodRecords, isLoading, error } = useHumor();
  const [records, setRecords] = useState<MoodRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  useEffect(() => {
    const loadRecords = async () => {
      const data = await getMoodRecords();
      setRecords(data);
    };
    
    loadRecords();
  }, [getMoodRecords, refreshTrigger]);
  
  const refreshRecords = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  const handleToggleForm = () => {
    setShowForm(prev => !prev);
  };
  
  const handleFormSuccess = () => {
    refreshRecords();
    setShowForm(false);
  };
  
  const handleMigrationComplete = () => {
    refreshRecords();
  };
  
  return (
    <div className="container mx-auto max-w-md p-4">
      <h2 className="text-xl font-bold mb-4">Rastreador de Humor</h2>
      
      {/* Componente de migração de dados */}
      <MoodDataMigration onMigrationComplete={handleMigrationComplete} />
      
      {/* Botão para mostrar/ocultar formulário */}
      <div className="mb-4">
        <button
          onClick={handleToggleForm}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancelar' : 'Registrar Humor'}
        </button>
      </div>
      
      {/* Formulário para adicionar novo registro */}
      {showForm && (
        <div className="mb-6">
          <MoodForm onSuccess={handleFormSuccess} />
        </div>
      )}
      
      {/* Estado de carregamento */}
      {isLoading && !records.length && (
        <div className="text-center py-4">
          <p>Carregando registros...</p>
        </div>
      )}
      
      {/* Mensagem de erro */}
      {error && (
        <div className="text-red-500 mb-4">
          <p>Erro ao carregar registros: {error.message}</p>
        </div>
      )}
      
      {/* Lista de registros */}
      {!isLoading && !records.length ? (
        <div className="text-center py-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p>Você ainda não possui registros de humor.</p>
          {!showForm && (
            <button
              onClick={handleToggleForm}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Registrar Agora
            </button>
          )}
        </div>
      ) : (
        <div>
          <h3 className="font-medium mb-2">Seus Registros</h3>
          {records.map(record => (
            <MoodRecordItem 
              key={record.id} 
              record={record} 
              onUpdate={refreshRecords} 
            />
          ))}
        </div>
      )}
    </div>
  );
} 