import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/layout/Header";
import { EmployeeDirectorySidebar } from "@/components/navigation/EmployeeDirectorySidebar";
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
  BadgeCheck
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
        .select('*')
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <EmployeeDirectorySidebar />
        <div className="flex-1 bg-[#f4f7fc] p-6">
          <Card className="p-6 mb-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-4">
                <div className="flex items-center text-medical-secondary">
                  <Phone className="h-4 w-4 mr-2" />
                  {employee.mobile || 'No phone number'}
                </div>
                <div className="flex items-center text-medical-secondary">
                  <MapPin className="h-4 w-4 mr-2" />
                  {employee.station || 'No station assigned'}
                </div>
                <div className="flex items-center text-medical-secondary">
                  <Shield className="h-4 w-4 mr-2" />
                  {employee.certification_level || 'No certification'}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-medical-secondary">
                  <Calendar className="h-4 w-4 mr-2" />
                  Hired: {employee.first_hired_date || 'Not specified'}
                </div>
                <div className="flex items-center text-medical-secondary">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Pay Type: {employee.pay_type || 'Not specified'}
                </div>
                <div className="flex items-center text-medical-secondary">
                  <Clock className="h-4 w-4 mr-2" />
                  Uses Timeclock: {employee.uses_timeclock ? 'Yes' : 'No'}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button onClick={() => setIsPayrollModalOpen(true)}>
                Update Payroll
              </Button>
              <Button variant="outline" onClick={() => navigate('/employees')}>
                Back to Directory
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={isPayrollModalOpen} onOpenChange={setIsPayrollModalOpen}>
        <DialogContent>
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
              <Textarea
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
            <Button onClick={() => handlePayrollUpdate(payrollData)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeProfile;