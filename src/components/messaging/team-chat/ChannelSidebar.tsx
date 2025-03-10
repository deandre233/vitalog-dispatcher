
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Users, User, MessageSquare } from "lucide-react";
import { Channel } from "./types";

interface ChannelSidebarProps {
  channels: Channel[];
  currentChannelName: string;
  setCurrentChannelName: (name: string) => void;
}

export function ChannelSidebar({ 
  channels, 
  currentChannelName, 
  setCurrentChannelName 
}: ChannelSidebarProps) {
  
  const getChannelIcon = (type: string) => {
    switch(type) {
      case "team": return <Users className="h-4 w-4" />;
      case "announcement": return <MessageSquare className="h-4 w-4" />;
      case "celebration": return <User className="h-4 w-4" />;
      case "applicants": return <User className="h-4 w-4" />;
      case "operations": return <MessageSquare className="h-4 w-4" />;
      case "training": return <User className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };
  
  return (
    <ScrollArea className="h-[640px]">
      <div className="p-2">
        {channels.map(channel => (
          <Button 
            key={channel.id} 
            variant="ghost" 
            className={`w-full justify-start mb-1 font-normal ${
              currentChannelName === channel.name ? 'bg-orange-50 text-orange-700' : ''
            }`}
            onClick={() => setCurrentChannelName(channel.name)}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                {getChannelIcon(channel.type)}
                <span className="ml-2">{channel.name}</span>
              </div>
              {channel.unread > 0 && (
                <Badge variant="destructive" className="ml-auto bg-orange-500">
                  {channel.unread}
                </Badge>
              )}
            </div>
          </Button>
        ))}
        
        <Separator className="my-2" />
        
        <div className="flex justify-between items-center mb-2 px-2">
          <h3 className="font-medium">Direct Messages</h3>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <User className="h-4 w-4" />
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start mb-1 font-normal"
        >
          <User className="h-4 w-4 mr-2" />
          <span>Justen B.</span>
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start mb-1 font-normal"
        >
          <User className="h-4 w-4 mr-2" />
          <span>Blake G.</span>
          <Badge variant="destructive" className="ml-auto bg-orange-500">1</Badge>
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start mb-1 font-normal"
        >
          <User className="h-4 w-4 mr-2" />
          <span>Andrew T.</span>
          <Badge variant="destructive" className="ml-auto bg-orange-500">2</Badge>
        </Button>
      </div>
    </ScrollArea>
  );
}
