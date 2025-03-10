
import { supabase } from "@/integrations/supabase/client";
import { RawTeamMessage } from "./messageTypes";

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
    // We need to use type assertion here to tell TypeScript this property exists
    const { error: updateError } = await supabase
      .from('team_messages')
      .update({ 
        reactions: newReactions 
      } as Partial<RawTeamMessage>)
      .eq('id', messageId);
      
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error("Error adding reaction:", error);
    return false;
  }
};
