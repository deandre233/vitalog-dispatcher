
import { useState } from "react";
import { AchievementCard } from "./AchievementCard";
import { Achievement, AchievementCategory } from "../types/achievementTypes";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AchievementSectionProps {
  title: string;
  description: string;
  achievements: Achievement[];
  filter?: AchievementCategory;
  onPrestige?: (achievementId: string) => void;
}

export function AchievementSection({ 
  title, 
  description, 
  achievements,
  filter,
  onPrestige
}: AchievementSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  
  const filteredAchievements = filter 
    ? achievements.filter(achievement => achievement.category === filter)
    : achievements;
  
  if (filteredAchievements.length === 0) {
    return null;
  }
  
  const displayCount = 6;
  const hasMore = filteredAchievements.length > displayCount;
  const displayedAchievements = expanded 
    ? filteredAchievements 
    : filteredAchievements.slice(0, displayCount);
  
  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
  };
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedAchievements.map((achievement) => (
          <AchievementCard 
            key={achievement.id} 
            achievement={achievement} 
            onClick={handleAchievementClick} 
            onPrestige={onPrestige}
          />
        ))}
      </div>
      
      {hasMore && (
        <div className="mt-4 flex justify-center">
          <Button 
            variant="outline" 
            onClick={toggleExpanded}
            className="flex items-center gap-1"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show {filteredAchievements.length - displayCount} More
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
