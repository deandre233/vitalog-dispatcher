import { Receipt } from "lucide-react";
import { TransportRecord } from "@/hooks/useTransportRecord";

interface InvoicesTabProps {
  transportRecord: TransportRecord;
}

export function InvoicesTab({ transportRecord }: InvoicesTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Receipt className="w-5 h-5 text-gray-500" />
        <span className="font-medium">Invoices</span>
      </div>
      <div className="pl-7">
        <p className="text-gray-500">No invoices available.</p>
      </div>
    </div>
  );
}