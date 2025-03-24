'use client';

import { useState, useRef, useEffect } from 'react';
import { exportarDados, importarDados } from '../lib/dataService';
import { useDataTransferStore } from '../stores/dataTransferStore';
import { Download, Upload, AlertCircle, CheckCircle, Info, Clock, HelpCircle } from 'lucide-react';
import Link from 'next/link';

/**
 * Componente para exportar e importar dados do aplicativo
 * Permite ao usuário fazer backup dos seus dados ou restaurar a partir de um backup
 */
export const ExportarImportarDados = () => {
  const [status, setStatus] = useState<'idle' | 'exporting' | 'importing' | 'success' | 'error'>('idle');
  const [mensagem, setMensagem] = useState('');
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);
  
  // Acessar a store de transferência de dados
  const { 
    ultimaExportacao, 
    ultimaImportacao, 
    registrarExportacao, 
    registrarImportacao 
  } = useDataTransferStore();
  
  // Formatar datas para exibição
  const formatarData = (dataIso: string | null) => {
    if (!dataIso) return null;
    
    const data = new Date(dataIso);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  /**
   * Manipula o processo de exportação de dados
   */
  const handleExportar = async () => {
    setStatus('exporting');
    try {
      const resultado = exportarDados();
      if (resultado.sucesso) {
        setStatus('success');
        setMensagem('Dados exportados com sucesso!');
        registrarExportacao(); // Registrar a exportação no histórico
      } else {
        throw new Error(resultado.erro);
      }
    } catch (error: any) {
      setStatus('error');
      setMensagem(`Erro ao exportar: ${error.message}`);
    }
    
    // Limpar mensagem após 3 segundos
    setTimeout(() => {
      setStatus('idle');
      setMensagem('');
    }, 3000);
  };
  
  /**
   * Manipula a seleção de arquivo para importação
   */
  const handleSelecionarArquivo = (evento: React.ChangeEvent<HTMLInputElement>) => {
    const arquivos = evento.target.files;
    if (!arquivos || arquivos.length === 0) return;
    
    const arquivo = arquivos[0];
    setArquivoSelecionado(arquivo);
    setMostrarConfirmacao(true);
  };
  
  /**
   * Cancela a importação e limpa o arquivo selecionado
   */
  const cancelarImportacao = () => {
    setArquivoSelecionado(null);
    setMostrarConfirmacao(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  /**
   * Confirma e executa a importação de dados
   */
  const confirmarImportacao = async () => {
    if (!arquivoSelecionado) return;
    
    setStatus('importing');
    setMostrarConfirmacao(false);
    
    try {
      const resultado = await importarDados(arquivoSelecionado);
      if (resultado.sucesso) {
        setStatus('success');
        
        // Registrar no histórico com o timestamp do backup
        registrarImportacao(resultado.timestamp);
        
        // Formatar a data do backup
        const dataBackup = new Date(resultado.timestamp || new Date().toISOString());
        const dataFormatada = dataBackup.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        setMensagem(`Dados importados com sucesso! (Backup de ${dataFormatada})`);
      } else {
        throw new Error(resultado.erro);
      }
    } catch (error: any) {
      setStatus('error');
      setMensagem(`Erro ao importar: ${error.message}`);
    }
    
    // Resetar input de arquivo
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    setArquivoSelecionado(null);
  };
  
  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Importar/Exportar Dados</h2>
          <Link 
            href="/perfil/ajuda" 
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
            title="Ajuda com importação e exportação"
          >
            <HelpCircle size={16} />
          </Link>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Faça backup dos seus dados ou restaure a partir de um backup anterior
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Histórico de transferências */}
        {(ultimaExportacao || ultimaImportacao) && (
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            {ultimaExportacao && (
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>Última exportação: {formatarData(ultimaExportacao)}</span>
              </div>
            )}
            {ultimaImportacao && (
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>Última importação: {formatarData(ultimaImportacao)}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Seção de Exportação */}
        <div className="space-y-2">
          <button 
            onClick={handleExportar}
            disabled={status === 'exporting' || status === 'importing'}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            Exportar Dados
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Cria um arquivo JSON com todos os seus dados para backup
          </p>
        </div>
        
        {/* Seção de Importação */}
        <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={status === 'exporting' || status === 'importing' || mostrarConfirmacao}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload size={18} />
            Importar Dados
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleSelecionarArquivo}
            accept=".json"
            className="hidden"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Restaura seus dados a partir de um arquivo de backup
          </p>
        </div>
        
        {/* Diálogo de confirmação */}
        {mostrarConfirmacao && arquivoSelecionado && (
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <div className="flex items-start gap-3">
              <Info className="text-yellow-500 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-medium text-yellow-800 dark:text-yellow-200">Confirmar importação</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Isso substituirá seus dados atuais pelos dados do arquivo selecionado.
                  Arquivo: {arquivoSelecionado.name}
                </p>
                <div className="flex gap-2 mt-3">
                  <button 
                    onClick={confirmarImportacao}
                    className="px-3 py-1 text-sm bg-yellow-600 hover:bg-yellow-700 text-white rounded-md"
                  >
                    Importar
                  </button>
                  <button 
                    onClick={cancelarImportacao}
                    className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-md"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Mensagem de status */}
        {mensagem && (
          <div className={`mt-4 flex items-start gap-3 p-3 rounded-md ${
            status === 'success' ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800' : 
            status === 'error' ? 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800' : ''
          }`}>
            {status === 'success' ? 
              <CheckCircle className="text-green-500 flex-shrink-0" size={18} /> : 
              <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
            }
            <p className={`text-sm ${
              status === 'success' ? 'text-green-700 dark:text-green-300' : 
              status === 'error' ? 'text-red-700 dark:text-red-300' : ''
            }`}>
              {mensagem}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}; 