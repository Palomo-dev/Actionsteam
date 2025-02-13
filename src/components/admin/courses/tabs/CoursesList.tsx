import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { handleDeleteCourse } from "../handlers/courseHandlers";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  description: string;
  is_published: boolean;
  created_at: string;
}

interface CoursesListProps {
  courses: Course[];
  isLoading: boolean;
}

export const CoursesList = ({ courses, isLoading }: CoursesListProps) => {
  // Function to safely remove HTML tags and decode entities
  const stripHtml = (html: string) => {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  if (isLoading) {
    return <div className="text-center py-4">Cargando cursos...</div>;
  }

  if (!courses?.length) {
    return (
      <div className="text-center py-4 text-gray-400">
        No hay cursos creados aún
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {courses.map((course) => (
        <div
          key={course.id}
          className="flex items-center justify-between p-4 border border-gray-800 rounded-lg hover:bg-gray-800/50 transition-colors"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{course.title}</h3>
              <Badge variant={course.is_published ? "success" : "secondary"}>
                {course.is_published ? "Publicado" : "Borrador"}
              </Badge>
            </div>
            <p className="text-sm text-gray-400/90 line-clamp-2">
              {stripHtml(course.description)}
            </p>
            <p className="text-xs text-gray-500">
              Creado el {format(new Date(course.created_at), "PPP", { locale: es })}
            </p>
          </div>
          <div className="flex gap-2">
            <Link to={`/admin/cursos/${course.id}/editar`}>
              <Button variant="outline" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleDeleteCourse(course.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};