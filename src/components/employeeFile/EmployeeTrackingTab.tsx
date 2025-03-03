
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, Activity, Navigation, AlertTriangle } from "lucide-react";
import { getEmployeeLocationHistory } from "@/services/api/crudOperations";
import { format, formatDistanceToNow } from "date-fns";
import { Employee } from "@/types/employee";
import { EmployeeLocationMap } from "./EmployeeLocationMap";
import { useToast } from "@/hooks/use-toast";

interface EmployeeTrackingTabProps {
  employee: Employee;
}

export function EmployeeTrackingTab({ employee }: EmployeeTrackingTabProps) {
  const [locationHistory, setLocationHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("map");
  const { toast } = useToast();

  useEffect(() => {
    const fetchLocationHistory = async () => {
      try {
        setIsLoading(true);
        const history = await getEmployeeLocationHistory(employee.id);
        setLocationHistory(history);
      } catch (error) {
        console.error("Failed to fetch location history:", error);
        toast({
          title: "Error",
          description: "Failed to load location history",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocationHistory();
  }, [employee.id, toast]);

  const getLocationStatusBadge = (location: any) => {
    const updatedAt = new Date(location.updated_at);
    const now = new Date();
    const hoursDiff = Math.abs(now.getTime() - updatedAt.getTime()) / 36e5;

    if (hoursDiff < 1) {
      return <Badge className="bg-green-500">Active</Badge>;
    } else if (hoursDiff < 12) {
      return <Badge className="bg-yellow-500">Recent</Badge>;
    } else {
      return <Badge className="bg-gray-500">Inactive</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-blue-500" />
          Location Tracking
        </CardTitle>
        <CardDescription>
          Track location history and real-time position
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="map" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="list">History</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="map" className="h-[400px]">
            {locationHistory.length > 0 ? (
              <EmployeeLocationMap locationHistory={locationHistory} employee={employee} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <MapPin className="h-10 w-10 text-gray-400 mb-3" />
                <h3 className="text-lg font-medium">No location data available</h3>
                <p className="text-sm text-gray-500 mt-2">
                  This employee hasn't shared their location yet or tracking is disabled.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="list">
            <ScrollArea className="h-[350px]">
              {isLoading ? (
                <div className="flex justify-center p-4">Loading location history...</div>
              ) : locationHistory.length > 0 ? (
                <div className="space-y-3">
                  {locationHistory.map((location, index) => (
                    <div key={index} className="border p-3 rounded-md">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-blue-500" />
                          <span>
                            {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                          </span>
                        </div>
                        {getLocationStatusBadge(location)}
                      </div>
                      <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>
                          {format(new Date(location.updated_at), 'MMM dd, yyyy HH:mm')} 
                          ({formatDistanceToNow(new Date(location.updated_at), { addSuffix: true })})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p>No location history available</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Last Seen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {locationHistory.length > 0
                      ? formatDistanceToNow(new Date(locationHistory[0].updated_at), { addSuffix: true })
                      : "Never"}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Total Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{locationHistory.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Tracking Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    {locationHistory.length > 0 && 
                     new Date(locationHistory[0].updated_at).getTime() > Date.now() - 3600000 ? (
                      <>
                        <Activity className="h-5 w-5 text-green-500" />
                        <span className="text-green-500 font-medium">Active</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        <span className="text-yellow-500 font-medium">Inactive</span>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Data Coverage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {locationHistory.length > 10 ? "High" : locationHistory.length > 0 ? "Low" : "None"}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <Button variant="outline" onClick={() => setActiveTab("map")}>
          View on Map
        </Button>
        <Button variant="default" className="bg-blue-500 hover:bg-blue-600">
          Enable Real-time Tracking
        </Button>
      </CardFooter>
    </Card>
  );
}
