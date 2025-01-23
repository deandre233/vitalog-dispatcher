import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ServiceRequest {
  id: string;
  request_type: string;
  status: string;
  priority?: string;
  patient_id?: string;
  requested_by?: string;
  requested_date: string;
  service_date?: string;
  notes?: string;
  patients?: {
    first_name: string;
    last_name: string;
  };
}

export function useServiceRequests() {
  const queryClient = useQueryClient();

  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['service_requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_requests')
        .select(`
          *,
          patients (
            first_name,
            last_name
          ),
          employees (
            first_name,
            last_name
          )
        `)
        .order('requested_date', { ascending: false });

      if (error) {
        console.error('Error fetching requests:', error);
        toast.error('Failed to fetch service requests');
        throw error;
      }

      return data;
    }
  });

  const createRequest = useMutation({
    mutationFn: async (newRequest: Omit<ServiceRequest, 'id'>) => {
      const { data, error } = await supabase
        .from('service_requests')
        .insert({
          ...newRequest,
          status: 'pending' // Add default status
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service_requests'] });
      toast.success('Service request created successfully');
    },
    onError: (error) => {
      console.error('Error creating request:', error);
      toast.error('Failed to create service request');
    }
  });

  return {
    requests,
    isLoading,
    error,
    createRequest
  };
}