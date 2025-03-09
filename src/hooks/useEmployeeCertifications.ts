
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Certificate, ContinuingEducation, PracticeLevel } from "@/types/employee";

// Mock data - would be replaced by actual API calls
const mockCertificates = [
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
    status: "Active" as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    modified_by: "Karpinski, Danielle"
  }
];

const mockPracticeLevels = [
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

const mockContinuingEducation: ContinuingEducation[] = [];

export const useEmployeeCertifications = (employeeId?: string) => {
  const queryClient = useQueryClient();

  // Get certificates
  const { data: certificates = mockCertificates, isLoading: loadingCertificates } = useQuery({
    queryKey: ["employee_certificates", employeeId],
    queryFn: async () => {
      if (!employeeId) return mockCertificates;

      // In a real implementation, this would fetch from the database
      // const { data, error } = await supabase
      //   .from("employee_certificates")
      //   .select("*")
      //   .eq("employee_id", employeeId);

      // if (error) throw error;
      // return data as Certificate[];

      // For now, return mock data filtered by employee ID
      return mockCertificates.filter(cert => cert.employee_id === employeeId);
    },
    enabled: !!employeeId
  });

  // Get continuing education
  const { data: continuingEducation = mockContinuingEducation, isLoading: loadingCE } = useQuery({
    queryKey: ["employee_continuing_education", employeeId],
    queryFn: async () => {
      if (!employeeId) return mockContinuingEducation;
      
      // In a real implementation, this would fetch from the database
      // For now, return mock data
      return mockContinuingEducation;
    },
    enabled: !!employeeId
  });

  // Get practice levels
  const { data: practiceLevels = mockPracticeLevels, isLoading: loadingLevels } = useQuery({
    queryKey: ["employee_practice_levels", employeeId],
    queryFn: async () => {
      if (!employeeId) return mockPracticeLevels;
      
      // In a real implementation, this would fetch from the database
      // For now, return mock data filtered by employee ID
      return mockPracticeLevels.filter(level => level.employee_id === employeeId);
    },
    enabled: !!employeeId
  });

  // Add certificate mutation
  const addCertificate = useMutation({
    mutationFn: async (newCertificate: Omit<Certificate, "id" | "created_at" | "updated_at">) => {
      if (!employeeId) throw new Error("Employee ID is required");
      
      // In a real implementation, this would insert into the database
      // const { data, error } = await supabase
      //   .from("employee_certificates")
      //   .insert({ ...newCertificate, employee_id: employeeId })
      //   .select()
      //   .single();

      // if (error) throw error;
      // return data;

      // For now, just simulate adding to mock data
      const newCert = {
        ...newCertificate,
        id: `cert-${Date.now()}`,
        employee_id: employeeId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Certificate;
      
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
          const expiryDate = new Date(cert.expires);
          const today = new Date();
          const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
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
    getAICertificationRecommendations
  };
};
