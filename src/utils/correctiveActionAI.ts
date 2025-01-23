import { supabase } from "@/integrations/supabase/client";

interface AICorrectiveActionSuggestion {
  actionType: string;
  description: string;
  improvementPlan: string;
  followUpDate: Date;
}

export async function generateCorrectiveAction(
  employeeId: string,
  incident: string,
  severity: 'low' | 'medium' | 'high'
): Promise<AICorrectiveActionSuggestion> {
  try {
    // Fetch employee roles to check permissions
    const { data: roles, error: rolesError } = await supabase
      .from('employee_roles')
      .select('*')
      .eq('employee_id', employeeId)
      .single();

    if (rolesError) throw rolesError;

    // Only allow generation for authorized roles
    if (!roles.is_hr && !roles.is_administrator && !roles.is_supervisor) {
      throw new Error('Unauthorized to generate corrective actions');
    }

    // In a real implementation, this would call an AI service
    // For now, we'll return a template based on severity
    const suggestions: Record<string, AICorrectiveActionSuggestion> = {
      low: {
        actionType: 'Verbal Warning',
        description: `Employee counseling required regarding: ${incident}`,
        improvementPlan: 'Review relevant policies and procedures. Schedule follow-up meeting in 30 days.',
        followUpDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      medium: {
        actionType: 'Written Warning',
        description: `Formal documentation of incident: ${incident}`,
        improvementPlan: 'Complete additional training. Weekly check-ins for 60 days.',
        followUpDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      },
      high: {
        actionType: 'Final Warning',
        description: `Serious violation regarding: ${incident}`,
        improvementPlan: 'Immediate performance improvement plan. Daily supervision for 90 days.',
        followUpDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
    };

    return suggestions[severity];
  } catch (error) {
    console.error('Error generating corrective action:', error);
    throw error;
  }
}