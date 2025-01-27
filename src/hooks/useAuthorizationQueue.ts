import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { AuthorizationRequest, AuthMetrics, AIRecommendation } from "@/types/authorization";
import { logger } from "@/utils/logger";

export const useAuthorizationQueue = () => {
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ["authorization_requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authorization_requests")
        .select(`
          *,
          patients (
            first_name,
            last_name
          ),
          insurance_records (
            carrier_name,
            policy_number
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        logger.error("Error fetching authorization requests:", error);
        toast({
          title: "Error",
          description: "Failed to fetch authorization requests",
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
  });

  const updateRequest = useMutation({
    mutationFn: async (updates: Partial<AuthorizationRequest>) => {
      const { data, error } = await supabase
        .from("authorization_requests")
        .update(updates)
        .eq("id", updates.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authorization_requests"] });
      toast({
        title: "Success",
        description: "Authorization request updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update authorization request",
        variant: "destructive",
      });
    },
  });

  const metrics: AuthMetrics = {
    pendingCount: requests?.filter(r => r.status === "pending").length || 0,
    approvalRate: 78,
    averageResponseTime: "1.5 hours",
    criticalRequests: requests?.filter(r => r.priority === "critical").length || 0,
  };

  const aiRecommendations: AIRecommendation[] = [
    {
      confidence: 0.89,
      suggestion: "Expedite critical care authorizations",
      impact: "high",
      reasoning: "Historical data shows 92% approval rate for similar cases",
    },
    {
      confidence: 0.75,
      suggestion: "Bundle related service requests",
      impact: "medium",
      reasoning: "Potential for 25% reduction in processing time",
    },
  ];

  return {
    requests,
    isLoading,
    updateRequest,
    metrics,
    aiRecommendations,
  };
};