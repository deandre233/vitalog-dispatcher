
import { useParams } from "react-router-dom";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { useEmployeeRoles } from "@/hooks/useEmployeeRoles";
import { useEmployeePrivileges } from "@/hooks/useEmployeePrivileges";
import { EmployeeAIInsights } from "@/components/employee/EmployeeAIInsights";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/common/PhoneInput";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Award, Calendar, FileText, HeartPulse, BarChart2, MessageSquare } from "lucide-react";
import type { EmployeeRole, EmployeePrivileges } from "@/types/employee";

const EmployeeProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { employee, isLoading: loadingEmployee } = useEmployeeData(id);
  const { roles, isLoading: loadingRoles, updateRole } = useEmployeeRoles(id);
  const { privileges, isLoading: loadingPrivileges, updatePrivileges } = useEmployeePrivileges(id);

  if (loadingEmployee || loadingRoles || loadingPrivileges) {
    return (
      <div className="p-6 space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Card className="p-6">
          <Skeleton className="h-6 w-32 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-10" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Employee not found</h2>
        <p className="mt-2 text-gray-600">The requested employee could not be found.</p>
      </div>
    );
  }

  const handleRoleToggle = (role: keyof EmployeeRole) => {
    if (!roles) return;
    updateRole.mutate({
      [role]: !roles[role]
    });
  };

  const handleSupervisorRoleChange = (value: EmployeeRole['supervisor_role']) => {
    updateRole.mutate({
      supervisor_role: value
    });
  };

  const handlePrivilegeToggle = (privilege: keyof EmployeePrivileges) => {
    if (!privileges) return;
    updatePrivileges.mutate({
      [privilege]: !privileges[privilege]
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{employee.first_name} {employee.last_name}</h1>
            <Badge variant={employee.status === 'Active' ? 'default' : 'secondary'}>
              {employee.status}
            </Badge>
          </div>
          <p className="text-gray-600 mt-1">{employee.readable_id}</p>
        </div>
        <Button variant="outline">Add Portrait</Button>
      </div>

      <ScrollArea className="h-[calc(100vh-160px)]">
        <Tabs defaultValue="identity" className="space-y-6">
          <TabsList className="bg-muted/50 p-1 flex flex-nowrap overflow-x-auto mb-4">
            <TabsTrigger value="identity">Identity</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
            <TabsTrigger value="roles">Roles (1)</TabsTrigger>
            <TabsTrigger value="privileges">Privileges</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="incidents">
              <div className="flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                <span>Incidents</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="documents">
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                <span>Documents</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="stats">
              <div className="flex items-center gap-1">
                <BarChart2 className="w-4 h-4" />
                <span>Stats</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="achievements">
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span>Achievements</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="damage">Damage</TabsTrigger>
            <TabsTrigger value="announcements">
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>Announcements</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="immunizations">
              <div className="flex items-center gap-1">
                <HeartPulse className="w-4 h-4" />
                <span>Immunizations</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="identity" className="space-y-6">
            <Card className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <div className="flex gap-4">
                      <Input value={employee.last_name} readOnly placeholder="Last name" />
                      <Input value={employee.first_name} readOnly placeholder="First name" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Mobile number</Label>
                    <PhoneInput value={employee.mobile || ''} onChange={() => {}} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label>Station</Label>
                    <Select value={employee.station} onValueChange={() => {}}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select station" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="float">Float</SelectItem>
                        <SelectItem value="station1">Station 1</SelectItem>
                        <SelectItem value="station2">Station 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Employee ID</Label>
                    <Input value={employee.readable_id || ''} readOnly />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold">Login Information</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Username</Label>
                      <Input value={employee.readable_id?.toLowerCase() || ''} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <div className="flex gap-2">
                        <Input type="password" value="********" readOnly />
                        <Button variant="outline">Generate New Password</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold">Messaging Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Dispatch notifications</Label>
                      <Switch checked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Schedule notifications</Label>
                      <Switch checked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Incident notifications</Label>
                      <Switch checked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Clock in/out notifications</Label>
                      <Switch checked={true} />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="payroll">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Payroll Information</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Pay Type</Label>
                    <Select value={employee.pay_type || 'hourly'} onValueChange={() => {}}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pay type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="salary">Salary</SelectItem>
                        <SelectItem value="commission">Commission</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Pay Rate</Label>
                    <div className="flex items-center">
                      <span className="mr-2">$</span>
                      <Input type="number" value={employee.pay_rate?.toString() || ''} placeholder="0.00" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Uses Timeclock</Label>
                    <Switch checked={employee.uses_timeclock || false} />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Payment Information</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Direct Deposit</Label>
                      <Switch checked={true} />
                    </div>
                    <div className="space-y-2">
                      <Label>Routing Number</Label>
                      <Input type="text" value="******1234" />
                    </div>
                    <div className="space-y-2">
                      <Label>Account Number</Label>
                      <Input type="text" value="******5678" />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Tax Information</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>W-4 Status</Label>
                      <Badge variant="outline" className="ml-2">Up to date</Badge>
                    </div>
                    <div className="space-y-2">
                      <Label>Tax Withholdings</Label>
                      <div className="flex items-center">
                        <Select defaultValue="single">
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Tax filing status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">Single</SelectItem>
                            <SelectItem value="married">Married</SelectItem>
                            <SelectItem value="head">Head of Household</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="roles">
            <Card className="p-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="font-medium">Crew Member</label>
                  <Switch
                    checked={roles?.is_crew_member}
                    onCheckedChange={() => handleRoleToggle('is_crew_member')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="font-medium">Supervisor</label>
                  <Switch
                    checked={roles?.is_supervisor}
                    onCheckedChange={() => handleRoleToggle('is_supervisor')}
                  />
                </div>

                {roles?.is_supervisor && (
                  <div className="ml-6 bg-gray-50 p-4 rounded-lg">
                    <label className="font-medium block mb-2">Supervisor Role</label>
                    <Select
                      value={roles.supervisor_role}
                      onValueChange={handleSupervisorRoleChange}
                    >
                      <SelectTrigger className="w-full">
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
                  <label className="font-medium">Biller</label>
                  <Switch
                    checked={roles?.is_biller}
                    onCheckedChange={() => handleRoleToggle('is_biller')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="font-medium">Dispatcher</label>
                  <Switch
                    checked={roles?.is_dispatcher}
                    onCheckedChange={() => handleRoleToggle('is_dispatcher')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="font-medium">QA Reviewer</label>
                  <Switch
                    checked={roles?.is_qa_reviewer}
                    onCheckedChange={() => handleRoleToggle('is_qa_reviewer')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="font-medium">HR</label>
                  <Switch
                    checked={roles?.is_hr}
                    onCheckedChange={() => handleRoleToggle('is_hr')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="font-medium">Mechanic</label>
                  <Switch
                    checked={roles?.is_mechanic}
                    onCheckedChange={() => handleRoleToggle('is_mechanic')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="font-medium">Salesperson</label>
                  <Switch
                    checked={roles?.is_salesperson}
                    onCheckedChange={() => handleRoleToggle('is_salesperson')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="font-medium">Medical Director</label>
                  <Switch
                    checked={roles?.is_medical_director}
                    onCheckedChange={() => handleRoleToggle('is_medical_director')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="font-medium">Onlooker</label>
                  <Switch
                    checked={roles?.is_onlooker}
                    onCheckedChange={() => handleRoleToggle('is_onlooker')}
                  />
                </div>

                {roles?.is_onlooker && (
                  <div className="ml-6 space-y-4">
                    <div>
                      <label className="font-medium block mb-2">Facility</label>
                      <input
                        type="text"
                        value={roles.onlooker_facility}
                        onChange={(e) => updateRole.mutate({ onlooker_facility: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="font-medium block mb-2">City</label>
                      <input
                        type="text"
                        value={roles.onlooker_city}
                        onChange={(e) => updateRole.mutate({ onlooker_city: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="font-medium block mb-2">County</label>
                      <input
                        type="text"
                        value={roles.onlooker_county}
                        onChange={(e) => updateRole.mutate({ onlooker_county: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <label className="font-medium">Can See Non-Emergent</label>
                  <Switch
                    checked={roles?.can_see_non_emergent}
                    onCheckedChange={() => handleRoleToggle('can_see_non_emergent')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="font-medium">Administrator</label>
                  <Switch
                    checked={roles?.is_administrator}
                    onCheckedChange={() => handleRoleToggle('is_administrator')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="font-medium">Principal</label>
                  <Switch
                    checked={roles?.is_principal}
                    onCheckedChange={() => handleRoleToggle('is_principal')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="font-medium">Provisional</label>
                  <Switch
                    checked={roles?.is_provisional}
                    onCheckedChange={() => handleRoleToggle('is_provisional')}
                  />
                </div>
              </div>
            </div>
            </Card>
          </TabsContent>

          <TabsContent value="privileges">
            <Card className="p-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700">Patient Information</h3>
                <div className="ml-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">View</label>
                    <Switch
                      checked={privileges?.can_view_patient_info}
                      onCheckedChange={() => handlePrivilegeToggle('can_view_patient_info')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Edit</label>
                    <Switch
                      checked={privileges?.can_edit_patient_info}
                      onCheckedChange={() => handlePrivilegeToggle('can_edit_patient_info')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Delete</label>
                    <Switch
                      checked={privileges?.can_delete_patient_info}
                      onCheckedChange={() => handlePrivilegeToggle('can_delete_patient_info')}
                    />
                  </div>
                </div>

                <h3 className="font-medium text-gray-700">Billing Information</h3>
                <div className="ml-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">View</label>
                    <Switch
                      checked={privileges?.can_view_billing_info}
                      onCheckedChange={() => handlePrivilegeToggle('can_view_billing_info')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Edit</label>
                    <Switch
                      checked={privileges?.can_edit_billing_info}
                      onCheckedChange={() => handlePrivilegeToggle('can_edit_billing_info')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Delete</label>
                    <Switch
                      checked={privileges?.can_delete_billing_info}
                      onCheckedChange={() => handlePrivilegeToggle('can_delete_billing_info')}
                    />
                  </div>
                </div>

                <h3 className="font-medium text-gray-700">Dispatch Information</h3>
                <div className="ml-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">View</label>
                    <Switch
                      checked={privileges?.can_view_dispatch_info}
                      onCheckedChange={() => handlePrivilegeToggle('can_view_dispatch_info')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Edit</label>
                    <Switch
                      checked={privileges?.can_edit_dispatch_info}
                      onCheckedChange={() => handlePrivilegeToggle('can_edit_dispatch_info')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Delete</label>
                    <Switch
                      checked={privileges?.can_delete_dispatch_info}
                      onCheckedChange={() => handlePrivilegeToggle('can_delete_dispatch_info')}
                    />
                  </div>
                </div>

                <h3 className="font-medium text-gray-700">Reports</h3>
                <div className="ml-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">View</label>
                    <Switch
                      checked={privileges?.can_view_reports}
                      onCheckedChange={() => handlePrivilegeToggle('can_view_reports')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Create</label>
                    <Switch
                      checked={privileges?.can_create_reports}
                      onCheckedChange={() => handlePrivilegeToggle('can_create_reports')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Edit</label>
                    <Switch
                      checked={privileges?.can_edit_reports}
                      onCheckedChange={() => handlePrivilegeToggle('can_edit_reports')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Delete</label>
                    <Switch
                      checked={privileges?.can_delete_reports}
                      onCheckedChange={() => handlePrivilegeToggle('can_delete_reports')}
                    />
                  </div>
                </div>

                <h3 className="font-medium text-gray-700">AI Features</h3>
                <div className="ml-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Use AI Assistance</label>
                    <Switch
                      checked={privileges?.can_use_ai_assistance}
                      onCheckedChange={() => handlePrivilegeToggle('can_use_ai_assistance')}
                    />
                  </div>
                </div>
              </div>
            </div>
            </Card>
          </TabsContent>

          <TabsContent value="demographics">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Demographics</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select defaultValue="male">
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="non-binary">Non-binary</SelectItem>
                        <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Ethnicity</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ethnicity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="white">White</SelectItem>
                        <SelectItem value="black">Black or African American</SelectItem>
                        <SelectItem value="asian">Asian</SelectItem>
                        <SelectItem value="hispanic">Hispanic or Latino</SelectItem>
                        <SelectItem value="native-american">Native American</SelectItem>
                        <SelectItem value="pacific-islander">Pacific Islander</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Marital Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select marital status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                        <SelectItem value="separated">Separated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Personal Email</Label>
                      <Input type="email" placeholder="email@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Home Phone</Label>
                      <PhoneInput value="" onChange={() => {}} />
                    </div>
                    <div className="space-y-2">
                      <Label>Home Address</Label>
                      <Input placeholder="Street address" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-2">
                        <Label>City</Label>
                        <Input placeholder="City" />
                      </div>
                      <div className="space-y-2">
                        <Label>State</Label>
                        <Input placeholder="State" />
                      </div>
                      <div className="space-y-2">
                        <Label>ZIP</Label>
                        <Input placeholder="ZIP code" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="incidents">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Incidents</h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Incident Records</h3>
                  <Button>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Report New Incident
                  </Button>
                </div>
                
                <div className="bg-muted/40 rounded-md p-4 text-center">
                  <p className="text-muted-foreground">No incidents reported for this employee.</p>
                </div>
                
                <div className="mt-4 space-y-4">
                  <h3 className="text-lg font-medium">AI Safety Analysis</h3>
                  <Card className="bg-green-50 p-4 border-green-200">
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full mr-4">
                        <BarChart2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-green-800">Low Risk Profile</h4>
                        <p className="text-sm text-green-700 mt-1">This employee has maintained an excellent safety record with no incidents over the past 24 months.</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Documents</h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Employee Documents</h3>
                  <Button>
                    <FileText className="mr-2 h-4 w-4" />
                    Upload Document
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="border rounded-md p-4 hover:bg-muted/20 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Employment Contract</h4>
                        <p className="text-sm text-muted-foreground">Uploaded on Jan 15, 2023</p>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 hover:bg-muted/20 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">W-4 Form</h4>
                        <p className="text-sm text-muted-foreground">Uploaded on Jan 15, 2023</p>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 hover:bg-muted/20 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Direct Deposit Authorization</h4>
                        <p className="text-sm text-muted-foreground">Uploaded on Jan 15, 2023</p>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Statistics & Metrics</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Response Time</h3>
                    <div className="text-2xl font-bold">4.2 min</div>
                    <p className="text-xs text-muted-foreground mt-1">-12% from last month</p>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Transports</h3>
                    <div className="text-2xl font-bold">78</div>
                    <p className="text-xs text-green-600 mt-1">+8% from last month</p>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Patient Satisfaction</h3>
                    <div className="text-2xl font-bold">94%</div>
                    <p className="text-xs text-green-600 mt-1">+2% from last month</p>
                  </Card>
                </div>
                
                <div className="mt-8">
                  <h3 className="font-semibold mb-4">Performance Trends</h3>
                  <div className="h-64 bg-muted/30 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Chart visualization coming soon</p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="font-semibold mb-4">AI Performance Insights</h3>
                  <Card className="bg-blue-50 p-4 border-blue-200">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded-full mr-4">
                        <BarChart2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-800">Consistent High Performance</h4>
                        <p className="text-sm text-blue-700 mt-1">This employee consistently shows excellent response times and patient care metrics, placing them in the top 10% of the team.</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="certificates">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Certificates & Training</h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Active Certifications</h3>
                  <Button>Add Certification</Button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">EMT-Paramedic</h4>
                        <p className="text-sm text-muted-foreground">Expires on: Dec 31, 2023</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Advanced Cardiac Life Support</h4>
                        <p className="text-sm text-muted-foreground">Expires on: Mar 15, 2024</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Pediatric Advanced Life Support</h4>
                        <p className="text-sm text-muted-foreground">Expires on: Jun 30, 2023</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Expiring Soon</Badge>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Training History</h3>
                  <div className="space-y-4">
                    <div className="bg-muted/20 p-4 rounded-md">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">Mass Casualty Incident Response</h4>
                          <p className="text-sm text-muted-foreground">Completed on: Jan 10, 2023</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">8 hrs</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/20 p-4 rounded-md">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">Advanced Airway Management</h4>
                          <p className="text-sm text-muted-foreground">Completed on: Nov 5, 2022</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">4 hrs</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Achievements & Awards</h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Recognition</h3>
                  <Button>Add Achievement</Button>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <div className="border rounded-md p-6 bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
                    <div className="flex items-start">
                      <div className="mr-4">
                        <Award className="h-8 w-8 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Employee of the Month</h4>
                        <p className="text-sm text-muted-foreground">Awarded on: March 2023</p>
                        <p className="mt-2">Recognized for outstanding dedication to patient care and exemplary teamwork during the downtown multi-vehicle incident response.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-6">
                    <div className="flex items-start">
                      <div className="mr-4">
                        <Award className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Advanced Life Support Excellence</h4>
                        <p className="text-sm text-muted-foreground">Awarded on: November 2022</p>
                        <p className="mt-2">Recognized for exceptional care and successful resuscitation during a critical cardiac event.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Notable Accomplishments</h3>
                  <div className="space-y-4">
                    <div className="bg-muted/20 p-4 rounded-md">
                      <h4 className="font-medium">1,000+ Successful Transports</h4>
                      <p className="text-sm mt-1">Achieved milestone in February 2023</p>
                    </div>
                    
                    <div className="bg-muted/20 p-4 rounded-md">
                      <h4 className="font-medium">Field Training Officer Certification</h4>
                      <p className="text-sm mt-1">Completed advanced training program in December 2022</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="damage">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Damage Reports</h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Vehicle & Equipment Damage</h3>
                  <Button>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Report Damage
                  </Button>
                </div>
                
                <div className="bg-muted/40 rounded-md p-4 text-center">
                  <p className="text-muted-foreground">No damage reports filed for this employee.</p>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Safety Record</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="p-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Accident-Free Days</h4>
                      <div className="text-2xl font-bold">365</div>
                    </Card>
                    
                    <Card className="p-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Vehicle Incidents</h4>
                      <div className="text-2xl font-bold">0</div>
                    </Card>
                    
                    <Card className="p-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Equipment Damage</h4>
                      <div className="text-2xl font-bold">0</div>
                    </Card>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="announcements">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Company Announcements</h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Personal Messages</h3>
                  <Badge className="bg-green-100 text-green-800">{3} New</Badge>
                </div>
                
                <div className="space-y-4">
                  <Card className="p-4 border-l-4 border-l-blue-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Policy Update: Overtime Scheduling</h4>
                        <p className="text-sm text-muted-foreground">From: HR Department • 2 days ago</p>
                        <p className="mt-2">Please review the updated overtime policy which takes effect next month. New scheduling procedures will be implemented.</p>
                      </div>
                      <Badge variant="outline">Unread</Badge>
                    </div>
                    <div className="mt-2 flex justify-end">
                      <Button variant="outline" size="sm">Mark as Read</Button>
                      <Button variant="ghost" size="sm" className="ml-2">View Details</Button>
                    </div>
                  </Card>
                  
                  <Card className="p-4 border-l-4 border-l-green-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Congratulations on Your Work Anniversary!</h4>
                        <p className="text-sm text-muted-foreground">From: Management Team • 1 week ago</p>
                        <p className="mt-2">Thank you for your dedicated service. Your commitment to excellence has been invaluable to our team.</p>
                      </div>
                      <Badge variant="outline">Unread</Badge>
                    </div>
                    <div className="mt-2 flex justify-end">
                      <Button variant="outline" size="sm">Mark as Read</Button>
                      <Button variant="ghost" size="sm" className="ml-2">View Details</Button>
                    </div>
                  </Card>
                </div>
                
                <Separator />
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Company-Wide Announcements</h3>
                  <div className="space-y-4">
                    <Card className="p-4 hover:bg-muted/20 transition-colors">
                      <h4 className="font-medium">Upcoming Training Session: Advanced Patient Care</h4>
                      <p className="text-sm text-muted-foreground">Posted: May 10, 2023</p>
                      <p className="mt-2">All medics are invited to attend the optional training session next Friday at HQ.</p>
                    </Card>
                    
                    <Card className="p-4 hover:bg-muted/20 transition-colors">
                      <h4 className="font-medium">System Update: Dispatch Software Changes</h4>
                      <p className="text-sm text-muted-foreground">Posted: May 5, 2023</p>
                      <p className="mt-2">Important updates to the dispatch system will be deployed this weekend.</p>
                    </Card>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="immunizations">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Immunization Records</h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Vaccination Status</h3>
                  <Button>Add Vaccination Record</Button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">COVID-19 Vaccination</h4>
                        <p className="text-sm text-muted-foreground">Date: Mar 15, 2022 • Booster: Nov 10, 2022</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Up to Date</Badge>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Hepatitis B Series</h4>
                        <p className="text-sm text-muted-foreground">Completed: Jan 20, 2020</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Complete</Badge>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Tetanus/Tdap</h4>
                        <p className="text-sm text-muted-foreground">Date: Sep 5, 2019</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Update Due</Badge>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Health Compliance Status</h3>
                  <Card className="bg-green-50 p-4 border-green-200">
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full mr-4">
                        <HeartPulse className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-green-800">98% Compliant</h4>
                        <p className="text-sm text-green-700 mt-1">Your immunization record is nearly complete. Please update your Tetanus/Tdap vaccination to achieve full compliance.</p>
                      </div>
                    </div>
                  </Card>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">TB Testing History</h3>
                  <div className="space-y-4">
                    <div className="bg-muted/20 p-4 rounded-md">
                      <h4 className="font-medium">Annual TB Test</h4>
                      <p className="text-sm">Date: February 15, 2023 • Result: Negative</p>
                    </div>
                    
                    <div className="bg-muted/20 p-4 rounded-md">
                      <h4 className="font-medium">Annual TB Test</h4>
                      <p className="text-sm">Date: February 10, 2022 • Result: Negative</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </ScrollArea>

      {id && <EmployeeAIInsights employeeId={id} />}
    </div>
  );
};

export default EmployeeProfile;
