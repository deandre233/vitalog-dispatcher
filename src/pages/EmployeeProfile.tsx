import { SidebarProvider, SidebarRail } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { Header } from "@/components/layout/Header";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  User, Phone, MapPin, Shield, Clock, ArrowLeft, Calendar, Mail,
  Building2, AlertCircle, FileText, Award, AlertTriangle, Bell,
  Syringe, CircuitBoard, Signal, Key, Camera, HelpCircle, Fingerprint,
  Calculator
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  middle_initial?: string;
  suffix?: string;
  mobile: string | null;
  station: string | null;
  status: string | null;
  employee_type: string | null;
  certification_level: string | null;
  created_at: string | null;
  readable_id: string | null;
  nemsis_uuid?: string;
  emergency_contact?: string;
  login_name?: string;
  last_login_attempt?: string;
  last_login_success?: string;
  beacon_token?: string;
  latest_ping?: string;
}

export function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState({
    dispatch: true,
    schedule: true,
    shift: true,
    incident: true,
    supervisor: false,
    twoFactor: false
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('employees')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        setEmployee(data);
      } catch (error) {
        console.error('Error fetching employee:', error);
        toast({
          title: "Error",
          description: "Failed to load employee details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEmployee();
    }
  }, [id, toast]);

  if (!employee) {
    return null;
  }

  const generateRandomPassword = () => {
    toast({
      title: "Password Generated",
      description: "A new random password has been generated and sent to the employee's email.",
    });
  };

  const handleAddPortrait = () => {
    // Implementation for adding portrait
    toast({
      title: "Upload Portrait",
      description: "Portrait upload functionality will be implemented soon.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-medical-gradient-start via-medical-gradient-middle to-medical-gradient-end">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider defaultOpen={true}>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <SidebarRail />
            <div className="flex-1 overflow-auto p-6 space-y-6">
              <div className="flex items-center justify-between mb-6">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/employees')}
                  className="gap-2 text-white hover:bg-white/10"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Directory
                </Button>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <CircuitBoard className="h-6 w-6" />
                  Employee File {employee.readable_id || '#' + employee.id.slice(0, 8)}
                </h1>
              </div>

              <div className="grid grid-cols-4 gap-6">
                <Card className="col-span-1 futuristic-card p-6 space-y-4">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <Avatar className="h-24 w-24 border-4 border-medical-secondary shadow-glow">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.id}`} />
                        <AvatarFallback>{employee.first_name?.[0]}{employee.last_name?.[0]}</AvatarFallback>
                      </Avatar>
                      <Button 
                        size="sm" 
                        className="absolute bottom-0 right-0 rounded-full"
                        onClick={handleAddPortrait}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-center">
                      <h2 className="text-xl font-bold">
                        {employee.first_name} {employee.middle_initial} {employee.last_name} {employee.suffix}
                      </h2>
                      <Badge variant="outline" className="mt-2">
                        {employee.certification_level || 'Uncertified'}
                      </Badge>
                    </div>
                    <div className="w-full space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="h-4 w-4 text-medical-secondary" />
                        <span>{employee.station || 'Unassigned'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="h-4 w-4 text-medical-secondary" />
                        <span>{employee.employee_type || 'Unknown Type'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-medical-secondary" />
                        <span>Active since {new Date(employee.created_at || '').toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="col-span-3 space-y-6">
                  <Card className="futuristic-card">
                    <Tabs defaultValue="identity" className="w-full">
                      <TabsList className="w-full justify-start bg-medical-accent/50 p-1 flex-wrap h-auto">
                        <TabsTrigger value="identity" className="data-[state=active]:bg-white">Identity</TabsTrigger>
                        <TabsTrigger value="demographics" className="data-[state=active]:bg-white">Demographics</TabsTrigger>
                        <TabsTrigger value="roles" className="data-[state=active]:bg-white">Roles</TabsTrigger>
                        <TabsTrigger value="privileges" className="data-[state=active]:bg-white">Privileges</TabsTrigger>
                        <TabsTrigger value="payroll" className="data-[state=active]:bg-white">Payroll</TabsTrigger>
                        <TabsTrigger value="incidents" className="data-[state=active]:bg-white">Incidents</TabsTrigger>
                        <TabsTrigger value="documents" className="data-[state=active]:bg-white">Documents</TabsTrigger>
                        <TabsTrigger value="stats" className="data-[state=active]:bg-white">Stats</TabsTrigger>
                        <TabsTrigger value="certs" className="data-[state=active]:bg-white">Certifications</TabsTrigger>
                        <TabsTrigger value="achievements" className="data-[state=active]:bg-white">Achievements</TabsTrigger>
                        <TabsTrigger value="damage" className="data-[state=active]:bg-white">Damage Reports</TabsTrigger>
                        <TabsTrigger value="announcements" className="data-[state=active]:bg-white">Announcements</TabsTrigger>
                        <TabsTrigger value="immunizations" className="data-[state=active]:bg-white">Immunizations</TabsTrigger>
                        <TabsTrigger value="performance" className="data-[state=active]:bg-white">Performance</TabsTrigger>
                        <TabsTrigger value="notifications" className="data-[state=active]:bg-white">Notifications</TabsTrigger>
                        <TabsTrigger value="security" className="data-[state=active]:bg-white">Security</TabsTrigger>
                        <TabsTrigger value="system" className="data-[state=active]:bg-white">System</TabsTrigger>
                      </TabsList>

                      <TabsContent value="identity" className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Name</Label>
                              <div className="grid grid-cols-6 gap-2">
                                <Input 
                                  className="col-span-2 bg-medical-accent/10"
                                  placeholder="Last name" 
                                  value={employee.last_name || ''} 
                                />
                                <Input 
                                  className="col-span-2 bg-medical-accent/10"
                                  placeholder="First name" 
                                  value={employee.first_name || ''} 
                                />
                                <Input 
                                  className="col-span-1 bg-medical-accent/10"
                                  placeholder="MI" 
                                  value={employee.middle_initial || ''} 
                                />
                                <Input 
                                  className="col-span-1 bg-medical-accent/10"
                                  placeholder="Suffix" 
                                  value={employee.suffix || ''} 
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Mobile number</Label>
                              <Input 
                                value={employee.mobile || ''} 
                                className="bg-medical-accent/10"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Emergency Contact</Label>
                              <Input 
                                value={employee.emergency_contact || ''} 
                                className="bg-medical-accent/10"
                                placeholder="Name and phone number"
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Label>NEMSIS UUID</Label>
                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <Input 
                                value={employee.nemsis_uuid || ''} 
                                className="bg-medical-accent/10 font-mono text-sm"
                                readOnly
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Station Assignment</Label>
                              <Select defaultValue={employee.station || undefined}>
                                <SelectTrigger className="bg-medical-accent/10">
                                  <SelectValue placeholder="Select station" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="station1">Station 1</SelectItem>
                                  <SelectItem value="station2">Station 2</SelectItem>
                                  <SelectItem value="float">Float</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="demographics" className="p-6">
                        <Card className="futuristic-card p-6">
                          <div className="space-y-6">
                            <div className="flex items-center gap-4">
                              <User className="h-6 w-6 text-medical-secondary" />
                              <h3 className="text-lg font-semibold">Demographics</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label>Date of Birth</Label>
                                  <Input type="date" className="bg-medical-accent/10" />
                                </div>
                                <div className="space-y-2">
                                  <Label>Gender</Label>
                                  <Select>
                                    <SelectTrigger className="bg-medical-accent/10">
                                      <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="male">Male</SelectItem>
                                      <SelectItem value="female">Female</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </TabsContent>

                      <TabsContent value="roles" className="p-6">
                        <Card className="futuristic-card p-6">
                          <div className="space-y-6">
                            <div className="flex items-center gap-4">
                              <Shield className="h-6 w-6 text-medical-secondary" />
                              <h3 className="text-lg font-semibold">Roles & Permissions</h3>
                            </div>
                            <div className="space-y-4">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="role-admin" />
                                <label htmlFor="role-admin" className="text-sm font-medium">Administrator</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="role-supervisor" />
                                <label htmlFor="role-supervisor" className="text-sm font-medium">Supervisor</label>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </TabsContent>

                      <TabsContent value="payroll" className="p-6">
                        <Card className="futuristic-card p-6">
                          <div className="space-y-6">
                            <div className="flex items-center gap-4">
                              <Calculator className="h-6 w-6 text-medical-secondary" />
                              <h3 className="text-lg font-semibold">Payroll Information</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label>Pay Rate</Label>
                                  <Input type="number" className="bg-medical-accent/10" placeholder="Hourly rate" />
                                </div>
                                <div className="space-y-2">
                                  <Label>Pay Type</Label>
                                  <Select>
                                    <SelectTrigger className="bg-medical-accent/10">
                                      <SelectValue placeholder="Select pay type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="hourly">Hourly</SelectItem>
                                      <SelectItem value="salary">Salary</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </TabsContent>

                      <TabsContent value="incidents" className="p-6">
                        <Card className="futuristic-card p-6">
                          <div className="space-y-6">
                            <div className="flex items-center gap-4">
                              <AlertTriangle className="h-6 w-6 text-medical-secondary" />
                              <h3 className="text-lg font-semibold">Incident Reports</h3>
                            </div>
                            <div className="text-center text-gray-500">
                              <p>No incidents reported</p>
                            </div>
                          </div>
                        </Card>
                      </TabsContent>

                      <TabsContent value="documents" className="p-6">
                        <Card className="futuristic-card p-6">
                          <div className="space-y-6">
                            <div className="flex items-center gap-4">
                              <FileText className="h-6 w-6 text-medical-secondary" />
                              <h3 className="text-lg font-semibold">Documents</h3>
                            </div>
                            <div className="text-center text-gray-500">
                              <p>No documents uploaded</p>
                            </div>
                          </div>
                        </Card>
                      </TabsContent>

                      <TabsContent value="certs" className="p-6">
                        <Card className="futuristic-card p-6">
                          <div className="space-y-6">
                            <div className="flex items-center gap-4">
                              <Award className="h-6 w-6 text-medical-secondary" />
                              <h3 className="text-lg font-semibold">Certifications</h3>
                            </div>
                            <div className="text-center text-gray-500">
                              <p>No certifications found</p>
                            </div>
                          </div>
                        </Card>
                      </TabsContent>

                      <TabsContent value="immunizations" className="p-6">
                        <Card className="futuristic-card p-6">
                          <div className="space-y-6">
                            <div className="flex items-center gap-4">
                              <Syringe className="h-6 w-6 text-medical-secondary" />
                              <h3 className="text-lg font-semibold">Immunization Records</h3>
                            </div>
                            <div className="text-center text-gray-500">
                              <p>No immunization records found</p>
                            </div>
                          </div>
                        </Card>
                      </TabsContent>

                      <TabsContent value="notifications" className="p-6">
                        <Card className="futuristic-card p-6">
                          <div className="space-y-6">
                            <div className="flex items-center gap-4">
                              <Signal className="h-6 w-6 text-medical-secondary" />
                              <h3 className="text-lg font-semibold">SMS Notifications</h3>
                            </div>
                            
                            <div className="space-y-4">
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="dispatch" 
                                  checked={smsNotifications.dispatch}
                                  onCheckedChange={(checked) => 
                                    setSmsNotifications(prev => ({...prev, dispatch: checked as boolean}))
                                  }
                                />
                                <label htmlFor="dispatch" className="text-sm">
                                  Assigned to or removed from a dispatch
                                </label>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="schedule" 
                                  checked={smsNotifications.schedule}
                                  onCheckedChange={(checked) => 
                                    setSmsNotifications(prev => ({...prev, schedule: checked as boolean}))
                                  }
                                />
                                <label htmlFor="schedule" className="text-sm">
                                  Schedule is ready / Shift begins in one hour / Vacations
                                </label>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="shift" 
                                  checked={smsNotifications.shift}
                                  onCheckedChange={(checked) => 
                                    setSmsNotifications(prev => ({...prev, shift: checked as boolean}))
                                  }
                                />
                                <label htmlFor="shift" className="text-sm">
                                  Shift begins or ends
                                </label>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="incident" 
                                  checked={smsNotifications.incident}
                                  onCheckedChange={(checked) => 
                                    setSmsNotifications(prev => ({...prev, incident: checked as boolean}))
                                  }
                                />
                                <label htmlFor="incident" className="text-sm">
                                  Assigned to or removed from an incident
                                </label>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="supervisor" 
                                  checked={smsNotifications.supervisor}
                                  onCheckedChange={(checked) => 
                                    setSmsNotifications(prev => ({...prev, supervisor: checked as boolean}))
                                  }
                                />
                                <label htmlFor="supervisor" className="text-sm">
                                  Clocked in or out by a supervisor
                                </label>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="2fa" 
                                  checked={smsNotifications.twoFactor}
                                  onCheckedChange={(checked) => 
                                    setSmsNotifications(prev => ({...prev, twoFactor: checked as boolean}))
                                  }
                                />
                                <label htmlFor="2fa" className="text-sm">
                                  Two-factor authentication during login
                                </label>
                              </div>
                            </div>

                            <div className="pt-4">
                              <Button className="w-full">
                                Save Notification Preferences
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </TabsContent>

                      <TabsContent value="security" className="p-6">
                        <Card className="futuristic-card p-6">
                          <div className="space-y-6">
                            <div className="flex items-center gap-4">
                              <Key className="h-6 w-6 text-medical-secondary" />
                              <h3 className="text-lg font-semibold">Login Credentials</h3>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label>Login Username</Label>
                                  <Input 
                                    value={employee.login_name || ''} 
                                    className="bg-medical-accent/10"
                                    readOnly
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label>Password</Label>
                                  <div className="flex gap-2">
                                    <Input 
                                      type="password" 
                                      value="••••••••"
                                      className="bg-medical-accent/10"
                                      readOnly
                                    />
                                    <Button onClick={generateRandomPassword}>
                                      Generate New
                                    </Button>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    User must change password at next login
                                  </p>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label>Last Login Attempt</Label>
                                  <Input 
                                    value={employee.last_login_attempt || 'Never'} 
                                    className="bg-medical-accent/10"
                                    readOnly
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label>Last Successful Login</Label>
                                  <Input 
                                    value={employee.last_login_success || 'Never'} 
                                    className="bg-medical-accent/10"
                                    readOnly
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </TabsContent>

                      <TabsContent value="system" className="p-6">
                        <Card className="futuristic-card p-6">
                          <div className="space-y-6">
                            <div className="flex items-center gap-4">
                              <Fingerprint className="h-6 w-6 text-medical-secondary" />
                              <h3 className="text-lg font-semibold">System Integration</h3>
                            </div>
                            
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Label>Beacon App Token</Label>
                                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="flex gap-2">
                                  <Input 
                                    value={employee.beacon_token || ''} 
                                    className="bg-medical-accent/10 font-mono"
                                    readOnly
                                  />
                                  <Button>Issue New Token</Button>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Latest Ping</Label>
                                <Input 
                                  value={employee.latest_ping || 'Never'} 
                                  className="bg-medical-accent/10"
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}

export default EmployeeProfile;
