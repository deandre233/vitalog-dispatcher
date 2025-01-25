import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DispatchHeader() {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <h1 className="text-2xl font-semibold">Dispatch Control</h1>
      <div className="flex items-center gap-4">
        <Button variant="outline" className="text-sm">
          Enter Unattended Mode
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}