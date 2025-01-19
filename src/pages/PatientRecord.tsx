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
import { FileText, Phone, Mail, MapPin, Calendar, Clock, AlertCircle } from "lucide-react";

const PatientRecord = () => {
  const { patientName } = useParams();
  const decodedName = decodeURIComponent(patientName || "");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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
                <div className="mt-4">
                  <Card className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${decodedName}`} />
                          <AvatarFallback>{decodedName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h1 className="text-2xl font-bold">{decodedName}</h1>
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="mr-2 h-4 w-4" />
                              (555) 123-4567
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Mail className="mr-2 h-4 w-4" />
                              {decodedName.toLowerCase().replace(' ', '.')}@email.com
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="mr-2 h-4 w-4" />
                              123 Medical Center Dr, Healthcare City
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline">Edit Profile</Button>
                    </div>

                    <Tabs defaultValue="overview" className="mt-6">
                      <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="medical-history">Medical History</TabsTrigger>
                        <TabsTrigger value="transport-history">Transport History</TabsTrigger>
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="mt-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <Card className="p-4">
                            <h3 className="font-semibold mb-2">Recent Activity</h3>
                            <ScrollArea className="h-[200px]">
                              <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">Last transport: 3 days ago</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">Next scheduled: Tomorrow, 10:00 AM</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">Medical records updated: 1 week ago</span>
                                </div>
                              </div>
                            </ScrollArea>
                          </Card>

                          <Card className="p-4">
                            <h3 className="font-semibold mb-2">Alerts</h3>
                            <ScrollArea className="h-[200px]">
                              <div className="space-y-4">
                                <div className="flex items-center gap-2 text-red-500">
                                  <AlertCircle className="h-4 w-4" />
                                  <span className="text-sm">Allergic to penicillin</span>
                                </div>
                                <div className="flex items-center gap-2 text-yellow-500">
                                  <AlertCircle className="h-4 w-4" />
                                  <span className="text-sm">Requires wheelchair assistance</span>
                                </div>
                              </div>
                            </ScrollArea>
                          </Card>
                        </div>
                      </TabsContent>

                      <TabsContent value="medical-history">
                        <Card className="p-4">
                          <h3 className="font-semibold mb-4">Medical History</h3>
                          <div className="space-y-4">
                            {/* Add medical history content here */}
                          </div>
                        </Card>
                      </TabsContent>

                      <TabsContent value="transport-history">
                        <Card className="p-4">
                          <h3 className="font-semibold mb-4">Transport History</h3>
                          <div className="space-y-4">
                            {/* Add transport history content here */}
                          </div>
                        </Card>
                      </TabsContent>

                      <TabsContent value="documents">
                        <Card className="p-4">
                          <h3 className="font-semibold mb-4">Documents</h3>
                          <div className="space-y-4">
                            {/* Add documents content here */}
                          </div>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default PatientRecord;