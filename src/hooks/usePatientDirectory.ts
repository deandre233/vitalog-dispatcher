
import { useState, useCallback } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";

type Patient = Tables<"patients">;

export function usePatientDirectory() {
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [hideInactive, setHideInactive] = useState(false);
  const [hideNotSeen, setHideNotSeen] = useState(false);
  const [hideAnonymous, setHideAnonymous] = useState(false);
  
  const { data: patients, isLoading, error } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      console.log('Fetching patients...');
      const { data, error } = await supabase
        .from('patients')
        .select(`
          *,
          medical_records (*),
          insurance_policies (*),
          appointments (*)
        `)
        .order('last_name', { ascending: true });

      if (error) {
        console.error('Error fetching patients:', error);
        toast.error('Failed to load patients');
        throw error;
      }

      console.log('Fetched patients:', data);
      return data || [];
    }
  });

  const handleNameFilter = useCallback(({ type, query }: { type: string; query: string }) => {
    if (!patients) return;
    
    const filtered = patients.filter(patient => {
      if (!query) return true;
      
      const lastName = patient.last_name.toLowerCase();
      const searchQuery = query.toLowerCase();
      
      switch (type) {
        case 'begins_with':
          return lastName.startsWith(searchQuery);
        case 'sounds_like':
          // Simple phonetic matching - you might want to use a proper phonetic algorithm
          return lastName.includes(searchQuery);
        case 'is_exactly':
          return lastName === searchQuery;
        default:
          return true;
      }
    });
    
    setFilteredPatients(filtered);
  }, [patients]);

  const displayedPatients = filteredPatients.length > 0 ? filteredPatients : (patients || []);

  return {
    patients,
    displayedPatients,
    isLoading,
    error,
    handleNameFilter,
    hideInactive,
    setHideInactive,
    hideNotSeen,
    setHideNotSeen,
    hideAnonymous,
    setHideAnonymous
  };
}

export default usePatientDirectory;
