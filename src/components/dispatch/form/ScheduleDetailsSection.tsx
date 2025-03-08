
import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { type UseFormRegister, type UseFormWatch, type UseFormSetValue } from "react-hook-form";
import { type DispatchFormData } from "@/types/dispatch";
import { TimeSlotVisualization } from "./TimeSlotVisualization";

interface ScheduleDetailsSectionProps {
  register: UseFormRegister<DispatchFormData>;
  watch: UseFormWatch<DispatchFormData>;
  setValue: UseFormSetValue<DispatchFormData>;
}

export function ScheduleDetailsSection({ 
  register, 
  watch, 
  setValue 
}: ScheduleDetailsSectionProps) {
  return (
    <Card className="p-6 border-l-4 border-l-[#0FA0CE] bg-gradient-to-br from-white to-[#D3E4FD] shadow-lg hover:shadow-xl transition-all duration-300">
      <h3 className="text-lg font-semibold mb-4 text-[#0FA0CE] flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Schedule Details
      </h3>
      <div className="space-y-6">
        {/* Activation Time */}
        <div className="space-y-2">
          <Label>Activate</Label>
          <div className="flex items-center gap-4">
            <RadioGroup
              value={watch('activation_type') || 'now'}
              onValueChange={(value: "now" | "later") => setValue('activation_type', value)}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="now" id="activate-now" />
                <Label htmlFor="activate-now">Now</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="later" id="activate-later" />
                <Label htmlFor="activate-later">Later</Label>
              </div>
            </RadioGroup>
            
            <Input
              type="datetime-local"
              className="flex-1 border-medical-secondary/30 focus:border-medical-secondary"
              disabled={watch('activation_type') !== 'later'}
              {...register('activation_datetime')}
            />
          </div>
        </div>

        {/* Pickup Time */}
        <div className="space-y-2">
          <Label>Pickup</Label>
          <div className="flex items-center gap-4">
            <RadioGroup
              value={watch('pickup_type') || 'asap'}
              onValueChange={(value: "asap" | "scheduled") => setValue('pickup_type', value)}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="asap" id="pickup-asap" />
                <Label htmlFor="pickup-asap">ASAP</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="scheduled" id="pickup-scheduled" />
                <Label htmlFor="pickup-scheduled">At</Label>
              </div>
            </RadioGroup>
            
            <div className="flex items-center gap-2 flex-1">
              <Input
                type="time"
                className="flex-1 border-medical-secondary/30 focus:border-medical-secondary"
                disabled={watch('pickup_type') !== 'scheduled'}
                {...register('pickup_time')}
              />
              <Checkbox
                id="precise-pickup"
                className="border-medical-secondary/30"
                {...register('precise_pickup')}
              />
              <Label htmlFor="precise-pickup" className="text-sm">Precise</Label>
            </div>
          </div>
        </div>

        {/* Dropoff Time */}
        <div className="space-y-2">
          <Label>Dropoff</Label>
          <div className="flex items-center gap-4">
            <RadioGroup
              value={watch('dropoff_type') || 'asap'}
              onValueChange={(value: "asap" | "scheduled") => setValue('dropoff_type', value)}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="asap" id="dropoff-asap" />
                <Label htmlFor="dropoff-asap">ASAP</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="scheduled" id="dropoff-scheduled" />
                <Label htmlFor="dropoff-scheduled">At</Label>
              </div>
            </RadioGroup>
            
            <Input
              type="time"
              className="flex-1 border-medical-secondary/30 focus:border-medical-secondary"
              disabled={watch('dropoff_type') !== 'scheduled'}
              {...register('dropoff_time')}
            />
          </div>
        </div>

        {/* Trip Type */}
        <div className="space-y-2">
          <Label>Trip Type</Label>
          <RadioGroup
            value={watch('trip_type') || 'One way'}
            onValueChange={(value: "One way" | "Wait-and-return" | "Round trip") => setValue('trip_type', value)}
            className="flex items-center space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="One way" id="one-way" />
              <Label htmlFor="one-way">One Way</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Wait-and-return" id="wait-return" />
              <Label htmlFor="wait-return">Wait & Return</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Round trip" id="round-trip" />
              <Label htmlFor="round-trip">Round Trip</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Time Slot Visualization */}
        <TimeSlotVisualization />
      </div>
    </Card>
  );
}
