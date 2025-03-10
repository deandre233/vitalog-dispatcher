
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TeamMessage, TeamMember } from "@/types/ai";
import { RawTeamMessage } from "./messageTypes";

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
      const enhancedMessages: TeamMessage[] = data.map((msg: RawTeamMessage) => {
        const sender = teamMembers.find(m => m.id === msg.sender_id);
        return {
          id: msg.id,
          senderId: msg.sender_id,
          channelId: msg.channel_id,
          message: msg.message,
          isImportant: msg.is_important,
          isAnnouncement: msg.is_announcement || false,
          createdAt: msg.created_at,
          sender_name: msg.sender_name || sender?.name,
          sender_avatar: sender?.avatar,
          reactions: msg.reactions || []
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
  isImportant: boolean,
  isAnnouncement: boolean = false
) => {
  if (!message.trim()) return false;
  
  try {
    const { error } = await supabase
      .from('team_messages')
      .insert({
        sender_id: employeeId,
        channel_id: channel,
        message: message,
        is_important: isImportant,
        is_announcement: isAnnouncement
      });
      
    if (error) throw error;
    
    // If message is marked important, show toast notification
    if (isImportant) {
      toast({
        title: "Team notification created",
        description: "Your important message will be sent as notifications",
      });
    }
    
    if (isAnnouncement) {
      toast({
        title: "Announcement created",
        description: "Your announcement has been sent to the team",
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

// Helper function to suggest AI responses based on message content
export const suggestAIResponse = (message: string): string => {
  // This is a simplified version - in production this would call an API
  if (message.toLowerCase().includes('meeting')) {
    return `I'll be there! Thanks for the meeting invite.`;
  } else if (message.toLowerCase().includes('update') || message.toLowerCase().includes('status')) {
    return `Thanks for the update. I'll review this information.`;
  } else if (message.toLowerCase().includes('help') || message.toLowerCase().includes('assist')) {
    return `I'd be happy to help with this. Let me know what you need.`;
  } else {
    return `Thank you for your message. I'll respond as soon as possible.`;
  }
};
