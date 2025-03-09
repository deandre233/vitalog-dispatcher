
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Medal, BadgeCheck, Star, Clock, Trophy } from "lucide-react";
import { Achievement, AchievementCategory } from "./achievements/types/achievementTypes";
import { achievements, getAchievementsSummary } from "./achievements/data/achievementsData";
import { AchievementSection } from "./achievements/components/AchievementSection";
import { CategoryFilter } from "./achievements/components/CategoryFilter";
import { AchievementSummary } from "./achievements/components/AchievementSummary";
import { AchievementDetailDialog } from "./achievements/components/AchievementDetailDialog";
import { PrestigeAchievementDialog } from "./achievements/components/PrestigeAchievementDialog";
import { AIAchievementIdeas } from "@/components/hr/achievements/AIAchievementIdeas";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export function AchievementsTab() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const [activeCategory, setActiveCategory] = useState<AchievementCategory | 'all'>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [prestigeDialogOpen, setPrestigeDialogOpen] = useState(false);
  const [prestigeAchievement, setPrestigeAchievement] = useState<Achievement | null>(null);
  const [localAchievements, setLocalAchievements] = useState<Achievement[]>(achievements);
  
  const summary = getAchievementsSummary(localAchievements);
  
  // Get recently unlocked achievements (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentAchievements = localAchievements
    .filter(a => a.unlocked && a.dateUnlocked && new Date(a.dateUnlocked) >= thirtyDaysAgo)
    .sort((a, b) => {
      const dateA = a.dateUnlocked ? new Date(a.dateUnlocked) : new Date(0);
      const dateB = b.dateUnlocked ? new Date(b.dateUnlocked) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
  
  // Get unlocked achievements
  const unlockedAchievements = localAchievements
    .filter(a => a.unlocked)
    .sort((a, b) => {
      // Sort by prestige level first
      const prestigeDiff = (b.prestige || 0) - (a.prestige || 0);
      if (prestigeDiff !== 0) return prestigeDiff;
      
      // Then sort by rarity (legendary -> common)
      const rarityOrder = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
      const rarityDiff = rarityOrder[a.rarity as keyof typeof rarityOrder] - rarityOrder[b.rarity as keyof typeof rarityOrder];
      if (rarityDiff !== 0) return rarityDiff;
      
      // Then sort by date unlocked
      const dateA = a.dateUnlocked ? new Date(a.dateUnlocked) : new Date(0);
      const dateB = b.dateUnlocked ? new Date(b.dateUnlocked) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
  
  // Get in-progress achievements
  const inProgressAchievements = localAchievements
    .filter(a => !a.unlocked && a.progress !== undefined && a.progress > 0)
    .sort((a, b) => {
      const aProgress = (a.progress || 0) / (a.maxProgress || 1);
      const bProgress = (b.progress || 0) / (b.maxProgress || 1);
      return bProgress - aProgress;
    });
  
  // Get locked achievements (no progress yet)
  const lockedAchievements = localAchievements
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
  
  const handlePrestigeClick = (achievementId: string) => {
    const achievement = localAchievements.find(a => a.id === achievementId);
    if (achievement) {
      setPrestigeAchievement(achievement);
      setPrestigeDialogOpen(true);
    }
  };
  
  const handlePrestigeConfirm = (achievementId: string) => {
    // Update the achievement with prestige status
    const updatedAchievements = localAchievements.map(achievement => {
      if (achievement.id === achievementId) {
        const currentPrestige = achievement.prestige || 0;
        const prestigeBonus = achievement.prestigeBonus || Math.round(achievement.points * 0.25);
        
        return {
          ...achievement,
          prestige: currentPrestige + 1,
          prestigeBonus: (achievement.prestigeBonus || 0) + prestigeBonus
        };
      }
      return achievement;
    });
    
    setLocalAchievements(updatedAchievements);
    
    // In a real implementation, you would persist this to the database
    // For now, just update the local state and show a toast
    toast.success("Achievement prestiged!", {
      description: "Your achievement has been prestiged and you've earned bonus points!",
      icon: <Trophy className="h-5 w-5 text-yellow-500" />
    });
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
            Prestige your achievements to earn bonus points and special recognition.
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
        
        {employeeId && <AIAchievementIdeas employeeId={employeeId} />}
        
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
            onPrestige={handlePrestigeClick}
          />
        )}
        
        {unlockedAchievements.length > 0 && (
          <AchievementSection
            title="Unlocked Achievements"
            description="Achievements you've already earned. Prestige them for bonus points!"
            achievements={unlockedAchievements}
            filter={activeCategory === 'all' ? undefined : activeCategory}
            onPrestige={handlePrestigeClick}
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
      
      <PrestigeAchievementDialog
        achievement={prestigeAchievement}
        open={prestigeDialogOpen}
        onOpenChange={setPrestigeDialogOpen}
        onPrestige={handlePrestigeConfirm}
      />
    </div>
  );
}
