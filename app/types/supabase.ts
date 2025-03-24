export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      priorities: {
        Row: {
          id: string
          user_id: string
          content: string
          completed: boolean
          due_date: string | null
          created_at: string
          category: string | null
          updated_at: string | null
          version: number
          device_id: string | null
          last_synced_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          completed?: boolean
          due_date?: string | null
          created_at?: string
          category?: string | null
          updated_at?: string | null
          version?: number
          device_id?: string | null
          last_synced_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          completed?: boolean
          due_date?: string | null
          created_at?: string
          category?: string | null
          updated_at?: string | null
          version?: number
          device_id?: string | null
          last_synced_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          email: string
          preferences: Json | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          email: string
          preferences?: Json | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          email?: string
          preferences?: Json | null
        }
      }
      sleep_records: {
        Row: {
          id: string
          user_id: string
          start_time: string
          end_time: string | null
          quality: number | null
          notes: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          start_time: string
          end_time?: string | null
          quality?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          start_time?: string
          end_time?: string | null
          quality?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      sleep_reminders: {
        Row: {
          id: string
          user_id: string
          type: string
          time: string
          days_of_week: number[]
          active: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          time: string
          days_of_week: number[]
          active?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          time?: string
          days_of_week?: number[]
          active?: boolean
          created_at?: string
          updated_at?: string | null
        }
      }
      mood_records: {
        Row: {
          id: string
          user_id: string
          record_date: string
          mood_level: number
          factors: string[]
          notes: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          record_date: string
          mood_level: number
          factors?: string[]
          notes?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          record_date?: string
          mood_level?: number
          factors?: string[]
          notes?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      medications: {
        Row: {
          id: string
          user_id: string
          name: string
          dosage: string | null
          frequency: string
          schedule: string[]
          start_date: string | null
          notes: string | null
          last_taken: string | null
          interval_minutes: number | null
          observation: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          dosage?: string | null
          frequency: string
          schedule?: string[]
          start_date?: string | null
          notes?: string | null
          last_taken?: string | null
          interval_minutes?: number | null
          observation?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          dosage?: string | null
          frequency?: string
          schedule?: string[]
          start_date?: string | null
          notes?: string | null
          last_taken?: string | null
          interval_minutes?: number | null
          observation?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      medication_doses: {
        Row: {
          id: string
          medication_id: string
          user_id: string
          taken_at: string
          scheduled_time: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          medication_id: string
          user_id: string
          taken_at: string
          scheduled_time?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          medication_id?: string
          user_id?: string
          taken_at?: string
          scheduled_time?: string | null
          notes?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row'];

export type InsertTables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert'];
  
export type UpdateTables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Update'];

export type Profile = Tables<'profiles'>;
export type Priority = Tables<'priorities'>;
export type SleepRecord = Tables<'sleep_records'>;
export type SleepReminder = Tables<'sleep_reminders'>;
export type MoodRecord = Tables<'mood_records'>;
export type Medication = Tables<'medications'>;
export type MedicationDose = Tables<'medication_doses'>;

export type NewPriority = Omit<InsertTables<'priorities'>, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
export type PriorityUpdate = Partial<Omit<UpdateTables<'priorities'>, 'id' | 'user_id' | 'created_at'>>;

export type NewSleepRecord = Omit<InsertTables<'sleep_records'>, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
export type SleepRecordUpdate = Partial<Omit<UpdateTables<'sleep_records'>, 'id' | 'user_id' | 'created_at'>>;

export type NewSleepReminder = Omit<InsertTables<'sleep_reminders'>, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
export type SleepReminderUpdate = Partial<Omit<UpdateTables<'sleep_reminders'>, 'id' | 'user_id' | 'created_at'>>;

export type NewMoodRecord = Omit<InsertTables<'mood_records'>, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
export type MoodRecordUpdate = Partial<Omit<UpdateTables<'mood_records'>, 'id' | 'user_id' | 'created_at'>>;

export type NewMedication = Omit<InsertTables<'medications'>, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
export type MedicationUpdate = Partial<Omit<UpdateTables<'medications'>, 'id' | 'user_id' | 'created_at'>>;

export type NewMedicationDose = Omit<InsertTables<'medication_doses'>, 'id' | 'user_id' | 'created_at'>;
export type MedicationDoseUpdate = Partial<Omit<UpdateTables<'medication_doses'>, 'id' | 'user_id' | 'created_at'>>;

export interface BaseItem {
  id: string
  created_at: string
  updated_at: string
  user_id: string
  version: number
  is_deleted: boolean
}

export interface PriorityItem extends BaseItem {
  title: string
  description: string
  due_date: string
  status: 'pending' | 'completed'
  priority: 'low' | 'medium' | 'high'
}

export interface MedicationItem extends BaseItem {
  name: string
  dosage: string
  frequency: string
  time: string
  notes: string
  status: 'active' | 'inactive'
}

export interface MoodRecordItem extends BaseItem {
  mood: 'great' | 'good' | 'neutral' | 'bad' | 'terrible'
  notes: string
  date: string
  energy_level: number
  anxiety_level: number
  sleep_quality: number
}

export interface SleepRecordItem extends BaseItem {
  start_time: string
  end_time: string
  duration: number
  quality: number
  notes: string
  date: string
}

// Tipos para migração de dados
export interface MigrationResult {
  success: boolean;
  count: number;
  duplicates?: number;
  error?: string;
} 