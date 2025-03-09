
"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  selected?: Date // For backward compatibility
  onChange?: (date: Date | undefined) => void // For backward compatibility
}

export function DatePicker({ 
  date, 
  onDateChange,
  selected, // For backward compatibility
  onChange, // For backward compatibility
}: DatePickerProps) {
  // Support both new and old prop patterns
  const selectedDate = date || selected;
  const handleDateChange = onDateChange || onChange;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateChange}
          initialFocus
          className="pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  )
}
