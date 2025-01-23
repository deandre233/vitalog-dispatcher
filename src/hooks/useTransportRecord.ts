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
  console.log("useTransportRecord hook called with id:", id);

  return useQuery({
    queryKey: ['transport', id],
    queryFn: async () => {
      console.log("Fetching transport record for id:", id);

      if (!id) {
        console.warn("No transport ID provided to useTransportRecord");
        return null;
      }

      const { data, error } = await supabase
        .from('transport_records')
        .select('*')
        .eq('dispatch_id', id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching transport record:", error);
        toast.error("Failed to fetch transport record");
        throw error;
      }
      
      if (!data) {
        console.warn("No transport record found for id:", id);
        return null;
      }

      console.log("Successfully fetched transport record:", data);
      return data as TransportRecord;
    },
    retry: 1,
    enabled: !!id
  });
}

export function useUpdateTransport(id: string | undefined) {
  console.log("useUpdateTransport hook initialized with id:", id);

  return useMutation({
    mutationFn: async (updates: Partial<TransportRecord>) => {
      console.log("Attempting to update transport record:", { id, updates });

      if (!id) {
        console.error("No transport ID provided for update");
        throw new Error("Transport ID is required for updates");
      }

      const { error } = await supabase
        .from('transport_records')
        .update(updates)
        .eq('dispatch_id', id);

      if (error) {
        console.error("Error updating transport record:", error);
        toast.error("Failed to update transport record");
        throw error;
      }

      console.log("Successfully updated transport record");
    },
    onSuccess: () => {
      console.log("Transport record update successful");
      toast.success("Transport record updated successfully");
    },
    onError: (error) => {
      console.error("Transport record update failed:", error);
    },
  });
}