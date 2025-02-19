
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { analyzeDispatchEfficiency } from "@/utils/aiDispatchAnalytics";
import { predictTraffic, optimizeRoute } from "@/utils/aiDispatchOptimization";
import { CrewMember as AnalysisCrew } from "@/utils/crewRecommendation";

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

// Helper function to convert our CrewMember to the analysis format
const mapCrewToAnalysisFormat = (crew: CrewMember): AnalysisCrew => ({
  id: parseInt(crew.id),
  name: crew.name,
  certification: crew.experience_level,
  location: {
    // Convert location string to coordinates (mocked for now)
    lat: crew.current_location.includes('1') ? 33.7765 : 33.7795,
    lng: crew.current_location.includes('1') ? -84.3963 : -84.3921,
  },
  available: crew.status === 'available'
});

export function useCrewAssignment(transportId: string, patientId: string, isOpen: boolean) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [availableCrews, setAvailableCrews] = useState<CrewMember[]>([]);
  const [selectedCrew, setSelectedCrew] = useState<CrewMember | null>(null);
  const [aiRecommendations, setAiRecommendations] = useState<Record<string, AIRecommendation>>({});

  useEffect(() => {
    const fetchAvailableCrews = async () => {
      try {
        // Mock crew data since we don't have a crews table yet
        const mockCrews: CrewMember[] = [
          {
            id: '1',
            name: 'Crew A',
            vehicle_type: 'Ambulance',
            current_location: 'Station 1',
            experience_level: 'Senior',
            last_assignment: null,
            status: 'available'
          },
          {
            id: '2',
            name: 'Crew B',
            vehicle_type: 'Transport Van',
            current_location: 'Station 2',
            experience_level: 'Junior',
            last_assignment: null,
            status: 'available'
          }
        ];

        // Generate AI recommendations for each crew
        const recommendations: Record<string, AIRecommendation> = {};
        
        for (const crew of mockCrews) {
          // Convert crew to analysis format
          const analysisCrew = mapCrewToAnalysisFormat(crew);
          
          // Analyze dispatch efficiency
          const origin = { lat: 0, lng: 0 }; // Replace with actual coordinates
          const destination = { lat: 0, lng: 0 }; // Replace with actual coordinates
          
          const efficiency = analyzeDispatchEfficiency(origin, destination, analysisCrew);
          const traffic = predictTraffic(origin, destination, new Date());
          const route = optimizeRoute(origin, destination, new Date());

          recommendations[crew.id] = {
            crewId: crew.id,
            score: efficiency.efficiency,
            reasons: efficiency.suggestedActions,
            trafficPrediction: {
              congestionLevel: traffic.congestionLevel,
              estimatedDelay: traffic.predictedDelayMinutes
            },
            routeEfficiency: route.route.duration
          };
        }

        setAvailableCrews(mockCrews);
        setAiRecommendations(recommendations);

        // Auto-select the crew with the highest AI score if no crew is selected
        if (!selectedCrew) {
          const bestCrew = Object.values(recommendations)
            .sort((a, b) => b.score - a.score)[0];
          if (bestCrew) {
            const crew = mockCrews.find(c => c.id === bestCrew.crewId);
            if (crew) {
              setSelectedCrew(crew);
              toast({
                title: "AI Recommendation",
                description: `${crew.name} is recommended for this dispatch based on experience and current conditions.`,
              });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching crews:', error);
        toast({
          title: "Error",
          description: "Failed to load available crews",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchAvailableCrews();
    }
  }, [isOpen, selectedCrew, toast]);

  const handlePatientClick = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('legacy_display_id, id')
        .eq('id', patientId)
        .maybeSingle();

      if (error) throw error;

      if (data?.legacy_display_id) {
        navigate(`/patient/${data.legacy_display_id.toLowerCase()}`);
      } else if (data?.id) {
        navigate(`/patient/${data.id}`);
      } else {
        toast({
          title: "Error",
          description: "Patient profile not found",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching patient:', error);
      toast({
          title: "Error",
          description: "Failed to access patient profile",
          variant: "destructive",
      });
    }
  };

  const handleAssignCrew = async () => {
    if (!selectedCrew) {
      toast({
        title: "Error",
        description: "Please select a crew first",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('transport_records')
        .update({
          crew_assigned: selectedCrew.name,
          status: 'assigned',
          ai_metadata: {
            recommendation_score: aiRecommendations[selectedCrew.id]?.score,
            traffic_prediction: aiRecommendations[selectedCrew.id]?.trafficPrediction,
            route_efficiency: aiRecommendations[selectedCrew.id]?.routeEfficiency
          }
        })
        .eq('id', transportId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Crew assigned successfully",
      });

      return true;
    } catch (error) {
      console.error('Error assigning crew:', error);
      toast({
        title: "Error",
        description: "Failed to assign crew",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    isLoading,
    availableCrews,
    selectedCrew,
    setSelectedCrew,
    handlePatientClick,
    handleAssignCrew,
    aiRecommendations
  };
}
