import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const features = [
  "Aprende a integrar ChatGPT y otras IAs en tu SaaS",
  "Domina Supabase para backend y autenticación",
  "Automatización con N8N y Webhooks",
  "Diseño UI/UX con Figma e Ideogram",
  "Integración de pagos y facturación",
  "Marketing digital y growth hacking",
];

export const FeaturesSection = () => {
  return (
    <section className="py-20 bg-[#0A0F1C]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
            Lo que aprenderás en este curso
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="border-none shadow-none bg-gray-800/30 hover:bg-gray-800/50 transition-all duration-300 group hover:scale-105"
              >
                <CardContent className="flex items-start p-4">
                  <CheckCircle className="text-green-400 mr-4 h-6 w-6 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <p className="text-lg text-gray-300 group-hover:text-white transition-colors">
                    {feature}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};