import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";

export interface TransportRecordWithPatient extends TransportRecord {
  patients?: {
    id: string;
    first_name: string;
    last_name: string;
    medical_conditions?: string[];
  };
}

export function useTransportRecords() {
  const queryClient = useQueryClient();

  // Query for fetching transport records
  const { data: transportRecords, isLoading, error } = useQuery({
    queryKey: ['transport_records'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transport_records')
        .select(`
          *,
          patients (
            id,
            first_name,
            last_name,
            medical_conditions
          )
        `)
        .order('scheduled_time', { ascending: true });

      if (error) {
        console.error('Error fetching transport records:', error);
        toast.error('Failed to fetch transport records');
        throw error;
      }

      return data as TransportRecordWithPatient[];
    }
  });

  // Mutation for updating transport records
  const updateTransport = useMutation({
    mutationFn: async (updates: Partial<TransportRecord>) => {
      const { error } = await supabase
        .from('transport_records')
        .update(updates)
        .eq('id', updates.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transport_records'] });
      toast.success('Transport record updated successfully');
    },
    onError: (error) => {
      console.error('Error updating transport:', error);
      toast.error('Failed to update transport record');
    }
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('transport_records_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'transport_records' 
        }, 
        (payload) => {
          console.log('Real-time update received:', payload);
          queryClient.invalidateQueries({ queryKey: ['transport_records'] });
          
          // Show toast notification based on the type of change
          switch (payload.eventType) {
            case 'INSERT':
              toast.info('New transport record created');
              break;
            case 'UPDATE':
              toast.info('Transport record updated');
              break;
            case 'DELETE':
              toast.info('Transport record deleted');
              break;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return {
    transportRecords,
    isLoading,
    error,
    updateTransport
  };
}