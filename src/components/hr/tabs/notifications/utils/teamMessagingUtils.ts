
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

// Define interface for raw database team message response
interface RawTeamMessage {
  id: string;
  sender_id: string;
  channel_id: string;
  message: string;
  is_important: boolean;
  is_announcement?: boolean;
  created_at: string;
  updated_at: string;
  sender_name?: string;
  reactions?: string[];
}

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

export const addReactionToMessage = async (messageId: string, reaction: string) => {
  try {
    // First get the current message to check existing reactions
    const { data: currentMessage, error: fetchError } = await supabase
      .from('team_messages')
      .select('*')
      .eq('id', messageId)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Update the reactions array
    const currentReactions = (currentMessage as RawTeamMessage)?.reactions || [];
    const newReactions = [...currentReactions, reaction];
    
    // Update the message with new reactions
    const { error: updateError } = await supabase
      .from('team_messages')
      .update({ reactions: newReactions })
      .eq('id', messageId);
      
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error("Error adding reaction:", error);
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

// Enhanced AI message generation feature
export const generateAIMessage = async (
  prompt: string, 
  messageType: 'regular' | 'announcement' | 'important' = 'regular',
  tone: 'professional' | 'friendly' | 'urgent' = 'professional'
): Promise<string> => {
  // This is a client-side AI message generation
  // In a production app, this would call a server-side function
  
  // Define tone modifiers
  const toneModifiers = {
    professional: [
      "We would like to inform you that",
      "Please be advised that",
      "We are writing to notify you that",
      "This message is to confirm that",
      "We are pleased to announce that"
    ],
    friendly: [
      "Just wanted to let you know that",
      "Hey team! FYI,",
      "Quick update for everyone:",
      "Hello everyone! I wanted to share that",
      "Good news, team!"
    ],
    urgent: [
      "URGENT:",
      "ATTENTION REQUIRED:",
      "IMMEDIATE ACTION NEEDED:",
      "PRIORITY UPDATE:",
      "CRITICAL INFORMATION:"
    ]
  };
  
  // Define message type templates
  const messageTemplates = {
    regular: "{tone} {prompt}. Please let me know if you have any questions.",
    announcement: "📢 ANNOUNCEMENT: {tone} {prompt}. Thank you for your attention.",
    important: "⚠️ IMPORTANT: {tone} {prompt}. Please acknowledge receipt of this message."
  };
  
  try {
    // Simple client-side generation (would be replaced by AI API in production)
    // Pick a random tone modifier
    const toneArray = toneModifiers[tone];
    const selectedTone = toneArray[Math.floor(Math.random() * toneArray.length)];
    
    // Get the template for the message type
    const template = messageTemplates[messageType];
    
    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Format the message
    let aiMessage = template
      .replace('{tone}', selectedTone)
      .replace('{prompt}', prompt);
      
    // Add contextual elements based on prompt content
    if (prompt.toLowerCase().includes('meeting')) {
      aiMessage += " Please ensure you add this to your calendar.";
    } else if (prompt.toLowerCase().includes('deadline')) {
      aiMessage += " This timeline is non-negotiable.";
    } else if (prompt.toLowerCase().includes('congratulation')) {
      aiMessage += " 🎉 This is a tremendous achievement!";
    }
    
    return aiMessage;
    
  } catch (error) {
    console.error("Error generating AI message:", error);
    return `${prompt} (AI enhancement failed)`;
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
