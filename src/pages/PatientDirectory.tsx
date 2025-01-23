import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const PatientDirectory = () => {
  const navigate = useNavigate();
  
  const { data: patients, isLoading, error } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('last_name', { ascending: true });

      if (error) {
        console.error('Error fetching patients:', error);
        toast.error('Failed to load patients');
        throw error;
      }

      return data || [];
    }
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 bg-[#f4f7fc] overflow-auto">
            <DashboardHeader />
            <main className="p-6">
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Patient Directory</h2>
                
                {isLoading && (
                  <div className="text-gray-500">Loading patients...</div>
                )}

                {error && (
                  <div className="text-red-500">
                    Error loading patients. Please try again later.
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {patients?.map((patient) => (
                    <Card 
                      key={patient.id}
                      className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => navigate(`/patient/${patient.id}`)}
                    >
                      <div className="flex flex-col items-center space-y-4">
                        <Avatar className="h-20 w-20">
                          <AvatarFallback>
                            {patient.first_name?.[0]}{patient.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                          <h3 className="font-semibold">
                            {patient.first_name} {patient.last_name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            DOB: {patient.dob ? new Date(patient.dob).toLocaleDateString() : 'N/A'}
                          </p>
                          {patient.medical_conditions && patient.medical_conditions.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1 justify-center">
                              {patient.medical_conditions.slice(0, 2).map((condition, index) => (
                                <Badge key={index} variant="outline">
                                  {condition}
                                </Badge>
                              ))}
                              {patient.medical_conditions.length > 2 && (
                                <Badge variant="outline">
                                  +{patient.medical_conditions.length - 2} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </main>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
};

export default PatientDirectory;