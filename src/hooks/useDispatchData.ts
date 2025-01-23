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
      return data;
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

  const assignCrew = useMutation({
    mutationFn: async ({ crewId, reason }: { crewId: string; reason?: string }) => {
      if (!dispatchId) throw new Error("No dispatch ID provided");
      
      const { data, error } = await supabase
        .from("dispatch_assignments")
        .insert({
          transport_id: dispatchId,
          crew_member_id: crewId,
          assignment_reason: reason
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dispatch_assignments", dispatchId] });
    }
  });

  const unassignCrew = useMutation({
    mutationFn: async (assignmentId: string) => {
      const { data, error } = await supabase
        .from("dispatch_assignments")
        .update({ unassignment_time: new Date().toISOString() })
        .eq("id", assignmentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dispatch_assignments", dispatchId] });
    }
  });

  return {
    dispatch,
    assignments,
    isLoading,
    error,
    updateDispatch,
    assignCrew,
    unassignCrew
  };
};