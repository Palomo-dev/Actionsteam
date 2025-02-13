import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { InstructorDialog } from "@/components/admin/courses/InstructorDialog";
import { CategoryDialog } from "@/components/admin/courses/CategoryDialog";
import { TagDialog } from "@/components/admin/courses/TagDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InstructorsTable } from "@/components/admin/courses/tables/InstructorsTable";
import { CategoriesTable } from "@/components/admin/courses/tables/CategoriesTable";
import { TagsTable } from "@/components/admin/courses/tables/TagsTable";
import { useState } from "react";
import { CoursesList } from "@/components/admin/courses/tabs/CoursesList";
import { toast } from "sonner";

const Courses = () => {
  const [activeTab, setActiveTab] = useState("courses");

  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("courses")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching courses:", error);
          toast.error("Error al cargar los cursos");
          return [];
        }

        return data || [];
      } catch (error) {
        console.error("Error in courses query:", error);
        toast.error("Error al cargar los cursos");
        return [];
      }
    },
  });

  const { data: instructors, isLoading: isLoadingInstructors } = useQuery({
    queryKey: ["instructors"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("instructors")
          .select("*")
          .order("name");

        if (error) {
          console.error("Error fetching instructors:", error);
          toast.error("Error al cargar los instructores");
          return [];
        }

        return data || [];
      } catch (error) {
        console.error("Error in instructors query:", error);
        toast.error("Error al cargar los instructores");
        return [];
      }
    },
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["course-categories"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("course_categories")
          .select("*")
          .order("name");

        if (error) {
          console.error("Error fetching categories:", error);
          toast.error("Error al cargar las categorías");
          return [];
        }

        return data || [];
      } catch (error) {
        console.error("Error in categories query:", error);
        toast.error("Error al cargar las categorías");
        return [];
      }
    },
  });

  const { data: tags, isLoading: isLoadingTags } = useQuery({
    queryKey: ["course-tags"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("course_tags")
          .select("*")
          .order("name");

        if (error) {
          console.error("Error fetching tags:", error);
          toast.error("Error al cargar las etiquetas");
          return [];
        }

        return data || [];
      } catch (error) {
        console.error("Error in tags query:", error);
        toast.error("Error al cargar las etiquetas");
        return [];
      }
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Cursos</h1>
        <div className="flex gap-2">
          {activeTab === "courses" && (
            <Link to="/admin/cursos/crear">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Curso
              </Button>
            </Link>
          )}
          {activeTab === "instructors" && <InstructorDialog />}
          {activeTab === "categories" && <CategoryDialog />}
          {activeTab === "tags" && <TagDialog />}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="courses">Cursos</TabsTrigger>
          <TabsTrigger value="instructors">Instructores</TabsTrigger>
          <TabsTrigger value="categories">Categorías</TabsTrigger>
          <TabsTrigger value="tags">Etiquetas</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Cursos</CardTitle>
            </CardHeader>
            <CardContent>
              <CoursesList courses={courses || []} isLoading={isLoadingCourses} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instructors">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Instructores</CardTitle>
            </CardHeader>
            <CardContent>
              <InstructorsTable
                instructors={instructors || []}
                isLoading={isLoadingInstructors}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Categorías</CardTitle>
            </CardHeader>
            <CardContent>
              <CategoriesTable
                categories={categories || []}
                isLoading={isLoadingCategories}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tags">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Etiquetas</CardTitle>
            </CardHeader>
            <CardContent>
              <TagsTable tags={tags || []} isLoading={isLoadingTags} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Courses;