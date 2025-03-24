import { RegistroMedicamentos } from '@/app/components/saude/RegistroMedicamentos'
import { MonitoramentoHumor } from '@/app/components/saude/MonitoramentoHumor'
import Link from 'next/link'
import { Download } from 'lucide-react'

export default function SaudePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Saúde</h1>
        
        <Link 
          href="/saude/exportar-dados"
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Download size={16} className="mr-2" />
          Exportar Dados
        </Link>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Registro de Medicamentos */}
        <RegistroMedicamentos />
        
        {/* Monitoramento de Humor */}
        <MonitoramentoHumor />
      </div>
    </div>
  )
}
