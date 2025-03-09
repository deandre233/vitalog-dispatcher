
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { EmployeeRole } from "@/types/employee";
import { 
  Users, 
  ShieldAlert,
  Shield,
  Cog, 
  User, 
  HeartPulse,
  HardHat,
  DollarSign,
  Headphones,
  FileCheck,
  Settings,
  Building2
} from "lucide-react";

interface RolesTabProps {
  roles: EmployeeRole;
  updateRole: any;
}

export function RolesTab({ roles, updateRole }: RolesTabProps) {
  const [activeCategory, setActiveCategory] = useState("operational");

  const handleRoleToggle = (key: keyof EmployeeRole) => {
    updateRole.mutate({
      [key]: !roles[key]
    });
  };

  const handleSelectChange = (value: string) => {
    updateRole.mutate({
      supervisor_role: value
    });
  };

  const handleTextChange = (key: keyof EmployeeRole, value: string) => {
    updateRole.mutate({
      [key]: value
    });
  };

  // Role categories with explanations
  const categories = {
    operational: {
      title: "Operational Roles",
      description: "Roles related to daily operations and transport services",
      icon: <Users className="h-5 w-5" />
    },
    administrative: {
      title: "Administrative Roles",
      description: "Management and oversight roles",
      icon: <Shield className="h-5 w-5" />
    },
    specialized: {
      title: "Specialized Roles",
      description: "Roles requiring specific skills or certifications",
      icon: <HeartPulse className="h-5 w-5" />
    },
    system: {
      title: "System Access",
      description: "Roles determining system access levels",
      icon: <Cog className="h-5 w-5" />
    }
  };

  return (
    <TabsContent value="roles" className="space-y-6 py-4">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Employee Roles</h2>
          <p className="text-muted-foreground">
            Configure this employee's roles and responsibilities.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pb-2">
          {Object.entries(categories).map(([key, category]) => (
            <Button
              key={key}
              variant={activeCategory === key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(key)}
              className="flex items-center gap-1"
            >
              {category.icon}
              {category.title}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Operational Roles */}
          {activeCategory === "operational" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-muted-foreground" />
                    Crew Roles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Crew Member</div>
                      <div className="text-sm text-muted-foreground">Can be assigned to crews and transports</div>
                    </div>
                    <Switch 
                      checked={roles.is_crew_member} 
                      onCheckedChange={() => handleRoleToggle("is_crew_member")} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Dispatcher</div>
                      <div className="text-sm text-muted-foreground">Can manage and assign transports</div>
                    </div>
                    <Switch 
                      checked={roles.is_dispatcher} 
                      onCheckedChange={() => handleRoleToggle("is_dispatcher")} 
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-muted-foreground" />
                    Business Operations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Biller</div>
                      <div className="text-sm text-muted-foreground">Can process billing and payments</div>
                    </div>
                    <Switch 
                      checked={roles.is_biller} 
                      onCheckedChange={() => handleRoleToggle("is_biller")} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Salesperson</div>
                      <div className="text-sm text-muted-foreground">Has access to sales tools and reporting</div>
                    </div>
                    <Switch 
                      checked={roles.is_salesperson} 
                      onCheckedChange={() => handleRoleToggle("is_salesperson")} 
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Administrative Roles */}
          {activeCategory === "administrative" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-muted-foreground" />
                    Supervisor Roles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium">Supervisor</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <ShieldAlert className="ml-1.5 h-4 w-4 text-amber-500 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              <p className="text-xs max-w-xs">Supervisors have elevated permissions and can override standard controls. Assign with caution.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="text-sm text-muted-foreground">Has supervisory authority over other employees</div>
                    </div>
                    <Switch 
                      checked={roles.is_supervisor} 
                      onCheckedChange={() => handleRoleToggle("is_supervisor")} 
                    />
                  </div>
                  
                  {roles.is_supervisor && (
                    <div className="mt-2">
                      <label className="text-sm font-medium">Supervisor Level</label>
                      <Select 
                        value={roles.supervisor_role} 
                        onValueChange={handleSelectChange}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select supervisor level" />
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
                  
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium">Principal</span>
                        <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100" variant="outline">
                          Senior
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">Ownership or executive status</div>
                    </div>
                    <Switch 
                      checked={roles.is_principal} 
                      onCheckedChange={() => handleRoleToggle("is_principal")} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">HR Administrator</div>
                      <div className="text-sm text-muted-foreground">Can manage personnel records and settings</div>
                    </div>
                    <Switch 
                      checked={roles.is_hr} 
                      onCheckedChange={() => handleRoleToggle("is_hr")} 
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileCheck className="h-5 w-5 mr-2 text-muted-foreground" />
                    Quality Assurance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">QA Reviewer</div>
                      <div className="text-sm text-muted-foreground">Can review and approve PCRs and documentation</div>
                    </div>
                    <Switch 
                      checked={roles.is_qa_reviewer} 
                      onCheckedChange={() => handleRoleToggle("is_qa_reviewer")} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium">Medical Director</span>
                        <Badge className="ml-2 bg-purple-100 text-purple-800 hover:bg-purple-100" variant="outline">
                          Clinical
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">Medical oversight authority</div>
                    </div>
                    <Switch 
                      checked={roles.is_medical_director} 
                      onCheckedChange={() => handleRoleToggle("is_medical_director")} 
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Specialized Roles */}
          {activeCategory === "specialized" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HardHat className="h-5 w-5 mr-2 text-muted-foreground" />
                    Support Staff
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Mechanic</div>
                      <div className="text-sm text-muted-foreground">Can access vehicle maintenance systems</div>
                    </div>
                    <Switch 
                      checked={roles.is_mechanic} 
                      onCheckedChange={() => handleRoleToggle("is_mechanic")} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Onlooker</div>
                      <div className="text-sm text-muted-foreground">Limited view-only access for facility staff</div>
                    </div>
                    <Switch 
                      checked={roles.is_onlooker} 
                      onCheckedChange={() => handleRoleToggle("is_onlooker")} 
                    />
                  </div>
                  
                  {roles.is_onlooker && (
                    <div className="space-y-3 mt-2 border p-3 rounded-md bg-gray-50">
                      <div>
                        <label className="text-sm font-medium">Facility Name</label>
                        <Input 
                          value={roles.onlooker_facility || ""} 
                          onChange={(e) => handleTextChange("onlooker_facility", e.target.value)}
                          className="mt-1"
                          placeholder="Enter facility name"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">City</label>
                        <Input 
                          value={roles.onlooker_city || ""} 
                          onChange={(e) => handleTextChange("onlooker_city", e.target.value)}
                          className="mt-1"
                          placeholder="Enter city"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">County</label>
                        <Input 
                          value={roles.onlooker_county || ""} 
                          onChange={(e) => handleTextChange("onlooker_county", e.target.value)}
                          className="mt-1"
                          placeholder="Enter county"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div>
                          <div className="text-sm font-medium">Can See Non-Emergent</div>
                          <div className="text-xs text-muted-foreground">Allow access to non-emergency transports</div>
                        </div>
                        <Switch 
                          checked={roles.can_see_non_emergent} 
                          onCheckedChange={() => handleRoleToggle("can_see_non_emergent")} 
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-muted-foreground" />
                    Experience & Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Years of Experience</label>
                    <Input 
                      type="number"
                      value={roles.years_experience || 0}
                      onChange={(e) => handleTextChange("years_experience", e.target.value)}
                      className="mt-1"
                      min="0"
                      max="50"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Years of professional experience in their current role
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <div className="font-medium">Provisional Status</div>
                      <div className="text-sm text-muted-foreground">Employee is still in probationary period</div>
                    </div>
                    <Switch 
                      checked={roles.is_provisional} 
                      onCheckedChange={() => handleRoleToggle("is_provisional")} 
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* System Access */}
          {activeCategory === "system" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-muted-foreground" />
                    System Access
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium">System Administrator</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <ShieldAlert className="ml-1.5 h-4 w-4 text-red-500 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              <p className="text-xs max-w-xs">Administrators have complete access to all system functions and settings. Assign with extreme caution.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <Badge className="ml-2 bg-red-100 text-red-800 hover:bg-red-100" variant="outline">
                          High Risk
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">Full system administration privileges</div>
                    </div>
                    <Switch 
                      checked={roles.is_administrator} 
                      onCheckedChange={() => handleRoleToggle("is_administrator")} 
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </TabsContent>
  );
}

function TabsContent({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
  return (
    <div role="tabpanel" hidden={value !== "roles"} className={className}>
      {children}
    </div>
  );
}
