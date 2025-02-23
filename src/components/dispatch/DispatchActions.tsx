
import { Filter, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TransportRecord } from "@/types/dispatch";

interface DispatchActionsProps {
  dispatches: TransportRecord[];
}

export function DispatchActions({ dispatches }: DispatchActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline">
        <Filter className="mr-2 h-4 w-4" />
        Filters
      </Button>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="secondary">
            <Brain className="mr-2 h-4 w-4" />
            AI Insights
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>AI Dispatch Insights</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-secondary/50 rounded-lg">
              Active dispatches: {dispatches.filter(d => d.status === 'Active').length}
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg">
              Average response time: 12 minutes
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
