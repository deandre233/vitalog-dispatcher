
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Certificate, ContinuingEducation, PracticeLevel } from "@/types/employee";
import { differenceInDays } from "date-fns";

// Mock data for certificates - enhanced with more realistic data
const mockCertificates: Certificate[] = [
  {
    id: "1",
    employee_id: "5003c1b9-5deb-4558-9fb0-c292eb72eabf",
    cert_class: "Normal",
    cert_type: "BLS - Basic/EMT",
    state: "CA",
    id_number: "E003493",
    valid_from: "2023-03-26",
    expires: "2025-03-31",
    notes: "",
    status: "Active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    modified_by: "Karpinski, Danielle"
  },
  {
    id: "2",
    employee_id: "5003c1b9-5deb-4558-9fb0-c292eb72eabf",
    cert_class: "Normal",
    cert_type: "CPR - Healthcare Provider",
    state: "CA",
    id_number: "CPR87265",
    valid_from: "2023-05-12",
    expires: "2025-05-12",
    notes: "American Heart Association",
    status: "Active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    modified_by: "System Import"
  },
  {
    id: "3",
    employee_id: "5003c1b9-5deb-4558-9fb0-c292eb72eabf",
    cert_class: "Advanced",
    cert_type: "PHTLS - Prehospital Trauma Life Support",
    state: "CA",
    id_number: "PH78521",
    valid_from: "2023-08-05",
    expires: "2024-08-05",
    notes: "NAEMT certification",
    status: "Active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    modified_by: "Martinez, James"
  }
];

