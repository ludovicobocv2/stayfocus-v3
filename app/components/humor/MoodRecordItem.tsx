import { useState } from 'react';
import { MoodRecord } from '@/app/types/supabase';
import { useHumor } from '@/app/hooks/useHumor';
import { useToast } from '@/app/hooks/useToast';

interface MoodRecordItemProps {
  record: MoodRecord;
  onUpdate?: () => void;
}

export default function MoodRecordItem({ record, onUpdate }: MoodRecordItemProps) {
  const { deleteMoodRecord, isLoading } = useHumor();
  const { showToast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };
  
  // Mapear nível de humor para texto descritivo
  const getMoodText = (level: number) => {
    if (level <= 2) return 'Muito ruim';
    if (level <= 4) return 'Ruim';
    if (level <= 6) return 'Neutro';
    if (level <= 8) return 'Bom';
    return 'Excelente';
  };
  
  // Mapear nível de humor para classe de cor
  const getMoodColor = (level: number) => {
    if (level <= 2) return 'bg-red-500';
    if (level <= 4) return 'bg-orange-500';
    if (level <= 6) return 'bg-yellow-500';
    if (level <= 8) return 'bg-green-500';
    return 'bg-green-600';
  };
  
  // Excluir registro
  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    
    const success = await deleteMoodRecord(record.id);
    
    if (success) {
      showToast('Registro de humor excluído com sucesso', 'success');
      if (onUpdate) onUpdate();
    } else {
      showToast('Erro ao excluir registro de humor', 'error');
    }
    
    setConfirmDelete(false);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-md font-medium">
          {formatDate(record.record_date)}
        </h3>
        <div className="flex items-center">
          <span className="text-sm mr-2">
            {getMoodText(record.mood_level)}
          </span>
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${getMoodColor(record.mood_level)}`}
          >
            {record.mood_level}
          </div>
        </div>
      </div>
      
      {record.factors && record.factors.length > 0 && (
        <div className="mb-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Fatores:</p>
          <div className="flex flex-wrap gap-1">
            {record.factors.map((factor: string, index: number) => (
              <span 
                key={index}
                className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
              >
                {factor}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {record.notes && (
        <div className="mt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Notas:</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {record.notes}
          </p>
        </div>
      )}
      
      <div className="mt-3 flex justify-end">
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