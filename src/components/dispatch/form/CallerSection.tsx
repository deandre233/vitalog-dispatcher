
import { UserCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { type UseFormRegister } from "react-hook-form";
import { type DispatchFormData } from "@/types/dispatch";

interface CallerSectionProps {
  register: UseFormRegister<DispatchFormData>;
}

export function CallerSection({ register }: CallerSectionProps) {
  return (
    <Card className="p-6 border-l-4 border-l-[#9b87f5] bg-gradient-to-br from-white to-[#F1F0FB] shadow-lg hover:shadow-xl transition-all duration-300">
      <h3 className="text-lg font-semibold mb-4 text-[#7E69AB] flex items-center gap-2">
        <UserCircle2 className="w-5 h-5" />
        Caller Information
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="caller_name">Caller Name</Label>
            <Input
              id="caller_name"
              className="border-medical-secondary/30 focus:border-medical-secondary"
              {...register("caller_name", { required: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="caller_phone">Phone</Label>
            <Input
              id="caller_phone"
              className="border-medical-secondary/30 focus:border-medical-secondary"
              placeholder="###-###-####"
              {...register("caller_phone", { required: true })}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
