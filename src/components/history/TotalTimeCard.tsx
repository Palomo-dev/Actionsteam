import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseTimeData } from "@/types/study-history";

type TotalTimeCardProps = {
  totalTimePerCourse: CourseTimeData;
};

export const TotalTimeCard = ({ totalTimePerCourse }: TotalTimeCardProps) => {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700/50">
      <CardHeader>
        <CardTitle className="text-lg text-gray-100">
          Tiempo Total por Curso
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(totalTimePerCourse).map(([courseTitle, totalMinutes]) => (
            <div
              key={courseTitle}
              className="flex justify-between items-center p-4 rounded-lg bg-gray-700/30"
            >
              <h3 className="text-purple-400 font-medium">
                {courseTitle}
              </h3>
              <p className="text-sm text-gray-300">
                {formatTime(totalMinutes)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};