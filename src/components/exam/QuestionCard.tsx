import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle } from "lucide-react";

interface QuestionCardProps {
  evaluation: {
    id: string;
    question: string;
    options: string[];
    correct_option: number;
  };
  index: number;
  selectedAnswers: { [key: string]: number };
  handleAnswerSelect: (questionId: string, optionIndex: number) => void;
  showResults: boolean;
}

export const QuestionCard = ({
  evaluation,
  index,
  selectedAnswers,
  handleAnswerSelect,
  showResults,
}: QuestionCardProps) => {
  const isCorrect = selectedAnswers[evaluation.id] === evaluation.correct_option;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          Pregunta {index + 1}: {evaluation.question}
          {showResults && (
            isCorrect ? 
              <CheckCircle2 className="text-green-500 h-5 w-5" /> :
              <XCircle className="text-red-500 h-5 w-5" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedAnswers[evaluation.id]?.toString()}
          onValueChange={(value) => handleAnswerSelect(evaluation.id, parseInt(value))}
        >
          {evaluation.options.map((option: string, optionIndex: number) => {
            const isSelected = selectedAnswers[evaluation.id] === optionIndex;
            const isCorrectOption = evaluation.correct_option === optionIndex;
            let optionClassName = "flex items-center space-x-2 p-2 rounded";
            
            if (showResults) {
              if (isCorrectOption) {
                optionClassName += " bg-green-100 dark:bg-green-900/20";
              } else if (isSelected && !isCorrectOption) {
                optionClassName += " bg-red-100 dark:bg-red-900/20";
              }
            }

            return (
              <div key={optionIndex} className={optionClassName}>
                <RadioGroupItem 
                  value={optionIndex.toString()} 
                  id={`${evaluation.id}-${optionIndex}`}
                  disabled={showResults}
                />
                <Label htmlFor={`${evaluation.id}-${optionIndex}`}>{option}</Label>
              </div>
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};