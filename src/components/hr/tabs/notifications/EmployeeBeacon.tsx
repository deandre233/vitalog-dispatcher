
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, MapPin, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface EmployeeBeaconProps {
  employeeId: string;
  isOnClock: boolean;
}

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: string;
  is_on_clock: boolean;
}

export function EmployeeBeacon({ employeeId, isOnClock }: EmployeeBeaconProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Check if browser supports geolocation
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLocationPermission(false);
      return;
    }
    
    // Check if permission was previously granted
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'granted') {
        setLocationPermission(true);
      } else if (result.state === 'denied') {
        setLocationPermission(false);
        setError("Location permission denied");
      } else {
        setLocationPermission(null);
      }
      
      // Listen for permission changes
      result.addEventListener('change', () => {
        setLocationPermission(result.state === 'granted');
        if (result.state !== 'granted') {
          setIsTracking(false);
          setError("Location permission denied");
        } else {
          setError(null);
        }
      });
    });
  }, []);
  
  useEffect(() => {
    // If employee goes off clock, stop tracking
    if (!isOnClock && isTracking) {
      setIsTracking(false);
      toast({
        title: "Tracking stopped",
        description: "Location tracking has been disabled because you're off duty",
      });
    }
  }, [isOnClock, isTracking]);
  
  // Track location when tracking is enabled
  useEffect(() => {
    let watchId: number | null = null;
    
    const startTracking = () => {
      if (!navigator.geolocation) return;
      
      watchId = navigator.geolocation.watchPosition(
        async (position) => {
          setError(null);
          
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString(),
            is_on_clock: isOnClock
          };
          
          try {
            const { error } = await supabase
              .from('employee_locations')
              .insert({
                employee_id: employeeId,
                ...locationData
              });
              
            if (error) throw error;
          } catch (err) {
            console.error("Error saving location:", err);
            // Don't show toast for every error to avoid spamming the user
          }
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            setLocationPermission(false);
            setIsTracking(false);
            setError("Location permission denied");
          } else if (err.code === err.TIMEOUT) {
            setError("Location request timed out");
          } else {
            setError("Error getting location");
          }
        },
        {
          enableHighAccuracy: true,
          maximumAge: 30000,  // 30 seconds
          timeout: 27000  // 27 seconds
        }
      );
    };
    
    if (isTracking) {
      startTracking();
    }
    
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isTracking, employeeId, isOnClock]);
  
  const toggleTracking = () => {
    if (!isOnClock) {
      toast({
        title: "Cannot enable tracking",
        description: "You must be on duty to enable location tracking",
        variant: "destructive"
      });
      return;
    }
    
    if (!locationPermission) {
      setIsLoading(true);
      // This will prompt the user for permission
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationPermission(true);
          setIsLoading(false);
          setIsTracking(true);
          setError(null);
          toast({
            title: "Tracking enabled",
            description: "Your location is now being shared with supervisors",
          });
        },
        (err) => {
          setLocationPermission(false);
          setIsLoading(false);
          setError("Location permission denied");
        }
      );
    } else {
      setIsTracking(!isTracking);
      if (!isTracking) {
        toast({
          title: "Tracking enabled",
          description: "Your location is now being shared with supervisors",
        });
      } else {
        toast({
          title: "Tracking disabled",
          description: "Your location is no longer being shared",
        });
      }
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className={isTracking ? "text-green-500" : "text-gray-400"} />
            <Label htmlFor="tracking-toggle" className="font-medium">
              Location Beacon
            </Label>
          </div>
          <Switch 
            id="tracking-toggle"
            checked={isTracking}
            onCheckedChange={toggleTracking}
            disabled={isLoading || !isOnClock}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {isTracking 
            ? "Your location is currently being shared with supervisors while you're on duty" 
            : "Enable the beacon to share your location with supervisors while on duty"}
        </p>
      </div>
      
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Requesting location permission...</span>
        </div>
      )}
      
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertTriangle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
      
      {!isOnClock && (
        <div className="text-sm text-amber-500 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span>You must be on duty to enable location tracking</span>
        </div>
      )}
      
      {isTracking && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsTracking(false)}
          className="w-full"
        >
          Stop Sharing Location
        </Button>
      )}
    </div>
  );
}
