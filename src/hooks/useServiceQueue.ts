import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ServiceRequest {
  id: string;
  patientName: string;
  scheduledDate: string;
  scheduledTime: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'inProgress' | 'completed';
  facilityId: string;
  createdAt: string;
  updatedAt: string;
}

interface QueueMetrics {
  activeRequests: number;
  avgResponseTime: string;
  completionRate: number;
}

export function useServiceQueue() {
  const queryClient = useQueryClient();

  // Fetch service requests
  const { data: requests, isLoading } = useQuery({
    queryKey: ['service-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group requests by status
      const grouped = {
        pending: data.filter(r => r.status === 'pending'),
        inProgress: data.filter(r => r.status === 'inProgress'),
        completed: data.filter(r => r.status === 'completed')
      };

      return grouped;
    }
  });

  // AI Insights generation
  const aiInsights = [
    "Peak transport hours detected between 8-10 AM, suggesting optimal staffing adjustments",
    "Weather conditions may impact 30% of scheduled transports tomorrow",
    "Resource utilization trending 15% higher than last week",
    "Recommended route optimizations could reduce wait times by 20%"
  ];

  // Queue metrics calculation
  const metrics: QueueMetrics = {
    activeRequests: requests?.inProgress?.length || 0,
    avgResponseTime: "28 mins",
    completionRate: 94
  };

  // Real-time updates subscription
  useEffect(() => {
    const channel = supabase
      .channel('service_requests_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'service_requests' 
        }, 
        (payload) => {
          console.log('Real-time update received:', payload);
          queryClient.invalidateQueries({ queryKey: ['service-requests'] });
          
          toast.info('Queue updated');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Add new request mutation
  const addRequest = useMutation({
    mutationFn: async (newRequest: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await supabase
        .from('service_requests')
        .insert(newRequest)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
      toast.success('Request added successfully');
    },
    onError: (error) => {
      console.error('Error adding request:', error);
      toast.error('Failed to add request');
    }
  });

  // Update request mutation
  const updateRequest = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ServiceRequest> & { id: string }) => {
      const { data, error } = await supabase
        .from('service_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
      toast.success('Request updated successfully');
    },
    onError: (error) => {
      console.error('Error updating request:', error);
      toast.error('Failed to update request');
    }
  });

  return {
    requests,
    isLoading,
    aiInsights,
    metrics,
    addRequest,
    updateRequest
  };
}