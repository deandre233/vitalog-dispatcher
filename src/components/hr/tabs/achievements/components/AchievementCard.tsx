
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Achievement } from "../types/achievementTypes";
import { Star, Lock, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { getRarityColor } from "../data/achievementsData";

interface AchievementCardProps {
  achievement: Achievement;
  onClick: (achievement: Achievement) => void;
  onPrestige?: (achievementId: string) => void;
}

export function AchievementCard({ achievement, onClick, onPrestige }: AchievementCardProps) {
  const [hovered, setHovered] = useState(false);
  
  const handleClick = () => {
    onClick(achievement);
  };
  
  const handlePrestigeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPrestige) {
      onPrestige(achievement.id);
    }
  };
  
  const getPrestigeStars = () => {
    if (!achievement.prestige || achievement.prestige < 1) return null;
    
    const getStarColor = () => {
      if (achievement.prestige === 1) return "text-amber-700";
      if (achievement.prestige === 2) return "text-slate-400";
      if (achievement.prestige === 3) return "text-yellow-500";
      if (achievement.prestige === 4) return "text-cyan-400";
      return "text-violet-400";
    };
    
    return (
      <div className="absolute -top-1 -right-1 flex">
        {[...Array(achievement.prestige)].map((_, i) => (
          <Star key={i} className={`h-3.5 w-3.5 ${getStarColor()} drop-shadow-sm`} />
        ))}
      </div>
    );
  };
  
  const getBorderStyle = () => {
    if (!achievement.prestige || achievement.prestige < 1) return "";
    
    if (achievement.prestige === 1) return "border-amber-700";
    if (achievement.prestige === 2) return "border-slate-400";
    if (achievement.prestige === 3) return "border-yellow-500";
    if (achievement.prestige === 4) return "border-cyan-400";
    return "border-violet-400";
  };
  
  const canPrestige = achievement.unlocked && 
    (achievement.canPrestige !== false) && 
    onPrestige !== undefined;
  
  return (
    <div
      className={cn(
        "relative group border rounded-lg p-4 bg-card hover:shadow-md transition-all cursor-pointer",
        hovered ? "shadow-md" : "shadow-sm",
        achievement.prestige && achievement.prestige > 0 ? `border-2 ${getBorderStyle()}` : ""
      )}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {getPrestigeStars()}
      
      <div className="flex items-start gap-3">
        <div className={cn(
          "rounded-full p-2 flex-shrink-0",
          achievement.unlocked 
            ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)}`
            : "bg-gray-200"
        )}>
          {achievement.unlocked ? (
            achievement.icon
          ) : (
            <Lock className="h-6 w-6 text-gray-400" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={cn(
              "font-medium truncate",
              achievement.unlocked ? "text-foreground" : "text-muted-foreground"
            )}>
              {achievement.name}
            </h3>
            
            {achievement.unlocked && (
              <div className="text-xs font-semibold bg-primary-foreground text-primary px-2 py-0.5 rounded-full">
                +{achievement.points + (achievement.prestigeBonus || 0)}
              </div>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {achievement.description}
          </p>
          
          {achievement.progress !== undefined && achievement.maxProgress && (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span>
                  {achievement.progress}/{achievement.maxProgress}
                </span>
              </div>
              <Progress 
                value={(achievement.progress / achievement.maxProgress) * 100} 
                className="h-1.5" 
              />
            </div>
          )}
          
          {canPrestige && (
            <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full text-xs h-7 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 hover:from-amber-500/20 hover:to-yellow-500/20"
                onClick={handlePrestigeClick}
              >
                <Trophy className="h-3 w-3 mr-1" /> Prestige
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
