
import { TeamChatContainer } from "./team-chat/TeamChatContainer";
import { Message, Channel } from "./team-chat/types";

interface TeamChatViewProps {
  messages: Message[];
  channels: Channel[];
  searchQuery: string;
  onNewMessage: (recipientNames: string[], message: string) => void;
}

export function TeamChatView({
  messages,
  channels,
  searchQuery,
  onNewMessage
}: TeamChatViewProps) {
  return (
    <TeamChatContainer 
      messages={messages}
      channels={channels}
      searchQuery={searchQuery}
      onNewMessage={onNewMessage}
    />
  );
}
