import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { InsuranceRecord } from '@/types/dispatch';

export const useInsuranceAnalysis = (patientId: string) => {
  const { data: insuranceRecords, isLoading, error } = useQuery({
    queryKey: ['insurance-analysis', patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('insurance_records')
        .select('*')
        .eq('patient_id', patientId);

      if (error) throw error;
      return data as InsuranceRecord[];
    }
  });

  return {
    insuranceRecords,
    isLoading,
    error: error?.message
  };
};