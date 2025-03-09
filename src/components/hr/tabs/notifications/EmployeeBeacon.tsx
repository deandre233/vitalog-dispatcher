
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Shield, MapPin, BellRing } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface EmployeeBeaconProps {
  employeeId: string;
  isOnClock: boolean;
}

export function EmployeeBeacon({ employeeId, isOnClock }: EmployeeBeaconProps) {
  const [beaconActive, setBeaconActive] = useState(false);
  const [locationPermission, setLocationPermission] = useState<PermissionState | null>(null);
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);
  const [trackingInterval, setTrackingInterval] = useState<number | null>(null);

  // Check for location permission on component mount
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' })
        .then(permissionStatus => {
          setLocationPermission(permissionStatus.state);
          
          permissionStatus.onchange = () => {
            setLocationPermission(permissionStatus.state);
          };
        });
    }
  }, []);

  useEffect(() => {
    // Clean up tracking interval when component unmounts
    return () => {
      if (trackingInterval) {
        clearInterval(trackingInterval);
      }
    };
  }, [trackingInterval]);

  // Start or stop tracking based on beacon status
  useEffect(() => {
    if (beaconActive && isOnClock) {
      startTracking();
    } else {
      stopTracking();
    }
  }, [beaconActive, isOnClock]);

  const startTracking = () => {
    if (!isOnClock) {
      toast({
        title: "Cannot enable beacon",
        description: "You must be on the clock to enable location tracking.",
        variant: "destructive"
      });
      setBeaconActive(false);
      return;
    }

    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser does not support location tracking.",
        variant: "destructive"
      });
      return;
    }

    // Get initial location
    updateLocation();

    // Set up interval for continuous tracking
    const intervalId = window.setInterval(() => {
      updateLocation();
    }, 5 * 60 * 1000); // Update every 5 minutes
    
    setTrackingInterval(intervalId);
    
    toast({
      title: "Beacon activated",
      description: "Your location is now being tracked while on duty."
    });
  };

  const stopTracking = () => {
    if (trackingInterval) {
      clearInterval(trackingInterval);
      setTrackingInterval(null);
    }
    
    if (beaconActive) {
      toast({
        title: "Beacon deactivated",
        description: "Location tracking has been disabled."
      });
    }
  };

  const updateLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation(position);
        saveLocationToDatabase(position);
      },
      (error) => {
        console.error("Error getting location:", error);
        toast({
          title: "Location error",
          description: `Could not get your location: ${error.message}`,
          variant: "destructive"
        });
      }
    );
  };

  const saveLocationToDatabase = async (position: GeolocationPosition) => {
    try {
      const locationData = {
        employee_id: employeeId,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date(position.timestamp).toISOString(),
        is_on_clock: isOnClock
      };

      const { error } = await supabase
        .from('employee_locations')
        .insert(locationData);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error saving location:", error);
    }
  };

  const handleToggleBeacon = () => {
    if (!beaconActive && locationPermission !== 'granted') {
      // Request permission if not already granted
      navigator.geolocation.getCurrentPosition(
        () => {
          setBeaconActive(true);
        },
        (error) => {
          toast({
            title: "Permission denied",
            description: "Location permission is required to activate the beacon.",
            variant: "destructive"
          });
        }
      );
    } else {
      setBeaconActive(!beaconActive);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className={beaconActive ? "text-green-500" : "text-gray-400"} />
          <h3 className="text-lg font-medium">Location Beacon</h3>
        </div>
        <Switch 
          checked={beaconActive} 
          onCheckedChange={handleToggleBeacon}
          disabled={!isOnClock}
        />
      </div>
      
      {!isOnClock && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertTitle>Not on duty</AlertTitle>
          <AlertDescription>
            Location tracking is only available while you're on the clock.
          </AlertDescription>
        </Alert>
      )}
      
      {beaconActive && currentLocation && (
        <div className="text-sm text-muted-foreground">
          <p>Current location: {currentLocation.coords.latitude.toFixed(4)}, {currentLocation.coords.longitude.toFixed(4)}</p>
          <p>Last updated: {new Date(currentLocation.timestamp).toLocaleTimeString()}</p>
        </div>
      )}
      
      <div className="text-sm text-muted-foreground">
        <p>
          <Shield className="h-3 w-3 inline-block mr-1" />
          Your location is only shared while on duty and the beacon is active.
        </p>
      </div>
    </div>
  );
}
