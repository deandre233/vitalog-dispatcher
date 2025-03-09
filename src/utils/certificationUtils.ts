
import { Certificate } from "@/types/employee";

/**
 * Calculates days until a certification expires
 * @param expiresDate Expiration date string
 * @returns Number of days until expiration, or -1 if already expired
 */
export const daysUntilExpiry = (expiresDate: string): number => {
  if (!expiresDate) return -1;
  
  const today = new Date();
  const expiry = new Date(expiresDate);
  
  // Return -1 if already expired
  if (expiry < today) return -1;
  
  // Calculate days until expiry
  return Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

/**
 * Checks if a certification is expiring soon
 * @param certificate Certificate object 
 * @param thresholdDays Days threshold to consider "expiring soon"
 * @returns Boolean indicating if certification is expiring soon
 */
export const isExpiringSoon = (certificate: Certificate, thresholdDays = 90): boolean => {
  const days = daysUntilExpiry(certificate.expires);
  return days >= 0 && days <= thresholdDays;
};

/**
 * Gets all certifications that are expired or expiring soon
 * @param certificates Array of certificates
 * @param thresholdDays Days threshold to consider "expiring soon"
 * @returns Object containing expired and expiring certifications
 */
export const getExpirationWarnings = (certificates: Certificate[], thresholdDays = 90) => {
  const expired: Certificate[] = [];
  const expiringSoon: Certificate[] = [];
  
  certificates.forEach(cert => {
    const days = daysUntilExpiry(cert.expires);
    
    if (days < 0) {
      expired.push(cert);
    } else if (days <= thresholdDays) {
      expiringSoon.push({...cert, daysUntilExpiry: days});
    }
  });
  
  return {
    expired,
    expiringSoon,
    hasWarnings: expired.length > 0 || expiringSoon.length > 0
  };
};

/**
 * Gets certification requirements based on job title or role
 * @param jobTitle Job title or role
 * @returns Array of required certification types
 */
export const getRequiredCertifications = (jobTitle: string): string[] => {
  const requirements: Record<string, string[]> = {
    "Paramedic": ["Paramedic", "ACLS", "PALS", "CPR"],
    "EMT": ["EMT-Basic", "CPR"],
    "Advanced EMT": ["EMT-Advanced", "CPR"],
    "EMT-Intermediate": ["EMT-Intermediate", "CPR"],
    "Emergency Medical Responder": ["EMR", "CPR"],
    "Critical Care Paramedic": ["Paramedic", "ACLS", "PALS", "CCEMTP", "CPR"],
    "Supervisor": ["CPR", "Management Training"]
  };
  
  return requirements[jobTitle] || ["CPR"]; // Default to at least CPR
};

/**
 * Suggests additional certifications based on current role and career goals
 * @param currentRole Current job title or role
 * @param careerGoal Target career position
 * @param currentCertifications Array of current certification types
 * @returns Suggested certifications
 */
export const suggestAdditionalCertifications = (
  currentRole: string,
  careerGoal: string,
  currentCertifications: string[]
): string[] => {
  // Career path suggestions
  const careerPathSuggestions: Record<string, Record<string, string[]>> = {
    "EMT": {
      "Paramedic": ["AEMT", "Anatomy & Physiology", "ECG Interpretation"],
      "Critical Care": ["AEMT", "Anatomy & Physiology", "ECG Interpretation", "Critical Care Transport"],
      "Supervisor": ["Leadership Development", "Incident Command", "Field Training Officer"]
    },
    "Paramedic": {
      "Critical Care": ["CCEMTP", "Flight Paramedic", "Critical Care Transport"],
      "Supervisor": ["Leadership Development", "Incident Command", "EMS Administration"],
      "Educator": ["Instructor/Coordinator", "Teaching Methods", "Education Technology"]
    }
  };
  
  // Get required certs for career goal
  const required = getRequiredCertifications(careerGoal);
  
  // Get suggested certs for career path
  const pathSuggestions = 
    (careerPathSuggestions[currentRole] && careerPathSuggestions[currentRole][careerGoal]) || 
    [];
  
  // Combine and filter out certificates already held
  const currentCertsLower = currentCertifications.map(c => c.toLowerCase());
  
  return [...required, ...pathSuggestions].filter(
    cert => !currentCertsLower.includes(cert.toLowerCase())
  );
};
