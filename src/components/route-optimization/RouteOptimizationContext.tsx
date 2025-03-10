
import { createContext, useContext, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Location } from "@/types/operations-map";
import { getRouteDetails } from "@/utils/googleMapsService";

interface RouteOptimizationContextType {
  origin: Location | null;
  destination: Location | null;
  departureTime: Date;
  serviceType: string;
  optimizedRoute: any | null;
  isLoading: boolean;
  error: string | null;
  setOrigin: (origin: Location) => void;
  setDestination: (destination: Location) => void;
  setDepartureTime: (time: Date) => void;
  setServiceType: (type: string) => void;
  optimizeRoute: () => Promise<void>;
  clearOptimization: () => void;
}

const RouteOptimizationContext = createContext<RouteOptimizationContextType | undefined>(undefined);

export function RouteOptimizationProvider({ children }: { children: ReactNode }) {
  const [origin, setOrigin] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [departureTime, setDepartureTime] = useState<Date>(new Date());
  const [serviceType, setServiceType] = useState<string>("standard");
  const [optimizedRoute, setOptimizedRoute] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const optimizeRoute = async () => {
    if (!origin || !destination) {
      toast.error("Please set both origin and destination");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // First, try to get route directly using Google Maps
      try {
        const routeDetails = await getRouteDetails(origin, destination);
        
        // If we successfully get a route from Google Maps
        setOptimizedRoute({
          route: routeDetails.route,
          duration: routeDetails.duration,
          distance: routeDetails.distance,
          trafficConditions: routeDetails.trafficDuration || 'Normal'
        });
        
        toast.success("Route optimized successfully");
        setIsLoading(false);
        return;
      } catch (directError) {
        console.error("Direct Google Maps routing failed, trying backend:", directError);
        // If direct routing fails, fall back to backend function
      }

      // Fall back to backend function
      const { data, error: optimizeError } = await supabase.functions.invoke("optimize-route", {
        body: {
          origin,
          destination,
          departureTime: departureTime.toISOString(),
          serviceType
        }
      });

      if (optimizeError) {
        throw optimizeError;
      }

      setOptimizedRoute(data);
      toast.success("Route optimized successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to optimize route";
      setError(errorMessage);
      toast.error("Failed to optimize route", {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearOptimization = () => {
    setOptimizedRoute(null);
  };

  const value = {
    origin,
    destination,
    departureTime,
    serviceType,
    optimizedRoute,
    isLoading,
    error,
    setOrigin,
    setDestination,
    setDepartureTime,
    setServiceType,
    optimizeRoute,
    clearOptimization
  };

  return <RouteOptimizationContext.Provider value={value}>{children}</RouteOptimizationContext.Provider>;
}

export function useRouteOptimization() {
  const context = useContext(RouteOptimizationContext);
  if (context === undefined) {
    throw new Error("useRouteOptimization must be used within a RouteOptimizationProvider");
  }
  return context;
}
