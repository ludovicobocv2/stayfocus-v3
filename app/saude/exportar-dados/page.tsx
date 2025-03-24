'use client';

import { useAuthContext } from '@/app/context/AuthContext';
import DataExportForm from '@/app/components/saude/DataExportForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

/**
 * Página para exportação de dados de saúde
 * Permite ao usuário exportar seus dados para CSV ou PDF
 */
export default function ExportDataPage() {
  const { user } = useAuthContext();
  
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <Link 
          href="/saude"
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          <span>Voltar para Saúde</span>
        </Link>
        
        <h1 className="text-2xl font-bold mb-2">Exportar Dados de Saúde</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Exporte seus dados de saúde para compartilhar com profissionais ou para backup pessoal
        </p>
      </div>
      
      {!user ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-yellow-800 dark:text-yellow-200">
            Você precisa estar logado para exportar seus dados.
          </p>
        </div>
      ) : (
        <>
          <DataExportForm />
          
          <div className="mt-8 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h2 className="text-lg font-medium mb-2">Informações Importantes</h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300 text-sm">
              <li>Os dados exportados são criptografados durante a transferência.</li>
              <li>Certifique-se de armazenar seus dados exportados em um local seguro.</li>
              <li>PDF é o formato recomendado para compartilhar com profissionais de saúde.</li>
              <li>CSV é ideal para análise em planilhas eletrônicas.</li>
              <li>Seus dados nunca são compartilhados com terceiros sem sua permissão.</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
} 