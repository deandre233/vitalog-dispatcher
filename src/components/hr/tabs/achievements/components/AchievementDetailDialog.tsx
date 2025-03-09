
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Lock } from "lucide-react";
import { format } from "date-fns";
import { AchievementDetailDialogProps } from "../types/achievementTypes";
import { getRarityColor, getCategoryBgColor } from "../data/achievementsData";

export function AchievementDetailDialog({ 
  achievement, 
  open, 
  onOpenChange 
}: AchievementDetailDialogProps) {
  if (!achievement) return null;
  
  const {
    name,
    description,
    icon,
    rarity,
    category,
    points,
    unlocked,
    dateUnlocked,
    progress,
    maxProgress,
    criteria,
    isSecret
  } = achievement;
  
  const rarityColor = getRarityColor(rarity);
  const categoryBadgeClass = getCategoryBgColor(category);
  const progressPercentage = progress !== undefined && maxProgress 
    ? Math.round((progress / maxProgress) * 100) 
    : 0;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className={`rounded-full p-1 ${
              unlocked ? `bg-gradient-to-br ${rarityColor}` : "bg-gray-300"
            }`}>
              {unlocked || !isSecret ? icon : <Lock className="h-6 w-6 text-gray-500" />}
            </span>
            {isSecret && !unlocked ? "???" : name}
          </DialogTitle>
          <DialogDescription>
            {isSecret && !unlocked ? "This achievement is still locked." : description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={`${categoryBadgeClass} capitalize`}>
              {category}
            </Badge>
            <Badge variant="outline">
              {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
            </Badge>
            <Badge variant="outline" className="ml-auto">
              {points} Points
            </Badge>
          </div>
          
          <div className="border-t border-b py-3">
            <h4 className="font-medium mb-1">Criteria</h4>
            <p className="text-sm text-muted-foreground">
              {isSecret && !unlocked ? "Complete special requirements to unlock this achievement." : criteria}
            </p>
          </div>
          
          {progress !== undefined && maxProgress && !unlocked && (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span className="font-medium">{progress} / {maxProgress}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          )}
          
          {unlocked && dateUnlocked && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Unlocked on {format(new Date(dateUnlocked), "MMMM d, yyyy")}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
