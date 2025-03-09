
export type AchievementCategory = 'clinical' | 'teamwork' | 'education' | 'operational' | 'leadership' | 'community';
export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  rarity: AchievementRarity;
  category: AchievementCategory;
  points: number;
  unlocked?: boolean;
  dateUnlocked?: string;
  progress?: number;
  maxProgress?: number;
  criteria: string;
  isSecret?: boolean;
  prestige?: number; // Number of times this achievement has been prestiged
  prestigeBonus?: number; // Additional points earned from prestiging
  canPrestige?: boolean; // Whether this achievement can be prestiged
  prestigeRequirements?: string; // Requirements to prestige this achievement
}

export interface CategorySummary {
  category: AchievementCategory;
  totalAchievements: number;
  unlockedAchievements: number;
  totalPoints: number;
  earnedPoints: number;
  nextAchievement?: Achievement;
}

export interface AchievementSummaryProps {
  totalPoints: number;
  earnedPoints: number;
  totalAchievements: number;
  unlockedAchievements: number;
  categorySummaries: CategorySummary[];
}

export interface CategoryFilterProps {
  activeCategory: AchievementCategory | 'all';
  onCategoryChange: (category: AchievementCategory | 'all') => void;
}
