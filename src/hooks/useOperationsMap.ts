import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { VehicleLocation, MapFilters, AIMapInsight } from '@/types/operations-map';
import { toast } from 'sonner';

interface RouteData {
  current_location: {
    lat: number;
    lng: number;
  };
}

interface AIAnalysisMetadata {
  type: 'traffic' | 'weather' | 'coverage' | 'demand';
  severity: 'low' | 'medium' | 'high';
  location?: {
    lat: number;
    lng: number;
  };
  recommendation?: string;
}

export function useOperationsMap() {
  const [filters, setFilters] = useState<MapFilters>({
    showActiveVehicles: true,
    showInactiveVehicles: false,
    showMaintenanceVehicles: false,
    showTrafficLayer: true,
    showWeatherLayer: false,
  });

  const { data: vehicles, isLoading: vehiclesLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transport_records')
        .select(`
          id,
          dispatch_id,
          crew_assigned,
          status,
          route_data,
          vehicle_number,
          ai_recommendations
        `)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching vehicles:', error);
        toast.error('Failed to fetch vehicle data');
        throw error;
      }

      return data?.map(record => {
        const routeData = record.route_data as unknown as RouteData;
        return {
          id: record.id,
          vehicleId: record.vehicle_number,
          location: routeData?.current_location || { lat: 33.7490, lng: -84.3880 },
          status: 'active',
          lastUpdated: new Date().toISOString(),
          crew: record.crew_assigned ? [record.crew_assigned] : [],
          currentDispatch: record.dispatch_id
        };
      }) as VehicleLocation[];
    }
  });

  const { data: insights, isLoading: insightsLoading } = useQuery({
    queryKey: ['map-insights'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_analysis_results')
        .select('*')
        .eq('analysis_type', 'map_insights')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching insights:', error);
        toast.error('Failed to fetch AI insights');
        throw error;
      }

      return (data || []).map(insight => {
        const metadata = insight.metadata as unknown as AIAnalysisMetadata;
        return {
          type: metadata?.type || 'traffic',
          severity: metadata?.severity || 'medium',
          message: insight.recommendation || '',
          location: metadata?.location,
          recommendation: metadata?.recommendation
        };
      }) as AIMapInsight[];
    }
  });

  return {
    vehicles,
    insights,
    filters,
    setFilters,
    isLoading: vehiclesLoading || insightsLoading
  };
}