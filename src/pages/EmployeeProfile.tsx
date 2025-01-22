import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button, Modal } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const EmployeeProfile = () => {
  const { id } = useParams();
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

  return (
    <div>
      <h1 className="text-2xl font-bold">{employee?.name}</h1>
      <p>{employee?.email}</p>
      <Button onClick={() => setIsPayrollModalOpen(true)}>Update Payroll</Button>

      <Modal open={isPayrollModalOpen} onOpenChange={setIsPayrollModalOpen}>
        <Modal.Content>
          <Modal.Header>Update Payroll Information</Modal.Header>
          <Modal.Body>
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
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => handlePayrollUpdate(payrollData)}>Save</Button>
            <Button variant="outline" onClick={() => setIsPayrollModalOpen(false)}>Cancel</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </div>
  );
};

export default EmployeeProfile;
