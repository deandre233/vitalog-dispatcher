
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type UseFormRegister, type UseFormWatch } from "react-hook-form";
import { type DispatchFormData } from "@/types/dispatch";

interface LocationSectionProps {
  type: 'origin' | 'destination';
  register: UseFormRegister<DispatchFormData>;
  watch: UseFormWatch<DispatchFormData>;
  handleSaveFacility: (type: 'origin' | 'destination') => void;
  inputRef?: React.RefCallback<HTMLInputElement>;
}

export function LocationSection({ 
  type, 
  register, 
  watch, 
  handleSaveFacility,
  inputRef 
}: LocationSectionProps) {
  const isOrigin = type === 'origin';
  const title = isOrigin ? 'Origin Location' : 'Destination Location';
  const colorClass = isOrigin ? '[#0EA5E9]' : '[#F97316]';
  const bgGradient = isOrigin ? 'from-white to-[#D3E4FD]' : 'from-white to-[#FEC6A1]';
  const borderColor = isOrigin ? 'border-l-[#0EA5E9]' : 'border-l-[#F97316]';
  
  return (
    <Card className={`p-6 border-l-4 ${borderColor} bg-gradient-to-br ${bgGradient} shadow-lg hover:shadow-xl transition-all duration-300`}>
      <h3 className={`text-lg font-semibold mb-4 text-${colorClass} flex items-center gap-2`}>
        <MapPin className="w-5 h-5" />
        {title}
      </h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Location Name</Label>
          <Input 
            id={isOrigin ? "pickup_location" : "dropoff_location"}
            {...register(isOrigin ? "pickup_location" : "dropoff_location")} 
            className="border-medical-secondary/30 focus:border-medical-secondary"
            ref={inputRef}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Floor/Room</Label>
            <Input 
              {...register(isOrigin ? "origin_floor_room" : "destination_floor_room")}
              className="border-medical-secondary/30 focus:border-medical-secondary"
            />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select onValueChange={(value) => register(isOrigin ? "origin_type" : "destination_type").onChange({ target: { value } })}>
              <SelectTrigger className="border-medical-secondary/30">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hospital">Hospital</SelectItem>
                <SelectItem value="nursing_home">Nursing Home</SelectItem>
                <SelectItem value="residence">Residence</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Address</Label>
          <Input 
            {...register(isOrigin ? "origin_address" : "destination_address")}
            className="border-medical-secondary/30 focus:border-medical-secondary"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>City</Label>
            <Input 
              {...register(isOrigin ? "origin_city" : "destination_city")}
              className="border-medical-secondary/30 focus:border-medical-secondary"
            />
          </div>
          <div className="space-y-2">
            <Label>State</Label>
            <Input 
              {...register(isOrigin ? "origin_state" : "destination_state")}
              className="border-medical-secondary/30 focus:border-medical-secondary"
            />
          </div>
          <div className="space-y-2">
            <Label>ZIP</Label>
            <Input 
              {...register(isOrigin ? "origin_zip" : "destination_zip")}
              className="border-medical-secondary/30 focus:border-medical-secondary"
            />
          </div>
          <div className="space-y-2">
            <Label>County</Label>
            <Input 
              {...register(isOrigin ? "origin_county" : "destination_county")}
              className="border-medical-secondary/30 focus:border-medical-secondary"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Phone Number</Label>
          <Input 
            {...register(isOrigin ? "origin_phone" : "destination_phone")}
            className="border-medical-secondary/30 focus:border-medical-secondary"
            placeholder="(XXX) XXX-XXXX"
          />
        </div>
        <Button 
          type="button"
          variant="outline"
          onClick={() => handleSaveFacility(type)}
          className="w-full mt-4 bg-medical-highlight text-medical-primary hover:bg-medical-highlight/90"
        >
          Save as New Facility
        </Button>
      </div>
    </Card>
  );
}
