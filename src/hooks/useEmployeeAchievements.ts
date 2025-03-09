
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Achievement, AchievementCategory } from "@/components/hr/tabs/achievements/types/achievementTypes";

export const useEmployeeAchievements = (employeeId?: string) => {
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  // Get AI-generated achievement ideas
  const getAchievementIdeas = async (category?: AchievementCategory) => {
    if (!employeeId) {
      throw new Error("Employee ID is required");
    }
    
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-achievement-ideas', {
        body: { 
          employeeId,
          category: category || 'all'
        }
      });
      
      if (error) {
        console.error("Error generating achievement ideas:", error);
        throw error;
      }
      
      return data.achievementIdeas;
    } finally {
      setIsProcessing(false);
    }
  };

  // Create achievement from an idea
  const createAchievementFromIdea = async (idea: any, category: AchievementCategory) => {
    if (!employeeId) {
      throw new Error("Employee ID is required");
    }
    
    // Here you'd implement the logic to create a new achievement
    // This is a placeholder that would be connected to your actual achievements system
    toast.success(`New achievement created: ${idea.name}`);
    
    // In a real implementation, this would create a record in your achievements table
    // and refresh the achievements list
    
    return { success: true };
  };

  // Analyze employee performance for achievements
  const analyzePerformanceForAchievements = async () => {
    if (!employeeId) {
      throw new Error("Employee ID is required");
    }
    
    setIsProcessing(true);
    
    try {
      // This would be a real API call in production
      const { data, error } = await supabase.functions.invoke('analyze-employee-achievements', {
        body: { 
          employeeId
        }
      });
      
      if (error) {
        console.error("Error analyzing employee performance:", error);
        throw error;
      }
      
      if (data.newAchievements && data.newAchievements.length > 0) {
        toast.success(`Found ${data.newAchievements.length} new achievements!`);
      }
      
      return data;
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate employee level based on achievements
  const { data: employeeLevel = 1, isLoading: isLevelLoading } = useQuery({
    queryKey: ['employee-level', employeeId],
    queryFn: async () => {
      if (!employeeId) return 1;
      
      // In a real implementation, this would calculate the level based on 
      // the employee's points or achievements in the database
      
      // Placeholder implementation
      const { data, error } = await supabase
        .from('achievements' as any)
        .select('*')
        .eq('employee_id', employeeId);
        
      if (error) {
        console.error("Error fetching achievements:", error);
        return 1;
      }
      
      const achievementCount = data ? data.length : 0;
      // Simple formula: 1 level per 5 achievements, starting at level 1
      const level = Math.floor(achievementCount / 5) + 1;
      
      return level;
    },
    enabled: !!employeeId
  });

  // Get achievement progress predictions
  const getAchievementPredictions = async () => {
    if (!employeeId) {
      throw new Error("Employee ID is required");
    }
    
    setIsProcessing(true);
    
    try {
      // This would call a real AI analysis endpoint in production
      // Here we're simulating it with a placeholder
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulated response
      return [
        {
          achievementId: "dispatch-001",
          name: "Dispatch Veteran",
          currentProgress: 772,
          maxProgress: 1000,
          estimatedCompletionDate: "2024-03-15",
          confidence: 0.89
        },
        {
          achievementId: "shifts-001",
          name: "Shift Master",
          currentProgress: 202,
          maxProgress: 300,
          estimatedCompletionDate: "2024-05-10",
          confidence: 0.78
        },
        {
          achievementId: "miles-001",
          name: "Road Warrior",
          currentProgress: 5601,
          maxProgress: 10000,
          estimatedCompletionDate: "2024-06-22",
          confidence: 0.64
        }
      ];
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    employeeLevel,
    isLevelLoading,
    isProcessing,
    getAchievementIdeas,
    createAchievementFromIdea,
    analyzePerformanceForAchievements,
    getAchievementPredictions
  };
};
