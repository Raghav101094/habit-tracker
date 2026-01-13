'use client'

import { format } from 'date-fns'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface DateSelectorProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export default function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() - 1)
    onDateChange(newDate)
  }

  const goToNextDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + 1)
    onDateChange(newDate)
  }

  const goToToday = () => {
    onDateChange(new Date())
  }

  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  const isFuture = selectedDate > new Date()

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 border rounded-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPreviousDay}
          className="h-9 w-9"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="h-9 px-3 font-normal min-w-[200px] justify-start"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && onDateChange(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextDay}
          className="h-9 w-9"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {!isToday && (
        <Button
          variant="outline"
          size="sm"
          onClick={goToToday}
          className="h-9"
        >
          Today
        </Button>
      )}

      {isFuture && (
        <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
          ⚠️ Future date
        </span>
      )}
    </div>
  )
}
