import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { handleDeleteCategory } from "../handlers/categoryHandlers";

export const CategoriesTable = ({ categories, isLoading }: { categories: any[], isLoading: boolean }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Fecha de Creación</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              Cargando categorías...
            </TableCell>
          </TableRow>
        ) : categories && categories.length > 0 ? (
          categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell className="max-w-md truncate">
                {category.description}
              </TableCell>
              <TableCell>
                {format(new Date(category.created_at), "PPP", { locale: es })}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              No hay categorías registradas
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
