import { useState, useEffect } from 'react';
import { useMedications } from '@/app/hooks/useMedications';
import { useToast } from '@/app/hooks/useToast';
import { Medication, NewMedication } from '@/app/types/supabase';

interface MedicationFormProps {
  onSuccess?: () => void;
  initialData?: Medication;
}

export default function MedicationForm({ onSuccess, initialData }: MedicationFormProps) {
  const { addMedication, updateMedication, isLoading, error, resetError } = useMedications();
  const { showToast } = useToast();
  
  // Estado do formulário
  const [name, setName] = useState(initialData?.name || '');
  const [dosage, setDosage] = useState(initialData?.dosage || '');
  const [frequency, setFrequency] = useState(initialData?.frequency || 'Diária');
  const [schedule, setSchedule] = useState<string[]>(initialData?.schedule || ['08:00']);
  const [startDate, setStartDate] = useState(initialData?.start_date || new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [intervalMinutes, setIntervalMinutes] = useState(initialData?.interval_minutes || 240); // 4 horas por padrão
  const [newScheduleTime, setNewScheduleTime] = useState('08:00');
  
  // Resetar erro quando mudar os campos do formulário
  useEffect(() => {
    if (error) resetError();
  }, [name, dosage, frequency, schedule, startDate, notes, intervalMinutes, error, resetError]);
  
  // Adicionar horário ao cronograma
  const handleAddScheduleTime = () => {
    if (newScheduleTime && !schedule.includes(newScheduleTime)) {
      setSchedule([...schedule, newScheduleTime]);
    }
  };
  
  // Remover horário do cronograma
  const handleRemoveScheduleTime = (timeToRemove: string) => {
    setSchedule(schedule.filter(time => time !== timeToRemove));
  };
  
  // Enviar formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      showToast('O nome do medicamento é obrigatório', 'error');
      return;
    }
    
    if (schedule.length === 0) {
      showToast('Adicione pelo menos um horário', 'error');
      return;
    }
    
    const medicationData: NewMedication = {
      name,
      dosage: dosage || null,
      frequency,
      schedule,
      start_date: startDate || null,
      notes: notes || null,
      interval_minutes: intervalMinutes
    };
    
    let success;
    
    if (initialData) {
      // Atualizar medicamento existente
      const updated = await updateMedication(initialData.id, medicationData);
      success = !!updated;
      
      if (success) {
        showToast('Medicamento atualizado com sucesso', 'success');
      }
    } else {
      // Adicionar novo medicamento
      const created = await addMedication(medicationData);
      success = !!created;
      
      if (success) {
        showToast('Medicamento adicionado com sucesso', 'success');
        // Resetar formulário se for novo medicamento
        setName('');
        setDosage('');
        setFrequency('Diária');
        setSchedule(['08:00']);
        setStartDate(new Date().toISOString().split('T')[0]);
        setNotes('');
        setIntervalMinutes(240);
        setNewScheduleTime('08:00');
      }
    }
    
    if (!success) {
      showToast('Erro ao salvar medicamento', 'error');
    } else if (onSuccess) {
      onSuccess();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">
        {initialData ? 'Editar Medicamento' : 'Novo Medicamento'}
      </h3>
      
      {/* Nome e Dosagem */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Nome do Medicamento*
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>
        
        <div>
          <label htmlFor="dosage" className="block text-sm font-medium mb-1">
            Dosagem
          </label>
          <input
            type="text"
            id="dosage"
            value={dosage || ''}
            onChange={(e) => setDosage(e.target.value)}
            placeholder="ex: 10mg, 1 comprimido"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
      </div>
      
      {/* Frequência e Data de Início */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="frequency" className="block text-sm font-medium mb-1">
            Frequência*
          </label>
          <select
            id="frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            required
          >
            <option value="Diária">Diária</option>
            <option value="Semanal">Semanal</option>
            <option value="Mensal">Mensal</option>
            <option value="Quando necessário">Quando necessário</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium mb-1">
            Data de Início
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate || ''}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
      </div>
      
      {/* Intervalo Entre Doses */}
      <div className="mb-4">
        <label htmlFor="intervalMinutes" className="block text-sm font-medium mb-1">
          Intervalo Mínimo Entre Doses (em horas)
        </label>
        <div className="flex items-center">
          <input
            type="range"
            min="60"
            max="1440"
            step="60"
            value={intervalMinutes}
            onChange={(e) => setIntervalMinutes(parseInt(e.target.value))}
            className="w-full mr-2"
          />
          <span className="text-sm">{intervalMinutes / 60}h</span>
        </div>
      </div>
      
      {/* Horários */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Horários Programados*
        </label>
        
        {/* Horários já adicionados */}
        {schedule.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {schedule.map((time, index) => (
              <div 
                key={index}
                className="flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
              >
                <span className="text-sm">{time}</span>
                <button 
                  type="button"
                  onClick={() => handleRemoveScheduleTime(time)}
                  className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Adicionar novo horário */}
        <div className="flex gap-2">
          <input
            type="time"
            value={newScheduleTime}
            onChange={(e) => setNewScheduleTime(e.target.value)}
            className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          <button
            type="button"
            onClick={handleAddScheduleTime}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Adicionar
          </button>
        </div>
      </div>
      
      {/* Observações */}
      <div className="mb-4">
        <label htmlFor="notes" className="block text-sm font-medium mb-1">
          Observações (opcional)
        </label>
        <textarea
          id="notes"
          value={notes || ''}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Instruções especiais, efeitos colaterais, etc."
          className="w-full p-2 border rounded min-h-[80px] dark:bg-gray-700 dark:border-gray-600"
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
              ? 'Atualizar Medicamento' 
              : 'Salvar Medicamento'
          }
        </button>
      </div>
    </form>
  );
} 