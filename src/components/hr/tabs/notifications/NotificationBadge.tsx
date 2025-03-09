
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface NotificationBadgeProps {
  employeeId: string;
  onClick?: () => void;
}

export function NotificationBadge({ employeeId, onClick }: NotificationBadgeProps) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Get initial unread count
    fetchUnreadCount();
    
    // Set up realtime listener for new notifications
    const notificationsChannel = supabase
      .channel('employee-notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'employee_notifications',
        filter: `employee_id=eq.${employeeId}`
      }, () => {
        fetchUnreadCount();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(notificationsChannel);
    };
  }, [employeeId]);

  const fetchUnreadCount = async () => {
    try {
      const { count, error } = await supabase
        .from('employee_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('employee_id', employeeId)
        .eq('is_read', false);
        
      if (error) throw error;
      
      setUnreadCount(count || 0);
    } catch (error) {
      console.error("Error fetching notification count:", error);
    }
  };

  return (
    <div 
      className="relative inline-flex cursor-pointer" 
      onClick={onClick}
      role="button"
      aria-label={`${unreadCount} unread notifications`}
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-5 min-w-[20px] flex items-center justify-center px-1 text-xs"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      )}
    </div>
  );
}
