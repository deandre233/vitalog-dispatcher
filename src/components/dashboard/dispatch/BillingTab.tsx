import { DollarSign, AlertCircle } from "lucide-react";
import { TransportRecord } from "@/hooks/useTransportRecord";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BillingTabProps {
  transportRecord: TransportRecord | null;
}

export function BillingTab({ transportRecord }: BillingTabProps) {
  const { toast } = useToast();

  console.log("BillingTab render - transportRecord:", transportRecord);

  if (!transportRecord) {
    console.warn("BillingTab: No transport record provided");
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No transport record found. This could be due to an invalid ID or missing data.
          </AlertDescription>
        </Alert>
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-gray-500" />
          <span className="font-medium">Billing Information</span>
        </div>
        <div className="pl-7">
          <p className="text-gray-500">Please ensure a valid transport record is selected.</p>
        </div>
      </div>
    );
  }

  // Debug log for billing information
  console.log("BillingTab: Processing transport record", {
    id: transportRecord.id,
    dispatch_id: transportRecord.dispatch_id,
    billing_notes: transportRecord.billing_notes,
    status: transportRecord.status
  });

  try {
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
  } catch (error) {
    console.error("Error rendering BillingTab:", error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to display billing information. Please try again.",
    });
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          An error occurred while displaying billing information.
        </AlertDescription>
      </Alert>
    );
  }
}