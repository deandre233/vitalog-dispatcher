
import { useRef, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TeamMessage } from "@/types/ai";

interface MessageListProps {
  messages: TeamMessage[];
  employeeId: string;
  isLoading: boolean;
}

export function MessageList({ messages, employeeId, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-center text-gray-500">
        <div>
          <p>No messages yet</p>
          <p className="text-sm">Be the first to send a message in this channel</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.senderId === employeeId ? "justify-end" : "justify-start"
            }`}
          >
            {msg.senderId !== employeeId && (
              <Avatar className="h-8 w-8">
                {msg.sender_avatar && <AvatarImage src={msg.sender_avatar} alt={msg.sender_name || "Team member"} />}
                <AvatarFallback>{(msg.sender_name || "?")[0]}</AvatarFallback>
              </Avatar>
            )}
            
            <div
              className={`rounded-lg px-4 py-2 max-w-[80%] ${
                msg.senderId === employeeId
                  ? "bg-blue-500 text-white"
                  : "bg-white border"
              }`}
            >
              {msg.senderId !== employeeId && msg.sender_name && (
                <p className="text-xs font-medium mb-1">{msg.sender_name}</p>
              )}
              <div className="flex items-start gap-2">
                {msg.isImportant && (
                  <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-1" />
                )}
                <p className="text-sm break-words">{msg.message}</p>
              </div>
              <p
                className={`text-xs mt-1 ${
                  msg.senderId === employeeId ? "text-blue-100" : "text-gray-400"
                }`}
              >
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            
            {msg.senderId === employeeId && (
              <Avatar className="h-8 w-8">
                {msg.sender_avatar && <AvatarImage src={msg.sender_avatar} alt="You" />}
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
