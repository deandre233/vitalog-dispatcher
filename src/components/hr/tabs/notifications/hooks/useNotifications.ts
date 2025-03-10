
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { EmployeeNotification } from "@/types/ai";
import { mapNotificationData } from "../utils/notificationUtils";

export function useNotifications(employeeId: string) {
  const [notifications, setNotifications] = useState<EmployeeNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    try {
      // Fetch notifications
      const { data, error } = await supabase
        .from('employee_notifications')
        .select('*')
        .eq('employee_id', employeeId)
        .order('created_at', { ascending: false })
        .limit(showAll ? 50 : 10);
        
      if (error) throw error;
      
      if (data) {
        // Process data to enhance notifications
        const enhancedData = data.map(notif => mapNotificationData(notif, employeeId));
        setNotifications(enhancedData);
        setUnreadCount(enhancedData.filter(n => !n.isRead).length || 0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
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

  return {
    notifications,
    unreadCount,
    showAll,
    isLoading,
    setShowAll,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };
}
