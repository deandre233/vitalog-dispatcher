import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ServiceRequest, QueueMetrics, AIInsight } from '@/types/service-queue';

export function useServiceQueue() {
  const queryClient = useQueryClient();

  // Fetch service requests
  const { data: requests, isLoading } = useQuery({
    queryKey: ['service-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_requests')
        .select(`
          *,
          patients (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our ServiceRequest interface
      const transformedData = data.map(request => ({
        id: request.id,
        requestType: request.request_type,
        patientId: request.patient_id,
        patientName: `${request.patients.first_name} ${request.patients.last_name}`,
        requestedBy: request.requested_by,
        requestedDate: request.requested_date,
        serviceDate: request.service_date,
        scheduledTime: new Date(request.service_date).toLocaleTimeString(),
        priority: request.priority as 'low' | 'medium' | 'high',
        status: request.status as 'pending' | 'inProgress' | 'completed',
        tripType: request.trip_type || 'One way',
        service: request.service_type || 'Standard',
        route: request.route || 'Default',
        notes: request.notes
      }));

      // Group requests by status
      return {
        pending: transformedData.filter(r => r.status === 'pending'),
        inProgress: transformedData.filter(r => r.status === 'inProgress'),
        completed: transformedData.filter(r => r.status === 'completed')
      };
    }
  });

  const aiInsights: AIInsight[] = [
    {
      type: 'optimization',
      message: "Peak transport hours detected between 8-10 AM, suggesting optimal staffing adjustments",
      confidence: 0.92,
      impact: 'high'
    },
    {
      type: 'warning',
      message: "Weather conditions may impact 30% of scheduled transports tomorrow",
      confidence: 0.85,
      impact: 'medium'
    },
    {
      type: 'prediction',
      message: "Resource utilization trending 15% higher than last week",
      confidence: 0.88,
      impact: 'medium'
    }
  ];

  const metrics: QueueMetrics = {
    activeRequests: requests?.inProgress?.length || 0,
    avgResponseTime: "28 mins",
    completionRate: 94,
    predictedLoad: 78,
    efficiency: 89
  };

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
    mutationFn: async (newRequest: Omit<ServiceRequest, 'id'>) => {
      const { data, error } = await supabase
        .from('service_requests')
        .insert({
          request_type: newRequest.requestType,
          patient_id: newRequest.patientId,
          requested_by: newRequest.requestedBy,
          service_date: newRequest.serviceDate,
          priority: newRequest.priority,
          status: 'pending',
          trip_type: newRequest.tripType,
          service_type: newRequest.service,
          route: newRequest.route,
          notes: newRequest.notes
        })
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

  return {
    requests,
    isLoading,
    aiInsights,
    metrics,
    addRequest
  };
}
