import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TransportRecord } from '@/types/dispatch';
import { toast } from 'sonner';

export function useTransportRecord(id: string) {
  const queryClient = useQueryClient();

  const { data: transport, isLoading, error } = useQuery({
    queryKey: ['transport', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transport_records')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as TransportRecord;
    }
  });

  const updateTransport = useMutation({
    mutationFn: async (updates: Partial<TransportRecord>) => {
      const { error } = await supabase
        .from('transport_records')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transport', id] });
      toast.success('Transport record updated successfully');
    },
    onError: (error) => {
      console.error('Error updating transport:', error);
      toast.error('Failed to update transport record');
    }
  });

  return {
    transport,
    isLoading,
    error,
    updateTransport
  };
}