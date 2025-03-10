
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmployeeNotification } from "@/types/ai";
import { getNotificationIcon, getRelativeTime } from "../utils/notificationUtils";

interface NotificationItemProps {
  notification: EmployeeNotification;
  onMarkAsRead: (id: string) => void;
  onSwitchToTeamChat?: () => void;
}

export function NotificationItem({ notification, onMarkAsRead, onSwitchToTeamChat }: NotificationItemProps) {
  return (
    <div 
      className={`p-3 border rounded-md flex items-start gap-3 transition-colors ${!notification.isRead ? 'bg-muted' : ''}`}
    >
      <div className="mt-0.5">
        {getNotificationIcon(notification.type)}
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between">
          <h4 className="text-sm font-medium">
            {notification.title}
            {notification.sender_name && (
              <span className="ml-1 text-muted-foreground">from {notification.sender_name}</span>
            )}
          </h4>
          <span className="text-xs text-muted-foreground">
            {getRelativeTime(notification.createdAt)}
          </span>
        </div>
        <p className="text-sm mt-1">{notification.message}</p>
        
        {notification.aiMetadata && (
          <div className="mt-2 p-2 bg-blue-50 text-blue-800 text-xs rounded">
            <div className="font-medium">AI Insight:</div>
            <p>{notification.aiMetadata.recommendation}</p>
          </div>
        )}
        
        {notification.type === 'message' && notification.teamMessageId && (
          <div className="mt-2">
            <Button 
              variant="link" 
              size="sm" 
              className="p-0 h-auto text-xs text-indigo-600"
              onClick={onSwitchToTeamChat}
            >
              View in team chat
            </Button>
          </div>
        )}
      </div>
      
      {!notification.isRead && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          onClick={() => onMarkAsRead(notification.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
