
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

interface CrewMember {
  id: string;
  name: string;
  vehicle_type: string;
  current_location: string;
  experience_level: string;
  last_assignment: string | null;
  status: string;
}

interface CrewListProps {
  crews: CrewMember[];
  selectedCrew: CrewMember | null;
  onCrewSelect: (crew: CrewMember) => void;
  isLoading: boolean;
}

export function CrewList({ crews, selectedCrew, onCrewSelect, isLoading }: CrewListProps) {
  if (isLoading) {
    return <div className="text-center py-4">Loading available crews...</div>;
  }

  if (crews.length === 0) {
    return <div className="text-center py-4">No crews available at this time</div>;
  }

  return (
    <ScrollArea className="h-[300px] border rounded-lg p-4">
      <div className="space-y-2">
        {crews.map((crew) => (
          <div
            key={crew.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedCrew?.id === crew.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
            }`}
            onClick={() => onCrewSelect(crew)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium">{crew.name}</span>
              </div>
              <Badge variant="outline">
                {crew.vehicle_type}
              </Badge>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <div>Current Location: {crew.current_location}</div>
              <div>Experience Level: {crew.experience_level}</div>
              <div>Last Assignment: {crew.last_assignment ? new Date(crew.last_assignment).toLocaleString() : 'N/A'}</div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
