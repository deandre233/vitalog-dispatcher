import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TransportRecord, DispatchAssignment } from "@/types/dispatch";

export const useDispatchData = (dispatchId?: string) => {
  const queryClient = useQueryClient();

  const { data: dispatch, isLoading, error } = useQuery({
    queryKey: ["dispatch", dispatchId],
    queryFn: async (): Promise<TransportRecord | null> => {
      if (!dispatchId) return null;
      
      const { data, error } = await supabase
        .from("transport_records")
        .select("*")
        .eq("dispatch_id", dispatchId)
        .single();

      if (error) throw error;
      
      // Transform the data to match TransportRecord type
      const transformedData: TransportRecord = {
        ...data,
        route_data: data.route_data ? JSON.parse(data.route_data) : {},
        traffic_conditions: data.traffic_conditions ? JSON.parse(data.traffic_conditions) : {}
      };
      
      return transformedData;
    },
    enabled: !!dispatchId
  });

  const { data: assignments } = useQuery({
    queryKey: ["dispatch_assignments", dispatchId],
    queryFn: async (): Promise<DispatchAssignment[]> => {
      if (!dispatchId) return [];
      
      const { data, error } = await supabase
        .from("dispatch_assignments")
        .select("*")
        .eq("transport_id", dispatchId);

      if (error) throw error;
      return data || [];
    },
    enabled: !!dispatchId
  });

  const updateDispatch = useMutation({
    mutationFn: async (updates: Partial<TransportRecord>) => {
      if (!dispatchId) throw new Error("No dispatch ID provided");
      
      const { data, error } = await supabase
        .from("transport_records")
        .update(updates)
        .eq("dispatch_id", dispatchId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dispatch", dispatchId] });
    }
  });

  return {
    dispatch,
    assignments,
    isLoading,
    error,
    updateDispatch
  };
};