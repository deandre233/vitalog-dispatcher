import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  incidents?: any[]; // Add the incidents property
  dispatch_status?: string;
  origin_address?: string;
  destination_address?: string;
  return_trip_id?: string;
  billing_notes?: string;
  pickup_type?: string;
  scheduled_time?: string;
  precise_pickup?: boolean;
  trip_type?: string;
  return_activation_time?: string;
  return_pickup_time?: string;
  return_precise_pickup?: boolean;
}

export function useTransportRecord(id: string) {
  return useQuery({
    queryKey: ['transport', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transport_records')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as TransportRecord;
    },
  });
}

export function useUpdateTransport() {
  return async (id: string, updates: Partial<TransportRecord>) => {
    const { error } = await supabase
      .from('transport_records')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  };
}