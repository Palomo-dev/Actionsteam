import { FileText, CheckCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SessionComments } from "./SessionComments";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";

interface SessionContentProps {
  session: {
    id: string;
    title: string;
    description: string | null;
    duration_hours: number | null;
    documentation_url: string | null;
    video_url: string | null;
  };
  isCompleted?: boolean;
  isActive?: boolean;
}

export const SessionContent = ({ session, isCompleted, isActive }: SessionContentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      const filename = url.split('/').pop() || 'document';
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const ContentDetails = () => (
    <Tabs defaultValue="content" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="content">Contenido</TabsTrigger>
        <TabsTrigger value="comments">Comentarios</TabsTrigger>
      </TabsList>
      
      <TabsContent value="content" className="space-y-4 mt-4">
        {session.description && (
          <div 
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: session.description }}
          />
        )}

        {session.documentation_url && (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 hover:bg-purple-500/10 w-full sm:w-auto"
            onClick={() => handleDownload(session.documentation_url!)}
          >
            <FileText className="w-4 h-4" />
            Descargar documentación
          </Button>
        )}
      </TabsContent>

      <TabsContent value="comments" className="mt-4">
        <SessionComments sessionId={session.id} />
      </TabsContent>
    </Tabs>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "bg-gray-800/50 border-purple-500/20 transition-all duration-300 hover:border-purple-500/40",
        isActive && "ring-2 ring-purple-500/50",
        isCompleted && "border-green-500/20 hover:border-green-500/40"
      )}>
        <CardContent className="p-4 md:p-6">
          <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
              <div className="cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    ) : (
                      <Play className="w-5 h-5 text-purple-400 shrink-0" />
                    )}
                    <h3 className={cn(
                      "text-lg font-semibold line-clamp-2",
                      isCompleted ? "text-green-400" : "text-purple-400"
                    )}>
                      {session.title}
                    </h3>
                  </div>
                  {session.duration_hours && (
                    <Badge variant="outline" className={cn(
                      "shrink-0",
                      isCompleted && "border-green-500/20 text-green-400"
                    )}>
                      {session.duration_hours} horas
                    </Badge>
                  )}
                </div>
              </div>
            </DrawerTrigger>
            <DrawerContent className="h-[85vh]">
              <DrawerHeader>
                <DrawerTitle className="text-center text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                  {session.title}
                </DrawerTitle>
              </DrawerHeader>
              <div className="px-4 pb-8">
                <ContentDetails />
              </div>
            </DrawerContent>
          </Drawer>
        </CardContent>
      </Card>
    </motion.div>
  );
};