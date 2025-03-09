
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Lock, Calendar } from "lucide-react";
import { format } from "date-fns";
import { AchievementCardProps } from "../types/achievementTypes";
import { getRarityColor } from "../data/achievementsData";

export function AchievementCard({ achievement }: AchievementCardProps) {
  const {
    name,
    description,
    icon,
    rarity,
    points,
    unlocked,
    dateUnlocked,
    progress,
    maxProgress,
    isSecret
  } = achievement;

  const rarityColor = getRarityColor(rarity);
  const progressPercentage = progress !== undefined && maxProgress ? Math.round((progress / maxProgress) * 100) : 0;
  
  return (
    <Card className={`relative overflow-hidden border-2 hover:shadow-md transition-all ${
      unlocked ? "border-gray-200" : "border-gray-300 opacity-80"
    }`}>
      <div 
        className={`absolute inset-0 opacity-5 z-0 ${
          unlocked ? `bg-gradient-to-br ${rarityColor}` : "bg-gray-400"
        }`} 
      />
      
      <div className="relative z-10 p-4">
        <div className="flex items-start justify-between">
          <div className={`rounded-full p-2 ${
            unlocked ? `bg-gradient-to-br ${rarityColor}` : "bg-gray-300"
          }`}>
            {unlocked ? (
              icon
            ) : isSecret ? (
              <Lock className="h-8 w-8 text-gray-500" />
            ) : (
              icon
            )}
          </div>
          
          <div className="text-right">
            <Badge variant="outline" className="mb-1">
              {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
            </Badge>
            <div className="text-xl font-bold">{points} pts</div>
          </div>
        </div>
        
        <div className="mt-3">
          <h3 className="font-semibold text-lg mb-1">
            {isSecret && !unlocked ? "???" : name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isSecret && !unlocked ? "This achievement is still locked." : description}
          </p>
        </div>
        
        {progress !== undefined && maxProgress && !unlocked && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{progress} / {maxProgress}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}
        
        {unlocked && dateUnlocked && (
          <div className="mt-3 flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Unlocked: {format(new Date(dateUnlocked), "MMM d, yyyy")}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
