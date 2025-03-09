
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface PayrollHistory {
  id: number;
  effective_date: string;
  end_date: string | null;
  author: string;
  is_active: boolean;
  employee_type: string;
  keys_and_codes: string | null;
  pay_type: string;
  pay_rate: number;
}

interface PayrollProjection {
  period: string;
  hours: number;
  amount: number;
}

interface AIRecommendation {
  type: string;
  description: string;
  confidence: number;
}

export function useEmployeePayroll(employeeId: string | undefined) {
  const queryClient = useQueryClient();

  // Fetch payroll history
  const { data: payrollHistory, isLoading, error } = useQuery({
    queryKey: ['payrollHistory', employeeId],
    queryFn: async () => {
      // For demo, returning mock data
      // In a real app, this would fetch from an API
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      return [
        {
          id: 15,
          effective_date: "2023-06-14T13:08:00Z",
          end_date: null,
          author: "Baker, Justin",
          is_active: true,
          employee_type: "Full-time",
          keys_and_codes: null,
          pay_type: "Hourly",
          pay_rate: 20.00
        },
        {
          id: 8,
          effective_date: "2022-05-23T00:00:00Z",
          end_date: "2023-06-14T13:08:00Z",
          author: "Administrator",
          is_active: true,
          employee_type: "Full-time",
          keys_and_codes: null,
          pay_type: "Hourly",
          pay_rate: 20.00
        }
      ] as PayrollHistory[];
    },
    enabled: !!employeeId
  });

  // Get AI recommendations
  const { data: aiRecommendations } = useQuery({
    queryKey: ['payrollAI', employeeId],
    queryFn: async () => {
      // For demo, returning mock data
      // In a real app, this would call an AI service
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate AI processing
      
      return [
        {
          type: "payGrade",
          description: "Based on performance metrics, consider a 5% increase in base pay.",
          confidence: 0.85
        },
        {
          type: "scheduling",
          description: "Employee has shown higher productivity during morning shifts.",
          confidence: 0.78
        },
        {
          type: "overtime",
          description: "Overtime patterns suggest potential for schedule optimization.",
          confidence: 0.92
        }
      ] as AIRecommendation[];
    },
    enabled: !!employeeId
  });

  // Calculate payroll projections based on current pay rate
  const payrollProjections = payrollHistory?.length ? [
    { period: "Daily", hours: 8, amount: payrollHistory[0].pay_rate * 8 },
    { period: "Weekly", hours: 40, amount: payrollHistory[0].pay_rate * 40 },
    { period: "Bi-weekly", hours: 80, amount: payrollHistory[0].pay_rate * 80 },
    { period: "Monthly", hours: 166.7, amount: payrollHistory[0].pay_rate * 166.7 },
    { period: "Annually", hours: 2000, amount: payrollHistory[0].pay_rate * 2000 }
  ] : [];

  // Mutation to update payroll info
  const updatePayroll = useMutation({
    mutationFn: async (data: any) => {
      // In a real app, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 500));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payrollHistory', employeeId] });
    }
  });

  // Function to generate a full payroll report with AI analysis
  const generatePayrollReport = async () => {
    // In a real app, this would call an API to generate a report
    console.log("Generating payroll report with AI analysis");
    return true;
  };

  return {
    payrollHistory,
    payrollProjections,
    aiRecommendations,
    isLoading,
    error,
    updatePayroll,
    generatePayrollReport
  };
}
