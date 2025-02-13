import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseSessionsList } from "./CourseSessionsList";
import { BookOpen, ChevronDown, ChevronUp, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-mobile";

interface CourseSidebarProps {
  sessions: any[];
  hasAccess: boolean;
  currentSession: any;
  onPurchaseClick: () => void;
  userCourse?: any;
}

export const CourseSidebar = ({ 
  sessions, 
  hasAccess, 
  currentSession,
  onPurchaseClick,
  userCourse
}: CourseSidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isOpen, setIsOpen] = useState(false);

  const SidebarContent = () => (
    <Card className="bg-gradient-to-br from-gray-800/50 via-purple-900/20 to-gray-800/50 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 shadow-xl">
      <Tabs defaultValue="sessions" className="w-full">
        <TabsList className="w-full p-1 bg-gray-800/50">
          <TabsTrigger 
            value="sessions" 
            className="flex items-center gap-2 data-[state=active]:bg-purple-500/20 w-full"
          >
            <BookOpen className="w-4 h-4" />
            Contenido
          </TabsTrigger>
        </TabsList>
        
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <TabsContent value="sessions" className="mt-6 px-4 pb-4 space-y-4">
            <div className="space-y-4">
              <div className={`${!isExpanded ? 'max-h-[500px] overflow-hidden' : ''}`}>
                <CourseSessionsList 
                  sessions={sessions}
                  hasAccess={hasAccess}
                  onPurchaseClick={onPurchaseClick}
                  userCourse={userCourse}
                  currentSession={currentSession}
                />
              </div>
              {sessions.length > 4 && (
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="w-full flex items-center justify-center gap-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20"
                  >
                    {isExpanded ? (
                      <>Ver menos <ChevronUp className="h-4 w-4" /></>
                    ) : (
                      <>Ver más <ChevronDown className="h-4 w-4" /></>
                    )}
                  </Button>
                </CollapsibleTrigger>
              )}
            </div>
          </TabsContent>
        </Collapsible>
      </Tabs>
    </Card>
  );

  if (isMobile) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <Button 
              size="lg"
              className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg flex items-center gap-2 px-6"
            >
              <Menu className="h-5 w-5" />
              <span className="font-medium">Ver Contenido</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[85vh]">
            <DrawerHeader>
              <DrawerTitle className="text-center text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 text-transparent bg-clip-text">
                Contenido del Curso
              </DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-8">
              <SidebarContent />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full lg:sticky lg:top-4"
    >
      <SidebarContent />
    </motion.div>
  );
};