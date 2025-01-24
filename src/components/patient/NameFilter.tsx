import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";

interface NameFilterProps {
  onFilterChange: (value: { type: string; query: string }) => void;
}

export function NameFilter({ onFilterChange }: NameFilterProps) {
  const [filterType, setFilterType] = React.useState("begins_with");
  const [nameQuery, setNameQuery] = React.useState("");

  const handleTypeChange = (value: string) => {
    setFilterType(value);
    onFilterChange({ type: value, query: nameQuery });
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameQuery(e.target.value);
    onFilterChange({ type: filterType, query: e.target.value });
  };

  return (
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
  );
}