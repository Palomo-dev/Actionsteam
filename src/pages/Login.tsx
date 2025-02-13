import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const Login = () => {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.015]" />
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-transparent to-red-50/30 opacity-50" />
      
      <div className="container relative z-10 mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/80 backdrop-blur-sm border border-red-100">
              <TabsTrigger 
                value="login"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-800 data-[state=active]:text-white"
              >
                Iniciar Sesión
              </TabsTrigger>
              <TabsTrigger 
                value="register"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-800 data-[state=active]:text-white"
              >
                Registrarse
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card className="border-red-100">
                <div className="p-6">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 text-transparent bg-clip-text">
                      Bienvenido de nuevo
                    </h1>
                    <p className="text-gray-600">
                      Ingresa tus credenciales para acceder
                    </p>
                  </div>
                  <LoginForm />
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card className="border-red-100">
                <div className="p-6">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 text-transparent bg-clip-text">
                      Crear una cuenta
                    </h1>
                    <p className="text-gray-600">
                      Únete a nuestra comunidad de aprendizaje
                    </p>
                  </div>
                  <RegisterForm />
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;