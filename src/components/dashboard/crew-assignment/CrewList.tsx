
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { User, Brain, AlertTriangle, Timer } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CrewMember {
  id: string;
  name: string;
  vehicle_type: string;
  current_location: string;
  experience_level: string;
  last_assignment: string | null;
  status: string;
}

interface AIRecommendation {
  crewId: string;
  score: number;
  reasons: string[];
  trafficPrediction: {
    congestionLevel: "low" | "medium" | "high";
    estimatedDelay: number;
  };
  routeEfficiency: number;
}

interface CrewListProps {
  crews: CrewMember[];
  selectedCrew: CrewMember | null;
  onCrewSelect: (crew: CrewMember) => void;
  isLoading: boolean;
  aiRecommendations?: Record<string, AIRecommendation>;
}

export function CrewList({ crews, selectedCrew, onCrewSelect, isLoading, aiRecommendations = {} }: CrewListProps) {
  if (isLoading) {
    return <div className="text-center py-4">Loading available crews...</div>;
  }

  if (crews.length === 0) {
    return <div className="text-center py-4">No crews available at this time</div>;
  }

  const getTrafficBadgeColor = (level: "low" | "medium" | "high") => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <ScrollArea className="h-[300px] border rounded-lg p-4">
      <div className="space-y-2">
        {crews.map((crew) => {
          const aiRec = aiRecommendations[crew.id];
          const isRecommended = aiRec && 
            aiRec.score === Math.max(...Object.values(aiRecommendations).map(r => r.score));

          return (
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
                  {isRecommended && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Brain className="h-4 w-4 text-purple-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>AI Recommended Choice</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
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

              {aiRec && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-purple-500" />
                    <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500" 
                        style={{ width: `${aiRec.score}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{Math.round(aiRec.score)}% match</span>
                  </div>

                  <div className="flex gap-2">
                    <Badge 
                      variant="secondary"
                      className={`${getTrafficBadgeColor(aiRec.trafficPrediction.congestionLevel)}`}
                    >
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Traffic: {aiRec.trafficPrediction.congestionLevel}
                    </Badge>
                    
                    <Badge variant="secondary">
                      <Timer className="h-3 w-3 mr-1" />
                      ETA: {Math.round(aiRec.routeEfficiency)} min
                    </Badge>
                  </div>

                  {aiRec.reasons.length > 0 && (
                    <div className="text-xs text-gray-500 italic">
                      {aiRec.reasons[0]}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
