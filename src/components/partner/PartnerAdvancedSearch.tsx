import React from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface PartnerAdvancedSearchProps {
  onNameFilterChange: (value: { type: string; query: string }) => void;
  onHideInactiveChange: (checked: boolean) => void;
  hideInactive: boolean;
}

export function PartnerAdvancedSearch({
  onNameFilterChange,
  onHideInactiveChange,
  hideInactive
}: PartnerAdvancedSearchProps) {
  const [filterType, setFilterType] = React.useState("contains");
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
    <Card className="p-4 space-y-4 mb-4">
      <div className="space-y-2">
        <Label>Partner name:</Label>
        <div className="flex gap-4">
          <RadioGroup
            defaultValue="contains"
            onValueChange={handleTypeChange}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="contains" id="contains" />
              <Label htmlFor="contains">contains</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="starts_with" id="starts_with" />
              <Label htmlFor="starts_with">starts with</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="exact_match" id="exact_match" />
              <Label htmlFor="exact_match">exact match</Label>
            </div>
          </RadioGroup>
          <Input
            type="text"
            placeholder="Enter partner name"
            value={nameQuery}
            onChange={handleQueryChange}
            className="w-64"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="hideInactive"
          checked={hideInactive}
          onCheckedChange={onHideInactiveChange}
        />
        <Label htmlFor="hideInactive">Hide inactive partners</Label>
      </div>
    </Card>
  );
}