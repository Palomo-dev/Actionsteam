import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface CourseEvaluationProps {
  index: number;
  evaluation: {
    question: string;
    options: string[];
    correctOption: number;
  };
  updateEvaluation: (index: number, field: string, value: any) => void;
  onRemove: (index: number) => void;
}

export const CourseEvaluation = ({
  index,
  evaluation,
  updateEvaluation,
  onRemove,
}: CourseEvaluationProps) => {
  const [newOption, setNewOption] = useState("");
  const [localOptions, setLocalOptions] = useState<string[]>([]);

  // Initialize local state with evaluation options
  useEffect(() => {
    if (Array.isArray(evaluation.options)) {
      setLocalOptions(evaluation.options);
    } else {
      setLocalOptions([]);
    }
  }, [evaluation.options]);

  const handleAddOption = () => {
    if (newOption.trim()) {
      const updatedOptions = [...localOptions, newOption.trim()];
      setLocalOptions(updatedOptions);
      updateEvaluation(index, "options", updatedOptions);
      setNewOption("");
      
      // If this is the first option, set it as correct by default
      if (localOptions.length === 0) {
        updateEvaluation(index, "correctOption", 0);
      }
      
      toast.success("Opción agregada correctamente");
    }
  };

  const handleRemoveOption = (optionIndex: number) => {
    const updatedOptions = localOptions.filter((_, i) => i !== optionIndex);
    setLocalOptions(updatedOptions);
    updateEvaluation(index, "options", updatedOptions);
    
    // Update correctOption if necessary
    if (evaluation.correctOption === optionIndex) {
      updateEvaluation(index, "correctOption", 0);
    } else if (evaluation.correctOption > optionIndex) {
      updateEvaluation(index, "correctOption", evaluation.correctOption - 1);
    }
    
    toast.success("Opción eliminada correctamente");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddOption();
    }
  };

  const handleQuestionChange = (value: string) => {
    updateEvaluation(index, "question", value);
  };

  const handleOptionChange = (optionIndex: number, value: string) => {
    const updatedOptions = localOptions.map((opt, i) => 
      i === optionIndex ? value : opt
    );
    setLocalOptions(updatedOptions);
    updateEvaluation(index, "options", updatedOptions);
  };

  const handleSetCorrectOption = (optionIndex: number) => {
    updateEvaluation(index, "correctOption", optionIndex);
    toast.success("Respuesta correcta actualizada");
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Pregunta {index + 1}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-600"
          onClick={() => onRemove(index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Escribe la pregunta..."
            value={evaluation.question || ""}
            onChange={(e) => handleQuestionChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-400">Opciones:</p>
          {localOptions.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center gap-2">
              <Input
                value={option}
                onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                placeholder={`Opción ${optionIndex + 1}`}
              />
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-600"
                onClick={() => handleRemoveOption(optionIndex)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant={evaluation.correctOption === optionIndex ? "default" : "outline"}
                onClick={() => handleSetCorrectOption(optionIndex)}
              >
                Correcta
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input
              placeholder="Nueva opción..."
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button onClick={handleAddOption} type="button">
              <Plus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};