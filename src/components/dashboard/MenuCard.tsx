
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface MenuCardProps {
  title: string;
  icon: LucideIcon;
  description: string;
  path: string;
  color: string;
  gradient: string;
}

export function MenuCard({ title, icon: Icon, description, path, color, gradient }: MenuCardProps) {
  return (
    <Link 
      to={path}
      className="block transform transition-all duration-300 hover:scale-105 hover:-translate-y-1"
    >
      <Card className={`
        h-full relative overflow-hidden
        bg-gradient-to-br ${gradient}
        border-0 shadow-lg hover:shadow-xl
        group transition-all duration-500
        before:absolute before:inset-0
        before:bg-white before:z-10 before:opacity-95
        before:transition-opacity before:duration-500
        hover:before:opacity-90
        after:absolute after:inset-0 after:-z-10
        after:bg-gradient-to-br ${gradient}
        after:opacity-0 hover:after:opacity-100
        after:transition-opacity after:duration-500
        backdrop-blur-sm
        hover:shadow-glow
      `}>
        <div className="relative z-20 p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className={`
              p-3 rounded-xl ${color}
              bg-white/80 shadow-lg
              group-hover:scale-110 group-hover:shadow-xl
              transform transition-all duration-500
              backdrop-blur-sm
              group-hover:rotate-3
            `}>
              <Icon className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold text-medical-primary group-hover:text-medical-secondary transition-colors duration-300">
              {title}
            </h2>
            <p className="text-sm text-medical-primary/70 group-hover:text-medical-primary/90 transition-colors duration-300">
              {description}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
