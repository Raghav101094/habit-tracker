'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { Habit } from '@/types/database'
import { format, subDays, startOfMonth, eachDayOfInterval, startOfYear } from 'date-fns'
import { Check, X, Minus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarPicker } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { DateRange } from 'react-day-picker'

interface HabitSummaryTableProps {
  habits: Habit[]
  userId: string
}

type DateRangeFilter = '7d' | '14d' | '30d' | 'mtd' | 'custom'

interface FilterOption {
  id: DateRangeFilter
  label: string
  days?: number
}

const FILTER_OPTIONS: FilterOption[] = [
  { id: '7d', label: '7d', days: 7 },
  { id: '14d', label: '14d', days: 14 },
  { id: '30d', label: '30d', days: 30 },
  { id: 'mtd', label: 'MTD' },
  { id: 'custom', label: '📅' },
]

interface HabitStats {
  habitId: string
  recentDays: { date: string; completed: boolean | null }[]
  periodPercentage: number
  ytdPercentage: number
  longestStreak: number
}

export default function HabitSummaryTable({ habits }: HabitSummaryTableProps) {
  const [stats, setStats] = useState<Record<string, HabitStats>>({})
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState<DateRangeFilter>('7d')
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>()
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const supabase = createClient()

  // Calculate date range based on filter
  const getDateRange = (): { start: Date; end: Date; days: number } => {
    const today = new Date()

    if (selectedFilter === 'mtd') {
      const monthStart = startOfMonth(today)
      const days = Math.ceil((today.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
      return { start: monthStart, end: today, days }
    }

    if (selectedFilter === 'custom' && customDateRange?.from) {
      const end = customDateRange.to || customDateRange.from
      const days = Math.ceil((end.getTime() - customDateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1
      return { start: customDateRange.from, end, days }
    }

    // Default to days-based filters (7d, 14d, 30d)
    const filterOption = FILTER_OPTIONS.find(f => f.id === selectedFilter)
    const days = filterOption?.days || 7
    return { start: subDays(today, days - 1), end: today, days }
  }

  useEffect(() => {
    fetchAllStats()
  }, [habits, selectedFilter, customDateRange])

  const fetchAllStats = async () => {
    setLoading(true)
    const newStats: Record<string, HabitStats> = {}

    for (const habit of habits) {
      const habitStats = await calculateHabitStats(habit.id, habit.start_date)
      newStats[habit.id] = habitStats
    }

    setStats(newStats)
    setLoading(false)
  }

  const calculateHabitStats = async (habitId: string, startDate: string): Promise<HabitStats> => {
    const today = new Date()
    const habitStartDate = new Date(startDate)
    const { start, days } = getDateRange()

    // Generate dates for the selected range
    const rangeDates = Array.from({ length: days }, (_, i) => {
      const date = new Date(start)
      date.setDate(date.getDate() + i)
      return format(date, 'yyyy-MM-dd')
    }).filter(dateStr => new Date(dateStr) <= today)

    // Get logs for the range
    const { data: rangeLogs } = await supabase
      .from('habit_logs')
      .select('date, completed')
      .eq('habit_id', habitId)
      .in('date', rangeDates)

    const logsMap: Record<string, boolean> = {}
    rangeLogs?.forEach(log => {
      logsMap[log.date] = log.completed
    })

    // Map to date objects with completion status
    const recentDays = rangeDates.map(date => {
      const dateObj = new Date(date)
      if (dateObj < habitStartDate) {
        return { date, completed: null }
      }
      return { date, completed: logsMap[date] || false }
    })

    // Calculate period percentage (only valid days)
    const validDays = recentDays.filter(d => d.completed !== null)
    const completedDays = validDays.filter(d => d.completed === true).length
    const periodPercentage = validDays.length > 0
      ? Math.round((completedDays / validDays.length) * 100)
      : 0

    // Calculate longest streak in the period
    let longestStreak = 0
    let currentStreak = 0
    for (const day of recentDays) {
      if (day.completed === true) {
        currentStreak++
        longestStreak = Math.max(longestStreak, currentStreak)
      } else if (day.completed === false) {
        currentStreak = 0
      }
    }

    // Calculate YTD percentage
    const yearStart = startOfYear(today)
    const ytdStart = habitStartDate > yearStart ? habitStartDate : yearStart
    const daysInYtd = eachDayOfInterval({ start: ytdStart, end: today })

    const { data: ytdLogs } = await supabase
      .from('habit_logs')
      .select('date, completed')
      .eq('habit_id', habitId)
      .gte('date', format(ytdStart, 'yyyy-MM-dd'))
      .lte('date', format(today, 'yyyy-MM-dd'))

    const ytdCompletedDays = ytdLogs?.filter(log => log.completed).length || 0
    const ytdPercentage = daysInYtd.length > 0
      ? Math.round((ytdCompletedDays / daysInYtd.length) * 100)
      : 0

    return {
      habitId,
      recentDays,
      periodPercentage,
      ytdPercentage,
      longestStreak,
    }
  }

  const getHeadersForRange = () => {
    const { start, days } = getDateRange()
    const today = new Date()

    return Array.from({ length: days }, (_, i) => {
      const date = new Date(start)
      date.setDate(date.getDate() + i)
      if (date > today) return null
      return {
        date,
        label: format(date, 'EEE'),
        day: format(date, 'd'),
        fullDate: format(date, 'MMM d'),
      }
    }).filter(Boolean) as { date: Date; label: string; day: string; fullDate: string }[]
  }

  const headers = getHeadersForRange()

  const handleFilterClick = (filterId: DateRangeFilter) => {
    if (filterId === 'custom') {
      setIsCalendarOpen(true)
    } else {
      setSelectedFilter(filterId)
      setCustomDateRange(undefined)
    }
  }

  const handleCustomDateSelect = (range: DateRange | undefined) => {
    setCustomDateRange(range)
    if (range?.from) {
      setSelectedFilter('custom')
    }
  }

  const getCustomDateLabel = () => {
    if (!customDateRange?.from) return '📅'
    const from = format(customDateRange.from, 'MMM d')
    const to = customDateRange.to ? format(customDateRange.to, 'MMM d') : from
    return customDateRange.to && customDateRange.from !== customDateRange.to
      ? `${from} - ${to}`
      : from
  }

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
      {/* Filter Chips */}
      <div className="p-4 border-b bg-muted/30">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {FILTER_OPTIONS.map((option) => (
            option.id === 'custom' ? (
              <Popover key={option.id} open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <button
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                      'border hover:bg-accent',
                      selectedFilter === 'custom'
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border'
                    )}
                  >
                    {getCustomDateLabel()}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarPicker
                    mode="range"
                    selected={customDateRange}
                    onSelect={handleCustomDateSelect}
                    disabled={(date) => date > new Date()}
                    numberOfMonths={1}
                    autoFocus
                  />
                  <div className="p-3 border-t">
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => setIsCalendarOpen(false)}
                      disabled={!customDateRange?.from}
                    >
                      Apply
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <button
                key={option.id}
                onClick={() => handleFilterClick(option.id)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                  'border hover:bg-accent',
                  selectedFilter === option.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border'
                )}
              >
                {option.label}
              </button>
            )
          ))}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
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
                    {header.day}
                  </div>
                </th>
              ))}
              <th className="text-center p-4 font-semibold min-w-[100px] bg-blue-50 dark:bg-blue-950/30">
                <div>Period</div>
                <div className="text-xs font-normal text-muted-foreground">%</div>
              </th>
              <th className="text-center p-4 font-semibold min-w-[100px] bg-green-50 dark:bg-green-950/30">
                <div>YTD</div>
                <div className="text-xs font-normal text-muted-foreground">%</div>
              </th>
              <th className="text-center p-4 font-semibold min-w-[100px] bg-purple-50 dark:bg-purple-950/30">
                <div>Streak</div>
                <div className="text-xs font-normal text-muted-foreground">Best</div>
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
                  {habitStats.recentDays.map((day, dayIndex) => (
                    <td key={dayIndex} className="text-center p-2">
                      {day.completed === null ? (
                        <div className="inline-flex items-center justify-center w-8 h-8">
                          <Minus className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                        </div>
                      ) : day.completed ? (
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
                    <span
                      className={
                        habitStats.periodPercentage >= 80
                          ? 'text-green-600 dark:text-green-400'
                          : habitStats.periodPercentage >= 50
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-red-600 dark:text-red-400'
                      }
                    >
                      {habitStats.periodPercentage}%
                    </span>
                  </td>
                  <td className="text-center p-4 font-semibold text-lg bg-green-50/50 dark:bg-green-950/20">
                    <span
                      className={
                        habitStats.ytdPercentage >= 80
                          ? 'text-green-600 dark:text-green-400'
                          : habitStats.ytdPercentage >= 50
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-red-600 dark:text-red-400'
                      }
                    >
                      {habitStats.ytdPercentage}%
                    </span>
                  </td>
                  <td className="text-center p-4 font-semibold text-lg bg-purple-50/50 dark:bg-purple-950/20">
                    <div className="flex items-center justify-center gap-1">
                      {habitStats.longestStreak > 0 && (
                        <span className="text-orange-500">🔥</span>
                      )}
                      <span>{habitStats.longestStreak}</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4 p-4">
        {habits.map((habit) => {
          const habitStats = stats[habit.id]
          if (!habitStats) return null

          return (
            <div key={habit.id} className="border rounded-lg p-4 bg-background">
              {/* Habit Header */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{habit.icon}</span>
                <div>
                  <div className="font-medium">{habit.name}</div>
                  <div
                    className="w-12 h-1 rounded-full mt-1"
                    style={{ backgroundColor: habit.color }}
                  />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                  <div className="text-xs text-muted-foreground mb-1">Period</div>
                  <div
                    className={cn(
                      'text-lg font-semibold',
                      habitStats.periodPercentage >= 80
                        ? 'text-green-600 dark:text-green-400'
                        : habitStats.periodPercentage >= 50
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-red-600 dark:text-red-400'
                    )}
                  >
                    {habitStats.periodPercentage}%
                  </div>
                </div>
                <div className="text-center p-2 rounded-lg bg-green-50 dark:bg-green-950/30">
                  <div className="text-xs text-muted-foreground mb-1">YTD</div>
                  <div
                    className={cn(
                      'text-lg font-semibold',
                      habitStats.ytdPercentage >= 80
                        ? 'text-green-600 dark:text-green-400'
                        : habitStats.ytdPercentage >= 50
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-red-600 dark:text-red-400'
                    )}
                  >
                    {habitStats.ytdPercentage}%
                  </div>
                </div>
                <div className="text-center p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30">
                  <div className="text-xs text-muted-foreground mb-1">Streak</div>
                  <div className="text-lg font-semibold flex items-center justify-center gap-1">
                    {habitStats.longestStreak > 0 && <span className="text-orange-500">🔥</span>}
                    {habitStats.longestStreak}
                  </div>
                </div>
              </div>

              {/* Recent Days - Compact Grid */}
              <div className="flex flex-wrap gap-1 justify-center">
                {habitStats.recentDays.map((day, index) => (
                  <div
                    key={index}
                    className={cn(
                      'w-6 h-6 rounded flex items-center justify-center text-xs',
                      day.completed === null
                        ? 'bg-gray-100 dark:bg-gray-800'
                        : day.completed
                        ? 'bg-green-500 text-white'
                        : 'bg-red-200 dark:bg-red-900/50'
                    )}
                    title={`${format(new Date(day.date), 'MMM d')} - ${
                      day.completed === null
                        ? 'Before start'
                        : day.completed
                        ? 'Completed'
                        : 'Missed'
                    }`}
                  >
                    {day.completed === null ? (
                      <Minus className="w-3 h-3 text-gray-400" />
                    ) : day.completed ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <X className="w-3 h-3 text-red-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 p-4 border-t bg-muted/30 text-sm flex-wrap">
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
          <div className="w-6 h-6 flex items-center justify-center">
            <Minus className="w-4 h-4 text-gray-300 dark:text-gray-600" />
          </div>
          <span className="text-muted-foreground">Before start date</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-orange-500">🔥</span>
          <span className="text-muted-foreground">Streak</span>
        </div>
      </div>
    </Card>
  )
}
