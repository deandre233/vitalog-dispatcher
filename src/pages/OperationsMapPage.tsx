
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Truck, AlertCircle, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OperationsMapPage() {
  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-medical-primary">Operations Map</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="live">
          <TabsList>
            <TabsTrigger value="live">Live View</TabsTrigger>
            <TabsTrigger value="historical">Historical</TabsTrigger>
            <TabsTrigger value="heatmap">Heat Map</TabsTrigger>
          </TabsList>
          <TabsContent value="live" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 col-span-1">
                <h3 className="text-lg font-medium mb-4">Units</h3>
                <div className="space-y-3">
                  {['Unit 101', 'Unit 102', 'Unit 103', 'Unit 104'].map((unit) => (
                    <div key={unit} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-medical-primary" />
                        <span>{unit}</span>
                      </div>
                      <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</div>
                    </div>
                  ))}
                </div>
              </Card>
              
              <Card className="p-4 col-span-1 md:col-span-3 min-h-[400px] flex items-center justify-center bg-gray-50">
                <div className="text-center text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>Map data would be displayed here</p>
                  <p className="text-sm">Connect to a mapping service to show real-time operations</p>
                </div>
              </Card>
            </div>
            
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Active Incidents</h3>
              <div className="space-y-3">
                {[
                  { id: 1, type: 'Emergency Transport', location: '123 Main St', status: 'In Progress', priority: 'High' },
                  { id: 2, type: 'Scheduled Transfer', location: '456 Oak Ave', status: 'En Route', priority: 'Medium' },
                  { id: 3, type: 'Medical Assistance', location: '789 Pine Rd', status: 'Arriving', priority: 'Low' },
                ].map((incident) => (
                  <div key={incident.id} className="flex items-center justify-between p-3 border-b">
                    <div>
                      <div className="font-medium">{incident.type}</div>
                      <div className="text-sm text-gray-500">{incident.location}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`px-2 py-1 rounded-full text-xs
                        ${incident.priority === 'High' ? 'bg-red-100 text-red-800' : 
                          incident.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'}`}>
                        {incident.priority}
                      </div>
                      <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {incident.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="historical">
            <Card className="p-6 flex items-center justify-center min-h-[400px]">
              <div className="text-center text-gray-500">
                <AlertCircle className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>Historical data would be displayed here</p>
                <p className="text-sm">Select a date range to view past operations</p>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="heatmap">
            <Card className="p-6 flex items-center justify-center min-h-[400px]">
              <div className="text-center text-gray-500">
                <AlertCircle className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>Heat map data would be displayed here</p>
                <p className="text-sm">Visualize concentration of activities across the region</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
