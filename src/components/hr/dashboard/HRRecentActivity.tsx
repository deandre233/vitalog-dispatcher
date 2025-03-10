
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, UserCog, Clock, Award, AlertTriangle } from "lucide-react";

interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatar?: string;
    initials: string;
  };
  action: string;
  subject: string;
  timestamp: string;
  type: 'document' | 'employee' | 'timeclock' | 'certification' | 'incident';
}

export function HRRecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch from API
    setTimeout(() => {
      setActivities([
        {
          id: '1',
          user: { name: 'Sarah Connor', initials: 'SC' },
          action: 'uploaded',
          subject: 'Annual Review Document',
          timestamp: '20 minutes ago',
          type: 'document'
        },
        {
          id: '2',
          user: { name: 'John Murphy', initials: 'JM' },
          action: 'updated',
          subject: 'Employee Profile',
          timestamp: '1 hour ago',
          type: 'employee'
        },
        {
          id: '3',
          user: { name: 'Maria Rodriguez', initials: 'MR' },
          action: 'approved',
          subject: 'Time Off Request',
          timestamp: '2 hours ago',
          type: 'timeclock'
        },
        {
          id: '4',
          user: { name: 'David Kim', initials: 'DK' },
          action: 'renewed',
          subject: 'EMT Certification',
          timestamp: '5 hours ago',
          type: 'certification'
        },
        {
          id: '5',
          user: { name: 'Lisa Johnson', initials: 'LJ' },
          action: 'filed',
          subject: 'Incident Report #2193',
          timestamp: 'Yesterday',
          type: 'incident'
        }
      ]);
      setIsLoading(false);
    }, 1200);
  }, []);

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'employee':
        return <UserCog className="h-4 w-4 text-purple-500" />;
      case 'timeclock':
        return <Clock className="h-4 w-4 text-green-500" />;
      case 'certification':
        return <Award className="h-4 w-4 text-amber-500" />;
      case 'incident':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src={activity.user.avatar} />
                  <AvatarFallback>{activity.user.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{activity.user.name}</span>
                    <span className="text-muted-foreground text-sm">{activity.action}</span>
                    <div className="flex items-center">
                      {getActionIcon(activity.type)}
                      <span className="ml-1 font-medium">{activity.subject}</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{activity.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">View All Activity</Button>
      </CardFooter>
    </Card>
  );
}
