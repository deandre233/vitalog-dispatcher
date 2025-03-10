
import { supabase } from "@/integrations/supabase/client";
import { TeamMessage, TeamMember } from "@/types/ai";
import { toast } from "@/hooks/use-toast";
import { RawTeamMessage } from "./messageTypes";

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
      const newMessageData = payload.new as RawTeamMessage;
      
      // Convert to our TeamMessage type
      const newMessage: TeamMessage = {
        id: newMessageData.id,
        senderId: newMessageData.sender_id,
        channelId: newMessageData.channel_id,
        message: newMessageData.message,
        isImportant: newMessageData.is_important,
        isAnnouncement: newMessageData.is_announcement || false,
        createdAt: newMessageData.created_at,
        reactions: newMessageData.reactions || [],
        sender_name: newMessageData.sender_name || '',
      };
      
      // Find sender info if available
      const sender = teamMembers.find(m => m.id === newMessage.senderId);
      if (sender) {
        newMessage.sender_name = newMessageData.sender_name || sender.name;
        newMessage.sender_avatar = sender.avatar;
      }
      
      onNewMessage(newMessage);
      
      // Show notification based on message type
      if (newMessage.isAnnouncement) {
        toast({
          title: "📢 Team Announcement",
          description: newMessage.message,
          variant: "default",
        });
      } else if (newMessage.isImportant) {
        toast({
          title: "⚠️ Important Team Message",
          description: newMessage.message,
          variant: "destructive",
        });
      }
    })
    .subscribe();
    
  return teamChannel;
};
