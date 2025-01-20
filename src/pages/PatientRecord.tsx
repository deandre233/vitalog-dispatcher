import { SidebarProvider, SidebarRail } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { Header } from "@/components/layout/Header";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { PatientProfileData } from "@/components/patient/PatientProfileData";
import { supabase } from "@/integrations/supabase/client";
import { BillingTabContent } from "@/components/patient/BillingTabContent";
import { MedicalTabContent } from "@/components/patient/MedicalTabContent";
import { useState, useEffect } from "react";
import {
  UserRound,
  DollarSign,
  Stethoscope,
  History,
  CalendarClock,
  ShieldCheck,
  CreditCard,
  Receipt,
  Loader2
} from "lucide-react";

const PatientRecord = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const [patientData, setPatientData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    medicalConditions: [],
    allergies: [],
    medications: [],
    emergencyContactName: '',
    emergencyContactPhone: '',
  });

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patientId) {
        console.error('No patient ID provided');
        toast({
          title: "Error",
          description: "No patient ID provided",
          variant: "destructive",
        });
        navigate('/patients');
        return;
      }

      try {
        setIsLoading(true);
        console.log('Fetching patient data for ID:', patientId);
        
        const { data: patient, error } = await supabase
          .from('patients')
          .select('*')
          .eq('id', patientId)
          .single();

        if (error) {
          console.error('Error fetching patient:', error);
          toast({
            title: "Error",
            description: "Failed to fetch patient data",
            variant: "destructive",
          });
          return;
        }

        if (!patient) {
          console.log('No patient found with ID:', patientId);
          toast({
            title: "Patient Not Found",
            description: `No patient record found with ID ${patientId}`,
            variant: "destructive",
          });
          navigate('/patients');
          return;
        }

        setPatientData({
          id: patient.id,
          firstName: patient.first_name,
          lastName: patient.last_name,
          dob: patient.dob || '',
          gender: patient.gender || '',
          phone: patient.phone || '',
          email: patient.email || '',
          address: patient.address || '',
          city: patient.city || '',
          state: patient.state || '',
          zip: patient.zip || '',
          medicalConditions: patient.medical_conditions || [],
          allergies: patient.allergies || [],
          medications: patient.medications || [],
          emergencyContactName: patient.emergency_contact_name || '',
          emergencyContactPhone: patient.emergency_contact_phone || '',
        });
        
        document.title = `Patient Record - ${patient.first_name} ${patient.last_name}`;
      } catch (err) {
        console.error('Error in fetchPatientData:', err);
        toast({
          title: "Error",
          description: "An unexpected error occurred while fetching patient data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, [patientId, navigate, toast]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleProfileSave = (updatedData: any) => {
    setPatientData(prev => ({
      ...prev,
      ...updatedData
    }));
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex">
          <SidebarProvider defaultOpen={true}>
            <div className="min-h-screen flex w-full">
              <AppSidebar />
              <SidebarRail />
              <div className="flex-1 bg-[#f4f7fc] overflow-auto">
                <div className="p-6">
                  <Card className="w-full p-8">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <Loader2 className="w-16 h-16 animate-spin text-primary" />
                      <div className="space-y-2 text-center">
                        <h3 className="text-lg font-medium">Loading Patient Record</h3>
                        <p className="text-sm text-muted-foreground">
                          Please wait while we fetch the patient information...
                        </p>
                      </div>
                      <Progress className="w-64" value={30} />
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </SidebarProvider>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider defaultOpen={true}>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <SidebarRail />
            <div className="flex-1 bg-[#f4f7fc] overflow-auto">
              <div className="p-6">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/patients">Patients</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{`${patientData.firstName} ${patientData.lastName}`}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>

                <Card className="mt-4 p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${patientData.firstName} ${patientData.lastName}`} />
                        <AvatarFallback>{`${patientData.firstName?.[0] || ''}${patientData.lastName?.[0] || ''}`}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                          <UserRound className="h-6 w-6 text-gray-500" />
                          {`${patientData.firstName} ${patientData.lastName}`}
                        </h1>
                      </div>
                    </div>
                    <Button variant="outline" onClick={handleEdit}>
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>
                  </div>

                  <Tabs defaultValue="demographics" className="w-full">
                    <TabsList className="w-full justify-start">
                      <TabsTrigger value="demographics" className="flex items-center gap-2">
                        <UserRound className="h-4 w-4" />
                        Demographics
                      </TabsTrigger>
                      <TabsTrigger value="billing" className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Billing
                      </TabsTrigger>
                      <TabsTrigger value="medical" className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4" />
                        Medical
                      </TabsTrigger>
                      <TabsTrigger value="history" className="flex items-center gap-2">
                        <History className="h-4 w-4" />
                        History
                      </TabsTrigger>
                      <TabsTrigger value="upcoming" className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4" />
                        Upcoming
                      </TabsTrigger>
                      <TabsTrigger value="claims" className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        Claims
                      </TabsTrigger>
                      <TabsTrigger value="payments" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Payments
                      </TabsTrigger>
                      <TabsTrigger value="invoices" className="flex items-center gap-2">
                        <Receipt className="h-4 w-4" />
                        Invoices
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="demographics" className="mt-6">
                      <PatientProfileData
                        patientId={patientData.id}
                        initialData={{
                          firstName: patientData.firstName,
                          lastName: patientData.lastName,
                          dob: patientData.dob,
                          gender: patientData.gender,
                          phone: patientData.phone,
                          email: patientData.email,
                          address: patientData.address,
                          city: patientData.city,
                          state: patientData.state,
                          zip: patientData.zip,
                        }}
                        onSave={handleProfileSave}
                        isEditing={isEditing}
                      />
                    </TabsContent>

                    <TabsContent value="billing">
                      <BillingTabContent patientId={patientData.id} />
                    </TabsContent>

                    <TabsContent value="medical">
                      <MedicalTabContent patientId={patientData.id} />
                    </TabsContent>

                    {/* Other tab contents remain unchanged */}
                    <TabsContent value="history">
                      <Card className="p-4">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                          <History className="h-4 w-4" />
                          Transport History
                        </h3>
                        <div className="space-y-4">
                          <p className="text-gray-500">Transport history will be displayed here</p>
                        </div>
                      </Card>
                    </TabsContent>

                    <TabsContent value="upcoming">
                      <Card className="p-4">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                          <CalendarClock className="h-4 w-4" />
                          Upcoming Appointments
                        </h3>
                        <div className="space-y-4">
                          <p className="text-gray-500">Upcoming appointments will be displayed here</p>
                        </div>
                      </Card>
                    </TabsContent>

                    <TabsContent value="claims">
                      <Card className="p-4">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4" />
                          Claims
                        </h3>
                        <div className="space-y-4">
                          <p className="text-gray-500">Claims information will be displayed here</p>
                        </div>
                      </Card>
                    </TabsContent>

                    <TabsContent value="payments">
                      <Card className="p-4">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Payments
                        </h3>
                        <div className="space-y-4">
                          <p className="text-gray-500">Payment information will be displayed here</p>
                        </div>
                      </Card>
                    </TabsContent>

                    <TabsContent value="invoices">
                      <Card className="p-4">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                          <Receipt className="h-4 w-4" />
                          Invoices
                        </h3>
                        <div className="space-y-4">
                          <p className="text-gray-500">Invoice information will be displayed here</p>
                        </div>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </Card>
              </div>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default PatientRecord;
