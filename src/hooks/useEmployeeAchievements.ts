
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

  // Calculate employee level based on achievements (placeholder implementation)
  const { data: employeeLevel = 1, isLoading: isLevelLoading } = useQuery({
    queryKey: ['employee-level', employeeId],
    queryFn: async () => {
      if (!employeeId) return 1;
      
      // In a real implementation, this would calculate the level based on 
      // the employee's points or achievements in the database
      
      // Placeholder implementation
      const { data } = await supabase
        .from('achievements' as any)
        .select('*')
        .eq('employee_id', employeeId)
        .count();
        
      const achievementCount = data || 0;
      // Simple formula: 1 level per 5 achievements, starting at level 1
      const level = Math.floor(achievementCount / 5) + 1;
      
      return level;
    },
    enabled: !!employeeId
  });

  return {
    employeeLevel,
    isLevelLoading,
    isProcessing,
    getAchievementIdeas,
    createAchievementFromIdea
  };
};
