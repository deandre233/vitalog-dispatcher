import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, Phone, MapPin, Clock, Award, FileText, AlertCircle } from "lucide-react";

export function EmployeeProfile() {
  const { id } = useParams();
  
  const employee = {
    id,
    name: "John Smith",
    role: "Senior Paramedic",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    location: "Station 23",
    status: "On Duty",
    shift: "Day Shift (7AM-7PM)",
    certifications: ["Advanced EMT", "CPR Instructor", "HAZMAT"],
    experience: "8 years",
    image: "/avatars/john-smith.jpg"
  };

  return (
    <div className="flex-1 bg-medical-accent/5 backdrop-blur-sm overflow-auto">
      <DashboardHeader />
      <main className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-medical-primary">
            Employee Profile
          </h1>
          <div className="flex gap-2">
            <Button variant="outline">Edit Profile</Button>
            <Button variant="default">Schedule Shift</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={employee.image} alt={employee.name} />
                  <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h2 className="text-xl font-semibold">{employee.name}</h2>
                  <p className="text-gray-500">{employee.role}</p>
                  <Badge variant="outline" className="mt-2">{employee.status}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{employee.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{employee.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{employee.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{employee.shift}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="incidents">Incidents</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        Certifications
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {employee.certifications.map((cert) => (
                          <Badge key={cert} variant="secondary">{cert}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Experience
                      </h3>
                      <p className="mt-2">{employee.experience}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="schedule">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Shifts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center p-4">
                      <Calendar className="h-32 w-32 text-gray-300" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle>Required Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center p-4">
                      <FileText className="h-32 w-32 text-gray-300" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="incidents">
                <Card>
                  <CardHeader>
                    <CardTitle>Incident Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center p-4">
                      <AlertCircle className="h-32 w-32 text-gray-300" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}