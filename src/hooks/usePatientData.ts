import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function usePatientData(patientId?: string) {
  const queryClient = useQueryClient();

  const { data: patient, isLoading, error } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: async () => {
      if (!patientId) return null;

      console.log('Fetching patient data for ID:', patientId);

      // Check if the ID is in PAT-XXX format
      const isPATFormat = patientId.startsWith('PAT-');
      
      const { data, error } = await supabase
        .from('patients')
        .select(`
          *,
          medical_records (*),
          insurance_policies (*),
          appointments (*)
        `)
        .eq(isPATFormat ? 'legacy_display_id' : 'id', patientId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching patient:', error);
        toast.error('Failed to fetch patient data');
        throw error;
      }

      console.log('Fetched patient data:', data);
      return data;
    },
    enabled: !!patientId
  });

  const updatePatient = useMutation({
    mutationFn: async (updates: Partial<typeof patient>) => {
      if (!patientId) throw new Error('No patient ID provided');

      console.log('Updating patient with ID:', patientId, 'Updates:', updates);

      // Check if the ID is in PAT-XXX format
      const isPATFormat = patientId.startsWith('PAT-');
      
      const { error } = await supabase
        .from('patients')
        .update(updates)
        .eq(isPATFormat ? 'legacy_display_id' : 'id', patientId);

      if (error) {
        console.error('Error updating patient:', error);
        throw error;
      }
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