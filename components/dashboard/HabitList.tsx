'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { Habit, HabitLog } from '@/types/database'
import HabitCard from './HabitCard'

interface HabitListProps {
  habits: Habit[]
  userId: string
  selectedDate: string
  onRefresh: () => void
}

export default function HabitList({ habits, userId, selectedDate, onRefresh }: HabitListProps) {
  const [logs, setLogs] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const supabase = createClient()

  useEffect(() => {
    fetchLogs()
  }, [habits, selectedDate])

  const fetchLogs = async () => {
    const { data } = await supabase
      .from('habit_logs')
      .select('habit_id, completed')
      .eq('user_id', userId)
      .eq('date', selectedDate)

    if (data) {
      const logsMap: Record<string, boolean> = {}
      data.forEach((log) => {
        logsMap[log.habit_id] = log.completed
      })
      setLogs(logsMap)
    }
  }

  const toggleHabit = async (habitId: string) => {
    setLoading((prev) => ({ ...prev, [habitId]: true }))

    const currentStatus = logs[habitId] || false
    const newStatus = !currentStatus

    // Check if log exists
    const { data: existingLog } = await supabase
      .from('habit_logs')
      .select('id')
      .eq('habit_id', habitId)
      .eq('date', selectedDate)
      .single()

    if (existingLog) {
      // Update existing log
      await supabase
        .from('habit_logs')
        .update({ completed: newStatus })
        .eq('id', existingLog.id)
    } else {
      // Create new log
      await supabase
        .from('habit_logs')
        .insert([
          {
            habit_id: habitId,
            user_id: userId,
            date: selectedDate,
            completed: newStatus,
          },
        ])
    }

    setLogs((prev) => ({ ...prev, [habitId]: newStatus }))
    setLoading((prev) => ({ ...prev, [habitId]: false }))
  }

  return (
    <div className="space-y-4">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          completed={logs[habit.id] || false}
          loading={loading[habit.id] || false}
          onToggle={() => toggleHabit(habit.id)}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  )
}
