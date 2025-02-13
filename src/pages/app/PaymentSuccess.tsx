import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "¡Pago exitoso!",
      description: "Tu pago ha sido procesado correctamente.",
    });

    const timer = setTimeout(() => {
      navigate("/app/dashboard");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0F1C]">
      <div className="text-center space-y-4">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h1 className="text-3xl font-bold text-white">¡Pago Exitoso!</h1>
        <p className="text-gray-400">
          Gracias por tu compra. Serás redirigido al dashboard en unos segundos...
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;