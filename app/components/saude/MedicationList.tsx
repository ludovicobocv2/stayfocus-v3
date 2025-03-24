import { useState, useEffect, useCallback } from 'react';
import { useMedications } from '@/app/hooks/useMedications';
import { useToast } from '@/app/hooks/useToast';
import MedicationItem from './MedicationItem';
import MedicationForm from './MedicationForm';
import MedicationDataMigration from './MedicationDataMigration';
import { NewMedicationDose, Medication } from '@/app/types/supabase';

export default function MedicationList() {
  const { getMedications, recordMedicationDose, isLoading, error } = useMedications();
  const { showToast } = useToast();
  
  const [medications, setMedications] = useState<Medication[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Carregar medicamentos
  useEffect(() => {
    const loadMedications = async () => {
      const data = await getMedications();
      setMedications(data);
    };
    
    loadMedications();
  }, [getMedications, refreshTrigger]);
  
  // Atualizar lista após alterações
  const refreshMedications = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);
  
  // Alternar exibição do formulário
  const handleToggleForm = useCallback(() => {
    setShowForm(prev => !prev);
    setEditingMedication(null); // Limpar edição ao fechar/abrir formulário
  }, []);
  
  // Iniciar edição de medicamento
  const handleEditMedication = useCallback((medication: Medication) => {
    setEditingMedication(medication);
    setShowForm(true);
  }, []);
  
  // Gerenciar sucesso do formulário
  const handleFormSuccess = useCallback(() => {
    refreshMedications();
    
    // Se estiver editando, fechar o formulário após concluir
    if (editingMedication) {
      setShowForm(false);
      setEditingMedication(null);
    }
  }, [refreshMedications, editingMedication]);
  
  // Registrar tomada de medicamento
  const handleRecordDose = useCallback(async (medicationId: string) => {
    const now = new Date();
    const dose: NewMedicationDose = {
      medication_id: medicationId,
      taken_at: now.toISOString(),
    };
    
    const result = await recordMedicationDose(medicationId, dose);
    
    if (result) {
      showToast('Dose registrada com sucesso', 'success');
      refreshMedications();
    } else {
      showToast('Erro ao registrar dose', 'error');
    }
  }, [recordMedicationDose, showToast, refreshMedications]);
  
  // Manipular conclusão da migração
  const handleMigrationComplete = useCallback(() => {
    refreshMedications();
  }, [refreshMedications]);
  
  return (
    <div className="container mx-auto max-w-md p-4">
      <h2 className="text-xl font-bold mb-4">Gerenciamento de Medicamentos</h2>
      
      {/* Componente de migração de dados */}
      <MedicationDataMigration onMigrationComplete={handleMigrationComplete} />
      
      {/* Botão para mostrar/ocultar formulário */}
      <div className="mb-4">
        <button
          onClick={handleToggleForm}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showForm 
            ? 'Cancelar' 
            : editingMedication 
              ? 'Editar Medicamento' 
              : 'Adicionar Medicamento'
          }
        </button>
      </div>
      
      {/* Formulário para adicionar/editar medicamento */}
      {showForm && (
        <div className="mb-6">
          <MedicationForm 
            onSuccess={handleFormSuccess} 
            initialData={editingMedication || undefined}
          />
        </div>
      )}
      
      {/* Estado de carregamento */}
      {isLoading && !medications.length && (
        <div className="text-center py-4">
          <p>Carregando medicamentos...</p>
        </div>
      )}
      
      {/* Mensagem de erro */}
      {error && (
        <div className="text-red-500 mb-4">
          <p>Erro ao carregar medicamentos: {error.message}</p>
        </div>
      )}
      
      {/* Lista de medicamentos */}
      {!isLoading && !medications.length ? (
        <div className="text-center py-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p>Você ainda não possui medicamentos cadastrados.</p>
          {!showForm && (
            <button
              onClick={handleToggleForm}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Cadastrar Agora
            </button>
          )}
        </div>
      ) : (
        <div>
          <h3 className="font-medium mb-2">Seus Medicamentos</h3>
          
          {/* Agrupar por frequência */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Uso Diário</h4>
            {medications
              .filter(med => med.frequency === 'Diária')
              .map(medication => (
                <MedicationItem
                  key={medication.id}
                  medication={medication}
                  onUpdate={refreshMedications}
                  onRecord={handleRecordDose}
                />
              ))}
              
            {!medications.some(med => med.frequency === 'Diária') && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                Nenhum medicamento de uso diário cadastrado
              </p>
            )}
          </div>
          
          {/* Outros tipos de frequência */}
          {medications.some(med => med.frequency !== 'Diária') && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Outros Medicamentos</h4>
              {medications
                .filter(med => med.frequency !== 'Diária')
                .map(medication => (
                  <MedicationItem
                    key={medication.id}
                    medication={medication}
                    onUpdate={refreshMedications}
                    onRecord={handleRecordDose}
                  />
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 