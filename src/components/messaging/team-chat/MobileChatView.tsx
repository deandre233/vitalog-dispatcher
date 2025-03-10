
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Menu, Search, MessageSquare, Users, Sparkles } from "lucide-react";
import { ChannelSidebar } from "./ChannelSidebar";
import { MessageList } from "./MessageList";
import { Message } from "./types";

interface MobileChatViewProps {
  messages: Message[];
  channels: any[];
  setCurrentChannelName: (name: string) => void;
  currentChannelName: string;
  selectedConversation: Message | null;
  setSelectedConversation: (message: Message) => void;
  togglePinMessage: (messageId: string) => void;
  pinnedMessages: string[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  onShowAICorrection: () => void;
  onShowAIGenerator: () => void;
}

export function MobileChatView({
  messages,
  channels,
  setCurrentChannelName,
  currentChannelName,
  selectedConversation,
  setSelectedConversation,
  togglePinMessage,
  pinnedMessages,
  newMessage,
  setNewMessage,
  handleSendMessage,
  onShowAICorrection,
  onShowAIGenerator
}: MobileChatViewProps) {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="md:hidden h-screen flex flex-col">
      {/* Header */}
      <div className="border-b p-3 flex items-center justify-between">
        <div className="flex items-center">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="mr-2">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <ChannelSidebar 
                channels={channels}
                currentChannelName={currentChannelName}
                setCurrentChannelName={setCurrentChannelName}
              />
            </SheetContent>
          </Sheet>
          <h2 className="text-lg font-semibold">{currentChannelName}</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Message List */}
      <div className="flex-1 overflow-y-auto">
        <MessageList 
          messages={messages}
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
        />
      </div>
      
      {/* Input Area */}
      <div className="p-3 border-t">
        <div className="flex gap-2 items-center mb-2">
          <Input 
            placeholder="Type your message..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="bg-muted/5 border-muted"
          />
          <Button 
            onClick={handleSendMessage}
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
