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
  billing_notes: string | null;
  created_at: string | null;
  recurrence_type: string | null;
  recurrence_day: string | null;
  recurrence_frequency: string | null;
  warnings: string[] | null;
  pickup_type: string | null;
  dropoff_type: string | null;
  return_trip_id: string | null;
  origin_address: string | null;
  destination_address: string | null;
  scheduled_time: string | null;
  dispatch_status: 'Pending' | 'In Progress' | 'Completed' | null;
  trip_type: 'One way' | 'Wait-and-return' | 'Round trip' | null;
  return_activation_time: string | null;
  return_pickup_time: string | null;
  return_precise_pickup: boolean | null;
  precise_pickup?: boolean | null;
  ai_recommendations?: {
    suggested_crew?: string;
    estimated_duration?: string;
    priority_score?: number;
    insights?: string[];
    traffic_status?: {
      congestion_level: 'low' | 'medium' | 'high';
      estimated_delay: number;
      alternate_route_available: boolean;
    };
  };
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

      if (error) {
        toast.error("Failed to fetch transport record");
        throw error;
      }
      
      if (!data) {
        return null;
      }

      return data as TransportRecord;
    },
    retry: 1,
    enabled: !!id
  });
}

export function useUpdateTransport(id: string | undefined) {
  return useMutation({
    mutationFn: async (updates: Partial<TransportRecord>) => {
      const { error } = await supabase
        .from('transport_records')
        .update(updates)
        .eq('dispatch_id', id);

      if (error) {
        toast.error("Failed to update transport record");
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Transport record updated successfully");
    },
    onError: (error) => {
      console.error("Update error:", error);
    },
  });
}