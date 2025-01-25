import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { DispatchItem } from "@/components/dashboard/DispatchItem";

const ClosedDispatches = () => {
  const { data: closedDispatches, isLoading } = useQuery({
    queryKey: ['closed-dispatches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transport_records')
        .select('*')
        .in('dispatch_status', ['Completed', 'Canceled'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const completedDispatches = closedDispatches?.filter(
    dispatch => dispatch.dispatch_status === 'Completed'
  ) || [];

  const canceledDispatches = closedDispatches?.filter(
    dispatch => dispatch.dispatch_status === 'Canceled'
  ) || [];

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
                <h2 className="text-2xl font-semibold mb-6">Closed Dispatches</h2>
                <Tabs defaultValue="completed" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="completed">
                      Completed ({completedDispatches.length})
                    </TabsTrigger>
                    <TabsTrigger value="canceled">
                      Canceled ({canceledDispatches.length})
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="completed" className="space-y-4">
                    {completedDispatches.map((dispatch) => (
                      <DispatchItem
                        key={dispatch.id}
                        id={dispatch.dispatch_id}
                        activationTime={dispatch.transport_date}
                        patient={{
                          id: dispatch.patient_id || '',
                          name: 'Loading...',
                        }}
                        serviceType="BLS"
                        origin={dispatch.pickup_location}
                        destination={dispatch.dropoff_location}
                        status={dispatch.status}
                        priority="medium"
                        assignedTo={dispatch.crew_assigned || 'Unassigned'}
                        aiRecommendations={{
                          route: '',
                          crew: '',
                          billing: '',
                        }}
                        eta=""
                      />
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="canceled" className="space-y-4">
                    {canceledDispatches.map((dispatch) => (
                      <DispatchItem
                        key={dispatch.id}
                        id={dispatch.dispatch_id}
                        activationTime={dispatch.transport_date}
                        patient={{
                          id: dispatch.patient_id || '',
                          name: 'Loading...',
                        }}
                        serviceType="BLS"
                        origin={dispatch.pickup_location}
                        destination={dispatch.dropoff_location}
                        status={dispatch.status}
                        priority="medium"
                        assignedTo={dispatch.crew_assigned || 'Unassigned'}
                        aiRecommendations={{
                          route: '',
                          crew: '',
                          billing: '',
                        }}
                        eta=""
                      />
                    ))}
                  </TabsContent>
                </Tabs>
              </Card>
            </main>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
};

export default ClosedDispatches;