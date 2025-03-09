
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Achievement } from "../types/achievementTypes";
import { Star, Trophy, BadgeCheck, Gift } from "lucide-react";
import { toast } from "sonner";
import { getRarityColor } from "../data/achievementsData";

interface PrestigeAchievementDialogProps {
  achievement: Achievement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPrestige: (achievementId: string) => void;
}

export function PrestigeAchievementDialog({
  achievement,
  open,
  onOpenChange,
  onPrestige
}: PrestigeAchievementDialogProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  
  if (!achievement) return null;
  
  const handlePrestige = () => {
    setIsConfirming(true);
    // Simulate prestiging process
    setTimeout(() => {
      onPrestige(achievement.id);
      setIsConfirming(false);
      toast.success(`"${achievement.name}" has been prestiged!`, {
        description: `You've earned a prestige bonus of ${achievement.prestigeBonus || achievement.points * 0.25} points!`,
        icon: <Star className="h-5 w-5 text-yellow-500" />
      });
      onOpenChange(false);
    }, 1500);
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
  
  const currentPrestige = achievement.prestige || 0;
  const nextPrestige = currentPrestige + 1;
  const canPrestige = achievement.unlocked && (achievement.canPrestige !== false);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className={`h-5 w-5 ${getPrestigeColor(currentPrestige)}`} />
            Prestige Achievement
          </DialogTitle>
          <DialogDescription>
            Take your achievement to the next level and earn bonus points
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/40">
            <div className="p-2 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/20">
              {achievement.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{achievement.name}</h3>
              <p className="text-sm text-muted-foreground">{achievement.description}</p>
              <div className="flex items-center mt-1 gap-2">
                <span className={`text-sm font-medium ${getPrestigeColor(currentPrestige)}`}>
                  {getPrestigeLevel(currentPrestige)}
                </span>
                {currentPrestige > 0 && (
                  <div className="flex">
                    {[...Array(currentPrestige)].map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${getPrestigeColor(currentPrestige)}`} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Prestige Benefits</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <BadgeCheck className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Earn a bonus of {achievement.prestigeBonus || Math.round(achievement.points * 0.25)} additional points</span>
              </li>
              <li className="flex items-start gap-2">
                <BadgeCheck className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Unlock special {getPrestigeLevel(nextPrestige)} border and icon effects</span>
              </li>
              <li className="flex items-start gap-2">
                <BadgeCheck className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Gain recognition on the employee leaderboard</span>
              </li>
            </ul>
          </div>
          
          {achievement.prestigeRequirements && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
              <h4 className="font-medium text-amber-800 flex items-center gap-1">
                <Gift className="h-4 w-4" /> Prestige Requirements
              </h4>
              <p className="text-sm text-amber-700 mt-1">{achievement.prestigeRequirements}</p>
            </div>
          )}
        </div>
        
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            onClick={handlePrestige} 
            disabled={!canPrestige || isConfirming}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
          >
            {isConfirming ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent" />
                Prestiging...
              </>
            ) : (
              <>
                <Star className="mr-2 h-4 w-4" />
                Prestige Achievement
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
