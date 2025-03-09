
import { AIRecommendation } from "./ai";

export interface EmployeeNotification {
  id: string;
  employee_id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "achievement";
  is_read: boolean;
  created_at: string;
  ai_metadata?: AIRecommendation;
}

export interface NotificationSettings {
  id?: string;
  employee_id: string;
  shift_reminders: boolean;
  achievement_alerts: boolean;
  ai_insights: boolean;
  team_updates: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AchievementProgress {
  id: string;
  employee_id: string;
  achievement_id: string;
  achievement_name: string;
  progress_percentage: number;
  updated_at: string;
}

export interface EmployeeLocation {
  id: string;
  employee_id: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: string;
  is_on_clock: boolean;
}
