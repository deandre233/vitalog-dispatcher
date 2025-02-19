
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CrewMember {
  id: string;
  name: string;
  vehicle_type: string;
  current_location: string;
  experience_level: string;
  last_assignment: string | null;
  status: string;
}

export function useCrewAssignment(transportId: string, patientId: string, isOpen: boolean) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [availableCrews, setAvailableCrews] = useState<CrewMember[]>([]);
  const [selectedCrew, setSelectedCrew] = useState<CrewMember | null>(null);

  useEffect(() => {
    const fetchAvailableCrews = async () => {
      try {
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
        setAvailableCrews(mockCrews);
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
  }, [isOpen, toast]);

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
      return;
    }

    try {
      const { error } = await supabase
        .from('transport_records')
        .update({
          crew_assigned: selectedCrew.name,
          status: 'assigned'
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
    handleAssignCrew
  };
}
