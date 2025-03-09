
import { AchievementSectionProps } from "../types/achievementTypes";
import { AchievementCard } from "./AchievementCard";

export function AchievementSection({ 
  title, 
  description, 
  achievements,
  filter
}: AchievementSectionProps) {
  const filteredAchievements = filter 
    ? achievements.filter(a => a.category === filter) 
    : achievements;
  
  if (filteredAchievements.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-10">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAchievements.map(achievement => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  );
}
