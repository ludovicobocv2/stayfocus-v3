'use client'

import { useState, useEffect } from 'react'
import { Bell, Trash2, Moon, Sun, Clock, Eye, EyeOff, Edit2 } from 'lucide-react'
import { useSleep } from '@/app/hooks/useSleep'
import { SleepReminder } from '@/app/types/supabase'
import { LoadingIndicator } from '@/app/components/ui/LoadingIndicator'
import { toast } from '@/app/components/ui/Toast'

// Dias da semana para seleção
const diasSemana = [
  { valor: 0, nome: 'Dom', abrev: 'D' },
  { valor: 1, nome: 'Seg', abrev: 'S' },
  { valor: 2, nome: 'Ter', abrev: 'T' },
  { valor: 3, nome: 'Qua', abrev: 'Q' },
  { valor: 4, nome: 'Qui', abrev: 'Q' },
  { valor: 5, nome: 'Sex', abrev: 'S' },
  { valor: 6, nome: 'Sáb', abrev: 'S' },
]

export default function ConfiguracaoLembretes() {
  const { 
    getSleepReminders, 
    addSleepReminder, 
    updateSleepReminder, 
    deleteSleepReminder, 
    toggleReminderActive,
    isLoading 
  } = useSleep()
  
  const [lembretes, setLembretes] = useState<SleepReminder[]>([])
  const [carregando, setCarregando] = useState(false)
  
  // Estado do formulário
  const [tipo, setTipo] = useState<'dormir' | 'acordar'>('dormir')
  const [horario, setHorario] = useState('22:00')
  const [diasSelecionados, setDiasSelecionados] = useState<number[]>([0, 1, 2, 3, 4, 5, 6])
  const [modoEdicao, setModoEdicao] = useState(false)
  const [idEdicao, setIdEdicao] = useState<string | null>(null)

  // Carregar lembretes do Supabase
  useEffect(() => {
    const carregarLembretes = async () => {
      setCarregando(true)
      try {
        const dados = await getSleepReminders()
        setLembretes(dados)
      } catch (erro) {
        console.error('Erro ao carregar lembretes:', erro)
        toast({
          title: "Erro",
          description: "Não foi possível carregar seus lembretes",
          variant: "error"
        })
      } finally {
        setCarregando(false)
      }
    }
    
    carregarLembretes()
  }, [getSleepReminders])

  // Alternar seleção de dia
  const toggleDia = (dia: number) => {
    if (diasSelecionados.includes(dia)) {
      setDiasSelecionados(diasSelecionados.filter(d => d !== dia))
    } else {
      setDiasSelecionados([...diasSelecionados, dia])
    }
  }
  
  // Selecionar todos os dias
  const selecionarTodosDias = () => {
    setDiasSelecionados([0, 1, 2, 3, 4, 5, 6])
  }
  
  // Selecionar apenas dias de semana
  const selecionarDiasSemana = () => {
    setDiasSelecionados([1, 2, 3, 4, 5])
  }
  
  // Selecionar apenas fim de semana
  const selecionarFimDeSemana = () => {
    setDiasSelecionados([0, 6])
  }
  
  // Limpar seleção de dias
  const limparDias = () => {
    setDiasSelecionados([])
  }
  
  // Iniciar edição de um lembrete
  const iniciarEdicao = (lembrete: SleepReminder) => {
    setTipo(lembrete.type as 'dormir' | 'acordar')
    setHorario(lembrete.time)
    setDiasSelecionados(lembrete.days_of_week)
    setModoEdicao(true)
    setIdEdicao(lembrete.id)
  }
  
  // Cancelar edição
  const cancelarEdicao = () => {
    resetForm()
    setModoEdicao(false)
    setIdEdicao(null)
  }
  
  // Resetar formulário
  const resetForm = () => {
    setTipo('dormir')
    setHorario('22:00')
    setDiasSelecionados([0, 1, 2, 3, 4, 5, 6])
  }
  
  // Alternar estado ativo de um lembrete
  const handleToggleAtivo = async (id: string, ativo: boolean) => {
    try {
      const lembrete = await toggleReminderActive(id, !ativo)
      if (lembrete) {
        setLembretes(lembretes.map(l => l.id === id ? lembrete : l))
        toast({
          title: "Sucesso",
          description: `Lembrete ${!ativo ? 'ativado' : 'desativado'} com sucesso`,
          variant: "success"
        })
      }
    } catch (erro) {
      console.error("Erro ao alterar estado do lembrete:", erro)
      toast({
        title: "Erro",
        description: "Não foi possível alterar o estado do lembrete",
        variant: "error"
      })
    }
  }
  
  // Remover um lembrete
  const handleRemoverLembrete = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este lembrete?')) {
      try {
        const sucesso = await deleteSleepReminder(id)
        if (sucesso) {
          setLembretes(lembretes.filter(l => l.id !== id))
          toast({
            title: "Sucesso",
            description: "Lembrete removido com sucesso",
            variant: "success"
          })
        }
      } catch (erro) {
        console.error("Erro ao remover lembrete:", erro)
        toast({
          title: "Erro",
          description: "Não foi possível remover o lembrete",
          variant: "error"
        })
      }
    }
  }
  
  // Lidar com envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (diasSelecionados.length === 0) {
      toast({
        title: "Atenção",
        description: "Selecione pelo menos um dia da semana",
        variant: "warning"
      })
      return
    }
    
    try {
      if (modoEdicao && idEdicao) {
        const lembrete = await updateSleepReminder(idEdicao, {
          type: tipo,
          time: horario,
          days_of_week: diasSelecionados
        })
        
        if (lembrete) {
          setLembretes(lembretes.map(l => l.id === idEdicao ? lembrete : l))
          toast({
            title: "Sucesso",
            description: "Lembrete atualizado com sucesso",
            variant: "success"
          })
        }
        
        // Limpar modo de edição
        setModoEdicao(false)
        setIdEdicao(null)
      } else {
        const novoLembrete = await addSleepReminder({
          type: tipo,
          time: horario,
          days_of_week: diasSelecionados,
          active: true
        })
        
        if (novoLembrete) {
          setLembretes([...lembretes, novoLembrete])
          toast({
            title: "Sucesso",
            description: "Lembrete adicionado com sucesso",
            variant: "success"
          })
        }
      }
      
      // Resetar formulário
      resetForm()
    } catch (erro) {
      console.error("Erro ao salvar lembrete:", erro)
      toast({
        title: "Erro",
        description: "Não foi possível salvar o lembrete",
        variant: "error"
      })
    }
  }
  
  // Formatar exibição dos dias da semana
  const formatarDiasSemana = (dias: number[]) => {
    if (dias.length === 7) return 'Todos os dias'
    if (dias.length === 0) return 'Nenhum dia selecionado'
    if (arrayEquals(dias, [1, 2, 3, 4, 5])) return 'Segunda a Sexta'
    if (arrayEquals(dias, [0, 6])) return 'Fim de semana'
    
    return dias
      .sort((a, b) => a - b)
      .map(dia => diasSemana.find(d => d.valor === dia)?.nome)
      .join(', ')
  }
  
  // Verificar se dois arrays são iguais
  const arrayEquals = (a: any[], b: any[]) => {
    return a.length === b.length && 
      a.sort().every((val, index) => val === b.sort()[index])
  }
  
  // Agrupar lembretes por tipo
  const lembretesDormir = lembretes.filter(l => l.type === 'dormir')
  const lembretesAcordar = lembretes.filter(l => l.type === 'acordar')
  
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
        Configuração de Lembretes
      </h2>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Tipo de lembrete */}
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
              Tipo de Lembrete
            </h3>
            
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tipo"
                  checked={tipo === 'dormir'}
                  onChange={() => setTipo('dormir')}
                  className="h-4 w-4 text-sono-primary focus:ring-sono-primary border-gray-300"
                />
                <span className="ml-2 flex items-center text-gray-700 dark:text-gray-300">
                  <Moon className="h-4 w-4 mr-1 rotate-180" />
                  Hora de dormir
                </span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tipo"
                  checked={tipo === 'acordar'}
                  onChange={() => setTipo('acordar')}
                  className="h-4 w-4 text-sono-primary focus:ring-sono-primary border-gray-300"
                />
                <span className="ml-2 flex items-center text-gray-700 dark:text-gray-300">
                  <Sun className="h-4 w-4 mr-1" />
                  Hora de acordar
                </span>
              </label>
            </div>
          </div>
          
          {/* Horário */}
          <div>
            <label htmlFor="horario" className="block font-medium text-gray-700 dark:text-gray-300 mb-3">
              Horário
            </label>
            <input
              type="time"
              id="horario"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sono-primary focus:border-sono-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
        </div>
        
        {/* Dias da semana */}
        <div className="mt-6">
          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
            Dias da Semana
          </h3>
          
          <div className="flex mb-3 space-x-2">
            <button
              type="button"
              onClick={selecionarTodosDias}
              className="px-2 py-1 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Todos
            </button>
            <button
              type="button"
              onClick={selecionarDiasSemana}
              className="px-2 py-1 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Seg-Sex
            </button>
            <button
              type="button"
              onClick={selecionarFimDeSemana}
              className="px-2 py-1 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Fim de semana
            </button>
            <button
              type="button"
              onClick={limparDias}
              className="px-2 py-1 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Limpar
            </button>
          </div>
          
          <div className="flex space-x-2 flex-wrap">
            {diasSemana.map((dia) => (
              <button
                key={dia.valor}
                type="button"
                onClick={() => toggleDia(dia.valor)}
                className={`
                  w-9 h-9 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-sono-primary
                  ${diasSelecionados.includes(dia.valor)
                    ? 'bg-sono-primary text-white'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}
                `}
                aria-label={`${diasSelecionados.includes(dia.valor) ? 'Remover' : 'Adicionar'} ${dia.nome}`}
                aria-pressed={diasSelecionados.includes(dia.valor)}
              >
                {dia.abrev}
              </button>
            ))}
          </div>
          
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {formatarDiasSemana(diasSelecionados)}
          </p>
        </div>
        
        {/* Botões de ação */}
        <div className="mt-6 flex justify-end space-x-3">
          {modoEdicao && (
            <button
              type="button"
              onClick={cancelarEdicao}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sono-primary focus:ring-offset-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
            >
              Cancelar
            </button>
          )}
          
          <button
            type="submit"
            disabled={isLoading || carregando}
            className="px-4 py-2 bg-sono-primary text-white rounded-md shadow-sm hover:bg-sono-secondary focus:outline-none focus:ring-2 focus:ring-sono-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading || carregando ? (
              <>
                <LoadingIndicator size="small" text="" />
                <span className="ml-2">Salvando...</span>
              </>
            ) : (
              <span>{modoEdicao ? 'Atualizar' : 'Adicionar'} Lembrete</span>
            )}
          </button>
        </div>
      </form>
      
      {/* Lista de lembretes */}
      {carregando || isLoading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingIndicator text="Carregando lembretes..." />
        </div>
      ) : (
        <>
          {/* Lembretes de Dormir */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 dark:text-white mb-3 flex items-center">
              <Moon className="h-4 w-4 mr-2 rotate-180" />
              Lembretes para Dormir
            </h3>
            
            {lembretesDormir.length > 0 ? (
              <div className="space-y-3">
                {lembretesDormir.map((lembrete) => (
                  <div 
                    key={lembrete.id} 
                    className={`p-3 rounded-lg border ${lembrete.active 
                      ? 'border-sono-primary bg-sono-primary/5' 
                      : 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700/30'}`}
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className={`font-medium ${lembrete.active 
                          ? 'text-gray-800 dark:text-white' 
                          : 'text-gray-500 dark:text-gray-400'}`}
                        >
                          {lembrete.time}
                        </p>
                        <p className={`text-sm ${lembrete.active 
                          ? 'text-gray-600 dark:text-gray-300' 
                          : 'text-gray-500 dark:text-gray-400'}`}
                        >
                          {formatarDiasSemana(lembrete.days_of_week)}
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleAtivo(lembrete.id, lembrete.active)}
                          className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sono-primary dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                          aria-label={lembrete.active ? 'Desativar lembrete' : 'Ativar lembrete'}
                        >
                          {lembrete.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        
                        <button
                          onClick={() => iniciarEdicao(lembrete)}
                          className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sono-primary dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                          aria-label="Editar lembrete"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => handleRemoverLembrete(lembrete.id)}
                          className="p-1.5 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 dark:hover:bg-red-900/20"
                          aria-label="Remover lembrete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                Nenhum lembrete de hora de dormir configurado
              </div>
            )}
          </div>
          
          {/* Lembretes de Acordar */}
          <div>
            <h3 className="font-medium text-gray-800 dark:text-white mb-3 flex items-center">
              <Sun className="h-4 w-4 mr-2" />
              Lembretes para Acordar
            </h3>
            
            {lembretesAcordar.length > 0 ? (
              <div className="space-y-3">
                {lembretesAcordar.map((lembrete) => (
                  <div 
                    key={lembrete.id} 
                    className={`p-3 rounded-lg border ${lembrete.active 
                      ? 'border-sono-primary bg-sono-primary/5' 
                      : 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700/30'}`}
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className={`font-medium ${lembrete.active 
                          ? 'text-gray-800 dark:text-white' 
                          : 'text-gray-500 dark:text-gray-400'}`}
                        >
                          {lembrete.time}
                        </p>
                        <p className={`text-sm ${lembrete.active 
                          ? 'text-gray-600 dark:text-gray-300' 
                          : 'text-gray-500 dark:text-gray-400'}`}
                        >
                          {formatarDiasSemana(lembrete.days_of_week)}
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleAtivo(lembrete.id, lembrete.active)}
                          className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sono-primary dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                          aria-label={lembrete.active ? 'Desativar lembrete' : 'Ativar lembrete'}
                        >
                          {lembrete.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        
                        <button
                          onClick={() => iniciarEdicao(lembrete)}
                          className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sono-primary dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                          aria-label="Editar lembrete"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => handleRemoverLembrete(lembrete.id)}
                          className="p-1.5 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 dark:hover:bg-red-900/20"
                          aria-label="Remover lembrete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                Nenhum lembrete de hora de acordar configurado
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
