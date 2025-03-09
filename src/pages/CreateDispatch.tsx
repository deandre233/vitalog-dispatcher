
import { useEffect, useState } from "react";
import { BookingForm } from "@/components/dispatch/BookingForm";
import { MainLayout } from "@/components/layout/MainLayout";
import { AIDispatchInsights } from "@/components/dispatch/ai/AIDispatchInsights";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DispatchStatusAlert } from "@/components/dashboard/dispatch-board";
import { 
  AlertCircle, Calendar, Truck, ChevronRight, 
  Clock, FileText, Map, Settings, BookOpen, 
  Command, ListFilter, TrendingUp, Brain
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

/**
 * Enhanced CreateDispatch page component
 * Provides advanced dispatch creation and management tools
 */
const CreateDispatch = () => {
  const [activeTab, setActiveTab] = useState<string>("standard");
  const [timeSincePageLoad, setTimeSincePageLoad] = useState<number>(0);
  const [pendingCount, setPendingCount] = useState<number>(4);
  const [assignedCount, setAssignedCount] = useState<number>(12);
  const [isHighPriority, setIsHighPriority] = useState<boolean>(false);
  const [formProgress, setFormProgress] = useState<number>(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSincePageLoad(prev => prev + 1);
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    // Simulate form progress
    const progressInterval = setInterval(() => {
      setFormProgress(prev => {
        if (prev < 60) return prev + 5;
        return prev;
      });
    }, 4000);
    
    // Simulate dynamic dispatch counts
    const countInterval = setInterval(() => {
      setPendingCount(Math.floor(Math.random() * 3) + 3);
      setAssignedCount(Math.floor(Math.random() * 4) + 10);
    }, 120000);
    
    return () => {
      clearInterval(progressInterval);
      clearInterval(countInterval);
    };
  }, []);
  
  const handleTemplateSave = () => {
    toast.success("Dispatch template saved successfully");
  };
  
  const handleCancelDispatch = () => {
    toast.info("Dispatch creation cancelled");
    navigate("/dispatch");
  };

  const handlePriorityToggle = () => {
    setIsHighPriority(!isHighPriority);
    if (!isHighPriority) {
      toast.warning("Priority dispatch mode activated", {
        description: "This dispatch will be flagged for immediate attention"
      });
    }
  };

  return (
    <MainLayout>
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#8B5CF6] bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] bg-clip-text text-transparent">
              Create New Dispatch
            </h2>
            <p className="text-gray-500 text-sm">Fill out the form below to create a new transport dispatch</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-gray-500 flex items-center bg-[#F1F0FB] p-1.5 rounded-md">
              <Clock className="h-3 w-3 mr-1" />
              Session: {timeSincePageLoad} min
            </span>
            <Button 
              variant="outline" 
              onClick={handleCancelDispatch}
              className="bg-gray-50 hover:bg-gray-100 text-xs"
              size="sm"
            >
              Cancel
            </Button>
            <Button 
              variant="outline" 
              onClick={handleTemplateSave}
              className="border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/10 text-xs"
              size="sm"
            >
              Save Template
            </Button>
            <Button
              variant={isHighPriority ? "destructive" : "outline"}
              size="sm"
              className={isHighPriority ? "animate-pulse" : ""}
              onClick={handlePriorityToggle}
            >
              {isHighPriority ? "High Priority" : "Set Priority"}
            </Button>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="w-full max-w-md bg-gradient-to-r from-white to-[#FFDEE2] rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] h-2.5 rounded-full" 
              style={{ width: `${formProgress}%` }}
            ></div>
          </div>
          <span className="ml-3 text-xs text-gray-500">{formProgress}% complete</span>
        </div>
        
        <DispatchStatusAlert 
          unassignedCount={pendingCount} 
          assignedCount={assignedCount}
        />
        
        <Tabs defaultValue="standard" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full md:w-[800px] bg-[#F1F0FB] p-1">
            <TabsTrigger value="standard" className="flex items-center gap-2 data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white">
              <Command className="h-4 w-4" />
              <span>Standard</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2 data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white">
              <ListFilter className="h-4 w-4" />
              <span>Advanced</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2 data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white">
              <Map className="h-4 w-4" />
              <span>Map View</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2 data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white">
              <BookOpen className="h-4 w-4" />
              <span>Templates</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="standard">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <BookingForm />
              </div>
              
              <div className="space-y-6">
                <Card className="overflow-hidden border-0 shadow-lg">
                  <div className="h-2 bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#8B5CF6]"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Brain className="h-5 w-5 text-[#D946EF]" />
                      AI Dispatch Assistant
                    </CardTitle>
                    <CardDescription>
                      Smart recommendations and insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="text-gray-600 mb-4">
                      Our enhanced AI assistant provides comprehensive dispatch optimization with real-time insights 
                      and intelligent recommendations.
                    </p>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                      <div className="flex items-center gap-1.5 bg-[#F1F0FB] p-1.5 rounded-md">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Traffic analysis
                      </div>
                      <div className="flex items-center gap-1.5 bg-[#F1F0FB] p-1.5 rounded-md">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Optimal routes
                      </div>
                      <div className="flex items-center gap-1.5 bg-[#F1F0FB] p-1.5 rounded-md">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        Resource allocation
                      </div>
                      <div className="flex items-center gap-1.5 bg-[#F1F0FB] p-1.5 rounded-md">
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        Risk assessment
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <AIDispatchInsights />
                
                <Card className="overflow-hidden border-0 shadow-lg">
                  <div className="h-2 bg-gradient-to-r from-[#F97316] to-[#FFDEE2]"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-[#F97316]" />
                      Scheduling Options
                    </CardTitle>
                    <CardDescription>
                      Choose timing preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <RadioGroup defaultValue="asap" className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="asap" id="asap" />
                          <Label htmlFor="asap" className="text-sm">ASAP (Next Available)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="scheduled" id="scheduled" />
                          <Label htmlFor="scheduled" className="text-sm">Scheduled Time</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="recurring" id="recurring" />
                          <Label htmlFor="recurring" className="text-sm">Recurring Schedule</Label>
                        </div>
                      </RadioGroup>
                      
                      <div className="pt-2">
                        <Label htmlFor="deadline" className="text-sm">Deadline (optional)</Label>
                        <Input 
                          id="deadline" 
                          type="datetime-local" 
                          className="mt-1 text-sm"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center">
                        <Truck className="h-4 w-4 mr-2" />
                        Vehicle Assignment
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <div className="space-y-4 pt-8">
                      <h3 className="text-lg font-medium">Vehicle Assignment</h3>
                      <p className="text-sm text-gray-500">
                        Select the appropriate vehicle type for this dispatch.
                      </p>
                      <RadioGroup defaultValue="ambulance" className="space-y-3 pt-4">
                        <div className="flex items-start space-x-3 border p-3 rounded-md">
                          <RadioGroupItem value="ambulance" id="ambulance" className="mt-1" />
                          <div>
                            <Label htmlFor="ambulance" className="font-medium">Ambulance</Label>
                            <p className="text-xs text-gray-500">For emergency medical transport</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 border p-3 rounded-md">
                          <RadioGroupItem value="wheelchair" id="wheelchair" className="mt-1" />
                          <div>
                            <Label htmlFor="wheelchair" className="font-medium">Wheelchair Van</Label>
                            <p className="text-xs text-gray-500">For non-emergency transport</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 border p-3 rounded-md">
                          <RadioGroupItem value="stretcher" id="stretcher" className="mt-1" />
                          <div>
                            <Label htmlFor="stretcher" className="font-medium">Stretcher Van</Label>
                            <p className="text-xs text-gray-500">For bed-confined patients</p>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced">
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="h-2 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF]"></div>
              <CardHeader>
                <CardTitle>Advanced Dispatch Options</CardTitle>
                <CardDescription>Configure specialized routing, recurring schedules, and transport chains</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="special-instructions">Special Instructions</Label>
                    <textarea 
                      id="special-instructions"
                      className="w-full h-24 p-2 border rounded-md"
                      placeholder="Enter any special requirements or instructions..."
                    ></textarea>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="priority-level">Priority Level</Label>
                      <select id="priority-level" className="w-full p-2 border rounded-md">
                        <option value="normal">Normal</option>
                        <option value="urgent">Urgent</option>
                        <option value="emergency">Emergency</option>
                        <option value="scheduled">Scheduled</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="billing-code">Billing Code</Label>
                      <Input id="billing-code" placeholder="Enter billing code" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t p-4 bg-gray-50 flex justify-end">
                <Button onClick={() => setActiveTab("standard")}>
                  Return to Standard Form
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="map">
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="h-2 bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6]"></div>
              <CardHeader>
                <CardTitle>Interactive Map View</CardTitle>
                <CardDescription>Visually select pickup and dropoff locations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-slate-100 rounded-md flex items-center justify-center">
                  <div className="text-center p-6">
                    <Map className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                    <p className="text-slate-500">Map view will load here</p>
                    <p className="text-xs text-slate-400 mt-2">Select locations by clicking on the map</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t p-4 bg-gray-50 flex justify-end">
                <Button onClick={() => setActiveTab("standard")}>
                  Return to Standard Form
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="templates">
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="h-2 bg-gradient-to-r from-[#F97316] to-[#D946EF]"></div>
              <CardHeader>
                <CardTitle>Dispatch Templates</CardTitle>
                <CardDescription>Load pre-configured dispatch templates to save time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: "Hospital Transfer", icon: "🏥", description: "Standard hospital-to-hospital transfer template" },
                    { name: "Routine Checkup", icon: "🩺", description: "Regular scheduled medical appointment" },
                    { name: "Emergency Transport", icon: "🚨", description: "High-priority emergency transport" },
                    { name: "Dialysis Transport", icon: "💉", description: "Regular transport for dialysis patients" },
                    { name: "Discharge Home", icon: "🏠", description: "Hospital to home transfer template" },
                    { name: "Physician Referral", icon: "👨‍⚕️", description: "Specialist visit by physician referral" },
                  ].map((template, i) => (
                    <div 
                      key={i}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white"
                      onClick={() => toast.info(`${template.name} template loaded`)}
                    >
                      <div className="text-2xl mb-2">{template.icon}</div>
                      <h3 className="font-medium mb-1">{template.name}</h3>
                      <p className="text-xs text-gray-500">{template.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t p-4 bg-gray-50 flex justify-end">
                <Button onClick={() => setActiveTab("standard")}>
                  Return to Standard Form
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-4 mt-6">
          <Button 
            variant="outline" 
            onClick={handleCancelDispatch}
          >
            Cancel
          </Button>
          <Button
            className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:from-[#7C3AED] hover:to-[#C026D3]"
            onClick={() => {
              toast.success("Dispatch created successfully");
              navigate("/dispatch");
            }}
          >
            Create Dispatch
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateDispatch;
