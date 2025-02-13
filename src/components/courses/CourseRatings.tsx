import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquare } from "lucide-react";
import { useEffect } from "react";

interface CourseRatingsProps {
  showRating: boolean;
  setShowRating: (show: boolean) => void;
  rating: number;
  setRating: (rating: number) => void;
  comment: string;
  setComment: (comment: string) => void;
  onSubmitRating: () => void;
  autoShow?: boolean;
}

export const CourseRatings = ({
  showRating,
  setShowRating,
  rating,
  setRating,
  comment,
  setComment,
  onSubmitRating,
  autoShow
}: CourseRatingsProps) => {
  useEffect(() => {
    if (autoShow) {
      setShowRating(true);
    }
  }, [autoShow, setShowRating]);

  return (
    <Dialog open={showRating} onOpenChange={setShowRating}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¡Felicitaciones por completar el curso! Comparte tu opinión</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <Star
                key={value}
                className={`h-8 w-8 cursor-pointer ${
                  value <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'
                }`}
                onClick={() => setRating(value)}
              />
            ))}
          </div>
          <Textarea
            placeholder="Comparte tu opinión sobre el curso..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button 
            className="w-full"
            onClick={onSubmitRating}
            disabled={!rating || !comment.trim()}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Enviar Opinión
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};