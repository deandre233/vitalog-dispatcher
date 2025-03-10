
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AIMessageGenerator } from "../AIMessageGenerator";
import { AITextCorrection } from "../AITextCorrection";
import { MobileChatView } from "./MobileChatView";
import { DesktopChatView } from "./DesktopChatView";
import { Message, Channel } from "./types";
import { useToast } from "@/hooks/use-toast";

interface TeamChatContainerProps {
  messages: Message[];
  channels: Channel[];
  searchQuery: string;
  onNewMessage: (recipientNames: string[], message: string) => void;
}

export function TeamChatContainer({
  messages,
  channels,
  searchQuery,
  onNewMessage
}: TeamChatContainerProps) {
  const [newMessage, setNewMessage] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<Message | null>(null);
  const [currentChannelName, setCurrentChannelName] = useState("Entire Team");
  const [pinnedMessages, setPinnedMessages] = useState<string[]>([]);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [showAICorrection, setShowAICorrection] = useState(false);
  const { toast } = useToast();
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Prepare message data
    const recipients = currentChannelName === "Direct Message" 
      ? (selectedConversation?.participants || []) 
      : [currentChannelName];
    
    // Send the message
    onNewMessage(recipients, newMessage);
    setNewMessage("");
    
    toast({
      title: "Message sent",
      description: "Your message has been sent successfully",
    });
  };
  
  const togglePinMessage = (messageId: string) => {
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

  const handleShowAITools = () => {
    // Simple toggle menu for AI tools
    toast({
      title: "AI Tools",
      description: "Choose an AI tool to help with your messages",
      action: (
        <div className="flex flex-col space-y-2 mt-2">
          <Button
            size="sm"
            variant="outline"
            className="border-orange-200 text-orange-600 hover:bg-orange-50 justify-start"
            onClick={() => setShowAIGenerator(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-orange-500"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/><path d="M19 3v4"/><path d="M23 7h-4"/></svg>
            Generate Message
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-orange-200 text-orange-600 hover:bg-orange-50 justify-start"
            onClick={() => setShowAICorrection(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-orange-500"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/><path d="M19 3v4"/><path d="M23 7h-4"/></svg>
            Correct Text
          </Button>
        </div>
      ),
    });
  };
  
  const handleApplyCorrection = (correctedText: string) => {
    setNewMessage(correctedText);
    toast({
      title: "Text Corrected",
      description: "AI corrections applied to your message",
    });
  };
  
  const handleSelectGeneratedMessage = (message: string) => {
    setNewMessage(message);
    toast({
      title: "Message Generated",
      description: "AI generated message added to input",
    });
  };

  const filteredMessages = messages;
  
  return (
    <>
      <MobileChatView 
        messages={filteredMessages}
        channels={channels}
        setCurrentChannelName={setCurrentChannelName}
        currentChannelName={currentChannelName}
        selectedConversation={selectedConversation}
        setSelectedConversation={setSelectedConversation}
        togglePinMessage={togglePinMessage}
        pinnedMessages={pinnedMessages}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        onShowAICorrection={() => setShowAICorrection(true)}
        onShowAIGenerator={() => setShowAIGenerator(true)}
      />
      
      <DesktopChatView
        messages={filteredMessages}
        channels={channels}
        currentChannelName={currentChannelName}
        setCurrentChannelName={setCurrentChannelName}
        selectedConversation={selectedConversation}
        setSelectedConversation={setSelectedConversation}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        onShowAICorrection={() => setShowAICorrection(true)}
        onShowAIGenerator={() => setShowAIGenerator(true)}
      />
      
      {/* AI Message Generator Dialog */}
      <Dialog open={showAIGenerator} onOpenChange={setShowAIGenerator}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          <AIMessageGenerator 
            onSelectMessage={handleSelectGeneratedMessage}
            onClose={() => setShowAIGenerator(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* AI Text Correction Dialog */}
      <AITextCorrection
        open={showAICorrection}
        onOpenChange={setShowAICorrection}
        initialText={newMessage}
        onApply={handleApplyCorrection}
      />
    </>
  );
}
