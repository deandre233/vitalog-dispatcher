
import { useState, useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EmployeeBeacon } from "./notifications/EmployeeBeacon";
import { AINotificationCenter } from "./notifications/AINotificationCenter";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { Bell } from "lucide-react";

interface NotificationsTabProps {
  employeeId: string;
}

export function NotificationsTab({ employeeId }: NotificationsTabProps) {
  const [isOnClock, setIsOnClock] = useState(false);
  const [teamMembers, setTeamMembers] = useState<{ id: string; name: string; avatar?: string }[]>([]);
  
  useEffect(() => {
    // Check if employee is currently on clock
    const checkShiftStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('shift_records')
          .select('*')
          .eq('employee_id', employeeId)
          .is('end_time', null)  // Active shift has no end time
          .limit(1);
          
        if (error) throw error;
        
        setIsOnClock(data && data.length > 0);
      } catch (error) {
        console.error("Error checking shift status:", error);
      }
    };
    
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
    
    checkShiftStatus();
    fetchTeamMembers();
    
    // Set up real-time listener for shift status changes
    const channel = supabase
      .channel('public:shift_records')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'shift_records',
        filter: `employee_id=eq.${employeeId}`
      }, () => {
        checkShiftStatus();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [employeeId]);

  return (
    <TabsContent value="notifications" className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Location Tracking</CardTitle>
            <CardDescription>
              Activate your beacon to let managers track your location while on duty
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmployeeBeacon employeeId={employeeId} isOnClock={isOnClock} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Control what types of notifications you receive
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <NotificationSetting 
                title="Shift Reminders" 
                description="Get notified about upcoming shifts"
                defaultEnabled={true}
              />
              <NotificationSetting 
                title="Achievement Alerts" 
                description="Notifications when you earn achievements"
                defaultEnabled={true}
              />
              <NotificationSetting 
                title="AI Insights" 
                description="Receive AI-powered insights and recommendations"
                defaultEnabled={true}
              />
              <NotificationSetting 
                title="Important Announcements" 
                description="Emergency and high-priority messages"
                defaultEnabled={true}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Separator />
      
      <Card className="overflow-hidden">
        <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <h3 className="text-lg font-medium">Notifications</h3>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-6">
          <AINotificationCenter employeeId={employeeId} />
        </CardContent>
      </Card>
    </TabsContent>
  );
}

interface NotificationSettingProps {
  title: string;
  description: string;
  defaultEnabled: boolean;
}

function NotificationSetting({ title, description, defaultEnabled }: NotificationSettingProps) {
  const [enabled, setEnabled] = useState(defaultEnabled);
  
  return (
    <div className="flex items-center justify-between">
      <div>
        <h4 className="text-sm font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div>
        <Switch 
          checked={enabled}
          onCheckedChange={setEnabled}
          aria-label={`Toggle ${title.toLowerCase()} notifications`}
        />
      </div>
    </div>
  );
}
