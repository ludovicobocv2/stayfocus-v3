import { useState, useEffect } from 'react';
import { useHumor } from '@/app/hooks/useHumor';
import { useToast } from '@/app/hooks/useToast';
import { MoodRecord, NewMoodRecord } from '@/app/types/supabase';

// Lista de fatores comuns que podem afetar o humor
const COMMON_FACTORS = [
  'Estresse', 'Sono', 'Exercício', 'Alimentação', 'Socialização',
  'Medicação', 'Trabalho', 'Estudo', 'Lazer', 'Família', 
  'Saúde', 'Finanças', 'Clima', 'Sensorial'
];

interface MoodFormProps {
  onSuccess?: () => void;
  initialData?: MoodRecord;
}

export default function MoodForm({ onSuccess, initialData }: MoodFormProps) {
  const { addMoodRecord, updateMoodRecord, isLoading, error, resetError } = useHumor();
  const { showToast } = useToast();
  
  // Estado do formulário
  const [moodLevel, setMoodLevel] = useState(initialData?.mood_level || 5);
  const [date, setDate] = useState(initialData?.record_date || new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [selectedFactors, setSelectedFactors] = useState<string[]>(initialData?.factors || []);
  const [customFactor, setCustomFactor] = useState('');
  
  // Resetar erro quando mudar os campos do formulário
  useEffect(() => {
    if (error) resetError();
  }, [moodLevel, date, notes, selectedFactors, error, resetError]);
  
  // Adicionar fator personalizado
  const handleAddCustomFactor = () => {
    if (customFactor.trim() && !selectedFactors.includes(customFactor.trim())) {
      setSelectedFactors([...selectedFactors, customFactor.trim()]);
      setCustomFactor('');
    }
  };
  
  // Alternar fator comum
  const toggleFactor = (factor: string) => {
    if (selectedFactors.includes(factor)) {
      setSelectedFactors(selectedFactors.filter(f => f !== factor));
    } else {
      setSelectedFactors([...selectedFactors, factor]);
    }
  };
  
  // Remover fator selecionado
  const removeFactor = (factor: string) => {
    setSelectedFactors(selectedFactors.filter(f => f !== factor));
  };
  
  // Enviar formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const moodData: NewMoodRecord = {
      record_date: date,
      mood_level: moodLevel,
      factors: selectedFactors,
      notes: notes || null
    };
    
    let success;
    
    if (initialData) {
      // Atualizar registro existente
      const updated = await updateMoodRecord(initialData.id, moodData);
      success = !!updated;
      
      if (success) {
        showToast('Registro de humor atualizado com sucesso', 'success');
      }
    } else {
      // Adicionar novo registro
      const created = await addMoodRecord(moodData);
      success = !!created;
      
      if (success) {
        showToast('Registro de humor adicionado com sucesso', 'success');
        // Resetar formulário se for um novo registro
        setMoodLevel(5);
        setDate(new Date().toISOString().split('T')[0]);
        setNotes('');
        setSelectedFactors([]);
      }
    }
    
    if (!success) {
      showToast('Erro ao salvar registro de humor', 'error');
    } else if (onSuccess) {
      onSuccess();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">
        {initialData ? 'Editar Registro de Humor' : 'Novo Registro de Humor'}
      </h3>
      
      {/* Data do registro */}
      <div className="mb-4">
        <label htmlFor="date" className="block text-sm font-medium mb-1">
          Data
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          required
        />
      </div>
      
      {/* Nível de humor */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Como está seu humor hoje? ({moodLevel}/10)
        </label>
        <input
          type="range"
          min="1"
          max="10"
          step="1"
          value={moodLevel}
          onChange={(e) => setMoodLevel(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Muito ruim</span>
          <span>Neutro</span>
          <span>Excelente</span>
        </div>
      </div>
      
      {/* Fatores */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Fatores que influenciaram seu humor
        </label>
        
        {/* Fatores selecionados */}
        {selectedFactors.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {selectedFactors.map((factor, index) => (
              <span 
                key={index}
                className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded flex items-center"
              >
                {factor}
                <button 
                  type="button"
                  onClick={() => removeFactor(factor)}
                  className="ml-1 text-blue-600 dark:text-blue-300 hover:text-blue-800"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
        
        {/* Fatores comuns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 mb-2">
          {COMMON_FACTORS.map((factor) => (
            <button
              key={factor}
              type="button"
              onClick={() => toggleFactor(factor)}
              className={`text-xs px-2 py-1 rounded text-left ${
                selectedFactors.includes(factor)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              {factor}
            </button>
          ))}
        </div>
        
        {/* Fator personalizado */}
        <div className="flex gap-2">
          <input
            type="text"
            value={customFactor}
            onChange={(e) => setCustomFactor(e.target.value)}
            placeholder="Adicionar outro fator..."
            className="flex-1 p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          <button
            type="button"
            onClick={handleAddCustomFactor}
            disabled={!customFactor.trim()}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            +
          </button>
        </div>
      </div>
      
      {/* Notas */}
      <div className="mb-4">
        <label htmlFor="notes" className="block text-sm font-medium mb-1">
          Notas (opcional)
        </label>
        <textarea
          id="notes"
          value={notes || ''}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Descreva mais sobre como você se sente..."
          className="w-full p-2 border rounded min-h-[100px] dark:bg-gray-700 dark:border-gray-600"
        />
      </div>
      
      {/* Mensagem de erro */}
      {error && (
        <p className="text-red-500 mb-4 text-sm">{error.message}</p>
      )}
      
      {/* Botões de ação */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading 
            ? 'Salvando...' 
            : initialData 
              ? 'Atualizar Registro' 
              : 'Salvar Registro'
          }
        </button>
      </div>
    </form>
  );
} 