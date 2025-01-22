import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/layout/Header";
import { EmployeeDirectorySidebar } from "@/components/navigation/EmployeeDirectorySidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  User, 
  Phone, 
  MapPin, 
  Shield, 
  Calendar,
  DollarSign,
  Clock,
  BadgeCheck,
  Award,
  FileText,
  AlertTriangle,
  Bell,
  Syringe,
  TrendingUp,
  ClipboardList,
  UserCog,
  UserCheck,
  Building,
  Star
} from "lucide-react";

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<any>(null);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [payrollData, setPayrollData] = useState({
    effective_date: "",
    employee_type: "",
    pay_type: "",
    pay_rate: "",
    access_codes: "",
    author: ""
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      const { data, error } = await supabase
        .from('employees')
        .select(`
          *,
          employee_roles (*),
          employee_privileges (*),
          employee_payroll_history (*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching employee:', error);
        toast.error("Failed to fetch employee data");
      } else {
        setEmployee(data);
      }
    };

    fetchEmployee();
  }, [id]);

  const handlePayrollUpdate = async (values: any) => {
    try {
      const { error } = await supabase
        .from('employee_payroll_history')
        .insert({
          employee_id: id,
          effective_date: values.effective_date,
          employee_type: values.employee_type,
          pay_type: values.pay_type,
          pay_rate: parseFloat(values.pay_rate),
          access_codes: values.access_codes,
          author: values.author,
          is_active: true
        });

      if (error) throw error;
      toast.success("Payroll information updated successfully");
      setIsPayrollModalOpen(false);
    } catch (error) {
      console.error('Error updating payroll:', error);
      toast.error("Failed to update payroll information");
    }
  };

  if (!employee) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <EmployeeDirectorySidebar />
          <div className="flex-1 p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-medical-primary/5">
      <Header />
      <div className="flex-1 flex">
        <EmployeeDirectorySidebar />
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <Card className="p-6 bg-gradient-to-br from-medical-card-start to-medical-card-end">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-medical-primary">
                    {employee.first_name} {employee.last_name}
                  </h1>
                  <p className="text-medical-secondary mt-1">
                    ID: {employee.readable_id}
                  </p>
                </div>
                <Badge 
                  variant="secondary"
                  className={`${
                    employee.status?.toLowerCase() === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {employee.status || 'Unknown'}
                </Badge>
              </div>

              <Tabs defaultValue="demographics" className="mt-6">
                <TabsList className="grid grid-cols-4 lg:grid-cols-7 gap-2">
                  <TabsTrigger value="demographics">Demographics</TabsTrigger>
                  <TabsTrigger value="payroll">Payroll</TabsTrigger>
                  <TabsTrigger value="roles">Roles</TabsTrigger>
                  <TabsTrigger value="privileges">Privileges</TabsTrigger>
                  <TabsTrigger value="incidents">Incidents</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="stats">Stats</TabsTrigger>
                  <TabsTrigger value="certs">Certifications</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  <TabsTrigger value="damage">Damage Reports</TabsTrigger>
                  <TabsTrigger value="announcements">Announcements</TabsTrigger>
                  <TabsTrigger value="immunizations">Immunizations</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>

                <TabsContent value="demographics" className="space-y-4 mt-6">
                  <Card className="p-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-medical-secondary" />
                      <span className="font-medium">Personal Information</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Phone</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{employee.mobile || 'Not provided'}</span>
                        </div>
                      </div>
                      <div>
                        <Label>Station</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{employee.station || 'Not assigned'}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="payroll" className="space-y-4 mt-6">
                  <Card className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-medical-secondary" />
                        <span className="font-medium">Payroll Information</span>
                      </div>
                      <Button onClick={() => setIsPayrollModalOpen(true)}>
                        Update Payroll
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Pay Type</Label>
                        <p>{employee.pay_type || 'Not set'}</p>
                      </div>
                      <div>
                        <Label>Pay Rate</Label>
                        <p>${employee.pay_rate || '0.00'}/hr</p>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="roles" className="space-y-4 mt-6">
                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <UserCog className="h-4 w-4 text-medical-secondary" />
                      <span className="font-medium">Roles</span>
                    </div>
                    <ul className="mt-2">
                      {employee.employee_roles?.map((role: any) => (
                        <li key={role.id} className="text-gray-600">{role.name}</li>
                      )) || <li className="text-gray-600">No roles assigned</li>}
                    </ul>
                  </Card>
                </TabsContent>

                <TabsContent value="privileges" className="space-y-4 mt-6">
                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-medical-secondary" />
                      <span className="font-medium">Privileges</span>
                    </div>
                    <ul className="mt-2">
                      {employee.employee_privileges?.map((privilege: any) => (
                        <li key={privilege.id} className="text-gray-600">{privilege.name}</li>
                      )) || <li className="text-gray-600">No privileges assigned</li>}
                    </ul>
                  </Card>
                </TabsContent>

                <TabsContent value="incidents" className="space-y-4 mt-6">
                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-medical-secondary" />
                      <span className="font-medium">Incidents</span>
                    </div>
                    <p className="mt-2">No incidents reported for this employee.</p>
                  </Card>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4 mt-6">
                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-medical-secondary" />
                      <span className="font-medium">Documents</span>
                    </div>
                    <p className="mt-2">No documents available for this employee.</p>
                  </Card>
                </TabsContent>

                <TabsContent value="stats" className="space-y-4 mt-6">
                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-medical-secondary" />
                      <span className="font-medium">Stats</span>
                    </div>
                    <p className="mt-2">No stats available for this employee.</p>
                  </Card>
                </TabsContent>

                <TabsContent value="certs" className="space-y-4 mt-6">
                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="h-4 w-4 text-medical-secondary" />
                      <span className="font-medium">Certifications</span>
                    </div>
                    <p className="mt-2">No certifications available for this employee.</p>
                  </Card>
                </TabsContent>

                <TabsContent value="achievements" className="space-y-4 mt-6">
                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-medical-secondary" />
                      <span className="font-medium">Achievements</span>
                    </div>
                    <p className="mt-2">No achievements available for this employee.</p>
                  </Card>
                </TabsContent>

                <TabsContent value="damage" className="space-y-4 mt-6">
                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-medical-secondary" />
                      <span className="font-medium">Damage Reports</span>
                    </div>
                    <p className="mt-2">No damage reports available for this employee.</p>
                  </Card>
                </TabsContent>

                <TabsContent value="announcements" className="space-y-4 mt-6">
                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-medical-secondary" />
                      <span className="font-medium">Announcements</span>
                    </div>
                    <p className="mt-2">No announcements available for this employee.</p>
                  </Card>
                </TabsContent>

                <TabsContent value="immunizations" className="space-y-4 mt-6">
                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <Syringe className="h-4 w-4 text-medical-secondary" />
                      <span className="font-medium">Immunizations</span>
                    </div>
                    <p className="mt-2">No immunizations available for this employee.</p>
                  </Card>
                </TabsContent>

                <TabsContent value="performance" className="space-y-4 mt-6">
                  <Card className="p-4">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-medical-secondary" />
                      <span className="font-medium">Performance</span>
                    </div>
                    <p className="mt-2">No performance data available for this employee.</p>
                  </Card>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isPayrollModalOpen} onOpenChange={setIsPayrollModalOpen}>
        <DialogContent className="glass-panel">
          <DialogHeader>
            <DialogTitle>Update Payroll Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="effective_date">Effective Date</Label>
              <Input
                id="effective_date"
                type="date"
                value={payrollData.effective_date}
                onChange={(e) => setPayrollData({ ...payrollData, effective_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="employee_type">Employee Type</Label>
              <Input
                id="employee_type"
                value={payrollData.employee_type}
                onChange={(e) => setPayrollData({ ...payrollData, employee_type: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="pay_type">Pay Type</Label>
              <Input
                id="pay_type"
                value={payrollData.pay_type}
                onChange={(e) => setPayrollData({ ...payrollData, pay_type: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="pay_rate">Pay Rate</Label>
              <Input
                id="pay_rate"
                type="number"
                value={payrollData.pay_rate}
                onChange={(e) => setPayrollData({ ...payrollData, pay_rate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="access_codes">Access Codes</Label>
              <Input
                id="access_codes"
                value={payrollData.access_codes}
                onChange={(e) => setPayrollData({ ...payrollData, access_codes: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={payrollData.author}
                onChange={(e) => setPayrollData({ ...payrollData, author: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPayrollModalOpen(false)}>Cancel</Button>
            <Button 
              className="bg-medical-secondary hover:bg-medical-secondary/90 text-white"
              onClick={() => handlePayrollUpdate(payrollData)}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeProfile;
