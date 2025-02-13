import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { handleDeleteTag } from "../handlers/tagHandlers";

export const TagsTable = ({ tags, isLoading }: { tags: any[], isLoading: boolean }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Fecha de Creación</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center">
              Cargando etiquetas...
            </TableCell>
          </TableRow>
        ) : tags && tags.length > 0 ? (
          tags.map((tag) => (
            <TableRow key={tag.id}>
              <TableCell>{tag.name}</TableCell>
              <TableCell>
                {format(new Date(tag.created_at), "PPP", { locale: es })}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDeleteTag(tag.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="text-center">
              No hay etiquetas registradas
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
