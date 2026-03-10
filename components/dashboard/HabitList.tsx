'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { Habit } from '@/types/database'
import HabitCard from './HabitCard'

interface LogState {
  completed: boolean
  count: number | null
  duration: number | null
}

interface HabitListProps {
  habits: Habit[]
  userId: string
  selectedDate: string
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

export default function HabitList({ habits, userId, selectedDate, onRefresh, onUpdate }: HabitListProps) {
  const [logs, setLogs] = useState<Record<string, LogState>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const supabase = createClient()

  useEffect(() => {
    fetchLogs()
  }, [habits, selectedDate])

  const fetchLogs = async () => {
    const { data } = await supabase
      .from('habit_logs')
      .select('habit_id, completed, count, duration')
      .eq('user_id', userId)
      .eq('date', selectedDate)

    if (data) {
      const logsMap: Record<string, LogState> = {}
      data.forEach((log) => {
        logsMap[log.habit_id] = {
          completed: log.completed,
          count: log.count ?? null,
          duration: log.duration ?? null,
        }
      })
      setLogs(logsMap)
    }
  }

  const upsertLog = async (
    habitId: string,
    fields: Partial<{ completed: boolean; count: number | null; duration: number | null }>
  ) => {
    const { data: existing } = await supabase
      .from('habit_logs')
      .select('id')
      .eq('habit_id', habitId)
      .eq('date', selectedDate)
      .single()

    if (existing) {
      await supabase.from('habit_logs').update(fields).eq('id', existing.id)
    } else {
      await supabase.from('habit_logs').insert([{
        habit_id: habitId,
        user_id: userId,
        date: selectedDate,
        completed: false,
        ...fields,
      }])
    }
  }

  // For boolean habits (neither count nor duration enabled)
  const toggleHabit = async (habitId: string) => {
    setLoading((prev) => ({ ...prev, [habitId]: true }))

    const currentStatus = logs[habitId]?.completed || false
    const newStatus = !currentStatus

    await upsertLog(habitId, { completed: newStatus })
    setLogs((prev) => ({ ...prev, [habitId]: { ...prev[habitId], completed: newStatus, count: null, duration: null } }))
    setLoading((prev) => ({ ...prev, [habitId]: false }))
  }

  // For count habits: increment count by 1
  const incrementCount = async (habitId: string, habit: Habit) => {
    setLoading((prev) => ({ ...prev, [habitId]: true }))

    const currentCount = logs[habitId]?.count ?? 0
    const max = habit.count_max ?? 5
    if (currentCount >= max) {
      setLoading((prev) => ({ ...prev, [habitId]: false }))
      return
    }

    const newCount = currentCount + 1
    const currentDuration = logs[habitId]?.duration ?? 0
    const newCompleted = newCount >= 1 || currentDuration > 0

    await upsertLog(habitId, { completed: newCompleted, count: newCount })
    setLogs((prev) => ({ ...prev, [habitId]: { ...prev[habitId], completed: newCompleted, count: newCount } }))
    setLoading((prev) => ({ ...prev, [habitId]: false }))
  }

  // For count habits: decrement count by 1
  const decrementCount = async (habitId: string) => {
    setLoading((prev) => ({ ...prev, [habitId]: true }))

    const currentCount = logs[habitId]?.count ?? 0
    if (currentCount <= 0) {
      setLoading((prev) => ({ ...prev, [habitId]: false }))
      return
    }

    const newCount = currentCount - 1
    const currentDuration = logs[habitId]?.duration ?? 0
    const newCompleted = newCount >= 1 || currentDuration > 0

    await upsertLog(habitId, { completed: newCompleted, count: newCount === 0 ? null : newCount })
    setLogs((prev) => ({ ...prev, [habitId]: { ...prev[habitId], completed: newCompleted, count: newCount } }))
    setLoading((prev) => ({ ...prev, [habitId]: false }))
  }

  // For duration habits: log minutes spent
  const logDuration = async (habitId: string, minutes: number) => {
    setLoading((prev) => ({ ...prev, [habitId]: true }))

    const currentCount = logs[habitId]?.count ?? 0
    const newCompleted = minutes > 0 || currentCount >= 1

    await upsertLog(habitId, { completed: newCompleted, duration: minutes === 0 ? null : minutes })
    setLogs((prev) => ({ ...prev, [habitId]: { ...prev[habitId], completed: newCompleted, duration: minutes === 0 ? null : minutes } }))
    setLoading((prev) => ({ ...prev, [habitId]: false }))
  }

  return (
    <div className="space-y-4">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          completed={logs[habit.id]?.completed || false}
          count={logs[habit.id]?.count ?? null}
          duration={logs[habit.id]?.duration ?? null}
          loading={loading[habit.id] || false}
          onToggle={() => toggleHabit(habit.id)}
          onIncrement={() => incrementCount(habit.id, habit)}
          onDecrement={() => decrementCount(habit.id)}
          onLogDuration={(minutes) => logDuration(habit.id, minutes)}
          onRefresh={onRefresh}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  )
}
