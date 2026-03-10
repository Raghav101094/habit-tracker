'use client'

import { useState } from 'react'
import { Pencil, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import type { Habit } from '@/types/database'

interface EditHabitDialogProps {
  habit: Habit
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

const EMOJI_OPTIONS = ['🧘', '💪', '📚', '📰', '🚭', '💧', '🏃', '✍️', '🎯', '🌱', '😴', '🍎']
const COLOR_OPTIONS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // green
  '#ef4444', // red
  '#06b6d4', // cyan
  '#f97316', // orange
]

export default function EditHabitDialog({ habit, onUpdate }: EditHabitDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(habit.name)
  const [selectedIcon, setSelectedIcon] = useState(habit.icon)
  const [selectedColor, setSelectedColor] = useState(habit.color)
  const [startDate, setStartDate] = useState<Date>(new Date(habit.start_date + 'T00:00:00'))
  const [loading, setLoading] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [countEnabled, setCountEnabled] = useState(habit.count_enabled)
  const [countMax, setCountMax] = useState<number>(habit.count_max ?? 3)
  const [durationEnabled, setDurationEnabled] = useState(habit.duration_enabled)

  const originalStartDate = habit.start_date

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    await onUpdate(
      habit.id,
      name,
      selectedIcon,
      selectedColor,
      format(startDate, 'yyyy-MM-dd'),
      countEnabled,
      countEnabled ? countMax : null,
      durationEnabled
    )
    setLoading(false)
    setOpen(false)
  }

  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      setStartDate(date)
      if (format(date, 'yyyy-MM-dd') !== originalStartDate) {
        setShowWarning(true)
      } else {
        setShowWarning(false)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Habit</DialogTitle>
            <DialogDescription>
              Update your habit details. Changes will be reflected immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Habit Name</Label>
              <Input
                id="edit-name"
                placeholder="e.g., Meditation, Workout, Read"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Icon</Label>
              <div className="grid grid-cols-6 gap-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedIcon(emoji)}
                    className={`text-2xl p-2 rounded-md hover:bg-accent transition-colors ${
                      selectedIcon === emoji ? 'bg-accent ring-2 ring-primary' : ''
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Color</Label>
              <div className="grid grid-cols-8 gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-md transition-all ${
                      selectedColor === color ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={handleStartDateChange}
                    initialFocus
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">
                When did you start tracking this habit?
              </p>
            </div>

            {showWarning && (
              <div className="flex items-start gap-2 p-3 rounded-md bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-amber-800 dark:text-amber-200">
                  <strong>Note:</strong> Changing the start date will recalculate all statistics
                  (streaks, percentages, etc.) for this habit.
                </div>
              </div>
            )}

            {/* Tracking section */}
            <div className="grid gap-3 pt-1">
              <Label>Tracking</Label>

              {/* Count tracking toggle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Count tracking</p>
                    <p className="text-xs text-muted-foreground">Log how many times per day</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCountEnabled((v) => !v)}
                    className={cn(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                      countEnabled ? 'bg-primary' : 'bg-muted'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
                        countEnabled ? 'translate-x-6' : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>

                {countEnabled && (
                  <div className="flex items-center gap-2 pl-1">
                    <span className="text-xs text-muted-foreground">Max per day:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setCountMax(n)}
                          className={cn(
                            'w-8 h-8 rounded-md text-sm font-medium transition-colors',
                            countMax === n
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground hover:bg-accent'
                          )}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Duration tracking toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Duration tracking</p>
                  <p className="text-xs text-muted-foreground">Log time spent in minutes</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDurationEnabled((v) => !v)}
                  className={cn(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                    durationEnabled ? 'bg-primary' : 'bg-muted'
                  )}
                >
                  <span
                    className={cn(
                      'inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
                      durationEnabled ? 'translate-x-6' : 'translate-x-1'
                    )}
                  />
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
