
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { isValidSubdomain } from "@/utils/domainUtils";

interface AgencyDomain {
  id: string;
  agency_id: string;
  subdomain: string;
  custom_domain?: string;
  is_active: boolean;
  ssl_status: string;
  dns_validation_record?: string;
}

export function useAgencyDomain(agencyId?: string) {
  const queryClient = useQueryClient();

  const { data: domain, isLoading } = useQuery({
    queryKey: ['agency-domain', agencyId],
    queryFn: async () => {
      if (!agencyId) return null;

      const { data, error } = await supabase
        .from('agency_domains')
        .select('*')
        .eq('agency_id', agencyId)
        .maybeSingle();

      if (error) throw error;
      return data as AgencyDomain | null;
    },
    enabled: !!agencyId
  });

  const updateDomain = useMutation({
    mutationFn: async (updates: Partial<AgencyDomain>) => {
      if (!agencyId) throw new Error('Agency ID is required');
      if (updates.subdomain && !isValidSubdomain(updates.subdomain)) {
        throw new Error('Invalid subdomain format');
      }

      const { error } = await supabase
        .from('agency_domains')
        .upsert({
          agency_id: agencyId,
          ...updates
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agency-domain', agencyId] });
      toast({
        title: "Success",
        description: "Domain settings updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    domain,
    isLoading,
    updateDomain
  };
}
