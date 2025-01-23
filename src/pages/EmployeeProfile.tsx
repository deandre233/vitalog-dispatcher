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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  CheckCircle,
  Contact,
  Lock,
  Mail,
  Briefcase,
  Heart,
  UserPlus
} from "lucide-react";

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
        toast.error("Failed to fetch employee data");
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
      toast.success('Photo uploaded successfully');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
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
      toast.success("Payroll information updated successfully");
      setIsPayrollModalOpen(false);
    } catch (error) {
      console.error('Error updating payroll:', error);
      toast.error("Failed to update payroll information");
    }
  };

  const handleEdit = (section: string) => {
    setEditMode(section);
    setEditData({ ...employee });
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
      toast.success(`${section} updated successfully`);
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error(`Failed to update ${section}`);
    }
  };

  const handleCancel = () => {
    setEditMode(null);
    setEditData(employee);
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
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-medical-primary to-medical-secondary bg-clip-text text-transparent">
                      {employee?.first_name} {employee?.last_name}
                    </h1>
                    <p className="text-medical-secondary mt-2 font-medium flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      ID: {employee?.readable_id}
                    </p>
                  </div>
                </div>
                <Badge 
                  variant="secondary"
                  className={`${
                    employee?.status?.toLowerCase() === 'active' 
                      ? 'bg-green-100/80 text-green-800 border-green-200 backdrop-blur-sm' 
                      : 'bg-red-100/80 text-red-800 border-red-200 backdrop-blur-sm'
                  } px-4 py-2 text-sm font-semibold rounded-full animate-fade-in`}
                >
                  {employee?.status || 'Unknown'}
                </Badge>
              </div>
            </Card>

            {/* Basic Information Panel */}
            <Card className="p-6 backdrop-blur-md bg-white/80 border-medical-secondary/20 shadow-glow hover:shadow-xl transition-all duration-300 rounded-xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-medical-secondary" />
                  <h2 className="text-xl font-semibold">Basic Information</h2>
                </div>
                {editMode === 'basic' ? (
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleSave('basic')}
                      className="bg-medical-secondary/10 hover:bg-medical-secondary hover:text-white transition-colors duration-300"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={handleCancel}
                      className="hover:bg-red-500 hover:text-white transition-colors duration-300"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit('basic')}
                    className="hover:bg-medical-secondary hover:text-white transition-colors duration-300"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-medical-primary font-medium">First Name</Label>
                    {editMode === 'basic' ? (
                      <Input
                        value={editData.first_name || ''}
                        onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
                        className="bg-white/50 backdrop-blur-sm border-medical-secondary/20 focus:border-medical-secondary transition-colors duration-300"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-white/30 rounded-md backdrop-blur-sm border border-medical-secondary/10">
                        <User className="h-4 w-4 text-medical-secondary" />
                        <span>{employee?.first_name || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-medical-primary font-medium">Middle Name</Label>
                    {editMode === 'basic' ? (
                      <Input
                        value={editData.middle_name || ''}
                        onChange={(e) => setEditData({ ...editData, middle_name: e.target.value })}
                        className="bg-white/50 backdrop-blur-sm border-medical-secondary/20 focus:border-medical-secondary transition-colors duration-300"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-white/30 rounded-md backdrop-blur-sm border border-medical-secondary/10">
                        <User className="h-4 w-4 text-medical-secondary" />
                        <span>{employee?.middle_name || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-medical-primary font-medium">Last Name</Label>
                    {editMode === 'basic' ? (
                      <Input
                        value={editData.last_name || ''}
                        onChange={(e) => setEditData({ ...editData, last_name: e.target.value })}
                        className="bg-white/50 backdrop-blur-sm border-medical-secondary/20 focus:border-medical-secondary transition-colors duration-300"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-white/30 rounded-md backdrop-blur-sm border border-medical-secondary/10">
                        <User className="h-4 w-4 text-medical-secondary" />
                        <span>{employee?.last_name || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-medical-primary font-medium">Suffix</Label>
                    {editMode === 'basic' ? (
                      <Input
                        value={editData.suffix || ''}
                        onChange={(e) => setEditData({ ...editData, suffix: e.target.value })}
                        className="bg-white/50 backdrop-blur-sm border-medical-secondary/20 focus:border-medical-secondary transition-colors duration-300"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-white/30 rounded-md backdrop-blur-sm border border-medical-secondary/10">
                        <User className="h-4 w-4 text-medical-secondary" />
                        <span>{employee?.suffix || 'Not provided'}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-medical-primary font-medium">Mobile Number</Label>
                    {editMode === 'basic' ? (
                      <Input
                        value={editData.mobile || ''}
                        onChange={(e) => setEditData({ ...editData, mobile: e.target.value })}
                        className="bg-white/50 backdrop-blur-sm border-medical-secondary/20 focus:border-medical-secondary transition-colors duration-300"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-white/30 rounded-md backdrop-blur-sm border border-medical-secondary/10">
                        <Phone className="h-4 w-4 text-medical-secondary" />
                        <span>{employee?.mobile || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-medical-primary font-medium">Emergency Contact</Label>
                    {editMode === 'basic' ? (
                      <Input
                        value={editData.emergency_contact || ''}
                        onChange={(e) => setEditData({ ...editData, emergency_contact: e.target.value })}
                        placeholder="Name and phone number"
                        className="bg-white/50 backdrop-blur-sm border-medical-secondary/20 focus:border-medical-secondary transition-colors duration-300"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-white/30 rounded-md backdrop-blur-sm border border-medical-secondary/10">
                        <Contact className="h-4 w-4 text-medical-secondary" />
                        <span>{employee?.emergency_contact || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-medical-primary font-medium">Login Name</Label>
                    {editMode === 'basic' ? (
                      <Input
                        value={editData.login_name || ''}
                        onChange={(e) => setEditData({ ...editData, login_name: e.target.value })}
                        className="bg-white/50 backdrop-blur-sm border-medical-secondary/20 focus:border-medical-secondary transition-colors duration-300"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-white/30 rounded-md backdrop-blur-sm border border-medical-secondary/10">
                        <Mail className="h-4 w-4 text-medical-secondary" />
                        <span>{employee?.login_name || 'Not set'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-medical-primary font-medium">Password</Label>
                    {editMode === 'basic' ? (
                      <div className="space-y-2">
                        <Input
                          type="password"
                          value={editData.password || ''}
                          onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                          className="bg-white/50 backdrop-blur-sm border-medical-secondary/20 focus:border-medical-secondary transition-colors duration-300"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs"
                          onClick={() => {
                            const randomPassword = Math.random().toString(36).slice(-8);
                            setEditData({ ...editData, password: randomPassword });
                            toast.success("Password Generated", {
                              description: "A new random password has been generated. Make sure to save the changes.",
                            });
                          }}
                        >
                          Generate Random Password
                        </Button>
                        <p className="text-xs text-gray-500 italic">
                          If you change the password, the user must choose a new one at next login.
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-white/30 rounded-md backdrop-blur-sm border border-medical-secondary/10">
                        <Lock className="h-4 w-4 text-medical-secondary" />
                        <span>••••••••</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Contact & Address Panel */}
            <Card className="p-6 backdrop-blur-md bg-white/80 border-medical-secondary/20 shadow-glow hover:shadow-xl transition-all duration-300 rounded-xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-medical-secondary" />
                  <h2 className="text-xl font-semibold">Contact & Address</h2>
                </div>
                {editMode === 'contact' ? (
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleSave('contact')}
                      className="bg-medical-secondary/10 hover:bg-medical-secondary hover:text-white transition-colors duration-300"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={handleCancel}
                      className="hover:bg-red-500 hover:text-white transition-colors duration-300"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit('contact')}
                    className="hover:bg-medical-secondary hover:text-white transition-colors duration-300"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-medical-primary font-medium">Street Address</Label>
                    {editMode === 'contact' ? (
                      <div className="space-y-2">
                        <Input
                          placeholder="Address Line 1"
                          value={editData.address_line1 || ''}
                          onChange={(e) => setEditData({ ...editData, address_line1: e.target.value })}
                          className="bg-white/50 backdrop-blur-sm border-medical-secondary/20 focus:border-medical-secondary transition-colors duration-300"
                        />
                        <Input
                          placeholder="Address Line 2"
                          value={editData.address_line2 || ''}
                          onChange={(e) => setEditData({ ...editData, address_line2: e.target.value })}
                          className="bg-white/50 backdrop-blur-sm border-medical-secondary/20 focus:border-medical-secondary transition-colors duration-300"
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-3 bg-white/30 rounded-md backdrop-blur-sm border border-medical-secondary/10">
                          <MapPin className="h-4 w-4 text-medical-secondary" />
                          <span>{employee?.address_line1 || 'Not provided'}</span>
                        </div>
                        {employee?.address_line2 && (
                          <div className="flex items-center gap-2 p-3 bg-white/30 rounded-md backdrop-blur-sm border border-medical-secondary/10">
                            <MapPin className="h-4 w-4 text-medical-secondary" />
                            <span>{employee.address_line2}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-medical-primary font-medium">City</Label>
                      {editMode === 'contact' ? (
                        <Input
                          value={editData.city || ''}
                          onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                          className="bg-white/50 backdrop-blur-sm border-medical-secondary/20 focus:border-medical-secondary transition-colors duration-300"
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-3 bg-white/30 rounded-md backdrop-blur-sm border border-medical-secondary/10">
                          <Building className="h-4 w-4 text-medical-secondary" />
                          <span>{employee?.city || 'Not provided'}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-medical-primary font-medium">State</Label>
                      {editMode === 'contact' ? (
                        <Select 
                          value={editData.state || ''} 
                          onValueChange={(value) => setEditData({ ...editData, state: value })}
                        >
                          <SelectTrigger className="bg-white/50 backdrop-blur-sm border-medical-secondary/20">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GA">Georgia</SelectItem>
                            {/* Add other states as needed */}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex items-center gap-2 p-3 bg-white/30 rounded-md backdrop-blur-sm border border-medical-secondary/10">
                          <MapPin className="h-4 w-4 text-medical-secondary" />
                          <span>{employee?.state || 'Not provided'}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-medical-primary font-medium">ZIP</Label>
                      {editMode === 'contact' ? (
                        <Input
                          value={editData.zip || ''}
                          onChange={(e) => setEditData({ ...editData, zip: e.target.value })}
                          className="bg-white/50 backdrop-blur-sm border-medical-secondary/20 focus:border-medical-secondary transition-colors duration-300"
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-3 bg-white/30 rounded-md backdrop-blur-sm border border-medical-secondary/10">
                          <MapPin className="h-4 w-4 text-medical-secondary" />
                          <span>{employee?.zip || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Employment Details Panel */}
            <Card className="p-6 backdrop-blur-md bg-white/80 border-medical-secondary/20 shadow-glow hover:shadow-xl transition-all duration-300 rounded-xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-medical-secondary" />
                  <h2 className="text-xl font-semibold">Employment Details</h2>
                </div>
                {editMode === 'employment' ? (
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleSave('employment')}
                      className="bg-medical-secondary/10 hover:bg-medical-secondary hover:text-white transition-colors duration-300"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={handleCancel}
                      className="hover:bg-red-500 hover:text-white transition-colors duration-300"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit('employment')}
                    className="hover:bg-medical-secondary hover:text-white transition-colors duration-300"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-medical-primary font-medium">Employee Type</Label>
                    {editMode === 'employment' ? (
                      <Select 
                        value={editData.employee_type || ''} 
                        onValueChange={(value) => setEditData({ ...editData, employee_type: value })}
                      >
                        <SelectTrigger className="bg-white/50 backdrop-blur-sm border-medical-secondary/20">
                          <SelectValue placeholder="Select employee type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full Time</SelectItem>
                          <SelectItem value="part-time">Part Time</SelectItem>
                          <SelectItem value="contractor">Contractor</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-white/30 rounded-md backdrop-blur-sm border border-medical-secondary/10">
                        <Briefcase className="h-4 w-4 text-medical-secondary" />
                        <span>{employee?.employee_type || 'Not set'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-medical-primary font-medium">Assigned Station</Label>
                    {editMode === 'employment' ? (
                      <Select 
                        value={editData.station || ''} 
                        onValueChange={(value) => setEditData({ ...editData, station: value })}
                      >
                        <SelectTrigger className="bg-white/50 backdrop-blur-sm border-medical-secondary/20">
                          <SelectValue placeholder="Select station" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="float">Float</SelectItem>
                          <SelectItem value="station1">Station 1</SelectItem>
                          <SelectItem value="station2">Station 2</SelectItem>
                          <SelectItem value="station3">Station 3</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-white/30 rounded-md backdrop-blur-sm border border-medical-secondary/10">
                        <Building className="h-4 w-4 text-medical-secondary" />
                        <span>{employee?.station || 'Not assigned'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-medical-primary font-medium">NEMSIS UUID</Label>
                    {editMode === 'employment' ? (
                      <Input
                        value={editData.nemsis_uuid || ''}
                        onChange={(e) => setEditData({ ...editData, nemsis_uuid: e.target.value })}
                        className="bg-white/50 backdrop-blur-sm border-medical-secondary/20 focus:border-medical-secondary transition-colors duration-300"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-white/30 rounded-md backdrop-blur-sm border border-medical-secondary/10">
                        <FileText className="h-4 w-4 text-medical-secondary" />
                        <span>{employee?.nemsis_uuid || 'Not assigned'}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-medical-primary font-medium">Date of Birth</Label>
                    {editMode === 'employment' ? (
                      <Input
                        type="date"
                        value={editData.dob || ''}
                        onChange={(e) => setEditData({ ...editData, dob: e.target.value })}
                        className="bg-white/50 backdrop-blur-sm border-medical-secondary/20 focus:border-medical-secondary transition-colors duration-300"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-white/30 rounded-md backdrop-blur-sm border border-medical-secondary/10">
                        <Calendar className="h-4 w-4 text-medical-secondary" />
                        <span>{employee?.dob ? new Date(employee.dob).toLocaleDateString() : 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-medical-primary font-medium">Gender</Label>
                    {editMode === 'employment' ? (
                      <Select 
                        value={editData.gender || ''} 
                        onValueChange={(value) => setEditData({ ...editData, gender: value })}
                      >
                        <SelectTrigger className="bg-white/50 backdrop-blur-sm border-medical-secondary/20">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-white/30 rounded-md backdrop-blur-sm border border-medical-secondary/10">
                        <User className="h-4 w-4 text-medical-secondary" />
                        <span>{employee?.gender || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-medical-primary font-medium">Race</Label>
                    {editMode === 'employment' ? (
                      <Select 
                        value={editData.race || ''} 
                        onValueChange={(value) => setEditData({ ...editData, race: value })}
                      >
                        <SelectTrigger className="bg-white/50 backdrop-blur-sm border-medical-secondary/20">
                          <SelectValue placeholder="Select race" />
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
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-white/30 rounded-md backdrop-blur-sm border border-medical-secondary/10">
                        <User className="h-4 w-4 text-medical-secondary" />
                        <span>{employee?.race || 'Not recorded'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Medical Information Panel */}
            <Card className="p-6 backdrop-blur-md bg-white/80 border-medical-secondary/20 shadow-glow hover:shadow-xl transition-all duration-300 rounded-xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-medical-secondary" />
                  <h2 className="text-xl font-semibold">Medical Information</h2>
                </div>
                {editMode === 'medical' ? (
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleSave('medical')}
                      className="bg-medical-secondary/10 hover:bg-medical-secondary hover:text-white transition-colors duration-300"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={handleCancel}
                      className="hover:bg-red-500 hover:text-white transition-colors duration-300"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit('medical')}
                    className="hover:bg-medical-secondary hover:text-white transition-colors duration-300"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>

              {/* Add medical information fields here */}
            </Card>

            {/* Payroll Information Panel */}
            <Card className="p-6 backdrop-blur-md bg-white/80 border-medical-secondary/20 shadow-glow hover:shadow-xl transition-all duration-300 rounded-xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-medical-secondary" />
                  <h2 className="text-xl font-semibold">Payroll Information</h2>
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

            {/* Additional Information Panels */}
            <Card className="p-6 backdrop-blur-md bg-white/80 border-medical-secondary/20 shadow-glow hover:shadow-xl transition-all duration-300 rounded-xl">
              <Tabs defaultValue="roles" className="w-full">
                <TabsList className="grid grid-cols-4 lg:grid-cols-7 gap-2">
                  <TabsTrigger value="roles" className="flex items-center gap-2">
                    <UserCog className="h-4 w-4" />
                    <span className="hidden md:inline">Roles</span>
                  </TabsTrigger>
                  <TabsTrigger value="privileges" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span className="hidden md:inline">Privileges</span>
                  </TabsTrigger>
                  <TabsTrigger value="certifications" className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4" />
                    <span className="hidden md:inline">Certifications</span>
                  </TabsTrigger>
                  <TabsTrigger value="incidents" className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="hidden md:inline">Incidents</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="roles" className="mt-6">
                  <div className="space-y-4">
                    {employee.employee_roles?.map((role: any) => (
                      <div key={role.id} className="p-4 bg-white/50 rounded-lg border border-medical-secondary/20">
                        <h3 className="font-medium">{role.name}</h3>
                      </div>
                    )) || <p>No roles assigned</p>}
                  </div>
                </TabsContent>

                <TabsContent value="privileges" className="mt-6">
                  <div className="space-y-4">
                    {employee.employee_privileges?.map((privilege: any) => (
                      <div key={privilege.id} className="p-4 bg-white/50 rounded-lg border border-medical-secondary/20">
                        <h3 className="font-medium">{privilege.name}</h3>
                      </div>
                    )) || <p>No privileges assigned</p>}
                  </div>
                </TabsContent>

                <TabsContent value="certifications" className="mt-6">
                  <p>No certifications available</p>
                </TabsContent>

                <TabsContent value="incidents" className="mt-6">
                  <p>No incidents reported</p>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>

      {/* Payroll Modal */}
      <Dialog open={isPayrollModalOpen} onOpenChange={setIsPayrollModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Payroll Information</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="effective_date">Effective Date</Label>
              <Input
                id="effective_date"
                type="date"
                value={payrollData.effective_date}
                onChange={(e) => setPayrollData({ ...payrollData, effective_date: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="employee_type">Employee Type</Label>
              <Input
                id="employee_type"
                value={payrollData.employee_type}
                onChange={(e) => setPayrollData({ ...payrollData, employee_type: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pay_type">Pay Type</Label>
              <Input
                id="pay_type"
                value={payrollData.pay_type}
                onChange={(e) => setPayrollData({ ...payrollData, pay_type: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pay_rate">Pay Rate</Label>
              <Input
                id="pay_rate"
                type="number"
                value={payrollData.pay_rate}
                onChange={(e) => setPayrollData({ ...payrollData, pay_rate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPayrollModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handlePayrollUpdate(payrollData)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeProfile;
