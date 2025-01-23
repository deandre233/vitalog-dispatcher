import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";

export function useAppointments(patientId?: string) {
  const queryClient = useQueryClient();

  const { data: appointments, isLoading, error } = useQuery({
    queryKey: ['appointments', patientId],
    queryFn: async () => {
      const query = supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true });

      if (patientId) {
        query.eq('patient_id', patientId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching appointments:', error);
        toast.error('Failed to fetch appointments');
        throw error;
      }

      return data;
    },
    enabled: true
  });

  const updateAppointment = useMutation({
    mutationFn: async (updates: any) => {
      const { error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', updates.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments', patientId] });
      toast.success('Appointment updated successfully');
    },
    onError: (error) => {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment');
    }
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('appointments_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'appointments',
          filter: patientId ? `patient_id=eq.${patientId}` : undefined
        }, 
        (payload) => {
          console.log('Real-time appointment update received:', payload);
          queryClient.invalidateQueries({ queryKey: ['appointments', patientId] });
          
          switch (payload.eventType) {
            case 'INSERT':
              toast.info('New appointment scheduled');
              break;
            case 'UPDATE':
              toast.info('Appointment updated');
              break;
            case 'DELETE':
              toast.info('Appointment cancelled');
              break;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, patientId]);

  return {
    appointments,
    isLoading,
    error,
    updateAppointment
  };
}