
import { ReactNode } from "react";

export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type AchievementCategory = 'clinical' | 'teamwork' | 'education' | 'operational' | 'leadership' | 'community';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  rarity: AchievementRarity;
  category: AchievementCategory;
  points: number;
  unlocked: boolean;
  dateUnlocked?: string;
  progress?: number;
  maxProgress?: number;
  criteria: string;
  isSecret?: boolean;
}

export interface CategorySummary {
  category: AchievementCategory;
  totalAchievements: number;
  unlockedAchievements: number;
  totalPoints: number;
  earnedPoints: number;
  nextAchievement?: Achievement;
}

export interface AchievementSectionProps {
  title: string;
  description: string;
  achievements: Achievement[];
  filter?: AchievementCategory;
}

export interface AchievementCardProps {
  achievement: Achievement;
}

export interface AchievementProgressProps {
  achievement: Achievement;
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

export interface AchievementDetailDialogProps {
  achievement: Achievement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
