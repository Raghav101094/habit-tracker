'use client'

import { useState, useEffect } from 'react'
import { Habit } from '@/types/database'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { createClient } from '@/lib/supabase-browser'
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import { Flame, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HabitCardProps {
  habit: Habit
  completed: boolean
  loading: boolean
  onToggle: () => void
  onRefresh: () => void
}

export default function HabitCard({ habit, completed, loading, onToggle, onRefresh }: HabitCardProps) {
  const [streak, setStreak] = useState(0)
  const [monthlyCompletion, setMonthlyCompletion] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    calculateStats()
  }, [habit.id, completed])

  const calculateStats = async () => {
    const today = new Date()

    // Calculate current streak
    let currentStreak = 0
    let checkDate = format(today, 'yyyy-MM-dd')

    // Check if today is completed
    const { data: todayLog } = await supabase
      .from('habit_logs')
      .select('completed')
      .eq('habit_id', habit.id)
      .eq('date', checkDate)
      .single()

    // If today is not completed, start from yesterday
    if (!todayLog?.completed) {
      checkDate = format(subDays(today, 1), 'yyyy-MM-dd')
    }

    // Count consecutive days backwards
    for (let i = 0; i < 365; i++) {
      const date = format(subDays(new Date(checkDate), i), 'yyyy-MM-dd')
      const { data: log } = await supabase
        .from('habit_logs')
        .select('completed')
        .eq('habit_id', habit.id)
        .eq('date', date)
        .single()

      if (log?.completed) {
        currentStreak++
      } else {
        break
      }
    }

    setStreak(currentStreak)

    // Calculate monthly completion
    const monthStart = startOfMonth(today)
    const monthEnd = endOfMonth(today)
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

    const { data: monthLogs } = await supabase
      .from('habit_logs')
      .select('date, completed')
      .eq('habit_id', habit.id)
      .gte('date', format(monthStart, 'yyyy-MM-dd'))
      .lte('date', format(monthEnd, 'yyyy-MM-dd'))

    const completedDays = monthLogs?.filter((log) => log.completed).length || 0
    const percentage = Math.round((completedDays / daysInMonth.length) * 100)
    setMonthlyCompletion(percentage)
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this habit?')) {
      await supabase
        .from('habits')
        .delete()
        .eq('id', habit.id)

      onRefresh()
    }
  }

  return (
    <Card
      className="p-6 hover:shadow-lg transition-all duration-200"
      style={{ borderLeft: `4px solid ${habit.color}` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <Checkbox
            checked={completed}
            onCheckedChange={onToggle}
            disabled={loading}
            className="w-6 h-6"
          />

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{habit.icon}</span>
              <h3 className="text-lg font-semibold">{habit.name}</h3>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="font-medium">{streak}</span>
                <span>day streak</span>
              </div>

              <div>
                <span className="font-medium">{monthlyCompletion}%</span>
                <span> this month</span>
              </div>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          className="text-muted-foreground hover:text-red-500"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  )
}
