
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Employee } from "@/types/employee";
import { PersonalInfoCard } from "./summary/PersonalInfoCard";
import { AddressInfoCard } from "./summary/AddressInfoCard";
import { ProfessionalInfoCard } from "./summary/ProfessionalInfoCard";
import { ContactInfoCard } from "./summary/ContactInfoCard";
import { EmergencyContactCard } from "./summary/EmergencyContactCard";
import { EmployeeProfileBadges } from "./summary/EmployeeProfileBadges";

interface DemographicsSummaryProps {
  data: Partial<Employee>;
  onEdit: () => void;
  insights: number;
}

export function DemographicsSummary({ data, onEdit, insights }: DemographicsSummaryProps) {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Not provided";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  const calculateAge = (birthDate: string | undefined) => {
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
  
  const formatPhone = (phone: string | undefined) => {
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
      if (data[field as keyof typeof data]) completed++;
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
          <EmployeeProfileBadges 
            completionPercentage={completionPercentage}
            certificationLevel={data.certification_level}
            insights={insights}
            certificationExpiry={data.certification_expiry}
            formatDate={formatDate}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PersonalInfoCard 
              data={data} 
              formatDate={formatDate} 
              calculateAge={calculateAge} 
            />
            
            <AddressInfoCard data={data} />
            
            <ProfessionalInfoCard 
              data={data} 
              formatDate={formatDate} 
            />
            
            <ContactInfoCard 
              data={data} 
              formatPhone={formatPhone} 
            />
          </div>
          
          <EmergencyContactCard 
            data={data} 
            formatPhone={formatPhone} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
