import { useState } from 'react';
import { Medication } from '@/app/types/supabase';
import { useMedications } from '@/app/hooks/useMedications';
import { useToast } from '@/app/hooks/useToast';

interface MedicationItemProps {
  medication: Medication;
  onUpdate?: () => void;
  onRecord?: (id: string) => void;
}

export default function MedicationItem({ medication, onUpdate, onRecord }: MedicationItemProps) {
  const { deleteMedication, isLoading } = useMedications();
  const { showToast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  // Formatar data de início
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };
  
  // Formatar última tomada
  const formatLastTaken = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Verificar se pode tomar mais uma dose
  const canTakeAnother = () => {
    if (!medication.last_taken || !medication.interval_minutes) return true;
    
    const lastTaken = new Date(medication.last_taken);
    const now = new Date();
    const intervalMs = medication.interval_minutes * 60 * 1000;
    
    return now.getTime() - lastTaken.getTime() >= intervalMs;
  };
  
  // Calcular tempo restante até próxima dose
  const getRemainingTime = () => {
    if (!medication.last_taken || !medication.interval_minutes) return null;
    
    const lastTaken = new Date(medication.last_taken);
    const now = new Date();
    const intervalMs = medication.interval_minutes * 60 * 1000;
    const nextDose = new Date(lastTaken.getTime() + intervalMs);
    
    if (now >= nextDose) return null;
    
    const diffMs = nextDose.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h${diffMinutes > 0 ? ` ${diffMinutes}min` : ''}`;
    }
    return `${diffMinutes}min`;
  };
  
  // Excluir medicamento
  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    
    const success = await deleteMedication(medication.id);
    
    if (success) {
      showToast('Medicamento excluído com sucesso', 'success');
      if (onUpdate) onUpdate();
    } else {
      showToast('Erro ao excluir medicamento', 'error');
    }
    
    setConfirmDelete(false);
  };
  
  // Registrar tomada
  const handleRecord = () => {
    if (onRecord) {
      onRecord(medication.id);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-md font-medium">
          {medication.name}
          {medication.dosage && (
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              {medication.dosage}
            </span>
          )}
        </h3>
        <div className="flex items-center">
          <span className={`px-2 py-1 text-xs rounded ${
            medication.frequency === 'Diária' 
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
              : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
          }`}>
            {medication.frequency}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-2 text-sm">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Data de início:</p>
          <p>{formatDate(medication.start_date)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Última dose:</p>
          <p>{formatLastTaken(medication.last_taken)}</p>
        </div>
      </div>
      
      {medication.schedule && medication.schedule.length > 0 && (
        <div className="mb-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Horários:</p>
          <div className="flex flex-wrap gap-1">
            {medication.schedule.map((time, index) => (
              <span 
                key={index}
                className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
              >
                {time}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {medication.notes && (
        <div className="mt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Observações:</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {medication.notes}
          </p>
        </div>
      )}
      
      <div className="mt-3 flex justify-end space-x-2">
        {medication.interval_minutes && (
          <>
            {canTakeAnother() ? (
              <button
                onClick={handleRecord}
                className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Tomar Agora
              </button>
            ) : (
              <span className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                Próxima dose em {getRemainingTime()}
              </span>
            )}
          </>
        )}
        
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className={`text-xs px-2 py-1 rounded ${
            confirmDelete 
              ? 'bg-red-600 text-white' 
              : 'text-red-600 bg-transparent hover:bg-red-100 dark:hover:bg-red-900'
          }`}
        >
          {confirmDelete ? 'Confirmar exclusão' : 'Excluir'}
        </button>
      </div>
    </div>
  );
} 