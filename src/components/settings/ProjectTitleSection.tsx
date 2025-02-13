import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

interface ProjectTitleSectionProps {
  initialTitle: string;
}

export const ProjectTitleSection = ({ initialTitle }: ProjectTitleSectionProps) => {
  const [projectTitle, setProjectTitle] = useState(initialTitle);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectTitle(e.target.value);
  };

  return (
    <div className="space-y-2">
      <Label>Título del Proyecto</Label>
      <div className="flex items-center gap-2">
        {isEditingTitle ? (
          <>
            <Input
              value={projectTitle}
              onChange={handleTitleChange}
              className="max-w-xs"
            />
            <Button onClick={() => {
              setIsEditingTitle(false);
              toast.success("Título actualizado correctamente");
            }}>
              Guardar
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsEditingTitle(false)}
            >
              Cancelar
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-lg">{projectTitle}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditingTitle(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};