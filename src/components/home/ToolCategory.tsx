import { LucideIcon } from "lucide-react";
import { CheckCircle2 } from "lucide-react";

interface ToolCategoryProps {
  title: string;
  description: string;
  icon: LucideIcon;
  tools: string[];
}

export const ToolCategory = ({ title, description, icon: Icon, tools }: ToolCategoryProps) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 border border-gray-100">
      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Icon className="text-primary" size={24} />
      </div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <div className="space-y-2">
        {tools.map((tool, index) => (
          <div
            key={index}
            className="flex items-center text-gray-700 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <CheckCircle2 className="text-green-500 mr-2" size={16} />
            {tool}
          </div>
        ))}
      </div>
    </div>
  );
};