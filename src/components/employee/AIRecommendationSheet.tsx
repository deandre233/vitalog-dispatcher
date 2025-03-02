
import React from "react";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Brain, AlertTriangle } from "lucide-react";
import type { AICrewRecommendation, Employee } from "@/types/employee";

interface AIRecommendationSheetProps {
  assignmentRequirements: {
    serviceType: string;
    requiredCertifications: string[];
    startTime: string;
    location: string;
  };
  setAssignmentRequirements: React.Dispatch<React.SetStateAction<{
    serviceType: string;
    requiredCertifications: string[];
    startTime: string;
    location: string;
  }>>;
  handleGetRecommendations: () => Promise<void>;
  aiRecommendations: AICrewRecommendation[];
  setAiRecommendations: React.Dispatch<React.SetStateAction<AICrewRecommendation[]>>;
  employees: Employee[];
  handleEmployeeClick: (employeeId: string) => void;
}

export const AIRecommendationSheet = ({
  assignmentRequirements,
  setAssignmentRequirements,
  handleGetRecommendations,
  aiRecommendations,
  setAiRecommendations,
  employees,
  handleEmployeeClick
}: AIRecommendationSheetProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">
          <Brain className="mr-2 h-4 w-4" />
          AI Crew Recommendations
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>AI Crew Recommendations</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Assignment Requirements</h3>
            <div className="grid gap-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm text-muted-foreground">Service Type</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={assignmentRequirements.serviceType}
                    onChange={(e) => setAssignmentRequirements({
                      ...assignmentRequirements,
                      serviceType: e.target.value
                    })}
                  >
                    <option value="Basic">Basic</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Location</label>
                  <Input 
                    placeholder="Station or location"
                    value={assignmentRequirements.location}
                    onChange={(e) => setAssignmentRequirements({
                      ...assignmentRequirements,
                      location: e.target.value
                    })}
                  />
                </div>
              </div>
              <Button onClick={handleGetRecommendations}>Get Recommendations</Button>
            </div>
          </div>

          {aiRecommendations.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium">Top Recommendations</h3>
              <div className="space-y-3">
                {aiRecommendations.slice(0, 5).map((rec) => {
                  const employee = employees.find(e => e.id === rec.employeeId);
                  return (
                    <Card key={rec.employeeId} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">
                            {employee?.first_name} {employee?.last_name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {employee?.certification_level} • {employee?.station}
                          </p>
                          <div className="mt-2">
                            <Badge className="bg-green-100 text-green-800">
                              {Math.round(rec.matchScore)}% Match
                            </Badge>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEmployeeClick(rec.employeeId)}
                        >
                          View
                        </Button>
                      </div>
                      <div className="mt-3 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-muted-foreground">Skill Match:</span>
                            <span className="ml-1 font-medium">{Math.round(rec.skillMatchScore)}%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Availability:</span>
                            <span className="ml-1 font-medium">{Math.round(rec.availabilityScore)}%</span>
                          </div>
                        </div>
                      </div>
                      {rec.warnings && rec.warnings.length > 0 && (
                        <div className="mt-2 text-sm text-amber-600 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          {rec.warnings[0]}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <SheetFooter className="mt-4">
          <Button variant="outline" onClick={() => setAiRecommendations([])}>
            Clear Recommendations
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
