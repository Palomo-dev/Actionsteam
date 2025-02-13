import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { CourseFormData } from "@/types/courses";

interface CoursePriceInfoProps {
  form: UseFormReturn<CourseFormData>;
}

export const CoursePriceInfo = ({ form }: CoursePriceInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="price_cop"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Precio (COP)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Precio en pesos colombianos"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormDescription>
              Este precio se usará para crear el producto en Stripe
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="original_price_cop"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Precio Original (COP)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Precio original en pesos colombianos"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormDescription>
              Precio antes del descuento (opcional)
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="discount_percentage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Porcentaje de Descuento</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Porcentaje de descuento"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormDescription>
              Descuento aplicado al precio original (opcional)
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
};