'use client'

import { useState, useEffect } from 'react'
import { Habit } from '@/types/database'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase-browser'
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import { Flame, Trash2, Minus, Plus, Check, Timer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDuration } from '@/lib/utils'
import EditHabitDialog from './EditHabitDialog'

interface HabitCardProps {
  habit: Habit
  completed: boolean
  count: number | null
  duration: number | null
  loading: boolean
  onToggle: () => void
  onIncrement: () => void
  onDecrement: () => void
  onLogDuration: (minutes: number) => void
  onRefresh: () => void
  onUpdate: (
    id: string,
    name: string,
    icon: string,
    color: string,
    startDate: string,
    countEnabled: boolean,
    countMax: number | null,
    durationEnabled: boolean
  ) => Promise<void>
}

export default function HabitCard({
  habit, completed, count, duration, loading,
  onToggle, onIncrement, onDecrement, onLogDuration,
  onRefresh, onUpdate,
}: HabitCardProps) {
  const [streak, setStreak] = useState(0)
  const [monthlyCompletion, setMonthlyCompletion] = useState(0)
  const [draftMinutes, setDraftMinutes] = useState<string>(duration != null ? String(duration) : '')
  const [editingDuration, setEditingDuration] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    calculateStats()
  }, [habit.id, completed])

  // Sync draft when duration prop changes externally
  useEffect(() => {
    if (!editingDuration) {
      setDraftMinutes(duration != null ? String(duration) : '')
    }
  }, [duration, editingDuration])

  const calculateStats = async () => {
    const today = new Date()

    // Calculate current streak
    let currentStreak = 0
    let checkDate = format(today, 'yyyy-MM-dd')

    const { data: todayLog } = await supabase
      .from('habit_logs')
      .select('completed')
      .eq('habit_id', habit.id)
      .eq('date', checkDate)
      .single()

    if (!todayLog?.completed) {
      checkDate = format(subDays(today, 1), 'yyyy-MM-dd')
    }

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
      await supabase.from('habits').delete().eq('id', habit.id)
      onRefresh()
    }
  }

  const handleDurationConfirm = () => {
    const minutes = parseInt(draftMinutes, 10)
    onLogDuration(isNaN(minutes) || minutes < 0 ? 0 : minutes)
    setEditingDuration(false)
  }

  const currentCount = count ?? 0
  const maxCount = habit.count_max ?? 5

  return (
    <Card
      className="p-6 hover:shadow-lg transition-all duration-200"
      style={{ borderLeft: `4px solid ${habit.color}` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          {/* Left control: checkbox (boolean) or count +/- */}
          {!habit.count_enabled ? (
            <Checkbox
              checked={completed}
              onCheckedChange={onToggle}
              disabled={loading}
              className="w-6 h-6 mt-1 flex-shrink-0"
            />
          ) : (
            <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
              <Button
                variant="outline"
                size="icon"
                className="w-7 h-7"
                onClick={onDecrement}
                disabled={loading || currentCount === 0}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="w-7 h-7"
                onClick={onIncrement}
                disabled={loading || currentCount >= maxCount}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{habit.icon}</span>
              <h3 className="text-lg font-semibold truncate">{habit.name}</h3>
            </div>

            <div className="text-xs text-muted-foreground mb-2 ml-9">
              Since {format(new Date(habit.start_date + 'T00:00:00'), 'MMM d, yyyy')}
            </div>

            {/* Count indicator dots */}
            {habit.count_enabled && (
              <div className="flex items-center gap-2 mb-2 ml-9">
                <div className="flex gap-1">
                  {Array.from({ length: maxCount }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-3.5 h-3.5 rounded-full transition-colors ${
                        i < currentCount ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {currentCount}/{maxCount}
                </span>
              </div>
            )}

            {/* Duration input row */}
            {habit.duration_enabled && (
              <div className="flex items-center gap-2 mb-2 ml-9">
                <Timer className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                {editingDuration ? (
                  <>
                    <Input
                      type="number"
                      min="0"
                      max="999"
                      value={draftMinutes}
                      onChange={(e) => setDraftMinutes(e.target.value)}
                      className="w-20 h-7 text-center text-sm px-2"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleDurationConfirm()
                        if (e.key === 'Escape') setEditingDuration(false)
                      }}
                    />
                    <span className="text-xs text-muted-foreground">min</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-7 h-7"
                      onClick={handleDurationConfirm}
                      disabled={loading}
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                  </>
                ) : (
                  <button
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setEditingDuration(true)}
                  >
                    {duration != null && duration > 0
                      ? formatDuration(duration)
                      : <span className="italic">Add time</span>}
                  </button>
                )}
              </div>
            )}

            <div className="flex items-center gap-6 text-sm text-muted-foreground ml-9">
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

        <div className="flex items-center gap-1 flex-shrink-0">
          <EditHabitDialog habit={habit} onUpdate={onUpdate} />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="text-muted-foreground hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
