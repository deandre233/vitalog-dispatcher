
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamMessaging } from "@/components/hr/tabs/notifications/TeamMessaging";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TeamMember } from "@/types/ai";

export default function Messages() {
  // Mock employee ID - in a real app, this would come from auth context
  const employeeId = "emp-123";
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  
  useEffect(() => {
    // Fetch team members
    const fetchTeamMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('employees')
          .select('id, first_name, last_name, photo_url');
          
        if (error) throw error;
        
        if (data) {
          setTeamMembers(data.map(emp => ({
            id: emp.id,
            name: `${emp.first_name} ${emp.last_name}`,
            avatar: emp.photo_url
          })));
        }
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    };
    
    fetchTeamMembers();
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Team Messages</h1>
          <p className="text-muted-foreground">
            Communicate with your team and send important notifications
          </p>
          
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Team Communication Center</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[600px]">
                <TeamMessaging employeeId={employeeId} teamMembers={teamMembers} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
