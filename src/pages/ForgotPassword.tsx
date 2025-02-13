import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

const ForgotPassword = () => {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] relative overflow-hidden bg-white">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-red-50/30" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.015]" />
      
      <div className="container relative z-10 mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-md">
          <div className="bg-white border border-red-100 p-8 rounded-xl shadow-lg backdrop-blur-sm">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Recuperar Contraseña</h1>
              <p className="text-gray-600">
                Ingresa tu email para recibir las instrucciones de recuperación
              </p>
            </div>
            <ResetPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;