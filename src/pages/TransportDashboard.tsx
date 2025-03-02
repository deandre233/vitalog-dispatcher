
import { useEffect, useState } from "react";
import { HRLayout } from "@/components/layout/HRLayout";
import { transportService } from "@/services/transportService";
import { Transport } from "@/types/transport-system";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientDetails } from "@/components/dashboard/crew-assignment/PatientDetails";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ambulance, Calendar, Clock, FileText } from "lucide-react";

export function TransportDashboard() {
  const [transports, setTransports] = useState<Transport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransports = async () => {
      try {
        setIsLoading(true);
        const data = await transportService.getTransports();
        setTransports(data);
      } catch (error) {
        toast({
          title: "Error fetching transports",
          description: "Unable to load transport data. Please try again later.",
          variant: "destructive",
        });
        console.error("Error fetching transports:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransports();
  }, []);

  const getStatusColor = (status: Transport["status"]) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-amber-100 text-amber-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityBadge = (priority: Transport["priority"]) => {
    switch (priority) {
      case "emergency":
        return <Badge className="bg-red-500">Emergency</Badge>;
      case "urgent":
        return <Badge className="bg-amber-500">Urgent</Badge>;
      case "routine":
        return <Badge className="bg-green-500">Routine</Badge>;
      default:
        return null;
    }
  };

  return (
    <HRLayout>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-medical-primary">Transport Dashboard</h1>
          <Button asChild>
            <Link to="/transports/new">
              <Ambulance className="mr-2 h-4 w-4" />
              New Transport
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="scheduled" className="w-full">
          <TabsList className="mb-6 w-full border-b-2 border-b-gray-200 justify-start">
            <TabsTrigger value="scheduled" className="data-[state=active]:border-b-2 data-[state=active]:border-b-medical-primary">
              <Clock className="mr-2 h-4 w-4" />
              Scheduled
            </TabsTrigger>
            <TabsTrigger value="in-progress" className="data-[state=active]:border-b-2 data-[state=active]:border-b-medical-primary">
              <Ambulance className="mr-2 h-4 w-4" />
              In Progress
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:border-b-2 data-[state=active]:border-b-medical-primary">
              <FileText className="mr-2 h-4 w-4" />
              Completed
            </TabsTrigger>
            <TabsTrigger value="all" className="data-[state=active]:border-b-2 data-[state=active]:border-b-medical-primary">
              <Calendar className="mr-2 h-4 w-4" />
              All Transports
            </TabsTrigger>
          </TabsList>

          {["scheduled", "in-progress", "completed", "all"].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              {isLoading ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medical-primary"></div>
                    </div>
                  </CardContent>
                </Card>
              ) : transports.length === 0 ? (
                <Card>
                  <CardContent className="p-6">
                    <p className="text-center text-gray-500">No transports found</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {transports
                    .filter((transport) => tab === "all" || transport.status === tab)
                    .map((transport) => (
                      <Card key={transport.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">Transport #{transport.id.slice(0, 8)}</CardTitle>
                            <div className="flex gap-2">
                              {getPriorityBadge(transport.priority)}
                              <Badge className={getStatusColor(transport.status)}>
                                {transport.status.charAt(0).toUpperCase() + transport.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                          <CardDescription>
                            Scheduled: {new Date(transport.scheduledTime).toLocaleString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <PatientDetails
                            patientName={`Patient ID: ${transport.patientId}`}
                            pickupLocation={transport.pickupLocation}
                            dropoffLocation={transport.dropoffLocation}
                            scheduledTime={transport.scheduledTime}
                            onClick={() => {
                              // Navigate to transport detail
                            }}
                          />
                          <div className="mt-4 flex justify-end">
                            <Button
                              variant="outline"
                              className="mr-2"
                              asChild
                            >
                              <Link to={`/transports/${transport.id}`}>
                                View Details
                              </Link>
                            </Button>
                            <Button asChild>
                              <Link to={`/transports/${transport.id}/edit`}>
                                Edit
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </HRLayout>
  );
}
