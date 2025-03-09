
import { useState, useEffect, useRef } from "react";
import { Send, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface TeamMessage {
  id: string;
  sender_id: string;
  channel_id: string;
  message: string;
  is_important: boolean;
  created_at: string;
  sender_name?: string;
  sender_avatar?: string;
}

interface TeamMessagingProps {
  employeeId: string;
  teamMembers?: { id: string; name: string; avatar?: string }[];
}

export function TeamMessaging({ employeeId, teamMembers = [] }: TeamMessagingProps) {
  const [messages, setMessages] = useState<TeamMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [channel, setChannel] = useState("general");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Channel options - could be expanded based on organization structure
  const channelOptions = [
    { id: "general", name: "General" },
    { id: "announcements", name: "Announcements" },
    { id: "emergencies", name: "Emergencies" },
    { id: "dispatchers", name: "Dispatchers" },
    { id: "field-crew", name: "Field Crew" },
  ];

  useEffect(() => {
    fetchMessages();
    
    // Set up real-time subscription
    const teamChannel = supabase
      .channel('team-messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'team_messages',
        filter: `channel_id=eq.${channel}`
      }, (payload) => {
        const newMessage = payload.new as TeamMessage;
        
        // Find sender info if available
        const sender = teamMembers.find(m => m.id === newMessage.sender_id);
        if (sender) {
          newMessage.sender_name = sender.name;
          newMessage.sender_avatar = sender.avatar;
        }
        
        setMessages(prev => [...prev, newMessage]);
        
        // Show notification if it's important
        if (newMessage.is_important) {
          toast({
            title: "Important Team Message",
            description: newMessage.message,
            variant: "destructive",
          });
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(teamChannel);
    };
  }, [employeeId, channel, teamMembers]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      // Get recent messages for this channel
      const { data, error } = await supabase
        .from('team_messages')
        .select('*')
        .eq('channel_id', channel)
        .order('created_at', { ascending: true })
        .limit(50);
        
      if (error) throw error;
      
      if (data) {
        // Enhance messages with sender info where available
        const enhancedMessages = data.map(msg => {
          const sender = teamMembers.find(m => m.id === msg.sender_id);
          return {
            ...msg,
            sender_name: sender?.name,
            sender_avatar: sender?.avatar
          };
        });
        setMessages(enhancedMessages);
      }
    } catch (error) {
      console.error("Error fetching team messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      const { error } = await supabase
        .from('team_messages')
        .insert({
          sender_id: employeeId,
          channel_id: channel,
          message: newMessage,
          is_important: isImportant
        });
        
      if (error) throw error;
      
      // Clear the input
      setNewMessage("");
      setIsImportant(false);
      
      // If message is marked important, create notifications for team
      if (isImportant) {
        // This would typically be handled by a server-side function
        // but for demo purposes we'll do it client-side
        toast({
          title: "Team notification created",
          description: "Your important message will be sent as notifications",
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error sending message",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold">Team Chat</h3>
          <Badge variant="outline">{channelOptions.find(c => c.id === channel)?.name || channel}</Badge>
        </div>
        
        <select
          className="px-2 py-1 text-sm border rounded-md"
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
        >
          {channelOptions.map((ch) => (
            <option key={ch.id} value={ch.id}>
              {ch.name}
            </option>
          ))}
        </select>
      </div>
      
      <Card className="flex-1 p-4 mb-4 bg-gray-50">
        <ScrollArea className="h-[400px] pr-4">
          {messages.length === 0 && !isLoading ? (
            <div className="flex items-center justify-center h-full text-center text-gray-500">
              <div>
                <p>No messages yet</p>
                <p className="text-sm">Be the first to send a message in this channel</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${
                    msg.sender_id === employeeId ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender_id !== employeeId && (
                    <Avatar className="h-8 w-8">
                      {msg.sender_avatar && <AvatarImage src={msg.sender_avatar} alt={msg.sender_name || "Team member"} />}
                      <AvatarFallback>{(msg.sender_name || "?")[0]}</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      msg.sender_id === employeeId
                        ? "bg-blue-500 text-white"
                        : "bg-white border"
                    }`}
                  >
                    {msg.sender_id !== employeeId && msg.sender_name && (
                      <p className="text-xs font-medium mb-1">{msg.sender_name}</p>
                    )}
                    <div className="flex items-start gap-2">
                      {msg.is_important && (
                        <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-1" />
                      )}
                      <p className="text-sm break-words">{msg.message}</p>
                    </div>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender_id === employeeId ? "text-blue-100" : "text-gray-400"
                      }`}
                    >
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  
                  {msg.sender_id === employeeId && (
                    <Avatar className="h-8 w-8">
                      {msg.sender_avatar && <AvatarImage src={msg.sender_avatar} alt="You" />}
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
      </Card>
      
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="w-full"
          />
          <div className="flex items-center mt-2">
            <Switch 
              id="important-toggle"
              checked={isImportant}
              onCheckedChange={setIsImportant}
            />
            <Label htmlFor="important-toggle" className="ml-2 text-sm">
              Mark as important (will notify team)
            </Label>
          </div>
        </div>
        <Button onClick={sendMessage} type="submit" size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
