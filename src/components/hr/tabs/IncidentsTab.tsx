
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useEmployeeIncidents, IncidentFormData } from "@/hooks/useEmployeeIncidents";
import { useEmployeeDetails } from "@/hooks/useEmployeeDetails";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calendar, CheckCircle, ChevronDown, Clock, FileText, Loader2, Shield, Truck, User } from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { shiftRecordsService } from "@/services/shiftRecords";
import { toast } from "sonner";
import { Incident } from "@/hooks/useEmployeeIncidents";

export function IncidentsTab({ employeeId }: { employeeId?: string }) {
  const { incidents, isLoading, isProcessing, createIncident, updateIncident, deleteIncident, getAIAnalysis } = useEmployeeIncidents(employeeId);
  const [activeTab, setActiveTab] = useState("incidents");
  const [shiftRecords, setShiftRecords] = useState<any[]>([]);
  const [isLoadingShifts, setIsLoadingShifts] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  
  const initialFormData: IncidentFormData = {
    incident_type: "",
    incident_date: new Date(),
    description: "",
    severity: "Medium",
    vehicle_involved: false,
    followup_required: false
  };
  
  const [formData, setFormData] = useState<IncidentFormData>(initialFormData);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };
  
  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, [name]: date }));
    }
  };
  
  const handleShiftSelect = async (shiftId: string) => {
    try {
      setIsLoadingShifts(true);
      const shifts = await shiftRecordsService.getShiftRecords();
      const selectedShift = shifts.find(shift => shift.id === shiftId);
      
      if (selectedShift) {
        setFormData((prev) => ({
          ...prev,
          shift_id: shiftId,
          vehicle_id: selectedShift.vehicle_id || prev.vehicle_id
        }));
        
        toast.success("Shift information loaded");
      }
    } catch (error) {
      console.error("Error loading shift information:", error);
      toast.error("Failed to load shift information");
    } finally {
      setIsLoadingShifts(false);
    }
  };
  
  const loadShiftRecords = async () => {
    if (!employeeId) return;
    
    try {
      setIsLoadingShifts(true);
      const shifts = await shiftRecordsService.getShiftRecords();
      
      // Filter shifts by employee
      const employeeShifts = shifts.filter(
        shift => shift.employee_id === employeeId
      );
      
      setShiftRecords(employeeShifts);
    } catch (error) {
      console.error("Error loading shifts:", error);
      toast.error("Failed to load shift records");
    } finally {
      setIsLoadingShifts(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createIncident.mutateAsync(formData);
      setFormData(initialFormData);
      setActiveTab("incidents");
    } catch (error) {
      console.error("Error submitting incident:", error);
    }
  };
  
  const handleReanalyze = async (incident: Incident) => {
    try {
      toast.info("Analyzing incident...");
      const analysis = await getAIAnalysis(incident.id, {
        incidentType: incident.incident_type,
        description: incident.description,
        severity: incident.severity,
        vehicleInvolved: incident.vehicle_involved,
        shift_id: incident.shift_id
      });
      
      if (analysis) {
        toast.success("Incident analysis complete");
        setSelectedIncident(null); // Reset to refresh view
      }
    } catch (error) {
      console.error("Error analyzing incident:", error);
      toast.error("Failed to analyze incident");
    }
  };
  
  const handleResolved = async (incident: Incident) => {
    try {
      await updateIncident.mutateAsync({
        id: incident.id,
        updates: {
          status: "Resolved",
          resolution: incident.resolution || "Issue resolved",
          updated_at: new Date().toISOString()
        }
      });
      toast.success("Incident marked as resolved");
    } catch (error) {
      console.error("Error resolving incident:", error);
      toast.error("Failed to resolve incident");
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="incidents" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Incident Reports
            </TabsTrigger>
            <TabsTrigger value="new" className="flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Report New Incident
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="incidents" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : incidents.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No incident reports found</p>
                <Button 
                  className="mt-4" 
                  variant="outline"
                  onClick={() => setActiveTab("new")}
                >
                  Report New Incident
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {incidents.map((incident) => (
                <Card key={incident.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle>{incident.incident_type}</CardTitle>
                          <Badge variant={
                            incident.status === "Open" ? "destructive" : 
                            incident.status === "In Progress" ? "default" : 
                            "secondary"
                          }>
                            {incident.status}
                          </Badge>
                          <Badge variant={
                            incident.severity === "Critical" ? "destructive" : 
                            incident.severity === "High" ? "default" : 
                            incident.severity === "Medium" ? "secondary" : 
                            "outline"
                          }>
                            {incident.severity}
                          </Badge>
                        </div>
                        <CardDescription className="mt-1 flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {format(new Date(incident.incident_date), "PPP")}
                          {incident.location && (
                            <span className="ml-2">· {incident.location}</span>
                          )}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {incident.status !== "Resolved" && (
                            <DropdownMenuItem onClick={() => handleResolved(incident)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark as Resolved
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleReanalyze(incident)}>
                            <Shield className="mr-2 h-4 w-4" />
                            Re-analyze with AI
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedIncident(
                            selectedIncident?.id === incident.id ? null : incident
                          )}>
                            <FileText className="mr-2 h-4 w-4" />
                            {selectedIncident?.id === incident.id ? "Hide Details" : "View Details"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  
                  {selectedIncident?.id === incident.id && (
                    <CardContent className="pt-2 pb-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-1">Description</h4>
                          <p className="text-sm text-muted-foreground">{incident.description}</p>
                        </div>
                        
                        {incident.vehicle_involved && (
                          <div>
                            <h4 className="font-medium mb-1 flex items-center">
                              <Truck className="mr-2 h-4 w-4" />
                              Vehicle Information
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {incident.vehicle_id ? `Vehicle ID: ${incident.vehicle_id}` : "Vehicle involved, no ID provided"}
                            </p>
                          </div>
                        )}
                        
                        {incident.reported_to && (
                          <div>
                            <h4 className="font-medium mb-1 flex items-center">
                              <User className="mr-2 h-4 w-4" />
                              Reported To
                            </h4>
                            <p className="text-sm text-muted-foreground">{incident.reported_to}</p>
                          </div>
                        )}
                        
                        {incident.followup_required && (
                          <div>
                            <h4 className="font-medium mb-1 flex items-center">
                              <Clock className="mr-2 h-4 w-4" />
                              Follow-up Required
                            </h4>
                            {incident.followup_date && (
                              <p className="text-sm text-muted-foreground">
                                By {format(new Date(incident.followup_date), "PPP")}
                              </p>
                            )}
                          </div>
                        )}
                        
                        {incident.resolution && (
                          <div>
                            <h4 className="font-medium mb-1">Resolution</h4>
                            <p className="text-sm text-muted-foreground">{incident.resolution}</p>
                          </div>
                        )}
                        
                        {incident.ai_analysis && (
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="ai-analysis">
                              <AccordionTrigger>
                                <span className="flex items-center text-sm font-medium">
                                  <Shield className="mr-2 h-4 w-4" />
                                  AI Analysis
                                </span>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-3 p-2 text-sm">
                                  {incident.ai_analysis.summary && (
                                    <div>
                                      <h5 className="font-medium">Summary</h5>
                                      <p className="text-muted-foreground">{incident.ai_analysis.summary}</p>
                                    </div>
                                  )}
                                  
                                  {incident.ai_analysis.riskLevel && (
                                    <div>
                                      <h5 className="font-medium">Risk Level</h5>
                                      <Badge variant={
                                        incident.ai_analysis.riskLevel === "high" ? "destructive" : 
                                        incident.ai_analysis.riskLevel === "medium" ? "default" : 
                                        "outline"
                                      }>
                                        {incident.ai_analysis.riskLevel.charAt(0).toUpperCase() + incident.ai_analysis.riskLevel.slice(1)}
                                      </Badge>
                                    </div>
                                  )}
                                  
                                  {incident.ai_analysis.recommendedActions && incident.ai_analysis.recommendedActions.length > 0 && (
                                    <div>
                                      <h5 className="font-medium">Recommended Actions</h5>
                                      <ul className="list-disc pl-5 text-muted-foreground">
                                        {incident.ai_analysis.recommendedActions.map((action: string, index: number) => (
                                          <li key={index}>{action}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  
                                  {incident.ai_analysis.preventionTips && incident.ai_analysis.preventionTips.length > 0 && (
                                    <div>
                                      <h5 className="font-medium">Prevention Tips</h5>
                                      <ul className="list-disc pl-5 text-muted-foreground">
                                        {incident.ai_analysis.preventionTips.map((tip: string, index: number) => (
                                          <li key={index}>{tip}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  
                                  {incident.ai_analysis.similarIncidents && (
                                    <div>
                                      <h5 className="font-medium">Similar Incidents</h5>
                                      <p className="text-muted-foreground">{incident.ai_analysis.similarIncidents}</p>
                                    </div>
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>Report New Incident</CardTitle>
              <CardDescription>
                Document incidents that occurred during your shifts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="incident_type">Incident Type*</Label>
                      <Select required 
                        onValueChange={(value) => handleSelectChange("incident_type", value)}
                        value={formData.incident_type}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Vehicle Accident">Vehicle Accident</SelectItem>
                          <SelectItem value="Patient Handling Incident">Patient Handling Incident</SelectItem>
                          <SelectItem value="Equipment Failure">Equipment Failure</SelectItem>
                          <SelectItem value="Medication Error">Medication Error</SelectItem>
                          <SelectItem value="Workplace Injury">Workplace Injury</SelectItem>
                          <SelectItem value="Safety Hazard">Safety Hazard</SelectItem>
                          <SelectItem value="Communication Failure">Communication Failure</SelectItem>
                          <SelectItem value="Dispatch Incident">Dispatch Incident</SelectItem>
                          <SelectItem value="Partner Facility Issue">Partner Facility Issue</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="severity">Severity*</Label>
                      <Select required
                        onValueChange={(value) => handleSelectChange("severity", value)}
                        value={formData.severity}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Critical">Critical</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="incident_date">Incident Date*</Label>
                      <DatePicker
                        date={formData.incident_date}
                        onDateChange={(date) => handleDateChange("incident_date", date)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location || ""}
                        onChange={handleInputChange}
                        placeholder="Where did the incident occur?"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="related_shift">Related Shift</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={loadShiftRecords}
                        disabled={isLoadingShifts}
                      >
                        {isLoadingShifts && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Load Shifts
                      </Button>
                    </div>
                    <Select
                      onValueChange={handleShiftSelect}
                      value={formData.shift_id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a shift (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {shiftRecords.map((shift) => (
                          <SelectItem key={shift.id} value={shift.id}>
                            {format(new Date(shift.shift_date), "MMM d, yyyy")} - {shift.shift_type}
                            {shift.vehicle_id && ` - Vehicle: ${shift.vehicle_id}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">Selecting a shift will auto-fill some incident details</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description*</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe what happened..."
                      required
                      rows={4}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="vehicle_involved"
                          checked={formData.vehicle_involved}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("vehicle_involved", checked as boolean)
                          }
                        />
                        <Label htmlFor="vehicle_involved">Vehicle Involved</Label>
                      </div>
                      
                      {formData.vehicle_involved && (
                        <div className="mt-2">
                          <Label htmlFor="vehicle_id">Vehicle ID</Label>
                          <Input
                            id="vehicle_id"
                            name="vehicle_id"
                            value={formData.vehicle_id || ""}
                            onChange={handleInputChange}
                            placeholder="Enter vehicle ID"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reported_to">Reported To</Label>
                      <Input
                        id="reported_to"
                        name="reported_to"
                        value={formData.reported_to || ""}
                        onChange={handleInputChange}
                        placeholder="Who did you report this to?"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="followup_required"
                        checked={formData.followup_required}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("followup_required", checked as boolean)
                        }
                      />
                      <Label htmlFor="followup_required">Follow-up Required</Label>
                    </div>
                    
                    {formData.followup_required && (
                      <div className="mt-2">
                        <Label htmlFor="followup_date">Follow-up Date</Label>
                        <DatePicker
                          date={formData.followup_date}
                          onDateChange={(date) => handleDateChange("followup_date", date)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("incidents")}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isProcessing}>
                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Incident Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
