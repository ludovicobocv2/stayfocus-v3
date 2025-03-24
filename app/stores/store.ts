import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PriorityItem, MedicationItem, MoodRecordItem, SleepRecordItem } from '../types/supabase'

interface AppState {
  prioridades: PriorityItem[]
  medicamentos: MedicationItem[]
  registrosHumor: MoodRecordItem[]
  registrosSono: SleepRecordItem[]
  setPrioridades: (prioridades: PriorityItem[]) => void
  setMedicamentos: (medicamentos: MedicationItem[]) => void
  setRegistrosHumor: (registros: MoodRecordItem[]) => void
  setRegistrosSono: (registros: SleepRecordItem[]) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      prioridades: [],
      medicamentos: [],
      registrosHumor: [],
      registrosSono: [],
      setPrioridades: (prioridades) => set({ prioridades }),
      setMedicamentos: (medicamentos) => set({ medicamentos }),
      setRegistrosHumor: (registros) => set({ registrosHumor: registros }),
      setRegistrosSono: (registros) => set({ registrosSono: registros })
    }),
    {
      name: 'app-storage'
    }
  )
) 