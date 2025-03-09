
import { useEffect, useState } from "react";
import { BookingForm } from "@/components/dispatch/BookingForm";
import { MainLayout } from "@/components/layout/MainLayout";
import { AIDispatchInsights } from "@/components/dispatch/ai/AIDispatchInsights";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DispatchStatusAlert } from "@/components/dashboard/dispatch-board";
import { AlertCircle, Clock, FileText, LayoutGrid, Map, Settings } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

/**
 * CreateDispatch page component
 * Handles the creation of new dispatch records
 */
const CreateDispatch = () => {
  const [activeTab, setActiveTab] = useState<string>("standard");
  const [timeSincePageLoad, setTimeSincePageLoad] = useState<number>(0);
  const [pendingCount, setPendingCount] = useState<number>(4);
  const [assignedCount, setAssignedCount] = useState<number>(12);
  const navigate = useNavigate();
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSincePageLoad(prev => prev + 1);
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    // Simulate dynamic dispatch counts
    const countInterval = setInterval(() => {
      setPendingCount(Math.floor(Math.random() * 3) + 3);
      setAssignedCount(Math.floor(Math.random() * 4) + 10);
    }, 120000);
    
    return () => clearInterval(countInterval);
  }, []);
  
  const handleTemplateSave = () => {
    toast.success("Dispatch template saved successfully");
  };
  
  const handleCancelDispatch = () => {
    toast.info("Dispatch creation cancelled");
    navigate("/dispatch");
  };

  return (
    <MainLayout>
      <div className="mb-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-medical-primary bg-gradient-to-r from-medical-primary to-medical-secondary bg-clip-text text-transparent">
              Create New Dispatch
            </h2>
            <p className="text-gray-500">Fill out the form below to create a new transport dispatch</p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Time on page: {timeSincePageLoad} min
            </span>
            <Button 
              variant="outline" 
              onClick={handleCancelDispatch}
              className="bg-gray-50 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button 
              variant="outline" 
              onClick={handleTemplateSave}
              className="border-medical-secondary text-medical-secondary hover:bg-medical-secondary/10"
            >
              Save as Template
            </Button>
          </div>
        </div>
        
        <DispatchStatusAlert 
          unassignedCount={pendingCount} 
          assignedCount={assignedCount}
        />
        
        <Tabs defaultValue="standard" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full md:w-[600px]">
            <TabsTrigger value="standard" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              <span>Standard Dispatch</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Advanced Options</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              <span>Map View</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="standard">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <BookingForm />
              </div>
              
              <div className="space-y-6">
                <Card className="p-4 shadow-md border-l-4 border-l-medical-secondary bg-gradient-to-br from-white to-[#F1F0FB]">
                  <h3 className="font-semibold text-lg text-medical-primary mb-4 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-medical-secondary" />
                    Dispatch AI Assistant
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Our enhanced AI assistant provides comprehensive dispatch optimization with real-time insights.
                    Get traffic predictions, route recommendations, and efficiency analytics.
                  </p>
                  <div className="text-xs text-gray-500 grid grid-cols-2 gap-x-3 gap-y-2">
                    <p className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Real-time traffic analysis
                    </p>
                    <p className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Optimal route suggestions
                    </p>
                    <p className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Efficiency predictions
                    </p>
                    <p className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      Risk assessment
                    </p>
                    <p className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      Weather impact analysis
                    </p>
                    <p className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Priority optimization
                    </p>
                  </div>
                </Card>
                
                <AIDispatchInsights />
                
                <Card className="p-4 bg-gradient-to-br from-[#FFDEE2] to-white border-l-4 border-l-[#D946EF]">
                  <h4 className="font-medium text-[#D946EF] mb-2">Quick Access Templates</h4>
                  <p className="text-xs text-gray-600 mb-3">Load pre-configured dispatch templates to save time</p>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start text-xs border-[#D946EF]/20 hover:bg-[#FFDEE2]/50"
                      onClick={() => toast.info("Hospital transfer template loaded")}
                    >
                      <FileText className="h-3 w-3 mr-2" />
                      Hospital Transfer
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start text-xs border-[#D946EF]/20 hover:bg-[#FFDEE2]/50"
                      onClick={() => toast.info("Routine checkup template loaded")}
                    >
                      <FileText className="h-3 w-3 mr-2" />
                      Routine Checkup
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start text-xs border-[#D946EF]/20 hover:bg-[#FFDEE2]/50"
                      onClick={() => toast.info("Emergency transfer template loaded")}
                    >
                      <FileText className="h-3 w-3 mr-2" />
                      Emergency Transfer
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced">
            <div className="p-6 bg-gray-50 rounded-lg text-center">
              <h3 className="text-lg font-medium text-medical-primary mb-2">Advanced Dispatch Options</h3>
              <p className="text-gray-500 mb-4">Configure specialized routing, recurring schedules, and complex transport chains</p>
              <Button onClick={() => setActiveTab("standard")}>
                Return to Standard Form
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="map">
            <div className="p-6 bg-gray-50 rounded-lg text-center">
              <h3 className="text-lg font-medium text-medical-primary mb-2">Interactive Map View</h3>
              <p className="text-gray-500 mb-4">Visually select pickup and dropoff locations on an interactive map</p>
              <Button onClick={() => setActiveTab("standard")}>
                Return to Standard Form
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default CreateDispatch;
