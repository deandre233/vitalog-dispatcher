
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Star } from "lucide-react";
import { AchievementSummaryProps } from "../types/achievementTypes";
import { getCategoryIcon, getCategoryBgColor } from "../data/achievementsData";

export function AchievementSummary({ 
  totalPoints, 
  earnedPoints, 
  totalAchievements, 
  unlockedAchievements,
  categorySummaries 
}: AchievementSummaryProps) {
  const progressPercentage = Math.round((earnedPoints / totalPoints) * 100) || 0;
  const achievementPercentage = Math.round((unlockedAchievements / totalAchievements) * 100) || 0;
  
  // Calculate the user's level based on points
  const level = Math.floor(earnedPoints / 100) + 1;
  const pointsForNextLevel = level * 100;
  const pointsForCurrentLevel = (level - 1) * 100;
  const levelProgress = Math.round(((earnedPoints - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel)) * 100);
  
  return (
    <div className="space-y-6">
      <Card className="border-2 border-amber-200 bg-amber-50/30">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-6 w-6 text-amber-500" />
                <h3 className="text-xl font-bold">Achievement Progress</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Achievements Unlocked</p>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold">{unlockedAchievements}</span>
                    <span className="text-sm text-muted-foreground ml-1">/ {totalAchievements}</span>
                  </div>
                  <Progress value={achievementPercentage} className="h-2 mt-1" />
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Points Earned</p>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold">{earnedPoints}</span>
                    <span className="text-sm text-muted-foreground ml-1">/ {totalPoints}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2 mt-1" />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg p-4 min-w-[150px]">
              <div className="text-xs uppercase tracking-wider text-amber-800 mb-1">Current Level</div>
              <div className="text-4xl font-bold text-amber-700">{level}</div>
              <div className="mt-2 w-full">
                <div className="flex justify-between text-xs text-amber-800 mb-1">
                  <span>Next Level</span>
                  <span>{earnedPoints} / {pointsForNextLevel}</span>
                </div>
                <Progress value={levelProgress} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categorySummaries.map((summary) => (
          <Card key={summary.category} className="overflow-hidden">
            <div className={`px-4 py-3 flex items-center gap-2 border-b ${getCategoryBgColor(summary.category)}`}>
              {getCategoryIcon(summary.category)}
              <h3 className="font-medium capitalize">{summary.category}</h3>
            </div>
            
            <CardContent className="p-4">
              <div className="flex justify-between mb-3">
                <div>
                  <p className="text-sm text-muted-foreground">Achievements</p>
                  <div className="flex items-baseline">
                    <span className="text-lg font-medium">{summary.unlockedAchievements}</span>
                    <span className="text-xs text-muted-foreground ml-1">/ {summary.totalAchievements}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Points</p>
                  <div className="flex items-baseline justify-end">
                    <span className="text-lg font-medium">{summary.earnedPoints}</span>
                    <span className="text-xs text-muted-foreground ml-1">/ {summary.totalPoints}</span>
                  </div>
                </div>
              </div>
              
              {summary.nextAchievement && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-1">Next Achievement</p>
                  <div className="flex items-center gap-2 bg-accent/40 p-2 rounded-md">
                    <div className="p-1 rounded-full bg-background">
                      {summary.nextAchievement.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{summary.nextAchievement.name}</p>
                      {summary.nextAchievement.progress !== undefined && summary.nextAchievement.maxProgress && (
                        <Progress 
                          value={(summary.nextAchievement.progress / summary.nextAchievement.maxProgress) * 100} 
                          className="h-1 mt-1" 
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
