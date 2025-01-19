import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface TransportRecord {
  id: string;
  patient_id: string | null;
  dispatch_id: string;
  pickup_location: string;
  dropoff_location: string;
  transport_date: string | null;
  status: string;
  crew_assigned: string | null;
  notes: string | null;
  created_at: string | null;
  recurrence_type: string | null;
  recurrence_day: string | null;
  recurrence_frequency: string | null;
  warnings: string[] | null;
  pickup_type: string | null;
  dropoff_type: string | null;
  return_trip_id: string | null;
}

export function useTransportRecord(id: string | undefined) {
  return useQuery({
    queryKey: ['transport', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transport_records')
        .select('*')
        .eq('dispatch_id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        toast.error("Transport record not found");
        return null;
      }
      return data as TransportRecord;
    },
  });
}

export function useUpdateTransport(id: string | undefined) {
  return useMutation({
    mutationFn: async (updates: Partial<TransportRecord>) => {
      const { error } = await supabase
        .from('transport_records')
        .update(updates)
        .eq('dispatch_id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Transport record updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update transport record");
      console.error("Update error:", error);
    },
  });
}