
import { EmployeeNotification } from "@/types/ai";
import { NotificationItem } from "./NotificationItem";
import { EmptyNotifications } from "./EmptyNotifications";

interface NotificationListProps {
  notifications: EmployeeNotification[];
  onMarkAsRead: (id: string) => void;
}

export function NotificationList({ notifications, onMarkAsRead }: NotificationListProps) {
  if (notifications.length === 0) {
    return <EmptyNotifications />;
  }

  return (
    <div className="space-y-2">
      {notifications.map(notification => (
        <NotificationItem 
          key={notification.id} 
          notification={notification}
          onMarkAsRead={onMarkAsRead}
        />
      ))}
    </div>
  );
}
