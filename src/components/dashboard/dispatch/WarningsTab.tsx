import { AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { TransportRecord } from "@/hooks/useTransportRecord";

interface WarningsTabProps {
  transportRecord: TransportRecord;
  onWarningToggle: (warning: string) => void;
}

export function WarningsTab({ transportRecord, onWarningToggle }: WarningsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-gray-500" />
        <span className="font-medium">Warnings</span>
      </div>
      <div className="pl-7 space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="warning-oxygen"
            checked={transportRecord?.warnings?.includes('oxygen')}
            onCheckedChange={() => onWarningToggle('oxygen')}
          />
          <label htmlFor="warning-oxygen">
            Breathing problem: Requires oxygen
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="warning-movement"
            checked={transportRecord?.warnings?.includes('movement')}
            onCheckedChange={() => onWarningToggle('movement')}
          />
          <label htmlFor="warning-movement">
            Impaired movement
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="warning-isolation"
            checked={transportRecord?.warnings?.includes('isolation')}
            onCheckedChange={() => onWarningToggle('isolation')}
          />
          <label htmlFor="warning-isolation">
            Requires isolation
          </label>
        </div>
      </div>
    </div>
  );
}