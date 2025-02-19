
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  border: string;
  iconClass: string;
  isWide?: boolean;
}

export function ModuleCard({ 
  title, 
  description, 
  icon: Icon, 
  gradient, 
  border, 
  iconClass,
  isWide = false 
}: ModuleCardProps) {
  return (
    <Card className={`group relative bg-black/40 backdrop-blur-xl border-0 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden h-full`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/50" />
      <CardContent className={`p-6 relative ${isWide ? 'md:p-8' : 'md:p-6'}`}>
        <div className={`flex ${isWide ? 'md:items-center md:space-x-6 flex-col md:flex-row space-y-4 md:space-y-0' : 'flex-col space-y-4'}`}>
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} border ${border} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 ${iconClass}`} />
          </div>
          <div className={`flex-1 ${isWide ? 'md:ml-2' : ''}`}>
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-100 transition-colors duration-300">{title}</h3>
            <p className="text-sm text-gray-400 mt-1 group-hover:text-gray-300 transition-colors duration-300">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
