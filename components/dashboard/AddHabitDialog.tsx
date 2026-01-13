'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
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

interface AddHabitDialogProps {
  onAdd: (name: string, icon: string, color: string) => Promise<void>
  triggerButton?: boolean
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

export default function AddHabitDialog({ onAdd, triggerButton }: AddHabitDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('🎯')
  const [selectedColor, setSelectedColor] = useState('#3b82f6')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    await onAdd(name, selectedIcon, selectedColor)
    setLoading(false)

    // Reset form
    setName('')
    setSelectedIcon('🎯')
    setSelectedColor('#3b82f6')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={triggerButton ? 'default' : 'sm'}>
          <Plus className="w-4 h-4 mr-2" />
          Add Habit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Habit</DialogTitle>
            <DialogDescription>
              Create a new habit to track daily. Choose an icon and color to personalize it.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Habit Name</Label>
              <Input
                id="name"
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
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? 'Adding...' : 'Add Habit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
