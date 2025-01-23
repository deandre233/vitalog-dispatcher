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

              {/* Quick Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <Card className="p-4 bg-white/50 backdrop-blur-sm border-medical-secondary/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-medical-secondary/10">
                      <Building className="h-5 w-5 text-medical-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Station</p>
                      <p className="font-medium">{employee?.station || 'Not Assigned'}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-white/50 backdrop-blur-sm border-medical-secondary/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-medical-secondary/10">
                      <UserCheck className="h-5 w-5 text-medical-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Employee Type</p>
                      <p className="font-medium">{employee?.employee_type || 'Not Set'}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-white/50 backdrop-blur-sm border-medical-secondary/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-medical-secondary/10">
                      <BadgeCheck className="h-5 w-5 text-medical-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Certification Level</p>
                      <p className="font-medium">{employee?.certification_level || 'Not Set'}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </Card>

            {/* Main Content Tabs */}
            <Tabs defaultValue="demographics" className="space-y-6">
              <TabsList className="grid grid-cols-4 lg:grid-cols-7 gap-2 p-1 bg-medical-accent/50 backdrop-blur-sm rounded-lg border border-medical-secondary/20 sticky top-0 z-10">
                {[
                  { value: "demographics", label: "Demographics", icon: User },
                  { value: "payroll", label: "Payroll", icon: DollarSign },
                  { value: "roles", label: "Roles", icon: UserCog },
                  { value: "privileges", label: "Privileges", icon: Shield },
                  { value: "incidents", label: "Incidents", icon: AlertTriangle },
                  { value: "documents", label: "Documents", icon: FileText },
                  { value: "stats", label: "Stats", icon: TrendingUp },
                  { value: "certs", label: "Certifications", icon: BadgeCheck },
                  { value: "achievements", label: "Achievements", icon: Award },
                  { value: "damage", label: "Damage Reports", icon: ClipboardList },
                  { value: "notifications", label: "Notifications", icon: Bell },
                  { value: "beacon", label: "Beacon", icon: Key },
                  { value: "immunizations", label: "Immunizations", icon: Syringe },
                  { value: "performance", label: "Performance", icon: Star }
                ].map(({ value, label, icon: Icon }) => (
                  <TabsTrigger 
                    key={value} 
                    value={value}
                    className="flex items-center gap-2 transition-all duration-300 data-[state=active]:bg-white/90 data-[state=active]:text-medical-secondary data-[state=active]:shadow-glow"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden md:inline">{label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Tab Contents */}
              <div className="space-y-6">
                <TabsContent value="demographics" className="space-y-6 animate-fade-in">
                  <Card className="p-6 backdrop-blur-sm bg-white/90 border-medical-secondary/20 transition-all duration-300 hover:shadow-glow">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-medical-secondary" />
                        <span className="font-medium text-lg">Identity & Contact Information</span>
                      </div>
                      {editMode === 'demographics' ? (
                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => handleSave('demographics')}
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
                          onClick={() => handleEdit('demographics')}
                          className="hover:bg-medical-secondary hover:text-white transition-colors duration-300"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label className="text-medical-primary font-medium">NEMSIS UUID</Label>
                          {editMode === 'demographics' ? (
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

                        <div className="space-y-2">
                          <Label className="text-medical-primary font-medium">Street Address</Label>
                          {editMode === 'demographics' ? (
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

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-medical-primary font-medium">City</Label>
                            {editMode === 'demographics' ? (
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

                          <div className="space-y-2">
                            <Label className="text-medical-primary font-medium">ZIP</Label>
                            {editMode === 'demographics' ? (
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

                        <div className="space-y-2">
                          <Label className="text-medical-primary font-medium">State</Label>
                          {editMode === 'demographics' ? (
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

                        <div className="space-y-2">
                          <Label className="text-medical-primary font-medium">Date of Birth</Label>
                          {editMode === 'demographics' ? (
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

                        <div className="space-y-2">
                          <Label className="text-medical-primary font-medium">Gender</Label>
                          {editMode === 'demographics' ? (
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

                        <div className="space-y-2">
                          <Label className="text-medical-primary font-medium">Race</Label>
                          {editMode === 'demographics' ? (
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

                        <div className="space-y-2">
                          <Label className="text-medical-primary font-medium">Phone</Label>
                          {editMode === 'demographics' ? (
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

                        <div className="space-y-2">
                          <Label className="text-medical-primary font-medium">Emergency Contact</Label>
                          {editMode === 'demographics' ? (
                            <Input
                              value={editData.emergency_contact || ''}
                              onChange={(e) => setEditData({ ...editData, emergency_contact: e.target.value })}
                              placeholder="Name and phone number"
                              className="bg-white/50 backdrop-blur-sm border-medical-secondary/20 focus:border-medical-secondary transition-colors duration-300"
                            />
                          ) : (
                            <div className="flex items-center gap-2 p-3 bg-white/30 rounded-md backdrop-blur-sm border border-medical-secondary/10">
                              <Phone className="h-4 w-4 text-medical-secondary" />
                              <span>{employee?.emergency_contact || 'Not provided'}</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-medical-primary font-medium">NEMSIS UUID</Label>
                          {editMode === 'demographics' ? (
                            <Input
                              value={editData.nemsis_uuid || ''}
                              onChange={(e) => setEditData({ ...editData, nemsis_uuid: e.target.value })}
                              className="bg-white/50 backdrop-blur-sm border-medical-secondary/20 focus:border-medical-secondary transition-colors duration-300 font-mono"
                            />
                          ) : (
                            <div className="flex items-center gap-2 p-3 bg-white/30 rounded-md backdrop-blur-sm border border-medical-secondary/10">
                              <FileText className="h-4 w-4 text-medical-secondary" />
                              <span className="font-mono text-sm">{employee?.nemsis_uuid || 'Not assigned'}</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-medical-primary font-medium">Assigned Station</Label>
                          {editMode === 'demographics' ? (
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

                        <div className="space-y-2">
                          <Label className="text-medical-primary font-medium">Login Name</Label>
                          {editMode === 'demographics' ? (
                            <Input
                              value={editData.login_name || ''}
                              onChange={(e) => setEditData({ ...editData, login_name: e.target.value })}
                              className="bg-white/50 backdrop-blur-sm border-medical-secondary/20 focus:border-medical-secondary transition-colors duration-300"
                            />
                          ) : (
                            <div className="flex items-center gap-2 p-3 bg-white/30 rounded-md backdrop-blur-sm border border-medical-secondary/10">
                              <User className="h-4 w-4 text-medical-secondary" />
                              <span>{employee?.login_name || 'Not set'}</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-medical-primary font-medium">Password</Label>
                          {editMode === 'demographics' ? (
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
                                  toast({
                                    title: "Password Generated",
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
                              <Key className="h-4 w-4 text-medical-secondary" />
                              <span>••••••••</span>
                            </div>
                          )}
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

                <TabsContent value="notifications" className="space-y-4 mt-6">
                  <Card className="p-6 backdrop-blur-sm bg-white/90 border-medical-secondary/20 transition-all duration-300 hover:shadow-glow">
                    <div className="flex items-center gap-2 mb-6">
                      <Bell className="h-5 w-5 text-medical-secondary" />
                      <span className="font-medium text-lg">Messaging & Notifications</span>
                    </div>
                    
                    <div className="space-y-6">
                      <Card className="p-4 bg-white/50 backdrop-blur-sm border-medical-secondary/10">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-2 hover:bg-medical-accent/20 rounded-md transition-colors duration-200">
                            <Label className="cursor-pointer">SMS Notifications</Label>
                            <Switch
                              checked={editData.sms_notifications}
                              onCheckedChange={(checked) => 
                                setEditData({ ...editData, sms_notifications: checked })
                              }
                              disabled={!editMode}
                            />
                          </div>
                          <div className="flex items-center justify-between p-2 hover:bg-medical-accent/20 rounded-md transition-colors duration-200">
                            <Label className="cursor-pointer">Email Notifications</Label>
                            <Switch
                              checked={editData.email_notifications}
                              onCheckedChange={(checked) => 
                                setEditData({ ...editData, email_notifications: checked })
                              }
                              disabled={!editMode}
                            />
                          </div>
                          <div className="flex items-center justify-between p-2 hover:bg-medical-accent/20 rounded-md transition-colors duration-200">
                            <Label className="cursor-pointer">Two-factor Authentication</Label>
                            <Switch
                              checked={editData.two_factor_auth}
                              onCheckedChange={(checked) => 
                                setEditData({ ...editData, two_factor_auth: checked })
                              }
                              disabled={!editMode}
                            />
                          </div>
                        </div>
                      </Card>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="beacon" className="space-y-4 mt-6">
                  <Card className="p-6 backdrop-blur-sm bg-white/90 border-medical-secondary/20 transition-all duration-300 hover:shadow-glow">
                    <div className="flex items-center gap-2 mb-6">
                      <Key className="h-5 w-5 text-medical-secondary" />
                      <span className="font-medium text-lg">Beacon Access</span>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-medical-primary font-medium">Beacon App Token</Label>
                          <div className="flex items-center gap-2 p-3 bg-white/30 rounded-md backdrop-blur-sm border border-medical-secondary/10">
                            <Key className="h-4 w-4 text-medical-secondary" />
                            <span className="font-mono text-sm">{employee?.beacon_token || 'Not generated'}</span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <Label className="text-medical-primary font-medium block">Last Login</Label>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 p-3 bg-white/30 rounded-md backdrop-blur-sm border border-medical-secondary/10">
                              <Clock className="h-4 w-4 text-medical-secondary" />
                              <span>Last attempt: {employee?.last_login_attempt || 'Never'}</span>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-white/30 rounded-md backdrop-blur-sm border border-medical-secondary/10">
                              <CheckCircle className="h-4 w-4 text-medical-secondary" />
                              <span>Last success: {employee?.last_login_success || 'Never'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
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

