import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface RouteOptimization {
  id: string;
  route_name: string;
  start_location: string;
  end_location: string;
  waypoints?: any;
  optimization_score?: number;
  created_at?: string;
  updated_at?: string;
}

export function useRouteOptimizations() {
  const queryClient = useQueryClient();

  const { data: routes, isLoading, error } = useQuery({
    queryKey: ['route_optimizations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('route_optimizations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching routes:', error);
        toast.error('Failed to fetch route optimizations');
        throw error;
      }

      return data as RouteOptimization[];
    }
  });

  const createRoute = useMutation({
    mutationFn: async (newRoute: Omit<RouteOptimization, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('route_optimizations')
        .insert(newRoute)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['route_optimizations'] });
      toast.success('Route optimization created successfully');
    },
    onError: (error) => {
      console.error('Error creating route:', error);
      toast.error('Failed to create route optimization');
    }
  });

  return {
    routes,
    isLoading,
    error,
    createRoute
  };
}