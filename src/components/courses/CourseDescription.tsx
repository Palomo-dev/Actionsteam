import { cn } from "@/lib/utils";

interface CourseDescriptionProps {
  description: string;
  className?: string;
}

export const CourseDescription = ({ description, className }: CourseDescriptionProps) => {
  return (
    <div 
      className={cn(
        "prose prose-invert prose-sm max-w-none",
        "text-gray-400/90 line-clamp-2",
        className
      )}
      dangerouslySetInnerHTML={{ __html: description || '' }}
    />
  );
};