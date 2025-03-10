
import { useState } from "react";
import { Send, Sparkles, BellPlus, Cog, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  sendTeamMessage, 
  generateAIMessage 
} from "../utils/teamMessagingUtils";
import { toast } from "@/hooks/use-toast";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

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
  
  // AI message generation states
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showAIOptions, setShowAIOptions] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiTone, setAiTone] = useState<"professional" | "friendly" | "urgent">("professional");
  const [aiMessageType, setAiMessageType] = useState<"regular" | "announcement" | "important">("regular");
  const [aiCreativity, setAiCreativity] = useState([50]);

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
  
  const generateFullAIMessage = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "AI Generator",
        description: "Please enter a prompt to generate a message",
        variant: "destructive",
      });
      return;
    }
    
    setIsGeneratingAI(true);
    
    toast({
      title: "AI Message Generator",
      description: "Creating your message...",
    });
    
    try {
      // Generate AI message
      const generatedMessage = await generateAIMessage(
        aiPrompt,
        aiMessageType,
        aiTone
      );
      
      // Update message input and options based on AI generated content
      setNewMessage(generatedMessage);
      if (aiMessageType === "announcement") setIsAnnouncement(true);
      if (aiMessageType === "important") setIsImportant(true);
      
      // Hide AI dialog
      setShowAIOptions(false);
      setAiPrompt("");
      
      toast({
        title: "AI Message Created",
        description: "Your message has been generated. Review and send when ready.",
      });
    } catch (error) {
      console.error("Error generating AI message:", error);
      toast({
        title: "Generation Failed",
        description: "Could not create your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAI(false);
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
          
          <Popover open={showAIOptions} onOpenChange={setShowAIOptions}>
            <PopoverTrigger asChild>
              <Button 
                variant="secondary" 
                size="sm"
                className="text-xs gap-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
              >
                <Wand2 className="h-3 w-3" />
                AI Generate
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h3 className="font-medium text-sm">Generate AI Message</h3>
                <div className="space-y-2">
                  <Label htmlFor="ai-prompt">What would you like to say?</Label>
                  <Textarea 
                    id="ai-prompt"
                    placeholder="Meeting tomorrow at 3pm in the conference room"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ai-tone">Message Tone</Label>
                  <Select 
                    value={aiTone} 
                    onValueChange={(value: "professional" | "friendly" | "urgent") => setAiTone(value)}
                  >
                    <SelectTrigger id="ai-tone">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ai-type">Message Type</Label>
                  <Select 
                    value={aiMessageType} 
                    onValueChange={(value: "regular" | "announcement" | "important") => setAiMessageType(value)}
                  >
                    <SelectTrigger id="ai-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Regular Message</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="important">Important</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="ai-creativity">Creativity</Label>
                    <span className="text-xs text-gray-500">{aiCreativity}%</span>
                  </div>
                  <Slider 
                    id="ai-creativity"
                    value={aiCreativity} 
                    onValueChange={setAiCreativity} 
                    min={0} 
                    max={100} 
                    step={10} 
                  />
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={generateFullAIMessage}
                    disabled={!aiPrompt.trim() || isGeneratingAI}
                    className="gap-2"
                  >
                    {isGeneratingAI ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-opacity-20 border-t-white"></div>
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    Generate
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleAIAssist}
            disabled={isGeneratingAI || !newMessage.trim()}
            className="text-xs gap-1"
          >
            <Sparkles className="h-3 w-3" />
            AI Improve
          </Button>
        </div>
      </div>
    </div>
  );
}
