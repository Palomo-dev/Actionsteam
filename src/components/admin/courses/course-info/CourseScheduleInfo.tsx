import { useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

interface CourseScheduleInfoProps {
  form: any;
  totalDuration?: number;
}

export const CourseScheduleInfo = ({ form, totalDuration = 0 }: CourseScheduleInfoProps) => {
  useEffect(() => {
    if (totalDuration > 0) {
      const durationInHours = Math.ceil(totalDuration / 3600);
      form.setValue("duration", durationInHours);
    }
  }, [totalDuration, form]);

  const handleDurationChange = (value: string) => {
    const hours = parseInt(value);
    if (!isNaN(hours) && hours >= 0) {
      form.setValue("duration", hours);
    }
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duración Total del Curso (horas)</FormLabel>
            <FormControl>
              <div className="flex items-center space-x-2">
                <Input 
                  type="number"
                  min="0"
                  value={field.value || ""}
                  onChange={(e) => handleDurationChange(e.target.value)}
                  placeholder="Ej: 10"
                  className="w-32"
                />
                <span className="text-sm text-muted-foreground">
                  horas
                </span>
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="launchDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Fecha de Lanzamiento</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP", { locale: es })
                    ) : (
                      <span>Selecciona una fecha</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </FormItem>
        )}
      />
    </div>
  );
};