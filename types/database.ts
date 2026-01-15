export interface Habit {
  id: string
  user_id: string
  name: string
  icon: string
  color: string
  archived: boolean
  start_date: string // Date when user started tracking this habit (YYYY-MM-DD)
  created_at: string
  updated_at: string
}

export interface HabitLog {
  id: string
  habit_id: string
  user_id: string
  date: string
  completed: boolean
  notes?: string
  created_at: string
}

export interface HabitWithStats extends Habit {
  currentStreak: number
  longestStreak: number
  monthlyCompletion: number
  todayCompleted: boolean
}
