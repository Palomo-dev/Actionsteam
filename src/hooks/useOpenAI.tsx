import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useOpenAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateResponse = async (prompt: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-with-ai', {
        body: { prompt },
      });

      if (error) throw error;

      return data.generatedText;
    } catch (err) {
      console.error('Error generating AI response:', err);
      setError('Error al generar respuesta. Por favor intenta de nuevo.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateResponse,
    isLoading,
    error,
  };
};