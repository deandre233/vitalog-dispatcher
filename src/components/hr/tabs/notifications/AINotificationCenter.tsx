
import { useEffect } from "react";
import { NotificationHeader } from "./components/NotificationHeader";
import { NotificationList } from "./components/NotificationList";
import { ShowMoreButton } from "./components/ShowMoreButton";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { useNotifications } from "./hooks/useNotifications";

interface AINotificationCenterProps {
  employeeId: string;
}

export function AINotificationCenter({ employeeId }: AINotificationCenterProps) {
  const { 
    notifications, 
    unreadCount, 
    showAll,
    isLoading,
    setShowAll, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications(employeeId);

  const handleToggleShowAll = () => {
    setShowAll(!showAll);
    fetchNotifications();
  };

  return (
    <div className="space-y-4">
      <NotificationHeader 
        unreadCount={unreadCount}
        onMarkAllAsRead={markAllAsRead}
      />
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <NotificationList
          notifications={notifications}
          onMarkAsRead={markAsRead}
        />
      )}
      
      {notifications.length > 0 && (
        <ShowMoreButton 
          showAll={showAll} 
          onToggle={handleToggleShowAll} 
        />
      )}
    </div>
  );
}
