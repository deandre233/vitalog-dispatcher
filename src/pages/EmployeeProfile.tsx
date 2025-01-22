import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

export default function EmployeeProfile() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [employee, setEmployee] = useState<any>(null);
  const [payrollHistory, setPayrollHistory] = useState<any[]>([]);
  const [payRate, setPayRate] = useState("");
  const [payType, setPayType] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");

  useEffect(() => {
    fetchEmployeeData();
    fetchPayrollHistory();
  }, [id]);

  const fetchEmployeeData = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setEmployee(data);
    } catch (error) {
      console.error('Error fetching employee:', error);
      toast.error('Failed to fetch employee data');
    }
  };

  const fetchPayrollHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('employee_payroll_history')
        .select('*')
        .eq('employee_id', id)
        .order('effective_date', { ascending: false });

      if (error) throw error;
      setPayrollHistory(data || []);
    } catch (error) {
      console.error('Error fetching payroll history:', error);
      toast.error('Failed to fetch payroll history');
    }
  };

  const handlePayrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('employee_payroll_history')
        .insert({
          employee_id: id,
          pay_rate: parseFloat(payRate),
          pay_type: payType,
          effective_date: effectiveDate,
          author: currentUser?.email
        });

      if (error) throw error;
      toast.success('Payroll history updated successfully');
      fetchPayrollHistory();
      setPayRate("");
      setPayType("");
      setEffectiveDate("");
    } catch (error) {
      console.error('Error updating payroll:', error);
      toast.error('Failed to update payroll history');
    }
  };

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">
          Employee Profile: {employee.first_name} {employee.last_name}
        </h1>

        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="payroll">Payroll History</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name</Label>
                <Input value={employee.first_name} disabled />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input value={employee.last_name} disabled />
              </div>
              <div>
                <Label>Employee Type</Label>
                <Input value={employee.employee_type || 'N/A'} disabled />
              </div>
              <div>
                <Label>Status</Label>
                <Input value={employee.status || 'N/A'} disabled />
              </div>
              <div>
                <Label>Mobile</Label>
                <Input value={employee.mobile || 'N/A'} disabled />
              </div>
              <div>
                <Label>Station</Label>
                <Input value={employee.station || 'N/A'} disabled />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payroll">
            <form onSubmit={handlePayrollSubmit} className="space-y-4 mb-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Pay Rate</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={payRate}
                    onChange={(e) => setPayRate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Pay Type</Label>
                  <Select value={payType} onValueChange={setPayType} required>
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
                <div>
                  <Label>Effective Date</Label>
                  <Input
                    type="date"
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button type="submit">Add Payroll Record</Button>
            </form>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Payroll History</h3>
              <div className="space-y-2">
                {payrollHistory.map((record) => (
                  <Card key={record.id} className="p-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Pay Rate</Label>
                        <p>${record.pay_rate}</p>
                      </div>
                      <div>
                        <Label>Pay Type</Label>
                        <p className="capitalize">{record.pay_type}</p>
                      </div>
                      <div>
                        <Label>Effective Date</Label>
                        <p>{format(new Date(record.effective_date), 'PP')}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}