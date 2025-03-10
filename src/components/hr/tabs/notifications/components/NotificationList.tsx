
import { EmployeeNotification } from "@/types/ai";
import { NotificationItem } from "./NotificationItem";

interface NotificationListProps {
  notifications: EmployeeNotification[];
  onMarkAsRead: (id: string) => void;
  onSwitchToTeamChat: () => void;
}

export function NotificationList({ notifications, onMarkAsRead, onSwitchToTeamChat }: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No notifications to display
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {notifications.map(notification => (
        <NotificationItem 
          key={notification.id} 
          notification={notification}
          onMarkAsRead={onMarkAsRead}
          onSwitchToTeamChat={onSwitchToTeamChat}
        />
      ))}
    </div>
  );
}
