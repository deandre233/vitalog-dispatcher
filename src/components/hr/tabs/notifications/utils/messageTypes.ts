
// Shared types for messages
import { TeamMessage, TeamMember } from "@/types/ai";

// Define interface for raw database team message response
export interface RawTeamMessage {
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
