'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase-browser'
import { Habit } from '@/types/database'
import Header from './Header'
import HabitList from './HabitList'
import AddHabitDialog from './AddHabitDialog'
import DateSelector from './DateSelector'
import CalendarHeatmap from '../stats/CalendarHeatmap'
import HabitSummaryTable from '../stats/HabitSummaryTable'
import { format } from 'date-fns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Calendar as CalendarIcon } from 'lucide-react'

interface DashboardClientProps {
  user: User
  initialHabits: Habit[]
}

export default function DashboardClient({ user, initialHabits }: DashboardClientProps) {
  const [habits, setHabits] = useState<Habit[]>(initialHabits)
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const refreshHabits = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .eq('archived', false)
      .order('created_at', { ascending: true })

    if (data) {
      setHabits(data)
    }
    setLoading(false)
  }

  const handleAddHabit = async (name: string, icon: string, color: string) => {
    const { error } = await supabase
      .from('habits')
      .insert([
        {
          user_id: user.id,
          name,
          icon,
          color,
        },
      ])

    if (!error) {
      await refreshHabits()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Header user={user} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Habit Tracker</h1>
              <p className="text-muted-foreground">
                Track your habits and build streaks
              </p>
            </div>
            <AddHabitDialog onAdd={handleAddHabit} />
          </div>
        </div>

        {habits.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-semibold mb-2">No habits yet</h2>
            <p className="text-muted-foreground mb-6">
              Start by adding your first habit to track
            </p>
            <AddHabitDialog onAdd={handleAddHabit} triggerButton />
          </div>
        ) : (
          <Tabs defaultValue="today" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="today" className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Today
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Stats
              </TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="space-y-4">
              <DateSelector
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />
              <HabitList
                habits={habits}
                userId={user.id}
                selectedDate={format(selectedDate, 'yyyy-MM-dd')}
                onRefresh={refreshHabits}
              />
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              {/* Summary Table */}
              <div>
                <h2 className="text-xl font-semibold mb-3">Overview</h2>
                <HabitSummaryTable habits={habits} userId={user.id} />
              </div>

              {/* Detailed Heatmaps */}
              <div>
                <h2 className="text-xl font-semibold mb-3">Detailed Activity</h2>
                <div className="space-y-4">
                  {habits.map((habit) => (
                    <Card key={habit.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <span className="text-2xl">{habit.icon}</span>
                          {habit.name}
                        </CardTitle>
                        <CardDescription>Last 3 months activity</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <CalendarHeatmap habitId={habit.id} userId={user.id} />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}
