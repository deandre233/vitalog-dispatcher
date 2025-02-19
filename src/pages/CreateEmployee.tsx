
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhoneInput } from "@/components/common/PhoneInput";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, Building, Briefcase, Save } from "lucide-react";
import type { Employee, EmployeeRole } from "@/types/employee";

export default function CreateEmployee() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    station: "",
    employee_type: "full_time",
    certification_level: "",
    pay_type: "hourly",
    pay_rate: 0,
    uses_timeclock: true,
  });

  const [roles, setRoles] = useState<Partial<EmployeeRole>>({
    is_crew_member: false,
    is_supervisor: false,
    supervisor_role: "Call-taker / Self-dispatch",
    is_biller: false,
    is_dispatcher: false,
    is_qa_reviewer: false,
    is_hr: false,
    is_mechanic: false,
    is_salesperson: false,
    is_medical_director: false,
    is_onlooker: false,
    can_see_non_emergent: false,
    is_administrator: false,
    is_principal: false,
    is_provisional: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create employee record
      const { data: employee, error: employeeError } = await supabase
        .from('employees')
        .insert([{
          ...formData,
          status: 'Active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (employeeError) throw employeeError;

      // Create employee roles
      if (employee) {
        const { error: rolesError } = await supabase
          .from('employee_roles')
          .insert([{
            ...roles,
            employee_id: employee.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }]);

        if (rolesError) throw rolesError;
      }

      toast({
        title: "Success",
        description: "Employee created successfully",
      });

      navigate("/employees");
    } catch (error) {
      console.error('Error creating employee:', error);
      toast({
        title: "Error",
        description: "Failed to create employee",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Add New Employee</h2>
          <p className="text-sm text-muted-foreground">Create a new employee profile with roles and permissions</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/employees")}>Cancel</Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="employment" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Employment
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Roles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    required
                    value={formData.last_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <PhoneInput
                    value={formData.mobile || ""}
                    onChange={(value) => setFormData(prev => ({ ...prev, mobile: value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="station">Assigned Station</Label>
                  <Select
                    value={formData.station}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, station: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select station" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="station1">Station 1</SelectItem>
                      <SelectItem value="station2">Station 2</SelectItem>
                      <SelectItem value="station3">Station 3</SelectItem>
                      <SelectItem value="float">Float</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="employment">
            <Card className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Employment Type</Label>
                  <Select
                    value={formData.employee_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, employee_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_time">Full Time</SelectItem>
                      <SelectItem value="part_time">Part Time</SelectItem>
                      <SelectItem value="contractor">Contractor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Certification Level</Label>
                  <Select
                    value={formData.certification_level}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, certification_level: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Pay Type</Label>
                  <RadioGroup
                    value={formData.pay_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, pay_type: value }))}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hourly" id="hourly" />
                      <Label htmlFor="hourly">Hourly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="salary" id="salary" />
                      <Label htmlFor="salary">Salary</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pay_rate">Pay Rate</Label>
                  <Input
                    id="pay_rate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.pay_rate}
                    onChange={(e) => setFormData(prev => ({ ...prev, pay_rate: parseFloat(e.target.value) }))}
                  />
                </div>

                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="uses_timeclock"
                      checked={formData.uses_timeclock}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, uses_timeclock: checked as boolean }))
                      }
                    />
                    <Label htmlFor="uses_timeclock">Uses Time Clock</Label>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="roles">
            <Card className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_crew_member"
                        checked={roles.is_crew_member}
                        onCheckedChange={(checked) => 
                          setRoles(prev => ({ ...prev, is_crew_member: checked as boolean }))
                        }
                      />
                      <Label htmlFor="is_crew_member">Crew Member</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_supervisor"
                        checked={roles.is_supervisor}
                        onCheckedChange={(checked) => 
                          setRoles(prev => ({ ...prev, is_supervisor: checked as boolean }))
                        }
                      />
                      <Label htmlFor="is_supervisor">Supervisor</Label>
                    </div>

                    {roles.is_supervisor && (
                      <div className="ml-6">
                        <Select
                          value={roles.supervisor_role}
                          onValueChange={(value) => 
                            setRoles(prev => ({ ...prev, supervisor_role: value as EmployeeRole['supervisor_role'] }))
                          }
                        >
                          <SelectTrigger>
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

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_dispatcher"
                        checked={roles.is_dispatcher}
                        onCheckedChange={(checked) => 
                          setRoles(prev => ({ ...prev, is_dispatcher: checked as boolean }))
                        }
                      />
                      <Label htmlFor="is_dispatcher">Dispatcher</Label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_qa_reviewer"
                        checked={roles.is_qa_reviewer}
                        onCheckedChange={(checked) => 
                          setRoles(prev => ({ ...prev, is_qa_reviewer: checked as boolean }))
                        }
                      />
                      <Label htmlFor="is_qa_reviewer">QA Reviewer</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_hr"
                        checked={roles.is_hr}
                        onCheckedChange={(checked) => 
                          setRoles(prev => ({ ...prev, is_hr: checked as boolean }))
                        }
                      />
                      <Label htmlFor="is_hr">HR</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_administrator"
                        checked={roles.is_administrator}
                        onCheckedChange={(checked) => 
                          setRoles(prev => ({ ...prev, is_administrator: checked as boolean }))
                        }
                      />
                      <Label htmlFor="is_administrator">Administrator</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_principal"
                        checked={roles.is_principal}
                        onCheckedChange={(checked) => 
                          setRoles(prev => ({ ...prev, is_principal: checked as boolean }))
                        }
                      />
                      <Label htmlFor="is_principal">Principal</Label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="can_see_non_emergent"
                      checked={roles.can_see_non_emergent}
                      onCheckedChange={(checked) => 
                        setRoles(prev => ({ ...prev, can_see_non_emergent: checked as boolean }))
                      }
                    />
                    <Label htmlFor="can_see_non_emergent">Can See Non-Emergent Cases</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_provisional"
                      checked={roles.is_provisional}
                      onCheckedChange={(checked) => 
                        setRoles(prev => ({ ...prev, is_provisional: checked as boolean }))
                      }
                    />
                    <Label htmlFor="is_provisional">Provisional Access</Label>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end gap-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Employee
          </Button>
        </div>
      </form>
    </div>
  );
}
