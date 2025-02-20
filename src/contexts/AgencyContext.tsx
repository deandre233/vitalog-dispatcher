
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { extractSubdomain } from '@/utils/domainUtils';
import { toast } from '@/hooks/use-toast';

interface Agency {
  id: string;
  name: string;
  subdomain: string;
  settings: Record<string, any>;
  branding_config: Record<string, any>;
}

interface AgencyContextType {
  agency: Agency | null;
  isLoading: boolean;
  error: Error | null;
}

const AgencyContext = createContext<AgencyContextType>({
  agency: null,
  isLoading: true,
  error: null,
});

export function AgencyProvider({ children }: { children: ReactNode }) {
  const [agency, setAgency] = useState<Agency | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadAgencyData() {
      try {
        const subdomain = extractSubdomain(window.location.hostname);
        
        if (!subdomain) {
          setIsLoading(false);
          return;
        }

        const { data: domainData, error: domainError } = await supabase
          .from('agency_domains')
          .select('agency_id')
          .eq('subdomain', subdomain)
          .eq('is_active', true)
          .single();

        if (domainError) throw domainError;

        if (domainData) {
          const { data: agencyData, error: agencyError } = await supabase
            .from('agency_profiles')
            .select('*')
            .eq('id', domainData.agency_id)
            .single();

          if (agencyError) throw agencyError;

          if (agencyData) {
            setAgency(agencyData as Agency);
          }
        }
      } catch (err) {
        console.error('Error loading agency data:', err);
        setError(err as Error);
        toast({
          title: "Error",
          description: "Failed to load agency data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadAgencyData();
  }, []);

  return (
    <AgencyContext.Provider value={{ agency, isLoading, error }}>
      {children}
    </AgencyContext.Provider>
  );
}

export const useAgency = () => useContext(AgencyContext);
