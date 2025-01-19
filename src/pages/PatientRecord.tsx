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
  CalendarClock
} from "lucide-react";

const PatientRecord = () => {
  const { patientName } = useParams();
  const decodedName = decodeURIComponent(patientName || "");

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
                    <Button variant="outline">Edit Profile</Button>
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
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span>DOB: 08/17/1967</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <span>(678) 875-9912</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-gray-500" />
                              <span>angela.turner@email.com</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                              <div>
                                <p>855 Fayetteville Rd Se</p>
                                <p>Atlanta, GA 30316</p>
                              </div>
                            </div>
                          </div>
                        </Card>

                        <Card className="p-4">
                          <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <HeartPulse className="h-4 w-4" />
                            Medical Alerts
                          </h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-red-500">
                              <AlertCircle className="h-4 w-4" />
                              <span className="text-sm">Requires oxygen</span>
                            </div>
                            <div className="flex items-center gap-2 text-yellow-500">
                              <AlertCircle className="h-4 w-4" />
                              <span className="text-sm">DNR order</span>
                            </div>
                          </div>
                        </Card>

                        <Card className="p-4">
                          <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Stethoscope className="h-4 w-4" />
                            Medical History
                          </h3>
                          <ScrollArea className="h-[200px]">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-sm">
                                <FileText className="h-4 w-4 text-gray-500" />
                                <span>Asthma</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <FileText className="h-4 w-4 text-gray-500" />
                                <span>Hypertension</span>
                              </div>
                            </div>
                          </ScrollArea>
                        </Card>

                        <Card className="p-4">
                          <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Ambulance className="h-4 w-4" />
                            Transport History
                          </h3>
                          <ScrollArea className="h-[200px]">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-sm">
                                <Hospital className="h-4 w-4 text-gray-500" />
                                <div>
                                  <p className="font-medium">Emory University Hospital</p>
                                  <p className="text-gray-500">Last transport: 3 days ago</p>
                                </div>
                              </div>
                            </div>
                          </ScrollArea>
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
