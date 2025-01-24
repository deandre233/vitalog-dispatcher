import React from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface PatientFiltersProps {
  onNameFilterChange: (value: { type: string; query: string }) => void;
  onHideInactiveChange: (checked: boolean) => void;
  onHideNotSeenChange: (checked: boolean) => void;
  onHideAnonymousChange: (checked: boolean) => void;
  hideInactive: boolean;
  hideNotSeen: boolean;
  hideAnonymous: boolean;
}

export function PatientFilters({
  onNameFilterChange,
  onHideInactiveChange,
  onHideNotSeenChange,
  onHideAnonymousChange,
  hideInactive,
  hideNotSeen,
  hideAnonymous
}: PatientFiltersProps) {
  const [filterType, setFilterType] = React.useState("begins_with");
  const [nameQuery, setNameQuery] = React.useState("");

  const handleTypeChange = (value: string) => {
    setFilterType(value);
    onNameFilterChange({ type: value, query: nameQuery });
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameQuery(e.target.value);
    onNameFilterChange({ type: filterType, query: e.target.value });
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 space-y-4">
        <div className="space-y-2">
          <Label>Last name:</Label>
          <div className="flex gap-4">
            <RadioGroup
              defaultValue="begins_with"
              onValueChange={handleTypeChange}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="begins_with" id="begins_with" />
                <Label htmlFor="begins_with">begins with</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sounds_like" id="sounds_like" />
                <Label htmlFor="sounds_like">sounds like</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="is_exactly" id="is_exactly" />
                <Label htmlFor="is_exactly">is exactly</Label>
              </div>
            </RadioGroup>
            <Input
              type="text"
              placeholder="Enter last name"
              value={nameQuery}
              onChange={handleQueryChange}
              className="w-64"
            />
          </div>
        </div>
      </Card>

      <Card className="p-4 space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="hideInactive"
            checked={hideInactive}
            onCheckedChange={onHideInactiveChange}
          />
          <Label htmlFor="hideInactive">Hide patients marked inactive or deceased</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="hideNotSeen"
            checked={hideNotSeen}
            onCheckedChange={onHideNotSeenChange}
          />
          <Label htmlFor="hideNotSeen">Hide patients not seen in the past year</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="hideAnonymous"
            checked={hideAnonymous}
            onCheckedChange={onHideAnonymousChange}
          />
          <Label htmlFor="hideAnonymous">Hide anonymous records, where no last name is on file</Label>
        </div>
      </Card>
    </div>
  );
}