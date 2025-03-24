import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/Card'
import { RastreadorGastos } from '@/app/components/financas/RastreadorGastos'
import { EnvelopesVirtuais } from '@/app/components/financas/EnvelopesVirtuais'
import { CalendarioPagamentos } from '@/app/components/financas/CalendarioPagamentos'
import { AdicionarDespesa } from '@/app/components/financas/AdicionarDespesa'

export default function FinancasPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Finanças</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rastreador de Gastos */}
        <Card>
          <CardHeader>
            <CardTitle>Rastreador de Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <RastreadorGastos />
          </CardContent>
        </Card>
        
        {/* Envelopes Virtuais */}
        <Card>
          <CardHeader>
            <CardTitle>Envelopes Virtuais</CardTitle>
          </CardHeader>
          <CardContent>
            <EnvelopesVirtuais />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calendário de Pagamentos */}
        <Card>
          <CardHeader>
            <CardTitle>Calendário de Pagamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarioPagamentos />
          </CardContent>
        </Card>
        
        {/* Adicionar Despesa Rápida */}
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Despesa</CardTitle>
          </CardHeader>
          <CardContent>
            <AdicionarDespesa />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
