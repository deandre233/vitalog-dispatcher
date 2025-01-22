import { DollarSign } from "lucide-react";
import { TransportRecord } from "@/hooks/useTransportRecord";
import { useToast } from "@/components/ui/use-toast";

interface BillingTabProps {
  transportRecord: TransportRecord;
}

export function BillingTab({ transportRecord }: BillingTabProps) {
  const { toast } = useToast();

  if (!transportRecord) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-gray-500" />
          <span className="font-medium">Billing Information</span>
        </div>
        <div className="pl-7">
          <p className="text-gray-500">No transport record found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-gray-500" />
        <span className="font-medium">Billing Information</span>
      </div>
      <div className="pl-7">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-500">Transport ID:</span>
            <p className="font-medium">{transportRecord.dispatch_id}</p>
          </div>
          {transportRecord.billing_notes && (
            <div>
              <span className="text-sm text-gray-500">Billing Notes:</span>
              <p className="font-medium">{transportRecord.billing_notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}