
import { Badge } from "@/components/ui/badge";
import { channelOptions } from "../utils/teamMessagingUtils";

interface ChannelSelectorProps {
  channel: string;
  onChange: (channel: string) => void;
}

export function ChannelSelector({ channel, onChange }: ChannelSelectorProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-2">
        <h3 className="text-lg font-semibold">Team Chat</h3>
        <Badge variant="outline">{channelOptions.find(c => c.id === channel)?.name || channel}</Badge>
      </div>
      
      <select
        className="px-2 py-1 text-sm border rounded-md"
        value={channel}
        onChange={(e) => onChange(e.target.value)}
      >
        {channelOptions.map((ch) => (
          <option key={ch.id} value={ch.id}>
            {ch.name}
          </option>
        ))}
      </select>
    </div>
  );
}
