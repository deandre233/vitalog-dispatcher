
import { useState } from "react";
import { EmployeeRole } from "@/types/employee";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";
import { UseMutationResult } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { 
  AlertCircle, 
  Shield, 
  Users, 
  Headset, 
  FileEdit, 
  Tool, 
  BadgePercent, 
  FirstAid, 
  Eye, 
  ShieldAlert, 
  Star, 
  Info,
  Medal
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RolesTabProps {
  roles: EmployeeRole | undefined;
  updateRole: UseMutationResult<void, Error, Partial<EmployeeRole>, unknown>;
}

export function RolesTab({ roles, updateRole }: RolesTabProps) {
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  
  const handleRoleToggle = (field: keyof EmployeeRole, currentValue: boolean) => {
    updateRole.mutate({ [field]: !currentValue });
  };

  // AI role recommendations - simulated based on existing roles
  const generateRoleRecommendations = () => {
    if (!roles) return [];
    
    const recommendations = [];
    
    if (roles.is_crew_member && !roles.is_dispatcher && roles.years_experience > 3) {
      recommendations.push({
        role: "Dispatcher",
        reason: "Has 3+ years of experience as crew member, which is valuable for dispatch operations.",
        impact: "High",
      });
    }
    
    if (roles.is_supervisor && !roles.is_qa_reviewer) {
      recommendations.push({
        role: "QA Reviewer", 
        reason: "Supervisors often have the experience needed to perform quality reviews.",
        impact: "Medium",
      });
    }
    
    if (roles.is_biller && !roles.can_see_non_emergent) {
      recommendations.push({
        role: "Can See Non-Emergent", 
        reason: "Billers typically need access to all transport types for complete financial processing.",
        impact: "Medium",
      });
    }
    
    return recommendations;
  };

  const roleRecommendations = generateRoleRecommendations();
  
  return (
    <TabsContent value="roles" className="mt-0 animate-in fade-in-50">
      <div className="p-6">
        {roleRecommendations.length > 0 && (
          <Card className="mb-6 border-l-4 border-l-amber-500">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Medal className="h-5 w-5 text-amber-500" />
                  AI Role Recommendations
                </CardTitle>
                <Switch
                  checked={showAIRecommendations}
                  onCheckedChange={setShowAIRecommendations}
                />
              </div>
              <CardDescription>
                Based on current roles and experience, the system suggests the following role changes
              </CardDescription>
            </CardHeader>
            {showAIRecommendations && (
              <CardContent>
                <div className="space-y-3">
                  {roleRecommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-muted/50 rounded-md">
                      <div className="mt-1">
                        <Badge variant={rec.impact === "High" ? "destructive" : "secondary"}>
                          {rec.impact}
                        </Badge>
                      </div>
                      <div>
                        <p className="font-medium">Add {rec.role} role</p>
                        <p className="text-sm text-muted-foreground">{rec.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        )}
        
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Employee Roles
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage role assignments and access permissions for this employee
            </p>
          </div>
          
          {/* Operational Roles Section */}
          <div className="p-6 border-b">
            <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              Operational Roles
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="font-medium">Crew Member</label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Joins shifts, runs calls, and provides direct patient care
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch
                  checked={roles?.is_crew_member}
                  onCheckedChange={() => handleRoleToggle('is_crew_member', roles?.is_crew_member || false)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="font-medium">Supervisor</label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Oversees crew members and has elevated permissions
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch
                  checked={roles?.is_supervisor}
                  onCheckedChange={() => handleRoleToggle('is_supervisor', roles?.is_supervisor || false)}
                />
              </div>

              {roles?.is_supervisor && (
                <div className="ml-6 pt-2 pb-1 px-4 bg-slate-50 rounded-md border">
                  <label className="font-medium block mb-2 text-sm">Supervisor Role</label>
                  <Select
                    value={roles.supervisor_role}
                    onValueChange={(value: "Captain" | "Lieutenant" | "Full privileges" | "Call-taker / Self-dispatch") => 
                      updateRole.mutate({supervisor_role: value})
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Captain">Captain</SelectItem>
                      <SelectItem value="Lieutenant">Lieutenant</SelectItem>
                      <SelectItem value="Full privileges">Full privileges</SelectItem>
                      <SelectItem value="Call-taker / Self-dispatch">Call-taker / Self-dispatch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="font-medium">Dispatcher</label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Manages inbound calls and crew assignments
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch
                  checked={roles?.is_dispatcher}
                  onCheckedChange={() => handleRoleToggle('is_dispatcher', roles?.is_dispatcher || false)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="font-medium">QA Reviewer</label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Reviews call reports for quality assurance purposes
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch
                  checked={roles?.is_qa_reviewer}
                  onCheckedChange={() => handleRoleToggle('is_qa_reviewer', roles?.is_qa_reviewer || false)}
                />
              </div>
            </div>
          </div>
          
          {/* Administrative Roles Section */}
          <div className="p-6 border-b">
            <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
              <FileEdit className="h-4 w-4 text-indigo-600" />
              Administrative Roles
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="font-medium">HR</label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Can manage employee records and HR functions
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch
                  checked={roles?.is_hr}
                  onCheckedChange={() => handleRoleToggle('is_hr', roles?.is_hr || false)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="font-medium">Biller</label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Manages billing operations and financial records
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch
                  checked={roles?.is_biller}
                  onCheckedChange={() => handleRoleToggle('is_biller', roles?.is_biller || false)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="font-medium">Salesperson</label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Manages contracts and partner relationships
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch
                  checked={roles?.is_salesperson}
                  onCheckedChange={() => handleRoleToggle('is_salesperson', roles?.is_salesperson || false)}
                />
              </div>
            </div>
          </div>
          
          {/* Specialized Roles Section */}
          <div className="p-6 border-b">
            <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
              <FirstAid className="h-4 w-4 text-red-600" />
              Specialized Roles
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="font-medium">Mechanic</label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Maintains and repairs fleet vehicles
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch
                  checked={roles?.is_mechanic}
                  onCheckedChange={() => handleRoleToggle('is_mechanic', roles?.is_mechanic || false)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="font-medium">Medical Director</label>
                  <Badge variant="outline" className="ml-2 text-xs">Clinical</Badge>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Reviews completed run reports for medical protocol compliance
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch
                  checked={roles?.is_medical_director}
                  onCheckedChange={() => handleRoleToggle('is_medical_director', roles?.is_medical_director || false)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="font-medium">Onlooker</label>
                  <Badge variant="outline" className="ml-2 text-xs">Limited Access</Badge>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Can view (but not modify) the active dispatch board within specified regions
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch
                  checked={roles?.is_onlooker}
                  onCheckedChange={() => handleRoleToggle('is_onlooker', roles?.is_onlooker || false)}
                />
              </div>

              {roles?.is_onlooker && (
                <div className="ml-6 pt-3 pb-2 px-4 bg-slate-50 rounded-md border space-y-3">
                  <div>
                    <label className="font-medium block mb-1 text-sm">Facility</label>
                    <Input
                      type="text"
                      value={roles.onlooker_facility ?? ""}
                      onChange={(e) => updateRole.mutate({ onlooker_facility: e.target.value })}
                      className="bg-white"
                      placeholder="Enter facility name"
                    />
                  </div>
                  <div>
                    <label className="font-medium block mb-1 text-sm">City</label>
                    <Input
                      type="text"
                      value={roles.onlooker_city ?? ""}
                      onChange={(e) => updateRole.mutate({ onlooker_city: e.target.value })}
                      className="bg-white"
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="font-medium block mb-1 text-sm">County</label>
                    <Input
                      type="text"
                      value={roles.onlooker_county ?? ""}
                      onChange={(e) => updateRole.mutate({ onlooker_county: e.target.value })}
                      className="bg-white"
                      placeholder="Enter county"
                    />
                  </div>
                  <div className="flex items-center pt-1">
                    <Switch
                      id="non-emergent-switch"
                      checked={roles?.can_see_non_emergent}
                      onCheckedChange={() => handleRoleToggle('can_see_non_emergent', roles?.can_see_non_emergent || false)}
                      className="mr-2"
                    />
                    <label htmlFor="non-emergent-switch" className="text-sm">
                      Allow access to non-emergent calls
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* System Access Roles Section */}
          <div className="p-6">
            <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-600" />
              System Access Roles
              <Badge variant="destructive" className="ml-2">Restricted</Badge>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-amber-50 p-3 rounded-md border border-amber-200">
                <div className="flex items-center gap-2">
                  <label className="font-medium flex items-center">
                    <AlertCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Administrator
                  </label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p className="font-bold text-amber-600">CAUTION:</p> 
                        <p>Unlimited access with no safeguards. This is a high-risk role that should only be assigned to trusted personnel.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch
                  checked={roles?.is_administrator}
                  onCheckedChange={() => handleRoleToggle('is_administrator', roles?.is_administrator || false)}
                  className={cn(roles?.is_administrator ? "bg-amber-500" : "")}
                />
              </div>

              <div className="flex items-center justify-between bg-amber-50 p-3 rounded-md border border-amber-200">
                <div className="flex items-center gap-2">
                  <label className="font-medium flex items-center">
                    <Star className="h-4 w-4 text-amber-600 mr-2" />
                    Principal
                  </label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p className="font-bold text-amber-600">CAUTION:</p>
                        <p>Can sign terms of service and modify system pricing. This role should be reserved for company executives.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch
                  checked={roles?.is_principal}
                  onCheckedChange={() => handleRoleToggle('is_principal', roles?.is_principal || false)}
                  className={cn(roles?.is_principal ? "bg-amber-500" : "")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="font-medium">Provisional</label>
                  <Badge variant="outline" className="ml-2 text-xs">Training</Badge>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Has access only when at a company facility, typically for trainees
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch
                  checked={roles?.is_provisional}
                  onCheckedChange={() => handleRoleToggle('is_provisional', roles?.is_provisional || false)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  );
}
