import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/Card'
import { AtividadesLazer } from '@/app/components/lazer/AtividadesLazer'
import { SugestoesDescanso } from '@/app/components/lazer/SugestoesDescanso'
import { TemporizadorLazer } from '@/app/components/lazer/TemporizadorLazer'

export default function LazerPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Lazer</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Temporizador de Lazer */}
        <Card>
          <CardHeader>
            <CardTitle>Temporizador de Lazer</CardTitle>
          </CardHeader>
          <CardContent>
            <TemporizadorLazer />
          </CardContent>
        </Card>
        
        {/* Atividades de Lazer */}
        <Card>
          <CardHeader>
            <CardTitle>Atividades de Lazer</CardTitle>
          </CardHeader>
          <CardContent>
            <AtividadesLazer />
          </CardContent>
        </Card>
        
        {/* Sugestões de Descanso */}
        <Card>
          <CardHeader>
            <CardTitle>Sugestões de Descanso</CardTitle>
          </CardHeader>
          <CardContent>
            <SugestoesDescanso />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
