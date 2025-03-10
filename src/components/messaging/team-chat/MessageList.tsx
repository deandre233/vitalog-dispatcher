
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pin, User } from "lucide-react";
import { Message } from "./types";
import { EmptyStateMessage } from "../EmptyStateMessage";
import { useToast } from "@/hooks/use-toast";

interface MessageListProps {
  messages: Message[];
  selectedConversation: Message | null;
  onSelectConversation: (message: Message) => void;
}

export function MessageList({ 
  messages, 
  selectedConversation, 
  onSelectConversation 
}: MessageListProps) {
  const [pinnedMessages, setPinnedMessages] = useState<string[]>([]);
  const { toast } = useToast();
  
  const togglePinMessage = (messageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (pinnedMessages.includes(messageId)) {
      setPinnedMessages(pinnedMessages.filter(id => id !== messageId));
      toast({
        title: "Message unpinned",
        description: "The message has been removed from pinned messages",
      });
    } else {
      setPinnedMessages([...pinnedMessages, messageId]);
      toast({
        title: "Message pinned",
        description: "The message has been added to pinned messages",
      });
    }
  };
  
  return (
    <ScrollArea className="h-[640px]">
      {messages.length === 0 ? (
        <EmptyStateMessage 
          title="No messages found"
          description="Start a conversation with your team"
          onAIAssist={() => {/* This will be handled in the parent component */}}
        />
      ) : (
        <div className="divide-y">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`p-3 hover:bg-muted/30 cursor-pointer transition-colors group
                ${!message.read ? 'bg-orange-50' : ''}
                ${selectedConversation?.id === message.id ? 'bg-orange-100' : ''}
                ${pinnedMessages.includes(message.id) ? 'border-l-2 border-orange-500' : ''}
              `}
              onClick={() => onSelectConversation(message)}
            >
              <div className="flex justify-between mb-1">
                <div className="font-medium">{message.channel === "Direct Message" ? message.sender : message.channel}</div>
                <div className="text-xs text-muted-foreground flex items-center">
                  {message.timestamp}
                  {pinnedMessages.includes(message.id) ? (
                    <Pin className="h-3 w-3 ml-1 text-orange-500" />
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 ml-1"
                      onClick={(e) => togglePinMessage(message.id, e)}
                    >
                      <Pin className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="text-sm text-muted-foreground truncate">{message.content}</div>
              {!message.read && (
                <div className="mt-1 flex justify-end">
                  <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  );
}
