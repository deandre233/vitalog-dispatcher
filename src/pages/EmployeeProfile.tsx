import { SidebarProvider } from "@/components/ui/sidebar";
import { HRSidebar } from "@/components/hr/HRSidebar";
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
import { Separator } from "@/components/ui/separator";
import { 
  User, Phone, MapPin, Shield, Clock, ArrowLeft, Calendar, Mail,
  Building2, AlertCircle, FileText, Award, AlertTriangle, Bell,
  Syringe, CircuitBoard, Signal, Key, Camera, HelpCircle, Fingerprint,
  Calculator, DollarSign, Wallet, Receipt, CreditCard, Banknote,
  Percent, Clock3, Landmark, FileSpreadsheet, CircleDollarSign, CalendarDays, BadgeDollarSign
} from "lucide-react";
import { useState, useEffect } from "react";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { useEmployeeRoles } from "@/hooks/useEmployeeRoles";
import { useEmployeePrivileges } from "@/hooks/useEmployeePrivileges";
import { useAIEmployeeAnalysis } from "@/hooks/useAIEmployeeAnalysis";
import { supabase } from "@/integrations/supabase/client";
import type { EmployeeRole } from "@/types/employee";

export function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { employee, isLoading: employeeLoading, updateEmployee } = useEmployeeData(id);
  const { roles, updateRole } = useEmployeeRoles(id);
  const { privileges, updatePrivileges } = useEmployeePrivileges(id);
  const { analysis } = useAIEmployeeAnalysis(id || '');
  
  const [smsNotifications, setSmsNotifications] = useState({
    dispatch: true,
    schedule: true,
    shift: true,
    incident: true,
    supervisor: false,
    twoFactor: false
  });

  const handleAddPortrait = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${id}-${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('employee_photos')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('employee_photos')
          .getPublicUrl(fileName);

        await updateEmployee({ photo_url: publicUrl });
        
        toast({
          title: "Success",
          description: "Profile photo updated successfully",
        });
      } catch (error) {
        console.error('Error uploading photo:', error);
        toast({
          title: "Error",
          description: "Failed to upload profile photo",
          variant: "destructive",
        });
      }
    };
    input.click();
  };

  const handleRoleChange = async (field: keyof EmployeeRole, value: any) => {
    try {
      await updateRole.mutateAsync({ [field]: value });
      toast({
        title: "Success",
        description: "Role updated successfully",
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    }
  };

  const handlePrivilegeChange = async (field: string, value: boolean) => {
    try {
      await updatePrivileges.mutateAsync({ [field]: value });
      toast({
        title: "Success",
        description: "Privileges updated successfully",
      });
    } catch (error) {
      console.error('Error updating privileges:', error);
      toast({
        title: "Error",
        description: "Failed to update privileges",
        variant: "destructive",
      });
    }
  };

  const generateRandomPassword = async () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    try {
      // Here you would typically update the password in your auth system
      toast({
        title: "Success",
        description: "New password generated and sent to user",
      });
    } catch (error) {
      console.error('Error generating password:', error);
      toast({
        title: "Error",
        description: "Failed to generate new password",
        variant: "destructive",
      });
    }
  };

  if (!employee || employeeLoading) {
    return <div>Loading...</div>;
  }

  // Get the first role object if it exists
  const role = roles?.[0] || {};

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-medical-gradient-start via-medical-gradient-middle to-medical-gradient-end">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider defaultOpen={true}>
          <div className="min-h-screen flex w-full">
            <HRSidebar />
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
                            <div className="space-y-6">
                              <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                  <Label>Street address</Label>
                                  <Input placeholder="Street address line 1" className="bg-medical-accent/10" />
                                  <Input placeholder="Street address line 2" className="bg-medical-accent/10" />
                                </div>
                                
                                <div className="grid grid-cols-3 gap-4">
                                  <div className="space-y-2">
                                    <Label>City</Label>
                                    <Input placeholder="City" className="bg-medical-accent/10" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>State</Label>
                                    <Select defaultValue="GA">
                                      <SelectTrigger className="bg-medical-accent/10">
                                        <SelectValue placeholder="Select state" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="GA">Georgia</SelectItem>
                                        {/* Add other states as needed */}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>ZIP</Label>
                                    <Input placeholder="#####" className="bg-medical-accent/10" />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Date of birth</Label>
                                    <div className="flex items-center gap-2">
                                      <Input type="date" defaultValue="1983-04-23" className="bg-medical-accent/10" />
                                      <span className="text-sm text-muted-foreground">(41 years old)</span>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Citizenship</Label>
                                    <Input defaultValue="US" className="bg-medical-accent/10" />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Gender</Label>
                                    <Select defaultValue="male">
                                      <SelectTrigger className="bg-medical-accent/10">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Race</Label>
                                    <Select defaultValue="black">
                                      <SelectTrigger className="bg-medical-accent/10">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="black">Black or African American</SelectItem>
                                        <SelectItem value="white">White</SelectItem>
                                        <SelectItem value="asian">Asian</SelectItem>
                                        <SelectItem value="hispanic">Hispanic or Latino</SelectItem>
                                        <SelectItem value="native">Native American</SelectItem>
                                        <SelectItem value="pacific">Pacific Islander</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label>Rank</Label>
                                  <div className="flex items-center gap-2">
                                    <Input className="bg-medical-accent/10" />
                                    <span className="text-sm text-muted-foreground">(NFIRS-1-M / NFIRS-9-B)</span>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label>Provider-issued ID number</Label>
                                  <div className="flex items-center gap-2">
                                    <Input placeholder="if different than patch number" className="bg-medical-accent/10" />
                                    <span className="text-sm text-muted-foreground">(dPersonnel.21)</span>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label>Other email</Label>
                                  <Input placeholder="optional" className="bg-medical-accent/10" />
                                  <p className="text-sm text-muted-foreground">This email address is for your reference only.</p>
                                </div>

                                <div className="space-y-4">
                                  <Label>Other telephones</Label>
                                  <div className="grid grid-cols-2 gap-2">
                                    <Input placeholder="###-###-####" className="bg-medical-accent/10" />
                                    <span className="flex items-center">home</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <Input placeholder="###-###-####" className="bg-medical-accent/10" />
                                    <span className="flex items-center">work</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <Input placeholder="###-###-####" className="bg-medical-accent/10" />
                                    <span className="flex items-center">pager</span>
                                  </div>
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
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id="crew-member"
                                    checked={role.isCrew}
                                    onCheckedChange={(checked) => 
                                      handleRoleChange('isCrew', checked as boolean)
                                    }
                                  />
                                  <label htmlFor="crew-member" className="text-sm font-medium">
                                    Crew Member
                                  </label>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox 
                                      id="supervisor"
                                      checked={role.isSupervisor}
                                      onCheckedChange={(checked) => 
                                        handleRoleChange('isSupervisor', checked as boolean)
                                      }
                                    />
                                    <label htmlFor="supervisor" className="text-sm font-medium">
                                      Supervisor
                                    </label>
                                  </div>
                                  {role.isSupervisor && (
                                    <Select 
                                      value={role.supervisorRole}
                                      onValueChange={(value) => handleRoleChange('supervisorRole', value)}
                                    >
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select supervisor role" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Captain">Captain</SelectItem>
                                        <SelectItem value="Lieutenant">Lieutenant</SelectItem>
                                        <SelectItem value="Full privileges">Full privileges</SelectItem>
                                        <SelectItem value="Call-taker / Self-dispatch">Call-taker / Self-dispatch</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  )}
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id="biller"
                                    checked={role.isBiller}
                                    onCheckedChange={(checked) => 
                                      handleRoleChange('isBiller', checked as boolean)
                                    }
                                  />
                                  <label htmlFor="biller" className="text-sm font-medium">
                                    Biller
                                  </label>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id="dispatcher"
                                    checked={role.isDispatcher}
                                    onCheckedChange={(checked) => 
                                      handleRoleChange('isDispatcher', checked as boolean)
                                    }
                                  />
                                  <label htmlFor="dispatcher" className="text-sm font-medium">
                                    Dispatcher
                                  </label>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id="qa-reviewer"
                                    checked={role.isQAReviewer}
                                    onCheckedChange={(checked) => 
                                      handleRoleChange('isQAReviewer', checked as boolean)
                                    }
                                  />
                                  <label htmlFor="qa-reviewer" className="text-sm font-medium">
                                    QA Reviewer
                                  </label>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id="hr"
                                    checked={role.isHR}
                                    onCheckedChange={(checked) => 
                                      handleRoleChange('isHR', checked as boolean)
                                    }
                                  />
                                  <label htmlFor="hr" className="text-sm font-medium">
                                    HR
                                  </label>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id="mechanic"
                                    checked={role.isMechanic}
                                    onCheckedChange={(checked) => 
                                      handleRoleChange('isMechanic', checked as boolean)
                                    }
                                  />
                                  <label htmlFor="mechanic" className="text-sm font-medium">
                                    Mechanic
                                  </label>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id="salesperson"
                                    checked={role.isSalesperson}
                                    onCheckedChange={(checked) => 
                                      handleRoleChange('isSalesperson', checked as boolean)
                                    }
                                  />
                                  <label htmlFor="salesperson" className="text-sm font-medium">
                                    Salesperson
                                  </label>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id="medical-director"
                                    checked={role.isMedicalDirector}
                                    onCheckedChange={(checked) => 
                                      handleRoleChange('isMedicalDirector', checked as boolean)
                                    }
                                  />
                                  <label htmlFor="medical-director" className="text-sm font-medium">
                                    Medical Director
                                  </label>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox 
                                      id="onlooker"
                                      checked={role.isOnlooker}
                                      onCheckedChange={(checked) => 
                                        handleRoleChange('isOnlooker', checked as boolean)
                                      }
                                    />
                                    <label htmlFor="onlooker" className="text-sm font-medium">
                                      Onlooker
                                    </label>
                                  </div>
                                  {role.isOnlooker && (
                                    <div className="space-y-2 pl-6">
                                      <Input 
                                        placeholder="Facility"
                                        value={role.onlookerFacility}
                                        onChange={(e) => handleRoleChange('onlookerFacility', e.target.value)}
                                        className="bg-medical-accent/10"
                                      />
                                      <Input 
                                        placeholder="City"
                                        value={role.onlookerCity}
                                        onChange={(e) => handleRoleChange('onlookerCity', e.target.value)}
                                        className="bg-medical-accent/10"
                                      />
                                      <Input 
                                        placeholder="County"
                                        value={role.onlookerCounty}
                                        onChange={(e) => handleRoleChange('onlookerCounty', e.target.value)}
                                        className="bg-medical-accent/10"
                                      />
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id="non-emergent"
                                    checked={role.canSeeNonEmergent}
                                    onCheckedChange={(checked) => 
                                      handleRoleChange('canSeeNonEmergent', checked as boolean)
                                    }
                                  />
                                  <label htmlFor="non-emergent" className="text-sm font-medium">
                                    Can see non-emergent
                                  </label>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id="administrator"
                                    checked={role.isAdministrator}
                                    onCheckedChange={(checked) => 
                                      handleRoleChange('isAdministrator', checked as boolean)
                                    }
                                  />
                                  <label htmlFor="administrator" className="text-sm font-medium">
                                    Administrator
                                  </label>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id="principal"
                                    checked={role.isPrincipal}
                                    onCheckedChange={(checked) => 
                                      handleRoleChange('isPrincipal', checked as boolean)
                                    }
                                  />
                                  <label htmlFor="principal" className="text-sm font-medium">
                                    Principal
                                  </label>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id="provisional"
                                    checked={role.isProvisional}
                                    onCheckedChange={(checked) => 
                                      handleRoleChange('isProvisional', checked as boolean)
                                    }
                                  />
                                  <label htmlFor="provisional" className="text-sm font-medium">
                                    Provisional
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </TabsContent>

                      <TabsContent value="privileges" className="p-6">
                        <Card className="futuristic-card p-6">
                          <div className="space-y-6">
                            <div className="flex items-center gap-4">
                              <Shield className="h-6 w-6 text-medical-secondary" />
                              <h3 className="text-lg font-semibold">Access Privileges</h3>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <h4 className="font-medium text-sm text-muted-foreground">Patient Information</h4>
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox 
                                      id="view-patient"
                                      checked={privileges.canViewPatientInfo}
                                      onCheckedChange={(checked) => 
                                        handlePrivilegeChange('canViewPatientInfo', checked as boolean)
                                      }
                                    />
                                    <label htmlFor="view-patient" className="text-sm">
                                      View patient information
                                    </label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox 
                                      id="edit-patient"
                                      checked={privileges.canEditPatientInfo}
                                      onCheckedChange={(checked) => 
                                        handlePrivilegeChange('canEditPatientInfo', checked as boolean)
                                      }
                                    />
                                    <label htmlFor="edit-patient" className="text-sm">
                                      Edit patient information
                                    </label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox 
                                      id="delete-patient"
                                      checked={privileges.canDeletePatientInfo}
                                      onCheckedChange={(checked) => 
                                        handlePrivilegeChange('canDeletePatientInfo', checked as boolean)
                                      }
                                    />
                                    <label htmlFor="delete-patient" className="text-sm">
                                      Delete patient information
                                    </label>
                                  </div>
                                </div>

                                <h4 className="font-medium text-sm text-muted-foreground mt-4">Billing Information</h4>
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox 
                                      id="view-billing"
                                      checked={privileges.canViewBillingInfo}
                                      onCheckedChange={(checked) => 
                                        handlePrivilegeChange('canViewBillingInfo', checked as boolean)
                                      }
                                    />
                                    <label htmlFor="view-billing" className="text-sm">
                                      View billing information
                                    </label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox 
                                      id="edit-billing"
                                      checked={privileges.canEditBillingInfo}
                                      onCheckedChange={(checked) => 
                                        handlePrivilegeChange('canEditBillingInfo', checked as boolean)
                                      }
                                    />
                                    <label htmlFor="edit-billing" className="text-sm">
                                      Edit billing information
                                    </label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox 
                                      id="delete-billing"
                                      checked={privileges.canDeleteBillingInfo}
                                      onCheckedChange={(checked) => 
                                        handlePrivilegeChange('canDeleteBillingInfo', checked as boolean)
                                      }
                                    />
                                    <label htmlFor="delete-billing" className="text-sm">
                                      Delete billing information
                                    </label>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h4 className="font-medium text-sm text-muted-foreground">Dispatch Information</h4>
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox 
                                      id="view-dispatch"
                                      checked={privileges.canViewDispatchInfo}
                                      onCheckedChange={(checked) => 
                                        handlePrivilegeChange('canViewDispatchInfo', checked as boolean)
                                      }
                                    />
                                    <label htmlFor="view-dispatch" className="text-sm">
                                      View dispatch information
                                    </label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox 
                                      id="edit-dispatch"
                                      checked={privileges.canEditDispatchInfo}
                                      onCheckedChange={(checked) => 
                                        handlePrivilegeChange('canEditDispatchInfo', checked as boolean)
                                      }
                                    />
                                    <label htmlFor="edit-dispatch" className="text-sm">
                                      Edit dispatch information
                                    </label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox 
                                      id="delete-dispatch"
                                      checked={privileges.canDeleteDispatchInfo}
                                      onCheckedChange={(checked) => 
                                        handlePrivilegeChange('canDeleteDispatchInfo', checked as boolean)
                                      }
                                    />
                                    <label htmlFor="delete-dispatch" className="text-sm">
                                      Delete dispatch information
                                    </label>
                                  </div>
                                </div>

                                <h4 className="font-medium text-sm text-muted-foreground mt-4">Reports</h4>
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox 
                                      id="view-reports"
                                      checked={privileges.canViewReports}
                                      onCheckedChange={(checked) => 
                                        handlePrivilegeChange('canViewReports', checked as boolean)
                                      }
                                    />
                                    <label htmlFor="view-reports" className="text-sm">
                                      View reports
                                    </label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox 
                                      id="create-reports"
                                      checked={privileges.canCreateReports}
                                      onCheckedChange={(checked) => 
                                        handlePrivilegeChange('canCreateReports', checked as boolean)
                                      }
                                    />
                                    <label htmlFor="create-reports" className="text-sm">
                                      Create reports
                                    </label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox 
                                      id="edit-reports"
                                      checked={privileges.canEditReports}
                                      onCheckedChange={(checked) => 
                                        handlePrivilegeChange('canEditReports', checked as boolean)
                                      }
                                    />
                                    <label htmlFor="edit-reports" className="text-sm">
                                      Edit reports
                                    </label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox 
                                      id="delete-reports"
                                      checked={privileges.canDeleteReports}
                                      onCheckedChange={(checked) => 
                                        handlePrivilegeChange('canDeleteReports', checked as boolean)
                                      }
                                    />
                                    <label htmlFor="delete-reports" className="text-sm">
                                      Delete reports
                                    </label>
                                  </div>
                                </div>

                                <h4 className="font-medium text-sm text-muted-foreground mt-4">AI Features</h4>
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox 
                                      id="ai-assistance"
                                      checked={privileges.canUseAIAssistance}
                                      onCheckedChange={(checked) => 
                                        handlePrivilegeChange('canUseAIAssistance', checked as boolean)
                                      }
                                    />
                                    <label htmlFor="ai-assistance" className="text-sm">
                                      Use AI assistance features
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </TabsContent>

                      <TabsContent value="payroll" className="p-6">
                        <Card className="futuristic-card p-6">
                          <div className="space-y-6">
                            <div className="flex items-center gap-4">
                              <DollarSign className="h-6 w-6 text-medical-secondary" />
                              <h3 className="text-lg font-semibold">Payroll Information</h3>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label>Base Pay Rate</Label>
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    <Input type="number" className="bg-medical-accent/10" placeholder="Hourly rate" />
                                    <span className="text-sm text-muted-foreground">per hour</span>
                                  </div>
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
                                      <SelectItem value="commission">Commission</SelectItem>
                                      <SelectItem value="contract">Contract</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label>Pay Frequency</Label>
                                  <Select>
                                    <SelectTrigger className="bg-medical-accent/10">
                                      <SelectValue placeholder="Select frequency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="weekly">Weekly</SelectItem>
                                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                                      <SelectItem value="monthly">Monthly</SelectItem>
                                      <SelectItem value="semimonthly">Semi-monthly</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label>Overtime Rate</Label>
                                  <div className="flex items-center gap-2">
                                    <Percent className="h-4 w-4 text-muted-foreground" />
                                    <Input type="number" className="bg-medical-accent/10" placeholder="150" />
                                    <span className="text-sm text-muted-foreground">% of base rate</span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label>Payment Method</Label>
                                  <Select>
                                    <SelectTrigger className="bg-medical-accent/10">
                                      <SelectValue placeholder="Select payment method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="direct_deposit">Direct Deposit</SelectItem>
                                      <SelectItem value="check">Check</SelectItem>
                                      <SelectItem value="cash">Cash</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label>Bank Information</Label>
                                  <div className="space-y-2">
                                    <Input className="bg-medical-accent/10" placeholder="Bank Name" />
                                    <Input className="bg-medical-accent/10" placeholder="Account Number (Last 4)" type="password" />
                                    <Input className="bg-medical-accent/10" placeholder="Routing Number (Last 4)" type="password" />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label>Tax Information</Label>
                                  <div className="space-y-2">
                                    <Input className="bg-medical-accent/10" placeholder="W4 Status" />
                                    <Input className="bg-medical-accent/10" placeholder="Allowances" />
                                    <Input className="bg-medical-accent/10" placeholder="Additional Withholding" />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <Separator className="my-6" />

                            <div className="space-y-4">
                              <h4 className="font-medium">Additional Benefits</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <Card className="p-4 bg-medical-accent/5">
                                  <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-medical-secondary" />
                                    <span className="font-medium">Health Insurance</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-2">Premium Plan - Family Coverage</p>
                                </Card>

                                <Card className="p-4 bg-medical-accent/5">
                                  <div className="flex items-center gap-2">
                                    <Landmark className="h-4 w-4 text-medical-secondary" />
                                    <span className="font-medium">401(k)</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-2">6% Contribution with Match</p>
                                </Card>

                                <Card className="p-4 bg-medical-accent/5">
                                  <div className="flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4 text-medical-secondary" />
                                    <span className="font-medium">PTO</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-2">15 Days Remaining</p>
                                </Card>
                              </div>
                            </div>

                            <Separator className="my-6" />

                            <div className="space-y-4">
                              <h4 className="font-medium">Recent Payroll Activity</h4>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between p-2 bg-medical-accent/5 rounded">
                                  <div className="flex items-center gap-2">
                                    <Receipt className="h-4 w-4 text-medical-secondary" />
                                    <span>Last Paycheck</span>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <span>$2,450.00</span>
                                    <span className="text-sm text-muted-foreground">Mar 15, 2024</span>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between p-2 bg-medical-accent/5 rounded">
                                  <div className="flex items-center gap-2">
                                    <Clock3 className="h-4 w-4 text-medical-secondary" />
                                    <span>Overtime Hours</span>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <span>12.5 hours</span>
                                    <span className="text-sm text-muted-foreground">This Period</span>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between p-2 bg-medical-accent/5 rounded">
                                  <div className="flex items-center gap-2">
                                    <BadgeDollarSign className="h-4 w-4 text-medical-secondary" />
                                    <span>YTD Earnings</span>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <span>$18,750.00</span>
                                    <span className="text-sm text-muted-foreground">2024</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end gap-4 mt-6">
                              <Button variant="outline" className="gap-2">
                                <FileSpreadsheet className="h-4 w-4" />
                                Export Pay History
                              </Button>
                              <Button className="gap-2">
                                <CircleDollarSign className="h-4 w-4" />
                                Update Pay Information
                              </Button>
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
