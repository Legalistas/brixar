import { useState } from "react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from "lucide-react"

// Componente DatePicker personalizado
export default function DatePicker({
    date,
    onDateChange,
    placeholder = 'Seleccionar fecha',
    disabled = false,
  }: {
    date: Date | null
    onDateChange: (date: Date | null) => void
    placeholder?: string
    disabled?: boolean
  }) {
    const [open, setOpen] = useState(false)
  
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'h-8 w-full justify-start text-left font-normal text-sm',
              !date && 'text-muted-foreground',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-3 w-3" />
            {date ? format(date, 'dd/MM/yyyy', { locale: es }) : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date || undefined}
            onSelect={(selectedDate) => {
              onDateChange(selectedDate || null)
              setOpen(false)
            }}
            disabled={disabled}
            initialFocus
            locale={es}
          />
        </PopoverContent>
      </Popover>
    )
  }