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
  User,
  Phone,
  MapPin,
  Shield,
  Clock,
  ArrowLeft,
  Calendar,
  Mail,
  Building2,
  AlertCircle,
  FileText,
  Award,
  AlertTriangle,
  Bell,
  Syringe
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  mobile: string | null;
  station: string | null;
  status: string | null;
  employee_type: string | null;
  certification_level: string | null;
  created_at: string | null;
  readable_id: string | null;
}

export function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider defaultOpen={true}>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <SidebarRail />
            <div className="flex-1 bg-[#f4f7fc] overflow-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/employees')}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Directory
                  </Button>
                  <h1 className="text-2xl font-bold">Employee File {employee.readable_id || '#' + employee.id.slice(0, 8)}</h1>
                </div>

                <Tabs defaultValue="identity" className="w-full">
                  <TabsList className="w-full justify-start">
                    <TabsTrigger value="identity">Identity</TabsTrigger>
                    <TabsTrigger value="payroll">Payroll</TabsTrigger>
                    <TabsTrigger value="roles">Roles</TabsTrigger>
                    <TabsTrigger value="privileges">Privileges</TabsTrigger>
                    <TabsTrigger value="demographics">Demographics</TabsTrigger>
                    <TabsTrigger value="incidents">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Incidents
                    </TabsTrigger>
                    <TabsTrigger value="documents">
                      <FileText className="h-4 w-4 mr-2" />
                      Documents
                    </TabsTrigger>
                    <TabsTrigger value="certificates">
                      <Award className="h-4 w-4 mr-2" />
                      Certificates
                    </TabsTrigger>
                    <TabsTrigger value="damage">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Damage
                    </TabsTrigger>
                    <TabsTrigger value="announcements">
                      <Bell className="h-4 w-4 mr-2" />
                      Announcements
                    </TabsTrigger>
                    <TabsTrigger value="immunizations">
                      <Syringe className="h-4 w-4 mr-2" />
                      Immunizations
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="identity" className="space-y-4">
                    <Card className="p-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Name</Label>
                            <div className="flex gap-2">
                              <Input 
                                placeholder="Last name" 
                                value={employee.last_name || ''} 
                                onChange={() => {}} 
                              />
                              <Input 
                                placeholder="First name" 
                                value={employee.first_name || ''} 
                                onChange={() => {}} 
                              />
                              <Input placeholder="MI" className="w-20" />
                              <Input placeholder="Suffix" className="w-20" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Mobile number</Label>
                            <Input value={employee.mobile || ''} onChange={() => {}} />
                          </div>

                          <div className="space-y-2">
                            <Label>Emergency contact</Label>
                            <Input placeholder="Name and phone number" />
                          </div>

                          <div className="space-y-2">
                            <Label>Assigned station</Label>
                            <Select defaultValue={employee.station || undefined}>
                              <SelectTrigger>
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

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Login name</Label>
                            <Input value={employee.readable_id?.toLowerCase() || ''} readOnly />
                          </div>

                          <div className="space-y-2">
                            <Label>Password</Label>
                            <div className="flex gap-2">
                              <Input type="password" value="********" readOnly />
                              <Button variant="outline">Generate new password</Button>
                            </div>
                          </div>

                          <div className="space-y-4 mt-6">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="dispatch" />
                              <label
                                htmlFor="dispatch"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Assigned to or removed from a dispatch
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="schedule" />
                              <label
                                htmlFor="schedule"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Schedule is ready / Shift begins in one hour / Vacations
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="shift" />
                              <label
                                htmlFor="shift"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Shift begins or ends
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="incident" />
                              <label
                                htmlFor="incident"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Assigned to or removed from an incident
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="supervisor" />
                              <label
                                htmlFor="supervisor"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Clocked in or out by a supervisor
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="2fa" />
                              <label
                                htmlFor="2fa"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Two-factor authentication during login
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end">
                        <Button>Save Changes</Button>
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="payroll">
                    <Card className="p-6">
                      <p>Payroll information will be displayed here.</p>
                    </Card>
                  </TabsContent>

                  {/* Add other tab contents as needed */}
                </Tabs>
              </div>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}

export default EmployeeProfile;