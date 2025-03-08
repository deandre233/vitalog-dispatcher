
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { type UseFormRegister } from "react-hook-form";
import { type DispatchFormData } from "@/types/dispatch";

interface RequirementsSectionProps {
  register: UseFormRegister<DispatchFormData>;
}

export function RequirementsSection({ register }: RequirementsSectionProps) {
  return (
    <Card className="p-6 border-l-4 border-l-[#33C3F0] bg-gradient-to-br from-white to-[#F2FCE2] shadow-lg hover:shadow-xl transition-all duration-300">
      <h3 className="text-lg font-semibold mb-4 text-[#33C3F0]">Requirements & Warnings</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-medical-primary">Special Requirements</h4>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox {...register("requires_ekg")} id="ekg" />
              <Label htmlFor="ekg">EKG</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("requires_o2")} id="o2" />
              <Label htmlFor="o2">O2</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("requires_ventilator")} id="ventilator" />
              <Label htmlFor="ventilator">Ventilator</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("requires_isolation")} id="isolation" />
              <Label htmlFor="isolation">Isolation</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("requires_bariatric")} id="bariatric" />
              <Label htmlFor="bariatric">Bariatric</Label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-medical-primary">Patient Conditions</h4>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox {...register("breathing_problem")} id="breathing" />
              <Label htmlFor="breathing">Breathing Problem</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("confined_to_bed")} id="confined" />
              <Label htmlFor="confined">Confined to Bed</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("behavioral_illness")} id="behavioral" />
              <Label htmlFor="behavioral">Behavioral Illness</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("unstable_impaired")} id="unstable" />
              <Label htmlFor="unstable">Unstable/Impaired</Label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-medical-primary">Additional Warnings</h4>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox {...register("physically_impaired")} id="physical" />
              <Label htmlFor="physical">Physically Impaired</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("hearing_impaired")} id="hearing" />
              <Label htmlFor="hearing">Hearing Impaired</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("sight_impaired")} id="sight" />
              <Label htmlFor="sight">Sight Impaired</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("speech_impaired")} id="speech" />
              <Label htmlFor="speech">Speech Impaired</Label>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
