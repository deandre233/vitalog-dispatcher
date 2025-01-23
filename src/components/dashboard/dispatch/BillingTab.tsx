import { DollarSign } from "lucide-react";
import { TransportRecord } from "@/hooks/useTransportRecord";

interface BillingTabProps {
  transportRecord: TransportRecord;
}

export function BillingTab({ transportRecord }: BillingTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-gray-500" />
        <span className="font-medium">Billing Information</span>
      </div>
      <div className="pl-7">
        <p className="text-gray-500">Billing information will be displayed here.</p>
      </div>
    </div>
  );
}