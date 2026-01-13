'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { Habit } from '@/types/database'
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import { Check, X } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface HabitSummaryTableProps {
  habits: Habit[]
  userId: string
}

interface HabitStats {
  habitId: string
  last10Days: boolean[]
  monthlyPercentage: number
  longestStreak: number
}

export default function HabitSummaryTable({ habits, userId }: HabitSummaryTableProps) {
  const [stats, setStats] = useState<Record<string, HabitStats>>({})
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchAllStats()
  }, [habits])

  const fetchAllStats = async () => {
    setLoading(true)
    const newStats: Record<string, HabitStats> = {}

    for (const habit of habits) {
      const habitStats = await calculateHabitStats(habit.id)
      newStats[habit.id] = habitStats
    }

    setStats(newStats)
    setLoading(false)
  }

  const calculateHabitStats = async (habitId: string): Promise<HabitStats> => {
    const today = new Date()

    // Get last 10 days
    const last10DaysDates = Array.from({ length: 10 }, (_, i) =>
      format(subDays(today, 9 - i), 'yyyy-MM-dd')
    )

    // Get logs for last 10 days
    const { data: last10Logs } = await supabase
      .from('habit_logs')
      .select('date, completed')
      .eq('habit_id', habitId)
      .in('date', last10DaysDates)

    const last10Map: Record<string, boolean> = {}
    last10Logs?.forEach(log => {
      last10Map[log.date] = log.completed
    })

    const last10Days = last10DaysDates.map(date => last10Map[date] || false)

    // Get monthly stats
    const monthStart = startOfMonth(today)
    const monthEnd = endOfMonth(today)
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

    const { data: monthLogs } = await supabase
      .from('habit_logs')
      .select('date, completed')
      .eq('habit_id', habitId)
      .gte('date', format(monthStart, 'yyyy-MM-dd'))
      .lte('date', format(monthEnd, 'yyyy-MM-dd'))

    const completedDays = monthLogs?.filter(log => log.completed).length || 0
    const monthlyPercentage = Math.round((completedDays / daysInMonth.length) * 100)

    // Calculate longest streak in last month
    const monthDates = daysInMonth.map(d => format(d, 'yyyy-MM-dd'))
    const monthMap: Record<string, boolean> = {}
    monthLogs?.forEach(log => {
      monthMap[log.date] = log.completed
    })

    let longestStreak = 0
    let currentStreak = 0

    for (const date of monthDates) {
      if (monthMap[date]) {
        currentStreak++
        longestStreak = Math.max(longestStreak, currentStreak)
      } else {
        currentStreak = 0
      }
    }

    return {
      habitId,
      last10Days,
      monthlyPercentage,
      longestStreak,
    }
  }

  const getLast10DaysHeaders = () => {
    const today = new Date()
    return Array.from({ length: 10 }, (_, i) => {
      const date = subDays(today, 9 - i)
      return {
        date,
        label: format(date, 'EEE'),
        fullDate: format(date, 'MMM d'),
      }
    })
  }

  const headers = getLast10DaysHeaders()

  if (loading) {
    return (
      <Card className="p-8">
        <div className="text-center text-muted-foreground">Loading statistics...</div>
      </Card>
    )
  }

  if (habits.length === 0) {
    return null
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-semibold min-w-[200px] sticky left-0 bg-muted/50 z-10">
                Habit
              </th>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="text-center p-2 font-medium text-sm"
                  title={header.fullDate}
                >
                  <div>{header.label}</div>
                  <div className="text-xs text-muted-foreground font-normal">
                    {format(header.date, 'd')}
                  </div>
                </th>
              ))}
              <th className="text-center p-4 font-semibold min-w-[120px] bg-blue-50 dark:bg-blue-950/30">
                <div>Monthly</div>
                <div className="text-xs font-normal text-muted-foreground">Completion</div>
              </th>
              <th className="text-center p-4 font-semibold min-w-[120px] bg-purple-50 dark:bg-purple-950/30">
                <div>Longest</div>
                <div className="text-xs font-normal text-muted-foreground">Streak</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {habits.map((habit, habitIndex) => {
              const habitStats = stats[habit.id]
              if (!habitStats) return null

              return (
                <tr
                  key={habit.id}
                  className={`border-t hover:bg-accent/50 transition-colors ${
                    habitIndex % 2 === 0 ? 'bg-muted/10' : ''
                  }`}
                >
                  <td className="p-4 sticky left-0 bg-background z-10">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{habit.icon}</span>
                      <div>
                        <div className="font-medium">{habit.name}</div>
                        <div
                          className="w-12 h-1 rounded-full mt-1"
                          style={{ backgroundColor: habit.color }}
                        />
                      </div>
                    </div>
                  </td>
                  {habitStats.last10Days.map((completed, dayIndex) => (
                    <td key={dayIndex} className="text-center p-2">
                      {completed ? (
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30">
                          <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30">
                          <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                      )}
                    </td>
                  ))}
                  <td className="text-center p-4 font-semibold text-lg bg-blue-50/50 dark:bg-blue-950/20">
                    <div className="flex items-center justify-center gap-1">
                      <span
                        className={
                          habitStats.monthlyPercentage >= 80
                            ? 'text-green-600 dark:text-green-400'
                            : habitStats.monthlyPercentage >= 50
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-red-600 dark:text-red-400'
                        }
                      >
                        {habitStats.monthlyPercentage}%
                      </span>
                    </div>
                  </td>
                  <td className="text-center p-4 font-semibold text-lg bg-purple-50/50 dark:bg-purple-950/20">
                    <div className="flex items-center justify-center gap-1">
                      {habitStats.longestStreak > 0 && (
                        <span className="text-orange-500">🔥</span>
                      )}
                      <span>{habitStats.longestStreak}</span>
                      <span className="text-sm text-muted-foreground font-normal">
                        {habitStats.longestStreak === 1 ? 'day' : 'days'}
                      </span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 p-4 border-t bg-muted/30 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <span className="text-muted-foreground">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <X className="w-4 h-4 text-red-600 dark:text-red-400" />
          </div>
          <span className="text-muted-foreground">Missed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-orange-500">🔥</span>
          <span className="text-muted-foreground">Longest streak this month</span>
        </div>
      </div>
    </Card>
  )
}
