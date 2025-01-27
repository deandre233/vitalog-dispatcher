import { UseFormRegister } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone } from "lucide-react";
import { type DispatchFormData } from "@/types/dispatch";

interface EmergencyContactSectionProps {
  register: UseFormRegister<DispatchFormData>;
}

export const EmergencyContactSection = ({ register }: EmergencyContactSectionProps) => {
  return (
    <Card className="p-6 border-l-4 border-l-[#FF4D4F] bg-gradient-to-br from-white to-[#FFF1F0] shadow-lg hover:shadow-xl transition-all duration-300">
      <h3 className="text-lg font-semibold mb-4 text-[#FF4D4F] flex items-center gap-2">
        <Phone className="w-5 h-5" />
        Emergency Contact
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
            <Input
              id="emergency_contact_name"
              className="border-medical-secondary/30 focus:border-medical-secondary"
              {...register("emergency_contact_name", { 
                required: "Emergency contact name is required",
                minLength: { value: 2, message: "Name must be at least 2 characters" }
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
            <Input
              id="emergency_contact_phone"
              className="border-medical-secondary/30 focus:border-medical-secondary"
              placeholder="###-###-####"
              {...register("emergency_contact_phone", {
                required: "Emergency contact phone is required",
                pattern: {
                  value: /^\d{3}-\d{3}-\d{4}$/,
                  message: "Phone must be in format ###-###-####"
                }
              })}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};