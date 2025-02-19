
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";

interface AddNoteSheetProps {
  dispatchId: string | null;
  onClose: () => void;
}

export function AddNoteSheet({ dispatchId, onClose }: AddNoteSheetProps) {
  if (!dispatchId) return null;

  return (
    <Sheet open={!!dispatchId} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Note to Dispatch #{dispatchId}</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <textarea
            className="w-full min-h-[200px] p-4 rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Dispatch notes are NOT shown to the crew,&#13;&#10;and are NOT preserved on recurring trips.&#13;&#10;Lines beginning with ! will print as comments in the customer invoice."
            maxLength={4000}
          />
        </div>
        <SheetFooter className="mt-4">
          <Button onClick={onClose}>Save Note</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
