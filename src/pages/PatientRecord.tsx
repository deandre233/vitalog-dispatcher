import { SidebarProvider, SidebarRail } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { Header } from "@/components/layout/Header";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
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
  Heart
} from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const PatientRecord = () => {
  const { patientName } = useParams();
  const decodedName = decodeURIComponent(patientName || "");
  const [isEditing, setIsEditing] = useState(false);
  const [patientData, setPatientData] = useState({
    phone: "(678) 875-9912",
    email: "angela.turner@email.com",
    address: "855 Fayetteville Rd Se",
    city: "Atlanta",
    state: "GA",
    zip: "30316",
    dob: "1965-03-15",
    gender: "Female",
    ssn: "XXX-XX-4789",
    maritalStatus: "Married",
    occupation: "Teacher",
    preferredLanguage: "English",
    medicalConditions: ["Asthma", "Hypertension"],
    allergies: ["Penicillin", "Latex"],
    medications: ["Albuterol", "Lisinopril"],
    emergencyContactName: "Robert Turner",
    emergencyContactRelation: "Spouse",
    emergencyContactPhone: "(678) 875-9913",
    bloodType: "A+",
    height: "5'6\"",
    weight: "145 lbs",
    primaryCarePhysician: "Dr. Sarah Johnson",
    insuranceProvider: "Blue Cross Blue Shield",
    insurancePolicyNumber: "BCB123456789",
    lastPhysical: "2023-09-15"
  });
  const { toast } = useToast();

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      // Here we would update the patient data in Supabase
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Patient information updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update patient information",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPatientData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ... keep existing code (breadcrumb and header section)

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
                      <BreadcrumbLink href="/dispatch">Patients</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{decodedName}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>

                <Card className="mt-4 p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${decodedName}`} />
                        <AvatarFallback>{decodedName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <UserRound className="h-5 w-5 text-gray-500" />
                          <h1 className="text-2xl font-bold">{decodedName}</h1>
                        </div>
                        <div className="mt-2 space-y-1">
                          <Badge variant="outline" className="mr-2">Requires oxygen</Badge>
                          <Badge variant="outline">DNR order</Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" onClick={isEditing ? handleSave : handleEdit}>
                      {isEditing ? "Save Changes" : "Edit Profile"}
                    </Button>
                  </div>

                  <Tabs defaultValue="demographics" className="w-full">
                    <TabsList className="w-full justify-start border-b">
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
                        History (447)
                      </TabsTrigger>
                      <TabsTrigger value="upcoming" className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4" />
                        Upcoming (5)
                      </TabsTrigger>
                      <TabsTrigger value="claims" className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        Claims (421)
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

                    <TabsContent value="demographics" className="mt-6 space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <Card className="p-4">
                          <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <UserRound className="h-4 w-4" />
                            Personal Information
                          </h3>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm text-gray-500">Date of Birth</label>
                                {isEditing ? (
                                  <Input
                                    name="dob"
                                    value={patientData.dob}
                                    onChange={handleInputChange}
                                    className="h-8 text-sm"
                                    type="date"
                                  />
                                ) : (
                                  <p className="text-sm">{patientData.dob}</p>
                                )}
                              </div>
                              <div>
                                <label className="text-sm text-gray-500">Gender</label>
                                {isEditing ? (
                                  <Input
                                    name="gender"
                                    value={patientData.gender}
                                    onChange={handleInputChange}
                                    className="h-8 text-sm"
                                  />
                                ) : (
                                  <p className="text-sm">{patientData.gender}</p>
                                )}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm text-gray-500">SSN</label>
                              {isEditing ? (
                                <Input
                                  name="ssn"
                                  value={patientData.ssn}
                                  onChange={handleInputChange}
                                  className="h-8 text-sm"
                                  type="password"
                                />
                              ) : (
                                <p className="text-sm">{patientData.ssn}</p>
                              )}
                            </div>
                            <div>
                              <label className="text-sm text-gray-500">Marital Status</label>
                              {isEditing ? (
                                <Input
                                  name="maritalStatus"
                                  value={patientData.maritalStatus}
                                  onChange={handleInputChange}
                                  className="h-8 text-sm"
                                />
                              ) : (
                                <p className="text-sm">{patientData.maritalStatus}</p>
                              )}
                            </div>
                            <div>
                              <label className="text-sm text-gray-500">Occupation</label>
                              {isEditing ? (
                                <Input
                                  name="occupation"
                                  value={patientData.occupation}
                                  onChange={handleInputChange}
                                  className="h-8 text-sm"
                                />
                              ) : (
                                <p className="text-sm">{patientData.occupation}</p>
                              )}
                            </div>
                            <div>
                              <label className="text-sm text-gray-500">Preferred Language</label>
                              {isEditing ? (
                                <Input
                                  name="preferredLanguage"
                                  value={patientData.preferredLanguage}
                                  onChange={handleInputChange}
                                  className="h-8 text-sm"
                                />
                              ) : (
                                <p className="text-sm">{patientData.preferredLanguage}</p>
                              )}
                            </div>
                          </div>
                        </Card>

                        <Card className="p-4">
                          <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Contact className="h-4 w-4" />
                            Contact Information
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm text-gray-500">Phone</label>
                              {isEditing ? (
                                <Input
                                  name="phone"
                                  value={patientData.phone}
                                  onChange={handleInputChange}
                                  className="h-8 text-sm"
                                />
                              ) : (
                                <p className="text-sm">{patientData.phone}</p>
                              )}
                            </div>
                            <div>
                              <label className="text-sm text-gray-500">Email</label>
                              {isEditing ? (
                                <Input
                                  name="email"
                                  value={patientData.email}
                                  onChange={handleInputChange}
                                  className="h-8 text-sm"
                                />
                              ) : (
                                <p className="text-sm">{patientData.email}</p>
                              )}
                            </div>
                            <div>
                              <label className="text-sm text-gray-500">Address</label>
                              {isEditing ? (
                                <div className="space-y-2">
                                  <Input
                                    name="address"
                                    value={patientData.address}
                                    onChange={handleInputChange}
                                    className="h-8 text-sm"
                                    placeholder="Street Address"
                                  />
                                  <div className="grid grid-cols-3 gap-2">
                                    <Input
                                      name="city"
                                      value={patientData.city}
                                      onChange={handleInputChange}
                                      className="h-8 text-sm"
                                      placeholder="City"
                                    />
                                    <Input
                                      name="state"
                                      value={patientData.state}
                                      onChange={handleInputChange}
                                      className="h-8 text-sm"
                                      placeholder="State"
                                    />
                                    <Input
                                      name="zip"
                                      value={patientData.zip}
                                      onChange={handleInputChange}
                                      className="h-8 text-sm"
                                      placeholder="ZIP"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="text-sm">
                                  <p>{patientData.address}</p>
                                  <p>{patientData.city}, {patientData.state} {patientData.zip}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>

                        <Card className="p-4">
                          <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Heart className="h-4 w-4" />
                            Health Information
                          </h3>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm text-gray-500">Blood Type</label>
                                {isEditing ? (
                                  <Input
                                    name="bloodType"
                                    value={patientData.bloodType}
                                    onChange={handleInputChange}
                                    className="h-8 text-sm"
                                  />
                                ) : (
                                  <p className="text-sm">{patientData.bloodType}</p>
                                )}
                              </div>
                              <div>
                                <label className="text-sm text-gray-500">Height</label>
                                {isEditing ? (
                                  <Input
                                    name="height"
                                    value={patientData.height}
                                    onChange={handleInputChange}
                                    className="h-8 text-sm"
                                  />
                                ) : (
                                  <p className="text-sm">{patientData.height}</p>
                                )}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm text-gray-500">Weight</label>
                              {isEditing ? (
                                <Input
                                  name="weight"
                                  value={patientData.weight}
                                  onChange={handleInputChange}
                                  className="h-8 text-sm"
                                />
                              ) : (
                                <p className="text-sm">{patientData.weight}</p>
                              )}
                            </div>
                            <div>
                              <label className="text-sm text-gray-500">Primary Care Physician</label>
                              {isEditing ? (
                                <Input
                                  name="primaryCarePhysician"
                                  value={patientData.primaryCarePhysician}
                                  onChange={handleInputChange}
                                  className="h-8 text-sm"
                                />
                              ) : (
                                <p className="text-sm">{patientData.primaryCarePhysician}</p>
                              )}
                            </div>
                            <div>
                              <label className="text-sm text-gray-500">Last Physical</label>
                              {isEditing ? (
                                <Input
                                  name="lastPhysical"
                                  value={patientData.lastPhysical}
                                  onChange={handleInputChange}
                                  className="h-8 text-sm"
                                  type="date"
                                />
                              ) : (
                                <p className="text-sm">{patientData.lastPhysical}</p>
                              )}
                            </div>
                          </div>
                        </Card>

                        <Card className="p-4">
                          <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Medical Conditions & Allergies
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm text-gray-500">Medical Conditions</label>
                              {isEditing ? (
                                <Textarea
                                  name="medicalConditions"
                                  value={patientData.medicalConditions.join(", ")}
                                  onChange={handleInputChange}
                                  className="h-20 text-sm"
                                />
                              ) : (
                                <p className="text-sm">{patientData.medicalConditions.join(", ")}</p>
                              )}
                            </div>
                            <div>
                              <label className="text-sm text-gray-500">Allergies</label>
                              {isEditing ? (
                                <Textarea
                                  name="allergies"
                                  value={patientData.allergies.join(", ")}
                                  onChange={handleInputChange}
                                  className="h-20 text-sm"
                                />
                              ) : (
                                <p className="text-sm">{patientData.allergies.join(", ")}</p>
                              )}
                            </div>
                          </div>
                        </Card>

                        <Card className="p-4">
                          <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Pill className="h-4 w-4" />
                            Medications
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm text-gray-500">Current Medications</label>
                              {isEditing ? (
                                <Textarea
                                  name="medications"
                                  value={patientData.medications.join(", ")}
                                  onChange={handleInputChange}
                                  className="h-20 text-sm"
                                />
                              ) : (
                                <p className="text-sm">{patientData.medications.join(", ")}</p>
                              )}
                            </div>
                          </div>
                        </Card>

                        <Card className="p-4">
                          <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Contact className="h-4 w-4" />
                            Emergency Contact
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm text-gray-500">Name</label>
                              {isEditing ? (
                                <Input
                                  name="emergencyContactName"
                                  value={patientData.emergencyContactName}
                                  onChange={handleInputChange}
                                  className="h-8 text-sm"
                                />
                              ) : (
                                <p className="text-sm">{patientData.emergencyContactName}</p>
                              )}
                            </div>
                            <div>
                              <label className="text-sm text-gray-500">Relationship</label>
                              {isEditing ? (
                                <Input
                                  name="emergencyContactRelation"
                                  value={patientData.emergencyContactRelation}
                                  onChange={handleInputChange}
                                  className="h-8 text-sm"
                                />
                              ) : (
                                <p className="text-sm">{patientData.emergencyContactRelation}</p>
                              )}
                            </div>
                            <div>
                              <label className="text-sm text-gray-500">Phone</label>
                              {isEditing ? (
                                <Input
                                  name="emergencyContactPhone"
                                  value={patientData.emergencyContactPhone}
                                  onChange={handleInputChange}
                                  className="h-8 text-sm"
                                />
                              ) : (
                                <p className="text-sm">{patientData.emergencyContactPhone}</p>
                              )}
                            </div>
                          </div>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="medical">
                      <Card className="p-4">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                          <Stethoscope className="h-4 w-4" />
                          Medical Information
                        </h3>
                        <div className="space-y-4">
                          <p className="text-gray-500">Medical information will be displayed here</p>
                        </div>
                      </Card>
                    </TabsContent>

                    <TabsContent value="billing">
                      <Card className="p-4">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Billing Information
                        </h3>
                        <div className="space-y-4">
                          <p className="text-gray-500">Billing information will be displayed here</p>
                        </div>
                      </Card>
                    </TabsContent>

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
