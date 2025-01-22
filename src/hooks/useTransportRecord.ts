import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TransportRecord } from '@/types/dispatch';

export function useTransportRecord(id?: string) {
  const queryClient = useQueryClient();

  const { data: transport, isLoading, error } = useQuery({
    queryKey: ['transport', id],
    queryFn: async () => {
      if (!id) throw new Error('No transport ID provided');
      
      const { data, error } = await supabase
        .from('transport_records')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as TransportRecord;
    },
    enabled: !!id
  });

  const updateTransport = useMutation({
    mutationFn: async (updates: Partial<TransportRecord>) => {
      if (!id) throw new Error('No transport ID provided');

      const { error } = await supabase
        .from('transport_records')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transport', id] });
    }
  });

  return {
    transport,
    isLoading,
    error,
    updateTransport
  };
}

export function useUpdateTransport(id?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<TransportRecord>) => {
      if (!id) throw new Error('No transport ID provided');

      const { error } = await supabase
        .from('transport_records')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transport', id] });
    }
  });
}