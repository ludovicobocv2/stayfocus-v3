import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/Card'
import { TemporizadorPomodoro } from '@/app/components/estudos/TemporizadorPomodoro'
import { RegistroEstudos } from '@/app/components/estudos/RegistroEstudos'

export default function EstudosPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Estudos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Temporizador Pomodoro Adaptado */}
        <Card>
          <CardHeader>
            <CardTitle>Temporizador Pomodoro</CardTitle>
          </CardHeader>
          <CardContent>
            <TemporizadorPomodoro />
          </CardContent>
        </Card>
        
        {/* Registro de Sessões de Estudo */}
        <Card>
          <CardHeader>
            <CardTitle>Registro de Estudos</CardTitle>
          </CardHeader>
          <CardContent>
            <RegistroEstudos />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
