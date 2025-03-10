
import { useState } from "react";
import { Send, Sparkles, BellPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendTeamMessage } from "../utils/teamMessagingUtils";
import { toast } from "@/hooks/use-toast";

interface MessageInputProps {
  employeeId: string;
  channel: string;
  onMessageSent: () => void;
}

export function MessageInput({ employeeId, channel, onMessageSent }: MessageInputProps) {
  const [newMessage, setNewMessage] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [isAnnouncement, setIsAnnouncement] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    const success = await sendTeamMessage(
      employeeId, 
      channel, 
      newMessage, 
      isImportant,
      isAnnouncement
    );
    
    if (success) {
      setNewMessage("");
      setIsImportant(false);
      setIsAnnouncement(false);
      setIsExpanded(false);
      onMessageSent();
    }
  };

  const handleAIAssist = async () => {
    setIsGeneratingAI(true);
    
    // Starting message to indicate processing
    toast({
      title: "AI Assistant",
      description: "Generating a professional message...",
    });
    
    try {
      // Simulate AI generation (replace with actual API call in production)
      setTimeout(() => {
        // Example enhanced message
        const enhancedMessage = isAnnouncement 
          ? `🔔 ANNOUNCEMENT: ${newMessage}`
          : `I'd like to inform the team that ${newMessage}. Please let me know if you have any questions.`;
        
        setNewMessage(enhancedMessage);
        setIsGeneratingAI(false);
        
        toast({
          title: "AI Assistant",
          description: "Message improved! Review before sending.",
        });
      }, 1500);
    } catch (error) {
      console.error("Error using AI assistant:", error);
      setIsGeneratingAI(false);
      toast({
        title: "AI Error",
        description: "Couldn't generate a message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {isExpanded ? (
        <Textarea
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="min-h-[100px] resize-y"
        />
      ) : (
        <div className="flex items-end gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            type="submit" 
            size="icon"
            disabled={isGeneratingAI || !newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch 
              id="important-toggle"
              checked={isImportant}
              onCheckedChange={setIsImportant}
            />
            <Label htmlFor="important-toggle" className="text-xs sm:text-sm">
              Mark as important
            </Label>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch 
              id="announcement-toggle"
              checked={isAnnouncement}
              onCheckedChange={setIsAnnouncement}
            />
            <Label htmlFor="announcement-toggle" className="text-xs sm:text-sm">
              Announcement
            </Label>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs"
          >
            {isExpanded ? "Compact" : "Expand"}
          </Button>
          
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleAIAssist}
            disabled={isGeneratingAI || !newMessage.trim()}
            className="text-xs gap-1"
          >
            <Sparkles className="h-3 w-3" />
            AI Assist
          </Button>
        </div>
      </div>
    </div>
  );
}
