import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/Card'
import { PlanejadorRefeicoes } from '@/app/components/alimentacao/PlanejadorRefeicoes'
import { RegistroRefeicoes } from '@/app/components/alimentacao/RegistroRefeicoes'
import { LembreteHidratacao } from '@/app/components/alimentacao/LembreteHidratacao'

export default function AlimentacaoPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Alimentação</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Planejador de Refeições */}
        <Card>
          <CardHeader>
            <CardTitle>Planejador de Refeições</CardTitle>
          </CardHeader>
          <CardContent>
            <PlanejadorRefeicoes />
          </CardContent>
        </Card>
        
        {/* Registro Visual de Refeições */}
        <Card>
          <CardHeader>
            <CardTitle>Registro de Refeições</CardTitle>
          </CardHeader>
          <CardContent>
            <RegistroRefeicoes />
          </CardContent>
        </Card>
      </div>
      
      {/* Lembrete de Hidratação */}
      <Card>
        <CardHeader>
          <CardTitle>Lembrete de Hidratação</CardTitle>
        </CardHeader>
        <CardContent>
          <LembreteHidratacao />
        </CardContent>
      </Card>
    </div>
  )
}
