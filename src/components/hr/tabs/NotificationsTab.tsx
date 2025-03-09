
import { useState, useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EmployeeBeacon } from "./notifications/EmployeeBeacon";
import { AINotificationCenter } from "./notifications/AINotificationCenter";
import { supabase } from "@/integrations/supabase/client";

interface NotificationsTabProps {
  employeeId: string;
}

export function NotificationsTab({ employeeId }: NotificationsTabProps) {
  const [isOnClock, setIsOnClock] = useState(false);
  
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
    
    checkShiftStatus();
    
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
                title="Team Updates" 
                description="Updates about your team and colleagues"
                defaultEnabled={true}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Separator />
      
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Your recent notifications and alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={enabled}
            onChange={() => setEnabled(!enabled)}
            className="sr-only peer" 
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  );
}
