'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subMonths, startOfWeek } from 'date-fns'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CalendarHeatmapProps {
  habitId: string
  userId: string
  startDate: string // Date when user started tracking this habit (YYYY-MM-DD)
}

export default function CalendarHeatmap({ habitId, startDate }: CalendarHeatmapProps) {
  const [logs, setLogs] = useState<Record<string, boolean>>({})
  const [isExpanded, setIsExpanded] = useState(false)
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

  // Generate all days for the last 3 months in a flat array (for GitHub-style grid)
  const generateAllDays = () => {
    const today = new Date()
    const threeMonthsAgo = subMonths(today, 3)

    // Start from beginning of the week 3 months ago
    const start = startOfWeek(threeMonthsAgo, { weekStartsOn: 0 })
    const end = today

    return eachDayOfInterval({ start, end })
  }

  // Generate months for expanded accordion view
  const generateMonths = () => {
    const months = []
    const today = new Date()

    for (let i = 2; i >= 0; i--) {
      const monthDate = subMonths(today, i)
      const start = startOfMonth(monthDate)
      const end = i === 0 ? today : endOfMonth(monthDate)
      const days = eachDayOfInterval({ start, end })

      // Pad the beginning to align with day of week
      const firstDayOfWeek = start.getDay()
      const paddedDays: (Date | null)[] = Array(firstDayOfWeek).fill(null)
      paddedDays.push(...days)

      months.push({
        name: format(monthDate, 'MMMM yyyy'),
        shortName: format(monthDate, 'MMM'),
        days: paddedDays,
      })
    }

    return months
  }

  const allDays = generateAllDays()
  const months = generateMonths()
  const todayStr = format(new Date(), 'yyyy-MM-dd')

  // Calculate stats
  const validDays = allDays.filter(day => {
    const dateStr = format(day, 'yyyy-MM-dd')
    return dateStr >= startDate && dateStr <= todayStr
  })
  const completedCount = validDays.filter(day => logs[format(day, 'yyyy-MM-dd')]).length
  const completionRate = validDays.length > 0 ? Math.round((completedCount / validDays.length) * 100) : 0

  const getDayStatus = (day: Date | null) => {
    if (!day) return 'empty'
    const dateStr = format(day, 'yyyy-MM-dd')
    const isBeforeStart = dateStr < startDate
    const isFuture = dateStr > todayStr
    const isCompleted = logs[dateStr]

    if (isBeforeStart) return 'before-start'
    if (isFuture) return 'future'
    if (isCompleted) return 'completed'
    return 'missed'
  }

  const getSquareClass = (status: string, size: 'small' | 'medium' = 'small') => {
    const baseClass = size === 'small'
      ? 'w-3 h-3 rounded-sm'
      : 'aspect-square rounded-sm'

    switch (status) {
      case 'completed':
        return cn(baseClass, 'bg-green-500')
      case 'missed':
        return cn(baseClass, 'bg-red-200 dark:bg-red-900/40')
      case 'before-start':
        return cn(baseClass, 'bg-gray-200 dark:bg-gray-700')
      case 'future':
        return cn(baseClass, 'bg-gray-100 dark:bg-gray-800')
      default:
        return cn(baseClass, 'bg-transparent')
    }
  }

  // Group days by week for GitHub-style grid
  const weeks: Date[][] = []
  let currentWeek: Date[] = []

  allDays.forEach((day, index) => {
    currentWeek.push(day)
    if (day.getDay() === 6 || index === allDays.length - 1) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  })

  return (
    <div className="space-y-4">
      {/* Compact GitHub-style Grid (Always visible) */}
      <div className="space-y-2">
        {/* Stats summary */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Last 3 months</span>
          <span className="font-medium">
            {completedCount}/{validDays.length} days ({completionRate}%)
          </span>
        </div>

        {/* GitHub-style contribution graph */}
        <div className="overflow-x-auto pb-2">
          <div className="inline-flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => {
                  const status = getDayStatus(day)
                  return (
                    <div
                      key={dayIndex}
                      className={getSquareClass(status, 'small')}
                      title={`${format(day, 'MMM d, yyyy')} - ${
                        status === 'before-start'
                          ? 'Before start date'
                          : status === 'future'
                          ? 'Future'
                          : status === 'completed'
                          ? 'Completed'
                          : 'Missed'
                      }`}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Compact Legend */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-sm" />
            <span>Before</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-200 dark:bg-red-900/40 rounded-sm" />
            <span>Missed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-sm" />
            <span>Done</span>
          </div>
        </div>
      </div>

      {/* Expand/Collapse Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full justify-center py-2 border-t"
      >
        {isExpanded ? (
          <>
            <ChevronUp className="w-4 h-4" />
            <span>Show less</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            <span>Show calendar view</span>
          </>
        )}
      </button>

      {/* Expanded Calendar View (Accordion) */}
      {isExpanded && (
        <div className="space-y-6 pt-2 animate-in slide-in-from-top-2 duration-200">
          {months.map((month) => (
            <div key={month.name}>
              <h4 className="text-sm font-medium mb-3">{month.name}</h4>

              {/* Day labels */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={i} className="text-xs text-muted-foreground text-center">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {month.days.map((day, index) => {
                  if (!day) {
                    return <div key={`empty-${index}`} className="aspect-square" />
                  }

                  const status = getDayStatus(day)
                  return (
                    <div
                      key={format(day, 'yyyy-MM-dd')}
                      className={cn(
                        getSquareClass(status, 'medium'),
                        'flex items-center justify-center text-xs transition-all hover:ring-2 hover:ring-primary/50'
                      )}
                      title={`${format(day, 'MMM d')} - ${
                        status === 'before-start'
                          ? 'Before start date'
                          : status === 'future'
                          ? 'Future'
                          : status === 'completed'
                          ? 'Completed'
                          : 'Missed'
                      }`}
                    >
                      <span className={cn(
                        'text-[10px]',
                        status === 'completed' ? 'text-white font-medium' : 'text-muted-foreground'
                      )}>
                        {format(day, 'd')}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Full Legend */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap pt-2 border-t">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-sm" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-200 dark:bg-red-900/40 rounded-sm" />
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
      )}
    </div>
  )
}
