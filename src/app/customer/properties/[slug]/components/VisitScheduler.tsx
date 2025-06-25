import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CalendarIcon, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/hooks/useToast';
import { checkExistingVisit, scheduleVisit } from '@/services/visit-service'
import { useSession } from 'next-auth/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';

interface VisitSchedulerProps {
  slug: string;
  propertyId: number;
}

const VisitScheduler = ({ slug, propertyId }: VisitSchedulerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date>(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [existingVisitDate, setExistingVisitDate] = useState<Date>();
  const [existingVisitTime, setExistingVisitTime] = useState<string>("");

  const { toast } = useToast();
  const { data: session } = useSession();

  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
  ]

  const { data: visits } = useQuery({
    queryKey: ['visits', propertyId],
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    queryFn: () => checkExistingVisit(propertyId, session?.user?.id!),
  });

  const parseExistingVisitDate = (visitDateString: string) => {
    const visitDate = new Date(visitDateString);
    
    // Extraer la fecha
    setExistingVisitDate(visitDate);
    
    // Extraer la hora en formato HH:MM
    const hours = visitDate.getHours().toString().padStart(2, '0');
    const minutes = visitDate.getMinutes().toString().padStart(2, '0');
    setExistingVisitTime(`${hours}:${minutes}`);
  };

  useEffect(() => {
    if (visits?.hasExistingVisit && visits?.visitDate) {
      parseExistingVisitDate(visits.visitDate);
    }
  }, [visits]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Por favor selecciona una fecha para la visita",
        variant: "destructive",
      });
      return;
    }

    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "Por favor, inicie sesión para programar una visita.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const combinedDateTime = getCombinedDateTimeLocal(selectedDate, selectedTime)
      await scheduleVisit(slug, combinedDateTime, session.user.id);
      
      setIsScheduled(true);
      setScheduledDate(selectedDate);
      setIsOpen(false);
      setSelectedDate(undefined);
      setSelectedTime("");
      
      toast({
        title: "¡Visita programada!",
        description: `Tu visita ha sido programada para el ${format(selectedDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })}`,
      });
      
    } catch (error) {
      console.error('Error scheduling visit:', error);
      toast({
        title: "Error",
        description: "Error al programar la visita. Por favor intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCombinedDateTimeLocal = (date: Date, time: string): string => {
    const [hours, minutes] = time.split(":").map(Number);
    
    // Crear fecha en zona horaria local sin conversión a UTC
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    // Formato requerido por la API: YYYY-MM-DDTHH:MM (sin segundos)
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${year}-${pad(month + 1)}-${pad(day)}T${pad(hours)}:${pad(minutes)}`;
  };

  if (visits?.hasExistingVisit) {
    return (
      <div className="space-y-4">
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-orange-600" />
              <div className="flex-1">
                <p className="font-medium text-orange-900">Visita Programada</p>
                <p className="text-sm text-orange-700">
                  {existingVisitDate && format(existingVisitDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es })}
                  {existingVisitTime && <> a las {existingVisitTime}</>}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Button 
          disabled 
          className="w-full bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
        >
          Visita coordinada
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
          <CalendarIcon className="h-4 w-4 mr-2" />
          Coordinar visita
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Programar visita</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Fecha de visita
            </label>
            <div className="border rounded-lg p-1">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                initialFocus
                className="pointer-events-auto w-full"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Hora de visita</label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <SelectValue placeholder="Selecciona una hora" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!selectedDate || isLoading}
              className="flex-1 bg-blue-500 hover:bg-blue-600"
            >
              {isLoading ? 'Programando...' : 'Programar visita'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VisitScheduler;