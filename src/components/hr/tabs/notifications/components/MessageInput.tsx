
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { sendTeamMessage } from "../utils/teamMessagingUtils";

interface MessageInputProps {
  employeeId: string;
  channel: string;
  onMessageSent: () => void;
}

export function MessageInput({ employeeId, channel, onMessageSent }: MessageInputProps) {
  const [newMessage, setNewMessage] = useState("");
  const [isImportant, setIsImportant] = useState(false);

  const handleSendMessage = async () => {
    const success = await sendTeamMessage(employeeId, channel, newMessage, isImportant);
    if (success) {
      setNewMessage("");
      setIsImportant(false);
      onMessageSent();
    }
  };

  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <Input
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          className="w-full"
        />
        <div className="flex items-center mt-2">
          <Switch 
            id="important-toggle"
            checked={isImportant}
            onCheckedChange={setIsImportant}
          />
          <Label htmlFor="important-toggle" className="ml-2 text-sm">
            Mark as important (will notify team)
          </Label>
        </div>
      </div>
      <Button onClick={handleSendMessage} type="submit" size="icon">
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}
