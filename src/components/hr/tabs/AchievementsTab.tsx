
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Medal, BadgeCheck, Star, Clock } from "lucide-react";
import { Achievement, AchievementCategory } from "./achievements/types/achievementTypes";
import { achievements, getAchievementsSummary } from "./achievements/data/achievementsData";
import { AchievementSection } from "./achievements/components/AchievementSection";
import { CategoryFilter } from "./achievements/components/CategoryFilter";
import { AchievementSummary } from "./achievements/components/AchievementSummary";
import { AchievementDetailDialog } from "./achievements/components/AchievementDetailDialog";

export function AchievementsTab() {
  const [activeCategory, setActiveCategory] = useState<AchievementCategory | 'all'>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  
  const summary = getAchievementsSummary();
  
  // Get recently unlocked achievements (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentAchievements = achievements
    .filter(a => a.unlocked && a.dateUnlocked && new Date(a.dateUnlocked) >= thirtyDaysAgo)
    .sort((a, b) => {
      const dateA = a.dateUnlocked ? new Date(a.dateUnlocked) : new Date(0);
      const dateB = b.dateUnlocked ? new Date(b.dateUnlocked) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
  
  // Get unlocked achievements
  const unlockedAchievements = achievements
    .filter(a => a.unlocked)
    .sort((a, b) => {
      // Sort by rarity first (legendary -> common)
      const rarityOrder = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
      const rarityDiff = rarityOrder[a.rarity as keyof typeof rarityOrder] - rarityOrder[b.rarity as keyof typeof rarityOrder];
      if (rarityDiff !== 0) return rarityDiff;
      
      // Then sort by date unlocked
      const dateA = a.dateUnlocked ? new Date(a.dateUnlocked) : new Date(0);
      const dateB = b.dateUnlocked ? new Date(b.dateUnlocked) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
  
  // Get in-progress achievements
  const inProgressAchievements = achievements
    .filter(a => !a.unlocked && a.progress !== undefined && a.progress > 0)
    .sort((a, b) => {
      const aProgress = (a.progress || 0) / (a.maxProgress || 1);
      const bProgress = (b.progress || 0) / (b.maxProgress || 1);
      return bProgress - aProgress;
    });
  
  // Get locked achievements (no progress yet)
  const lockedAchievements = achievements
    .filter(a => !a.unlocked && (!a.progress || a.progress === 0))
    .sort((a, b) => {
      // Sort by rarity (common -> legendary)
      const rarityOrder = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 };
      return rarityOrder[a.rarity as keyof typeof rarityOrder] - rarityOrder[b.rarity as keyof typeof rarityOrder];
    });
  
  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setDetailDialogOpen(true);
  };
  
  return (
    <div className="space-y-8 pb-10">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Medal className="h-6 w-6 text-primary" />
            <CardTitle>Employee Achievements</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-2">
          <p className="text-muted-foreground">
            Track your career accomplishments and earn badges for clinical excellence, teamwork, 
            education, operational performance, leadership, and community impact.
          </p>
        </CardContent>
      </Card>
      
      <div className="space-y-8">
        <AchievementSummary 
          totalPoints={summary.totalPoints}
          earnedPoints={summary.earnedPoints}
          totalAchievements={summary.totalAchievements}
          unlockedAchievements={summary.unlockedAchievements}
          categorySummaries={summary.categorySummaries}
        />
        
        <CategoryFilter 
          activeCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
        />
        
        {recentAchievements.length > 0 && (
          <AchievementSection
            title="Recently Unlocked"
            description="Achievements you've earned in the last 30 days"
            achievements={recentAchievements}
            filter={activeCategory === 'all' ? undefined : activeCategory}
          />
        )}
        
        {unlockedAchievements.length > 0 && (
          <AchievementSection
            title="Unlocked Achievements"
            description="Achievements you've already earned"
            achievements={unlockedAchievements}
            filter={activeCategory === 'all' ? undefined : activeCategory}
          />
        )}
        
        {inProgressAchievements.length > 0 && (
          <AchievementSection
            title="In Progress"
            description="Achievements you're working towards"
            achievements={inProgressAchievements}
            filter={activeCategory === 'all' ? undefined : activeCategory}
          />
        )}
        
        {lockedAchievements.length > 0 && (
          <AchievementSection
            title="Locked Achievements"
            description="Challenges for you to tackle"
            achievements={lockedAchievements}
            filter={activeCategory === 'all' ? undefined : activeCategory}
          />
        )}
      </div>
      
      <AchievementDetailDialog
        achievement={selectedAchievement}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />
    </div>
  );
}
