
import { useRef, useEffect, useState } from "react";
import { AlertTriangle, Bell, ThumbsUp, SmilePlus, Star, Reply, Bot, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { TeamMessage } from "@/types/ai";
import { addReactionToMessage, suggestAIResponse } from "../utils/teamMessagingUtils";
import { toast } from "@/hooks/use-toast";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface MessageListProps {
  messages: TeamMessage[];
  employeeId: string;
  isLoading: boolean;
}

export function MessageList({ messages, employeeId, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showReactionOptions, setShowReactionOptions] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-center text-gray-500">
        <div>
          <p>No messages yet</p>
          <p className="text-sm">Be the first to send a message in this channel</p>
        </div>
      </div>
    );
  }

  const handleAddReaction = async (messageId: string, reaction: string) => {
    const success = await addReactionToMessage(messageId, reaction);
    if (success) {
      toast({
        title: "Reaction added",
        description: "Your reaction has been added to the message",
      });
    }
    setShowReactionOptions(null);
  };

  const handleQuickReply = (message: TeamMessage) => {
    const suggestedResponse = suggestAIResponse(message.message);
    
    // Copy the suggested response to clipboard
    navigator.clipboard.writeText(suggestedResponse);
    
    toast({
      title: "AI Response Generated",
      description: "Suggested reply copied to clipboard",
    });
  };
  
  // Get time format for message timestamp
  const getMessageTime = (createdAt: string) => {
    const messageDate = new Date(createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // If the message is from today, only show the time
    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If the message is from yesterday, show "Yesterday" and the time
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise, show the date and time
    return messageDate.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric' 
    }) + ', ' + messageDate.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.senderId === employeeId ? "justify-end" : "justify-start"
            }`}
          >
            {msg.senderId !== employeeId && (
              <Avatar className="h-8 w-8">
                {msg.sender_avatar && <AvatarImage src={msg.sender_avatar} alt={msg.sender_name || "Team member"} />}
                <AvatarFallback>{(msg.sender_name || "?")[0]}</AvatarFallback>
              </Avatar>
            )}
            
            <div className="flex flex-col max-w-[80%]">
              <div
                className={`rounded-lg px-4 py-2 ${
                  msg.senderId === employeeId
                    ? msg.isAnnouncement 
                      ? "bg-amber-500 text-white"
                      : msg.isImportant
                        ? "bg-red-500 text-white" 
                        : "bg-blue-500 text-white"
                    : msg.isAnnouncement
                      ? "bg-amber-100 border border-amber-300"
                      : msg.isImportant
                        ? "bg-red-100 border border-red-300"
                        : "bg-white border"
                }`}
              >
                {msg.senderId !== employeeId && msg.sender_name && (
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-medium">{msg.sender_name}</p>
                    {msg.isAnnouncement && <Badge variant="outline" className="text-[10px] py-0 px-1 bg-amber-50">Announcement</Badge>}
                    {msg.isImportant && !msg.isAnnouncement && <Badge variant="outline" className="text-[10px] py-0 px-1 bg-red-50">Important</Badge>}
                  </div>
                )}
                <div className="flex items-start gap-2">
                  {msg.isImportant && !msg.isAnnouncement && (
                    <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-1" />
                  )}
                  {msg.isAnnouncement && (
                    <Bell className="h-4 w-4 text-amber-500 flex-shrink-0 mt-1" />
                  )}
                  <p className="text-sm break-words">{msg.message}</p>
                </div>
                <p
                  className={`text-xs mt-1 ${
                    msg.senderId === employeeId 
                      ? msg.isAnnouncement
                        ? "text-amber-100"
                        : msg.isImportant
                          ? "text-red-100"
                          : "text-blue-100" 
                      : "text-gray-400"
                  }`}
                >
                  {getMessageTime(msg.createdAt)}
                </p>
              </div>
              
              {/* Reactions */}
              {msg.reactions && msg.reactions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {msg.reactions.map((reaction, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="bg-gray-100 hover:bg-gray-200 transition-colors text-xs px-1.5 py-0.5 rounded-full">
                            {reaction}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Click to add your reaction</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              )}
              
              {/* Quick actions */}
              <div className={`flex gap-2 mt-1 ${msg.senderId === employeeId ? "justify-end" : "justify-start"}`}>
                {msg.senderId !== employeeId && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-1.5 text-xs text-gray-500 gap-1"
                          onClick={() => handleQuickReply(msg)}
                        >
                          <Bot className="h-3 w-3" />
                          AI Reply
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Generate an AI response</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-1.5 text-xs text-gray-500 gap-1"
                        onClick={() => setReplyingTo(replyingTo === msg.id ? null : msg.id)}
                      >
                        <Reply className="h-3 w-3" />
                        Reply
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Reply to this message</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-1.5 text-xs text-gray-500 gap-1"
                        onClick={() => setShowReactionOptions(showReactionOptions === msg.id ? null : msg.id)}
                      >
                        <SmilePlus className="h-3 w-3" />
                        React
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Add a reaction</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              {/* Reaction options */}
              {showReactionOptions === msg.id && (
                <div className={`flex gap-2 mt-1 p-1 bg-gray-50 rounded-lg ${msg.senderId === employeeId ? "justify-end" : "justify-start"}`}>
                  {["👍", "❤️", "😂", "👏", "🙌", "🎉", "🔥", "💯"].map((reaction) => (
                    <button
                      key={reaction}
                      className="hover:bg-gray-200 rounded p-1 transition-colors"
                      onClick={() => handleAddReaction(msg.id, reaction)}
                    >
                      {reaction}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Reply interface */}
              {replyingTo === msg.id && (
                <div className="mt-2 pl-2 border-l-2 border-gray-200">
                  <div className="flex items-end gap-2">
                    <Input 
                      placeholder="Type your reply..." 
                      className="flex-1 text-xs h-8"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setReplyingTo(null);
                          toast({
                            title: "Reply sent",
                            description: "Your reply has been sent",
                          });
                        }
                        if (e.key === "Escape") {
                          setReplyingTo(null);
                        }
                      }}
                    />
                    <Button 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        setReplyingTo(null);
                        toast({
                          title: "Reply sent",
                          description: "Your reply has been sent",
                        });
                      }}
                    >
                      <Send className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            {msg.senderId === employeeId && (
              <Avatar className="h-8 w-8">
                {msg.sender_avatar && <AvatarImage src={msg.sender_avatar} alt="You" />}
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
