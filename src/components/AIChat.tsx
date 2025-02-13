import { useState } from 'react';
import { useOpenAI } from '@/hooks/useOpenAI';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

export const AIChat = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const { generateResponse, isLoading, error } = useOpenAI();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const result = await generateResponse(prompt);
    if (result) {
      setResponse(result);
      setPrompt('');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Escribe tu pregunta..."
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : 'Enviar'}
        </Button>
      </form>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {response && (
        <div className="bg-gray-800/30 p-4 rounded-lg">
          <p className="text-white">{response}</p>
        </div>
      )}
    </div>
  );
};