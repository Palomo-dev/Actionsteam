import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PaymentCancel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      variant: "destructive",
      title: "Pago cancelado",
      description: "El proceso de pago ha sido cancelado.",
    });
  }, [toast]);

  const handleReturnToCourses = () => {
    navigate('/app/cursos');
  };

  return (
    <div className="container max-w-md mx-auto py-8">
      <Card className="border-destructive/50">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <XCircle className="w-16 h-16 text-destructive mx-auto" />
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">Pago Cancelado</h1>
              <p className="text-gray-400">
                El proceso de pago ha sido cancelado. Puedes intentarlo nuevamente cuando lo desees.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button 
                variant="default"
                onClick={handleReturnToCourses}
                className="w-full"
                autoFocus // Asegura que haya un elemento focusable
              >
                Volver a Cursos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancel;