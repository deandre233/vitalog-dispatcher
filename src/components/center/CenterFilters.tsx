
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export interface FilterState {
  nameFilter: string;
  addressFilter: string;
  locationType: string;
  minDispatches: number;
  hideInactive: boolean;
  hideNonContract: boolean;
}

interface CenterFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function CenterFilters({ filters, onFiltersChange }: CenterFiltersProps) {
  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nameFilter">Name contains</Label>
        <Input
          id="nameFilter"
          value={filters.nameFilter}
          onChange={(e) => onFiltersChange({ ...filters, nameFilter: e.target.value })}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="addressFilter">Street address contains</Label>
        <Input
          id="addressFilter"
          value={filters.addressFilter}
          onChange={(e) => onFiltersChange({ ...filters, addressFilter: e.target.value })}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="locationType">Location type</Label>
        <Select
          value={filters.locationType}
          onValueChange={(value) => onFiltersChange({ ...filters, locationType: value })}>
          <SelectTrigger id="locationType">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="hospital">Hospital</SelectItem>
            <SelectItem value="clinic">Clinic</SelectItem>
            <SelectItem value="skilled_nursing">Skilled Nursing Facility (SNF)</SelectItem>
            <SelectItem value="urgent_care">Urgent Care</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="minDispatches">Minimum dispatches</Label>
        <Select
          value={filters.minDispatches.toString()}
          onValueChange={(value) => onFiltersChange({ ...filters, minDispatches: parseInt(value) })}>
          <SelectTrigger id="minDispatches">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 col-span-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="hideInactive"
            checked={filters.hideInactive}
            onCheckedChange={(checked) => 
              onFiltersChange({ ...filters, hideInactive: checked as boolean })
            }
          />
          <Label htmlFor="hideInactive">Hide inactive facilities</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="hideNonContract"
            checked={filters.hideNonContract}
            onCheckedChange={(checked) => 
              onFiltersChange({ ...filters, hideNonContract: checked as boolean })
            }
          />
          <Label htmlFor="hideNonContract">Hide non-contract facilities</Label>
        </div>
      </div>
    </Card>
  );
}
