import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface TransportRecord {
  id: string;
  patient_id: string;
  dispatch_id: string;
  pickup_location: string;
  dropoff_location: string;
  transport_date: string;
  status: string;
  crew_assigned: string;
  notes: string;
  created_at: string;
  incidents?: any[];
  dispatch_status?: "Pending" | "In Progress" | "Completed" | "Canceled";
  origin_address?: string;
  destination_address?: string;
  return_trip_id?: string;
  billing_notes?: string;
  pickup_type?: string;
  scheduled_time?: string;
  precise_pickup?: boolean;
  trip_type?: 'One way' | 'Wait-and-return' | 'Round trip';
  return_activation_time?: string;
  return_pickup_time?: string;
  return_precise_pickup?: boolean;
  warnings?: string[];
  recurrence_type?: string;
  recurrence_day?: string;
  recurrence_frequency?: string;
}

export function useTransportRecord(id: string | undefined) {
  return useQuery({
    queryKey: ['transport', id],
    queryFn: async () => {
      if (!id) return null;

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
}

export function useUpdateTransport(id: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<TransportRecord>) => {
      if (!id) throw new Error("No transport ID provided");

      const { data, error } = await supabase
        .from('transport_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
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
}