import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function usePatientData(patientId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: patient, isLoading, error } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: async () => {
      if (!patientId) return null;

      const { data, error } = await supabase
        .from('patients')
        .select(`
          *,
          medical_records (*),
          insurance_policies (*),
          appointments (*)
        `)
        .eq('id', patientId)
        .single();

      if (error) {
        console.error('Error fetching patient:', error);
        toast.error('Failed to fetch patient data');
        throw error;
      }

      return data;
    },
    enabled: !!patientId
  });

  const updatePatient = useMutation({
    mutationFn: async (updates: Partial<typeof patient>) => {
      if (!patientId) throw new Error('No patient ID provided');

      const { error } = await supabase
        .from('patients')
        .update(updates)
        .eq('id', patientId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient', patientId] });
      toast.success('Patient information updated successfully');
    },
    onError: (error) => {
      console.error('Error updating patient:', error);
      toast.error('Failed to update patient information');
    }
  });

  return {
    patient,
    isLoading,
    error,
    updatePatient
  };
}