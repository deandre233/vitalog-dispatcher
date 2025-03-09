
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, UserCircle, MapPin, FileCheck, Phone, ShieldCheck, Brain } from "lucide-react";

interface DemographicsSummaryProps {
  data: any;
  onEdit: () => void;
  insights: number;
}

export function DemographicsSummary({ data, onEdit, insights }: DemographicsSummaryProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not provided";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  const calculateAge = (birthDate: string) => {
    if (!birthDate) return "";
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };
  
  const formatPhone = (phone: string) => {
    if (!phone) return "Not provided";
    // Simple formatter for US phone numbers
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phone;
  };
  
  const getCompletionPercentage = () => {
    const requiredFields = [
      'first_name', 'last_name', 'date_of_birth', 'address_line1', 'city', 
      'state', 'zip_code', 'mobile', 'email', 'certification_level',
      'emergency_contact_name', 'emergency_contact_phone'
    ];
    
    let completed = 0;
    requiredFields.forEach(field => {
      if (data[field]) completed++;
    });
    
    return Math.round((completed / requiredFields.length) * 100);
  };

  const completionPercentage = getCompletionPercentage();
  
  return (
    <div className="space-y-6">
      <Card className="border-blue-100">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Employee Profile Summary</CardTitle>
            <Button onClick={onEdit}>Edit Details</Button>
          </div>
          <CardDescription>
            Overview of demographic information for {data.first_name} {data.last_name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Badge 
                variant={completionPercentage < 70 ? "destructive" : 
                         completionPercentage < 90 ? "warning" : "success"}
                className="text-xs py-1 px-2 rounded-md"
              >
                {completionPercentage}% Complete
              </Badge>
              
              {data.certification_level && (
                <Badge variant="outline" className="text-xs py-1 px-2 rounded-md">
                  {data.certification_level}
                </Badge>
              )}
              
              {insights > 0 && (
                <Badge variant="secondary" className="text-xs py-1 px-2 rounded-md flex items-center gap-1">
                  <Brain className="h-3 w-3" />
                  <span>{insights} Insights</span>
                </Badge>
              )}
            </div>
            
            {data.certification_expiry && (
              <Badge 
                variant={
                  new Date(data.certification_expiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) 
                    ? "destructive" 
                    : new Date(data.certification_expiry) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                    ? "warning"
                    : "outline"
                }
                className="text-xs py-1 px-2 rounded-md"
              >
                {new Date(data.certification_expiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                  ? "Certification expiring soon"
                  : `Expires: ${formatDate(data.certification_expiry)}`
                }
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card className="bg-slate-50/70">
              <CardHeader className="py-4">
                <div className="flex items-center gap-2">
                  <UserCircle className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-md">Personal Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="py-0">
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Full Name:</div>
                    <div className="text-sm">{data.first_name} {data.last_name}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Date of Birth:</div>
                    <div className="text-sm">
                      {formatDate(data.date_of_birth)}
                      {data.date_of_birth && <span className="text-muted-foreground ml-1">({calculateAge(data.date_of_birth)} years)</span>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Gender:</div>
                    <div className="text-sm">{data.gender || "Not specified"}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Citizenship:</div>
                    <div className="text-sm">{data.citizenship || "Not specified"}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Race/Ethnicity:</div>
                    <div className="text-sm">{data.race_ethnicity || "Not specified"}</div>
                  </div>
                  {data.secondary_race && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Secondary Race:</div>
                      <div className="text-sm">{data.secondary_race}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Address Information */}
            <Card className="bg-slate-50/70">
              <CardHeader className="py-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-md">Address Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="py-0">
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Street Address:</div>
                    <div className="text-sm">
                      {data.address_line1 || "Not provided"}
                      {data.address_line2 && <div>{data.address_line2}</div>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">City, State, ZIP:</div>
                    <div className="text-sm">
                      {data.city ? `${data.city}, ${data.state} ${data.zip_code}` : "Not provided"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Professional Information */}
            <Card className="bg-slate-50/70">
              <CardHeader className="py-4">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-md">Professional Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="py-0">
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Certification Level:</div>
                    <div className="text-sm">{data.certification_level || "Not specified"}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Certification ID:</div>
                    <div className="text-sm">{data.certification_number || "Not provided"}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Certification Expiry:</div>
                    <div className="text-sm">{formatDate(data.certification_expiry)}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Years Experience:</div>
                    <div className="text-sm">{data.years_experience || "Not provided"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Contact Information */}
            <Card className="bg-slate-50/70">
              <CardHeader className="py-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-md">Contact Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="py-0">
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Email:</div>
                    <div className="text-sm">{data.email || "Not provided"}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Mobile Phone:</div>
                    <div className="text-sm">{formatPhone(data.mobile)}</div>
                  </div>
                  {data.home_phone && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Home Phone:</div>
                      <div className="text-sm">{formatPhone(data.home_phone)}</div>
                    </div>
                  )}
                  {data.work_phone && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Work Phone:</div>
                      <div className="text-sm">{formatPhone(data.work_phone)}</div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Preferred Contact:</div>
                    <div className="text-sm capitalize">{data.preferred_contact_method || "Not specified"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Emergency Contact Information */}
          <Card className="mt-6 bg-slate-50/70">
            <CardHeader className="py-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <CardTitle className="text-md">Emergency Contact</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium">Name:</div>
                  <div className="text-sm">{data.emergency_contact_name || "Not provided"}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium">Phone:</div>
                  <div className="text-sm">{formatPhone(data.emergency_contact_phone)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Consents removed as requested */}
        </CardContent>
      </Card>
    </div>
  );
}
