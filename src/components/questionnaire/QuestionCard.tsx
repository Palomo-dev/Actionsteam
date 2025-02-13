import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const QuestionCard = ({ title, subtitle, children, className }: QuestionCardProps) => {
  return (
    <Card className={cn("w-full max-w-2xl mx-auto bg-white/5 backdrop-blur-sm border-gray-800/50", className)}>
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
          {title}
        </CardTitle>
        {subtitle && (
          <p className="text-gray-400 text-center text-sm md:text-base">
            {subtitle}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};