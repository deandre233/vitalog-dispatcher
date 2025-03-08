
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type UseFormRegister } from "react-hook-form";
import { type DispatchFormData } from "@/types/dispatch";

interface NotesSectionProps {
  register: UseFormRegister<DispatchFormData>;
}

export function NotesSection({ register }: NotesSectionProps) {
  return (
    <Card className="p-6 border-l-4 border-l-[#6E59A5] bg-gradient-to-br from-white to-[#F1F0FB] shadow-lg hover:shadow-xl transition-all duration-300">
      <h3 className="text-lg font-semibold mb-4 text-[#6E59A5]">Notes</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Dispatcher Notes</Label>
          <Textarea 
            {...register("dispatcher_notes")}
            className="min-h-[100px] border-medical-secondary/30 focus:border-medical-secondary"
            placeholder="Notes for dispatch team..."
          />
        </div>
        <div className="space-y-2">
          <Label>Billing Notes</Label>
          <Textarea 
            {...register("billing_notes")}
            className="min-h-[100px] border-medical-secondary/30 focus:border-medical-secondary"
            placeholder="Notes for billing department..."
          />
        </div>
      </div>
    </Card>
  );
}
