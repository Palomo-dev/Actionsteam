import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";
import { cn } from "@/lib/utils";

export const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppHeader onToggleSidebar={toggleSidebar} />
      <AppSidebar 
        isOpen={isSidebarOpen} 
        isCollapsed={isCollapsed}
        onToggleSidebar={toggleSidebar}
        onToggleCollapsed={toggleCollapsed}
      />
      
      <main className={cn(
        "flex-grow pt-16 transition-all duration-200 ease-in-out",
        isCollapsed ? "lg:pl-20" : "lg:pl-64",
      )}>
        <div className="container mx-auto px-4 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};