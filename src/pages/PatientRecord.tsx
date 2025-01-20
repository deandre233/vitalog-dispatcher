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
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  AlertCircle, 
  UserRound,
  HeartPulse,
  Stethoscope,
  DollarSign,
  Receipt,
  History,
  Bell,
  ShieldCheck,
  CreditCard,
  Clock,
  CalendarClock,
  Ambulance,
  Building2,
  Contact,
  Pill,
  AlertTriangle,
  Heart,
  Loader2
} from "lucide-react";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BillingTabContent } from "@/components/patient/BillingTabContent";
import { MedicalTabContent } from "@/components/patient/MedicalTabContent";

export function PatientRecord() {
  const { patientName } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [patientData, setPatientData] = useState({
    id: '', 
    firstName: '',
    lastName: '',
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    dob: "",
    gender: "",
    maritalStatus: "",
    occupation: "",
    preferredLanguage: "",
    medicalConditions: [],
    allergies: [],
    medications: [],
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",
    bloodType: "",
    height: "",
    weight: "",
    primaryCarePhysician: "",
    insuranceProvider: "",
    insurancePolicyNumber: "",
    lastPhysical: "",
    usualTransportMode: "",
    status: "",
    warnings: {
      requiresOxygen: false,
      dnrOrder: false,
    },
    barriersToEMS: {
      culturalReligious: false,
      developmentallyImpaired: false,
      hearingImpaired: false,
      language: false,
      physicallyImpaired: false,
      psychImpaired: false,
      sightImpaired: false,
      speechImpaired: false,
      suspectAlcoholUse: false,
      suspectDrugUse: false,
      unsupervised: false
    },
    race: "",
    stateDLID: "",
    mbi: "",
    barcode: "",
    ssn: "",
    residenceFacility: "",
    floorRoom: "",
    county: "",
    transience: "",
    censusTract: "",
    workPhone: "",
    mobilePhone: "",
    additionalWarnings: ""
  });

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setIsLoading(true);
        
        if (!patientName) {
          toast({
            title: "Error",
            description: "Invalid patient ID format",
            variant: "destructive",
          });
          return;
        }

        // First try to find by legacy_display_id
        let { data, error } = await supabase
          .from('patients')
          .select('*')
          .eq('legacy_display_id', patientName)
          .maybeSingle();

        // If not found by legacy_display_id and the ID looks like a UUID, try UUID
        if (!data && !error && patientName.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
          ({ data, error } = await supabase
            .from('patients')
            .select('*')
            .eq('id', patientName)
            .maybeSingle());
        }

        if (error) {
          console.error('Error fetching patient:', error);
          throw error;
        }

        if (!data) {
          toast({
            title: "Patient Not Found",
            description: `No patient record found for ID ${patientName}`,
            variant: "destructive",
          });
          return;
        }

        document.title = `Patient Record - ${data.first_name} ${data.last_name}`;

        setPatientData(prev => ({
          ...prev,
          id: data.id,
          firstName: data.first_name,
          lastName: data.last_name,
          phone: data.phone || prev.phone,
          email: data.email || prev.email,
          address: data.address || prev.address,
          city: data.city || prev.city,
          state: data.state || prev.state,
          zip: data.zip || prev.zip,
          dob: data.dob || prev.dob,
          gender: data.gender || prev.gender,
          medicalConditions: data.medical_conditions || prev.medicalConditions,
          allergies: data.allergies || prev.allergies,
          medications: data.medications || prev.medications,
          emergencyContactName: data.emergency_contact_name || prev.emergencyContactName,
          emergencyContactPhone: data.emergency_contact_phone || prev.emergencyContactPhone,
        }));
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
  }, [patientName, toast]);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('patients')
        .update({
          first_name: patientData.firstName,
          last_name: patientData.lastName,
          phone: patientData.phone,
          email: patientData.email,
          address: patientData.address,
          city: patientData.city,
          state: patientData.state,
          zip: patientData.zip,
          medical_conditions: patientData.medicalConditions,
          allergies: patientData.allergies,
          medications: patientData.medications,
          emergency_contact_name: patientData.emergencyContactName,
          emergency_contact_phone: patientData.emergencyContactPhone,
        })
        .eq('id', patientData.id);

      if (error) throw error;

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Patient information updated successfully",
      });
    } catch (error) {
      console.error('Error updating patient:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update patient information",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const target = e.target as HTMLInputElement;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setPatientData(prev => {
        const parentObj = prev[parent as keyof typeof prev];
        if (typeof parentObj === 'object' && parentObj !== null) {
          return {
            ...prev,
            [parent]: {
              ...parentObj,
              [child]: target.type === 'checkbox' ? target.checked : value
            }
          };
        }
        return prev;
      });
    } else {
      setPatientData(prev => ({
        ...prev,
        [name]: target.type === 'checkbox' ? target.checked : value
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-gray-400" />
            <p className="mt-4 text-gray-600">Loading patient data...</p>
          </div>
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
                <Card className="mt-4 p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${patientData.firstName} ${patientData.lastName}`} />
                        <AvatarFallback>{`${patientData.firstName?.[0] || ''}${patientData.lastName?.[0] || ''}`}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h1 className="text-2xl font-bold">{`${patientData.firstName || ''} ${patientData.lastName || ''}`}</h1>
                        {patientData.warnings?.requiresOxygen && (
                          <Badge variant="outline" className="mt-2">Requires oxygen</Badge>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" onClick={isEditing ? handleSave : handleEdit}>
                      {isEditing ? "Save Changes" : "Edit Profile"}
                    </Button>
                  </div>

                  <Tabs defaultValue="demographics" className="w-full">
                    <TabsList className="w-full justify-start">
                      <TabsTrigger value="demographics">
                        <UserRound className="h-4 w-4 mr-2" />
                        Demographics
                      </TabsTrigger>
                      <TabsTrigger value="billing">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Billing
                      </TabsTrigger>
                      <TabsTrigger value="medical">
                        <Stethoscope className="h-4 w-4 mr-2" />
                        Medical
                      </TabsTrigger>
                      <TabsTrigger value="history">
                        <History className="h-4 w-4 mr-2" />
                        History (447)
                      </TabsTrigger>
                      <TabsTrigger value="upcoming">
                        <CalendarClock className="h-4 w-4 mr-2" />
                        Upcoming (5)
                      </TabsTrigger>
                      <TabsTrigger value="claims">
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Claims (421)
                      </TabsTrigger>
                      <TabsTrigger value="payments">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Payments
                      </TabsTrigger>
                      <TabsTrigger value="invoices">
                        <Receipt className="h-4 w-4 mr-2" />
                        Invoices
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="billing">
                      <BillingTabContent patientId={patientData.id} />
                    </TabsContent>

                    <TabsContent value="medical">
                      <MedicalTabContent patientId={patientData.id} />
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
}

export default PatientRecord;
