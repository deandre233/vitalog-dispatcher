<lov-code>
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
  Star,
  Edit,
  Save,
  X,
  Camera,
  Upload,
  Key,
  CheckCircle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<any>(null);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [payrollData, setPayrollData] = useState({
    effective_date: "",
    employee_type: "",
    pay_type: "",
    pay_rate: "",
    access_codes: "",
    author: ""
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

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
        toast("Failed to fetch employee data");
      } else {
        setEmployee(data);
        setEditData(data);
      }
    };

    fetchEmployee();
  }, [id]);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !id) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('employeeId', id);

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-employee-photo`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload photo');
      }

      setEmployee({ ...employee, photo_url: data.url });
      toast("Photo uploaded successfully");
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast("Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
  };

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
      toast("Payroll information updated successfully");
      setIsPayrollModalOpen(false);
    } catch (error) {
      console.error('Error updating payroll:', error);
      toast("Failed to update payroll information");
    }
  };

  const handleEdit = (section: string) => {
    setEditMode(section);
    setEditData({ ...employee });
  };

  const handleCancel = () => {
    setEditMode(null);
    setEditData(employee);
  };

  const handleSave = async (section: string) => {
    try {
      const { error } = await supabase
        .from('employees')
        .update(editData)
        .eq('id', id);

      if (error) throw error;
      setEmployee(editData);
      setEditMode(null);
      toast(`${section} updated successfully`);
    } catch (error) {
      console.error('Error updating employee:', error);
      toast(`Failed to update ${section}`);
    }
  };

  if (!employee) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <EmployeeDirectorySidebar />
          <div className="flex-1 p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-medical-secondary/20 rounded w-1/4"></div>
              <div className="h-4 bg-medical-secondary/20 rounded w-1/2"></div>
              <div className="h-4 bg-medical-secondary/20 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-medical-primary/5 via-medical-secondary/10 to-medical-accent">
      <Header />
      <div className="flex-1 flex">
        <EmployeeDirectorySidebar />
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Profile Header Card */}
            <Card className="p-8 backdrop-blur-md bg-white/80 border-medical-secondary/20 shadow-glow hover:shadow-xl transition-all duration-300 rounded-xl">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-8">
                  <div className="relative group">
                    <Avatar className="h-32 w-32 ring-4 ring-medical-secondary/30 transition-all duration-300 group-hover:ring-medical-secondary">
                      <AvatarImage 
                        src={employee?.photo_url} 
                        alt={`${employee?.first_name} ${employee?.last_name}`}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-3xl bg-gradient-to-br from-medical-gradient-start to-medical-gradient-end text-white">
                        {employee?.first_name?.[0]}{employee?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute bottom-0 right-0 rounded-full bg-white/90 backdrop-blur-sm hover:bg-medical-secondary hover:text-white transition-all duration-300"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <Upload className="h-4 w-4 animate-pulse" />
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                    />
                  </div>
                  <div>
                    <h1 className="text