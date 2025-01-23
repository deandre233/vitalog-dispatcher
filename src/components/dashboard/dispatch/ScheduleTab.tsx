import { Clock } from "lucide-react";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TransportRecord } from "@/hooks/useTransportRecord";

interface ScheduleTabProps {
  transportRecord: TransportRecord;
  onUpdate: (updates: Partial<TransportRecord>) => void;
}

export function ScheduleTab({ transportRecord, onUpdate }: ScheduleTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-gray-500" />
        <span className="font-medium">Schedule</span>
      </div>
      <div className="pl-7 space-y-4">
        <div className="space-y-2">
          <Label>Transport Date</Label>
          <Input
            type="datetime-local"
            value={format(new Date(transportRecord?.transport_date || ''), "yyyy-MM-dd'T'HH:mm")}
            onChange={(e) => onUpdate({ transport_date: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Pickup Type</Label>
          <RadioGroup
            value={transportRecord?.pickup_type || 'asap'}
            onValueChange={(value) => onUpdate({ pickup_type: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="asap" id="pickup-asap" />
              <Label htmlFor="pickup-asap">ASAP</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="scheduled" id="pickup-scheduled" />
              <Label htmlFor="pickup-scheduled">Scheduled Time</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}