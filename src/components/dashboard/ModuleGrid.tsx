
import { ModuleCard } from "./ModuleCard";
import { LucideIcon } from "lucide-react";

interface Module {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  border: string;
  iconClass: string;
  link: string;
}

interface ModuleGridProps {
  modules: Module[];
  columns?: 2 | 3 | 4;
  isWide?: boolean;
}

export function ModuleGrid({ modules, columns = 4, isWide = false }: ModuleGridProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {modules.map((module, index) => (
        <ModuleCard
          key={index}
          {...module}
          isWide={isWide}
        />
      ))}
    </div>
  );
}
