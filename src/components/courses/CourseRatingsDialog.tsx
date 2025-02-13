import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface CourseRatingsDialogProps {
  courseId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CourseRatingsDialog = ({ courseId, open, onOpenChange }: CourseRatingsDialogProps) => {
  const [pageSize, setPageSize] = useState("10");
  const [page, setPage] = useState(0);
  const [filterRating, setFilterRating] = useState<string | null>(null);

  const { data: ratingsData } = useQuery({
    queryKey: ["course-ratings", courseId, page, pageSize, filterRating],
    queryFn: async () => {
      // Only proceed if we have a valid courseId
      if (!courseId) {
        return {
          ratings: [],
          total: 0
        };
      }

      let query = supabase
        .from("course_ratings")
        .select(`
          *,
          user:profiles(first_name)
        `, { count: 'exact' })
        .eq("course_id", courseId)
        .order("created_at", { ascending: false });

      if (filterRating) {
        query = query.eq("rating", parseInt(filterRating));
      }

      const from = page * parseInt(pageSize);
      const to = from + parseInt(pageSize) - 1;

      const { data, count, error } = await query
        .range(from, to);

      if (error) {
        console.error("Error fetching ratings:", error);
        return {
          ratings: [],
          total: 0
        };
      }

      return {
        ratings: data || [],
        total: count || 0
      };
    },
    enabled: !!courseId && open, // Only run query if courseId exists and dialog is open
  });

  const totalPages = Math.ceil((ratingsData?.total || 0) / parseInt(pageSize));

  if (!courseId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Opiniones del Curso</DialogTitle>
        </DialogHeader>

        <div className="flex justify-between items-center mb-4">
          <Select value={filterRating || ""} onValueChange={(value) => {
            setFilterRating(value || null);
            setPage(0);
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por estrellas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas las calificaciones</SelectItem>
              {[5, 4, 3, 2, 1].map((rating) => (
                <SelectItem key={rating} value={rating.toString()}>
                  {rating} estrellas
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={pageSize} onValueChange={(value) => {
            setPageSize(value);
            setPage(0);
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Opiniones por página" />
            </SelectTrigger>
            <SelectContent>
              {["5", "10", "20", "30"].map((size) => (
                <SelectItem key={size} value={size}>
                  {size} por página
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Calificación</TableHead>
              <TableHead>Comentario</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ratingsData?.ratings.map((rating) => (
              <TableRow key={rating.id}>
                <TableCell>{rating.user?.first_name || "Usuario"}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {Array.from({ length: rating.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </TableCell>
                <TableCell>{rating.comment}</TableCell>
                <TableCell>
                  {format(new Date(rating.created_at), "PP", { locale: es })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            {ratingsData?.total} opiniones en total
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Página {page + 1} de {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};