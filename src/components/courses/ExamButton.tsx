import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ExamButtonProps {
  courseId: string;
}

export const ExamButton = ({ courseId }: ExamButtonProps) => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate(`/app/cursos/${courseId}/examen`)}
      className="w-full"
    >
      Presentar Examen
    </Button>
  );
};