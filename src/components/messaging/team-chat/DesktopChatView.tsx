
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChannelSidebar } from "./ChannelSidebar";
import { MessageList } from "./MessageList";
import { ConversationView } from "./ConversationView";
import { Message, Channel } from "./types";

interface DesktopChatViewProps {
  messages: Message[];
  channels: Channel[];
  currentChannelName: string;
  setCurrentChannelName: (name: string) => void;
  selectedConversation: Message | null;
  setSelectedConversation: (conversation: Message | null) => void;
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  onShowAICorrection: () => void;
  onShowAIGenerator: () => void;
}

export function DesktopChatView({
  messages,
  channels,
  currentChannelName,
  setCurrentChannelName,
  selectedConversation,
  setSelectedConversation,
  newMessage,
  setNewMessage,
  handleSendMessage,
  onShowAICorrection,
  onShowAIGenerator
}: DesktopChatViewProps) {
  const handleSelectConversation = (message: Message) => {
    setSelectedConversation(message);
    setCurrentChannelName(message.channel);
  };
  
  return (
    <div className="hidden md:grid md:grid-cols-12 gap-4 h-[700px]">
      {/* Channels/Contacts sidebar */}
      <div className="col-span-3 border rounded-lg bg-background shadow-sm">
        <div className="p-3 border-b bg-muted/10 flex justify-between items-center">
          <h3 className="font-medium">Channels</h3>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </Button>
        </div>
        <ChannelSidebar 
          channels={channels}
          currentChannelName={currentChannelName}
          setCurrentChannelName={setCurrentChannelName}
        />
      </div>
      
      {/* Messages List */}
      <div className="col-span-4 border rounded-lg bg-background shadow-sm overflow-hidden">
        <div className="p-3 border-b bg-muted/10 flex justify-between items-center">
          <h3 className="font-medium">Messages</h3>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-orange-500"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/><path d="M19 3v4"/><path d="M23 7h-4"/></svg>
          </Button>
        </div>
        <MessageList 
          messages={messages}
          selectedConversation={selectedConversation}
          onSelectConversation={handleSelectConversation}
        />
      </div>
      
      {/* Conversation View */}
      <div className="col-span-5 border rounded-lg bg-background shadow-sm flex flex-col">
        <ConversationView 
          currentChannelName={currentChannelName}
          selectedConversation={selectedConversation}
          onSendMessage={handleSendMessage}
          onShowAICorrection={onShowAICorrection}
          onShowAIGenerator={onShowAIGenerator}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
        />
      </div>
    </div>
  );
}
