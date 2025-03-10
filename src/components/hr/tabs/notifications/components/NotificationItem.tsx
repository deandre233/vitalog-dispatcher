
import { getNotificationIcon, getRelativeTime } from "../utils/notificationUtils";
import { EmployeeNotification } from "@/types/ai";
import { Button } from "@/components/ui/button";

interface NotificationItemProps {
  notification: EmployeeNotification;
  onMarkAsRead: (id: string) => void;
  onSwitchToTeamChat: () => void;
}

export function NotificationItem({ notification, onMarkAsRead, onSwitchToTeamChat }: NotificationItemProps) {
  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    
    // If it's a team message, offer to switch to team chat view
    if (notification.teamMessageId) {
      onSwitchToTeamChat();
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
          
          {notification.teamMessageId && (
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onSwitchToTeamChat();
                }}
              >
                View in Team Chat
              </Button>
            </div>
          )}
          
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
