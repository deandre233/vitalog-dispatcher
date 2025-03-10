
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, UserPlus, Search, Sparkles } from "lucide-react";
import { Message } from "./types";
import { useToast } from "@/hooks/use-toast";

interface ConversationViewProps {
  currentChannelName: string;
  selectedConversation: Message | null;
  onSendMessage: () => void;
  onShowAICorrection: () => void;
  onShowAIGenerator: () => void;
  newMessage: string;
  setNewMessage: (message: string) => void;
}

export function ConversationView({ 
  currentChannelName, 
  selectedConversation,
  onSendMessage,
  onShowAICorrection,
  onShowAIGenerator,
  newMessage,
  setNewMessage
}: ConversationViewProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b bg-muted/10 flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage src="/lovable-uploads/056f6072-2287-4579-bb29-786c9206ac76.png" />
            <AvatarFallback>{currentChannelName.charAt(0)}</AvatarFallback>
          </Avatar>
          <h3 className="font-medium">{currentChannelName}</h3>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
            <UserPlus className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col-reverse gap-3">
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-3 rounded-lg max-w-[80%] ml-auto">
            <div className="font-medium text-sm mb-1 text-right">You</div>
            <div>I'll follow up with the team on that.</div>
            <div className="text-xs text-muted-foreground mt-1 text-right">Just now</div>
          </div>
          
          <div className="bg-muted/10 p-3 rounded-lg max-w-[80%]">
            <div className="font-medium text-sm mb-1 flex items-center">
              <Avatar className="h-5 w-5 mr-1">
                <AvatarFallback>HH</AvatarFallback>
              </Avatar>
              Heart to Heart Ambulance
            </div>
            <div>{selectedConversation ? selectedConversation.content : "I felt that one, rest in peace"}</div>
            <div className="text-xs text-muted-foreground mt-1">Today at 10:45 AM</div>
          </div>
        </div>
      </ScrollArea>
      
      <div className="p-3 border-t">
        <div className="flex gap-2 items-center mb-2">
          <Input 
            placeholder="Type your message..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
            className="bg-muted/5 border-muted"
          />
          <Button 
            onClick={onSendMessage} 
            className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-muted-foreground"
            onClick={onShowAICorrection}
          >
            <Sparkles className="h-3 w-3 mr-1 text-orange-400" />
            Auto-correct
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-xs text-muted-foreground"
            onClick={onShowAIGenerator}
          >
            <Sparkles className="h-3 w-3 mr-1 text-orange-400" />
            AI Generate
          </Button>
        </div>
      </div>
    </div>
  );
}
