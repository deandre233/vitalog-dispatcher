import { Repeat } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TransportRecord } from "@/hooks/useTransportRecord";

interface RecurrenceTabProps {
  transportRecord: TransportRecord;
  onRecurrenceChange: (value: string) => void;
}

export function RecurrenceTab({ transportRecord, onRecurrenceChange }: RecurrenceTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Repeat className="w-5 h-5 text-gray-500" />
        <span className="font-medium">Recurrence</span>
      </div>
      <div className="pl-7 space-y-2">
        <RadioGroup
          value={transportRecord?.recurrence_type || 'none'}
          onValueChange={onRecurrenceChange}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="r1" />
            <Label htmlFor="r1">None</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="daily" id="r2" />
            <Label htmlFor="r2">Daily</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weekly" id="r3" />
            <Label htmlFor="r3">Weekly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="monthly" id="r4" />
            <Label htmlFor="r4">Monthly</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}