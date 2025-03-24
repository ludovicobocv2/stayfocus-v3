"use client";

import { useState, useRef } from "react";
import { Button } from "@/app/components/ui/Button";
import { Textarea } from "@/app/components/ui/Textarea";
import { Input } from "@/app/components/ui/Input";
import { Select } from "@/app/components/ui/Select";
import { Card } from "@/app/components/ui/Card";
import { LoadingIndicator } from "@/app/components/ui/LoadingIndicator";
import { Alert } from "@/app/components/ui/Alert";
import { Badge } from "@/app/components/ui/Badge";
import { priorizarTarefas, gerarRotinaDiaria, planoDeEstudos, estrategiasSono, analiseFinanceira } from "@/app/lib/ai";

type AssistantMode = "prioridades" | "rotina" | "estudos" | "sono" | "financas";

export default function AIAssistant() {
  const [mode, setMode] = useState<AssistantMode>("prioridades");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Campos para o modo prioridades
  const [tarefas, setTarefas] = useState("");
  const [contexto, setContexto] = useState("");
  
  // Campos para o modo rotina
  const [horaAcordar, setHoraAcordar] = useState("07:00");
  const [horaDormir, setHoraDormir] = useState("23:00");
  const [preferencias, setPreferencias] = useState("");
  
  // Campos para o modo estudos
  const [assunto, setAssunto] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [tempoDisponivel, setTempoDisponivel] = useState("");
  
  // Campos para o modo sono
  const [horasDormidas, setHorasDormidas] = useState<number>(7);
  const [problemasSono, setProblemasSono] = useState("");
  
  // Campos para o modo finanças
  const [renda, setRenda] = useState<number>(0);
  const [categorias, setCategorias] = useState<{ nome: string; valor: number }[]>([
    { nome: "Moradia", valor: 0 },
    { nome: "Alimentação", valor: 0 },
    { nome: "Transporte", valor: 0 },
    { nome: "Lazer", valor: 0 },
    { nome: "Outros", valor: 0 }
  ]);

  const resultRef = useRef<HTMLDivElement>(null);

  // Função para rolar até o resultado
  const scrollToResult = () => {
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      let response: string;
      
      switch (mode) {
        case "prioridades":
          if (!tarefas.trim()) {
            throw new Error("Por favor, adicione pelo menos uma tarefa.");
          }
          const tarefasLista = tarefas.split('\n').filter(t => t.trim() !== '');
          response = await priorizarTarefas(tarefasLista, contexto);
          break;
          
        case "rotina":
          response = await gerarRotinaDiaria(horaAcordar, horaDormir, preferencias);
          break;
          
        case "estudos":
          if (!assunto.trim() || !objetivo.trim() || !tempoDisponivel.trim()) {
            throw new Error("Por favor, preencha todos os campos.");
          }
          response = await planoDeEstudos(assunto, objetivo, tempoDisponivel);
          break;
          
        case "sono":
          const problemasList = problemasSono.split('\n').filter(p => p.trim() !== '');
          response = await estrategiasSono(horasDormidas, problemasList);
          break;
          
        case "financas":
          if (renda <= 0) {
            throw new Error("Por favor, informe uma renda válida.");
          }
          const categoriasObj: Record<string, number> = {};
          categorias.forEach(cat => {
            categoriasObj[cat.nome] = cat.valor;
          });
          response = await analiseFinanceira(categoriasObj, renda);
          break;
          
        default:
          throw new Error("Modo de assistente inválido.");
      }
      
      setResult(response);
      // Rola para o resultado após um pequeno delay para garantir que o componente foi renderizado
      setTimeout(scrollToResult, 100);
    } catch (err) {
      console.error("Erro ao processar solicitação:", err);
      setError(err instanceof Error ? err.message : "Ocorreu um erro ao processar sua solicitação.");
    } finally {
      setLoading(false);
    }
  };

  const updateCategoria = (index: number, nome: string, valor: number) => {
    const newCategorias = [...categorias];
    newCategorias[index] = { nome, valor };
    setCategorias(newCategorias);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Assistente de IA para Neurodivergentes</h2>
        <p className="text-muted-foreground">
          Este assistente usa inteligência artificial para ajudar em vários aspectos da organização
          pessoal, adaptados às necessidades de pessoas neurodivergentes.
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge 
            className={`cursor-pointer ${mode === "prioridades" ? "bg-primary" : "bg-secondary"}`}
            onClick={() => setMode("prioridades")}
          >
            Priorização de Tarefas
          </Badge>
          <Badge 
            className={`cursor-pointer ${mode === "rotina" ? "bg-primary" : "bg-secondary"}`}
            onClick={() => setMode("rotina")}
          >
            Rotina Diária
          </Badge>
          <Badge 
            className={`cursor-pointer ${mode === "estudos" ? "bg-primary" : "bg-secondary"}`}
            onClick={() => setMode("estudos")}
          >
            Plano de Estudos
          </Badge>
          <Badge 
            className={`cursor-pointer ${mode === "sono" ? "bg-primary" : "bg-secondary"}`}
            onClick={() => setMode("sono")}
          >
            Qualidade do Sono
          </Badge>
          <Badge 
            className={`cursor-pointer ${mode === "financas" ? "bg-primary" : "bg-secondary"}`}
            onClick={() => setMode("financas")}
          >
            Finanças
          </Badge>
        </div>
        
        <Card className="p-6">
          {mode === "prioridades" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Priorização de Tarefas</h3>
              <p className="text-sm text-muted-foreground">
                Adicione suas tarefas (uma por linha) e o assistente irá ajudar a priorizá-las de acordo com 
                as necessidades específicas de pessoas com TDAH.
              </p>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tarefas (uma por linha)</label>
                <Textarea 
                  value={tarefas} 
                  onChange={(e) => setTarefas(e.target.value)} 
                  placeholder="Ex: Preparar apresentação para reunião&#10;Pagar contas&#10;Organizar mesa de trabalho" 
                  rows={5}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Contexto Adicional (opcional)</label>
                <Textarea 
                  value={contexto} 
                  onChange={(e) => setContexto(e.target.value)} 
                  placeholder="Ex: Estou com baixa energia hoje e preciso me concentrar na apresentação que é para amanhã."
                  rows={3}
                />
              </div>
            </div>
          )}
          
          {mode === "rotina" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Rotina Diária</h3>
              <p className="text-sm text-muted-foreground">
                Gere uma rotina diária estruturada adaptada às necessidades de pessoas com TDAH.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Horário de Acordar</label>
                  <Input 
                    type="time" 
                    value={horaAcordar} 
                    onChange={(e) => setHoraAcordar(e.target.value)} 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Horário de Dormir</label>
                  <Input 
                    type="time" 
                    value={horaDormir} 
                    onChange={(e) => setHoraDormir(e.target.value)} 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Preferências e Necessidades (opcional)</label>
                <Textarea 
                  value={preferencias} 
                  onChange={(e) => setPreferencias(e.target.value)} 
                  placeholder="Ex: Preciso de 30 minutos para exercício físico diário. Trabalho das 9h às 17h. Medicação às 8h e 14h."
                  rows={3}
                />
              </div>
            </div>
          )}
          
          {mode === "estudos" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Plano de Estudos</h3>
              <p className="text-sm text-muted-foreground">
                Crie um plano de estudos adaptado às necessidades de pessoas com TDAH.
              </p>
              
              <div>
                <label className="block text-sm font-medium mb-1">Assunto</label>
                <Input 
                  value={assunto} 
                  onChange={(e) => setAssunto(e.target.value)} 
                  placeholder="Ex: Matemática, História, Programação em Python" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Objetivo</label>
                <Input 
                  value={objetivo} 
                  onChange={(e) => setObjetivo(e.target.value)} 
                  placeholder="Ex: Preparar para prova, aprender nova habilidade, revisar conteúdo" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tempo Disponível</label>
                <Input 
                  value={tempoDisponivel} 
                  onChange={(e) => setTempoDisponivel(e.target.value)} 
                  placeholder="Ex: 2 horas por dia, 5 dias" 
                />
              </div>
            </div>
          )}
          
          {mode === "sono" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Qualidade do Sono</h3>
              <p className="text-sm text-muted-foreground">
                Obtenha estratégias para melhorar a qualidade do sono, considerando os desafios específicos do TDAH.
              </p>
              
              <div>
                <label className="block text-sm font-medium mb-1">Média de Horas Dormidas por Noite</label>
                <Input 
                  type="number" 
                  min="0" 
                  max="24" 
                  step="0.5"
                  value={horasDormidas} 
                  onChange={(e) => setHorasDormidas(Number(e.target.value))} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Problemas Específicos (um por linha, opcional)</label>
                <Textarea 
                  value={problemasSono} 
                  onChange={(e) => setProblemasSono(e.target.value)} 
                  placeholder="Ex: Dificuldade para adormecer&#10;Acordar várias vezes durante a noite&#10;Sonolência diurna excessiva"
                  rows={3}
                />
              </div>
            </div>
          )}
          
          {mode === "financas" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Finanças</h3>
              <p className="text-sm text-muted-foreground">
                Analise seus gastos e obtenha estratégias para melhorar a organização financeira.
              </p>
              
              <div>
                <label className="block text-sm font-medium mb-1">Renda Mensal (R$)</label>
                <Input 
                  type="number" 
                  min="0" 
                  step="100"
                  value={renda} 
                  onChange={(e) => setRenda(Number(e.target.value))} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Categorias de Gastos</label>
                {categorias.map((categoria, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input 
                      className="w-1/2"
                      value={categoria.nome} 
                      onChange={(e) => updateCategoria(index, e.target.value, categoria.valor)} 
                      placeholder="Nome da categoria" 
                    />
                    <Input 
                      className="w-1/2"
                      type="number" 
                      min="0" 
                      step="10"
                      value={categoria.valor} 
                      onChange={(e) => updateCategoria(index, categoria.nome, Number(e.target.value))} 
                      placeholder="Valor (R$)" 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-6">
            <Button 
              onClick={handleSubmit} 
              disabled={loading}
              className="w-full"
            >
              {loading ? <LoadingIndicator /> : 'Gerar Recomendações'}
            </Button>
          </div>
        </Card>
        
        {error && (
          <Alert variant="destructive" className="mt-4">
            {error}
          </Alert>
        )}
        
        {result && (
          <div ref={resultRef} className="mt-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recomendações</h3>
              <div className="whitespace-pre-line">{result}</div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 