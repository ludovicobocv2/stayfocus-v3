import { useState } from 'react';
import { useAuthContext } from '@/app/context/AuthContext';
import { useToast } from '@/app/hooks/useToast';
import { ExportFormat, ModuleType, exportSupabaseData } from '@/app/lib/supabaseExport';

/**
 * Componente de formulário para exportação de dados do Supabase
 * Permite que o usuário selecione quais módulos exportar e o formato desejado
 */
export default function DataExportForm() {
  const { user } = useAuthContext();
  const { showToast } = useToast();
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [format, setFormat] = useState<ExportFormat>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  
  // Módulos selecionados para exportação
  const [selectedModules, setSelectedModules] = useState<{
    priorities: boolean;
    sleep_records: boolean;
    mood_records: boolean;
    medications: boolean;
  }>({
    priorities: true,
    sleep_records: true,
    mood_records: true,
    medications: true,
  });
  
  /**
   * Atualiza o estado dos módulos selecionados
   */
  const handleModuleChange = (module: keyof typeof selectedModules) => {
    setSelectedModules(prev => ({
      ...prev,
      [module]: !prev[module]
    }));
  };
  
  /**
   * Atualiza o formato de exportação
   */
  const handleFormatChange = (newFormat: ExportFormat) => {
    setFormat(newFormat);
  };
  
  /**
   * Inicia o processo de exportação de dados
   */
  const handleExport = async () => {
    // Verificar se pelo menos um módulo está selecionado
    const modules = Object.entries(selectedModules)
      .filter(([_, selected]) => selected)
      .map(([module]) => module as ModuleType);
      
    if (modules.length === 0) {
      showToast('Selecione pelo menos um módulo para exportar', 'error');
      return;
    }
    
    setIsExporting(true);
    
    try {
      // Converter datas de string para Date se fornecidas
      const startDateObj = startDate ? new Date(startDate) : undefined;
      const endDateObj = endDate ? new Date(endDate) : undefined;
      
      // Chamar função de exportação
      const result = await exportSupabaseData(user, {
        modules,
        format,
        startDate: startDateObj,
        endDate: endDateObj,
      });
      
      if (result.success) {
        showToast(result.message || 'Dados exportados com sucesso', 'success');
      } else {
        showToast(result.error || 'Erro ao exportar dados', 'error');
      }
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      showToast('Ocorreu um erro ao exportar dados', 'error');
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Exportar Dados</h2>
      
      <div className="space-y-6">
        {/* Seleção de módulos */}
        <div>
          <h3 className="text-md font-medium mb-2">Dados para exportar:</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="priorities"
                checked={selectedModules.priorities}
                onChange={() => handleModuleChange('priorities')}
                className="mr-2"
              />
              <label htmlFor="priorities">Prioridades</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sleep_records"
                checked={selectedModules.sleep_records}
                onChange={() => handleModuleChange('sleep_records')}
                className="mr-2"
              />
              <label htmlFor="sleep_records">Registros de Sono</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="mood_records"
                checked={selectedModules.mood_records}
                onChange={() => handleModuleChange('mood_records')}
                className="mr-2"
              />
              <label htmlFor="mood_records">Registros de Humor</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="medications"
                checked={selectedModules.medications}
                onChange={() => handleModuleChange('medications')}
                className="mr-2"
              />
              <label htmlFor="medications">Medicamentos</label>
            </div>
          </div>
        </div>
        
        {/* Filtro de período */}
        <div>
          <h3 className="text-md font-medium mb-2">Período (opcional):</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm mb-1">Data inicial:</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm mb-1">Data final:</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
        </div>
        
        {/* Seleção de formato */}
        <div>
          <h3 className="text-md font-medium mb-2">Formato:</h3>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="formatPdf"
                checked={format === 'pdf'}
                onChange={() => handleFormatChange('pdf')}
                className="mr-2"
              />
              <label htmlFor="formatPdf">PDF</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="formatCsv"
                checked={format === 'csv'}
                onChange={() => handleFormatChange('csv')}
                className="mr-2"
              />
              <label htmlFor="formatCsv">CSV</label>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {format === 'pdf' 
              ? 'PDF é ideal para compartilhar com profissionais de saúde.' 
              : 'CSV é ideal para análise em planilhas eletrônicas.'}
          </p>
        </div>
        
        {/* Botão de exportação */}
        <div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? 'Exportando...' : 'Exportar Dados'}
          </button>
        </div>
      </div>
    </div>
  );
} 