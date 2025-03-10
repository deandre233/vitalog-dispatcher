
export interface Message {
  id: string;
  channel: string;
  sender: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  read: boolean;
  participants: string[];
}

export interface Channel {
  id: string;
  name: string;
  type: string;
  unread: number;
}
