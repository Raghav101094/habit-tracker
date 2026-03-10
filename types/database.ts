export interface Habit {
  id: string
  user_id: string
  name: string
  icon: string
  color: string
  archived: boolean
  start_date: string // YYYY-MM-DD
  created_at: string
  updated_at: string
  // Opt-in tracking features
  count_enabled: boolean
  count_max: number | null   // 1–5, null when count_enabled is false
  duration_enabled: boolean
}

export interface HabitLog {
  id: string
  habit_id: string
  user_id: string
  date: string // YYYY-MM-DD
  completed: boolean
  notes?: string
  created_at: string
  // Opt-in feature data
  count: number | null      // null when count not enabled
  duration: number | null   // minutes, null when duration not enabled
}

export interface HabitWithStats extends Habit {
  currentStreak: number
  longestStreak: number
  monthlyCompletion: number
  todayCompleted: boolean
}
