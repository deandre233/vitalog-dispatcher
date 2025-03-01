
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, Phone, UserPlus, Clock, Filter } from "lucide-react";

export function ServiceQueuePage() {
  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-medical-primary">Service Queue</h1>
            <div className="flex items-center mt-1 space-x-2">
              <Badge variant="outline" className="bg-red-50">3 Urgent</Badge>
              <Badge variant="outline" className="bg-yellow-50">7 Waiting</Badge>
              <Badge variant="outline" className="bg-blue-50">5 In Progress</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
            <Button>
              <Phone className="mr-2 h-4 w-4" /> New Call
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active Queue</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4">
            {[
              { 
                id: 1, 
                name: "John Smith", 
                requestType: "Emergency Transport", 
                waitTime: "15:23", 
                status: "Urgent",
                phone: "(555) 123-4567",
                notes: "Patient experiencing chest pain, requested immediate assistance"
              },
              { 
                id: 2, 
                name: "Mary Davis", 
                requestType: "Scheduled Transport", 
                waitTime: "10:45", 
                status: "Waiting",
                phone: "(555) 987-6543",
                notes: "Regular dialysis appointment, needs wheelchair transport"
              },
              { 
                id: 3, 
                name: "Robert Jones", 
                requestType: "Medical Consultation", 
                waitTime: "07:12", 
                status: "In Progress",
                phone: "(555) 876-5432",
                notes: "Follow-up about medication side effects"
              },
            ].map((request) => (
              <Card key={request.id} className="p-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{request.name}</h3>
                        <p className="text-sm text-gray-500">{request.requestType}</p>
                      </div>
                      <Badge 
                        className={`${
                          request.status === 'Urgent' ? 'bg-red-100 text-red-800 hover:bg-red-100' : 
                          request.status === 'Waiting' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' : 
                          'bg-blue-100 text-blue-800 hover:bg-blue-100'
                        }`}
                      >
                        {request.status}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="h-4 w-4 mr-2" />
                      {request.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-2" />
                      Wait time: {request.waitTime}
                    </div>
                    <p className="text-sm">{request.notes}</p>
                  </div>
                  
                  <div className="flex flex-row md:flex-col gap-2 justify-end">
                    <Button variant="default">
                      Process
                    </Button>
                    <Button variant="outline" size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Assign
                    </Button>
                    <Button variant="outline" size="sm">
                      <CalendarClock className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="scheduled">
            <Card className="p-6 flex items-center justify-center min-h-[300px]">
              <div className="text-center text-gray-500">
                <CalendarClock className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>Scheduled service requests will appear here</p>
                <p className="text-sm">No scheduled requests at this time</p>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed">
            <Card className="p-6 flex items-center justify-center min-h-[300px]">
              <div className="text-center text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>Completed service requests will appear here</p>
                <p className="text-sm">Select a date range to view completed requests</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
