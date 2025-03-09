
import { useState, useEffect } from "react";
import { Bell, X, CheckCircle, AlertTriangle, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { AIRecommendation } from "@/types/ai";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "achievement";
  is_read: boolean;
  created_at: string;
  ai_metadata?: AIRecommendation;
}

interface AINotificationCenterProps {
  employeeId: string;
}

export function AINotificationCenter({ employeeId }: AINotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchNotifications();
    
    // Set up real-time listener for new notifications
    const channel = supabase
      .channel('public:employee_notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'employee_notifications',
        filter: `employee_id=eq.${employeeId}`
      }, (payload) => {
        const newNotification = payload.new as Notification;
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
      const { data, error } = await supabase
        .from('employee_notifications')
        .select('*')
        .eq('employee_id', employeeId)
        .order('created_at', { ascending: false })
        .limit(showAll ? 50 : 10);
        
      if (error) throw error;
      
      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.is_read).length || 0);
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
            ? { ...notification, is_read: true } 
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
        prev.map(notification => ({ ...notification, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <InfoIcon className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'achievement':
        return <Bell className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Notifications</h2>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount} new
            </Badge>
          )}
        </div>
        
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>
      
      <Separator />
      
      {notifications.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No notifications to display
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`p-3 border rounded-md flex items-start gap-3 transition-colors ${!notification.is_read ? 'bg-muted' : ''}`}
            >
              <div className="mt-0.5">
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="text-sm font-medium">{notification.title}</h4>
                  <span className="text-xs text-muted-foreground">
                    {getRelativeTime(notification.created_at)}
                  </span>
                </div>
                <p className="text-sm mt-1">{notification.message}</p>
                
                {notification.ai_metadata && (
                  <div className="mt-2 p-2 bg-blue-50 text-blue-800 text-xs rounded">
                    <div className="font-medium">AI Insight:</div>
                    <p>{notification.ai_metadata.recommendation}</p>
                  </div>
                )}
              </div>
              
              {!notification.is_read && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={() => markAsRead(notification.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
      
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
