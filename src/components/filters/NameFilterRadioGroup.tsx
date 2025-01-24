import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export type NameFilterType = "begins_with" | "sounds_like" | "exact";

interface NameFilterRadioGroupProps {
  value: NameFilterType;
  onChange: (value: NameFilterType) => void;
}

export function NameFilterRadioGroup({ value, onChange }: NameFilterRadioGroupProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(val) => onChange(val as NameFilterType)}
      className="flex items-center space-x-4"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="begins_with" id="begins_with" />
        <Label htmlFor="begins_with">Begins with</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="sounds_like" id="sounds_like" />
        <Label htmlFor="sounds_like">Sounds like</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="exact" id="exact" />
        <Label htmlFor="exact">Is exactly</Label>
      </div>
    </RadioGroup>
  );
}