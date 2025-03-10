
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { EmployeeNotification } from "@/types/ai";
import { NotificationHeader } from "./components/NotificationHeader";
import { NotificationList } from "./components/NotificationList";
import { mapNotificationData } from "./utils/notificationUtils";

interface AINotificationCenterProps {
  employeeId: string;
}

export function AINotificationCenter({ employeeId }: AINotificationCenterProps) {
  const [notifications, setNotifications] = useState<EmployeeNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchNotifications();
    
    // Set up real-time listener for new notifications
    const channel = supabase
      .channel('employee-notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'employee_notifications',
        filter: `employee_id=eq.${employeeId}`
      }, (payload) => {
        const newNotification = mapNotificationData(payload.new, employeeId);
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        // Show a toast for the new notification
        toast({
          title: newNotification.title,
          description: newNotification.message,
        });
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [employeeId]);

  const fetchNotifications = async () => {
    try {
      // Fetch notifications
      const { data, error } = await supabase
        .from('employee_notifications')
        .select(`
          *,
          team_messages (
            id,
            sender_id
          )
        `)
        .eq('employee_id', employeeId)
        .order('created_at', { ascending: false })
        .limit(showAll ? 50 : 10);
        
      if (error) throw error;
      
      if (data) {
        // Process data to enhance team message notifications with sender info
        const enhancedData = await Promise.all(data.map(async (notif) => {
          let updatedNotif = { ...notif };
          
          // If it's a team message notification, get sender info
          if (notif.team_message_id && notif.team_messages) {
            const senderId = notif.team_messages.sender_id;
            
            try {
              const { data: senderData } = await supabase
                .from('employees')
                .select('first_name, last_name')
                .eq('id', senderId)
                .single();
                
              if (senderData) {
                updatedNotif.sender_name = `${senderData.first_name} ${senderData.last_name}`;
              }
            } catch (err) {
              console.error("Error fetching sender info:", err);
            }
          }
          
          return mapNotificationData(updatedNotif, employeeId);
        }));
        
        setNotifications(enhancedData);
        setUnreadCount(enhancedData.filter(n => !n.isRead).length || 0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('employee_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
        
      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('employee_notifications')
        .update({ is_read: true })
        .eq('employee_id', employeeId)
        .eq('is_read', false);
        
      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleSwitchToTeamChat = () => {
    // Find parent component and switch to team chat tab
    const tabsTrigger = document.querySelector('[value="team-chat"]') as HTMLElement;
    if (tabsTrigger) tabsTrigger.click();
  };

  return (
    <div className="space-y-4">
      <NotificationHeader 
        unreadCount={unreadCount}
        onMarkAllAsRead={markAllAsRead}
      />
      
      <NotificationList
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onSwitchToTeamChat={handleSwitchToTeamChat}
      />
      
      {notifications.length > 0 && (
        <div className="flex justify-center mt-4">
          <Button 
            variant="link" 
            onClick={() => {
              setShowAll(!showAll);
              fetchNotifications();
            }}
          >
            {showAll ? "Show fewer" : "Show all notifications"}
          </Button>
        </div>
      )}
    </div>
  );
}
