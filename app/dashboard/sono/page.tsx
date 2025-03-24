import { Tabs } from "@/app/components/ui/Tabs";
import VisualizadorSemanal from "@/app/components/sono/VisualizadorSemanal";
import ConfiguracaoLembretes from "@/app/components/sono/ConfiguracaoLembretes";
import SleepDataMigration from "@/app/components/sono/SleepDataMigration";

export default function SonoPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Sono</h1>
        <p className="text-muted-foreground">
          Acompanhe seus padrões de sono e estabeleça rotinas saudáveis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs 
            tabs={[
              {
                id: "visualizador",
                label: "Visualizador Semanal",
                content: <VisualizadorSemanal />
              },
              {
                id: "lembretes",
                label: "Lembretes",
                content: <ConfiguracaoLembretes />
              }
            ]}
            defaultTab="visualizador"
          />
        </div>
        
        <div className="space-y-6">
          <SleepDataMigration />
        </div>
      </div>
    </div>
  )
} 