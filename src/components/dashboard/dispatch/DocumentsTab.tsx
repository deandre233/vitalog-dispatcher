import { FileText } from "lucide-react";
import { TransportRecord } from "@/hooks/useTransportRecord";

interface DocumentsTabProps {
  transportRecord: TransportRecord;
}

export function DocumentsTab({ transportRecord }: DocumentsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-gray-500" />
        <span className="font-medium">Documents</span>
      </div>
      <div className="pl-7">
        <p className="text-gray-500">No documents uploaded yet.</p>
      </div>
    </div>
  );
}