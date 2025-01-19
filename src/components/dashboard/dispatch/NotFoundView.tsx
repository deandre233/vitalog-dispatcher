import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface NotFoundViewProps {
  id: string | undefined;
  onBack: () => void;
}

export function NotFoundView({ id, onBack }: NotFoundViewProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold text-red-600">
          Transport Record Not Found
        </h2>
      </div>
      <p className="text-gray-600">
        The transport record with dispatch ID #{id} could not be found.
      </p>
    </Card>
  );
}