// Enhanced practice levels with the same data structure but more detail
const mockPracticeLevels: PracticeLevel[] = [
  {
    id: "9925001",
    employee_id: "5003c1b9-5deb-4558-9fb0-c292eb72eabf",
    nemesis_id: "9925001",
    practice_level: "EMT - Advanced [AEMT]",
    achieved_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "9925002",
    employee_id: "5003c1b9-5deb-4558-9fb0-c292eb72eabf",
    nemesis_id: "9925002",
    practice_level: "EMT - Intermediate [EMT-I]",
    achieved_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "9925003",
    employee_id: "5003c1b9-5deb-4558-9fb0-c292eb72eabf",
    nemesis_id: "9925003",
    practice_level: "Emergency Medical Responder [EMR]",
    achieved_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "9925005",
    employee_id: "5003c1b9-5deb-4558-9fb0-c292eb72eabf",
    nemesis_id: "9925005",
    practice_level: "EMT - Basic",
    achieved_date: "[auto]",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "9925007",
    employee_id: "5003c1b9-5deb-4558-9fb0-c292eb72eabf",
    nemesis_id: "9925007",
    practice_level: "Paramedic",
    achieved_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Mock continuing education data
const mockContinuingEducation: ContinuingEducation[] = [
  {
    id: "ce001",
    employee_id: "5003c1b9-5deb-4558-9fb0-c292eb72eabf",
    title: "Advanced Airway Management",
    hours: 5,
    applies_to: "EMT Recertification",
    earned_date: "2023-09-15",
    notes: "Online training through National Registry",
    status: "Approved",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    modified_by: "System"
  },
  {
    id: "ce002",
    employee_id: "5003c1b9-5deb-4558-9fb0-c292eb72eabf",
    title: "Emergency Cardiac Care Update",
    hours: 3.5,
    applies_to: "BLS Recertification",
    earned_date: "2023-10-22",
    notes: "Conducted by Dr. Sarah Johnson",
    status: "Approved",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    modified_by: "Rivera, Maria"
  },
  {
    id: "ce003",
    employee_id: "5003c1b9-5deb-4558-9fb0-c292eb72eabf",
    title: "Trauma Assessment Skills Workshop",
    hours: 8,
    applies_to: "PHTLS Renewal",
    earned_date: "2023-11-05",
    notes: "In-person workshop at Memorial Hospital",
    status: "Approved",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    modified_by: "Williams, Robert"
  }
];

// Calculate days until expiry for all certificates
const calculateDaysUntilExpiry = (certificates: Certificate[]): Certificate[] => {
  const today = new Date();
  
  return certificates.map(cert => {
    const expiryDate = new Date(cert.expires);
    const daysUntilExpiry = differenceInDays(expiryDate, today);
    
    return {
      ...cert,
      daysUntilExpiry
    };
  });
};

export const useEmployeeCertifications = (employeeId?: string) => {
  const queryClient = useQueryClient();

  // Get certificates
  const { data: certificates = [], isLoading: loadingCertificates } = useQuery({
    queryKey: ["employee_certificates", employeeId],
    queryFn: async () => {
      if (!employeeId) return [];

      // In a real implementation, this would fetch from the database
      // For now, return mock data filtered by employee ID and with days until expiry
      const filteredCerts = mockCertificates.filter(cert => cert.employee_id === employeeId);
      return calculateDaysUntilExpiry(filteredCerts);
    },
    enabled: !!employeeId
  });

  // Get continuing education
  const { data: continuingEducation = [], isLoading: loadingCE } = useQuery({
    queryKey: ["employee_continuing_education", employeeId],
    queryFn: async () => {
      if (!employeeId) return [];
      
      // In a real implementation, this would fetch from the database
      return mockContinuingEducation.filter(ce => ce.employee_id === employeeId);
    },
    enabled: !!employeeId
  });

  // Get practice levels
  const { data: practiceLevels = [], isLoading: loadingLevels } = useQuery({
    queryKey: ["employee_practice_levels", employeeId],
    queryFn: async () => {
      if (!employeeId) return [];
      
      // In a real implementation, this would fetch from the database
      return mockPracticeLevels.filter(level => level.employee_id === employeeId);
    },
    enabled: !!employeeId
  });

  // Add certificate mutation
  const addCertificate = useMutation({
    mutationFn: async (newCertificate: Omit<Certificate, "id" | "created_at" | "updated_at" | "daysUntilExpiry">) => {
      if (!employeeId) throw new Error("Employee ID is required");
      
      // In a real implementation, this would insert into the database
      // For now, just simulate adding to mock data
      const newCert = {
        ...newCertificate,
        id: `cert-${Date.now()}`,
        employee_id: employeeId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Certificate;
      
      // Calculate days until expiry
      const expiryDate = new Date(newCert.expires);
      const today = new Date();
      const daysUntilExpiry = differenceInDays(expiryDate, today);
      newCert.daysUntilExpiry = daysUntilExpiry;
      
      return newCert;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee_certificates", employeeId] });
      toast({
        title: "Success",
        description: "Certificate added successfully",
      });
    }
  });

  // Add continuing education mutation
  const addContinuingEducation = useMutation({
    mutationFn: async (newCE: Omit<ContinuingEducation, "id" | "created_at" | "updated_at">) => {
      if (!employeeId) throw new Error("Employee ID is required");
      
      // In a real implementation, this would insert into the database
      // For now, just simulate adding to mock data
      const newCEEntry = {
        ...newCE,
        id: `ce-${Date.now()}`,
        employee_id: employeeId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as ContinuingEducation;
      
      return newCEEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee_continuing_education", employeeId] });
      toast({
        title: "Success",
        description: "Continuing education record added successfully",
      });
    }
  });

  // Update practice level mutation
  const updatePracticeLevel = useMutation({
    mutationFn: async ({ id, achieved_date }: { id: string, achieved_date: string }) => {
      if (!employeeId) throw new Error("Employee ID is required");
      
      // In a real implementation, this would update the database
      // For now, just simulate updating mock data
      return { id, achieved_date };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee_practice_levels", employeeId] });
      toast({
        title: "Success",
        description: "Practice level updated successfully",
      });
    }
  });

  // Get AI recommendations for certifications
  const getAICertificationRecommendations = useMutation({
    mutationFn: async () => {
      if (!employeeId) throw new Error("Employee ID is required");
      
      // This would be a real API call to get AI recommendations
      // For now, simulate a recommendation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        recommendations: [
          "Based on the employee's EMT - Basic certification, they should consider obtaining Advanced Cardiac Life Support (ACLS) certification",
          "Pediatric Advanced Life Support (PALS) certification would enhance their qualifications",
          "For career advancement, consider pursuing Paramedic certification within the next 12-18 months"
        ],
        expiringCertifications: certificates.filter(cert => {
          const daysUntilExpiry = cert.daysUntilExpiry || 0;
          return daysUntilExpiry < 90; // Expiring in less than 90 days
        }),
        missingRequiredCertifications: [
          "CPR for Healthcare Providers"
        ]
      };
    },
    onSuccess: (data) => {
      toast({
        title: "AI Recommendations Generated",
        description: `${data.recommendations.length} recommendations found`,
      });
    }
  });

  return {
    certificates,
    continuingEducation,
    practiceLevels,
    isLoading: loadingCertificates || loadingCE || loadingLevels,
    addCertificate,
    addContinuingEducation,
    updatePracticeLevel,
    getAICertificationRecommendations
  };
};
