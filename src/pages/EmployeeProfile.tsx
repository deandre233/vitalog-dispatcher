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

      <Tabs defaultValue="identity" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="identity">Identity</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="privileges">Privileges</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
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
                  <PhoneInput value={employee.mobile || ''} onChange={() => {}} />
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
            <p className="text-gray-600">Coming soon...</p>
          </Card>
        </TabsContent>

        <TabsContent value="incidents">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Incidents</h2>
            <p className="text-gray-600">Coming soon...</p>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Documents</h2>
            <p className="text-gray-600">Coming soon...</p>
          </Card>
        </TabsContent>
      </Tabs>

      {id && <EmployeeAIInsights employeeId={id} />}
    </div>
  );
};

export default EmployeeProfile;
