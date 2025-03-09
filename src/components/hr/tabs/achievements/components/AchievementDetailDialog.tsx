
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Achievement } from "../types/achievementTypes";
import { 
  Calendar, 
  Clock, 
  Award, 
  Star,
  CheckCircle2, 
  BarChart4,
  Trophy,
  BadgeCheck
} from "lucide-react";
import { format } from "date-fns";
import { 
  getRarityColor, 
  getCategoryIcon, 
  getCategoryColor, 
  getCategoryBgColor 
} from "../data/achievementsData";

interface AchievementDetailDialogProps {
  achievement: Achievement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AchievementDetailDialog({
  achievement,
  open,
  onOpenChange
}: AchievementDetailDialogProps) {
  if (!achievement) return null;
  
  const getCategoryName = (category: string): string => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };
  
  const getRarityName = (rarity: string): string => {
    return rarity.charAt(0).toUpperCase() + rarity.slice(1);
  };
  
  const getPrestigeLevel = (prestige?: number): string => {
    if (!prestige || prestige < 1) return "Not Prestiged";
    if (prestige === 1) return "Bronze";
    if (prestige === 2) return "Silver";
    if (prestige === 3) return "Gold";
    if (prestige === 4) return "Platinum";
    return "Diamond";
  };
  
  const getPrestigeColor = (prestige?: number): string => {
    if (!prestige || prestige < 1) return "text-gray-500";
    if (prestige === 1) return "text-amber-700";
    if (prestige === 2) return "text-slate-400";
    if (prestige === 3) return "text-yellow-500";
    if (prestige === 4) return "text-cyan-400";
    return "text-violet-400";
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg overflow-hidden">
        <div className="flex flex-col space-y-6">
          <div className={`flex items-center justify-center -mx-6 -mt-6 p-8 bg-gradient-to-br ${getRarityColor(achievement.rarity)}`}>
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              {achievement.icon}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{achievement.name}</h2>
              <p className="text-muted-foreground">{achievement.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Category</p>
                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getCategoryBgColor(achievement.category)}`}>
                  {getCategoryIcon(achievement.category)}
                  <span className="ml-1">{getCategoryName(achievement.category)}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Rarity</p>
                <Badge variant="outline" className={`font-semibold ${getCategoryColor(achievement.category)}`}>
                  <Award className="mr-1 h-3 w-3" />
                  {getRarityName(achievement.rarity)}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Points</p>
                <div className="font-medium text-base flex items-center gap-1">
                  <BarChart4 className="h-4 w-4 text-primary" />
                  <span>{achievement.points}</span>
                  {achievement.prestigeBonus && achievement.prestigeBonus > 0 && (
                    <span className="text-sm text-green-600">+{achievement.prestigeBonus} bonus</span>
                  )}
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Prestige Level</p>
                <div className={`font-medium text-base flex items-center gap-1 ${getPrestigeColor(achievement.prestige)}`}>
                  <Trophy className="h-4 w-4" />
                  {getPrestigeLevel(achievement.prestige)}
                  {achievement.prestige && achievement.prestige > 0 && (
                    <div className="flex">
                      {[...Array(achievement.prestige)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${getPrestigeColor(achievement.prestige)}`} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {achievement.unlocked && achievement.dateUnlocked && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Unlocked on {format(new Date(achievement.dateUnlocked), 'MMM d, yyyy')}</span>
              </div>
            )}
            
            {achievement.progress !== undefined && achievement.maxProgress && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Progress</p>
                  <p className="text-sm text-muted-foreground">
                    {achievement.progress}/{achievement.maxProgress}
                    {achievement.unlocked && " (Completed)"}
                  </p>
                </div>
                <Progress 
                  value={(achievement.progress / achievement.maxProgress) * 100} 
                  className="h-2" 
                />
              </div>
            )}
            
            <div className="space-y-2 border-t pt-4">
              <p className="text-sm font-medium">Criteria</p>
              <p className="text-sm text-muted-foreground">{achievement.criteria}</p>
            </div>
            
            {achievement.prestige && achievement.prestige > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-2">
                <BadgeCheck className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-amber-800">Prestige Bonus</h4>
                  <p className="text-sm text-amber-700">
                    This achievement has been prestiged {achievement.prestige} {achievement.prestige === 1 ? 'time' : 'times'}, 
                    earning you an additional {achievement.prestigeBonus} points!
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
