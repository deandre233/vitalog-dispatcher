import { BookOpen } from "lucide-react";
import { TransportRecord } from "@/hooks/useTransportRecord";

interface JournalsTabProps {
  transportRecord: TransportRecord;
}

export function JournalsTab({ transportRecord }: JournalsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-gray-500" />
        <span className="font-medium">Journals</span>
      </div>
      <div className="pl-7">
        <p className="text-gray-500">No journal entries yet.</p>
      </div>
    </div>
  );
}