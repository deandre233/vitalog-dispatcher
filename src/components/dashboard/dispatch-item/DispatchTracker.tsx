
import { Button } from "@/components/ui/button";
import { Truck } from "lucide-react";

interface DispatchTrackerProps {
  handleTrackTransport: () => void;
}

export function DispatchTracker({ handleTrackTransport }: DispatchTrackerProps) {
  return (
    <div className="flex justify-end">
      <Button
        variant="outline"
        size="sm"
        onClick={handleTrackTransport}
        className="flex items-center gap-1"
      >
        <Truck className="h-4 w-4" />
        Track Transport
      </Button>
    </div>
  );
}
