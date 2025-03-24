import AIAssistant from "@/app/components/ai/AIAssistant";
import { Container } from "@/app/components/ui/Container";
import { Section } from "@/app/components/ui/Section";

export const metadata = {
  title: 'Assistente IA | StayFocus',
  description: 'Assistente de IA para ajudar pessoas neurodivergentes com organização, produtividade e bem-estar.',
};

export default function AssistentePage() {
  return (
    <Container>
      <Section title="Assistente de IA">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Assistente de IA</h1>
          <p className="mb-8 text-muted-foreground">
            Use nossa inteligência artificial para obter recomendações personalizadas 
            adaptadas às necessidades de pessoas neurodivergentes. Este assistente 
            pode ajudar com priorização de tarefas, criação de rotinas estruturadas, 
            planejamento de estudos e muito mais.
          </p>
          
          <AIAssistant />
        </div>
      </Section>
    </Container>
  );
} 