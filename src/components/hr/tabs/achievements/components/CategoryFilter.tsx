
import { Button } from "@/components/ui/button";
import { CategoryFilterProps } from "../types/achievementTypes";
import { getCategoryIcon, getCategoryColor } from "../data/achievementsData";
import { Award } from "lucide-react";

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'clinical', label: 'Clinical' },
    { id: 'teamwork', label: 'Teamwork' },
    { id: 'education', label: 'Education' },
    { id: 'operational', label: 'Operational' },
    { id: 'leadership', label: 'Leadership' },
    { id: 'community', label: 'Community' }
  ];
  
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map(category => (
        <Button
          key={category.id}
          variant={activeCategory === category.id ? "default" : "outline"}
          className="flex items-center gap-1"
          onClick={() => onCategoryChange(category.id as any)}
        >
          {category.id === 'all' ? (
            <Award className="h-4 w-4" />
          ) : (
            <span className={getCategoryColor(category.id as any)}>
              {getCategoryIcon(category.id as any)}
            </span>
          )}
          {category.label}
        </Button>
      ))}
    </div>
  );
}
