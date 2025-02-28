
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Announcement } from "./AnnouncementList";
import { Calendar, Clock, Eye, FileSignature, User, UserCheck, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AnnouncementViewDialogProps {
  announcement: Announcement;
  onClose: () => void;
}

export const AnnouncementViewDialog = ({
  announcement,
  onClose,
}: AnnouncementViewDialogProps) => {
  const createdDate = new Date(announcement.createdAt);
  const expiresDate = new Date(announcement.expiresAt);
  const readPercentage = Math.round(
    (announcement.seenBy / announcement.totalTargetUsers) * 100
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{announcement.title}</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant={
            announcement.status === "active" ? "default" : 
            announcement.status === "scheduled" ? "secondary" : 
            announcement.status === "draft" ? "outline" : 
            "destructive"
          }>
            {announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1)}
          </Badge>
          {announcement.requiresSignature && (
            <Badge variant="outline" className="flex items-center gap-1">
              <FileSignature className="h-3 w-3" />
              Signature Required
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <Card className="p-6">
            <div className="prose max-w-none">
              <p>{announcement.content}</p>
            </div>
          </Card>
        </div>

        <div className="md:w-80 space-y-6">
          <Card className="p-4 space-y-4">
            <h3 className="font-medium text-sm text-gray-500">DETAILS</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 text-blue-800">
                    {announcement.author.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium">{announcement.author}</div>
                  <div className="text-xs text-gray-500">Author</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm">Created on</div>
                  <div className="text-sm font-medium">
                    {createdDate.toLocaleDateString()} at {createdDate.toLocaleTimeString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm">Expires on</div>
                  <div className="text-sm font-medium">
                    {expiresDate.toLocaleDateString()} at {expiresDate.toLocaleTimeString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Users className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm">Target Groups</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {announcement.targetGroups.map((group, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {group}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 space-y-4">
            <h3 className="font-medium text-sm text-gray-500">READ STATISTICS</h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Read by</span>
                  <span className="text-sm font-medium">
                    {announcement.seenBy}/{announcement.totalTargetUsers}
                  </span>
                </div>
                <Progress value={readPercentage} className="h-2" />
              </div>
              
              <Button className="w-full" variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Detailed Read Statistics
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
};
