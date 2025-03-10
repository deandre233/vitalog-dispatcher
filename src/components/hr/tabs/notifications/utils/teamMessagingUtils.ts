
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TeamMessage, TeamMember } from "@/types/ai";

export const channelOptions = [
  { id: "general", name: "General" },
  { id: "announcements", name: "Announcements" },
  { id: "emergencies", name: "Emergencies" },
  { id: "dispatchers", name: "Dispatchers" },
  { id: "field-crew", name: "Field Crew" },
];

export const fetchTeamMessages = async (channel: string, teamMembers: TeamMember[] = []) => {
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
      return enhancedMessages;
    }
    return [];
  } catch (error) {
    console.error("Error fetching team messages:", error);
    return [];
  }
};

export const sendTeamMessage = async (
  employeeId: string, 
  channel: string, 
  message: string, 
  isImportant: boolean
) => {
  if (!message.trim()) return false;
  
  try {
    const { error } = await supabase
      .from('team_messages')
      .insert({
        sender_id: employeeId,
        channel_id: channel,
        message: message,
        is_important: isImportant
      });
      
    if (error) throw error;
    
    // If message is marked important, show toast notification
    if (isImportant) {
      toast({
        title: "Team notification created",
        description: "Your important message will be sent as notifications",
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error sending message:", error);
    toast({
      title: "Error sending message",
      description: "Please try again",
      variant: "destructive",
    });
    return false;
  }
};

export const setupRealtimeSubscription = (
  channel: string,
  teamMembers: TeamMember[],
  onNewMessage: (message: TeamMessage) => void
) => {
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
      const sender = teamMembers.find(m => m.id === newMessage.senderId);
      if (sender) {
        newMessage.sender_name = sender.name;
        newMessage.sender_avatar = sender.avatar;
      }
      
      onNewMessage(newMessage);
      
      // Show notification if it's important
      if (newMessage.isImportant) {
        toast({
          title: "Important Team Message",
          description: newMessage.message,
          variant: "destructive",
        });
      }
    })
    .subscribe();
    
  return teamChannel;
};
