import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronLeft, PanelLeftClose, PanelLeft } from "lucide-react";
import { SidebarNav } from "./sidebar/SidebarNav";
import { SidebarProfile } from "./sidebar/SidebarProfile";

interface AppSidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onToggleSidebar: () => void;
  onToggleCollapsed: () => void;
}

export const AppSidebar = ({ 
  isOpen, 
  isCollapsed, 
  onToggleSidebar, 
  onToggleCollapsed 
}: AppSidebarProps) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onToggleSidebar}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 shadow-lg transform transition-all duration-200 ease-in-out lg:translate-x-0 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Close button for mobile */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden absolute right-2 top-2 text-gray-500 hover:text-red-600 p-2"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Collapse toggle button (desktop only) */}
        <button
          onClick={onToggleCollapsed}
          className="hidden lg:flex absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1.5 text-gray-500 hover:text-red-600 shadow-sm hover:shadow-md transition-all duration-200"
        >
          {isCollapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>

        {/* Logo */}
        <div className={cn(
          "p-4",
          isCollapsed && "px-2"
        )}>
          <Link to="/app/inicio" className={cn(
            "text-xl font-bold bg-gradient-to-r from-red-600 to-red-900 text-transparent bg-clip-text hover:scale-105 transition-transform",
            isCollapsed ? "text-center block" : ""
          )}>
            {isCollapsed ? "AT" : "ActionS Team"}
          </Link>
        </div>

        {/* Navigation */}
        <SidebarNav isCollapsed={isCollapsed} />

        {/* Profile section */}
        <SidebarProfile isCollapsed={isCollapsed} />
      </aside>
    </>
  );
};