
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { TeamMessage, TeamMember } from "@/types/ai";
import { ChannelSelector } from "./components/ChannelSelector";
import { MessageList } from "./components/MessageList";
import { MessageInput } from "./components/MessageInput";
import { fetchTeamMessages, setupRealtimeSubscription } from "./utils/teamMessagingUtils";

interface TeamMessagingProps {
  employeeId: string;
  teamMembers?: TeamMember[];
}

export function TeamMessaging({ employeeId, teamMembers = [] }: TeamMessagingProps) {
  const [messages, setMessages] = useState<TeamMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [channel, setChannel] = useState("general");

  useEffect(() => {
    loadMessages();
    
    // Set up real-time subscription
    const teamChannel = setupRealtimeSubscription(channel, teamMembers, (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
    });
      
    return () => {
      supabase.removeChannel(teamChannel);
    };
  }, [employeeId, channel, teamMembers]);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const fetchedMessages = await fetchTeamMessages(channel, teamMembers);
      setMessages(fetchedMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChannelChange = (newChannel: string) => {
    setChannel(newChannel);
  };

  return (
    <div className="flex flex-col h-full">
      <ChannelSelector channel={channel} onChange={handleChannelChange} />
      
      <Card className="flex-1 p-4 mb-4 bg-gray-50">
        <MessageList 
          messages={messages} 
          employeeId={employeeId} 
          isLoading={isLoading} 
        />
      </Card>
      
      <MessageInput 
        employeeId={employeeId} 
        channel={channel} 
        onMessageSent={loadMessages}
      />
    </div>
  );
}
