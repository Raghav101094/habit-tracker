'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subMonths } from 'date-fns'

interface CalendarHeatmapProps {
  habitId: string
  userId: string
  startDate: string // Date when user started tracking this habit (YYYY-MM-DD)
}

export default function CalendarHeatmap({ habitId, userId, startDate }: CalendarHeatmapProps) {
  const [logs, setLogs] = useState<Record<string, boolean>>({})
  const supabase = createClient()

  useEffect(() => {
    fetchLogs()
  }, [habitId])

  const fetchLogs = async () => {
    const today = new Date()
    const threeMonthsAgo = subMonths(today, 3)

    const { data } = await supabase
      .from('habit_logs')
      .select('date, completed')
      .eq('habit_id', habitId)
      .gte('date', format(threeMonthsAgo, 'yyyy-MM-dd'))
      .lte('date', format(today, 'yyyy-MM-dd'))

    if (data) {
      const logsMap: Record<string, boolean> = {}
      data.forEach((log) => {
        logsMap[log.date] = log.completed
      })
      setLogs(logsMap)
    }
  }

  const generateMonths = () => {
    const months = []
    const today = new Date()

    for (let i = 2; i >= 0; i--) {
      const monthDate = subMonths(today, i)
      const start = startOfMonth(monthDate)
      const end = i === 0 ? today : endOfMonth(monthDate)
      const days = eachDayOfInterval({ start, end })

      months.push({
        name: format(monthDate, 'MMMM yyyy'),
        days,
      })
    }

    return months
  }

  const months = generateMonths()

  return (
    <div className="space-y-6">
      {months.map((month) => (
        <div key={month.name}>
          <h4 className="text-sm font-medium mb-3">{month.name}</h4>
          <div className="grid grid-cols-7 gap-2">
            {month.days.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd')
              const isCompleted = logs[dateStr]
              const isFuture = day > new Date()
              const isBeforeStart = day < new Date(startDate)

              return (
                <div
                  key={dateStr}
                  className={`aspect-square rounded-sm transition-all ${
                    isBeforeStart
                      ? 'bg-gray-200 dark:bg-gray-700'
                      : isFuture
                      ? 'bg-gray-100 dark:bg-gray-800'
                      : isCompleted
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-red-200 dark:bg-red-900/30 hover:bg-red-300'
                  }`}
                  title={`${format(day, 'MMM d')} - ${
                    isBeforeStart
                      ? 'Before start date'
                      : isFuture
                      ? 'Future'
                      : isCompleted
                      ? 'Completed'
                      : 'Missed'
                  }`}
                />
              )
            })}
          </div>
        </div>
      ))}
      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-sm" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-200 dark:bg-red-900/30 rounded-sm" />
          <span>Missed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-sm" />
          <span>Before start date</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 dark:bg-gray-800 rounded-sm" />
          <span>Future</span>
        </div>
      </div>
    </div>
  )
}
