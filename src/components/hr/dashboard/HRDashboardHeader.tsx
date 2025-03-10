
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, MessageSquare } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface HRDashboardHeaderProps {
  unreadMessages: number;
}

export function HRDashboardHeader({ unreadMessages }: HRDashboardHeaderProps) {
  const navigate = useNavigate();
  
  const handleMessageClick = () => {
    // Navigate to dedicated messages page
    navigate(`/messages`);
    
    toast({
      title: "Messages",
      description: "Opening your message center...",
    });
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HR Command Center</h1>
        <p className="text-sm text-muted-foreground mt-1">Comprehensive personnel management and insights</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Clock className="mr-2 h-4 w-4" />
          Daily Report
        </Button>
        <Button 
          size="sm" 
          onClick={handleMessageClick}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300 relative animate-pulse"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Messages
          {unreadMessages > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white border-2 border-white" 
              variant="destructive"
            >
              {unreadMessages}
            </Badge>
          )}
        </Button>
        <Button size="sm">
          <Activity className="mr-2 h-4 w-4" />
          Analytics
        </Button>
      </div>
    </div>
  );
}
