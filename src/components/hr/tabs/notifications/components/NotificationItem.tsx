
import { getNotificationIcon, getRelativeTime } from "../utils/notificationUtils";
import { EmployeeNotification } from "@/types/ai";

interface NotificationItemProps {
  notification: EmployeeNotification;
  onMarkAsRead: (id: string) => void;
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div 
      className={`p-4 border-b transition-colors cursor-pointer hover:bg-slate-50 ${!notification.isRead ? 'bg-blue-50' : ''}`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">
          {getNotificationIcon(notification.type)}
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <h4 className="text-sm font-medium">{notification.title}</h4>
            <span className="text-xs text-muted-foreground">{getRelativeTime(notification.createdAt)}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
          
          {notification.sender_name && (
            <div className="mt-1 text-xs text-muted-foreground">
              From: {notification.sender_name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
