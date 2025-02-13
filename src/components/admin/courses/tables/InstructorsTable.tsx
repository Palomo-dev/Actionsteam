import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { handleDeleteInstructor } from "../handlers/instructorHandlers";

export const InstructorsTable = ({ instructors, isLoading }: { instructors: any[], isLoading: boolean }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Biografía</TableHead>
          <TableHead>Fecha de Creación</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              Cargando instructores...
            </TableCell>
          </TableRow>
        ) : instructors && instructors.length > 0 ? (
          instructors.map((instructor) => (
            <TableRow key={instructor.id}>
              <TableCell>{instructor.name}</TableCell>
              <TableCell className="max-w-md truncate">
                {instructor.bio}
              </TableCell>
              <TableCell>
                {format(new Date(instructor.created_at), "PPP", { locale: es })}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDeleteInstructor(instructor.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              No hay instructores registrados
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
