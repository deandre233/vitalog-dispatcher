
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Loader2, Calendar as CalendarIcon, Route, ArrowRightLeft, Brain } from "lucide-react";
import { useRouteOptimization } from "./RouteOptimizationContext";
import { cn } from "@/lib/utils";
import { geocodeAddress } from "@/utils/googleMapsService";
import { toast } from "sonner";

export function RouteOptimizationForm() {
  const { 
    setOrigin, 
    setDestination, 
    departureTime, 
    setDepartureTime, 
    serviceType, 
    setServiceType, 
    optimizeRoute, 
    clearOptimization,
    isLoading
  } = useRouteOptimization();
  
  const [originAddress, setOriginAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [selectedTime, setSelectedTime] = useState("12:00");
  const [geocodingLoading, setGeocodingLoading] = useState(false);

  const handleAddressChange = (type: 'origin' | 'destination', address: string) => {
    if (type === 'origin') {
      setOriginAddress(address);
    } else {
      setDestinationAddress(address);
    }
  };

  const handleGeocodeAddresses = async () => {
    try {
      setGeocodingLoading(true);
      
      if (!originAddress) {
        toast.error("Please enter an origin address");
        return;
      }
      
      if (!destinationAddress) {
        toast.error("Please enter a destination address");
        return;
      }
      
      // Geocode origin
      const originLocation = await geocodeAddress(originAddress);
      setOrigin(originLocation);
      
      // Geocode destination
      const destinationLocation = await geocodeAddress(destinationAddress);
      setDestination(destinationLocation);
      
      toast.success("Addresses geocoded successfully");
    } catch (error) {
      console.error("Geocoding error:", error);
      toast.error("Failed to geocode addresses. Please check and try again.");
    } finally {
      setGeocodingLoading(false);
    }
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    const [hours, minutes] = time.split(':').map(Number);
    const newDate = new Date(departureTime);
    newDate.setHours(hours, minutes);
    setDepartureTime(newDate);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date);
      const [hours, minutes] = selectedTime.split(':').map(Number);
      newDate.setHours(hours, minutes);
      setDepartureTime(newDate);
    }
  };

  const handleOptimize = async () => {
    await handleGeocodeAddresses();
    optimizeRoute();
  };

  const handleClear = () => {
    setOriginAddress("");
    setDestinationAddress("");
    setSelectedTime("12:00");
    clearOptimization();
  };

  return (
    <Card className="p-5 shadow-sm bg-white">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Route Parameters</h3>
          <div className="flex items-center space-x-1">
            <Brain className="h-4 w-4 text-medical-accent" />
            <span className="text-xs text-medical-accent">AI-powered</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="origin">Origin</Label>
            <Input
              id="origin"
              placeholder="Enter origin address"
              value={originAddress}
              onChange={(e) => handleAddressChange('origin', e.target.value)}
            />
          </div>

          <div className="flex justify-center">
            <ArrowRightLeft className="h-5 w-5 text-gray-400 rotate-90" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              placeholder="Enter destination address"
              value={destinationAddress}
              onChange={(e) => handleAddressChange('destination', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Departure Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !departureTime && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {departureTime ? format(departureTime, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={departureTime}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Departure Time</Label>
            <Input
              id="time"
              type="time"
              value={selectedTime}
              onChange={(e) => handleTimeChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceType">Service Type</Label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger id="serviceType">
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="bariatric">Bariatric</SelectItem>
                <SelectItem value="wheelchair">Wheelchair</SelectItem>
                <SelectItem value="special">Special Needs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2 pt-2">
            <Button 
              className="flex-1" 
              onClick={handleOptimize}
              disabled={isLoading || geocodingLoading || !originAddress || !destinationAddress}
            >
              {isLoading || geocodingLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {geocodingLoading ? "Geocoding..." : "Optimizing..."}
                </>
              ) : (
                <>
                  <Route className="mr-2 h-4 w-4" />
                  Optimize Route
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleClear}>Clear</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
