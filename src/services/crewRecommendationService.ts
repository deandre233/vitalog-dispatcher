
import { supabase } from "@/integrations/supabase/client";
import { Employee, AICrewRecommendation, CapabilityAlert } from "@/types/employee";
import { logger } from "@/utils/logger";
import { handleError } from "@/utils/errorHandling";

export const crewRecommendationService = {
  /**
   * Get AI recommendations for crew assignment based on requirements
   */
  getRecommendedCrew: async (requirements: {
    serviceType: string;
    requiredCertifications: string[];
    startTime: string;
    location?: string;
  }): Promise<AICrewRecommendation[]> => {
    try {
      logger.info('Getting crew recommendations', requirements);
      
      // In a real implementation, this would call a Supabase function
      // For now, we'll simulate with local logic
      
      // Get all available employees
      const { data: employees, error } = await supabase
        .from('employees')
        .select(`
          id,
          first_name,
          last_name,
          certification_level,
          status,
          station,
          employee_type
        `)
        .eq('status', 'Active');
      
      if (error) throw error;
      
      // Simulate AI scoring based on requirements
      const recommendations = (employees as Employee[]).map(employee => {
        // Calculate match score based on certification and availability
        const certificationMatch = employee.certification_level === requirements.serviceType ? 1 : 0.5;
        const availabilityScore = employee.status === 'Active' ? 1 : 0;
        const locationMatch = employee.station === requirements.location ? 1 : 0.7;
        
        const totalScore = (certificationMatch + availabilityScore + locationMatch) / 3;
        
        return {
          employeeId: employee.id,
          matchScore: totalScore * 100,
          reasons: [
            certificationMatch === 1 ? 'Perfect certification match' : 'Partial certification match',
            availabilityScore === 1 ? 'Currently available' : 'Limited availability',
            locationMatch === 1 ? 'Already stationed at required location' : 'Needs to travel to location'
          ],
          availabilityScore: availabilityScore * 100,
          skillMatchScore: certificationMatch * 100,
          certificationMatchScore: certificationMatch * 100,
          warnings: totalScore < 0.6 ? ['May not be ideal for this assignment'] : undefined
        };
      });
      
      // Sort by match score descending
      return recommendations.sort((a, b) => b.matchScore - a.matchScore);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  
  /**
   * Get alerts for employee capabilities and status issues
   */
  getCapabilityAlerts: async (): Promise<CapabilityAlert[]> => {
    try {
      logger.info('Getting capability alerts');
      
      // In a real implementation, this would be more sophisticated
      // For now we'll return some mock alerts
      return [
        {
          employeeId: '1',
          type: 'expiring',
          message: 'CPR certification expires in 14 days',
          severity: 'medium',
          relatedTo: 'CPR'
        },
        {
          employeeId: '2',
          type: 'missing',
          message: 'ACLS certification required for current role',
          severity: 'high',
          relatedTo: 'ACLS'
        }
      ];
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  
  /**
   * Check if an employee is eligible for a specific assignment
   */
  checkEligibility: async (employeeId: string, assignmentType: string): Promise<{
    eligible: boolean;
    reasons: string[];
  }> => {
    try {
      logger.info(`Checking eligibility for employee ${employeeId} for ${assignmentType}`);
      
      // In a real implementation, this would check against database records
      // For now we'll simulate a response
      return {
        eligible: Math.random() > 0.3, // 70% chance of being eligible
        reasons: ['Certification matches requirements', 'Currently available']
      };
    } catch (error) {
      handleError(error);
      throw error;
    }
  }
};
